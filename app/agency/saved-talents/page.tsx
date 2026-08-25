'use client';

import AgencyTopnav from '@/components/layout/AgencyTopnav'
import ProtectedMedia from '@/components/ui/ProtectedMedia'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {


  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, ChevronRight, Menu,
  Search, Download, Plus, MoreVertical,
  CheckSquare, Square, X, Filter, List, Grid,
} from 'lucide-react';
import AgencyVerificationBanner from '@/components/layout/AgencyVerificationBanner';

/* ─── Design tokens ───────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const NAV_ITEMS: { icon: any; label: string; href: string; active?: boolean; badge?: number }[] = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents', active: true },
  { icon: MessageSquare,   label: 'Messages',    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', href: '/agency/notifications' },
];

type TalentType = 'ACTOR' | 'MODEL' | 'DANCER' | 'SINGER' | 'DIRECTOR';
const TYPE_COLORS: Record<TalentType, { color: string; bg: string }> = {
  ACTOR:    { color: '#fff',  bg: GOLD   },
  MODEL:    { color: '#fff',  bg: PURPLE },
  DANCER:   { color: '#fff',  bg: GREEN  },
  SINGER:   { color: '#fff',  bg: BLUE   },
  DIRECTOR: { color: '#fff',  bg: RED    },
};

interface SavedTalent {
  id: string; name: string; age: number; gender: string;
  talentId: string; type: TalentType; city: string; state: string;
  addedOn: string; rating: number; img: string;
  priority?: boolean; recentlyViewed?: boolean; skills?: string[]; lists?: string[];
  saved_id?: string; avatar?: string;
}

const TALENTS: SavedTalent[] = [];



const SUB_TABS = ['All Talents', 'Recently Added', 'Recently Viewed', 'High Priority'];

const SORT_OPTIONS = ['Recently Added', 'Name A–Z', 'Highest Rated', 'Oldest First'];

/* ─── Donut chart ─────────────────────────────────────────────── */
function EngagementDonut() {
  const data = [
    { label: 'Profile Viewed', value: 152, color: GOLD   },
    { label: 'Shortlisted',    value: 48,  color: BLUE   },
    { label: 'Contacted',      value: 22,  color: GREEN  },
    { label: 'Hired',          value: 9,   color: PURPLE },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 52, cy = 52, R = 44, r = 30;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (ang: number, rad: number) => [cx + rad * Math.cos(toRad(ang)), cy + rad * Math.sin(toRad(ang))];
  let startAngle = -90;
  const arcs = data.map(seg => {
    const sweep = (seg.value / total) * 360;
    const end = startAngle + sweep;
    const large = sweep > 180 ? 1 : 0;
    const [x1, y1] = pt(startAngle, R); const [x2, y2] = pt(end, R);
    const [x3, y3] = pt(end, r);       const [x4, y4] = pt(startAngle, r);
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    startAngle = end;
    return { ...seg, d };
  });
  const pct = Math.round((data[0].value / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg viewBox="0 0 104 104" style={{ width: 90, height: 90, flexShrink: 0 }}>
        {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} />)}
        <text x={cx} y={cy - 5} textAnchor="middle" fill={GOLD} fontSize={14} fontWeight={800} fontFamily={BEBAS}>{pct}%</text>
      </svg>
      <div style={{ flex: 1 }}>
        {data.map(d => (
          <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{d.label}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function SavedTalentsPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState('All Talents');
  const [search,       setSearch]       = useState('');
  const [sortBy,       setSortBy]       = useState('Recently Added');
  const [sortOpen,     setSortOpen]     = useState(false);
  const [selectedIds,  setSelectedIds]  = useState<string[]>([]);
  const [rowMenuOpen,  setRowMenuOpen]  = useState<string | null>(null);
  const [menuPos,      setMenuPos]      = useState<{top:number;right:number}>({top:0,right:0});
  const [page,         setPage]         = useState(1);
  const [viewMode,     setViewMode]     = useState<'list'|'grid'>('list');
  const [msgCount,     setMsgCount]     = useState(0);
  const [notifCount,   setNotifCount]   = useState(0);
  const [talents,      setTalents]      = useState<SavedTalent[]>([]);

  const [loadingData,  setLoadingData]  = useState(true);

  function getAuthHeaders(): Record<string, string> {
    try { const u = JSON.parse(localStorage.getItem('ss_user') || '{}'); const token = u.token ?? u.access_token ?? ''; return token ? { Authorization: `Bearer ${token}` } : {}; } catch { return {}; }
  }

  useEffect(() => {
    const h = getAuthHeaders();

    // Fetch saved talents from /api/saved-talents
    fetch('/api/saved-talents', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.saved ?? data.saved ?? [];
        if (Array.isArray(list)) {
          setTalents(list.map((t: any) => ({
            id:       t.aspirant_profile_id ?? t.aspirant_id ?? t.id,
            saved_id: t.id,
            name:     t.name ?? 'Unknown',
            age:      t.age ?? 0,
            img:      t.avatar ?? '',
            gender:   t.gender ?? '—',
            talentId: t.talentId ?? '—',
            type:     t.category ?? t.role ?? 'TALENT',
            city:     t.city ?? '—',
            state:    t.state ?? '—',
            addedOn:  t.created_at ? new Date(t.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—',
            avatar:   t.avatar ?? '',
            img:      t.avatar ?? '',
            priority: false,
            skills:   t.languages ?? [],
            lists:    [],
          })));
        }
      }).catch(() => {})
      .finally(() => setLoadingData(false));

    // Fetch notifications + messages counts
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const count = data.data?.unread_count ?? data.unread_count;
        if (count != null) { setNotifCount(count); return; }
        const list = data.data?.notifications ?? data.notifications ?? [];
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length);
      }).catch(() => {});

    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.conversations ?? data.conversations ?? [];
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0 || c.unread_count > 0).length);
      }).catch(() => {});

    const interval = setInterval(() => {
      fetch('/api/notifications', { headers: getAuthHeaders() }).then(r => r.ok ? r.json() : null).then(data => {
        if (!data) return;
        const count = data.data?.unread_count ?? data.unread_count;
        if (count != null) setNotifCount(count);
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  /* Filter state */
  const [fType,        setFType]        = useState('All Types');
  const [fGender,      setFGender]      = useState('All');
  const [fAge,         setFAge]         = useState('All');
  const [fCity,        setFCity]        = useState('All Cities');
  const [fSkills,      setFSkills]      = useState('All Skills');

  const SB_W = sidebarOpen ? 230 : 52;
  const PER_PAGE = 10;

  /* Filter talents */
  const filtered = talents.filter(t => {
    const tabMatch =
      activeTab === 'All Talents'     ? true :
      activeTab === 'Recently Added'  ? true :
      activeTab === 'Recently Viewed' ? !!t.recentlyViewed :
      activeTab === 'High Priority'   ? !!t.priority : true;
    const searchMatch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.talentId.toLowerCase().includes(search.toLowerCase()) || t.city.toLowerCase().includes(search.toLowerCase());
    const typeMatch = fType === 'All Types' || t.type === fType.toUpperCase();
    const genderMatch = fGender === 'All' || t.gender === fGender;
    const cityMatch = fCity === 'All Cities' || t.city === fCity;
    return tabMatch && searchMatch && typeMatch && genderMatch && cityMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id: string) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelectedIds(p => p.length === filtered.length ? [] : filtered.map(t => t.id));

  const openMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setRowMenuOpen(rowMenuOpen === id ? null : id);
  };

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
            {NAV_ITEMS.map(({ icon: Icon, label, active, href }) => {
                const badge = label === 'Messages' ? (msgCount > 0 ? msgCount : undefined) : label === 'Notifications' ? (notifCount > 0 ? notifCount : undefined) : undefined;
                return (
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
                );
              })}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205,#2a1e0a)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock unlimited talent pools and AI matching.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── CENTRE + RIGHT ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>

    
          {/* Verification banner */}
          <AgencyVerificationBanner />
          {/* Page header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, color: GOLD, margin: '0 0 4px' }}>Saved Talents</h1>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Your curated list of talented individuals for future projects and opportunities.</div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: `1px solid rgba(255,255,255,0.2)`, borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>
                    <Download size={14} /> Export List
                  </button>
                  
                  <button onClick={() => router.push('/agency/talent-search')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: GOLD, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#000', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                    <Plus size={14} /> Add Talent
                  </button>
                </div>
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Total Saved Talents', value: talents.length,                                                              icon: <Bookmark size={22} color={GOLD} /> },
                  { label: 'New This Month',       value: talents.filter(t => { const d = new Date(t.addedOn); const now = new Date(); return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear(); }).length, icon: <span style={{ fontSize: 20 }}>👥</span> },
                  { label: 'Highly Rated',         value: talents.filter(t => (t as any).rating >= 4).length,                 icon: <Star size={22} color={GOLD} fill={GOLD} /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 10, background: `${GOLD}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 26, fontFamily: BEBAS, letterSpacing: 1, color: '#fff', lineHeight: 1 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 14 }}>
                {SUB_TABS.map(tab => {
                  const active = activeTab === tab;
                  return (
                    <div key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} style={{ padding: '10px 18px', cursor: 'pointer', borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent', marginBottom: -1 }}>
                      <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: active ? 700 : 500, color: active ? GOLD : 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{tab}</span>
                    </div>
                  );
                })}
              </div>

              {/* Search + sort toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
                  <Search size={14} color="rgba(255,255,255,0.4)" />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, talent ID, city, skills..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#fff', fontFamily: BARLOW, flex: 1 }} />
                  {search && <X size={13} color="rgba(255,255,255,0.4)" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Sort By:</span>
                  <div style={{ position: 'relative' }}>
                    {sortOpen && <div onClick={() => setSortOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />}
                    <div onClick={() => setSortOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 14, color: '#fff', fontFamily: BARLOW, minWidth: 150, position: 'relative', zIndex: 51 }}>
                      {sortBy} <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ marginLeft: 'auto', transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                    </div>
                    {sortOpen && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 100, minWidth: 170, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                        {SORT_OPTIONS.map(s => (
                          <div key={s} onClick={() => { setSortBy(s); setSortOpen(false); }} style={{ padding: '9px 14px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: s === sortBy ? GOLD : '#fff', background: s === sortBy ? `${GOLD}08` : 'transparent' }}
                            onMouseEnter={e => { if (s !== sortBy) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={e => { if (s !== sortBy) e.currentTarget.style.background = 'transparent'; }}
                          >{s}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* View toggle */}
                  <div style={{ display: 'flex', background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden' }}>
                    <button onClick={() => setViewMode('list')} style={{ width: 34, height: 34, border: 'none', background: viewMode === 'list' ? `${GOLD}20` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <List size={14} color={viewMode === 'list' ? GOLD : 'rgba(255,255,255,0.4)'} />
                    </button>
                    <button onClick={() => setViewMode('grid')} style={{ width: 34, height: 34, border: 'none', background: viewMode === 'grid' ? `${GOLD}20` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Grid size={14} color={viewMode === 'grid' ? GOLD : 'rgba(255,255,255,0.4)'} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk action bar */}
              {selectedIds.length > 0 && (
                <div style={{ background: BG4, border: `1px solid ${GOLD}40`, borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' as const }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: GOLD }}>{selectedIds.length} selected</span>
                  <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
                  {[
                    { label: 'Add to List',         color: GOLD  },
                    { label: 'Schedule Audition',   color: BLUE  },
                    { label: 'Send Message',         color: GREEN },
                    { label: 'Remove Selected',      color: RED   },
                    { label: 'Export',               color: 'rgba(255,255,255,0.7)' },
                  ].map(({ label, color }) => (
                    <button key={label} onClick={() => { if (label === 'Remove Selected') setSelectedIds([]); }} style={{ background: 'none', border: `1px solid ${color}`, borderRadius: 7, padding: '5px 14px', color, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const }}
                      onMouseEnter={e => (e.currentTarget.style.background = color + '15')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >{label}</button>
                  ))}
                  <button onClick={() => setSelectedIds([])} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>✕ Clear</button>
                </div>
              )}
            </div>

            {/* Table */}
            <div style={{ flex: 1, padding: '0 24px 20px' }}>
              {rowMenuOpen && <div onClick={() => setRowMenuOpen(null)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />}

              <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'visible' }}>
                {/* Headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 0.8fr 0.7fr 1fr 1fr 0.8fr 100px', alignItems: 'center', padding: '11px 16px', background: BG3, borderRadius: '12px 12px 0 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <span onClick={toggleAll} style={{ cursor: 'pointer', display: 'flex' }}>
                    {selectedIds.length === filtered.length && filtered.length > 0 ? <CheckSquare size={14} color={GOLD} /> : <Square size={14} color="rgba(255,255,255,0.35)" />}
                  </span>
                  {['Talent', 'Aspirant ID', 'Type', 'City', 'Added On', 'Rating', 'Actions'].map((h, i) => (
                    <span key={h} style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: i === 4 ? GOLD : 'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform: 'uppercase' as const, textAlign: i === 6 ? 'center' as const : 'left' as const, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {h} {i === 4 && <span style={{ fontSize: 14 }}>↓</span>}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                {paged.map((t, idx) => {
                  const checked = selectedIds.includes(t.id);
                  const tcfg = TYPE_COLORS[t.type] ?? { color: "#A8B0BD", bg: "rgba(168,176,189,0.1)" };
                  return (
                    <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '36px 2fr 0.8fr 0.7fr 1fr 1fr 0.8fr 100px', alignItems: 'center', padding: '12px 16px', borderBottom: idx < paged.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.12s', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => router.push(`/agency/talent/${t.id}`)}
                    >
                      <span onClick={e => { e.stopPropagation(); toggleSelect(t.id); }} style={{ display: 'flex' }}>
                        {checked ? <CheckSquare size={14} color={GOLD} /> : <Square size={14} color="rgba(255,255,255,0.35)" />}
                      </span>

                      {/* Talent */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        {t.priority && <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, flexShrink: 0 }} title="High Priority" />}
                        <ProtectedMedia type="image" src={t.img} alt={t.name} width={38} height={38} style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{t.name}</div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{t.age} · {t.gender}</div>
                        </div>
                      </div>

                      {/* Aspirant ID */}
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW }}>{t.talentId}</div>

                      {/* Type badge */}
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: tcfg.color, background: tcfg.bg, borderRadius: 5, padding: '3px 8px', letterSpacing: 0.5 }}>{t.type}</span>
                      </div>

                      {/* City */}
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{t.city}, {t.state}</div>

                      {/* Added On */}
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{t.addedOn}</div>

                      {/* Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Star size={13} color={GOLD} fill={GOLD} />
                        <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{t.rating}</span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }} onClick={e => e.stopPropagation()}>
                        <ActionBtn title="Save to List" onClick={() => {}}>
                          <Bookmark size={13} color="rgba(255,255,255,0.55)" />
                        </ActionBtn>

                        <div style={{ position: 'relative' }}>
                          <ActionBtn title="More Actions" onClick={e => openMenu(t.id, e)}>
                            <MoreVertical size={13} color="rgba(255,255,255,0.55)" />
                          </ActionBtn>
                          {rowMenuOpen === t.id && (
                            <div style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, width: 200, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 300, boxShadow: '0 12px 40px rgba(0,0,0,0.85)' }}>
                              {[
                                { label: 'View Profile',       onClick: () => { router.push(`/agency/talent/${t.id}`); setRowMenuOpen(null); } },
                                { label: 'View Application',   onClick: () => { router.push(`/agency/applications/${t.id}`); setRowMenuOpen(null); } },
                                { label: 'Schedule Audition',  onClick: () => { router.push(`/agency/auditions/schedule?candidate=${t.id}&from=shortlisted`); setRowMenuOpen(null); }, color: BLUE },
                                { label: 'Send Message',       onClick: () => { router.push('/agency/messages'); setRowMenuOpen(null); } },
                                { label: 'Add to List',        onClick: () => setRowMenuOpen(null), color: GOLD },
                                { label: 'Mark as Priority',   onClick: () => setRowMenuOpen(null), color: GOLD },
                                { label: 'Remove from Saved',  onClick: () => setRowMenuOpen(null), color: RED },
                              ].map(({ label, onClick, color }, mi) => (
                                <>
                                  {(mi === 2 || mi === 5) && <div key={`d${mi}`} style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />}
                                  <div key={label} onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color: color || '#F5F5F5' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                  >{label}</div>
                                </>
                              ))}
                            </div>
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
                  Showing {filtered.length === 0 ? 0 : Math.min((page-1)*PER_PAGE+1, filtered.length)} to {Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} talents
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <PBtn onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}><ChevronLeft size={13} /></PBtn>
                  {(() => {
                    const pages: number[] = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                      return pages.map(n => <PBtn key={n} onClick={() => setPage(n)} active={page===n}>{n}</PBtn>);
                    }
                    // show first, last, current and neighbours with ellipsis
                    const show = new Set([1, totalPages, page, page-1, page+1].filter(n => n >= 1 && n <= totalPages));
                    const sorted = Array.from(show).sort((a,b) => a-b);
                    return sorted.map((n, i) => {
                      const prev = sorted[i-1];
                      return (
                        <>
                          {prev && n - prev > 1 && <span key={`e${n}`} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: '0 4px', display: 'flex', alignItems: 'center' }}>...</span>}
                          <PBtn key={n} onClick={() => setPage(n)} active={page===n}>{n}</PBtn>
                        </>
                      );
                    });
                  })()}
                  <PBtn onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}><ChevronRight size={13} /></PBtn>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{ width: 260, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', scrollbarWidth: 'none', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Filters */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: GOLD, letterSpacing: 0.7, textTransform: 'uppercase' as const }}>Filters</span>
                <span onClick={() => { setFType('All Types'); setFGender('All'); setFAge('All'); setFCity('All Cities'); setFSkills('All Skills'); }} style={{ fontSize: 14, color: GOLD, cursor: 'pointer', fontWeight: 600 }}>Clear All</span>
              </div>

              <FLabel>Talent Type</FLabel>
              <FSelect value={fType} onChange={setFType} options={['All Types','Acting','Direction','Production Office','Camera & Lighting','Sound & Music','Art','Costume','Hair & Make Up','Editing','Visual Effects','Animation','Stunt','Modelling','Dancing','Singing','Dubbing','Television','Advertisement','Story','Grip','Sets','Construction','Post Production','Accounting','Locations','Continuity','Casting','Special Effects','Electrical']} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '10px 0' }}>
                <div>
                  <FLabel>Gender</FLabel>
                  <FSelect value={fGender} onChange={setFGender} options={['All','Male','Female']} />
                </div>
                <div>
                  <FLabel>Age</FLabel>
                  <FSelect value={fAge} onChange={setFAge} options={['All','18-25','26-30','31-40','40+']} />
                </div>
              </div>

              <FLabel>Age Range</FLabel>
              <FSelect value={fAge} onChange={setFAge} options={['All','18-25','26-30','31-40','40+']} />

              <div style={{ marginTop: 10 }}>
                <FLabel>City</FLabel>
                <FSelect value={fCity} onChange={setFCity} options={['All Cities',...[...new Set(talents.map(t => t.city).filter(Boolean))].sort()]} />
              </div>

              <div style={{ marginTop: 10, marginBottom: 14 }}>
                <FLabel>Skills</FLabel>
                <FSelect value={fSkills} onChange={setFSkills} options={['All Skills','Acting','Dialogue Delivery','Dancing','Action','Singing','Modelling','Yoga','Fighting','Mimicry','Horse Riding','Direction','Photography','Videography','Editing','Choreography','Make Up','Hair Styling','Costume Design','Script Writing','Voice Over','Anchoring','News Reading','Animation','VFX','Sound Design','Music Composition','Stunt','Production Management','Casting','Art Direction','Set Design','Cinematography','Dubbing','Influencing','Fashion Modelling']} />
              </div>

              <button onClick={() => { setPage(1); }} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                Apply Filters
              </button>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

            {/* Talent Engagement */}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, letterSpacing: 0.7, textTransform: 'uppercase' as const, marginBottom: 14 }}>Talent Engagement</div>
              <EngagementDonut />
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 10, textAlign: 'center' as const }}>Based on saved talents activity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function ActionBtn({ onClick, title, children }: { onClick: (e: React.MouseEvent) => void; title: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >{children}</button>
  );
}

function PBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 32, height: 32, borderRadius: 7, border: `1px solid ${active ? GOLD : 'rgba(255,255,255,0.12)'}`, background: active ? GOLD : 'transparent', color: active ? '#000' : disabled ? 'rgba(255,255,255,0.2)' : '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: active ? 700 : 400, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
      {children}
    </button>
  );
}

function FLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>{children}</div>;
}

function FSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: 2 }}>
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />}
      <div onClick={() => setOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '8px 10px', cursor: 'pointer', fontSize: 14, color: '#fff', fontFamily: BARLOW, position: 'relative', zIndex: 91 }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{value}</span>
        <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </div>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 3, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 200, maxHeight: 200, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{ padding: '8px 10px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: opt === value ? GOLD : '#F5F5F5', background: opt === value ? `${GOLD}08` : 'transparent' }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent'; }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}