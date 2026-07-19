'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, ChevronRight, Menu,
  Search, Filter, Download, Calendar, Clock, MapPin,
  Eye, Edit2, X, Check, MoreVertical, Plus,
  CheckSquare, Square, Video, Phone,
} from 'lucide-react';

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
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions', active: true },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  badge: 12,    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', badge: 3, href: '/agency/notifications' },
];

type AuditionStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'Pending' | 'In Review' | 'Selected' | 'Rejected';

const STATUS_CFG: Record<AuditionStatus, { color: string; bg: string; border: string }> = {
  Scheduled:   { color: BLUE,   bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)'  },
  Completed:   { color: GREEN,  bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)'   },
  Cancelled:   { color: RED,    bg: 'rgba(200,32,42,0.12)',   border: 'rgba(200,32,42,0.3)'   },
  Rescheduled: { color: GOLD,   bg: 'rgba(212,166,74,0.12)',  border: 'rgba(212,166,74,0.3)'  },
  Pending:     { color: ORANGE, bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.3)'  },
  'In Review':  { color: GOLD,   bg: 'rgba(212,166,74,0.12)',  border: 'rgba(212,166,74,0.3)'  },
  Selected:    { color: GREEN,  bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)'   },
  Rejected:    { color: RED,    bg: 'rgba(200,32,42,0.12)',   border: 'rgba(200,32,42,0.3)'   },
};

interface Audition {
  id: string;
  candidateId: string;
  aspirantUserId: string; // ← the profiles.id (user_id) needed for messaging
  name: string; verified: boolean;
  role: string; castingCall: string; projectType: string;
  date: string; time: string; duration: string;
  format: 'In-Person' | 'Virtual' | 'Self-Tape';
  location: string;
  round: string;
  status: AuditionStatus;
  img: string;
  rating?: number;
  notes?: string;
}

const STATUS_TAB_MAP: Record<string, AuditionStatus[]> = {
  all:         ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'Pending', 'In Review', 'Selected', 'Rejected'],
  inreview:    ['In Review'],
  scheduled:   ['Scheduled'],
  completed:   ['Completed'],
  pending:     ['Pending'],
  rescheduled: ['Rescheduled'],
  cancelled:   ['Cancelled'],
  selected:    ['Selected'],
  rejected:    ['Rejected'],
};

const FORMAT_ICON: Record<string, React.ReactNode> = {
  'In-Person': <MapPin size={12} />,
  'Virtual':   <Video size={12} />,
  'Self-Tape': <Eye size={12} />,
};

export default function AuditionManagementPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState('all');
  const [search,       setSearch]       = useState('');
  const [sortBy,       setSortBy]       = useState('Date: Newest');
  const [sortOpen,     setSortOpen]     = useState(false);
  const [selectedIds,  setSelectedIds]  = useState<string[]>([]);
  const [rowMenuOpen,  setRowMenuOpen]  = useState<string | null>(null);
  const [page,         setPage]         = useState(1);
  const [auditions,    setAuditions]    = useState<Audition[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [agencyName,   setAgencyName]   = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,     setAgencyId]     = useState('AGE·········');
  const [msgCount,     setMsgCount]     = useState(0);
  const [notifCount,   setNotifCount]   = useState(0);
  const PER_PAGE = 10;

  const SUB_TABS = [
    { key: 'all',         label: 'All',         count: auditions.length },
    { key: 'inreview',    label: 'In Review',   count: auditions.filter(a => a.status === 'In Review').length   },
    { key: 'scheduled',   label: 'Scheduled',   count: auditions.filter(a => a.status === 'Scheduled').length   },
    { key: 'completed',   label: 'Completed',   count: auditions.filter(a => a.status === 'Completed').length   },
    { key: 'pending',     label: 'Pending',     count: auditions.filter(a => a.status === 'Pending').length     },
    { key: 'rescheduled', label: 'Rescheduled', count: auditions.filter(a => a.status === 'Rescheduled').length },
    { key: 'cancelled',   label: 'Cancelled',   count: auditions.filter(a => a.status === 'Cancelled').length   },
    { key: 'selected',    label: 'Selected',    count: auditions.filter(a => a.status === 'Selected').length    },
    { key: 'rejected',    label: 'Rejected',    count: auditions.filter(a => a.status === 'Rejected').length    },
  ];

  const SB_W = sidebarOpen ? 230 : 52;

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

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) { setLoading(false); return; }

    const h = { Authorization: `Bearer ${token}` };

    fetch('/api/auditions?limit=100', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.auditions ?? data.auditions ?? [];
        if (!Array.isArray(list) || list.length === 0) return;
        const statusMap: Record<string, AuditionStatus> = {
          scheduled:   'Scheduled',
          completed:   'Completed',
          cancelled:   'Cancelled',
          rescheduled: 'Rescheduled',
        };
        const modeMap: Record<string, Audition['format']> = {
          offline: 'In-Person',
          online:  'Virtual',
          both:    'Self-Tape',
        };
        setAuditions(list.map((a: any) => {
          const ap = a.aspirant_profiles ?? {};
          const cc = a.casting_calls ?? {};
          const scheduledAt = a.scheduled_at ? new Date(a.scheduled_at) : null;
          return {
            id:             a.id,
            candidateId:    ap.id ?? a.aspirant_id,
            // aspirant_profiles.user_id is the profiles.id needed for messaging
            aspirantUserId: ap.user_id ?? a.aspirant_id ?? '',
            name:           [ap.first_name, ap.last_name].filter(Boolean).join(' ') || 'Unknown',
            verified:       ap.verification_status === 'approved',
            role:           cc.role_name ?? '',
            castingCall:    cc.title ?? '',
            projectType:    cc.project_type ?? '',
            date:           scheduledAt ? scheduledAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            time:           scheduledAt ? scheduledAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
            duration:       `${a.duration_minutes ?? 30} min`,
            format:         modeMap[a.mode] ?? 'In-Person',
            location:       a.venue_details ?? (a.mode === 'online' ? 'Video Call (link sent)' : ''),
            round:          'Audition Round',
            status:         statusMap[a.status] ?? 'Scheduled',
            img:            ap.profile_image_url ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
            notes:          a.notes,
          } as Audition;
        }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.conversations ?? data.conversations ?? [];
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
      }).catch(() => {});

    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const count = data.data?.unread_count ?? data.unread_count;
        if (count != null) setNotifCount(count);
      }).catch(() => {});
  }, []);

  const filtered = auditions.filter(a => {
    const tabMatch = STATUS_TAB_MAP[activeTab]?.includes(a.status);
    const searchMatch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.castingCall.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats from real data
  const totalScheduled = auditions.filter(a => a.status === 'Scheduled').length;
  const totalCompleted = auditions.filter(a => a.status === 'Completed').length;
  const totalPending   = auditions.filter(a => a.status === 'Pending').length;
  const totalCancelled = auditions.filter(a => a.status === 'Cancelled').length;

  const toggleSelect = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelectedIds(p => p.length === filtered.length ? [] : filtered.map(a => a.id));

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
          {notifCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{notifCount}</div>}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Production House</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 220, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Agency ID</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{agencyId}</span>
                </div>
                {[
                  { label: 'Reports & Analytics',   href: '/agency/reports'    },
                  { label: 'Subscription & Billing', href: '/pricing'           },
                  { label: 'Company Profile',        href: '/agency-profile'    },
                  { label: 'Documents',              href: '/agency/documents'  },
                  { label: 'Calendar',               href: '/agency/calendar'   },
                  { label: 'Settings',               href: '/agency/settings'   },
                  { label: 'Support',                href: '/contact'           },
                  { label: 'Logout',                 href: '/login'             },
                ].map(({ label, href }) => (
                  <div key={label} onClick={() => {
                    if (label === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); }
                    else { router.push(href); setProfileOpen(false); }
                  }}
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(200,32,42,0.12)' : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0 }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 14, color: active ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 32px' }}>

          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, fontWeight: 400, marginBottom: 4 }}>Audition Management</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Track, manage and review all your scheduled auditions.</p>
            </div>
            <button onClick={() => router.push('/agency/auditions/schedule')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>
              <Plus size={15} /> Schedule Audition
            </button>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total Scheduled', value: totalScheduled, sub: 'All time',      icon: '📅', color: BLUE   },
              { label: 'Completed',       value: totalCompleted, sub: 'All time',      icon: '✅', color: GREEN  },
              { label: 'Pending',         value: totalPending,   sub: 'Awaiting conf.', icon: '⏳', color: ORANGE },
              { label: 'Cancelled',       value: totalCancelled, sub: 'All time',      icon: '❌', color: RED    },
            ].map(stat => (
              <div key={stat.label} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${stat.color}18`, border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{stat.icon}</div>
                <div>
                  <div style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 0.5, lineHeight: 1, color: '#fff' }}>{stat.value}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 1 }}>{stat.label}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search + toolbar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 12px', height: 38 }}>
              <Search size={14} color="rgba(255,255,255,0.35)" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by candidate or casting call..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: '#fff', fontFamily: BARLOW }} />
              {search && <X size={13} color="rgba(255,255,255,0.4)" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 14px', height: 38, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW, cursor: 'pointer' }}><Filter size={13} /> Filters</button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 14px', height: 38, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW, cursor: 'pointer' }}><Download size={13} /> Export</button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 14px', height: 38, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW, cursor: 'pointer' }}><Calendar size={13} /> Calendar View</button>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setSortOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 14px', height: 38, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW, cursor: 'pointer' }}>Sort: {sortBy} <ChevronDown size={12} /></button>
              {sortOpen && (
                <>
                  <div onClick={() => setSortOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
                  <div style={{ position: 'absolute', top: 42, right: 0, width: 180, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
                    {['Date: Newest', 'Date: Oldest', 'Name: A–Z', 'Status'].map(opt => (
                      <div key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }} style={{ padding: '9px 14px', fontSize: 14, cursor: 'pointer', color: sortBy === opt ? RED : '#F5F5F5' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >{opt}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', overflowX: 'auto', scrollbarWidth: 'none' }}>
              {SUB_TABS.map(t => (
                <button key={t.key} onClick={() => { setActiveTab(t.key); setPage(1); }} style={{ background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === t.key ? RED : 'transparent'}`, padding: '12px 16px', fontSize: 14, fontFamily: BARLOW, fontWeight: activeTab === t.key ? 700 : 400, color: activeTab === t.key ? RED : 'rgba(255,255,255,0.5)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1.4fr 1.1fr 0.9fr 0.85fr 96px', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span onClick={toggleAll} style={{ cursor: 'pointer', display: 'flex' }}>
                {selectedIds.length === filtered.length && filtered.length > 0
                  ? <CheckSquare size={15} color={RED} />
                  : <Square size={15} color="rgba(255,255,255,0.3)" />}
              </span>
              {['CANDIDATE', 'CASTING CALL', 'DATE & TIME', 'LOCATION', 'STATUS', 'ACTIONS'].map(h => (
                <div key={h} style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }}>{h}</div>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <div style={{ width: 32, height: 32, border: `3px solid rgba(255,255,255,0.1)`, borderTopColor: RED, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Loading auditions…</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Empty */}
            {!loading && paged.length === 0 && (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <CalendarCheck size={36} color="rgba(255,255,255,0.1)" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>No auditions match this filter.</div>
              </div>
            )}

            {/* Rows */}
            {!loading && paged.map((a, idx) => {
              const checked = selectedIds.includes(a.id);
              const scfg = STATUS_CFG[a.status];
              return (
                <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1.4fr 1.1fr 0.9fr 0.85fr 96px', alignItems: 'center', padding: '13px 18px', borderBottom: idx < paged.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span onClick={() => toggleSelect(a.id)} style={{ cursor: 'pointer', display: 'flex' }}>
                    {checked ? <CheckSquare size={15} color={RED} /> : <Square size={15} color="rgba(255,255,255,0.35)" />}
                  </span>

                  {/* Candidate */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <img src={a.img} alt={a.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 1 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                        {a.verified && <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3b82f6"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{a.role} · {a.round}</div>
                    </div>
                  </div>

                  {/* Casting Call */}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.castingCall}</div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '1px 7px' }}>{a.projectType}</span>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: '#fff', marginBottom: 2 }}>
                      <Calendar size={12} color="rgba(255,255,255,0.4)" /> {a.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                      <Clock size={11} color="rgba(255,255,255,0.35)" /> {a.time} · {a.duration}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: a.format === 'In-Person' ? GOLD : BLUE, marginBottom: 2 }}>
                      {FORMAT_ICON[a.format]} {a.format}
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.location}</div>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, color: scfg.color, background: scfg.bg, border: `1px solid ${scfg.border}`, borderRadius: 20, padding: '3px 10px', whiteSpace: 'nowrap' as const }}>{a.status}</span>
                    {a.rating && <div style={{ fontSize: 14, color: GOLD, marginTop: 3 }}>★ {a.rating}</div>}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }} onClick={e => e.stopPropagation()}>
                    <ABtn title="View Profile" onClick={() => router.push(`/agency/talent/${a.candidateId}`)}>
                      <Eye size={13} color="rgba(255,255,255,0.55)" />
                    </ABtn>
                    <ABtn title="Reschedule" onClick={() => router.push(`/agency/auditions/schedule?candidate=${a.candidateId}&from=auditions`)}>
                      <Edit2 size={13} color="rgba(255,255,255,0.55)" />
                    </ABtn>
                    <div style={{ position: 'relative' }}>
                      <ABtn title="More" onClick={() => setRowMenuOpen(rowMenuOpen === a.id ? null : a.id)}>
                        <MoreVertical size={13} color="rgba(255,255,255,0.55)" />
                      </ABtn>
                      {rowMenuOpen === a.id && (
                        <>
                          <div onClick={() => setRowMenuOpen(null)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
                          <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, width: 190, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 300, boxShadow: '0 12px 32px rgba(0,0,0,0.8)' }}>
                            {[
                              {
                                label: 'View Profile',
                                onClick: () => { router.push(`/agency/talent/${a.candidateId}`); setRowMenuOpen(null); }
                              },
                              {
                                label: 'View Application',
                                onClick: () => { router.push(`/agency/applications/${a.candidateId}`); setRowMenuOpen(null); }
                              },
                              {
                                label: 'Reschedule',
                                onClick: () => { router.push(`/agency/auditions/schedule?candidate=${a.candidateId}&from=auditions`); setRowMenuOpen(null); }
                              },
                              {
                                label: 'Send Message',
                                // ← Pass aspirantUserId and name so messages page can open the right conversation
                                onClick: () => {
                                  const params = new URLSearchParams({
                                    recipient_id:   a.aspirantUserId,
                                    recipient_name: a.name,
                                  });
                                  router.push(`/agency/messages?${params.toString()}`);
                                  setRowMenuOpen(null);
                                }
                              },
                              { label: 'Mark as Completed', onClick: () => setRowMenuOpen(null), color: GREEN },
                              { label: 'Cancel Audition',   onClick: () => setRowMenuOpen(null), color: RED   },
                            ].map(({ label, onClick, color }, mi) => (
                              <div key={label}>
                                {mi === 4 && <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />}
                                <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color: color || '#F5F5F5' }}
                                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >{label}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} auditions
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <PBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={13} /></PBtn>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <PBtn key={n} onClick={() => setPage(n)} active={page === n}>{n}</PBtn>
                  ))}
                  <PBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={13} /></PBtn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ABtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >{children}</button>
  );
}

function PBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, borderRadius: 7, border: `1px solid ${active ? RED : 'rgba(255,255,255,0.12)'}`, background: active ? RED : 'transparent', color: active ? '#fff' : disabled ? 'rgba(255,255,255,0.2)' : '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: active ? 700 : 400, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
      {children}
    </button>
  );
}