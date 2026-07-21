'use client'

import Link from 'next/link'
import { Bell, MessageSquare, LogOut, User, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ? { Authorization: `Bearer ${u.token}` } : {}
  } catch { return {} }
}

export default function AspirantHeader() {
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [msgCount,        setMsgCount]        = useState(0)
  const [notifCount,      setNotifCount]      = useState(0)
  const [userName,        setUserName]        = useState('My Account')
  const [avatarUrl,       setAvatarUrl]       = useState('')

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u.name)         setUserName(u.name)
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto)
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
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    window.location.replace('/login')
  }

  return (
    <header style={{ height: 60, background: '#0B0F14', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0, position: 'relative', zIndex: 100 }}>
      <SilverScreensLogo size="md" href="/" showTagline={false} />
      <div style={{ flex: 1 }} />

      <button onClick={() => router.push('/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid #D4A64A', color: '#D4A64A', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap' }}>
        + Find Casting Calls
      </button>

      {/* Messages */}
      <div onClick={() => router.push('/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare size={16} color="rgba(255,255,255,0.7)" />
        </div>
        {msgCount > 0 && (
          <div style={{ position: 'absolute', top: -5, right: -5, background: '#C8202A', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>
            {msgCount}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div onClick={() => router.push('/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={16} color="rgba(255,255,255,0.7)" />
        </div>
        {notifCount > 0 && (
          <div style={{ position: 'absolute', top: -5, right: -5, background: '#C8202A', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>
            {notifCount}
          </div>
        )}
      </div>

      {/* Profile */}
      <div style={{ position: 'relative' }}>
        <div onClick={() => setShowProfileMenu(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          {avatarUrl
            ? <img src={avatarUrl} alt={userName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4A64A' }} />
            : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(200,32,42,0.15)', border: '2px solid rgba(212,166,74,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} color="#D4A64A" /></div>
          }
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5', lineHeight: 1.2 }}>{userName}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Aspirant</div>
          </div>
          <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
        </div>

        {showProfileMenu && (
          <>
            <div onClick={() => setShowProfileMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
            <div style={{ position: 'absolute', top: 46, right: 0, width: 200, background: '#121821', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              {[
                { label: 'My Profile',   href: '/my-profile'   },
                { label: 'Subscription', href: '/dashboard/subscription' },
                { label: 'Analytics',    href: '/analytics'    },
                { label: 'Calendar',     href: '/calendar'     },
                { label: 'Settings',     href: '/settings'     },
                { label: 'Support',      href: '/support'      },
              ].map(({ label, href }) => (
                <div key={label} onClick={() => { router.push(href); setShowProfileMenu(false) }}
                  style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif" }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >{label}</div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div onClick={handleLogout} style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Barlow Condensed', sans-serif" }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <LogOut size={14} /> Logout
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}