export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

async function verifyAdmin(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    // Add padding if needed for base64 decode
    const padded = parts[1] + '='.repeat((4 - parts[1].length % 4) % 4)
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'))
    const userId = payload.sub
    if (!userId) return null
    const profile = await prisma.profiles.findUnique({
      where: { id: userId }, select: { role: true, id: true },
    })
    if (profile?.role !== 'admin') return null
    return { id: userId }
  } catch { return null }
}

function getToken(req: NextRequest) {
  return req.headers.get('authorization')?.replace('Bearer ', '') || ''
}

// GET /api/admin/master-data?section=languages|skills|available_for|departments
// Public read — no auth required (used by create-profile and other aspirant pages)
export async function GET(req: NextRequest) {
  try {

    const section = new URL(req.url).searchParams.get('section') || 'all'

    // Languages — from platform_languages table
    let languages = null
    if (section === 'all' || section === 'languages') {
      languages = await prisma.platform_languages.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, native_name: true, code: true, is_active: true, is_default: true },
      })
    }

    // Skills, Available For, Departments — from system_settings JSON
    const KEYS = ['master_skills', 'master_available_for', 'master_departments']
    const settings = await prisma.system_settings.findMany({
      where: { key: { in: KEYS } },
    })

    const parse = (key: string) => {
      const s = settings.find(s => s.key === key)
      try { return s ? JSON.parse(s.value) : [] } catch { return [] }
    }

    return successResponse({
      languages,
      skills:        section === 'all' || section === 'skills'        ? parse('master_skills')        : null,
      available_for: section === 'all' || section === 'available_for' ? parse('master_available_for') : null,
      departments:   section === 'all' || section === 'departments'   ? parse('master_departments')   : null,
    })
  } catch (err: unknown) {
    console.error('[MASTER DATA GET]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

// PUT /api/admin/master-data — save a section
export async function PUT(req: NextRequest) {
  try {
    const token = getToken(req)
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { section, data } = body

    if (section === 'languages') {
      // Update is_active on platform_languages
      const { id, is_active } = body
      if (!id) return errorResponse('Language ID required', 400)
      await prisma.platform_languages.update({
        where: { id },
        data: { is_active },
      })
      return successResponse({ message: 'Language updated' })
    }

    if (section === 'language_add') {
      // Add new language
      const { name, native_name, code } = body
      if (!name || !code) return errorResponse('Name and code are required', 400)
      const existing = await prisma.platform_languages.findUnique({ where: { code } })
      if (existing) return errorResponse('Language code already exists', 400)
      const newLang = await prisma.platform_languages.create({
        data: {
          id: code.toLowerCase(),
          name, native_name: native_name || null,
          code: code.toUpperCase(),
          is_active: true, is_default: false,
        },
      })
      return successResponse({ language: newLang })
    }

    // For skills, available_for, departments — save as JSON in system_settings
    const KEY_MAP: Record<string, string> = {
      skills:        'master_skills',
      available_for: 'master_available_for',
      departments:   'master_departments',
    }
    const key = KEY_MAP[section]
    if (!key) return errorResponse('Invalid section', 400)
    if (!Array.isArray(data)) return errorResponse('Data must be an array', 400)

    await prisma.system_settings.upsert({
      where: { key },
      update: { value: JSON.stringify(data), updated_by: admin.id, updated_at: new Date() },
      create: { key, value: JSON.stringify(data), updated_by: admin.id, description: `Master data: ${section}` },
    })

    return successResponse({ message: `${section} saved successfully` })
  } catch (err: unknown) {
    console.error('[MASTER DATA PUT]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
