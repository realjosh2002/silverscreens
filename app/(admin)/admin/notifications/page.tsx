'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Database,
  Settings, ScrollText, Bell, ChevronRight, ChevronLeft,
  Menu, ChevronDown, MessageSquare, UserCheck, BellRing,
  Ticket, KeyRound, Eye, Edit, Copy, MoreVertical,
  Search, Filter, Plus, Send, Clock, CheckCheck,
  AlertCircle, Mail, Smartphone, Hash, Bookmark,
  Calendar, RefreshCw, Zap,
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
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'            },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'  },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'  },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'         },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'              },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'        },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'       },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                  },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications', active: true },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'            },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'              },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'             },
]

const PROFILE_MENU = [
  { label: 'My Profile',               href: '/admin/profile'        },
  { label: 'Account Settings',         href: '/admin/settings'       },
  { label: 'Security Settings',        href: '/admin/settings'       },
  { label: 'Notification Preferences', href: '/admin/notifications'  },
  { label: 'Activity Logs',            href: '/admin/audit'          },
  { label: 'Help & Support',           href: '/contact'              },
  { label: 'Logout',                   href: '/login'                },
]

/* ─── Notification data ──────────────────────────────────────── */
const TYPE_MAP: Record<string, string> = {
  'Casting Alert':  PURPLE,
  'Account Update': BLUE,
  'Verification':   GREEN,
  'Promotion':      ORANGE,
  'Application':    TEAL,
  'System':         '#6B7280',
  'Announcement':   GOLD,
  'Alert':          RED,
  'Reminder':       '#EC4899',
}

const STATUS_MAP: Record<string, string> = {
  Sent:      GREEN,
  Scheduled: BLUE,
  Draft:     ORANGE,
  Failed:    RED,
}

const NOTIFICATIONS = [
  { id: 1,  icon: '📢', title: 'New Casting for You',         sub: 'Check out latest casting matches',    type: 'Casting Alert',  audience: 'Aspirants',  channels: ['bell','mail','doc'], status: 'Sent',      scheduled: 'May 21, 2025 11:30 AM', by: 'Super Admin',     avatar: 'SA' },
  { id: 2,  icon: '👑', title: 'Profile Under Review',        sub: 'Your profile is under verification',  type: 'Account Update', audience: 'Aspirants',  channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 21, 2025 10:45 AM', by: 'Super Admin',     avatar: 'SA' },
  { id: 3,  icon: '✅', title: 'Verification Approved',       sub: 'Your profile has been verified',      type: 'Verification',   audience: 'All Users',  channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 20, 2025 04:15 PM', by: 'Super Admin',     avatar: 'SA' },
  { id: 4,  icon: '⭐', title: 'Premium Plan Offer',          sub: 'Upgrade and unlock more features',    type: 'Promotion',      audience: 'Aspirants',  channels: ['bell','mail','doc'], status: 'Scheduled', scheduled: 'May 22, 2025 09:00 AM', by: 'Marketing Admin', avatar: 'MA' },
  { id: 5,  icon: '📋', title: 'Application Status Update',   sub: 'Your application status has changed', type: 'Application',    audience: 'Aspirants',  channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 20, 2025 01:20 PM', by: 'Super Admin',     avatar: 'SA' },
  { id: 6,  icon: '🎁', title: 'Refer & Earn Bonus',          sub: 'You have earned a reward!',           type: 'Promotion',      audience: 'All Users',  channels: ['bell','mail','doc'], status: 'Sent',      scheduled: 'May 19, 2025 06:10 PM', by: 'Marketing Admin', avatar: 'MA' },
  { id: 7,  icon: '🔧', title: 'Maintenance Notice',          sub: 'Scheduled maintenance information',   type: 'System',         audience: 'All Users',  channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 18, 2025 11:00 AM', by: 'Super Admin',     avatar: 'SA' },
  { id: 8,  icon: '🎉', title: 'New Feature Announcement',    sub: 'Introducing Portfolio Private Mode',  type: 'Announcement',   audience: 'All Users',  channels: ['bell','mail','doc'], status: 'Draft',     scheduled: '—',                     by: 'Content Manager', avatar: 'CM' },
  { id: 9,  icon: '🚨', title: 'Security Alert',              sub: 'New login detected on your account',  type: 'Alert',          audience: 'Aspirants',  channels: ['mail'],              status: 'Failed',    scheduled: 'May 17, 2025 09:35 PM', by: 'System',          avatar: 'SY' },
  { id: 10, icon: '📅', title: 'Webinar Reminder',            sub: "Don't miss our acting workshop",      type: 'Reminder',       audience: 'Aspirants',  channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 16, 2025 05:00 PM', by: 'Marketing Admin', avatar: 'MA' },
  { id: 11, icon: '📢', title: 'Agency Casting Approved',     sub: 'Your casting call is now live',       type: 'Casting Alert',  audience: 'Agencies',   channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 15, 2025 02:30 PM', by: 'Super Admin',     avatar: 'SA' },
  { id: 12, icon: '💳', title: 'Subscription Expiry Reminder',sub: 'Your plan expires in 7 days',         type: 'Account Update', audience: 'All Users',  channels: ['bell','mail','doc'], status: 'Scheduled', scheduled: 'May 23, 2025 08:00 AM', by: 'System',          avatar: 'SY' },
]

const DONUT_DATA = [
  { label: 'Casting Alert',  value: 24, pct: 27.9, color: PURPLE  },
  { label: 'Account Update', value: 16, pct: 18.6, color: BLUE    },
  { label: 'Promotion',      value: 15, pct: 17.4, color: ORANGE  },
  { label: 'Verification',   value: 10, pct: 11.6, color: GREEN   },
  { label: 'Others',         value: 21, pct: 24.4, color: '#6B7280'},
]

const QUICK_ACTIONS = [
  { label: 'Create New Notification',    icon: Plus,      action: 'create'    },
  { label: 'Send Test Notification',     icon: Send,      action: 'test'      },
  { label: 'View Scheduled Notifications', icon: Clock,   action: 'scheduled' },
  { label: 'Notification Templates',    icon: Copy,      action: 'templates' },
  { label: 'Message Variables',         icon: Hash,      action: 'variables' },
]

const CHANNELS = [
  { icon: '🔔', label: 'In-App',           count: 86, pct: 100,  color: PURPLE },
  { icon: '📱', label: 'Push Notification', count: 64, pct: 74.4, color: RED   },
  { icon: '📧', label: 'Email',            count: 58, pct: 67.4, color: BLUE   },
  { icon: '💬', label: 'SMS',              count: 12, pct: 14.0, color: ORANGE },
]

const TABS = ['All Notifications', 'Scheduled', 'Sent', 'Drafts', 'Failed']

/* ─── Donut Chart ────────────────────────────────────────────── */
function NotifDonut() {
  const cx = 70, cy = 70, R = 58, r = 36
  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (a: number, rad: number) => [cx + rad * Math.cos(toRad(a)), cy + rad * Math.sin(toRad(a))]
  let start = -90
  const arcs = DONUT_DATA.map(seg => {
    const sweep = (seg.pct / 100) * 360
    const end = start + sweep
    const large = sweep > 180 ? 1 : 0
    const [x1, y1] = pt(start, R); const [x2, y2] = pt(end, R)
    const [x3, y3] = pt(end, r);   const [x4, y4] = pt(start, r)
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`
    start = end + 1
    return { ...seg, d }
  })
  return (
    <svg viewBox="0 0 140 140" style={{ width: 130, height: 130, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r - 1} fill={BG3} />
      {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} />)}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={10} fontFamily={BARLOW}>Total</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#F5F5F5" fontSize={20} fontWeight={800} fontFamily={BEBAS}>86</text>
    </svg>
  )
}

/* ─── Channel icon inline ────────────────────────────────────── */
function ChannelIcons({ channels }: { channels: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {channels.includes('bell') && <Bell size={13} color="rgba(255,255,255,0.5)" />}
      {channels.includes('mail') && <Mail size={13} color="rgba(255,255,255,0.5)" />}
      {channels.includes('doc')  && <Copy size={13} color="rgba(255,255,255,0.5)" />}
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function NotificationsManagementPage() {
  const router = useRouter()
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [profileOpen,   setProfileOpen]   = useState(false)
  const [activeTab,     setActiveTab]     = useState('All Notifications')
  const [search,        setSearch]        = useState('')
  const [typeFilter,    setTypeFilter]    = useState('All Types')
  const [segmentFilter, setSegmentFilter] = useState('All Segments')
  const [channelFilter, setChannelFilter] = useState('All Channels')
  const [statusFilter,  setStatusFilter]  = useState('All Status')
  const [page,          setPage]          = useState(1)
  const [perPage,       setPerPage]       = useState(10)
  const [actionMenu,    setActionMenu]    = useState<number | null>(null)

  const SB_W = sidebarOpen ? 220 : 52

  /* Filter logic */
  const filtered = NOTIFICATIONS.filter(n => {
    const matchTab     = activeTab === 'All Notifications' || n.status === activeTab.replace('s','') || (activeTab === 'Sent' && n.status === 'Sent') || (activeTab === 'Scheduled' && n.status === 'Scheduled') || (activeTab === 'Drafts' && n.status === 'Draft') || (activeTab === 'Failed' && n.status === 'Failed')
    const matchSearch  = n.title.toLowerCase().includes(search.toLowerCase()) || n.sub.toLowerCase().includes(search.toLowerCase())
    const matchType    = typeFilter    === 'All Types'    || n.type     === typeFilter
    const matchSegment = segmentFilter === 'All Segments' || n.audience === segmentFilter
    const matchStatus  = statusFilter  === 'All Status'   || n.status   === statusFilter
    return matchTab && matchSearch && matchType && matchSegment && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  const clearFilters = () => { setSearch(''); setTypeFilter('All Types'); setSegmentFilter('All Segments'); setChannelFilter('All Channels'); setStatusFilter('All Status'); setPage(1) }

  const selStyle: React.CSSProperties = {
    background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '7px 26px 7px 10px',
    outline: 'none', cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '10px',
  }

  const handleQuickAction = (action: string) => {
    if (action === 'create')    alert('Create New Notification — Rich editor coming soon.')
    if (action === 'test')      alert('Test notification sent to your registered email/device.')
    if (action === 'scheduled') { setActiveTab('Scheduled'); setPage(1) }
    if (action === 'templates') alert('Notification Templates — Coming soon.')
    if (action === 'variables') alert('Available variables: {{user_name}}, {{casting_title}}, {{agency_name}}, {{plan_name}}, {{expiry_date}}')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }} onClick={() => actionMenu !== null && setActionMenu(null)}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Messages */}
        <div onClick={() => router.push('/admin/support')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={15} color="rgba(255,255,255,0.7)" /></div>
          <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>8</div>
        </div>

        {/* Bell */}
        <div style={{ position: 'relative' as const, cursor: 'pointer' }}>
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
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>Super Admin</div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >Home</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Notifications Management</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                Notifications Management
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE, display: 'inline-block', marginBottom: 4 }} />
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>Create, manage and track notifications across the SilverScreens platform.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => alert('Test notification sent to ADM000001.')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <Send size={14} /> Test Notification
              </button>
              <button onClick={() => alert('Create New Notification — Rich editor coming soon.')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
                <Plus size={15} /> Create New Notification
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: '📬', label: 'Total Notifications', value: 86,   sub: 'All time',             color: PURPLE },
              { icon: '📤', label: 'Sent',                value: 64,   sub: '74.42% of total',      color: BLUE   },
              { icon: '✅', label: 'Delivered',           value: 59,   sub: '92.19% of sent',       color: GREEN  },
              { icon: '👁️', label: 'Opened',              value: 28,   sub: '47.46% of delivered',  color: ORANGE },
              { icon: '❌', label: 'Failed',              value: 5,    sub: '7.81% of sent',        color: RED    },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#F5F5F5', lineHeight: 1, letterSpacing: 0.5 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main area */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

            {/* LEFT — Table */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>

              {/* Filters */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
                <div style={{ position: 'relative' as const, flex: 1, minWidth: 160 }}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Search by title or message..."
                    style={{ width: '100%', padding: '7px 10px 7px 28px', background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
                <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Types', 'Casting Alert', 'Account Update', 'Verification', 'Promotion', 'Application', 'System', 'Announcement', 'Alert', 'Reminder'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={segmentFilter} onChange={e => { setSegmentFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Segments', 'Aspirants', 'Agencies', 'All Users'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={channelFilter} onChange={e => { setChannelFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Channels', 'In-App', 'Email', 'Push', 'SMS'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Status', 'Sent', 'Scheduled', 'Draft', 'Failed'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <button onClick={clearFilters} style={{ padding: '7px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>Clear Filters</button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                  <Filter size={13} /> Filters
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', background: BG2 }}>
                {TABS.map(t => (
                  <button key={t} onClick={() => { setActiveTab(t); setPage(1) }} style={{ padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: BARLOW, fontSize: 15, fontWeight: activeTab === t ? 700 : 400, color: activeTab === t ? PURPLE : 'rgba(255,255,255,0.5)', borderBottom: activeTab === t ? `2px solid ${PURPLE}` : '2px solid transparent', whiteSpace: 'nowrap' as const }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 0.8fr 0.8fr 0.7fr 1.3fr 0.9fr 0.9fr', padding: '9px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2 }}>
                {['Title', 'Type', 'Audience', 'Channel', 'Status', 'Scheduled / Sent', 'Sent By', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {paginated.map((n, i) => (
                <div key={n.id} style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 0.8fr 0.8fr 0.7fr 1.3fr 0.9fr 0.9fr', padding: '10px 16px', borderBottom: i < paginated.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${TYPE_MAP[n.type] || PURPLE}20`, border: `1px solid ${TYPE_MAP[n.type] || PURPLE}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{n.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{n.sub}</div>
                    </div>
                  </div>
                  {/* Type */}
                  <div><span style={{ padding: '3px 9px', background: `${TYPE_MAP[n.type]}22`, border: `1px solid ${TYPE_MAP[n.type]}44`, borderRadius: 12, fontSize: 13, color: TYPE_MAP[n.type], fontWeight: 600, whiteSpace: 'nowrap' as const }}>{n.type}</span></div>
                  {/* Audience */}
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{n.audience}</div>
                  {/* Channel icons */}
                  <div><ChannelIcons channels={n.channels} /></div>
                  {/* Status */}
                  <div><span style={{ padding: '3px 9px', background: `${STATUS_MAP[n.status]}22`, border: `1px solid ${STATUS_MAP[n.status]}44`, borderRadius: 12, fontSize: 13, color: STATUS_MAP[n.status], fontWeight: 600 }}>{n.status}</span></div>
                  {/* Scheduled/Sent */}
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{n.scheduled}</div>
                  {/* Sent By */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{n.avatar}</div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{n.by}</span>
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' as const }}>
                    <button onClick={() => alert(`Viewing: ${n.title}\nType: ${n.type}\nAudience: ${n.audience}\nStatus: ${n.status}\nSent: ${n.scheduled}`)} title="View" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    ><Eye size={14} /></button>
                    <button onClick={() => alert(`Edit notification: "${n.title}" — Editor coming soon.`)} title="Edit" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    ><Edit size={14} /></button>
                    <button onClick={() => alert(`Duplicated: "${n.title}"`)} title="Duplicate" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    ><Copy size={14} /></button>
                    <div style={{ position: 'relative' as const }}>
                      <button onClick={e => { e.stopPropagation(); setActionMenu(actionMenu === n.id ? null : n.id) }} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      ><MoreVertical size={14} /></button>
                      {actionMenu === n.id && (
                        <div style={{ position: 'absolute' as const, right: 0, top: 32, width: 170, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                          {[
                            { label: n.status === 'Draft' ? 'Send Now' : 'Resend', action: () => alert(`${n.status === 'Draft' ? 'Sent' : 'Resent'}: "${n.title}"`) },
                            { label: 'Schedule',     action: () => alert(`Schedule "${n.title}" — Scheduler coming soon.`) },
                            { label: 'View Analytics', action: () => router.push('/admin/analytics') },
                            { label: 'View History', action: () => router.push('/admin/audit') },
                            { label: 'Delete',       action: () => confirm(`Delete "${n.title}"?`), danger: true },
                          ].map(m => (
                            <div key={m.label} onClick={() => { m.action(); setActionMenu(null) }} style={{ padding: '9px 14px', fontSize: 14, cursor: 'pointer', color: (m as any).danger ? RED : '#F5F5F5' }}
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
                  Showing {Math.min((page - 1) * perPage + 1, filtered.length)} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 16 }}>‹</button>
                  {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: p === page ? PURPLE : 'transparent', border: `1px solid ${p === page ? PURPLE : 'rgba(255,255,255,0.12)'}`, borderRadius: 6, color: p === page ? '#fff' : '#F5F5F5', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14, fontWeight: p === page ? 700 : 400 }}>{p}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                    style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: (page === totalPages || totalPages === 0) ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: (page === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', fontSize: 16 }}>›</button>
                  <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }} style={{ ...selStyle, fontSize: 13, padding: '5px 24px 5px 8px' }}>
                    {[10, 25, 50].map(n => <option key={n} style={{ background: BG3 }}>{n} / page</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT panel */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

              {/* Notification Summary donut */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5', marginBottom: 14 }}>Notification Summary</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <NotifDonut />
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6, flex: 1 }}>
                    {DONUT_DATA.map(d => (
                      <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{d.label}</span>
                        </div>
                        <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>{d.value} ({d.pct}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Total</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>86</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5', marginBottom: 12 }}>Quick Actions</div>
                {QUICK_ACTIONS.map(qa => (
                  <div key={qa.label} onClick={() => handleQuickAction(qa.action)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: `${PURPLE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <qa.icon size={13} color={PURPLE} />
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{qa.label}</span>
                  </div>
                ))}
              </div>

              {/* Notification Channels */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5', marginBottom: 12 }}>Notification Channels</div>
                {CHANNELS.map(ch => (
                  <div key={ch.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 15 }}>{ch.icon}</span>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{ch.label}</span>
                      </div>
                      <span style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{ch.count} ({ch.pct}%)</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${ch.pct}%`, background: ch.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <Zap size={15} color={GOLD} />
                  <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5' }}>Tips</div>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: '0 0 10px' }}>
                  Use variables like <span style={{ color: PURPLE, fontWeight: 600 }}>{'{{user_name}}'}</span>, <span style={{ color: PURPLE, fontWeight: 600 }}>{'{{casting_title}}'}</span>, <span style={{ color: PURPLE, fontWeight: 600 }}>{'{{agency_name}}'}</span> to personalize your messages.
                </p>
                <span onClick={() => alert('Learn more about notification variables and personalization in Admin → Notification Templates.')} style={{ fontSize: 14, color: PURPLE, cursor: 'pointer', fontWeight: 600 }}>Learn More →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}