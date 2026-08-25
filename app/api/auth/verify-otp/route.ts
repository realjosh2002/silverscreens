export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// app/api/auth/verify-otp/route.ts
import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, generateProfileNumber } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    const { otp, email } = await req.json()

    if (!otp || typeof otp !== 'string' || otp.length !== 6)
      return errorResponse('Please enter a valid 6-digit OTP', 400)
    if (!email)
      return errorResponse('Email is required', 400)

    const normalizedEmail = email.toLowerCase().trim()

    // ─── 1. Find auth user by email ────────────────────────────
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    const authUser = listData?.users?.find(u => u.email === normalizedEmail)
    if (!authUser)
      return errorResponse('Account not found', 404)

    // ─── 2. Check if already verified (profiles row exists) ────
    const existingProfile = await prisma.profiles.findUnique({ where: { id: authUser.id } })
    if (existingProfile?.email_verified) {
      // Already verified — just return session
      const { data: signIn } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink', email: normalizedEmail,
      })
      return successResponse({ message: 'Already verified', verified: true })
    }

    // ─── 3. Verify OTP from user metadata ──────────────────────
    const meta        = authUser.user_metadata ?? {}
    const storedOtp   = meta.pending_otp
    const otpExpiry   = meta.pending_otp_expiry

    console.log('[VERIFY OTP DEBUG] User ID:', authUser.id)
    console.log('[VERIFY OTP DEBUG] OTP entered:', otp)
    console.log('[VERIFY OTP DEBUG] Stored OTP:', storedOtp)
    console.log('[VERIFY OTP DEBUG] OTP expiry:', otpExpiry)

    if (!storedOtp || !otpExpiry)
      return errorResponse('No OTP found. Please request a new one.', 400)

    if (new Date() > new Date(otpExpiry))
      return errorResponse('OTP has expired. Please request a new one.', 400)

    if (storedOtp !== otp)
      return errorResponse('Invalid OTP. Please try again.', 400)

    // ─── 4. Clear OTP from metadata ────────────────────────────
    await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      user_metadata: {
        ...meta,
        pending_otp:        null,
        pending_otp_expiry: null,
      },
    })

    // ─── 5. Get user metadata stored at registration ───────────
    const role  = meta.role  || 'aspirant'
    const name  = meta.name  || ''
    const phone = meta.phone || ''

    // ─── 6. Generate unique profile number ─────────────────────
    let profileNumber = generateProfileNumber(role)
    let attempts = 0
    while (attempts < 5) {
      const existing = await prisma.profiles.findFirst({ where: { profile_number: profileNumber } })
      if (!existing) break
      profileNumber = generateProfileNumber(role)
      attempts++
    }

    // ─── 7. Create profiles row NOW (after OTP verified) ───────
    const profile = await prisma.profiles.create({
      data: {
        id:             authUser.id,
        name,
        email:          normalizedEmail,
        phone,
        role:           role as 'aspirant' | 'agency',
        profile_number: profileNumber,
        email_verified: true,
        phone_verified: false,
        is_active:      true,
      },
    })

    // ─── 8. Create agency shell if agency ──────────────────────
    if (role === 'agency') {
      await prisma.agency_profiles.create({
        data: {
          user_id:             authUser.id,
          company_name:        name,
          profile_number:      profileNumber,
          contact_person_name: name,
          contact_email:       normalizedEmail,
          contact_phone:       phone,
        },
      })
    }

    // ─── 9. Confirm email in Supabase auth ─────────────────────
    await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      email_confirm: true,
    })

    // ─── 10. Log ───────────────────────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     authUser.id,
        action:      'EMAIL_VERIFIED',
        entity_type: 'profiles',
        entity_id:   authUser.id,
        new_values:  { profileNumber, role },
      },
    })

    // ─── 11. Sign in to get session token ──────────────────────
    // Use the client supabase to sign in and get a real session
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    // We can't sign in with password here as we don't have it
    // Return without token — signup page will handle login separately
    return successResponse({
      message:       'Email verified successfully',
      verified:      true,
      profileNumber,
      role,
      name,
      email:         normalizedEmail,
      token:         null,
      refresh_token: null,
    })
  } catch (error: unknown) {
    console.error('[VERIFY OTP ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
