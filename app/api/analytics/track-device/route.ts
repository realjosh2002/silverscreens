export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, device_type, user_agent } = body

    if (!user_id || !device_type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Use fetch to call Supabase REST API directly — avoids any SDK issues
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY

    const res = await fetch(`${supabaseUrl}/rest/v1/device_sessions`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        serviceKey!,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({
        user_id,
        device_type,
        user_agent: user_agent?.substring(0, 500) ?? null,
        created_at: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
