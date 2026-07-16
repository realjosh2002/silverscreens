'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, ChevronRight, Menu,
  CheckCheck, ChevronRight as Arrow, Shield, Megaphone as Bullhorn,
  Users, UserPlus,
} from 'lucide-react';

/* ─── Design tokens ───────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';
const ORANGE = '#F97316';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  badge: 12,    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', badge: 24,href: '/agency/notifications', active: true },
];

/* ─── Notification types & icons ─────────────────────────────── */
type NType = 'application' | 'shortlist' | 'audition' | 'message' | 'casting' | 'system' | 'team';

interface Notification {
  id: string; type: NType; read: boolean;
  title: React.ReactNode; subtitle: string;
  time: string; href: string;
}

const TYPE_CFG: Record<NType, { icon: React.ReactNode; iconBg: string }> = {
  application: { icon: <Users size={18} color="#fff" />,        iconBg: GREEN   },
  shortlist:   { icon: <Star size={18} color="#fff" fill="#fff"/>,iconBg: PURPLE },
  audition:    { icon: <CalendarCheck size={18} color="#fff" />, iconBg: ORANGE  },
  message:     { icon: <MessageSquare size={18} color="#fff" />, iconBg: BLUE    },
  casting:     { icon: <Bullhorn size={18} color="#fff" />,      iconBg: GOLD    },
  team:        { icon: <UserPlus size={18} color="#fff" />,      iconBg: '#14b8a6'},
  system:      { icon: <Shield size={18} color="#fff" />,        iconBg: '#6b7280'},
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1', type: 'application', read: false,
    title: <>You have <span style={{ color: GREEN, fontWeight: 700 }}>15 new applications</span> for <strong>"Lead Hero"</strong> in <strong>City of Dreams</strong>.</>,
    subtitle: 'City of Dreams  •  Feature Film',
    time: '10:30 AM', href: '/agency/applications',
  },
  {
    id: 'n2', type: 'shortlist', read: false,
    title: <>Meera Iyer has been <span style={{ color: PURPLE, fontWeight: 700 }}>shortlisted</span> for <strong>"Female Lead"</strong> in <strong>The Silent Witness</strong>.</>,
    subtitle: 'The Silent Witness  •  Short Film',
    time: 'Yesterday, 04:15 PM', href: '/agency/shortlisted',
  },
  {
    id: 'n3', type: 'audition', read: false,
    title: <>Upcoming audition for <strong>4 candidates</strong> in <strong>Rangbaaz: Dobara</strong>.</>,
    subtitle: '24 May 2024, 11:00 AM  •  Mumbai (Andheri)',
    time: 'Yesterday, 11:45 AM', href: '/agency/auditions',
  },
  {
    id: 'n4', type: 'message', read: true,
    title: <><strong>Arjun Malhotra</strong> sent you a message regarding your application.</>,
    subtitle: 'Regarding: Lead Hero - City of Dreams',
    time: '22 May 2024, 06:20 PM', href: '/agency/messages',
  },
  {
    id: 'n5', type: 'shortlist', read: true,
    title: <>You marked <strong>3 candidates</strong> as shortlisted for <strong>Antagonist</strong> in <strong>Rangbaaz: Dobara</strong>.</>,
    subtitle: 'Rangbaaz: Dobara  •  Web Series',
    time: '22 May 2024, 03:10 PM', href: '/agency/shortlisted',
  },
  {
    id: 'n6', type: 'casting', read: true,
    title: <>Your casting call <strong>"Supporting Actor"</strong> in <strong>Love in Rewind</strong> is now live.</>,
    subtitle: 'Love in Rewind  •  Music Video',
    time: '21 May 2024, 09:30 AM', href: '/agency/casting-calls',
  },
  {
    id: 'n7', type: 'team', read: true,
    title: <>New team member <strong>Riya Sharma</strong> has joined your company.</>,
    subtitle: 'Casting Assistant',
    time: '20 May 2024, 05:40 PM', href: '/agency/dashboard',
  },
  {
    id: 'n8', type: 'system', read: true,
    title: <><strong>System Update:</strong> New verification guidelines have been updated.</>,
    subtitle: 'Please review the changes.',
    time: '20 May 2024, 12:25 PM', href: '/agency/dashboard',
  },
];

const FILTER_TABS = [
  { key: 'all',         label: 'All',          count: 24 },
  { key: 'application', label: 'Applications', count: 8  },
  { key: 'audition',    label: 'Auditions',    count: 5  },
  { key: 'message',     label: 'Messages',     count: 4  },
  { key: 'casting',     label: 'Castings',     count: 4  },
  { key: 'system',      label: 'System',       count: 3  },
];

const RIGHT_FILTERS = [
  { key: 'all',         label: 'All Notifications', count: 24 },
  { key: 'unread',      label: 'Unread',             count: 8  },
  { key: 'application', label: 'Applications',       count: 8  },
  { key: 'audition',    label: 'Auditions',           count: 5  },
  { key: 'message',     label: 'Messages',            count: 4  },
  { key: 'casting',     label: 'Castings',            count: 4  },
  { key: 'system',      label: 'System',              count: 3  },
];

/* ── Auth helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

/* ── Normalise API notification → Notification shape ── */
function apiToNotification(n: any, idx: number): Notification {
  const type: NType = TYPE_CFG[n.type as NType] ? n.type : 'system';
  const title = n.title ?? n.message ?? 'Notification';
  return {
    id:       String(n.id ?? n._id ?? idx),
    type,
    read:     n.read ?? n.isRead ?? false,
    title:    typeof title === 'string' ? <>{title}</> : title,
    subtitle: n.subtitle ?? n.description ?? '',
    time:     n.createdAt
      ? new Date(n.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      : n.time ?? '',
    href:     n.href ?? '/agency/dashboard',
  };
}
export default function NotificationsPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState('all');
  const [rightFilter,  setRightFilter]  = useState('all');
  const [notifications,setNotifications]= useState<Notification[]>(NOTIFICATIONS);
  const [pushOn,       setPushOn]       = useState(true);
  const [emailOn,      setEmailOn]      = useState(true);
  const [smsOn,        setSmsOn]        = useState(false);
  const [marketOn,     setMarketOn]     = useState(false);
  const [page,         setPage]         = useState(1);

  /* ── Live data ── */
  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('AGE·········');
  const [agencyType,     setAgencyType]     = useState('Production House');
  const [msgCount,       setMsgCount]       = useState(12);

  const PER_PAGE = 8;
  const SB_W = sidebarOpen ? 230 : 52;

  /* ── Load agency identity from ss_user instantly ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) {
        setAgencyName(u.name);
        setAgencyInitials(u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
      }
      if (u.profileNumber) setAgencyId(u.profileNumber);
    } catch {}
  }, []);

  /* ── Fetch notifications + badge counts on mount ── */
  useEffect(() => {
    const h = getAuthHeaders();

    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.notifications ?? data;
        if (!Array.isArray(list) || list.length === 0) return;
        setNotifications(list.map((n: any, i: number) => apiToNotification(n, i)));
      }).catch(() => {});

    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const p = data.profile ?? data;
        if (p.companyName || p.name) {
          const name = p.companyName ?? p.name;
          setAgencyName(name);
          setAgencyInitials(name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
        }
        if (p.profileNumber) setAgencyId(p.profileNumber);
        if (p.companyType)   setAgencyType(p.companyType);
      }).catch(() => {});

    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.conversations ?? data;
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
      }).catch(() => {});
  }, []);

  const markAllRead = () => {
    setNotifications(p => p.map(n => ({ ...n, read: true }))); // optimistic
    const h = getAuthHeaders();
    fetch('/api/notifications/mark-read', {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...h },
      body: JSON.stringify({ all: true }),
    }).catch(() => {});
  };

  const markRead = (id: string) => {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n)); // optimistic
    const h = getAuthHeaders();
    fetch(`/api/notifications/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', ...h },
      body: JSON.stringify({ read: true }),
    }).catch(() => {});
  };

  // Live counts computed from real data
  const liveCounts = useMemo(() => ({
    all:         notifications.length,
    unread:      notifications.filter(n => !n.read).length,
    application: notifications.filter(n => n.type === 'application').length,
    audition:    notifications.filter(n => n.type === 'audition').length,
    message:     notifications.filter(n => n.type === 'message').length,
    casting:     notifications.filter(n => n.type === 'casting').length,
    system:      notifications.filter(n => n.type === 'system' || n.type === 'team').length,
  }), [notifications]);

  const filtered = notifications.filter(n => {
    const tabMatch = activeTab === 'all' || n.type === activeTab;
    const rfMatch  = rightFilter === 'all' ? true : rightFilter === 'unread' ? !n.read : n.type === rightFilter;
    return tabMatch && rfMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const unreadCount = notifications.filter(n => !n.read).length;

  const Toggle = ({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) => (
    <div onClick={() => setOn(!on)} style={{ width: 42, height: 24, borderRadius: 12, background: on ? RED : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Post a Casting <span style={{ fontSize: 16, fontWeight: 400 }}>+</span>
        </button>
        <div onClick={() => router.push('/agency/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {msgCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{msgCount}</div>}
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {unreadCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{unreadCount}</div>}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{agencyType}</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 220, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Agency ID</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: GOLD, fontFamily: BARLOW }}>{agencyId}</span>
                </div>
                {[
                  { label: 'Reports & Analytics', href: '/agency/reports' },
                  { label: 'Subscription & Billing', href: '/pricing' },
                  { label: 'Company Profile', href: '/agency-profile' },
                  { label: 'Documents', href: '/agency/documents' },
                  { label: 'Calendar', href: '/agency/calendar' },
                  { label: 'Settings', href: '/agency/settings' },
                  { label: 'Support', href: '/contact' },
                  { label: 'Logout', href: '/login' },
                ].map(({ label, href }) => (
                  <div key={label} onClick={() => { if (label === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); } else { router.push(href); setProfileOpen(false); } }}
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

        {/* ── COLLAPSIBLE SIDEBAR ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', transition: 'width 0.2s ease' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>{agencyInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, active, badge, href }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none', position: 'relative' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(200,32,42,0.12)' : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0, justifyContent: 'center' }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
                {!sidebarOpen && badge && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{badge}</div>}
              </div>
            ))}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205,#2a1e0a)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock unlimited applications, advanced analytics & more.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── CENTRE + RIGHT ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── MAIN NOTIFICATIONS ── */}
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h1 style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, color: '#fff', margin: '0 0 4px' }}>Notifications</h1>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Stay updated with important activities and alerts.</div>
                </div>
                <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', color: RED, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>
                  Mark all as read <CheckCheck size={15} color={RED} />
                </button>
              </div>

              {/* Filter tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>
                {FILTER_TABS.map(tab => {
                  const active = activeTab === tab.key;
                  const liveCount = liveCounts[tab.key as keyof typeof liveCounts] ?? 0;
                  return (
                    <div key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); }} style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: active ? `2px solid ${RED}` : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: active ? 700 : 500, color: active ? RED : 'rgba(255,255,255,0.5)' }}>
                        {tab.label} <span style={{ fontSize: 14, color: active ? RED : 'rgba(255,255,255,0.3)' }}>({liveCount})</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notification list */}
            <div style={{ flex: 1, padding: '0 24px' }}>
              {paged.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
                  <Bell size={36} color="rgba(255,255,255,0.1)" style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>No notifications in this category.</div>
                </div>
              ) : paged.map((n, idx) => {
                const cfg = TYPE_CFG[n.type];
                return (
                  <div key={n.id} onClick={() => { markRead(n.id); router.push(n.href); }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', background: n.read ? 'transparent' : 'rgba(200,32,42,0.04)', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', position: 'relative', transition: 'background 0.15s', borderRadius: idx === 0 ? '12px 12px 0 0' : idx === paged.length - 1 ? '0 0 12px 12px' : 0 }}
                    onMouseEnter={e => (e.currentTarget.style.background = n.read ? 'rgba(255,255,255,0.025)' : 'rgba(200,32,42,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(200,32,42,0.04)')}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: RED }} />
                    )}

                    {/* Icon */}
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, color: n.read ? 'rgba(255,255,255,0.7)' : '#fff', lineHeight: 1.5, marginBottom: 4 }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{n.subtitle}</div>
                    </div>

                    {/* Time + chevron */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{n.time}</span>
                      <Arrow size={16} color="rgba(255,255,255,0.25)" />
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 24px', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                  Showing {(page-1)*PER_PAGE+1} to {Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} notifications
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <PBtn onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}><ChevronLeft size={13} /></PBtn>
                  {[1,2,3].map(n => <PBtn key={n} onClick={() => setPage(n)} active={page===n}>{n}</PBtn>)}
                  <PBtn onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}><ChevronRight size={13} /></PBtn>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{ width: 260, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', scrollbarWidth: 'none', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Filter Notifications */}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Filter Notifications</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {RIGHT_FILTERS.map(f => {
                  const active = rightFilter === f.key;
                  const liveCount = liveCounts[f.key as keyof typeof liveCounts] ?? 0;
                  return (
                    <div key={f.key} onClick={() => { setRightFilter(f.key); setPage(1); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, cursor: 'pointer', background: active ? `${RED}15` : 'transparent', borderLeft: active ? `3px solid ${RED}` : '3px solid transparent', transition: 'all 0.1s' }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: 14, color: active ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: active ? 600 : 400 }}>{f.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: active ? RED : 'rgba(255,255,255,0.35)', background: active ? `${RED}20` : 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '1px 8px', minWidth: 24, textAlign: 'center' as const }}>{liveCount}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

            {/* Notification Settings */}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Notification Settings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Push Notifications', icon: <Bell size={15} />,         on: pushOn,   set: setPushOn   },
                  { label: 'Email Notifications',icon: <MessageSquare size={15} />, on: emailOn,  set: setEmailOn  },
                  { label: 'SMS Notifications',  icon: <MessageSquare size={15} />, on: smsOn,    set: setSmsOn    },
                  { label: 'Marketing Emails',   icon: <Bullhorn size={15} />,      on: marketOn, set: setMarketOn },
                ].map(({ label, icon, on, set }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', display: 'flex' }}>{icon}</span>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{label}</span>
                    </div>
                    <Toggle on={on} setOn={set} />
                  </div>
                ))}
              </div>
              <button style={{ width: '100%', marginTop: 16, background: 'none', border: `1px solid ${RED}`, borderRadius: 8, padding: '9px 0', color: RED, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                Manage Preferences
              </button>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

            {/* Need Help */}
            <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${GOLD}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14 }}>?</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Need Help?</span>
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 12, lineHeight: 1.5 }}>
                Learn how notifications work on SilverScreens.
              </div>
              <div onClick={() => router.push('/contact')} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: RED, fontWeight: 600, cursor: 'pointer' }}>
                Visit Help Center <Arrow size={14} color={RED} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function PBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, borderRadius: 7, border: `1px solid ${active ? RED : 'rgba(255,255,255,0.12)'}`, background: active ? RED : 'transparent', color: active ? '#fff' : disabled ? 'rgba(255,255,255,0.2)' : '#fff', fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: active ? 700 : 400, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
      {children}
    </button>
  );
}