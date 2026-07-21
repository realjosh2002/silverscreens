'use client'

import AspirantHeader from '@/components/layout/AspirantHeader'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {

  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark,
  Star, Bell, Crown, ChevronRight, ChevronLeft, Menu, Plus,
  Clock, MapPin, Calendar, ExternalLink,
} from 'lucide-react'

/* ── CONSTANTS ───────────────────────────────────────────────── */
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const GREEN  = '#22C55E'
const PURPLE = '#8B5CF6'
const BLUE   = '#3B82F6'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BG4    = '#1C2030'
const BARLOW = '"Barlow Condensed", sans-serif'
const BEBAS  = "'Bebas Neue', sans-serif"

/* ── SIDEBAR ─────────────────────────────────────────────────── */
const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard',             href: '/dashboard' },
  { icon: FileText,        label: 'My Applications',       href: '/applications' },
  { icon: MessageSquare,   label: 'Messages',   badge: 2,  href: '/messages' },
  { icon: Mic2,            label: 'Auditions',             href: '/auditions' },
  { icon: Bookmark,        label: 'Saved Castings',        href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings',  href: '/recommended' },
  { icon: Bell,            label: 'Notifications', href: '/notifications' },

]

const dropdownLinks = [
  { label: 'Subscription', href: '/dashboard/subscription' },
  { label: 'Analytics',    href: '/analytics' },
  { label: 'Calendar',     href: '/calendar' },
  { label: 'Settings',     href: '/settings' },
  { label: 'Support',      href: '/contact' },
  { label: 'Logout',       href: '/login' },
]

/* ── EVENT TYPES ─────────────────────────────────────────────── */
const EVENT_TYPES = [
  { key: 'audition',  label: 'Audition',          color: GREEN  },
  { key: 'callback',  label: 'Callback',           color: GOLD   },
  { key: 'workshop',  label: 'Workshop / Class',   color: PURPLE },
  { key: 'meeting',   label: 'Meeting / Other',    color: BLUE   },
  { key: 'important', label: 'Important',          color: RED    },
]

function eventColor(type: string) {
  return EVENT_TYPES.find(e => e.key === type)?.color ?? BLUE
}

/* ── MOCK EVENTS ─────────────────────────────────────────────── */
const EVENTS: Record<string, { type: string; title: string; time: string }[]> = {
  '2024-05-01': [{ type: 'audition',  title: 'City of Dreams',       time: '11:00 AM' }],
  '2024-05-04': [{ type: 'workshop',  title: 'Acting Basics',        time: '4:00 PM'  }],
  '2024-05-06': [{ type: 'meeting',   title: 'Meeting with Agent',   time: '3:00 PM'  }],
  '2024-05-08': [{ type: 'callback',  title: 'The Silent Witness',   time: '2:30 PM'  }],
  '2024-05-11': [{ type: 'important', title: 'Self Tape: Love in Rewind', time: '10:00 AM' }],
  '2024-05-14': [{ type: 'audition',  title: 'Rangbaaz: Dobara',     time: '11:00 AM' }],
  '2024-05-17': [{ type: 'meeting',   title: 'Fitness Session',      time: '6:00 PM'  }],
  '2024-05-21': [{ type: 'meeting',   title: 'Portfolio Shoot Studio 7', time: '9:00 AM' }],
  '2024-05-22': [{ type: 'audition',  title: 'Broken Silence',       time: '1:00 PM'  }],
  '2024-05-24': [{ type: 'workshop',  title: 'Camera Acting',        time: '5:00 PM'  }],
  '2024-05-27': [{ type: 'callback',  title: 'City of Dreams',       time: '9:30 AM'  }],
}

const UPCOMING = [
  { type: 'audition',  day: 'TUE', date: '14', month: 'MAY', title: 'Rangbaaz: Dobara',  time: '11:00 AM', loc: 'Red Frame Studios, Andheri'       },
  { type: 'audition',  day: 'WED', date: '22', month: 'MAY', title: 'Broken Silence',    time: '01:00 PM', loc: 'Film City Studio, Goregaon'        },
  { type: 'callback',  day: 'MON', date: '27', month: 'MAY', title: 'City of Dreams',    time: '09:30 AM', loc: 'Silver Paradise Studio, Stage 3'   },
  { type: 'workshop',  day: 'SAT', date: '01', month: 'JUN', title: 'Advanced Acting',   time: '04:00 PM', loc: 'Acting Institute, Bandra'          },
]

/* ── HELPERS ─────────────────────────────────────────────────── */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate() }
function firstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay() }

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/* ── ADD EVENT MODAL ─────────────────────────────────────────── */
function AddEventModal({ onClose, defaultDate, existingEvent, onSave }: {
  onClose: () => void
  defaultDate: string
  existingEvent?: { title: string; type: string; time: string; loc?: string } | null
  onSave: (event: { title: string; type: string; date: string; time: string; loc: string }) => void
}) {
  const [title, setTitle] = useState(existingEvent?.title ?? '')
  const [type,  setType]  = useState(existingEvent?.type  ?? 'audition')
  const [date,  setDate]  = useState(defaultDate)
  const [time,  setTime]  = useState(() => {
    const t = existingEvent?.time ?? '10:00'
    // Convert "11:00 AM" → "11:00", "02:00 PM" → "14:00"
    const match = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (!match) return '10:00'
    let h = parseInt(match[1])
    const m = match[2]
    const ampm = match[3]?.toUpperCase()
    if (ampm === 'PM' && h < 12) h += 12
    if (ampm === 'AM' && h === 12) h = 0
    return `${String(h).padStart(2, '0')}:${m}`
  })
  const [loc,   setLoc]   = useState(existingEvent?.loc ?? '')

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title ?? '')
      setType(existingEvent.type ?? 'audition')
      setLoc(existingEvent.loc ?? '')
      const t = existingEvent.time ?? '10:00'
      const match = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
      if (match) {
        let h = parseInt(match[1])
        const m = match[2]
        const ampm = match[3]?.toUpperCase()
        if (ampm === 'PM' && h < 12) h += 12
        if (ampm === 'AM' && h === 12) h = 0
        setTime(`${String(h).padStart(2, '0')}:${m}`)
      }
    }
  }, [existingEvent])

  const isEdit = !!existingEvent
  const inp = { width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '10px 12px', color: '#fff', fontSize: 15, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: `linear-gradient(135deg, ${BG2}, ${BG3})`, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 460, width: '100%', position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, borderRadius: '16px 16px 0 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>{isEdit ? 'Edit Event' : 'Add Event'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Event Title</div>
            <input placeholder="e.g. Audition for City of Dreams" value={title} onChange={e => setTitle(e.target.value)} style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Type</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              {EVENT_TYPES.map(et => (
                <button key={et.key} onClick={() => setType(et.key)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: type === et.key ? `rgba(${et.color === GREEN ? '34,197,94' : et.color === GOLD ? '212,166,74' : et.color === PURPLE ? '139,92,246' : et.color === BLUE ? '59,130,246' : '200,32,42'},0.15)` : 'rgba(255,255,255,0.04)', border: `1px solid ${type === et.key ? et.color : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, padding: '5px 12px', cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color: type === et.key ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: et.color, flexShrink: 0 }} />
                  {et.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Date</div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inp, colorScheme: 'dark' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Time</div>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ ...inp, colorScheme: 'dark' }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Location</div>
            <input placeholder="Studio / venue name" value={loc} onChange={e => setLoc(e.target.value)} style={inp} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
          <button onClick={onClose} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onSave({ title, type, date, time, loc }); onClose() }} style={{ flex: 1, background: RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>{isEdit ? 'Update Event' : 'Save Event'}</button>
        </div>
      </div>
    </div>
  )
}

/* ── MAIN PAGE ───────────────────────────────────────────────── */
export default function CalendarPage() {
  const router = useRouter()
  const now    = new Date()

  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const SB_W = sidebarOpen ? 210 : 56
  const [dropOpen,    setDropOpen]    = useState(false)
  const [year,        setYear]        = useState(now.getFullYear())
  const [month,       setMonth]       = useState(now.getMonth())
  const [view,        setView]        = useState<'month'|'week'|'list'>('month')
  const [showAdd,     setShowAdd]     = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<{ title: string; type: string; time: string } | null>(null)

  const handleSave = (evt: { title: string; type: string; date: string; time: string; loc: string }) => {
    const key = evt.date
    setEvents(prev => {
      const existing = prev[key] ?? []
      if (selectedEvent) {
        // Update existing event
        return { ...prev, [key]: existing.map(e => e.title === selectedEvent.title ? { type: evt.type, title: evt.title, time: evt.time } : e) }
      } else {
        // Add new event
        return { ...prev, [key]: [...existing, { type: evt.type, title: evt.title, time: evt.time }] }
      }
    })
    setSelectedEvent(null)
  }
  const [filters,     setFilters]     = useState({ audition: true, callback: true, workshop: true, meeting: true, important: true })
  const [events,      setEvents]      = useState<Record<string, { type: string; title: string; time: string }[]>>(EVENTS)
  const [upcoming,    setUpcoming]    = useState(UPCOMING)

  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  // Fetch real auditions and merge into calendar events
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    const token = u.token
    if (!token) return
    fetch('/api/auditions?limit=100', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.data?.auditions ?? data.auditions ?? []
        if (!Array.isArray(list) || list.length === 0) return
        const newEvents: Record<string, { type: string; title: string; time: string }[]> = { ...EVENTS }
        const newUpcoming: typeof UPCOMING = []
        list.forEach((a: any) => {
          const cc = a.casting_calls ?? {}
          const scheduledAt = a.scheduled_at ? new Date(a.scheduled_at) : null
          if (!scheduledAt) return
          const key = `${scheduledAt.getFullYear()}-${String(scheduledAt.getMonth() + 1).padStart(2, '0')}-${String(scheduledAt.getDate()).padStart(2, '0')}`
          const timeStr = scheduledAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          if (!newEvents[key]) newEvents[key] = []
          newEvents[key].push({ type: 'audition', title: cc.title ?? 'Audition', time: timeStr })
          if (scheduledAt >= now) {
            newUpcoming.push({
              type:  'audition',
              day:   scheduledAt.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase(),
              date:  String(scheduledAt.getDate()).padStart(2, '0'),
              month: scheduledAt.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
              title: cc.title ?? 'Audition',
              time:  timeStr,
              loc:   a.venue_details ?? (a.mode === 'online' ? 'Video Call' : ''),
            })
          }
        })
        setEvents(newEvents)
        setUpcoming(newUpcoming.sort((a, b) => parseInt(a.date) - parseInt(b.date)))
      })
      .catch(() => {})
  }, [])

  const toggleFilter = (key: string) => setFilters(f => ({ ...f, [key]: !f[key as keyof typeof f] }))

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const totalDays   = daysInMonth(year, month)
  const firstDay    = firstDayOfMonth(year, month)
  const totalCells  = Math.ceil((firstDay + totalDays) / 7) * 7

  // Filtered events
  const visibleEvents = (key: string) => {
    const evts = events[key] || []
    return evts.filter(e => filters[e.type as keyof typeof filters])
  }

  // List view: all events this month sorted by date
  const listEvents = Object.entries(events)
    .filter(([k]) => k.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
    .flatMap(([k, evts]) => evts.filter(e => filters[e.type as keyof typeof filters]).map(e => ({ ...e, dateKey: k, dayNum: parseInt(k.split('-')[2]) })))
    .sort((a, b) => a.dayNum - b.dayNum)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, color: '#F5F5F5', fontFamily: BARLOW, overflow: 'hidden' }}>
      {showAdd && <AddEventModal onClose={() => { setShowAdd(false); setSelectedEvent(null) }} defaultDate={selectedDay || today} existingEvent={selectedEvent} onSave={handleSave} />}

      {/* ── TOPNAV ── */}
      <AspirantHeader />

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR — now collapsible ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen((v: boolean) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {/* User card — only when expanded */}
          {sidebarOpen && (
            <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face" alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}` }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#3B82F6', border: `2px solid ${BG2}` }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Arjun Malhotra <span style={{ color: '#3B82F6', fontSize: 14 }}>✔</span>
                </div>
                <div style={{ fontSize: 14, color: RED, cursor: 'pointer' }} onClick={() => router.push('/profile')}>View Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: '8px 0' }}>
            {sidebarItems.map(({ icon: Icon, label, active, badge, href }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '9px 14px' : '10px 0', cursor: 'pointer', background: active ? 'rgba(200,32,42,0.1)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : '3px solid transparent' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.45)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 15, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 700 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' as const }}>{badge}</div>}
              </div>
            ))}
          </nav>
          {/* Go Premium */}
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 10, background: 'linear-gradient(135deg, #1a0507, #2a0b0e)', border: '1px solid rgba(200,32,42,0.25)', padding: '14px 12px', textAlign: 'center' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 5 }}>⭐</div>
              <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Go Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 12, lineHeight: 1.55 }}>Unlock more opportunities and advance your career.</div>
              <button onClick={() => router.push('/dashboard/subscription')} style={{ width: '100%', background: RED, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '100%' }}>

            {/* ── CALENDAR AREA ── */}
            <div style={{ flex: 1, minWidth: 0, padding: '24px 20px 40px', display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

              {/* Page header */}
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 2, color: '#fff', margin: '0 0 4px' }}>My Calendar</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, margin: 0 }}>Manage your auditions, callbacks, meetings and important dates.</p>
              </div>

              {/* Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
                {/* View toggle */}
                <div style={{ display: 'flex', background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
                  {(['month','week','list'] as const).map(v => (
                    <button key={v} onClick={() => setView(v)} style={{ padding: '8px 16px', border: 'none', background: view === v ? GOLD : 'transparent', color: view === v ? '#050505' : 'rgba(255,255,255,0.55)', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', borderRight: v !== 'list' ? '1px solid rgba(255,255,255,0.07)' : 'none', transition: 'all 0.15s' }}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Today */}
                <button onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()) }} style={{ padding: '8px 16px', background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer' }}>Today</button>

                {/* Nav arrows */}
                <button onClick={prevMonth} style={{ width: 34, height: 34, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}><ChevronLeft size={16} /></button>
                <button onClick={nextMonth} style={{ width: 34, height: 34, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}><ChevronRight size={16} /></button>

                <div style={{ flex: 1 }} />

                {/* Add Event */}
                <button onClick={() => { setSelectedDay(today); setShowAdd(true) }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: `1px solid ${GOLD}`, borderRadius: 8, padding: '8px 18px', color: GOLD, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={15} /> Add Event
                </button>
              </div>

              {/* Month label */}
              <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 2, color: '#fff', textAlign: 'center' as const }}>
                {MONTHS[month]} {year}
              </div>

              {/* ── MONTH VIEW ── */}
              {view === 'month' && (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
                  {/* Day headers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {DAYS.map(d => (
                      <div key={d} style={{ padding: '10px 0', textAlign: 'center' as const, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>{d}</div>
                    ))}
                  </div>
                  {/* Grid cells */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {Array.from({ length: totalCells }, (_, i) => {
                      const dayNum = i - firstDay + 1
                      const isCurrentMonth = dayNum >= 1 && dayNum <= totalDays
                      const key = dateKey(year, month, dayNum)
                      const isToday = key === today
                      const evts = isCurrentMonth ? visibleEvents(key) : []
                      const colIndex = i % 7

                      return (
                        <div key={i} onClick={() => { if (isCurrentMonth) { setSelectedDay(key); setShowAdd(true) } }}
                          style={{ minHeight: 110, padding: '8px 6px 6px', borderRight: colIndex < 6 ? '1px solid rgba(255,255,255,0.04)' : 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', background: isToday ? 'rgba(212,166,74,0.05)' : 'transparent', cursor: isCurrentMonth ? 'pointer' : 'default', transition: 'background 0.15s' }}
                          onMouseEnter={e => { if (isCurrentMonth && !isToday) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                          onMouseLeave={e => { if (!isToday) e.currentTarget.style.background = 'transparent' }}
                        >
                          {/* Day number */}
                          <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4, background: isToday ? GOLD : 'transparent', fontSize: 14, fontFamily: BARLOW, fontWeight: isToday ? 700 : 400, color: isToday ? '#050505' : isCurrentMonth ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}>
                            {isCurrentMonth ? dayNum : dayNum < 1 ? daysInMonth(year, month === 0 ? 11 : month - 1) + dayNum : dayNum - totalDays}
                          </div>
                          {/* Events */}
                          {evts.slice(0, 2).map((evt, ei) => (
                            <div key={ei} onClick={e => { e.stopPropagation(); setSelectedDay(key); setSelectedEvent(evt); setShowAdd(true) }} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3, padding: '2px 5px', borderRadius: 3, background: `${eventColor(evt.type)}15`, overflow: 'hidden', cursor: 'pointer' }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: eventColor(evt.type), flexShrink: 0 }} />
                              <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 600, color: eventColor(evt.type), whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{evt.title}</div>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{evt.time}</div>
                              </div>
                            </div>
                          ))}
                          {evts.length > 2 && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW, paddingLeft: 4 }}>+{evts.length - 2} more</div>}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── LIST VIEW ── */}
              {view === 'list' && (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
                  {listEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW, fontSize: 16 }}>No events this month</div>
                  ) : listEvents.map((evt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < listEvents.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                      onClick={() => { setSelectedDay(evt.dateKey); setSelectedEvent({ title: evt.title, type: evt.type, time: evt.time }); setShowAdd(true) }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: `${eventColor(evt.type)}15`, border: `1px solid ${eventColor(evt.type)}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: eventColor(evt.type) }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{evt.title}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{MONTHS[month]} {evt.dayNum}, {year} · {evt.time}</div>
                      </div>
                      <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: eventColor(evt.type), background: `${eventColor(evt.type)}15`, border: `1px solid ${eventColor(evt.type)}30`, borderRadius: 20, padding: '3px 10px', whiteSpace: 'nowrap' as const }}>
                        {EVENT_TYPES.find(e => e.key === evt.type)?.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── WEEK VIEW ── */}
              {view === 'week' && (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px', textAlign: 'center' as const }}>
                  <div style={{ fontSize: 20, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Week view</div>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.25)', fontFamily: BARLOW }}>Coming soon — use Month or List view for now.</div>
                </div>
              )}

              {/* Legend */}
              {view === 'month' && (
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
                  {EVENT_TYPES.map(et => (
                    <div key={et.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: et.color }} /> {et.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Reminder banner */}
              <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(212,166,74,0.1)', border: '1px solid rgba(212,166,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🔔</div>
                  <div>
                    <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Never Miss an Opportunity</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Enable calendar reminders and get notified before your important events.</div>
                  </div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: `1px solid ${GOLD}`, borderRadius: 8, padding: '9px 18px', color: GOLD, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                  🔔 Enable Reminders
                </button>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ width: 260, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', padding: '24px 16px', display: 'flex', flexDirection: 'column' as const, gap: 24, position: 'sticky' as const, top: 0 }}>

              {/* Upcoming Schedule */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Upcoming Schedule</div>
                  <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>View All</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                  {upcoming.map((u, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 14, borderBottom: i < upcoming.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      {/* Date block */}
                      <div style={{ textAlign: 'center' as const, flexShrink: 0, minWidth: 44 }}>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>{u.day}</div>
                        <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#fff', lineHeight: 1 }}>{u.date}</div>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }}>{u.month}</div>
                      </div>
                      {/* Event details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: eventColor(u.type), letterSpacing: 0.5, textTransform: 'uppercase' as const, marginBottom: 2 }}>
                          {EVENT_TYPES.find(e => e.key === u.type)?.label}
                        </div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{u.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 3 }}>
                          <Clock size={11} strokeWidth={1.8} /> {u.time}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>
                          <MapPin size={11} strokeWidth={1.8} /> {u.loc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Filters */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Calendar Filters</div>
                  <button onClick={() => { const allOn = Object.values(filters).every(v => v); setFilters({ audition: !allOn, callback: !allOn, workshop: !allOn, meeting: !allOn, important: !allOn }) }} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>{Object.values(filters).every(v => v) ? 'Clear All' : 'Show All'}</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                  {EVENT_TYPES.map(et => (
                    <div key={et.key} onClick={() => toggleFilter(et.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '4px 0' }}>
                      <div style={{ width: 20, height: 20, borderRadius: 5, background: filters[et.key as keyof typeof filters] ? et.color : 'rgba(255,255,255,0.08)', border: `1px solid ${filters[et.key as keyof typeof filters] ? et.color : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                        {filters[et.key as keyof typeof filters] && <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 15, fontFamily: BARLOW, color: filters[et.key as keyof typeof filters] ? '#fff' : 'rgba(255,255,255,0.4)' }}>{et.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Help */}
              <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px' }}>
                <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Need Help?</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.6, marginBottom: 12 }}>Sync your calendar or learn how to manage your schedule.</div>
                <button onClick={() => router.push('/faq')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1px solid ${GOLD}`, borderRadius: 7, padding: '8px 14px', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                  Visit Help Center <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}