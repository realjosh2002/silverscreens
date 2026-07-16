import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/auditions — agency sees their auditions
// POST /api/auditions — agency schedules an audition

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || ''
    const page   = parseInt(searchParams.get('page') || '1')
    const limit  = parseInt(searchParams.get('limit') || '20')
    const skip   = (page - 1) * limit

    const userProfile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })
    if (!userProfile) return errorResponse('Profile not found', 404)

    let where: Record<string, unknown> = {}

    if (userProfile.role === 'aspirant') {
      const aspirantProfile = await prisma.aspirant_profiles.findUnique({
        where:  { user_id: user.id },
        select: { id: true },
      })
      if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)
      where.aspirant_id = aspirantProfile.id
    } else {
      const agencyProfile = await prisma.agency_profiles.findUnique({
        where:  { user_id: user.id },
        select: { id: true },
      })
      if (!agencyProfile) return errorResponse('Agency profile not found', 404)
      where.agency_id = agencyProfile.id
    }

    if (status) where.status = status

    const [auditions, total] = await Promise.all([
      prisma.auditions.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { scheduled_at: 'desc' },
        include: {
          casting_calls: {
            select: { id: true, title: true, role_name: true, project_type: true },
          },
          aspirant_profiles: {
            select: {
              id:                true,
              first_name:        true,
              last_name:         true,
              profile_image_url: true,
              category:          true,
              gender:            true,
              city:              true,
              verification_status: true,
            },
          },
          applications: {
            select: { id: true, status: true },
          },
        },
      }),
      prisma.auditions.count({ where }),
    ])

    return successResponse({
      auditions,
      pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
    })
  } catch (error: unknown) {
    console.error('[GET AUDITIONS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const agencyProfile = await prisma.agency_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true },
    })
    if (!agencyProfile) return errorResponse('Agency profile not found', 404)

    const body = await req.json()
    const {
      application_id,
      scheduled_at,
      duration_minutes = 30,
      mode = 'offline',
      venue_details,
      meeting_link,
      notes,
    } = body

    if (!application_id) return errorResponse('Application ID is required', 400)
    if (!scheduled_at)   return errorResponse('Scheduled date/time is required', 400)

    // Fetch application to get casting_call_id and aspirant_id
    const application = await prisma.applications.findUnique({
      where:  { id: application_id },
      select: { id: true, casting_call_id: true, aspirant_id: true, agency_id: true },
    })
    if (!application) return errorResponse('Application not found', 404)
    if (application.agency_id !== agencyProfile.id) {
      return errorResponse('Unauthorized', 403)
    }

    const audition = await prisma.auditions.create({
      data: {
        application_id,
        casting_call_id:  application.casting_call_id,
        aspirant_id:      application.aspirant_id,
        agency_id:        agencyProfile.id,
        scheduled_at:     new Date(scheduled_at),
        duration_minutes,
        mode,
        venue_details,
        meeting_link,
        notes,
        status:           'scheduled',
      },
    })

    // Notify aspirant
    const aspirant = await prisma.aspirant_profiles.findUnique({
      where:  { id: application.aspirant_id },
      select: { user_id: true },
    })
    const castingCall = await prisma.casting_calls.findUnique({
      where:  { id: application.casting_call_id },
      select: { title: true },
    })

    if (aspirant && castingCall) {
      await prisma.notifications.create({
        data: {
          user_id:    aspirant.user_id,
          type:       'audition_scheduled',
          title:      '🎬 Audition Scheduled!',
          message:    `Your audition for "${castingCall.title}" has been scheduled.`,
          action_url: `/applications/${application_id}`,
        },
      })
    }

    return successResponse({ message: 'Audition scheduled successfully', audition }, 201)
  } catch (error: unknown) {
    console.error('[CREATE AUDITION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}