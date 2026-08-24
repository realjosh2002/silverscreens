'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminTopnav from '@/components/layout/AdminTopnav'
import AdminSidebar from '@/components/layout/AdminSidebar'
import {
  Search, Download, ChevronRight, Shield, Settings,
  LogIn, AlertTriangle, RefreshCw, Eye, Filter, Clock,
} from 'lucide-react'

const GOLD       = '#D4A64A'
const GREEN      = '#22C55E'
const BLUE       = '#3B82F6'
const RED        = '#C8202A'
const ORANGE     = '#F97316'
const PURPLE     = '#8B5CF6'
const BG         = '#0D1117'
const BG2        = '#131720'
const BG3        = '#181E2A'
const BEBAS      = "'Bebas Neue', sans-serif"
const BARLOW     = "'Barlow Condensed', sans-serif"
const BORDER     = '#252C3A'
const TEXT_MUTED = '#8B93A3'

const sel: React.CSSProperties = {
  padding: '8px 12px', background: BG3, border: `1px solid ${BORDER}`,
  borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14,
  outline: 'none', cursor: 'pointer',
}

// Map action strings to icons and colors
function getActionMeta(action: string, status: string) {
  const a = action.toLowerCase()
  if (a.includes('login') || a.includes('sign'))   return { icon: LogIn,        color: status === 'failed' ? RED : GREEN }
  if (a.includes('setting') || a.includes('config'))return { icon: Settings,     color: BLUE   }
  if (a.includes('view') || a.includes('read'))     return { icon: Eye,          color: PURPLE }
  if (a.includes('approv'))                         return { icon: Shield,        color: ORANGE }
  if (a.includes('fail') || a.includes('error'))    return { icon: AlertTriangle, color: RED    }
  if (a.includes('refresh') || a.includes('update'))return { icon: RefreshCw,    color: BLUE   }
  if (a.includes('export') || a.includes('download'))return { icon: Download,    color: GREEN  }
  return { icon: Clock, color: TEXT_MUTED }
}

function getAuthHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem('ss_user')
    if (raw) {
      const u = JSON.parse(raw)
      const token = u.token ?? u.access_token ?? ''
      if (token) return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    }
    const sbKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    if (sbKey) {
      const sbData = JSON.parse(localStorage.getItem(sbKey) || '{}')
      const token = sbData?.access_token ?? ''
      if (token) return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    }
  } catch {}
  return { 'Content-Type': 'application/json' }
}

type Activity = {
  id: string
  action: string
  entity_type: string | null
  module: string | null
  status: string | null
  ip_address: string | null
  created_at: string
  description: string
}

export default function ActivityLogPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [mod,        setMod]        = useState('All Modules')
  const [status,     setStatus]     = useState('All Status')
  const [view,       setView]       = useState<'timeline' | 'table'>('timeline')
  const [stats,      setStats]      = useState({ total: 0, logins: 0, security: 0, config: 0 })

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const headers = getAuthHeaders()
        const res = await fetch('/api/admin/activity-log', { headers })
        const data = await res.json()
        if (res.ok && data?.data?.activities) {
          const acts: Activity[] = data.data.activities
          setActivities(acts)
          setStats({
            total:    acts.length,
            logins:   acts.filter(a => a.action.toLowerCase().includes('login')).length,
            security: acts.filter(a => a.action.toLowerCase().includes('fail') || a.action.toLowerCase().includes('security')).length,
            config:   acts.filter(a => a.action.toLowerCase().includes('setting') || a.action.toLowerCase().includes('config') || a.action.toLowerCase().includes('update')).length,
          })
        }
      } catch (e) {
        console.error('Activity load error:', e)
      }
      setLoading(false)
    }
    load()
  }, [])

  const modules = ['All Modules', ...Array.from(new Set(activities.map(a => a.module || 'Other').filter(Boolean)))]

  const filtered = activities.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !search || a.action.toLowerCase().includes(q) || (a.description || '').toLowerCase().includes(q) || (a.entity_type || '').toLowerCase().includes(q)
    const matchMod    = mod    === 'All Modules' || (a.module || 'Other') === mod
    const matchStatus = status === 'All Status'  || (a.status || 'success').toLowerCase() === status.toLowerCase()
    return matchSearch && matchMod && matchStatus
  })

  function exportCSV() {
    const csv = ['Time,Action,Description,Module,Status,IP',
      ...filtered.map(a => `"${new Date(a.created_at).toLocaleString()}","${a.action}","${a.description}","${a.module || ''}","${a.status || ''}","${a.ip_address || ''}"`)
    ].join('\n')
    const el = document.createElement('a')
    el.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    el.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`
    el.click()
  }

  function formatTime(iso: string) {
    try { return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } catch { return '' }
  }

  function formatDate(iso: string) {
    try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
  }

  function groupByDate(acts: Activity[]) {
    const groups: Record<string, Activity[]> = {}
    acts.forEach(a => {
      const date = formatDate(a.created_at)
      if (!groups[date]) groups[date] = []
      groups[date].push(a)
    })
    return groups
  }

  const grouped = groupByDate(filtered)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AdminTopnav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar />
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 40px' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}>Home</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Activity Log</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: '0 0 4px' }}>ACTIVITY LOG</h1>
              <p style={{ fontSize: 14, color: TEXT_MUTED, margin: 0 }}>View your personal activity history, logins, changes and actions performed on the platform.</p>
            </div>
            <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: BG2, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
              <Download size={14} /> Export Activity
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            {[
              { l: 'TOTAL ACTIVITIES', v: stats.total.toLocaleString(), s: 'All time',       c: GREEN  },
              { l: 'LOGIN EVENTS',     v: stats.logins.toString(),      s: 'All time',       c: BLUE   },
              { l: 'SECURITY EVENTS',  v: stats.security.toString(),    s: 'All time',       c: RED    },
              { l: 'CONFIG CHANGES',   v: stats.config.toString(),      s: 'All time',       c: ORANGE },
            ].map(card => (
              <div key={card.l} style={{ flex: 1, background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 6 }}>{card.l}</div>
                <div style={{ fontFamily: BEBAS, fontSize: 32, color: '#F5F5F5' }}>{loading ? '—' : card.v}</div>
                <div style={{ fontSize: 13, color: card.c, marginTop: 4 }}>{card.s}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' as const }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={13} color={TEXT_MUTED} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities..."
                style={{ width: '100%', padding: '8px 10px 8px 30px', background: BG3, border: `1px solid ${BORDER}`, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <select value={mod} onChange={e => setMod(e.target.value)} style={sel}>
              {modules.map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)} style={sel}>
              {['All Status', 'Success', 'Failed'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
            </select>
            <button onClick={() => setView(v => v === 'timeline' ? 'table' : 'timeline')}
              style={{ padding: '8px 14px', background: BG3, border: `1px solid ${BORDER}`, borderRadius: 7, color: TEXT_MUTED, cursor: 'pointer', fontFamily: BARLOW, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={13} /> {view === 'timeline' ? 'View as Table' : 'View as Timeline'}
            </button>
          </div>

          {/* Content */}
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: TEXT_MUTED }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${BORDER}`, borderTop: `3px solid ${GOLD}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                Loading activity log...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: TEXT_MUTED }}>No activities match your filters.</div>
            ) : view === 'timeline' ? (
              <div>
                {Object.entries(grouped).map(([date, acts]) => (
                  <div key={date}>
                    <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 0.5, marginBottom: 16, color: GOLD }}>
                      ACTIVITY TIMELINE — {date.toUpperCase()}
                    </div>
                    {acts.map((a, i) => {
                      const { icon: Icon, color } = getActionMeta(a.action, a.status || '')
                      const isSuccess = (a.status || 'success').toLowerCase() !== 'failed'
                      return (
                        <div key={a.id} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: `1px solid ${BORDER}` }}>
                          <div style={{ fontSize: 13, color: TEXT_MUTED, minWidth: 70, paddingTop: 2 }}>{formatTime(a.created_at)}</div>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={16} color={color} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 600 }}>{a.action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                            {a.description && <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 2 }}>{a.description}</div>}
                            {a.ip_address && <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>IP: {a.ip_address}</div>}
                          </div>
                          <div style={{ fontSize: 13, color: TEXT_MUTED }}>{a.module || a.entity_type || ''}</div>
                          <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: `${isSuccess ? GREEN : RED}22`, color: isSuccess ? GREEN : RED, alignSelf: 'center' as const }}>
                            {isSuccess ? 'Success' : 'Failed'}
                          </span>
                        </div>
                      )
                    })}
                    <div style={{ marginBottom: 24 }} />
                  </div>
                ))}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ background: BG3 }}>
                    {['Time', 'Action', 'Description', 'Module', 'IP Address', 'Status'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, color: TEXT_MUTED, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => {
                    const isSuccess = (a.status || 'success').toLowerCase() !== 'failed'
                    return (
                      <tr key={a.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>{new Date(a.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                        <td style={{ padding: '12px 14px', fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{a.action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: TEXT_MUTED }}>{a.description || '—'}</td>
                        <td style={{ padding: '12px 14px', fontSize: 13, color: TEXT_MUTED }}>{a.module || a.entity_type || '—'}</td>
                        <td style={{ padding: '12px 14px', fontSize: 12, color: TEXT_MUTED, fontFamily: 'monospace' }}>{a.ip_address || '—'}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: `${isSuccess ? GREEN : RED}22`, color: isSuccess ? GREEN : RED }}>{isSuccess ? 'Success' : 'Failed'}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}