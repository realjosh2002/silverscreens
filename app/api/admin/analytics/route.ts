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

function monthLabel(offsetFromNow: number): string {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const d = new Date()
  d.setMonth(d.getMonth() + offsetFromNow)
  return MONTHS[d.getMonth()]
}

export async function GET(req: NextRequest) {
  try {
    if (!await verifyAdmin(req))
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const now        = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const today      = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

    // ── 1. Core profile counts (from profiles table — source of truth) ──
    const [
      { count: totalProfiles },
      { count: aspirantCount },
      { count: agencyCount },
      { count: activeCount },
      { count: newThisMonth },
      { count: emailVerified },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'aspirant'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'agency'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('email_verified', true),
    ])

    // ── 2. Aspirant verification breakdown ──
    const [
      { count: aspApproved },
      { count: aspPending },
    ] = await Promise.all([
      supabase.from('aspirant_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'approved'),
      supabase.from('aspirant_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    ])

    // ── 3. Agency verification breakdown ──
    const [
      { count: agcApproved },
      { count: agcPending },
    ] = await Promise.all([
      supabase.from('agency_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'approved'),
      supabase.from('agency_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    ])

    // ── 4. Casting calls ──
    const [
      { count: totalCastings },
      { count: activeCastings },
      { count: draftCastings },
      { count: closedCastings },
    ] = await Promise.all([
      supabase.from('casting_calls').select('*', { count: 'exact', head: true }),
      supabase.from('casting_calls').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('casting_calls').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('casting_calls').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
    ])

    // ── 5. Applications ──
    const [
      { count: totalApplications },
      { count: appsToday },
      { count: shortlisted },
      { count: rejected },
    ] = await Promise.all([
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }).gte('applied_at', today),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'shortlisted'),
      supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    ])

    // ── 6. Auditions ──
    const [
      { count: totalAuditions },
      { count: auditionsToday },
    ] = await Promise.all([
      supabase.from('auditions').select('*', { count: 'exact', head: true }),
      supabase.from('auditions').select('*', { count: 'exact', head: true }).gte('created_at', today),
    ])

    // ── 7. Messages ──
    const { count: msgsToday } = await supabase
      .from('messages').select('*', { count: 'exact', head: true }).gte('created_at', today)

    // ── 8. Revenue from subscriptions ──
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('total_amount, amount, gst_amount, user_type, status, created_at')

    const allSubs      = subData || []
    const paidSubs     = allSubs.filter(s => ['active','expired'].includes(s.status))
    const totalRevenue = paidSubs.reduce((s, r) => s + (r.total_amount || 0), 0)
    const aspirantRev  = paidSubs.filter(r => r.user_type === 'aspirant').reduce((s, r) => s + (r.total_amount || 0), 0)
    const agencyRev    = paidSubs.filter(r => r.user_type === 'agency').reduce((s, r) => s + (r.total_amount || 0), 0)
    const activeSubs   = allSubs.filter(s => s.status === 'active').length

    // ── 9. User growth — 12 monthly buckets ──
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1).toISOString()
    const { data: growthData } = await supabase
      .from('profiles')
      .select('created_at, is_active')
      .gte('created_at', twelveMonthsAgo)

    const growthTotal  = Array(12).fill(0)
    const growthActive = Array(12).fill(0)
    ;(growthData || []).forEach((p: any) => {
      const m   = new Date(p.created_at).getMonth()
      const cur = now.getMonth()
      const yr  = new Date(p.created_at).getFullYear()
      const curYr = now.getFullYear()
      const diff  = (curYr - yr) * 12 + (cur - m)
      const idx   = 11 - diff
      if (idx >= 0 && idx < 12) {
        growthTotal[idx]++
        if (p.is_active) growthActive[idx]++
      }
    })
    // Cumulative
    for (let i = 1; i < 12; i++) {
      growthTotal[i]  += growthTotal[i - 1]
      growthActive[i] += growthActive[i - 1]
    }

    // ── 10. Applications trend — 6 monthly buckets ──
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()
    const { data: appsData } = await supabase
      .from('applications')
      .select('applied_at')
      .gte('applied_at', sixMonthsAgo)

    const appsBuckets = Array(6).fill(0)
    ;(appsData || []).forEach((a: any) => {
      const m    = new Date(a.applied_at).getMonth()
      const yr   = new Date(a.applied_at).getFullYear()
      const diff = (now.getFullYear() - yr) * 12 + (now.getMonth() - m)
      const idx  = 5 - diff
      if (idx >= 0 && idx < 6) appsBuckets[idx]++
    })

    // ── 11. Revenue trend — 6 monthly buckets ──
    const revBuckets = Array(6).fill(0)
    allSubs
      .filter(s => s.created_at && s.total_amount)
      .forEach((s: any) => {
        const m    = new Date(s.created_at).getMonth()
        const yr   = new Date(s.created_at).getFullYear()
        const diff = (now.getFullYear() - yr) * 12 + (now.getMonth() - m)
        const idx  = 5 - diff
        if (idx >= 0 && idx < 6) revBuckets[idx] += (s.total_amount || 0)
      })

    // ── 12. Casting calls by project_type ──
    const { data: ccData } = await supabase
      .from('casting_calls')
      .select('project_type, category')

    const catColors = ['#8B5CF6','#3B82F6','#14B8A6','#F97316','#EF4444','#22C55E','#D4A64A','#EC4899']
    const catMap: Record<string,number> = {}
    ;(ccData || []).forEach((cc: any) => {
      const key = cc.project_type || cc.category || 'Other'
      catMap[key] = (catMap[key] || 0) + 1
    })
    const catTotal = Object.values(catMap).reduce((a,b)=>a+b,0) || 1
    const castingByCategory = Object.entries(catMap)
      .sort((a,b)=>b[1]-a[1]).slice(0,8)
      .map(([label,value],i) => ({
        label, value,
        pct: parseFloat(((value/catTotal)*100).toFixed(1)),
        color: catColors[i % catColors.length],
      }))

    // ── 13. Users by country — aspirant_profiles has country ──
    const { data: aspCountry } = await supabase
      .from('aspirant_profiles')
      .select('country')

    const { data: agcCountry } = await supabase
      .from('agency_profiles')
      .select('country')

    const countryMap: Record<string,number> = {}
    ;[...(aspCountry||[]), ...(agcCountry||[])].forEach((r: any) => {
      const c = (r.country || '').trim()
      if (c) countryMap[c] = (countryMap[c] || 0) + 1
    })
    const countryTotal = Object.values(countryMap).reduce((a,b)=>a+b,0) || 1
    const usersByCountry = Object.entries(countryMap)
      .sort((a,b)=>b[1]-a[1]).slice(0,6)
      .map(([name,value]) => ({
        name, value,
        pct: parseFloat(((value/countryTotal)*100).toFixed(1)),
      }))

    // ── 14. Users by city ──
    const { data: aspCity } = await supabase
      .from('aspirant_profiles')
      .select('city')

    const { data: agcCity } = await supabase
      .from('agency_profiles')
      .select('city')

    const cityMap: Record<string,number> = {}
    ;[...(aspCity||[]), ...(agcCity||[])].forEach((r: any) => {
      const c = (r.city || '').trim()
      if (c) cityMap[c] = (cityMap[c] || 0) + 1
    })
    const cityTotal = Object.values(cityMap).reduce((a,b)=>a+b,0) || 1
    const usersByCity = Object.entries(cityMap)
      .sort((a,b)=>b[1]-a[1]).slice(0,6)
      .map(([name,value]) => ({
        name, value,
        pct: parseFloat(((value/cityTotal)*100).toFixed(1)),
      }))

    // ── 15. Month labels ──
    const monthLabels12 = Array.from({length:12},(_,i) => monthLabel(i-11))
    const monthLabels6  = Array.from({length:6}, (_,i) => monthLabel(i-5))

    return NextResponse.json({
      stats: {
        totalUsers:        totalProfiles  || 0,
        aspirants:         aspirantCount  || 0,
        agencies:          agencyCount    || 0,
        activeUsers:       activeCount    || 0,
        newRegistrations:  newThisMonth   || 0,
        emailVerified:     emailVerified  || 0,
        aspApproved:       aspApproved    || 0,
        aspPending:        aspPending     || 0,
        agcApproved:       agcApproved    || 0,
        agcPending:        agcPending     || 0,
        totalCastings:     totalCastings  || 0,
        activeCastings:    activeCastings || 0,
        draftCastings:     draftCastings  || 0,
        closedCastings:    closedCastings || 0,
        totalApplications: totalApplications || 0,
        applicationsToday: appsToday     || 0,
        shortlisted:       shortlisted   || 0,
        rejected:          rejected      || 0,
        totalAuditions:    totalAuditions || 0,
        auditionsToday:    auditionsToday || 0,
        messagesToday:     msgsToday     || 0,
        totalRevenue,
        aspirantRevenue:   aspirantRev,
        agencyRevenue:     agencyRev,
        activeSubscriptions: activeSubs,
      },
      castingByCategory,
      usersByCountry,
      usersByCity,
      revenueMonthly:  revBuckets,
      appsTrend:       appsBuckets,
      growthTotal,
      growthActive,
      monthLabels12,
      monthLabels6,
    })
  } catch (err: any) {
    console.error('Analytics API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}