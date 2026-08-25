export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const profile = await prisma.profiles.findUnique({
    where: { id: user.id }, select: { role: true },
  })
  if (profile?.role !== 'admin') return null
  return user
}

async function getStats() {
  const [
    totalAspirants,
    totalAgencies,
    totalActive,
    totalSuspended,
    aspVerified,
    agVerified,
  ] = await Promise.all([
    prisma.aspirant_profiles.count(),
    prisma.profiles.count({ where: { role: 'agency' } }),
    prisma.profiles.count({
      where: {
        is_active: true,
        role: { not: 'admin' },
        NOT: { email: { contains: '@silverscreens.deleted' } },
      },
    }),
    prisma.profiles.count({
      where: {
        is_active: false,
        role: { not: 'admin' },
        NOT: { email: { contains: '@silverscreens.deleted' } },
      },
    }),
    prisma.aspirant_profiles.count({ where: { verification_status: 'approved' } }),
    prisma.agency_profiles.count({ where: { verification_status: 'approved' } }),
  ])
  return {
    total_aspirants: totalAspirants,
    total_agencies:  totalAgencies,
    total_active:    totalActive,
    total_suspended: totalSuspended,
    total_verified:  aspVerified + agVerified,
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const userId    = searchParams.get('user_id')  || ''
    const role      = searchParams.get('role')     || ''
    const status    = searchParams.get('status')   || ''
    const keyword   = searchParams.get('keyword')  || ''
    const verStatus = searchParams.get('verified') || ''
    const page      = Math.max(1, parseInt(searchParams.get('page')  || '1'))
    const limit     = Math.min(50, parseInt(searchParams.get('limit') || '20'))
    const skip      = (page - 1) * limit

    // ── Single user lookup ────────────────────────────────────
    if (userId) {
      const user = await prisma.profiles.findUnique({
        where: { id: userId },
        select: {
          id: true, name: true, email: true, phone: true, role: true,
          profile_number: true, email_verified: true, is_active: true,
          last_login_at: true, created_at: true,
          aspirant_profiles: {
            select: {
              id: true, verification_status: true, profile_completion: true,
              trust_score: true, category: true, date_of_birth: true,
              gender: true, city: true, state: true, height_cm: true,
              weight_kg: true, about_me: true, languages: true,
              availability: true, skills: true, body_type: true,
              body_tone: true, eye_color: true, hair_color: true,
              chest_size: true, waist_size: true, hip_size: true,
              shoe_size: true, profile_image_url: true,
              experience_level: true, social_links: true,
              aspirant_media: {
                select: { id: true, url: true, type: true, is_primary: true,
                  order_index: true, moderation_status: true, rejection_reason: true },
              },
            },
          },
          agency_profiles: {
            select: {
              company_name: true, verification_status: true, trust_score: true,
              company_description: true, city: true, state: true,
              website_url: true, logo_url: true, address_line1: true,
              address_line2: true, pincode: true, show_phone: true,
              show_email: true, profile_views: true,
            },
          },
          subscriptions: {
            where: { status: 'active' },
            select: { plan_name: true, ends_at: true, status: true },
          },
        },
      })
      if (!user) return errorResponse('User not found', 404)
      return successResponse({ user })
    }

    // ── Build where clause ────────────────────────────────────
    const where: any = {
      role: { not: 'admin' },
      NOT: { email: { contains: '@silverscreens.deleted' } },
    }

    if (role)                   where.role      = role
    if (status === 'active')    where.is_active = true
    if (status === 'suspended') where.is_active = false

    if (keyword) {
      where.OR = [
        { name:           { contains: keyword, mode: 'insensitive' } },
        { email:          { contains: keyword, mode: 'insensitive' } },
        { profile_number: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    // Verification status filter — find matching user IDs first
    if (verStatus) {
      const aspIds = (!role || role === 'aspirant')
        ? (await prisma.aspirant_profiles.findMany({
            where: { verification_status: verStatus as any },
            select: { user_id: true },
          })).map((r: any) => r.user_id)
        : []

      const agIds = (!role || role === 'agency')
        ? (await prisma.agency_profiles.findMany({
            where: { verification_status: verStatus as any },
            select: { user_id: true },
          })).map((r: any) => r.user_id)
        : []

      const ids = [...new Set([...aspIds, ...agIds])]
      if (ids.length === 0) {
        return successResponse({
          users: [], stats: await getStats(),
          pagination: { page, limit, total: 0, total_pages: 0 },
        })
      }
      where.id = { in: ids }
    }

    // Only show aspirants who have a profile row (exclude bare signups)
    if (!role || role === 'aspirant') {
      const submittedIds = (await prisma.aspirant_profiles.findMany({
        select: { user_id: true },
      })).map((r: any) => r.user_id)

      if (role === 'aspirant') {
        // Pure aspirant query — must have profile
        const existing = where.id?.in ?? submittedIds
        where.id = { in: existing.filter((id: string) => submittedIds.includes(id)) }
      } else {
        // Mixed — include agencies + submitted aspirants only
        const agencyIds = (await prisma.profiles.findMany({
          where: { role: 'agency' }, select: { id: true },
        })).map((r: any) => r.id)
        const allIds = [...new Set([...submittedIds, ...agencyIds])]
        const existing = where.id?.in
        where.id = { in: existing ? allIds.filter((id: string) => existing.includes(id)) : allIds }
      }
    }

    // ── Execute query ─────────────────────────────────────────
    const [users, total] = await Promise.all([
      prisma.profiles.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true, name: true, email: true, phone: true, role: true,
          profile_number: true, email_verified: true, is_active: true,
          last_login_at: true, created_at: true,
          aspirant_profiles: {
            select: { verification_status: true, profile_completion: true,
              trust_score: true, category: true, profile_number: true },
          },
          agency_profiles: {
            select: { id: true, company_name: true, verification_status: true,
              trust_score: true, profile_number: true },
          },
          subscriptions: {
            where: { status: 'active' },
            select: { plan_name: true, ends_at: true, status: true },
          },
        },
      }),
      prisma.profiles.count({ where }),
    ])

    return successResponse({
      users,
      stats: await getStats(),
      pagination: {
        page, limit, total,
        total_pages: Math.ceil(total / limit),
      },
    })

  } catch (err: unknown) {
    console.error('[ADMIN GET USERS ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { user_id, action, reason } = body

    if (!user_id || !action) return errorResponse('user_id and action are required', 400)

    const validActions = ['suspend', 'activate', 'delete', 'reset_password', 'edit']
    if (!validActions.includes(action)) return errorResponse('Invalid action', 400)

    const targetUser = await prisma.profiles.findUnique({
      where: { id: user_id }, select: { id: true, email: true, role: true, name: true },
    })
    if (!targetUser) return errorResponse('User not found', 404)
    if (targetUser.role === 'admin') return errorResponse('Admin accounts cannot be modified this way', 403)

    if (action === 'suspend') {
      await prisma.profiles.update({ where: { id: user_id }, data: { is_active: false } })
      await prisma.notifications.create({
        data: {
          user_id, type: 'system_announcement',
          title: 'Account Suspended',
          message: reason || 'Your account has been suspended. Please contact support.',
          action_url: '/contact',
        },
      })
    }

    if (action === 'activate') {
      await prisma.profiles.update({ where: { id: user_id }, data: { is_active: true } })
      // Only send notification if not a deleted account
      if (!targetUser.email?.includes('@silverscreens.deleted')) {
        await prisma.notifications.create({
          data: {
            user_id, type: 'system_announcement',
            title: 'Account Activated',
            message: 'Your account has been reactivated. Welcome back!',
            action_url: '/dashboard',
          },
        })
      }
    }

    if (action === 'delete') {
      await prisma.notifications.deleteMany({ where: { user_id } })
      await prisma.messages.deleteMany({ where: { sender_id: user_id } })
      await prisma.reports.deleteMany({ where: { reported_by: user_id } })
      await prisma.support_tickets.deleteMany({ where: { user_id } })
      await prisma.payment_transactions.deleteMany({ where: { user_id } })
      await prisma.subscriptions.deleteMany({ where: { user_id } })

      const aspirantProfile = await prisma.aspirant_profiles.findFirst({
        where: { user_id }, select: { id: true },
      })
      if (aspirantProfile) {
        await prisma.aspirant_media.deleteMany({ where: { aspirant_id: aspirantProfile.id } })
        await prisma.applications.deleteMany({ where: { aspirant_id: aspirantProfile.id } })
        await prisma.auditions.deleteMany({ where: { aspirant_id: aspirantProfile.id } })
        await prisma.aspirant_profiles.deleteMany({ where: { user_id } })
      }

      const agencyProfile = await prisma.agency_profiles.findFirst({
        where: { user_id }, select: { id: true },
      })
      if (agencyProfile) {
        await prisma.casting_calls.deleteMany({ where: { agency_id: agencyProfile.id } })
        await prisma.agency_profiles.deleteMany({ where: { user_id } })
      }

      await prisma.profiles.delete({ where: { id: user_id } })

      try { await supabaseAdmin.auth.admin.deleteUser(user_id) } catch {}
    }

    if (action === 'reset_password') {
      if (targetUser.email?.includes('@silverscreens.deleted')) {
        return errorResponse('Cannot reset password for a deleted account', 400)
      }
      await supabaseAdmin.auth.admin.generateLink({ type: 'recovery', email: targetUser.email! })
    }

    if (action === 'edit') {
      const { name, phone } = body
      const updateData: Record<string, any> = {}
      if (name)  updateData.name  = name
      if (phone) updateData.phone = phone
      if (Object.keys(updateData).length === 0) return errorResponse('Nothing to update', 400)
      await prisma.profiles.update({ where: { id: user_id }, data: updateData })
    }

    // Audit log
    try {
      await prisma.audit_logs.create({
        data: {
          user_id:     admin.id,
          action:      `admin_${action}_user`,
          entity_type: 'profiles',
          entity_id:   user_id,
          ip_address:  req.headers.get('x-forwarded-for') || null,
          created_at:  new Date(),
        },
      })
    } catch {}

    return successResponse({ message: `User ${action} completed successfully` })

  } catch (err: unknown) {
    console.error('[ADMIN UPDATE USER ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
