import { NextRequest } from 'next/server'
import Razorpay from 'razorpay'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, calculateGST } from '@/lib/api-helpers'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// RingsNRoses addon prices — must match frontend
const RNR_PRICES: Record<string, number> = {
  spotlight: 149,
  star:      250,
  icon:      500,
}

export async function POST(req: NextRequest) {
  try {
    // ─── 1. Authenticate user ──────────────────────────────────
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return errorResponse('Authentication required', 401)
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return errorResponse('Invalid or expired session', 401)
    }

    const body = await req.json()
    const { plan_key, with_rnr_addon = false } = body

    if (!plan_key) {
      return errorResponse('Plan key is required', 400)
    }

    // ─── 2. Fetch plan details from database ───────────────────
    const plan = await prisma.subscription_plans.findUnique({
      where: { plan_key },
    })

    if (!plan || !plan.is_active) {
      return errorResponse('Invalid or inactive plan selected', 400)
    }

    // ─── 3. Check user already has active subscription ─────────
    const activeSub = await prisma.subscriptions.findFirst({
      where: {
        user_id: user.id,
        status:  'active',
      },
    })

    if (activeSub) {
      return errorResponse('You already have an active subscription', 409)
    }

    // ─── 4. Verify user type matches plan type ─────────────────
    const profile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })

    if (!profile) {
      return errorResponse('Profile not found', 404)
    }

    const userType = profile.role === 'agency' ? 'agency' : 'aspirant'
    if (plan.user_type !== userType) {
      return errorResponse('This plan is not available for your account type', 400)
    }

    // ─── 5. Calculate amount ───────────────────────────────────
    const planAmount  = Number(plan.price)
    const rnrAmount   = with_rnr_addon && RNR_PRICES[plan_key] ? RNR_PRICES[plan_key] : 0
    const subtotal    = planAmount + rnrAmount
    const { gst, total } = calculateGST(subtotal)

    // Razorpay amount is in paise (multiply by 100)
    const amountInPaise = total * 100

    // ─── 6. Create Razorpay order ──────────────────────────────
    const order = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: 'INR',
      receipt:  `ss_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id:       user.id,
        plan_key,
        plan_name:     plan.plan_name,
        user_type:     userType,
        with_rnr_addon: String(with_rnr_addon),
      },
    })

    // ─── 7. Create pending subscription record ─────────────────
    const subscription = await prisma.subscriptions.create({
      data: {
        user_id:          user.id,
        plan_id:          plan_key,
        plan_name:        plan.plan_name,
        user_type:        userType,
        amount:           planAmount,
        gst_amount:       gst,
        total_amount:     total,
        currency:         'INR',
        status:           'pending_payment',
        razorpay_order_id: order.id,
      },
    })

    // ─── 8. Create payment transaction record ──────────────────
    await prisma.payment_transactions.create({
      data: {
        user_id:          user.id,
        subscription_id:  subscription.id,
        razorpay_order_id: order.id,
        plan_key,
        plan_name:        plan.plan_name,
        user_type:        userType,
        amount:           planAmount,
        gst_amount:       gst,
        total_amount:     total,
        currency:         'INR',
        gateway_status:   'pending',
        with_rnr_addon:   with_rnr_addon,
        rnr_amount:       rnrAmount,
        ip_address:       req.headers.get('x-forwarded-for') || undefined,
      },
    })

    // ─── 9. Return order details to frontend ───────────────────
    return successResponse({
      order_id:        order.id,
      amount:          total,
      amount_in_paise: amountInPaise,
      currency:        'INR',
      plan_name:       plan.plan_name,
      plan_key,
      breakdown: {
        plan_amount: planAmount,
        rnr_amount:  rnrAmount,
        subtotal,
        gst,
        total,
      },
      razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
    })
  } catch (error: unknown) {
    console.error('[CREATE ORDER ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}