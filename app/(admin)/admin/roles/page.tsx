'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Database,
  Settings, ScrollText, Bell, ChevronRight, ChevronLeft,
  Menu, ChevronDown, UserCheck, BellRing, Ticket, KeyRound,
  Plus, Edit, Trash2, Copy, Eye, Check, X, Search,
  Lock, Unlock, Shield, User, UserCog, AlertTriangle,
  CheckCircle, XCircle,
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
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'               },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles', active: true },
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

/* ─── Permissions matrix ─────────────────────────────────────── */
const MODULES = [
  'Dashboard',
  'User Management',
  'Talent Verification',
  'Agency Verification',
  'Applications',
  'Reports & Complaints',
  'Fraud Detection',
  'Subscriptions',
  'Advertisements',
  'CMS Management',
  'Notifications',
  'Analytics',
  'Support Tickets',
  'Audit Logs',
  'Roles & Permissions',
  'Settings',
]

const ACTIONS = ['View', 'Create', 'Edit', 'Delete', 'Export']

type PermMatrix = Record<string, Record<string, Record<string, boolean>>>

const initPerms = (roles: string[], allowAll: string[] = [], allowSome: Record<string, string[]> = {}): PermMatrix => {
  const m: PermMatrix = {}
  roles.forEach(role => {
    m[role] = {}
    MODULES.forEach(mod => {
      m[role][mod] = {}
      ACTIONS.forEach(act => {
        if (allowAll.includes(role)) m[role][mod][act] = true
        else if (allowSome[role] && allowSome[role].includes(mod)) m[role][mod][act] = act === 'View' || act === 'Edit'
        else m[role][mod][act] = act === 'View'
      })
    })
  })
  return m
}

const ROLES_DATA = [
  { id: 'admin',       name: 'Admin',             color: PURPLE, icon: '🛡️', users: 5,  description: 'Full platform access. Manages all modules, users, roles and system settings.',        system: true  },
  { id: 'verifier',    name: 'Verifier',          color: BLUE,   icon: '✅', users: 13, description: 'Reviews and verifies both aspirant and agency profiles, KYC documents and media.',     system: false },
  { id: 'content-mod', name: 'Content Moderator', color: GREEN,  icon: '📋', users: 3,  description: 'Manages CMS pages, banners, FAQs, notifications and advertisement content.',          system: false },
]

const USERS_LIST = [
  { name: 'Rahul Sharma',   email: 'rahul@silverscreens.com',  role: 'admin',       avatar: 'RS', status: 'Active',   lastLogin: '24 Jun 2026' },
  { name: 'Priya Singh',    email: 'priya@silverscreens.com',  role: 'admin',       avatar: 'PS', status: 'Active',   lastLogin: '24 Jun 2026' },
  { name: 'Amit Malhotra',  email: 'amit@silverscreens.com',   role: 'admin',       avatar: 'AM', status: 'Active',   lastLogin: '23 Jun 2026' },
  { name: 'Neha Verma',     email: 'neha@silverscreens.com',   role: 'verifier',    avatar: 'NV', status: 'Active',   lastLogin: '24 Jun 2026' },
  { name: 'Karan Mehta',    email: 'karan@silverscreens.com',  role: 'verifier',    avatar: 'KM', status: 'Active',   lastLogin: '23 Jun 2026' },
  { name: 'Rohit Verma',    email: 'rohit@silverscreens.com',  role: 'verifier',    avatar: 'RV', status: 'Active',   lastLogin: '22 Jun 2026' },
  { name: 'Pooja Sharma',   email: 'pooja@silverscreens.com',  role: 'verifier',    avatar: 'PS', status: 'Active',   lastLogin: '24 Jun 2026' },
  { name: 'Simran Kaur',    email: 'simran@silverscreens.com', role: 'verifier',    avatar: 'SK', status: 'Active',   lastLogin: '24 Jun 2026' },
  { name: 'Vijay Nair',     email: 'vijay@silverscreens.com',  role: 'verifier',    avatar: 'VN', status: 'Active',   lastLogin: '23 Jun 2026' },
  { name: 'Anjali Desai',   email: 'anjali@silverscreens.com', role: 'verifier',    avatar: 'AD', status: 'Active',   lastLogin: '22 Jun 2026' },
  { name: 'Ravi Kumar',     email: 'ravi@silverscreens.com',   role: 'content-mod', avatar: 'RK', status: 'Active',   lastLogin: '24 Jun 2026' },
  { name: 'Meena Pillai',   email: 'meena@silverscreens.com',  role: 'content-mod', avatar: 'MP', status: 'Inactive', lastLogin: '19 Jun 2026' },
]

/* ─── Permission check ───────────────────────────────────────── */
const DEFAULT_PERMS: PermMatrix = initPerms(
  ROLES_DATA.map(r => r.id),
  ['admin'],
  {
    verifier:     ['Talent Verification', 'Agency Verification', 'Applications', 'Reports & Complaints', 'Audit Logs', 'Support Tickets'],
    'content-mod':['CMS Management', 'Notifications', 'Advertisements', 'Analytics'],
  }
)

export default function RolesPermissionsPage() {
  const router = useRouter()
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [profileOpen,   setProfileOpen]   = useState(false)
  const [activeTab,     setActiveTab]     = useState<'roles'|'permissions'|'users'>('roles')
  const [selectedRole,  setSelectedRole]  = useState('admin')
  const [perms,         setPerms]         = useState<PermMatrix>(DEFAULT_PERMS)
  const [search,        setSearch]        = useState('')
  const [roleSearch,    setRoleSearch]    = useState('')
  const [showNewRole,   setShowNewRole]   = useState(false)
  const [newRoleName,   setNewRoleName]   = useState('')
  const [editingUser,   setEditingUser]   = useState<string|null>(null)
  const [userRoleMap,   setUserRoleMap]   = useState<Record<string,string>>(
    Object.fromEntries(USERS_LIST.map(u => [u.email, u.role]))
  )
  const [userStatusMap, setUserStatusMap] = useState<Record<string,string>>(
    Object.fromEntries(USERS_LIST.map(u => [u.email, u.status]))
  )
  const [saved,         setSaved]         = useState(false)

  const SB_W = sidebarOpen ? 220 : 52
  const selectedRoleData = ROLES_DATA.find(r => r.id === selectedRole)!

  const togglePerm = (role: string, mod: string, act: string) => {
    if (role === 'admin') return // cannot edit admin role
    setPerms(prev => ({
      ...prev,
      [role]: { ...prev[role], [mod]: { ...prev[role][mod], [act]: !prev[role][mod][act] } }
    }))
  }

  const toggleModule = (role: string, mod: string) => {
    if (role === 'admin') return
    const allOn = ACTIONS.every(a => perms[role]?.[mod]?.[a])
    setPerms(prev => ({
      ...prev,
      [role]: { ...prev[role], [mod]: Object.fromEntries(ACTIONS.map(a => [a, !allOn])) }
    }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const filteredUsers = USERS_LIST.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const selStyle: React.CSSProperties = {
    background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '6px 24px 6px 10px',
    outline: 'none', cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 7px center', backgroundSize: '9px',
  }

  const card: React.CSSProperties = { background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN</span>
        </div>
        <div style={{ flex: 1 }} />

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
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>Super Admin</div>
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
        <div style={{ flex: 1, overflowY: 'auto' as const, padding: '18px 24px 32px', display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >Home</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Roles & Permissions</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                Roles & Permissions
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE, display: 'inline-block', marginBottom: 4 }} />
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>Manage admin roles, define access levels and control what each role can do.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => router.push('/admin/audit')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <ScrollText size={14} /> View Audit Log
              </button>
              <button onClick={() => setShowNewRole(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
                <Plus size={15} /> Create New Role
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { icon: '🛡️', label: 'Total Roles',       value: ROLES_DATA.length,                            color: PURPLE },
              { icon: '👥', label: 'Total Admin Users', value: USERS_LIST.length,                            color: BLUE   },
              { icon: '✅', label: 'Active Users',      value: USERS_LIST.filter(u => u.status === 'Active').length, color: GREEN  },
              { icon: '🔒', label: 'System Roles',      value: ROLES_DATA.filter(r => r.system).length,     color: ORANGE },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, ...card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#F5F5F5', lineHeight: 1 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 0 }}>
            {(['roles', 'permissions', 'users'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '11px 24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: BARLOW, fontSize: 16, fontWeight: activeTab === t ? 700 : 400, color: activeTab === t ? PURPLE : 'rgba(255,255,255,0.5)', borderBottom: activeTab === t ? `2px solid ${PURPLE}` : '2px solid transparent', textTransform: 'capitalize' as const }}>
                {t === 'roles' ? 'Roles' : t === 'permissions' ? 'Permissions Matrix' : 'Admin Users'}
              </button>
            ))}
          </div>

          {/* ── TAB: ROLES ── */}
          {activeTab === 'roles' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>

              {/* Search */}
              <div style={{ position: 'relative' as const, maxWidth: 340 }}>
                <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={roleSearch} onChange={e => setRoleSearch(e.target.value)} placeholder="Search roles..."
                  style={{ width: '100%', padding: '8px 12px 8px 32px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>

              {/* Role cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {ROLES_DATA.filter(r => r.name.toLowerCase().includes(roleSearch.toLowerCase())).map(role => (
                  <div key={role.id} style={{ ...card, padding: 20, position: 'relative' as const }}>
                    {/* System badge */}
                    {role.system && (
                      <div style={{ position: 'absolute' as const, top: 14, right: 14, padding: '2px 8px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, fontSize: 12, color: RED, fontWeight: 600 }}>System</div>
                    )}

                    {/* Role header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: `${role.color}20`, border: `2px solid ${role.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{role.icon}</div>
                      <div>
                        <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', letterSpacing: 0.5 }}>{role.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                          <Users size={12} color="rgba(255,255,255,0.4)" />
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{role.users} users</span>
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 16 }}>{role.description}</p>

                    {/* Permission count bar */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Access Level</span>
                        <span style={{ fontSize: 13, color: role.color, fontWeight: 700 }}>
                          {role.id === 'admin' ? '100%' : role.id === 'verifier' ? '38%' : '20%'}
                        </span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                        <div style={{ height: '100%', borderRadius: 3, background: role.color, width: role.id === 'admin' ? '100%' : role.id === 'verifier' ? '38%' : '20%' }} />
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setSelectedRole(role.id); setActiveTab('permissions') }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', background: `${role.color}15`, border: `1px solid ${role.color}40`, borderRadius: 7, color: role.color, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                        <Shield size={13} /> Edit Permissions
                      </button>
                      {!role.system && (
                        <button onClick={() => { if (confirm(`Delete role "${role.name}"?`)) alert('Role deleted.') }}
                          style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, color: RED, cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                      <button onClick={() => alert(`Duplicate role "${role.name}" — coming soon.`)}
                        style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add new role card */}
                <div onClick={() => setShowNewRole(true)} style={{ ...card, padding: 20, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', border: '1px dashed rgba(139,92,246,0.3)', minHeight: 200 }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = PURPLE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)')}
                >
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${PURPLE}15`, border: `1px dashed ${PURPLE}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={22} color={PURPLE} />
                  </div>
                  <div style={{ fontSize: 15, color: PURPLE, fontWeight: 700 }}>Create New Role</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' as const }}>Define custom permissions for a new admin role</div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: PERMISSIONS MATRIX ── */}
          {activeTab === 'permissions' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

              {/* Role selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                  {ROLES_DATA.map(role => (
                    <button key={role.id} onClick={() => setSelectedRole(role.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', background: selectedRole === role.id ? `${role.color}20` : 'transparent', border: `1px solid ${selectedRole === role.id ? role.color : 'rgba(255,255,255,0.12)'}`, borderRadius: 8, color: selectedRole === role.id ? role.color : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, fontWeight: selectedRole === role.id ? 700 : 400, cursor: 'pointer' }}>
                      <span>{role.icon}</span> {role.name}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {selectedRole !== 'admin' && (
                    <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', background: saved ? GREEN : PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'background 0.3s' }}>
                      {saved ? <><CheckCircle size={14} /> Saved!</> : <><Check size={14} /> Save Changes</>}
                    </button>
                  )}
                </div>
              </div>

              {/* Role info banner */}
              <div style={{ ...card, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14, borderLeft: `3px solid ${selectedRoleData.color}` }}>
                <span style={{ fontSize: 24 }}>{selectedRoleData.icon}</span>
                <div>
                  <div style={{ fontFamily: BEBAS, fontSize: 18, color: selectedRoleData.color, letterSpacing: 0.5 }}>{selectedRoleData.name}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{selectedRoleData.description}</div>
                </div>
                {selectedRole === 'admin' && (
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8 }}>
                    <Lock size={13} color={RED} />
                    <span style={{ fontSize: 14, color: RED, fontWeight: 600 }}>Read-only — Admin role cannot be modified</span>
                  </div>
                )}
              </div>

              {/* Permissions table */}
              <div style={{ ...card, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr repeat(5, 1fr)', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2 }}>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>MODULE</div>
                  {ACTIONS.map(a => (
                    <div key={a} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textAlign: 'center' as const }}>{a}</div>
                  ))}
                </div>

                {/* Rows */}
                {MODULES.map((mod, i) => {
                  const allOn = ACTIONS.every(a => perms[selectedRole]?.[mod]?.[a])
                  return (
                    <div key={mod} style={{ display: 'grid', gridTemplateColumns: '1.8fr repeat(5, 1fr)', padding: '10px 16px', borderBottom: i < MODULES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', background: allOn && selectedRole !== 'super-admin' ? 'rgba(139,92,246,0.04)' : 'transparent' }}
                      onMouseEnter={e => { if (!allOn) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = allOn && selectedRole !== 'super-admin' ? 'rgba(139,92,246,0.04)' : 'transparent' }}
                    >
                      {/* Module name with toggle-all */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div onClick={() => toggleModule(selectedRole, mod)} style={{ width: 16, height: 16, borderRadius: 4, background: allOn ? `${selectedRoleData.color}30` : 'rgba(255,255,255,0.06)', border: `1px solid ${allOn ? selectedRoleData.color : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: selectedRole === 'super-admin' ? 'default' : 'pointer', flexShrink: 0 }}>
                          {allOn && <Check size={10} color={selectedRoleData.color} />}
                        </div>
                        <span style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 500 }}>{mod}</span>
                      </div>

                      {/* Permission toggles */}
                      {ACTIONS.map(act => {
                        const on = perms[selectedRole]?.[mod]?.[act] ?? false
                        return (
                          <div key={act} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div onClick={() => togglePerm(selectedRole, mod, act)}
                              style={{ width: 28, height: 28, borderRadius: 6, background: on ? `${selectedRoleData.color}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${on ? selectedRoleData.color + '60' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: selectedRole === 'super-admin' ? 'default' : 'pointer', transition: 'all 0.15s' }}>
                              {on
                                ? <Check size={14} color={selectedRoleData.color} />
                                : <X size={12} color="rgba(255,255,255,0.2)" />
                              }
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: 20, fontSize: 14, color: 'rgba(255,255,255,0.4)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: `${PURPLE}20`, border: `1px solid ${PURPLE}60`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={11} color={PURPLE} /></div>
                  <span>Permission granted</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} color="rgba(255,255,255,0.2)" /></div>
                  <span>Permission denied</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={9} color="rgba(255,255,255,0.5)" /></div>
                  <span>Row checkbox toggles all actions for that module</span>
                </div>
                {selectedRole !== 'admin' && (
                  <span style={{ marginLeft: 'auto', color: PURPLE, fontWeight: 600, cursor: 'pointer' }} onClick={handleSave}>
                    {saved ? '✓ Changes saved' : 'Click checkboxes to edit, then Save Changes →'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: ADMIN USERS ── */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>

              {/* Search + invite */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ position: 'relative' as const, flex: 1, maxWidth: 360 }}>
                  <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search admin users..."
                    style={{ width: '100%', padding: '8px 12px 8px 32px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
                <button onClick={() => alert('Invite Admin User — enter email and assign role. Coming soon.')}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', background: PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={14} /> Invite Admin User
                </button>
              </div>

              {/* Users table */}
              <div style={{ ...card, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.4fr 1fr 1.2fr 1fr', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2 }}>
                  {['User', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                    <div key={h} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{h}</div>
                  ))}
                </div>

                {/* Rows */}
                {filteredUsers.map((u, i) => {
                  const roleData = ROLES_DATA.find(r => r.id === (userRoleMap[u.email] || u.role))!
                  return (
                    <div key={u.email} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.4fr 1fr 1.2fr 1fr', padding: '12px 16px', borderBottom: i < filteredUsers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* User */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{u.avatar}</div>
                        <span style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 600 }}>{u.name}</span>
                      </div>

                      {/* Email */}
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{u.email}</div>

                      {/* Role — editable */}
                      <div>
                        {editingUser === u.email ? (
                          <select value={userRoleMap[u.email] || u.role}
                            onChange={e => { setUserRoleMap(prev => ({ ...prev, [u.email]: e.target.value })); setEditingUser(null); alert(`Role updated for ${u.name}`) }}
                            style={{ ...selStyle, fontSize: 13 }} autoFocus
                            onBlur={() => setEditingUser(null)}
                          >
                            {ROLES_DATA.map(r => <option key={r.id} value={r.id} style={{ background: BG3 }}>{r.name}</option>)}
                          </select>
                        ) : (
                          <span onClick={() => setEditingUser(u.email)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: `${roleData?.color || PURPLE}18`, border: `1px solid ${roleData?.color || PURPLE}40`, borderRadius: 12, fontSize: 13, color: roleData?.color || PURPLE, fontWeight: 600, cursor: 'pointer' }}>
                            {roleData?.icon} {roleData?.name}
                          </span>
                        )}
                      </div>

                      {/* Status — click to toggle */}
                      <div>
                        {(() => {
                          const currentStatus = userStatusMap[u.email] || u.status
                          const isActive = currentStatus === 'Active'
                          return (
                            <span
                              onClick={() => {
                                const next = isActive ? 'Inactive' : 'Active'
                                if (confirm(`Set ${u.name} as ${next}?`)) {
                                  setUserStatusMap(prev => ({ ...prev, [u.email]: next }))
                                }
                              }}
                              title={`Click to set ${isActive ? 'Inactive' : 'Active'}`}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: isActive ? `${GREEN}15` : 'rgba(107,114,128,0.15)', border: `1px solid ${isActive ? GREEN : '#6B7280'}40`, borderRadius: 12, fontSize: 13, color: isActive ? GREEN : '#9CA3AF', fontWeight: 600, cursor: 'pointer', userSelect: 'none' as const, transition: 'all 0.15s' }}
                              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? GREEN : '#6B7280', display: 'inline-block' }} />
                              {currentStatus}
                            </span>
                          )
                        })()}
                      </div>

                      {/* Last Login */}
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{u.lastLogin}</div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setEditingUser(u.email)} title="Change Role"
                          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        ><UserCog size={13} /></button>
                        <button onClick={() => router.push('/admin/users')} title="View in User Management"
                          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        ><Eye size={13} /></button>
                        <button onClick={() => { if (confirm(`Revoke access for ${u.name}?`)) setUserStatusMap(prev => ({ ...prev, [u.email]: 'Inactive' })) }} title="Revoke Access"
                          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, color: RED, cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                        ><Lock size={13} /></button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
                Showing {filteredUsers.length} of {USERS_LIST.length} admin users. Click a role badge to change it.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE ROLE MODAL ── */}
      {showNewRole && (
        <>
          <div onClick={() => setShowNewRole(false)} style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200 }} />
          <div style={{ position: 'fixed' as const, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 440, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: 28, zIndex: 201, boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
            <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: '#F5F5F5', marginBottom: 6 }}>Create New Role</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Define a new admin role and set permissions in the Permissions Matrix tab.</div>
            <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Role Name *</label>
            <input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="e.g. Finance Manager"
              style={{ width: '100%', padding: '10px 12px', background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14 }} />
            <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Description</label>
            <input placeholder="Brief description of this role's responsibilities"
              style={{ width: '100%', padding: '10px 12px', background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 14 }} />
            <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Base Permissions From</label>
            <select style={{ ...selStyle, width: '100%', marginBottom: 22, background: BG4 }}>
              {['Start from scratch', ...ROLES_DATA.map(r => r.name)].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNewRole(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { if (!newRoleName.trim()) { alert('Please enter a role name.'); return } setShowNewRole(false); setNewRoleName(''); setActiveTab('permissions'); alert(`Role "${newRoleName}" created! Set permissions in the matrix below.`) }}
                style={{ flex: 2, padding: '10px', background: PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Create Role & Set Permissions →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}