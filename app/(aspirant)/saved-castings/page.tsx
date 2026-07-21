'use client';

import AspirantHeader from '@/components/layout/AspirantHeader'
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {

  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark, Star, Bell,
  ChevronRight, ChevronDown, ChevronLeft, Menu, CalendarDays, Headphones, Heart, User, Users,
  MapPin, Check,
} from 'lucide-react';

/* ─── Design tokens ─────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";

/* ─── PRD-finalized 7-item sidebar ──────────────────────────── */
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard'       },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications' },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',        badge: 2 },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions'       },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings',  active: true },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended'     },
  { icon: Bell,            label: 'Notifications',        href: '/notifications'},
];

const DROPDOWN_LINKS = ['Subscription', 'Analytics', 'Calendar', 'Settings', 'Support', 'Logout'];

/* ─── Data ──────────────────────────────────────────────────── */
type CastingType = 'Web Series' | 'Film' | 'TV Series' | 'Ad Film';

const TYPE_CFG: Record<CastingType, { bg: string; color: string; border: string }> = {
  'Web Series': { bg: 'rgba(59,130,246,0.1)',    color: '#60A5FA', border: 'rgba(59,130,246,0.25)'   },
  'Film':       { bg: 'rgba(148,163,184,0.08)',  color: '#94A3B8', border: 'rgba(148,163,184,0.2)'   },
  'TV Series':  { bg: 'rgba(34,197,94,0.1)',     color: '#4ADE80', border: 'rgba(34,197,94,0.25)'    },
  'Ad Film':    { bg: 'rgba(236,72,153,0.1)',    color: '#F472B6', border: 'rgba(236,72,153,0.25)'   },
};

const CASTINGS = [
  {
    id: 1,
    title: 'The Silent Truth',
    type: 'Web Series' as CastingType,
    genres: 'Thriller, Mystery',
    language: 'Hindi',
    agency: 'FrameWorks Entertainment',
    agencyInitials: 'FW',
    agencyColor: '#60A5FA',
    description: 'A gripping investigative thriller that dives deep into secrets, lies and the pursuit of truth.',
    role: 'Lead Actor - Male',
    ageRange: '25 – 35 Yrs',
    location: 'Mumbai',
    postedOn: '18 May 2025',
    savedOn: '18 May 2025',
    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=280&fit=crop',
  },
  {
    id: 2,
    title: 'Dil Ke Safar',
    type: 'Film' as CastingType,
    genres: 'Romance',
    language: 'Hindi',
    agency: 'Silver Paradise Productions',
    agencyInitials: 'SP',
    agencyColor: '#2DD4BF',
    description: 'A heartwarming love story about second chances and finding love in unexpected places.',
    role: 'Lead Actor - Male',
    ageRange: '23 – 32 Yrs',
    location: 'Delhi',
    postedOn: '15 May 2025',
    savedOn: '16 May 2025',
    img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=200&h=280&fit=crop',
  },
  {
    id: 3,
    title: 'Shadow Force',
    type: 'Film' as CastingType,
    genres: 'Action, Drama',
    language: 'Hindi',
    agency: 'Black Owl Films',
    agencyInitials: 'BO',
    agencyColor: '#94A3B8',
    description: 'An intense action drama about an ex-soldier who takes on a powerful criminal network.',
    role: 'Supporting Actor',
    ageRange: '28 – 40 Yrs',
    location: 'Hyderabad',
    postedOn: '12 May 2025',
    savedOn: '13 May 2025',
    img: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=200&h=280&fit=crop',
  },
  {
    id: 4,
    title: 'Fresh Start – Beverage Ad',
    type: 'Ad Film' as CastingType,
    genres: 'Ad Film',
    language: 'Hindi',
    agency: 'Bright Angle Media',
    agencyInitials: 'BA',
    agencyColor: '#F472B6',
    description: 'Energetic and fun beverage ad film looking for a fresh, expressive face.',
    role: 'Lead Actor - Male',
    ageRange: '18 – 28 Yrs',
    location: 'Mumbai',
    postedOn: '10 May 2025',
    savedOn: '11 May 2025',
    img: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=200&h=280&fit=crop',
  },
];


const SORT_OPTIONS      = ['Recently Saved', 'Oldest Saved', 'Application Deadline'];
const LANG_OPTIONS      = ['All Languages', 'Hindi', 'English', 'Tamil', 'Telugu', 'Bengali'];
const LOC_OPTIONS       = ['All Locations', 'Mumbai', 'Delhi', 'Hyderabad', 'Bangalore', 'Chennai'];
const CATEGORY_FILTERS  = ['Film', 'Web Series', 'TV', 'Ad Films', 'Others'];

const QUICK_TIPS = [
  { icon: Heart,        text: "Save castings you're interested in to apply later." },
  { icon: Bell,         text: "We'll notify you about updates to saved castings."  },
  { icon: CalendarDays, text: 'Keep track and never miss an opportunity.'          },
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function SavedCastingsPage() {
  const router = useRouter();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [userName,   setUserName]   = useState('My Account');
  const [avatarUrl,  setAvatarUrl]  = useState('');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name)         setUserName(u.name);
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
    } catch {}
  }, []);

  const [activeTab,    setActiveTab]    = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortOpen,     setSortOpen]     = useState(false);
  const [sortBy,       setSortBy]       = useState('Recently Saved');
  const [langOpen,     setLangOpen]     = useState(false);
  const [locOpen,      setLocOpen]      = useState(false);
  const [language,     setLanguage]     = useState('All Languages');
  const [location,     setLocation]     = useState('All Locations');
  const [categories,   setCategories]   = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORY_FILTERS.map(c => [c, false]))
  );
  const [castings,     setCastings]     = useState(CASTINGS);
  const [loading,      setLoading]      = useState(true);

  const TABS = [
    { label: 'All Saved',  count: castings.length,                                             filter: null as CastingType | null },
    { label: 'Film',       count: castings.filter(c => c.type === 'Film').length,       filter: 'Film'       as CastingType },
    { label: 'Web Series', count: castings.filter(c => c.type === 'Web Series').length, filter: 'Web Series' as CastingType },
    { label: 'TV',         count: castings.filter(c => c.type === 'TV Series').length,  filter: 'TV Series'  as CastingType },
    { label: 'Ad Films',   count: castings.filter(c => c.type === 'Ad Film').length,    filter: 'Ad Film'    as CastingType },
  ];
  const SB_W = sidebarOpen ? 240 : 56;

  const dropRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch saved castings from API
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) { setLoading(false); return; }
    fetch('/api/saved-castings', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.saved ?? data.saved ?? [];
        if (!Array.isArray(list) || list.length === 0) return;
        setCastings(list.map((s: any, i: number) => {
          const cc = s.casting_calls ?? {};
          const ag = cc.agency_profiles ?? {};
          const typeMap: Record<string, CastingType> = {
            Film: 'Film', Web_Series: 'Web Series', 'Web Series': 'Web Series',
            TV_Series: 'TV Series', 'TV Series': 'TV Series', Ad_Film: 'Ad Film', 'Ad Film': 'Ad Film',
          };
          return {
            id:             s.id ?? i + 1,
            castingCallId:  cc.id,
            title:          cc.title ?? 'Casting Call',
            type:           (typeMap[cc.project_type] ?? 'Film') as CastingType,
            genres:         cc.category ?? '',
            language:       Array.isArray(cc.languages_required) ? cc.languages_required.join(', ') : '',
            agency:         ag.company_name ?? '',
            agencyInitials: (ag.company_name ?? 'A').slice(0, 2).toUpperCase(),
            agencyColor:    '#D4A64A',
            description:    cc.role_description ?? cc.eligibility_criteria ?? '',
            role:           cc.role_name ?? '',
            ageRange:       cc.age_min && cc.age_max ? `${cc.age_min} – ${cc.age_max} Yrs` : '',
            location:       cc.location ?? ag.city ?? '',
            postedOn:       cc.created_at ? new Date(cc.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            savedOn:        s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            img:            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=280&fit=crop',
          };
        }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unsave = (castingCallId: string) => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;
    fetch(`/api/saved-castings?casting_call_id=${castingCallId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setCastings(prev => prev.filter((c: any) => c.castingCallId !== castingCallId));
    }).catch(() => {});
  };

  const filtered = useMemo(() => {
    const f = TABS[activeTab].filter;
    const activeCats = Object.keys(categories).filter(k => categories[k]);
    return castings.filter(c => {
      if (f && c.type !== f) return false;
      if (activeCats.length > 0 && !activeCats.some(cat => c.type === cat || (cat === 'TV' && c.type === 'TV Series') || (cat === 'Ad Films' && c.type === 'Ad Film'))) return false;
      if (language !== 'All Languages' && !c.language.split(',').map((l: string) => l.trim()).includes(language)) return false;
      if (location !== 'All Locations' && c.location !== location) return false;
      return true;
    });
  }, [activeTab, castings, categories, language, location]);

  const toggleCategory = (key: string) =>
    setCategories(prev => ({ ...prev, [key]: !prev[key] }));

  const resetFilters = () => {
    setCategories(Object.fromEntries(CATEGORY_FILTERS.map(c => [c, false])));
    setLanguage('All Languages');
    setLocation('All Locations');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#fff' }}>

      {/* ══ HEADER ══ */}
      <AspirantHeader />

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
              <div key={label} title={!sidebarOpen ? label : undefined} style={{
                display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center',
                padding: sidebarOpen ? '9px 16px' : '10px 0', cursor: 'pointer',
                background: active ? 'rgba(200,32,42,0.12)' : 'transparent',
                borderLeft: sidebarOpen && active ? `3px solid ${RED}` : '3px solid transparent',
              }}
                onClick={() => router.push(href)}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.45)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 16, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
              </div>
            ))}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SHARED SCROLL WRAPPER ── */}
        <div style={{ display: 'flex', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

          {/* ── MAIN ── */}
          <main style={{ flex: 1, padding: '20px 16px 20px 20px', minWidth: 0 }}>

            {/* Page title */}
            <div style={{ marginBottom: 16 }}>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, fontWeight: 400, letterSpacing: 1, marginBottom: 4 }}>Saved Castings</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Castings you&apos;ve saved to apply later or keep track of.</p>
            </div>

            {/* Tabs + Sort */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 0 }}>
                {TABS.map((tab, i) => (
                  <button key={i} onClick={() => setActiveTab(i)} style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: BARLOW, padding: '8px 14px 10px', marginBottom: -1,
                    fontSize: 16, fontWeight: activeTab === i ? 700 : 400,
                    color: activeTab === i ? GOLD : 'rgba(255,255,255,0.5)',
                    borderBottom: activeTab === i ? `2px solid ${GOLD}` : '2px solid transparent',
                    whiteSpace: 'nowrap',
                  }}>
                    {tab.label} <span style={{ fontSize: 14, color: activeTab === i ? GOLD : 'rgba(255,255,255,0.3)' }}>({tab.count})</span>
                  </button>
                ))}
              </div>
              <div ref={sortRef} style={{ position: 'relative', marginBottom: 1 }}>
                <div onClick={() => setSortOpen(v => !v)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: BG3, border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{sortBy}</span>
                  <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </div>
                {sortOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 180 }}>
                    {SORT_OPTIONS.map(opt => (
                      <div key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }} style={{
                        padding: '9px 14px', fontSize: 14, cursor: 'pointer',
                        color: sortBy === opt ? GOLD : 'rgba(255,255,255,0.7)',
                        background: sortBy === opt ? 'rgba(212,166,74,0.08)' : 'transparent',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = sortBy === opt ? 'rgba(212,166,74,0.08)' : 'transparent'}
                      >{opt}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Casting cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '48px 0', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 17 }}>
                  No saved castings in this category.
                </div>
              ) : filtered.map(c => {
                const tCfg = TYPE_CFG[c.type];
                return (
                  <div key={c.id}
                    style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'stretch', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    {/* Poster */}
                    <div style={{ width: 100, flexShrink: 0, overflow: 'hidden' }}>
                      <img src={c.img} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>

                    {/* Content — paired rows, no separate stretched column */}
                    <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>

                      {/* Row 1: type badge + title ......... Saved on */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center',
                            background: tCfg.bg, border: `1px solid ${tCfg.border}`,
                            borderRadius: 20, padding: '2px 10px', marginBottom: 6,
                          }}>
                            <span style={{ fontSize: 14, color: tCfg.color, fontWeight: 600 }}>{c.type}</span>
                          </div>
                          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2, color: '#fff' }}>{c.title}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <button onClick={() => unsave((c as any).castingCallId ?? String(c.id))} title="Remove from saved" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                            <Bookmark size={16} color={GOLD} fill={GOLD} />
                          </button>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Saved on</div>
                            <div style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>{c.savedOn}</div>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: genres • language ......... Posted On */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{c.genres} &bull; {c.language}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          <CalendarDays size={13} color="rgba(255,255,255,0.35)" />
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Posted {c.postedOn}</span>
                        </div>
                      </div>

                      {/* Row 3: agency ......... location */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${c.agencyColor}22`, border: `1px solid ${c.agencyColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: c.agencyColor, flexShrink: 0 }}>
                            {c.agencyInitials}
                          </div>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>by {c.agency}</span>
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                            <circle cx="8" cy="8" r="8" fill="#1D9BF0" />
                            <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                          <MapPin size={13} color="rgba(255,255,255,0.35)" />
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{c.location}</span>
                        </div>
                      </div>

                      {/* Row 4: description */}
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, margin: 0 }}>{c.description}</p>

                      {/* Row 5: Role / Age Range ......... View Details */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 2 }}>
                        <div style={{ display: 'flex', gap: 24 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <User size={13} color="rgba(255,255,255,0.35)" />
                            <div>
                              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 1 }}>Role</div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{c.role}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Users size={13} color="rgba(255,255,255,0.35)" />
                            <div>
                              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 1 }}>Age Range</div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{c.ageRange}</div>
                            </div>
                          </div>
                        </div>

                        <button onClick={() => router.push(`/casting-calls/${(c as any).castingCallId ?? c.id}`)} style={{
                          flexShrink: 0, background: 'transparent',
                          border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8,
                          padding: '7px 22px', fontSize: 15, fontWeight: 600, fontFamily: BARLOW,
                          cursor: 'pointer', transition: 'background 0.2s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,166,74,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >View Details</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>

          {/* ── RIGHT RAIL ── */}
          <div style={{ width: 300, flexShrink: 0, display: 'flex' }}>
          <div style={{ flex: 1, padding: '20px 16px 20px 4px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Filter Saved Castings */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, color: '#fff' }}>Filter Saved Castings</h3>
                <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', padding: 0 }}>Reset</button>
              </div>

              {/* Category checkboxes */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>Category</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {CATEGORY_FILTERS.map(cat => (
                    <div key={cat} onClick={() => toggleCategory(cat)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                        border: `1.5px solid ${categories[cat] ? GOLD : 'rgba(255,255,255,0.2)'}`,
                        background: categories[cat] ? GOLD : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}>
                        {categories[cat] && <Check size={10} color="#000" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: 14, color: categories[cat] ? '#fff' : 'rgba(255,255,255,0.6)' }}>{cat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language dropdown */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 5 }}>Language</div>
                <div style={{ position: 'relative' }}>
                  <div onClick={() => { setLangOpen(v => !v); setLocOpen(false); }} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: BG3, border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{language}</span>
                    <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
                  </div>
                  {langOpen && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 3px)', left: 0, right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                      {LANG_OPTIONS.map(opt => (
                        <div key={opt} onClick={() => { setLanguage(opt); setLangOpen(false); }} style={{
                          padding: '8px 12px', fontSize: 14, cursor: 'pointer',
                          color: language === opt ? GOLD : 'rgba(255,255,255,0.7)',
                          background: language === opt ? 'rgba(212,166,74,0.08)' : 'transparent',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = language === opt ? 'rgba(212,166,74,0.08)' : 'transparent'}
                        >{opt}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location dropdown */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 5 }}>Location</div>
                <div style={{ position: 'relative' }}>
                  <div onClick={() => { setLocOpen(v => !v); setLangOpen(false); }} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: BG3, border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{location}</span>
                    <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: locOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
                  </div>
                  {locOpen && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 3px)', left: 0, right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                      {LOC_OPTIONS.map(opt => (
                        <div key={opt} onClick={() => { setLocation(opt); setLocOpen(false); }} style={{
                          padding: '8px 12px', fontSize: 14, cursor: 'pointer',
                          color: location === opt ? GOLD : 'rgba(255,255,255,0.7)',
                          background: location === opt ? 'rgba(212,166,74,0.08)' : 'transparent',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = location === opt ? 'rgba(212,166,74,0.08)' : 'transparent'}
                        >{opt}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button onClick={() => {}} style={{
                width: '100%', background: GOLD, border: 'none', color: '#000',
                borderRadius: 8, padding: '9px 0', fontSize: 16,
                fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >Apply Filters</button>
            </div>

            {/* Quick Tips */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 14, color: '#fff' }}>Quick Tips</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {QUICK_TIPS.map(({ icon: Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(212,166,74,0.1)', border: '1px solid rgba(212,166,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color={GOLD} />
                    </div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 6, color: '#fff' }}>Need Help?</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 14, lineHeight: 1.6 }}>
                Have questions about your saved castings? We&apos;re here to help.
              </p>
              <button style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', background: 'transparent', border: `1px solid ${RED}`,
                color: RED, borderRadius: 8, padding: '9px 0',
                fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,32,42,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Headphones size={15} /> Contact Support
              </button>
            </div>

          </div>
          <div style={{ width: 16, flexShrink: 0 }} />
          </div>

        </div>{/* end shared scroll wrapper */}
      </div>
    </div>
  );
}