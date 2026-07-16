// app/api/auth/verify-otp/route.ts
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    const { otp } = await req.json()

    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      return errorResponse('Please enter a valid 6-digit OTP', 400)
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    const profile = await prisma.profiles.findUnique({
      where: { id: user.id },
      select: { id: true, email_verified: true },
    })

    if (!profile) {
      return errorResponse('Profile not found', 404)
    }

    if (profile.email_verified) {
      return successResponse({ message: 'Email already verified' })
    }

    // Find valid OTP
    const otpRecord = await prisma.otp_verifications.findFirst({
      where: {
        user_id:   profile.id,
        otp_type:  'email_verification',
        otp_code:  otp,
        is_used:   false,
        expires_at: { gte: new Date() },
      },
    })

    if (!otpRecord) {
      return errorResponse('Invalid or expired OTP. Please request a new one.', 400)
    }

    // Mark OTP as used + mark profile email verified — in a transaction
    await prisma.$transaction([
      prisma.otp_verifications.update({
        where: { id: otpRecord.id },
        data:  { is_used: true },
      }),
      prisma.profiles.update({
        where: { id: profile.id },
        data:  { email_verified: true },
      }),
    ])

    // Also confirm in Supabase auth.users so Supabase's own checks pass
    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    })

    // Log the verification
    await prisma.audit_logs.create({
      data: {
        user_id:     profile.id,
        action:      'EMAIL_VERIFIED',
        entity_type: 'profiles',
        entity_id:   profile.id,
      },
    })

    return successResponse({ message: 'Email verified successfully', verified: true })
  } catch (error: unknown) {
    console.error('[VERIFY OTP ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}