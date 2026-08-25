export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// All DB access via supabaseAdmin only — no Prisma

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const report     = searchParams.get('report')      || 'logs'
    const page       = Math.max(1, parseInt(searchParams.get('page')   || '1'))
    const limit      = Math.min(50, parseInt(searchParams.get('limit') || '15'))
    const search     = searchParams.get('search')      || ''
    const actionF    = searchParams.get('action')      || ''
    const entityF    = searchParams.get('entity_type') || ''
    const statusF    = searchParams.get('status')      || ''
    const sortTs     = searchParams.get('sort_ts')     || 'desc'
    const sortUser   = searchParams.get('sort_user')   || ''
    const periodDays = parseInt(searchParams.get('period_days') || '30')
    const dateFrom   = searchParams.get('date_from') || ''
    const dateTo     = searchParams.get('date_to')   || ''

    /* ══════════════════════════════════════════════
       SUMMARY
    ══════════════════════════════════════════════ */
    if (report === 'summary') {
      const since = new Date()
      since.setDate(since.getDate() - periodDays)
      since.setHours(0, 0, 0, 0)
      const sinceISO = since.toISOString()

      // Check table exists first
      const { error: tableErr } = await supabaseAdmin
        .from('audit_logs')
        .select('id', { count: 'exact', head: true })
        .limit(1)

      if (tableErr) {
        // Table doesn't exist yet — return empty but valid response
        return successResponse({
          total_logs:     0,
          success_count:  0,
          failed_count:   0,
          module_stats:   [],
          activity_chart: { dates: [], success: [], failed: [] },
          top_users:      [],
        })
      }

      // Total count for period
      const { count: totalLogs } = await supabaseAdmin
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sinceISO)

      // Fetch all rows for period (just needed columns)
      const { data: allRows } = await supabaseAdmin
        .from('audit_logs')
        .select('entity_type, action, created_at, user_id')
        .gte('created_at', sinceISO)

      const rows = allRows ?? []

      // Success / failed counts for the full period
      const failedRows   = rows.filter(r => (r.action || '').toLowerCase().includes('fail'))
      const successRows  = rows.filter(r => !(r.action || '').toLowerCase().includes('fail'))
      const successCount = successRows.length
      const failedCount  = failedRows.length

      // Module breakdown by entity_type
      const moduleCounts: Record<string, number> = {}
      for (const r of rows) {
        const k = r.entity_type || 'unknown'
        moduleCounts[k] = (moduleCounts[k] ?? 0) + 1
      }
      const moduleTotal = Object.values(moduleCounts).reduce((s, v) => s + v, 0) || 1
      const moduleStats = Object.entries(moduleCounts)
        .map(([label, count]) => ({ label, count, pct: Math.round((count / moduleTotal) * 100) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)

      // Activity chart — last 7 days (always 7 regardless of period for chart readability)
      const chartDays = 7
      const dates: string[]      = []
      const successArr: number[] = []
      const failedArr:  number[] = []

      for (let i = chartDays - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().slice(0, 10)
        const label   = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        dates.push(label)
        const dayRows = rows.filter(r => r.created_at?.slice(0, 10) === dateStr)
        const dayFail = dayRows.filter(r => (r.action || '').toLowerCase().includes('fail')).length
        successArr.push(dayRows.length - dayFail)
        failedArr.push(dayFail)
      }

      // Top users
      const userCounts: Record<string, number> = {}
      for (const r of rows) {
        if (!r.user_id) continue
        userCounts[r.user_id] = (userCounts[r.user_id] ?? 0) + 1
      }
      const topUserIds = Object.entries(userCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id]) => id)

      let topUsers: { name: string; role: string; count: number; avatar: string }[] = []
      if (topUserIds.length > 0) {
        const { data: profileRows } = await supabaseAdmin
          .from('profiles')
          .select('id, name, email, role')
          .in('id', topUserIds)
        const pMap: Record<string, { name: string; role: string; email?: string }> = {}
        for (const p of profileRows ?? []) pMap[p.id] = { name: p.name, role: p.role }
        topUsers = topUserIds.map(id => ({
          name:   pMap[id]?.name || 'User',
          role:   pMap[id]?.role || 'user',
          count:  userCounts[id],
          avatar: (pMap[id]?.name || 'UN').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
        }))
      }

      return successResponse({
        total_logs:     totalLogs ?? rows.length,
        success_count:  successCount,
        failed_count:   failedCount,
        module_stats:   moduleStats,
        activity_chart: { dates, success: successArr, failed: failedArr },
        top_users:      topUsers,
      })
    }

    /* ══════════════════════════════════════════════
       LOGS LIST
    ══════════════════════════════════════════════ */
    // Guard: check table exists
    const { error: listTableErr } = await supabaseAdmin
      .from('audit_logs').select('id').limit(1)
    if (listTableErr) {
      return successResponse({ logs: [], total: 0, page, limit, total_pages: 0 })
    }

    let query = supabaseAdmin
      .from('audit_logs')
      .select('id, user_id, action, entity_type, entity_id, ip_address, user_agent, created_at', { count: 'exact' })

    // Filters
    if (search) {
      query = query.or(
        `action.ilike.%${search}%,entity_type.ilike.%${search}%,ip_address.ilike.%${search}%`
      )
    }
    if (actionF)  query = query.ilike('action',      `%${actionF}%`)
    if (entityF)  query = query.eq('entity_type',    entityF)
    // Status is derived (no DB column) — filter by action keyword
    if (statusF === 'Failed')  query = query.ilike('action', '%fail%')
    if (statusF === 'Success') query = query.not('action', 'ilike', '%fail%')

    // Date range filter — adjust for IST (UTC+5:30)
    // IST midnight = UTC 18:30 previous day
    // So 2026-08-07 00:00 IST = 2026-08-06T18:30:00Z
    // And 2026-08-07 23:59 IST = 2026-08-07T18:29:59Z
    if (dateFrom) {
      const fromDate = new Date(dateFrom + 'T00:00:00+05:30')
      query = query.gte('created_at', fromDate.toISOString())
    }
    if (dateTo) {
      const toDate = new Date(dateTo + 'T23:59:59+05:30')
      query = query.lte('created_at', toDate.toISOString())
    }

    // Sort
    if (sortUser === 'asc')       query = query.order('user_id', { ascending: true  })
    else if (sortUser === 'desc') query = query.order('user_id', { ascending: false })
    else                          query = query.order('created_at', { ascending: sortTs === 'asc' })

    // Pagination
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data: logs, count: totalCount, error: logsErr } = await query
    if (logsErr) throw new Error(logsErr.message)

    // Enrich with profile names
    const userIds = [...new Set((logs ?? []).map(l => l.user_id).filter(Boolean))]
    const pMap: Record<string, { name: string; role: string; email?: string }> = {}
    if (userIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, role')
        .in('id', userIds)
      for (const p of profiles ?? []) pMap[p.id] = { name: p.name || p.email?.split('@')[0] || 'User', role: p.role }
    }

    const enriched = (logs ?? []).map(l => ({
      id:          l.id,
      ts:          l.created_at,
      user_id:     l.user_id,
      user:        l.user_id ? (pMap[l.user_id]?.name || pMap[l.user_id]?.email?.split('@')[0] || 'User') : 'System',
      role:        l.user_id ? (pMap[l.user_id]?.role || 'user')    : 'system',
      action:      l.action      || '—',
      entity_type: l.entity_type || '—',
      entity_id:   l.entity_id   || '—',
      ip:          l.ip_address  || '—',
      user_agent:  l.user_agent  || '—',
      status:      (l.action || '').toLowerCase().includes('fail') ? 'Failed' : 'Success',
    }))

    return successResponse({
      logs:        enriched,
      total:       totalCount ?? 0,
      page,
      limit,
      total_pages: Math.ceil((totalCount ?? 0) / limit),
    })

  } catch (err: unknown) {
    console.error('[ADMIN AUDIT ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
