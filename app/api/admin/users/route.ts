import { NextRequest } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/admin/users — list all users with filters
// PUT /api/admin/users — suspend, activate or delete user

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null

  const profile = await prisma.profiles.findUnique({
    where:  { id: user.id },
    select: { role: true },
  })

  if (profile?.role !== 'admin') return null
  return user
}

export async function GET(req: NextRequest) {
  try {
    // ─── 1. Verify admin ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const role       = searchParams.get('role')       || ''   // aspirant, agency, admin
    const status     = searchParams.get('status')     || ''   // active, suspended
    const keyword    = searchParams.get('keyword')    || ''
    const verified   = searchParams.get('verified')   || ''
    const page       = parseInt(searchParams.get('page')  || '1')
    const limit      = parseInt(searchParams.get('limit') || '20')
    const skip       = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (role)    where.role      = role
    if (keyword) where.OR = [
      { name:           { contains: keyword, mode: 'insensitive' } },
      { email:          { contains: keyword, mode: 'insensitive' } },
      { profile_number: { contains: keyword, mode: 'insensitive' } },
    ]
    if (status === 'active')    where.is_active = true
    if (status === 'suspended') where.is_active = false
    if (verified === 'true')  where.email_verified = true
    if (verified === 'false') where.email_verified = false

    const [users, total] = await Promise.all([
      prisma.profiles.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { created_at: 'desc' },
        select: {
          id:             true,
          name:           true,
          email:          true,
          phone:          true,
          role:           true,
          profile_number: true,
          email_verified: true,
          phone_verified: true,
          is_active:      true,
          last_login_at:  true,
          created_at:     true,
          aspirant_profiles: {
            select: {
              verification_status: true,
              profile_completion:  true,
              trust_score:         true,
              category:            true,
            },
          },
          agency_profiles: {
            select: {
              company_name:        true,
              verification_status: true,
              trust_score:         true,
            },
          },
          subscriptions: {
            where:   { status: 'active' },
            take:    1,
            select:  { plan_name: true, ends_at: true },
          },
        },
      }),
      prisma.profiles.count({ where }),
    ])

    // ─── Platform stats ───────────────────────────────────────
    const [
      totalAspirants,
      totalAgencies,
      totalActive,
      totalSuspended,
      totalVerified,
    ] = await Promise.all([
      prisma.profiles.count({ where: { role: 'aspirant' } }),
      prisma.profiles.count({ where: { role: 'agency'   } }),
      prisma.profiles.count({ where: { is_active: true  } }),
      prisma.profiles.count({ where: { is_active: false } }),
      prisma.profiles.count({ where: { email_verified: true } }),
    ])

    return successResponse({
      users,
      stats: {
        total_aspirants: totalAspirants,
        total_agencies:  totalAgencies,
        total_active:    totalActive,
        total_suspended: totalSuspended,
        total_verified:  totalVerified,
      },
      pagination: {
        page, limit, total,
        total_pages: Math.ceil(total / limit),
      },
    })
  } catch (error: unknown) {
    console.error('[ADMIN GET USERS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    // ─── 1. Verify admin ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { user_id, action, reason } = body

    if (!user_id || !action) {
      return errorResponse('user_id and action are required', 400)
    }

    const validActions = ['suspend', 'activate', 'delete', 'reset_password']
    if (!validActions.includes(action)) {
      return errorResponse(`Action must be one of: ${validActions.join(', ')}`, 400)
    }

    const targetUser = await prisma.profiles.findUnique({
      where:  { id: user_id },
      select: { id: true, email: true, role: true, name: true },
    })

    if (!targetUser) return errorResponse('User not found', 404)

    // Prevent admin from suspending another admin
    if (targetUser.role === 'admin') {
      return errorResponse('Admin accounts cannot be modified this way', 403)
    }

    switch (action) {
      case 'suspend':
        await prisma.profiles.update({
          where: { id: user_id },
          data:  { is_active: false },
        })
        await supabaseAdmin.auth.admin.updateUserById(user_id, {
          ban_duration: 'none', // Supabase doesn't have direct ban but we track in DB
        })
        // Notify user
        await prisma.notifications.create({
          data: {
            user_id,
            type:    'system_announcement',
            title:   'Account Suspended',
            message: reason || 'Your account has been suspended. Please contact support.',
            action_url: '/contact',
          },
        })
        break

      case 'activate':
        await prisma.profiles.update({
          where: { id: user_id },
          data:  { is_active: true },
        })
        await prisma.notifications.create({
          data: {
            user_id,
            type:    'system_announcement',
            title:   'Account Activated',
            message: 'Your account has been reactivated. Welcome back!',
            action_url: '/dashboard',
          },
        })
        break

      case 'delete':
        // Soft delete — deactivate and anonymise
        await prisma.profiles.update({
          where: { id: user_id },
          data: {
            is_active: false,
            email:     `deleted_${user_id}@silverscreens.deleted`,
            name:      'Deleted User',
          },
        })
        await supabaseAdmin.auth.admin.deleteUser(user_id)
        break

      case 'reset_password':
        await supabaseAdmin.auth.admin.generateLink({
          type:  'recovery',
          email: targetUser.email,
        })
        break
    }

    // ─── Log admin action ─────────────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     admin.id,
        action:      `ADMIN_${action.toUpperCase()}_USER`,
        entity_type: 'profiles',
        entity_id:   user_id,
        new_values:  { action, reason, target_user: targetUser.email },
        ip_address:  req.headers.get('x-forwarded-for') || undefined,
      },
    })

    return successResponse({
      message: `User ${action} completed successfully`,
    })
  } catch (error: unknown) {
    console.error('[ADMIN UPDATE USER ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}