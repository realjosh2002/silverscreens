export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/auditions — agency sees their auditions
// POST /api/auditions — agency schedules an audition

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || ''
    const page   = parseInt(searchParams.get('page') || '1')
    const limit  = parseInt(searchParams.get('limit') || '20')
    const skip   = (page - 1) * limit

    // Use Prisma for profile lookup — works reliably with enum types
    const userProfile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })
    if (!userProfile) return errorResponse('Profile not found', 404)

    let filterCol = ''
    let filterVal = ''

    if (userProfile.role === 'aspirant') {
      const aspirantProfile = await prisma.aspirant_profiles.findUnique({
        where:  { user_id: user.id },
        select: { id: true },
      })
      if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)
      filterCol = 'aspirant_id'
      filterVal = aspirantProfile.id
    } else {
      // When admin views an agency profile, agency_user_id is passed in query
      const agencyUserId  = searchParams.get('agency_user_id') || ''
      const lookupUserId  = agencyUserId || user.id

      const agencyProfile = await prisma.agency_profiles.findUnique({
        where:  { user_id: lookupUserId },
        select: { id: true },
      })
      if (!agencyProfile) return errorResponse('Agency profile not found', 404)
      filterCol = 'agency_id'
      filterVal = agencyProfile.id
    }

    let query = supabaseAdmin
      .from('auditions')
      .select(`
        id, scheduled_at, duration_minutes, mode, status, venue_details, notes,
        aspirant_id, agency_id, casting_call_id, application_id,
        casting_calls ( id, title, role_name, project_type ),
        aspirant_profiles ( id, first_name, last_name, profile_image_url, category, gender, city, verification_status, user_id )
      `, { count: 'exact' })
      .eq(filterCol, filterVal)
      .order('scheduled_at', { ascending: false })
      .range(skip, skip + limit - 1)

    if (status) query = query.eq('status', status)

    const { data: auditions, count, error: queryError } = await query

    if (queryError) {
      console.error('[GET AUDITIONS QUERY ERROR]', queryError)
      return errorResponse(queryError.message, 500)
    }

    console.log('[GET AUDITIONS] filterCol:', filterCol, 'filterVal:', filterVal, 'count:', count, 'results:', auditions?.length)

    return successResponse({
      auditions: auditions ?? [],
      pagination: { page, limit, total: count ?? 0, total_pages: Math.ceil((count ?? 0) / limit) },
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

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { data: agencyProfile } = await supabaseAdmin
      .from('agency_profiles').select('id').eq('user_id', user.id).single()
    if (!agencyProfile) return errorResponse('Agency profile not found', 404)

    const body = await req.json()
    const {
      application_id,
      aspirant_id: directAspirantId,
      casting_call_id: directCastingCallId,
      scheduled_at,
      duration_minutes = 30,
      mode = 'offline',
      venue_details,
      meeting_link,
      notes,
    } = body

    if (!scheduled_at) return errorResponse('Scheduled date/time is required', 400)
    if (!application_id && !directAspirantId) return errorResponse('Either application_id or aspirant_id is required', 400)

    let resolvedAspirantId: string
    let resolvedCastingCallId: string | null = directCastingCallId ?? null
    let resolvedApplicationId: string | null = application_id ?? null

    if (application_id) {
      const { data: application } = await supabaseAdmin
        .from('applications')
        .select('id, casting_call_id, aspirant_id, agency_id')
        .eq('id', application_id)
        .single()
      if (!application) return errorResponse('Application not found', 404)
      if (application.agency_id !== agencyProfile.id) return errorResponse('Unauthorized', 403)
      resolvedAspirantId    = application.aspirant_id
      resolvedCastingCallId = application.casting_call_id
    } else {
      resolvedAspirantId = directAspirantId
    }

    const insertData: Record<string, unknown> = {
      aspirant_id:      resolvedAspirantId,
      agency_id:        agencyProfile.id,
      scheduled_at:     new Date(scheduled_at).toISOString(),
      duration_minutes: Number(duration_minutes) || 30,
      mode,
      status:           'scheduled',
    }
    if (resolvedApplicationId) insertData.application_id  = resolvedApplicationId
    if (resolvedCastingCallId) insertData.casting_call_id = resolvedCastingCallId
    if (venue_details)         insertData.venue_details   = venue_details
    if (meeting_link)          insertData.meeting_link    = meeting_link
    if (notes)                 insertData.notes           = notes

    const { data: audition, error: insertError } = await supabaseAdmin
      .from('auditions')
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      console.error('[CREATE AUDITION INSERT ERROR]', insertError)
      return errorResponse(insertError.message, 500)
    }

    // Notify aspirant
    try {
      const { data: aspirant } = await supabaseAdmin
        .from('aspirant_profiles').select('user_id').eq('id', resolvedAspirantId).single()

      let castingCallTitle = ''
      if (resolvedCastingCallId) {
        const { data: cc } = await supabaseAdmin
          .from('casting_calls').select('title').eq('id', resolvedCastingCallId).single()
        castingCallTitle = cc?.title ?? ''
      }

      if (aspirant?.user_id) {
        await prisma.notifications.create({
          data: {
            user_id:    aspirant.user_id,
            type:       'audition_scheduled' as any,
            title:      '🎬 Audition Scheduled!',
            message:    castingCallTitle
              ? `You have been invited to an audition for "${castingCallTitle}". Please check the details.`
              : 'You have been invited to an audition. Please check the details.',
            is_read:    false,
            action_url: '/auditions',
          },
        })
      }
    } catch (notifErr) {
      console.error('[AUDITION NOTIFICATION ERROR]', notifErr)
    }

    return successResponse({ message: 'Audition scheduled successfully', audition }, 201)
  } catch (error: unknown) {
    console.error('[CREATE AUDITION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
