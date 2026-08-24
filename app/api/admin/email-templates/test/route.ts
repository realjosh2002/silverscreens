// app/api/admin/email-templates/test/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

// Use anon key - email_templates has RLS disabled so anon can read
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

const SAMPLE_VALUES: Record<string, string> = {
  // Auth & Account
  name:              'Test User',
  otp:               '847291',
  email:             'test@example.com',
  profile_id:        'ASP0001',
  dashboard_url:     'https://silverscreens.in/dashboard',
  reset_url:         'https://silverscreens.in/reset-password?token=sample',

  // Support
  ticket_id:         'TKT-00123',
  subject:           'Sample support request',

  // Casting & Applications
  casting_title:     'Lead Actor — Mumbai Film Project',
  agency_name:       'Bollywood Casting Co.',
  application_id:    'APP-00456',
  application_url:   'https://silverscreens.in/applications/APP-00456',

  // Status
  status:            'Approved',
  status_color:      '#22C55E',
  message:           'Congratulations! Your application has been approved.',

  // Subscription & Payment
  plan_name:         'Professional Plan',
  amount:            '₹2,499',
  expiry_date:       '25 Jun 2027',
  transaction_id:    'TXN-789012',

  // Agency
  profile_url:       'https://silverscreens.in/agency/dashboard',

  // Audition
  audition_date:     '20 Aug 2026',
  audition_time:     '11:00 AM',
  audition_mode:     'In-Person',
  audition_venue:    'Studio 5, Andheri West, Mumbai',

  // Messages
  sender_name:       'Bollywood Casting Co.',

  // Profile
  // profile_id already defined above
}

function replacePlaceholders(html: string, vars: Record<string, string>): string {
  let result = html
  Object.entries(vars).forEach(function([key, value]) {
    result = result.split('{{' + key + '}}').join(value)
  })
  return result
}

export async function POST(req: NextRequest) {
  try {
    const { templateId, toEmail } = await req.json()

    if (!templateId || !toEmail) {
      return NextResponse.json({ error: 'templateId and toEmail are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(toEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Fetch all templates and find by id or slug
    const { data: allTemplates, error: fetchError } = await supabase
      .from('email_templates')
      .select('*')

    if (fetchError) {
      return NextResponse.json({ error: 'DB error: ' + fetchError.message }, { status: 500 })
    }

    const templates = allTemplates || []
    const template = templates.find(function(t: any) {
      return t.id === templateId || t.slug === templateId
    })

    if (!template) {
      return NextResponse.json({
        error: 'Template not found. Available slugs: ' + templates.map((t: any) => t.slug).join(', ')
      }, { status: 404 })
    }

    const subject  = replacePlaceholders(template.subject   || '', SAMPLE_VALUES)
    const bodyHtml = replacePlaceholders(template.body_html || '', SAMPLE_VALUES)

    const testBanner = `
      <div style="background:#F97316;color:#000;padding:10px 20px;text-align:center;font-family:Arial,sans-serif;font-size:13px;font-weight:700;">
        🧪 TEST EMAIL — Template: ${template.name} — Variables replaced with sample data
      </div>
    `

    const sent = await sendEmail({
      to:      toEmail,
      subject: '[TEST] ' + subject,
      html:    testBanner + bodyHtml,
    })

    if (!sent) {
      return NextResponse.json({ error: 'Failed to send. Check your Resend API key and domain configuration.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Test email sent to ' + toEmail })

  } catch (err: any) {
    console.error('[TEST EMAIL ERROR]', err)
    return NextResponse.json({ error: 'Unexpected error: ' + err.message }, { status: 500 })
  }
}