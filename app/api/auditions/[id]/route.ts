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

    const audition = await prisma.auditions.findUnique({
      where: { id },
      include: {
        casting_calls: {
          include: {
            agency_profiles: {
              select: {
                id: true, company_name: true, logo_url: true,
                contact_person_name: true, contact_email: true, contact_phone: true,
                city: true, state: true, verification_status: true,
              },
            },
          },
        },
        aspirant_profiles: {
          select: { id: true, first_name: true, last_name: true, profile_image_url: true },
        },
        applications: {
          select: { id: true, status: true, applied_at: true },
        },
      },
    })

    if (!audition) return errorResponse('Audition not found', 404)

    return successResponse({ audition })
  } catch (error: unknown) {
    console.error('[GET AUDITION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}