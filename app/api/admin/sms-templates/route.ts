import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const profile = await prisma.profiles.findUnique({
    where: { id: user.id }, select: { role: true },
  })
  return profile?.role === 'admin' ? user : null
}

// GET /api/admin/sms-templates — list all templates
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const templates = await prisma.sms_templates.findMany({
      orderBy: { name: 'asc' },
    })

    return successResponse({ templates })
  } catch (err: unknown) {
    console.error('[SMS TEMPLATES GET ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

// PUT /api/admin/sms-templates — update a template
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { id, sms_body, wa_body, is_active } = body

    if (!id) return errorResponse('Template ID required', 400)

    const updated = await prisma.sms_templates.update({
      where: { id },
      data: {
        ...(sms_body  !== undefined && { sms_body }),
        ...(wa_body   !== undefined && { wa_body }),
        ...(is_active !== undefined && { is_active }),
        updated_at: new Date(),
      },
    })

    return successResponse({ template: updated })
  } catch (err: unknown) {
    console.error('[SMS TEMPLATES PUT ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}