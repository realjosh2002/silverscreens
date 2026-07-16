import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/profile/aspirant — get current aspirant's profile
// PUT /api/profile/aspirant — update aspirant profile

export async function GET(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Fetch full aspirant profile ───────────────────────
    const profile = await prisma.aspirant_profiles.findUnique({
      where: { user_id: user.id },
      include: {
        aspirant_media: {
          orderBy: { order_index: 'asc' },
        },
        profiles: {
          select: {
            name:           true,
            email:          true,
            phone:          true,
            profile_number: true,
            email_verified: true,
            phone_verified: true,
            subscriptions: {
              where:   { status: 'active' },
              take:    1,
              orderBy: { created_at: 'desc' },
              select: {
                plan_name: true,
                plan_id:   true,
                ends_at:   true,
                status:    true,
              },
            },
          },
        },
      },
    })

    if (!profile) {
      return errorResponse('Aspirant profile not found', 404)
    }

    return successResponse({ profile })
  } catch (error: unknown) {
    console.error('[GET ASPIRANT PROFILE ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Verify this is an aspirant ────────────────────────
    const userProfile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })

    if (!userProfile || userProfile.role !== 'aspirant') {
      return errorResponse('Only aspirant accounts can update this profile', 403)
    }

    const body = await req.json()

    // ─── 3. Extract allowed fields ────────────────────────────
    const {
      title,
      first_name,
      last_name,
      gender,
      date_of_birth,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      height_cm,
      weight_kg,
      hair_color,
      eye_color,
      body_tone,
      body_type,
      chest_size,
      hip_size,
      waist_size,
      shoe_size,
      languages,
      availability,
      about_me,
      category,
      role,
      experience_level,
      social_links,
      is_available,
    } = body

    // ─── 4. Validate required fields ──────────────────────────
    if (first_name !== undefined && !first_name?.trim()) {
      return errorResponse('First name cannot be empty', 400)
    }

    if (about_me && about_me.length > 1000) {
      return errorResponse('About me cannot exceed 1000 characters', 400)
    }

    // ─── 5. Build update data ─────────────────────────────────
    const updateData: Record<string, unknown> = { updated_at: new Date() }

    if (title          !== undefined) updateData.title          = title
    if (first_name     !== undefined) updateData.first_name     = first_name.trim()
    if (last_name      !== undefined) updateData.last_name      = last_name.trim()
    if (gender !== undefined) {
  const validGenders = ['Male', 'Female', 'Others', 'Any']
  const normalised = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
  if (!validGenders.includes(normalised)) {
    return errorResponse('Gender must be Male, Female, Others or Any', 400)
  }
  updateData.gender = normalised
}
    if (date_of_birth  !== undefined) updateData.date_of_birth  = new Date(date_of_birth)
    if (address_line1  !== undefined) updateData.address_line1  = address_line1
    if (address_line2  !== undefined) updateData.address_line2  = address_line2
    if (city           !== undefined) updateData.city           = city
    if (state          !== undefined) updateData.state          = state
    if (pincode        !== undefined) updateData.pincode        = pincode
    if (country        !== undefined) updateData.country        = country
    if (height_cm      !== undefined) updateData.height_cm      = height_cm
    if (weight_kg      !== undefined) updateData.weight_kg      = weight_kg
    if (hair_color     !== undefined) updateData.hair_color     = hair_color
    if (eye_color      !== undefined) updateData.eye_color      = eye_color
    if (body_tone      !== undefined) updateData.body_tone      = body_tone
    if (body_type      !== undefined) updateData.body_type      = body_type
    if (chest_size     !== undefined) updateData.chest_size     = chest_size
    if (hip_size       !== undefined) updateData.hip_size       = hip_size
    if (waist_size     !== undefined) updateData.waist_size     = waist_size
    if (shoe_size      !== undefined) updateData.shoe_size      = shoe_size
    if (languages      !== undefined) updateData.languages      = languages
    if (availability   !== undefined) updateData.availability   = availability
    if (about_me       !== undefined) updateData.about_me       = about_me
    if (category       !== undefined) updateData.category       = category
    if (role           !== undefined) updateData.role           = role
    if (experience_level !== undefined) updateData.experience_level = experience_level
    if (social_links   !== undefined) updateData.social_links   = social_links
    if (is_available   !== undefined) updateData.is_available   = is_available

    // ─── 6. Calculate profile completion percentage ────────────
    const currentProfile = await prisma.aspirant_profiles.findUnique({
      where:   { user_id: user.id },
      include: { aspirant_media: true },
    })

    if (!currentProfile) {
      return errorResponse('Profile not found', 404)
    }

    const merged = { ...currentProfile, ...updateData }
    const completion = calculateCompletion(merged)
    updateData.profile_completion = completion

    // ─── 7. Update profile ────────────────────────────────────
    const updated = await prisma.aspirant_profiles.update({
      where: { user_id: user.id },
      data:  updateData as never,
    })

    // ─── 8. Also update name in profiles table if name changed
    if (first_name !== undefined || last_name !== undefined) {
      const fullName = `${first_name ?? currentProfile.first_name} ${last_name ?? currentProfile.last_name}`.trim()
      await prisma.profiles.update({
        where: { id: user.id },
        data:  { name: fullName },
      })
    }

    // ─── 9. Log the update (non-blocking) ────────────────────
    prisma.audit_logs.create({
      data: {
        user_id:     user.id,
        action:      'PROFILE_UPDATED',
        entity_type: 'aspirant_profiles',
        entity_id:   updated.id,
        new_values:  { profile_completion: completion },
      },
    }).catch(() => {})

    return successResponse({
      message:            'Profile updated successfully',
      profile_completion: completion,
      profile:            updated,
    })
  } catch (error: unknown) {
    console.error('[UPDATE ASPIRANT PROFILE ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

// ─── Helper: Calculate profile completion % ───────────────────
function calculateCompletion(profile: Record<string, unknown>): number {
  const fields = [
    { key: 'first_name',      weight: 5  },
    { key: 'last_name',       weight: 5  },
    { key: 'gender',          weight: 5  },
    { key: 'date_of_birth',   weight: 5  },
    { key: 'address_line1',   weight: 5  },
    { key: 'city',            weight: 5  },
    { key: 'state',           weight: 5  },
    { key: 'country',         weight: 5  },
    { key: 'height_cm',       weight: 5  },
    { key: 'weight_kg',       weight: 5  },
    { key: 'hair_color',      weight: 3  },
    { key: 'eye_color',       weight: 3  },
    { key: 'body_type',       weight: 3  },
    { key: 'languages',       weight: 5  },
    { key: 'availability',    weight: 5  },
    { key: 'about_me',        weight: 8  },
    { key: 'category',        weight: 8  },
    { key: 'profile_image_url', weight: 8 },
    { key: 'intro_video_url', weight: 5  },
    { key: 'resume_url',      weight: 5  },
    { key: 'social_links',    weight: 2  },
  ]

  let total = 0
  let earned = 0

  for (const field of fields) {
    total += field.weight
    const val = profile[field.key]
    const hasValue =
      val !== null &&
      val !== undefined &&
      val !== '' &&
      !(Array.isArray(val) && val.length === 0) &&
      !(typeof val === 'object' && !Array.isArray(val) && Object.keys(val as object).length === 0)

    if (hasValue) earned += field.weight
  }

  return Math.round((earned / total) * 100)
}