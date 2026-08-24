import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/aspirant/analytics

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where: { user_id: user.id },
      select: {
        id: true,
        profile_views: true,
        search_appearances: true,
        profile_completion: true,
        trust_score: true,
        verification_status: true,
      },
    })
    if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

    const aspirantId = aspirantProfile.id
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // ── Applications ──────────────────────────────────────────
    const [
      totalApplications,
      shortlisted,
      selected,
      rejected,
      inReview,
      applied,
      recentApplications,
    ] = await Promise.all([
      prisma.applications.count({ where: { aspirant_id: aspirantId } }),
      prisma.applications.count({ where: { aspirant_id: aspirantId, status: 'shortlisted' } }),
      prisma.applications.count({ where: { aspirant_id: aspirantId, status: 'selected' } }),
      prisma.applications.count({ where: { aspirant_id: aspirantId, status: 'rejected' } }),
      prisma.applications.count({ where: { aspirant_id: aspirantId, status: 'in_review' } }),
      prisma.applications.count({ where: { aspirant_id: aspirantId, status: 'applied' } }),
      prisma.applications.count({ where: { aspirant_id: aspirantId, applied_at: { gte: thirtyDaysAgo } } }),
    ])

    // ── Auditions ─────────────────────────────────────────────
    const [totalAuditions, completedAuditions, scheduledAuditions] = await Promise.all([
      prisma.auditions.count({ where: { aspirant_id: aspirantId } }),
      prisma.auditions.count({ where: { aspirant_id: aspirantId, status: 'completed' } }),
      prisma.auditions.count({ where: { aspirant_id: aspirantId, status: 'scheduled' } }),
    ])

    // ── Saved casting calls ───────────────────────────────────
    const savedCastingCalls = await prisma.saved_casting_calls.count({
      where: { aspirant_id: aspirantId },
    })

    // ── Recent 5 applications ─────────────────────────────────
    const recentApps = await prisma.applications.findMany({
      where: { aspirant_id: aspirantId },
      orderBy: { applied_at: 'desc' },
      take: 5,
      select: {
        id: true,
        status: true,
        applied_at: true,
        casting_calls: {
          select: {
            id: true,
            title: true,
            project_type: true,
            agency_profiles: {
              select: { company_name: true },
            },
          },
        },
      },
    })

    const successRate = totalApplications > 0
      ? Math.round(((shortlisted + selected) / totalApplications) * 100)
      : 0

    return successResponse({
      profile: {
        views: aspirantProfile.profile_views ?? 0,
        search_appearances: aspirantProfile.search_appearances ?? 0,
        completion: aspirantProfile.profile_completion ?? 0,
        trust_score: aspirantProfile.trust_score ?? 100,
        verification_status: aspirantProfile.verification_status,
      },
      applications: {
        total: totalApplications,
        shortlisted,
        selected,
        rejected,
        in_review: inReview,
        applied,
        recent_30d: recentApplications,
        success_rate: successRate,
      },
      auditions: {
        total: totalAuditions,
        completed: completedAuditions,
        scheduled: scheduledAuditions,
      },
      saved_casting_calls: savedCastingCalls,
      recent_applications: recentApps,
    })
  } catch (error: unknown) {
    console.error('[GET ASPIRANT ANALYTICS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}