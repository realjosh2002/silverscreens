import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/admin/dashboard — admin dashboard stats
// GET /api/admin/reports  — downloadable reports

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null
  const profile = await prisma.profiles.findUnique({
    where: { id: user.id }, select: { role: true },
  })
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
    const report    = searchParams.get('report')     || 'dashboard'
    const fromDate  = searchParams.get('from_date')
    const toDate    = searchParams.get('to_date')
    const roleFilter = searchParams.get('role')      || ''
    const country   = searchParams.get('country')    || ''
    const state     = searchParams.get('state')      || ''

    const dateFilter = fromDate && toDate ? {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    } : undefined

    if (report === 'dashboard') {
      // ── Main dashboard KPIs ───────────────────────────────
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
          take:    5,
          select: {
            id: true, name: true, email: true,
            role: true, created_at: true,
          },
        }),
        prisma.payment_transactions.findMany({
          where:   { gateway_status: 'success' },
          orderBy: { created_at: 'desc' },
          take:    5,
          select: {
            id: true, plan_name: true, total_amount: true,
            currency: true, created_at: true, user_type: true,
          },
        }),
      ])

      // Revenue stats
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
          total_revenue:         revenueResult._sum.total_amount || 0,
          monthly_revenue:       monthlyRevenueResult._sum.total_amount || 0,
        },
        recent_users:    recentUsers,
        recent_payments: recentPayments,
      })
    }

    if (report === 'users') {
      // ── User Registration Report ──────────────────────────
      const where: Record<string, unknown> = {}
      if (dateFilter) where.created_at = dateFilter
      if (roleFilter) where.role       = roleFilter

      const users = await prisma.profiles.findMany({
        where,
        orderBy: { created_at: 'desc' },
        select: {
          id:             true,
          profile_number: true,
          name:           true,
          email:          true,
          phone:          true,
          role:           true,
          created_at:     true,
          email_verified: true,
          is_active:      true,
          last_login_at:  true,
          aspirant_profiles: {
            select: {
              city:                true,
              state:               true,
              country:             true,
              verification_status: true,
              profile_completion:  true,
            },
          },
          agency_profiles: {
            select: {
              city:                true,
              state:               true,
              country:             true,
              verification_status: true,
              company_name:        true,
            },
          },
          subscriptions: {
            where:  { status: 'active' },
            take:   1,
            select: { plan_name: true, status: true },
          },
        },
      })

      return successResponse({ report: 'users', data: users, total: users.length })
    }

    if (report === 'revenue') {
      // ── Subscription Revenue Report ───────────────────────
      const where: Record<string, unknown> = { gateway_status: 'success' }
      if (dateFilter) where.created_at = dateFilter

      const transactions = await prisma.payment_transactions.findMany({
        where,
        orderBy: { created_at: 'desc' },
        select: {
          id:                   true,
          razorpay_order_id:    true,
          razorpay_payment_id:  true,
          plan_key:             true,
          plan_name:            true,
          user_type:            true,
          amount:               true,
          gst_amount:           true,
          total_amount:         true,
          currency:             true,
          payment_method:       true,
          gateway_status:       true,
          with_rnr_addon:       true,
          rnr_amount:           true,
          created_at:           true,
          profiles: {
            select: {
              name:           true,
              email:          true,
              profile_number: true,
            },
          },
        },
      })

      const totalRevenue = transactions.reduce(
        (sum, t) => sum + Number(t.total_amount), 0
      )
      const totalGST = transactions.reduce(
        (sum, t) => sum + Number(t.gst_amount), 0
      )

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

    if (report === 'casting_calls') {
      // ── Casting Call Performance Report ──────────────────
      const where: Record<string, unknown> = {}
      if (dateFilter) where.created_at = dateFilter

      const castingCalls = await prisma.casting_calls.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: {
          agency_profiles: {
            select: { company_name: true, city: true, state: true },
          },
          _count: { select: { applications: true } },
        },
      })

      return successResponse({
        report: 'casting_calls',
        data:   castingCalls,
        total:  castingCalls.length,
      })
    }

    if (report === 'failed_payments') {
      // ── Failed Payment Report ─────────────────────────────
      const where: Record<string, unknown> = { gateway_status: 'failed' }
      if (dateFilter) where.created_at = dateFilter

      const failedPayments = await prisma.payment_transactions.findMany({
        where,
        orderBy: { created_at: 'desc' },
        select: {
          id:                  true,
          razorpay_order_id:   true,
          plan_name:           true,
          total_amount:        true,
          failure_reason:      true,
          payment_method:      true,
          created_at:          true,
          profiles: {
            select: { name: true, email: true },
          },
        },
      })

      return successResponse({
        report: 'failed_payments',
        data:   failedPayments,
        total:  failedPayments.length,
      })
    }

    if (report === 'reports_complaints') {
      // ── Reports & Complaints ──────────────────────────────
      const complaints = await prisma.reports.findMany({
        orderBy: { created_at: 'desc' },
        select: {
          id:           true,
          reason:       true,
          description:  true,
          status:       true,
          admin_action: true,
          created_at:   true,
        },
      })

      return successResponse({
        report: 'reports_complaints',
        data:   complaints,
        total:  complaints.length,
      })
    }

    return errorResponse('Invalid report type', 400)
  } catch (error: unknown) {
    console.error('[ADMIN REPORTS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}