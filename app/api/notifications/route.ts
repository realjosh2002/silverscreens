import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/notifications — get user notifications
// PUT /api/notifications — mark all as read

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { searchParams } = new URL(req.url)
    const page  = parseInt(searchParams.get('page')  || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip  = (page - 1) * limit

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notifications.findMany({
        where:   { user_id: user.id },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notifications.count({ where: { user_id: user.id } }),
      prisma.notifications.count({ where: { user_id: user.id, is_read: false } }),
    ])

    return successResponse({
      notifications,
      unread_count: unreadCount,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    })
  } catch (error: unknown) {
    console.error('[GET NOTIFICATIONS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const { notification_id } = body

    if (notification_id) {
      // Mark single notification as read
      await prisma.notifications.updateMany({
        where: { id: notification_id, user_id: user.id },
        data:  { is_read: true, read_at: new Date() },
      })
    } else {
      // Mark all as read
      await prisma.notifications.updateMany({
        where: { user_id: user.id, is_read: false },
        data:  { is_read: true, read_at: new Date() },
      })
    }

    return successResponse({ message: 'Notifications marked as read' })
  } catch (error: unknown) {
    console.error('[UPDATE NOTIFICATIONS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}