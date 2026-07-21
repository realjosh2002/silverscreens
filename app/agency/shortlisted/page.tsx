'use client';

import AgencyTopnav from '@/components/layout/AgencyTopnav'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {

  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, ChevronRight,
  Eye, X, Menu, Filter, Download, Search,
  CheckSquare, Square, MoreVertical, Calendar,
  TrendingUp, Users, Award,
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

/* ─── Sidebar nav ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted', active: true },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', href: '/agency/notifications' },
];

/* ─── Status config ───────────────────────────────────────────── */
type ShortlistStatus = 'For Audition' | 'Callback' | 'Final Round' | 'Selected' | 'Rejected';
const STATUS_CFG: Record<ShortlistStatus, { color: string; bg: string; border: string }> = {
  'For Audition': { color: ORANGE,  bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.35)' },
  'Callback':     { color: BLUE,    bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)' },
  'Final Round':  { color: PURPLE,  bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.35)' },
  'Selected':     { color: GREEN,   bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.35)'  },
  'Rejected':     { color: RED,     bg: 'rgba(200,32,42,0.12)',   border: 'rgba(200,32,42,0.35)'  },
};

/* ─── Mock data ───────────────────────────────────────────────── */
interface ShortlistedTalent {
  id: string;
  name: string;
  verified: boolean;
  gender: string;
  age: number;
  location: string;
  img: string;
  role: string;
  castingCall: string;
  projectType: string;
  shortlistedOn: string;
  shortlistedTime: string;
  status: ShortlistStatus;
  statusDetail: string;
  statusDate: string;
  rating: number;
}

const TALENTS: ShortlistedTalent[] = [
  { id: 'a1', name: 'Rohan Deshmukh', verified: true,  gender: 'Male',   age: 27, location: 'Mumbai',   img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face', role: 'Lead Hero',         castingCall: 'City of Dreams',    projectType: 'Feature Film', shortlistedOn: '20 May 2024', shortlistedTime: '10:30 AM', status: 'For Audition', statusDetail: 'Audition on',    statusDate: '24 May 2024, 11:00 AM', rating: 4.5 },
  { id: 'a2', name: 'Meera Iyer',     verified: true,  gender: 'Female', age: 25, location: 'Mumbai',   img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face', role: 'Female Lead',       castingCall: 'The Silent Witness', projectType: 'Web Series',   shortlistedOn: '19 May 2024', shortlistedTime: '04:15 PM', status: 'Callback',     statusDetail: 'Callback Round', statusDate: '25 May 2024, 03:00 PM', rating: 5.0 },
  { id: 'a3', name: 'Vikram Singh',   verified: true,  gender: 'Male',   age: 30, location: 'Delhi',    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face', role: 'Antagonist',        castingCall: 'Rangbaaz: Dobara',  projectType: 'Web Series',   shortlistedOn: '18 May 2024', shortlistedTime: '11:45 AM', status: 'Final Round',  statusDetail: 'Final Round',    statusDate: '27 May 2024, 02:00 PM', rating: 4.0 },
  { id: 'a4', name: 'Aisha Sharma',   verified: true,  gender: 'Female', age: 23, location: 'Delhi',    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face', role: 'Supporting Actress',castingCall: 'Love in Rewind',    projectType: 'Music Video',  shortlistedOn: '18 May 2024', shortlistedTime: '10:20 AM', status: 'Selected',     statusDetail: 'Selected on',    statusDate: '20 May 2024',           rating: 5.0 },
  { id: 'a5', name: 'Kabir Malhotra', verified: true,  gender: 'Male',   age: 32, location: 'Mumbai',   img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&h=120&fit=crop&crop=face', role: 'Supporting Actor',  castingCall: 'Untitled Horror',   projectType: 'Feature Film', shortlistedOn: '17 May 2024', shortlistedTime: '03:30 PM', status: 'Rejected',     statusDetail: 'Rejected on',    statusDate: '19 May 2024',           rating: 3.0 },
  { id: 'a6', name: 'Priya Nair',     verified: true,  gender: 'Female', age: 24, location: 'Chennai',  img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face', role: 'Lead Actress',      castingCall: 'Kaaviyam',          projectType: 'Feature Film', shortlistedOn: '16 May 2024', shortlistedTime: '02:00 PM', status: 'For Audition', statusDetail: 'Audition on',    statusDate: '22 May 2024, 10:00 AM', rating: 4.8 },
  { id: 'a7', name: 'Arjun Kapoor',   verified: false, gender: 'Male',   age: 29, location: 'Pune',     img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=face', role: 'Lead Hero',         castingCall: 'Metro Diaries',     projectType: 'Web Series',   shortlistedOn: '15 May 2024', shortlistedTime: '09:30 AM', status: 'Callback',     statusDetail: 'Callback Round', statusDate: '23 May 2024, 04:00 PM', rating: 4.2 },
  { id: 'a8', name: 'Deepika Rao',    verified: true,  gender: 'Female', age: 26, location: 'Bengaluru',img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&h=120&fit=crop&crop=face', role: 'Lead Actress',      castingCall: 'City of Stars',     projectType: 'Web Series',   shortlistedOn: '14 May 2024', shortlistedTime: '01:15 PM', status: 'Final Round',  statusDetail: 'Final Round',    statusDate: '26 May 2024, 11:00 AM', rating: 4.9 },
];

const SUB_TABS = [
  { key: 'all',       label: 'All Shortlisted', count: 96 },
  { key: 'audition',  label: 'For Audition',    count: 18 },
  { key: 'callback',  label: 'Callback',         count: 12 },
  { key: 'final',     label: 'Final Round',      count: 7  },
  { key: 'selected',  label: 'Selected',         count: 3  },
  { key: 'rejected',  label: 'Rejected',         count: 2  },
];

const STATUS_TAB_MAP: Record<string, ShortlistStatus[]> = {
  all:      ['For Audition', 'Callback', 'Final Round', 'Selected', 'Rejected'],
  audition: ['For Audition'],
  callback: ['Callback'],
  final:    ['Final Round'],
  selected: ['Selected'],
  rejected: ['Rejected'],
};

/* ═══════════════════════════════════════════════════════════════ */
export default function ShortlistedTalentsPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState('all');
  const [selectedIds,  setSelectedIds]  = useState<string[]>([]);
  const [rowMenuOpen,  setRowMenuOpen]  = useState<string | null>(null);
  const [menuPos,      setMenuPos]      = useState<{top: number; right: number}>({ top: 0, right: 0 });
  const [talentStatuses, setTalentStatuses] = useState<Record<string, string>>({});
  const changeStatus = (id: string, status: string) => { setTalentStatuses(p => ({ ...p, [id]: status })); setRowMenuOpen(null); };
  const openMenu = (id: string, e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setRowMenuOpen(rowMenuOpen === id ? null : id);
  };
  const [castingFilter,setCastingFilter]= useState('All Casting Calls');
  const [roleFilter,   setRoleFilter]   = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [search,       setSearch]       = useState('');
  const [sortBy,       setSortBy]       = useState('Latest Shortlisted');
  const [sortOpen,     setSortOpen]     = useState(false);
  const [page,         setPage]         = useState(1);
  const PER_PAGE = 10;

  const SB_W = sidebarOpen ? 230 : 52;

  /* Filtered talents */
  const filtered = TALENTS.filter(t => {
    const statusMatch = STATUS_TAB_MAP[activeTab]?.includes(t.status);
    const searchMatch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.role.toLowerCase().includes(search.toLowerCase());
    const castingMatch = castingFilter === 'All Casting Calls' || t.castingCall === castingFilter;
    const roleMatch = roleFilter === 'All Roles' || t.role === roleFilter;
    const sFilter = statusFilter === 'All Status' || t.status === statusFilter;
    return statusMatch && searchMatch && castingMatch && roleMatch && sFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleSelectAll = () => setSelectedIds(p => p.length === filtered.length ? [] : filtered.map(t => t.id));

  const StarRating = ({ rating }: { rating: number }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14}
          color={i <= Math.floor(rating) ? GOLD : i - 0.5 <= rating ? GOLD : 'rgba(255,255,255,0.15)'}
          fill={i <= Math.floor(rating) ? GOLD : 'transparent'}
        />
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <AgencyTopnav />

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
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>DP</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dharma Productions</div>
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
                  {sidebarOpen && <span style={{ fontSize: 15, fontWeight: active ? 600 : 400, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
                {!sidebarOpen && badge && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{badge}</div>}
              </div>
            ))}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205,#2a1e0a)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock advanced filters and AI matching.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column' }}>

          {/* Page header */}
          <div style={{ padding: '20px 28px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h1 style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, color: '#fff', margin: 0 }}>Shortlisted Talents</h1>
                  <span style={{ fontSize: 22 }}>⭐</span>
                </div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>View and manage all shortlisted candidates across your casting calls.</div>
              </div>
              <button onClick={() => router.push('/agency/talent-search')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: `1px solid ${RED}`, borderRadius: 8, padding: '8px 16px', color: RED, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <Users size={14} /> Talent Comparison
              </button>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total Shortlisted', value: 96,  icon: <Star size={22} color={GOLD} fill={GOLD} />,         iconBg: `${GOLD}18`,   sub: '' },
                { label: 'This Week',         value: 12,  icon: <TrendingUp size={22} color={PURPLE} />,             iconBg: `${PURPLE}18`, sub: '↑ 20% vs last week', subColor: GREEN },
                { label: 'Callbacks Scheduled',value: 18, icon: <CalendarCheck size={22} color={BLUE} />,            iconBg: `${BLUE}18`,   sub: '' },
                { label: 'Finalists',         value: 7,   icon: <Award size={22} color={GREEN} />,                   iconBg: `${GREEN}18`,  sub: '' },
              ].map(({ label, value, icon, iconBg, sub, subColor }) => (
                <div key={label} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 26, fontFamily: BEBAS, letterSpacing: 1, color: '#fff', lineHeight: 1 }}>{value}</div>
                    {sub && <div style={{ fontSize: 14, color: subColor || 'rgba(255,255,255,0.4)', marginTop: 2 }}>{sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              {/* Dropdowns */}
              {[
                { value: castingFilter, options: ['All Casting Calls', 'City of Dreams', 'The Silent Witness', 'Rangbaaz: Dobara', 'Love in Rewind', 'Untitled Horror', 'Kaaviyam', 'Metro Diaries', 'City of Stars'], set: setCastingFilter },
                { value: roleFilter,    options: ['All Roles', 'Lead Hero', 'Female Lead', 'Antagonist', 'Supporting Actress', 'Supporting Actor', 'Lead Actress'], set: setRoleFilter },
                { value: statusFilter,  options: ['All Status', 'For Audition', 'Callback', 'Final Round', 'Selected', 'Rejected'], set: setStatusFilter },
              ].map((dd, i) => (
                <SimpleSelect key={i} value={dd.value} options={dd.options} onChange={v => { dd.set(v); setPage(1); }} />
              ))}
              {/* Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', flex: 1, minWidth: 180 }}>
                <Search size={14} color="rgba(255,255,255,0.4)" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or role..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#fff', fontFamily: BARLOW, flex: 1 }} />
                {search && <X size={13} color="rgba(255,255,255,0.4)" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Filter size={13} /> Filters
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Download size={13} /> Export
              </button>
              {/* Sort */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>Sort by:</span>
                <div style={{ position: 'relative' }}>
                  {sortOpen && <div onClick={() => setSortOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />}
                  <div onClick={() => setSortOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 14, color: '#fff', fontFamily: BARLOW, minWidth: 160, position: 'relative', zIndex: 51 }}>
                    {sortBy} <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ marginLeft: 'auto', transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                  </div>
                  {sortOpen && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 100, minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                      {['Latest Shortlisted', 'Oldest First', 'Highest Rated', 'Name A–Z'].map(s => (
                        <div key={s} onClick={() => { setSortBy(s); setSortOpen(false); }} style={{ padding: '9px 14px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: s === sortBy ? GOLD : '#fff', background: s === sortBy ? `${GOLD}08` : 'transparent' }}
                          onMouseEnter={e => { if (s !== sortBy) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={e => { if (s !== sortBy) e.currentTarget.style.background = 'transparent'; }}
                        >{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {SUB_TABS.map(tab => {
                const active = activeTab === tab.key;
                return (
                  <div key={tab.key} onClick={() => { setActiveTab(tab.key); setPage(1); }} style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: active ? `2px solid ${RED}` : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: active ? 700 : 500, color: active ? RED : 'rgba(255,255,255,0.5)' }}>
                      {tab.label} <span style={{ fontSize: 14, color: active ? RED : 'rgba(255,255,255,0.3)', marginLeft: 2 }}>({tab.count})</span>
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
                { label: 'Schedule Auditions', color: BLUE,   onClick: () => router.push('/agency/auditions/schedule') },
                { label: 'Move to Final Round', color: PURPLE, onClick: () => setSelectedIds([]) },
                { label: 'Mark as Selected',   color: GREEN,  onClick: () => setSelectedIds([]) },
                { label: 'Reject All',         color: RED,    onClick: () => setSelectedIds([]) },
                { label: 'Export',             color: 'rgba(255,255,255,0.7)', onClick: () => setSelectedIds([]) },
              ].map(({ label, color, onClick }) => (
                <button key={label} onClick={onClick} style={{ background: 'none', border: `1px solid ${color}`, borderRadius: 7, padding: '5px 14px', color, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const }}
                  onMouseEnter={e => (e.currentTarget.style.background = color + '15')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >{label}</button>
              ))}
              <button onClick={() => setSelectedIds([])} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                ✕ Clear
              </button>
            </div>
          )}

          {/* Table */}
          <div style={{ flex: 1, padding: '0 28px', marginTop: 14 }}>
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'visible', position: 'relative' }}>

              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '36px 2.5fr 1.8fr 1fr 1.6fr 1.2fr 120px', alignItems: 'center', padding: '11px 18px', background: BG3, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span onClick={toggleSelectAll} style={{ cursor: 'pointer', display: 'flex' }}>
                  {selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare size={15} color={RED} /> : <Square size={15} color="rgba(255,255,255,0.35)" />}
                </span>
                {['Talent', 'Role & Casting Call', 'Shortlisted On', 'Status', 'Rating', 'Actions'].map((h, i) => (
                  <span key={h} style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform: 'uppercase' as const, textAlign: i === 5 ? 'center' as const : 'left' as const }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {paged.length === 0 ? (
                <div style={{ padding: '48px 0', textAlign: 'center' as const }}>
                  <Star size={32} color="rgba(255,255,255,0.1)" style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>No talents match this filter.</div>
                </div>
              ) : paged.map((t, idx) => {
                const checked = selectedIds.includes(t.id);
                const scfg = STATUS_CFG[t.status];
                return (
                  <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '36px 2.5fr 1.8fr 1fr 1.6fr 1.2fr 120px', alignItems: 'center', padding: '14px 18px', borderBottom: idx < paged.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.12s', cursor: 'default' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Checkbox */}
                    <span onClick={() => toggleSelect(t.id)} style={{ cursor: 'pointer', display: 'flex' }}>
                      {checked ? <CheckSquare size={15} color={RED} /> : <Square size={15} color="rgba(255,255,255,0.35)" />}
                    </span>

                    {/* Talent */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minWidth: 0 }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img src={t.img} alt={t.name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: BARLOW }}>{t.name}</span>
                          {t.verified && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3b82f6"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>{t.gender} · {t.age} · {t.location}</div>
                        <button onClick={() => router.push(`/agency/talent/${t.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>

                    {/* Role & Casting Call */}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{t.role}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>{t.castingCall}</div>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '2px 8px' }}>{t.projectType}</span>
                    </div>

                    {/* Shortlisted On */}
                    <div>
                      <div style={{ fontSize: 14, color: '#fff' }}>{t.shortlistedOn}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{t.shortlistedTime}</div>
                    </div>

                    {/* Status */}
                    <div>
                      <span style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, color: scfg.color, background: scfg.bg, border: `1px solid ${scfg.border}`, borderRadius: 20, padding: '3px 10px', marginBottom: 4 }}>{t.status}</span>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{t.statusDetail}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{t.statusDate}</div>
                    </div>

                    {/* Rating */}
                    <div>
                      <StarRating rating={t.rating} />
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>{t.rating.toFixed(1)}</div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={e => e.stopPropagation()}>
                      {/* Schedule Audition */}
                      <ActionBtn title="Schedule Audition" onClick={() => router.push(`/agency/auditions/schedule?candidate=${t.id}&from=shortlisted`)}>
                        <Calendar size={14} color="rgba(255,255,255,0.55)" />
                      </ActionBtn>
                      {/* Message */}
                      <ActionBtn title="Send Message" onClick={() => router.push('/agency/messages')}>
                        <MessageSquare size={14} color="rgba(255,255,255,0.55)" />
                      </ActionBtn>
                      {/* More */}
                      <div style={{ position: 'relative' }}>
                        <ActionBtn title="More Actions" onClick={(e) => openMenu(t.id, e)}>
                          <MoreVertical size={14} color="rgba(255,255,255,0.55)" />
                        </ActionBtn>
                        {rowMenuOpen === t.id && (
                          <>
                            <div onClick={() => setRowMenuOpen(null)} style={{ position: 'fixed', inset: 0, zIndex: 400 }} />
                            <div style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, width: 210, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 500, boxShadow: '0 12px 40px rgba(0,0,0,0.85)' }}>
                              {/* View / actions */}
                              {[
                                { label: 'View Profile',       icon: <Eye size={13} />,           color: '',      onClick: () => { router.push(`/agency/talent/${t.id}`); setRowMenuOpen(null); } },
                                { label: 'View Application',   icon: <Eye size={13} />,           color: '',      onClick: () => { router.push(`/agency/applications/${t.id}`); setRowMenuOpen(null); } },
                                { label: 'Schedule Audition',  icon: <Calendar size={13} />,      color: BLUE,    onClick: () => { router.push(`/agency/auditions/schedule?candidate=${t.id}&from=shortlisted`); setRowMenuOpen(null); } },
                                { label: 'Send Message',       icon: <MessageSquare size={13} />, color: '',      onClick: () => { router.push('/agency/messages'); setRowMenuOpen(null); } },
                              ].map(({ label, icon, color, onClick }) => (
                                <div key={label} onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color: color || '#F5F5F5' }}
                                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                ><span style={{ opacity: 0.75, display: 'flex' }}>{icon}</span>{label}</div>
                              ))}
                              {/* Change Status */}
                              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '3px 0' }} />
                              <div style={{ padding: '6px 14px 3px', fontSize: 14, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' as const, letterSpacing: 0.7 }}>Change Status</div>
                              {[
                                { label: 'Move to Callback',    color: BLUE   },
                                { label: 'Move to Final Round', color: PURPLE },
                                { label: 'Mark as Selected',    color: GREEN  },
                                { label: 'Reject',              color: RED    },
                                { label: 'Remove from List',    color: 'rgba(255,255,255,0.4)' },
                              ].map(({ label, color }) => (
                                <div key={label} onClick={() => changeStatus(t.id, label)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color }}
                                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                  {label}
                                  {talentStatuses[t.id] === label && <span style={{ fontSize: 14, color: GREEN }}>✓</span>}
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
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0 20px', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                Showing {(page - 1) * PER_PAGE + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length === TALENTS.length ? 96 : filtered.length} shortlisted talents
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <PaginationBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={13} /></PaginationBtn>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(n => (
                  <PaginationBtn key={n} onClick={() => setPage(n)} active={page === n}>{n}</PaginationBtn>
                ))}
                {totalPages > 3 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>...</span>}
                {totalPages > 3 && <PaginationBtn onClick={() => setPage(totalPages)} active={page === totalPages}>{20}</PaginationBtn>}
                <PaginationBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={13} /></PaginationBtn>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                Rows per page:
                <select defaultValue="10" style={{ background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: 14, fontFamily: BARLOW, outline: 'none', cursor: 'pointer' }}>
                  {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Upgrade banner */}
          <div style={{ margin: '0 28px 20px', background: BG2, border: '1px solid rgba(200,32,42,0.25)', borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${RED}18`, border: `1px solid ${RED}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>👑</span>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Upgrade to Professional Plan</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Get unlimited shortlisted talents, advanced filters, AI matching and more.</div>
              </div>
            </div>
            <button onClick={() => router.push('/pricing')} style={{ background: RED, border: 'none', borderRadius: 8, padding: '9px 20px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>Upgrade Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function ActionBtn({ onClick, title, children }: { onClick: (e: React.MouseEvent) => void; title: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >{children}</button>
  );
}

function PaginationBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, borderRadius: 7, border: `1px solid ${active ? RED : 'rgba(255,255,255,0.12)'}`, background: active ? RED : 'transparent', color: active ? '#fff' : disabled ? 'rgba(255,255,255,0.2)' : '#fff', fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: active ? 700 : 400, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
      {children}
    </button>
  );
}

function SimpleSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />}
      <div onClick={() => setOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 14, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", whiteSpace: 'nowrap', position: 'relative', zIndex: 91 }}>
        {value} <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </div>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#1C2030', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 100, minWidth: '100%', maxHeight: 220, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{ padding: '8px 12px', fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif", cursor: 'pointer', color: opt === value ? '#D4A64A' : '#F5F5F5', background: opt === value ? 'rgba(212,166,74,0.08)' : 'transparent', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent'; }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}