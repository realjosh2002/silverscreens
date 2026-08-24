// app/api/auth/send-otp/route.ts
import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail, otpEmailTemplate } from '@/lib/email'
import { successResponse, errorResponse } from '@/lib/api-helpers'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = body.email?.toLowerCase().trim()

    if (!email)
      return errorResponse('Email is required', 400)

    // Find auth user by email
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    const authUser = listData?.users?.find(u => u.email === email)
    if (!authUser)
      return errorResponse('Account not found', 404)

    // Rate limit — check last OTP send time from user metadata
    const lastSent = authUser.user_metadata?.pending_otp_expiry
    if (lastSent) {
      const expiry = new Date(lastSent).getTime()
      const sentAt = expiry - 10 * 60 * 1000
      if (Date.now() - sentAt < 60 * 1000)
        return errorResponse('Please wait 60 seconds before requesting a new OTP', 429)
    }

    // Generate new OTP and store in user metadata
    const otp       = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      user_metadata: {
        ...authUser.user_metadata,
        pending_otp:        otp,
        pending_otp_expiry: expiresAt,
      },
    })

    // Send email
    const name     = authUser.user_metadata?.name || undefined
    const template = otpEmailTemplate(otp, name)
    await sendEmail({
      to:      email,
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