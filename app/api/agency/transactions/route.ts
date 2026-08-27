import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/agency/transactions
// Returns all payment transactions for the logged-in agency user, newest first

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

    // ─── 3. Fetch all transactions for this user ──────────────
    const transactions = await prisma.payment_transactions.findMany({
      where:   { user_id: user.id },
      orderBy: { created_at: 'desc' },
      select: {
        id:                  true,
        plan_key:            true,
        plan_name:           true,
        amount:              true,
        gst_amount:          true,
        total_amount:        true,
        currency:            true,
        payment_method:      true,
        gateway_status:      true,
        failure_reason:      true,
        coupon_code:         true,
        discount_amount:     true,
        razorpay_order_id:   true,
        razorpay_payment_id: true,
        with_rnr_addon:      true,
        rnr_amount:          true,
        created_at:          true,
      },
    })

    return successResponse({ data: transactions })
  } catch (error: unknown) {
    console.error('[GET AGENCY TRANSACTIONS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}