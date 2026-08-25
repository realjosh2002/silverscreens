export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/profile/aspirant/submit
// Submits aspirant profile for admin verification

export async function POST(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Fetch profile ─────────────────────────────────────
    const profile = await prisma.aspirant_profiles.findUnique({
      where:   { user_id: user.id },
      include: { aspirant_media: true },
    })

    if (!profile) {
      return errorResponse('Profile not found', 404)
    }

    // ─── 3. Check minimum completion before submission ─────────
    if ((profile.profile_completion ?? 0) < 60) {
      return errorResponse(
        'Your profile must be at least 60% complete before submitting for verification.',
        400
      )
    }

    // ─── 4. Check active subscription ─────────────────────────
    const activeSub = await prisma.subscriptions.findFirst({
      where: { user_id: user.id, status: 'active' },
    })

    if (!activeSub) {
      return errorResponse(
        'An active subscription is required to submit your profile for verification.',
        403
      )
    }

    // ─── 5. Check not already approved ────────────────────────
    if (profile.verification_status === 'approved') {
      return errorResponse('Your profile is already verified.', 409)
    }

    // ─── 6. Submit for verification ───────────────────────────
    await prisma.aspirant_profiles.update({
      where: { user_id: user.id },
      data:  { verification_status: 'pending' },
    })

    // ─── 7. Send notification to user ─────────────────────────
    await (prisma as any).notifications.create({
      data: {
        user_id:    user.id,
        type:       'profile_verified',
        title:      'Profile Submitted for Verification',
        message:    'Your profile has been submitted. Our team will review it within 24-48 hours.',
        action_url: '/dashboard',
      },
    })

    // ─── 8. Log submission ────────────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     user.id,
        action:      'PROFILE_SUBMITTED_FOR_VERIFICATION',
        entity_type: 'aspirant_profiles',
        entity_id:   profile.id,
        ip_address:  req.headers.get('x-forwarded-for') || undefined,
      },
    })

    return successResponse({
      message: 'Profile submitted for verification successfully. You will be notified within 24-48 hours.',
      verification_status: 'pending',
    })
  } catch (error: unknown) {
    console.error('[SUBMIT PROFILE ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
