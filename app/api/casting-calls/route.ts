import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/casting-calls — public list with filters
// POST /api/casting-calls — agency creates a new casting call

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const keyword       = searchParams.get('keyword')        || ''
    const category      = searchParams.get('category')       || ''
    const role          = searchParams.get('role')            || ''
    const gender        = searchParams.get('gender')          || ''
    const location      = searchParams.get('location')       || ''
    const experience    = searchParams.get('experience')     || ''
    const agencyUserId  = searchParams.get('agency_user_id') || ''
    const page          = parseInt(searchParams.get('page')  || '1')
    const limit         = parseInt(searchParams.get('limit') || '12')
    const skip          = (page - 1) * limit

    // When admin views a specific agency's profile, filter by that agency
    let agencyProfileId: string | null = null
    if (agencyUserId) {
      const agencyProfile = await prisma.agency_profiles.findUnique({
        where:  { user_id: agencyUserId },
        select: { id: true },
      })
      agencyProfileId = agencyProfile?.id ?? null
    }
    // When logged-in agency views their own dashboard, auto-filter by their profile
    if (!agencyProfileId) {
      const token = req.headers.get('authorization')?.replace('Bearer ', '')
      if (token) {
        const { data: { user } } = await supabaseAdmin.auth.getUser(token)
        if (user) {
          const profile = await prisma.profiles.findUnique({
            where:  { id: user.id },
            select: { role: true },
          })
          if (profile?.role === 'agency') {
            const agencyProfile = await prisma.agency_profiles.findUnique({
              where:  { user_id: user.id },
              select: { id: true },
            })
            if (agencyProfile?.id) {
              agencyProfileId = agencyProfile.id
            } else {
              // Agency logged in but no profile yet — return empty, not all castings
              return successResponse({
                casting_calls: [],
                pagination: { page, limit, total: 0, total_pages: 0, has_more: false },
              })
            }
          }
        }
      }
    }

    // If filtering by agency, show all statuses; otherwise only active
    const where: Record<string, unknown> = agencyProfileId
      ? { agency_id: agencyProfileId }
      : { status: 'active' }

    if (keyword) {
      where.OR = [
        { title:            { contains: keyword, mode: 'insensitive' } },
        { role_name:        { contains: keyword, mode: 'insensitive' } },
        { project_type:     { contains: keyword, mode: 'insensitive' } },
        { role_description: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    if (category)   where.category          = { contains: category,   mode: 'insensitive' }
    if (role)       where.role_name         = { contains: role,        mode: 'insensitive' }
    if (gender)     where.gender_preference = gender
    if (experience) where.experience_level  = experience
    if (location)   where.location          = { contains: location, mode: 'insensitive' }

    const [castingCalls, total] = await Promise.all([
      prisma.casting_calls.findMany({
        where,
        skip,
        take:    limit,
        orderBy: { created_at: 'desc' },
        include: {
          agency_profiles: {
            select: {
              id:                  true,
              company_name:        true,
              verification_status: true,
              logo_url:            true,
              city:                true,
              state:               true,
            },
          },
          _count: { select: { applications: true } },
        },
      }),
      prisma.casting_calls.count({ where }),
    ])

    return successResponse({
      casting_calls: castingCalls,
      pagination: {
        page, limit, total,
        total_pages: Math.ceil(total / limit),
        has_more:    page * limit < total,
      },
    })
  } catch (error: unknown) {
    console.error('[GET CASTING CALLS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // 2. Verify agency role
    const userProfile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })

    if (!userProfile || userProfile.role !== 'agency') {
      return errorResponse('Only agency accounts can post casting calls', 403)
    }

    // 3. Check active subscription
    const activeSub = await prisma.subscriptions.findFirst({
      where: { user_id: user.id, status: 'active' },
    })

    if (!activeSub) {
      return errorResponse('An active subscription is required to post casting calls', 403)
    }

    // 4. Get agency profile
    const agencyProfile = await prisma.agency_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true, verification_status: true },
    })

    if (!agencyProfile) return errorResponse('Agency profile not found', 404)

    if (agencyProfile.verification_status !== 'approved') {
      return errorResponse('Your agency profile must be verified before posting casting calls', 403)
    }

    const body = await req.json()

    // ── Destructure all fields the form sends ──────────────────
    const {
      title,
      projectTitle,
      project_type,
      projectType,
      department,
      role_name,
      role,
      roleType,
      shortDescription,
      gender_preference,
      gender,
      ageFrom,
      age_min,
      ageTo,
      age_max,
      experience,
      experience_level,
      roleDescription,
      role_description,
      skills,
      skills_required,
      languages,
      languages_required,
      projectStatus,
      shootStart,
      shootEnd,
      shootLocation,
      location,
      hasSponsor,
      auditionFormat,
      audition_mode,
      auditionTimeFrom,
      auditionTimeTo,
      auditionStart,
      auditionEnd,
      auditionLocationType,
      auditionAddress,
      auditionInstructions,
      audition_details,
      contactName,
      contactEmail,
      contactMobile,
      howToApply,
      compensationType,
      compensationDetail,
      compensation_details,
      amount,
      budget_min,
      budget_max,
      currency,
      paymentTerms,
      additionalRequirements,
      eligibility_criteria,
      last_application_date,
      deadline,
      category,
      is_draft = false,
      status,
    } = body

    // 5. Validate required fields
    const resolvedTitle       = title?.trim() || ''
    const resolvedProjectType = (project_type || projectType || '')?.trim()
    const resolvedRoleName    = (role_name || role || roleType || '')?.trim()

    if (!resolvedTitle)       return errorResponse('Title is required', 400)
    if (!resolvedProjectType) return errorResponse('Project type is required', 400)
    if (!resolvedRoleName)    return errorResponse('Role name is required', 400)

    // Resolve deadline
    const resolvedDeadline = last_application_date || deadline || auditionEnd
    const defaultDeadline  = new Date()
    defaultDeadline.setDate(defaultDeadline.getDate() + 30)
    const deadlineDate = resolvedDeadline ? new Date(resolvedDeadline) : defaultDeadline

    // Resolve age
    const resolvedAgeMin = age_min || (ageFrom ? parseInt(ageFrom) : null) || null
    const resolvedAgeMax = age_max || (ageTo   ? parseInt(ageTo)   : null) || null

    // Resolve budget
    const resolvedBudgetMin = budget_min || (amount ? parseFloat(amount) : null) || null
    const resolvedBudgetMax = budget_max || (amount ? parseFloat(amount) : null) || null

    // Resolve audition mode
    const resolvedAuditionMode = ['online','offline','both'].includes(audition_mode || auditionFormat?.toLowerCase())
      ? (audition_mode || auditionFormat?.toLowerCase())
      : 'offline'

    // Resolve audition details — combine all audition info
    const auditionInfo = [
      auditionAddress  ? `Location: ${auditionAddress}` : '',
      auditionInstructions ? `Instructions: ${auditionInstructions}` : '',
      auditionTimeFrom && auditionTimeTo ? `Time: ${auditionTimeFrom} - ${auditionTimeTo}` : '',
      auditionStart ? `Start: ${auditionStart}` : '',
    ].filter(Boolean).join(' | ')

    // Resolve compensation details
    const resolvedCompensation = compensation_details || compensationDetail || paymentTerms || ''

    // Resolve eligibility
    const resolvedEligibility = eligibility_criteria || shortDescription || additionalRequirements || ''

    // Resolve location
    const resolvedLocation = location || shootLocation || ''

    // Resolve skills and languages
    const resolvedSkills    = skills_required || skills    || []
    const resolvedLanguages = languages_required || languages || []

    // 6. Create casting call
    const castingCall = await prisma.casting_calls.create({
      data: {
        agency_id:             agencyProfile.id,
        title:                 resolvedTitle,
        project_type:          resolvedProjectType,
        role_name:             resolvedRoleName,
        role_description:      roleDescription || role_description || '',
        eligibility_criteria:  resolvedEligibility,
        gender_preference:     gender_preference || gender || 'Any',
        age_min:               resolvedAgeMin,
        age_max:               resolvedAgeMax,
        experience_level:      experience_level || experience || '',
        skills_required:       resolvedSkills,
        languages_required:    resolvedLanguages,
        budget_min:            resolvedBudgetMin,
        budget_max:            resolvedBudgetMax,
        location:              resolvedLocation,
        audition_mode:         resolvedAuditionMode,
        audition_details:      audition_details || auditionInfo || '',
        compensation_details:  resolvedCompensation,
        last_application_date: deadlineDate,
        category:              category || department || '',
        shoot_start:           shootStart ? new Date(shootStart) : null,
        shoot_end:             shootEnd   ? new Date(shootEnd)   : null,
        audition_start:        auditionStart ? new Date(auditionStart) : null,
        audition_end:          auditionEnd   ? new Date(auditionEnd)   : null,
        audition_time_from:    auditionTimeFrom    || null,
        audition_time_to:      auditionTimeTo      || null,
        audition_location_type: auditionLocationType || null,
        contact_name:          contactName   || null,
        contact_email:         contactEmail  || null,
        contact_mobile:        contactMobile || null,
        project_status:        projectStatus || null,
        how_to_apply:          howToApply    || [],
        has_sponsor:           hasSponsor    || null,
        payment_terms:         paymentTerms  || null,
        status:                (status === 'Draft' || is_draft) ? 'draft' : 'active',
        applications_count:    0,
      },
    })

    // 7. Log creation
    try {
      await supabaseAdmin.from('audit_logs').insert({
        user_id:     user.id,
        action:      is_draft ? 'CASTING_CALL_SAVED_DRAFT' : 'CASTING_CALL_PUBLISHED',
        entity_type: 'casting_calls',
        entity_id:   castingCall.id,
      })
    } catch { /* audit_logs may not exist yet */ }

    // 8. Auto-trigger casting alert notifications to matching aspirants
    //    Only when published (not draft) — fire-and-forget, don't block response
    if (castingCall.status === 'active') {
      const alertUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/notifications/casting-alert?casting_call_id=${castingCall.id}`
      fetch(alertUrl, {
        headers: { 'x-internal-trigger': process.env.INTERNAL_API_SECRET || 'silverscreens-internal' }
      }).catch(err => console.error('[CASTING ALERT TRIGGER ERROR]', err))
    }

    return successResponse({
      message:      is_draft ? 'Casting call saved as draft' : 'Casting call published successfully — matching aspirants will be notified.',
      casting_call: castingCall,
    }, 201)
  } catch (error: unknown) {
    console.error('[CREATE CASTING CALL ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}