export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET  /api/notifications — get user notifications
// PUT  /api/notifications — mark as read
// All DB access via supabaseAdmin only — no Prisma

async function getUser(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  return user
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const user = await getUser(token)
    if (!user) return errorResponse('Invalid session', 401)

    const { searchParams } = new URL(req.url)
    const page  = Math.max(1, parseInt(searchParams.get('page')  || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
    const from  = (page - 1) * limit

    const [
      { data: notifications, error: notifErr, count: total },
      { count: unreadCount },
    ] = await Promise.all([
      supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, from + limit - 1),
      supabaseAdmin
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false),
    ])

    if (notifErr) throw new Error(notifErr.message)

    return successResponse({
      notifications: notifications ?? [],
      unread_count:  unreadCount ?? 0,
      pagination: {
        page,
        limit,
        total:       total ?? 0,
        total_pages: Math.ceil((total ?? 0) / limit),
      },
    })
  } catch (error: unknown) {
    console.error('[GET NOTIFICATIONS ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const user = await getUser(token)
    if (!user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const { notification_id } = body

    if (notification_id) {
      // Mark single notification as read
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification_id)
        .eq('user_id', user.id) // security: user can only mark their own
      if (error) throw new Error(error.message)
    } else {
      // Mark all as read
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      if (error) throw new Error(error.message)
    }

    return successResponse({ message: 'Notifications marked as read' })
  } catch (error: unknown) {
    console.error('[UPDATE NOTIFICATIONS ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const user = await getUser(token)
    if (!user) return errorResponse('Invalid session', 401)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const { error } = await supabaseAdmin
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      if (error) throw new Error(error.message)
    } else {
      // Delete all read notifications for this user
      const { error } = await supabaseAdmin
        .from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('is_read', true)
      if (error) throw new Error(error.message)
    }

    return successResponse({ message: 'Notification(s) deleted' })
  } catch (error: unknown) {
    console.error('[DELETE NOTIFICATIONS ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}
