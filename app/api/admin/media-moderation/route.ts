export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

// GET /api/admin/media-moderation?aspirant_id=&status=pending
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const aspirantId = searchParams.get('aspirant_id') || ''
    const status     = searchParams.get('status') || 'pending'

    let query = supabaseAdmin
      .from('aspirant_media')
      .select('id, aspirant_id, type, url, is_primary, order_index, moderation_status, rejection_reason, moderated_at, created_at')
      .order('created_at', { ascending: false })

    // 'all' means no status filter
    if (status !== 'all') query = query.eq('moderation_status', status)

    if (aspirantId) query = query.eq('aspirant_id', aspirantId)

    const { data: media, error } = await query
    if (error) throw new Error(error.message)

    return successResponse({ media: media ?? [] })

  } catch (err: unknown) {
    console.error('[MEDIA MODERATION GET ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

// PUT /api/admin/media-moderation
// { media_id, action: 'approve'|'reject', rejection_reason? }
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { media_id, action, rejection_reason } = body

    if (!media_id || !action) return errorResponse('media_id and action required', 400)
    if (!['approve', 'reject'].includes(action)) return errorResponse('Invalid action', 400)

    // First fetch the media record so we have filename and aspirant_id
    const { data: media, error: fetchErr } = await supabaseAdmin
      .from('aspirant_media')
      .select('id, aspirant_id, type, url, is_primary')
      .eq('id', media_id)
      .single()

    if (fetchErr || !media) return errorResponse('Media not found', 404)

    // Get filename from URL for notification
    const filename = media.url.split('/').pop() || media_id

    // Get user_id from aspirant_profiles
    const { data: asp } = await supabaseAdmin
      .from('aspirant_profiles')
      .select('user_id')
      .eq('id', media.aspirant_id)
      .single()

    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    if (action === 'reject') {
      // DELETE the media row entirely
      const { error: deleteErr } = await supabaseAdmin
        .from('aspirant_media')
        .delete()
        .eq('id', media_id)

      if (deleteErr) throw new Error(deleteErr.message)

      // If this was the primary image, promote the next approved one
      if (media.is_primary) {
        const { data: remaining } = await supabaseAdmin
          .from('aspirant_media')
          .select('id')
          .eq('aspirant_id', media.aspirant_id)
          .eq('type', 'image')
          .order('order_index', { ascending: true })
          .limit(1)
        if (remaining?.[0]) {
          await supabaseAdmin
            .from('aspirant_media')
            .update({ is_primary: true })
            .eq('id', remaining[0].id)
        }
      }

      // Notify aspirant with filename
      if (asp?.user_id) {
        const mediaType = media.type === 'video' ? 'Video' : 'Image'
        await supabaseAdmin.from('notifications').insert({
          user_id:    asp.user_id,
          type:       'profile_verified',
          title:      `${mediaType} Removed`,
          message:    `Your ${mediaType.toLowerCase()} "${filename}" has been removed from your profile. Reason: ${rejection_reason || 'Content does not meet platform standards'}. Please upload a compliant replacement from your profile page.`,
          action_url: '/my-profile',
        })
      }

    } else {
      // APPROVE — just update status
      const { error } = await supabaseAdmin
        .from('aspirant_media')
        .update({
          moderation_status: 'approved',
          moderated_at:      new Date().toISOString(),
          moderated_by:      admin.id,
        })
        .eq('id', media_id)

      if (error) throw new Error(error.message)

      // Notify aspirant
      if (asp?.user_id) {
        const mediaType = media.type === 'video' ? 'Video' : 'Image'
        await supabaseAdmin.from('notifications').insert({
          user_id:    asp.user_id,
          type:       'profile_verified',
          title:      `${mediaType} Approved ✓`,
          message:    `Your ${mediaType.toLowerCase()} "${filename}" has been approved and is now visible on your profile.`,
          action_url: '/my-profile',
        })
      }
    }

    // Audit log
    await supabaseAdmin.from('audit_logs').insert({
      user_id:     admin.id,
      action:      `MEDIA_${action.toUpperCase()}`,
      entity_type: 'aspirant_media',
      entity_id:   media_id,
      new_values:  { action, newStatus, rejection_reason, media_type: media?.type },
    })

    return successResponse({ message: `Media ${action}d successfully`, new_status: newStatus })

  } catch (err: unknown) {
    console.error('[MEDIA MODERATION PUT ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
