'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark, Star, Bell,
  ChevronRight, ChevronDown, ChevronLeft, Menu, CalendarDays, Clock, MapPin, Headphones,
} from 'lucide-react';

/* ─── Design tokens ──────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";

/* ─── PRD-finalized 7-item sidebar ───────────────────────────── */
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard'      },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications'},
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',       badge: 2 },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions',      active: true },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended'    },
  { icon: Bell,            label: 'Notifications',        href: '/notifications',  badge: 3 },
];

const DROPDOWN_LINKS = ['Subscription', 'Analytics', 'Calendar', 'Settings', 'Support', 'Logout'];

/* ─── Data ───────────────────────────────────────────────────── */
type AuditionStatus = 'Upcoming' | 'Completed' | 'Cancelled';

const AUDITIONS = [
  {
    id: 1,
    title: 'City of Dreams – Season 2',
    type: 'Web Series', genres: 'Drama, Crime, Thriller',
    agency: 'Silver Paradise Productions', agencyInitials: 'SP', agencyColor: '#2DD4BF',
    status: 'Upcoming' as AuditionStatus,
    role: 'Rohan Verma', characterType: 'Lead',
    date: '20 May 2025', day: 'Tuesday', time: '09:30 AM IST',
    location: 'Silver Paradise Studio, Stage 3, Film City, Goregaon, Mumbai',
    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'The Echoes – Feature Film',
    type: 'Feature Film', genres: 'Psychological, Drama',
    agency: 'FrameWorks Entertainment', agencyInitials: 'FW', agencyColor: '#60A5FA',
    status: 'Completed' as AuditionStatus,
    role: 'Kabir', characterType: 'Supporting',
    date: '15 May 2025', day: 'Thursday', time: '11:00 AM IST',
    location: 'Film City Studios, Versova, Mumbai',
    img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Dil Ke Safar – Web Series',
    type: 'Web Series', genres: 'Romance, Drama',
    agency: 'Silver Paradise Productions', agencyInitials: 'SP', agencyColor: '#2DD4BF',
    status: 'Completed' as AuditionStatus,
    role: 'Arjun', characterType: 'Lead',
    date: '05 May 2025', day: 'Monday', time: '02:00 PM IST',
    location: 'Silver Paradise Studio, Andheri West, Mumbai',
    img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=200&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Shadow Unit – TV Series',
    type: 'TV Series', genres: 'Action, Thriller',
    agency: 'Black Owl Films', agencyInitials: 'BO', agencyColor: '#94A3B8',
    status: 'Cancelled' as AuditionStatus,
    role: 'Vikram', characterType: 'Supporting',
    date: '28 Apr 2025', day: 'Monday', time: '10:30 AM IST',
    location: 'Black Owl Studios, Hyderabad',
    img: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=200&h=300&fit=crop',
  },
  {
    id: 5,
    title: 'Fresh Start – Beverage Ad',
    type: 'Ad Film', genres: 'Commercial',
    agency: 'Bright Angle Media', agencyInitials: 'BA', agencyColor: '#F472B6',
    status: 'Upcoming' as AuditionStatus,
    role: 'Brand Influencer', characterType: 'Lead',
    date: '24 May 2025', day: 'Saturday', time: '04:00 PM IST',
    location: 'Bright Angle Studios, Lower Parel, Mumbai',
    img: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=200&h=300&fit=crop',
  },
];


const STATUS_CFG: Record<AuditionStatus, { bg: string; color: string; border: string }> = {
  'Upcoming':  { bg: 'rgba(139,92,246,0.12)', color: '#A78BFA', border: 'rgba(139,92,246,0.25)' },
  'Completed': { bg: 'rgba(34,197,94,0.12)',  color: '#4ADE80', border: 'rgba(34,197,94,0.25)'  },
  'Cancelled': { bg: 'rgba(239,68,68,0.12)',  color: '#F87171', border: 'rgba(239,68,68,0.25)'  },
};

const SORT_OPTIONS = ['Most Recent', 'Oldest First', 'Upcoming First'];

const FILTER_OPTIONS = {
  Status:       ['All Status',        'Upcoming',       'Completed',  'Cancelled'   ],
  Type:         ['All Types',         'In-Person',      'Virtual',    'Hybrid'      ],
  'Project Type': ['All Project Types','Feature Film',  'Web Series', 'TV Series', 'Ad Film'],
  Date:         ['All Dates',         'This Week',      'This Month', 'Next Month'  ],
};


export default function AuditionsListPage() {
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
  const [sortBy,       setSortBy]       = useState('Most Recent');
  const [expandedId,   setExpandedId]   = useState<string | null>(null);
  const [openFilter,   setOpenFilter]   = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    Status: 'All Status', Type: 'All Types', 'Project Type': 'All Project Types', Date: 'All Dates',
  });
  const [auditions,    setAuditions]    = useState(AUDITIONS);

  const TABS = [
    { label: 'All',       status: null,        count: auditions.length },
    { label: 'Upcoming',  status: 'Upcoming',  count: auditions.filter(a => a.status === 'Upcoming').length  },
    { label: 'Completed', status: 'Completed', count: auditions.filter(a => a.status === 'Completed').length },
    { label: 'Cancelled', status: 'Cancelled', count: auditions.filter(a => a.status === 'Cancelled').length },
  ];

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

  // Fetch real auditions from API
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;
    fetch('/api/auditions?limit=100', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.auditions ?? data.auditions ?? [];
        if (!Array.isArray(list) || list.length === 0) return;
        const statusMap: Record<string, AuditionStatus> = {
          scheduled:   'Upcoming',
          completed:   'Completed',
          cancelled:   'Cancelled',
          rescheduled: 'Upcoming',
        };
        const modeMap: Record<string, string> = {
          offline: 'In-Person',
          online:  'Virtual',
          both:    'Hybrid',
        };
        setAuditions(list.map((a: any, i: number) => {
          const cc = a.casting_calls ?? {};
          const ap = a.agency_profiles ?? {};
          const scheduledAt = a.scheduled_at ? new Date(a.scheduled_at) : null;
          return {
            id:             a.id,
            title:          cc.title ?? 'Audition',
            type:           cc.project_type ?? '',
            genres:         '',
            agency:         ap.company_name ?? 'Agency',
            agencyInitials: (ap.company_name ?? 'A').slice(0, 2).toUpperCase(),
            agencyColor:    '#D4A64A',
            status:         statusMap[a.status] ?? 'Upcoming',
            role:           cc.role_name ?? '',
            characterType:  '',
            date:           scheduledAt ? scheduledAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            day:            scheduledAt ? scheduledAt.toLocaleDateString('en-IN', { weekday: 'long' }) : '',
            time:           scheduledAt ? scheduledAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST' : '',
            location:       a.venue_details ?? (a.mode === 'online' ? 'Video Call (link sent)' : ''),
            img:            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop',
          };
        }));
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const tabStatus = TABS[activeTab].status as AuditionStatus | null;
    return tabStatus ? auditions.filter(a => a.status === tabStatus) : auditions;
  }, [activeTab, auditions]);

  const SB_W = sidebarOpen ? 240 : 56;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#fff' }}>

      {/* ══ HEADER ══ */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', height: 60,
        flexShrink: 0, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative', zIndex: 100,
      }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />

        <div style={{ flex: 1 }} />

        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent', border: `1px solid ${GOLD}`,
          color: GOLD, borderRadius: 8, padding: '0 18px', height: 36,
          fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap',
        }}>+ Find Casting Calls</button>

        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={16} />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>3</div>
        </div>

        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <MessageSquare size={16} />
        </div>

        <div ref={dropRef} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
            <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff`} alt={userName}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}` }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{userName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Aspirant</div>
            </div>
            <ChevronRight size={12} color="rgba(255,255,255,0.4)" style={{ transform: 'rotate(90deg)' }} />
          </div>
          {dropdownOpen && (
            <div style={{ position: 'absolute', top: 46, right: 0, width: 190, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              {DROPDOWN_LINKS.map(item => (
                <div key={item} style={{ padding: '10px 16px', fontSize: 16, cursor: 'pointer', color: item === 'Logout' ? '#ff6b6b' : '#fff', borderTop: item === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                  onClick={() => router.push(item === 'Logout' ? '/login' : `/${item.toLowerCase()}`)}
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
          {/* Toggle */}
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

          {/* Upgrade to Premium */}
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SHARED SCROLL WRAPPER (main + right rail) ── */}
        <div style={{ display: 'flex', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, padding: '20px 16px 20px 20px', minWidth: 0 }}>

          {/* Page title */}
          <div style={{ marginBottom: 16 }}>
            <h1 style={{ fontFamily: BEBAS, fontSize: 32, fontWeight: 400, letterSpacing: 1, marginBottom: 4 }}>My Auditions</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Track all your audition invitations and their status.</p>
          </div>

          {/* Tabs + Sort */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 0 }}>
              {TABS.map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: BARLOW, padding: '8px 16px 10px', marginBottom: -1,
                  fontSize: 16, fontWeight: activeTab === i ? 700 : 400,
                  color: activeTab === i ? RED : 'rgba(255,255,255,0.5)',
                  borderBottom: activeTab === i ? `2px solid ${RED}` : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}>
                  {tab.label} <span style={{ fontSize: 14, color: activeTab === i ? RED : 'rgba(255,255,255,0.3)' }}>({tab.count})</span>
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
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 160 }}>
                  {SORT_OPTIONS.map(opt => (
                    <div key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }} style={{
                      padding: '9px 14px', fontSize: 14, cursor: 'pointer',
                      color: sortBy === opt ? RED : 'rgba(255,255,255,0.7)',
                      background: sortBy === opt ? 'rgba(200,32,42,0.08)' : 'transparent',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = sortBy === opt ? 'rgba(200,32,42,0.08)' : 'transparent'}
                    >{opt}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Audition cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 1000, margin: '0 auto' }}>
            {filtered.map(a => {
              const sCfg = STATUS_CFG[a.status];
              const isExpanded = expandedId === a.id;
              return (
                <div key={a.id} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    {/* Poster */}
                    <div style={{ width: 100, flexShrink: 0, overflow: 'hidden' }}>
                      <img src={a.img} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>

                      {/* Row 1: status + title ......... date */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: sCfg.bg, border: `1px solid ${sCfg.border}`, borderRadius: 20, padding: '2px 10px', marginBottom: 6 }}>
                            <span style={{ fontSize: 14, color: sCfg.color, fontWeight: 600 }}>{a.status}</span>
                          </div>
                          <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2, color: '#fff' }}>{a.title}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexShrink: 0 }}>
                          <CalendarDays size={14} color="rgba(255,255,255,0.35)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{a.date}</div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{a.day}</div>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: type/genres ......... time */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{a.type} &bull; {a.genres}</span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                          <Clock size={14} color="rgba(255,255,255,0.35)" />
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', whiteSpace: 'nowrap' }}>{a.time}</span>
                        </div>
                      </div>

                      {/* Row 3: agency ......... location */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${a.agencyColor}22`, border: `1px solid ${a.agencyColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: a.agencyColor, flexShrink: 0 }}>
                            {a.agencyInitials}
                          </div>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>by {a.agency}</span>
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="8" fill="#1D9BF0" /><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexShrink: 0, maxWidth: '50%' }}>
                          <MapPin size={14} color="rgba(255,255,255,0.35)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, textAlign: 'right' }}>{a.location}</span>
                        </div>
                      </div>

                      {/* Row 4: Role / Character Type ......... View Details + arrow */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 2 }}>
                        <div style={{ display: 'flex', gap: 24 }}>
                          <div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 1 }}>Role</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{a.role}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 1 }}>Character Type</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{a.characterType}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                          <button onClick={() => setExpandedId(isExpanded ? null : a.id)} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: GOLD, fontSize: 14, fontWeight: 600, fontFamily: BARLOW,
                            padding: 0, whiteSpace: 'nowrap',
                          }}>
                            View Details <span style={{ fontSize: 14, transform: isExpanded ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>∨</span>
                          </button>
                          <button onClick={() => router.push(`/auditions/${a.id}`)} style={{
                            width: 34, height: 34, borderRadius: 8, border: `1px solid ${GOLD}`,
                            background: 'rgba(212,166,74,0.08)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                            transition: 'background 0.2s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,166,74,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,166,74,0.08)'}
                          >
                            <ChevronRight size={16} color={GOLD} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: BG3, padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 16px' }}>
                      {[
                        { label: 'Audition Type', value: 'In-Person' },
                        { label: 'Date & Time', value: `${a.date}, ${a.time}` },
                        { label: 'Duration', value: '2 Hours' },
                        { label: 'Reporting Time', value: '10:30 AM IST' },
                        { label: 'Dress Code', value: 'Casual (As per Character)' },
                        { label: 'Venue', value: a.location },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>{label}</div>
                          <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* ── RIGHT RAIL ── */}
        <div style={{ width: 360, flexShrink: 0, display: 'flex' }}>
        <div style={{ flex: 1, padding: '20px 16px 20px 4px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Upcoming Auditions */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 8 }}>
              <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, color: '#fff', whiteSpace: 'nowrap' }}>Upcoming</h3>
              <button onClick={() => router.push('/calendar')} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}>View Calendar</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {auditions.filter(a => a.status === 'Upcoming').map(a => (
                <div key={a.id} style={{ background: BG3, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', gap: 0 }}>
                    <div style={{ width: 64, flexShrink: 0, overflow: 'hidden' }}>
                      <img src={a.img} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 90 }} />
                    </div>
                    <div style={{ flex: 1, padding: '10px 12px' }}>
                      <div style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '1px 8px', display: 'inline-block', marginBottom: 5 }}>
                        <span style={{ fontSize: 14, color: '#A78BFA', fontWeight: 600 }}>Upcoming</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 5 }}>{a.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>
                        <CalendarDays size={11} color="rgba(255,255,255,0.35)" />
                        {a.date} &bull; {a.time}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                        <MapPin size={11} color="rgba(255,255,255,0.3)" style={{ marginTop: 1, flexShrink: 0 }} />
                        {a.location}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => router.push(`/auditions/${a.id}`)} style={{
                      width: '100%', background: 'transparent', border: `1px solid ${GOLD}`,
                      color: GOLD, borderRadius: 7, padding: '6px 0', fontSize: 14,
                      fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', transition: 'background 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,166,74,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Auditions */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, color: '#fff' }}>Filter Auditions</h3>
              <button onClick={() => setFilterValues({ Status: 'All Status', Type: 'All Types', 'Project Type': 'All Project Types', Date: 'All Dates' })} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', padding: 0 }}>Reset</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(FILTER_OPTIONS).map(([filterKey, opts]) => (
                <div key={filterKey}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 5 }}>{filterKey}</div>
                  <div style={{ position: 'relative' }}>
                    <div onClick={() => setOpenFilter(openFilter === filterKey ? null : filterKey)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: BG3, border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                    }}>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{filterValues[filterKey]}</span>
                      <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: openFilter === filterKey ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }} />
                    </div>
                    {openFilter === filterKey && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 3px)', left: 0, right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                        {opts.map(opt => (
                          <div key={opt} onClick={() => { setFilterValues(f => ({ ...f, [filterKey]: opt })); setOpenFilter(null); }} style={{
                            padding: '8px 12px', fontSize: 14, cursor: 'pointer',
                            color: filterValues[filterKey] === opt ? RED : 'rgba(255,255,255,0.7)',
                            background: filterValues[filterKey] === opt ? 'rgba(200,32,42,0.08)' : 'transparent',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={e => e.currentTarget.style.background = filterValues[filterKey] === opt ? 'rgba(200,32,42,0.08)' : 'transparent'}
                          >{opt}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button style={{
                width: '100%', background: GOLD, border: 'none', color: '#000',
                borderRadius: 8, padding: '9px 0', fontSize: 16,
                fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer',
                marginTop: 4, transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >Apply Filters</button>
            </div>
          </div>

          {/* Need Help */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
            <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 6, color: '#fff' }}>Need Help?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 14, lineHeight: 1.6 }}>
              Have questions about your audition? We&apos;re here to help.
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
        {/* spacer — shifts shared scrollbar away from browser edge */}
        <div style={{ width: 16, flexShrink: 0 }} />
        </div>
        {/* end shared scroll wrapper */}
        </div>
      </div>
    </div>
  );
}