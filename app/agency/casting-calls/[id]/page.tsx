'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, MapPin,
  Edit2, X, Check, AlertCircle, Menu,
} from 'lucide-react';

/* ─── Design tokens — matches dashboard / wizard / list ──────── */
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
  { icon: PlusCircle,      label: 'Create Casting Call',                  href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',     active: true, href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',                        href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management',              href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',                  href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',                  href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',                        href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',               badge: 12,    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications',          badge: 3,     href: '/agency/notifications' },
];

type CastingCallStatus = 'Open' | 'Shortlisting' | 'Auditioning' | 'Draft' | 'Closed';

/* -- Auth helper -- */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

const STATUS_COLORS: Record<string, string> = {
  Open: GREEN,
  Shortlisting: BLUE,
  Auditioning: GOLD,
  Draft: 'rgba(255,255,255,0.45)',
  Closed: RED,
};

const STATUS_FLOW: CastingCallStatus[] = ['Open', 'Shortlisting', 'Auditioning', 'Closed'];

export default function CastingCallDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [profileOpen,      setProfileOpen]      = useState(false);
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [statusMenuOpen,   setStatusMenuOpen]   = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [activeTab,        setActiveTab]        = useState('role');

  /* -- Live data -- */
  const [call,         setCall]         = useState<any>(null);
  const [loading,      setLoading]      = useState(true);
  const [agencyName,   setAgencyName]   = useState('My Agency');
  const [agencyInitials,setAgencyInitials]= useState('AG');
  const [agencyId,     setAgencyId]     = useState('AGE.........');
  const [agencyType,   setAgencyType]   = useState('Production House');
  const [msgCount,     setMsgCount]     = useState(0);
  const [notifCount,   setNotifCount]   = useState(0);

  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  /* -- Load agency identity instantly -- */
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

  /* -- Fetch casting call + badges -- */
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const h = getAuthHeaders();

    fetch(`/api/casting-calls/${id}`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const c = data.data?.casting_call ?? data.data?.castingCall ?? data;
        // Normalise to expected shape
        setCall({
          id:               c.id,
          title:            c.title ?? '',
          projectTitle:     c.project_type ?? '',
          projectType:      c.project_type ?? '',
          department:       c.category ?? '',
          role:             c.role_name ?? '',
          roleType:         c.role_name ?? '',
          gender:           c.gender_preference ?? 'Any',
          ageFrom:          c.age_min ?? '',
          ageTo:            c.age_max ?? '',
          experience:       c.experience_level ?? '',
          roleDescription:  c.role_description ?? '',
          skills:           Array.isArray(c.skills_required) ? c.skills_required : [],
          languages:        Array.isArray(c.languages_required) ? c.languages_required : [],
          shootLocation:    c.location ?? '',
          shootStart:       c.shoot_start ? new Date(c.shoot_start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          shootEnd:         c.shoot_end   ? new Date(c.shoot_end).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          compensationType: 'Paid',
          amount:           c.budget_min ? '₹' + Number(String(c.budget_min)).toLocaleString('en-IN') : '',
          currency:         'INR',
          auditionFormat:   c.audition_mode === 'offline' ? 'In-Person' : c.audition_mode === 'online' ? 'Online' : c.audition_mode === 'both' ? 'In-Person & Online' : c.audition_mode ?? '',
          auditionAddress:  c.audition_details ?? '',
          auditionTimeFrom: c.audition_time_from ?? '',
          auditionTimeTo:   c.audition_time_to   ?? '',
          auditionStart:    c.audition_start ? new Date(c.audition_start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          auditionEnd:      c.audition_end   ? new Date(c.audition_end).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          auditionLocationType: c.audition_location_type ?? '',
          contactName:      c.contact_name   ?? '',
          contactEmail:     c.contact_email  ?? '',
          contactMobile:    c.contact_mobile ? c.contact_mobile.replace(/^(\+91|91)?0+/, '+91 ').trim() : '',
          howToApply:       Array.isArray(c.how_to_apply) ? c.how_to_apply : [],
          projectStatus:    c.project_status ?? '',
          hasSponsor:       c.has_sponsor    ?? '',
          paymentTerms:     c.payment_terms  ?? '',
          status:           (c.status === 'active' ? 'Open' : c.status === 'draft' ? 'Draft' : c.status === 'closed' ? 'Closed' : c.status) as CastingCallStatus,
          totalSubmissions: c._count?.applications ?? c.applications_count ?? 0,
          shortlisted:      0,
          createdOn:        c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          createdTime:      c.created_at ? new Date(c.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
        });
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
  }, [id]);

  /* -- Status update -- */
  const handleStatusChange = (status: CastingCallStatus) => {
    if (status === 'Closed') {
      setStatusMenuOpen(false);
      setCloseConfirmOpen(true);
      return;
    }
    const apiStatus = status === 'Open' ? 'active' : status.toLowerCase();
    const h = getAuthHeaders();
    fetch(`/api/casting-calls/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...h },
      body: JSON.stringify({ status: apiStatus }),
    }).catch(() => {});
    setCall((prev: any) => prev ? { ...prev, status } : prev);
    setStatusMenuOpen(false);
  };

  const confirmClose = () => {
    const h = getAuthHeaders();
    fetch(`/api/casting-calls/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...h },
      body: JSON.stringify({ status: 'closed' }),
    }).catch(() => {});
    setCall((prev: any) => prev ? { ...prev, status: 'Closed' } : prev);
    setCloseConfirmOpen(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontSize: 18 }}>
        Loading...
      </div>
    );
  }

  if (!call) {
      return;
    }
  if (!call) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, fontFamily: BARLOW, color: '#F5F5F5', gap: 16 }}>
        <AlertCircle size={40} color="rgba(255,255,255,0.25)" />
        <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Casting call not found</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', textAlign: 'center' as const, maxWidth: 380 }}>
          This casting call may have been removed, or you followed a link to a demo entry that doesn't exist in your local data yet.
        </div>
        <button onClick={() => router.push('/agency/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: RED, border: 'none', borderRadius: 8, padding: '11px 22px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
          <ChevronLeft size={16} /> Back to Casting Calls
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ── CLOSE CONFIRMATION MODAL ── */}
      {closeConfirmOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: BG2, border: '1px solid rgba(200,32,42,0.3)', borderRadius: 16, padding: 32, maxWidth: 440, width: '100%' }}>
            <div style={{ textAlign: 'center' as const, marginBottom: 22 }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <X size={24} color={RED} />
              </div>
              <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1.5, color: '#fff', marginBottom: 8 }}>Close this casting call?</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.6 }}>
                It will stop accepting new applications and will no longer be visible to talent. This can't be undone from here.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setCloseConfirmOpen(false)} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmClose} style={{ flex: 1, background: RED, border: 'none', borderRadius: 8, padding: 12, fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Yes, Close It</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ TOPNAV ══════════ */}
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
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{msgCount > 0 ? msgCount : null}</div>
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>24</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #1a1410, #2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Production House</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <div style={{ position: 'absolute', top: 46, right: 0, width: 200, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              {[
                { label: 'Reports & Analytics',  href: '/agency/reports' },
                { label: 'Subscription & Billing', href: '/pricing' },
                { label: 'Company Profile',      href: '/agency-profile' },
                { label: 'Documents',            href: '/agency/documents' },
                { label: 'Calendar',             href: '/agency/calendar' },
                { label: 'Settings',             href: '/agency/settings' },
                { label: 'Support',              href: '/contact' },
                { label: 'Logout',               href: '/login' },
              ].map(({ label: item, href: dHref }) => (
                <div key={item} onClick={() => router.push(dHref)} style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: item === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: item === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >{item}</div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ══════════ BODY ══════════ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── COLLAPSIBLE SIDEBAR ── */}
        <aside style={{ width: sidebarOpen ? 230 : 52, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const, overflowX: 'hidden', scrollbarWidth: 'none' as const, transition: 'width 0.2s ease' }}>
          {/* Toggle button */}
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {/* Agency branding — only when expanded */}
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: 'linear-gradient(135deg, #1a1410, #2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 13, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Profile</div>
              </div>
            </div>
          )}
          {/* Nav items */}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto' as const, scrollbarWidth: 'none' as const }}>
            {NAV_PRIMARY.map(({ icon: Icon, label, active, badge, href }) => (
              <div key={label} onClick={() => href && router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none', position: 'relative' as const }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(200,32,42,0.12)' : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0, justifyContent: 'center' }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 15, fontWeight: active ? 600 : 400, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' as const }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' as const }}>{badge}</div>}
                {!sidebarOpen && badge && <div style={{ position: 'absolute' as const, top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{badge}</div>}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── SCROLLABLE CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'visible', padding: '16px 24px 28px' }}>

          <div onClick={() => router.push('/agency/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', marginBottom: 12, width: 'fit-content' }}>
            <ChevronLeft size={15} /> Back to Casting Calls List
          </div>

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <h1 style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, color: '#fff', margin: 0 }}>{call.title}</h1>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: STATUS_COLORS[call.status], background: `${STATUS_COLORS[call.status]}18`, border: `1px solid ${STATUS_COLORS[call.status]}55`, borderRadius: 20, padding: '4px 12px' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[call.status] }} />
                  {call.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' as const }}>
                {(call as any).department && (
                  <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: RED, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 20, padding: '3px 12px' }}>{(call as any).department}</span>
                )}
                {(call as any).role && (
                  <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 600, color: 'rgba(255,255,255,0.7)', background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '3px 12px' }}>{(call as any).role}</span>
                )}
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>{call.roleType} – {call.gender}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>{call.projectType}</span>
                {call.shootLocation && (
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {call.shootLocation}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <button onClick={() => router.push(`/agency/create-casting?edit=${call.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: `1px solid ${GOLD}`, borderRadius: 8, padding: '8px 14px', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                <Edit2 size={13} /> Edit Casting Call
              </button>

              <div style={{ position: 'relative' }}>
                <div onClick={() => setStatusMenuOpen(v => !v)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  background: BG3, border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8, padding: '8px 14px',
                }}>
                  <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Status</span>
                  <ChevronDown size={13} color="rgba(255,255,255,0.5)" style={{ transform: statusMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </div>
                {statusMenuOpen && (
                  <>
                    <div onClick={() => setStatusMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
                    <div style={{ position: 'absolute', top: 40, right: 0, width: 200, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                      <div style={{ padding: '8px 14px', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textTransform: 'uppercase' as const }}>Change Status</div>
                      {STATUS_FLOW.map(s => (
                        <div key={s} onClick={() => handleStatusChange(s)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: s === call.status ? STATUS_COLORS[s] : '#fff' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLORS[s] }} />
                            {s}
                          </span>
                          {s === call.status && <Check size={14} color={STATUS_COLORS[s]} />}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main two-column layout: About the Project + Casting Call Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12, alignItems: 'stretch' }}>

            {/* About the Project */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 6 }}>About the Project</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW, lineHeight: 1.5, marginBottom: 10 }}>
                {call.roleDescription || call.shortDescription || 'No project description provided yet.'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px 14px' }}>
                <OverviewMini label="Language" value={call.languages.join(', ')} />
                <OverviewMini label="Project Status" value={call.projectStatus} />
                <OverviewMini label="Project Type" value={call.projectType} />
                <OverviewMini label="Shoot Dates" value={call.shootStart && call.shootEnd ? `${call.shootStart} – ${call.shootEnd}` : ''} />
                <OverviewMini label="Shoot Location" value={call.shootLocation} />
                <OverviewMini label="Brand / Sponsor" value={call.hasSponsor} />
              </div>
            </div>

            {/* Casting Call Overview */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 10 }}>Casting Call Overview</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                <OverviewRow label="Casting Call ID" value={call.id.slice(0, 14).toUpperCase()} />
                <OverviewRow label="Created On" value={`${call.createdOn}, ${call.createdTime}`} />
                <OverviewRow label="Contact" value={call.contactName || 'Not specified'} />
                <OverviewRow label="Submissions" value={`${call.totalSubmissions} Total`} sub={`${call.shortlisted} Shortlisted`} />
                <OverviewRow label="Status" value={call.status} valueColor={STATUS_COLORS[call.status]} />
                <OverviewRow label="Compensation" value={call.compensationType} />
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 12 }}>
            {[
              { key: 'role',  label: 'Role & Requirements' },
              { key: 'subs',  label: `Submissions (${call.totalSubmissions})` },
              { key: 'short', label: `Shortlisted (${call.shortlisted})` },
              { key: 'aud',   label: 'Auditions' },
              { key: 'notes', label: 'Notes' },
            ].map(tab => {
              const active = activeTab === tab.key;
              return (
                <div key={tab.key} onClick={() => {
                  if (tab.key === 'subs' || tab.key === 'short') { router.push('/agency/applications'); return; }
                  if (tab.key === 'aud') { router.push('/agency/auditions'); return; }
                  setActiveTab(tab.key);
                }} style={{ paddingBottom: 9, cursor: 'pointer', borderBottom: active ? `2px solid ${RED}` : '2px solid transparent', marginBottom: -1 }}>
                  <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: active ? 700 : 500, color: active ? '#fff' : 'rgba(255,255,255,0.5)' }}>{tab.label}</span>
                </div>
              );
            })}
          </div>

          {activeTab === 'role' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>

              {/* Row 1: Role Details + Audition Details — equal width, matched height */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'stretch' }}>

                {/* Role Details */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Role Details</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                    {(call as any).department && <OverviewRow label="Department" value={(call as any).department} />}
                    {(call as any).role && <OverviewRow label="Role" value={(call as any).role} />}
                    <OverviewRow label="Role Type" value={call.roleType} />
                    <OverviewRow label="Gender" value={call.gender} />
                    <OverviewRow label="Age Range" value={call.ageFrom && call.ageTo ? `${call.ageFrom} – ${call.ageTo} Years` : ''} />
                    <OverviewRow label="Experience" value={call.experience} />
                    <OverviewRow label="Compensation" value={call.amount || call.compensationType || ''} />
                  </div>
                </div>

                {/* Audition Details */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Audition Details</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                    <OverviewRow label="Format" value={call.auditionFormat} />
                    <OverviewRow label="Dates" value={call.auditionStart && call.auditionEnd ? `${call.auditionStart} – ${call.auditionEnd}` : ''} />
                    <OverviewRow label="Time" value={call.auditionTimeFrom && call.auditionTimeTo ? `${call.auditionTimeFrom} – ${call.auditionTimeTo}` : ''} />
                    <OverviewRow label="Location Type" value={call.auditionLocationType} />
                    {call.auditionAddress && <OverviewRow label="Address" value={call.auditionAddress} />}
                    <OverviewRow label="Contact Name" value={call.contactName} />
                    <OverviewRow label="Contact Mobile" value={call.contactMobile || ''} />
                  </div>
                </div>
              </div>

              {/* Row 2: Role Description + Skills + Internal Notes — full width */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'stretch' }}>

                {/* Role Description & Skills */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Role Description</div>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, lineHeight: 1.55, marginBottom: 16 }}>
                    {call.roleDescription || 'No detailed role description provided.'}
                  </div>
                  <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Skills Required</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {call.skills.length > 0 ? call.skills.map(skill => (
                      <span key={skill} style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 400, color: '#fff', background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '4px 12px' }}>{skill}</span>
                    )) : <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>No skills specified</span>}
                  </div>
                </div>

                {/* Internal Notes */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Internal Notes</span>
                    <Edit2 size={13} color={GOLD} style={{ cursor: 'pointer' }} />
                  </div>
                  <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, lineHeight: 1.55 }}>
                    {call.additionalRequirements || 'No internal notes added yet. Use this space to jot down anything the team should know about this casting call.'}
                  </div>
                </div>
              </div>

            </div>
          )}

          <div onClick={() => router.push('/contact')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG2, border: '1px solid rgba(212,166,74,0.2)', borderRadius: 10, padding: '12px 18px', marginTop: 12, cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Need help with this casting call?</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Our support team is here to assist you with any questions.</div>
            </div>
            <button style={{ background: 'none', border: `1px solid ${GOLD}`, borderRadius: 7, padding: '7px 14px', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>Contact Support</button>
          </div>

        </div>
      </div>
    </div>
  );
}

function OverviewRow({ label, value, sub, valueColor }: { label: string; value: string; sub?: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, flexShrink: 0 }}>{label}</span>
      <div style={{ textAlign: 'right' as const }}>
        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 500, color: valueColor || (value ? '#fff' : 'rgba(255,255,255,0.3)') }}>{value || 'Not specified'}</div>
        {sub && <div style={{ fontSize: 14, color: GOLD, fontFamily: BARLOW, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}

function OverviewMini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, letterSpacing: 0.5, textTransform: 'uppercase' as const, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 400, color: value ? '#fff' : 'rgba(255,255,255,0.3)' }}>{value || '—'}</div>
    </div>
  );
}