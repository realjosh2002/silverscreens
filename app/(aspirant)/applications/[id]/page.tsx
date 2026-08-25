'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, FileText, MessageSquare, Mic2,
  Bookmark, Star, Bell, ChevronRight, ChevronLeft, Menu,
  MapPin, CalendarDays, Calendar, Check, Headphones, Download,
  ArrowLeft, Building2, IndianRupee, Clapperboard, Clock,
  AlertTriangle, FileBadge2, Users, User2, Languages, BadgeCheck,
  Phone, Mail,
} from 'lucide-react';

/* ─── Design tokens — identical to aspirant dashboard ───────────── */
const BG       = '#0D1117';
const BG2      = '#131720';
const BG3      = '#181E2A';
const BG4      = '#1C2338';
const RED      = '#EF4444';
const GOLD     = '#D4A64A';
const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';
const GREEN    = '#22C55E';
const BEBAS    = "'Bebas Neue', sans-serif";
const BARLOW   = "'Barlow Condensed', sans-serif";

/* ─── Sidebar nav — matches dashboard exactly ─── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard' },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications', active: true },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages' },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions' },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended' },
  { icon: Bell,            label: 'Notifications',        href: '/notifications' },
];

const PROFILE_MENU = [
  { label: 'My Profile',     href: '/my-profile' },
  { label: 'Subscription',   href: '/dashboard/subscription' },
  { label: 'Analytics',      href: '/analytics' },
  { label: 'Calendar',       href: '/calendar' },
  { label: 'Settings',       href: '/settings' },
  { label: 'Help & Support', href: '/settings?tab=support' },
  { label: 'Logout',         href: '' },
];

type AppStatus = 'In Review' | 'Shortlisted' | 'Applied' | 'Rejected';
type AppGenre  = 'Feature Film' | 'Short Film' | 'Web Series' | 'Music Video';

const GENRE_CFG: Record<string, { bg: string; color: string }> = {
  'Feature Film': { bg: 'rgba(20,184,166,0.15)',  color: '#2DD4BF' },
  'Short Film':   { bg: 'rgba(148,163,184,0.12)', color: '#94A3B8' },
  'Web Series':   { bg: 'rgba(59,130,246,0.15)',  color: '#60A5FA' },
  'Music Video':  { bg: 'rgba(236,72,153,0.15)',  color: '#F472B6' },
  'Film': { bg: 'rgba(20,184,166,0.15)',  color: '#2DD4BF' },
};

const STATUS_CFG: Record<string, { bg: string; color: string; border: string }> = {
  'In Review':   { bg: 'rgba(59,130,246,0.15)',  color: '#60A5FA', border: 'rgba(59,130,246,0.3)'  },
  'Shortlisted': { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80', border: 'rgba(34,197,94,0.3)'   },
  'Applied':     { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: 'rgba(255,255,255,0.12)' },
  'Rejected':    { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', border: 'rgba(239,68,68,0.3)'   },
};

/* ─── Same dataset as My Applications list ───────────────────── */
const APPLICATIONS: {
  id: number; title: string; genre: AppGenre; role: string;
  agency: string; location: string; appliedDate: string;
  dateTs: number; documents: number; status: AppStatus;
  updatedDate: string; img: string; compensation: string;
  shootDates: string; description: string;
  contactName: string; contactRole: string; contactEmail: string; contactPhone: string;
  ageRange: string; gender: string; language: string; experience: string;
}[] = [
  { id: 1, title: 'City of Dreams', genre: 'Feature Film', role: 'Lead Hero', agency: 'Dharma Productions', location: 'Mumbai', appliedDate: '20 May 2024', dateTs: new Date('2024-05-20').getTime(), documents: 5, status: 'In Review', updatedDate: '21 May 2024, 10:45 AM', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=400&fit=crop', compensation: '₹4,50,000 – ₹6,00,000', shootDates: '15 Jul 2024 – 30 Sep 2024', description: 'A gripping drama following an ambitious young man chasing his dreams in the city of Mumbai. Looking for a lead actor who can portray vulnerability and resilience in equal measure.', contactName: 'Rohan Mehta', contactRole: 'Casting Director', contactEmail: 'rohan.mehta@dharmaproductions.com', contactPhone: '+91 98200 11223', ageRange: '25 – 35 years', gender: 'Male', language: 'Hindi, English', experience: '3+ years preferred' },
  { id: 2, title: 'The Silent Witness', genre: 'Short Film', role: 'Supporting Actor', agency: 'Red Frame Studios', location: 'Mumbai', appliedDate: '18 May 2024', dateTs: new Date('2024-05-18').getTime(), documents: 4, status: 'Shortlisted', updatedDate: '21 May 2024, 02:30 PM', img: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=400&fit=crop', compensation: '₹80,000 – ₹1,20,000', shootDates: '05 Jun 2024 – 15 Jun 2024', description: 'A psychological thriller about a witness to a crime who must decide whether to come forward. Seeking a supporting actor with strong screen presence.', contactName: 'Ananya Kapoor', contactRole: 'Casting Associate', contactEmail: 'ananya@redframestudios.in', contactPhone: '+91 99870 44556', ageRange: '20 – 30 years', gender: 'Any', language: 'Hindi', experience: '1+ years preferred' },
  { id: 3, title: 'Rangbaaz: Dobara', genre: 'Web Series', role: 'Antagonist', agency: 'NextWave Originals', location: 'Mumbai', appliedDate: '15 May 2024', dateTs: new Date('2024-05-15').getTime(), documents: 6, status: 'Applied', updatedDate: '15 May 2024, 04:20 PM', img: 'https://images.unsplash.com/photo-1598387993441-a364f854cfbd?w=600&h=400&fit=crop', compensation: '₹2,00,000 per episode', shootDates: '01 Aug 2024 – 30 Nov 2024', description: 'A gritty crime web series set in the underbelly of Mumbai. Looking for a powerful antagonist to anchor the second season.', contactName: 'Vikram Sehgal', contactRole: 'Casting Director', contactEmail: 'vikram@nextwaveoriginals.com', contactPhone: '+91 98330 77889', ageRange: '35 – 50 years', gender: 'Male', language: 'Hindi', experience: '5+ years required' },
  { id: 4, title: 'Love in Rewind', genre: 'Music Video', role: 'Lead Role', agency: 'Dream Factory', location: 'Delhi', appliedDate: '10 May 2024', dateTs: new Date('2024-05-10').getTime(), documents: 3, status: 'Rejected', updatedDate: '12 May 2024, 11:10 AM', img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=600&h=400&fit=crop', compensation: '₹50,000', shootDates: '25 May 2024 – 27 May 2024', description: 'A romantic music video exploring love and nostalgia through a non-linear narrative. Seeking a lead pair with strong on-screen chemistry.', contactName: 'Priya Nair', contactRole: 'Production Coordinator', contactEmail: 'priya@dreamfactory.in', contactPhone: '+91 98110 22334', ageRange: '22 – 30 years', gender: 'Any', language: 'Hindi, Punjabi', experience: 'Freshers welcome' },
  { id: 5, title: 'Broken Paths', genre: 'Short Film', role: 'Lead Role', agency: 'Indie Frames', location: 'Pune', appliedDate: '05 May 2024', dateTs: new Date('2024-05-05').getTime(), documents: 4, status: 'Applied', updatedDate: '05 May 2024, 09:15 PM', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop', compensation: '₹40,000', shootDates: '10 Jun 2024 – 14 Jun 2024', description: 'An indie drama about a man retracing the broken paths of his past. Looking for a versatile lead actor for a festival-bound short film.', contactName: 'Aditya Rane', contactRole: 'Director', contactEmail: 'aditya@indieframes.co.in', contactPhone: '+91 97650 99887', ageRange: '28 – 40 years', gender: 'Male', language: 'Hindi, Marathi', experience: '2+ years preferred' },
];

const DOCUMENT_TYPES = ['Resume / CV', 'Portfolio Reel', 'Headshots', 'Audition Video', 'ID Proof', 'NOC Letter'];

const TIPS = [
  'Respond quickly if the agency reaches out',
  'Keep your phone reachable for callbacks',
  'Review the casting brief before any callback',
  'Be ready with your availability dates',
];

/* ── Auth helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [app,          setApp]          = useState<typeof APPLICATIONS[0] | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [userName,     setUserName]     = useState('My Account');
  const [avatarUrl,    setAvatarUrl]    = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face');
  const [notifCount,   setNotifCount]   = useState(0);
  const [msgCount,     setMsgCount]     = useState(0);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Load user instantly
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) setUserName(u.name);
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
    } catch {}
  }, []);

  // Fetch application
  useEffect(() => {
    if (!rawId) { setLoading(false); return; }
    const h = getAuthHeaders();
    fetch(`/api/applications/${rawId}`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setLoading(false); return; }
        const a = data.data?.application ?? data.application ?? data;
        const c = a.casting_calls ?? a.casting_call ?? a.castingCall ?? {};
        setApp({
  id:           a.id ?? 0,
  title:        c.title ?? a.title ?? '',
  studio:       c.agency_profiles?.company_name ?? c.agency?.name ?? '',
  agency:       c.agency_profiles?.company_name ?? c.agency?.name ?? '',
  genre:        (c.project_type ?? c.projectType ?? 'Feature Film') as typeof APPLICATIONS[0]['genre'],
  role:         c.role_name ?? c.role ?? '',
  gender:       c.gender_preference ?? c.gender ?? '',
  ageRange:     c.age_min && c.age_max ? `${c.age_min}–${c.age_max}` : '',
  location:     c.location ?? '',
  shootDates:   c.shoot_start && c.shoot_end ? `${new Date(c.shoot_start).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})} - ${new Date(c.shoot_end).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}` : '',
  agencyName:   c.agency_profiles?.company_name ?? '',
  agencyCity:   c.agency_profiles?.city ?? '',
  agencyVerified: c.agency_profiles?.verification_status === 'approved',
  auditionDate: c.audition_start ? new Date(c.audition_start).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}) : '',
  compensation: c.budget_min ? `\u20B9${Number(String(c.budget_min)).toLocaleString('en-IN')}` : c.compensation_details ?? '',
  language:     Array.isArray(c.languages_required) ? c.languages_required.join(', ') : Array.isArray(c.languages) ? c.languages.join(', ') : '',
  skills:       Array.isArray(c.skills_required) ? c.skills_required : Array.isArray(c.skills) ? c.skills : [],
  appliedDate:  a.applied_at ? new Date(a.applied_at).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}) : '',
  updatedDate:  a.reviewed_at ?? a.shortlisted_at ?? '',
  status:       (a.status === 'applied' ? 'Applied' : a.status === 'in_review' ? 'In Review' : a.status === 'shortlisted' ? 'Shortlisted' : a.status === 'rejected' ? 'Rejected' : 'Applied') as typeof APPLICATIONS[0]['status'],
  notes:        a.notes ?? '',
  experience:   c.experience_level ?? '',
  description:  c.role_description ?? '',
  documents:    Array.isArray(a.aspirant_profiles?.aspirant_media) ? a.aspirant_profiles.aspirant_media.length : 0,
  img:          c.coverImage ?? 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=200&fit=crop',
  contactName:  c.contact_name ?? '',
  contactRole:  '',
  auditionAddress: c.audition_details ?? c.contact_name ?? '',
  castingCallId: a.casting_call_id ?? '',
  contactEmail: c.agency_profiles?.contact_email ?? c.contact_email ?? '',
  contactPhone: c.agency_profiles?.contact_phone ?? c.contact_mobile ?? '',
} as unknown as typeof APPLICATIONS[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.notifications ?? data.notifications ?? data;
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.read && !n.isRead).length);
      }).catch(() => {});
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.conversations ?? data.conversations ?? data;
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
      }).catch(() => {});
  }, [rawId]);

  const SB_W = sidebarOpen ? 220 : 52;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontSize: 18 }}>
        Loading...
      </div>
    );
  }

  if (!app) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, color: '#fff', fontFamily: BARLOW, gap: 14 }}>
        <AlertTriangle size={40} color="rgba(255,255,255,0.3)" />
        <div style={{ fontSize: 24, fontWeight: 700 }}>Application not found</div>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)' }}>This application doesn't exist or may have been removed.</p>
        <button onClick={() => router.push('/my-applications')} style={{ background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 17, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={15} /> Back to My Applications
        </button>
      </div>
    );
  }

  const gCfg = GENRE_CFG[app.genre] ?? { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' };
  const sCfg = STATUS_CFG[app.status];

  const timeline = [
    { label: 'Applied', date: `Applied on ${app.appliedDate}`, done: true },
    { label: 'In Review', date: app.status !== 'Applied' ? app.updatedDate : 'Pending', done: app.status !== 'Applied' },
    { label: app.status === 'Rejected' ? 'Rejected' : 'Shortlisted', date: (app.status === 'Shortlisted' || app.status === 'Rejected') ? app.updatedDate : 'Pending', done: app.status === 'Shortlisted' || app.status === 'Rejected' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#fff' }}>

      {/* ══ TOP NAVBAR — identical to dashboard ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ padding: '3px 10px', background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: 1 }}>ASPIRANT</span>
        </div>
        <div style={{ flex: 1 }} />
        <div onClick={() => router.push('/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {msgCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{msgCount}</div>}
        </div>
        <div onClick={() => router.push('/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {notifCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{notifCount}</div>}
        </div>
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(212,166,74,0.38)', flexShrink: 0 }}>
              <img src={avatarUrl} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{userName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Aspirant</div>
            </div>
            <ChevronRight size={12} color="rgba(255,255,255,0.4)" style={{ transform: 'rotate(90deg)' }} />
          </div>
          {dropdownOpen && (
            <>
              <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 210, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label}
                    onClick={() => { if (label === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); } else { router.push(href); setDropdownOpen(false); } }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
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

        {/* SIDEBAR — identical to dashboard ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease', scrollbarWidth: 'none' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>

          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(212,166,74,0.25)', flexShrink: 0 }}>
                <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
                <div style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>Aspirant</div>
              </div>
            </div>
          )}

          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? GOLD_DIM : 'transparent', border: active && sidebarOpen ? `1px solid ${GOLD_BDR}` : '1px solid transparent', borderLeft: sidebarOpen && active ? `3px solid ${GOLD}` : sidebarOpen ? '3px solid transparent' : 'none' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? GOLD_DIM : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0 }}>
                  <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 14, color: active ? GOLD : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && active && <ChevronRight size={12} color={GOLD} opacity={0.6} />}
              </div>
            ))}
          </nav>

          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: `1px solid ${GOLD_BDR}`, padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SCROLLABLE CONTENT — single scroll for both columns ── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex' }}>

          {/* MAIN CONTENT */}
          <div style={{ flex: '0 0 64%', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div onClick={() => router.push('/my-applications')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 17, width: 'fit-content' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              <ArrowLeft size={15} /> Back to My Applications
            </div>

            {/* Header card */}
            <div style={{ display: 'flex', gap: 16, background: BG2, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ width: 220, flexShrink: 0 }}>
                <img src={app.img} alt={app.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ flex: 1, padding: '16px 16px 16px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
                  <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 30, letterSpacing: 1, fontWeight: 400 }}>{app.title}</h1>
                  <button onClick={() => router.push(`/casting-calls/${(app as any).castingCallId}`)} style={{ background: GOLD, color: '#000', border: 'none', borderRadius: 7, padding: '4px 12px', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                    View Casting Call
                  </button>
                  <span style={{ fontSize: 15, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: gCfg.bg, color: gCfg.color }}>{app.genre}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: sCfg.bg, color: sCfg.color, border: `1px solid ${sCfg.border}` }}>{app.status}</span>
                </div>
                <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>{app.role}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, color: 'rgba(255,255,255,0.45)' }}>
                  <Building2 size={13} color="rgba(255,255,255,0.35)" />
                  <span>{app.agency}</span>
                  <span style={{ opacity: 0.4 }}>•</span>
                  <MapPin size={13} color="rgba(255,255,255,0.35)" />
                  <span>{app.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 16, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CalendarDays size={13} color="rgba(255,255,255,0.35)" />
                    <span>Applied on {app.appliedDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <FileText size={13} color="rgba(255,255,255,0.35)" />
                    <span>{app.documents} Documents</span>
                  </div>
                </div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Last updated {app.updatedDate}</div>
              </div>
            </div>

            {/* Casting Call Details */}
            <div style={{ background: BG3, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{app.title}</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{app.agency} &bull; {app.role}</div>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 14 }}>{app.description}</p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(212,166,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IndianRupee size={14} color={GOLD} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Compensation</div>
                    <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{app.compensation}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={14} color="#60A5FA" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Audition Dates</div>
                    <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{app.auditionDate || 'To be announced'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clapperboard size={14} color="#60A5FA" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Shoot Dates</div>
                    <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{app.shootDates || '—'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={14} color="rgba(255,255,255,0.5)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Audition Location</div>
                    <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{(app as any).auditionAddress || (app as any).auditionLocationType || app.location || '—'}</div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: 'rgba(255,255,255,0.8)' }}>Talent Requirements</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 12, columnGap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Users size={14} color="rgba(255,255,255,0.35)" />
                    <div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Age Range</div>
                      <div style={{ fontSize: 16, color: '#fff' }}>{app.ageRange}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <User2 size={14} color="rgba(255,255,255,0.35)" />
                    <div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Gender</div>
                      <div style={{ fontSize: 16, color: '#fff' }}>{app.gender}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Languages size={14} color="rgba(255,255,255,0.35)" />
                    <div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Language</div>
                      <div style={{ fontSize: 16, color: '#fff' }}>{app.language}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BadgeCheck size={14} color="rgba(255,255,255,0.35)" />
                    <div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Experience</div>
                      <div style={{ fontSize: 16, color: '#fff' }}>{app.experience}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div style={{ background: BG3, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>Application Timeline</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                {timeline.map((step, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    {/* Connector line */}
                    {i < timeline.length - 1 && (
                      <div style={{ position: 'absolute', top: 11, left: '50%', width: '100%', height: 2, background: step.done ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.08)', zIndex: 0 }} />
                    )}
                    {/* Circle */}
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                      background: step.done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                      border: `1.5px solid ${step.done ? '#4ADE80' : 'rgba(255,255,255,0.15)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
                    }}>
                      {step.done ? <Check size={12} color="#4ADE80" strokeWidth={3} /> : <Clock size={11} color="rgba(255,255,255,0.3)" />}
                    </div>
                    <div style={{ textAlign: 'center', padding: '0 4px' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: step.done ? '#fff' : 'rgba(255,255,255,0.4)' }}>{step.label}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover Letter */}
            {app.notes && (
              <div style={{ background: BG3, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>Cover Letter</div>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>{app.notes}</p>
              </div>
            )}

            {/* Documents / Media Submitted */}
            <div style={{ background: BG3, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                Profile Media Submitted ({app.documents})
              </div>
              {app.documents === 0 ? (
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '16px 0' }}>
                  No media files in your profile yet. Add them from <span style={{ color: RED, cursor: 'pointer' }} onClick={() => router.push('/settings')}>Settings → Documents & Media</span>.
                </div>
              ) : (
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                  Your profile media ({app.documents} file{app.documents !== 1 ? 's' : ''}) was shared with the agency as part of your application. Manage your media from <span style={{ color: RED, cursor: 'pointer' }} onClick={() => router.push('/settings')}>Settings</span>.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT RAIL */}
          <aside style={{ flex: 1, minWidth: 280, background: BG2, borderLeft: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Agency */}
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Agency</div>
              <div style={{ borderRadius: 10, padding: '14px', background: BG3, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(200,32,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={16} color={RED} />
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>{app.agency}</div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>{app.location}</div>
                  </div>
                </div>
                <button onClick={() => router.push('/messages')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '9px 0', fontSize: 16, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <MessageSquare size={14} /> Message Agency
                </button>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

            {/* Contact Person */}
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Contact Person</div>
              <div style={{ borderRadius: 10, padding: '14px', background: BG3, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(212,166,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User2 size={16} color={GOLD} />
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>{app.contactName}</div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>{app.contactRole}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href={`mailto:${app.contactEmail}`} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>
                    <Mail size={13} color="rgba(255,255,255,0.35)" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.contactEmail}</span>
                  </a>
                  <a href={`tel:${app.contactPhone.replace(/\s+/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>
                    <Phone size={13} color="rgba(255,255,255,0.35)" />
                    <span>{app.contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

            {/* Actions */}
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => router.push('/casting-calls')} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 0', fontSize: 17, fontWeight: 700, fontFamily: BARLOW, color: '#fff', cursor: 'pointer' }}>
                  View Similar Castings
                </button>
                <button
                  onClick={async () => {
                    if (!confirm('Withdraw this application? This action cannot be undone.')) return;
                    try {
                      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
                      const res = await fetch(`/api/applications/${rawId}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${u.token}` },
                      });
                      const data = await res.json();
                      if (res.ok) {
                        alert('Application withdrawn successfully.');
                        router.push('/my-applications');
                      } else {
                        alert(data.error ?? data.message ?? 'Failed to withdraw. Please try again.');
                      }
                    } catch (err) {
                      alert('Network error. Please try again.');
                    }
                  }}
                  style={{ width: '100%', background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', color: '#F87171', borderRadius: 8, padding: '9px 0', fontSize: 16, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}
                >
                  Withdraw Application
                </button>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

            {/* Tips */}
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>While You Wait</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TIPS.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 2, background: 'rgba(200,32,42,0.15)', border: `1px solid ${RED}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={9} color={RED} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

            {/* Need Help */}
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Need Help?</div>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 12 }}>Check our FAQ or connect with our support team.</p>
              <button onClick={() => router.push('/contact')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 17, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Headphones size={15} color="#fff" /> Visit Help Center
              </button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}