'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Film, Users, Mic2, Star, MessageSquare,
  BarChart2, CreditCard, Settings, ChevronLeft, Menu,
  PlusCircle, UserSearch, Bookmark, Bell, Lock,
} from 'lucide-react'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

const BG2   = '#0B0F14'
const RED   = '#C8202A'
const GOLD  = '#D4A64A'
const BEBAS = "'Bebas Neue', sans-serif"
const BAR   = "'Barlow Condensed', sans-serif"

// Items always visible regardless of verification status
const NAV_ALWAYS = [
  { label: 'Dashboard', href: '/agency/dashboard', icon: LayoutDashboard },
  { label: 'Support',   href: '/agency/support',   icon: MessageSquare   },
]

// Items only visible to approved agencies
const NAV_RESTRICTED = [
  { label: 'Create Casting Call',    href: '/agency/create-casting', icon: PlusCircle    },
  { label: 'Casting Calls List',     href: '/agency/casting-calls',  icon: Film          },
  { label: 'Talent Search',          href: '/agency/talent-search',  icon: UserSearch    },
  { label: 'Applications Management',href: '/agency/applications',   icon: Users         },
  { label: 'Shortlisted Talents',    href: '/agency/shortlisted',    icon: Star          },
  { label: 'Audition Management',    href: '/agency/auditions',      icon: Mic2          },
  { label: 'Saved Talents',          href: '/agency/saved-talents',  icon: Bookmark      },
  { label: 'Messages',               href: '/agency/messages',       icon: MessageSquare },
  { label: 'Notifications',          href: '/agency/notifications',  icon: Bell          },
]

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ? { Authorization: `Bearer ${u.token}` } : {}
  } catch { return {} }
}

export default function AgencySidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const [collapsed,          setCollapsed]          = useState(true)
  const [agencyName,         setAgencyName]         = useState('My Agency')
  const [agencyInitials,     setAgencyInitials]     = useState('AG')
  const [verificationStatus, setVerificationStatus] = useState<string>('pending')
  const [msgCount,           setMsgCount]           = useState(0)
  const [notifCount,         setNotifCount]         = useState(0)

  useEffect(() => {
    const h = getAuthHeaders()
    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const p = data.data?.profile ?? data.profile ?? data
        if (p.company_name ?? p.name) {
          const name = p.company_name ?? p.name
          setAgencyName(name)
          setAgencyInitials(name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase())
        }
        if (p.verification_status) setVerificationStatus(p.verification_status)
      }).catch(() => {})

    function fetchCounts() {
      const h2 = getAuthHeaders()
      fetch('/api/notifications', { headers: h2 })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return
          const list = data.data?.notifications ?? data.notifications ?? []
          if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length)
        }).catch(() => {})
      fetch('/api/messages/conversations', { headers: h2 })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return
          const list = data.data?.conversations ?? data.conversations ?? []
          if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length)
        }).catch(() => {})
    }
    fetchCounts()
    const iv = setInterval(fetchCounts, 30000)
    return () => clearInterval(iv)
  }, [])

  const isApproved = verificationStatus === 'approved' || verificationStatus === 'active'
  const SB_W = collapsed ? 52 : 230

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const getBadge = (label: string) => {
    if (label === 'Messages')     return msgCount   > 0 ? msgCount   : undefined
    if (label === 'Notifications') return notifCount > 0 ? notifCount : undefined
    return undefined
  }

  const NavItem = ({ item, locked = false }: { item: { label: string; href: string; icon: any }; locked?: boolean }) => {
    const Icon   = item.icon
    const active = isActive(item.href)
    const badge  = getBadge(item.label)

    return (
      <div
        key={item.label}
        onClick={() => !locked && router.push(item.href)}
        title={collapsed ? (locked ? `${item.label} — Available after verification` : item.label) : undefined}
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  collapsed ? 'center' : 'space-between',
          padding:         collapsed ? '10px 0' : '8px 10px',
          marginBottom:    2,
          borderRadius:    6,
          cursor:          locked ? 'not-allowed' : 'pointer',
          background:      active && !locked ? 'rgba(200,32,42,0.12)' : 'transparent',
          borderLeft:      !collapsed ? (active && !locked ? `3px solid ${RED}` : '3px solid transparent') : 'none',
          opacity:         locked ? 0.4 : 1,
          position:        'relative' as const,
        }}
        onMouseEnter={e => { if (!active && !locked) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { if (!active && !locked) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 9, justifyContent: 'center' }}>
          <Icon size={15} color={active && !locked ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active && !locked ? 2.5 : 1.8} />
          {!collapsed && (
            <span style={{ fontSize: 15, fontWeight: active && !locked ? 600 : 400, color: active && !locked ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' as const, fontFamily: BAR }}>
              {item.label}
            </span>
          )}
        </div>
        {!collapsed && locked && <Lock size={11} color="rgba(255,255,255,0.3)" />}
        {!collapsed && !locked && badge != null && (
          <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 11, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' as const }}>{badge}</div>
        )}
        {collapsed && !locked && badge != null && (
          <div style={{ position: 'absolute' as const, top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{badge}</div>
        )}
      </div>
    )
  }

  return (
    <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', transition: 'width 0.2s ease', height: '100vh' }}>

      {/* Toggle */}
      <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end', padding: collapsed ? 0 : '0 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <button onClick={() => setCollapsed(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >{collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}</button>
      </div>

      {/* Agency identity */}
      {!collapsed && (
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>{agencyInitials}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: BAR }}>{agencyName}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BAR }}>Agency</div>
          </div>
        </div>
      )}

      {/* Pending banner in sidebar */}
      {!collapsed && !isApproved && (
        <div style={{ margin: '10px 10px 4px', padding: '8px 10px', borderRadius: 8, background: 'rgba(212,166,74,0.08)', border: '1px solid rgba(212,166,74,0.2)', fontSize: 13, color: GOLD, fontFamily: BAR, lineHeight: 1.4 }}>
          ⏳ {verificationStatus === 'rejected' ? 'Profile rejected. Contact support.' : 'Pending verification. Full access after approval.'}
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: collapsed ? '8px 4px' : '8px 6px', overflowY: 'auto', scrollbarWidth: 'none' }}>
        {/* Always visible */}
        {NAV_ALWAYS.map(item => <NavItem key={item.label} item={item} locked={false} />)}

        {/* Divider */}
        {!collapsed && (
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 4px' }} />
        )}

        {/* Restricted items */}
        {NAV_RESTRICTED.map(item => (
          <NavItem key={item.label} item={item} locked={!isApproved} />
        ))}
      </nav>

      {/* Upgrade prompt — approved only */}
      {!collapsed && isApproved && (
        <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205,#2a1e0a)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center' as const }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 3, fontFamily: BAR }}>Upgrade to Pro</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5, fontFamily: BAR }}>Unlock advanced filters and AI matching.</div>
          <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BAR, cursor: 'pointer' }}>Upgrade Now</button>
        </div>
      )}
    </aside>
  )
}