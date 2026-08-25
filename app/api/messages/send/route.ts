export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/messages/send

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const { conversationId, conversation_id, recipient_id, content } = body

    const convId = conversationId ?? conversation_id

    if (!content?.trim()) return errorResponse('Message content is required', 400)

    let finalConvId = convId

    if (!finalConvId) {
      if (!recipient_id) return errorResponse('Either conversationId or recipient_id is required', 400)

      const p1 = user.id < recipient_id ? user.id : recipient_id
      const p2 = user.id < recipient_id ? recipient_id : user.id

      const existing = await prisma.conversations.findFirst({
        where: {
          OR: [
            { participant_1_id: p1, participant_2_id: p2 },
            { participant_1_id: p2, participant_2_id: p1 },
          ],
        },
      })

      if (existing) {
        finalConvId = existing.id
      } else {
        const newConv = await prisma.conversations.create({
          data: {
            participant_1_id: p1,
            participant_2_id: p2,
          },
        })
        finalConvId = newConv.id
      }
    } else {
      const conv = await prisma.conversations.findUnique({
        where: { id: finalConvId },
      })
      if (!conv) return errorResponse('Conversation not found', 404)
      if (conv.participant_1_id !== user.id && conv.participant_2_id !== user.id) {
        return errorResponse('Access denied', 403)
      }
    }

    // Create the message
    const message = await prisma.messages.create({
      data: {
        conversation_id: finalConvId,
        sender_id:       user.id,
        content:         content.trim(),
        type:            'text',
        is_read:         false,
      },
    })

    // Fetch conversation to determine which unread slot to increment
    const conv = await prisma.conversations.findUnique({
      where: { id: finalConvId },
    })

    // Increment unread count for the RECIPIENT (not the sender)
    const recipientIsParticipant1 = conv?.participant_2_id === user.id
    await prisma.conversations.update({
      where: { id: finalConvId },
      data: {
        last_message:    content.trim(),
        last_message_at: new Date(),
        // Increment the recipient's unread slot
        ...(recipientIsParticipant1
          ? { unread_count_1: { increment: 1 } }
          : { unread_count_2: { increment: 1 } }
        ),
      },
    })

    const recipientUserId = conv?.participant_1_id === user.id
      ? conv?.participant_2_id
      : conv?.participant_1_id

    if (recipientUserId) {
      const senderProfile = await prisma.profiles.findUnique({
        where:  { id: user.id },
        select: { name: true },
      })
      try {
        await prisma.notifications.create({
          data: {
            user_id:    recipientUserId,
            type:       'system_announcement',
            title:      'New Message',
            message:    `${senderProfile?.name ?? 'Someone'} sent you a message.`,
            action_url: `/messages`,
          },
        })
      } catch {}
    }

    return successResponse({ message, conversation_id: finalConvId }, 201)
  } catch (error: unknown) {
    console.error('[SEND MESSAGE ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
