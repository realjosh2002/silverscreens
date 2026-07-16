'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, Menu,
  Calendar, Clock, MapPin, ExternalLink, Eye,
  CheckSquare, Square, Check,
} from 'lucide-react';

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

/* ─── Sidebar nav ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions', active: true },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  badge: 12,    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', badge: 3, href: '/agency/notifications' },
];

/* ─── Mock aspirant data ──────────────────────────────────────── */
const ASPIRANTS: Record<string, {
  name: string; verified: boolean; category: string; gender: string; age: number;
  location: string; rating: number; reviews: number; views: string;
  img: string; appStatus: string; castingCall: string; ccType: string;
  ccProducer: string; ccStatus: string; ccImg: string;
  role: string; appliedOn: string; appliedTime: string; appId: string;
}> = {
  a1: {
    name: 'Arjun Malhotra', verified: true, category: 'Actor', gender: 'Male', age: 26,
    location: 'Mumbai, Maharashtra, India', rating: 4.8, reviews: 32, views: '3.2K',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    appStatus: 'Shortlisted',
    castingCall: 'City of Dreams – Season 2', ccType: 'Web Series', ccProducer: 'Silver Paradise Productions',
    ccStatus: 'Open', ccImg: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=80&h=80&fit=crop',
    role: 'Lead Hero', appliedOn: '20 May 2024', appliedTime: '11:30 AM', appId: 'APP-2024-000512',
  },
  a2: {
    name: 'Meera Iyer', verified: true, category: 'Actor', gender: 'Female', age: 25,
    location: 'Mumbai, Maharashtra, India', rating: 4.9, reviews: 48, views: '5.1K',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    appStatus: 'Shortlisted',
    castingCall: 'The Silent Witness', ccType: 'Web Series', ccProducer: 'Dharma Productions',
    ccStatus: 'Open', ccImg: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=80&h=80&fit=crop',
    role: 'Female Lead', appliedOn: '19 May 2024', appliedTime: '04:15 PM', appId: 'APP-2024-000498',
  },
};

const FALLBACK_ASPIRANT = ASPIRANTS['a1'];

const STUDIOS = ['Dharma Studio, Andheri', 'Silver Paradise Studios, Juhu', 'Mumbai Film City', 'Delhi Production Hub', 'Other'];
const ROOMS   = ['Studio A – Floor 2', 'Studio B – Floor 1', 'Conference Room', 'Rehearsal Hall', 'Main Stage'];
const DURATIONS = ['15 Minutes', '20 Minutes', '30 Minutes', '45 Minutes', '60 Minutes', '90 Minutes'];
const REMINDERS = ['30 Minutes Before', '1 Hour Before', '3 Hours Before', '1 Day Before', '2 Days Before'];

/* ═══════════════════════════════════════════════════════════════ */
export default function ScheduleAuditionWrapper() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontSize: 17 }}>
        Loading...
      </div>
    }>
      <ScheduleAuditionPage />
    </Suspense>
  );
}

function ScheduleAuditionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams?.get('applicationId') ?? '';
  const candidateId   = searchParams?.get('candidate') ?? 'a1';
  const fromPage      = searchParams?.get('from') ?? 'shortlisted';
  const backLabel     = fromPage === 'auditions' ? 'Back to Audition Management' : 'Back to Shortlisted Talents';
  const backHref      = fromPage === 'auditions' ? '/agency/auditions' : '/agency/shortlisted';
  const [asp,          setAsp]          = useState(ASPIRANTS[candidateId] ?? FALLBACK_ASPIRANT);

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);

  /* Section 1 */
  const [audType,      setAudType]      = useState<'In Person' | 'Self Tape' | 'Online Live'>('In Person');
  const [audMode,      setAudMode]      = useState<'Individual' | 'Group'>('Individual');
  const [notes,        setNotes]        = useState('Scene performance + Dialogue delivery.\nPlease prepare the attached script.');

  /* Section 2 */
  const [audDate,      setAudDate]      = useState('25 May 2024 (Saturday)');
  const [startTime,    setStartTime]    = useState('11:00 AM');
  const [duration,     setDuration]     = useState('30 Minutes');
  const [bufferOn,     setBufferOn]     = useState(true);
  const [buffer,       setBuffer]       = useState('15 Minutes');

  /* Section 3 */
  const [locMode,      setLocMode]      = useState<'Physical Location' | 'Online (Video Call)' | 'Self Tape'>('Physical Location');
  const [studio,       setStudio]       = useState('Dharma Studio, Andheri');
  const [room,         setRoom]         = useState('Studio A – Floor 2');

  /* Section 4 */
  const [sendEmail,    setSendEmail]    = useState(true);
  const [sendInApp,    setSendInApp]    = useState(true);
  const [reminder,     setReminder]     = useState('1 Day Before');

  const [saved,        setSaved]        = useState(false);

  const SB_W = sidebarOpen ? 230 : 52;

  // Fetch real application data if applicationId is provided
  useEffect(() => {
    if (!applicationId) return;
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;
    fetch(`/api/applications/${applicationId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const a = data.data?.application ?? data.application ?? data;
        const cc = a.casting_calls ?? {};
        const ap = a.aspirant_profiles ?? {};
        const dob = ap.date_of_birth ? new Date(ap.date_of_birth) : null;
        const age = dob ? Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 0;
        const statusMap: Record<string, string> = {
          applied: 'New', in_review: 'In Review', shortlisted: 'Shortlisted', rejected: 'Rejected',
        };
        setAsp(prev => ({
          ...prev,
          id:          ap.id ?? prev.id,
          name:        [ap.first_name, ap.last_name].filter(Boolean).join(' ') || prev.name,
          role:        ap.category ?? prev.role,
          gender:      ap.gender ?? prev.gender,
          age:         age || prev.age,
          location:    [ap.city, ap.state].filter(Boolean).join(', ') || prev.location,
          img:         ap.profile_image_url ?? prev.img,
          appStatus:   statusMap[a.status] ?? prev.appStatus,
          castingCall: cc.title ?? prev.castingCall,
          ccType:      cc.project_type ?? prev.ccType,
          ccProducer:  cc.agency_profiles?.company_name ?? prev.ccProducer,
        }));
      })
      .catch(() => {});
  }, [applicationId]);

  const handleSchedule = async () => {
    if (!applicationId) {
      router.push('/agency/auditions');
      return;
    }
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;

    // Build scheduled_at from audDate and startTime
    const dateStr = audDate.replace(/\s*\(.*\)/, '').trim(); // remove "(Saturday)" etc
    const scheduledAt = new Date(`${dateStr} ${startTime}`);

    const modeMap: Record<string, string> = {
      'In Person':   'offline',
      'Online Live': 'online',
      'Self Tape':   'both',
    };

    try {
      const res = await fetch('/api/auditions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          application_id:   applicationId,
          scheduled_at:     scheduledAt.toISOString(),
          duration_minutes: parseInt(duration) || 30,
          mode:             modeMap[audType] ?? 'offline',
          venue_details:    locMode === 'Physical Location' ? `${studio} – ${room}` : undefined,
          notes,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => { setSaved(false); router.push('/agency/auditions/management'); }, 2000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to schedule audition');
      }
    } catch {
      alert('Failed to schedule audition. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Post a Casting <span style={{ fontSize: 17, fontWeight: 400 }}>+</span>
        </button>
        <div onClick={() => router.push('/agency/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>12</div>
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>3</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>DP</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>Dharma Productions</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Production House</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 220, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Agency ID</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>AGE062600001</span>
                </div>

                {[
                  { label: 'Reports & Analytics', href: '/agency/reports' },
                  { label: 'Subscription & Billing', href: '/pricing' },
                  { label: 'Company Profile', href: '/agency-profile' },
                  { label: 'Documents', href: '/agency/documents' },
                  { label: 'Calendar', href: '/agency/calendar' },
                  { label: 'Settings', href: '/agency/settings' },
                  { label: 'Support', href: '/contact' },
                  { label: 'Logout', href: '/login' },
                ].map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
                    style={{ padding: '10px 16px', fontSize: 16, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
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
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── FORM (scrollable) ── */}
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '16px 20px 32px' }}>

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div onClick={() => router.push(backHref)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', marginBottom: 8, width: 'fit-content' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  <ChevronLeft size={14} /> {backLabel}
                </div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 26, letterSpacing: 1, color: '#fff', margin: '0 0 4px' }}>Schedule Audition</h1>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>
                  Schedule an audition for <span style={{ color: '#fff', fontWeight: 600 }}>{asp.name}</span> for <span style={{ color: GOLD }}>{asp.castingCall}</span>
                </div>
              </div>
              <button onClick={() => router.push(`/agency/applications/${candidateId}`)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG2, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                View Application <ExternalLink size={13} />
              </button>
            </div>

            {/* Sections grid: 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

            {/* ── SECTION 1: Audition Details ── */}
            <Section number={1} title="Audition Details">
              {/* Casting Call */}
              <div style={{ marginBottom: 16 }}>
                <FieldLabel>Casting Call</FieldLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
                  <img src={asp.ccImg} alt="" style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{asp.castingCall}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{asp.ccType} · {asp.ccProducer}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: GREEN, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '2px 10px' }}>{asp.ccStatus}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Role */}
                <div>
                  <FieldLabel required>Role</FieldLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px' }}>
                    <span style={{ fontSize: 15, color: '#fff', flex: 1 }}>{asp.role}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: PURPLE, background: `${PURPLE}20`, border: `1px solid ${PURPLE}50`, borderRadius: 10, padding: '2px 8px' }}>Lead Role</span>
                    <ChevronDown size={14} color="rgba(255,255,255,0.4)" />
                  </div>
                </div>

                {/* Audition Type */}
                <div>
                  <FieldLabel required>Audition Type</FieldLabel>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center', height: 42 }}>
                    {(['In Person', 'Self Tape', 'Online Live'] as const).map(t => (
                      <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 15, color: audType === t ? '#fff' : 'rgba(255,255,255,0.55)' }}>
                        <div onClick={() => setAudType(t)} style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${audType === t ? GOLD : 'rgba(255,255,255,0.25)'}`, background: audType === t ? GOLD : 'transparent', cursor: 'pointer', flexShrink: 0 }} />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Audition Mode */}
                <div>
                  <FieldLabel required>Audition Mode</FieldLabel>
                  <div style={{ display: 'flex', gap: 24, alignItems: 'center', height: 42 }}>
                    {(['Individual', 'Group'] as const).map(m => (
                      <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 15, color: audMode === m ? '#fff' : 'rgba(255,255,255,0.55)' }}>
                        <div onClick={() => setAudMode(m)} style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${audMode === m ? GOLD : 'rgba(255,255,255,0.25)'}`, background: audMode === m ? GOLD : 'transparent', cursor: 'pointer', flexShrink: 0 }} />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <FieldLabel>Audition Format / Notes</FieldLabel>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, fontFamily: BARLOW, outline: 'none', resize: 'none', boxSizing: 'border-box' as const }} />
                </div>
              </div>
            </Section>

            {/* ── SECTION 2: Date & Time ── */}
            <Section number={2} title="Date & Time">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Date */}
                <div>
                  <FieldLabel>Audition Date</FieldLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px' }}>
                    <Calendar size={15} color="rgba(255,255,255,0.4)" />
                    <input value={audDate} onChange={e => setAudDate(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: '#fff', fontFamily: BARLOW, flex: 1 }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
                    <MapPin size={11} /> Time Zone: Asia/Kolkata (IST)
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <FieldLabel>Start Time</FieldLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px' }}>
                    <Clock size={15} color="rgba(255,255,255,0.4)" />
                    <input value={startTime} onChange={e => setStartTime(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 15, color: '#fff', fontFamily: BARLOW, flex: 1 }} />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <FieldLabel>Duration (Minutes)</FieldLabel>
                  <NativeSelect value={duration} onChange={setDuration} options={DURATIONS} />
                </div>
              </div>

              {/* Buffer time */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, padding: '12px 14px', background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <div onClick={() => setBufferOn(v => !v)} style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${bufferOn ? GOLD : 'rgba(255,255,255,0.25)'}`, background: bufferOn ? GOLD : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {bufferOn && <Check size={11} color="#000" strokeWidth={3} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>Add Buffer Time</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Add buffer time before and after audition</div>
                  </div>
                </label>
                {bufferOn && (
                  <div style={{ flexShrink: 0 }}>
                    <NativeSelect value={buffer} onChange={setBuffer} options={['5 Minutes', '10 Minutes', '15 Minutes', '20 Minutes', '30 Minutes']} />
                  </div>
                )}
              </div>
            </Section>

            </div>{/* end top row */}

            {/* Sections grid row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

            {/* ── SECTION 3: Location / Mode ── */}
            <Section number={3} title="Location / Mode">
              {/* Location type */}
              <div style={{ display: 'flex', gap: 28, marginBottom: 16 }}>
                {(['Physical Location', 'Online (Video Call)', 'Self Tape'] as const).map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 15, color: locMode === m ? '#fff' : 'rgba(255,255,255,0.55)' }}>
                    <div onClick={() => setLocMode(m)} style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${locMode === m ? GOLD : 'rgba(255,255,255,0.25)'}`, background: locMode === m ? GOLD : 'transparent', cursor: 'pointer', flexShrink: 0 }} />
                    {m}
                  </label>
                ))}
              </div>

              {locMode === 'Physical Location' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <FieldLabel>Studio / Venue</FieldLabel>
                      <NativeSelect value={studio} onChange={setStudio} options={STUDIOS} />
                    </div>
                    <div>
                      <FieldLabel>Room / Stage (Optional)</FieldLabel>
                      <NativeSelect value={room} onChange={setRoom} options={ROOMS} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                    <MapPin size={13} color="rgba(255,255,255,0.35)" />
                    Plot No. 123, Andheri West, Mumbai, Maharashtra 400053
                  </div>
                  {/* Contact person */}
                  <div style={{ marginTop: 12, padding: '10px 12px', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${GOLD}20`, border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>MJ</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Mohamed Jaleel</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Casting Coordinator · Dharma Productions</div>
                    </div>
                    <div style={{ display: 'flex', flex: 'column', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'right' as const }}>
                      <div>+91 99941 89841</div>
                      <div>jaleel@dharma.com</div>
                    </div>
                  </div>
                  {/* Map embed */}
                  <div style={{ marginTop: 12, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: 160 }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.2!2d72.8397!3d19.1197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b6f4e5e5e5e5%3A0x5e5e5e5e5e5e5e5e!2sAndheri%20West%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                      width="100%"
                      height="160"
                      style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg)' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </>
              )}
              {locMode === 'Online (Video Call)' && (
                <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>
                  A video call link will be generated and sent to the aspirant automatically.
                </div>
              )}
              {locMode === 'Self Tape' && (
                <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>
                  The aspirant will submit a self-recorded tape. Instructions from the Notes section above will be included.
                </div>
              )}
            </Section>

            {/* ── SECTION 4: Invite & Reminders ── */}
            <Section number={4} title="Invite & Reminders">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <FieldLabel>Send Invitation Via</FieldLabel>
                  <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
                    {[
                      { label: 'Email',              val: sendEmail,  set: setSendEmail },
                      { label: 'In-App Notification',val: sendInApp,  set: setSendInApp },
                    ].map(({ label, val, set }) => (
                      <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 15, color: '#fff' }}>
                        <div onClick={() => set(v => !v)} style={{ width: 17, height: 17, borderRadius: 4, border: `1.5px solid ${val ? GOLD : 'rgba(255,255,255,0.25)'}`, background: val ? GOLD : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {val && <Check size={10} color="#000" strokeWidth={3} />}
                        </div>
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel>Reminder to Send</FieldLabel>
                  <NativeSelect value={reminder} onChange={setReminder} options={REMINDERS} />
                </div>
              </div>
            </Section>

            </div>{/* end bottom row */}

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
              <button onClick={() => router.push('/agency/auditions')} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 24px', color: 'rgba(255,255,255,0.7)', fontSize: 16, fontFamily: BARLOW, fontWeight: 500, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSchedule} style={{ background: saved ? 'rgba(34,197,94,0.15)' : GOLD, border: saved ? `1px solid ${GREEN}` : 'none', borderRadius: 8, padding: '10px 28px', color: saved ? GREEN : '#000', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                {saved ? '✓ Audition Scheduled!' : 'Schedule Audition'}
              </button>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{ width: 240, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', scrollbarWidth: 'none', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12, background: BG2 }}>

            {/* Aspirant card */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Aspirant</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <img src={asp.img} alt={asp.name} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{asp.name}</span>
                    {asp.verified && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3b82f6"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{asp.category} · {asp.gender} · {asp.age} Years</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                    <MapPin size={11} /> {asp.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={12} color={GOLD} fill={GOLD} /> {asp.rating} <span style={{ color: 'rgba(255,255,255,0.4)' }}>({asp.reviews})</span>
                    </span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Eye size={12} color="rgba(255,255,255,0.35)" /> {asp.views}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: GREEN, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '3px 10px' }}>{asp.appStatus}</span>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

            {/* Application Summary */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Application Summary</div>
              <RightRow label="Applied On" value={`${asp.appliedOn}, ${asp.appliedTime}`} />
              <RightRow label="Role Applied For" value={asp.role} badge="Lead Role" />
              <RightRow label="Application Status" value={asp.appStatus} valueColor={GREEN} />
              <button onClick={() => router.push(`/agency/applications/${candidateId}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', background: 'none', border: `1px solid ${GOLD}`, borderRadius: 8, padding: '9px 0', color: GOLD, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}>
                View Application <ExternalLink size={13} color={GOLD} />
              </button>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

            {/* Contact Person */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Agency Contact</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${GOLD}20`, border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>MJ</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Mohamed Jaleel</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Casting Coordinator</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>+91 99941 89841</div>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

            {/* Audition Summary — live preview */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Audition Summary</div>
              <RightRow label="Audition Type" value={audType} />
              <RightRow label="Audition Mode" value={audMode} />
              <RightRow label="Date & Time" value={`${audDate.replace(' (Saturday)', '')}, ${startTime}`} />
              <RightRow label="Duration" value={duration} />
              <RightRow label="Location" value={locMode === 'Physical Location' ? studio : locMode} />
              <button onClick={() => {}} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 0', color: 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: BARLOW, fontWeight: 500, cursor: 'pointer', marginTop: 12 }}>
                ✏️ Edit Schedule
              </button>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

            {/* What happens next */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14 }}>What happens next?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: '✉️', title: 'Invitation will be sent to the aspirant', sub: 'They will receive email and in-app notification.' },
                  { icon: '✅', title: 'Aspirant confirms the audition', sub: 'They can accept or reschedule if needed.' },
                  { icon: '🎬', title: 'Audition takes place', sub: 'You can evaluate and add feedback.' },
                  { icon: '🔄', title: 'Update status', sub: 'Move to next stage after the audition.' },
                ].map(({ icon, title, sub }, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: BG3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{title}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 2, lineHeight: 1.4 }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: RED, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{number}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
      {children}{required && <span style={{ color: RED, fontSize: 14 }}>*</span>}
    </div>
  );
}

function NativeSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 36px 10px 12px', color: '#fff', fontSize: 15, fontFamily: BARLOW, outline: 'none', cursor: 'pointer', appearance: 'none' }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
  );
}

function RightRow({ label, value, valueColor, badge }: { label: string; value: string; valueColor?: string; badge?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, textAlign: 'right' as const }}>
        <span style={{ fontSize: 14, fontWeight: 500, color: valueColor || '#fff' }}>{value}</span>
        {badge && <span style={{ fontSize: 14, fontWeight: 700, color: PURPLE, background: `${PURPLE}20`, border: `1px solid ${PURPLE}50`, borderRadius: 10, padding: '1px 6px' }}>{badge}</span>}
      </div>
    </div>
  );
}