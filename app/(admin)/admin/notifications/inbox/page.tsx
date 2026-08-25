'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminTopnav from '@/components/layout/AdminTopnav'
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Database,
  Settings, ScrollText, Bell, ChevronRight, ChevronLeft,
  Menu, UserCheck, BellRing, Ticket, KeyRound,
  CheckCheck, Trash2, RefreshCw, ExternalLink, Filter,
} from 'lucide-react'

const BG      = '#0D1117'
const BG2     = '#131720'
const BG3     = '#181E2A'
const BG4     = '#1C2338'
const GOLD    = '#D4A64A'
const GOLD_DIM = 'rgba(212,166,74,0.12)'
const GOLD_BDR = 'rgba(212,166,74,0.22)'
const BEBAS   = "'Bebas Neue', sans-serif"
const BARLOW  = "'Barlow Condensed', sans-serif"
const GREEN   = '#22C55E'
const RED     = '#EF4444'
const BLUE    = '#3B82F6'
const PURPLE  = '#8B5CF6'
const ORANGE  = '#F97316'
const TEAL    = '#14B8A6'

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
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'        },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'            },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'              },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'             },
]

const TYPE_ICON: Record<string, string> = {
  casting_call_alert:   '🎬',
  profile_verified:     '✅',
  subscription_expiry:  '💳',
  payment_success:      '💰',
  payment_failure:      '❌',
  system_announcement:  '🔔',
  new_message:          '💬',
  application_update:   '📋',
  trust_score_update:   '⭐',
  audition_scheduled:   '📅',
  audition_reminder:    '⏰',
}

const TYPE_COLOR: Record<string, string> = {
  casting_call_alert:   PURPLE,
  profile_verified:     GREEN,
  subscription_expiry:  ORANGE,
  payment_success:      GREEN,
  payment_failure:      RED,
  system_announcement:  BLUE,
  new_message:          '#EC4899',
  application_update:   TEAL,
  trust_score_update:   GOLD,
  audition_scheduled:   PURPLE,
  audition_reminder:    ORANGE,
}

const TYPE_LABEL: Record<string, string> = {
  casting_call_alert:   'Casting Alert',
  profile_verified:     'Verification',
  subscription_expiry:  'Subscription',
  payment_success:      'Payment',
  payment_failure:      'Payment',
  system_announcement:  'System',
  new_message:          'Message',
  application_update:   'Application',
  trust_score_update:   'Trust Score',
  audition_scheduled:   'Audition',
  audition_reminder:    'Reminder',
}

const FILTER_TABS = ['All', 'Unread', 'System', 'Verification', 'Payment', 'Application']

function fmtDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60)   return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    const token = u.token ?? u.access_token ?? u.accessToken ?? ''
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch { return {} }
}

export default function AdminNotificationsInboxPage() {
  const router = useRouter()

  const [sidebarOpen,    setSidebarOpen]    = useState(false)
  const [notifications,  setNotifications]  = useState<any[]>([])
  const [loading,        setLoading]        = useState(true)
  const [activeFilter,   setActiveFilter]   = useState('All')
  const [unreadCount,    setUnreadCount]    = useState(0)
  const [refreshing,     setRefreshing]     = useState(false)

  const SB_W = sidebarOpen ? 220 : 52

  const fetchNotifications = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    try {
      const h = getAuthHeaders()
      const res = await fetch('/api/notifications?limit=100', { headers: h })
      if (!res.ok) return
      const d = await res.json()
      const list = d.data?.notifications ?? d.notifications ?? []
      setNotifications(list)
      setUnreadCount(d.data?.unread_count ?? list.filter((n: any) => !n.is_read).length)
    } catch (e) {
      console.error('Failed to fetch notifications', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(() => fetchNotifications(), 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  async function markRead(id: string) {
    try {
      const h = getAuthHeaders()
      await fetch('/api/notifications', {
        method:  'PUT',
        headers: { ...h, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ notification_id: id }),
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {}
  }

  async function markAllRead() {
    try {
      const h = getAuthHeaders()
      await fetch('/api/notifications', {
        method:  'PUT',
        headers: { ...h, 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      })
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch {}
  }

  async function deleteNotification(id: string) {
    try {
      const h = getAuthHeaders()
      await fetch(`/api/notifications?id=${id}`, { method: 'DELETE', headers: h })
      setNotifications(prev => prev.filter(n => n.id !== id))
      setUnreadCount(prev => {
        const wasUnread = notifications.find(n => n.id === id && !n.is_read)
        return wasUnread ? Math.max(0, prev - 1) : prev
      })
    } catch {}
  }

  async function clearAllRead() {
    try {
      const h = getAuthHeaders()
      await fetch('/api/notifications', { method: 'DELETE', headers: h })
      setNotifications(prev => prev.filter(n => !n.is_read))
    } catch {}
  }

  function handleClick(n: any) {
    markRead(n.id)
    if (n.action_url) router.push(n.action_url)
  }

  const filtered = notifications.filter(n => {
    if (activeFilter === 'Unread')       return !n.is_read
    if (activeFilter === 'System')       return n.type === 'system_announcement'
    if (activeFilter === 'Verification') return n.type === 'profile_verified' || n.title?.toLowerCase().includes('verif') || n.title?.toLowerCase().includes('document')
    if (activeFilter === 'Payment')      return n.type === 'payment_success' || n.type === 'payment_failure' || n.type === 'subscription_expiry'
    if (activeFilter === 'Application')  return n.type === 'application_update'
    return true
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, color: '#F5F5F5', fontFamily: BARLOW }}>
      <AdminTopnav />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', transition: 'width 0.2s ease', minHeight: 0 }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
              {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
            </button>
          </div>
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
              const active = href === '/admin/notifications'
              return (
                <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? GOLD_DIM : 'transparent', borderLeft: sidebarOpen ? `3px solid ${active ? GOLD : 'transparent'}` : 'none' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ marginLeft: 9, fontSize: 14, fontWeight: active ? 700 : 400, color: active ? GOLD : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{label}</span>}
                  {sidebarOpen && active && <ChevronRight size={12} color={GOLD} style={{ marginLeft: 'auto' }} opacity={0.6} />}
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span onClick={() => router.push('/admin/dashboard')} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Home</span>
                <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
                <span onClick={() => router.push('/admin/notifications')} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>Notifications</span>
                <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
                <span style={{ fontSize: 13, color: GOLD }}>My Inbox</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, fontWeight: 400, letterSpacing: 1, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                MY NOTIFICATIONS
                {unreadCount > 0 && (
                  <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, background: RED, color: '#fff', borderRadius: 20, padding: '2px 10px' }}>
                    {unreadCount} unread
                  </span>
                )}
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                Your personal notifications — verification requests, document uploads, system alerts.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => fetchNotifications(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} /> Refresh
              </button>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, color: GREEN, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  <CheckCheck size={13} /> Mark All Read
                </button>
              )}
              <button onClick={clearAllRead} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: RED, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                <Trash2 size={13} /> Clear Read
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            {FILTER_TABS.map(tab => {
              const count = tab === 'Unread' ? unreadCount :
                tab === 'All' ? notifications.length :
                notifications.filter(n => {
                  if (tab === 'System')       return n.type === 'system_announcement'
                  if (tab === 'Verification') return n.type === 'profile_verified' || n.title?.toLowerCase().includes('verif') || n.title?.toLowerCase().includes('document')
                  if (tab === 'Payment')      return n.type === 'payment_success' || n.type === 'payment_failure' || n.type === 'subscription_expiry'
                  if (tab === 'Application')  return n.type === 'application_update'
                  return false
                }).length
              const active = activeFilter === tab
              return (
                <button key={tab} onClick={() => setActiveFilter(tab)}
                  style={{ padding: '7px 16px', borderRadius: 20, border: `1px solid ${active ? GOLD : 'rgba(255,255,255,0.1)'}`, background: active ? GOLD_DIM : 'transparent', color: active ? GOLD : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, fontWeight: active ? 700 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {tab}
                  {count > 0 && <span style={{ background: active ? GOLD : 'rgba(255,255,255,0.15)', color: active ? '#000' : 'rgba(255,255,255,0.6)', borderRadius: 10, fontSize: 12, padding: '0 6px', fontWeight: 700 }}>{count}</span>}
                </button>
              )
            })}
          </div>

          {/* Notifications list */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'visible' }}>
            {loading ? (
              <div style={{ padding: 60, textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
                Loading your notifications...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center' as const }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>No notifications</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
                  {activeFilter === 'Unread' ? "You're all caught up!" : `No ${activeFilter.toLowerCase()} notifications found.`}
                </div>
              </div>
            ) : (
              filtered.map((n, i) => {
                const icon   = TYPE_ICON[n.type]  ?? '🔔'
                const color  = TYPE_COLOR[n.type] ?? BLUE
                const label  = TYPE_LABEL[n.type] ?? 'System'
                const isNew  = !n.is_read
                return (
                  <div key={n.id}
                    onClick={() => handleClick(n)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '18px 24px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: n.action_url ? 'pointer' : 'default', background: isNew ? 'rgba(59,130,246,0.04)' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = isNew ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = isNew ? 'rgba(59,130,246,0.04)' : 'transparent' }}
                  >
                    {/* Unread dot */}
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: isNew ? BLUE : 'transparent', flexShrink: 0, marginTop: 6 }} />

                    {/* Icon */}
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' as const }}>
                        <span style={{ fontSize: 15, fontWeight: isNew ? 700 : 600, color: isNew ? '#F5F5F5' : 'rgba(255,255,255,0.8)' }}>{n.title}</span>
                        <span style={{ padding: '2px 8px', background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 20, fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>{label}</span>
                        {isNew && <span style={{ padding: '2px 8px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, fontSize: 12, fontWeight: 700, color: BLUE, flexShrink: 0 }}>NEW</span>}
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 6 }}>{n.message}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{n.created_at ? fmtDate(n.created_at) : ''}</div>
                    </div>

                    {/* Action */}
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                      {n.action_url && (
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ExternalLink size={13} color={BLUE} />
                        </div>
                      )}
                      {isNew && (
                        <button onClick={e => { e.stopPropagation(); markRead(n.id) }}
                          style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          title="Mark as read">
                          <CheckCheck size={13} color={GREEN} />
                        </button>
                      )}
                      <button onClick={e => { e.stopPropagation(); deleteNotification(n.id) }}
                        style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title="Delete notification">
                        <Trash2 size={13} color={RED} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Summary footer */}
          {!loading && notifications.length > 0 && (
            <div style={{ textAlign: 'center' as const, fontSize: 13, color: 'rgba(255,255,255,0.3)', paddingBottom: 8 }}>
              Showing {filtered.length} of {notifications.length} notifications · Auto-refreshes every 30 seconds
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}