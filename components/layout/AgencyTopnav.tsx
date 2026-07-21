'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Bell, MessageSquare, ChevronDown } from 'lucide-react'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

const PROFILE_MENU = [
  { label: 'Reports & Analytics',   href: '/agency/reports'       },
  { label: 'Subscription & Billing', href: '/agency/subscription'  },
  { label: 'Company Profile',        href: '/agency-profile'       },
  { label: 'Documents',              href: '/agency/documents'     },
  { label: 'Calendar',               href: '/agency/calendar'      },
  { label: 'Settings',               href: '/agency/settings'      },
  { label: 'Support',                href: '/contact'              },
]

const GOLD = '#D4A64A'
const RED  = '#C8202A'

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ? { Authorization: `Bearer ${u.token}` } : {}
  } catch { return {} }
}

export default function AgencyTopnav() {
  const router   = useRouter()
  const pathname = usePathname()

  const [profileOpen,    setProfileOpen]    = useState(false)
  const [msgCount,       setMsgCount]       = useState(0)
  const [notifCount,     setNotifCount]     = useState(0)
  const [agencyName,     setAgencyName]     = useState('My Agency')
  const [agencyInitials, setAgencyInitials] = useState('AG')
  const [agencyId,       setAgencyId]       = useState('AGE·········')
  const [agencyType,     setAgencyType]     = useState('Production House')

  const profileBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileBtnRef.current && !profileBtnRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u.name) {
        setAgencyName(u.name)
        setAgencyInitials(u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase())
      }
      if (u.profileNumber) setAgencyId(u.profileNumber)
    } catch {}

    const h = getAuthHeaders()

    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const count = data.data?.unread_count ?? data.unread_count
        if (count != null) { setNotifCount(count); return }
        const list = data.data?.notifications ?? data.notifications ?? []
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length)
      }).catch(() => {})

    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.data?.conversations ?? data.conversations ?? []
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length)
      }).catch(() => {})

    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const p = data.data?.profile ?? data.profile ?? data
        if (p.company_name || p.name) {
          const name = p.company_name ?? p.name
          setAgencyName(name)
          setAgencyInitials(name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase())
        }
        if (p.profile_number ?? p.profileNumber) setAgencyId(p.profile_number ?? p.profileNumber)
        if (p.company_type  ?? p.companyType)    setAgencyType(p.company_type ?? p.companyType)
      }).catch(() => {})
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    window.location.replace('/login')
  }

  return (
    <header style={{ height: 60, background: '#0B0F14', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 14, flexShrink: 0, position: 'relative', zIndex: 100 }}>
      <SilverScreensLogo size="md" href="/" showTagline={false} />
      <div style={{ flex: 1 }} />

      {/* Post a Casting */}
      <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
        Post a Casting <span style={{ fontSize: 16, fontWeight: 400 }}>+</span>
      </button>

      {/* Messages */}
      <div onClick={() => router.push('/agency/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
        </div>
        {msgCount > 0 && (
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>
            {msgCount}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={15} color="rgba(255,255,255,0.7)" />
        </div>
        {notifCount > 0 && (
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>
            {notifCount}
          </div>
        )}
      </div>

      {/* Profile */}
      <div ref={profileBtnRef} style={{ position: 'relative' }}>
        <div onClick={() => setProfileOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: "'Bebas Neue', sans-serif" }}>
            {agencyInitials}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5', lineHeight: 1.2 }}>{agencyName}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{agencyType}</div>
          </div>
          <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
        </div>

        {profileOpen && (
          <>
            <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
            <div style={{ position: 'absolute', top: 46, right: 0, width: 220, background: '#121821', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Agency ID</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{agencyId}</span>
              </div>
              {PROFILE_MENU.map(({ label, href }) => (
                <div key={label} onClick={() => { router.push(href); setProfileOpen(false) }}
                  style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: pathname === href ? GOLD : '#F5F5F5', background: pathname === href ? 'rgba(212,166,74,0.08)' : 'transparent', fontFamily: "'Barlow Condensed', sans-serif" }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = pathname === href ? 'rgba(212,166,74,0.08)' : 'transparent')}
                >{label}</div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div onClick={handleLogout} style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: '#ff6b6b', fontFamily: "'Barlow Condensed', sans-serif" }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >Logout</div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}