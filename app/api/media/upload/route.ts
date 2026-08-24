import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// Regular Supabase client for auth only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/media/upload — upload image or video
// DELETE /api/media/upload — delete a media file

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024   // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024  // 100MB
const MAX_IMAGES = 10
const MAX_VIDEOS = 5

export async function POST(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Verify aspirant ───────────────────────────────────
    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where:   { user_id: user.id },
      include: { aspirant_media: true },
    })

    if (!aspirantProfile) {
      return errorResponse('Aspirant profile not found', 404)
    }

    // ─── 3. Parse form data ───────────────────────────────────
    const formData  = await req.formData()
    const file      = formData.get('file') as File
    const mediaType = formData.get('type') as string   // 'image' or 'video'
    const isPrimary = formData.get('is_primary') === 'true'

    if (!file) return errorResponse('No file provided', 400)
    if (!mediaType || !['image', 'video'].includes(mediaType)) {
      return errorResponse('Media type must be image or video', 400)
    }

    // ─── 4. Validate file type and size ───────────────────────
    const allowedTypes = mediaType === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES
    const maxSize      = mediaType === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE

    if (!allowedTypes.includes(file.type)) {
      return errorResponse(
        mediaType === 'image'
          ? 'Images must be JPG, PNG or WebP format'
          : 'Videos must be MP4, MOV, AVI or WebM format',
        400
      )
    }

    if (file.size > maxSize) {
      return errorResponse(
        mediaType === 'image'
          ? 'Image size cannot exceed 5MB'
          : 'Video size cannot exceed 100MB',
        400
      )
    }

    // ─── 5. Check media count limits ──────────────────────────
    const existingMedia  = aspirantProfile.aspirant_media
    const existingImages = existingMedia.filter(m => m.type === 'image')
    const existingVideos = existingMedia.filter(m => m.type === 'video')

    if (mediaType === 'image' && existingImages.length >= MAX_IMAGES) {
      return errorResponse(`You can upload a maximum of ${MAX_IMAGES} images`, 400)
    }

    if (mediaType === 'video' && existingVideos.length >= MAX_VIDEOS) {
      return errorResponse(`You can upload a maximum of ${MAX_VIDEOS} videos`, 400)
    }

    // ─── 6. Generate unique file path ─────────────────────────
    const ext       = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName  = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const filePath  = `aspirants/${user.id}/${mediaType}s/${fileName}`

    // ─── 7. Upload to Supabase Storage ────────────────────────
    const arrayBuffer = await file.arrayBuffer()
    const buffer      = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabaseAdmin.storage
      .from('silverscreens-media')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert:      false,
      })

    if (uploadError) {
      console.error('[UPLOAD ERROR]', uploadError)
      return errorResponse('Failed to upload file. Please try again.', 500)
    }

    // ─── 8. Get public URL ────────────────────────────────────
    const { data: urlData } = supabaseAdmin.storage
      .from('silverscreens-media')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // ─── 9. If setting as primary, unset existing primary ─────
    if (isPrimary && mediaType === 'image') {
      await prisma.aspirant_media.updateMany({
        where: { aspirant_id: aspirantProfile.id, type: 'image', is_primary: true },
        data:  { is_primary: false },
      })
    }

    // ─── 10. Save media record to database ────────────────────
    const orderIndex = mediaType === 'image'
      ? existingImages.length
      : existingVideos.length

    const mediaRecord = await prisma.aspirant_media.create({
      data: {
        aspirant_id:  aspirantProfile.id,
        type:         mediaType,
        url:          publicUrl,
        file_path:    filePath,
        is_primary:   isPrimary && mediaType === 'image',
        order_index:  orderIndex,
      },
    })

    // ─── 11. Update profile image URL if primary ──────────────
    if (isPrimary && mediaType === 'image') {
      await prisma.aspirant_profiles.update({
        where: { user_id: user.id },
        data:  { profile_image_url: publicUrl },
      })
    }

    // ─── 12. Update intro video URL if first video ────────────
    if (mediaType === 'video' && existingVideos.length === 0) {
      await prisma.aspirant_profiles.update({
        where: { user_id: user.id },
        data:  { intro_video_url: publicUrl },
      })
    }

    return successResponse({
      message:      'File uploaded successfully',
      media:        mediaRecord,
      url:          publicUrl,
      total_images: mediaType === 'image' ? existingImages.length + 1 : existingImages.length,
      total_videos: mediaType === 'video' ? existingVideos.length + 1 : existingVideos.length,
    }, 201)
  } catch (error: unknown) {
    console.error('[MEDIA UPLOAD ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body       = await req.json()
    const { media_id } = body

    if (!media_id) return errorResponse('Media ID is required', 400)

    // ─── 2. Verify ownership ──────────────────────────────────
    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true },
    })

    if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

    const mediaRecord = await prisma.aspirant_media.findUnique({
      where:  { id: media_id },
      select: { id: true, aspirant_id: true, file_path: true, type: true, is_primary: true },
    })

    if (!mediaRecord) return errorResponse('Media not found', 404)

    if (mediaRecord.aspirant_id !== aspirantProfile.id) {
      return errorResponse('You can only delete your own media', 403)
    }

    // ─── 3. Delete from Supabase Storage ──────────────────────
    const { error: deleteError } = await supabaseAdmin.storage
      .from('silverscreens-media')
      .remove([mediaRecord.file_path])

    if (deleteError) {
      console.error('[DELETE FROM STORAGE ERROR]', deleteError)
      // Continue anyway — remove DB record even if storage fails
    }

    // ─── 4. Delete from database ──────────────────────────────
    await prisma.aspirant_media.delete({ where: { id: media_id } })

    // ─── 5. If deleted primary image, set next image as primary
    if (mediaRecord.is_primary && mediaRecord.type === 'image') {
      const nextImage = await prisma.aspirant_media.findFirst({
        where:   { aspirant_id: aspirantProfile.id, type: 'image' },
        orderBy: { order_index: 'asc' },
      })

      if (nextImage) {
        await prisma.aspirant_media.update({
          where: { id: nextImage.id },
          data:  { is_primary: true },
        })
        await prisma.aspirant_profiles.update({
          where: { user_id: user.id },
          data:  { profile_image_url: nextImage.url },
        })
      } else {
        await prisma.aspirant_profiles.update({
          where: { user_id: user.id },
          data:  { profile_image_url: null },
        })
      }
    }

    return successResponse({ message: 'Media deleted successfully' })
  } catch (error: unknown) {
    console.error('[DELETE MEDIA ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}