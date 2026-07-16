import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/applications — get applications (aspirant sees own, agency sees their casting call apps)
// POST /api/applications — aspirant applies to a casting call

export async function GET(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { searchParams } = new URL(req.url)
    const status         = searchParams.get('status') || ''
    const casting_call_id = searchParams.get('casting_call_id') || ''
    const page           = parseInt(searchParams.get('page') || '1')
    const limit          = parseInt(searchParams.get('limit') || '10')
    const skip           = (page - 1) * limit

    // Map frontend display values → DB enum values
    const statusMap: Record<string, string> = {
      'New':         'applied',
      'In Review':   'in_review',
      'Shortlisted': 'shortlisted',
      'Rejected':    'rejected',
    }
    const dbStatus = statusMap[status] || status

    const userProfile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })

    if (!userProfile) return errorResponse('Profile not found', 404)

    let applications
    let total

    if (userProfile.role === 'aspirant') {
      // ── Aspirant sees their own applications ──────────────
      const aspirantProfile = await prisma.aspirant_profiles.findUnique({
        where:  { user_id: user.id },
        select: { id: true },
      })

      if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

      const where: Record<string, unknown> = { aspirant_id: aspirantProfile.id }
      if (dbStatus) where.status = dbStatus

      ;[applications, total] = await Promise.all([
        prisma.applications.findMany({
          where,
          skip,
          take:    limit,
          orderBy: { applied_at: 'desc' },
          include: {
            casting_calls: {
              select: {
                id:                    true,
                title:                 true,
                project_type:          true,
                role_name:             true,
                last_application_date: true,
                status:                true,
                agency_profiles: {
                  select: {
                    company_name: true,
                    logo_url:     true,
                    city:         true,
                  },
                },
              },
            },
          },
        }),
        prisma.applications.count({ where }),
      ])
    } else {
      // ── Agency sees applications to their casting calls ───
      const agencyProfile = await prisma.agency_profiles.findUnique({
        where:  { user_id: user.id },
        select: { id: true },
      })

      if (!agencyProfile) return errorResponse('Agency profile not found', 404)

      const aspirant_id = searchParams.get('aspirant_id') || ''

      const where: Record<string, unknown> = {
        agency_id: agencyProfile.id,
      }
      if (dbStatus)        where.status          = dbStatus
      if (casting_call_id) where.casting_call_id = casting_call_id
      if (aspirant_id)     where.aspirant_id     = aspirant_id

      ;[applications, total] = await Promise.all([
        prisma.applications.findMany({
          where,
          skip,
          take:    limit,
          orderBy: { applied_at: 'desc' },
          include: {
            casting_calls: {
              select: {
                id:           true,
                title:        true,
                role_name:    true,
                project_type: true,
                location:     true,
                budget_min:   true,
                budget_max:   true,
                gender_preference: true,
                age_min:      true,
                age_max:      true,
                languages_required: true,
              },
            },
            aspirant_profiles: {
              select: {
                id:                  true,
                first_name:          true,
                last_name:           true,
                profile_number:      true,
                category:            true,
                experience_level:    true,
                city:                true,
                state:               true,
                profile_image_url:   true,
                verification_status: true,
                trust_score:         true,
                date_of_birth:       true,
                gender:              true,

                languages:           true,
                height_cm:           true,
                body_type:           true,
              },
            },
          },
        }),
        prisma.applications.count({ where }),
      ])
    }

    return successResponse({
      applications,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    })
  } catch (error: unknown) {
    console.error('[GET APPLICATIONS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Verify aspirant role ──────────────────────────────
    const userProfile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })

    if (!userProfile || userProfile.role !== 'aspirant') {
      return errorResponse('Only aspirants can apply to casting calls', 403)
    }

    // ─── 3. Check active subscription ─────────────────────────
    const activeSub = await prisma.subscriptions.findFirst({
      where: { user_id: user.id, status: 'active' },
    })

    if (!activeSub) {
      return errorResponse('An active subscription is required to apply to casting calls', 403)
    }

    const body = await req.json()
    const { casting_call_id, cover_note } = body

    if (!casting_call_id) {
      return errorResponse('Casting call ID is required', 400)
    }

    // ─── 4. Get aspirant profile ──────────────────────────────
    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true, verification_status: true },
    })

    if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

    // ─── 5. Verify casting call exists and is active ──────────
    const castingCall = await prisma.casting_calls.findUnique({
      where:  { id: casting_call_id },
      select: {
        id:                    true,
        status:                true,
        last_application_date: true,
        agency_id:             true,
        title:                 true,
        agency_profiles: {
          select: { user_id: true },
        },
      },
    })

    if (!castingCall) return errorResponse('Casting call not found', 404)

    if (castingCall.status !== 'active') {
      return errorResponse('This casting call is no longer accepting applications', 400)
    }

    if (new Date() > castingCall.last_application_date) {
      return errorResponse('The application deadline for this casting call has passed', 400)
    }

    // ─── 6. Check not already applied ─────────────────────────
    const existingApplication = await prisma.applications.findFirst({
      where: {
        aspirant_id:     aspirantProfile.id,
        casting_call_id: casting_call_id,
      },
    })

    if (existingApplication) {
      return errorResponse('You have already applied to this casting call', 409)
    }

    // ─── 7. Create application ────────────────────────────────
    const application = await prisma.applications.create({
      data: {
        aspirant_id:     aspirantProfile.id,
        casting_call_id: casting_call_id,
        agency_id:       castingCall.agency_id,
        status:          'applied',
        applied_at:      new Date(),
        ...(cover_note?.trim() ? { notes: cover_note.trim() } : {}),
      },
    })

    // ─── 8. Increment casting call application count ──────────
    await prisma.casting_calls.update({
      where: { id: casting_call_id },
      data:  { applications_count: { increment: 1 } },
    })

    // ─── 9. Notify the agency ─────────────────────────────────
    await prisma.notifications.create({
      data: {
        user_id:    castingCall.agency_profiles.user_id,
        type:       'application_update',
        title:      'New Application Received',
        message:    `A new application has been received for "${castingCall.title}".`,
        action_url: `/agency/applications?casting_call_id=${casting_call_id}`,
      },
    })

    return successResponse({
      message:     'Application submitted successfully',
      application,
    }, 201)
  } catch (error: unknown) {
    console.error('[APPLY TO CASTING CALL ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}