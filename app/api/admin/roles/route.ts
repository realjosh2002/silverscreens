export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { errorResponse } from '@/lib/api-helpers'

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

/* ── GET — list all roles ── */
// ── Check if roles table exists ────────────────────────────────
async function rolesTableExists(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('roles').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { data, error } = await supabaseAdmin
      .from('roles')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.warn('[ROLES] Query error:', error.message)
      return NextResponse.json({ roles: [] })
    }
    return NextResponse.json({ roles: data ?? [] })
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}

/* ── POST — create role ── */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    if (!await rolesTableExists())
      return errorResponse('Roles table does not exist yet. Create it in Supabase first.', 503)

    const body = await req.json()
    const { id, name, description, color, is_system, permissions } = body
    if (!id || !name) return errorResponse('id and name are required', 400)

    const { error } = await supabaseAdmin.from('roles').insert({
      id, name, description: description || '',
      color: color || '#8B5CF6',
      is_system: is_system ?? false,
      permissions: permissions || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    if (error) throw new Error(error.message)
    return NextResponse.json({ message: `Role "${name}" created successfully` })
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}

/* ── PUT — update permissions ── */
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    if (!await rolesTableExists())
      return errorResponse('Roles table does not exist yet.', 503)

    const body = await req.json()
    const { id, permissions } = body
    if (!id) return errorResponse('id is required', 400)

    const { error } = await supabaseAdmin
      .from('roles')
      .update({ permissions, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw new Error(error.message)
    return NextResponse.json({ message: 'Permissions saved successfully' })
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}

/* ── DELETE — delete role ── */
export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    if (!await rolesTableExists())
      return errorResponse('Roles table does not exist yet.', 503)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return errorResponse('id is required', 400)

    // Prevent deletion of system roles
    const { data: role } = await supabaseAdmin
      .from('roles').select('is_system').eq('id', id).single()
    if (role?.is_system) return errorResponse('System roles cannot be deleted', 403)

    const { error } = await supabaseAdmin.from('roles').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return NextResponse.json({ message: 'Role deleted successfully' })
  } catch (err: any) {
    return errorResponse(err.message || 'Internal server error', 500)
  }
}
