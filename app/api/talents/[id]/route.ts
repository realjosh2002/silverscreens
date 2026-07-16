import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const talent = await prisma.aspirant_profiles.findUnique({
      where: { id },
      include: {
        aspirant_media: {
          orderBy: { order_index: 'asc' },
        },
        profiles: {
          select: {
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