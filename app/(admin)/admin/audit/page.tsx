'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Database,
  Settings, ScrollText, Bell, ChevronRight, ChevronLeft,
  Menu, ChevronDown, UserCheck, BellRing, Ticket, KeyRound,
  Download, Filter, Activity, Search, Calendar, ChevronUp,
  RefreshCw,
} from 'lucide-react'

/* ─── Design tokens ──────────────────────────────────────────── */
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
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'           },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'             },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit', active: true },
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

/* ─── Module badge colors ────────────────────────────────────── */
const MODULE_COLORS: Record<string, string> = {
  'Talent Verification': TEAL,
  'Media Moderation':    ORANGE,
  'Casting Calls':       GREEN,
  'Agency Verification': PURPLE,
  'Advertisements':      '#EC4899',
  'Authentication':      BLUE,
  'Applications':        GREEN,
  'Subscription Plans':  GOLD,
  'CMS Management':      PURPLE,
  'User Management':     BLUE,
  'Reports':             ORANGE,
  'System':              '#6B7280',
}

/* ─── Audit log data ─────────────────────────────────────────── */
const LOGS = [
  { ts: '24 Jun 2026\n11:42:18 AM', user: 'Rahul Sharma',  role: 'Super Admin',  action: 'Approved Talent Profile',    sub: 'Profile approved by admin',          module: 'Talent Verification', entityType: 'Talent Profile',   entityId: 'TAL-000812', ip: '103.21.45.67', status: 'Success' },
  { ts: '24 Jun 2026\n11:35:09 AM', user: 'Neha Verma',    role: 'Verifier',     action: 'Rejected Media',             sub: 'Video rejected',                     module: 'Media Moderation',    entityType: 'Media',            entityId: 'MED-001233', ip: '103.21.45.67', status: 'Failed'  },
  { ts: '24 Jun 2026\n11:28:44 AM', user: 'Amit Malhotra', role: 'Admin',        action: 'Created Casting Call',       sub: 'New casting call created',           module: 'Casting Calls',       entityType: 'Casting Call',     entityId: 'CC-000567',  ip: '192.168.1.12', status: 'Success' },
  { ts: '24 Jun 2026\n11:15:33 AM', user: 'Priya Singh',   role: 'Admin',        action: 'Updated Agency Status',      sub: 'Agency status changed to Verified',  module: 'Agency Verification', entityType: 'Agency',           entityId: 'AGY-000234', ip: '192.168.1.12', status: 'Success' },
  { ts: '24 Jun 2026\n10:59:07 AM', user: 'Rahul Sharma',  role: 'Super Admin',  action: 'Deleted Advertisement',      sub: 'Advertisement deleted',              module: 'Advertisements',      entityType: 'Advertisement',    entityId: 'AD-000345',  ip: '103.21.45.67', status: 'Success' },
  { ts: '24 Jun 2026\n10:44:22 AM', user: 'System',        role: 'System User',  action: 'User Login',                 sub: 'Successful login',                   module: 'Authentication',      entityType: 'User',             entityId: 'USR-000125', ip: '103.21.45.67', status: 'Success' },
  { ts: '24 Jun 2026\n10:32:11 AM', user: 'Neha Verma',    role: 'Verifier',     action: 'Shortlisted Applicant',      sub: 'Applicant added to shortlist',       module: 'Applications',        entityType: 'Application',      entityId: 'APP-001982', ip: '103.21.45.67', status: 'Success' },
  { ts: '24 Jun 2026\n10:21:54 AM', user: 'Amit Malhotra', role: 'Admin',        action: 'Updated Subscription Plan',  sub: 'Plan details updated',               module: 'Subscription Plans',  entityType: 'Subscription Plan', entityId: 'PLAN-00012', ip: '192.168.1.12', status: 'Success' },
  { ts: '24 Jun 2026\n10:10:31 AM', user: 'Priya Singh',   role: 'Admin',        action: 'Edited CMS Page',            sub: 'Page content updated',               module: 'CMS Management',      entityType: 'CMS Page',         entityId: 'PAGE-00045', ip: '192.168.1.12', status: 'Success' },
  { ts: '24 Jun 2026\n09:58:18 AM', user: 'Rahul Sharma',  role: 'Super Admin',  action: 'Changed User Role',          sub: 'User role updated',                  module: 'User Management',     entityType: 'User',             entityId: 'USR-000987', ip: '103.21.45.67', status: 'Success' },
  { ts: '24 Jun 2026\n09:45:07 AM', user: 'System',        role: 'System User',  action: 'Password Reset',             sub: 'Password reset email sent',          module: 'Authentication',      entityType: 'User',             entityId: 'USR-000654', ip: '103.21.45.67', status: 'Success' },
  { ts: '24 Jun 2026\n09:32:50 AM', user: 'Neha Verma',    role: 'Verifier',     action: 'Approved Media',             sub: 'Photo approved',                     module: 'Media Moderation',    entityType: 'Media',            entityId: 'MED-001201', ip: '103.21.45.67', status: 'Success' },
  { ts: '24 Jun 2026\n09:20:13 AM', user: 'Amit Malhotra', role: 'Admin',        action: 'Generated Report',           sub: 'Audit report generated',             module: 'Reports',             entityType: 'Audit Report',     entityId: 'RPT-00078',  ip: '192.168.1.12', status: 'Success' },
  { ts: '24 Jun 2026\n09:10:02 AM', user: 'Priya Singh',   role: 'Admin',        action: 'Login Failed',               sub: 'Invalid password attempt',           module: 'Authentication',      entityType: 'User',             entityId: 'USR-000888', ip: '192.168.1.12', status: 'Failed'  },
  { ts: '24 Jun 2026\n08:55:38 AM', user: 'System',        role: 'System User',  action: 'Database Backup',            sub: 'Scheduled backup completed',         module: 'System',              entityType: 'System',           entityId: 'BKP-000345', ip: '127.0.0.1',    status: 'Success' },
]

const TOP_USERS = [
  { name: 'Rahul Sharma',  role: 'Super Admin', count: 342, avatar: 'RS' },
  { name: 'Priya Singh',   role: 'Admin',       count: 287, avatar: 'PS' },
  { name: 'Amit Malhotra', role: 'Admin',       count: 221, avatar: 'AM' },
  { name: 'Neha Verma',    role: 'Verifier',    count: 198, avatar: 'NV' },
]

const MODULE_STATS = [
  { label: 'Authentication',      pct: 22, color: GREEN  },
  { label: 'User Management',     pct: 18, color: BLUE   },
  { label: 'Applications',        pct: 16, color: PURPLE },
  { label: 'Talent Verification', pct: 14, color: TEAL   },
  { label: 'Media Moderation',    pct: 12, color: ORANGE },
  { label: 'Others',              pct: 18, color: '#6B7280' },
]

// Activity overview: 7 days, success + failed
const ACTIVITY_SUCCESS = [280, 310, 295, 340, 320, 380, 360]
const ACTIVITY_FAILED  = [85,  95,  78,  110, 92,  105, 88 ]
const ACTIVITY_LABELS  = ['18 Jun','19 Jun','20 Jun','21 Jun','22 Jun','23 Jun','24 Jun']

/* ─── Activity mini chart ────────────────────────────────────── */
function ActivityChart() {
  const w = 248, h = 120
  const allVals = [...ACTIVITY_SUCCESS, ...ACTIVITY_FAILED]
  const max = Math.max(...allVals)
  const pad = { t: 10, b: 28, l: 32, r: 8 }
  const cw = w - pad.l - pad.r
  const ch = h - pad.t - pad.b
  const n = ACTIVITY_SUCCESS.length
  const toX = (i: number) => pad.l + (i / (n - 1)) * cw
  const toY = (v: number) => pad.t + ch - (v / max) * ch
  const pts = (data: number[]) => data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const yTicks = [0, 100, 200, 300, 400]

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {/* Y grid + labels */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={pad.l} y1={toY(v)} x2={w - pad.r} y2={toY(v)} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
          <text x={pad.l - 4} y={toY(v) + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize={10} fontFamily={BARLOW}>{v}</text>
        </g>
      ))}
      {/* X labels — date numbers only */}
      {ACTIVITY_LABELS.map((l, i) => (
        <text key={i} x={toX(i)} y={h - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={10} fontFamily={BARLOW}>
          {l.split(' ')[0]}
        </text>
      ))}
      {/* Success */}
      <polygon points={`${toX(0)},${toY(0)} ${pts(ACTIVITY_SUCCESS)} ${toX(n-1)},${toY(0)}`} fill={`${GREEN}18`} />
      <polyline points={pts(ACTIVITY_SUCCESS)} fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {ACTIVITY_SUCCESS.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill={GREEN} />)}
      {/* Failed */}
      <polygon points={`${toX(0)},${toY(0)} ${pts(ACTIVITY_FAILED)} ${toX(n-1)},${toY(0)}`} fill={`${RED}18`} />
      <polyline points={pts(ACTIVITY_FAILED)} fill="none" stroke={RED} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {ACTIVITY_FAILED.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill={RED} />)}
    </svg>
  )
}

/* ─── Module donut ───────────────────────────────────────────── */
function ModuleDonut() {
  const cx = 60, cy = 60, R = 48, r = 28
  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (a: number, rad: number) => [cx + rad * Math.cos(toRad(a)), cy + rad * Math.sin(toRad(a))]
  let start = -90
  const arcs = MODULE_STATS.map(seg => {
    const sweep = (seg.pct / 100) * 356
    const end = start + sweep
    const large = sweep > 180 ? 1 : 0
    const [x1, y1] = pt(start, R); const [x2, y2] = pt(end, R)
    const [x3, y3] = pt(end, r);   const [x4, y4] = pt(start, r)
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`
    start = end + 1.5
    return { ...seg, d }
  })
  return (
    <div style={{ position: 'relative' as const, width: 120, height: 120, flexShrink: 0 }}>
      <svg width="120" height="120">
        <circle cx={cx} cy={cy} r={r - 1} fill={BG3} />
        {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} />)}
      </svg>
      <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', lineHeight: 1 }}>1,248</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Total</div>
      </div>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function AuditLogsPage() {
  const router = useRouter()
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [profileOpen,   setProfileOpen]   = useState(false)
  const [search,        setSearch]        = useState('')
  const [userFilter,    setUserFilter]    = useState('All Users')
  const [actionFilter,  setActionFilter]  = useState('All Actions')
  const [moduleFilter,  setModuleFilter]  = useState('All Modules')
  const [statusFilter,  setStatusFilter]  = useState('All Status')
  const [page,          setPage]          = useState(1)
  const [sortTs,        setSortTs]        = useState<'asc'|'desc'>('desc')
  const [sortUser,      setSortUser]      = useState<'asc'|'desc'|null>(null)
  const [summaryPeriod, setSummaryPeriod] = useState('This Month')
  const [topUserPeriod, setTopUserPeriod] = useState('This Month')
  const [activityPeriod,setActivityPeriod]= useState('Last 7 Days')

  const SB_W   = sidebarOpen ? 220 : 52
  const PER_PG = 15

  const filtered = LOGS.filter(l => {
    const matchS  = search === '' || l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.entityId.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search)
    const matchU  = userFilter   === 'All Users'   || l.user   === userFilter
    const matchA  = actionFilter === 'All Actions'  || l.module === actionFilter
    const matchM  = moduleFilter === 'All Modules'  || l.module === moduleFilter
    const matchSt = statusFilter === 'All Status'   || l.status === statusFilter
    return matchS && matchU && matchA && matchM && matchSt
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortUser) return sortUser === 'asc' ? a.user.localeCompare(b.user) : b.user.localeCompare(a.user)
    return sortTs === 'desc' ? 0 : -1
  })

  const paginated  = sorted.slice((page - 1) * PER_PG, page * PER_PG)
  const totalPages = Math.ceil(sorted.length / PER_PG)

  const selStyle: React.CSSProperties = {
    background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '7px 26px 7px 10px',
    outline: 'none', cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '10px',
  }

  const periodSel: React.CSSProperties = { ...selStyle, fontSize: 12, padding: '4px 20px 4px 8px', background: BG4 }

  const SortBtn = ({ active, dir, onClick }: { active: boolean; dir: 'asc'|'desc'; onClick: () => void }) => (
    <span onClick={onClick} style={{ cursor: 'pointer', opacity: active ? 1 : 0.4, marginLeft: 3, display: 'inline-flex', alignItems: 'center' }}>
      {dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
    </span>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN</span>
        </div>
        <div style={{ flex: 1 }} />

        {/* Top action buttons */}
        <button onClick={() => alert('Exporting audit logs as CSV — coming soon.')}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: `1px solid ${GOLD}`, borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          <Download size={14} /> Export Logs
        </button>
        <button onClick={() => alert('Advanced filters panel — coming soon.')}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
          <Filter size={14} /> Filters
        </button>
        <button onClick={() => alert('Real-time monitor — shows live activity stream. Coming soon.')}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: GOLD, border: 'none', borderRadius: 7, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${GOLD}40` }}>
          <Activity size={14} /> Real-time Monitor
        </button>

        {/* Bell */}
        <div onClick={() => router.push('/admin/notifications')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={15} color="rgba(255,255,255,0.7)" /></div>
          <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>12</div>
        </div>

        {/* Avatar */}
        <div style={{ position: 'relative' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(212,166,74,0.38)', flexShrink: 0 }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Super Admin</span>
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

        {/* ── MAIN ── */}
        <div style={{ flex: 1, overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const }}>

          {/* Page header */}
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: '0 0 3px', color: GOLD, display: 'flex', alignItems: 'center', gap: 8 }}>
              Audit Logs
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Track all system activities, changes and access across the platform.</p>
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 0, flex: 1, overflow: 'hidden' }}>

            {/* LEFT — filters + table */}
            <div style={{ overflowY: 'auto' as const, padding: '14px 20px 28px', display: 'flex', flexDirection: 'column' as const, gap: 12 }}>

              {/* Filters row */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
                {/* Search */}
                <div style={{ position: 'relative' as const, flex: 1, minWidth: 220 }}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Search by user, action, entity or IP address..."
                    style={{ width: '100%', padding: '7px 10px 7px 28px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
                <select value={userFilter} onChange={e => { setUserFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Users','Rahul Sharma','Neha Verma','Amit Malhotra','Priya Singh','System'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Actions','Authentication','User Management','Talent Verification','Agency Verification','Applications','CMS Management','Advertisements','Subscription Plans','Reports','System'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={moduleFilter} onChange={e => { setModuleFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Modules','Talent Verification','Media Moderation','Casting Calls','Agency Verification','Advertisements','Authentication','Applications','Subscription Plans','CMS Management','User Management','Reports','System'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                {/* Date range */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' as const }}
                  onClick={() => alert('Date range picker — select custom date ranges.')}>
                  <Calendar size={13} color={GOLD} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>01 Jun 2026 – 24 Jun 2026</span>
                </div>
                <button onClick={() => alert('More filter options — coming soon.')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                  <Filter size={12} /> More Filters
                </button>
              </div>

              {/* Table */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1.8fr 1.2fr 1fr 1fr 1fr 0.8fr', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2, alignItems: 'center' }}>
                  {[
                    { label: 'TIMESTAMP', sort: 'ts' },
                    { label: 'USER',      sort: 'user' },
                    { label: 'ACTION',    sort: null },
                    { label: 'MODULE',    sort: null },
                    { label: 'ENTITY TYPE', sort: null },
                    { label: 'ENTITY ID',   sort: null },
                    { label: 'IP ADDRESS',  sort: null },
                    { label: 'STATUS',      sort: null },
                  ].map(h => (
                    <div key={h.label} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3, userSelect: 'none' as const, cursor: h.sort ? 'pointer' : 'default' }}
                      onClick={() => {
                        if (h.sort === 'ts')   setSortTs(v => v === 'asc' ? 'desc' : 'asc')
                        if (h.sort === 'user') setSortUser(v => v === 'asc' ? 'desc' : 'asc')
                      }}
                    >
                      {h.label}
                      {h.sort === 'ts' && (
                        <>
                          <SortBtn active={sortTs === 'asc'}  dir="asc"  onClick={() => setSortTs('asc')}  />
                          <SortBtn active={sortTs === 'desc'} dir="desc" onClick={() => setSortTs('desc')} />
                        </>
                      )}
                      {h.sort === 'user' && (
                        <>
                          <SortBtn active={sortUser === 'asc'}  dir="asc"  onClick={() => setSortUser('asc')}  />
                          <SortBtn active={sortUser === 'desc'} dir="desc" onClick={() => setSortUser('desc')} />
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {paginated.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center' as const, fontSize: 15, color: 'rgba(255,255,255,0.3)' }}>No logs match your filters.</div>
                ) : paginated.map((log, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1.8fr 1.2fr 1fr 1fr 1fr 0.8fr', padding: '10px 14px', borderBottom: i < paginated.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => alert(`Log Details\n\nTimestamp: ${log.ts.replace('\n',' ')}\nUser: ${log.user} (${log.role})\nAction: ${log.action}\nDescription: ${log.sub}\nModule: ${log.module}\nEntity Type: ${log.entityType}\nEntity ID: ${log.entityId}\nIP Address: ${log.ip}\nStatus: ${log.status}`)}
                  >
                    {/* Timestamp */}
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' as const, lineHeight: 1.4 }}>{log.ts}</div>

                    {/* User */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${BLUE}25`, border: `1px solid ${BLUE}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                        {log.user === 'System' ? '⚙' : log.user.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{log.user}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{log.role}</div>
                      </div>
                    </div>

                    {/* Action */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{log.action}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{log.sub}</div>
                    </div>

                    {/* Module badge */}
                    <div>
                      <span style={{ padding: '3px 9px', background: `${MODULE_COLORS[log.module] || BLUE}22`, border: `1px solid ${MODULE_COLORS[log.module] || BLUE}44`, borderRadius: 12, fontSize: 12, color: MODULE_COLORS[log.module] || BLUE, fontWeight: 600, whiteSpace: 'nowrap' as const }}>{log.module}</span>
                    </div>

                    {/* Entity Type */}
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{log.entityType}</div>

                    {/* Entity ID */}
                    <div style={{ fontSize: 13, color: GOLD, fontWeight: 600, fontFamily: 'monospace' }}>{log.entityId}</div>

                    {/* IP */}
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{log.ip}</div>

                    {/* Status */}
                    <div>
                      <span style={{ padding: '3px 9px', background: log.status === 'Success' ? `${GREEN}20` : `${RED}20`, border: `1px solid ${log.status === 'Success' ? GREEN : RED}44`, borderRadius: 12, fontSize: 13, color: log.status === 'Success' ? GREEN : RED, fontWeight: 600 }}>{log.status}</span>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div style={{ padding: '11px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: BG2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                    Showing 1 to {Math.min(PER_PG, sorted.length)} of 1,248 logs
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <button onClick={() => setPage(1)} disabled={page === 1}
                      style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 14 }}>‹</button>
                    {[1, 2, 3].map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        style={{ width: 30, height: 30, background: p === page ? GOLD : 'transparent', border: `1px solid ${p === page ? GOLD : 'rgba(255,255,255,0.12)'}`, borderRadius: 6, color: p === page ? '#000' : '#F5F5F5', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14, fontWeight: p === page ? 700 : 400 }}>{p}</button>
                    ))}
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', padding: '0 2px' }}>…</span>
                    <button onClick={() => setPage(84)}
                      style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#F5F5F5', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14 }}>84</button>
                    <button onClick={() => setPage(p => Math.min(84, p + 1))}
                      style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#F5F5F5', cursor: 'pointer', fontSize: 14 }}>›</button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ overflowY: 'auto' as const, padding: '14px 16px 28px', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

              {/* Log Summary */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>LOG SUMMARY</div>
                  <select value={summaryPeriod} onChange={e => setSummaryPeriod(e.target.value)} style={periodSel}>
                    {['This Month','Last 7 Days','Last 30 Days','This Year'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { icon: '📋', label: 'Total Logs',    value: '1,248', color: BLUE  },
                    { icon: '✅', label: 'Successful',     value: '1,102', color: GREEN },
                    { icon: '❌', label: 'Failed',         value: '112',   color: RED   },
                    { icon: '👥', label: 'Unique Users',  value: '34',    color: PURPLE},
                  ].map(s => (
                    <div key={s.value} style={{ background: BG4, borderRadius: 10, padding: '14px 12px', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                      {/* Icon top-left */}
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}22`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                      {/* Label + value bottom */}
                      <div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3, marginBottom: 3, whiteSpace: 'nowrap' as const }}>{s.label}</div>
                        <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#F5F5F5', lineHeight: 1, letterSpacing: 0.5 }}>{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logs by Module */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 14 }}>LOGS BY MODULE</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 12 }}>
                  <ModuleDonut />
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column' as const, gap: 7 }}>
                    {MODULE_STATS.map(m => (
                      <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 9, height: 9, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', flex: 1 }}>{m.label}</span>
                        <span style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 700 }}>{m.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Overview */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>ACTIVITY OVERVIEW</div>
                  <select value={activityPeriod} onChange={e => setActivityPeriod(e.target.value)} style={periodSel}>
                    {['Last 7 Days','Last 14 Days','Last 30 Days'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  {[{ label: 'Success', color: GREEN }, { label: 'Failed', color: RED }].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 16, height: 2, background: l.color, borderRadius: 1 }} />
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
                <ActivityChart />

              </div>

              {/* Top Performing Users */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>TOP PERFORMING USERS</div>
                  <select value={topUserPeriod} onChange={e => setTopUserPeriod(e.target.value)} style={periodSel}>
                    {['This Month','Last 7 Days','Last 30 Days'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                  </select>
                </div>
                {TOP_USERS.map((u, i) => (
                  <div key={i} onClick={() => router.push('/admin/users')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < TOP_USERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{u.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{u.name}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{u.role}</div>
                    </div>
                    <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', letterSpacing: 0.5 }}>{u.count}</div>
                  </div>
                ))}
                <button onClick={() => router.push('/admin/users')} style={{ width: '100%', marginTop: 12, padding: '10px', background: 'transparent', border: `1px solid ${GOLD}`, borderRadius: 8, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.3 }}
                  onMouseEnter={e => (e.currentTarget.style.background = GOLD_DIM)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >View All Users</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}