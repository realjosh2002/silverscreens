import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/casting-calls/[id] — get single casting call
// PUT /api/casting-calls/[id] — agency updates casting call
// DELETE /api/casting-calls/[id] — agency deletes casting call

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const castingCall = await prisma.casting_calls.findUnique({
      where:   { id },
      include: {
        agency_profiles: {
          select: {
            id:                  true,
            company_name:        true,
            verification_status: true,
            logo_url:            true,
            city:                true,
            state:               true,
            country:             true,
            website_url:         true,
            company_description: true,
            social_links:        true,
            trust_score:         true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    })

    if (!castingCall) {
      return errorResponse('Casting call not found', 404)
    }

    // Increment view count
    await prisma.casting_calls.update({
      where: { id },
      data:  { views_count: { increment: 1 } },
    })

    return successResponse({ casting_call: castingCall })
  } catch (error: unknown) {
    console.error('[GET CASTING CALL ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Verify ownership ──────────────────────────────────
    const agencyProfile = await prisma.agency_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true },
    })

    if (!agencyProfile) {
      return errorResponse('Agency profile not found', 404)
    }

    const castingCall = await prisma.casting_calls.findUnique({
      where:  { id },
      select: { id: true, agency_id: true, status: true },
    })

    if (!castingCall) {
      return errorResponse('Casting call not found', 404)
    }

    if (castingCall.agency_id !== agencyProfile.id) {
      return errorResponse('You can only edit your own casting calls', 403)
    }

    if (castingCall.status === 'expired') {
      return errorResponse('Expired casting calls cannot be edited', 400)
    }

    const body = await req.json()

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = { updated_at: new Date() }
    const fields = [
      'title', 'project_type', 'role_name', 'role_description',
      'eligibility_criteria', 'gender_preference', 'age_min', 'age_max',
      'experience_level', 'skills_required', 'languages_required',
      'budget_min', 'budget_max', 'location', 'audition_mode',
      'audition_details', 'compensation_details',
      'last_application_date', 'category', 'status',
      'shoot_start', 'shoot_end', 'audition_start', 'audition_end',
      'audition_time_from', 'audition_time_to', 'audition_location_type',
      'contact_name', 'contact_email', 'contact_mobile',
      'project_status', 'how_to_apply', 'has_sponsor', 'payment_terms',
    ]

    for (const field of fields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (body.last_application_date) {
      updateData.last_application_date = new Date(body.last_application_date)
    }

    const updated = await prisma.casting_calls.update({
      where: { id },
      data:  updateData as never,
    })

    return successResponse({
      message:      'Casting call updated successfully',
      casting_call: updated,
    })
  } catch (error: unknown) {
    console.error('[UPDATE CASTING CALL ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const updateData: Record<string, unknown> = { updated_at: new Date() }

    const allowed = [
      'status', 'title', 'project_type', 'role_name', 'role_description',
      'eligibility_criteria', 'gender_preference', 'age_min', 'age_max',
      'experience_level', 'skills_required', 'languages_required',
      'budget_min', 'budget_max', 'location', 'audition_mode',
      'audition_details', 'compensation_details',
      'last_application_date', 'category',
      'shoot_start', 'shoot_end', 'audition_start', 'audition_end',
      'audition_time_from', 'audition_time_to', 'audition_location_type',
      'contact_name', 'contact_email', 'contact_mobile',
      'project_status', 'how_to_apply', 'has_sponsor', 'payment_terms',
    ]

    for (const field of allowed) {
      if (body[field] !== undefined) updateData[field] = body[field]
    }

    const updated = await prisma.casting_calls.update({
      where: { id },
      data:  updateData as never,
    })

    return successResponse({ casting_call: updated })
  } catch (error: unknown) {
    console.error('[PATCH CASTING CALL ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Verify ownership ──────────────────────────────────
    const agencyProfile = await prisma.agency_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true },
    })

    if (!agencyProfile) return errorResponse('Agency profile not found', 404)

    const castingCall = await prisma.casting_calls.findUnique({
      where:  { id },
      select: { id: true, agency_id: true, title: true },
    })

    if (!castingCall) return errorResponse('Casting call not found', 404)

    if (castingCall.agency_id !== agencyProfile.id) {
      return errorResponse('You can only delete your own casting calls', 403)
    }

    // ─── 3. Soft delete — mark as closed ──────────────────────
    await prisma.casting_calls.update({
      where: { id },
      data:  { status: 'closed', updated_at: new Date() },
    })

    // ─── 4. Log deletion ──────────────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     user.id,
        action:      'CASTING_CALL_DELETED',
        entity_type: 'casting_calls',
        entity_id:   id,
        new_values:  { title: castingCall.title },
      },
    })

    return successResponse({ message: 'Casting call deleted successfully' })
  } catch (error: unknown) {
    console.error('[DELETE CASTING CALL ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}