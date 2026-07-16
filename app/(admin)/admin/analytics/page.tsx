'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Database,
  Settings, ScrollText, Bell, ChevronRight, ChevronLeft,
  Menu, ChevronDown, MessageSquare, UserCheck, BellRing,
  Ticket, KeyRound, TrendingUp, TrendingDown, Download,
  Calendar, RefreshCw, Activity, Globe, Smartphone,
  Monitor, Tablet, ArrowUpRight,
} from 'lucide-react'

/* ─── Design tokens ─────────────────────────────────────────── */
const BG       = '#0D1117'
const BG2      = '#131720'
const BG3      = '#181E2A'
const BG4      = '#1C2338'
const GOLD     = '#D4A64A'
const GOLD_DIM = 'rgba(212,166,74,0.12)'
const GOLD_BDR = 'rgba(212,166,74,0.22)'
const BEBAS    = "'Bebas Neue', sans-serif"
const BARLOW   = "'Barlow Condensed', sans-serif"
const GREEN    = '#22C55E'
const RED      = '#EF4444'
const BLUE     = '#3B82F6'
const PURPLE   = '#8B5CF6'
const ORANGE   = '#F97316'
const TEAL     = '#14B8A6'

/* ─── Sidebar ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'           },
  { icon: Users,           label: 'User Management',          href: '/admin/users'               },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification' },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification' },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'        },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'             },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'               },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'       },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'      },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                 },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'       },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics', active: true },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'             },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'               },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'               },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'            },
]

const PROFILE_MENU = [
  { label: 'My Profile',               href: '/admin/profile'       },
  { label: 'Account Settings',         href: '/admin/settings'      },
  { label: 'Security Settings',        href: '/admin/settings'      },
  { label: 'Notification Preferences', href: '/admin/notifications' },
  { label: 'Activity Logs',            href: '/admin/audit'         },
  { label: 'Help & Support',           href: '/contact'             },
  { label: 'Logout',                   href: '/login'               },
]

/* ─── Chart helpers ──────────────────────────────────────────── */
// Generate a smooth SVG polyline from data points
function sparkline(data: number[], w: number, h: number, color: string, fill = false) {
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 8) - 4
    return `${x},${y}`
  })
  const polyline = `M ${pts.join(' L ')}`
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      {fill && (
        <path d={`${polyline} L ${w},${h} L 0,${h} Z`} fill={`${color}18`} />
      )}
      <path d={polyline} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle cx={pts[pts.length-1].split(',')[0]} cy={pts[pts.length-1].split(',')[1]} r={3} fill={color} />
    </svg>
  )
}

// Donut chart segment
function Donut({ data, size = 120, thickness = 18 }: { data: { value: number; color: string }[]; size?: number; thickness?: number }) {
  const cx = size / 2, cy = size / 2, r = (size - thickness) / 2
  const total = data.reduce((s, d) => s + d.value, 0)
  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (a: number) => [cx + r * Math.cos(toRad(a)), cy + r * Math.sin(toRad(a))]
  let start = -90
  const arcs = data.map(seg => {
    const sweep = (seg.value / total) * 358
    const end = start + sweep
    const large = sweep > 180 ? 1 : 0
    const [x1, y1] = pt(start); const [x2, y2] = pt(end)
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
    start = end + 2
    return { ...seg, d }
  })
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={thickness} />
      {arcs.map((a, i) => (
        <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={thickness} strokeLinecap="round" />
      ))}
    </svg>
  )
}

// Health score arc
function HealthArc({ score }: { score: number }) {
  const r = 70, cx = 90, cy = 90
  const startAngle = -210, endAngle = 30
  const range = endAngle - startAngle
  const scoreAngle = startAngle + (score / 100) * range
  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (a: number) => [cx + r * Math.cos(toRad(a)), cy + r * Math.sin(toRad(a))]
  const [sx, sy] = pt(startAngle); const [ex, ey] = pt(scoreAngle)
  const [bx, by] = pt(startAngle); const [b2x, b2y] = pt(endAngle)
  const bgArc = `M ${bx} ${by} A ${r} ${r} 0 1 1 ${b2x} ${b2y}`
  const fgArc = `M ${sx} ${sy} A ${r} ${r} 0 ${(score / 100) * range > 180 ? 1 : 0} 1 ${ex} ${ey}`
  const color = score >= 80 ? GREEN : score >= 60 ? ORANGE : RED
  return (
    <svg width={180} height={110} style={{ overflow: 'visible' }}>
      <path d={bgArc} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={12} strokeLinecap="round" />
      <path d={fgArc} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#F5F5F5" fontSize={28} fontWeight={800} fontFamily={BEBAS}>{score}%</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill={color} fontSize={14} fontFamily={BARLOW} fontWeight={700}>Excellent</text>
    </svg>
  )
}

/* ─── Data ───────────────────────────────────────────────────── */
// Growth chart: 31 data points (25 May → 24 Jun)
const GROWTH_TOTAL  = [2100,2300,2500,2700,2900,3200,3600,4000,4400,4900,5400,5900,6500,7000,7600,8200,8900,9500,10200,10800,11400,11900,12100,12200,12300,12350,12380,12400,12420,12440,12458]
const GROWTH_ACTIVE = [600,650,700,760,820,900,1000,1100,1200,1350,1500,1650,1800,2000,2200,2400,2600,2800,3100,3400,3700,4000,4400,4800,5200,5600,5900,6200,6500,6650,6782]
const X_LABELS = ['25 May','1 Jun','8 Jun','15 Jun','22 Jun','24 Jun']

// Applications trend
const APP_TREND = [520,540,580,620,680,740,800,860,900,940,980,1040,1100,1180,1260,1340,1440,1540,1640,1750,1860,1980,2100,2200,2300,2450,2600,2750,2950,3300,3842]

// Revenue trend (in lakhs)
const REV_TREND = [8,8.5,9,9.5,10,10.5,11,11.5,12,12.5,13,13.2,13.5,13.8,14,14.2,14.5,14.8,15,15.5,16,16.5,17,17.5,18,18.2,18.3,18.35,18.4,18.43,18.4532]

const TOP_CATEGORIES = [
  { label: 'Feature Film',    value: 1248, pct: 32.6, color: PURPLE },
  { label: 'Web Series',      value: 1032, pct: 27.0, color: BLUE   },
  { label: 'Short Film',      value:  642, pct: 16.8, color: TEAL   },
  { label: 'Commercial Ads',  value:  542, pct: 14.2, color: ORANGE },
  { label: 'Music Video',     value:  364, pct:  9.4, color: GREEN  },
]

const COUNTRIES = [
  { name: 'India',     value: 10248, pct: 82.2 },
  { name: 'USA',       value:   632, pct:  5.1 },
  { name: 'UK',        value:   412, pct:  3.3 },
  { name: 'Canada',    value:   287, pct:  2.3 },
  { name: 'Australia', value:   196, pct:  1.6 },
  { name: 'Others',    value:   683, pct:  5.5 },
]

const TOP_CITIES = [
  { name: 'Mumbai',    value: 2184, pct: 17.5 },
  { name: 'Delhi',     value: 1642, pct: 13.2 },
  { name: 'Bangalore', value: 1128, pct:  9.1 },
  { name: 'Hyderabad', value:  846, pct:  6.8 },
  { name: 'Pune',      value:  712, pct:  5.7 },
]

const DEVICES = [
  { icon: '📱', label: 'Mobile',  value: 7824, pct: 62.8, color: BLUE   },
  { icon: '🖥️', label: 'Desktop', value: 4126, pct: 33.1, color: PURPLE },
  { icon: '📟', label: 'Tablet',  value:  508, pct:  4.1, color: TEAL   },
]

const INSIGHTS = [
  { icon: '📈', color: GREEN,  title: 'Applications increased by ↑18% this month.', sub: 'High demand for Web Series roles.' },
  { icon: '🏙️', color: BLUE,   title: 'Mumbai has the highest user growth.',        sub: '↑ 24.5% more users this month.'   },
  { icon: '📅', color: ORANGE, title: 'Agencies are more active on weekdays.',       sub: 'Peak activity: Tue – Thu.'        },
]

const HEALTH_METRICS = [
  { label: 'User Engagement',   value: 92, color: GREEN  },
  { label: 'Casting Activity',  value: 85, color: GREEN  },
  { label: 'Profile Completion',value: 88, color: GREEN  },
  { label: 'Response Rate',     value: 82, color: GREEN  },
]

/* ─── Sub-components ─────────────────────────────────────────── */
function StatCard({ icon, label, value, change, sub, color }: { icon: string; label: string; value: string; change: string; sub: string; color: string }) {
  const up = change.startsWith('+') || change.startsWith('↑')
  return (
    <div style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
        <span style={{ fontFamily: BEBAS, fontSize: 26, color: '#F5F5F5', letterSpacing: 0.5 }}>{value}</span>
        <span style={{ fontSize: 13, color: up ? GREEN : RED, fontWeight: 700 }}>{up ? '↑' : '↓'} {change.replace(/[↑↓+\-]/g,'')}</span>
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{sub}</div>
    </div>
  )
}

function SectionHeader({ title, control }: { title: string; control?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5' }}>{title}</div>
      {control}
    </div>
  )
}

function PeriodSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 13, padding: '4px 22px 4px 8px', outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '9px' }}>
      {['Last 30 Days','Last 7 Days','This Month','Last 3 Months','This Year'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
    </select>
  )
}

// Simple SVG line chart
function LineChart({ datasets, labels, height = 120, w = 600 }: { datasets: { data: number[]; color: string; label: string }[]; labels: string[]; height?: number; w?: number }) {
  const allVals = datasets.flatMap(d => d.data)
  const min = Math.min(...allVals), max = Math.max(...allVals)
  const range = max - min || 1
  const pad = { t: 10, b: 24, l: 36, r: 10 }
  const cw = w - pad.l - pad.r, ch = height - pad.t - pad.b
  const n = datasets[0].data.length

  const toX = (i: number) => pad.l + (i / (n - 1)) * cw
  const toY = (v: number) => pad.t + ch - ((v - min) / range) * ch

  const yTicks = 5
  const yStep = (max - min) / (yTicks - 1)

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      {/* Grid lines */}
      {Array.from({ length: yTicks }, (_, i) => {
        const v = min + i * yStep
        const y = toY(v)
        const label = v >= 10000 ? `${(v/1000).toFixed(0)}K` : v >= 1000 ? `${(v/1000).toFixed(1)}K` : `${Math.round(v)}`
        return (
          <g key={i}>
            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={pad.l - 4} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily={BARLOW}>{label}</text>
          </g>
        )
      })}

      {/* X labels */}
      {labels.map((l, i) => {
        const x = pad.l + (i / (labels.length - 1)) * cw
        return <text key={i} x={x} y={height - 4} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily={BARLOW}>{l}</text>
      })}

      {/* Lines */}
      {datasets.map((ds, di) => {
        const pts = ds.data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
        const fillPts = `${pad.l},${pad.t + ch} ${pts} ${toX(ds.data.length-1)},${pad.t + ch}`
        return (
          <g key={di}>
            <polygon points={fillPts} fill={`${ds.color}15`} />
            <polyline points={pts} fill="none" stroke={ds.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {/* End label */}
            <rect x={toX(ds.data.length-1) - 24} y={toY(ds.data[ds.data.length-1]) - 16} width={48} height={16} rx={4} fill={ds.color} />
            <text x={toX(ds.data.length-1)} y={toY(ds.data[ds.data.length-1]) - 4} textAnchor="middle" fill="#fff" fontSize={10} fontFamily={BARLOW} fontWeight={700}>
              {ds.data[ds.data.length-1] >= 1000 ? `${(ds.data[ds.data.length-1]/1000).toFixed(1)}K`.replace('.0K','K') : ds.data[ds.data.length-1]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function AnalyticsReportsPage() {
  const router = useRouter()
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const [dateRange,    setDateRange]    = useState('01 Jun 2026 – 24 Jun 2026')
  const [growthPeriod, setGrowthPeriod] = useState('Last 30 Days')
  const [castPeriod,   setCastPeriod]   = useState('Last 30 Days')
  const [revPeriod,    setRevPeriod]    = useState('Last 30 Days')
  const [engPeriod,    setEngPeriod]    = useState('This Month')
  const [countryPeriod,setCountryPeriod]= useState('This Month')
  const [catFilter,    setCatFilter]    = useState('By Applications')
  const [liveCount,    setLiveCount]    = useState(184)

  // Simulate live count fluctuation
  useEffect(() => {
    const t = setInterval(() => setLiveCount(v => v + Math.floor(Math.random() * 5) - 2), 3000)
    return () => clearInterval(t)
  }, [])

  const SB_W = sidebarOpen ? 220 : 52

  const card: React.CSSProperties = { background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 18 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN</span>
        </div>
        <div style={{ flex: 1 }} />

        {/* Date range display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer' }}
          onClick={() => alert('Date range picker — select custom date ranges for analytics.')}>
          <Calendar size={14} color={GOLD} />
          <span style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{dateRange}</span>
        </div>

        {/* Export */}
        <button onClick={() => alert('Exporting report as PDF/Excel — feature coming soon.')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', background: 'transparent', border: `1px solid ${GOLD}`, borderRadius: 8, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          <Download size={14} /> Export Report
        </button>

        {/* Bell */}
        <div onClick={() => router.push('/admin/notifications')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={15} color="rgba(255,255,255,0.7)" /></div>
          <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>12</div>
        </div>

        {/* Avatar */}
        <div style={{ position: 'relative' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(212,166,74,0.38)', flexShrink: 0 }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>Super Admin</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed' as const, inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute' as const, top: 46, right: 0, width: 210, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Admin ID</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: RED }}>ADM000001</span>
                </div>
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false) }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{label}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const, overflowX: 'hidden', transition: 'width 0.2s ease', scrollbarWidth: 'none' as const }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(212,166,74,0.25)', flexShrink: 0 }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap' as const }}>Super Admin</div>
                <div style={{ fontSize: 13, color: RED, fontWeight: 600 }}>ADM000001</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto' as const, scrollbarWidth: 'none' as const }}>
            {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? GOLD_DIM : 'transparent', border: active && sidebarOpen ? `1px solid ${GOLD_BDR}` : '1px solid transparent', borderLeft: sidebarOpen && active ? `3px solid ${GOLD}` : sidebarOpen ? '3px solid transparent' : 'none', gap: sidebarOpen ? 9 : 0 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? GOLD_DIM : 'transparent' }}
              >
                <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                {sidebarOpen && <span style={{ fontSize: 14, color: active ? GOLD : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' as const, flex: 1 }}>{label}</span>}
                {sidebarOpen && active && <ChevronRight size={12} color={GOLD} opacity={0.6} />}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── MAIN SCROLL ── */}
        <div style={{ flex: 1, overflowY: 'auto' as const, padding: '18px 20px 32px' }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >Home</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Analytics & Reports</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                Analytics & Reports
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, display: 'inline-block', marginBottom: 4 }} />
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>Comprehensive insights and data analytics across the platform.</p>
            </div>
          </div>

          {/* 2-column layout: main content + right panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}>

            {/* ── LEFT (main) ── */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

              {/* Row 1: 6 KPI stat cards */}
              <div style={{ display: 'flex', gap: 10 }}>
                <StatCard icon="👥" label="Total Users"         value="12,458" change="+18.6%" sub="vs May 2026" color={BLUE}   />
                <StatCard icon="🟢" label="Active Users"        value="6,782"  change="+15.3%" sub="vs May 2026" color={GREEN}  />
                <StatCard icon="➕" label="New Registrations"   value="1,842"  change="+22.1%" sub="vs May 2026" color={TEAL}   />
                <StatCard icon="⭐" label="Verified Talents"    value="8,942"  change="+19.4%" sub="vs May 2026" color={PURPLE} />
                <StatCard icon="🏢" label="Verified Agencies"   value="156"    change="+12.5%" sub="vs May 2026" color={ORANGE} />
                <StatCard icon="🎬" label="Active Casting Calls" value="362"   change="+14.8%" sub="vs May 2026" color={GOLD}   />
              </div>

              {/* Row 2: User Growth + Distribution + Countries */}
              <div style={{ display: 'grid', gridTemplateColumns: '2.6fr 1fr 1.2fr', gap: 12 }}>

                {/* User Growth line chart */}
                <div style={card}>
                  <SectionHeader title="User Growth Overview" control={<PeriodSelect value={growthPeriod} onChange={setGrowthPeriod} />} />
                  <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 20, height: 2, background: GOLD, borderRadius: 1 }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Total Users</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 20, height: 2, background: GREEN, borderRadius: 1 }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Active Users</span>
                    </div>
                  </div>
                  <LineChart
                    datasets={[
                      { data: GROWTH_TOTAL,  color: GOLD,  label: 'Total Users'  },
                      { data: GROWTH_ACTIVE, color: GREEN, label: 'Active Users' },
                    ]}
                    labels={X_LABELS}
                    height={170}
                    w={560}
                  />
                </div>

                {/* User Distribution donut */}
                <div style={{ ...card, display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }}>
                  <SectionHeader title="User Distribution" />
                  <div style={{ position: 'relative' as const, marginBottom: 10 }}>
                    <Donut data={[
                      { value: 82.2, color: GOLD   },
                      { value: 15.9, color: PURPLE },
                      { value: 1.9,  color: BLUE   },
                    ]} size={120} thickness={16} />
                    <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', lineHeight: 1 }}>12,458</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Total Users</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontFamily: BEBAS, color: GOLD, marginBottom: 4 }}>82.2%</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Aspirants</div>
                  {[
                    { label: 'Aspirants', value: '10,248 (82.2%)', color: GOLD   },
                    { label: 'Agencies',  value: '1,984 (15.9%)',  color: PURPLE },
                    { label: 'Others',    value: '226 (1.9%)',     color: BLUE   },
                  ].map(d => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, width: '100%' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', flex: 1 }}>{d.label}</span>
                      <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>{d.value}</span>
                    </div>
                  ))}
                </div>

                {/* Users by Country */}
                <div style={card}>
                  <SectionHeader title="Users by Country" control={<PeriodSelect value={countryPeriod} onChange={setCountryPeriod} />} />
                  {COUNTRIES.map(c => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{c.name}</span>
                          <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>{c.value.toLocaleString()} ({c.pct}%)</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${c.pct}%`, background: GOLD, borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Casting Activity + Revenue Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>

                {/* Casting Activity */}
                <div style={card}>
                  <SectionHeader title="Casting Activity" control={<PeriodSelect value={castPeriod} onChange={setCastPeriod} />} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                    {[
                      { label: 'Total Casting Calls', value: '562',   change: '+16.2%' },
                      { label: 'Applications',         value: '3,842', change: '+21.8%' },
                      { label: 'Shortlisted',          value: '842',   change: '+18.4%' },
                      { label: 'Auditions Conducted',  value: '428',   change: '+14.6%' },
                    ].map(s => (
                      <div key={s.label} style={{ background: BG4, borderRadius: 8, padding: '14px 12px' }}>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 6, lineHeight: 1.3 }}>{s.label}</div>
                        <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#F5F5F5', lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: 14, color: GREEN, marginTop: 4 }}>↑ {s.change}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>vs May 2026</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Applications Trend</div>
                  <LineChart
                    datasets={[{ data: APP_TREND, color: PURPLE, label: 'Applications' }]}
                    labels={X_LABELS} height={140} w={460}
                  />
                </div>

                {/* Revenue Overview */}
                <div style={card}>
                  <SectionHeader title="Revenue Overview" control={<PeriodSelect value={revPeriod} onChange={setRevPeriod} />} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                    {[
                      { label: 'Total Revenue',    value: '₹18,45,320', change: '+16.7%' },
                      { label: 'Aspirant Revenue', value: '₹4,23,850',  change: '+13.2%' },
                      { label: 'Agency Revenue',   value: '₹14,21,470', change: '+18.1%' },
                    ].map(s => (
                      <div key={s.label} style={{ background: BG4, borderRadius: 8, padding: '14px 12px' }}>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 6, lineHeight: 1.3 }}>{s.label}</div>
                        <div style={{ fontFamily: BEBAS, fontSize: 22, color: GOLD, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: 14, color: GREEN, marginTop: 4 }}>↑ {s.change}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>vs May 2026</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Revenue Trend</div>
                  <LineChart
                    datasets={[{ data: REV_TREND, color: GOLD, label: 'Revenue' }]}
                    labels={X_LABELS} height={140} w={460}
                  />
                </div>
              </div>

              {/* Row 4: Top Cities + User Engagement + Popular Devices + Recent Insights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>

                {/* Top Cities */}
                <div style={card}>
                  <SectionHeader title="Top Cities (By Users)" />
                  {TOP_CITIES.map(c => (
                    <div key={c.name} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{c.name}</span>
                        <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>{c.value.toLocaleString()} ({c.pct}%)</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${(c.pct / 17.5) * 100}%`, background: GOLD, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* User Engagement donut */}
                <div style={{ ...card, display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }}>
                  <SectionHeader title="User Engagement" control={<PeriodSelect value={engPeriod} onChange={setEngPeriod} />} />
                  <div style={{ position: 'relative' as const, marginBottom: 10 }}>
                    <Donut data={[
                      { value: 42.1, color: GREEN  },
                      { value: 25.6, color: BLUE   },
                      { value: 20.1, color: ORANGE },
                      { value: 12.2, color: '#4B5563' },
                    ]} size={110} thickness={14} />
                    <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontFamily: BEBAS, fontSize: 22, color: '#F5F5F5', lineHeight: 1 }}>68%</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' as const }}>Engagement<br/>Rate</div>
                    </div>
                  </div>
                  {[
                    { label: 'Highly Engaged Users',  value: '5,248 (42.1%)', color: GREEN  },
                    { label: 'Moderately Engaged',    value: '3,184 (25.6%)', color: BLUE   },
                    { label: 'Low Engagement',        value: '2,506 (20.1%)', color: ORANGE },
                    { label: 'Inactive Users',         value: '1,520 (12.2%)', color: '#4B5563' },
                  ].map(d => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, width: '100%' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', flex: 1 }}>{d.label}</span>
                      <span style={{ fontSize: 12, color: '#F5F5F5' }}>{d.value}</span>
                    </div>
                  ))}
                </div>

                {/* Popular Devices */}
                <div style={card}>
                  <SectionHeader title="Popular Devices" />
                  {DEVICES.map(d => (
                    <div key={d.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontSize: 16 }}>{d.icon}</span>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{d.label}</span>
                        </div>
                        <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>{d.value.toLocaleString()} ({d.pct}%)</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Insights */}
                <div style={card}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5' }}>Recent Insights</div>
                    <span onClick={() => alert('Full insights report — coming soon.')} style={{ fontSize: 13, color: GOLD, cursor: 'pointer', fontWeight: 600 }}>View All</span>
                  </div>
                  {INSIGHTS.map((ins, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < INSIGHTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ins.color}20`, border: `1px solid ${ins.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{ins.icon}</div>
                      <div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4, marginBottom: 2 }}>{ins.title}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{ins.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

              {/* Platform Health Score */}
              <div style={{ ...card, textAlign: 'center' as const }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 12 }}>Platform Health Score</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <HealthArc score={89} />
                </div>
                {HEALTH_METRICS.map(m => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{m.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 60, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${m.value}%`, background: m.color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 14, color: GREEN, fontWeight: 700, minWidth: 28 }}>{m.value}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Performing Categories */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5' }}>Top Performing Categories</div>
                  <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 12, padding: '3px 18px 3px 6px', outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '9px' }}>
                    {['By Applications','By Revenue','By Users'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                  </select>
                </div>
                {TOP_CATEGORIES.map((c, i) => (
                  <div key={c.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{c.label}</span>
                      </div>
                      <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>{c.value.toLocaleString()} ({c.pct}%)</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Real-time Overview */}
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5' }}>Real-time Overview</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN, animation: 'pulse 2s infinite' }} />
                    <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>Live</span>
                  </div>
                </div>
                {[
                  { icon: '👥', label: 'Users Online',         value: liveCount, color: GREEN  },
                  { icon: '🎬', label: 'Active Casting Calls', value: 62,        color: BLUE   },
                  { icon: '📋', label: 'Applications Today',   value: 248,       color: PURPLE },
                  { icon: '💬', label: 'Messages Today',       value: 596,       color: TEAL   },
                  { icon: '📅', label: 'Auditions Scheduled',  value: 32,        color: ORANGE },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 6, background: `${r.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{r.icon}</div>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{r.label}</span>
                    </div>
                    <span style={{ fontFamily: BEBAS, fontSize: 18, color: '#F5F5F5', letterSpacing: 0.5 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center' as const, marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
            © 2026 SilverScreens. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}