import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/admin/verification — list pending profiles
// PUT /api/admin/verification — approve or reject a profile

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  const profile = await prisma.profiles.findUnique({
    where: { id: user.id }, select: { role: true },
  })
  if (profile?.role !== 'admin') return null
  return user
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const type   = searchParams.get('type')   || 'all'  // aspirant, agency, all
    const status = searchParams.get('status') || 'pending'
    const page   = parseInt(searchParams.get('page')  || '1')
    const limit  = parseInt(searchParams.get('limit') || '20')
    const skip   = (page - 1) * limit

    let aspirants: unknown[] = []
    let agencies:  unknown[] = []

    if (type === 'all' || type === 'aspirant') {
      aspirants = await prisma.aspirant_profiles.findMany({
        where:   { verification_status: status },
        skip,
        take:    limit,
        orderBy: { updated_at: 'desc' },
        include: {
          profiles: {
            select: {
              name:       true,
              email:      true,
              phone:      true,
              created_at: true,
              subscriptions: {
                where:  { status: 'active' },
                take:   1,
                select: { plan_name: true },
              },
            },
          },
          aspirant_media: {
            take:    5,
            select:  { url: true, type: true, is_primary: true },
          },
        },
      })
    }

    if (type === 'all' || type === 'agency') {
      agencies = await prisma.agency_profiles.findMany({
        where:   { verification_status: status },
        skip,
        take:    limit,
        orderBy: { updated_at: 'desc' },
        include: {
          profiles: {
            select: {
              name:       true,
              email:      true,
              phone:      true,
              created_at: true,
              subscriptions: {
                where:  { status: 'active' },
                take:   1,
                select: { plan_name: true },
              },
            },
          },
        },
      })
    }

    const [pendingAspirantsCount, pendingAgenciesCount] = await Promise.all([
      prisma.aspirant_profiles.count({ where: { verification_status: 'pending' } }),
      prisma.agency_profiles.count({   where: { verification_status: 'pending' } }),
    ])

    return successResponse({
      aspirants,
      agencies,
      pending_counts: {
        aspirants: pendingAspirantsCount,
        agencies:  pendingAgenciesCount,
        total:     pendingAspirantsCount + pendingAgenciesCount,
      },
    })
  } catch (error: unknown) {
    console.error('[ADMIN GET VERIFICATION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { profile_id, profile_type, action, rejection_reason } = body

    if (!profile_id || !profile_type || !action) {
      return errorResponse('profile_id, profile_type and action are required', 400)
    }

    if (!['approve', 'reject', 'request_info'].includes(action)) {
      return errorResponse('Action must be approve, reject or request_info', 400)
    }

    if (!['aspirant', 'agency'].includes(profile_type)) {
      return errorResponse('profile_type must be aspirant or agency', 400)
    }

    const newStatus = action === 'approve' ? 'approved'
                    : action === 'reject'   ? 'rejected'
                    : 'pending'

    let userId: string | null = null

    if (profile_type === 'aspirant') {
      const updated = await prisma.aspirant_profiles.update({
        where: { id: profile_id },
        data: {
          verification_status: newStatus,
          verified_at:         action === 'approve' ? new Date() : null,
        },
        select: { user_id: true, first_name: true },
      })
      userId = updated.user_id
    } else {
      const updated = await prisma.agency_profiles.update({
        where: { id: profile_id },
        data: {
          verification_status: newStatus,
          verified_at:         action === 'approve' ? new Date() : null,
        },
        select: { user_id: true, company_name: true },
      })
      userId = updated.user_id
    }

    // ─── Notify the user ──────────────────────────────────────
    const notificationMap: Record<string, { title: string; message: string; url: string }> = {
      approve: {
        title:   '✅ Profile Verified!',
        message: 'Congratulations! Your profile has been verified by SilverScreens. You are now live on the platform.',
        url:     '/dashboard',
      },
      reject: {
        title:   'Profile Verification Update',
        message: rejection_reason || 'Your profile was not approved. Please review and resubmit.',
        url:     '/dashboard/profile',
      },
      request_info: {
        title:   'Additional Information Required',
        message: rejection_reason || 'Our team requires additional information to verify your profile. Please update and resubmit.',
        url:     '/dashboard/profile',
      },
    }

    if (userId) {
      const notif = notificationMap[action]
      await prisma.notifications.create({
        data: {
          user_id:    userId,
          type:       'profile_verified',
          title:      notif.title,
          message:    notif.message,
          action_url: notif.url,
        },
      })
    }

    // ─── Log admin action ─────────────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     admin.id,
        action:      `ADMIN_VERIFICATION_${action.toUpperCase()}`,
        entity_type: `${profile_type}_profiles`,
        entity_id:   profile_id,
        new_values:  { action, newStatus, rejection_reason },
      },
    })

    return successResponse({
      message: `Profile ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'flagged for more info'} successfully`,
      new_status: newStatus,
    })
  } catch (error: unknown) {
    console.error('[ADMIN VERIFICATION ACTION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}