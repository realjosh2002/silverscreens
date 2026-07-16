import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/reports — user submits a report/complaint

export async function POST(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const {
      reported_user_id,
      reported_entity_type,  // 'user', 'casting_call', 'message'
      reported_entity_id,
      reason,
      description,
    } = body

    if (!reported_entity_type || !reason) {
      return errorResponse('Entity type and reason are required', 400)
    }

    const validReasons = [
      'fake_profile', 'scam_casting', 'harassment',
      'inappropriate_content', 'spam', 'fraud',
      'impersonation', 'copyright_violation', 'other',
    ]

    if (!validReasons.includes(reason)) {
      return errorResponse(`Reason must be one of: ${validReasons.join(', ')}`, 400)
    }

    // ─── 2. Prevent self-reporting ────────────────────────────
    if (reported_user_id === user.id) {
      return errorResponse('You cannot report yourself', 400)
    }

    // ─── 3. Check not duplicate report ────────────────────────
    if (reported_entity_id) {
      const existing = await prisma.reports.findFirst({
        where: {
          reporter_id:         user.id,
          reported_entity_id,
          reported_entity_type,
          status:              { not: 'resolved' },
        },
      })
      if (existing) {
        return errorResponse('You have already reported this. Our team is reviewing it.', 409)
      }
    }

    // ─── 4. Create report ─────────────────────────────────────
    const report = await prisma.reports.create({
      data: {
        reporter_id:          user.id,
        reported_user_id:     reported_user_id || null,
        reported_entity_type,
        reported_entity_id:   reported_entity_id || null,
        reason,
        description:          description || '',
        status:               'pending',
      },
    })

    // ─── 5. Notify admin via notification ─────────────────────
    const adminProfiles = await prisma.profiles.findMany({
      where:  { role: 'admin', is_active: true },
      select: { id: true },
      take:   1,
    })

    if (adminProfiles.length > 0) {
      await prisma.notifications.create({
        data: {
          user_id:    adminProfiles[0].id,
          type:       'system_announcement',
          title:      '⚠️ New Report Submitted',
          message:    `A new report has been submitted for ${reported_entity_type}. Reason: ${reason}`,
          action_url: '/admin/reports',
        },
      })
    }

    return successResponse({
      message:   'Report submitted successfully. Our team will review it within 24-48 hours.',
      report_id: report.id,
    }, 201)
  } catch (error: unknown) {
    console.error('[SUBMIT REPORT ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

// PUT /api/reports — admin resolves a report
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // Verify admin
    const profile = await prisma.profiles.findUnique({
      where: { id: user.id }, select: { role: true },
    })
    if (profile?.role !== 'admin') return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { report_id, action, admin_note, trust_score_deduction = 10 } = body

    if (!report_id || !action) {
      return errorResponse('report_id and action are required', 400)
    }

    const validActions = ['resolve', 'dismiss', 'escalate']
    if (!validActions.includes(action)) {
      return errorResponse(`Action must be one of: ${validActions.join(', ')}`, 400)
    }

    const report = await prisma.reports.findUnique({
      where: { id: report_id },
    })

    if (!report) return errorResponse('Report not found', 404)

    const newStatus = action === 'resolve'  ? 'resolved'
                    : action === 'dismiss'  ? 'dismissed'
                    : 'escalated'

    // ─── Update report ────────────────────────────────────────
    await prisma.reports.update({
      where: { id: report_id },
      data: {
        status:       newStatus,
        admin_action: admin_note || action,
        resolved_at:  new Date(),
        resolved_by:  user.id,
      },
    })

    // ─── Deduct trust score on resolution ─────────────────────
    if (action === 'resolve' && report.reported_user_id) {
      const reportedProfile = await prisma.profiles.findUnique({
        where:  { id: report.reported_user_id },
        select: { role: true },
      })

      if (reportedProfile?.role === 'aspirant') {
        await prisma.aspirant_profiles.updateMany({
          where: { user_id: report.reported_user_id },
          data: {
            trust_score: { decrement: trust_score_deduction },
          },
        })
      } else if (reportedProfile?.role === 'agency') {
        await prisma.agency_profiles.updateMany({
          where: { user_id: report.reported_user_id },
          data: {
            trust_score: { decrement: trust_score_deduction },
          },
        })
      }

      // Notify reported user
      await prisma.notifications.create({
        data: {
          user_id:    report.reported_user_id,
          type:       'system_announcement',
          title:      'Account Warning',
          message:    'A report against your account has been reviewed and actioned. Repeated violations may result in suspension.',
          action_url: '/support',
        },
      })
    }

    return successResponse({ message: `Report ${action}d successfully` })
  } catch (error: unknown) {
    console.error('[RESOLVE REPORT ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}