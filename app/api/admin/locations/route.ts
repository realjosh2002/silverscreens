export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

const LOCATION_KEY = 'location_config'

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const profile = await prisma.profiles.findUnique({
    where: { id: user.id }, select: { role: true },
  })
  if (profile?.role !== 'admin') return null
  return user
}

// GET /api/admin/locations — fetch location config
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const setting = await prisma.system_settings.findUnique({
      where: { key: LOCATION_KEY },
    })

    if (!setting?.value) {
      // First time — return empty, client will load from locationData.json
      return successResponse({ config: null })
    }

    return successResponse({ config: JSON.parse(setting.value) })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

// PUT /api/admin/locations — save location config
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { config } = body
    if (!config || !Array.isArray(config)) {
      return errorResponse('Invalid config — must be an array', 400)
    }

    await prisma.system_settings.upsert({
      where:  { key: LOCATION_KEY },
      update: { value: JSON.stringify(config), updated_by: admin.id, updated_at: new Date() },
      create: { key: LOCATION_KEY, value: JSON.stringify(config), updated_by: admin.id, description: 'Active countries, states and cities for the platform' },
    })

    return successResponse({ message: 'Location config saved successfully' })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

// GET /api/admin/locations/public — public endpoint for aspirant dropdowns (no auth)
// We use a separate route for this — see locations/public/route.ts
