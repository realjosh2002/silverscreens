export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
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

function periodToISO(period: string): string | null {
  const now = new Date()
  if (period === 'Today')        { now.setHours(0,0,0,0); return now.toISOString() }
  if (period === 'Last 7 Days')  { now.setDate(now.getDate()-7);  return now.toISOString() }
  if (period === 'Last 30 Days') { now.setDate(now.getDate()-30); return now.toISOString() }
  if (period === 'Last 90 Days') { now.setDate(now.getDate()-90); return now.toISOString() }
  return null
}

function fmt(n: number) { return n.toLocaleString('en-IN') }
function pctDelta(cur: number, prev: number) {
  if (!prev) return '+0.0%'
  const d = ((cur - prev) / prev) * 100
  return `${d >= 0 ? '+' : ''}${d.toFixed(1)}%`
}

/* ── Actual DB column names (from Prisma error) ─────────────── */
// reported_by       = reporter (who submitted the report)
// reported_user_id  = who was reported
// reason            = enum: fake_profile | scam_casting | harassment | inappropriate_content | spam | fraud | impersonation | copyright_violation | other
// description       = text
// admin_notes       = admin action notes
// resolved_at       = when resolved
// NO status column  = derive from resolved_at + admin_notes

const REASON_LABEL: Record<string,string> = {
  fake_profile:          'Fake Profile / Impersonation',
  scam_casting:          'Scam / Fraud',
  harassment:            'Harassment / Abuse',
  inappropriate_content: 'Inappropriate Content',
  spam:                  'Spam',
  fraud:                 'Scam / Fraud',
  impersonation:         'Fake Profile / Impersonation',
  copyright_violation:   'Copyright Violation',
  other:                 'Others',
}

const PURPLE = '#8B5CF6'; const ORANGE = '#F97316'; const BLUE = '#3B82F6'
const GREEN  = '#22C55E'; const RED    = '#EF4444'; const TEAL = '#14B8A6'

const REASON_COLOR: Record<string,string> = {
  'Fake Profile / Impersonation': BLUE,
  'Inappropriate Content':        TEAL,
  'Scam / Fraud':                 ORANGE,
  'Harassment / Abuse':           RED,
  'Spam':                         PURPLE,
  'Copyright Violation':          BLUE,
  'Others':                       PURPLE,
}

// Derive status from DB fields since there's no status column
function deriveStatus(r: any): string {
  if (r.resolved_at && r.admin_notes === 'dismiss') return 'dismissed'
  if (r.resolved_at) return 'resolved'
  if (r.admin_notes === 'escalate') return 'escalated'
  return 'pending'
}

/* ══════════════════════════════════════════════════════════════
   GET /api/admin/reports
══════════════════════════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const type        = searchParams.get('type')        || 'table'
    const period      = searchParams.get('period')      || 'All Time'
    const page        = Math.max(1, parseInt(searchParams.get('page')     || '1'))
    const perPage     = Math.min(50, parseInt(searchParams.get('per_page')|| '5'))
    const fromRow     = (page - 1) * perPage
    const sortBy      = searchParams.get('sort')        || 'Newest First'
    const reportType  = searchParams.get('report_type') || ''
    const statusParam = searchParams.get('status')      || ''
    const priority    = searchParams.get('priority')    || ''
    const q           = searchParams.get('q')           || ''
    const sinceISO    = periodToISO(period)

    /* ════════════════════════════════════════════════════════
       STATS
    ════════════════════════════════════════════════════════ */
    if (type === 'stats') {
      const where: any = {}
      if (sinceISO) where.created_at = { gte: new Date(sinceISO) }

      const allReports = await prisma.reports.findMany({
        where,
        select: { id: true, reason: true, created_at: true, resolved_at: true, admin_notes: true },
      })
      const total = allReports.length

      // Previous period
      let prevCount = 0
      if (sinceISO) {
        const prev     = new Date(sinceISO)
        const diff     = Date.now() - prev.getTime()
        const prevFrom = new Date(prev.getTime() - diff)
        prevCount = await prisma.reports.count({
          where: { created_at: { gte: prevFrom, lt: new Date(sinceISO) } },
        })
      }

      // Status counts derived from fields
      const pending   = allReports.filter(r => !r.resolved_at && r.admin_notes !== 'escalate').length
      const escalated = allReports.filter(r => !r.resolved_at && r.admin_notes === 'escalate').length
      const resolved  = allReports.filter(r => r.resolved_at  && r.admin_notes !== 'dismiss').length
      const dismissed = allReports.filter(r => r.resolved_at  && r.admin_notes === 'dismiss').length

      // Reason breakdown
      const reasonCount: Record<string,number> = {}
      for (const r of allReports) {
        const label = REASON_LABEL[r.reason as string] || 'Others'
        reasonCount[label] = (reasonCount[label] ?? 0) + 1
      }
      const sortedReasons = Object.entries(reasonCount).sort((a,b)=>b[1]-a[1]).slice(0,5)
      const typeTotal     = sortedReasons.reduce((s,[,v])=>s+v,0) || 1
      const typeData      = sortedReasons.map(([label,value])=>({
        label, value,
        pct:   parseFloat(((value/typeTotal)*100).toFixed(1)),
        color: REASON_COLOR[label] || PURPLE,
      }))

      // Status donut
      const sd = total || 1
      const statusDonut = [
        { label:'Open',               value:pending,   pct:parseFloat(((pending/sd)*100).toFixed(1)),   color:ORANGE },
        { label:'In Progress',        value:escalated, pct:parseFloat(((escalated/sd)*100).toFixed(1)), color:BLUE   },
        { label:'Resolved',           value:resolved,  pct:parseFloat(((resolved/sd)*100).toFixed(1)),  color:GREEN  },
        { label:'Rejected/Dismissed', value:dismissed, pct:parseFloat(((dismissed/sd)*100).toFixed(1)), color:RED    },
      ]

      // Chart: days/buckets to show must match the selected period
      // For All Time: find the oldest report and span from there to today
      let chartDays: number
      let chartSince: Date

      if (period === 'All Time') {
        // Find the oldest report to determine how far back to go
        const oldest = await prisma.reports.findFirst({
          orderBy: { created_at: 'asc' },
          select: { created_at: true },
        })
        if (oldest?.created_at) {
          const oldestDate = new Date(oldest.created_at as any)
          oldestDate.setHours(0, 0, 0, 0)
          const diffMs = Date.now() - oldestDate.getTime()
          chartDays = Math.max(7, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1)
          // Cap at 90 days for readability; beyond that bucket by week
          chartDays = Math.min(chartDays, 90)
          chartSince = oldestDate
        } else {
          chartDays = 7
          chartSince = new Date()
          chartSince.setDate(chartSince.getDate() - 6)
          chartSince.setHours(0, 0, 0, 0)
        }
      } else if (period === 'Today') {
        chartDays = 1
        chartSince = new Date()
        chartSince.setHours(0, 0, 0, 0)
      } else {
        chartDays = period === 'Last 90 Days' ? 90 : period === 'Last 30 Days' ? 30 : 7
        chartSince = new Date()
        chartSince.setDate(chartSince.getDate() - (chartDays - 1))
        chartSince.setHours(0, 0, 0, 0)
      }
      const chartRows = await prisma.reports.findMany({
        where:  { created_at: { gte: chartSince } },
        select: { created_at: true },
      })
      const dayMap: Record<string,number> = {}
      for (const r of chartRows) {
        const d = (r.created_at as any).toISOString().slice(0,10)
        dayMap[d] = (dayMap[d] ?? 0) + 1
      }

      const chartLabels: string[] = []
      const chartData:   number[] = []

      if (chartDays <= 30) {
        // Daily buckets
        for (let i = chartDays - 1; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const key = d.toISOString().slice(0, 10)
          chartLabels.push(d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }))
          chartData.push(dayMap[key] ?? 0)
        }
      } else {
        // Weekly buckets — group days into 7-day windows
        const totalDays = chartDays
        const weeks = Math.ceil(totalDays / 7)
        for (let w = weeks - 1; w >= 0; w--) {
          let weekTotal = 0
          const weekStart = new Date()
          weekStart.setDate(weekStart.getDate() - (w + 1) * 7 + 1)
          for (let d = 0; d < 7; d++) {
            const day = new Date(weekStart)
            day.setDate(weekStart.getDate() + d)
            const key = day.toISOString().slice(0, 10)
            weekTotal += dayMap[key] ?? 0
          }
          chartLabels.push(weekStart.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }))
          chartData.push(weekTotal)
        }
      }

      const startDate = chartSince.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})
      const endDate   = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})

      const stats = [
        { label:'Total Reports',        value:fmt(total),     delta:pctDelta(total,prevCount),    sub:'from previous period', color:PURPLE, positive:true  },
        { label:'Open Reports',         value:fmt(pending),   delta:'+0.0%',                      sub:'awaiting action',      color:ORANGE, positive:false },
        { label:'In Progress',          value:fmt(escalated), delta:'+0.0%',                      sub:'being reviewed',       color:BLUE,   positive:true  },
        { label:'Resolved',             value:fmt(resolved),  delta:pctDelta(resolved,prevCount), sub:'from previous period', color:GREEN,  positive:true  },
        { label:'Rejected / Dismissed', value:fmt(dismissed), delta:'+0.0%',                      sub:'from previous period', color:RED,    positive:false },
      ]

      const topType    = sortedReasons[0]?.[0] || 'N/A'
      const topTypePct = typeData[0]?.pct || 0
      const prevRatio  = prevCount > 0 ? total / prevCount : 1
      const insights = [
        { icon:'TrendingUp', iconBg:'rgba(239,68,68,0.15)',  iconColor:RED,    title:prevRatio>1?`${Math.round((prevRatio-1)*100)}% increase in reports`:'Reports within normal range', sub:`${fmt(total)} total reports this period` },
        { icon:'Clock',      iconBg:'rgba(249,115,22,0.15)', iconColor:ORANGE, title:`${fmt(pending)} open reports pending`, sub:escalated>0?`${fmt(escalated)} currently escalated`:'No reports escalated' },
        { icon:'ShieldAlert',iconBg:'rgba(34,197,94,0.15)',  iconColor:GREEN,  title:'Top reported category', sub:topType!=='N/A'?`${topType} (${topTypePct}%)`:'No reports yet' },
        { icon:'Users',      iconBg:'rgba(59,130,246,0.15)', iconColor:BLUE,   title:`${fmt(resolved)} reports resolved`, sub:total>0?`${parseFloat(((resolved/total)*100).toFixed(1))}% resolution rate`:'No data yet' },
      ]

      return successResponse({ stats, chartLabels, chartData, typeData, statusDonut, insights, dateRangeLabel:`${startDate} – ${endDate}` })
    }

    /* ════════════════════════════════════════════════════════
       TABLE
    ════════════════════════════════════════════════════════ */
    const where: any = {}
    // No date filter on table — show all reports, sorted by newest
    // This avoids nullable created_at issues and OR conflicts

    // Status filter — derived from fields
    if (statusParam && !['All Status',''].includes(statusParam)) {
      if (statusParam === 'pending')   { where.resolved_at = null; where.NOT = { admin_notes: 'escalate' } }
      if (statusParam === 'escalated') { where.resolved_at = null; where.admin_notes = 'escalate' }
      if (statusParam === 'resolved')  { where.resolved_at = { not: null }; where.NOT = { admin_notes: 'dismiss' } }
      if (statusParam === 'dismissed') { where.resolved_at = { not: null }; where.admin_notes = 'dismiss' }
    }

    // Priority filter — map to reason groups since there's no severity column
    if (priority && priority !== 'All Priority') {
      const priorityReasonMap: Record<string,string[]> = {
        High:   ['fraud','scam_casting','fake_profile','impersonation'],
        Medium: ['harassment','inappropriate_content'],
        Low:    ['other','spam','copyright_violation'],
      }
      const reasons = priorityReasonMap[priority]
      if (reasons) where.reason = { in: reasons }
    }

    // Reason filter
    if (reportType && reportType !== 'All Report Types') {
      const dbReasonMap: Record<string,string[]> = {
        'Fake Profile / Impersonation': ['fake_profile','impersonation'],
        'Scam / Fraud':                 ['scam_casting','fraud'],
        'Harassment / Abuse':           ['harassment'],
        'Inappropriate Content':        ['inappropriate_content'],
        'Others':                       ['other','spam','copyright_violation'],
      }
      const dbReasons = dbReasonMap[reportType]
      if (dbReasons) where.reason = { in: dbReasons }
    }

    // Search — use AND to avoid overwriting the date OR clause
    if (q) {
      const matchProfiles = await prisma.profiles.findMany({
        where: { OR: [{ name: { contains: q, mode: 'insensitive' } }, { profile_number: { contains: q, mode: 'insensitive' } }] },
        select: { id: true },
      })
      const ids = matchProfiles.map((p:any) => p.id)
      if (ids.length > 0) {
        where.AND = [
          ...(where.AND || []),
          { OR: [{ reported_by: { in: ids } }, { reported_user_id: { in: ids } }] },
        ]
      }
    }

    const orderBy: any =
      sortBy === 'Oldest First'     ? [{ created_at: { sort: 'asc',  nulls: 'last'  } }] :
      sortBy === 'Status'           ? [{ resolved_at: { sort: 'asc',  nulls: 'first' } }] :
      sortBy === 'Highest Priority' ? [{ reason: 'asc' }] :
                                      [{ created_at: { sort: 'desc', nulls: 'last'  } }]

    const [reports, total] = await Promise.all([
      prisma.reports.findMany({ where, orderBy, skip: fromRow, take: perPage }),
      prisma.reports.count({ where }),
    ])

    // Fetch reporter profiles (reported_by column)
    const reporterIds = [...new Set((reports as any[]).map((r:any) => r.reported_by).filter(Boolean))]
    let reporterMap: Record<string,any> = {}
    if (reporterIds.length > 0) {
      const rp = await prisma.profiles.findMany({
        where: { id: { in: reporterIds } },
        select: { id: true, name: true, profile_number: true,
          aspirant_profiles: { select: { profile_image_url: true } } },
      })
      for (const p of rp) reporterMap[p.id] = p
    }

    // Fetch reported user profiles (reported_user_id column)
    const reportedIds = [...new Set((reports as any[]).map((r:any) => r.reported_user_id).filter(Boolean))]
    let reportedMap: Record<string,any> = {}
    if (reportedIds.length > 0) {
      const dp = await prisma.profiles.findMany({
        where: { id: { in: reportedIds } },
        select: { id: true, name: true, profile_number: true, role: true,
          agency_profiles:   { select: { company_name: true } },
          aspirant_profiles: { select: { first_name: true, last_name: true } } },
      })
      for (const p of dp) reportedMap[p.id] = p
    }

    const highReasons = ['fraud','scam_casting','fake_profile','impersonation']
    const medReasons  = ['harassment','inappropriate_content']

    const shaped = (reports as any[]).map((r:any) => {
      const reporter     = reporterMap[r.reported_by] || null
      const reportedUser = r.reported_user_id ? reportedMap[r.reported_user_id] : null
      const date         = new Date(r.created_at)
      const status       = deriveStatus(r)

      let against     = '—'
      let againstUid  = '—'
      let againstType = 'user'
      if (reportedUser) {
        if (reportedUser.role === 'agency') {
          against     = reportedUser.agency_profiles?.company_name || reportedUser.name || '—'
          againstType = 'agency'
        } else {
          const fn = reportedUser.aspirant_profiles?.first_name || ''
          const ln = reportedUser.aspirant_profiles?.last_name  || ''
          against  = `${fn} ${ln}`.trim() || reportedUser.name || '—'
        }
        againstUid = reportedUser.profile_number || r.reported_user_id.slice(0,12)
      }

      return {
        id:              r.id,
        report_number:   `REP-${date.getFullYear()}-${String(r.id).slice(0,6).toUpperCase()}`,
        date:            date.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),
        time:            date.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true}),
        reportedBy:      reporter?.name || 'Unknown',
        reportedByUid:   reporter?.profile_number || String(r.reported_by).slice(0,12),
        reporterImg:     reporter?.aspirant_profiles?.profile_image_url || null,
        reportedByUserId:r.reported_by,
        against,
        againstUid,
        againstUserId:   r.reported_user_id || '',
        againstType,
        type:            REASON_LABEL[r.reason as string] || r.reason || 'Others',
        category:        r.reason || 'General',
        priority:        highReasons.includes(r.reason) ? 'High' : medReasons.includes(r.reason) ? 'Medium' : 'Low',
        status,
        description:     r.description || '',
      }
    })

    return successResponse({ reports: shaped, total })

  } catch (err: unknown) {
    console.error('[ADMIN REPORTS GET ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

/* ══════════════════════════════════════════════════════════════
   PATCH /api/admin/reports
══════════════════════════════════════════════════════════════ */
export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { id, action } = await req.json()
    if (!id || !action) return errorResponse('id and action are required', 400)

    const validActions = ['resolve','dismiss','escalate','reopen']
    if (!validActions.includes(action)) return errorResponse('Invalid action', 400)

    await prisma.reports.update({
      where: { id },
      data: {
        admin_notes:  action,
        resolved_at:  ['resolve','dismiss'].includes(action) ? new Date() : null,
      },
    })

    await supabaseAdmin.from('audit_logs').insert({
      user_id: admin.id, action: `ADMIN_REPORT_${action.toUpperCase()}`,
      entity_type: 'report', entity_id: String(id), new_values: { action },
    })

    return successResponse({ message: `Report ${action}d successfully` })

  } catch (err: unknown) {
    console.error('[ADMIN PATCH REPORT ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
