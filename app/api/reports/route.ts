import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/reports — user submits a report/complaint

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const {
      reported_user_id,
      reported_entity_type,
      reported_entity_id,
      reason,
      description,
    } = body

    if (!reason) return errorResponse('Reason is required', 400)

    // Resolve reported_user_id — must be a valid profiles.id (auth UUID)
    // For casting call reports, look up the agency's auth UUID from the casting call
    let resolvedReportedUserId: string | null = reported_user_id || null
    if (!resolvedReportedUserId && reported_entity_id) {
      try {
        if (reported_entity_type === 'casting_call') {
          // casting_calls.agency_id → agency_profiles.id → agency_profiles.user_id = profiles.id
          const cc = await prisma.casting_calls.findUnique({
            where: { id: reported_entity_id },
            select: { agency_profiles: { select: { user_id: true } } },
          })
          resolvedReportedUserId = cc?.agency_profiles?.user_id ?? null
        } else {
          // For aspirant profile reports: entity_id is aspirant_profiles.id → user_id = profiles.id
          const ap = await prisma.aspirant_profiles.findUnique({
            where: { id: reported_entity_id },
            select: { user_id: true },
          })
          resolvedReportedUserId = ap?.user_id ?? null
        }
      } catch {}
    }

    if (!resolvedReportedUserId) {
      return errorResponse('Could not identify the reported user. Please try again.', 400)
    }

    const validReasons = [
      'fake_profile', 'scam_casting', 'harassment',
      'inappropriate_content', 'spam', 'fraud',
      'impersonation', 'copyright_violation', 'other',
    ]
    if (!validReasons.includes(reason)) {
      return errorResponse(`Reason must be one of: ${validReasons.join(', ')}`, 400)
    }

    // Prevent self-reporting
    if (resolvedReportedUserId === user.id) {
      return errorResponse('You cannot report yourself', 400)
    }

    // Check duplicate — prevent same user reporting same person/entity twice
    const existing = await prisma.reports.findFirst({
      where: {
        reported_by:      user.id,
        reported_user_id: resolvedReportedUserId,
      },
    })
    if (existing) {
      return errorResponse('You have already raised a complaint against this profile. Our team is reviewing it.', 409)
    }

    // Create report using correct column names
    const report = await prisma.reports.create({
      data: {
        reported_by:      user.id,
        reported_user_id: resolvedReportedUserId,
        reason,
        description:      description || `Reported entity: ${reported_entity_id || ''}. Type: ${reported_entity_type || 'user'}.`,
      },
    })

    // Notify admin
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
          message:    `A new report has been submitted. Reason: ${reason}`,
          action_url: '/admin/reports',
        },
      })
    }

    return successResponse({
      message:   'Report submitted successfully. Our team will review it within 24–48 hours.',
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

    const profile = await prisma.profiles.findUnique({
      where: { id: user.id }, select: { role: true },
    })
    if (profile?.role !== 'admin') return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { report_id, action, admin_note, trust_score_deduction = 10 } = body

    if (!report_id || !action) return errorResponse('report_id and action are required', 400)

    const validActions = ['resolve', 'dismiss', 'escalate']
    if (!validActions.includes(action)) return errorResponse(`Action must be one of: ${validActions.join(', ')}`, 400)

    const report = await prisma.reports.findUnique({ where: { id: report_id } })
    if (!report) return errorResponse('Report not found', 404)

    await prisma.reports.update({
      where: { id: report_id },
      data: {
        admin_notes:  admin_note || action,
        resolved_at:  new Date(),
      },
    })

    // Deduct trust score on resolve
    if (action === 'resolve' && report.reported_user_id) {
      const reportedProfile = await prisma.profiles.findUnique({
        where:  { id: report.reported_user_id },
        select: { role: true },
      })
      if (reportedProfile?.role === 'aspirant') {
        await prisma.aspirant_profiles.updateMany({
          where: { user_id: report.reported_user_id },
          data:  { trust_score: { decrement: trust_score_deduction } },
        })
      } else if (reportedProfile?.role === 'agency') {
        await prisma.agency_profiles.updateMany({
          where: { user_id: report.reported_user_id },
          data:  { trust_score: { decrement: trust_score_deduction } },
        })
      }
      await prisma.notifications.create({
        data: {
          user_id:    report.reported_user_id,
          type:       'system_announcement',
          title:      'Account Warning',
          message:    'A report against your account has been reviewed and actioned.',
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