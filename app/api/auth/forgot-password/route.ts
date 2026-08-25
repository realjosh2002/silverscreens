import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import {
  successResponse,
  errorResponse,
  generateOTP,
  otpExpiresAt,
  isValidEmail,
  maskEmail,
} from '@/lib/api-helpers'
import { sendEmail } from '@/lib/email'

// Helper to run a promise with a timeout
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ])
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    // ─── 1. Validate ───────────────────────────────────────────
    if (!email) return errorResponse('Email address is required', 400)
    if (!isValidEmail(email)) return errorResponse('Please enter a valid email address', 400)

    const cleanEmail = email.toLowerCase().trim()

    // ─── 2. Check if account exists ────────────────────────────
    const profile = await prisma.profiles.findFirst({
      where:  { email: cleanEmail },
      select: { id: true, email: true, name: true, is_active: true },
    })

    // Security: always return success even if email not found
    if (!profile) {
      return successResponse({ message: 'If an account exists with this email, a reset link has been sent.' })
    }

    if (!profile.is_active) {
      return errorResponse('This account has been suspended. Please contact support.', 403)
    }

    // ─── 3. Generate OTP ───────────────────────────────────────
    const otpCode   = generateOTP()
    const expiresAt = otpExpiresAt()

    // ─── 4. Invalidate existing OTPs ───────────────────────────
    await prisma.otp_verifications.updateMany({
      where: { identifier: cleanEmail, otp_type: 'forgot_password', is_used: false },
      data:  { is_used: true },
    })

    // ─── 5. Save new OTP ───────────────────────────────────────
    await prisma.otp_verifications.create({
      data: {
        user_id:    profile.id,
        identifier: cleanEmail,
        otp_code:   otpCode,
        otp_type:   'forgot_password',
        expires_at: expiresAt,
      },
    })

    // ─── 6. Generate Supabase reset link (with timeout) ────────
    const appUrl   = process.env.NEXT_PUBLIC_APP_URL || 'https://silverscreens.com'
    let resetUrl   = `${appUrl}/reset-password?otp=${otpCode}&email=${encodeURIComponent(cleanEmail)}`

    try {
      const linkResult = await withTimeout(
        supabaseAdmin.auth.admin.generateLink({ type: 'recovery', email: cleanEmail }),
        5000, // 5 second timeout
        { data: null, error: new Error('timeout') } as any
      )
      const actionLink = (linkResult as any)?.data?.properties?.action_link
      if (actionLink) resetUrl = actionLink
    } catch (e) {
      console.warn('[FORGOT PASSWORD] Supabase link generation skipped:', e)
      // Fall back to OTP-based reset URL — that's fine
    }

    // ─── 7. Send email (with timeout) ──────────────────────────
    const firstName = profile.name?.split(' ')[0] || 'there'

    const emailSent = await withTimeout(
      sendEmail({
        to:      cleanEmail,
        subject: 'Reset Your SilverScreens Password',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:0;background:#050505;color:#F5F5F5;border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#0B0F14,#1A1A2E);padding:32px 32px 24px;text-align:center;border-bottom:2px solid #D4A64A;">
              <h1 style="font-family:sans-serif;font-size:28px;letter-spacing:4px;color:#F5F5F5;margin:0 0 4px;">
                SILVER <span style="color:#C8202A;">SCREENS</span>
              </h1>
              <p style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:3px;margin:0;text-transform:uppercase;">We Make Celebrities</p>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#D4A64A;font-size:22px;margin:0 0 8px;">Reset Your Password</h2>
              <p style="color:rgba(255,255,255,0.65);font-size:15px;line-height:1.6;margin:0 0 24px;">
                Hi ${firstName},<br/><br/>
                We received a request to reset your SilverScreens password. Click the button below to set a new password.
              </p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${resetUrl}" style="display:inline-block;background:#C8202A;color:#ffffff;font-size:16px;font-weight:700;letter-spacing:1px;padding:14px 36px;border-radius:8px;text-decoration:none;text-transform:uppercase;">
                  Reset My Password
                </a>
              </div>
              <div style="background:#121821;border:1px solid rgba(212,166,74,0.2);border-radius:10px;padding:20px;margin:24px 0;text-align:center;">
                <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Or use this one-time code</p>
                <span style="font-size:36px;font-weight:900;letter-spacing:10px;color:#D4A64A;">${otpCode}</span>
                <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:8px 0 0;">Valid for 10 minutes only</p>
              </div>
              <p style="color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;margin:0;">
                If you didn't request this, you can safely ignore this email — your password will not change.<br/><br/>
                This link expires in <strong style="color:#fff;">24 hours</strong>.
              </p>
            </div>
            <div style="background:#0B0F14;padding:20px 32px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
              <p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">
                © ${new Date().getFullYear()} SilverScreens Media Pvt. Ltd. · Chennai, Tamil Nadu, India
              </p>
            </div>
          </div>
        `,
        text: `Hi ${firstName},\n\nReset your SilverScreens password:\n${resetUrl}\n\nOr use OTP: ${otpCode} (valid 10 mins)\n\nIf you didn't request this, ignore this email.\n\n© ${new Date().getFullYear()} SilverScreens`,
      }),
      10000, // 10 second timeout
      false
    )

    console.log(`[FORGOT PASSWORD] email=${maskEmail(cleanEmail)} sent=${emailSent}`)

    // ─── 8. Always return — no hanging ─────────────────────────
    return successResponse({
      message:      'If an account exists with this email, a reset link has been sent.',
      masked_email: maskEmail(cleanEmail),
      ...(process.env.NODE_ENV === 'development' && {
        dev_otp:        otpCode,
        dev_reset_url:  resetUrl,
        dev_email_sent: emailSent,
      }),
    })

  } catch (error: unknown) {
    console.error('[FORGOT PASSWORD ERROR]', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}