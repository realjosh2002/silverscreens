'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, MoreVertical, Filter, Search,
  ChevronLeft, ChevronRight, MapPin, Eye, X, Download,
  CheckSquare, Square, FileText, Activity, User, Menu,
} from 'lucide-react';

const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const NAV_PRIMARY = [
  { icon: LayoutDashboard, label: 'Dashboard',              href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',    href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',     href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',          href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', active: true, href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',    href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',    href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',          href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  badge: 12,   href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', badge: 3, href: '/agency/notifications' },
];

const STATUS_COLORS: Record<string, string> = {
  New: BLUE,
  'In Review': GOLD,
  Shortlisted: GREEN,
  Rejected: RED,
};

interface Applicant {
  id: string;
  aspirantProfileId: string;
  aspirantUserId: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  verified: boolean;
  castingCall: string;
  projectType: string;
  roleApplied: string;
  status: 'New' | 'In Review' | 'Shortlisted' | 'Rejected';
  appliedOn: string;
  appliedTime: string;
  height: string;
  bodyType: string;
  img: string;
  source: string;
  ageRange: string;
  applicantGender: string;
  language: string;
  payment: string;
  appLocation: string;
}

async function getFreshAuthHeaders(): Promise<Record<string, string>> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    if (!u.token) return {};
    const payload = JSON.parse(atob(u.token.split('.')[1]));
    const expiresAt = payload.exp * 1000;
    const fiveMin = 5 * 60 * 1000;
    if (Date.now() < expiresAt - fiveMin) {
      return { Authorization: `Bearer ${u.token}` };
    }
    if (!u.refreshToken) return { Authorization: `Bearer ${u.token}` };
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '' },
      body: JSON.stringify({ refresh_token: u.refreshToken }),
    });
    if (!res.ok) return { Authorization: `Bearer ${u.token}` };
    const data = await res.json();
    if (data.access_token) {
      const updated = { ...u, token: data.access_token, refreshToken: data.refresh_token };
      localStorage.setItem('ss_user', JSON.stringify(updated));
      return { Authorization: `Bearer ${data.access_token}` };
    }
    return { Authorization: `Bearer ${u.token}` };
  } catch {
    return {};
  }
}

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

function apiToApplicant(a: any, idx: number): Applicant {
  const talent  = a.aspirant_profiles ?? a.talent ?? a.aspirant ?? a.user ?? {};
  const casting = a.casting_calls     ?? a.castingCall ?? a.casting ?? {};

  const rawDate = a.applied_at ?? a.appliedAt ?? a.createdAt;
  const dateObj = rawDate ? new Date(rawDate) : null;

  const dob = talent.date_of_birth ? new Date(talent.date_of_birth) : null;
  const age = dob
    ? Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : (talent.age ?? a.age ?? 0);

  const fullName = [talent.first_name, talent.last_name].filter(Boolean).join(' ')
    || talent.name || a.name || 'Unknown';

  const bMin = casting.budget_min ?? casting.budgetMin;
  const bMax = casting.budget_max ?? casting.budgetMax;
  const compensation = bMin
    ? (bMin === bMax
        ? `₹${Number(bMin).toLocaleString('en-IN')}`
        : `₹${Number(bMin).toLocaleString('en-IN')} – ₹${Number(bMax).toLocaleString('en-IN')}`)
    : (casting.compensation ?? a.payment ?? '');

  const langs = talent.languages ?? [];
  const language = Array.isArray(langs) ? langs.join(', ') : (langs ?? a.language ?? '');

  const rawStatus = (a.status ?? 'applied').toLowerCase();
  const statusMap: Record<string, Applicant['status']> = {
    applied:     'New',
    new:         'New',
    in_review:   'In Review',
    'in review': 'In Review',
    shortlisted: 'Shortlisted',
    rejected:    'Rejected',
  };
  const status = statusMap[rawStatus] ?? 'New';

  return {
    id:                String(a.id ?? a._id ?? idx),
    aspirantProfileId: String(talent.id ?? a.aspirant_id ?? a.aspirant_profile_id ?? ''),
    aspirantUserId:    String(talent.user_id ?? a.aspirant_user_id ?? ''),
    name:            fullName,
    age,
    gender:          talent.gender ?? a.gender ?? '',
    location:        talent.city   ?? talent.location ?? a.location ?? '',
    verified:        talent.verification_status === 'approved' || talent.verified || talent.isVerified || false,
    castingCall:     (casting.title        ?? a.castingCallTitle ?? '').trim(),
    projectType:     (casting.project_type ?? casting.projectType ?? a.projectType ?? '').trim(),
    roleApplied:     (casting.role_name    ?? casting.role ?? a.roleApplied ?? a.role ?? '').trim(),
    status,
    appliedOn:  dateObj
      ? dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : a.appliedOn ?? '',
    appliedTime: dateObj
      ? dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : a.appliedTime ?? '',
    height:          talent.height_cm ? `${talent.height_cm} cm` : (talent.height ?? a.height ?? ''),
    bodyType:        talent.body_type ?? talent.bodyType ?? a.bodyType ?? '',
    img:             talent.profile_image_url ?? talent.profilePhoto ?? talent.avatarUrl ?? a.img
      ?? 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop',
    source:          a.source ?? 'Direct Application',
    ageRange:        casting.age_min && casting.age_max
      ? `${casting.age_min} – ${casting.age_max} Years`
      : (casting.ageRange ?? a.ageRange ?? ''),
    applicantGender: casting.gender_preference ?? casting.gender ?? a.applicantGender ?? '',
    language,
    payment:         compensation,
    appLocation:     casting.location ?? a.appLocation ?? '',
  };
}

export default function ApplicationsManagementPage() {
  const router = useRouter();
  const [profileOpen,       setProfileOpen]       = useState(false);
  const [sidebarOpen,       setSidebarOpen]       = useState(false);
  const [activeStatFilter,  setActiveStatFilter]  = useState('All');
  const [selectedIds,       setSelectedIds]       = useState<string[]>([]);
  const [searchQuery,       setSearchQuery]       = useState('');
  const [castingCallFilter, setCastingCallFilter] = useState('All Casting Calls');
  const [statusFilter,      setStatusFilter]      = useState('All Statuses');
  const [sortBy,            setSortBy]            = useState('Newest First');
  const [filtersOpen,       setFiltersOpen]       = useState(true);
  const [rowMenuOpen,       setRowMenuOpen]       = useState<string | null>(null);
  const [menuPos,           setMenuPos]           = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const [note,              setNote]              = useState('');

  const [applicants,     setApplicants]     = useState<Applicant[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [castingOptions, setCastingOptions] = useState<string[]>([]);
  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('AGE·········');
  const [agencyType,     setAgencyType]     = useState('Production House');
  const [msgCount,       setMsgCount]       = useState(0);
  const [notifCount,     setNotifCount]     = useState(0);

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
    async function loadData() {
      const h = await getFreshAuthHeaders();

      fetch('/api/applications?limit=100', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const list = data.data?.applications ?? data.applications ?? data.data ?? data;
          if (!Array.isArray(list) || list.length === 0) return;
          setApplicants(list.map((a: any, i: number) => apiToApplicant(a, i)));
        })
        .catch(() => {})
        .finally(() => setLoading(false));

      fetch('/api/profile/agency', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const p = data.data?.profile ?? data.profile ?? data;
          if (p.company_name || p.companyName || p.name) {
            const name = p.company_name ?? p.companyName ?? p.name;
            setAgencyName(name);
            setAgencyInitials(name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
          }
          if (p.profile_number ?? p.profileNumber) setAgencyId(p.profile_number ?? p.profileNumber);
          if (p.company_type  ?? p.companyType)    setAgencyType(p.company_type ?? p.companyType);
        })
        .catch(() => {});

      fetch('/api/casting-calls?limit=100', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const list = data.data?.casting_calls ?? data.castingCalls ?? data.data ?? data;
          if (!Array.isArray(list)) return;
          setCastingOptions(list.map((c: any) => c.title ?? c.name ?? '').filter(Boolean));
        })
        .catch(() => {});

      fetch('/api/notifications', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const count = data.data?.unread_count ?? data.unread_count;
          if (count != null) { setNotifCount(count); return; }
          const list = data.data?.notifications ?? data.notifications ?? [];
          if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read && !n.read).length);
        }).catch(() => {});

      fetch('/api/messages/conversations', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const list = data.data?.conversations ?? data.conversations ?? [];
          if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
        }).catch(() => {});
    }
    loadData();
  }, []);

  const updateAppStatus = async (id: string, status: Applicant['status']) => {
    const h = await getFreshAuthHeaders();
    const statusMap: Record<string, string> = {
      'New':         'applied',
      'In Review':   'in_review',
      'Shortlisted': 'shortlisted',
      'Rejected':    'rejected',
    };
    const dbStatus = statusMap[status] ?? status;
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...h },
        body: JSON.stringify({ status: dbStatus }),
      });
      if (!res.ok) {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: a.status } : a));
      }
    } catch {}
  };

  const liveStats = useMemo(() => [
    { key: 'All',         label: 'Total Applications', value: applicants.length,                                    color: '#fff', icon: ClipboardList },
    { key: 'New',         label: 'New',                value: applicants.filter(a => a.status === 'New').length,         color: BLUE,  icon: FileText      },
    { key: 'In Review',   label: 'In Review',          value: applicants.filter(a => a.status === 'In Review').length,   color: GOLD,  icon: Activity      },
    { key: 'Shortlisted', label: 'Shortlisted',        value: applicants.filter(a => a.status === 'Shortlisted').length, color: GREEN, icon: Star          },
    { key: 'Rejected',    label: 'Rejected',           value: applicants.filter(a => a.status === 'Rejected').length,    color: RED,   icon: X             },
  ], [applicants]);

  const castingCallOptions = useMemo(() => {
    const fromApplicants = Array.from(new Set(applicants.map(a => a.castingCall).filter(Boolean)));
    const merged = Array.from(new Set([...fromApplicants, ...castingOptions]));
    return ['All Casting Calls', ...merged];
  }, [applicants, castingOptions]);

  const filteredApplicants = applicants.filter(a => {
    if (activeStatFilter !== 'All' && a.status !== activeStatFilter) return false;
    if (statusFilter !== 'All Statuses' && a.status !== statusFilter) return false;
    if (castingCallFilter !== 'All Casting Calls' && a.castingCall.trim().toLowerCase() !== castingCallFilter.trim().toLowerCase()) return false;
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === filteredApplicants.length ? [] : filteredApplicants.map(a => a.id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #1a1410, #2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{agencyType}</div>
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
                ].map(({ label: item, href: dHref }) => (
                  <div key={item} onClick={() => {
                    if (item === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); }
                    else { router.push(dHref); setProfileOpen(false); }
                  }} style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: item === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: item === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{item}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: sidebarOpen ? 230 : 52, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', transition: 'width 0.2s ease' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, marginTop: 1, cursor: 'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_PRIMARY.map(({ icon: Icon, label, active, badge, href }) => (
              <div key={label} onClick={() => href && router.push(href)} title={!sidebarOpen ? label : undefined}
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
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205 0%,#2a1e0a 100%)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock advanced talent filters, AI matching and unlimited castings.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, marginBottom: 4, fontWeight: 400 }}>Application Management</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Manage and review applications for your casting calls.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button onClick={() => {
                const headers = ['Name', 'Age', 'Gender', 'Location', 'Casting Call', 'Role Applied', 'Status', 'Applied On'];
                const rows = filteredApplicants.map(a => [a.name, a.age, a.gender, a.location, a.castingCall, a.roleApplied, a.status, `${a.appliedOn} ${a.appliedTime}`]);
                const csv = [headers, ...rows].map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'applications.csv'; a.click();
                URL.revokeObjectURL(url);
              }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '0 16px', height: 42, color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>
                <Download size={14} /> Export
              </button>
              <button onClick={() => router.push('/agency/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, border: 'none', borderRadius: 8, padding: '0 18px', height: 42, color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                View Casting Calls
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {liveStats.map(s => {
              const Icon = s.icon;
              const active = activeStatFilter === s.key;
              return (
                <div key={s.key} onClick={() => setActiveStatFilter(s.key)} style={{ flex: 1, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', background: active ? `${s.color}14` : BG2, border: `1px solid ${active ? s.color + '55' : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: `${s.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={17} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: BEBAS, letterSpacing: 0.5, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, marginTop: 2 }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main split */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>

            {/* Filters */}
            <div style={{ width: 220, flexShrink: 0, background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Filters</span>
                <span onClick={() => { setCastingCallFilter('All Casting Calls'); setStatusFilter('All Statuses'); setActiveStatFilter('All'); setSearchQuery(''); }} style={{ fontSize: 14, fontFamily: BARLOW, color: RED, fontWeight: 600, cursor: 'pointer' }}>Clear All</span>
              </div>
              <FilterLabel>Casting Call</FilterLabel>
              <FilterSelect value={castingCallFilter} onChange={setCastingCallFilter} options={castingCallOptions} />
              <FilterLabel>Status</FilterLabel>
              <FilterSelect value={statusFilter} onChange={setStatusFilter} options={['All Statuses', 'New', 'In Review', 'Shortlisted', 'Rejected']} />
              <FilterLabel>Search by Name</FilterLabel>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <Search size={13} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Applicant name..." style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '8px 10px 8px 30px', color: '#fff', fontSize: 14, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              <button style={{ width: '100%', background: 'none', border: '1px solid rgba(200,32,42,0.4)', borderRadius: 8, padding: '10px 0', color: RED, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>Apply Filters</button>
            </div>

            {/* Table */}
            <div style={{ flex: 1, minWidth: 0, background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>

              {/* Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span onClick={toggleSelectAll} style={{ cursor: 'pointer', display: 'flex' }}>
                    {selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0 ? <CheckSquare size={16} color={RED} /> : <Square size={16} color="rgba(255,255,255,0.4)" />}
                  </span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>{selectedIds.length > 0 ? `${selectedIds.length} selected` : `Viewing: All Casting Calls (${filteredApplicants.length})`}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Sort by:</span>
                  <FilterSelect value={sortBy} onChange={setSortBy} options={['Newest First', 'Oldest First', 'Name A–Z']} compact />
                </div>
              </div>

              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '0.3fr 1.6fr 1.6fr 1fr 1fr 1fr 0.5fr', padding: '11px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: BG3 }}>
                {['', 'Applicant', 'Casting Call', 'Role Applied', 'Status', 'Applied On', 'Actions'].map((h, i) => (
                  <span key={i} style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform: 'uppercase' as const, textAlign: i === 6 ? 'center' as const : 'left' as const }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              <div style={{ maxHeight: 560, overflowY: 'auto' as const }}>
                {loading ? (
                  <div style={{ padding: '50px 20px', textAlign: 'center' as const }}>
                    <div style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>Loading applications…</div>
                  </div>
                ) : filteredApplicants.length === 0 ? (
                  <div style={{ padding: '50px 20px', textAlign: 'center' as const }}>
                    <UserSearch size={28} color="rgba(255,255,255,0.15)" style={{ marginBottom: 10 }} />
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
                      {castingCallFilter !== 'All Casting Calls' || statusFilter !== 'All Statuses' || searchQuery
                        ? 'No applications match the current filters'
                        : 'No applications found'}
                    </div>
                  </div>
                ) : filteredApplicants.map((a, idx) => {
                  const checked = selectedIds.includes(a.id);
                  return (
                    <div key={a.id} onClick={() => router.push(`/agency/applications/${a.id}`)} style={{ display: 'grid', gridTemplateColumns: '0.3fr 1.6fr 1.6fr 1fr 1fr 1fr 0.5fr', alignItems: 'center', padding: '12px 18px', cursor: 'pointer', background: 'transparent', borderBottom: idx < filteredApplicants.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      <span onClick={e => { e.stopPropagation(); toggleSelect(a.id); }} style={{ cursor: 'pointer', display: 'flex' }}>
                        {checked ? <CheckSquare size={15} color={RED} /> : <Square size={15} color="rgba(255,255,255,0.35)" />}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <img src={a.img} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                            {a.name} {a.verified && <span style={{ color: BLUE, fontSize: 14 }}>✓</span>}
                          </div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{a.age} Years • {a.gender} • {a.location}</div>
                        </div>
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.castingCall}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{a.projectType}</div>
                      </div>

                      <span style={{ fontSize: 14, color: '#fff', fontFamily: BARLOW }}>{a.roleApplied}</span>

                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: STATUS_COLORS[a.status], background: `${STATUS_COLORS[a.status]}18`, border: `1px solid ${STATUS_COLORS[a.status]}55`, borderRadius: 14, padding: '3px 10px', width: 'fit-content' }}>{a.status}</span>

                      <div>
                        <div style={{ fontSize: 14, color: '#fff' }}>{a.appliedOn}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>{a.appliedTime}</div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <Eye size={15} color="rgba(255,255,255,0.4)" style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); router.push(`/agency/applications/${a.id}`); }} />
                        <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                          <div onClick={e => {
                            if (rowMenuOpen === a.id) { setRowMenuOpen(null); return; }
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                            setRowMenuOpen(a.id);
                          }}
                            style={{ cursor: 'pointer', width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: rowMenuOpen === a.id ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = rowMenuOpen === a.id ? 'rgba(255,255,255,0.1)' : 'transparent')}
                          >
                            <MoreVertical size={15} color="rgba(255,255,255,0.5)" />
                          </div>
                          {rowMenuOpen === a.id && (
                            <>
                              <div onClick={() => setRowMenuOpen(null)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
                              <div style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, width: 200, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 12px 32px rgba(0,0,0,0.7)' }}>
                                <RowMenuItem icon={<Eye size={13} />}          label="View Application"  onClick={() => { router.push(`/agency/applications/${a.id}`); setRowMenuOpen(null); }} />
                                <RowMenuItem icon={<User size={13} />}         label="View Full Profile" onClick={() => { router.push(`/agency/talent/${a.aspirantProfileId || a.id}`); setRowMenuOpen(null); }} />
                                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '3px 0' }} />
                                <RowMenuItem icon={<Activity size={13} />}    label="Move to In Review"  color={GOLD}  onClick={() => { updateAppStatus(a.id, 'In Review');   setRowMenuOpen(null); }} />
                                <RowMenuItem icon={<Star size={13} />}        label="Shortlist"          color={GREEN} onClick={() => { updateAppStatus(a.id, 'Shortlisted'); setRowMenuOpen(null); }} />
                                <RowMenuItem icon={<CalendarCheck size={13} />} label="Schedule Audition" color={BLUE}  onClick={() => { router.push(`/agency/auditions/schedule?applicationId=${a.id}`); setRowMenuOpen(null); }} />
                                <RowMenuItem icon={<MessageSquare size={13} />} label="Send Message"      color={BLUE}  onClick={() => {
                                  const params = new URLSearchParams({
                                    recipient_id:   a.aspirantUserId || a.aspirantProfileId,
                                    recipient_name: a.name,
                                  });
                                  router.push(`/agency/messages?${params.toString()}`);
                                  setRowMenuOpen(null);
                                }} />
                                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '3px 0' }} />
                                <RowMenuItem icon={<X size={13} />}           label="Reject Application" color={RED}   onClick={() => { updateAppStatus(a.id, 'Rejected');    setRowMenuOpen(null); }} />
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Showing 1 to {filteredApplicants.length} of {applicants.length} results</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <button style={{ width: 28, height: 28, borderRadius: 6, background: BG3, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronLeft size={13} color="#fff" /></button>
                  {[1, 2, 3, 4].map(p => (
                    <button key={p} style={{ width: 28, height: 28, borderRadius: 6, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', background: p === 1 ? RED : BG3, color: '#fff', border: `1px solid ${p === 1 ? RED : 'rgba(255,255,255,0.1)'}` }}>{p}</button>
                  ))}
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>...</span>
                  <button style={{ width: 28, height: 28, borderRadius: 6, background: BG3, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChevronRight size={13} color="#fff" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, textTransform: 'uppercase' as const, marginBottom: 6, marginTop: 14 }}>{children}</div>;
}

function FilterSelect({ value, onChange, options, compact }: { value: string; onChange: (v: string) => void; options: string[]; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: compact ? 0 : 4 }}>
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />}
      <div onClick={() => setOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: compact ? '6px 10px' : '9px 12px', fontSize: 14, fontFamily: BARLOW, color: '#fff', minWidth: compact ? 130 : undefined, position: 'relative', zIndex: 91 }}>
        <span style={{ whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0, marginLeft: 6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: BG4, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, maxHeight: 220, overflowY: 'auto' as const, boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{ padding: '8px 12px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: opt === value ? GOLD : '#fff', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function RowMenuItem({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color?: string; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', cursor: 'pointer', fontSize: 14, fontFamily: "'Barlow Condensed', sans-serif", color: color || '#F5F5F5', transition: 'background 0.1s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ opacity: 0.75, display: 'flex' }}>{icon}</span>
      {label}
    </div>
  );
}