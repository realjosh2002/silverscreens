export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/messages/conversations

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const conversations = await prisma.conversations.findMany({
      where: {
        OR: [
          { participant_1_id: user.id },
          { participant_2_id: user.id },
        ],
        is_blocked: false,
      },
      orderBy: { last_message_at: 'desc' },
      include: {
        messages: {
          orderBy: { created_at: 'desc' },
          take: 1,
          select: {
            content:    true,
            created_at: true,
            is_read:    true,
            sender_id:  true,
          },
        },
        profiles_conversations_participant_1_idToprofiles: {
          select: {
            id:                true,
            name:              true,
            role:              true,
            phone:             true,
            aspirant_profiles: { select: { id: true } },
          },
        },
        profiles_conversations_participant_2_idToprofiles: {
          select: {
            id:                true,
            name:              true,
            role:              true,
            phone:             true,
            aspirant_profiles: { select: { id: true } },
          },
        },
      },
    })

    const enriched = conversations.map((conv) => {
      const otherParty = conv.participant_1_id === user.id
        ? conv.profiles_conversations_participant_2_idToprofiles
        : conv.profiles_conversations_participant_1_idToprofiles

      const unreadCount = conv.participant_1_id === user.id
        ? conv.unread_count_1 ?? 0
        : conv.unread_count_2 ?? 0

      const lastMsg = conv.messages[0] ?? null

      return {
        id:               conv.id,
        participant_1_id: conv.participant_1_id,
        participant_2_id: conv.participant_2_id,
        last_message_at:  conv.last_message_at,
        otherParty: {
          id:               otherParty?.id   ?? '',
          name:             otherParty?.name ?? 'Unknown',
          role:             otherParty?.role ?? '',
          phone:            (otherParty as any)?.phone ?? null,
          aspirantProfileId: (otherParty as any)?.aspirant_profiles?.id ?? null,
        },
        lastMessage: lastMsg
          ? { content: lastMsg.content, sent_at: lastMsg.created_at }
          : null,
        unreadCount,
      }
    })

    return successResponse({
      conversations: enriched,
      total_unread:  enriched.reduce((sum, c) => sum + c.unreadCount, 0),
    })
  } catch (error: unknown) {
    console.error('[GET CONVERSATIONS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
