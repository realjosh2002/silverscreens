export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM    = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/* ── Email HTML template ── */
function buildEmail(opts: {
  name: string
  planName: string
  userType: string
  endsAt: Date
  daysLeft: number
  type: 'reminder_7' | 'reminder_3' | 'expired'
}): { subject: string; html: string } {
  const { name, planName, userType, endsAt, daysLeft, type } = opts
  const formattedDate = endsAt.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const renewUrl = `${APP_URL}/${userType === 'agency' ? 'agency' : 'dashboard'}/subscription`

  const subjectMap = {
    reminder_7: `Your ${planName} plan expires in 7 days`,
    reminder_3: `⚠️ Your ${planName} plan expires in 3 days — Renew now`,
    expired:    `Your ${planName} plan has expired`,
  }

  const headingMap = {
    reminder_7: 'Your Plan Expires in 7 Days',
    reminder_3: 'Your Plan Expires in 3 Days',
    expired:    'Your Plan Has Expired',
  }

  const messageMap = {
    reminder_7: `Just a heads-up — your <strong>${planName}</strong> plan expires on <strong>${formattedDate}</strong>. Renew now to keep your profile active and continue receiving casting opportunities.`,
    reminder_3: `Your <strong>${planName}</strong> plan expires in just 3 days on <strong>${formattedDate}</strong>. Don't let your profile go offline — renew today to stay visible to ${userType === 'agency' ? 'talents' : 'casting directors and agencies'}.`,
    expired:    `Your <strong>${planName}</strong> plan expired on <strong>${formattedDate}</strong>. Your profile has been temporarily hidden from search results. Renew your subscription to restore full access immediately.`,
  }

  const buttonMap = {
    reminder_7: 'Renew My Plan',
    reminder_3: 'Renew Now',
    expired:    'Restore My Access',
  }

  const accentColor = type === 'expired' ? '#EF4444' : type === 'reminder_3' ? '#F97316' : '#D4A64A'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subjectMap[type]}</title>
</head>
<body style="margin:0;padding:0;background:#0D1117;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="display:inline-block;line-height:1;text-align:center;">
                <div><span style="font-family:'Arial Narrow',Impact,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:3px;color:#F5F5F5;text-transform:uppercase;">SILVER</span><span style="font-family:'Arial Narrow',Impact,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:3px;color:#C8202A;text-transform:uppercase;border-bottom:3px solid #C8202A;padding-bottom:1px;">SCREENS</span></div>
                <div style="font-size:9px;color:#6B7280;letter-spacing:4px;text-align:center;margin-top:6px;font-family:Arial,sans-serif;">WE MAKE CELEBRITIES</div>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#131720;border:1px solid ${accentColor}33;border-radius:12px;overflow:hidden;">

              <!-- Top accent bar -->
              <div style="height:4px;background:linear-gradient(90deg,${accentColor},${accentColor}88);"></div>

              <!-- Content -->
              <div style="padding:40px 40px 32px;">

                <!-- Icon + Heading -->
                <div style="text-align:center;margin-bottom:28px;">
                  <div style="font-size:48px;margin-bottom:12px;">${type === 'expired' ? '⛔' : type === 'reminder_3' ? '⚠️' : '⏰'}</div>
                  <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:0.5px;">${headingMap[type]}</h1>
                </div>

                <!-- Greeting -->
                <p style="margin:0 0 16px;font-size:16px;color:#A8B0BD;">
                  Hi <strong style="color:#ffffff;">${name}</strong>,
                </p>

                <!-- Message -->
                <p style="margin:0 0 28px;font-size:16px;color:#A8B0BD;line-height:1.6;">
                  ${messageMap[type]}
                </p>

                <!-- Plan details box -->
                <div style="background:#0D1117;border:1px solid ${accentColor}44;border-radius:8px;padding:20px;margin-bottom:28px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:14px;color:#6B7280;padding-bottom:10px;">Plan</td>
                      <td align="right" style="font-size:14px;color:#ffffff;font-weight:600;padding-bottom:10px;">${planName}</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#6B7280;padding-bottom:10px;">Account Type</td>
                      <td align="right" style="font-size:14px;color:#ffffff;font-weight:600;padding-bottom:10px;">${userType === 'agency' ? 'Agency' : 'Aspirant'}</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#6B7280;">${type === 'expired' ? 'Expired On' : 'Expires On'}</td>
                      <td align="right" style="font-size:14px;color:${accentColor};font-weight:700;">${formattedDate}</td>
                    </tr>
                    ${type !== 'expired' ? `
                    <tr>
                      <td colspan="2" style="padding-top:14px;border-top:1px solid #1C2338;"></td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#6B7280;">Days Remaining</td>
                      <td align="right" style="font-size:20px;color:${accentColor};font-weight:800;">${daysLeft} day${daysLeft === 1 ? '' : 's'}</td>
                    </tr>` : ''}
                  </table>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center;margin-bottom:28px;">
                  <a href="${renewUrl}" style="display:inline-block;background:${accentColor};color:#000000;font-size:16px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.5px;">
                    ${buttonMap[type]}
                  </a>
                </div>

                <!-- Help text -->
                <p style="margin:0;font-size:14px;color:#6B7280;text-align:center;line-height:1.6;">
                  If you have any questions, reply to this email or visit our
                  <a href="${APP_URL}/contact" style="color:${accentColor};text-decoration:none;">Help Centre</a>.
                </p>

              </div>

              <!-- Footer -->
              <div style="background:#0B0F14;padding:20px 40px;border-top:1px solid #1C2338;">
                <p style="margin:0;font-size:12px;color:#4B5563;text-align:center;line-height:1.6;">
                  © ${new Date().getFullYear()} SilverScreens. All rights reserved.<br>
                  You are receiving this because you have an active subscription on SilverScreens.
                </p>
              </div>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject: subjectMap[type], html }
}

/* ── Insert notification record in Supabase ── */
async function insertNotification(userId: string, title: string, message: string) {
  await supabase.from('notifications').insert({
    user_id:    userId,
    title,
    message,
    type:       'subscription',
    is_read:    false,
    created_at: new Date().toISOString(),
  }).throwOnError()
}

/* ── Main handler ── */
export async function GET(req: NextRequest) {
  // Simple security: require a secret token so only authorized callers can run this
  const token = req.nextUrl.searchParams.get('token')
  if (token !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now     = new Date()
  const results = { sent: 0, skipped: 0, errors: [] as string[] }

  // Define the reminder windows we check
  // PRD: Send reminders 7 days and 3 days before expiry
  const windows = [
    { label: 'reminder_7' as const, daysLeft: 7 },
    { label: 'reminder_3' as const, daysLeft: 3 },
  ]

  for (const window of windows) {
    // Calculate the target date range (±12 hours around the exact day)
    const targetDate = new Date(now)
    targetDate.setDate(targetDate.getDate() + window.daysLeft)
    const from = new Date(targetDate); from.setHours(0, 0, 0, 0)
    const to   = new Date(targetDate); to.setHours(23, 59, 59, 999)

    // Fetch subscriptions expiring in this window that haven't been reminded
    const { data: subs, error } = await supabase
      .from('subscriptions')
      .select('id, user_id, plan_name, user_type, ends_at')
      .eq('status', 'active')
      .eq('renewal_reminder_sent', false)
      .gte('ends_at', from.toISOString())
      .lte('ends_at', to.toISOString())

    if (error) {
      results.errors.push(`${window.label} query error: ${error.message}`)
      continue
    }

    for (const sub of (subs || [])) {
      try {
        // Get user profile for name and email
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', sub.user_id)
          .single()

        if (!profile?.email) { results.skipped++; continue }

        const endsAt   = new Date(sub.ends_at)
        const { subject, html } = buildEmail({
          name:     profile.name || 'Valued Member',
          planName: sub.plan_name,
          userType: sub.user_type,
          endsAt,
          daysLeft: window.daysLeft,
          type:     window.label,
        })

        // Send email via Resend
        await resend.emails.send({
          from:    `SilverScreens <${FROM}>`,
          to:      [profile.email],
          subject,
          html,
        })

        // Create in-app notification
        await insertNotification(
          sub.user_id,
          subject,
          `Your ${sub.plan_name} plan expires in ${window.daysLeft} day${window.daysLeft === 1 ? '' : 's'}. Renew now to avoid interruption.`
        )

        // Mark reminder as sent so we don't send again
        await supabase
          .from('subscriptions')
          .update({ renewal_reminder_sent: true })
          .eq('id', sub.id)

        results.sent++
      } catch (err: any) {
        results.errors.push(`user ${sub.user_id}: ${err.message}`)
        results.skipped++
      }
    }
  }

  // Also handle expired subscriptions
  const { data: expired } = await supabase
    .from('subscriptions')
    .select('id, user_id, plan_name, user_type, ends_at')
    .eq('status', 'active')
    .lt('ends_at', now.toISOString())

  for (const sub of (expired || [])) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', sub.user_id)
        .single()

      if (!profile?.email) { results.skipped++; continue }

      const { subject, html } = buildEmail({
        name:     profile.name || 'Valued Member',
        planName: sub.plan_name,
        userType: sub.user_type,
        endsAt:   new Date(sub.ends_at),
        daysLeft: 0,
        type:     'expired',
      })

      await resend.emails.send({
        from:    `SilverScreens <${FROM}>`,
        to:      [profile.email],
        subject,
        html,
      })

      await insertNotification(
        sub.user_id,
        `Your ${sub.plan_name} plan has expired`,
        'Your profile has been temporarily hidden. Renew your subscription to restore full access.'
      )

      // Update subscription status to expired
      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', sub.id)

      results.sent++
    } catch (err: any) {
      results.errors.push(`expired user ${sub.user_id}: ${err.message}`)
      results.skipped++
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    ...results,
  })
}
