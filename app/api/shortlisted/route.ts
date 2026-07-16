import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/shortlisted — agency gets their shortlisted talents
// POST /api/shortlisted — agency shortlists a talent
// DELETE /api/shortlisted — agency removes from shortlist

export async function GET(req: NextRequest) {
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

    const shortlisted = await prisma.shortlisted_talents.findMany({
      where:   { agency_id: agencyProfile.id },
      orderBy: { created_at: 'desc' },
      include: {
        aspirant_profiles: {
          select: {
            id:                  true,
            first_name:          true,
            last_name:           true,
            profile_number:      true,
            category:            true,
            role:                true,
            experience_level:    true,
            city:                true,
            state:               true,
            country:             true,
            profile_image_url:   true,
            verification_status: true,
            trust_score:         true,
            languages:           true,
            is_available:        true,
          },
        },
      },
    })

    return successResponse({ shortlisted, total: shortlisted.length })
  } catch (error: unknown) {
    console.error('[GET SHORTLISTED ERROR]', error)
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
    const { aspirant_id, notes } = body

    if (!aspirant_id) return errorResponse('Aspirant ID is required', 400)

    // Check not already shortlisted
    const existing = await prisma.shortlisted_talents.findFirst({
      where: { agency_id: agencyProfile.id, aspirant_id },
    })

    if (existing) return errorResponse('This talent is already shortlisted', 409)

    const shortlisted = await prisma.shortlisted_talents.create({
      data: {
        agency_id:   agencyProfile.id,
        aspirant_id,
        notes:       notes || '',
      },
    })

    // Notify the aspirant
    const aspirant = await prisma.aspirant_profiles.findUnique({
      where:  { id: aspirant_id },
      select: { user_id: true },
    })

    const agency = await prisma.agency_profiles.findUnique({
      where:  { id: agencyProfile.id },
      select: { company_name: true },
    })

    if (aspirant?.user_id) {
      await prisma.notifications.create({
        data: {
          user_id:    aspirant.user_id,
          type:       'shortlisted',
          title:      '⭐ You have been shortlisted!',
          message:    `${agency?.company_name || 'An agency'} has shortlisted your profile.`,
          action_url: '/dashboard',
        },
      })
    }

    return successResponse({ message: 'Talent shortlisted successfully', shortlisted }, 201)
  } catch (error: unknown) {
    console.error('[SHORTLIST ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function DELETE(req: NextRequest) {
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
    const { aspirant_id } = body

    if (!aspirant_id) return errorResponse('Aspirant ID is required', 400)

    await prisma.shortlisted_talents.deleteMany({
      where: { agency_id: agencyProfile.id, aspirant_id },
    })

    return successResponse({ message: 'Talent removed from shortlist' })
  } catch (error: unknown) {
    console.error('[REMOVE SHORTLIST ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}