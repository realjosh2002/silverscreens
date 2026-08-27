'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import ProtectedMedia from '@/components/ui/ProtectedMedia';
import {
  LayoutDashboard, FileText, MessageSquare, Mic2,
  Bookmark, Star, Bell, ChevronRight, ChevronLeft, Menu,
  MapPin, Clock, Upload, PlusCircle, Eye, FolderOpen,
  TrendingUp, Calendar, ChevronDown, Wallet, User,
} from 'lucide-react';

/* ─── Design tokens ──────────────────────────────────────────── */
const BG       = '#0D1117';
const BG2      = '#131720';
const BG3      = '#181E2A';
const BG4      = '#1C2338';
const GOLD     = '#D4A64A';
const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';
const BEBAS    = "'Bebas Neue', sans-serif";
const BARLOW   = "'Barlow Condensed', sans-serif";
const GREEN    = '#22C55E';
const RED      = '#EF4444';

/* ─── Sidebar nav ────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard',        active: true },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications' },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages' },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions' },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended' },
  { icon: Bell,            label: 'Notifications',        href: '/notifications',     badge: 3 },
];

const PROFILE_MENU_APPROVED = [
  { label: 'My Profile',     href: '/my-profile' },
  { label: 'Subscription',   href: '/dashboard/subscription' },
  { label: 'Analytics',      href: '/analytics' },
  { label: 'Calendar',       href: '/calendar' },
  { label: 'Settings',       href: '/settings' },
  { label: 'Help & Support', href: '/settings?tab=support' },
  { label: 'Logout',         href: '' },
];

const PROFILE_MENU_PENDING = [
  { label: 'My Profile',     href: '/my-profile' },
  { label: 'Logout',         href: '' },
];

/* ─── Static fallback data ───────────────────────────────────── */
const FALLBACK_CASTINGS = [
  { title: 'Lead Actor – Feature Film',       agency: 'Silver Paradise Productions', location: 'Mumbai',    type: 'Feature Film', gender: 'Male',   age: '25-35 Yrs', posted: 'Posted 2 days ago', applyBy: '25 May 2025', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=80&h=80&fit=crop', href: '/casting-calls/1',  department: 'Acting' },
  { title: 'Supporting Actor – Web Series',   agency: 'FrameWorks Entertainment',    location: 'Mumbai',    type: 'Web Series',   gender: 'Male',   age: '20-30 Yrs', posted: 'Posted 1 day ago',  applyBy: '20 May 2025', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=80&h=80&fit=crop', href: '/casting-calls/2',  department: 'Acting' },
  { title: 'Villain Role – OTT Thriller',     agency: 'Zee Studios',                 location: 'Hyderabad', type: 'OTT',          gender: 'Male',   age: '30-45 Yrs', posted: 'Posted 3 days ago', applyBy: '28 May 2025', img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=80&h=80&fit=crop', href: '/casting-calls/3',  department: 'Acting' },
  { title: 'Heroine – Tamil Feature Film',    agency: 'Lyca Productions',            location: 'Chennai',   type: 'Feature Film', gender: 'Female', age: '20-28 Yrs', posted: 'Posted 1 day ago',  applyBy: '22 May 2025', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', href: '/casting-calls/4',  department: 'Acting' },
  { title: 'Female Model – Fashion Shoot',    agency: 'Vogue India Studios',         location: 'Delhi',     type: 'Modelling',    gender: 'Female', age: '18-28 Yrs', posted: 'Posted 2 days ago', applyBy: '24 May 2025', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop', href: '/casting-calls/5',  department: 'Modelling' },
];

const FALLBACK_MESSAGES = [
  { sender: 'Silver Paradise Productions', avatar: 'SP', time: '2h ago', preview: 'We would like to see you for an audition.', unread: 1, href: '/messages/1' },
  { sender: 'FrameWorks Entertainment',    avatar: 'FW', time: '1d ago', preview: 'Your profile has been shortlisted.',        unread: 0, href: '/messages/2' },
];

const completionItems = [
  'Profile Information', 'About You', 'Skills & Experience',
  'Media Gallery', 'Documents', 'Availability',
];

const QUICK_ACTIONS_APPROVED = [
  { icon: Clock,      label: 'Update Availability', href: '/settings?tab=preferences'  },
  { icon: Upload,     label: 'Upload New Media',    href: '/edit-profile?section=media' },
  { icon: PlusCircle, label: 'Add New Skill',       href: '/settings?tab=skills'        },
  { icon: Eye,        label: 'View My Profile',     href: '/my-profile'                 },
  { icon: FolderOpen, label: 'Manage Documents',    href: '/settings?tab=documents'     },
];
const QUICK_ACTIONS_PENDING = [
  { icon: Clock,      label: 'Update Availability', href: '/create-profile' },
  { icon: Upload,     label: 'Upload New Media',    href: '/create-profile' },
  { icon: PlusCircle, label: 'Add New Skill',       href: '/create-profile' },
  { icon: Eye,        label: 'View My Profile',     href: '/create-profile' },
  { icon: FolderOpen, label: 'Manage Documents',    href: '/create-profile' },
];

/* ─── Helper ─────────────────────────────────────────────────── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ? { Authorization: `Bearer ${u.token}` } : {}
  } catch { return {} }
}

interface UpcomingEvent {
  day: string;
  month: string;
  type: string;
  typeColor: string;
  title: string;
  time: string;
  location: string;
  mode: string;
  href: string;
}

export default function DashboardPage() {
  const router = useRouter()

  /* ── Auth guard ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (!u?.loggedIn) { window.location.replace('/login'); return }
      // Dashboard is always accessible — incomplete/missing profile shows a banner
    } catch { window.location.replace('/login'); return }

    const onPopState = () => {
      try {
        const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
        if (!u?.loggedIn) window.location.replace('/login')
        else {
          const ps = u?.profileStatus
          // no redirect from dashboard — banner handles it
        }
      } catch { window.location.replace('/login') }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    window.location.replace('/login')
  }

  /* ── UI state ── */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* ── Data from ss_user ── */
  const [userName,       setUserName]       = useState('My Account');
  const [userDepts,      setUserDepts]      = useState<string[]>([]);
  const [profileNumber,  setProfileNumber]  = useState('ASP·······');
  const [avatarUrl,      setAvatarUrl]      = useState('');

  /* ── Data from API ── */
  const [castings,       setCastings]       = useState<typeof FALLBACK_CASTINGS>([]);
  const [msgList,        setMsgList]        = useState<typeof FALLBACK_MESSAGES>([]);
  const [notifCount,     setNotifCount]     = useState(0);
  const [msgCount,       setMsgCount]       = useState(0);
  const [profilePct,     setProfilePct]     = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [profileStatus,  setProfileStatus]  = useState('');
  const hasProfile  = profileStatus !== '' && profileStatus !== 'incomplete';
  const isApproved  = profileStatus === 'approved' || profileStatus === 'active';
  const [stats,          setStats]          = useState({
    applications: '0', shortlisted: '0', auditions: '0',
    offers: '0', earnings: '₹0',
  });

  /* ── Load ss_user instantly ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u.departments)                            setUserDepts(u.departments)
      if (u.profileStatus)                          setProfileStatus(u.profileStatus)
      const pn = u.profileNumber ?? u.profile_number
      if (pn)                                       setProfileNumber(pn)
    } catch {}
  }, [])

  /* ── Fetch all data ── */
  useEffect(() => {
    const headers = getAuthHeaders()

    // 1. Profile (completion % + name + avatar)
    fetch('/api/profile/aspirant', { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const p = data.data?.profile ?? data.profile ?? data
        const pct = p.profile_completion ?? p.profileCompletion ?? 0
        setProfilePct(pct)
        if (p.first_name || p.name) setUserName(p.name ?? `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim())
        if (p.languages)   setUserDepts(Array.isArray(p.languages) ? p.languages : [])
        const pn = p.profile_number ?? p.profileNumber
        if (pn)            setProfileNumber(pn)
        if (p.profile_image_url ?? p.profilePhoto) setAvatarUrl(p.profile_image_url ?? p.profilePhoto)
      })
      .catch(() => {})

    // 2. Stats — fetch applications and count them directly
    fetch('/api/applications?limit=100', { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.data?.applications ?? data.applications ?? []
        if (!Array.isArray(list)) return
        const total       = data.data?.pagination?.total ?? list.length
        const shortlisted = list.filter((a: any) => a.status === 'shortlisted').length
        const offers      = list.filter((a: any) => a.status === 'selected').length
        setStats(prev => ({
          ...prev,
          applications: String(total),
          shortlisted:  String(shortlisted),
          offers:       String(offers),
        }))
      })
      .catch(() => {})

    // 3. Auditions count for stat card + upcoming events
    fetch('/api/auditions?limit=100', { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.data?.auditions ?? data.auditions ?? []
        if (!Array.isArray(list)) return

        // Stat card — auditions this month
        const now = new Date()
        const thisMonth = list.filter((a: any) => {
          if (!a.scheduled_at) return false
          const d = new Date(a.scheduled_at)
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        }).length
        setStats(prev => ({ ...prev, auditions: String(thisMonth) }))

        // Upcoming events — only future scheduled auditions
        const upcoming = list
          .filter((a: any) => a.status === 'scheduled' && a.scheduled_at && new Date(a.scheduled_at) >= now)
          .slice(0, 3)
          .map((a: any) => {
            const cc  = a.casting_calls   ?? {}
            const ap  = a.agency_profiles ?? {}
            const d   = new Date(a.scheduled_at)
            const modeMap: Record<string, string> = { offline: 'In Person', online: 'Virtual', both: 'Hybrid' }
            return {
              day:       d.getDate().toString(),
              month:     d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase(),
              type:      'Audition',
              typeColor: GOLD,
              title:     cc.title ?? 'Audition',
              time:      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
              location:  a.venue_details ?? (a.mode === 'online' ? 'Video Call' : '—'),
              mode:      modeMap[a.mode] ?? 'In Person',
              href:      `/auditions/${a.id}`,
            }
          })
        setUpcomingEvents(upcoming)
      })
      .catch(() => {})

    // 4. Casting calls
    fetch('/api/casting-calls?limit=5', { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.castingCalls ?? data.data ?? data
        if (!Array.isArray(list) || list.length === 0) return
        setCastings(list.slice(0, 5).map((c: any) => ({
          title:      c.title      ?? c.name ?? '',
          agency:     c.agency?.name ?? c.companyName ?? c.agency ?? '',
          location:   c.location   ?? c.city ?? '',
          type:       c.projectType ?? c.type ?? '',
          gender:     c.gender     ?? 'Any',
          age:        c.ageRange   ?? c.age  ?? '',
          posted:     c.createdAt
            ? `Posted ${Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86400000)} days ago`
            : '',
          applyBy:    c.applicationDeadline
            ? new Date(c.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : c.applyBy ?? '',
          img:        c.coverImage ?? c.img ??
            'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=80&h=80&fit=crop',
          href:       `/casting-calls/${c.id ?? c._id ?? ''}`,
          department: c.department ?? '',
        })))
      })
      .catch(() => {})

    // 5. Notifications count — only for approved profiles
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    const ps2 = u?.profileStatus
    const canFetch = ps2 === 'approved' || ps2 === 'active'
    if (!canFetch) return

    fetch('/api/notifications', { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const count = data.data?.unread_count ?? data.unread_count
        if (count != null) {
          setNotifCount(count)
          return
        }
        const list = data.data?.notifications ?? data.notifications ?? data
        if (Array.isArray(list)) {
          setNotifCount(list.filter((n: any) => !n.is_read && !n.read && !n.isRead).length)
        }
      })
      .catch(() => {})

    // 6. Messages
    fetch('/api/messages/conversations', { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.conversations ?? data
        if (!Array.isArray(list) || list.length === 0) return
        const unread = list.filter((c: any) => c.unreadCount > 0).length
        setMsgCount(unread)
        setMsgList(list.slice(0, 2).map((c: any) => ({
          sender:  c.otherParty?.name ?? c.name ?? c.sender ?? '',
          avatar:  (c.otherParty?.name ?? c.name ?? 'XX').slice(0, 2).toUpperCase(),
          time:    c.lastMessageAt
            ? new Date(c.lastMessageAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : c.time ?? '',
          preview: c.lastMessage?.content ?? c.preview ?? '',
          unread:  c.unreadCount ?? 0,
          href:    `/messages/${c.id ?? c._id ?? ''}`,
        })))
      })
      .catch(() => {})

  }, [])

  /* ── Stat cards ── */
  const statCards = [
    { icon: FileText,   value: stats.applications, label: 'Applications',     sub: 'Total Applied',     href: '/my-applications' },
    { icon: Bookmark,   value: stats.shortlisted,  label: 'Shortlisted',      sub: 'By Agencies',       href: '/my-applications' },
    { icon: Calendar,   value: stats.auditions,    label: 'Auditions',        sub: 'This Month',        href: '/auditions' },
    { icon: FileText,   value: stats.offers,       label: 'Offers',           sub: 'Received',          href: '/my-applications' },
    { icon: TrendingUp, value: `${profilePct}%`,   label: 'Profile Strength', sub: 'Excellent', gold: true, href: '/profile' },
    { icon: Wallet,     value: stats.earnings,     label: 'Total Earnings',   sub: '+12% vs last month', gold: true, href: '/dashboard/subscription' },
  ];

  /* ── Nav badges (live) ── */
  const navItems = NAV_ITEMS.map(item => {
    if (item.label === 'Notifications') return { ...item, badge: notifCount || undefined }
    if (item.label === 'Messages')      return { ...item, badge: msgCount   || undefined }
    return item
  })

  const SB_W = sidebarOpen ? 220 : 52;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ padding: '3px 10px', background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: 1 }}>ASPIRANT</span>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => isApproved && router.push('/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: `1px solid ${isApproved ? GOLD : 'rgba(212,166,74,0.3)'}`, color: isApproved ? GOLD : 'rgba(212,166,74,0.35)', borderRadius: 8, padding: '0 16px', height: 36, fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: isApproved ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' as const, opacity: isApproved ? 1 : 0.6 }}>
          {isApproved ? '+ Find Casting Calls' : '🔒 Find Casting Calls'}
        </button>
        <div onClick={() => router.push('/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {msgCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{msgCount}</div>}
        </div>
        <div onClick={() => router.push('/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {notifCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{notifCount}</div>}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(212,166,74,0.38)', flexShrink: 0 }}>
              <ProtectedMedia
                type="image"
                src={avatarUrl || undefined}
                alt={userName}
                avatar
                width={36}
                height={36}
              />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{isApproved ? userName : 'My Account'}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Aspirant</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 210, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Aspirant ID</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{profileNumber}</span>
                </div>
                {(profileStatus === 'approved' || profileStatus === 'active' ? PROFILE_MENU_APPROVED : PROFILE_MENU_PENDING).map(({ label, href }) => (
                  <div key={label}
                    onClick={() => { if (label === 'Logout') { handleLogout(); } else { router.push(href); setProfileOpen(false); } }}
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
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease', scrollbarWidth: 'none' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>

          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(212,166,74,0.25)', flexShrink: 0 }}>
                <ProtectedMedia
                  type="image"
                  src={avatarUrl || undefined}
                  alt=""
                  avatar
                  width={38}
                  height={38}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{isApproved ? userName : 'My Account'}</div>
                <div style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>{profileNumber}</div>
              </div>
            </div>
          )}

          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {navItems.map(({ icon: Icon, label, href, active, badge }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? GOLD_DIM : 'transparent', border: active && sidebarOpen ? `1px solid ${GOLD_BDR}` : '1px solid transparent', borderLeft: sidebarOpen && active ? `3px solid ${GOLD}` : sidebarOpen ? '3px solid transparent' : 'none' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? GOLD_DIM : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0 }}>
                  <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 14, color: active ? GOLD : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && (
                  <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>
                )}
                {sidebarOpen && !badge && active && <ChevronRight size={12} color={GOLD} opacity={0.6} />}
              </div>
            ))}
          </nav>

          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: `1px solid ${GOLD_BDR}`, padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/dashboard/subscription')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SCROLLABLE CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Profile incomplete banner */}
          {!hasProfile && (
            <div style={{ padding: '12px 18px', background: 'rgba(212,166,74,0.08)', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>🎬</span>
                <div>
                  <div style={{ fontFamily: BEBAS, fontSize: 16, letterSpacing: 1, color: GOLD }}>COMPLETE YOUR PROFILE TO UNLOCK ALL FEATURES</div>
                  <div style={{ fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Submit your profile, choose a plan, complete payment and get admin approval.</div>
                </div>
              </div>
              <button onClick={() => router.push('/create-profile')} style={{ flexShrink: 0, padding: '7px 16px', background: GOLD, border: 'none', borderRadius: 6, color: '#050505', fontFamily: BEBAS, fontSize: 14, letterSpacing: 1, cursor: 'pointer' }}>
                CREATE PROFILE →
              </button>
            </div>
          )}

          {/* Welcome row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, marginBottom: 3, fontWeight: 400 }}>Welcome back, {userName.split(' ')[0].toUpperCase()} 👋</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Here's what's happening with your career today.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => {
                try {
                  const existing = JSON.parse(localStorage.getItem('ss_profile_draft') || '{}')
                  localStorage.setItem('ss_profile_draft', JSON.stringify({ ...existing, editMode: true, published: false, activeSection: 1 }))
                } catch {}
                router.push('/edit-profile')
              }} style={{ background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Edit Profile</button>
              <button onClick={() => router.push('/my-profile')} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 18px', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Eye size={14} color={RED} /> View Profile
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {statCards.map(({ icon: Icon, value, label, sub, gold, href }, i) => (
              <div key={i} onClick={() => router.push(href)} style={{ flex: 1, borderRadius: 12, padding: '14px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = BG3)}
              >
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} color="rgba(255,255,255,0.5)" />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
                <span style={{ fontSize: (value as string).length > 4 ? 19 : 24, fontWeight: 800, fontFamily: BEBAS, letterSpacing: 0.5, color: gold ? GOLD : '#fff', whiteSpace: 'nowrap' }}>{value}</span>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Casting Calls + Upcoming row — only shown after approval */}
          {isApproved && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>

            {/* Casting Calls */}
            <div style={{ flex: 3, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>Recommended Casting Calls</span>
                  {userDepts.length > 0 && (
                    <span style={{ marginLeft: 10, fontSize: 13, fontFamily: BARLOW, color: GOLD, background: 'rgba(212,166,74,0.1)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 20, padding: '2px 10px' }}>Based on your departments</span>
                  )}
                </div>
                <span onClick={() => router.push('/casting-calls')} style={{ fontSize: 14, color: GOLD, cursor: 'pointer', fontWeight: 600 }}>View All</span>
              </div>
              {castings.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', textAlign: 'center', gap: 8 }}>
                  <span style={{ fontSize: 32 }}>🎬</span>
                  <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>No casting calls yet</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>Check back soon — new castings are posted daily.</div>
                </div>
              ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {castings.slice(0, 5).map((call, i) => (
                  <div key={i} onClick={() => router.push(call.href)} style={{ display: 'flex', gap: 12, padding: 10, cursor: 'pointer', background: BG4, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                  >
                    <img src={call.img} alt="" style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3 }}>{call.title}</span>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', flexShrink: 0, marginLeft: 8 }}>{call.posted}</span>
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>{call.agency} • {call.location}</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' as const }}>
                        {[call.type, call.gender, call.age].map(tag => (
                          <span key={tag} style={{ fontSize: 14, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>{tag}</span>
                        ))}
                        {call.department && (
                          <span style={{ fontSize: 13, padding: '2px 8px', borderRadius: 20, background: 'rgba(212,166,74,0.08)', color: GOLD, border: '1px solid rgba(212,166,74,0.2)' }}>{call.department}</span>
                        )}
                        <div style={{ flex: 1 }} />
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Apply by</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{call.applyBy}</span>
                        <Bookmark size={14} color="rgba(255,255,255,0.3)" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); router.push('/saved-castings'); }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
              <button onClick={() => router.push('/casting-calls')} style={{ width: '100%', marginTop: 12, background: 'transparent', border: `1px solid ${GOLD_BDR}`, color: GOLD, borderRadius: 8, padding: '9px 0', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>Browse All Casting Calls</button>
            </div>

            {/* Upcoming — real auditions from API */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Upcoming</span>
                <span onClick={() => router.push('/calendar')} style={{ fontSize: 14, color: GOLD, cursor: 'pointer', fontWeight: 600 }}>View Calendar</span>
              </div>
              {upcomingEvents.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', textAlign: 'center', gap: 8 }}>
                  <span style={{ fontSize: 32 }}>🎬</span>
                  <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>No upcoming auditions</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>Apply to casting calls to get invited for auditions</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {upcomingEvents.map((evt, i) => (
                    <div key={i} onClick={() => router.push(evt.href)} style={{ display: 'flex', gap: 10, padding: 10, cursor: 'pointer', background: BG4, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                    >
                      <div style={{ width: 44, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: 0.5 }}>{evt.month}</span>
                        <span style={{ fontSize: 22, fontWeight: 800, fontFamily: BEBAS, lineHeight: 1.1 }}>{evt.day}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 0.3, color: evt.typeColor, marginBottom: 2 }}>{evt.type}</div>
                        <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{evt.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                          <Clock size={10} color="rgba(255,255,255,0.35)" />
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{evt.time}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={10} color="rgba(255,255,255,0.35)" />
                            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{evt.location}</span>
                          </div>
                          <span style={{ fontSize: 14, padding: '2px 7px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{evt.mode}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => router.push('/calendar')} style={{ width: '100%', marginTop: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, padding: '9px 0', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>View Full Calendar</button>
            </div>
          </div>
          )} {/* end isApproved casting+upcoming row */}

          {/* Messages + Profile Completion row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>

            {/* Messages — only shown after approval */}
            {isApproved && (
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Messages</span>
                <span onClick={() => router.push('/messages')} style={{ fontSize: 14, color: GOLD, cursor: 'pointer', fontWeight: 600 }}>View All</span>
              </div>
              {msgList.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', textAlign: 'center', gap: 8 }}>
                  <span style={{ fontSize: 28 }}>💬</span>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>No messages yet</div>
                </div>
              ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {msgList.map((msg, i) => (
                  <div key={i} onClick={() => router.push(msg.href)} style={{ display: 'flex', gap: 12, padding: 10, cursor: 'pointer', background: BG4, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)', alignItems: 'flex-start' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${RED} 0%, #6b0d13 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{msg.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3 }}>{msg.sender}</span>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>{msg.time}</span>
                      </div>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{msg.preview}</span>
                    </div>
                    {msg.unread > 0 && (
                      <div style={{ background: RED, color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{msg.unread}</div>
                    )}
                  </div>
                ))}
              </div>
              )}
            </div>
            )}

            {/* Profile Completion */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Profile Completion</span>
                <span onClick={() => router.push('/my-profile')} style={{ fontSize: 14, color: GOLD, cursor: 'pointer', fontWeight: 600 }}>View Profile</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div style={{ position: 'relative', width: 70, height: 70, flexShrink: 0 }}>
                  <svg width="70" height="70" viewBox="0 0 70 70">
                    <circle cx="35" cy="35" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <circle cx="35" cy="35" r="28" fill="none" stroke={GOLD} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 28 * (profilePct / 100)} ${2 * Math.PI * 28}`}
                      strokeLinecap="round" transform="rotate(-90 35 35)"
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{profilePct}%</span>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {completionItems.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 13, height: 13, borderRadius: '50%', flexShrink: 0, background: 'rgba(34,197,94,0.15)', border: `1.5px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 8, color: GREEN, fontWeight: 800 }}>✓</span>
                      </div>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>⭐</span>
                <div>
                  <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 0.3, color: GOLD, marginBottom: 2 }}>Profile looks great!</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>You're all set to get noticed by top agencies.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(isApproved ? QUICK_ACTIONS_APPROVED : QUICK_ACTIONS_PENDING).map(({ icon: Icon, label, href }, i) => (
                <div key={i} onClick={() => router.push(href)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, background: BG4, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={14} color="rgba(255,255,255,0.55)" />
                  </div>
                  <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                  <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}