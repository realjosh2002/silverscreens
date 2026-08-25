export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/profile/agency — get current agency profile
// PUT /api/profile/agency — update agency profile

export async function GET(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Fetch full agency profile ─────────────────────────
    const profile = await prisma.agency_profiles.findUnique({
      where: { user_id: user.id },
      include: {
        profiles: {
          select: {
            name:           true,
            email:          true,
            phone:          true,
            profile_number: true,
            email_verified: true,
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
        casting_calls: {
          where:   { status: { not: 'expired' } },
          orderBy: { created_at: 'desc' },
          take:    5,
          select: {
            id:                   true,
            title:                true,
            status:               true,
            applications_count:   true,
            last_application_date: true,
          },
        },
      },
    })

    if (!profile) {
      return errorResponse('Agency profile not found', 404)
    }

    return successResponse({ profile })
  } catch (error: unknown) {
    console.error('[GET AGENCY PROFILE ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Verify this is an agency ──────────────────────────
    const userProfile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })

    if (!userProfile || userProfile.role !== 'agency') {
      return errorResponse('Only agency accounts can update this profile', 403)
    }

    const body = await req.json()

    const {
      company_name,
      company_type,
      company_size,
      registration_number,
      gst_number,
      pan_number,
      years_of_experience,
      website_url,
      company_description,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      contact_person_name,
      contact_designation,
      contact_email,
      contact_phone,
      show_phone,
      show_email,
      social_links,
      languages,
      genres,
      expertise,
      operating_cities,
      logo_url,
      banner_url,
      gallery_urls,
    } = body

    // ─── 3. Validate required fields ──────────────────────────
    if (company_name !== undefined && !company_name?.trim()) {
      return errorResponse('Company name cannot be empty', 400)
    }

    if (company_description && company_description.length > 2000) {
      return errorResponse('Company description cannot exceed 2000 characters', 400)
    }

    // ─── 4. Build update data ─────────────────────────────────
    const updateData: Record<string, unknown> = { updated_at: new Date() }

    if (company_name        !== undefined) updateData.company_name        = company_name.trim()
    if (registration_number !== undefined) updateData.registration_number = registration_number
    if (gst_number          !== undefined) updateData.gst_number          = gst_number
    if (pan_number          !== undefined) updateData.pan_number          = pan_number
    if (years_of_experience !== undefined) updateData.years_of_experience = years_of_experience
    if (website_url         !== undefined) updateData.website_url         = website_url
    if (company_description !== undefined) updateData.company_description = company_description
    if (address_line1       !== undefined) updateData.address_line1       = address_line1
    if (address_line2       !== undefined) updateData.address_line2       = address_line2
    if (city                !== undefined) updateData.city                = city
    if (state               !== undefined) updateData.state               = state
    if (pincode             !== undefined) updateData.pincode             = pincode
    if (country             !== undefined) updateData.country             = country
    if (contact_person_name !== undefined) updateData.contact_person_name = contact_person_name
    if (contact_email       !== undefined) updateData.contact_email       = contact_email
    if (contact_phone       !== undefined) updateData.contact_phone       = contact_phone
    if (show_phone          !== undefined) updateData.show_phone          = show_phone
    if (show_email          !== undefined) updateData.show_email          = show_email
    if (social_links           !== undefined) updateData.social_links           = social_links
    if (company_type           !== undefined) updateData.company_type           = company_type
    if (company_size           !== undefined) updateData.company_size           = company_size
    if (languages              !== undefined) updateData.languages              = languages
    if (genres                 !== undefined) updateData.genres                 = genres
    if (expertise              !== undefined) updateData.expertise              = expertise
    if (operating_cities       !== undefined) updateData.operating_cities       = operating_cities
    if (logo_url               !== undefined) updateData.logo_url               = logo_url
    if (banner_url             !== undefined) updateData.banner_url             = banner_url
    if (gallery_urls           !== undefined) updateData.gallery_urls           = gallery_urls
    if (contact_designation    !== undefined) updateData.contact_designation    = contact_designation

    // ─── 5. Upsert profile — works for both new and existing agencies ──
    // Check if a profile row already exists
    const existing = await prisma.agency_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true },
    })

    let updated: any
    if (existing) {
      updated = await prisma.agency_profiles.update({
        where: { user_id: user.id },
        data:  updateData as never,
      })
    } else {
      // Create profile row for first-time save
      // Generate a profile number
      const profileNumber = 'AG' + Date.now().toString().slice(-8)
      updated = await prisma.agency_profiles.create({
        data: {
          user_id:        user.id,
          profile_number: profileNumber,
          ...updateData,
        } as never,
      })
    }

    // ─── 6. Update name in profiles table if company name changed
    if (company_name !== undefined) {
      await prisma.profiles.update({
        where: { id: user.id },
        data:  { name: company_name.trim() },
      })
    }

    // ─── 7. Log the update ────────────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     user.id,
        action:      'AGENCY_PROFILE_UPDATED',
        entity_type: 'agency_profiles',
        entity_id:   updated.id,
        new_values:  updateData as any,
      },
    })

    return successResponse({
      message: 'Agency profile updated successfully',
      profile: updated,
    })
  } catch (error: unknown) {
    console.error('[UPDATE AGENCY PROFILE ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
