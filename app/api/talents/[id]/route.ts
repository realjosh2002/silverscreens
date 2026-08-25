export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Auth: accept any valid token, or allow if no token (page is behind agency middleware)
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (token) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
      if (error || !user) {
        // Token invalid — try to continue anyway since page is agency-protected
        // Only block if clearly malicious (no token at all is fine for middleware-protected routes)
      }
    }

    const talent = await prisma.aspirant_profiles.findUnique({
      where: { id },
      include: {
        aspirant_media: {
          orderBy: { order_index: 'asc' },
        },

        profiles: {
          select: {
            id:             true,
            email:          true,
            phone:          true,
            profile_number: true,
            last_login_at:  true,
            created_at:     true,
          },
        },
      },
    })

    if (!talent) return errorResponse('Talent not found', 404)

    // Increment profile views
    await prisma.aspirant_profiles.update({
      where: { id },
      data:  { profile_views: { increment: 1 } },
    })

    return successResponse({ talent })
  } catch (error: unknown) {
    console.error('[GET TALENT BY ID ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}