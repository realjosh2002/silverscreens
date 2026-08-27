// app/api/admin/profile/avatar/route.ts
import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

function successResponse(data: any, status = 200) {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function errorResponse(message: string, status = 400) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function verifyAdmin(token: string) {
  if (!supabaseAdmin) return null
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) return errorResponse('Server not configured', 500)

    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { dataUrl } = await req.json()
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      return errorResponse('Invalid image data', 400)
    }

    // Convert base64 data URL to buffer
    const matches = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!matches) return errorResponse('Invalid image format', 400)

    const mimeType = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')

    // Validate size (max 5MB)
    if (buffer.length > 5 * 1024 * 1024) {
      return errorResponse('Image too large. Maximum size is 5MB.', 400)
    }

    const ext = mimeType === 'image/png' ? 'png' : 'jpg'
    const path = `avatars/${admin.id}.${ext}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('assets')
      .upload(path, buffer, {
        upsert: true,
        contentType: mimeType,
      })

    if (uploadError) return errorResponse('Upload failed: ' + uploadError.message, 500)

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('assets')
      .getPublicUrl(path)

    const avatar_url = urlData.publicUrl + '?t=' + Date.now()

    // Save URL to profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ avatar_url, updated_at: new Date().toISOString() })
      .eq('id', admin.id)

    if (updateError) return errorResponse('Failed to save avatar URL: ' + updateError.message, 500)

    return successResponse({ avatar_url })

  } catch (err: any) {
    console.error('[AVATAR UPLOAD ERROR]', err)
    return errorResponse(err.message || 'Internal server error', 500)
  }
}