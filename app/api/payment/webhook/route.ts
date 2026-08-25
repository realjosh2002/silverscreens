export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// Razorpay sends webhooks for async payment events
// This handles payment failures, refunds, etc.

export async function POST(req: NextRequest) {
  try {
    const body      = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return errorResponse('Missing webhook signature', 400)
    }

    // ─── 1. Verify webhook signature ──────────────────────────
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!
    const expectedSig   = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (expectedSig !== signature) {
      return errorResponse('Invalid webhook signature', 400)
    }

    const event = JSON.parse(body)
    const { event: eventType, payload } = event

    console.log('[RAZORPAY WEBHOOK]', eventType)

    // ─── 2. Handle payment events ─────────────────────────────
    switch (eventType) {

      // Payment captured successfully
      case 'payment.captured': {
        const payment      = payload.payment.entity
        const orderId      = payment.order_id
        const paymentId    = payment.id

        await prisma.payment_transactions.updateMany({
          where: { razorpay_order_id: orderId },
          data: {
            razorpay_payment_id: paymentId,
            gateway_status:      'success',
            payment_method:      payment.method,
            updated_at:          new Date(),
          },
        })
        break
      }

      // Payment failed
      case 'payment.failed': {
        const payment   = payload.payment.entity
        const orderId   = payment.order_id
        const errorDesc = payment.error_description || 'Payment failed'

        // Update payment transaction
        await prisma.payment_transactions.updateMany({
          where: { razorpay_order_id: orderId },
          data: {
            gateway_status: 'failed',
            failure_reason: errorDesc,
            updated_at:     new Date(),
          },
        })

        // Update subscription status
        const transaction = await prisma.payment_transactions.findFirst({
          where: { razorpay_order_id: orderId },
          select: { user_id: true, subscription_id: true },
        })

        if (transaction?.subscription_id) {
          await prisma.subscriptions.update({
            where: { id: transaction.subscription_id },
            data:  { status: 'pending_payment', gateway_status: 'failed' },
          })
        }

        // Send failure notification to user
        if (transaction?.user_id) {
          await prisma.notifications.create({
            data: {
              user_id:    transaction.user_id,
              type:       'payment_failure',
              title:      'Payment Failed',
              message:    `Your payment could not be processed: ${errorDesc}. Please try again.`,
              action_url: '/pricing',
            },
          })
        }
        break
      }

      // Refund processed
      case 'refund.processed': {
        const refund  = payload.refund.entity
        const orderId = refund.notes?.order_id

        if (orderId) {
          await prisma.payment_transactions.updateMany({
            where: { razorpay_order_id: orderId },
            data: {
              gateway_status: 'refunded',
              updated_at:     new Date(),
            },
          })

          // Cancel subscription on refund
          await prisma.subscriptions.updateMany({
            where: { razorpay_order_id: orderId },
            data:  { status: 'cancelled' },
          })
        }
        break
      }

      default:
        console.log('[RAZORPAY WEBHOOK] Unhandled event:', eventType)
    }

    return successResponse({ received: true })
  } catch (error: unknown) {
    console.error('[WEBHOOK ERROR]', error)
    const message = error instanceof Error ? error.message : 'Webhook processing failed'
    return errorResponse(message, 500)
  }
}
