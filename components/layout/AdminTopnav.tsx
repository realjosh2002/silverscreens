'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Bell, MessageSquare, ChevronDown } from 'lucide-react'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

const BG2   = '#0B0F14'
const BG3   = '#121821'
const RED   = '#C8202A'
const GOLD  = '#D4A64A'
const BARLOW = "'Barlow Condensed', sans-serif"
const BEBAS  = "'Bebas Neue', sans-serif"

const PROFILE_MENU = [
  { label: 'My Profile',               href: '/admin/profile'          },
  { label: 'Account Settings',         href: '/admin/account-settings' },
  { label: 'Security & Login',         href: '/admin/security-login'   },
  { label: 'Activity Log',             href: '/admin/activity-log'     },
  { label: 'Help & Support',           href: '/admin/help-support'     },
  { label: 'Logout',                   href: '/admin/login'            },
]

function getAuthHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem('ss_user') || sessionStorage.getItem('ss_user') || '{}'
    const u = JSON.parse(raw)
    const token = u.token ?? u.access_token ?? u.accessToken ?? ''
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch { return {} }
}

export default function AdminTopnav() {
  const router   = useRouter()
  const pathname = usePathname()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifCount,  setNotifCount]  = useState(0)
  const [msgCount,    setMsgCount]    = useState(0)
  const [adminName,   setAdminName]   = useState('Administrator')
  const [adminId,     setAdminId]     = useState('Admin')

  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    // Load admin name from session
    try {
      const raw = localStorage.getItem('ss_user') || sessionStorage.getItem('ss_user') || '{}'
      const u = JSON.parse(raw)
      if (u.name) setAdminName(u.name)
      if (u.adminRole) setAdminId(u.adminRole === 'verifier' ? 'Verifier' : 'Admin')
    } catch {}

    function fetchCounts() {
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

      fetch('/api/support?limit=1', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return
          const count = data.data?.unread ?? data.data?.open_count ?? data.unread ?? 0
          setMsgCount(count)
        }).catch(() => {})
    }

    fetchCounts()
    const interval = setInterval(fetchCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    sessionStorage.removeItem('ss_user')
    window.location.replace('/admin/login')
  }

  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
      <SilverScreensLogo size="md" href="/admin/dashboard" showTagline={false} />
      <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
        <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Support tickets */}
      <div onClick={() => router.push('/admin/support')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
        </div>
        {msgCount > 0 && (
          <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>
            {msgCount > 99 ? '99+' : msgCount}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div onClick={() => router.push('/admin/notifications/inbox')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={15} color="rgba(255,255,255,0.7)" />
        </div>
        {notifCount > 0 && (
          <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>
            {notifCount > 99 ? '99+' : notifCount}
          </div>
        )}
      </div>

      {/* Avatar + profile dropdown */}
      <div ref={profileRef} style={{ position: 'relative' as const }}>
        <div onClick={() => setProfileOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(212,166,74,0.38)', flexShrink: 0, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>
            {adminName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2, color: '#F5F5F5' }}>{adminName}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
          </div>
          <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
        </div>

        {profileOpen && (
          <>
            <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed' as const, inset: 0, zIndex: 150 }} />
            <div style={{ position: 'absolute' as const, top: 46, right: 0, width: 220, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Role</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: RED, fontFamily: BARLOW }}>{adminId}</span>
              </div>
              {PROFILE_MENU.map(({ label, href }) => (
                <div key={label}
                  onClick={() => { if (label === 'Logout') { handleLogout() } else { router.push(href); setProfileOpen(false) } }}
                  style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : pathname === href ? GOLD : '#F5F5F5', background: pathname === href ? 'rgba(212,166,74,0.08)' : 'transparent', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none', fontFamily: BARLOW }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = label === 'Logout' ? 'transparent' : pathname === href ? 'rgba(212,166,74,0.08)' : 'transparent')}
                >{label}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  )
}