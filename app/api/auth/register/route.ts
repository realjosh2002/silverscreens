export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import {
  successResponse, errorResponse,
  isValidEmail, isValidPhone, isValidPassword,
} from '@/lib/api-helpers'
import { sendEmail, otpEmailTemplate } from '@/lib/email'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, password, role } = body

    // ─── 1. Validate ───────────────────────────────────────────
    if (!name || !email || !phone || !password || !role)
      return errorResponse('All fields are required', 400)
    if (!['aspirant', 'agency'].includes(role))
      return errorResponse('Role must be aspirant or agency', 400)
    if (!isValidEmail(email))
      return errorResponse('Please enter a valid email address', 400)
    if (!isValidPhone(phone))
      return errorResponse('Please enter a valid Indian mobile number', 400)
    if (!isValidPassword(password))
      return errorResponse('Password must be at least 8 characters and include a letter, number, and special character (@$!%*#?&)', 400)

    const normalizedEmail = email.toLowerCase().trim()

    // ─── 2. Check if verified account already exists ───────────
    const existingProfile = await prisma.profiles.findFirst({
      where: { email: normalizedEmail },
    })
    if (existingProfile)
      return errorResponse('An account with this email already exists', 409)

    // ─── 3. Handle orphaned auth user (registered but never verified) ──
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    const existingAuthUser = listData?.users?.find(u => u.email === normalizedEmail)
    if (existingAuthUser) {
      try {
        await prisma.audit_logs.deleteMany({ where: { user_id: existingAuthUser.id } })
        console.log('[REGISTER] Deleted audit_logs for orphaned user:', existingAuthUser.id)
      } catch (e) { console.error('[REGISTER] Failed to delete audit_logs:', e) }
      try {
        await prisma.otp_verifications.deleteMany({ where: { user_id: existingAuthUser.id } })
        console.log('[REGISTER] Deleted otp_verifications for orphaned user:', existingAuthUser.id)
      } catch (e) { console.error('[REGISTER] Failed to delete otp_verifications:', e) }
      const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
      if (delError) console.error('[REGISTER] Failed to delete auth user:', delError)
      else console.log('[REGISTER] Deleted orphaned auth user:', existingAuthUser.id)
    }

    // ─── 4. Create Supabase auth user ONLY — no profiles row yet ──
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email:         normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { name: name.trim(), role, phone },
    })

    if (authError || !authData.user)
      return errorResponse(authError?.message || 'Failed to create account', 500)

    const userId = authData.user.id

    // ─── 5. Generate OTP and store in user metadata ────────────
    // Can't use otp_verifications table yet — profiles row doesn't exist (FK constraint)
    // Store OTP temporarily in Supabase auth user metadata
    const otp       = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...authData.user.user_metadata,
        pending_otp:        otp,
        pending_otp_expiry: expiresAt,
      },
    })

    // ─── 6. Send OTP email ─────────────────────────────────────
    const template = otpEmailTemplate(otp, name.trim())
    await sendEmail({
      to:      normalizedEmail,
      subject: template.subject,
      html:    template.html,
      text:    template.text,
    })

    // ─── 7. Sign in to get session token ──────────────────────
    const { data: signInData } = await supabaseAdmin.auth.admin.generateLink({
      type:  'magiclink',
      email: normalizedEmail,
    })

    // Return minimal info — profiles row created only after OTP verified
    return successResponse({
      userId,
      email:   normalizedEmail,
      name:    name.trim(),
      role,
      phone:   phone.trim(),
      message: 'Account created. Please verify your email.',
      session: null,
    }, 201)
  } catch (error: unknown) {
    console.error('[REGISTER ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
