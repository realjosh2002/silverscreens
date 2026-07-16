import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  generateOTP,
  otpExpiresAt,
  isValidEmail,
  maskEmail,
} from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    // ─── 1. Validate ───────────────────────────────────────────
    if (!email) {
      return errorResponse('Email address is required', 400)
    }

    if (!isValidEmail(email)) {
      return errorResponse('Please enter a valid email address', 400)
    }

    // ─── 2. Check if account exists ────────────────────────────
    const profile = await prisma.profiles.findFirst({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, name: true, is_active: true },
    })

    // Security: always return success even if email not found
    // This prevents email enumeration attacks
    if (!profile) {
      return successResponse({
        message: 'If an account exists with this email, a reset link has been sent.',
      })
    }

    if (!profile.is_active) {
      return errorResponse('This account has been suspended. Please contact support.', 403)
    }

    // ─── 3. Generate OTP ───────────────────────────────────────
    const otpCode  = generateOTP()
    const expiresAt = otpExpiresAt()

    // ─── 4. Invalidate any existing OTPs for this user ─────────
    await prisma.otp_verifications.updateMany({
      where: {
        identifier: email.toLowerCase().trim(),
        otp_type:   'forgot_password',
        is_used:    false,
      },
      data: { is_used: true },
    })

    // ─── 5. Save new OTP to database ───────────────────────────
    await prisma.otp_verifications.create({
      data: {
        user_id:    profile.id,
        identifier: email.toLowerCase().trim(),
        otp_code:   otpCode,
        otp_type:   'forgot_password',
        expires_at: expiresAt,
      },
    })

    // ─── 6. Send password reset email via Supabase ─────────────
    // Supabase handles the actual email delivery
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type:  'recovery',
      email: email.toLowerCase().trim(),
    })

    if (resetError) {
      console.error('[FORGOT PASSWORD] Supabase reset error:', resetError)
      // Still proceed — OTP is saved, email may still go through
    }

    // ─── 7. Return success ─────────────────────────────────────
    return successResponse({
      message:       'If an account exists with this email, a reset link has been sent.',
      masked_email:  maskEmail(email),
      // Only include OTP in development for testing
      ...(process.env.NODE_ENV === 'development' && { dev_otp: otpCode }),
    })
  } catch (error: unknown) {
    console.error('[FORGOT PASSWORD ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}