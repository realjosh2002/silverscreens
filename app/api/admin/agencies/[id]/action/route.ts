export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// ─── Auth helper ─────────────────────────────────────────────────
async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const profile = await prisma.profiles.findUnique({
    where:  { id: user.id },
    select: { role: true },
  })
  if (profile?.role !== 'admin') return null
  return user
}

// ─── POST /api/admin/agencies/[id]/action ────────────────────────
// Actions: approve | reject | suspend | activate | request_info
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { id: agencyId } = await params
    if (!agencyId) return errorResponse('Agency ID is required', 400)

    const body = await req.json()
    const { action, reason, note } = body

    if (!action) return errorResponse('action is required', 400)

    const validActions = ['approve', 'reject', 'suspend', 'activate', 'request_info']
    if (!validActions.includes(action)) {
      return errorResponse(`action must be one of: ${validActions.join(', ')}`, 400)
    }

    // ── Fetch agency to get user_id ───────────────────────────────
    const agency = await prisma.agency_profiles.findUnique({
      where:  { id: agencyId },
      select: {
        id:           true,
        company_name: true,
        profiles:     { select: { id: true } },
      },
    })
    if (!agency) return errorResponse('Agency not found', 404)

    const userId: string | null = (agency.profiles as any)?.id ?? null

    // ── Map action to DB status ───────────────────────────────────
    const statusMap: Record<string, string> = {
      approve:      'approved',
      reject:       'rejected',
      suspend:      'suspended',
      activate:     'approved',
      request_info: 'pending',
    }
    const newStatus = statusMap[action]

    // ── Update agency_profiles ────────────────────────────────────
    await prisma.agency_profiles.update({
      where: { id: agencyId },
      data:  { verification_status: newStatus as any, updated_at: new Date() },
    })

    // ── Notification messages ─────────────────────────────────────
    const notifMap: Record<string, { title: string; message: string }> = {
      approve: {
        title:   'Agency Profile Approved! 🎉',
        message: 'Your agency has been verified. You can now post casting calls and access all platform features.',
      },
      reject: {
        title:   'Agency Verification Update',
        message: `Your agency verification was not approved. Reason: ${reason ?? 'Please contact support for more information.'}`,
      },
      suspend: {
        title:   'Account Suspended',
        message: 'Your agency account has been suspended. Please contact support for assistance.',
      },
      activate: {
        title:   'Account Reactivated',
        message: 'Your agency account has been reactivated. You can now access all platform features.',
      },
      request_info: {
        title:   'Additional Information Required',
        message: `Our verification team requires additional information before approving your agency. ${note ?? 'Please upload the required documents.'}`,
      },
    }

    // ── Send notification ─────────────────────────────────────────
    if (userId) {
      await (prisma as any).notifications.create({
        data: {
          user_id:    userId,
          title:      notifMap[action].title,
          message:    notifMap[action].message,
          type:       'system_announcement',
          action_url: '/agency/settings',
          is_read:    false,
          created_at: new Date(),
        },
      }).catch(() => {})
    }

    // ── Audit log ─────────────────────────────────────────────────
try {
      await supabaseAdmin.from('audit_logs').insert({
        user_id:     admin.id,
        action:      `AGENCY_${action.toUpperCase()}`,
        entity_type: 'agency_profiles',
        entity_id:   agencyId,
        new_values:  {
          status: newStatus,
          agency: agency.company_name,
          reason: reason ?? null,
          note:   note ?? null,
        },
      })
    } catch {}

    return successResponse({
      message: `Agency ${action}d successfully.`,
      data:    { id: agencyId, status: newStatus },
    })
  } catch (error: unknown) {
    console.error('[POST AGENCY ACTION ERROR]', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500,
    )
  }
}