'use client';

import { useState, useEffect } from 'react';
import ProtectedMedia from '@/components/ui/ProtectedMedia'
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {

  Search, MapPin, Eye, Bookmark, X,
  MessageSquare, Bell, ChevronDown,
  LayoutGrid, List, ChevronLeft, ChevronRight,
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, ChevronRight as NavArrow,
  Menu,
} from 'lucide-react';
import AgencyVerificationBanner from '@/components/layout/AgencyVerificationBanner';

/* ─── Design tokens ───────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

/* ─── Sidebar nav items ───────────────────────────────────────── */
function getIsApproved(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const ps = u?.profileStatus ?? 'pending';
    return ps === 'approved' || ps === 'active';
  } catch { return true; }
}

const NAV_ITEMS: { icon: any; label: string; href: string; active?: boolean; badge?: number }[] = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search', active: true },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',               href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications',           href: '/agency/notifications' },
];

/* ─── Filter / sort options ───────────────────────────────────── */
const DEPARTMENTS_AND_ROLES = [
  { department: 'Acting',           roles: ['Hero', 'Heroine', 'Villain', 'Comedian', 'Character Artist', 'Supporting Roles', 'Child Artist'] },
  { department: 'Direction',        roles: ['Director', 'Assistant Director'] },
  { department: 'Production Office',roles: ['Line Producer', 'Production Assistant', 'Production Manager', 'Asst. Production Manager', 'Unit Manager', 'Production Coordinator', 'First Assistant Director', 'Second Assistant Director'] },
  { department: 'Accounting',       roles: ['Production Accountant'] },
  { department: 'Locations',        roles: ['Location Manager', 'Asst. Location Manager', 'Location Scout', 'Location Assistant', 'Location Production Assistant'] },
  { department: 'Continuity',       roles: ['Script Supervisor'] },
  { department: 'Casting',          roles: ['Casting Director', 'Casting PA'] },
  { department: 'Camera & Lighting',roles: ['Director of Photography', 'Camera Operator', 'First Assistant Camera', 'Second Assistant Camera', 'Film Loader', 'Digital Imaging Technician', 'Motion Control Technician', 'Gaffer', 'Best Boy', 'Lighting Technician'] },
  { department: 'Grip',             roles: ['Key Grip', 'Best Boy', 'Dolly Grip', 'Grips', 'Sound Grip'] },
  { department: 'Sound',            roles: ['Production Sound Mixer', 'Boom Operator', 'Second Assistant Sound'] },
  { department: 'Art',              roles: ['Production Designer', 'Art Director', 'Standby Art Director', 'Assistant Art Director', 'Set Designer', 'Illustrator', 'Graphic Artist'] },
  { department: 'Sets',             roles: ['Set Decorator', 'Buyer', 'Leadman', 'Set Dresser', 'Greensman'] },
  { department: 'Construction',     roles: ['Construction Coordinator', 'Head Carpenter', 'Propmaker'] },
  { department: 'Scenic',           roles: ['Key Scenic', 'Head of Plaster'] },
  { department: 'Property',         roles: ['Propmaster', 'Weapons Master'] },
  { department: 'Costume',          roles: ['Costume Designer', 'Costume Supervisor', 'Key Costumer', 'Costume Standby', 'Breakdown Artist', 'Costume Buyer', 'Cutter'] },
  { department: 'Hair & Make Up',   roles: ['Key Make Up Artist', 'Special Make Up Effects', 'Make Up Supervisor', 'Make Up Artist', 'Key Hair', 'Hair Stylist'] },
  { department: 'Special Effects',  roles: ['Special Effects Supervisor', 'Special Effects Assistant'] },
  { department: 'Stunt',            roles: ['Stunt Master', 'Stunt Coordinator'] },
  { department: 'Post Production',  roles: ['Post Production Supervisor'] },
  { department: 'Editorial',        roles: ['Film Editor', 'Negative Cutter', 'Colorist', 'Telecine Colorist'] },
  { department: 'Visual Effects',   roles: ['Visual Effects Producer', 'VFX Creative Director', 'VFX Supervisor', 'VFX Editor', 'Composer', 'Rotoscope Artist', 'Paint Artist', 'Matte Painter'] },
  { department: 'Sound & Music',    roles: ['Sound Designer', 'Dialogue Editor', 'Sound Editor', 'Re-Recording Mixer', 'Music Supervisor', 'Music Composer / Director', 'Foley Artist', 'Conductor / Orchestrator', 'Sound Recorder / Mixer', 'Music Preparation', 'Music Editor'] },
  { department: 'Animation',        roles: ['Animation Artist'] },
  { department: 'Electrical',       roles: ['Electrician', 'Digital Intermediate Technician'] },
  { department: 'Singing',          roles: ['Singer'] },
  { department: 'Dancing',          roles: ['Dancer'] },
  { department: 'Dubbing',          roles: ['Dubbing Artist'] },
  { department: 'Story',            roles: ['Story Writer'] },
  { department: 'Television',       roles: ['Anchoring', 'Newsreader', 'Talk Show', 'Stage Show', 'Drama', 'Production Crew'] },
  { department: 'Modelling',        roles: ['Model', 'Advertisement'] },
  { department: 'Advertisement',    roles: ['Advertisement'] },
  { department: 'Food',             roles: ['Food Supplier / Caterer'] },
  { department: 'Transport',        roles: ['Cab Service Provider', 'Caravan Service Provider'] },
  { department: 'Travels',          roles: ['Ticketing Agents', 'Hotels'] },
  { department: 'Distributor',      roles: ['Distributors'] },
];
const ALL_DEPARTMENTS = DEPARTMENTS_AND_ROLES.map(d => d.department);
const getRoles = (dept: string) => DEPARTMENTS_AND_ROLES.find(d => d.department === dept)?.roles ?? [];
const SKILL_OPTIONS     = ['Acting', 'Dialogue Delivery', 'Dancing', 'Action', 'Singing', 'Modelling', 'Yoga', 'Fighting', 'Mimicry', 'Horse Riding', 'Direction', 'Photography', 'Videography', 'Editing', 'Choreography', 'Make Up', 'Hair Styling', 'Costume Design', 'Script Writing', 'Voice Over', 'Anchoring', 'News Reading', 'Animation', 'VFX', 'Sound Design', 'Music Composition', 'Stunt', 'Production Management', 'Casting', 'Art Direction', 'Set Design', 'Cinematography', 'Dubbing', 'Influencing', 'Fashion Modelling'];
const LANGUAGE_OPTIONS  = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Marathi', 'Punjabi', 'Bengali', 'Gujarati'];
const SORT_OPTIONS      = ['Most Relevant', 'Highest Rated', 'Most Experienced', 'Newest'];

/* ─── Mock aspirant data ──────────────────────────────────────── */
interface Aspirant {
  id: string; name: string; verified: boolean;
  department: string; role: string;
  gender: 'Male' | 'Female' | 'Other'; age: number; location: string;
  skills: string[]; rating: number; reviews: number; views: string;
  experience: string; languages: string[];
  availability: 'Available Now' | 'Available Soon' | 'Not Available';
  photo: string; photoUrl: string;
}

const MOCK_ASPIRANTS: Aspirant[] = [];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)', 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#fccb90,#d57eeb)', 'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
  'linear-gradient(135deg,#fd7043,#ff8a65)', 'linear-gradient(135deg,#26c6da,#00acc1)',
];

const AVAIL_COLOR: Record<string, string> = {
  'Available Now': GREEN, 'Available Soon': GOLD, 'Not Available': RED,
};

/* ── Auth helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

async function getFreshHeaders(): Promise<Record<string, string>> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const refreshToken = u.refreshToken ?? u.refresh_token ?? '';
    if (refreshToken) {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (res.ok) {
        const d = await res.json();
        const newToken = d?.data?.access_token ?? '';
        if (newToken) {
          const newRefresh = d?.data?.refresh_token ?? refreshToken;
          localStorage.setItem('ss_user', JSON.stringify({ ...u, token: newToken, refreshToken: newRefresh }));
          return { Authorization: `Bearer ${newToken}` };
        }
      }
    }
    if (u.token) return { Authorization: `Bearer ${u.token}` };
  } catch {}
  return {};
}

/* ── Normalise API talent → Aspirant shape ── */
function apiToAspirant(t: any, idx: number): Aspirant {
  const fullName = [t.first_name, t.last_name].filter(Boolean).join(' ') || t.name || 'Unknown';
  const dob = t.date_of_birth ? new Date(t.date_of_birth) : null;
  const age = dob ? Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : (t.age ?? 0);
  const availMap: Record<string, Aspirant['availability']> = {
    'true':  'Available Now',
    'false': 'Not Available',
  };
  return {
    id:           String(t.id ?? t._id ?? idx),
    name:         fullName,
    verified:     t.verification_status === 'approved' || t.verified || t.isVerified || false,
    department:   t.category     ?? t.department   ?? t.departments?.[0] ?? '',
    role:         t.role         ?? t.roles?.[0]?.role ?? '',
    gender:       (t.gender      ?? 'Other') as Aspirant['gender'],
    age,
    location:     [t.city, t.state].filter(Boolean).join(', ') || t.location || '',
    skills:       Array.isArray(t.skills) ? t.skills : [],
    rating:       t.trust_score ? parseFloat((t.trust_score / 20).toFixed(1)) : (t.rating ?? 0),
    reviews:      t.reviews      ?? t.reviewCount   ?? 0,
    views:        t.profile_views ? String(t.profile_views) : (t.views ?? '0'),
    experience:   t.experience_level ?? t.experience ?? t.yearsOfExperience ?? 'Fresher',
    languages:    Array.isArray(t.languages) ? t.languages : [],
    availability: t.is_available === true ? 'Available Now' : t.is_available === false ? 'Not Available' : (availMap[String(t.is_available)] ?? t.availability ?? t.availabilityStatus ?? 'Not Available') as Aspirant['availability'],
    photo:        fullName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase(),
    photoUrl:     t.profile_image_url ?? '',
  };
}

/* ══════════════════════════════════════════════════════════════ */
export default function TalentSearchPage() {
  const router = useRouter();

  /* ui state */
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [viewMode,     setViewMode]     = useState<'list' | 'grid'>(() => { try { const v = localStorage.getItem('agency_default_view'); return v === 'Grid View' ? 'grid' : 'list'; } catch { return 'list'; } });
  const [sortBy,       setSortBy]       = useState('Most Relevant');
  const [sortOpen,     setSortOpen]     = useState(false);

  /* filters */
  const [keyword,           setKeyword]           = useState('');
  const [gender,            setGender]            = useState<'All' | 'Male' | 'Female' | 'Other'>('All');
  const [ageMin,            setAgeMin]            = useState(18);
  const [ageMax,            setAgeMax]            = useState(45);
  const [location,          setLocation]          = useState('');
  const [department,        setDepartment]        = useState('');
  const [role,              setRole]              = useState('');
  const [selectedSkills,    setSelectedSkills]    = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [experience,        setExperience]        = useState<string[]>([]);
  const [availNow,          setAvailNow]          = useState(false);
  const [availSoon,         setAvailSoon]         = useState(false);
  const [skillsOpen,        setSkillsOpen]        = useState(false);
  const [langsOpen,         setLangsOpen]         = useState(false);
  const [page,              setPage]              = useState(1);
  const PER_PAGE = 10;

  /* ── Approval gate — read synchronously before any fetch ── */
  const isApproved = (() => {
    if (typeof window === 'undefined') return true;
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      const ps = u?.profileStatus ?? 'pending';
      return ps === 'approved' || ps === 'active';
    } catch { return true; }
  })();

  /* ── Live data ── */
  const [aspirants,      setAspirants]      = useState<Aspirant[]>([]);
  const [loading,        setLoading]        = useState(false);
  const [searchTrigger,  setSearchTrigger]  = useState(0);
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
  const [shortlisting,   setShortlisting]   = useState<string | null>(null);

  const handleShortlist = async (talentId: string) => {
    if (shortlisting) return;
    setShortlisting(talentId);
    try {
      const h = getAuthHeaders();
      const isShortlisted = shortlistedIds.has(talentId);
      if (isShortlisted) {
        await fetch(`/api/shortlisted?aspirant_id=${talentId}`, { method: 'DELETE', headers: h });
        setShortlistedIds(prev => { const n = new Set(prev); n.delete(talentId); return n; });
      } else {
        const ccId = new URLSearchParams(window.location.search).get('casting_call_id');
        const res = await fetch('/api/shortlisted', {
          method: 'POST',
          headers: { ...h, 'Content-Type': 'application/json' },
          body: JSON.stringify({ aspirant_id: talentId, ...(ccId ? { casting_call_id: ccId } : {}) }),
        });
        if (res.ok || res.status === 409) {
          setShortlistedIds(prev => new Set([...prev, talentId]));
        }
      }
    } catch {}
    finally { setShortlisting(null); }
  };
  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyType,     setAgencyType]     = useState('Production House');
  const [msgCount,       setMsgCount]       = useState(0);
  const [notifCount,     setNotifCount]     = useState(0);

  /* ── Load agency identity from ss_user instantly ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) {
        setAgencyName(u.name);
        setAgencyInitials(u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
      }
    } catch {}
  }, []);

  /* ── Fetch talents + badge counts on mount and on search ── */
  useEffect(() => {
    setLoading(true);
    getFreshHeaders().then(h => {

    // Talents
    const params = new URLSearchParams({ limit: '100' });
    if (keyword)             params.set('keyword',    keyword);
    if (gender !== 'All')    params.set('gender',     gender);
    if (location)            params.set('city',       location);
    if (department)          params.set('category',   department);
    if (selectedLanguages.length) params.set('language', selectedLanguages[0]);
    if (availNow)            params.set('available',  'true');
    if (selectedSkills.length) params.set('skills', selectedSkills.join(','));
    if (ageMin > 18)         params.set('age_min', String(ageMin));
    if (ageMax < 45)         params.set('age_max', String(ageMax));

    if (!isApproved) { setLoading(false); return; }
    if (!getIsApproved()) { setLoading(false); return; }
    fetch(`/api/talents?${params}`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.talents ?? data.data?.talents ?? data.data ?? data;
        if (!Array.isArray(list) || list.length === 0) return;
        setAspirants(list.map((t: any, i: number) => apiToAspirant(t, i)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Agency profile
    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const p = data.data?.profile ?? data.profile ?? data;
        const name = p.company_name ?? p.companyName ?? p.name;
        if (name) {
          setAgencyName(name);
          setAgencyInitials(name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
        }
        if (p.company_type ?? p.companyType) setAgencyType(p.company_type ?? p.companyType);
      })
      .catch(() => {});

    // Notifications count
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const count = data.data?.unread_count ?? data.unread_count;
        if (count != null) { setNotifCount(count); return; }
        const list = data.data?.notifications ?? data.notifications ?? [];
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length);
      }).catch(() => {});

    // Messages count
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.conversations ?? data.conversations ?? [];
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0 || c.unread_count > 0).length);
      }).catch(() => {});

    }); // end getFreshHeaders

  }, [searchTrigger]);

  /* derived list — runs on live aspirants */
  const filtered = aspirants.filter(a => {
    if (keyword && !a.name.toLowerCase().includes(keyword.toLowerCase()) &&
        !a.skills.some(s => s.toLowerCase().includes(keyword.toLowerCase())) &&
        !a.department.toLowerCase().includes(keyword.toLowerCase()) &&
        !a.role.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (gender !== 'All' && a.gender !== gender) return false;
    if (a.age > 0 && (a.age < ageMin || a.age > ageMax)) return false;
    if (department && a.department !== department) return false;
    if (role && a.role !== role) return false;
    if (selectedSkills.length > 0 && !selectedSkills.some(s => a.skills.some(sk => sk.toLowerCase() === s.toLowerCase()))) return false;
    if (selectedLanguages.length > 0 && !selectedLanguages.some(l => a.languages.includes(l))) return false;
    if (availNow && !availSoon && a.availability !== 'Available Now') return false;
    if (!availNow && availSoon && a.availability !== 'Available Soon') return false;
    // Experience filter — range based
    if (experience.length > 0) {
      const yrs = parseFloat(a.experience) || 0;
      const match = experience.some(exp => {
        if (exp === 'Fresher')     return yrs === 0;
        if (exp === '1 - 2 Years') return yrs >= 1 && yrs <= 2;
        if (exp === '2 - 5 Years') return yrs > 2 && yrs <= 5;
        if (exp === '5+ Years')    return yrs > 5;
        return false;
      });
      if (!match) return false;
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  // Apply sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Highest Rated')    return b.rating - a.rating;
    if (sortBy === 'Most Experienced') {
      // experience is like "1 - 2 Years", "5 - 10 Years", "Fresher", "10+ Years"
      const parseExp = (e: string) => { const m = e.match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
      const aYrs = parseExp(a.experience);
      const bYrs = parseExp(b.experience);
      return bYrs - aYrs;
    }
    if (sortBy === 'Newest') return Number(b.id) - Number(a.id);
    return 0; // Most Relevant — keep API order
  });

  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearAll = () => {
    setKeyword(''); setGender('All'); setAgeMin(18); setAgeMax(45); setLocation('');
    setDepartment(''); setRole('');
    setSelectedSkills([]); setSelectedLanguages([]); setExperience([]);
    setAvailNow(true); setAvailSoon(false); setPage(1);
  };
  const toggleSkill    = (s: string) => setSelectedSkills(p    => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const removeLanguage = (l: string) => setSelectedLanguages(p => p.filter(x => x !== l));
  const toggleLanguage = (l: string) => setSelectedLanguages(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);
  const toggleExp      = (e: string) => setExperience(p        => p.includes(e) ? p.filter(x => x !== e) : [...p, e]);

  const pageNums = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3)               return [1, 2, 3, '...', totalPages];
    if (page >= totalPages - 2)  return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', page, '...', totalPages];
  };

  /* sidebar width: 52px collapsed icon-strip, 230px expanded */
  const SB_W = sidebarOpen ? 230 : 52;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══════════ TOPNAV ══════════ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => { if (!getIsApproved()) return; router.push('/agency/create-casting'); }} title={!getIsApproved() ? 'Available after agency verification' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 7, background: getIsApproved() ? RED : 'rgba(200,32,42,0.3)', color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: getIsApproved() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', opacity: getIsApproved() ? 1 : 0.5 }}>
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
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{agencyType}</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 200, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                {(()=>{
                  const isApproved=(()=>{try{const u=JSON.parse(localStorage.getItem('ss_user')||'{}');const ps=u?.profileStatus??'pending';return ps==='approved'||ps==='active';}catch{return true;}})();
                  const menuItems=isApproved
                    ?[{label:'Reports & Analytics',href:'/agency/reports'},{label:'Subscription & Billing',href:'/pricing'},{label:'Company Profile',href:'/agency-profile'},{label:'Documents',href:'/agency/documents'},{label:'Calendar',href:'/agency/calendar'},{label:'Settings',href:'/agency/settings'},{label:'Support',href:'/agency/support'},{label:'Logout',href:'/login'}]
                    :[{label:'Company Profile',href:'/create-company-profile'},{label:'Logout',href:'/login'}];
                  return menuItems.map(({label,href})=>(
                    <div key={label} onClick={()=>{if(label==='Logout'){localStorage.removeItem('ss_user');window.location.replace('/login');}else{router.push(href);setProfileOpen(false);}}} style={{padding:'10px 16px',fontSize:15,cursor:'pointer',color:label==='Logout'?'#ff6b6b':'#F5F5F5',borderTop:label==='Logout'?'1px solid rgba(255,255,255,0.07)':'none'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>{label}</div>
                  ));
                })()}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══════════ BODY ══════════ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── COLLAPSIBLE SIDEBAR ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', transition: 'width 0.2s ease' }}>

          {/* Toggle button row */}
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : '0', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} title={sidebarOpen ? 'Collapse menu' : 'Expand menu'} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 6, color: 'rgba(255,255,255,0.5)', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
            </button>
          </div>

          {/* Agency identity — only shown when expanded */}
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, letterSpacing: 1 }}>{agencyInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, marginTop: 1, cursor: 'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}

          {/* Nav items */}
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
                  {sidebarOpen && <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && label === 'Messages' && msgCount > 0 && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{msgCount}</div>}
                {sidebarOpen && label === 'Notifications' && notifCount > 0 && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{notifCount}</div>}
                {!sidebarOpen && label === 'Messages' && msgCount > 0 && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{msgCount}</div>}
                {!sidebarOpen && label === 'Notifications' && notifCount > 0 && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{notifCount}</div>}
              </div>
                );
              })}
          </nav>

          {/* Upgrade to Pro — only shown when expanded */}
          {sidebarOpen && (
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205 0%,#2a1e0a 100%)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock advanced talent filters, AI matching and unlimited castings.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── MAIN: filter panel + results ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── FILTER PANEL ── */}
          <div style={{ width: 240, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 16px 0' }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: '#fff', fontFamily: BARLOW }}>Filters</span>
                <span onClick={clearAll} style={{ fontSize: 14, color: GOLD, cursor: 'pointer', fontFamily: BARLOW, fontWeight: 600 }}>Clear All</span>
              </div>

              {/* Keywords */}
              <FilterSection label="Keywords">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px' }}>
                  <Search size={13} color="rgba(255,255,255,0.35)" />
                  <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(1); }} placeholder="Search by name, skills, etc." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#F5F5F5', fontFamily: BARLOW, flex: 1, minWidth: 0 }} />
                  {keyword && <X size={12} color="rgba(255,255,255,0.4)" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => { setKeyword(''); setPage(1); }} />}
                </div>
              </FilterSection>

              {/* Gender */}
              <FilterSection label="Gender">
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {(['All', 'Male', 'Female', 'Other'] as const).map(g => (
                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14, color: gender === g ? '#fff' : 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>
                      <div onClick={() => { setGender(g); setPage(1); }} style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${gender === g ? GOLD : 'rgba(255,255,255,0.25)'}`, background: gender === g ? GOLD : 'transparent', cursor: 'pointer', flexShrink: 0 }} />
                      {g}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Age Range */}
              <FilterSection label="Age Range">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <input type="number" value={ageMin} min={18} max={ageMax - 1} onChange={e => setAgeMin(Number(e.target.value))} style={{ width: 60, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 8px', fontSize: 14, color: '#fff', fontFamily: BARLOW, textAlign: 'center', outline: 'none' }} />
                  <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: `${((ageMin - 18) / (60 - 18)) * 100}%`, right: `${100 - ((ageMax - 18) / (60 - 18)) * 100}%`, height: '100%', background: GOLD, borderRadius: 1 }} />
                  </div>
                  <input type="number" value={ageMax} min={ageMin + 1} max={60} onChange={e => setAgeMax(Number(e.target.value))} style={{ width: 60, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 8px', fontSize: 14, color: '#fff', fontFamily: BARLOW, textAlign: 'center', outline: 'none' }} />
                </div>
              </FilterSection>

              {/* Location */}
              <FilterSection label="Location">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px' }}>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Mumbai, Maharashtra, India" style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#F5F5F5', fontFamily: BARLOW, flex: 1, minWidth: 0 }} />
                  <MapPin size={13} color="rgba(255,255,255,0.35)" />
                </div>
              </FilterSection>

              {/* Department */}
              <FilterSection label="Department">
                <select value={department} onChange={e => { setDepartment(e.target.value); setRole(''); setPage(1); }} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: department ? '#F5F5F5' : 'rgba(255,255,255,0.35)', fontFamily: BARLOW, outline: 'none', cursor: 'pointer', appearance: 'none' as const }}>
                  <option value="">-- Select --</option>
                  {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </FilterSection>

              {/* Role */}
              <FilterSection label="Role">
                <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }} disabled={!department} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 14, color: role ? '#F5F5F5' : 'rgba(255,255,255,0.35)', fontFamily: BARLOW, outline: 'none', cursor: department ? 'pointer' : 'not-allowed', appearance: 'none' as const, opacity: department ? 1 : 0.5 }}>
                  <option value="">{department ? '-- Select --' : 'Select department first'}</option>
                  {getRoles(department).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </FilterSection>

              {/* Skills */}
              <FilterSection label="Skills">
                <div style={{ position: 'relative' }}>
                  <div onClick={() => { setSkillsOpen(v => !v); setLangsOpen(false); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 14, color: selectedSkills.length ? '#fff' : 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {selectedSkills.length ? selectedSkills.slice(0, 2).join(', ') + (selectedSkills.length > 2 ? ` +${selectedSkills.length - 2}` : '') : 'Select or type skills'}
                    </span>
                    <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: skillsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0, marginLeft: 4 }} />
                  </div>
                  {skillsOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, zIndex: 50, overflow: 'hidden', marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                      {SKILL_OPTIONS.map(s => (
                        <div key={s} onClick={() => toggleSkill(s)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color: selectedSkills.includes(s) ? GOLD : '#fff' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${selectedSkills.includes(s) ? GOLD : 'rgba(255,255,255,0.3)'}`, background: selectedSkills.includes(s) ? GOLD : 'transparent', flexShrink: 0 }} />
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FilterSection>

              {/* Languages */}
              <FilterSection label="Languages">
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', minHeight: 38, cursor: 'pointer' }} onClick={() => { setLangsOpen(v => !v); setSkillsOpen(false); }}>
                    {selectedLanguages.map(l => (
                      <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: BG4, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '2px 8px', fontSize: 14, fontFamily: BARLOW, color: '#fff' }}>
                        {l}
                        <X size={10} color="rgba(255,255,255,0.5)" style={{ cursor: 'pointer' }} onClick={ev => { ev.stopPropagation(); removeLanguage(l); }} />
                      </span>
                    ))}
                    {selectedLanguages.length === 0 && <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, alignSelf: 'center' }}>Select languages</span>}
                  </div>
                  {langsOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, zIndex: 50, overflow: 'hidden', marginTop: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                      {LANGUAGE_OPTIONS.map(l => (
                        <div key={l} onClick={() => toggleLanguage(l)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color: selectedLanguages.includes(l) ? GOLD : '#fff' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${selectedLanguages.includes(l) ? GOLD : 'rgba(255,255,255,0.3)'}`, background: selectedLanguages.includes(l) ? GOLD : 'transparent', flexShrink: 0 }} />
                          {l}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FilterSection>

              {/* Experience */}
              <FilterSection label="Experience">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                  {['Fresher', '1 - 2 Years', '2 - 5 Years', '5+ Years'].map(e => (
                    <label key={e} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.7)' }}>
                      <div onClick={() => toggleExp(e)} style={{ width: 15, height: 15, borderRadius: 3, border: `1.5px solid ${experience.includes(e) ? GOLD : 'rgba(255,255,255,0.25)'}`, background: experience.includes(e) ? GOLD : 'transparent', cursor: 'pointer', flexShrink: 0 }} />
                      {e}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Availability */}
              <FilterSection label="Availability">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Available Now',  val: availNow,  set: (v: boolean) => setAvailNow(v) },
                    { label: 'Available Soon', val: availSoon, set: (v: boolean) => setAvailSoon(v) },
                  ].map(({ label, val, set }) => (
                    <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.7)' }}>
                      <div onClick={() => { set(!val); setPage(1); }} style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${val ? GOLD : 'rgba(255,255,255,0.25)'}`, background: val ? GOLD : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {val && <div style={{ width: 8, height: 8, borderRadius: 2, background: '#000' }} />}
                      </div>
                      {label}
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>

            {/* Apply Filters button */}
            <div style={{ padding: '14px 16px 20px', marginTop: 'auto' }}>
              <button onClick={() => { setPage(1); setSearchTrigger(v => v + 1); }} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '11px 0', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>
                Apply Filters
              </button>
            </div>
          </div>

          {/* ── RESULTS PANEL ── */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 24px 32px' }} onClick={() => { setSkillsOpen(false); setLangsOpen(false); }}>
          <AgencyVerificationBanner />


            {/* Results header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BARLOW, fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Aspirant Search Results</h1>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>
                  We found <span style={{ color: GOLD, fontWeight: 700 }}>{filtered.length}</span> aspirants matching your search
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                {/* Sort */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>
                  <span>Sort by:</span>
                  <div style={{ position: 'relative' }}>
                    <div onClick={e => { e.stopPropagation(); setSortOpen(v => !v); setSkillsOpen(false); setLangsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 14, color: '#fff', fontFamily: BARLOW, minWidth: 150 }}>
                      {sortBy}
                      <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', marginLeft: 'auto' }} />
                    </div>
                    {sortOpen && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 100, minWidth: 170, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                        {SORT_OPTIONS.map(s => (
                          <div key={s} onClick={e => { e.stopPropagation(); setSortBy(s); setSortOpen(false); }} style={{ padding: '9px 14px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: s === sortBy ? GOLD : '#fff', background: s === sortBy ? 'rgba(212,166,74,0.08)' : 'transparent' }}
                            onMouseEnter={e => { if (s !== sortBy) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={e => { if (s !== sortBy) e.currentTarget.style.background = 'transparent'; }}
                          >{s}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* View toggle */}
                <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => { setViewMode('grid'); try { localStorage.setItem('agency_default_view', 'Grid View'); } catch {} }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: viewMode === 'grid' ? BG3 : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === 'grid' ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: BARLOW, borderRight: '1px solid rgba(255,255,255,0.12)' }}>
                    <LayoutGrid size={14} /> Grid View
                  </button>
                  <button onClick={() => { setViewMode('list'); try { localStorage.setItem('agency_default_view', 'List View'); } catch {} }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: viewMode === 'list' ? BG3 : 'transparent', border: 'none', cursor: 'pointer', color: viewMode === 'list' ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: BARLOW }}>
                    <List size={14} /> List View
                  </button>
                </div>
              </div>
            </div>

            {/* ── LIST VIEW ── */}
            {viewMode === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)', fontSize: 16, fontFamily: BARLOW }}>Searching talents...</div>
                ) : paged.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)', fontSize: 16, fontFamily: BARLOW }}>No aspirants match your filters.</div>
                ) : paged.map((a, idx) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, marginBottom: 8, transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,166,74,0.25)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                  >
                    {/* Photo */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 80, height: 96, borderRadius: 8, background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: BEBAS, letterSpacing: 1, overflow: 'hidden', flexShrink: 0 }}>
                        {a.photoUrl ? <ProtectedMedia type="image" src={a.photoUrl} alt={a.name} width="100%" height="100%" style={{ objectFit: 'cover' }} /> : a.photo}
                      </div>
                      {a.verified && <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.75)', borderRadius: 10, padding: '2px 8px', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: '#60a5fa', whiteSpace: 'nowrap' }}>Verified</div>}
                      <div onClick={async (e) => { e.stopPropagation(); try { const h = getAuthHeaders(); const res = await fetch('/api/saved-talents', { method: 'POST', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({ aspirant_id: t.id }) }); if (res.status === 409) { alert('Already saved.'); return; } if (!res.ok) { alert('Failed to save.'); return; } router.push('/agency/saved-talents'); } catch { alert('Network error.'); } }} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 4, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title="Save to Talent Pool"
                        onMouseEnter={e => (e.currentTarget.style.background = `${GOLD}40`)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
                      >
                        <Bookmark size={11} color={GOLD} />
                      </div>
                    </div>

                    {/* Name + meta */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: BARLOW }}>{a.name}</span>
                        {a.verified && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3b82f6"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        )}
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, marginBottom: 5 }}>
                        {a.department} · {a.role} · {a.gender} · {a.age} Years
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 8 }}>
                        <MapPin size={11} color="rgba(255,255,255,0.35)" /> {a.location}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                        {a.skills.slice(0, 3).map(s => (
                          <span key={s} style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 500, color: 'rgba(255,255,255,0.75)', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '3px 10px' }}>{s}</span>
                        ))}
                        {a.skills.length > 3 && (
                          <span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '3px 10px' }}>+{a.skills.length - 3}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontFamily: BARLOW, color: '#fff' }}>
                          <span style={{ color: GOLD }}>★</span> {a.rating} <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>({a.reviews})</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>
                          <Eye size={13} color="rgba(255,255,255,0.4)" /> {a.views}
                        </span>
                      </div>
                    </div>

                    {/* Right: experience / languages / availability */}
                    <div style={{ flexShrink: 0, minWidth: 170 }}>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Experience</div>
                        <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>{a.experience || 'Fresher'}</div>
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Languages</div>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.7)' }}>{a.languages.join(', ')}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Availability</div>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 600, color: AVAIL_COLOR[a.availability] }}>{a.availability}</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => router.push(`/agency/talent/${a.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: `1px solid ${GOLD}`, borderRadius: 8, padding: '8px 16px', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <Eye size={13} color={GOLD} /> View Profile
                      </button>
                      <button onClick={() => handleShortlist(a.id)} disabled={shortlisting === a.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, background: shortlistedIds.has(a.id) ? `${GOLD}18` : 'none', border: `1px solid ${shortlistedIds.has(a.id) ? GOLD : 'rgba(255,255,255,0.15)'}`, borderRadius: 8, padding: '8px 16px', color: shortlistedIds.has(a.id) ? GOLD : 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: BARLOW, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                        onMouseEnter={e => { if (!shortlistedIds.has(a.id)) { e.currentTarget.style.borderColor = `${GOLD}60`; e.currentTarget.style.color = GOLD; } }}
                        onMouseLeave={e => { if (!shortlistedIds.has(a.id)) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
                      >
                        <Bookmark size={13} fill={shortlistedIds.has(a.id) ? GOLD : 'none'} color={shortlistedIds.has(a.id) ? GOLD : 'currentColor'} />
                        {shortlisting === a.id ? '...' : shortlistedIds.has(a.id) ? 'Shortlisted' : 'Shortlist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── GRID VIEW ── */}
            {viewMode === 'grid' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                {paged.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)', fontSize: 16, fontFamily: BARLOW }}>No aspirants match your filters.</div>
                ) : paged.map((a, idx) => (
                  <div key={a.id} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,166,74,0.25)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '100%', height: 160, background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: '#fff', fontFamily: BEBAS, letterSpacing: 1, overflow: 'hidden' }}>
                        {a.photoUrl ? <ProtectedMedia type="image" src={a.photoUrl} alt={a.name} width="100%" height="100%" style={{ objectFit: 'cover' }} /> : a.photo}
                      </div>
                      {a.verified && <div style={{ position: 'absolute', bottom: 8, left: 10, background: 'rgba(0,0,0,0.7)', borderRadius: 10, padding: '2px 8px', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: '#60a5fa' }}>Verified</div>}
                      <div onClick={() => handleShortlist(a.id)} style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 6, background: shortlistedIds.has(a.id) ? `${GOLD}40` : 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title={shortlistedIds.has(a.id) ? 'Remove from shortlist' : 'Shortlist this talent'}
                        onMouseEnter={e => (e.currentTarget.style.background = `${GOLD}40`)}
                        onMouseLeave={e => (e.currentTarget.style.background = shortlistedIds.has(a.id) ? `${GOLD}40` : 'rgba(0,0,0,0.5)')}
                      >
                        <Bookmark size={13} color={GOLD} fill={shortlistedIds.has(a.id) ? GOLD : 'none'} />
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: BARLOW }}>{a.name}</span>
                        {a.verified && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3b82f6"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 4 }}>{a.department} · {a.role} · {a.gender} · {a.age}y</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 8 }}>
                        <MapPin size={10} /> {a.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 14, fontFamily: BARLOW, color: '#fff' }}><span style={{ color: GOLD }}>★</span> {a.rating} <span style={{ color: 'rgba(255,255,255,0.4)' }}>({a.reviews})</span></span>
                        <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 600, color: AVAIL_COLOR[a.availability] }}>{a.availability}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => router.push(`/agency/talent/${a.id}`)} style={{ flex: 1, background: 'none', border: `1px solid ${GOLD}`, borderRadius: 7, padding: '7px 0', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>
                          View Profile
                        </button>
                        <button onClick={() => handleShortlist(a.id)} disabled={shortlisting === a.id}
                          style={{ width: 34, background: shortlistedIds.has(a.id) ? `${GOLD}18` : 'none', border: `1px solid ${shortlistedIds.has(a.id) ? GOLD : 'rgba(255,255,255,0.15)'}`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                          title={shortlistedIds.has(a.id) ? 'Remove from shortlist' : 'Shortlist'}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = `${GOLD}60`; }}
                          onMouseLeave={e => { if (!shortlistedIds.has(a.id)) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                        >
                          <Bookmark size={13} color={shortlistedIds.has(a.id) ? GOLD : 'rgba(255,255,255,0.6)'} fill={shortlistedIds.has(a.id) ? GOLD : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── PAGINATION ── */}
            {filtered.length > PER_PAGE && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, fontFamily: BARLOW }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                  Showing {(page - 1) * PER_PAGE + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} results
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <PaginationBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={14} /></PaginationBtn>
                  {pageNums().map((n, i) =>
                    n === '...' ? (
                      <span key={`e${i}`} style={{ padding: '0 6px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>…</span>
                    ) : (
                      <PaginationBtn key={n} onClick={() => setPage(n as number)} active={page === n}>{n}</PaginationBtn>
                    )
                  )}
                  <PaginationBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={14} /></PaginationBtn>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function PaginationBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ minWidth: 34, height: 34, borderRadius: 7, border: `1px solid ${active ? GOLD : 'rgba(255,255,255,0.12)'}`, background: active ? GOLD : 'transparent', color: active ? '#000' : disabled ? 'rgba(255,255,255,0.2)' : '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: active ? 700 : 400, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
      {children}
    </button>
  );
}