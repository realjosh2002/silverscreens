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

const AUDITIONS: Audition[] = [
  { id: 'au1', candidateId: 'a1', name: 'Arjun Malhotra', verified: true,  role: 'Lead Hero',          castingCall: 'City of Dreams – Season 2',  projectType: 'Web Series',   date: '25 May 2024', time: '11:00 AM', duration: '30 min', format: 'In-Person', location: 'Dharma Studio, Andheri',      round: 'Audition Round', status: 'Scheduled',   img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { id: 'au2', candidateId: 'a2', name: 'Meera Iyer',     verified: true,  role: 'Female Lead',        castingCall: 'The Silent Witness',          projectType: 'Web Series',   date: '25 May 2024', time: '11:30 AM', duration: '30 min', format: 'In-Person', location: 'Dharma Studio, Andheri',      round: 'Audition Round', status: 'Completed',   img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', rating: 4.8 },
  { id: 'au3', candidateId: 'a3', name: 'Vikram Singh',   verified: true,  role: 'Antagonist',         castingCall: 'Rangbaaz: Dobara',            projectType: 'Web Series',   date: '26 May 2024', time: '10:00 AM', duration: '45 min', format: 'In-Person', location: 'Silver Paradise Studios',     round: 'Callback Round', status: 'Scheduled',   img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
  { id: 'au4', candidateId: 'a4', name: 'Aisha Sharma',   verified: true,  role: 'Supporting Actress', castingCall: 'Love in Rewind',              projectType: 'Music Video',  date: '26 May 2024', time: '02:00 PM', duration: '20 min', format: 'Virtual',   location: 'Google Meet (link sent)',     round: 'Audition Round', status: 'Rescheduled', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face' },
  { id: 'au5', candidateId: 'a5', name: 'Kabir Malhotra', verified: true,  role: 'Supporting Actor',   castingCall: 'Untitled Horror',             projectType: 'Feature Film', date: '27 May 2024', time: '12:00 PM', duration: '30 min', format: 'In-Person', location: 'Mumbai Film City',            round: 'Final Round',    status: 'Pending',     img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop&crop=face' },
  { id: 'au6', candidateId: 'a6', name: 'Priya Nair',     verified: true,  role: 'Lead Actress',       castingCall: 'Kaaviyam',                   projectType: 'Feature Film', date: '27 May 2024', time: '03:00 PM', duration: '45 min', format: 'In-Person', location: 'Chennai Studio, Anna Nagar', round: 'Audition Round', status: 'Cancelled',   img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' },
  { id: 'au7', candidateId: 'a7', name: 'Arjun Kapoor',   verified: false, role: 'Lead Hero',          castingCall: 'Metro Diaries',               projectType: 'Web Series',   date: '28 May 2024', time: '10:30 AM', duration: '30 min', format: 'Self-Tape', location: 'Self-recorded submission',    round: 'Audition Round', status: 'Scheduled',   img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face' },
  { id: 'au8', candidateId: 'a8', name: 'Deepika Rao',    verified: true,  role: 'Lead Actress',       castingCall: 'City of Stars',               projectType: 'Web Series',   date: '28 May 2024', time: '02:30 PM', duration: '30 min', format: 'Virtual',   location: 'Zoom (link sent)',            round: 'Callback Round', status: 'Completed',   img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face', rating: 4.9 },
  { id: 'au9', candidateId: 'a1', name: 'Arjun Malhotra', verified: true,  role: 'Lead Hero',         castingCall: 'City of Dreams – Season 2',  projectType: 'Web Series',   date: '29 May 2024', time: '11:00 AM', duration: '30 min', format: 'In-Person', location: 'Dharma Studio, Andheri',      round: 'Final Round',    status: 'Selected',    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', rating: 5.0 },
  { id: 'au10',candidateId: 'a6', name: 'Priya Nair',     verified: true,  role: 'Lead Actress',       castingCall: 'Kaaviyam',                   projectType: 'Feature Film', date: '29 May 2024', time: '03:00 PM', duration: '45 min', format: 'In-Person', location: 'Chennai Studio, Anna Nagar', round: 'Final Round',    status: 'Rejected',    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face' },
  { id: 'au11',candidateId: 'a3', name: 'Vikram Singh',   verified: true,  role: 'Antagonist',         castingCall: 'Rangbaaz: Dobara',            projectType: 'Web Series',   date: '30 May 2024', time: '10:00 AM', duration: '30 min', format: 'In-Person', location: 'Silver Paradise Studios',     round: 'Review Stage',   status: 'In Review',   img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
];

const FORMAT_ICON: Record<string, React.ReactNode> = {
  'In-Person': <MapPin size={12} />,
  'Virtual':   <Video size={12} />,
  'Self-Tape': <Eye size={12} />,
};


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

/* ═══════════════════════════════════════════════════════════════ */
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
  const [auditions,    setAuditions]    = useState<Audition[]>(AUDITIONS);
  const [loading,      setLoading]      = useState(true);
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
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) { setLoading(false); return; }
    fetch('/api/auditions?limit=100', { headers: { Authorization: `Bearer ${token}` } })
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
            id:          a.id,
            candidateId: ap.id ?? a.aspirant_id,
            name:        [ap.first_name, ap.last_name].filter(Boolean).join(' ') || 'Unknown',
            verified:    ap.verification_status === 'approved',
            role:        cc.role_name ?? '',
            castingCall: cc.title ?? '',
            projectType: cc.project_type ?? '',
            date:        scheduledAt ? scheduledAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            time:        scheduledAt ? scheduledAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
            duration:    `${a.duration_minutes ?? 30} min`,
            format:      modeMap[a.mode] ?? 'In-Person',
            location:    a.venue_details ?? (a.mode === 'online' ? 'Video Call (link sent)' : ''),
            round:       'Audition Round',
            status:      statusMap[a.status] ?? 'Scheduled',
            img:         ap.profile_image_url ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
            notes:       a.notes,
          } as Audition;
        }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = auditions.filter(a => {
    const tabMatch = STATUS_TAB_MAP[activeTab]?.includes(a.status);
    const searchMatch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.castingCall.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>12</div>
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>3</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>DP</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>Dharma Productions</div>
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
                  <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>AGE062600001</span>
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
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
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
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>DP</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dharma Productions</div>
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
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock advanced scheduling and AI matching.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 28px 0', flexShrink: 0 }}>

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, color: '#fff', margin: '0 0 4px' }}>Audition Management</h1>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Track, manage and review all your scheduled auditions.</div>
              </div>
              <button onClick={() => router.push('/agency/auditions/schedule')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, border: 'none', borderRadius: 8, padding: '9px 18px', color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Plus size={14} /> Schedule Audition
              </button>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total Scheduled', value: auditions.length,                                              sub: 'All time',       icon: <CalendarCheck size={22} color={BLUE} />,   bg: `${BLUE}18`   },
                { label: 'Completed',       value: auditions.filter(a => a.status === 'Completed').length,        sub: 'All time',       icon: <Check size={22} color={GREEN} />,           bg: `${GREEN}18`  },
                { label: 'Pending',         value: auditions.filter(a => a.status === 'Pending').length,          sub: 'Awaiting conf.', icon: <Clock size={22} color={ORANGE} />,          bg: `${ORANGE}18` },
                { label: 'Cancelled',       value: auditions.filter(a => a.status === 'Cancelled').length,        sub: 'All time',       icon: <X size={22} color={RED} />,                 bg: 'rgba(200,32,42,0.15)' },
              ].map(({ label, value, sub, icon, bg }) => (
                <div key={label} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 26, fontFamily: BEBAS, letterSpacing: 1, color: '#fff', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, marginTop: 2 }}>{label}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 200 }}>
                <Search size={14} color="rgba(255,255,255,0.4)" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by candidate or casting call..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#fff', fontFamily: BARLOW, flex: 1 }} />
                {search && <X size={13} color="rgba(255,255,255,0.4)" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Filter size={13} /> Filters
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Download size={13} /> Export
              </button>
              <button onClick={() => router.push('/agency/calendar')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Calendar size={13} /> Calendar View
              </button>
              {/* Sort */}
              <div style={{ position: 'relative', marginLeft: 'auto' }}>
                {sortOpen && <div onClick={() => setSortOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />}
                <div onClick={() => setSortOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 14, color: '#fff', fontFamily: BARLOW, minWidth: 160, position: 'relative', zIndex: 51 }}>
                  Sort: {sortBy} <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ marginLeft: 'auto', transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </div>
                {sortOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 100, minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    {['Date: Newest', 'Date: Oldest', 'Name A–Z', 'Status'].map(s => (
                      <div key={s} onClick={() => { setSortBy(s); setSortOpen(false); }} style={{ padding: '9px 14px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: s === sortBy ? GOLD : '#fff', background: s === sortBy ? `${GOLD}08` : 'transparent' }}
                        onMouseEnter={e => { if (s !== sortBy) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { if (s !== sortBy) e.currentTarget.style.background = 'transparent'; }}
                      >{s}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {SUB_TABS.map(tab => {
                const active = activeTab === tab.key;
                return (
                  <div key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); }} style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: active ? `2px solid ${RED}` : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: active ? 700 : 500, color: active ? RED : 'rgba(255,255,255,0.5)' }}>
                      {tab.label} <span style={{ fontSize: 14, color: active ? RED : 'rgba(255,255,255,0.3)' }}>({tab.count})</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bulk Action Bar */}
          {selectedIds.length > 0 && (
            <div style={{ margin: '10px 28px 0', background: BG4, border: `1px solid ${GOLD}40`, borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: GOLD, whiteSpace: 'nowrap' as const }}>{selectedIds.length} selected</span>
              <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
              {[
                { label: 'Mark as Completed', color: GREEN,  onClick: () => setSelectedIds([]) },
                { label: 'Mark as Selected',  color: PURPLE, onClick: () => setSelectedIds([]) },
                { label: 'Cancel Auditions',  color: RED,    onClick: () => setSelectedIds([]) },
                { label: 'Reschedule',        color: BLUE,   onClick: () => router.push('/agency/auditions/schedule') },
                { label: 'Export',            color: 'rgba(255,255,255,0.7)', onClick: () => setSelectedIds([]) },
              ].map(({ label, color, onClick }) => (
                <button key={label} onClick={onClick} style={{ background: 'none', border: `1px solid ${color}`, borderRadius: 7, padding: '5px 14px', color, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const }}
                  onMouseEnter={e => (e.currentTarget.style.background = color + '15')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >{label}</button>
              ))}
              <button onClick={() => setSelectedIds([])} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>✕ Clear</button>
            </div>
          )}

          {/* Table */}
          <div style={{ flex: 1, padding: '14px 28px 20px' }}>
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'visible' }}>

              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1.4fr 1.1fr 0.9fr 0.85fr 96px', alignItems: 'center', padding: '11px 18px', background: BG3, borderBottom: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px 12px 0 0' }}>
                <span onClick={toggleAll} style={{ cursor: 'pointer', display: 'flex' }}>
                  {selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare size={15} color={RED} /> : <Square size={15} color="rgba(255,255,255,0.35)" />}
                </span>
                {['Candidate', 'Casting Call', 'Date & Time', 'Location', 'Status', 'Actions'].map((h, i) => (
                  <span key={h} style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform: 'uppercase' as const, textAlign: i === 5 ? 'center' as const : 'left' as const }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {paged.length === 0 ? (
                <div style={{ padding: '48px 0', textAlign: 'center' as const }}>
                  <CalendarCheck size={36} color="rgba(255,255,255,0.1)" style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>No auditions match this filter.</div>
                </div>
              ) : paged.map((a, idx) => {
                const checked = selectedIds.includes(a.id);
                const scfg = STATUS_CFG[a.status];
                return (
                  <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '36px 2fr 1.4fr 1.1fr 0.9fr 0.85fr 96px', alignItems: 'center', padding: '13px 18px', borderBottom: idx < paged.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Checkbox */}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: `${a.format === 'In-Person' ? GOLD : BLUE}`, marginBottom: 2 }}>
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
                                { label: 'View Profile',      onClick: () => { router.push(`/agency/talent/${a.candidateId}`); setRowMenuOpen(null); } },
                                { label: 'View Application',  onClick: () => { router.push(`/agency/applications/${a.candidateId}`); setRowMenuOpen(null); } },
                                { label: 'Reschedule',        onClick: () => { router.push(`/agency/auditions/schedule?candidate=${a.candidateId}&from=auditions`); setRowMenuOpen(null); } },
                                { label: 'Send Message',      onClick: () => { router.push('/agency/messages'); setRowMenuOpen(null); } },
                                { label: 'Mark as Completed', onClick: () => setRowMenuOpen(null), color: GREEN },
                                { label: 'Cancel Audition',   onClick: () => setRowMenuOpen(null), color: RED },
                              ].map(({ label, onClick, color }, mi) => (
                                <>
                                  {mi === 4 && <div key={`div-${mi}`} style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />}
                                  <div key={label} onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color: color || '#F5F5F5' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                  >{label}</div>
                                </>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 4px', flexWrap: 'wrap', gap: 10 }}>
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