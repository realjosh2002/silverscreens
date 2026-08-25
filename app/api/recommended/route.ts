export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/recommended — get casting calls recommended for the aspirant based on their profile

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where:  { user_id: user.id },
      select: {
        id: true, gender: true, category: true, experience_level: true,
        languages: true, city: true, state: true, date_of_birth: true,
      },
    })
    if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

    const { searchParams } = new URL(req.url)
    const page  = parseInt(searchParams.get('page')  || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip  = (page - 1) * limit

    // Age calculation
    const dob = aspirantProfile.date_of_birth
    const age = dob
      ? Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
      : null

    // Build matching conditions
    const where: Record<string, unknown> = {
      status: 'active',
      last_application_date: { gte: new Date() },
    }

    // Gender match
    if (aspirantProfile.gender) {
      where.OR = [
        { gender_preference: 'Any' },
        { gender_preference: aspirantProfile.gender },
        { gender_preference: null },
      ]
    }

    // Age range match
    if (age) {
      where.AND = [
        { OR: [{ age_min: null }, { age_min: { lte: age } }] },
        { OR: [{ age_max: null }, { age_max: { gte: age } }] },
      ]
    }

    const [castingCalls, total] = await Promise.all([
      prisma.casting_calls.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { created_at: 'desc' },
        include: {
          agency_profiles: {
            select: {
              company_name:        true,
              logo_url:            true,
              city:                true,
              verification_status: true,
            },
          },
          _count: { select: { applications: true } },
        },
      }),
      prisma.casting_calls.count({ where }),
    ])

    return successResponse({
      castingCalls,
      pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
    })
  } catch (error: unknown) {
    console.error('[GET RECOMMENDED ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}
