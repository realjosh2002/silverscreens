'use client';

import AspirantHeader from '@/components/layout/AspirantHeader'
import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {

  LayoutDashboard, FileText, MessageSquare, Mic2,
  Bookmark, Star, Bell, ChevronRight, ChevronDown, ChevronLeft, Menu,
  MapPin, CalendarDays, Clock, Send, XCircle, Check,
  Headphones, Video, Camera, User, Upload, PlusCircle, Eye, FolderOpen,
} from 'lucide-react';

/* ─── Design tokens — identical to dashboard ─────────────────── */
const RED      = '#EF4444';
const GOLD     = '#D4A64A';
const GOLD_DIM = 'rgba(212,166,74,0.12)'
const GOLD_BDR = 'rgba(212,166,74,0.22)'
const BG       = '#0D1117';
const BG2      = '#131720';
const BG3      = '#181E2A';
const BARLOW   = "'Barlow Condensed', sans-serif";

/* ─── Sidebar items — PRD finalized, My Applications active ──── */
const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard' },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications', active: true },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',    badge: 2 },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions' },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended' },
  { icon: Bell,            label: 'Notifications',        href: '/notifications'},
];

/* ─── Profile dropdown — PRD finalized ───────────────────────── */
const dropdownLinks = ['Subscription', 'Analytics', 'Calendar', 'Settings', 'Support', 'Logout'];

/* ─── Nav links — matches PublicNavbar ───────────────────────── */
const NAV_LINKS = [
  { label: 'Home',            href: '/' },
  { label: 'About Us',        href: '/about' },
  { label: 'Explore Talents', href: '/explore-talents', dropdown: [
    { label: 'Actors & Actresses',  href: '/explore-talents?category=Acting'    },
    { label: 'Models',              href: '/explore-talents?category=Modelling' },
    { label: 'Dancers',             href: '/explore-talents?category=Dancing'   },
    { label: 'Singers',             href: '/explore-talents?category=Singing'   },
    { label: 'Directors',           href: '/explore-talents?category=Direction' },
    { label: 'View All Categories', href: '/explore-talents'                    },
  ]},
  { label: 'Casting Calls',   href: '/casting-calls' },
  { label: 'Pricing Plans',   href: '/pricing' },
  { label: 'FAQs',            href: '/faq' },
  { label: 'Contact Us',      href: '/contact' },
];

/* ─── Tabs ───────────────────────────────────────────────────── */
const TABS = [
  { label: 'All',         status: null,          count: 18 },
  { label: 'Applied',     status: 'Applied',     count: 12 },
  { label: 'In Review',   status: 'In Review',   count: 4  },
  { label: 'Shortlisted', status: 'Shortlisted', count: 1  },
  { label: 'Rejected',    status: 'Rejected',    count: 1  },
];

const GENRE_CFG: Record<string, { bg: string; color: string }> = {
  'Feature Film': { bg: 'rgba(20,184,166,0.15)',  color: '#2DD4BF' },
  'Short Film':   { bg: 'rgba(148,163,184,0.12)', color: '#94A3B8' },
  'Web Series':   { bg: 'rgba(59,130,246,0.15)',  color: '#60A5FA' },
  'Music Video':  { bg: 'rgba(236,72,153,0.15)',  color: '#F472B6' },
  'Film':         { bg: 'rgba(20,184,166,0.15)',  color: '#2DD4BF' },
  'OTT':          { bg: 'rgba(168,85,247,0.15)',  color: '#C084FC' },
  'TV Series':    { bg: 'rgba(249,115,22,0.15)',  color: '#FB923C' },
  'Commercial':   { bg: 'rgba(234,179,8,0.15)',   color: '#FACC15' },
  'Reality Show': { bg: 'rgba(236,72,153,0.15)',  color: '#F472B6' },
};

const STATUS_CFG: Record<string, { bg: string; color: string; border: string }> = {
  'In Review':   { bg: 'rgba(59,130,246,0.15)',  color: '#60A5FA', border: 'rgba(59,130,246,0.3)'  },
  'Shortlisted': { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80', border: 'rgba(34,197,94,0.3)'   },
  'Applied':     { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: 'rgba(255,255,255,0.12)' },
  'Rejected':    { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', border: 'rgba(239,68,68,0.3)'   },
};

type AppStatus = 'In Review' | 'Shortlisted' | 'Applied' | 'Rejected';
type AppGenre  = 'Feature Film' | 'Short Film' | 'Web Series' | 'Music Video';

const APPLICATIONS: {
  id: number; title: string; genre: AppGenre; role: string;
  agency: string; location: string; appliedDate: string;
  dateTs: number; documents: number; status: AppStatus;
  updatedDate: string; img: string;
}[] = [
  { id: 1, title: 'City of Dreams',     genre: 'Feature Film', role: 'Lead Hero',        agency: 'Dharma Productions', location: 'Mumbai', appliedDate: '20 May 2024', dateTs: new Date('2024-05-20').getTime(), documents: 5, status: 'In Review',   updatedDate: '21 May 2024, 10:45 AM', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=200&fit=crop' },
  { id: 2, title: 'The Silent Witness', genre: 'Short Film',   role: 'Supporting Actor', agency: 'Red Frame Studios',  location: 'Mumbai', appliedDate: '18 May 2024', dateTs: new Date('2024-05-18').getTime(), documents: 4, status: 'Shortlisted', updatedDate: '21 May 2024, 02:30 PM', img: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300&h=200&fit=crop' },
  { id: 3, title: 'Rangbaaz: Dobara',   genre: 'Web Series',   role: 'Antagonist',       agency: 'NextWave Originals', location: 'Mumbai', appliedDate: '15 May 2024', dateTs: new Date('2024-05-15').getTime(), documents: 6, status: 'Applied',     updatedDate: '15 May 2024, 04:20 PM', img: 'https://images.unsplash.com/photo-1598387993441-a364f854cfbd?w=300&h=200&fit=crop' },
  { id: 4, title: 'Love in Rewind',     genre: 'Music Video',  role: 'Lead Role',        agency: 'Dream Factory',      location: 'Delhi',  appliedDate: '10 May 2024', dateTs: new Date('2024-05-10').getTime(), documents: 3, status: 'Rejected',    updatedDate: '12 May 2024, 11:10 AM', img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=300&h=200&fit=crop' },
  { id: 5, title: 'Broken Paths',       genre: 'Short Film',   role: 'Lead Role',        agency: 'Indie Frames',       location: 'Pune',   appliedDate: '05 May 2024', dateTs: new Date('2024-05-05').getTime(), documents: 4, status: 'Applied',     updatedDate: '05 May 2024, 09:15 PM', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=200&fit=crop' },
];

const APP_OVERVIEW = [
  { icon: Send,     iconBg: 'rgba(59,130,246,0.15)', iconColor: '#60A5FA', value: 12, label: 'Applied'     },
  { icon: Clock,    iconBg: 'rgba(234,179,8,0.15)',  iconColor: '#FACC15', value: 4,  label: 'In Review'   },
  { icon: Bookmark, iconBg: 'rgba(34,197,94,0.15)',  iconColor: '#4ADE80', value: 1,  label: 'Shortlisted' },
  { icon: XCircle,  iconBg: 'rgba(239,68,68,0.15)',  iconColor: '#F87171', value: 1,  label: 'Rejected'    },
];

const QUICK_ACTIONS = [
  { icon: Clock,      label: 'Update Availability', sub: 'Keep your schedule updated', href: '/settings'              },
  { icon: Upload,     label: 'Upload New Media',    sub: 'Increase your visibility',   href: '/my-profile?tab=media'  },
  { icon: PlusCircle, label: 'Add New Skill',       sub: 'Showcase your talents',      href: '/my-profile?tab=skills' },
  { icon: Eye,        label: 'View My Profile',     sub: 'See how you appear',         href: '/profile'    },
  { icon: FolderOpen, label: 'Manage Documents',    sub: 'Update your documents',      href: '/my-profile?tab=documents' },
];

const TIPS = [
  'Complete your profile 100%',
  'Upload high quality photos',
  'Keep your showreel updated',
  'Apply to relevant roles',
  'Respond quickly to callbacks',
];

const SORT_OPTIONS   = ['Newest First', 'Oldest First'];
const STATUS_OPTIONS = ['All Status', 'Applied', 'In Review', 'Shortlisted', 'Rejected'];
const ITEMS_PER_PAGE = 5;

/* ── Auth helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

export default function MyApplicationsPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openNav,      setOpenNav]      = useState<string | null>(null);
  const [sortOpen,     setSortOpen]     = useState(false);
  const [sortLabel,    setSortLabel]    = useState('Newest First');
  const [statusOpen,   setStatusOpen]   = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage,  setCurrentPage]  = useState(1);

  /* ── Live data ── */
  const [applications, setApplications] = useState<typeof APPLICATIONS>([]);
  const [loading,      setLoading]      = useState(true);
  const [userName,     setUserName]     = useState('My Account');
  const [avatarUrl,    setAvatarUrl]    = useState('');
  const [msgCount,     setMsgCount]     = useState(2);
  const [profileMediaCount, setProfileMediaCount] = useState(0);

  const SB_W = sidebarOpen ? 220 : 52;

  const sortRef   = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const dropRef   = useRef<HTMLDivElement>(null);

  /* ── Load user instantly from ss_user ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name)         setUserName(u.name);
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
    } catch {}
  }, []);

  /* ── Fetch applications + badge counts ── */
  useEffect(() => {
    const h = getAuthHeaders();

    // Applications
    fetch('/api/applications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.applications ?? data.applications ?? data.data ?? data;
        if (!Array.isArray(list) || list.length === 0) return;
        setApplications(list.map((a: any) => ({
          id:          a.id ?? a._id ?? String(Date.now()),
          title:       a.casting_calls?.title ?? a.castingCall?.title ?? a.casting_call?.title ?? a.title ?? '',
          genre:       (a.castingCall?.projectType ?? a.casting_calls?.project_type ?? a.casting_call?.project_type ?? a.genre ?? 'Feature Film') as AppGenre,
          role:        a.casting_calls?.role_name ?? a.castingCall?.role_name ?? a.castingCall?.role ?? a.role ?? '',
          agency:      a.castingCall?.agency?.name ?? a.casting_calls?.agency_profiles?.company_name ?? a.casting_call?.agency_profiles?.company_name ?? a.agency ?? '',
          location:    a.castingCall?.location ?? a.casting_calls?.location ?? a.casting_call?.location ?? a.location ?? '',
          appliedDate: a.applied_at ? new Date(a.applied_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : a.createdAt
            ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : a.appliedDate ?? '',
          dateTs:      a.applied_at ? new Date(a.applied_at).getTime() : a.createdAt ? new Date(a.createdAt).getTime() : a.dateTs ?? 0,
          documents:   profileMediaCount, // Uses profile media count — set after profile fetch
          status:      (a.status === 'applied' ? 'Applied' : a.status === 'in_review' ? 'In Review' : a.status === 'shortlisted' ? 'Shortlisted' : a.status === 'rejected' ? 'Rejected' : a.status === 'shortlisting' ? 'Shortlisted' : a.status ?? 'Applied') as AppStatus,
          updatedDate: a.updated_at
            ? new Date(a.updated_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : a.reviewed_at
            ? new Date(a.reviewed_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : a.updatedDate ?? '',
          img:         a.castingCall?.coverImage ?? a.img ??
            'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=200&fit=crop',
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch aspirant profile media count — used as "documents" on each application
    fetch('/api/profile/aspirant', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const p = data.data?.profile ?? data.profile ?? data;
        const mediaCount = Array.isArray(p.aspirant_media) ? p.aspirant_media.length : 0;
        setProfileMediaCount(mediaCount);
        // Update documents count on all already-loaded applications
        if (mediaCount > 0) {
          setApplications(prev => prev.map(a => ({ ...a, documents: mediaCount })));
        }
      }).catch(() => {});

    // Notifications count
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.notifications ?? data;
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length);
      }).catch(() => {});

    // Messages count
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.conversations ?? data;
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
      }).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const tabStatus = TABS[activeTab].status;
    let apps = tabStatus ? applications.filter(a => a.status === tabStatus) : [...applications];
    if (statusFilter !== 'All Status') apps = apps.filter(a => a.status === statusFilter);
    if (sortLabel === 'Newest First') apps.sort((a, b) => b.dateTs - a.dateTs);
    else apps.sort((a, b) => a.dateTs - b.dateTs);
    return apps;
  }, [activeTab, sortLabel, statusFilter, applications]);

  // Live counts computed from real data
  const liveCounts = useMemo(() => ({
    all:         applications.length,
    applied:     applications.filter(a => a.status === 'Applied').length,
    inReview:    applications.filter(a => a.status === 'In Review').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    rejected:    applications.filter(a => a.status === 'Rejected').length,
  }), [applications]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const page        = Math.min(currentPage, totalPages);
  const paginated   = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startItem   = filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem     = Math.min(page * ITEMS_PER_PAGE, filtered.length);
  const pageNumbers = Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#fff' }}>

      {/* ══ TOP NAVBAR — identical to dashboard ══ */}
      <AspirantHeader />

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* SIDEBAR — identical to dashboard, now collapsible */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>

          <nav style={{ flex: 1, padding: '10px 0' }}>
            {sidebarItems.map(({ icon: Icon, label, active, badge, href }) => (
              <div key={label} title={!sidebarOpen ? label : undefined} style={{
                display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center',
                padding: sidebarOpen ? '9px 16px' : '10px 0', cursor: 'pointer',
                background: active ? GOLD_DIM : 'transparent',
                borderLeft: sidebarOpen && active ? `3px solid ${GOLD}` : '3px solid transparent',
              }}
                onClick={() => router.push(href)}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                  <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 15, color: active ? GOLD : 'rgba(255,255,255,0.6)', fontWeight: active ? 600 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 10, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
              </div>
            ))}
          </nav>

          {/* Upgrade to Premium — identical to dashboard */}
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SCROLLABLE CONTENT — single scroll for both columns ── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex' }}>

        {/* MAIN CONTENT */}
        <div style={{ flex: '0 0 62%', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Page header */}
          <div>
            <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 32, letterSpacing: 1, marginBottom: 4, fontWeight: 400 }}>My Applications</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Track and manage all your casting applications</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {TABS.map((tab, i) => {
              const count = [liveCounts.all, liveCounts.applied, liveCounts.inReview, liveCounts.shortlisted, liveCounts.rejected][i];
              return (
                <button key={i} onClick={() => { setActiveTab(i); setCurrentPage(1); }} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: BARLOW, padding: '8px 16px', marginBottom: -1,
                  fontSize: 16, fontWeight: activeTab === i ? 700 : 400,
                  color: activeTab === i ? RED : 'rgba(255,255,255,0.5)',
                  borderBottom: activeTab === i ? `2px solid ${RED}` : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}>
                  {tab.label} <span style={{ fontSize: 13, color: activeTab === i ? RED : 'rgba(255,255,255,0.3)' }}>({loading ? '…' : count})</span>
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>Sort by:</span>
            <div ref={sortRef} style={{ position: 'relative' }}>
              <div onClick={() => setSortOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}>{sortLabel}</span>
                <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </div>
              {sortOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 140 }}>
                  {SORT_OPTIONS.map(opt => (
                    <div key={opt} onClick={() => { setSortLabel(opt); setSortOpen(false); setCurrentPage(1); }} style={{ padding: '9px 14px', fontSize: 14, cursor: 'pointer', fontFamily: BARLOW, color: sortLabel === opt ? RED : 'rgba(255,255,255,0.7)', background: sortLabel === opt ? 'rgba(200,32,42,0.08)' : 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = sortLabel === opt ? 'rgba(200,32,42,0.08)' : 'transparent'}
                    >{opt}</div>
                  ))}
                </div>
              )}
            </div>
            <div ref={statusRef} style={{ position: 'relative' }}>
              <div onClick={() => setStatusOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{statusFilter}</span>
                <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ transform: statusOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </div>
              {statusOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 150 }}>
                  {STATUS_OPTIONS.map(opt => (
                    <div key={opt} onClick={() => { setStatusFilter(opt); setStatusOpen(false); setCurrentPage(1); }} style={{ padding: '9px 14px', fontSize: 14, cursor: 'pointer', fontFamily: BARLOW, color: statusFilter === opt ? RED : 'rgba(255,255,255,0.7)', background: statusFilter === opt ? 'rgba(200,32,42,0.08)' : 'transparent' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = statusFilter === opt ? 'rgba(200,32,42,0.08)' : 'transparent'}
                    >{opt}</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }} />
            <div onClick={() => alert('Date range picker would open here.')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer' }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Select Date Range</span>
              <CalendarDays size={13} color="rgba(255,255,255,0.35)" />
            </div>
          </div>

          {/* Application cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {paginated.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No applications found.</div>
            ) : paginated.map(app => {
              const gCfg = GENRE_CFG[app.genre] ?? { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' };
              const sCfg = STATUS_CFG[app.status];
              return (
                <div key={app.id} onClick={() => router.push(`/applications/${app.id}`)} style={{ display: 'flex', alignItems: 'stretch', background: BG2, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                >
                  <div style={{ width: 110, flexShrink: 0, overflow: 'hidden' }}>
                    <img src={app.img} alt={app.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 17, fontWeight: 700 }}>{app.title}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: gCfg.bg, color: gCfg.color }}>{app.genre}</span>
                    </div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>{app.role}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                      <span>{app.agency}</span>
                      <span style={{ opacity: 0.4 }}>•</span>
                      <MapPin size={11} color="rgba(255,255,255,0.35)" />
                      <span>{app.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <CalendarDays size={12} color="rgba(255,255,255,0.3)" />
                        <span>Applied on {app.appliedDate}</span>
                      </div>
                      <span style={{ opacity: 0.4 }}>•</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <FileText size={12} color="rgba(255,255,255,0.3)" />
                        <span>{app.documents} Documents</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: 190, flexShrink: 0, padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ alignSelf: 'flex-start', fontSize: 15, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: sCfg.bg, color: sCfg.color, border: `1px solid ${sCfg.border}` }}>{app.status}</span>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>Last updated</div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>{app.updatedDate}</div>
                  </div>
                  <div style={{ width: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>Showing {startItem}–{endItem} of {filtered.length} applications</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={page===1} style={{ width: 32, height: 32, borderRadius: 7, cursor: page===1?'not-allowed':'pointer', background: BG3, border: '1px solid rgba(255,255,255,0.09)', color: page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={14} />
                </button>
                {pageNumbers.map(n => (
                  <button key={n} onClick={() => setCurrentPage(n)} style={{ width: 32, height: 32, borderRadius: 7, cursor: 'pointer', fontFamily: BARLOW, background: n===page?RED:BG3, border: n===page?'none':'1px solid rgba(255,255,255,0.09)', color: n===page?'#fff':'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: n===page?700:400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} style={{ width: 32, height: 32, borderRadius: 7, cursor: page===totalPages?'not-allowed':'pointer', background: BG3, border: '1px solid rgba(255,255,255,0.09)', color: page===totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT RAIL — matches dashboard right rail */}
        <aside style={{ flex: 1, minWidth: 280, background: BG2, borderLeft: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Application Overview */}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>Application Overview</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {APP_OVERVIEW.map(({ icon: Icon, iconBg, iconColor, label }) => {
                const liveValue = label === 'Applied' ? liveCounts.applied
                  : label === 'In Review'   ? liveCounts.inReview
                  : label === 'Shortlisted' ? liveCounts.shortlisted
                  : liveCounts.rejected;
                return (
                  <div key={label} style={{ borderRadius: 10, padding: '14px 12px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={15} color={iconColor} />
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontFamily: '"Bebas Neue", sans-serif', letterSpacing: 1, lineHeight: 1 }}>{loading ? '…' : liveValue}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Quick Actions */}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {QUICK_ACTIONS.map(({ icon: Icon, label, sub, href }) => (
                <div key={label} onClick={() => router.push(href)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, background: BG3, border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = BG3}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} color="rgba(255,255,255,0.55)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{sub}</div>
                  </div>
                  <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Tips */}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Tips to Get Selected</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TIPS.map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 2, background: 'rgba(200,32,42,0.15)', border: `1px solid ${RED}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={9} color={RED} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Need Help */}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Need Help?</div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 12 }}>Check our FAQ or connect with our support team.</p>
            <button onClick={() => router.push('/contact')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>
              <Headphones size={15} color="#fff" /> Visit Help Center
            </button>
          </div>

        </aside>
        </div>
      </div>
    </div>
  );
}