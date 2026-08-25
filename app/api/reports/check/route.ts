export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/reports/check?reported_user_id=xxx
// Returns { exists: true/false } — whether the logged-in user has already reported this person

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const { searchParams } = new URL(req.url)
    const reported_user_id   = searchParams.get('reported_user_id')   || ''
    const reported_entity_id = searchParams.get('reported_entity_id') || ''

    // Need at least one identifier to check against
    if (!reported_user_id && !reported_entity_id) {
      return successResponse({ exists: false })
    }

    // Build OR conditions — check both the auth UUID and the aspirant_profiles.id
    // because different code paths may store either one as reported_user_id
    const orConditions: any[] = []
    if (reported_user_id)   orConditions.push({ reported_user_id: reported_user_id })
    if (reported_entity_id) orConditions.push({ reported_user_id: reported_entity_id })

    const existing = await prisma.reports.findFirst({
      where: {
        reported_by: user.id,
        OR: orConditions,
      },
      select: { id: true },
    })

    return successResponse({ exists: !!existing })

  } catch (err: unknown) {
    console.error('[REPORTS CHECK ERROR]', err)
    return successResponse({ exists: false }) // fail safe — let them report
  }
}
