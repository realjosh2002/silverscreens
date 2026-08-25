export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/saved-castings — get aspirant's saved casting calls
// POST /api/saved-castings — save a casting call
// DELETE /api/saved-castings?casting_call_id=xxx — unsave a casting call

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true },
    })
    if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

    const saved = await prisma.saved_casting_calls.findMany({
      where:   { aspirant_id: aspirantProfile.id },
      orderBy: { created_at: 'desc' },
      include: {
        casting_calls: {
          include: {
            agency_profiles: {
              select: { company_name: true, logo_url: true, city: true },
            },
          },
        },
      },
    })

    return successResponse({ saved })
  } catch (error: unknown) {
    console.error('[GET SAVED CASTINGS ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true },
    })
    if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

    const { casting_call_id } = await req.json()
    if (!casting_call_id) return errorResponse('casting_call_id is required', 400)

    const existing = await prisma.saved_casting_calls.findUnique({
      where: { aspirant_id_casting_call_id: { aspirant_id: aspirantProfile.id, casting_call_id } },
    })
    if (existing) return successResponse({ message: 'Already saved' })

    await prisma.saved_casting_calls.create({
      data: { aspirant_id: aspirantProfile.id, casting_call_id },
    })

    return successResponse({ message: 'Casting call saved' }, 201)
  } catch (error: unknown) {
    console.error('[SAVE CASTING ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true },
    })
    if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

    const { searchParams } = new URL(req.url)
    const casting_call_id = searchParams.get('casting_call_id')
    if (!casting_call_id) return errorResponse('casting_call_id is required', 400)

    await prisma.saved_casting_calls.deleteMany({
      where: { aspirant_id: aspirantProfile.id, casting_call_id },
    })

    return successResponse({ message: 'Casting call removed from saved' })
  } catch (error: unknown) {
    console.error('[UNSAVE CASTING ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}
