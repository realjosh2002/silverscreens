export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const application = await prisma.applications.findUnique({
      where: { id },
      include: {
        casting_calls: {
          include: {
            agency_profiles: {
              select: {
                id: true, company_name: true,
                verification_status: true,
                contact_email: true, contact_phone: true,
                city: true, state: true,
              },
            },
          },
        },
        aspirant_profiles: {
          select: {
            id: true,
            first_name: true, last_name: true,
            profile_image_url: true,
            date_of_birth: true,
            gender: true,
            category: true,
            role: true,
            city: true, state: true, country: true,
            height_cm: true, weight_kg: true,
            hair_color: true, eye_color: true,
            body_tone: true, body_type: true,
            chest_size: true, waist_size: true,
            hip_size: true, shoe_size: true,
            languages: true,
            experience_level: true,
            about_me: true,
            verification_status: true,
            profile_views: true,
            social_links: true,
            aspirant_media: {
              select: {
                id: true,
                type: true,
                url: true,
                is_primary: true,
                order_index: true,
              },
            },
          },
        },
      },
    })

    if (!application) return errorResponse('Application not found', 404)

    return successResponse({ application })
  } catch (error: unknown) {
    console.error('[GET APPLICATION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

// PATCH = same as PUT
export const PATCH = PUT

export async function PUT(
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
    const { status, audition_notes } = body

    const application = await prisma.applications.findUnique({
      where: { id },
      include: {
        casting_calls: {
          select: {
            id: true,
            agency_id: true,
            title: true,
            agency_profiles: {
              select: { user_id: true },
            },
          },
        },
      },
    })

    if (!application) return errorResponse('Application not found', 404)

    if (application.casting_calls.agency_profiles.user_id !== user.id) {
      return errorResponse('Unauthorized', 403)
    }

    const validStatuses = ['applied', 'in_review', 'shortlisted', 'rejected', 'selected', 'on_hold']
    if (!validStatuses.includes(status)) {
      return errorResponse('Invalid status', 400)
    }

    const updated = await prisma.applications.update({
      where: { id },
      data: {
        status,
        ...(audition_notes && { notes: audition_notes }),
        ...(status === 'shortlisted' && { shortlisted_at: new Date() }),
        ...(status === 'in_review'   && { reviewed_at:    new Date() }),
      },
    })

    // Auto-close casting call when aspirant is selected (one role per casting call per PRD)
    if (status === 'selected') {
      await prisma.casting_calls.update({
        where: { id: application.casting_calls.id },
        data:  { status: 'closed' },
      }).catch(() => {})
    }

    return successResponse({ application: updated })
  } catch (error: unknown) {
    console.error('[PUT APPLICATION ERROR]', error)
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
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const application = await prisma.applications.findUnique({
      where: { id },
      include: {
        aspirant_profiles: {
          select: { user_id: true },
        },
      },
    })

    if (!application) return errorResponse('Application not found', 404)

    if (application.aspirant_profiles.user_id !== user.id) {
      return errorResponse('Unauthorized', 403)
    }

    if (application.status === 'selected') {
      return errorResponse('Cannot withdraw a selected application', 400)
    }

    await prisma.applications.delete({ where: { id } })

    return successResponse({ message: 'Application withdrawn successfully' })
  } catch (error: unknown) {
    console.error('[DELETE APPLICATION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}