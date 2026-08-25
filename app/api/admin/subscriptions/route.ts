export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

/* ── Admin auth ──────────────────────────────────────────────── */
async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

/* ══════════════════════════════════════════════════════════════
   GET /api/admin/subscriptions
   ?type=stats  → stat cards, plan breakdown, revenue
   ?type=table  → paginated rows (default)

   Confirmed real columns in subscriptions table:
     id, user_id, plan_id, plan_name, user_type, amount,
     currency, gst_amount, total_amount, status,
     payment_method, transaction_id, gateway_status,
     coupon_code, discount_amount, starts_at, ends_at,
     created_at, razorpay_order_id, razorpay_payment_id,
     razorpay_signature, renewal_reminder_sent

   Confirmed real columns in agency_profiles:
     id, user_id, company_name, city, state, verification_status,
     trust_score, logo_url, show_phone, show_email (NO agency_type)

   Confirmed real columns in aspirant_profiles:
     id, user_id, first_name, last_name, category, role,
     city, state, profile_image_url, verification_status,
     trust_score, experience_level
══════════════════════════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'table'

    /* ══════════════════════════════════════════════════════
       STATS
    ══════════════════════════════════════════════════════ */
    if (type === 'stats') {
      const { data: allSubs } = await supabaseAdmin
        .from('subscriptions')
        .select('id, status, plan_name, amount, total_amount')

      const subs           = allSubs ?? []
      const total          = subs.length
      const active         = subs.filter((s: any) => s.status === 'active').length
      const expiring       = subs.filter((s: any) => s.status === 'expiring_soon').length
      const expired        = subs.filter((s: any) => s.status === 'expired').length
      const cancelled      = subs.filter((s: any) => s.status === 'cancelled').length
      const pendingPayment = subs.filter((s: any) => s.status === 'pending_payment').length
      // MRR only from confirmed active subscriptions
      const mrr = subs
        .filter((s: any) => s.status === 'active')
        .reduce((sum: number, s: any) => sum + Number(s.total_amount || s.amount || 0), 0)

      const planMap: Record<string, number> = {}
      for (const s of subs) {
        const name = (s as any).plan_name || 'Unknown'
        planMap[name] = (planMap[name] || 0) + 1
      }

      // Revenue: try payment_transactions first, fall back to active subscriptions
      let totalRevenue = 0
      let successfulTx = 0
      let avgTx        = 0

      try {
        const { data: txRows } = await supabaseAdmin
          .from('payment_transactions')
          .select('total_amount, gateway_status')
          .eq('gateway_status', 'success')

        const allTx = txRows ?? []
        if (allTx.length > 0) {
          totalRevenue = allTx.reduce((sum: number, t: any) => sum + Number(t.total_amount || 0), 0)
          successfulTx = allTx.length
          avgTx        = successfulTx > 0 ? Math.round(totalRevenue / successfulTx) : 0
        }
      } catch {
        // payment_transactions table may not exist yet — use subscriptions instead
      }

      // If no payment_transactions data, derive from active subscriptions
      if (successfulTx === 0) {
        const activeSubs = subs.filter((s: any) => s.status === 'active')
        totalRevenue = activeSubs.reduce((sum: number, s: any) => sum + Number(s.total_amount || s.amount || 0), 0)
        successfulTx = activeSubs.length
        avgTx        = successfulTx > 0 ? Math.round(totalRevenue / successfulTx) : 0
      }

      return successResponse({
        stats: { total, active, expiring, expired, cancelled, pending_payment: pendingPayment, mrr },
        plan_breakdown: planMap,
        revenue: { total_revenue: totalRevenue, successful_tx: successfulTx, avg_tx: avgTx },
      })
    }

    /* ══════════════════════════════════════════════════════
       TABLE
    ══════════════════════════════════════════════════════ */
    const search    = searchParams.get('search')         || ''
    const userTypeF = searchParams.get('user_type')      || ''
    const planF     = searchParams.get('plan')           || ''
    const statusF   = searchParams.get('status')         || ''
    const paymentF  = searchParams.get('payment_method') || ''
    const deptF     = searchParams.get('department')     || ''
    const cycleF    = searchParams.get('cycle')          || ''
    const sortF     = searchParams.get('sort')           || 'newest'
    const page      = Math.max(1, parseInt(searchParams.get('page')     || '1'))
    const perPage   = Math.min(50, parseInt(searchParams.get('per_page') || '8'))
    const from      = (page - 1) * perPage

    // ── Step 1: Query subscriptions (only real columns) ──────
    let query = supabaseAdmin
      .from('subscriptions')
      .select(
        `id, plan_name, user_type, status,
         amount, gst_amount, total_amount, currency,
         payment_method, starts_at, ends_at, created_at,
         user_id`,
        { count: 'exact' }
      )

    if (statusF)   query = query.eq('status', statusF)
    // Plan filter: DB stores as uppercase GROWTH/STAR/ICON — match exactly
    if (planF)     query = query.ilike('plan_name', planF)
    // Payment: 'N/A' means null in DB
    if (paymentF === 'N/A')       query = query.is('payment_method', null)
    else if (paymentF)            query = query.ilike('payment_method', paymentF)
    if (userTypeF) query = query.eq('user_type', userTypeF.toLowerCase())

    if (sortF === 'oldest')       query = query.order('created_at', { ascending: true })
    else if (sortF === 'amount_high') query = query.order('total_amount', { ascending: false })
    else if (sortF === 'amount_low')  query = query.order('total_amount', { ascending: true })
    else if (sortF === 'renewal')     query = query.order('ends_at', { ascending: true })
    else                              query = query.order('created_at', { ascending: false })

    query = query.range(from, from + perPage - 1)

    const { data: rows, count, error } = await query
    if (error) throw new Error(error.message)

    if (!rows || rows.length === 0) {
      return successResponse({
        subscriptions: [], total: 0, page, per_page: perPage, total_pages: 0,
      })
    }

    // ── Step 2: Fetch profiles for all user_ids ──────────────
    const userIds = [...new Set(rows.map((r: any) => r.user_id).filter(Boolean))]

    const { data: profileRows } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email, role, profile_number')
      .in('id', userIds)

    const profileMap: Record<string, any> = {}
    for (const p of profileRows ?? []) profileMap[p.id] = p

    // ── Step 3: Fetch aspirant_profiles for aspirant user_ids ─
    const aspirantIds = (profileRows ?? [])
      .filter((p: any) => p.role === 'aspirant')
      .map((p: any) => p.id)

    const { data: aspRows } = aspirantIds.length > 0
      ? await supabaseAdmin
          .from('aspirant_profiles')
          .select('user_id, first_name, last_name, category, role, city, state')
          .in('user_id', aspirantIds)
      : { data: [] }

    const aspMap: Record<string, any> = {}
    for (const a of aspRows ?? []) aspMap[a.user_id] = a

    // ── Step 4: Fetch agency_profiles for agency user_ids ─────
    const agencyIds = (profileRows ?? [])
      .filter((p: any) => p.role === 'agency')
      .map((p: any) => p.id)

    const { data: agRows } = agencyIds.length > 0
      ? await supabaseAdmin
          .from('agency_profiles')
          .select('user_id, company_name, city, state')
          .in('user_id', agencyIds)
      : { data: [] }

    const agMap: Record<string, any> = {}
    for (const a of agRows ?? []) agMap[a.user_id] = a

    // ── Step 5: Shape rows ────────────────────────────────────
    const fmtDate = (d: Date | null) =>
      d ? d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
    const fmtTime = (d: Date | null) =>
      d ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''

    const statusMap: Record<string, string> = {
      active:          'Active',
      expiring_soon:   'Expiring Soon',
      expired:         'Expired',
      cancelled:       'Cancelled',
      pending_payment: 'Pending Payment',
      pending:         'Pending Payment',
    }

    let subscriptions = rows.map((s: any) => {
      const profile  = profileMap[s.user_id] || {}
      const isAsp    = profile.role === 'aspirant'
      const isAg     = profile.role === 'agency'
      const asp      = aspMap[s.user_id] || {}
      const ag       = agMap[s.user_id]  || {}

      // Name: agencies use company_name, aspirants use first+last, fallback to profile.name
      const name = isAg
        ? (ag.company_name || profile.name || '—')
        : isAsp
          ? (`${asp.first_name || ''} ${asp.last_name || ''}`.trim() || profile.name || '—')
          : (profile.name || '—')

      const words    = name.trim().split(/\s+/)
      const initials = words.length >= 2
        ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase()

      const startDate = s.starts_at ? new Date(s.starts_at) : null
      const endDate   = s.ends_at   ? new Date(s.ends_at)   : null

      // user_type from subscriptions table (most reliable)
      const uType = s.user_type === 'aspirant' ? 'Aspirant'
        : s.user_type === 'agency' ? 'Agency'
        : profile.role === 'aspirant' ? 'Aspirant'
        : profile.role === 'agency'   ? 'Agency'
        : s.user_type || profile.role || '—'

      // Department: combine category + role e.g. "Acting → Hero"
      let department = ''
      if (isAsp) {
        const cat  = asp.category || ''
        const role = asp.role     || ''
        if (cat && role) department = `${cat} → ${role}`
        else             department = cat || role || ''
      }

      // Billing cycle: calculate from date difference since no DB column
      let cycle = '—'
      if (startDate && endDate) {
        const months = Math.round(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
        )
        if      (months <= 1)  cycle = 'Monthly'
        else if (months <= 3)  cycle = 'Quarterly'
        else if (months <= 6)  cycle = '6 Months'
        else if (months <= 12) cycle = 'Annual'
        else if (months <= 24) cycle = '2 Years'
        else                   cycle = `${Math.round(months / 12)} Years`
      }

      // Payment method: null → 'N/A', razorpay → 'Razorpay'
      const payment = s.payment_method
        ? s.payment_method.charAt(0).toUpperCase() + s.payment_method.slice(1)
        : 'N/A'

      // Status display
      const statusDisplay = statusMap[s.status] || s.status || '—'

      return {
        id:            s.id,
        plan:          s.plan_name || '—',
        plan_key:      '',
        status:        statusDisplay,
        cycle,
        amount:        Number(s.total_amount || s.amount || 0),
        amountStr:     '₹' + Number(s.total_amount || s.amount || 0).toLocaleString('en-IN'),
        payment,
        start:         fmtDate(startDate),
        startTime:     fmtTime(startDate),
        renewal:       fmtDate(endDate),
        renewalTime:   fmtTime(endDate),
        userId:        s.user_id || '',
        name,
        email:         profile.email          || '—',
        profileNumber: profile.profile_number || '—',
        userType:      uType,
        department,
        agencyType:    '',
        city:          isAsp ? (asp.city || '') : (ag.city || ''),
        initials,
      }
    })

    // ── Step 6: Post-process filters on joined/derived fields ──
    if (search) {
      const q = search.toLowerCase()
      subscriptions = subscriptions.filter((s: any) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.profileNumber.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.plan.toLowerCase().includes(q)
      )
    }
    if (deptF) {
      subscriptions = subscriptions.filter((s: any) =>
        s.department.toLowerCase().includes(deptF.toLowerCase())
      )
    }
    // cycle filter: match against calculated cycle string
    if (cycleF && cycleF !== 'All Durations') {
      // '1 Year' from dropdown maps to 'Annual' in calculated cycle
      const cycleTarget = cycleF === '1 Year' ? 'Annual' : cycleF
      subscriptions = subscriptions.filter((s: any) =>
        s.cycle.toLowerCase() === cycleTarget.toLowerCase()
      )
    }

    return successResponse({
      subscriptions,
      total:       count ?? subscriptions.length,
      page,
      per_page:    perPage,
      total_pages: Math.ceil((count ?? subscriptions.length) / perPage),
    })

  } catch (err: unknown) {
    console.error('[ADMIN SUBSCRIPTIONS ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

/* ══════════════════════════════════════════════════════════════
   POST /api/admin/subscriptions
   Body: { ids: string[], action: string }
══════════════════════════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    // Parse body once — req.json() stream can only be read once
    const body = await req.json()
    const { ids, action } = body

    // CREATE new subscription
    if (action === 'create') {
      const { user_id, user_type, plan_name, starts_at, ends_at, status } = body
      if (!user_id || !plan_name) return errorResponse('user_id and plan_name are required', 400)
      const { error: insErr } = await supabaseAdmin.from('subscriptions').insert({
        user_id, user_type, plan_name, status: status || 'active',
        starts_at, ends_at, created_at: new Date().toISOString(),
      })
      if (insErr) throw new Error(insErr.message)
      return successResponse({ message: 'Subscription created successfully' })
    }

    // SAVE RENEWAL SETTINGS — store in platform_settings if exists, else silently succeed
    if (action === 'save_renewal_settings') {
      try {
        await supabaseAdmin.from('platform_settings').upsert({
          key:        'subscription_renewal',
          value:      JSON.stringify(body.settings),
          updated_at: new Date().toISOString(),
          updated_by: admin.id,
        }, { onConflict: 'key' })
      } catch {
        // platform_settings table may not exist yet — ignore silently
      }
      return successResponse({ message: 'Renewal settings saved successfully' })
    }

    if (!ids?.length || !action) return errorResponse('ids and action are required', 400)

    if (action === 'update_status') {
      const { status } = body
      if (!status) return errorResponse('status is required', 400)
      const { error: upErr } = await supabaseAdmin
        .from('subscriptions').update({ status }).in('id', ids)
      if (upErr) throw new Error(upErr.message)
    }

    if (action === 'update_plan') {
      const { plan_name } = body
      if (!plan_name) return errorResponse('plan_name is required', 400)
      const { error: upErr } = await supabaseAdmin
        .from('subscriptions').update({ plan_name }).in('id', ids)
      if (upErr) throw new Error(upErr.message)
    }

    if (action === 'set_end_date') {
      const { ends_at } = body
      if (!ends_at) return errorResponse('ends_at is required', 400)
      const { error: upErr } = await supabaseAdmin
        .from('subscriptions').update({ ends_at }).in('id', ids)
      if (upErr) throw new Error(upErr.message)
    }

    if (action === 'cancel') {
      await supabaseAdmin.from('subscriptions').update({ status: 'cancelled' }).in('id', ids)
      const { data: subs } = await supabaseAdmin
        .from('subscriptions').select('user_id').in('id', ids)
      const uids = [...new Set((subs ?? []).map((s: any) => s.user_id).filter(Boolean))]
      if (uids.length > 0) {
        await supabaseAdmin.from('notifications').insert(
          uids.map((uid: string) => ({
            user_id: uid, type: 'subscription_expired',
            title: 'Subscription Cancelled',
            message: 'Your subscription has been cancelled by the admin. Please contact support.',
            action_url: '/subscription',
          }))
        )
      }
    }

    if (action === 'extend_30') {
      const { data: subs } = await supabaseAdmin
        .from('subscriptions').select('id, ends_at').in('id', ids)
      for (const sub of subs ?? []) {
        const d = sub.ends_at ? new Date(sub.ends_at) : new Date()
        d.setDate(d.getDate() + 30)
        await supabaseAdmin.from('subscriptions').update({ ends_at: d.toISOString() }).eq('id', sub.id)
      }
    }

    if (action === 'send_reminder') {
      const { data: subs } = await supabaseAdmin
        .from('subscriptions').select('user_id, plan_name, ends_at').in('id', ids)
      const notifs = (subs ?? []).map((s: any) => ({
        user_id: s.user_id, type: 'subscription_expiring',
        title: 'Subscription Renewal Reminder',
        message: `Your ${s.plan_name} plan is expiring soon. Renew now to continue enjoying all features.`,
        action_url: '/subscription',
      }))
      if (notifs.length > 0) await supabaseAdmin.from('notifications').insert(notifs)
    }

    // Audit log — only if audit_logs table exists
    try {
      await supabaseAdmin.from('audit_logs').insert({
        user_id:     admin.id,
        action:      `admin_subscription_${action}`,
        entity_type: 'subscriptions',
        entity_id:   ids?.[0] || null,
        ip_address:  req.headers.get('x-forwarded-for') || null,
        created_at:  new Date().toISOString(),
      })
    } catch { /* audit_logs table may not exist yet */ }

    const messages: Record<string, string> = {
      cancel:        `${ids.length} subscription(s) cancelled`,
      extend_30:     `${ids.length} subscription(s) extended by 30 days`,
      send_reminder: `Renewal reminder sent to ${ids.length} user(s)`,
    }
    return successResponse({ message: messages[action] || 'Action completed' })

  } catch (err: unknown) {
    console.error('[ADMIN SUBSCRIPTIONS POST ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
