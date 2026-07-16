'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Database,
  Settings, ScrollText, Bell, ChevronRight, ChevronLeft,
  Menu, ChevronDown, MessageSquare, UserCheck, BellRing,
  Ticket, KeyRound, Eye, MoreVertical, Search, Filter,
  Download, HelpCircle, CheckCircle, Clock, XCircle,
  AlertCircle, Calendar, RefreshCw, TrendingUp,
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
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support', active: true },
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

/* ─── Ticket data ────────────────────────────────────────────── */
const TICKETS = [
  { id: 'TKT-2025-1248', subject: 'Unable to upload profile pictures',      user: 'Neha Iyer',           email: 'neha.iyer@email.com',           avatar: 'NI', category: 'Profile & Account',   priority: 'High',   status: 'Open',        channel: 'Web',       assignedTo: 'Rohit Verma',  createdOn: 'May 21, 2025\n11:32 AM' },
  { id: 'TKT-2025-1247', subject: 'Payment failed but amount deducted',     user: 'Arjun Malhotra',      email: 'arjun.m@mail.com',              avatar: 'AM', category: 'Payments',             priority: 'High',   status: 'In Progress', channel: 'Email',     assignedTo: 'Pooja Sharma', createdOn: 'May 21, 2025\n10:48 AM' },
  { id: 'TKT-2025-1246', subject: 'Agency verification status pending',     user: 'Dream Casting Agency', email: 'agency@dreamcast.com',          avatar: 'DC', category: 'Verifications',        priority: 'Medium', status: 'Open',        channel: 'Web',       assignedTo: 'Karan Mehta', createdOn: 'May 21, 2025\n09:15 AM' },
  { id: 'TKT-2025-1245', subject: 'Casting call not visible in my dashboard', user: 'Vikram Singh',      email: 'vikram.singh@mail.com',         avatar: 'VS', category: 'Casting & Auditions',  priority: 'Medium', status: 'In Progress', channel: 'App',       assignedTo: 'Neha Iyer',   createdOn: 'May 20, 2025\n08:22 PM' },
  { id: 'TKT-2025-1244', subject: 'Unable to reset password',               user: 'Simran Kaur',          email: 'simran.kaur@email.com',         avatar: 'SK', category: 'Login & Security',     priority: 'Low',    status: 'Resolved',    channel: 'Email',     assignedTo: 'Rohit Verma',  createdOn: 'May 20, 2025\n06:05 PM' },
  { id: 'TKT-2025-1243', subject: 'Refund not received yet',                user: 'Actor Zone',           email: 'actorzone@mail.com',            avatar: 'AZ', category: 'Payments',             priority: 'High',   status: 'Open',        channel: 'Web',       assignedTo: 'Pooja Sharma', createdOn: 'May 20, 2025\n04:12 PM' },
  { id: 'TKT-2025-1242', subject: 'How to update my agency documents?',     user: 'NextGen Studios',      email: 'support@nextgen.com',           avatar: 'NG', category: 'Verifications',        priority: 'Low',    status: 'Resolved',    channel: 'Live Chat', assignedTo: 'Karan Mehta', createdOn: 'May 20, 2025\n02:33 PM' },
  { id: 'TKT-2025-1241', subject: 'App is crashing on submission',          user: 'Pooja Verma',          email: 'pooja.verma@mail.com',          avatar: 'PV', category: 'Technical Issue',      priority: 'Medium', status: 'In Progress', channel: 'App',       assignedTo: 'Neha Iyer',   createdOn: 'May 20, 2025\n01:20 PM' },
  { id: 'TKT-2025-1240', subject: 'Profile not showing in search results',  user: 'Ravi Shankar',         email: 'ravi.s@email.com',              avatar: 'RS', category: 'Profile & Account',   priority: 'Medium', status: 'Open',        channel: 'Web',       assignedTo: 'Rohit Verma',  createdOn: 'May 19, 2025\n03:44 PM' },
  { id: 'TKT-2025-1239', subject: 'Subscription not activated after payment', user: 'Priya Nair',         email: 'priya.nair@mail.com',           avatar: 'PN', category: 'Payments',             priority: 'High',   status: 'In Progress', channel: 'Email',     assignedTo: 'Pooja Sharma', createdOn: 'May 19, 2025\n11:20 AM' },
  { id: 'TKT-2025-1238', subject: 'Messages not loading',                   user: 'Anjali Desai',         email: 'anjali.d@email.com',            avatar: 'AD', category: 'Technical Issue',      priority: 'Medium', status: 'Resolved',    channel: 'App',       assignedTo: 'Karan Mehta', createdOn: 'May 19, 2025\n09:15 AM' },
  { id: 'TKT-2025-1237', subject: 'Duplicate charges on subscription',      user: 'Kiran Rao',            email: 'kiran.rao@mail.com',            avatar: 'KR', category: 'Payments',             priority: 'High',   status: 'Closed',      channel: 'Email',     assignedTo: 'Rohit Verma',  createdOn: 'May 18, 2025\n04:30 PM' },
]

const PRIORITY_COLORS: Record<string, string> = { High: RED, Medium: ORANGE, Low: GREEN }
const STATUS_COLORS:   Record<string, string> = { Open: ORANGE, 'In Progress': BLUE, Resolved: GREEN, Closed: '#6B7280' }
const STATUS_BG:       Record<string, string> = { Open: 'rgba(249,115,22,0.15)', 'In Progress': 'rgba(59,130,246,0.15)', Resolved: 'rgba(34,197,94,0.15)', Closed: 'rgba(107,114,128,0.15)' }

const CHANNEL_COLORS: Record<string, string> = { Web: BLUE, Email: ORANGE, App: PURPLE, 'Live Chat': TEAL }

/* ─── Donut chart ────────────────────────────────────────────── */
function StatusDonut() {
  const data = [
    { value: 27.4, color: ORANGE },  // Open
    { value: 15.1, color: BLUE   },  // In Progress
    { value: 52.4, color: GREEN  },  // Resolved
    { value:  5.1, color: RED    },  // Closed
  ]
  const cx = 70, cy = 70, R = 58, r = 36
  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (a: number, rad: number) => [cx + rad * Math.cos(toRad(a)), cy + rad * Math.sin(toRad(a))]
  let start = -90
  const arcs = data.map(seg => {
    const sweep = (seg.value / 100) * 356
    const end = start + sweep
    const large = sweep > 180 ? 1 : 0
    const [x1, y1] = pt(start, R); const [x2, y2] = pt(end, R)
    const [x3, y3] = pt(end, r);   const [x4, y4] = pt(start, r)
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`
    start = end + 1.5
    return { ...seg, d }
  })
  return (
    <div style={{ position: 'relative' as const, width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140">
        <circle cx={cx} cy={cy} r={r - 1} fill={BG3} />
        {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} />)}
      </svg>
      <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#F5F5F5', lineHeight: 1 }}>1,248</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Total</div>
      </div>
    </div>
  )
}

export default function SupportTicketsPage() {
  const router = useRouter()
  const [sidebarOpen,    setSidebarOpen]    = useState(false)
  const [profileOpen,    setProfileOpen]    = useState(false)
  const [search,         setSearch]         = useState('')
  const [catFilter,      setCatFilter]      = useState('All Categories')
  const [priFilter,      setPriFilter]      = useState('All Priorities')
  const [statusFilter,   setStatusFilter]   = useState('All Status')
  const [channelFilter,  setChannelFilter]  = useState('All Channels')
  const [page,           setPage]           = useState(1)
  const [perPage]                           = useState(8)
  const [selectedRows,   setSelectedRows]   = useState<string[]>([])
  const [actionMenu,     setActionMenu]     = useState<string | null>(null)
  const [bulkMenu,       setBulkMenu]       = useState(false)

  const SB_W = sidebarOpen ? 220 : 52

  const filtered = TICKETS.filter(t => {
    const matchS  = search === '' || t.id.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.user.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
    const matchC  = catFilter    === 'All Categories' || t.category === catFilter
    const matchP  = priFilter    === 'All Priorities' || t.priority === priFilter
    const matchSt = statusFilter === 'All Status'     || t.status   === statusFilter
    const matchCh = channelFilter === 'All Channels'  || t.channel  === channelFilter
    return matchS && matchC && matchP && matchSt && matchCh
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  const toggleRow = (id: string) => setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id])
  const toggleAll = () => setSelectedRows(selectedRows.length === paginated.length ? [] : paginated.map(t => t.id))

  const selStyle: React.CSSProperties = {
    background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '7px 26px 7px 10px',
    outline: 'none', cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '10px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}
      onClick={() => { if (actionMenu) setActionMenu(null); if (bulkMenu) setBulkMenu(false) }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Help */}
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          onClick={() => router.push('/contact')}>
          <HelpCircle size={15} color="rgba(255,255,255,0.7)" />
        </div>

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

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto' as const, padding: '18px 20px 32px', display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                Support Tickets
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: RED, display: 'inline-block', marginBottom: 4 }} />
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Manage and resolve user issues and platform inquiries efficiently.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >Home</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Support Tickets</span>
              </div>
            </div>
          </div>

          {/* Export + Bulk Actions row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={() => alert('Exporting support tickets as CSV/Excel — coming soon.')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
              <Download size={14} /> Export
            </button>
            <div style={{ position: 'relative' as const }}>
              <button onClick={e => { e.stopPropagation(); setBulkMenu(v => !v) }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                Bulk Actions <ChevronDown size={13} />
              </button>
              {bulkMenu && (
                <div style={{ position: 'absolute' as const, right: 0, top: 40, width: 180, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  {['Assign to Agent', 'Mark as Resolved', 'Mark as Closed', 'Delete Selected'].map((label, i) => (
                    <div key={label} onClick={() => { setBulkMenu(false); selectedRows.length > 0 ? alert(`${label}: ${selectedRows.length} ticket(s)`) : alert('Please select tickets first.') }}
                      style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: i === 3 ? RED : '#F5F5F5', borderTop: i === 3 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >{label}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main grid: table + right panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

            {/* ── LEFT: Stat cards + filters + table ── */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>

              {/* 5 stat cards */}
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { icon: '💬', label: 'Total Tickets', value: '1,248', change: '+12.6%', up: true,  color: BLUE   },
                  { icon: '🕐', label: 'Open Tickets',  value: '342',   change: '+8.3%',  up: true,  color: ORANGE },
                  { icon: '⏳', label: 'In Progress',   value: '189',   change: '+6.1%',  up: true,  color: PURPLE },
                  { icon: '✅', label: 'Resolved',      value: '654',   change: '+18.7%', up: true,  color: GREEN  },
                  { icon: '🔒', label: 'Closed',        value: '63',    change: '-5.4%',  up: false, color: '#6B7280' },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                    </div>
                    <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#F5F5F5', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: s.up ? GREEN : RED }}>{s.up ? '↑' : '↓'} {s.change.replace(/[+-]/,'')} from last 7 days</div>
                  </div>
                ))}
              </div>

              {/* Filters row */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
                <div style={{ position: 'relative' as const, flex: 1, minWidth: 200 }}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Search tickets by ID, subject, user, or email..."
                    style={{ width: '100%', padding: '7px 10px 7px 28px', background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
                  <Search size={13} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                </div>
                <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Categories','Profile & Account','Payments','Verifications','Casting & Auditions','Login & Security','Technical Issue'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={priFilter} onChange={e => { setPriFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Priorities','High','Medium','Low'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Status','Open','In Progress','Resolved','Closed'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={channelFilter} onChange={e => { setChannelFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Channels','Web','Email','App','Live Chat'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                {/* Date range */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' as const }}
                  onClick={() => alert('Date range picker — select custom date ranges.')}>
                  <Calendar size={13} color={GOLD} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>May 15, 2025 - May 21, 2025</span>
                  <RefreshCw size={12} color="rgba(255,255,255,0.3)" />
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                  <Filter size={13} /> Filters
                </button>
              </div>

              {/* Table */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>

                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1.4fr 1.8fr 1fr 0.8fr 0.8fr 0.7fr 1.2fr 1.2fr 80px', gap: 0, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2, alignItems: 'center' }}>
                  <input type="checkbox" checked={selectedRows.length === paginated.length && paginated.length > 0} onChange={toggleAll}
                    style={{ width: 14, height: 14, cursor: 'pointer', accentColor: GOLD }} />
                  {['Ticket ID','Subject','User','Category','Priority','Status','Channel','Assigned To','Created On','Actions'].map(h => (
                    <div key={h} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700, whiteSpace: 'nowrap' as const }}>{h}</div>
                  ))}
                </div>

                {/* Rows */}
                {paginated.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No tickets match your filters.</div>
                ) : paginated.map((t, i) => (
                  <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1.4fr 1.8fr 1fr 0.8fr 0.8fr 0.7fr 1.2fr 1.2fr 80px', gap: 0, padding: '11px 14px', borderBottom: i < paginated.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', background: selectedRows.includes(t.id) ? 'rgba(212,166,74,0.04)' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (!selectedRows.includes(t.id)) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = selectedRows.includes(t.id) ? 'rgba(212,166,74,0.04)' : 'transparent' }}
                  >
                    {/* Checkbox */}
                    <input type="checkbox" checked={selectedRows.includes(t.id)} onChange={() => toggleRow(t.id)}
                      style={{ width: 14, height: 14, cursor: 'pointer', accentColor: GOLD }} />

                    {/* Ticket ID */}
                    <div style={{ fontSize: 13, color: BLUE, fontWeight: 600, cursor: 'pointer' }}
                      onClick={() => alert(`Ticket Details:\nID: ${t.id}\nSubject: ${t.subject}\nUser: ${t.user}\nStatus: ${t.status}\nPriority: ${t.priority}\nCategory: ${t.category}\nChannel: ${t.channel}\nAssigned To: ${t.assignedTo}\nCreated: ${t.createdOn}`)}
                      onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                    >{t.id}</div>

                    {/* Subject */}
                    <div style={{ fontSize: 14, color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, paddingRight: 8 }}>{t.subject}</div>

                    {/* User */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${BLUE}30`, border: `1px solid ${BLUE}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: BLUE, flexShrink: 0 }}>{t.avatar}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{t.user}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{t.email}</div>
                      </div>
                    </div>

                    {/* Category */}
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{t.category}</div>

                    {/* Priority */}
                    <div>
                      <span style={{ padding: '3px 9px', background: `${PRIORITY_COLORS[t.priority]}22`, border: `1px solid ${PRIORITY_COLORS[t.priority]}55`, borderRadius: 12, fontSize: 13, color: PRIORITY_COLORS[t.priority], fontWeight: 700 }}>{t.priority}</span>
                    </div>

                    {/* Status */}
                    <div>
                      <span style={{ padding: '3px 9px', background: STATUS_BG[t.status], border: `1px solid ${STATUS_COLORS[t.status]}44`, borderRadius: 12, fontSize: 13, color: STATUS_COLORS[t.status], fontWeight: 600, whiteSpace: 'nowrap' as const }}>{t.status}</span>
                    </div>

                    {/* Channel */}
                    <div style={{ fontSize: 13, color: CHANNEL_COLORS[t.channel] || '#A8B0BD' }}>{t.channel}</div>

                    {/* Assigned To */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: GOLD, flexShrink: 0 }}>
                        {t.assignedTo.split(' ').map(w => w[0]).join('')}
                      </div>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{t.assignedTo}</span>
                    </div>

                    {/* Created On */}
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', whiteSpace: 'pre-line' as const }}>{t.createdOn}</div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' as const }}>
                      <button onClick={() => alert(`Ticket Details:\nID: ${t.id}\nSubject: ${t.subject}\nUser: ${t.user} (${t.email})\nStatus: ${t.status}\nPriority: ${t.priority}\nCategory: ${t.category}\nChannel: ${t.channel}\nAssigned To: ${t.assignedTo}\nCreated: ${t.createdOn}`)}
                        title="View" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      ><Eye size={14} /></button>
                      <div style={{ position: 'relative' as const }}>
                        <button onClick={e => { e.stopPropagation(); setActionMenu(actionMenu === t.id ? null : t.id) }}
                          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        ><MoreVertical size={14} /></button>
                        {actionMenu === t.id && (
                          <div style={{ position: 'absolute' as const, right: 0, top: 32, width: 180, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                            {[
                              { label: 'View Details',   action: () => alert(`Viewing: ${t.id} — ${t.subject}`) },
                              { label: 'Assign Agent',   action: () => alert(`Assign agent for ${t.id} — coming soon.`) },
                              { label: 'Change Status',  action: () => alert(`Change status for ${t.id} — coming soon.`) },
                              { label: 'Add Note',       action: () => alert(`Add internal note to ${t.id} — coming soon.`) },
                              { label: 'View User',      action: () => router.push('/admin/users') },
                              { label: 'View Audit Log', action: () => router.push('/admin/audit') },
                              { label: 'Delete Ticket',  action: () => confirm(`Delete ${t.id}?`), danger: true },
                            ].map(m => (
                              <div key={m.label} onClick={() => { m.action(); setActionMenu(null) }}
                                style={{ padding: '9px 14px', fontSize: 14, cursor: 'pointer', color: (m as any).danger ? RED : '#F5F5F5', borderTop: (m as any).danger ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                              >{m.label}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div style={{ padding: '11px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG2 }}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                    Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of 1,248 entries
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <button onClick={() => setPage(1)} disabled={page === 1}
                      style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 14 }}>«</button>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 16 }}>‹</button>
                    {[1, 2, 3].map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        style={{ width: 30, height: 30, background: p === page ? GOLD : 'transparent', border: `1px solid ${p === page ? GOLD : 'rgba(255,255,255,0.12)'}`, borderRadius: 6, color: p === page ? '#000' : '#F5F5F5', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14, fontWeight: p === page ? 700 : 400 }}>{p}</button>
                    ))}
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', padding: '0 4px' }}>...</span>
                    <button onClick={() => setPage(156)}
                      style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#F5F5F5', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14 }}>156</button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#F5F5F5', cursor: 'pointer', fontSize: 16 }}>›</button>
                    <button onClick={() => setPage(156)}
                      style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: '#F5F5F5', cursor: 'pointer', fontSize: 14 }}>»</button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

              {/* Tickets by Status donut */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 14 }}>Tickets by Status</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 14 }}>
                  <StatusDonut />
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, width: '100%' }}>
                    {[
                      { label: 'Open',        count: 342,  pct: '27.4%', color: ORANGE    },
                      { label: 'In Progress', count: 189,  pct: '15.1%', color: BLUE      },
                      { label: 'Resolved',    count: 654,  pct: '52.4%', color: GREEN     },
                      { label: 'Closed',      count: 63,   pct: '5.1%',  color: '#6B7280' },
                    ].map(d => (
                      <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', flex: 1, whiteSpace: 'nowrap' as const }}>{d.label}</span>
                        <span style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 700, whiteSpace: 'nowrap' as const }}>{d.pct}</span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' as const }}>({d.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tickets by Channel */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 14 }}>Tickets by Channel</div>
                {[
                  { label: 'Web',        value: 642, pct: 51.4, color: BLUE   },
                  { label: 'Email',      value: 312, pct: 25.0, color: ORANGE },
                  { label: 'Mobile App', value: 189, pct: 15.1, color: PURPLE },
                  { label: 'Live Chat',  value: 105, pct:  8.4, color: TEAL   },
                ].map(ch => (
                  <div key={ch.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{ch.label}</span>
                      <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>{ch.value} ({ch.pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${ch.pct}%`, background: ch.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Support Insights */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 14 }}>Support Insights</div>
                {[
                  { icon: '📈', color: GREEN,  title: '18.7% increase in resolved tickets', sub: 'Compared to last 7 days' },
                  { icon: '⏱️', color: ORANGE, title: 'Avg. first response time', sub: null, value: '2.4 hours', valueNote: '↓ 0.6 hours from last week', noteColor: GREEN },
                  { icon: '⭐', color: BLUE,   title: 'Customer satisfaction score', sub: 'Based on 312 feedbacks', value: '4.6 / 5' },
                ].map((ins, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: `${ins.color}20`, border: `1px solid ${ins.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{ins.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{ins.title}</div>
                      {ins.value && <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', lineHeight: 1.2 }}>{ins.value}</div>}
                      {ins.sub && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{ins.sub}</div>}
                      {(ins as any).valueNote && <div style={{ fontSize: 13, color: (ins as any).noteColor, marginTop: 2 }}>{(ins as any).valueNote}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* View Full Analytics */}
              <button onClick={() => router.push('/admin/analytics')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', background: 'transparent', border: `1px solid ${GOLD}`, borderRadius: 10, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.3 }}
                onMouseEnter={e => (e.currentTarget.style.background = GOLD_DIM)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <TrendingUp size={15} /> View Full Analytics →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}