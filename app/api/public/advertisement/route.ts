export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { successResponse, errorResponse } from '@/lib/api-helpers'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/* ── GET /api/public/advertisement?placement=Homepage Top Banner ── */
export async function GET(req: NextRequest) {
  try {
    const placement = new URL(req.url).searchParams.get('placement')
    if (!placement) return errorResponse('placement is required', 400)

    // Fetch the first active ad for this placement
    // If admin set it Active, we show it — no date filtering needed
    const { data, error } = await db()
      .from('advertisements')
      .select('id, name, media_url, click_url, impressions')
      .eq('status', 'active')
      .eq('placement', placement)
      .limit(1)
      .maybeSingle()

    if (error || !data) return successResponse({ ad: null })

    // Track impression
    await db()
      .from('advertisements')
      .update({ impressions: (data.impressions ?? 0) + 1 })
      .eq('id', data.id)

    return successResponse({ ad: { id: data.id, name: data.name, media_url: data.media_url, click_url: data.click_url } })
  } catch {
    return successResponse({ ad: null })
  }
}

/* ── POST /api/public/advertisement — track click ── */
export async function POST(req: NextRequest) {
  try {
    const { id, action } = await req.json()
    if (!id || action !== 'click') return errorResponse('invalid', 400)

    // Get current clicks and increment
    const { data } = await db()
      .from('advertisements')
      .select('clicks')
      .eq('id', id)
      .single()

    await db()
      .from('advertisements')
      .update({ clicks: ((data as any)?.clicks ?? 0) + 1 })
      .eq('id', id)

    return successResponse({ ok: true })
  } catch {
    return successResponse({ ok: true }) // never break
  }
}
