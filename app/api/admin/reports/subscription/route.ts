export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return false
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return false
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin'
}

function fmtDate(val: string | null | undefined): string {
  if (!val) return ''
  try { return new Date(val).toISOString().split('T')[0] } catch { return '' }
}

function fmtDateTime(val: string | null | undefined): string {
  if (!val) return ''
  try {
    const d = new Date(val)
    return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })
      .replace(',', '')
  } catch { return '' }
}

export async function GET(req: NextRequest) {
  try {
    if (!await verifyAdmin(req))
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const from    = searchParams.get('from')    // YYYY-MM-DD
    const to      = searchParams.get('to')      // YYYY-MM-DD
    const utype   = searchParams.get('type')    // 'aspirant' | 'agency' | 'all'
    const status  = searchParams.get('status')  // 'active' | 'expired' | 'all'

    if (!from || !to)
      return NextResponse.json({ error: 'from and to dates are required' }, { status: 400 })

    const fromISO = new Date(from + 'T00:00:00.000+05:30').toISOString()
    const toISO   = new Date(to   + 'T23:59:59.999+05:30').toISOString()

    // ── Fetch all subscriptions in date range ──
    let q = supabase
      .from('subscriptions')
      .select(`
        id, user_id, plan_name, user_type, amount, gst_amount, total_amount,
        currency, payment_method, status, starts_at, ends_at, created_at,
        transaction_id, razorpay_order_id, razorpay_payment_id,
        coupon_code, discount_amount, gateway_status, renewal_reminder_sent
      `)
      .gte('created_at', fromISO)
      .lte('created_at', toISO)
      .order('created_at', { ascending: false })

    if (utype && utype !== 'all') q = q.eq('user_type', utype)
    if (status && status !== 'all') q = q.eq('status', status)

    const { data: subs, error: subErr } = await q
    if (subErr) throw subErr

    if (!subs || subs.length === 0)
      return NextResponse.json({ rows: [], summary: { total: 0, totalRevenue: 0, totalGST: 0, totalBase: 0 } })

    // ── Fetch linked profiles, aspirant_profiles, agency_profiles ──
    const userIds = [...new Set(subs.map((s: any) => s.user_id))]

    const [
      { data: profiles },
      { data: aspirants },
      { data: agencies },
    ] = await Promise.all([
      supabase.from('profiles')
        .select('id, name, email, phone, role, created_at, is_active, email_verified')
        .in('id', userIds),
      supabase.from('aspirant_profiles')
        .select('user_id, profile_number, first_name, last_name, date_of_birth, gender, city, state, country, pincode, category, role, experience_level, verification_status, trust_score, profile_completion')
        .in('user_id', userIds),
      supabase.from('agency_profiles')
        .select('user_id, profile_number, company_name, company_type, contact_person_name, contact_email, contact_phone, city, state, country, pincode, gst_number, pan_number, registration_number, verification_status, trust_score')
        .in('user_id', userIds),
    ])

    const profileMap  = Object.fromEntries((profiles  || []).map((p: any) => [p.id,  p]))
    const aspirantMap = Object.fromEntries((aspirants || []).map((a: any) => [a.user_id, a]))
    const agencyMap   = Object.fromEntries((agencies  || []).map((a: any) => [a.user_id, a]))

    // ── Build rows ──
    const rows = subs.map((s: any, idx: number) => {
      const p  = profileMap[s.user_id]  || {}
      const ap = aspirantMap[s.user_id] || {}
      const ag = agencyMap[s.user_id]   || {}
      const isAspirant = s.user_type === 'aspirant'

      // Name resolution: use aspirant first/last, or agency company, or profile name
      const fullName = isAspirant
        ? [ap.first_name, ap.last_name].filter(Boolean).join(' ') || p.name || ''
        : ag.company_name || p.name || ''

      const profileNo = isAspirant ? (ap.profile_number || '') : (ag.profile_number || '')
      const city      = isAspirant ? (ap.city || '') : (ag.city || '')
      const state     = isAspirant ? (ap.state || '') : (ag.state || '')
      const country   = isAspirant ? (ap.country || '') : (ag.country || '')
      const pincode   = isAspirant ? (ap.pincode || '') : (ag.pincode || '')

      return {
        // ── Identification ──
        sno:                idx + 1,
        profile_number:     profileNo,
        user_type:          s.user_type === 'aspirant' ? 'Aspirant' : 'Agency',

        // ── Subscriber details ──
        full_name:          fullName,
        email:              p.email || '',
        phone:              p.phone || '',
        date_of_birth:      isAspirant ? fmtDate(ap.date_of_birth) : '',
        gender:             isAspirant ? (ap.gender || '') : '',
        company_name:       isAspirant ? '' : (ag.company_name || ''),
        contact_person:     isAspirant ? '' : (ag.contact_person_name || ''),

        // ── Location ──
        city, state, country, pincode,

        // ── Subscription details ──
        plan_name:          s.plan_name || '',
        subscription_status: s.status || '',
        starts_at:          fmtDate(s.starts_at),
        ends_at:            fmtDate(s.ends_at),
        subscribed_on:      fmtDateTime(s.created_at),

        // ── Financial ──
        // GST treatment (SilverScreens registered in Tamil Nadu):
        //   Intra-state  (state = Tamil Nadu, country = India) → CGST 9% + SGST 9%
        //   Inter-state  (other Indian state, country = India)  → IGST 18%, CGST=0, SGST=0
        //   Export        (country ≠ India)                     → 0% GST (export of service)
        currency:           s.currency || 'INR',
        base_amount:        parseFloat(s.amount       || 0),
        discount_amount:    parseFloat(s.discount_amount || 0),
        taxable_amount:     parseFloat(s.amount || 0) - parseFloat(s.discount_amount || 0),
        total_gst:          parseFloat(s.gst_amount   || 0),
        total_amount:       parseFloat(s.total_amount || 0),
        gst_rate_pct: (()=>{
          if (!country || country.trim().toLowerCase() !== 'india') return 0
          const taxable = parseFloat(s.amount||0) - parseFloat(s.discount_amount||0)
          if (!s.gst_amount || taxable === 0) return 18 // default
          return parseFloat(((s.gst_amount / taxable) * 100).toFixed(2))
        })(),
        gst_type: (()=>{
          const c = (country || '').trim().toLowerCase()
          if (c !== 'india') return 'Export (0%)'
          const st = (state || '').trim().toLowerCase()
          return (st === 'tamil nadu' || st === 'tamilnadu') ? 'Intra-State' : 'Inter-State'
        })(),
        cgst_amount: (()=>{
          const c = (country || '').trim().toLowerCase()
          if (c !== 'india') return 0
          const st = (state || '').trim().toLowerCase()
          return (st === 'tamil nadu' || st === 'tamilnadu')
            ? parseFloat((parseFloat(s.gst_amount||0) / 2).toFixed(2))
            : 0
        })(),
        sgst_amount: (()=>{
          const c = (country || '').trim().toLowerCase()
          if (c !== 'india') return 0
          const st = (state || '').trim().toLowerCase()
          return (st === 'tamil nadu' || st === 'tamilnadu')
            ? parseFloat((parseFloat(s.gst_amount||0) / 2).toFixed(2))
            : 0
        })(),
        igst_amount: (()=>{
          const c = (country || '').trim().toLowerCase()
          if (c !== 'india') return 0
          const st = (state || '').trim().toLowerCase()
          return (st === 'tamil nadu' || st === 'tamilnadu')
            ? 0
            : parseFloat(parseFloat(s.gst_amount||0).toFixed(2))
        })(),

        // ── Payment ──
        payment_method:     s.payment_method || '',
        transaction_id:     s.transaction_id || '',
        razorpay_order_id:  s.razorpay_order_id || '',
        razorpay_payment_id: s.razorpay_payment_id || '',
        gateway_status:     s.gateway_status || '',
        coupon_code:        s.coupon_code || '',

        // ── GST details (agencies) ──
        gst_number:         isAspirant ? '' : (ag.gst_number || ''),
        pan_number:         isAspirant ? '' : (ag.pan_number || ''),
        registration_number: isAspirant ? '' : (ag.registration_number || ''),

        // ── Profile details ──
        category:           isAspirant ? (ap.category || '') : (ag.company_type || ''),
        role_category:      isAspirant ? (ap.role || '') : '',
        experience_level:   isAspirant ? (ap.experience_level || '') : '',
        verification_status: isAspirant ? (ap.verification_status || '') : (ag.verification_status || ''),
        trust_score:        isAspirant ? (ap.trust_score ?? '') : (ag.trust_score ?? ''),
        profile_completion: isAspirant ? (ap.profile_completion ?? '') : '',
        account_active:     p.is_active ? 'Yes' : 'No',
        email_verified:     p.email_verified ? 'Yes' : 'No',
        member_since:       fmtDate(p.created_at),
      }
    })

    const totalRevenue  = rows.reduce((s, r) => s + r.total_amount,   0)
    const totalGST      = rows.reduce((s, r) => s + r.total_gst,       0)
    const totalCGST     = rows.reduce((s, r) => s + r.cgst_amount,     0)
    const totalSGST     = rows.reduce((s, r) => s + r.sgst_amount,     0)
    const totalIGST     = rows.reduce((s, r) => s + r.igst_amount,     0)
    const totalBase     = rows.reduce((s, r) => s + r.taxable_amount,  0)
    const totalDiscount = rows.reduce((s, r) => s + r.discount_amount, 0)
    const aspirantRows  = rows.filter(r => r.user_type === 'Aspirant')
    const agencyRows    = rows.filter(r => r.user_type === 'Agency')

    return NextResponse.json({
      rows,
      summary: {
        total:             rows.length,
        aspirantCount:     aspirantRows.length,
        agencyCount:       agencyRows.length,
        totalRevenue:      parseFloat(totalRevenue.toFixed(2)),
        aspirantRevenue:   parseFloat(aspirantRows.reduce((s,r)=>s+r.total_amount,0).toFixed(2)),
        agencyRevenue:     parseFloat(agencyRows.reduce((s,r)=>s+r.total_amount,0).toFixed(2)),
        totalGST:          parseFloat(totalGST.toFixed(2)),
        totalCGST:         parseFloat(totalCGST.toFixed(2)),
        totalSGST:         parseFloat(totalSGST.toFixed(2)),
        totalIGST:         parseFloat(totalIGST.toFixed(2)),
        totalBase:         parseFloat(totalBase.toFixed(2)),
        totalDiscount:     parseFloat(totalDiscount.toFixed(2)),
        intraStateCount:   rows.filter(r=>r.gst_type==='Intra-State').length,
        interStateCount:   rows.filter(r=>r.gst_type==='Inter-State').length,
        exportCount:       rows.filter(r=>r.gst_type==='Export (0%)').length,
        from,
        to,
      },
    })
  } catch (err: any) {
    console.error('Subscription report error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
