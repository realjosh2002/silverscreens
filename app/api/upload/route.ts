import { NextRequest } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/upload — upload a file to Supabase Storage and save to aspirant_media

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const aspirantProfile = await prisma.aspirant_profiles.findUnique({
      where:  { user_id: user.id },
      select: { id: true },
    })
    if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = (formData.get('type') as string) || 'photo'
    const isPrimary = formData.get('is_primary') === 'true'

    if (!file) return errorResponse('No file provided', 400)

    // Validate file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) return errorResponse('Only images and videos are allowed', 400)

    // Validate file size — 10MB for images, 100MB for videos
    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) return errorResponse(`File too large. Max ${isVideo ? '100MB' : '10MB'}`, 400)

    // Upload to Supabase Storage
    const ext       = file.name.split('.').pop() || (isImage ? 'jpg' : 'mp4')
    const fileName  = `${user.id}/${Date.now()}.${ext}`
    const bucket    = 'aspirant-media'

    const arrayBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert:      false,
      })

    if (uploadError) {
      console.error('[UPLOAD ERROR]', uploadError)
      return errorResponse(uploadError.message || 'Upload failed', 500)
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName)

    // Get current count for order_index
    const count = await prisma.aspirant_media.count({
      where: { aspirant_id: aspirantProfile.id },
    })

    // If primary, unset other primaries
    if (isPrimary) {
      await prisma.aspirant_media.updateMany({
        where: { aspirant_id: aspirantProfile.id, is_primary: true },
        data:  { is_primary: false },
      })
    }

    // Save to DB
    const media = await prisma.aspirant_media.create({
      data: {
        aspirant_id:  aspirantProfile.id,
        type:         isImage ? 'image' : 'video',
        url:          publicUrl,
        is_primary:   isPrimary,
        order_index:  count,
      },
    })

    // If primary photo, update profile_image_url
    if (isPrimary && isImage) {
      await prisma.aspirant_profiles.update({
        where: { id: aspirantProfile.id },
        data:  { profile_image_url: publicUrl },
      })
    }

    return successResponse({ url: publicUrl, media_id: media.id, type: media.type })
  } catch (error: unknown) {
    console.error('[UPLOAD ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}