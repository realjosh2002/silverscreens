import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

export async function POST(req: NextRequest) {
  try {
    const { toPhone } = await req.json()

    if (!toPhone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
    }

    // Load Twilio credentials from system_settings
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')

    if (error) {
      return NextResponse.json({ error: 'DB error: ' + error.message }, { status: 500 })
    }

    const cfg: Record<string, string> = {}
    if (data) data.forEach(function(r: any) { cfg[r.key] = r.value })

    const accountSid = cfg['sms_account_sid']
    const authToken  = cfg['sms_auth_token']
    const fromNumber = cfg['sms_from_number']

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json({
        error: 'Twilio credentials not found.'
      }, { status: 400 })
    }

    // Exactly match the working curl command:
    // -d "To=whatsapp%3A%2B919941898418"
    // -d "From=whatsapp%3A%2B17372508034"
    // -d "ContentSid=HXfe5ab5f00277942d4d4200328b4d403c"
    const toWA   = 'whatsapp:' + toPhone.replace(/\s/g, '')
    const fromWA = 'whatsapp:' + fromNumber.trim()

    // Build body exactly like curl -d params (each as separate encoded entry)
    const bodyStr = [
      'To='         + encodeURIComponent(toWA),
      'From='       + encodeURIComponent(fromWA),
      'ContentSid=' + encodeURIComponent('HXfe5ab5f00277942d4d4200328b4d403c'),
    ].join('&')

    console.log('[WA TEST] Sending:', bodyStr)

    const auth = Buffer.from(accountSid + ':' + authToken).toString('base64')

    const twilioRes = await fetch(
      'https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json',
      {
        method:  'POST',
        headers: {
          'Authorization':  'Basic ' + auth,
          'Content-Type':   'application/x-www-form-urlencoded',
        },
        body: bodyStr,
      }
    )

    const twilioData = await twilioRes.json()
    console.log('[WA TEST] Twilio response:', JSON.stringify(twilioData))

    if (!twilioRes.ok) {
      return NextResponse.json({
        error: 'Twilio error: ' + (twilioData.message || JSON.stringify(twilioData))
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      sid:     twilioData.sid,
      message: 'WhatsApp message sent to ' + toPhone,
    })

  } catch (err: any) {
    console.error('[WA TEST ERROR]', err)
    return NextResponse.json({ error: 'Unexpected error: ' + err.message }, { status: 500 })
  }
}