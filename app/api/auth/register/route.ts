import { NextRequest } from 'next/server'
import { supabaseAdmin, supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  generateProfileNumber,
  isValidEmail,
  isValidPhone,
  isValidPassword,
} from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, password, role } = body

    // ─── 1. Validate required fields ───────────────────────────
    if (!name || !email || !phone || !password || !role) {
      return errorResponse('All fields are required — name, email, phone, password, role', 400)
    }

    if (!['aspirant', 'agency'].includes(role)) {
      return errorResponse('Role must be either aspirant or agency', 400)
    }

    if (!isValidEmail(email)) {
      return errorResponse('Please enter a valid email address', 400)
    }

    if (!isValidPhone(phone)) {
      return errorResponse('Please enter a valid Indian mobile number', 400)
    }

    if (!isValidPassword(password)) {
      return errorResponse(
        'Password must be at least 8 characters and include a letter, number, and special character (@$!%*#?&)',
        400
      )
    }

    // ─── 2. Check if email already exists ──────────────────────
    const existingProfile = await prisma.profiles.findFirst({
      where: { email: email.toLowerCase().trim() },
    })

    if (existingProfile) {
      return errorResponse('An account with this email already exists', 409)
    }

    // ─── 3. Create user in Supabase Auth ───────────────────────
    let userId: string

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: true,
      user_metadata: { name: name.trim(), role, phone },
    })

    if (authError) {
      if (authError.message?.includes('already registered') || authError.message?.includes('already been registered')) {
        // User exists in Supabase but may not have a DB profile — find them
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
        const existing = listData?.users?.find(u => u.email === email.toLowerCase().trim())
        if (!existing) return errorResponse('An account with this email already exists', 409)

        // Check if DB profile exists
        const dbProfile = await prisma.profiles.findUnique({ where: { id: existing.id } })
        if (dbProfile) return errorResponse('An account with this email already exists', 409)

        // Supabase user exists but no DB profile — reset password and continue
        await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
          phone_confirm: true,
        })
        userId = existing.id
      } else {
        return errorResponse(authError.message || 'Failed to create account', 500)
      }
    } else if (!authData.user) {
      return errorResponse('Failed to create account', 500)
    } else {
      userId = authData.user.id
    }

    // ─── 4. Generate unique profile number ─────────────────────
    let profileNumber = generateProfileNumber(role)

    // Ensure uniqueness
    let attempts = 0
    while (attempts < 5) {
      const existing = await prisma.profiles.findFirst({
        where: { profile_number: profileNumber },
      })
      if (!existing) break
      profileNumber = generateProfileNumber(role)
      attempts++
    }

    // ─── 5. Create profile record in database ──────────────────
    const profile = await prisma.profiles.create({
      data: {
        id:             userId,
        name:           name.trim(),
        email:          email.toLowerCase().trim(),
        phone:          phone.trim(),
        role:           role as 'aspirant' | 'agency',
        profile_number: profileNumber,
        email_verified: false,
        phone_verified: false,
        is_active:      true,
      },
    })

    // ─── 6. Create empty aspirant or agency profile shell ──────
    if (role === 'aspirant') {
      await prisma.aspirant_profiles.create({
        data: {
          user_id:    userId,
          first_name: name.trim().split(' ')[0] || name.trim(),
          last_name:  name.trim().split(' ').slice(1).join(' ') || '',
          profile_number: profileNumber,
        },
      })
    } else {
      await prisma.agency_profiles.create({
        data: {
          user_id:          userId,
          company_name:     name.trim(),
          profile_number:   profileNumber,
          contact_person_name: name.trim(),
          contact_email:    email.toLowerCase().trim(),
          contact_phone:    phone.trim(),
        },
      })
    }

    // ─── 7. Log the registration ────────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     userId,
        action:      'USER_REGISTERED',
        entity_type: 'profiles',
        entity_id:   userId,
        new_values:  { name, email, role, profileNumber },
      },
    })

    // ─── 8. Auto sign-in to get session token ──────────────────
    let session = null
    try {
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email:    email.toLowerCase().trim(),
        password,
      })
      session = signInData?.session
    } catch {}

    // ─── 9. Return success ──────────────────────────────────────
    return successResponse(
      {
        userId,
        profileNumber,
        role,
        email:   email.toLowerCase().trim(),
        name:    name.trim(),
        message: 'Account created successfully.',
        session: session ? {
          access_token:  session.access_token,
          refresh_token: session.refresh_token,
          expires_at:    session.expires_at,
        } : null,
      },
      201
    )
  } catch (error: unknown) {
    console.error('[REGISTER ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}