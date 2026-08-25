export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, isValidPassword } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, otp_code, new_password, confirm_password } = body

    // ─── 1. Validate inputs ────────────────────────────────────
    if (!email || !otp_code || !new_password || !confirm_password) {
      return errorResponse('All fields are required', 400)
    }

    if (new_password !== confirm_password) {
      return errorResponse('Passwords do not match', 400)
    }

    if (!isValidPassword(new_password)) {
      return errorResponse(
        'Password must be at least 8 characters and include a letter, number, and special character (@$!%*#?&)',
        400
      )
    }

    // ─── 2. Find and validate OTP ──────────────────────────────
    const otpRecord = await prisma.otp_verifications.findFirst({
      where: {
        identifier: email.toLowerCase().trim(),
        otp_code:   otp_code.trim(),
        otp_type:   'forgot_password',
        is_used:    false,
      },
      orderBy: { created_at: 'desc' },
    })

    if (!otpRecord) {
      return errorResponse('Invalid OTP code. Please request a new one.', 400)
    }

    // ─── 3. Check OTP expiry ───────────────────────────────────
    if (new Date() > otpRecord.expires_at) {
      return errorResponse('OTP has expired. Please request a new one.', 400)
    }

    // ─── 4. Find the user profile ──────────────────────────────
    const profile = await prisma.profiles.findFirst({
      where: { email: email.toLowerCase().trim() },
      select: { id: true },
    })

    if (!profile) {
      return errorResponse('Account not found', 404)
    }

    // ─── 5. Update password in Supabase Auth ───────────────────
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      profile.id,
      { password: new_password }
    )

    if (updateError) {
      return errorResponse('Failed to update password. Please try again.', 500)
    }

    // ─── 6. Mark OTP as used ───────────────────────────────────
    await prisma.otp_verifications.update({
      where: { id: otpRecord.id },
      data:  { is_used: true },
    })

    // ─── 7. Invalidate all other OTPs for this user ────────────
    await prisma.otp_verifications.updateMany({
      where: {
        identifier: email.toLowerCase().trim(),
        is_used:    false,
      },
      data: { is_used: true },
    })

    // ─── 8. Log the password reset ─────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     profile.id,
        action:      'PASSWORD_RESET',
        entity_type: 'profiles',
        entity_id:   profile.id,
        ip_address:  req.headers.get('x-forwarded-for') || undefined,
        user_agent:  req.headers.get('user-agent') || undefined,
      },
    })

    return successResponse({
      message: 'Password reset successfully. Please login with your new password.',
    })
  } catch (error: unknown) {
    console.error('[RESET PASSWORD ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
