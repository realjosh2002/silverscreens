// lib/email.ts
// Email utility using SendGrid. Falls back to console.log in dev when key is missing.

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@silverscreens.com'
  const fromName = process.env.SENDGRID_FROM_NAME || 'SilverScreens'

  // Dev fallback — no key configured yet
  if (!apiKey || apiKey === 'your_sendgrid_api_key') {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 [EMAIL — DEV MODE — not actually sent]')
    console.log(`To:      ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body:    ${text || html}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    return true
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail, name: fromName },
        subject,
        content: [
          { type: 'text/plain', value: text || subject },
          { type: 'text/html', value: html },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('[SENDGRID ERROR]', err)
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
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a1a; margin-bottom: 8px;">Verify your email</h2>
        <p style="color: #555; margin-bottom: 24px;">
          ${name ? `Hi ${name},` : 'Hi,'}<br/>
          Use the code below to verify your SilverScreens account.
        </p>
        <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #111;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 13px;">
          This code expires in <strong>10 minutes</strong>. Do not share it with anyone.<br/>
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #aaa; font-size: 12px;">SilverScreens — India's Film & Media Talent Marketplace</p>
      </div>
    `,
  }
}