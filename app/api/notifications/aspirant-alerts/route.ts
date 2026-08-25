export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/* ─── Email builder ─────────────────────────────────────────── */
function buildNewAspirantEmail(opts: {
  agencyName: string
  castingTitle: string
  castingCallId: string
  roleName: string
  aspirants: Array<{
    name: string
    profileNumber: string
    category: string
    role: string
    location: string
    experienceLevel: string
    profileId: string
    skills: string[]
  }>
}): { subject: string; html: string } {
  const { agencyName, castingTitle, roleName, castingCallId, aspirants } = opts
  const castingUrl = `${APP_URL}/agency/casting-calls/${castingCallId}`
  const talentUrl  = `${APP_URL}/agency/talent-search`

  const aspirantCards = aspirants.map(a => `
    <div style="background:#F8F8F8;border:1px solid #E8E8E8;border-radius:8px;overflow:hidden;margin-bottom:12px;">
      <div style="background:#111111;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <span style="font-size:15px;font-weight:700;color:#ffffff;">${a.name}</span>
          <span style="font-size:12px;color:#aaa;margin-left:10px;">${a.profileNumber}</span>
        </div>
        <span style="font-size:12px;color:#C8202A;font-weight:600;background:rgba(200,32,42,0.15);padding:3px 10px;border-radius:12px;">${a.category}</span>
      </div>
      <div style="padding:14px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#555;">• Role: <strong>${a.role}</strong></td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#555;">• Experience: ${a.experienceLevel}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#555;">• Location: ${a.location}</td>
          </tr>
          ${a.skills.length ? `<tr><td style="padding:3px 0;font-size:13px;color:#555;">• Skills: ${a.skills.slice(0, 4).join(', ')}${a.skills.length > 4 ? ' +more' : ''}</td></tr>` : ''}
        </table>
        <div style="margin-top:12px;">
          <a href="${APP_URL}/agency/talent/${a.profileId}" style="display:inline-block;background:#C8202A;color:#fff;font-size:13px;font-weight:700;text-decoration:none;padding:8px 20px;border-radius:5px;">
            View Profile
          </a>
        </div>
      </div>
    </div>
  `).join('')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>New Talent Matching Your Casting</title>
</head>
<body style="margin:0;padding:0;background:#F2F1EC;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F1EC;padding:30px 15px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:20px;">
    <a href="${APP_URL}" style="text-decoration:none;">
      <div style="line-height:1;"><span style="font-family:'Arial Narrow',Impact,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:3px;color:#111111;text-transform:uppercase;">SILVER</span><span style="font-family:'Arial Narrow',Impact,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:3px;color:#C8202A;text-transform:uppercase;">SCREENS</span></div>
      <div style="height:3px;background:#C8202A;border-radius:1px;margin:3px 0 6px;width:100%;"></div>
      <div style="font-size:9px;color:#888888;letter-spacing:4px;text-align:center;font-family:Arial,sans-serif;">WE MAKE CELEBRITIES</div>
    </a>
  </td></tr>

  <!-- Header -->
  <tr><td align="center" style="padding-bottom:6px;">
    <p style="margin:0;font-size:20px;font-weight:700;color:#111111;">New talent matching your casting call</p>
  </td></tr>
  <tr><td align="center" style="padding-bottom:20px;">
    <a href="${castingUrl}" style="font-size:14px;color:#C8202A;text-decoration:none;font-weight:600;">Talent Alerts: Daily Digest</a>
  </td></tr>

  <!-- Main card -->
  <tr><td style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="padding:28px 32px 0;">
      <p style="margin:0 0 6px;font-size:13px;color:#888;">Daily digest — ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <h2 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#111111;">${castingTitle}</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#666;">Role: <strong>${roleName}</strong></p>
      <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.6;">
        Hi <strong>${agencyName}</strong>, ${aspirants.length} new talent profile${aspirants.length > 1 ? 's' : ''} matching your open casting call registered on SilverScreens today. Review and shortlist them before others do.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:0 0 20px;">
    </div>

    <!-- Aspirant cards -->
    <div style="padding:0 32px 24px;">
      ${aspirantCards}
    </div>

    <!-- View all -->
    <div style="padding:0 32px 28px;text-align:center;">
      <a href="${talentUrl}" style="display:inline-block;border:2px solid #111;color:#111;font-size:14px;font-weight:700;text-decoration:none;padding:10px 28px;border-radius:5px;">
        Search All Talent
      </a>
    </div>
  </td></tr>

  <!-- Promo -->
  <tr><td style="background:#111111;border-radius:8px;padding:24px 32px;margin-top:16px;text-align:center;">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#ffffff;">Find the perfect talent for your project.</p>
    <p style="margin:0 0 14px;font-size:14px;color:#aaa;">Whether you're just starting out or an experienced artist, SilverScreens provides the opportunities, resources, and support you need to find your next role.</p>
    <a href="${APP_URL}/agency/talent-search" style="display:inline-block;background:#C8202A;color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:10px 28px;border-radius:5px;">
      Explore Talent
    </a>
  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding:20px 0;">
    <p style="margin:0 0 6px;font-size:12px;color:#888;">
      You're receiving this because you have an open casting call on SilverScreens.
    </p>
    <p style="margin:0;font-size:12px;color:#888;">
      <a href="${APP_URL}/agency/settings" style="color:#C8202A;text-decoration:none;">Manage notification preferences</a>
      &nbsp;·&nbsp;
      <a href="${APP_URL}/agency/casting-calls" style="color:#C8202A;text-decoration:none;">Manage your casting calls</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  return {
    subject: `${aspirants.length} new talent match${aspirants.length > 1 ? 'es' : ''} for '${castingTitle}'`,
    html,
  }
}

/* ─── Match new aspirants to open casting calls ─────────────── */
async function matchAspirантsТоCastings(aspirantProfile: any): Promise<any[]> {
  // Find open casting calls that match this aspirant
  let query = supabase
    .from('casting_calls')
    .select('id, agency_id, title, role_name, gender_preference, age_min, age_max, experience_level, skills_required, category')
    .eq('status', 'active')

  if (aspirantProfile.gender) {
    query = query.or(`gender_preference.eq.any,gender_preference.eq.${aspirantProfile.gender}`)
  }
  if (aspirantProfile.category) {
    query = query.eq('category', aspirantProfile.category)
  }

  const { data: castings, error } = await query.limit(50)
  if (error || !castings) return []

  // Filter by skills match
  return castings.filter(c => {
    if (!c.skills_required?.length) return true
    const aspirantSkills = (aspirantProfile.skills || []).map((s: string) => s.toLowerCase())
    return c.skills_required.some((s: string) => aspirantSkills.includes(s.toLowerCase()))
  })
}

/* ─── POST — called when a new aspirant profile is approved ─── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { aspirant_user_id, test_email } = body

    if (!aspirant_user_id) {
      return NextResponse.json({ error: 'aspirant_user_id is required' }, { status: 400 })
    }

    // Get aspirant profile
    const { data: aspirant, error: aspErr } = await supabase
      .from('aspirant_profiles')
      .select('*')
      .eq('user_id', aspirant_user_id)
      .single()

    if (aspErr || !aspirant) {
      return NextResponse.json({ error: 'Aspirant profile not found' }, { status: 404 })
    }

    // Get matching casting calls
    const matchingCastings = await matchAspirантsТоCastings(aspirant)
    if (!matchingCastings.length) {
      return NextResponse.json({ success: true, message: 'No matching casting calls found', sent: 0 })
    }

    const results = { sent: 0, skipped: 0, errors: [] as string[] }

    // Group by agency — send one email per agency covering all their matching castings
    const agencyMap: Record<string, typeof matchingCastings> = {}
    for (const casting of matchingCastings) {
      if (!agencyMap[casting.agency_id]) agencyMap[casting.agency_id] = []
      agencyMap[casting.agency_id].push(casting)
    }

    const aspirantName = `${aspirant.first_name || ''} ${aspirant.last_name || ''}`.trim() || 'New Talent'
    const aspirantData = {
      name:            aspirantName,
      profileNumber:   aspirant.profile_number || '',
      category:        aspirant.category || '',
      role:            aspirant.role || '',
      location:        [aspirant.city, aspirant.state, aspirant.country].filter(Boolean).join(', ') || 'India',
      experienceLevel: aspirant.experience_level || 'Fresher',
      profileId:       aspirant.id,
      skills:          aspirant.skills || [],
    }

    for (const [agencyId, castings] of Object.entries(agencyMap)) {
      try {
        // Get agency profile and email
        const { data: agencyProfile } = await supabase
          .from('agency_profiles')
          .select('company_name, user_id')
          .eq('user_id', agencyId)
          .single()

        const { data: agencyAuth } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', agencyId)
          .single()

        if (!agencyAuth?.email) { results.skipped++; continue }

        const agencyName = agencyProfile?.company_name || 'Agency'

        // Send one email per casting call (PRD: once a day per agency)
        for (const casting of castings) {
          const { subject, html } = buildNewAspirantEmail({
            agencyName,
            castingTitle:   casting.title,
            castingCallId:  casting.id,
            roleName:       casting.role_name,
            aspirants:      [aspirantData],
          })

          await sendEmail({ to: test_email || agencyAuth.email, subject: test_email ? `[TEST→${agencyAuth.email}] ${subject}` : subject, html })

          // In-app notification for agency
          await supabase.from('notifications').insert({
            user_id:    agencyId,
            title:      `New talent match for '${casting.title}'`,
            message:    `${aspirantName} (${aspirant.category}) just registered and matches your casting call for ${casting.role_name}.`,
            type:       'talent_match',
            is_read:    false,
            created_at: new Date().toISOString(),
          })
        }

        results.sent++
      } catch (err: any) {
        results.errors.push(`agency ${agencyId}: ${err.message}`)
        results.skipped++
      }
    }

    return NextResponse.json({
      success:           true,
      aspirant_id:       aspirant_user_id,
      castings_matched:  matchingCastings.length,
      agencies_notified: Object.keys(agencyMap).length,
      ...results,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/* ─── GET — daily digest: new aspirants registered today → agencies ── */
export async function GET(req: NextRequest) {
  const testEmail = req.nextUrl.searchParams.get('test_email')
  // Get all aspirants approved in the last 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const { data: newAspirants, error } = await supabase
    .from('aspirant_profiles')
    .select('*')
    .eq('verification_status', 'approved')
    .gte('created_at', since)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!newAspirants?.length) return NextResponse.json({ success: true, message: 'No new aspirants today', sent: 0 })

  // Get all active casting calls
  const { data: activeCastings } = await supabase
    .from('casting_calls')
    .select('id, agency_id, title, role_name, gender_preference, category, skills_required, experience_level')
    .eq('status', 'active')

  if (!activeCastings?.length) return NextResponse.json({ success: true, message: 'No active casting calls', sent: 0 })

  // Group aspirants by which agency casting calls they match
  const agencyCastingMap: Record<string, {
    casting: any
    aspirants: any[]
  }> = {}

  for (const aspirant of newAspirants) {
    for (const casting of activeCastings) {
      // Check gender match
      if (casting.gender_preference && casting.gender_preference !== 'any' && aspirant.gender !== casting.gender_preference) continue
      // Check category match
      if (casting.category && aspirant.category !== casting.category) continue
      // Check skills
      if (casting.skills_required?.length) {
        const aspirantSkills = (aspirant.skills || []).map((s: string) => s.toLowerCase())
        const hasSkill = casting.skills_required.some((s: string) => aspirantSkills.includes(s.toLowerCase()))
        if (!hasSkill) continue
      }

      const key = `${casting.agency_id}::${casting.id}`
      if (!agencyCastingMap[key]) agencyCastingMap[key] = { casting, aspirants: [] }
      agencyCastingMap[key].aspirants.push(aspirant)
    }
  }

  const results = { sent: 0, skipped: 0, errors: [] as string[] }

  for (const [key, { casting, aspirants }] of Object.entries(agencyCastingMap)) {
    const agencyId = casting.agency_id
    try {
      const { data: agencyProfile } = await supabase
        .from('agency_profiles')
        .select('company_name')
        .eq('user_id', agencyId)
        .single()

      const { data: agencyAuth } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', agencyId)
        .single()

      if (!agencyAuth?.email) { results.skipped++; continue }

      const aspirantDataList = aspirants.map(a => ({
        name:            `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'New Talent',
        profileNumber:   a.profile_number || '',
        category:        a.category || '',
        role:            a.role || '',
        location:        [a.city, a.state, a.country].filter(Boolean).join(', ') || 'India',
        experienceLevel: a.experience_level || 'Fresher',
        profileId:       a.id,
        skills:          a.skills || [],
      }))

      const { subject, html } = buildNewAspirantEmail({
        agencyName:    agencyProfile?.company_name || 'Agency',
        castingTitle:  casting.title,
        castingCallId: casting.id,
        roleName:      casting.role_name,
        aspirants:     aspirantDataList,
      })

      await sendEmail({ to: testEmail || agencyAuth.email, subject: testEmail ? `[TEST→${agencyAuth.email}] ${subject}` : subject, html })

      results.sent++
    } catch (err: any) {
      results.errors.push(`${key}: ${err.message}`)
      results.skipped++
    }
  }

  return NextResponse.json({ success: true, new_aspirants: newAspirants.length, ...results })
}
