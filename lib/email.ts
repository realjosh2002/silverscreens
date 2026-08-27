// lib/email.ts
// Email utility using Resend. Falls back to console.log in dev when key is missing.

interface EmailAttachment {
  filename: string
  content:  string   // base64 encoded
  type:     string   // MIME type e.g. 'application/pdf'
}

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  fromName?: string
  attachments?: EmailAttachment[]
}

export async function sendEmail({ to, subject, html, text, from, fromName, attachments }: SendEmailOptions): Promise<boolean> {
  const apiKey   = process.env.RESEND_API_KEY
  const fromEmail = from     || process.env.RESEND_FROM_EMAIL || 'no-reply@silverscreens.com'
  const name      = fromName || process.env.RESEND_FROM_NAME  || 'SilverScreens'

  // Dev fallback — no key configured yet
  if (!apiKey || apiKey === 'your_resend_api_key') {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 [EMAIL — DEV MODE — not actually sent]')
    console.log(`To:      ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body:    ${text || html.slice(0, 200)}...`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    return true
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${name} <${fromEmail}>`,
        to:   [to],
        subject,
        html,
        text: text || subject,
        ...(attachments && attachments.length > 0 ? {
          attachments: attachments.map(a => ({
            filename: a.filename,
            content:  a.content,
            type:     a.type,
          }))
        } : {}),
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[RESEND ERROR]', err)
      return false
    }

    return true
  } catch (err) {
    console.error('[EMAIL SEND ERROR]', err)
    return false
  }
}

export function otpEmailTemplate(otp: string, name?: string): { subject: string; html: string; text: string } {
  return {
    subject: 'Your SilverScreens Verification Code',
    text: `Your OTP is: ${otp}. It expires in 10 minutes. Do not share this code.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0D1117;color:#F5F5F5;border-radius:12px;">
        <h2 style="color:#D4A64A;margin-bottom:8px;">SILVER SCREENS</h2>
        <h3 style="color:#fff;margin-bottom:16px;">Verify your email</h3>
        <p style="color:#aaa;margin-bottom:24px;">
          ${name ? `Hi ${name},` : 'Hi,'}<br/>
          Use the code below to verify your SilverScreens account.
        </p>
        <div style="background:#181E2A;border:2px solid #D4A64A;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#D4A64A;">${otp}</span>
        </div>
        <p style="color:#888;font-size:13px;">
          This code expires in <strong style="color:#fff;">10 minutes</strong>. Do not share it with anyone.<br/>
          If you did not request this, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #252C3A;margin:24px 0;" />
        <p style="color:#555;font-size:12px;">© 2026 SilverScreens — India's Film & Media Talent Marketplace</p>
      </div>
    `,
  }
}