export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/* ─── Email builder ─────────────────────────────────────────── */
function buildCastingAlertEmail(opts: {
  aspirantName: string
  castingTitle: string
  projectType: string
  roleName: string
  roleDescription: string
  agencyName: string
  location: string
  budgetMin: number | null
  budgetMax: number | null
  compensationDetails: string | null
  lastApplicationDate: string
  ageMin: number | null
  ageMax: number | null
  gender: string
  castingCallId: string
  postedAgo: string
}): { subject: string; html: string } {
  const {
    aspirantName, castingTitle, projectType, roleName, roleDescription,
    agencyName, location, budgetMin, budgetMax, compensationDetails,
    lastApplicationDate, ageMin, ageMax, gender, castingCallId, postedAgo,
  } = opts

  const applyUrl  = `${APP_URL}/auditions/${castingCallId}`
  const allUrl    = `${APP_URL}/auditions`

  const deadlineDate = new Date(lastApplicationDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const pay = compensationDetails
    ? compensationDetails
    : budgetMin && budgetMax
      ? `₹${budgetMin.toLocaleString('en-IN')} – ₹${budgetMax.toLocaleString('en-IN')}`
      : budgetMax
        ? `Up to ₹${budgetMax.toLocaleString('en-IN')}`
        : 'To be discussed'

  const ageRange = ageMin && ageMax ? `${ageMin}–${ageMax} years` : ageMax ? `Up to ${ageMax} years` : null
  const genderLabel = gender === 'any' ? 'Any Gender' : gender?.charAt(0).toUpperCase() + gender?.slice(1)

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>New Casting Alert — ${castingTitle}</title>
</head>
<body style="margin:0;padding:0;background:#F2F1EC;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F1EC;padding:30px 15px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:20px;">
    <a href="${APP_URL}" style="text-decoration:none;">
      <div style="display:inline-block;line-height:1;text-align:center;">
        <div style="line-height:1;"><span style="font-family:'Arial Narrow',Impact,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:3px;color:#111111;text-transform:uppercase;">SILVER</span><span style="font-family:'Arial Narrow',Impact,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:3px;color:#C8202A;text-transform:uppercase;">SCREENS</span></div>
        <div style="height:3px;background:#C8202A;border-radius:1px;margin:3px 0 6px;width:100%;"></div>
        <div style="font-size:9px;color:#888888;letter-spacing:4px;text-align:center;font-family:Arial,sans-serif;">WE MAKE CELEBRITIES</div>
      </div>
    </a>
  </td></tr>

  <!-- Sub-header -->
  <tr><td align="center" style="padding-bottom:6px;">
    <p style="margin:0;font-size:20px;font-weight:700;color:#111111;">New job matching your search</p>
  </td></tr>
  <tr><td align="center" style="padding-bottom:20px;">
    <a href="${allUrl}" style="font-size:14px;color:#C8202A;text-decoration:none;font-weight:600;">Casting Alerts: Instant Notifications</a>
  </td></tr>

  <!-- Trusted by strip -->
  <tr><td align="center" style="padding-bottom:20px;">
    <p style="margin:0;font-size:12px;color:#888;letter-spacing:1px;">TRUSTED BY LEADING PRODUCTION HOUSES & AGENCIES</p>
  </td></tr>

  <!-- Main card -->
  <tr><td style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

    <!-- Posted time + title -->
    <div style="padding:28px 32px 0;">
      <p style="margin:0 0 6px;font-size:13px;color:#888;">Posted ${postedAgo}</p>
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#111111;">${castingTitle}</h2>
      <p style="margin:0 0 18px;font-size:15px;color:#444;line-height:1.6;">
        ${roleDescription.length > 200 ? roleDescription.substring(0, 200) + '…' : roleDescription}
        ${roleDescription.length > 200 ? `<a href="${applyUrl}" style="color:#C8202A;font-weight:600;"> More</a>` : ''}
      </p>
      <p style="margin:0 0 20px;font-size:13px;color:#666;">
        📍 Seeking talent from: <strong>${location || 'Worldwide'}</strong>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        🎬 ${projectType}
        ${agencyName ? `&nbsp;&nbsp;|&nbsp;&nbsp;🏢 ${agencyName}` : ''}
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:0 0 20px;">
    </div>

    <!-- Role box -->
    <div style="padding:0 32px 24px;">
      <div style="background:#F8F8F8;border:1px solid #E8E8E8;border-radius:8px;overflow:hidden;">

        <!-- Role header -->
        <div style="background:#111111;padding:14px 20px;">
          <h3 style="margin:0;font-size:16px;font-weight:700;color:#ffffff;">${roleName}</h3>
        </div>

        <!-- Role details -->
        <div style="padding:16px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${genderLabel ? `<tr><td style="padding:3px 0;font-size:14px;color:#555;">• ${genderLabel}</td></tr>` : ''}
            ${ageRange ? `<tr><td style="padding:3px 0;font-size:14px;color:#555;">• Age: ${ageRange}</td></tr>` : ''}
            <tr><td style="padding:3px 0;font-size:14px;color:#555;">• ${pay}</td></tr>
            <tr><td style="padding:3px 0;font-size:14px;color:#555;">• Apply by: <strong>${deadlineDate}</strong></td></tr>
          </table>
        </div>

        <!-- Apply button -->
        <div style="padding:0 20px 20px;">
          <a href="${applyUrl}" style="display:inline-block;background:#C8202A;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:10px 28px;border-radius:5px;">
            Apply
          </a>
        </div>

      </div>
    </div>

    <!-- View all -->
    <div style="padding:0 32px 28px;text-align:center;">
      <a href="${allUrl}" style="display:inline-block;border:2px solid #111;color:#111;font-size:14px;font-weight:700;text-decoration:none;padding:10px 28px;border-radius:5px;">
        View All Casting Calls
      </a>
    </div>

  </td></tr>

  <!-- Promo banner -->
  <tr><td style="background:#111111;border-radius:8px;padding:24px 32px;margin-top:16px;text-align:center;">
    <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#ffffff;">SilverScreens — We Make Celebrities.</p>
    <p style="margin:0 0 14px;font-size:14px;color:#aaa;">Whether you're just starting out or an experienced artist, SilverScreens provides the opportunities, resources, and support you need to find your next role.</p>
    <a href="${APP_URL}/auditions" style="display:inline-block;background:#C8202A;color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:10px 28px;border-radius:5px;">
      Get Cast Today
    </a>
  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding:20px 0;">
    <p style="margin:0 0 6px;font-size:12px;color:#888;">
      You're receiving this email because your profile matches this casting call on SilverScreens.
    </p>
    <p style="margin:0;font-size:12px;color:#888;">
      Hi <strong>${aspirantName}</strong> · <a href="${APP_URL}/settings" style="color:#C8202A;text-decoration:none;">Manage notification preferences</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  return {
    subject: `Casting Alert | '${castingTitle}'`,
    html,
  }
}

/* ─── Match aspirants to a casting call ─────────────────────── */
async function findMatchingAspirants(castingCall: any) {
  let query = supabase
    .from('aspirant_profiles')
    .select('user_id, first_name, last_name, gender, category, role, experience_level, languages, skills, is_available')
    .eq('verification_status', 'approved')
    .eq('is_available', true)

  // Match gender
  if (castingCall.gender_preference && castingCall.gender_preference !== 'any') {
    query = query.eq('gender', castingCall.gender_preference)
  }

  // Match category
  if (castingCall.category) {
    query = query.eq('category', castingCall.category)
  }

  // Match experience level
  if (castingCall.experience_level) {
    query = query.eq('experience_level', castingCall.experience_level)
  }

  const { data, error } = await query.limit(500)
  if (error || !data) return []

  // Further filter: skills overlap
  return data.filter(aspirant => {
    if (!castingCall.skills_required?.length) return true
    const aspirantSkills = (aspirant.skills || []).map((s: string) => s.toLowerCase())
    return castingCall.skills_required.some((s: string) =>
      aspirantSkills.includes(s.toLowerCase())
    )
  })
}

/* ─── GET — called when a new casting call is created ───────── */
export async function GET(req: NextRequest) {
  const castingCallId = req.nextUrl.searchParams.get('casting_call_id')
  const testEmail     = req.nextUrl.searchParams.get('test_email') // override: send all emails here
  if (!castingCallId) {
    return NextResponse.json({ error: 'casting_call_id is required' }, { status: 400 })
  }

  // Fetch casting call
  const { data: cc, error: ccErr } = await supabase
    .from('casting_calls')
    .select('*, agency_id, title, project_type, role_name, role_description, gender_preference, age_min, age_max, experience_level, skills_required, languages_required, budget_min, budget_max, location, compensation_details, last_application_date, category, created_at')
    .eq('id', castingCallId)
    .single()

  if (ccErr || !cc) {
    return NextResponse.json({ error: 'Casting call not found' }, { status: 404 })
  }

  // Get agency name from agency_profiles
  const { data: agency } = await supabase
    .from('agency_profiles')
    .select('company_name')
    .eq('user_id', cc.agency_id)
    .single()

  const agencyName = agency?.company_name || 'A Production House'

  // Posted ago string
  const createdAt  = new Date(cc.created_at)
  const diffMs     = Date.now() - createdAt.getTime()
  const diffHours  = Math.floor(diffMs / 3600000)
  const postedAgo  = diffHours < 1 ? 'just now' : diffHours < 24 ? `${diffHours} hour${diffHours > 1 ? 's' : ''} ago` : `${Math.floor(diffHours / 24)} days ago`

  // Find matching aspirants
  const aspirants = await findMatchingAspirants(cc)

  const results = { sent: 0, skipped: 0, errors: [] as string[] }

  for (const aspirant of aspirants) {
    try {
      // Get email from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, name')
        .eq('id', aspirant.user_id)
        .single()

      if (!profile?.email) { results.skipped++; continue }

      const aspirantName = `${aspirant.first_name || ''} ${aspirant.last_name || ''}`.trim() || profile.name || 'Valued Member'

      const { subject, html } = buildCastingAlertEmail({
        aspirantName,
        castingTitle:        cc.title,
        projectType:         cc.project_type || 'Film / TV',
        roleName:            cc.role_name,
        roleDescription:     cc.role_description || '',
        agencyName,
        location:            cc.location || 'Worldwide',
        budgetMin:           cc.budget_min,
        budgetMax:           cc.budget_max,
        compensationDetails: cc.compensation_details,
        lastApplicationDate: cc.last_application_date,
        ageMin:              cc.age_min,
        ageMax:              cc.age_max,
        gender:              cc.gender_preference,
        castingCallId:       castingCallId,
        postedAgo,
      })

      await sendEmail({
        to:      testEmail || profile.email,
        subject: testEmail ? `[TEST→${profile.email}] ${subject}` : subject,
        html,
      })

      // Create in-app notification
      await supabase.from('notifications').insert({
        user_id:    aspirant.user_id,
        title:      `New Casting: ${cc.title}`,
        message:    `A new casting call matching your profile has been posted. Role: ${cc.role_name}. Apply before ${new Date(cc.last_application_date).toLocaleDateString('en-IN')}.`,
        type:       'casting_alert',
        is_read:    false,
        created_at: new Date().toISOString(),
      })

      results.sent++
    } catch (err: any) {
      results.errors.push(`${aspirant.user_id}: ${err.message}`)
      results.skipped++
    }
  }

  return NextResponse.json({
    success:         true,
    casting_call_id: castingCallId,
    casting_title:   cc.title,
    aspirants_found: aspirants.length,
    ...results,
  })
}
