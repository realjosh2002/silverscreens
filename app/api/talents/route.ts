import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/talents — public talent search with filters

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // ─── Filters ──────────────────────────────────────────────
    const keyword    = searchParams.get('keyword')    || ''
    const category   = searchParams.get('category')   || ''
    const role       = searchParams.get('role')        || ''
    const gender     = searchParams.get('gender')      || ''
    const ageMin     = searchParams.get('age_min')     ? parseInt(searchParams.get('age_min')!) : null
    const ageMax     = searchParams.get('age_max')     ? parseInt(searchParams.get('age_max')!) : null
    const experience = searchParams.get('experience') || ''
    const country    = searchParams.get('country')    || ''
    const state      = searchParams.get('state')      || ''
    const city       = searchParams.get('city')       || ''
    const language   = searchParams.get('language')   || ''
    const available  = searchParams.get('available')  || ''
    const page       = parseInt(searchParams.get('page')  || '1')
    const limit      = parseInt(searchParams.get('limit') || '12')
    const skip       = (page - 1) * limit

    // ─── Build where clause ───────────────────────────────────
    // Only show approved profiles — pending, under_review and rejected are never visible
    const where: Record<string, unknown> = { verification_status: 'approved' }

    if (gender)     where.gender           = gender
    if (experience) where.experience_level = experience
    if (country)    where.country          = { contains: country,  mode: 'insensitive' }
    if (state)      where.state            = { contains: state,    mode: 'insensitive' }
    if (city) {
      where.OR = [
        ...(Array.isArray(where.OR) ? where.OR : []),
        { city:  { contains: city, mode: 'insensitive' } },
        { state: { contains: city, mode: 'insensitive' } },
      ]
    }
    if (available === 'true') where.is_available = true

    if (category) where.category = { contains: category, mode: 'insensitive' }
    if (role)     where.role     = { contains: role,     mode: 'insensitive' }

    // Age filter using date_of_birth
    if (ageMin || ageMax) {
      const now = new Date()
      where.date_of_birth = {}
      if (ageMax) {
        (where.date_of_birth as Record<string, Date>).gte = new Date(
          now.getFullYear() - ageMax,
          now.getMonth(),
          now.getDate()
        )
      }
      if (ageMin) {
        (where.date_of_birth as Record<string, Date>).lte = new Date(
          now.getFullYear() - ageMin,
          now.getMonth(),
          now.getDate()
        )
      }
    }

    // Language filter — languages is stored as array
    if (language) {
      where.languages = { has: language }
    }

    // Skills filter — skills is stored as array
    const skillsParam = searchParams.get('skills') || ''
    if (skillsParam) {
      const skillsList = skillsParam.split(',').map(s => s.trim()).filter(Boolean)
      if (skillsList.length > 0) {
        // Match talents that have ANY of the selected skills
        where.skills = { hasSome: skillsList }
      }
    }

    // Keyword search across name, category, role, about_me
    if (keyword) {
      where.OR = [
        { first_name:  { contains: keyword, mode: 'insensitive' } },
        { last_name:   { contains: keyword, mode: 'insensitive' } },
        { category:    { contains: keyword, mode: 'insensitive' } },
        { role:        { contains: keyword, mode: 'insensitive' } },
        { about_me:    { contains: keyword, mode: 'insensitive' } },
      ]
    }

    // ─── Fetch talents ────────────────────────────────────────
    const [talents, total] = await Promise.all([
      prisma.aspirant_profiles.findMany({
        where,
        skip,
        take:    limit,
        orderBy: [
          { trust_score:        'desc' },
          { profile_completion: 'desc' },
          { profile_views:      'desc' },
        ],
        select: {
          id:                  true,
          first_name:          true,
          last_name:           true,
          profile_number:      true,
          gender:              true,
          category:            true,
          role:                true,
          experience_level:    true,
          city:                true,
          state:               true,
          country:             true,
          profile_image_url:   true,
          languages:           true,
          availability:        true,
          is_available:        true,
          verification_status: true,
          trust_score:         true,
          profile_completion:  true,
          profile_views:       true,
          about_me:            true,
          skills:              true,
          rnr_eligible:        true,
          profiles: {
            select: {
              subscriptions: {
                where:   { status: 'active' },
                take:    1,
                select:  { plan_id: true },
              },
            },
          },
        },
      }),
      prisma.aspirant_profiles.count({ where }),
    ])

    // Increment search appearances for returned profiles
    if (talents.length > 0) {
      await prisma.aspirant_profiles.updateMany({
        where: { id: { in: talents.map(t => t.id) } },
        data:  { search_appearances: { increment: 1 } },
      })
    }

    return successResponse({
      talents,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        has_more:    page * limit < total,
      },
    })
  } catch (error: unknown) {
    console.error('[EXPLORE TALENTS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}