export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/agency/subscription
// Returns the active (or most recent) subscription for the logged-in agency user

export async function GET(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Verify agency role ────────────────────────────────
    const profile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })

    if (!profile || profile.role !== 'agency') {
      return errorResponse('Agency account required', 403)
    }

    // ─── 3. Fetch active subscription first, else most recent ─
    const subscription = await prisma.subscriptions.findFirst({
      where:   { user_id: user.id },
      orderBy: [
        { status:     'asc' },  // 'active' sorts before others alphabetically
        { created_at: 'desc' },
      ],
      select: {
        id:           true,
        plan_id:      true,
        plan_name:    true,
        status:       true,
        amount:       true,
        gst_amount:   true,
        total_amount: true,
        currency:     true,
        starts_at:    true,
        ends_at:      true,
        payment_method:     true,
        gateway_status:     true,
        razorpay_order_id:  true,
        razorpay_payment_id: true,
        created_at:   true,
      },
    })

    // No subscription found — return null data, not an error
    // so the page can handle the "no active plan" state gracefully
    if (!subscription) {
      return successResponse({ data: null })
    }

    return successResponse({ data: subscription })
  } catch (error: unknown) {
    console.error('[GET AGENCY SUBSCRIPTION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
