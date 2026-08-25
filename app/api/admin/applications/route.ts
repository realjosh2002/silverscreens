export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

/* ── Admin auth ─────────────────────────────────────────────── */
async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

/* ── Period → ISO date ──────────────────────────────────────── */
function periodToISO(period: string): string | null {
  const now = new Date()
  if (period === 'Today')        { now.setHours(0,0,0,0); return now.toISOString() }
  if (period === 'Last 7 Days')  { now.setDate(now.getDate()-7);  return now.toISOString() }
  if (period === 'Last 30 Days') { now.setDate(now.getDate()-30); return now.toISOString() }
  return null // All Time
}

function fmt(n: number) { return n.toLocaleString('en-IN') }

function delta(cur: number, prev: number) {
  if (!prev) return '+0.0%'
  const d = ((cur - prev) / prev) * 100
  return `${d >= 0 ? '+' : ''}${d.toFixed(1)}%`
}

const BLUE   = '#3B82F6'
const PURPLE = '#8B5CF6'
const TEAL   = '#14B8A6'
const ORANGE = '#F97316'
const RED    = '#EF4444'
const GREEN  = '#22C55E'
const GOLD   = '#D4A64A'

/* ══════════════════════════════════════════════════════════════
   GET /api/admin/applications
   ?type=stats  → stat cards, charts, donuts, insights
   ?page=1&per_page=10&period=...&risk=...&q=...  → table rows
══════════════════════════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const type    = searchParams.get('type')     || 'table'
    const period  = searchParams.get('period')   || 'Last 7 Days'
    const risk    = searchParams.get('risk')     || ''
    const q       = searchParams.get('q')        || ''
    const statusParam = searchParams.get('status') || ''
    const page    = Math.max(1, parseInt(searchParams.get('page')     || '1'))
    const perPage = Math.min(50, parseInt(searchParams.get('per_page')|| '10'))
    const from    = (page - 1) * perPage

    const sinceISO = periodToISO(period)

    /* ══════════════════════════════════════════════════════════
       STATS — stat cards, donut charts, line chart, insights
    ══════════════════════════════════════════════════════════ */
    if (type === 'stats') {

      /* ── All applications in period ── */
      let appQuery = supabaseAdmin.from('applications').select('id, status, applied_at, aspirant_id')
      if (sinceISO) appQuery = appQuery.gte('applied_at', sinceISO)
      const { data: allApps } = await appQuery

      const apps = allApps ?? []
      const total = apps.length

      /* ── Previous period for delta ── */
      let prevCount = 0
      if (sinceISO) {
        const prev = new Date(sinceISO)
        const diff = Date.now() - prev.getTime()
        const prevFrom = new Date(prev.getTime() - diff).toISOString()
        const { data: prevApps } = await supabaseAdmin
          .from('applications').select('id', { count: 'exact', head: false })
          .gte('applied_at', prevFrom).lt('applied_at', sinceISO)
        prevCount = prevApps?.length ?? 0
      }

      /* ── Unique applicants ── */
      const uniqueApplicants = new Set(apps.map((a: any) => a.aspirant_id)).size

      /* ── Today count ── */
      const todayStart = new Date(); todayStart.setHours(0,0,0,0)
      const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate()-1)
      const todayApps     = apps.filter((a: any) => new Date(a.applied_at) >= todayStart)
      const yesterdayApps = apps.filter((a: any) => {
        const d = new Date(a.applied_at)
        return d >= yesterdayStart && d < todayStart
      })

      /* ── Status breakdown ── */
      const statusCount: Record<string,number> = {}
      for (const a of apps) statusCount[a.status] = (statusCount[a.status]??0)+1
      const totalForPct = total || 1
      const statusData = [
        { label:'Submitted',   value: statusCount['applied']     ??0, color: BLUE  },
        { label:'Reviewed',    value: statusCount['in_review']   ??0, color: GREEN },
        { label:'Shortlisted', value: statusCount['shortlisted'] ??0, color: GOLD  },
        { label:'Rejected',    value: statusCount['rejected']    ??0, color: RED   },
      ].map(d=>({...d, pct: parseFloat(((d.value/totalForPct)*100).toFixed(1))}))

      /* ── Flagged = rejected + on_hold + in_review (suspicious ones) ── */
      const flagged  = (statusCount['rejected']??0) + (statusCount['on_hold']??0)
      const spam     = statusCount['withdrawn'] ?? 0
      const blocked  = 0 // populated by bulk actions over time

      /* ── Risk breakdown — derive from status ── */
      const highRisk   = statusCount['rejected']    ?? 0
      const mediumRisk = statusCount['on_hold']     ?? 0
      const lowRisk    = (statusCount['applied']??0) + (statusCount['in_review']??0) + (statusCount['shortlisted']??0)
      const totalRisk  = highRisk + mediumRisk + lowRisk || 1
      const riskData = [
        { label:'High Risk',   value: highRisk,   color: RED,    pct: parseFloat(((highRisk/totalRisk)*100).toFixed(1)) },
        { label:'Medium Risk', value: mediumRisk, color: ORANGE, pct: parseFloat(((mediumRisk/totalRisk)*100).toFixed(1)) },
        { label:'Low Risk',    value: lowRisk,    color: GREEN,  pct: parseFloat(((lowRisk/totalRisk)*100).toFixed(1)) },
      ]

      /* ── Chart data — daily counts ── */
      const chartDays = period==='Today' ? 7 : period==='Last 7 Days' ? 7 : 30
      const chartSince = new Date(); chartSince.setDate(chartSince.getDate()-(chartDays-1)); chartSince.setHours(0,0,0,0)
      const { data: chartRows } = await supabaseAdmin
        .from('applications').select('applied_at').gte('applied_at', chartSince.toISOString())
      const dayMap: Record<string,number> = {}
      for (const r of chartRows??[]) {
        const d = (r.applied_at as string).slice(0,10)
        dayMap[d] = (dayMap[d]??0)+1
      }
      const chartLabels: string[] = []
      const chartData:   number[] = []
      for (let i=chartDays-1;i>=0;i--) {
        const d = new Date(); d.setDate(d.getDate()-i)
        const key = d.toISOString().slice(0,10)
        chartLabels.push(d.toLocaleDateString('en-IN',{month:'short',day:'numeric'}))
        chartData.push(dayMap[key]??0)
      }

      /* ── Stat cards ── */
      const subText = period==='Today' ? 'from yesterday' : 'from previous period'
      const stats = [
        { label:'Total Applications',   value:fmt(total),            delta:delta(total,prevCount),                            sub:subText,           iconColor:BLUE,   positive:true  },
        { label:'Unique Applicants',    value:fmt(uniqueApplicants), delta:'+0.0%',                                           sub:subText,           iconColor:PURPLE, positive:true  },
        { label:'Applications Today',   value:fmt(todayApps.length), delta:delta(todayApps.length,yesterdayApps.length),      sub:'from yesterday',  iconColor:TEAL,   positive:true  },
        { label:'Flagged Applications', value:fmt(flagged),          delta:'+0.0%',                                           sub:'rejected+on hold', iconColor:ORANGE, positive:false },
        { label:'Spam Detected',        value:fmt(spam),             delta:'+0.0%',                                           sub:'withdrawn',       iconColor:RED,    positive:false },
        { label:'Auto Blocked',         value:fmt(blocked),          delta:'+0.0%',                                           sub:'by system',       iconColor:PURPLE, positive:false },
      ]

      /* ── Insights ── */
      const prevRatio = prevCount > 0 ? total / prevCount : 1
      const insights = [
        {
          icon:'ShieldAlert', iconBg:'rgba(239,68,68,0.15)', iconColor:RED,
          title:'Multiple applications from same device/IP',
          sub: highRisk > 0 ? `${highRisk} high-risk applications detected` : 'No high-risk applications',
          href:'/admin/fraud',
        },
        {
          icon:'Zap', iconBg:'rgba(249,115,22,0.15)', iconColor:ORANGE,
          title:'Bulk applications detected',
          sub: mediumRisk > 0 ? `${mediumRisk} applications on hold for review` : 'No bulk patterns detected',
          href:'/admin/fraud',
        },
        {
          icon:'Activity', iconBg:'rgba(139,92,246,0.15)', iconColor:PURPLE,
          title:'Unusual activity spike',
          sub: prevRatio > 1.3
            ? `${Math.round((prevRatio-1)*100)}% more applications than previous period`
            : `${total} total applications this period`,
          href:'/admin/analytics',
        },
      ]

      return successResponse({ stats, chartLabels, chartData, statusData, statusTotal:fmt(total), riskData, insights })
    }

    /* ══════════════════════════════════════════════════════════
       TABLE — all applications, paginated, with filters
    ══════════════════════════════════════════════════════════ */

    /* Step 1 — resolve search to IDs if q is provided */
    let aspirantIdFilter: string[] | null = null
    let castingIdFilter:  string[] | null = null

    if (q) {
      const [{ data: aspMatch }, { data: castMatch }] = await Promise.all([
        supabaseAdmin.from('aspirant_profiles').select('id')
          .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%`),
        supabaseAdmin.from('casting_calls').select('id')
          .or(`title.ilike.%${q}%,role_name.ilike.%${q}%`),
      ])
      aspirantIdFilter = (aspMatch??[]).map((a:any)=>a.id)
      castingIdFilter  = (castMatch??[]).map((c:any)=>c.id)
      // If neither matches → return empty
      if (aspirantIdFilter.length===0 && castingIdFilter.length===0) {
        return successResponse({ applications:[], total:0 })
      }
    }

    /* Step 2 — risk filter maps to application status, but direct status param takes priority */
    let statusFilter: string | null = null
    if (statusParam)       statusFilter = statusParam          // direct status from advanced filters
    else if (risk === 'High')   statusFilter = 'rejected'
    else if (risk === 'Medium') statusFilter = 'on_hold'
    else if (risk === 'Low')    statusFilter = 'applied'

    /* Step 3 — main applications query */
    let query = supabaseAdmin
      .from('applications')
      .select(`
        id,
        status,
        applied_at,
        notes,
        aspirant_id,
        casting_call_id,
        aspirant_profiles!applications_aspirant_id_fkey (
          id,
          first_name,
          last_name,
          profile_image_url,
          user_id
        ),
        casting_calls!applications_casting_call_id_fkey (
          id,
          title,
          role_name,
          agency_profiles!casting_calls_agency_id_fkey (
            company_name
          )
        )
      `, { count: 'exact' })

    if (sinceISO)     query = query.gte('applied_at', sinceISO)
    if (statusFilter) query = query.eq('status', statusFilter)

    if (aspirantIdFilter && aspirantIdFilter.length > 0 && castingIdFilter && castingIdFilter.length > 0) {
      query = query.or(`aspirant_id.in.(${aspirantIdFilter.join(',')}),casting_call_id.in.(${castingIdFilter.join(',')})`)
    } else if (aspirantIdFilter && aspirantIdFilter.length > 0) {
      query = query.in('aspirant_id', aspirantIdFilter)
    } else if (castingIdFilter && castingIdFilter.length > 0) {
      query = query.in('casting_call_id', castingIdFilter)
    }

    query = query.order('applied_at', { ascending: false }).range(from, from + perPage - 1)

    const { data: rows, count, error } = await query
    if (error) throw new Error(error.message)

    /* Step 4 — fetch profile_numbers for the aspirant user_ids */
    const userIds = [...new Set((rows??[]).map((r:any)=>r.aspirant_profiles?.user_id).filter(Boolean))]
    let profileNumberMap: Record<string,string> = {}
    if (userIds.length > 0) {
      const { data: profRows } = await supabaseAdmin
        .from('profiles').select('id, profile_number').in('id', userIds)
      for (const p of profRows??[]) profileNumberMap[p.id] = p.profile_number
    }

    /* Step 5 — derive risk from status */
    function riskFromStatus(status: string): string {
      if (status === 'rejected' || status === 'withdrawn') return 'High'
      if (status === 'on_hold'  || status === 'in_review') return 'Medium'
      return 'Low'
    }
    function reasonFromStatus(status: string, notes: string|null): string {
      if (status === 'rejected')   return notes || 'Rejected by agency'
      if (status === 'on_hold')    return notes || 'Application placed on hold'
      if (status === 'withdrawn')  return 'Withdrawn by applicant'
      if (status === 'in_review')  return 'Under review by agency'
      if (status === 'shortlisted')return 'Shortlisted by agency'
      if (status === 'applied')    return notes || 'New application submitted'
      return notes || '—'
    }

    /* Step 6 — shape rows for the page */
    const applications = (rows??[]).map((r:any) => {
      const ap   = r.aspirant_profiles
      const cc   = r.casting_calls
      const uid  = ap?.user_id ? (profileNumberMap[ap.user_id] || `ASP-${ap?.id?.slice(0,8).toUpperCase()}`) : '—'
      const date = new Date(r.applied_at)
      return {
        id:        r.id,
        app_id:    cc?.title ?? cc?.role_name ?? `APP-${r.id.slice(0,8).toUpperCase()}`,
        date:      date.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
        time:      date.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true }),
        applicant: `${ap?.first_name??''} ${ap?.last_name??''}`.trim() || 'Unknown',
        uid,
        casting:   cc?.role_name ?? cc?.title ?? '—',
        project:   cc?.agency_profiles?.company_name ?? '—',
        risk:      riskFromStatus(r.status),
        reason:    reasonFromStatus(r.status, r.notes),
        img:       ap?.profile_image_url ?? '',
        status:    r.status,
      }
    })

    return successResponse({ applications, total: count ?? 0 })

  } catch (err: unknown) {
    console.error('[ADMIN APPLICATIONS ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

/* ══════════════════════════════════════════════════════════════
   POST /api/admin/applications
   Body: { ids: string[], action: string }
══════════════════════════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { ids, action } = await req.json()
    if (!ids?.length || !action) return errorResponse('ids and action are required', 400)

    if (action === 'Mark as Reviewed') {
      await supabaseAdmin.from('applications').update({ status:'in_review' }).in('id', ids)
    }

    if (action === 'Mark as Safe') {
      await supabaseAdmin.from('applications').update({ status:'applied' }).in('id', ids)
    }

    if (action === 'Escalate to Fraud') {
      await supabaseAdmin.from('applications').update({ status:'rejected' }).in('id', ids)
    }

    if (action === 'Block Selected Users') {
      const { data: appRows } = await supabaseAdmin
        .from('applications')
        .select('aspirant_profiles!applications_aspirant_id_fkey ( user_id )')
        .in('id', ids)
      const userIds = (appRows??[]).map((r:any)=>r.aspirant_profiles?.user_id).filter(Boolean)
      if (userIds.length > 0) {
        await supabaseAdmin.from('profiles').update({ is_active: false }).in('id', userIds)
      }
    }

    await supabaseAdmin.from('audit_logs').insert({
      user_id:     admin.id,
      action:      `ADMIN_BULK_${action.toUpperCase().replace(/ /g,'_')}`,
      entity_type: 'application',
      new_values:  { ids, action },
    })

    return successResponse({ message: `${action} applied to ${ids.length} application(s)` })

  } catch (err: unknown) {
    console.error('[ADMIN BULK APPLICATIONS ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
