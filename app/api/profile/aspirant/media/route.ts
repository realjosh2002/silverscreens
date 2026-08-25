export const dynamic = 'force-dynamic'

// app/api/profile/aspirant/media/route.ts
import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// DELETE /api/profile/aspirant/media?media_id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const mediaId = req.nextUrl.searchParams.get('media_id')
    if (!mediaId) return errorResponse('media_id is required', 400)

    // Verify the media belongs to this user
    const media = await prisma.aspirant_media.findFirst({
      where: {
        id:               mediaId,
        aspirant_profiles: { user_id: user.id },
      },
    })

    if (!media) return errorResponse('Media not found or not authorised', 404)

    // Delete from Supabase Storage
    const urlPath = media.url.split('/aspirant-media/')[1]
    if (urlPath) {
      await supabaseAdmin.storage.from('aspirant-media').remove([decodeURIComponent(urlPath)])
    }

    // Delete from DB
    await prisma.aspirant_media.delete({ where: { id: mediaId } })

    return successResponse({ message: 'Media deleted successfully' })
  } catch (error: unknown) {
    console.error('[DELETE MEDIA ERROR]', error)
    return errorResponse('Failed to delete media', 500)
  }
}
