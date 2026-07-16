'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Wallet,
  Database, Settings, ScrollText, Bell, ChevronRight,
  Tag, MapPin,
  TrendingUp, Download, UserPlus, AlertTriangle,
  MoreVertical, ClipboardCheck, BadgeCheck, UserCheck,
  BellRing, Ticket, KeyRound, ChevronLeft, Menu,
  MessageSquare, ChevronDown,
} from 'lucide-react';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';

/* ─── Design tokens ──────────────────────────────────────────── */
const BG       = '#0D1117';
const BG2      = '#131720';
const BG3      = '#181E2A';
const BG4      = '#1C2338';
const GOLD     = '#D4A64A';
const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';
const BEBAS    = "'Bebas Neue', sans-serif";
const BARLOW   = "'Barlow Condensed', sans-serif";
const GREEN    = '#22C55E';
const RED      = '#EF4444';
const BLUE     = '#3B82F6';
const PURPLE   = '#8B5CF6';
const ORANGE   = '#F97316';
const TEAL     = '#14B8A6';

/* ─── Sidebar nav ────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard',              active: true  },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                                 },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'                   },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'                   },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'                          },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'                               },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                                 },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'                         },
  { icon: Tag,             label: 'Pricing Management',       href: '/admin/pricing'                               },
  { icon: MapPin,          label: 'Location Management',      href: '/admin/locations'                             },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'                        },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                                   },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'                         },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'                             },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'                               },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                                 },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                                 },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'                              },
];

const PROFILE_MENU = [
  { label: 'My Profile',                href: '/admin/profile'   },
  { label: 'Account Settings',          href: '/admin/settings'  },
  { label: 'Security Settings',         href: '/admin/settings'  },
  { label: 'Notification Preferences',  href: '/admin/notifications' },
  { label: 'Activity Logs',             href: '/admin/audit'     },
  { label: 'Help & Support',            href: '/contact'         },
  { label: 'Logout',                    href: '/login'           },
];

/* ─── Stats ──────────────────────────────────────────────────── */
const STATS = [
  { label: 'Total Aspirants',       value: '45,892',     delta: '+12.5%', sub: 'vs last 7 days', iconBg: 'rgba(139,92,246,0.15)', iconColor: PURPLE, Icon: Users     },
  { label: 'Total Companies',       value: '2,543',      delta: '+8.7%',  sub: 'vs last 7 days', iconBg: 'rgba(59,130,246,0.15)',  iconColor: BLUE,   Icon: Building2 },
  { label: 'Active Casting Calls',  value: '1,246',      delta: '+15.3%', sub: 'vs last 7 days', iconBg: 'rgba(249,115,22,0.15)',  iconColor: ORANGE, Icon: Megaphone },
  { label: 'Total Applications',    value: '18,765',     delta: '+10.2%', sub: 'vs last 7 days', iconBg: 'rgba(20,184,166,0.15)',  iconColor: TEAL,   Icon: FileText  },
  { label: 'Total Revenue',         value: '₹48,75,320', delta: '+16.1%', sub: 'vs last 7 days', iconBg: 'rgba(34,197,94,0.15)',   iconColor: GREEN,  Icon: Wallet    },
];

/* ─── Chart data ─────────────────────────────────────────────── */
const CHART_LABELS   = ['May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25', 'May 26', 'May 27'];
const PLATFORM_SERIES = [
  { name: 'Aspirants',     color: PURPLE, data: [13000, 14200, 14800, 15500, 17200, 18100, 18700, 19000] },
  { name: 'Companies',     color: BLUE,   data: [8500,  9200,  9800,  10400, 11200, 12000, 12300, 12600] },
  { name: 'Casting Calls', color: ORANGE, data: [1200,  1800,  2400,  2800,  3200,  3800,  4200,  4600]  },
  { name: 'Applications',  color: TEAL,   data: [8000,  9000,  9800,  10500, 11200, 12000, 12600, 13100] },
];

/* ─── Registrations donut ────────────────────────────────────── */
const REG_DATA = [
  { label: 'Aspirants',         value: 45892, pct: 75.2, color: PURPLE },
  { label: 'Companies',         value: 2543,  pct: 4.2,  color: BLUE   },
  { label: 'Casting Directors', value: 1250,  pct: 2.0,  color: ORANGE },
  { label: 'Others',            value: 2750,  pct: 18.6, color: TEAL   },
];

/* ─── Quick actions ──────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { icon: UserPlus,       label: 'Add New Admin',         href: '/admin/users',                badge: null },
  { icon: Megaphone,      label: 'Create Announcement',   href: '/admin/cms',                  badge: null },
  { icon: ClipboardCheck, label: 'Approve Pending Items', href: '/admin/talent-verification',  badge: 42   },
  { icon: BarChart2,      label: 'View Reports',          href: '/admin/analytics',            badge: null },
  { icon: Tag,            label: 'Manage Pricing',        href: '/admin/pricing',              badge: null },
  { icon: MapPin,         label: 'Manage Locations',      href: '/admin/locations',            badge: null },
  { icon: Settings,       label: 'System Settings',       href: '/admin/settings',             badge: null },
];

/* ─── Recent registrations ───────────────────────────────────── */
const RECENT_REGS = [
  { name: 'Ananya Sharma',    email: 'ananya.sharma@email.com', type: 'Aspirant', date: 'May 27, 2024', time: '10:24 AM', status: 'Active',  avatar: 'AS' },
  { name: 'DreamWorks Films', email: 'info@dreamworks.com',     type: 'Company',  date: 'May 27, 2024', time: '09:47 AM', status: 'Active',  avatar: 'DW' },
  { name: 'Rohit Verma',      email: 'rohit.verma@email.com',   type: 'Aspirant', date: 'May 27, 2024', time: '09:15 AM', status: 'Active',  avatar: 'RV' },
  { name: 'StarCast Agency',  email: 'contact@starcast.com',    type: 'Company',  date: 'May 27, 2024', time: '08:59 AM', status: 'Pending', avatar: 'SC' },
  { name: 'Neha Kapoor',      email: 'neha.kapoor@email.com',   type: 'Aspirant', date: 'May 27, 2024', time: '08:30 AM', status: 'Active',  avatar: 'NK' },
];

/* ─── Pending approvals ──────────────────────────────────────── */
const PENDING = [
  { icon: BadgeCheck,    iconBg: 'rgba(249,115,22,0.15)', iconColor: ORANGE, label: 'Aspirant Verifications', sub: 'New profiles awaiting verification',     count: 18 },
  { icon: Building2,     iconBg: 'rgba(59,130,246,0.15)', iconColor: BLUE,   label: 'Company Verifications',  sub: 'Company accounts awaiting verification', count: 12 },
  { icon: Megaphone,     iconBg: 'rgba(212,166,74,0.15)', iconColor: GOLD,   label: 'Casting Calls',          sub: 'Casting calls awaiting approval',        count: 7  },
  { icon: AlertTriangle, iconBg: 'rgba(239,68,68,0.15)',  iconColor: RED,    label: 'Reported Content',       sub: 'Content flagged by users',               count: 5  },
];

/* ─── Revenue bars ───────────────────────────────────────────── */
const REV_BARS = [18, 28, 30, 35, 38, 42, 44, 46];

/* ─── Recent activity ────────────────────────────────────────── */
const ACTIVITY = [
  { iconBg: 'rgba(139,92,246,0.15)', iconColor: PURPLE, icon: Megaphone,   text: 'New casting call "Hero Role for Web Series" created by Vision Entertainment', time: '5 mins ago'  },
  { iconBg: 'rgba(59,130,246,0.15)', iconColor: BLUE,   icon: BadgeCheck,  text: 'Aspirant profile of Raj Malhotra has been verified',                           time: '15 mins ago' },
  { iconBg: 'rgba(34,197,94,0.15)',  iconColor: GREEN,  icon: Wallet,      text: 'Payment of ₹12,999 received from DreamWorks Films',                            time: '1 hour ago'  },
  { iconBg: 'rgba(239,68,68,0.15)',  iconColor: RED,    icon: Flag,        text: 'Video "Showreel_2024.mp4" reported by a user',                                  time: '2 hours ago' },
  { iconBg: 'rgba(20,184,166,0.15)', iconColor: TEAL,   icon: Building2,   text: 'New company Modern Films Agency registered',                                    time: '3 hours ago' },
];

/* ─── SVG Platform Overview Line Chart ──────────────────────── */
function PlatformChart() {
  const W = 560, H = 300;
  const pl = 48, pb = 268, pr = W - 8, pt = 12;
  const pw = pr - pl, ph = pb - pt;
  const maxY = 25000;
  const gridY = [0, 5000, 10000, 15000, 20000, 25000];
  const mx = (i: number) => pl + (i / (CHART_LABELS.length - 1)) * pw;
  const my = (v: number) => pb - (v / maxY) * ph;

  function smoothPath(data: number[]): string {
    const pts = data.map((v, i) => [mx(i), my(v)] as [number, number]);
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = pts[i][0] + (pts[i+1][0] - (pts[i-1]?.[0] ?? pts[i][0])) / 6;
      const cp1y = pts[i][1] + (pts[i+1][1] - (pts[i-1]?.[1] ?? pts[i][1])) / 6;
      const nx2  = pts[i+2]?.[0] ?? pts[i+1][0] + (pts[i+1][0] - pts[i][0]);
      const ny2  = pts[i+2]?.[1] ?? pts[i+1][1] + (pts[i+1][1] - pts[i][1]);
      const cp2x = pts[i+1][0] - (nx2 - pts[i][0]) / 6;
      const cp2y = pts[i+1][1] - (ny2 - pts[i][1]) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i+1][0]} ${pts[i+1][1]}`;
    }
    return d;
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {gridY.map(v => (
        <g key={v}>
          <line x1={pl} y1={my(v)} x2={pr} y2={my(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={pl-6} y={my(v)+4} fill="rgba(255,255,255,0.28)" fontSize={10} textAnchor="end" fontFamily={BARLOW}>{v===0?'0':`${v/1000}K`}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      {CHART_LABELS.map((l, i) => (
        <text key={i} x={mx(i)} y={pb+18} fill="rgba(255,255,255,0.3)" fontSize={10} textAnchor="middle" fontFamily={BARLOW}>{l}</text>
      ))}
      {PLATFORM_SERIES.map(s => (
        <g key={s.name}>
          <path d={smoothPath(s.data)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {s.data.map((v, i) => <circle key={i} cx={mx(i)} cy={my(v)} r={3} fill={s.color} stroke={BG3} strokeWidth={1.5} />)}
        </g>
      ))}
    </svg>
  );
}

/* ─── SVG Registrations Donut ────────────────────────────────── */
function RegDonut() {
  const cx = 90, cy = 90, R = 72, r = 48;
  const total = REG_DATA.reduce((s, d) => s + d.pct, 0);
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const pt    = (ang: number, rad: number) => [cx + rad * Math.cos(toRad(ang)), cy + rad * Math.sin(toRad(ang))];
  let start = -90;
  const arcs = REG_DATA.map(seg => {
    const sweep = (seg.pct / total) * 360;
    const end = start + sweep;
    const large = sweep > 180 ? 1 : 0;
    const [x1,y1]=pt(start,R); const [x2,y2]=pt(end,R);
    const [x3,y3]=pt(end,r);   const [x4,y4]=pt(start,r);
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    start = end + 1.5;
    return { ...seg, d };
  });
  return (
    <svg viewBox="0 0 180 180" style={{ width: 180, height: 180, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r-2} fill={BG3} />
      {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} />)}
      <text x={cx} y={cy-8}  textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={11} fontFamily={BARLOW}>Total</text>
      <text x={cx} y={cy+10} textAnchor="middle" fill="#F5F5F5" fontSize={22} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>48,435</text>
    </svg>
  );
}

/* ─── SVG Revenue Bar Chart ──────────────────────────────────── */
function RevenueChart() {
  const W = 320, H = 180;
  const pl = 36, pb = 152, pr = W-8, pt = 10;
  const pw = pr-pl, ph = pb-pt;
  const maxY = 60;
  const gridY = [0,10,20,30,40,50,60];
  const barW = (pw / REV_BARS.length) * 0.55;
  const gap  = pw / REV_BARS.length;
  const bx = (i: number) => pl + i*gap + (gap-barW)/2;
  const by = (v: number) => pb - (v/maxY)*ph;
  const bh = (v: number) => (v/maxY)*ph;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {gridY.map(v => (
        <g key={v}>
          <line x1={pl} y1={by(v)} x2={pr} y2={by(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={pl-6} y={by(v)+4} fill="rgba(255,255,255,0.28)" fontSize={9} textAnchor="end" fontFamily={BARLOW}>{v===0?'0':`${v}L`}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      {REV_BARS.map((v, i) => (
        <g key={i}>
          <rect x={bx(i)} y={by(v)} width={barW} height={bh(v)} rx={3} fill={GOLD} opacity={0.85} />
          <text x={bx(i)+barW/2} y={pb+14} fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="middle" fontFamily={BARLOW}>
            {CHART_LABELS[i]?.replace('May ','')}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const SB_W = sidebarOpen ? 220 : 52;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV — matches agency pattern exactly ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        {/* ADMIN badge */}
        <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN</span>
        </div>
        <div style={{ flex: 1 }} />
        {/* Messages */}
        <div onClick={() => router.push('/admin/support')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>8</div>
        </div>
        {/* Bell */}
        <div onClick={() => router.push('/admin/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>3</div>
        </div>
        {/* Admin avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(212,166,74,0.38)', flexShrink: 0 }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>Super Admin</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 210, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Admin ID</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: RED }}>ADM000001</span>
                </div>
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
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

        {/* ── COLLAPSIBLE SIDEBAR — same pattern as agency pages ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease', scrollbarWidth: 'none' }}>
          {/* Toggle */}
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {/* Admin identity block */}
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(212,166,74,0.25)', flexShrink: 0 }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Super Admin</div>
                <div style={{ fontSize: 14, color: RED, fontWeight: 600 }}>ADM000001</div>
              </div>
            </div>
          )}
          {/* Nav */}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? GOLD_DIM : 'transparent', border: active && sidebarOpen ? `1px solid ${GOLD_BDR}` : '1px solid transparent', borderLeft: sidebarOpen && active ? `3px solid ${GOLD}` : sidebarOpen ? '3px solid transparent' : 'none', gap: sidebarOpen ? 9 : 0 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? GOLD_DIM : 'transparent'; }}
              >
                <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                {sidebarOpen && <span style={{ fontSize: 14, color: active ? GOLD : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap', flex: 1 }}>{label}</span>}
                {sidebarOpen && active && <ChevronRight size={12} color={GOLD} opacity={0.6} />}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── SCROLLABLE CONTENT — original layout preserved exactly ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Welcome row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, marginBottom: 3, fontWeight: 400 }}>Welcome back, Admin 👋</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Here's what's happening on SilverScreens today.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 12px', fontSize: 14, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                <span>📅</span><span>May 20 – May 27, 2024</span>
                <ChevronRight size={11} color="rgba(255,255,255,0.35)" style={{ transform: 'rotate(90deg)' }} />
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD_BDR}`, color: GOLD, borderRadius: 8, padding: '7px 14px', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Download size={13} color={GOLD} /> Export Report
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ flex: 1, borderRadius: 12, padding: '14px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.Icon size={17} color={s.iconColor} />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, fontFamily: BEBAS, letterSpacing: 0.5 }}>{s.value}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: GREEN, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp size={10} color={GREEN} /> {s.delta}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Middle row: Chart + Donut + Quick Actions */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
            {/* Platform Overview */}
            <div style={{ flex: 5, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Platform Overview</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: BG4, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Last 7 Days</span>
                  <ChevronRight size={10} color="rgba(255,255,255,0.35)" style={{ transform: 'rotate(90deg)' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' as const }}>
                {PLATFORM_SERIES.map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 3, borderRadius: 2, background: s.color }} />
                    <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>{s.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: '100%', height: 280 }}><PlatformChart /></div>
            </div>

            {/* Registrations */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Registrations</span>
                <span onClick={() => router.push('/admin/users')} style={{ fontSize: 14, color: GOLD, fontWeight: 600, cursor: 'pointer' }}>View Details</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><RegDonut /></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {REG_DATA.map(r => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>{r.label}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{r.value.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginLeft: 4 }}>({r.pct}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {QUICK_ACTIONS.map(({ icon: Icon, label, href, badge }) => (
                  <div key={label} onClick={() => router.push(href)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 8, cursor: 'pointer', background: BG4, border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} color="rgba(255,255,255,0.55)" />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 500, flex: 1 }}>{label}</span>
                    {badge !== null && <div style={{ background: GOLD, color: '#000', borderRadius: 8, fontSize: 14, fontWeight: 700, padding: '1px 7px' }}>{badge}</div>}
                    <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>

            {/* Recent Registrations */}
            <div style={{ flex: 5, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 0 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 18px', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Recent Registrations</span>
                <span onClick={() => router.push('/admin/users')} style={{ fontSize: 14, color: GOLD, fontWeight: 600, cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.4fr 1fr 36px', padding: '6px 18px', gap: 8, borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                {['USER','TYPE','DATE','STATUS',''].map((h, i) => <span key={i} style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const }}>{h}</span>)}
              </div>
              {RECENT_REGS.map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.4fr 1fr 36px', padding: '10px 18px', gap: 8, alignItems: 'center', borderBottom: i < RECENT_REGS.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: r.type==='Aspirant'?'rgba(139,92,246,0.2)':'rgba(59,130,246,0.2)', border: `1px solid ${r.type==='Aspirant'?'rgba(139,92,246,0.3)':'rgba(59,130,246,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: r.type==='Aspirant'?PURPLE:BLUE }}>{r.avatar}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.email}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: r.type==='Aspirant'?'rgba(139,92,246,0.15)':'rgba(59,130,246,0.15)', color: r.type==='Aspirant'?PURPLE:BLUE, border: `1px solid ${r.type==='Aspirant'?'rgba(139,92,246,0.25)':'rgba(59,130,246,0.25)'}`, display: 'inline-block' }}>{r.type}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{r.date}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)' }}>{r.time}</div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: r.status==='Active'?'rgba(34,197,94,0.15)':'rgba(212,166,74,0.15)', color: r.status==='Active'?GREEN:GOLD, border: `1px solid ${r.status==='Active'?'rgba(34,197,94,0.25)':GOLD_BDR}`, display: 'inline-block' }}>{r.status}</span>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><MoreVertical size={14} color="rgba(255,255,255,0.3)" style={{ cursor: 'pointer' }} /></div>
                </div>
              ))}
            </div>

            {/* Pending Approvals */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Pending Approvals</span>
                <span onClick={() => router.push('/admin/talent-verification')} style={{ fontSize: 14, color: GOLD, fontWeight: 600, cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PENDING.map(({ icon: Icon, iconBg, iconColor, label, sub, count }, i) => (
                  <div key={i} onClick={() => router.push('/admin/talent-verification')} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: BG4, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={15} color={iconColor} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 1 }}>{label}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
                    </div>
                    <div style={{ background: count>=10?'rgba(239,68,68,0.15)':GOLD_DIM, color: count>=10?RED:GOLD, border: `1px solid ${count>=10?'rgba(239,68,68,0.3)':GOLD_BDR}`, borderRadius: 8, padding: '2px 8px', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Overview */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Revenue Overview</span>
                <span onClick={() => router.push('/admin/analytics')} style={{ fontSize: 14, color: GOLD, fontWeight: 600, cursor: 'pointer' }}>View Details</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: BEBAS, letterSpacing: 1 }}>₹48,75,320</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, color: GREEN, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}><TrendingUp size={10} color={GREEN} /> +16.1%</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>vs last 7 days</span>
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}><RevenueChart /></div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Recent Activity</span>
              <span onClick={() => router.push('/admin/audit')} style={{ fontSize: 14, color: GOLD, fontWeight: 600, cursor: 'pointer' }}>View All Logs</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {ACTIVITY.map(({ iconBg, iconColor, icon: Icon, text, time }, i) => (
                <div key={i} style={{ flex: 1, borderRadius: 10, padding: '12px 14px', background: BG4, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={14} color={iconColor} />
                  </div>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, flex: 1 }}>{text}</p>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}