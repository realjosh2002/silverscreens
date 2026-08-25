export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    // ─── 1. Authenticate user ──────────────────────────────────
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return errorResponse('Authentication required', 401)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return errorResponse('Invalid or expired session', 401)
    }

    const body = await req.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscription_id,
      plan_key,
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !subscription_id) {
      return errorResponse('Missing payment verification fields', 400)
    }

    // ─── 2. Verify Razorpay signature ──────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      // Log failed verification attempt
      await prisma.audit_logs.create({
        data: {
          user_id:     user.id,
          action:      'PAYMENT_SIGNATURE_INVALID',
          entity_type: 'payment_transactions',
          new_values:  { razorpay_order_id, razorpay_payment_id },
        },
      })
      return errorResponse('Payment verification failed. Please contact support.', 400)
    }

    // ─── 3. Fetch subscription ─────────────────────────────────
    const subscription = await prisma.subscriptions.findUnique({
      where: { id: subscription_id },
    })

    if (!subscription || subscription.user_id !== user.id) {
      return errorResponse('Subscription not found', 404)
    }

    // ─── 4. Fetch plan for duration ────────────────────────────
    const plan = await prisma.subscription_plans.findUnique({
      where: { plan_key: subscription.plan_id },
    })

    const durationMonths = plan?.duration_months ?? 6
    const startsAt = new Date()
    const endsAt   = new Date()
    endsAt.setMonth(endsAt.getMonth() + durationMonths)

    // ─── 5. Update subscription to active ─────────────────────
    await prisma.subscriptions.update({
      where: { id: subscription_id },
      data: {
        status:               'active',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_method:       'razorpay',
        gateway_status:       'success',
        starts_at:            startsAt,
        ends_at:              endsAt,
      },
    })

    // ─── 6. Update payment transaction ─────────────────────────
    await prisma.payment_transactions.update({
      where:  { razorpay_order_id },
      data: {
        razorpay_payment_id,
        razorpay_signature,
        gateway_status: 'success',
        updated_at:     new Date(),
      },
    })

    // ─── 7. Update profile subscription status in localStorage data
    // Update aspirant/agency verification status to reflect payment
    const profile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })

    if (profile?.role === 'aspirant') {
      await prisma.aspirant_profiles.update({
        where: { user_id: user.id },
        data:  {}, // subscription is tracked separately
      })
    }

    // ─── 8. Create payment success notification ────────────────
    await prisma.notifications.create({
      data: {
        user_id: user.id,
        type:    'payment_success',
        title:   'Payment Successful!',
        message: `Your ${subscription.plan_name} plan has been activated. Valid until ${endsAt.toLocaleDateString('en-IN')}.`,
        action_url: profile?.role === 'agency' ? '/agency/dashboard' : '/dashboard',
      },
    })

    // ─── 9. Log successful payment ─────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     user.id,
        action:      'PAYMENT_SUCCESS',
        entity_type: 'subscriptions',
        entity_id:   subscription_id,
        new_values:  {
          razorpay_order_id,
          razorpay_payment_id,
          plan_key,
          amount: subscription.total_amount,
        },
        
      },
    })

    const isAgency = ['starter', 'growth', 'enterprise'].includes(subscription.plan_id)

    return successResponse({
      message:        'Payment verified successfully',
      plan_name:      subscription.plan_name,
      plan_key:       subscription.plan_id,
      amount_paid:    subscription.total_amount,
      starts_at:      startsAt,
      ends_at:        endsAt,
      transaction_id: razorpay_payment_id,
      redirect_to:    isAgency ? '/agency-profile-submitted' : '/profile-submitted',
    })
  } catch (error: unknown) {
    console.error('[VERIFY PAYMENT ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
