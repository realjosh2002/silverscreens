import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/auth/refresh — refresh expired access token
export async function POST(req: NextRequest) {
  try {
    const { refresh_token } = await req.json()
    if (!refresh_token) return errorResponse('refresh_token required', 400)

    const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token })
    if (error || !data.session) return errorResponse('Token refresh failed', 401)

    return successResponse({
      access_token:  data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at:    data.session.expires_at,
    })
  } catch (err: unknown) {
    return errorResponse('Internal server error', 500)
  }
}