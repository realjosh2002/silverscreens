import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/admin/dashboard — admin dashboard stats + trends

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const profile = await prisma.profiles.findUnique({
    where: { id: user.id }, select: { role: true },
  })
  if (profile?.role !== 'admin') return null
  return user
}

/* ── helper: generate a list of date strings for a range ── */
function dateRange(days: number): string[] {
  const result: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    result.push(d.toISOString().slice(0, 10)) // YYYY-MM-DD
  }
  return result
}

/* ── helper: bucket rows by date ── */
function bucketByDate(
  rows: { date: string; count: number }[],
  dates: string[]
): number[] {
  const map: Record<string, number> = {}
  for (const r of rows) map[r.date] = r.count
  return dates.map(d => map[d] ?? 0)
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const report     = searchParams.get('report')    || 'dashboard'
    const fromDate   = searchParams.get('from_date')
    const toDate     = searchParams.get('to_date')
    const roleFilter = searchParams.get('role')      || ''

    const dateFilter = fromDate && toDate ? {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    } : undefined

    /* ══════════════════════════════════════════════════════
       MAIN DASHBOARD KPIs
    ══════════════════════════════════════════════════════ */
    if (report === 'dashboard') {
      const [
        totalUsers,
        totalAspirants,
        totalAgencies,
        totalCastingCalls,
        totalApplications,
        activeSubscriptions,
        pendingVerifications,
        openReports,
        openTickets,
        recentUsers,
        recentPayments,
      ] = await Promise.all([
        prisma.profiles.count(),
        prisma.profiles.count({ where: { role: 'aspirant' } }),
        prisma.profiles.count({ where: { role: 'agency'   } }),
        prisma.casting_calls.count({ where: { status: 'active' } }),
        prisma.applications.count(),
        prisma.subscriptions.count({ where: { status: 'active' } }),
        prisma.aspirant_profiles.count({ where: { verification_status: 'pending' } }),
        prisma.reports.count({ where: { status: 'pending' } }),
        prisma.support_tickets.count({ where: { status: 'open' } }),
        prisma.profiles.findMany({
          orderBy: { created_at: 'desc' },
          take: 5,
          select: {
            id: true, name: true, email: true,
            role: true, created_at: true, is_active: true,
            aspirant_profiles: { select: { verification_status: true } },
            agency_profiles:   { select: { verification_status: true } },
          },
        }),
        prisma.payment_transactions.findMany({
          where:   { gateway_status: 'success' },
          orderBy: { created_at: 'desc' },
          take:    10,
          select: {
            id: true, plan_name: true, total_amount: true,
            currency: true, created_at: true, user_type: true,
          },
        }),
      ])

      const revenueResult = await prisma.payment_transactions.aggregate({
        where: { gateway_status: 'success' },
        _sum:  { total_amount: true },
      })

      const monthStart = new Date()
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)

      const monthlyRevenueResult = await prisma.payment_transactions.aggregate({
        where: { gateway_status: 'success', created_at: { gte: monthStart } },
        _sum:  { total_amount: true },
      })

      return successResponse({
        kpis: {
          total_users:           totalUsers,
          total_aspirants:       totalAspirants,
          total_agencies:        totalAgencies,
          total_casting_calls:   totalCastingCalls,
          total_applications:    totalApplications,
          active_subscriptions:  activeSubscriptions,
          pending_verifications: pendingVerifications,
          open_reports:          openReports,
          open_tickets:          openTickets,
          total_revenue:         revenueResult._sum.total_amount        || 0,
          monthly_revenue:       monthlyRevenueResult._sum.total_amount || 0,
        },
        recent_users:    recentUsers,
        recent_payments: recentPayments,
      })
    }

    /* ══════════════════════════════════════════════════════
       TREND DATA  — ?report=trends&range=week|month|overall
       Returns daily counts for the chart
    ══════════════════════════════════════════════════════ */
    if (report === 'trends') {
      const range = searchParams.get('range') || 'week'

      // Determine how many days back to look
      let days = 7
      if (range === 'month')   days = 30
      if (range === 'overall') days = 90   // 90-day rolling for "overall"

      const since = new Date()
      since.setDate(since.getDate() - (days - 1))
      since.setHours(0, 0, 0, 0)
      const sinceISO = since.toISOString()

      const dates = dateRange(days)  // array of 'YYYY-MM-DD' strings

      /* ── Daily aspirant registrations ── */
      const { data: aspRows } = await supabaseAdmin
        .from('profiles')
        .select('created_at')
        .eq('role', 'aspirant')
        .gte('created_at', sinceISO)

      /* ── Daily agency registrations ── */
      const { data: agencyRows } = await supabaseAdmin
        .from('profiles')
        .select('created_at')
        .eq('role', 'agency')
        .gte('created_at', sinceISO)

      /* ── Daily casting calls created ── */
      const { data: castingRows } = await supabaseAdmin
        .from('casting_calls')
        .select('created_at')
        .gte('created_at', sinceISO)

      /* ── Daily applications submitted ── */
      const { data: appRows } = await supabaseAdmin
        .from('applications')
        .select('created_at')
        .gte('created_at', sinceISO)

      /* ── Daily revenue ── */
      const { data: revRows } = await supabaseAdmin
        .from('payment_transactions')
        .select('created_at, total_amount')
        .eq('gateway_status', 'success')
        .gte('created_at', sinceISO)

      // Count helper: group raw rows by date
      function groupByDate(rows: { created_at: string }[] | null): { date: string; count: number }[] {
        const map: Record<string, number> = {}
        for (const r of rows ?? []) {
          const d = r.created_at.slice(0, 10)
          map[d] = (map[d] ?? 0) + 1
        }
        return Object.entries(map).map(([date, count]) => ({ date, count }))
      }

      // Revenue helper: group by date summing amount
      function groupRevByDate(rows: { created_at: string; total_amount: number }[] | null): { date: string; count: number }[] {
        const map: Record<string, number> = {}
        for (const r of rows ?? []) {
          const d = r.created_at.slice(0, 10)
          map[d] = (map[d] ?? 0) + Number(r.total_amount)
        }
        return Object.entries(map).map(([date, count]) => ({ date, count }))
      }

      const aspByDate     = groupByDate(aspRows)
      const agencyByDate  = groupByDate(agencyRows)
      const castByDate    = groupByDate(castingRows)
      const appByDate     = groupByDate(appRows)
      const revByDate     = groupRevByDate(revRows)

      return successResponse({
        range,
        dates,   // labels for X-axis  e.g. ['2025-07-22', ...]
        series: {
          aspirants:     bucketByDate(aspByDate,    dates),
          agencies:      bucketByDate(agencyByDate, dates),
          casting_calls: bucketByDate(castByDate,   dates),
          applications:  bucketByDate(appByDate,    dates),
          revenue:       bucketByDate(revByDate,    dates),  // raw INR per day
        },
      })
    }

    /* ══════════════════════════════════════════════════════
       USER REGISTRATION REPORT
    ══════════════════════════════════════════════════════ */
    if (report === 'users') {
      const where: Record<string, unknown> = {}
      if (dateFilter) where.created_at = dateFilter
      if (roleFilter) where.role       = roleFilter

      const users = await prisma.profiles.findMany({
        where,
        orderBy: { created_at: 'desc' },
        select: {
          id: true, profile_number: true, name: true,
          email: true, phone: true, role: true,
          created_at: true, email_verified: true,
          is_active: true, last_login_at: true,
          aspirant_profiles: {
            select: {
              city: true, state: true, country: true,
              verification_status: true, profile_completion: true,
            },
          },
          agency_profiles: {
            select: {
              city: true, state: true, country: true,
              verification_status: true, company_name: true,
            },
          },
          subscriptions: {
            where: { status: 'active' }, take: 1,
            select: { plan_name: true, status: true },
          },
        },
      })

      return successResponse({ report: 'users', data: users, total: users.length })
    }

    /* ══════════════════════════════════════════════════════
       REVENUE REPORT
    ══════════════════════════════════════════════════════ */
    if (report === 'revenue') {
      const where: Record<string, unknown> = { gateway_status: 'success' }
      if (dateFilter) where.created_at = dateFilter

      const transactions = await prisma.payment_transactions.findMany({
        where,
        orderBy: { created_at: 'desc' },
        select: {
          id: true, razorpay_order_id: true, razorpay_payment_id: true,
          plan_key: true, plan_name: true, user_type: true,
          amount: true, gst_amount: true, total_amount: true,
          currency: true, payment_method: true, gateway_status: true,
          with_rnr_addon: true, rnr_amount: true, created_at: true,
          profiles: { select: { name: true, email: true, profile_number: true } },
        },
      })

      const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.total_amount), 0)
      const totalGST     = transactions.reduce((sum, t) => sum + Number(t.gst_amount),   0)

      return successResponse({
        report: 'revenue',
        data:   transactions,
        total:  transactions.length,
        summary: {
          total_revenue: totalRevenue,
          total_gst:     totalGST,
          net_revenue:   totalRevenue - totalGST,
        },
      })
    }

    /* ══════════════════════════════════════════════════════
       CASTING CALL PERFORMANCE REPORT
    ══════════════════════════════════════════════════════ */
    if (report === 'casting_calls') {
      const where: Record<string, unknown> = {}
      if (dateFilter) where.created_at = dateFilter

      const castingCalls = await prisma.casting_calls.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: {
          agency_profiles: { select: { company_name: true, city: true, state: true } },
          _count: { select: { applications: true } },
        },
      })

      return successResponse({ report: 'casting_calls', data: castingCalls, total: castingCalls.length })
    }

    /* ══════════════════════════════════════════════════════
       FAILED PAYMENTS REPORT
    ══════════════════════════════════════════════════════ */
    if (report === 'failed_payments') {
      const where: Record<string, unknown> = { gateway_status: 'failed' }
      if (dateFilter) where.created_at = dateFilter

      const failedPayments = await prisma.payment_transactions.findMany({
        where,
        orderBy: { created_at: 'desc' },
        select: {
          id: true, razorpay_order_id: true, plan_name: true,
          total_amount: true, failure_reason: true,
          payment_method: true, created_at: true,
          profiles: { select: { name: true, email: true } },
        },
      })

      return successResponse({ report: 'failed_payments', data: failedPayments, total: failedPayments.length })
    }

    /* ══════════════════════════════════════════════════════
       REPORTS & COMPLAINTS
    ══════════════════════════════════════════════════════ */
    if (report === 'reports_complaints') {
      const complaints = await prisma.reports.findMany({
        orderBy: { created_at: 'desc' },
        select: {
          id: true, reason: true, description: true,
          status: true, created_at: true,
        },
      })

      return successResponse({ report: 'reports_complaints', data: complaints, total: complaints.length })
    }

    return errorResponse('Invalid report type', 400)

  } catch (error: unknown) {
    console.error('[ADMIN DASHBOARD ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}