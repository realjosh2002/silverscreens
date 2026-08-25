export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/profile/aspirant/media-status
// Returns all media for the logged-in aspirant with moderation status
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // Get aspirant_profile id
    const { data: asp } = await supabaseAdmin
      .from('aspirant_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!asp) return errorResponse('Aspirant profile not found', 404)

    const { data: media, error: mediaError } = await supabaseAdmin
      .from('aspirant_media')
      .select('id, type, url, is_primary, order_index, moderation_status, rejection_reason, created_at')
      .eq('aspirant_id', asp.id)
      .order('order_index', { ascending: true })

    if (mediaError) throw new Error(mediaError.message)

    return successResponse({ media: media ?? [] })

  } catch (err: unknown) {
    console.error('[ASPIRANT MEDIA STATUS ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
