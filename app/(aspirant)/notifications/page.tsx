'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark, Star, Bell,
  ChevronDown, ChevronRight, ChevronLeft, Menu, Check, Eye, Film, Info,
  ShieldCheck, CalendarDays, ExternalLink, SlidersHorizontal,
} from 'lucide-react';

/* ─── Design tokens ──────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";

/* ─── Sidebar ─────────────────────────────────────────────────── */
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard'      },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications'},
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',       badge: 2 },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions'      },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended'    },
  { icon: Bell,            label: 'Notifications',        href: '/notifications',  active: true },
];

const DROPDOWN_LINKS = ['Subscription', 'Analytics', 'Calendar', 'Settings', 'Support', 'Logout'];

type NotifType = 'application' | 'shortlisted' | 'audition' | 'message' | 'profile' | 'casting' | 'account' | 'system';

const TYPE_CFG: Record<NotifType, { icon: React.ElementType; bg: string; iconColor: string }> = {
  application: { icon: FileText,      bg: 'rgba(34,197,94,0.15)',   iconColor: '#4ADE80' },
  shortlisted:  { icon: Star,          bg: 'rgba(168,85,247,0.15)',  iconColor: '#C084FC' },
  audition:     { icon: CalendarDays,  bg: 'rgba(249,115,22,0.15)', iconColor: '#FB923C' },
  message:      { icon: MessageSquare, bg: 'rgba(59,130,246,0.15)', iconColor: '#60A5FA' },
  profile:      { icon: Eye,           bg: 'rgba(20,184,166,0.15)', iconColor: '#2DD4BF' },
  casting:      { icon: Film,          bg: 'rgba(212,166,74,0.15)', iconColor: GOLD      },
  account:      { icon: ShieldCheck,   bg: 'rgba(99,102,241,0.15)', iconColor: '#818CF8' },
  system:       { icon: Info,          bg: 'rgba(148,163,184,0.12)', iconColor: '#94A3B8'},
};

function typeToCategory(t: NotifType) {
  if (t === 'application' || t === 'shortlisted') return 'applications';
  if (t === 'audition')  return 'auditions';
  if (t === 'message')   return 'messages';
  return 'system';
}

const FILTER_CATS = [
  { key: 'all',          label: 'All Notifications', count: 24 },
  { key: 'unread',       label: 'Unread',            count: 8  },
  { key: 'applications', label: 'Applications',      count: 6  },
  { key: 'auditions',    label: 'Auditions',         count: 5  },
  { key: 'messages',     label: 'Messages',          count: 4  },
  { key: 'system',       label: 'System',            count: 9  },
];

type Part  = string | { bold: string };
type Notif = { id: string | number; type: NotifType; read: boolean; parts: Part[]; subtitle?: string; timestamp: string };

const INITIAL_NOTIFS: Notif[] = [
  { id:  1, type: 'application', read: true,  parts: ['Your application for ', {bold: 'Lead Hero'}, ' in ', {bold: '"City of Dreams"'}, ' is ', {bold: 'In Review'}, '.'], subtitle: 'Dharma Productions', timestamp: '10:30 AM' },
  { id:  2, type: 'shortlisted', read: false, parts: ['You have been ', {bold: 'shortlisted'}, ' for ', {bold: 'Supporting Actor'}, ' in ', {bold: '"The Silent Witness"'}, '.'], subtitle: 'Red Frame Studios', timestamp: 'Yesterday, 04:15 PM' },
  { id:  3, type: 'audition',    read: false, parts: ['You have an upcoming audition for ', {bold: 'Antagonist'}, ' in ', {bold: '"Rangbaaz: Dobara"'}, '.'], subtitle: '24 May 2024, 11:00 AM  •  Mumbai (Andheri)', timestamp: 'Yesterday, 11:45 AM' },
  { id:  4, type: 'message',     read: false, parts: [{bold: 'Neha Kapoor'}, ' (Casting Director) sent you a message.'], subtitle: 'Regarding your availability for a look test.', timestamp: '22 May 2024, 06:20 PM' },
  { id:  5, type: 'profile',     read: true,  parts: ['Your profile view count crossed ', {bold: '500'}, ' this week!'], subtitle: 'Keep your profile updated to get more visibility.', timestamp: '22 May 2024, 03:10 PM' },
  { id:  6, type: 'casting',     read: true,  parts: ['New casting call matching your profile: ', {bold: '"Love in Rewind"'}, '.'], subtitle: 'Dream Factory', timestamp: '21 May 2024, 09:30 AM' },
  { id:  7, type: 'account',     read: true,  parts: ['Your account verification is complete.'], subtitle: 'You can now apply for more exclusive roles.', timestamp: '20 May 2024, 05:40 PM' },
  { id:  8, type: 'system',      read: true,  parts: ['System Update: Our ', {bold: 'new mobile app'}, ' is now available!'], subtitle: 'Update now to get the best experience.', timestamp: '20 May 2024, 12:25 PM' },
  { id:  9, type: 'application', read: false, parts: ['Your application for ', {bold: 'Female Lead'}, ' in ', {bold: '"Yeh Zindagi"'}, ' has been ', {bold: 'Rejected'}, '.'], subtitle: 'Phantom Films', timestamp: '19 May 2024, 02:15 PM' },
  { id: 10, type: 'shortlisted', read: false, parts: ['Congratulations! You are ', {bold: 'shortlisted'}, ' for ', {bold: '"The Grand Finale"'}, ' web series.'], subtitle: 'Prime Lens Studios', timestamp: '19 May 2024, 10:00 AM' },
  { id: 11, type: 'audition',    read: true,  parts: ['Your audition for ', {bold: 'Supporting Role'}, ' in ', {bold: '"Kaala Aadmi"'}, ' is confirmed.'], subtitle: '26 May 2024, 02:00 PM  •  Andheri West', timestamp: '18 May 2024, 04:30 PM' },
  { id: 12, type: 'message',     read: false, parts: [{bold: 'Rajan Khanna'}, ' (Producer) sent you a message.'], subtitle: 'Interested in discussing your profile further.', timestamp: '18 May 2024, 11:20 AM' },
  { id: 13, type: 'audition',    read: true,  parts: ['Audition reminder: ', {bold: '"Mitti Ka Rang"'}, ' — tomorrow at 10:00 AM.'], subtitle: 'FilmGround Studios, Goregaon', timestamp: '17 May 2024, 05:00 PM' },
  { id: 14, type: 'profile',     read: true,  parts: [{bold: 'Dharma Productions'}, ' viewed your profile.'], subtitle: 'Your profile was viewed 3 minutes ago.', timestamp: '17 May 2024, 03:45 PM' },
  { id: 15, type: 'message',     read: true,  parts: ['New message from ', {bold: 'Priya Singh'}, ' (Casting Coordinator).'], subtitle: 'Please send your latest headshots.', timestamp: '16 May 2024, 01:10 PM' },
  { id: 16, type: 'casting',     read: true,  parts: ['New casting call: ', {bold: '"Raat Ka Raja"'}, ' is now open for applications.'], subtitle: 'Vishal Productions', timestamp: '16 May 2024, 09:00 AM' },
  { id: 17, type: 'application', read: true,  parts: ['Your application for ', {bold: 'Villain'}, ' in ', {bold: '"Black Mirror India"'}, ' is under review.'], subtitle: 'Netflix India Studios', timestamp: '15 May 2024, 03:20 PM' },
  { id: 18, type: 'audition',    read: true,  parts: ['Audition scheduled for ', {bold: '"Mumbai Mafia"'}, ' on 28 May 2024.'], subtitle: '2:00 PM  •  Juhu, Mumbai', timestamp: '15 May 2024, 10:30 AM' },
  { id: 19, type: 'system',      read: true,  parts: ['Your subscription is expiring in ', {bold: '7 days'}, '.'], subtitle: 'Renew now to continue accessing premium features.', timestamp: '14 May 2024, 12:00 PM' },
  { id: 20, type: 'account',     read: true,  parts: ['Your profile strength has improved to ', {bold: 'Excellent (98%)'}, '!'], subtitle: 'You are now in the top 5% of aspirants.', timestamp: '14 May 2024, 09:15 AM' },
  { id: 21, type: 'shortlisted', read: true,  parts: ['You have been ', {bold: 'shortlisted'}, ' for a ', {bold: 'Lead Role'}, ' in ', {bold: '"Dil Ka Kona"'}, '.'], subtitle: 'Story Films', timestamp: '13 May 2024, 04:45 PM' },
  { id: 22, type: 'message',     read: true,  parts: [{bold: 'Anand Verma'}, ' (Casting Director) sent you a message.'], subtitle: 'We would like to discuss the script with you.', timestamp: '13 May 2024, 02:30 PM' },
  { id: 23, type: 'profile',     read: true,  parts: ['Your showreel was liked by ', {bold: '12 casting directors'}, ' this week!'], subtitle: 'Keep your media gallery updated.', timestamp: '12 May 2024, 11:00 AM' },
  { id: 24, type: 'system',      read: true,  parts: ['New feature: You can now add ', {bold: 'voice samples'}, ' to your profile.'], subtitle: 'Showcase your voice acting abilities.', timestamp: '12 May 2024, 09:00 AM' },
];

const PER_PAGE = 8;

/* ── Auth helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

/* ── Normalise API notification → Notif shape ── */
function apiToNotif(n: any, idx: number): Notif {
  // Map DB notification types to our frontend types
  const typeMap: Record<string, NotifType> = {
    'audition_scheduled': 'audition',
    'audition_reminder':  'audition',
    'application_update': 'application',
    'application_new':    'application',
    'shortlisted':        'shortlisted',
    'message':            'message',
    'message_new':        'message',
    'profile_view':       'profile',
    'casting_match':      'casting',
    'account':            'account',
    'system':             'system',
    'audition':           'audition',
    'application':        'application',
    'casting':            'casting',
  };
  const rawType: string = n.type ?? 'system';
  const type: NotifType = typeMap[rawType] ?? (TYPE_CFG[rawType as NotifType] ? rawType as NotifType : 'system');

  // Build display text from title/message since DB stores plain strings
  const parts: Part[] = n.parts ?? (
    n.message
      ? [n.message as string]
      : [n.title ?? 'Notification']
  );

  return {
    id:        n.id ?? n._id ?? idx,
    type,
    read:      n.is_read ?? n.read ?? n.isRead ?? false,
    parts,
    subtitle:  n.subtitle ?? n.description ?? undefined,
    timestamp: n.created_at
      ? new Date(n.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : n.createdAt
      ? new Date(n.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : n.timestamp ?? '',
  };
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div onClick={onToggle} style={{ width: 38, height: 21, borderRadius: 11, background: on ? '#22C55E' : 'rgba(255,255,255,0.18)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', width: 17, height: 17, borderRadius: '50%', background: '#fff', top: 2, left: on ? 19 : 2, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.35)' }} />
    </div>
  );
}

function RichText({ parts }: { parts: Part[] }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string'
          ? <span key={i}>{p}</span>
          : <strong key={i} style={{ color: '#fff', fontWeight: 700 }}>{p.bold}</strong>
      )}
    </>
  );
}

function MarkAllReadIcon() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Check size={14} strokeWidth={3} color={RED} />
      <Check size={14} strokeWidth={3} color={RED} style={{ marginLeft: -7 }} />
    </span>
  );
}

export default function NotificationsPage() {
  const router = useRouter();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const SB_W = sidebarOpen ? 240 : 56;

  const [notifs,       setNotifs]       = useState<Notif[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [settings,     setSettings]     = useState({ push: true, email: true, sms: false, marketing: false });
  const [userName,     setUserName]     = useState('My Account');
  const [avatarUrl,    setAvatarUrl]    = useState('');
  const [msgCount,     setMsgCount]     = useState(2);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Load user identity instantly ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name)         setUserName(u.name);
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
    } catch {}
  }, []);

  /* ── Fetch notifications + messages badge ── */
  useEffect(() => {
    const h = getAuthHeaders();

    // Notifications
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.notifications ?? data.notifications ?? data;
        if (!Array.isArray(list) || list.length === 0) return;
        setNotifs(list.map((n: any, i: number) => apiToNotif(n, i)));
      })
      .catch(() => {}); // keep empty on error — no mock data

    // Messages badge
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.conversations ?? data;
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
      })
      .catch(() => {});
  }, []);

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true }))); // optimistic
    const h = getAuthHeaders();
    fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...h },
      body: JSON.stringify({}), // no notification_id = mark all
    }).catch(() => {});
  }

  function markRead(id: string | number) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); // optimistic
    const h = getAuthHeaders();
    fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...h },
      body: JSON.stringify({ notification_id: id }),
    }).catch(() => {});
  }
  function changeFilter(key: string) { setActiveFilter(key); setCurrentPage(1); }
  function toggleSetting(key: keyof typeof settings) { setSettings(prev => ({ ...prev, [key]: !prev[key] })); }

  const filtered = useMemo(() => {
    if (activeFilter === 'all')    return notifs;
    if (activeFilter === 'unread') return notifs.filter(n => !n.read);
    return notifs.filter(n => typeToCategory(n.type) === activeFilter);
  }, [notifs, activeFilter]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated   = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const unreadCount = notifs.filter(n => !n.read).length;

  // Live filter counts from real data
  const liveCounts = useMemo(() => ({
    all:          notifs.length,
    unread:       notifs.filter(n => !n.read).length,
    applications: notifs.filter(n => typeToCategory(n.type) === 'applications').length,
    auditions:    notifs.filter(n => typeToCategory(n.type) === 'auditions').length,
    messages:     notifs.filter(n => typeToCategory(n.type) === 'messages').length,
    system:       notifs.filter(n => typeToCategory(n.type) === 'system').length,
  }), [notifs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, color: '#F5F5F5', fontFamily: BARLOW }}>

      {/* ══ HEADER ══ */}
      <header style={{ height: 60, flexShrink: 0, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', position: 'relative', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />

        <div style={{ flex: 1 }} />

        <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Find Casting Calls
        </button>

        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(200,32,42,0.15)', border: `1px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={16} color={RED} />
          </div>
          {unreadCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{unreadCount}</div>}
        </div>

        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => router.push('/messages')}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={16} />
          </div>
          {msgCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{msgCount}</div>}
        </div>

        <div ref={dropRef} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
            <img src={avatarUrl} alt={userName}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}` }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, fontFamily: BARLOW }}>{userName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>Aspirant</div>
            </div>
            <ChevronRight size={12} color="rgba(255,255,255,0.4)" style={{ transform: 'rotate(90deg)' }} />
          </div>
          {dropdownOpen && (
            <div style={{ position: 'absolute', top: 46, right: 0, width: 190, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              {DROPDOWN_LINKS.map(item => (
                <div key={item} style={{ padding: '10px 16px', fontSize: 16, fontFamily: BARLOW, cursor: 'pointer', color: item === 'Logout' ? '#ff6b6b' : '#fff', borderTop: item === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                  onClick={() => {
                    if (item === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); }
                    else router.push(`/${item.toLowerCase()}`);
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >{item}</div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR — now collapsible ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          <nav style={{ flex: 1, padding: '10px 0' }}>
            {SIDEBAR_ITEMS.map(({ icon: Icon, label, active, badge, href }) => (
              <div key={label} title={!sidebarOpen ? label : undefined} style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '9px 16px' : '10px 0', cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : '3px solid transparent' }}
                onClick={() => router.push(href)}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.45)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 16, fontFamily: BARLOW, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && (badge
                  ? <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>
                  : active && unreadCount > 0
                    ? <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{unreadCount}</div>
                    : null)}
              </div>
            ))}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6, fontFamily: BARLOW }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SHARED SCROLL WRAPPER ── */}
        <div style={{ display: 'flex', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0, padding: '20px 16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1.5, marginBottom: 4, fontWeight: 400, lineHeight: 1 }}>Notifications</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>Stay updated with the latest alerts and opportunities.</p>
              </div>
              <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: RED, fontSize: 15, fontFamily: BARLOW, fontWeight: 600, marginTop: 4 }}>
                <MarkAllReadIcon /> Mark all as read
              </button>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 0 }}>
              {FILTER_CATS.map(cat => {
                const active = activeFilter === cat.key;
                const liveCount = liveCounts[cat.key as keyof typeof liveCounts] ?? 0;
                return (
                  <button key={cat.key} onClick={() => changeFilter(cat.key)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px', marginBottom: -1, whiteSpace: 'nowrap', fontFamily: BARLOW, fontSize: 15, fontWeight: active ? 700 : 400, color: active ? RED : 'rgba(255,255,255,0.5)', borderBottom: active ? `2px solid ${RED}` : '2px solid transparent' }}>
                    {cat.label} <span style={{ fontSize: 14, opacity: active ? 0.85 : 0.5 }}>({liveCount})</span>
                  </button>
                );
              })}
            </div>

            {/* Notification list */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, marginTop: 14, overflow: 'hidden', flexShrink: 0 }}>
              {paginated.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 15, fontFamily: BARLOW }}>No notifications in this category.</div>
              ) : paginated.map((n, idx) => {
                const cfg  = TYPE_CFG[n.type];
                const Icon = cfg.icon;
                return (
                  <div key={n.id} onClick={() => { markRead(n.id); router.push(`/notifications/${n.id}`); }} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '14px 18px', cursor: 'pointer',
                    background: !n.read ? 'rgba(200,32,42,0.05)' : 'transparent',
                    borderBottom: idx < paginated.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = !n.read ? 'rgba(200,32,42,0.05)' : 'transparent'}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: !n.read ? RED : 'transparent', flexShrink: 0, marginTop: 18 }} />
                    <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color={cfg.iconColor} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontFamily: BARLOW, lineHeight: 1.5, margin: 0, color: n.read ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.9)', fontWeight: n.read ? 400 : 500 }}>
                        <RichText parts={n.parts} />
                      </p>
                      {n.subtitle && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, margin: '3px 0 0' }}>{n.subtitle}</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginTop: 2 }}>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, whiteSpace: 'nowrap' }}>{n.timestamp}</span>
                      <ChevronRight size={14} color="rgba(255,255,255,0.25)" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>
                  Showing {(currentPage - 1) * PER_PAGE + 1} to {Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length} notifications
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', cursor: currentPage === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === 1 ? 0.3 : 1 }}>
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 32, height: 32, borderRadius: 6, fontFamily: BARLOW, fontSize: 14, border: p === currentPage ? `1px solid ${RED}` : '1px solid rgba(255,255,255,0.12)', background: p === currentPage ? RED : 'transparent', color: p === currentPage ? '#fff' : 'rgba(255,255,255,0.65)', cursor: 'pointer' }}>{p}</button>
                  ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', cursor: currentPage === totalPages ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === totalPages ? 0.3 : 1 }}>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT RAIL ── */}
          <div style={{ width: 296, flexShrink: 0, display: 'flex' }}>
          <div style={{ flex: 1, padding: '20px 16px 20px 4px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Filter Notifications — NO overflow:hidden, let content show fully */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 12, color: '#fff' }}>Filter Notifications</div>
              {FILTER_CATS.map(cat => {
                const active = activeFilter === cat.key;
                const liveCount = liveCounts[cat.key as keyof typeof liveCounts] ?? 0;
                return (
                  <div key={cat.key} onClick={() => changeFilter(cat.key)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                    background: active ? RED : 'transparent',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ fontSize: 15, fontFamily: BARLOW, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{cat.label}</span>
                    <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0.45)' }}>{liveCount}</span>
                  </div>
                );
              })}
            </div>

            {/* Notification Settings */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 14, color: '#fff' }}>Notification Settings</div>
              {([
                { key: 'push',      label: 'Push Notifications'  },
                { key: 'email',     label: 'Email Notifications' },
                { key: 'sms',       label: 'SMS Notifications'   },
                { key: 'marketing', label: 'Marketing Emails'    },
              ] as const).map(({ key, label }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }} onClick={() => toggleSetting(key)}>
                  <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.75)' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, color: settings[key] ? '#4ADE80' : 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>{settings[key] ? 'On' : 'Off'}</span>
                    <Toggle on={settings[key]} onToggle={() => toggleSetting(key)} />
                  </div>
                </div>
              ))}
              <button onClick={() => router.push('/settings')} style={{ marginTop: 14, width: '100%', background: 'transparent', border: `1px solid ${RED}`, color: RED, borderRadius: 8, padding: '9px 0', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,32,42,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >Manage Preferences</button>
            </div>

            {/* Need Help */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 18 }}>?</span>
                </div>
                <span style={{ fontSize: 18, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Need Help?</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, lineHeight: 1.6, marginBottom: 12 }}>Learn how notifications work on SilverScreens and how to customise them.</p>
              <button onClick={() => router.push('/support')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: RED, fontSize: 15, fontFamily: BARLOW, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
                Visit Help Center <ExternalLink size={13} />
              </button>
            </div>

          </div>
          <div style={{ width: 16, flexShrink: 0 }} />
          </div>

        </div>
      </div>
    </div>
  );
}