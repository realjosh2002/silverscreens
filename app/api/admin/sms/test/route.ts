export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { toPhone, message } = await req.json()

    if (!toPhone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
    }

    // Use hardcoded credentials lookup from env as fallback
    // First try to get from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')

    if (error) {
      console.error('[SMS TEST] DB error:', error)
      return NextResponse.json({ error: 'DB error: ' + error.message }, { status: 500 })
    }

    console.log('[SMS TEST] All settings count:', data?.length)

    const cfg: Record<string, string> = {}
    if (data) data.forEach(function(r: any) { cfg[r.key] = r.value })

    const accountSid = cfg['sms_account_sid']
    const authToken  = cfg['sms_auth_token']
    const fromNumber = cfg['sms_from_number']

    console.log('[SMS TEST] SID:', accountSid ? accountSid.slice(0, 6) + '...' : 'missing')
    console.log('[SMS TEST] Token:', authToken ? 'present' : 'missing')
    console.log('[SMS TEST] From:', fromNumber || 'missing')

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json({
        error: 'Missing Twilio credentials in database. Found keys: ' + Object.keys(cfg).join(', ')
      }, { status: 400 })
    }

    const testMessage = message || 'This is a test SMS from SilverScreens Admin Panel.'
    const auth = Buffer.from(accountSid + ':' + authToken).toString('base64')
    const body = new URLSearchParams({
      To:   toPhone,
      From: fromNumber,
      Body: testMessage,
    })

    const twilioRes = await fetch(
      'https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json',
      {
        method:  'POST',
        headers: {
          Authorization:  'Basic ' + auth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    )

    const twilioData = await twilioRes.json()

    if (!twilioRes.ok) {
      return NextResponse.json({
        error: 'Twilio error: ' + (twilioData.message || JSON.stringify(twilioData))
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, sid: twilioData.sid, message: 'Test SMS sent to ' + toPhone })

  } catch (err: any) {
    console.error('[TEST SMS ERROR]', err)
    return NextResponse.json({ error: 'Unexpected error: ' + err.message }, { status: 500 })
  }
}
