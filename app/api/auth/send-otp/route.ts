// app/api/auth/send-otp/route.ts
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { sendEmail, otpEmailTemplate } from '@/lib/email'
import { successResponse, errorResponse } from '@/lib/api-helpers'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
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

    // Fetch profile to check current state
    const profile = await prisma.profiles.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, email_verified: true },
    })

    if (!profile) {
      return errorResponse('Profile not found', 404)
    }

    if (profile.email_verified) {
      return successResponse({ message: 'Email already verified' })
    }

    // Rate limit — max 1 OTP per 60 seconds
    const recentOtp = await prisma.otp_verifications.findFirst({
      where: {
        user_id:   profile.id,
        otp_type:  'email_verification',
        is_used:   false,
        created_at: { gte: new Date(Date.now() - 60 * 1000) },
      },
      orderBy: { created_at: 'desc' },
    })

    if (recentOtp) {
      return errorResponse('Please wait 60 seconds before requesting a new OTP', 429)
    }

    // Invalidate all previous unused OTPs for this user
    await prisma.otp_verifications.updateMany({
      where: {
        user_id:  profile.id,
        otp_type: 'email_verification',
        is_used:  false,
      },
      data: { is_used: true },
    })

    // Generate and store new OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.otp_verifications.create({
      data: {
        user_id:    profile.id,
        identifier: profile.email,
        otp_code:   otp,
        otp_type:   'email_verification',
        is_used:    false,
        expires_at: expiresAt,
      },
    })

    // Send email
    const template = otpEmailTemplate(otp, profile.name || undefined)
    await sendEmail({
      to:      profile.email,
      subject: template.subject,
      html:    template.html,
      text:    template.text,
    })

    return successResponse({ message: 'OTP sent to your email' })
  } catch (error: unknown) {
    console.error('[SEND OTP ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}