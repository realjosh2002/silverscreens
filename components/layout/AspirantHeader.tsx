'use client'

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
  const [userName,        setUserName]        = useState('')
  const [avatarUrl,       setAvatarUrl]       = useState('')
  const [isApproved,      setIsApproved]      = useState(false)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const ps = u?.profileStatus
      const approved = ps === 'approved' || ps === 'active'
      setIsApproved(approved)
      // Show name/avatar only if profile approved
      if (approved) {
        if (u.name)         setUserName(u.name)
        if (u.profilePhoto) setAvatarUrl(u.profilePhoto)
      }
    } catch {}
  }, [])

  useEffect(() => {
    // Fetch badge counts only for approved profiles
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const ps = u?.profileStatus
      if (ps !== 'approved' && ps !== 'active') return
      const fetchCounts = () => {
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
      }
      fetchCounts()
      const interval = setInterval(fetchCounts, 10000)
      return () => clearInterval(interval)
    } catch {}
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    window.location.replace('/login')
  }

  // My Profile → create-profile until approved, my-profile after
  const myProfileHref = isApproved ? '/my-profile' : '/create-profile'

  // Menu items — Settings only shown after approved
  const menuItems = [
    { label: 'My Profile', href: myProfileHref },
    ...(isApproved ? [
      { label: 'Subscription',   href: '/dashboard/subscription' },
      { label: 'Analytics',      href: '/analytics'              },
      { label: 'Calendar',       href: '/calendar'               },
      { label: 'Settings',       href: '/settings'               },
      { label: 'Help & Support', href: '/settings?tab=support'   },
    ] : []),
  ]

  return (
    <header style={{ height: 60, background: '#0B0F14', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0, position: 'relative', zIndex: 100 }}>
      <SilverScreensLogo size="md" href="/dashboard" showTagline={false} />
      <div style={{ flex: 1 }} />

      <button
        onClick={() => router.push(isApproved ? '/casting-calls' : '/create-profile')}
        title={isApproved ? undefined : 'Complete your profile to access casting calls'}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${isApproved ? '#D4A64A' : 'rgba(212,166,74,0.35)'}`, color: isApproved ? '#D4A64A' : 'rgba(212,166,74,0.45)', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif", cursor: 'pointer', whiteSpace: 'nowrap', opacity: isApproved ? 1 : 0.6 }}>
        {isApproved ? '+ Find Casting Calls' : '🔒 Find Casting Calls'}
      </button>

      {/* Messages */}
      <div onClick={() => router.push(isApproved ? '/messages' : '/create-profile')} style={{ position: 'relative', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare size={16} color={isApproved ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'} />
        </div>
        {isApproved && msgCount > 0 && (
          <div style={{ position: 'absolute', top: -5, right: -5, background: '#C8202A', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>
            {msgCount}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div onClick={() => router.push(isApproved ? '/notifications' : '/create-profile')} style={{ position: 'relative', cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={16} color={isApproved ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'} />
        </div>
        {isApproved && notifCount > 0 && (
          <div style={{ position: 'absolute', top: -5, right: -5, background: '#C8202A', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>
            {notifCount}
          </div>
        )}
      </div>

      {/* Profile dropdown */}
      <div style={{ position: 'relative' }}>
        <div onClick={() => setShowProfileMenu(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
          {avatarUrl
            ? <img src={avatarUrl} alt={userName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #D4A64A' }} />
            : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(200,32,42,0.15)', border: '2px solid rgba(212,166,74,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} color="#D4A64A" /></div>
          }
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5', lineHeight: 1.2 }}>
              {isApproved && userName ? userName : 'My Account'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Aspirant</div>
          </div>
          <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
        </div>

        {showProfileMenu && (
          <>
            <div onClick={() => setShowProfileMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
            <div style={{ position: 'absolute', top: 46, right: 0, width: 200, background: '#121821', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              {menuItems.map(({ label, href }) => (
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