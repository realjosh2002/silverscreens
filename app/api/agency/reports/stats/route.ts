export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/agency/reports/stats

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { searchParams } = new URL(req.url)
    const agencyUserId = searchParams.get('agency_user_id')
    const lookupUserId = agencyUserId ?? user.id

    const agencyProfile = await prisma.agency_profiles.findUnique({
      where: { user_id: lookupUserId },
      select: { id: true },
    })
    if (!agencyProfile) return errorResponse('Agency profile not found', 404)

    const agencyId = agencyProfile.id

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // ── Casting calls ─────────────────────────────────────────
    const [
      totalCastingCalls,
      activeCastingCalls,
      closedCastingCalls,
      recentCastings,
    ] = await Promise.all([
      prisma.casting_calls.count({ where: { agency_id: agencyId } }),
      prisma.casting_calls.count({ where: { agency_id: agencyId, status: 'active' } }),
      prisma.casting_calls.count({ where: { agency_id: agencyId, status: 'closed' } }),
      prisma.casting_calls.count({ where: { agency_id: agencyId, created_at: { gte: thirtyDaysAgo } } }),
    ])

    // ── Applications ──────────────────────────────────────────
    const [
      totalApplicants,
      shortlistedApplicants,
      selectedApplicants,
      rejectedApplicants,
      inReviewApplicants,
      appliedApplicants,
      recentApplications,
    ] = await Promise.all([
      prisma.applications.count({ where: { agency_id: agencyId } }),
      prisma.applications.count({ where: { agency_id: agencyId, status: 'shortlisted' } }),
      prisma.applications.count({ where: { agency_id: agencyId, status: 'selected' } }),
      prisma.applications.count({ where: { agency_id: agencyId, status: 'rejected' } }),
      prisma.applications.count({ where: { agency_id: agencyId, status: 'in_review' } }),
      prisma.applications.count({ where: { agency_id: agencyId, status: 'applied' } }),
      prisma.applications.count({ where: { agency_id: agencyId, applied_at: { gte: thirtyDaysAgo } } }),
    ])

    // ── Auditions ─────────────────────────────────────────────
    const [totalAuditions, completedAuditions, scheduledAuditions] = await Promise.all([
      prisma.auditions.count({ where: { agency_id: agencyId } }),
      prisma.auditions.count({ where: { agency_id: agencyId, status: 'completed' } }),
      prisma.auditions.count({ where: { agency_id: agencyId, status: 'scheduled' } }),
    ])

    // ── Shortlisted talents ───────────────────────────────────
    const shortlistedTalents = await prisma.shortlisted_talents.count({
      where: { agency_id: agencyId },
    })

    // ── Views across all casting calls ────────────────────────
    const viewsAgg = await prisma.casting_calls.aggregate({
      where: { agency_id: agencyId },
      _sum: { views_count: true },
    })
    const totalCastingViews = viewsAgg._sum.views_count ?? 0

    // ── Top 10 casting calls by application count ─────────────
    const topCastingCalls = await prisma.casting_calls.findMany({
      where: { agency_id: agencyId },
      orderBy: { applications_count: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        status: true,
        applications_count: true,
        views_count: true,
        created_at: true,
        last_application_date: true,
      },
    })

    // ── Daily time-series for last 7 days ─────────────────────
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    // Fetch all applications in last 7 days with status and date
    const recentApps = await prisma.applications.findMany({
      where: {
        agency_id: agencyId,
        applied_at: { gte: sevenDaysAgo },
      },
      select: { applied_at: true, status: true },
    })

    // Fetch all auditions in last 7 days
    const recentAuditions = await prisma.auditions.findMany({
      where: {
        agency_id: agencyId,
        created_at: { gte: sevenDaysAgo },
      },
      select: { created_at: true, status: true },
    })

    // Build daily buckets for the last 7 days
    const days: string[] = []
    const dailyApplicants: number[] = []
    const dailyShortlisted: number[] = []
    const dailyScheduled: number[] = []
    const dailyCompleted: number[] = []

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const next = new Date(d)
      next.setDate(next.getDate() + 1)

      const dayLabel = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      days.push(dayLabel)

      const dayApps = recentApps.filter(a => {
        const t = a.applied_at ? new Date(a.applied_at) : null
        return t && t >= d && t < next
      })
      const dayAuds = recentAuditions.filter(a => {
        const t = a.created_at ? new Date(a.created_at) : null
        return t && t >= d && t < next
      })

      dailyApplicants.push(dayApps.length)
      dailyShortlisted.push(dayApps.filter(a => a.status === 'shortlisted').length)
      dailyScheduled.push(dayAuds.filter(a => a.status === 'scheduled').length)
      dailyCompleted.push(dayAuds.filter(a => a.status === 'completed').length)
    }

    return successResponse({
      casting_calls: {
        total: totalCastingCalls,
        active: activeCastingCalls,
        closed: closedCastingCalls,
        draft: totalCastingCalls - activeCastingCalls - closedCastingCalls,
        recent_30d: recentCastings,
      },
      applicants: {
        total: totalApplicants,
        shortlisted: shortlistedApplicants,
        selected: selectedApplicants,
        rejected: rejectedApplicants,
        in_review: inReviewApplicants,
        applied: appliedApplicants,
        recent_30d: recentApplications,
      },
      auditions: {
        total: totalAuditions,
        completed: completedAuditions,
        scheduled: scheduledAuditions,
      },
      shortlisted_talents: shortlistedTalents,
      casting_views: totalCastingViews,
      top_casting_calls: topCastingCalls,
      // Time-series for charts (last 7 days)
      time_series: {
        days,
        applicants:  dailyApplicants,
        shortlisted: dailyShortlisted,
        scheduled:   dailyScheduled,
        completed:   dailyCompleted,
      },
    })
  } catch (error: unknown) {
    console.error('[GET AGENCY REPORTS STATS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
