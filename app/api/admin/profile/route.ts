// app/api/admin/profile/route.ts
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

// GET — fetch profile
export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) return errorResponse('Server not configured', 500)

    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, phone, profile_number, two_fa_enabled, created_at, last_login_at, avatar_url, role')
      .eq('id', admin.id)
      .single()

    if (error) return errorResponse(error.message, 500)

    return successResponse(data)
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}

// PATCH — update profile fields
export async function PATCH(req: NextRequest) {
  try {
    if (!supabaseAdmin) return errorResponse('Server not configured', 500)

    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()

    // Only allow safe fields to be updated — never allow role changes here
    const allowed = ['name', 'email', 'phone', 'avatar_url', 'updated_at']
    const updates: Record<string, any> = { updated_at: new Date().toISOString() }

    for (const key of allowed) {
      if (key in body && key !== 'updated_at') {
        updates[key] = body[key]
      }
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', admin.id)
      .select()
      .single()

    if (error) return errorResponse(error.message, 500)

    return successResponse(data)
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}