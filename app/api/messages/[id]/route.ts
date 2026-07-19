import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/messages/[id] — get all messages in a conversation

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { id: conversationId } = await context.params

    if (!conversationId) return errorResponse('Conversation ID is required', 400)

    const conversation = await prisma.conversations.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) return errorResponse('Conversation not found', 404)

    if (
      conversation.participant_1_id !== user.id &&
      conversation.participant_2_id !== user.id
    ) {
      return errorResponse('Access denied', 403)
    }

    const rawMessages = await prisma.messages.findMany({
      where:   { conversation_id: conversationId },
      orderBy: { created_at: 'asc' },
      include: {
        profiles: {
          select: { name: true, role: true },
        },
      },
    })

    // Mark messages from the other party as read
    await prisma.messages.updateMany({
      where: {
        conversation_id: conversationId,
        sender_id:       { not: user.id },
        is_read:         false,
      },
      data: { is_read: true },
    })

    // Reset unread count for current user's slot
    if (conversation.participant_1_id === user.id) {
      await prisma.conversations.update({
        where: { id: conversationId },
        data:  { unread_count_1: 0 },
      })
    } else {
      await prisma.conversations.update({
        where: { id: conversationId },
        data:  { unread_count_2: 0 },
      })
    }

    const messages = rawMessages.map(m => ({
      id:         m.id,
      content:    m.content,
      sender_id:  m.sender_id,
      isOwn:      m.sender_id === user.id,
      is_read:    m.is_read,
      created_at: m.created_at,
      sent_at:    m.created_at,
      senderName: m.profiles?.name ?? '',
    }))

    return successResponse({ messages, conversation })
  } catch (error: unknown) {
    console.error('[GET MESSAGES BY ID ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}