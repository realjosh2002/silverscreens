'use client';

import AspirantHeader from '@/components/layout/AspirantHeader'
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'

import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {

  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark, Star, Bell,
  ChevronDown, ChevronRight, ChevronLeft, Menu, User, MapPin, CalendarDays, Check,
  BookmarkPlus, BookmarkCheck, SlidersHorizontal, RotateCcw, AlertCircle,
} from 'lucide-react';

/* ─── Design tokens ──────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";

/* ─── PRD 7-item sidebar ─────────────────────────────────────── */
const SIDEBAR_ITEMS: { icon: any; label: string; href: string; active?: boolean; badge?: number }[] = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard'      },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications'},
  { icon: MessageSquare,   label: 'Messages',             href: '/messages' },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions'      },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended',    active: true },
  { icon: Bell,            label: 'Notifications',        href: '/notifications'},
];

const DROPDOWN_LINKS = ['Subscription', 'Analytics', 'Calendar', 'Settings', 'Support', 'Logout'];

/* ─── Data ───────────────────────────────────────────────────── */
const CAST_TAB_LABELS = ['All', 'Film', 'Web Series', 'TV', 'Ad Films'];

const SORT_OPTIONS = ['Most Relevant', 'Newest First', 'Deadline Soonest', 'Most Applied'];

const TYPE_CFG: Record<string, { bg: string; color: string; border: string }> = {
  'Web Series': { bg: 'rgba(59,130,246,0.12)',  color: '#60A5FA', border: 'rgba(59,130,246,0.25)'  },
  'Film':       { bg: 'rgba(20,184,166,0.12)',  color: '#2DD4BF', border: 'rgba(20,184,166,0.25)'  },
  'TV':         { bg: 'rgba(234,179,8,0.12)',   color: '#FACC15', border: 'rgba(234,179,8,0.25)'   },
  'Ad Films':   { bg: 'rgba(168,85,247,0.12)',  color: '#C084FC', border: 'rgba(168,85,247,0.25)'  },
};

type CastType = 'Web Series' | 'Film' | 'TV' | 'Ad Films';

const CASTINGS: {
  id: number; type: CastType; title: string;
  genres: string[]; language: string;
  company: { name: string; initials: string; verified: boolean; color: string };
  description: string;
  role: string; ageRange: string; location: string; deadline: string;
  img: string;
}[] = [
  {
    id: 1, type: 'Web Series', title: 'Night Caller – Season 1',
    genres: ['Crime', 'Thriller'], language: 'Hindi',
    company: { name: 'Silver Paradise Productions', initials: 'SP', verified: true, color: '#0E2340' },
    description: 'A taut crime thriller series about a detective who hunts a serial offender across the city at night.',
    role: 'Supporting Actor', ageRange: '25 - 35 Yrs', location: 'Mumbai', deadline: '28 May 2025',
    img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=280&h=180&fit=crop',
  },
  {
    id: 2, type: 'Film', title: 'Dil Se Kahin',
    genres: ['Romance', 'Drama'], language: 'Hindi',
    company: { name: 'FrameWorks Entertainment', initials: 'FW', verified: true, color: '#0D2B0D' },
    description: 'A heartfelt journey of two strangers who find love in the most unexpected circumstances.',
    role: 'Female Lead', ageRange: '20 - 28 Yrs', location: 'Delhi', deadline: '25 May 2025',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=280&h=180&fit=crop',
  },
  {
    id: 3, type: 'Film', title: 'Shadow Unit',
    genres: ['Action', 'Drama'], language: 'Hindi',
    company: { name: 'Black Angle Media', initials: 'BA', verified: true, color: '#1A1A2E' },
    description: 'An action drama about an elite undercover team fighting against all odds in hostile terrain.',
    role: 'Supporting Actor', ageRange: '24 - 38 Yrs', location: 'Hyderabad', deadline: '27 May 2025',
    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=280&h=180&fit=crop',
  },
  {
    id: 4, type: 'Web Series', title: 'Maa Ka Aanchal',
    genres: ['Family', 'Drama'], language: 'Hindi',
    company: { name: 'Red Carpet Films', initials: 'RC', verified: true, color: '#2A0A0A' },
    description: 'A touching family drama celebrating the sacred bond between a mother and her child.',
    role: 'Female Lead', ageRange: '22 - 32 Yrs', location: 'Lucknow', deadline: '30 May 2025',
    img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=280&h=180&fit=crop',
  },
];

const WHY_REASONS = [
  'Your profile & skills match the brief',
  'Based on your past applications',
  'Saved preferences & genre interests',
  'Casting team requirements align',
];

const TIPS = [
  'Keep your profile 100% complete',
  'Add recent photos & showreel videos',
  'Update your availability calendar',
  'Apply to more castings to rank higher',
];

const CATEGORIES = ['Film', 'Web Series', 'TV', 'Ad Films', 'Others'];

const DEPARTMENTS_AND_ROLES = [
  { department: 'Acting',            roles: ['Hero', 'Heroine', 'Villain', 'Comedian', 'Character Artist', 'Supporting Roles', 'Child Artist'] },
  { department: 'Direction',         roles: ['Director', 'Assistant Director'] },
  { department: 'Production Office', roles: ['Line Producer', 'Production Assistant', 'Production Manager', 'Asst. Production Manager', 'Unit Manager', 'Production Coordinator', 'First Assistant Director', 'Second Assistant Director'] },
  { department: 'Accounting',        roles: ['Production Accountant'] },
  { department: 'Locations',         roles: ['Location Manager', 'Asst. Location Manager', 'Location Scout', 'Location Assistant', 'Location Production Assistant'] },
  { department: 'Continuity',        roles: ['Script Supervisor'] },
  { department: 'Casting',           roles: ['Casting Director', 'Casting PA'] },
  { department: 'Camera & Lighting', roles: ['Director of Photography', 'Camera Operator', 'First Assistant Camera', 'Second Assistant Camera', 'Film Loader', 'Digital Imaging Technician', 'Motion Control Technician', 'Gaffer', 'Best Boy', 'Lighting Technician'] },
  { department: 'Grip',              roles: ['Key Grip', 'Best Boy', 'Dolly Grip', 'Grips', 'Sound Grip'] },
  { department: 'Sound',             roles: ['Production Sound Mixer', 'Boom Operator', 'Second Assistant Sound'] },
  { department: 'Art',               roles: ['Production Designer', 'Art Director', 'Standby Art Director', 'Assistant Art Director', 'Set Designer', 'Illustrator', 'Graphic Artist'] },
  { department: 'Sets',              roles: ['Set Decorator', 'Buyer', 'Leadman', 'Set Dresser', 'Greensman'] },
  { department: 'Construction',      roles: ['Construction Coordinator', 'Head Carpenter', 'Propmaker'] },
  { department: 'Scenic',            roles: ['Key Scenic', 'Head of Plaster'] },
  { department: 'Property',          roles: ['Propmaster', 'Weapons Master'] },
  { department: 'Costume',           roles: ['Costume Designer', 'Costume Supervisor', 'Key Costumer', 'Costume Standby', 'Breakdown Artist', 'Costume Buyer', 'Cutter'] },
  { department: 'Hair & Make Up',    roles: ['Key Make Up Artist', 'Special Make Up Effects', 'Make Up Supervisor', 'Make Up Artist', 'Key Hair', 'Hair Stylist'] },
  { department: 'Special Effects',   roles: ['Special Effects Supervisor', 'Special Effects Assistant'] },
  { department: 'Stunt',             roles: ['Stunt Master', 'Stunt Coordinator'] },
  { department: 'Post Production',   roles: ['Post Production Supervisor'] },
  { department: 'Editorial',         roles: ['Film Editor', 'Negative Cutter', 'Colorist', 'Telecine Colorist'] },
  { department: 'Visual Effects',    roles: ['Visual Effects Producer', 'VFX Creative Director', 'VFX Supervisor', 'VFX Editor', 'Composer', 'Rotoscope Artist', 'Paint Artist', 'Matte Painter'] },
  { department: 'Sound & Music',     roles: ['Sound Designer', 'Dialogue Editor', 'Sound Editor', 'Re-Recording Mixer', 'Music Supervisor', 'Music Composer / Director', 'Foley Artist', 'Conductor / Orchestrator', 'Sound Recorder / Mixer', 'Music Preparation', 'Music Editor'] },
  { department: 'Animation',         roles: ['Animation Artist'] },
  { department: 'Electrical',        roles: ['Electrician', 'Digital Intermediate Technician'] },
  { department: 'Singing',           roles: ['Singer'] },
  { department: 'Dancing',           roles: ['Dancer'] },
  { department: 'Dubbing',           roles: ['Dubbing Artist'] },
  { department: 'Story',             roles: ['Story Writer'] },
  { department: 'Television',        roles: ['Anchoring', 'Newsreader', 'Talk Show', 'Stage Show', 'Drama', 'Production Crew'] },
  { department: 'Modelling',         roles: ['Model', 'Advertisement'] },
  { department: 'Advertisement',     roles: ['Advertisement'] },
];

/* ─── Rail dropdown ──────────────────────────────────────────── */
function RailDropdown({ label, value, options, open, onToggle, onSelect, containerRef }: {
  label: string; value: string; options: string[];
  open: boolean; onToggle: () => void; onSelect: (v: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
        padding: '8px 12px', cursor: 'pointer', fontSize: 15, fontFamily: BARLOW,
        color: value ? '#fff' : 'rgba(255,255,255,0.4)',
      }}>
        <span>{value || label}</span>
        <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 300, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onSelect(opt === value ? '' : opt); }} style={{
              padding: '9px 14px', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer',
              color: opt === value ? GOLD : 'rgba(255,255,255,0.7)',
              background: opt === value ? 'rgba(212,166,74,0.08)' : 'transparent',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = opt === value ? 'rgba(212,166,74,0.08)' : 'transparent'}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function RecommendedCastingsPage() {
  const router = useRouter()

  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      const ps = u?.profileStatus;
      setIsApproved(ps === 'approved' || ps === 'active');
    } catch {}
  }, []);
  const [authReady,     setAuthReady]     = useState(false);
  const [userName,      setUserName]      = useState('My Account');
  const [avatarUrl,     setAvatarUrl]     = useState('');
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [activeCastTab, setActiveCastTab] = useState(0);
  const [sortLabel,     setSortLabel]     = useState('Most Relevant');
  const [sortOpen,      setSortOpen]      = useState(false);
  const [castings,      setCastings]      = useState<typeof CASTINGS>([]);
  const [loading,       setLoading]       = useState(true);
  const [savedIds,      setSavedIds]      = useState<Set<string>>(new Set());
  const [catFilters,    setCatFilters]    = useState<Set<string>>(new Set());
  const [department,    setDepartment]    = useState('');
  const [role,          setRole]          = useState('');
  const [language,      setLanguage]      = useState('');
  const [location,      setLocation]      = useState('');
  const [ageMin,        setAgeMin]        = useState(18);
  const [ageMax,        setAgeMax]        = useState(60);
  const [deptOpen,      setDeptOpen]      = useState(false);
  const [roleOpen,      setRoleOpen]      = useState(false);
  const [langOpen,      setLangOpen]      = useState(false);
  const [locOpen,       setLocOpen]       = useState(false);

  // Cascading role options based on selected department
  const roleOptions = department
    ? (DEPARTMENTS_AND_ROLES.find(d => d.department === department)?.roles ?? [])
    : DEPARTMENTS_AND_ROLES.flatMap(d => d.roles);
  const deptOptions = DEPARTMENTS_AND_ROLES.map(d => d.department);

  // Dynamic filter options (languages + locations stay as static master lists)
  const [languages,     setLanguages]     = useState<string[]>([]);
  const [locations,     setLocations]     = useState<string[]>([]);

  // Profile strength from API
  const [profilePct,    setProfilePct]    = useState<number | null>(null);

  // ── Profile approval guard ──
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (!u?.loggedIn) { window.location.replace('/login'); return; }
      const ps = u?.profileStatus;
      const approved = ps === 'approved' || ps === 'active';
      // unapproved users can view page (empty) — no redirect
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
      setAuthReady(true); // always show page
    } catch { window.location.replace('/login'); }
  }, []);

  const dropRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const deptRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const locRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) setDeptOpen(false);
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (locRef.current  && !locRef.current.contains(e.target as Node))  setLocOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch recommended castings and saved IDs
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) { setLoading(false); return; }
    const h = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/recommended?limit=50', { headers: h }).then(r => r.ok ? r.json() : null),
      fetch('/api/saved-castings', { headers: h }).then(r => r.ok ? r.json() : null),
    ]).then(([recData, savedData]) => {
      if (recData) {
        const list = recData.data?.castingCalls ?? recData.castingCalls ?? [];
        if (Array.isArray(list) && list.length > 0) {
          const typeMap: Record<string, CastType> = {
            Film: 'Film', Web_Series: 'Web Series', 'Web Series': 'Web Series',
            TV_Series: 'TV', 'TV Series': 'TV', Ad_Film: 'Ad Films', 'Ad Film': 'Ad Films',
          };
          setCastings(list.map((c: any, i: number) => {
            const ag = c.agency_profiles ?? {};
            const deadline = c.last_application_date ? new Date(c.last_application_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
            return {
              id:          c.id ?? i + 1,
              type:        (typeMap[c.project_type] ?? 'Film') as CastType,
              title:       c.title ?? '',
              genres:      Array.isArray(c.skills_required) ? c.skills_required.slice(0, 2) : [],
              language:    Array.isArray(c.languages_required) ? c.languages_required.join(', ') : '',
              company:     { name: ag.company_name ?? '', initials: (ag.company_name ?? 'A').slice(0, 2).toUpperCase(), verified: ag.verification_status === 'approved', color: '#0E2340' },
              description: c.role_description ?? c.eligibility_criteria ?? '',
              role:        c.role_name ?? '',
              ageRange:    c.age_min && c.age_max ? `${c.age_min} - ${c.age_max} Yrs` : '',
              location:    c.location ?? ag.city ?? '',
              deadline,
              img:         'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=280&h=180&fit=crop',
            };
          }));
        }
      }
      if (savedData) {
        const saved = savedData.data?.saved ?? savedData.saved ?? [];
        setSavedIds(new Set(saved.map((s: any) => s.casting_calls?.id ?? s.casting_call_id)));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Static master lists — Indian film industry
  useEffect(() => {
    setLanguages([
      'Hindi', 'English', 'Tamil', 'Telugu', 'Kannada',
      'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi',
      'Odia', 'Assamese', 'Bhojpuri', 'Rajasthani', 'Urdu',
      'Tulu', 'Konkani', 'Maithili', 'Chhattisgarhi', 'Haryanvi',
    ]);
    setLocations([
      'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Bangalore',
      'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
      'Bhopal', 'Chandigarh', 'Kochi', 'Guwahati', 'Bhubaneswar',
      'Patna', 'Indore', 'Nagpur', 'Surat', 'Vadodara',
      'Mysore', 'Coimbatore', 'Vizag', 'Noida', 'Gurugram',
    ]);
  }, []);

  // Profile strength from API
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) { setProfilePct(0); return; }
    const h = { Authorization: `Bearer ${token}` };
    fetch('/api/profile/aspirant', { headers: h })
      .then(r => {
        if (r.status === 404) { setProfilePct(0); return null; }
        return r.ok ? r.json() : null;
      })
      .then(data => {
        if (!data) return;
        const p = data.data?.profile ?? data.profile ?? data;
        setProfilePct(Number(p.profile_completion ?? p.profileCompletion ?? 0));
      })
      .catch(() => { setProfilePct(0); });
  }, []);

  const toggleSave = async (castingId: string) => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;
    const isSaved = savedIds.has(castingId);
    setSavedIds(prev => { const n = new Set(prev); isSaved ? n.delete(castingId) : n.add(castingId); return n; });
    try {
      if (isSaved) {
        await fetch(`/api/saved-castings?casting_call_id=${castingId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      } else {
        await fetch('/api/saved-castings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ casting_call_id: castingId }) });
      }
    } catch {}
  };

  // Live tab counts from actual castings data
  const castTabCounts = useMemo(() => {
    return CAST_TAB_LABELS.map((label, i) => ({
      label,
      count: i === 0 ? castings.length : castings.filter(c => c.type === label).length,
    }))
  }, [castings])

  const visibleCastings = useMemo(() => {
    return castings.filter(c => {
      if (activeCastTab !== 0 && c.type !== CAST_TAB_LABELS[activeCastTab]) return false;
      if (catFilters.size > 0 && !catFilters.has(c.type)) return false;
      if (language && !c.language.split(',').map((l: string) => l.trim()).includes(language)) return false;
      if (location && c.location !== location) return false;
      // Department filter — matches against category field in DB
      if (department) {
        const cd = (c as any).category ?? '';
        if (!cd.toLowerCase().includes(department.toLowerCase())) return false;
      }
      // Role filter — matches against role field in DB
      if (role) {
        const cr = c.role.toLowerCase();
        if (!cr.includes(role.toLowerCase())) return false;
      }
      const ageMatch = c.ageRange.match(/(\d+)\s*-\s*(\d+)/);
      if (ageMatch) {
        const castMin = parseInt(ageMatch[1]);
        const castMax = parseInt(ageMatch[2]);
        if (castMax < ageMin || castMin > ageMax) return false;
      }
      return true;
    });
  }, [activeCastTab, castings, catFilters, language, location, department, role, ageMin, ageMax]);

  function toggleCat(cat: string) {
    setCatFilters(prev => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n; });
  }
  function resetFilters() {
    setCatFilters(new Set()); setDepartment(''); setRole(''); setLanguage(''); setLocation(''); setAgeMin(18); setAgeMax(60);
  }

  const SB_W = sidebarOpen ? 240 : 56;

  if (!authReady) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, color: '#F5F5F5', fontFamily: BARLOW }}>

      {/* ══ HEADER ══ */}
      <AspirantHeader />

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR — now collapsible ── */}
        <aside style={{
          width: SB_W, flexShrink: 0, background: BG2,
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden',
          transition: 'width 0.2s ease',
        }}>
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
                  {sidebarOpen && <span style={{ fontSize: 16, fontFamily: BARLOW, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
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

        {/* ── SHARED SCROLL WRAPPER ── */}
        <div style={{ display: 'flex', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0, padding: '20px 16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Profile incomplete banner */}
      {!isApproved && (
        <div style={{ margin: '16px 24px 0', padding: '14px 20px', background: 'rgba(212,166,74,0.08)', border: '1px solid rgba(212,166,74,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🎬</span>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: 1, color: '#D4A64A' }}>COMPLETE YOUR PROFILE TO UNLOCK THIS SECTION</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Submit your profile, choose a plan, complete payment and get admin approval to access all features.</div>
            </div>
          </div>
          <button onClick={() => router.push('/create-profile')} style={{ padding: '9px 20px', background: '#D4A64A', border: 'none', borderRadius: 7, color: '#050505', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 1, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            CREATE PROFILE →
          </button>
        </div>
      )}

            {/* Page title */}
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1.5, marginBottom: 4, fontWeight: 400, lineHeight: 1 }}>Recommended Castings</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>Personalized casting calls based on your profile, skills and preferences.</p>
            </div>

            {/* Filter tabs + sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {castTabCounts.map((tab, i) => {
                const active = activeCastTab === i;
                return (
                  <button key={i} onClick={() => setActiveCastTab(i)} style={{
                    background: active ? RED : 'rgba(255,255,255,0.06)',
                    border: active ? `1px solid ${RED}` : '1px solid rgba(255,255,255,0.1)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                    borderRadius: 8, padding: '6px 16px', fontSize: 15, fontWeight: active ? 700 : 500,
                    fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: 0.3,
                  }}>
                    {tab.label} <span style={{ fontSize: 14, opacity: active ? 0.85 : 0.5 }}>({tab.count})</span>
                  </button>
                );
              })}
              <div style={{ flex: 1 }} />
              <div ref={sortRef} style={{ position: 'relative' }}>
                <div onClick={() => setSortOpen(v => !v)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                  padding: '6px 14px', cursor: 'pointer', fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.8)',
                }}>
                  <SlidersHorizontal size={13} color="rgba(255,255,255,0.4)" />
                  <span>{sortLabel}</span>
                  <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </div>
                {sortOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 180 }}>
                    {SORT_OPTIONS.map(opt => (
                      <div key={opt} onClick={() => { setSortLabel(opt); setSortOpen(false); }} style={{
                        padding: '9px 14px', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer',
                        color: sortLabel === opt ? RED : 'rgba(255,255,255,0.7)',
                        background: sortLabel === opt ? 'rgba(200,32,42,0.08)' : 'transparent',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = sortLabel === opt ? 'rgba(200,32,42,0.08)' : 'transparent'}
                      >{opt}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Casting cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {visibleCastings.length === 0 ? (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '40px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
                  <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 8 }}>No castings match your filters</div>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 16 }}>Try adjusting or resetting your filters to see more results.</div>
                  <button onClick={resetFilters} style={{ background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '8px 24px', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>Reset Filters</button>
                </div>
              ) : visibleCastings.map(c => {
                const typeCfg = TYPE_CFG[c.type] ?? { bg: 'rgba(255,255,255,0.08)', color: '#ccc', border: 'rgba(255,255,255,0.15)' };
                const isSaved = savedIds.has(String(c.id));
                return (
                  <div key={c.id} style={{
                    background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
                    display: 'flex', overflow: 'hidden', position: 'relative',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: 160, flexShrink: 0, overflow: 'hidden' }}>
                      <img src={c.img} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>

                    {/* Card body — paired rows */}
                    <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>

                      {/* Row 1: type badge + title ......... Role */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ background: typeCfg.bg, color: typeCfg.color, border: `1px solid ${typeCfg.border}`, borderRadius: 20, padding: '2px 10px', fontSize: 14, fontWeight: 600, fontFamily: BARLOW }}>{c.type}</span>
                            {c.genres.map(g => <span key={g} style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>{g}</span>)}
                            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>• {c.language}</span>
                          </div>
                          <div style={{ fontSize: 20, fontFamily: BEBAS, fontWeight: 400, letterSpacing: 0.8, lineHeight: 1.2 }}>{c.title}</div>
                        </div>
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 2 }}>Role</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', fontFamily: BARLOW }}>{c.role}</div>
                        </div>
                      </div>

                      {/* Row 2: company ......... Age range */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 6, background: c.company.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0, fontFamily: BARLOW }}>{c.company.initials}</div>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW }}>{c.company.name}</span>
                          {c.company.verified && (
                            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1D9BF0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Check size={9} strokeWidth={3} color="#fff" />
                            </div>
                          )}
                        </div>
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 2 }}>Age</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', fontFamily: BARLOW }}>{c.ageRange}</div>
                        </div>
                      </div>

                      {/* Row 3: description ......... location */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, lineHeight: 1.5, margin: 0, flex: 1 }}>{c.description}</p>
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 2 }}>Location</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', fontFamily: BARLOW }}>{c.location}</div>
                        </div>
                      </div>

                      {/* Row 4: deadline ......... View Details */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CalendarDays size={13} color="rgba(255,255,255,0.35)" />
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>Deadline: <strong style={{ color: '#fff' }}>{c.deadline}</strong></span>
                        </div>
                        <button onClick={() => router.push(`/casting-calls/${c.id}`)} style={{
                          background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD,
                          borderRadius: 8, padding: '7px 22px', fontSize: 15, fontWeight: 600,
                          fontFamily: BARLOW, cursor: 'pointer', flexShrink: 0,
                          transition: 'background 0.2s, color 0.2s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#000'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = GOLD; }}
                        >View Details</button>
                      </div>
                    </div>

                    {/* Bookmark */}
                    <div style={{ position: 'absolute', top: 12, right: 12, cursor: 'pointer', zIndex: 2 }} onClick={() => toggleSave(String(c.id))}>
                      {isSaved
                        ? <BookmarkCheck size={20} color={GOLD} fill={GOLD} />
                        : <BookmarkPlus size={20} color="rgba(255,255,255,0.4)" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No more */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)', fontSize: 14, fontFamily: BARLOW }}>
              <AlertCircle size={16} />
              <span>No more recommendations right now. Check back later for new casting calls that match your profile.</span>
            </div>
          </div>

          {/* ── RIGHT RAIL ── */}
          <div style={{ width: 296, flexShrink: 0, display: 'flex' }}>
          <div style={{ flex: 1, padding: '20px 16px 20px 4px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Refine Recommendations */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, color: '#fff' }}>Refine Recommendations</span>
                <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              {/* Category */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Category</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {CATEGORIES.map(cat => {
                    const checked = catFilters.has(cat);
                    return (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => toggleCat(cat)}>
                        <div style={{
                          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                          border: checked ? `1.5px solid ${GOLD}` : '1.5px solid rgba(255,255,255,0.2)',
                          background: checked ? GOLD : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                        }}>
                          {checked && <Check size={10} strokeWidth={3} color="#000" />}
                        </div>
                        <span style={{ fontSize: 15, color: checked ? '#fff' : 'rgba(255,255,255,0.6)', fontFamily: BARLOW }}>{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Department */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Department</div>
                <RailDropdown label="Select department" value={department} options={deptOptions}
                  open={deptOpen} onToggle={() => setDeptOpen(v => !v)}
                  onSelect={v => { setDepartment(v); setRole(''); setDeptOpen(false); }}
                  containerRef={deptRef} />
              </div>

              {/* Role — cascades from Department */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Role {department && <span style={{ color: GOLD, fontSize: 12, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({department})</span>}
                </div>
                <RailDropdown
                  label={department ? `Select role in ${department}` : 'Select department first'}
                  value={role} options={roleOptions}
                  open={roleOpen} onToggle={() => { if (roleOptions.length) setRoleOpen(v => !v); }}
                  onSelect={v => { setRole(v); setRoleOpen(false); }} containerRef={roleRef} />
              </div>

              {/* Language */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Language</div>
                <RailDropdown label={languages.length ? 'Select language' : 'Loading...'} value={language} options={languages}
                  open={langOpen} onToggle={() => setLangOpen(v => !v)} onSelect={v => { setLanguage(v); setLangOpen(false); }} containerRef={langRef} />
              </div>

              {/* Location */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Location</div>
                <RailDropdown label={locations.length ? 'Select location' : 'Loading...'} value={location} options={locations}
                  open={locOpen} onToggle={() => setLocOpen(v => !v)} onSelect={v => { setLocation(v); setLocOpen(false); }} containerRef={locRef} />
              </div>

              {/* Age Range */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Age Range</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: GOLD, fontFamily: BARLOW, fontWeight: 600 }}>{ageMin} Yrs</span>
                  <span style={{ fontSize: 14, color: GOLD, fontFamily: BARLOW, fontWeight: 600 }}>{ageMax >= 60 ? '60+ Yrs' : `${ageMax} Yrs`}</span>
                </div>
                <div style={{ position: 'relative', height: 20 }}>
                  <div style={{ position: 'absolute', height: 4, background: BG4, borderRadius: 2, top: 8, left: 0, right: 0 }} />
                  <div style={{ position: 'absolute', height: 4, background: GOLD, borderRadius: 2, top: 8, left: `${((ageMin - 18) / 42) * 100}%`, right: `${100 - ((Math.min(ageMax, 60) - 18) / 42) * 100}%` }} />
                  <input type="range" min={18} max={60} value={ageMin} onChange={e => setAgeMin(Math.min(+e.target.value, ageMax - 1))} style={{ position: 'absolute', width: '100%', top: 0, height: 20, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                  <input type="range" min={18} max={60} value={ageMax} onChange={e => setAgeMax(Math.max(+e.target.value, ageMin + 1))} style={{ position: 'absolute', width: '100%', top: 0, height: 20, opacity: 0, cursor: 'pointer', zIndex: 3 }} />
                  <div style={{ position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: GOLD, border: '2px solid #fff', top: 2, left: `calc(${((ageMin - 18) / 42) * 100}% - 8px)`, boxShadow: '0 2px 8px rgba(0,0,0,0.4)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: GOLD, border: '2px solid #fff', top: 2, left: `calc(${((Math.min(ageMax, 60) - 18) / 42) * 100}% - 8px)`, boxShadow: '0 2px 8px rgba(0,0,0,0.4)', pointerEvents: 'none' }} />
                </div>
              </div>

              <button onClick={() => {}} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '10px 0', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >Apply Filters</button>
            </div>

            {/* Why these recommendations? */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 14, color: '#fff' }}>Why these recommendations?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {WHY_REASONS.map(reason => (
                  <div key={reason} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={10} strokeWidth={3} color={GOLD} />
                    </div>
                    <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', fontFamily: BARLOW, lineHeight: 1.5 }}>{reason}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/profile')} style={{ marginTop: 14, width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', borderRadius: 8, padding: '8px 0', fontSize: 15, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,166,74,0.4)'; e.currentTarget.style.color = GOLD; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
              >Update Preferences</button>
            </div>

            {/* Tips to get more matches */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 14, color: '#fff' }}>Tips to get more matches</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {TIPS.map(tip => (
                  <div key={tip} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(212,166,74,0.15)', border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check size={9} strokeWidth={3} color={GOLD} />
                    </div>
                    <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', fontFamily: BARLOW, lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: BG3, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)' }}
                onClick={() => router.push('/my-profile')}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                <div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 2 }}>View Profile Strength</div>
                  {profilePct === null ? (
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>Loading...</div>
                  ) : profilePct >= 80 ? (
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#4ADE80' }}>Excellent ({profilePct}%)</div>
                  ) : profilePct >= 50 ? (
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: GOLD }}>Good ({profilePct}%)</div>
                  ) : (
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: RED }}>Incomplete ({profilePct}%)</div>
                  )}
                </div>
                <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
              </div>
            </div>

          </div>
          {/* scrollbar spacer */}
          <div style={{ width: 16, flexShrink: 0 }} />
          </div>

        </div>{/* end shared scroll wrapper */}
      </div>
    </div>
  );
}