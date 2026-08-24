import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/* ── Beautiful test email HTML ── */
function buildTestEmail(name: string, type: string): string {
  const configs: Record<string, { emoji: string; heading: string; color: string; days: string }> = {
    reminder_7: { emoji: '⏰', heading: 'Your Plan Expires in 7 Days',  color: '#D4A64A', days: '7 days'  },
    reminder_3: { emoji: '⚠️', heading: 'Your Plan Expires in 3 Days',  color: '#F97316', days: '3 days'  },
    expired:    { emoji: '⛔', heading: 'Your Plan Has Expired',         color: '#EF4444', days: 'expired' },
  }
  const cfg = configs[type] || configs['reminder_7']

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0D1117;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1117;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <tr><td align="center" style="padding-bottom:24px;">
          <span style="line-height:1;"><span style="font-family:'Arial Narrow',Impact,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:3px;color:#F5F5F5;text-transform:uppercase;">SILVER</span><span style="font-family:'Arial Narrow',Impact,Arial,sans-serif;font-size:32px;font-weight:900;letter-spacing:3px;color:#C8202A;text-transform:uppercase;border-bottom:3px solid #C8202A;padding-bottom:1px;">SCREENS</span></span>
          <div style="font-size:9px;color:#6B7280;letter-spacing:4px;text-align:center;margin-top:6px;font-family:Arial,sans-serif;">WE MAKE CELEBRITIES</div>
        </td></tr>

        <!-- Test badge -->
        <tr><td align="center" style="padding-bottom:16px;">
          <span style="background:#1C2338;border:1px solid #374151;border-radius:20px;padding:6px 16px;font-size:12px;color:#9CA3AF;letter-spacing:1px;">
            🧪 TEST EMAIL — Not a real notification
          </span>
        </td></tr>

        <tr><td style="background:#131720;border:1px solid ${cfg.color}33;border-radius:12px;overflow:hidden;">
          <div style="height:4px;background:${cfg.color};"></div>
          <div style="padding:36px 40px;">

            <div style="text-align:center;margin-bottom:24px;">
              <div style="font-size:44px;margin-bottom:10px;">${cfg.emoji}</div>
              <h1 style="margin:0;font-size:24px;font-weight:800;color:#fff;">${cfg.heading}</h1>
            </div>

            <p style="margin:0 0 14px;font-size:16px;color:#A8B0BD;">
              Hi <strong style="color:#fff;">${name}</strong>,
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#A8B0BD;line-height:1.6;">
              This is a <strong style="color:${cfg.color};">test email</strong> for the <strong>${cfg.heading}</strong> notification type.
              In production, this would be sent automatically when a user's subscription is due to expire.
            </p>

            <!-- Sample plan box -->
            <div style="background:#0D1117;border:1px solid ${cfg.color}44;border-radius:8px;padding:18px;margin-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:14px;color:#6B7280;padding-bottom:8px;">Plan</td>
                  <td align="right" style="font-size:14px;color:#fff;font-weight:600;padding-bottom:8px;">Spotlight (3 Months)</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#6B7280;padding-bottom:8px;">Expires</td>
                  <td align="right" style="font-size:14px;color:${cfg.color};font-weight:700;padding-bottom:8px;">${cfg.days}</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#6B7280;">Email template</td>
                  <td align="right" style="font-size:14px;color:#fff;font-weight:600;">${type}</td>
                </tr>
              </table>
            </div>

            <div style="text-align:center;margin-bottom:24px;">
              <a href="${APP_URL}/dashboard/subscription" style="display:inline-block;background:${cfg.color};color:#000;font-size:15px;font-weight:700;text-decoration:none;padding:12px 36px;border-radius:8px;">
                Renew My Plan
              </a>
            </div>

            <p style="margin:0;font-size:13px;color:#4B5563;text-align:center;">
              ✅ Email delivery is working correctly via Resend
            </p>
          </div>

          <div style="background:#0B0F14;padding:16px 40px;border-top:1px solid #1C2338;">
            <p style="margin:0;font-size:12px;color:#374151;text-align:center;">
              © ${new Date().getFullYear()} SilverScreens · Test notification sent from Admin panel
            </p>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, type = 'reminder_7' } = body

    // Validate
    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    const validTypes = ['reminder_7', 'reminder_3', 'expired']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const subjectMap: Record<string, string> = {
      reminder_7: '[TEST] Your plan expires in 7 days',
      reminder_3: '[TEST] Your plan expires in 3 days',
      expired:    '[TEST] Your plan has expired',
    }

    const { data, error } = await resend.emails.send({
      from:    `SilverScreens <${FROM}>`,
      to:      [email],
      subject: subjectMap[type],
      html:    buildTestEmail(name || 'Valued Member', type),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`,
      type,
      resend_id: data?.id,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}