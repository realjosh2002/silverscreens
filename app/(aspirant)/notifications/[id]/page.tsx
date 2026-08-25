'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark, Star, Bell,
  ChevronRight, ChevronLeft, Menu, Check, Eye, Film, Info, ShieldCheck,
  CalendarDays, AlertCircle, CalendarPlus, User,
} from 'lucide-react';

/* ─── Design tokens — identical to notifications/page.tsx ─────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";

/* ─── Sidebar nav — identical to notifications/page.tsx ──────── */
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard'      },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications'},
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',       },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions'      },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended'    },
  { icon: Bell,            label: 'Notifications',        href: '/notifications',  active: true },
];

const DROPDOWN_LINKS = ['Subscription', 'Analytics', 'Calendar', 'Settings', 'Support', 'Logout'];

/* ─── Types ──────────────────────────────────────────────────── */
type NotifType = 'application' | 'shortlisted' | 'audition' | 'message' | 'profile' | 'casting' | 'account' | 'system';

const TYPE_CFG: Record<NotifType, { icon: React.ElementType; bg: string; iconColor: string }> = {
  application: { icon: FileText,      bg: 'rgba(34,197,94,0.15)',    iconColor: '#4ADE80' },
  shortlisted:  { icon: Star,          bg: 'rgba(168,85,247,0.15)',   iconColor: '#C084FC' },
  audition:     { icon: CalendarDays,  bg: 'rgba(249,115,22,0.15)',  iconColor: '#FB923C' },
  message:      { icon: MessageSquare, bg: 'rgba(59,130,246,0.15)',  iconColor: '#60A5FA' },
  profile:      { icon: Eye,           bg: 'rgba(20,184,166,0.15)',  iconColor: '#2DD4BF' },
  casting:      { icon: Film,          bg: 'rgba(212,166,74,0.15)',  iconColor: GOLD      },
  account:      { icon: ShieldCheck,   bg: 'rgba(99,102,241,0.15)',  iconColor: '#818CF8' },
  system:       { icon: Info,          bg: 'rgba(148,163,184,0.12)', iconColor: '#94A3B8' },
};

const TYPE_BADGE_CFG: Record<string, { bg: string; color: string; border: string }> = {
  'TV Series':  { bg: 'rgba(168,85,247,0.12)', color: '#C084FC', border: 'rgba(168,85,247,0.25)' },
  'Film':       { bg: 'rgba(20,184,166,0.12)', color: '#2DD4BF', border: 'rgba(20,184,166,0.25)' },
  'Web Series': { bg: 'rgba(59,130,246,0.12)', color: '#60A5FA', border: 'rgba(59,130,246,0.25)' },
  'Ad Film':    { bg: 'rgba(168,85,247,0.12)', color: '#C084FC', border: 'rgba(168,85,247,0.25)' },
};

type Part = string | { bold: string };

type AuditionDetail = {
  project: {
    title: string; type: string; genres: string[]; language: string; img: string;
    company: { name: string; initials: string; verified: boolean; color: string };
    description: string; director: string; producer: string; projectType: string; shootLocation: string;
  };
  role: { name: string; characterType: string; gender: string; ageRange: string; description: string };
  audition: { date: string; time: string; location: string; locationDetail: string; type: string; instructions: string[] };
  timeline: { label: string; date: string; done: boolean; active: boolean }[];
};

type NotifRecord = {
  id: number; type: NotifType; read: boolean;
  parts: Part[]; subtitle?: string; timestamp: string;
  auditionDetail?: AuditionDetail;
};

/* ─── Static data (replace with API fetch when ready) ────────── */
const NOTIFS: NotifRecord[] = [
  { id:  1, type: 'application', read: true,  parts: ['Your application for ', {bold: 'Lead Hero'}, ' in ', {bold: '"City of Dreams"'}, ' is ', {bold: 'In Review'}, '.'], subtitle: 'Dharma Productions', timestamp: '10:30 AM' },
  { id:  2, type: 'shortlisted', read: false, parts: ['You have been ', {bold: 'shortlisted'}, ' for ', {bold: 'Supporting Actor'}, ' in ', {bold: '"The Silent Witness"'}, '.'], subtitle: 'Red Frame Studios', timestamp: 'Yesterday, 04:15 PM' },
  {
    id: 3, type: 'audition', read: false,
    parts: ['You have an upcoming audition for ', {bold: 'Antagonist'}, ' in ', {bold: '"Rangbaaz: Dobara"'}, '.'],
    subtitle: '24 May 2024, 11:00 AM  •  Mumbai (Andheri)', timestamp: 'Yesterday, 11:45 AM',
    auditionDetail: {
      project: { title: 'Rangbaaz: Dobara', type: 'TV Series', genres: ['Crime', 'Thriller', 'Drama'], language: 'Hindi', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=280&h=200&fit=crop', company: { name: 'Red Frame Studios', initials: 'RF', verified: true, color: '#2A1520' }, description: 'The story continues as new betrayals, rivalries and power struggles unfold in the world of crime and politics.', director: 'Siddharth Sengupta', producer: 'Red Frame Studios', projectType: 'TV Series', shootLocation: 'Mumbai, Uttar Pradesh' },
      role: { name: 'Antagonist', characterType: 'Negative Lead', gender: 'Male', ageRange: '28 - 40 Yrs', description: 'A powerful and intense character with a strong screen presence.' },
      audition: { date: '24 May 2024, Friday', time: '11:00 AM IST', location: 'Red Frame Studios', locationDetail: 'Andheri West, Mumbai', type: 'In-Person', instructions: ['Please reach 30 minutes early.', 'Carry a valid government ID proof.', 'Prepare a 2-3 minute intense monologue.'] },
      timeline: [
        { label: 'Application Submitted', date: '20 May 2024',           done: true,  active: false },
        { label: 'Audition Scheduled',    date: '24 May 2024, 11:00 AM', done: false, active: true  },
        { label: 'Audition Completed',    date: 'Pending',               done: false, active: false },
        { label: 'Decision',              date: 'We will notify you soon', done: false, active: false },
      ],
    },
  },
  { id:  4, type: 'message',  read: false, parts: [{bold: 'Neha Kapoor'}, ' (Casting Director) sent you a message.'], subtitle: 'Regarding your availability for a look test.', timestamp: '22 May 2024, 06:20 PM' },
  { id:  5, type: 'profile',  read: true,  parts: ['Your profile view count crossed ', {bold: '500'}, ' this week!'], subtitle: 'Keep your profile updated to get more visibility.', timestamp: '22 May 2024, 03:10 PM' },
  { id:  6, type: 'casting',  read: true,  parts: ['New casting call matching your profile: ', {bold: '"Love in Rewind"'}, '.'], subtitle: 'Dream Factory', timestamp: '21 May 2024, 09:30 AM' },
  { id:  7, type: 'account',  read: true,  parts: ['Your account verification is complete.'], subtitle: 'You can now apply for more exclusive roles.', timestamp: '20 May 2024, 05:40 PM' },
  { id:  8, type: 'system',   read: true,  parts: ['System Update: Our ', {bold: 'new mobile app'}, ' is now available!'], subtitle: 'Update now to get the best experience.', timestamp: '20 May 2024, 12:25 PM' },
  { id:  9, type: 'application', read: false, parts: ['Your application for ', {bold: 'Female Lead'}, ' in ', {bold: '"Yeh Zindagi"'}, ' has been ', {bold: 'Rejected'}, '.'], subtitle: 'Phantom Films', timestamp: '19 May 2024, 02:15 PM' },
  { id: 10, type: 'shortlisted', read: false, parts: ['Congratulations! You are ', {bold: 'shortlisted'}, ' for ', {bold: '"The Grand Finale"'}, ' web series.'], subtitle: 'Prime Lens Studios', timestamp: '19 May 2024, 10:00 AM' },
  {
    id: 11, type: 'audition', read: true,
    parts: ['Your audition for ', {bold: 'Supporting Role'}, ' in ', {bold: '"Kaala Aadmi"'}, ' is confirmed.'],
    subtitle: '26 May 2024, 02:00 PM  •  Andheri West', timestamp: '18 May 2024, 04:30 PM',
    auditionDetail: {
      project: { title: 'Kaala Aadmi', type: 'Film', genres: ['Action', 'Crime'], language: 'Hindi', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=280&h=200&fit=crop', company: { name: 'Black Angle Media', initials: 'BA', verified: true, color: '#1A1A2E' }, description: 'An uncompromising thriller about a cop who goes undercover to dismantle a crime syndicate.', director: 'Anurag Bose', producer: 'Black Angle Media', projectType: 'Film', shootLocation: 'Mumbai, Maharashtra' },
      role: { name: 'Supporting Role', characterType: 'Informant', gender: 'Male', ageRange: '25 - 38 Yrs', description: 'A morally ambiguous informant caught between two worlds.' },
      audition: { date: '26 May 2024, Sunday', time: '02:00 PM IST', location: 'Black Angle Studios', locationDetail: 'Andheri West, Mumbai', type: 'In-Person', instructions: ['Come in casual attire.', 'Carry your portfolio and resume.', 'Be prepared for a cold read.'] },
      timeline: [
        { label: 'Application Submitted', date: '15 May 2024',           done: true,  active: false },
        { label: 'Audition Scheduled',    date: '26 May 2024, 02:00 PM', done: false, active: true  },
        { label: 'Audition Completed',    date: 'Pending',               done: false, active: false },
        { label: 'Decision',              date: 'We will notify you soon', done: false, active: false },
      ],
    },
  },
  { id: 12, type: 'message',  read: false, parts: [{bold: 'Rajan Khanna'}, ' (Producer) sent you a message.'], subtitle: 'Interested in discussing your profile further.', timestamp: '18 May 2024, 11:20 AM' },
  { id: 19, type: 'system',   read: true,  parts: ['Your subscription is expiring in ', {bold: '7 days'}, '.'], subtitle: 'Renew now to continue accessing premium features.', timestamp: '14 May 2024, 12:00 PM' },
  { id: 20, type: 'account',  read: true,  parts: ['Your profile strength has improved to ', {bold: 'Excellent (98%)'}, '!'], subtitle: 'You are now in the top 5% of aspirants.', timestamp: '14 May 2024, 09:15 AM' },
];

/* ─── Auth helper ────────────────────────────────────────────── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

/* ─── Sub-components ─────────────────────────────────────────── */
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

function TimelineStep({ label, date, done, active, isLast }: { label: string; date: string; done: boolean; active: boolean; isLast: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? RED : 'transparent', border: done ? `2px solid ${RED}` : active ? `2px solid ${RED}` : '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {done   && <Check size={10} strokeWidth={3} color="#fff" />}
          {active && !done && <div style={{ width: 8, height: 8, borderRadius: '50%', background: RED }} />}
        </div>
        {!isLast && <div style={{ width: 1, flex: 1, background: done || active ? 'rgba(200,32,42,0.3)' : 'rgba(255,255,255,0.1)', minHeight: 24, marginTop: 2 }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 16, flex: 1 }}>
        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: active || done ? 600 : 400, color: done || active ? '#fff' : 'rgba(255,255,255,0.45)' }}>{label}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginTop: 1 }}>{date}</div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function NotificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  // ID is a UUID string from DB — don't parseInt
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  // ── Layout state ──
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [notifCount,   setNotifCount]   = useState(0);
  const [msgCount,     setMsgCount]     = useState(0);

  // Inject live badge counts into sidebar items
  const navItems = SIDEBAR_ITEMS.map(item => {
    if (item.label === 'Messages')      return { ...item, badge: msgCount     || undefined }
    if (item.label === 'Notifications') return { ...item, badge: notifCount   || undefined }
    return item
  })
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName,     setUserName]     = useState('My Account');
  const [avatarUrl,    setAvatarUrl]    = useState('');
  const [notif,        setNotif]        = useState<NotifRecord | null | undefined>(undefined); // undefined = loading
  const dropRef = useRef<HTMLDivElement>(null);

  const SB_W = sidebarOpen ? 240 : 56;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Load user identity
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name)         setUserName(u.name);
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
    } catch {}
  }, []);

  // Fetch live badge counts
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const token = u.token
      if (!token) return
      const h = { Authorization: `Bearer ${token}` }
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
    } catch {}
  }, [])

  // Fetch real notification from API
  useEffect(() => {
    if (!id) { setNotif(null); return; }
    const h = getAuthHeaders();

    // First try to find in the notifications list
    fetch(`/api/notifications?limit=100`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setNotif(null); return; }
        const list = data.data?.notifications ?? data.notifications ?? [];
        const found = Array.isArray(list) ? list.find((n: any) => n.id === id) : null;
        if (found) {
          // Map DB notification to NotifRecord
          const typeMap: Record<string, NotifType> = {
            'audition_scheduled': 'audition', 'audition_reminder': 'audition',
            'application_update': 'application', 'application_new': 'application',
            'shortlisted': 'shortlisted', 'message': 'message', 'message_new': 'message',
            'profile_view': 'profile', 'casting_match': 'casting',
            'account': 'account', 'system': 'system',
          };
          const rawType = found.type ?? 'system';
          const type: NotifType = typeMap[rawType] ?? (TYPE_CFG[rawType as NotifType] ? rawType as NotifType : 'system');
          setNotif({
            id: Number(id),
            type,
            read:      found.is_read ?? found.read ?? false,
            parts:     [found.message ?? found.title ?? 'Notification'],
            subtitle:  found.action_url ? `Tap to view details` : undefined,
            timestamp: found.created_at
              ? new Date(found.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : '',
          });
          // Mark as read
          fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...h },
            body: JSON.stringify({ notification_id: id }),
          }).catch(() => {});
        } else {
          setNotif(null);
        }
      })
      .catch(() => setNotif(null));

    // Messages badge
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.conversations ?? data;
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
      })
      .catch(() => {});
  }, [id]);

  const cfg  = notif ? TYPE_CFG[notif.type] : TYPE_CFG.system;
  const Icon = cfg.icon;
  const ad   = notif?.auditionDetail;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, color: '#F5F5F5', fontFamily: BARLOW }}>

      {/* ══ HEADER — identical structure to notifications/page.tsx ══ */}
      <header style={{ height: 60, flexShrink: 0, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />

        {/* Find Casting Calls */}
        <button
          onClick={() => router.push('/casting-calls')}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '0 16px', height: 36, fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,166,74,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >+ Find Casting Calls</button>

        {/* Bell — active state since we're in notifications */}
        <div onClick={() => router.push('/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(200,32,42,0.15)', border: `1px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={16} color={RED} />
          </div>
        </div>

        {/* Messages */}
        <div onClick={() => router.push('/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={16} />
          </div>
          {msgCount > 0 && (
            <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{msgCount}</div>
          )}
        </div>

        {/* Profile dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
            <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff`} alt={userName}
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
                <div key={item}
                  style={{ padding: '10px 16px', fontSize: 16, fontFamily: BARLOW, cursor: 'pointer', color: item === 'Logout' ? '#ff6b6b' : '#fff', borderTop: item === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                  onClick={() => {
                    setDropdownOpen(false);
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

        {/* ── SIDEBAR — collapsible, identical to notifications/page.tsx ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          <nav style={{ flex: 1, padding: '10px 0' }}>
            {SIDEBAR_ITEMS.map(({ icon: SIcon, label, active, badge, href }) => (
              <div key={label}
                title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '9px 16px' : '10px 0', cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : '3px solid transparent' }}
                onClick={() => router.push(href)}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                  <SIcon size={15} color={active ? RED : 'rgba(255,255,255,0.45)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 16, fontFamily: BARLOW, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && badge && (
                  <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>
                )}
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

        {/* ── SHARED SCROLL WRAPPER — single scroll, no double scrollbar ── */}
        <div style={{ display: 'flex', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0, padding: '20px 16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Back link */}
            <button
              onClick={() => router.push('/notifications')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: BARLOW, padding: 0, width: 'fit-content' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              <ChevronLeft size={15} /> Back to Notifications
            </button>

            {notif === undefined ? (
              /* ── Loading ── */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Loading notification...</div>
              </div>
            ) : notif === null ? (
              /* ── Not found ── */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 14, textAlign: 'center' }}>
                <AlertCircle size={48} color="rgba(255,255,255,0.2)" />
                <div style={{ fontSize: 22, fontFamily: BEBAS, letterSpacing: 1 }}>Notification not found</div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>This notification may have been removed or the link is invalid.</div>
                <button onClick={() => router.push('/notifications')} style={{ background: RED, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Back to Notifications</button>
              </div>
            ) : (
              <>
                {/* Notification header card */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={cfg.iconColor} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 16, fontFamily: BARLOW, lineHeight: 1.5, margin: '0 0 4px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                      <RichText parts={notif.parts} />
                    </p>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{notif.timestamp}</span>
                  </div>
                </div>

                {ad ? (
                  <>
                    {/* Project card */}
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <img src={ad.project.img} alt={ad.project.title} style={{ width: 90, height: 66, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                            {(() => { const bc = TYPE_BADGE_CFG[ad.project.type] || TYPE_BADGE_CFG['TV Series']; return (
                              <span style={{ fontSize: 13, fontFamily: BARLOW, fontWeight: 600, background: bc.bg, color: bc.color, border: `1px solid ${bc.border}`, borderRadius: 6, padding: '2px 10px' }}>{ad.project.type}</span>
                            ); })()}
                            <span style={{ fontSize: 22, fontFamily: BEBAS, letterSpacing: 1, color: '#fff' }}>{ad.project.title}</span>
                          </div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, marginBottom: 6 }}>
                            {ad.project.genres.join(' • ')} | {ad.project.language}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                            <div style={{ width: 22, height: 22, borderRadius: 4, background: ad.project.company.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{ad.project.company.initials}</div>
                            <span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.7)' }}>{ad.project.company.name}</span>
                            {ad.project.company.verified && <span style={{ fontSize: 13, color: '#60A5FA' }}>✔</span>}
                          </div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>
                            Director: <strong style={{ color: '#fff' }}>{ad.project.director}</strong>
                            &nbsp;&nbsp;Shoot: <strong style={{ color: '#fff' }}>{ad.project.shootLocation}</strong>
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginTop: 10, lineHeight: 1.6 }}>{ad.project.description}</div>
                    </div>

                    {/* Role Details */}
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px' }}>
                      <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 12, color: '#fff' }}>Role Details</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 10 }}>
                        {[
                          { label: 'Role',           value: ad.role.name          },
                          { label: 'Character Type', value: ad.role.characterType },
                          { label: 'Gender',         value: ad.role.gender        },
                          { label: 'Age Range',      value: ad.role.ageRange      },
                        ].map(({ label, value }) => (
                          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{label}</span>
                            <span style={{ fontSize: 15, color: '#F5F5F5', fontFamily: BARLOW, fontWeight: 600 }}>{value}</span>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW, lineHeight: 1.6, margin: 0 }}>{ad.role.description}</p>
                    </div>

                    {/* Audition Details */}
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px' }}>
                      <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 12, color: '#fff' }}>Audition Details</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 14 }}>
                        {[
                          { label: 'Date',     value: ad.audition.date           },
                          { label: 'Time',     value: ad.audition.time           },
                          { label: 'Venue',    value: ad.audition.location       },
                          { label: 'Address',  value: ad.audition.locationDetail },
                          { label: 'Format',   value: ad.audition.type           },
                        ].map(({ label, value }) => (
                          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{label}</span>
                            <span style={{ fontSize: 15, color: '#F5F5F5', fontFamily: BARLOW, fontWeight: 600, textAlign: 'right' }}>{value}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Instructions</div>
                      <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {ad.audition.instructions.map((ins, i) => (
                          <li key={i} style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW, lineHeight: 1.5 }}>{ins}</li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA buttons */}
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => router.push(`/auditions/${id}`)}
                        style={{ flex: 1, background: RED, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 0', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#a01820'}
                        onMouseLeave={e => e.currentTarget.style.background = RED}
                      >View Audition Details</button>
                      <button
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: BG2, color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '11px 24px', fontSize: 16, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                      >
                        <CalendarPlus size={15} /> Add to Calendar
                      </button>
                    </div>
                  </>
                ) : (
                  /* Non-audition detail */
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW, lineHeight: 1.7, marginBottom: 16 }}>
                      {notif.subtitle || 'No additional details available for this notification.'}
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {notif.type === 'application'  && <button onClick={() => router.push('/my-applications')} style={{ background: RED, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>View My Applications</button>}
                      {notif.type === 'shortlisted'  && <button onClick={() => router.push('/my-applications')} style={{ background: RED, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>View Shortlisted</button>}
                      {notif.type === 'message'      && <button onClick={() => router.push('/messages')}        style={{ background: RED, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Open Messages</button>}
                      {notif.type === 'casting'      && <button onClick={() => router.push('/casting-calls')}  style={{ background: RED, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>View Casting Calls</button>}
                      {(notif.type === 'profile' || notif.type === 'account') && <button onClick={() => router.push('/my-profile')} style={{ background: RED, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>View Profile</button>}
                      {notif.type === 'system'       && <button onClick={() => router.push('/pricing')}        style={{ background: RED, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>View Plans</button>}
                      <button onClick={() => router.push('/notifications')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '10px 20px', fontSize: 16, fontFamily: BARLOW, cursor: 'pointer' }}>Back to All</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── RIGHT RAIL ── */}
          <div style={{ width: 296, flexShrink: 0, display: 'flex' }}>
            <div style={{ flex: 1, padding: '20px 16px 20px 4px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* About the Project */}
              {ad && (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
                  <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 10, color: '#fff' }}>About the Project</div>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW, lineHeight: 1.6, marginBottom: 12 }}>{ad.project.description}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      { label: 'Director',       value: ad.project.director      },
                      { label: 'Producer',       value: ad.project.producer      },
                      { label: 'Project Type',   value: ad.project.projectType   },
                      { label: 'Language',       value: ad.project.language      },
                      { label: 'Shoot Location', value: ad.project.shootLocation },
                    ].map(({ label, value }, i, arr) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                        <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{label}</span>
                        <span style={{ fontSize: 15, color: '#F5F5F5', fontFamily: BARLOW, fontWeight: 600, textAlign: 'right' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What happens next? */}
              {ad && (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
                  <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 14, color: '#fff' }}>What happens next?</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {ad.timeline.map((step, i) => (
                      <TimelineStep key={step.label} {...step} isLast={i === ad.timeline.length - 1} />
                    ))}
                  </div>
                </div>
              )}

              {/* Need Help */}
              <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 17 }}>?</span>
                  </div>
                  <span style={{ fontSize: 18, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Need Help?</span>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, lineHeight: 1.6, marginBottom: 12 }}>Have questions? Contact the casting team directly.</p>
                <button
                  onClick={() => router.push('/messages')}
                  style={{ width: '100%', background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#a01820'}
                  onMouseLeave={e => e.currentTarget.style.background = RED}
                >
                  <MessageSquare size={15} /> Message Casting Team
                </button>
              </div>

            </div>
            <div style={{ width: 16, flexShrink: 0 }} />
          </div>

        </div>{/* end shared scroll wrapper */}
      </div>{/* end body */}
    </div>
  );
}