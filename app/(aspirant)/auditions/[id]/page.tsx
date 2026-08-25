'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark, Star, Bell,
  ChevronLeft, ChevronRight, ChevronDown, Menu,
  User, MapPin, Users, Clock, CalendarDays, Timer, Shirt,
  Check, AlertCircle, Phone, Mail, MessageCircle,
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
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',       },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions',      active: true },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended'    },
  { icon: Bell,            label: 'Notifications',        href: '/notifications',  },
];

const DROPDOWN_LINKS = ['Subscription', 'Analytics', 'Calendar', 'Settings', 'Support', 'Logout'];

/* ─── Audition detail data ────────────────────────────────────── */
const AUDITION = {
  title:              'City of Dreams – Season 2',
  type:               'Web Series',
  genres:             'Drama, Crime, Thriller',
  agency:             'Silver Paradise Productions',
  agencyInitials:     'SP',
  role:               'Rohan Verma',
  location:           'Silver Paradise Studio, Stage 3 / Film City, Goregaon, Mumbai',
  auditionType:       'In-Person',
  reportingTime:      '10:30 AM IST',
  date:               '24 May 2025, Saturday',
  duration:           '2 Hours',
  time:               '11:00 AM – 01:00 PM IST',
  dressCode:          'Casual (As per Character)',
  roleDescription:    'Rohan Verma is a 28–32 years old street-smart journalist who uncovers the dark truth behind a political conspiracy. He is intense, passionate and emotionally layered.',
  invitedOn:          '20 May 2025, 09:30 AM',
  invitedBy:          'Casting Team / Silver Paradise Productions',
  castingDirector:    'Riya Sharma',
  castingDirectorImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  castingPhone:       '+91 98765 43210',
  castingEmail:       'casting@silverparadise.com',
};


const PREPARE_ITEMS = [
  'Please prepare a 1-2 minute monologue.',
  'Carry a recent portfolio or showreel (soft copy in pen drive/mobile).',
];

const IMPORTANT_NOTES = [
  'Please arrive on time. Late entries may not be entertained.',
  'Bring a valid ID proof.',
  'This audition is confidential. Do not share audition details publicly.',
];

const BEFORE_YOU_GO = [
  'Review the role and brief',
  'Prepare your monologue',
  'Reach on time',
  'Bring your portfolio',
];

export default function AuditionsPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [notifCount,   setNotifCount]   = useState(0);
  const [msgCount,     setMsgCount]     = useState(0);

  // Inject live badge counts into sidebar items
  const navItems = SIDEBAR_ITEMS.map(item => {
    if (item.label === 'Messages')      return { ...item, badge: msgCount     || undefined }
    if (item.label === 'Notifications') return { ...item, badge: notifCount   || undefined }
    return item
  })
  const [userName,   setUserName]   = useState('My Account');
  const [avatarUrl,  setAvatarUrl]  = useState('');
  const [castingCallId, setCastingCallId] = useState('');
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name)         setUserName(u.name);
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
    } catch {}
  }, []);

  // Fetch live badge counts
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const token = u.token
      if (!token) return
      const h = { Authorization: `Bearer ${token}` }
      fetch('/api/notifications', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return
          const count = data.data?.unread_count ?? data.unread_count
          if (count != null) { setNotifCount(count); return }
          const list = data.data?.notifications ?? data.notifications ?? []
          if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length)
        }).catch(() => {})
      fetch('/api/messages/conversations', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return
          const list = data.data?.conversations ?? data.conversations ?? []
          if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length)
        }).catch(() => {})
    } catch {}
  }, [])

  const [audition,     setAudition]     = useState(AUDITION);

  const detailItems = [
    { icon: User,         label: 'Role',               value: audition.role          },
    { icon: MapPin,       label: 'Location',           value: audition.location      },
    { icon: Users,        label: 'Audition Type',      value: audition.auditionType  },
    { icon: Clock,        label: 'Reporting Time',     value: audition.reportingTime },
    { icon: CalendarDays, label: 'Date',               value: audition.date          },
    { icon: Timer,        label: 'Duration (Approx.)', value: audition.duration      },
    { icon: Clock,        label: 'Time',               value: audition.time          },
    { icon: Shirt,        label: 'Dress Code',         value: audition.dressCode     },
  ];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const SB_W = sidebarOpen ? 210 : 56;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!id) return;
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;
    fetch(`/api/auditions/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const a = data.data?.audition ?? data.audition ?? data;
        const cc = a.casting_calls ?? {};
        const ag = cc.agency_profiles ?? {};
        const scheduledAt = a.scheduled_at ? new Date(a.scheduled_at) : null;
        const modeMap: Record<string, string> = { offline: 'In-Person', online: 'Online', both: 'Hybrid' };
        // Store casting call ID for navigation
        if (cc.id) setCastingCallId(cc.id);
        setAudition(prev => ({
          ...prev,
          title:           cc.title ?? prev.title,
          type:            cc.project_type ?? prev.type,
          agency:          ag.company_name ?? prev.agency,
          agencyInitials:  (ag.company_name ?? prev.agencyInitials).slice(0, 2).toUpperCase(),
          role:            cc.role_name ?? prev.role,
          location:        a.venue_details ?? prev.location,
          auditionType:    modeMap[a.mode] ?? prev.auditionType,
          reportingTime:   scheduledAt ? scheduledAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST' : prev.reportingTime,
          date:            scheduledAt ? scheduledAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' }) : prev.date,
          duration:        `${a.duration_minutes ?? 30} Minutes`,
          time:            scheduledAt ? scheduledAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST' : prev.time,
          roleDescription: cc.role_description ?? prev.roleDescription,
          castingPhone:    ag.contact_phone ?? prev.castingPhone,
          castingEmail:    ag.contact_email ?? prev.castingEmail,
          castingDirector: ag.contact_person_name ?? prev.castingDirector,
          invitedBy:       ag.company_name ?? prev.invitedBy,
          invitedOn:       a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : prev.invitedOn,
        }));
      })
      .catch(() => {});
  }, [id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#fff' }}>

      {/* ══ HEADER ══ */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '0 24px', height: 60, flexShrink: 0,
        background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative', zIndex: 100,
      }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />

        <div style={{ flex: 1 }} />

        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent', border: `1px solid ${GOLD}`,
          color: GOLD, borderRadius: 8, padding: '0 18px', height: 36,
          fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer',
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
            {navItems.map(({ icon: Icon, label, active, badge, href }) => (
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
                  {sidebarOpen && <span style={{ fontSize: 15, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
              </div>
            ))}
          </nav>

          {/* Upgrade to Premium */}
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SHARED SCROLL WRAPPER (main + right rail) ── */}
        <div style={{ display: 'flex', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, padding: '16px 16px 16px 20px', minWidth: 0 }}>

          {/* Back link */}
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => router.back()} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.55)', fontSize: 16, fontFamily: BARLOW, padding: 0,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
            >
              <ChevronLeft size={16} /> Back to Auditions
            </button>
          </div>

          {/* ── Main invitation card ── */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>

            {/* Top: poster + core info */}
            <div style={{ display: 'flex' }}>
              <div style={{ width: 130, flexShrink: 0, position: 'relative', overflow: 'hidden', minHeight: 170 }}>
                <img
                  src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop"
                  alt="City of Dreams"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(11,15,20,0.25))' }} />
              </div>

              <div style={{ flex: 1, padding: '16px 20px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: `1px solid ${GOLD}`, borderRadius: 20, padding: '3px 12px' }}>
                    <Mail size={12} color={GOLD} />
                    <span style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>Audition Invitation</span>
                  </div>
                  <div style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: '3px 12px' }}>
                    <span style={{ fontSize: 14, color: '#A78BFA', fontWeight: 600 }}>Scheduled</span>
                  </div>
                </div>

                <h1 style={{ fontFamily: BEBAS, fontSize: 32, fontWeight: 400, letterSpacing: 1, marginBottom: 3 }}>
                  {audition.title}
                </h1>
                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>
                  {audition.type} &bull; {audition.genres}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(212,166,74,0.2)', border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: GOLD }}>
                    {audition.agencyInitials}
                  </div>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>by {audition.agency}</span>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="8" fill="#1D9BF0" />
                    <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                  Congratulations! You have been selected to audition for{' '}
                  <span style={{ color: GOLD, fontWeight: 700 }}>&apos;{audition.role}&apos;</span>{' '}
                  role in {audition.title}.
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

            {/* Audition Details */}
            <div style={{ padding: '14px 18px' }}>
              <h2 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 16, color: '#fff' }}>
                Audition Details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 20px', alignItems: 'start' }}>
                {detailItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <Icon size={14} color={GOLD} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 17, color: '#fff', fontWeight: 600, lineHeight: 1.3 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

            {/* Role Description */}
            <div style={{ padding: '14px 18px' }}>
              <h2 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 10, color: '#fff' }}>
                Role Description
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, marginBottom: 12 }}>
                {audition.roleDescription}
              </p>
                <button onClick={() => castingCallId ? router.push(`/casting-calls/${castingCallId}`) : router.push('/casting-calls')} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'transparent', border: `1px solid ${GOLD}`,
                color: GOLD, borderRadius: 8, padding: '7px 16px',
                fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,166,74,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                View Full Brief
              </button>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

            {/* What to Prepare */}
            <div style={{ padding: '14px 18px' }}>
              <h2 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 12, color: '#fff' }}>
                What to Prepare
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PREPARE_ITEMS.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(212,166,74,0.15)', border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <Check size={11} color={GOLD} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

            {/* Important Notes */}
            <div style={{ padding: '14px 18px' }}>
              <div style={{ background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <AlertCircle size={16} color={GOLD} />
                  <span style={{ fontSize: 18, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, color: GOLD }}>Important Notes</span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {IMPORTANT_NOTES.map((note, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                      <span style={{ color: GOLD, marginTop: 1 }}>•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* ── RIGHT RAIL ── */}
        <div style={{ width: 296, flexShrink: 0, display: 'flex' }}>
        <div style={{ flex: 1, padding: '16px 16px 16px 4px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Invitation Status */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
            <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 14, color: '#fff' }}>Invitation Status</h3>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CalendarDays size={17} color="#A78BFA" />
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginTop: 2 }}>
                Your audition is confirmed. We look forward to seeing you!
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>Invited On</span>
                <span style={{ fontSize: 14, color: '#fff', fontWeight: 600, textAlign: 'right' }}>{audition.invitedOn}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>Invited By</span>
                <span style={{ fontSize: 14, color: '#fff', fontWeight: 600, textAlign: 'right', maxWidth: 150 }}>{audition.invitedBy}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Response</span>
                <span style={{ fontSize: 15, color: '#4ADE80', fontWeight: 700 }}>Accepted</span>
              </div>
            </div>

            {/* View Casting Call */}
            {castingCallId && (
              <button onClick={() => router.push(`/casting-calls/${castingCallId}`)} style={{
                width: '100%', background: 'rgba(212,166,74,0.08)', border: `1px solid ${GOLD}`,
                color: GOLD, borderRadius: 8, padding: '8px 0', fontSize: 15,
                fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', transition: 'background 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,166,74,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,166,74,0.08)'}
              >
                <FileText size={14} color={GOLD} /> View Casting Call
              </button>
            )}

            {!declined ? (
              <button onClick={() => setShowDeclineConfirm(true)} style={{
                width: '100%', background: 'transparent', border: `1px solid ${RED}`,
                color: RED, borderRadius: 8, padding: '8px 0', fontSize: 15,
                fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,32,42,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Decline Invitation
              </button>
            ) : (
              <div style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, padding: '8px 0' }}>
                Invitation declined
              </div>
            )}

            {/* Decline Confirmation Modal */}
            {showDeclineConfirm && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '28px 24px', width: '100%', maxWidth: 380 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(200,32,42,0.12)', border: `1px solid ${RED}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <AlertCircle size={18} color={RED} />
                    </div>
                    <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Decline Invitation?</div>
                  </div>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, lineHeight: 1.6, marginBottom: 20 }}>
                    Are you sure you want to decline this audition invitation for <strong style={{ color: '#fff' }}>{audition.title}</strong>? This action cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setShowDeclineConfirm(false)} style={{
                      flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', borderRadius: 8, padding: '10px 0', fontSize: 15,
                      fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer',
                    }}>Cancel</button>
                    <button onClick={() => {
                      setDeclined(true);
                      setShowDeclineConfirm(false);
                      // Call API to update audition status
                      const token = JSON.parse(localStorage.getItem('ss_user') || '{}').token;
                      if (token) {
                        fetch(`/api/auditions/${id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ status: 'declined' }),
                        }).catch(() => {});
                      }
                    }} style={{
                      flex: 1, background: RED, border: 'none',
                      color: '#fff', borderRadius: 8, padding: '10px 0', fontSize: 15,
                      fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer',
                    }}>Yes, Decline</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add to Calendar */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
            <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 4, color: '#fff' }}>Add to Calendar</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>Never miss your audition</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '9px 0', cursor: 'pointer', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <span style={{ display: 'flex', gap: 1 }}>
                  <span style={{ color: '#4285F4', fontWeight: 900, fontSize: 14 }}>G</span>
                  <span style={{ color: '#EA4335', fontWeight: 900, fontSize: 14 }}>o</span>
                  <span style={{ color: '#FBBC05', fontWeight: 900, fontSize: 14 }}>o</span>
                  <span style={{ color: '#4285F4', fontWeight: 900, fontSize: 14 }}>g</span>
                  <span style={{ color: '#34A853', fontWeight: 900, fontSize: 14 }}>l</span>
                  <span style={{ color: '#EA4335', fontWeight: 900, fontSize: 14 }}>e</span>
                </span>
                <span style={{ fontSize: 15, color: '#fff', fontWeight: 600, fontFamily: BARLOW }}>Google Calendar</span>
              </button>
              <button style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '9px 0', cursor: 'pointer', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <svg width="13" height="15" viewBox="0 0 14 16" fill="none">
                  <path d="M10.5 0.5C10.5 2.1 9.1 3.5 7.5 3.5C5.9 3.5 4.5 2.1 4.5 0.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                  <rect x="0.75" y="3" width="12.5" height="12.5" rx="2.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                  <line x1="7" y1="6.5" x2="7" y2="12.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="4" y1="9.5" x2="10" y2="9.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 15, color: '#fff', fontWeight: 600, fontFamily: BARLOW }}>Apple Calendar</span>
              </button>
            </div>
          </div>

          {/* Need Help */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
            <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 4, color: '#fff' }}>Need Help?</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.5 }}>
              Contact the casting team for any queries or changes.
            </p>

            <div style={{ background: BG3, borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <img src={audition.castingDirectorImg} alt={audition.castingDirector}
                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{audition.castingDirector}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Casting Director</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={12} color={GOLD} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{audition.castingPhone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Mail size={12} color={GOLD} />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{audition.castingEmail}</span>
                </div>
              </div>
            </div>

            <button onClick={() => router.push('/messages')} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', background: GOLD, border: 'none',
              color: '#000', borderRadius: 8, padding: '9px 0',
              fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <MessageCircle size={14} />
              Message Casting Team
            </button>
          </div>

          {/* Before You Go */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
            <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.3, marginBottom: 14, color: '#fff' }}>Before You Go</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {BEFORE_YOU_GO.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(212,166,74,0.15)', border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={11} color={GOLD} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                </div>
              ))}
            </div>
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