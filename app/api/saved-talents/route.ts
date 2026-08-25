export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/saved-talents
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const saved = await (prisma as any).saved_talents.findMany({
      where:   { agency_id: user.id },
      orderBy: { created_at: 'desc' },
    })

    const aspirantIds = saved.map((s: any) => s.aspirant_id)

    const aspirantProfiles = aspirantIds.length > 0
      ? await prisma.$queryRawUnsafe<any[]>(
          `SELECT id as aspirant_profile_id, user_id, first_name, last_name, profile_number, category, role, city, state, gender, profile_image_url, languages, trust_score, is_available, date_of_birth
           FROM public.aspirant_profiles
           WHERE user_id = ANY($1::uuid[])`,
          aspirantIds
        )
      : []

    const profileMap: Record<string, any> = {}
    for (const p of aspirantProfiles) profileMap[p.user_id] = p

    const result = saved.map((s: any) => {
      const ap = profileMap[s.aspirant_id] ?? {}
      return {
        id:           s.id,
        aspirant_id:  s.aspirant_id,
        aspirant_profile_id: ap.aspirant_profile_id ?? null,
        notes:        s.notes,
        created_at:   s.created_at,
        name:         [ap.first_name, ap.last_name].filter(Boolean).join(' ') || 'Unknown',
        talentId:     ap.profile_number ?? '—',
        category:     ap.category ?? '—',
        role:         ap.role ?? '—',
        city:         ap.city ?? '—',
        state:        ap.state ?? '—',
        gender:       ap.gender ?? '—',
        avatar:       ap.profile_image_url ?? '',
        languages:    ap.languages ?? [],
        trust_score:  ap.trust_score ?? null,
        is_available: ap.is_available ?? false,
        age:          ap.date_of_birth ? Math.floor((Date.now() - new Date(ap.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 0,
      }
    })

    return successResponse({ saved: result, total: result.length })
  } catch (error: unknown) {
    console.error('[GET SAVED TALENTS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

// POST /api/saved-talents
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const { aspirant_id, notes } = body

    if (!aspirant_id) return errorResponse('Aspirant ID is required', 400)

    // aspirant_id could be aspirant_profiles.id — resolve to profiles.id (user_id)
    let profileUserId = aspirant_id
    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where:  { id: aspirant_id },
      select: { user_id: true },
    })
    if (aspirantProfile?.user_id) profileUserId = aspirantProfile.user_id

    const existing = await (prisma as any).saved_talents.findFirst({
      where: { agency_id: user.id, aspirant_id: profileUserId },
    })

    if (existing) return errorResponse('Talent already saved', 409)

    const saved = await (prisma as any).saved_talents.create({
      data: { agency_id: user.id, aspirant_id: profileUserId, notes: notes ?? '' },
    })

    return successResponse({ message: 'Talent saved successfully', saved }, 201)
  } catch (error: unknown) {
    console.error('[SAVE TALENT ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

// DELETE /api/saved-talents
export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const { aspirant_id, id } = body

    if (!aspirant_id && !id) return errorResponse('aspirant_id or id is required', 400)

    await (prisma as any).saved_talents.deleteMany({
      where: id
        ? { id, agency_id: user.id }
        : { agency_id: user.id, aspirant_id },
    })

    return successResponse({ message: 'Talent removed from saved list' })
  } catch (error: unknown) {
    console.error('[DELETE SAVED TALENT ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
