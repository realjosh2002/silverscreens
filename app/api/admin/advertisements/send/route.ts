export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendEmail } from '@/lib/email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: p } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
  return p?.role === 'admin' ? user : null
}

function calcAge(dob: string | null): number | null {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
}

function buildAdEmail(opts: { recipientName: string; adName: string; adMessage: string; clickUrl: string | null; mediaUrl: string | null }): string {
  const { recipientName, adName, adMessage, clickUrl, mediaUrl } = opts
  const ctaUrl = clickUrl || APP_URL
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:#111111;padding:20px 32px;text-align:center;">
          <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:2px;">SILVER<span style="color:#C8202A;">SCREENS</span></span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:15px;color:#555555;">Hi <strong>${recipientName}</strong>,</p>
          <h2 style="margin:16px 0 8px;font-size:22px;color:#111111;">${adName}</h2>
          <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.6;">${adMessage}</p>
          ${mediaUrl ? `<img src="${mediaUrl}" alt="${adName}" style="width:100%;border-radius:8px;margin-bottom:24px;">` : ''}
          <div style="text-align:center;margin:24px 0;">
            <a href="${ctaUrl}" style="display:inline-block;background:#C8202A;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:7px;letter-spacing:0.5px;">
              View Details
            </a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8f8f8;padding:16px 32px;text-align:center;border-top:1px solid #eeeeee;">
          <p style="margin:0;font-size:12px;color:#999999;">© ${new Date().getFullYear()} SilverScreens. We Make Celebrities.</p>
          <p style="margin:4px 0 0;font-size:12px;color:#bbbbbb;">You received this because you match the criteria for this opportunity.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    const admin = await verifyAdmin(token)
    if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const body = await req.json()
    const {
      ad_id, preview,
      target_user_type, target_category, target_role,
      target_age_min, target_age_max, target_gender, target_location,
      delivery_channel, attachment,
    } = body

    if (!ad_id) return NextResponse.json({ error: 'ad_id is required' }, { status: 400 })

    // Fetch the ad
    const { data: ad, error: adErr } = await supabaseAdmin
      .from('advertisements').select('*').eq('id', ad_id).single()
    if (adErr || !ad) return NextResponse.json({ error: 'Ad not found' }, { status: 404 })

    // ── Query matching aspirant profiles ──
    let aspQuery = supabaseAdmin
      .from('aspirant_profiles')
      .select('user_id, first_name, last_name, date_of_birth, gender, city, state, category, role, verification_status')

    if (target_category) aspQuery = aspQuery.ilike('category', `%${target_category}%`)
    if (target_role)     aspQuery = aspQuery.ilike('role', `%${target_role}%`)
    if (target_gender && target_gender !== 'any') aspQuery = aspQuery.eq('gender', target_gender)
    if (target_location) aspQuery = aspQuery.or(`city.ilike.%${target_location}%,state.ilike.%${target_location}%`)

    const { data: aspirants } = await aspQuery

    // ── Query matching agency profiles ──
    let agcQuery = supabaseAdmin
      .from('agency_profiles')
      .select('user_id, company_name, city, state')

    if (target_location) agcQuery = agcQuery.or(`city.ilike.%${target_location}%,state.ilike.%${target_location}%`)

    const { data: agencies } = await agcQuery

    // ── Filter by user type ──
    let aspList = (aspirants || [])
    let agcList = (agencies  || [])
    if (target_user_type === 'aspirant') agcList = []
    if (target_user_type === 'agency')   aspList = []

    // ── Filter by age ──
    if (target_age_min || target_age_max) {
      aspList = aspList.filter(a => {
        const age = calcAge(a.date_of_birth)
        if (age === null) return true // include if no DOB — don't exclude
        if (target_age_min && age < parseInt(target_age_min)) return false
        if (target_age_max && age > parseInt(target_age_max)) return false
        return true
      })
    }

    // ── Collect user IDs and fetch profiles ──
    const matchedUserIds = [
      ...aspList.map((a: any) => a.user_id),
      ...agcList.map((a: any) => a.user_id),
    ]

    const { data: profiles } = matchedUserIds.length > 0
      ? await supabaseAdmin
          .from('profiles')
          .select('id, name, email, is_active')
          .in('id', matchedUserIds)
          .eq('is_active', true)
      : { data: [] }

    const activeProfiles = profiles || []
    const matched = activeProfiles.length
    const sample  = activeProfiles.slice(0, 5).map((p: any) => p.name || p.email || 'Unknown')

    // ── Preview mode ──
    if (preview) {
      return NextResponse.json({ matched, sample })
    }

    if (matched === 0) return NextResponse.json({ error: 'No matching users found', sent: 0 }, { status: 400 })

    const now     = new Date().toISOString()
    const adTitle = ad.name || 'New Advertisement'
    const adMsg   = `A new opportunity matching your profile is available on SilverScreens.`
    let sent = 0
    const errors: string[] = []

    // ── In-app notifications ──
    if (delivery_channel === 'inapp' || delivery_channel === 'both') {
      const notifRows = activeProfiles.map((p: any) => ({
        user_id:    p.id,
        title:      adTitle,
        message:    adMsg,
        type:       'advertisement',
        is_read:    false,
        action_url: ad.click_url || null,
        created_at: now,
      }))
      const batchSize = 500
      for (let i = 0; i < notifRows.length; i += batchSize) {
        const { error: nErr } = await supabaseAdmin.from('notifications').insert(notifRows.slice(i, i + batchSize))
        if (nErr) errors.push(`Notifications batch ${i}: ${nErr.message}`)
      }
      sent = activeProfiles.length
    }

    // ── Emails via lib/email.ts (Resend) ──
    if (delivery_channel === 'email' || delivery_channel === 'both') {
      // Send in batches of 50 (Resend rate limit safe)
      const batchSize = 50
      for (let i = 0; i < activeProfiles.length; i += batchSize) {
        const batch = activeProfiles.slice(i, i + batchSize)
        await Promise.allSettled(batch.map((p: any) => {
          const personalHtml = buildAdEmail({
            recipientName: p.name || 'there',
            adName:   adTitle,
            adMessage: adMsg,
            clickUrl: ad.click_url || null,
            mediaUrl: ad.media_url || null,
          })
          return sendEmail({
            to:      p.email,
            subject: `[SilverScreens] ${adTitle}`,
            html:    personalHtml,
            ...(attachment ? { attachments: [attachment] } : {}),
          })
        }))
        sent = i + batch.length
        if (i + batchSize < activeProfiles.length) {
          await new Promise(r => setTimeout(r, 300))
        }
      }
    }

    // ── Update ad impressions ──
    await supabaseAdmin.from('advertisements')
      .update({ impressions: (ad.impressions || 0) + matched })
      .eq('id', ad_id)

    return NextResponse.json({
      sent,
      matched,
      message: `Advertisement sent to ${sent} user(s) successfully`,
      errors: errors.length > 0 ? errors : undefined,
    })

  } catch (err: any) {
    console.error('[ADS SEND ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
