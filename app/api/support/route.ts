export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/support — submit a support ticket
// GET  /api/support — list the logged-in user's own tickets

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const { category, subject, description } = body

    if (!category || !subject?.trim() || !description?.trim()) {
      return errorResponse('category, subject and description are required', 400)
    }

    const ticket = await prisma.support_tickets.create({
      data: {
        user_id: user.id,
        category,
        subject: subject.trim(),
        description: description.trim(),
        status: 'open',
        priority: 'medium',
      },
      select: {
        id: true,
        category: true,
        subject: true,
        status: true,
        priority: true,
        created_at: true,
      },
    })

    return successResponse({ ticket }, 201)
  } catch (error: unknown) {
    console.error('[POST SUPPORT TICKET ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const tickets = await prisma.support_tickets.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        category: true,
        subject: true,
        status: true,
        priority: true,
        created_at: true,
        resolved_at: true,
      },
    })

    return successResponse({ tickets })
  } catch (error: unknown) {
    console.error('[GET SUPPORT TICKETS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
