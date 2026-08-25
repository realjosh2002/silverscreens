export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/messages — get all conversations for current user
// POST /api/messages — send a message (creates conversation if needed)

export async function GET(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { searchParams } = new URL(req.url)
    const conversation_id = searchParams.get('conversation_id')

    if (conversation_id) {
      // ── Get messages in a specific conversation ────────────
      const conversation = await prisma.conversations.findUnique({
        where: { id: conversation_id },
      })

      if (!conversation) return errorResponse('Conversation not found', 404)

      // Verify user is part of this conversation
      if (
        conversation.participant_1_id !== user.id &&
        conversation.participant_2_id !== user.id
      ) {
        return errorResponse('Access denied', 403)
      }

      const messages = await prisma.messages.findMany({
        where:   { conversation_id },
        orderBy: { created_at: 'asc' },
        include: {
          profiles: {
            select: { name: true, role: true },
          },
        },
      })

      // Mark messages as read
      await prisma.messages.updateMany({
        where: {
          conversation_id,
          sender_id: { not: user.id },
          is_read:   false,
        },
        data: { is_read: true },
      })

      return successResponse({ messages, conversation })
    }

    // ── Get all conversations for current user ────────────────
    const conversations = await prisma.conversations.findMany({
      where: {
        OR: [
          { participant_1_id: user.id },
          { participant_2_id: user.id },
        ],
      },
      orderBy: { last_message_at: 'desc' },
      include: {
        messages: {
          orderBy: { created_at: 'desc' },
          take:    1,
          select: {
            content:   true,
            created_at: true,
            is_read:   true,
            sender_id: true,
          },
        },
      },
    })

    // Enrich with other party's profile info
    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.participant_1_id === user.id
          ? conv.participant_2_id
          : conv.participant_1_id

        const otherProfile = await prisma.profiles.findUnique({
          where:  { id: otherUserId },
          select: { name: true, role: true },
        })

        const unreadCount = await prisma.messages.count({
          where: {
            conversation_id: conv.id,
            sender_id:       { not: user.id },
            is_read:         false,
          },
        })

        return {
          ...conv,
          other_party:  otherProfile,
          unread_count: unreadCount,
          last_message: conv.messages[0] || null,
        }
      })
    )

    const totalUnread = enriched.reduce((sum, c) => sum + c.unread_count, 0)

    return successResponse({
      conversations: enriched,
      total_unread:  totalUnread,
    })
  } catch (error: unknown) {
    console.error('[GET MESSAGES ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const { recipient_id, content, conversation_id } = body

    if (!content?.trim()) return errorResponse('Message content is required', 400)

    // ─── 2. Check active subscription ─────────────────────────
    const activeSub = await prisma.subscriptions.findFirst({
      where: { user_id: user.id, status: 'active' },
    })

    if (!activeSub) {
      return errorResponse('An active subscription is required to send messages', 403)
    }

    let convId = conversation_id

    if (!convId) {
      // ── Create new conversation ───────────────────────────
      if (!recipient_id) {
        return errorResponse('Recipient ID is required to start a conversation', 400)
      }

      // Determine who is aspirant and who is agency
      const senderProfile    = await prisma.profiles.findUnique({
        where: { id: user.id }, select: { role: true },
      })
      const recipientProfile = await prisma.profiles.findUnique({
        where: { id: recipient_id }, select: { role: true },
      })

      if (!recipientProfile) return errorResponse('Recipient not found', 404)

      const aspirantId = senderProfile?.role === 'aspirant' ? user.id : recipient_id
      const agencyId   = senderProfile?.role === 'agency'   ? user.id : recipient_id

      // Check if conversation already exists
      const existing = await prisma.conversations.findFirst({
        where: { participant_1_id: aspirantId, participant_2_id: agencyId },
      })

      if (existing) {
        convId = existing.id
      } else {
        const newConv = await prisma.conversations.create({
          data: {
            participant_1_id: aspirantId,
            participant_2_id: agencyId,
          },
        })
        convId = newConv.id
      }
    } else {
      // Verify user is part of the conversation
      const conv = await prisma.conversations.findUnique({
        where: { id: convId },
      })

      if (!conv) return errorResponse('Conversation not found', 404)

      if (conv.participant_1_id !== user.id && conv.participant_2_id !== user.id) {
        return errorResponse('Access denied', 403)
      }
    }

    // ─── 3. Send message ──────────────────────────────────────
    const message = await prisma.messages.create({
      data: {
        conversation_id: convId,
        sender_id:       user.id,
        content:         content.trim(),
        is_read:         false,
        created_at:      new Date(),
      },
    })

    // ─── 4. Update conversation last_message_at ────────────────
    await prisma.conversations.update({
      where: { id: convId },
      data:  { last_message_at: new Date() },
    })

    // ─── 5. Notify recipient ──────────────────────────────────
    const conversation = await prisma.conversations.findUnique({
      where: { id: convId },
    })

    const recipientUserId = conversation?.participant_1_id === user.id
      ? conversation?.participant_2_id
      : conversation?.participant_1_id

    if (recipientUserId) {
      const senderProfile = await prisma.profiles.findUnique({
        where:  { id: user.id },
        select: { name: true },
      })

      await prisma.notifications.create({
        data: {
          user_id:    recipientUserId,
          type:       'new_message',
          title:      'New Message',
          message:    `${senderProfile?.name || 'Someone'} sent you a message.`,
          action_url: `/messages?conversation_id=${convId}`,
        },
      })
    }

    return successResponse({ message, conversation_id: convId }, 201)
  } catch (error: unknown) {
    console.error('[SEND MESSAGE ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
