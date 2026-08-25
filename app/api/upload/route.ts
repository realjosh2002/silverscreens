export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/upload — upload a file to Supabase Storage and save to aspirant_media

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { data: aspirantProfile } = await supabaseAdmin
      .from('aspirant_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()
    if (!aspirantProfile) return errorResponse('Aspirant profile not found', 404)

    const formData    = await req.formData()
    const file        = formData.get('file') as File
    const type        = (formData.get('type') as string) || 'photo'
    const isPrimary   = formData.get('is_primary') === 'true'
    const docType     = (formData.get('document_type') as string) || ''
    const isDocument  = type === 'document'

    if (!file) return errorResponse('No file provided', 400)

    // Validate file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    const isPdf   = file.type === 'application/pdf'

    // Documents (resume, ID proof etc.) — allow images, PDF, Word docs
    if (isDocument) {
      const isWord = file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      const allowedDoc = isImage || isPdf || isWord
      if (!allowedDoc) return errorResponse('Documents must be PDF, JPG, PNG or Word format', 400)
      if (file.size > 10 * 1024 * 1024) return errorResponse('File too large. Max 10MB', 400)

      const ext      = file.name.split('.').pop() || 'pdf'
      const fileName = `${user.id}/docs/${Date.now()}.${ext}`
      const bucket   = 'aspirant-media'

      const arrayBuffer = await file.arrayBuffer()
      const { error: uploadError } = await supabaseAdmin.storage
        .from(bucket)
        .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false })

      if (uploadError) return errorResponse(uploadError.message || 'Upload failed', 500)

      const { data: { publicUrl } } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName)

      // Save to aspirant_media with type='document' so it appears in Documents tab
      const { count: docCount } = await supabaseAdmin
        .from('aspirant_media')
        .select('*', { count: 'exact', head: true })
        .eq('aspirant_id', aspirantProfile.id)
        .eq('type', 'document')

      const { error: insertErr } = await supabaseAdmin
        .from('aspirant_media')
        .insert({
          aspirant_id:       aspirantProfile.id,
          type:              'document',
          url:               publicUrl,
          is_primary:        false,
          order_index:       docCount ?? 0,
          moderation_status: 'approved',
        })
      if (insertErr) console.error('[DOC INSERT ERROR]', insertErr.message)

      // Also save resume_url if document type is Portfolio or Resume (for backward compat)
      if (docType === 'Resume' || docType === 'Portfolio') {
        await supabaseAdmin
          .from('aspirant_profiles')
          .update({ resume_url: publicUrl })
          .eq('user_id', user.id)
      }

      return successResponse({ url: publicUrl, type: 'document', document_type: docType })
    }

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
    const { count } = await supabaseAdmin
      .from('aspirant_media')
      .select('*', { count: 'exact', head: true })
      .eq('aspirant_id', aspirantProfile.id)

    // If primary, unset other primaries
    if (isPrimary) {
      await supabaseAdmin
        .from('aspirant_media')
        .update({ is_primary: false })
        .eq('aspirant_id', aspirantProfile.id)
        .eq('is_primary', true)
    }

    // Save to DB
    const { data: media } = await supabaseAdmin
      .from('aspirant_media')
      .insert({
        aspirant_id:  aspirantProfile.id,
        type:         isImage ? 'image' : 'video',
        url:          publicUrl,
        is_primary:   isPrimary,
        order_index:  count ?? 0,
      })
      .select()
      .single()

    // If primary photo, update profile_image_url
    if (isPrimary && isImage) {
      await supabaseAdmin
        .from('aspirant_profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', aspirantProfile.id)
    }

    return successResponse({ url: publicUrl, media_id: media.id, type: media.type })
  } catch (error: unknown) {
    console.error('[UPLOAD ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}
