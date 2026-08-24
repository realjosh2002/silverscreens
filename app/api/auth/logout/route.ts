import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return errorResponse('No session token provided', 401)
    }

    // ─── 1. Get user from token ────────────────────────────────
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (!error && user) {
      // ─── 2. Log the logout ──────────────────────────────────
      await prisma.audit_logs.create({
        data: {
          user_id:     user.id,
          action:      'USER_LOGOUT',
          entity_type: 'profiles',
          entity_id:   user.id,
          ip_address:  req.headers.get('x-forwarded-for') || undefined,
          user_agent:  req.headers.get('user-agent') || undefined,
        },
      })
    }

    // ─── 3. Sign out from Supabase ─────────────────────────────
    await supabase.auth.signOut()

    return successResponse({ message: 'Logged out successfully' })
  } catch (error: unknown) {
    console.error('[LOGOUT ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}