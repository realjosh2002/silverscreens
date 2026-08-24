import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/agency/upload
// Uploads logo, banner, or gallery image to Supabase Storage
// and returns the public URL. The caller saves the URL to the profile.

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024  // 5MB

export async function POST(req: NextRequest) {
  try {
    // ─── 1. Authenticate ──────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    // ─── 2. Verify agency role ────────────────────────────────
    const profile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })
    if (!profile || profile.role !== 'agency') {
      return errorResponse('Agency access required', 403)
    }

    // ─── 3. Parse form data ───────────────────────────────────
    const formData  = await req.formData()
    const file      = formData.get('file') as File
    // mediaType: 'logo' | 'banner' | 'gallery'
    const mediaType = (formData.get('type') as string) ?? 'logo'

    if (!file) return errorResponse('No file provided', 400)

    // ─── 4. Validate ──────────────────────────────────────────
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return errorResponse('Images must be JPG, PNG or WebP format', 400)
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return errorResponse('Image size cannot exceed 5MB', 400)
    }

    // ─── 5. Build storage path ────────────────────────────────
    const ext      = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const filePath = `agencies/${user.id}/${mediaType}/${fileName}`

    // ─── 6. Upload to Supabase Storage ───────────────────────
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('silverscreens-media')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert:      false,
      })

    if (uploadError) {
      console.error('[AGENCY UPLOAD ERROR]', uploadError)
      return errorResponse('Failed to upload file. Please try again.', 500)
    }

    // ─── 7. Get public URL ────────────────────────────────────
    const { data: urlData } = supabaseAdmin.storage
      .from('silverscreens-media')
      .getPublicUrl(filePath)

    return successResponse({
      url:      urlData.publicUrl,
      filePath,
      type:     mediaType,
    }, 201)

  } catch (error: unknown) {
    console.error('[AGENCY UPLOAD ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}