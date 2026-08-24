// app/api/admin/save-profile/route.ts
import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return Response.json({ success: false, error: 'Server not configured' }, { status: 500 })
    }

    const body = await req.json()
    const { userId, name, email, phone, avatar_url } = body

    if (!userId) {
      return Response.json({ success: false, error: 'No user ID provided' }, { status: 400 })
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (name      !== undefined) updates.name       = name
    if (email     !== undefined) updates.email      = email
    if (phone     !== undefined) updates.phone      = phone
    if (avatar_url !== undefined) updates.avatar_url = avatar_url

    const { error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }
}