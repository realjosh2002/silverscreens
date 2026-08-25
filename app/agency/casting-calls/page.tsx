'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {

  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, ChevronRight, Menu,
  MoreVertical, Filter, Search, MapPin,
} from 'lucide-react';
import AgencyVerificationBanner from '@/components/layout/AgencyVerificationBanner';

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

function getIsApproved(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const ps = u?.profileStatus ?? 'pending';
    return ps === 'approved' || ps === 'active';
  } catch { return true; }
}

const NAV_PRIMARY: { icon: any; label: string; href: string; active?: boolean; badge?: number }[] = [
  { icon: LayoutDashboard, label: 'Dashboard',              href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',    href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',     href: '/agency/casting-calls', active: true },
  { icon: UserSearch,      label: 'Talent Search',          href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management',href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',    href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',    href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',          href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', href: '/agency/notifications' },
];

const STATUS_TABS = [
  { key: 'All' }, { key: 'Draft' }, { key: 'Open' },
  { key: 'Shortlisting' }, { key: 'Auditioning' }, { key: 'Closed' },
];

const STATUS_COLORS: Record<string, string> = {
  Open: GREEN, Shortlisting: BLUE, Auditioning: GOLD,
  Draft: 'rgba(255,255,255,0.45)', Closed: RED,
};

interface CastingCallRow {
  id: string; title: string; roleType: string; gender: string;
  location: string; project: string; projectType: string;
  productionHouse: string; productionInitials: string; productionColor: string;
  typeTag: string; totalSubmissions: number; shortlisted: number;
  status: 'Open' | 'Shortlisting' | 'Auditioning' | 'Draft' | 'Closed';
  createdOn: string; createdTime: string; img: string;
}

const CASTING_CALLS: CastingCallRow[] = [
  { id: '1', title: 'City of Dreams – Season 2',     roleType: 'Lead Role',       gender: 'Male',   location: 'Mumbai, India',    project: 'City of Dreams – S2',  projectType: 'Web Series',   productionHouse: 'Silver Paradise Productions', productionInitials: 'SP', productionColor: GOLD,                   typeTag: 'Lead Role',       totalSubmissions: 458, shortlisted: 120, status: 'Open',         createdOn: '20 May 2025', createdTime: '10:30 AM', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=80&h=80&fit=crop' },
  { id: '2', title: 'The Echoes – Feature Film',      roleType: 'Supporting Role', gender: 'Female', location: 'Mumbai, India',    project: 'The Echoes',           projectType: 'Feature Film', productionHouse: 'FrameWorks Entertainment',    productionInitials: 'FW', productionColor: BLUE,                   typeTag: 'Supporting Role', totalSubmissions: 312, shortlisted: 72,  status: 'Shortlisting', createdOn: '18 May 2025', createdTime: '04:15 PM', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=80&h=80&fit=crop' },
  { id: '3', title: 'Dil Ke Safar – Web Series',      roleType: 'Lead Role',       gender: 'Female', location: 'Delhi, India',     project: 'Dil Ke Safar',         projectType: 'Web Series',   productionHouse: 'Silver Paradise Productions', productionInitials: 'SP', productionColor: GOLD,                   typeTag: 'Lead Role',       totalSubmissions: 267, shortlisted: 58,  status: 'Auditioning',  createdOn: '15 May 2025', createdTime: '11:00 AM', img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=80&h=80&fit=crop' },
  { id: '4', title: 'Fresh Start – Beverage Ad',      roleType: 'Lead Role',       gender: 'Female', location: 'Mumbai, India',    project: 'Fresh Start',          projectType: 'Commercial',   productionHouse: 'Bright Angle Media',          productionInitials: 'BA', productionColor: GREEN,                  typeTag: 'Lead Role',       totalSubmissions: 198, shortlisted: 40,  status: 'Open',         createdOn: '12 May 2025', createdTime: '09:30 AM', img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=80&h=80&fit=crop' },
  { id: '5', title: 'Shadow Unit – TV Series',        roleType: 'Supporting Role', gender: 'Male',   location: 'Hyderabad, India', project: 'Shadow Unit',          projectType: 'TV Series',    productionHouse: 'Black Owl Films',             productionInitials: 'OW', productionColor: 'rgba(255,255,255,0.5)', typeTag: 'Supporting Role', totalSubmissions: 143, shortlisted: 30,  status: 'Open',         createdOn: '09 May 2025', createdTime: '02:20 PM', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=80&h=80&fit=crop' },
  { id: '6', title: 'Rhythm Nation – Dance Show',     roleType: 'Other Role',      gender: 'Group',  location: 'Bengaluru, India', project: 'Rhythm Nation',        projectType: 'Reality Show', productionHouse: 'NextGen Entertainment',        productionInitials: 'NG', productionColor: RED,                    typeTag: 'Other Role',      totalSubmissions: 89,  shortlisted: 18,  status: 'Auditioning',  createdOn: '05 May 2025', createdTime: '05:45 PM', img: 'https://images.unsplash.com/photo-1598387993441-a364f854cfbd?w=80&h=80&fit=crop' },
  { id: '7', title: 'Break Point – Short Film',       roleType: 'Lead Role',       gender: 'Male',   location: 'Pune, India',      project: 'Break Point',          projectType: 'Short Film',   productionHouse: 'Indie Frame',                 productionInitials: 'IF', productionColor: BLUE,                   typeTag: 'Lead Role',       totalSubmissions: 61,  shortlisted: 12,  status: 'Draft',        createdOn: '03 May 2025', createdTime: '01:15 PM', img: 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=80&h=80&fit=crop' },
  { id: '8', title: 'Urban Threads – Print Shoot',    roleType: 'Other Role',      gender: 'Male',   location: 'Mumbai, India',    project: 'Urban Threads',        projectType: 'Print Shoot',  productionHouse: 'Style Tribe',                 productionInitials: 'ST', productionColor: GOLD,                   typeTag: 'Other Role',      totalSubmissions: 37,  shortlisted: 8,   status: 'Draft',        createdOn: '01 May 2025', createdTime: '10:00 AM', img: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=80&h=80&fit=crop' },
];

/* ── Auth helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

/* ── Normalise API casting call → CastingCallRow ── */
function apiToRow(c: any, agencyName: string, agencyInitials: string): CastingCallRow {
  const createdAt = c.created_at ? new Date(c.created_at) : c.createdAt ? new Date(c.createdAt) : null;
  return {
    id:                  String(c.id ?? c._id ?? ''),
    title:               c.title        ?? c.name ?? 'Untitled',
    roleType: c.role_name ?? c.roleType ?? c.role ?? 'Role not set',
    gender:              c.gender_preference ?? c.gender ?? 'Any',
    location:            c.shootLocation ?? c.location ?? c.city ?? 'Location not set',
    project:             c.projectTitle  ?? c.projectName ?? c.title ?? 'Untitled',
    projectType: c.project_type ?? c.projectType ?? c.type ?? '',
    productionHouse:     agencyName,
    productionInitials:  agencyInitials,
    productionColor:     GOLD,
    typeTag:             c.roleType     ?? c.role ?? 'Role',
    totalSubmissions:    c._count?.applications ?? c.applicationCount ?? c.applications_count ?? c.totalSubmissions ?? 0,
    shortlisted:         c.shortlistedCount ?? c.shortlisted ?? 0,
    status: (c.status === 'active' ? 'Open' : c.status === 'draft' ? 'Draft' : c.status === 'closed' ? 'Closed' : c.status ?? 'Open') as CastingCallRow['status'],
    createdOn:  createdAt ? createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : c.createdOn ?? '',
    createdTime:createdAt ? createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : c.createdTime ?? '',
    img:                 c.coverImage   ?? c.img ?? 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=80&h=80&fit=crop',
  };
}

export default function AgencyCastingCallsListPage() {
  const router = useRouter();

  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [isApproved,     setIsApproved]     = useState(true);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [activeTab,      setActiveTab]      = useState('All');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [menuPos,        setMenuPos]        = useState<{top:number;right:number}>({top:0,right:0});
  const [currentPage,    setCurrentPage]    = useState(1);

  /* ── Agency identity ── */
  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('AGE·········');
  const [agencyType,     setAgencyType]     = useState('Production House');

  /* ── Live data ── */
  const [allRows,    setAllRows]    = useState<CastingCallRow[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [msgCount,   setMsgCount]   = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  /* ── Load agency identity from ss_user instantly ── */
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

  /* ── Fetch casting calls + badge counts ── */
  useEffect(() => {
    const h = getAuthHeaders();

    // 1. Agency's own casting calls
    fetch('/api/casting-calls?limit=100', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.casting_calls ?? data.castingCalls ?? data.data ?? data;
        if (!Array.isArray(list)) return;
        // Use agency name from ss_user (already in state by now)
        const name = agencyName;
        const initials = agencyInitials;
        setAllRows(list.map((c: any) => apiToRow(c, name, initials)));
      })
      .catch(() => {}) // keep CASTING_CALLS fallback
      .finally(() => setLoading(false));

    // 2. Agency profile (for companyType)
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
        if (p.company_type   ?? p.companyType)   setAgencyType(p.company_type ?? p.companyType);
      })
      .catch(() => {});

    // 3. Notifications count
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.notifications ?? data;
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length);
      })
      .catch(() => {});

    // 4. Messages count
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.conversations ?? data;
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── updateStatus — wired to PATCH /api/casting-calls/:id ── */
  const updateStatus = async (id: string, status: CastingCallRow['status']) => {
    const h = getAuthHeaders();
    try {
      const res = await fetch(`/api/casting-calls/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...h },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Optimistically update local state
        setAllRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch {} // silent fail — row stays unchanged
  };

  const TOTAL_PAGES = Math.max(1, Math.ceil(allRows.length / 10));

  const SB_W = sidebarOpen ? 230 : 52;

  const liveTabCounts: Record<string, number> = {
    All:          allRows.length,
    Draft:        allRows.filter(c => c.status === 'Draft').length,
    Open:         allRows.filter(c => c.status === 'Open').length,
    Shortlisting: allRows.filter(c => c.status === 'Shortlisting').length,
    Auditioning:  allRows.filter(c => c.status === 'Auditioning').length,
    Closed:       allRows.filter(c => c.status === 'Closed').length,
  };

  const filteredCalls = allRows.filter(c => {
    if (activeTab !== 'All' && c.status !== activeTab) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setOpenActionMenu(openActionMenu === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => { if (!getIsApproved()) return; router.push('/agency/create-casting'); }} title={!getIsApproved() ? 'Available after agency verification' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 7, background: getIsApproved() ? RED : 'rgba(200,32,42,0.3)', color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: getIsApproved() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', opacity: getIsApproved() ? 1 : 0.5 }}>
        Post a Casting <span style={{ fontSize: 16, fontWeight: 400 }}>+</span>
      </button>
        <div onClick={() => router.push('/agency/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {msgCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', minWidth: 18, height: 18, padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{msgCount}</div>}
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {notifCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', minWidth: 18, height: 18, padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{notifCount}</div>}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
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
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>{agencyInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_PRIMARY.map(({ icon: Icon, label, active, href }) => {
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
                {!sidebarOpen && badge && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{badge}</div>}
              </div>
                );
              })}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205,#2a1e0a)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock advanced filters and AI matching.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>


          {/* Verification banner */}
          <AgencyVerificationBanner />
          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, marginBottom: 4, fontWeight: 400 }}>Casting Calls List</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Manage and track all casting calls created by your agency.</p>
            </div>
            <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 20px', height: 42, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <PlusCircle size={16} /> Create Casting Call
            </button>
          </div>

          {/* Status tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {STATUS_TABS.map(tab => {
              const active = activeTab === tab.key;
              return (
                <div key={tab.key} onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }} style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 12, cursor: 'pointer', borderBottom: active ? `2px solid ${RED}` : '2px solid transparent', marginBottom: -1 }}>
                  <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: active ? 700 : 500, color: active ? '#fff' : 'rgba(255,255,255,0.5)' }}>{tab.key}</span>
                  <span style={{ fontSize: 14, color: active ? RED : 'rgba(255,255,255,0.35)', fontWeight: 600 }}>({liveTabCounts[tab.key]})</span>
                </div>
              );
            })}
          </div>

          {/* Filters + search */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 16px', color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>
              <Filter size={14} color="rgba(255,255,255,0.6)" /> Filters
            </button>
            <div style={{ position: 'relative', width: 260 }}>
              <Search size={14} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search casting calls..."
                style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 14px 9px 34px', color: '#fff', fontSize: 14, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
          </div>

          {/* Dropdown overlay */}
          {openActionMenu && <div onClick={() => setOpenActionMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />}

          {/* Table */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'clip' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.8fr 1.1fr 1fr 1fr 1.1fr 0.5fr', padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: BG3, borderRadius: '14px 14px 0 0' }}>
              {['Casting Call', 'Project / Role', 'Type', 'Submissions', 'Status', 'Created On', 'Actions'].map((h, i) => (
                <span key={h} style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform: 'uppercase' as const, textAlign: i === 6 ? 'center' as const : 'left' as const }}>{h}</span>
              ))}
            </div>
            {filteredCalls.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' as const }}>
                <Megaphone size={32} color="rgba(255,255,255,0.15)" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>No casting calls found</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Try adjusting your filters or search query.</div>
              </div>
            ) : filteredCalls.map((c, idx) => (
              <div key={c.id} onClick={() => router.push(`/agency/casting-calls/${c.id}`)}
                style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.8fr 1.1fr 1fr 1fr 1.1fr 0.5fr', padding: '14px 20px', alignItems: 'start', cursor: 'pointer', borderBottom: idx < filteredCalls.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                {/* Casting Call */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <img src={c.img} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{c.roleType} – {c.gender}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                      <MapPin size={10} /> {c.location}
                    </div>
                  </div>
                </div>
                {/* Project / Role */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{c.project}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{c.projectType}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${c.productionColor}22`, border: `1px solid ${c.productionColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: c.productionColor, flexShrink: 0 }}>{c.productionInitials}</div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.productionHouse}</span>
                  </div>
                </div>
                {/* Type */}
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: GOLD, background: 'rgba(212,166,74,0.12)', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, padding: '4px 11px', whiteSpace: 'nowrap' as const }}>{c.typeTag}</span>
                </div>
                {/* Submissions */}
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{c.totalSubmissions}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Total</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginTop: 4 }}>{c.shortlisted}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>Shortlisted</div>
                </div>
                {/* Status */}
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: STATUS_COLORS[c.status] }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[c.status], flexShrink: 0 }} />
                    {c.status}
                  </span>
                </div>
                {/* Created On */}
                <div>
                  <div style={{ fontSize: 14, color: '#fff' }}>{c.createdOn}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>{c.createdTime}</div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
                  <div onClick={e => openMenu(c.id, e)} style={{ width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: openActionMenu === c.id ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => { if (openActionMenu !== c.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    <MoreVertical size={16} color="rgba(255,255,255,0.5)" />
                  </div>
                  {openActionMenu === c.id && (
                    <div style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, width: 190, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }}>
                      {[
                        { label: 'View Details',       action: () => router.push(`/agency/casting-calls/${c.id}`) },
                        { label: 'Edit Casting Call',   action: () => router.push(`/agency/create-casting?edit=${c.id}`) },
                        { label: 'View Applications',   action: () => router.push(`/agency/applications?casting_call_id=${c.id}`) },
                        { label: 'Close Casting Call',  action: () => updateStatus(c.id, 'Closed'), danger: true, disabled: c.status === 'Closed' },
                      ].map(item => (
                        <div key={item.label} onClick={() => { if (item.disabled) return; item.action(); setOpenActionMenu(null); }}
                          style={{ padding: '10px 14px', fontSize: 14, fontFamily: BARLOW, cursor: item.disabled ? 'not-allowed' : 'pointer', color: item.disabled ? 'rgba(255,255,255,0.25)' : item.danger ? '#ff6b6b' : '#fff', borderTop: item.danger ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                          onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >{item.label}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination — inside table container */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                Showing {filteredCalls.length === 0 ? 0 : 1} to {filteredCalls.length} of {liveTabCounts[activeTab]} casting calls
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 32, height: 32, borderRadius: 7, background: BG3, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>
                  <ChevronLeft size={15} color="#fff" />
                </button>
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 32, height: 32, borderRadius: 7, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', background: p === currentPage ? GOLD : BG3, color: p === currentPage ? '#000' : '#fff', border: `1px solid ${p === currentPage ? GOLD : 'rgba(255,255,255,0.1)'}` }}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))} disabled={currentPage === TOTAL_PAGES} style={{ width: 32, height: 32, borderRadius: 7, background: BG3, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === TOTAL_PAGES ? 'not-allowed' : 'pointer', opacity: currentPage === TOTAL_PAGES ? 0.4 : 1 }}>
                  <ChevronRight size={15} color="#fff" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}