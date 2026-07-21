'use client';

import AspirantHeader from '@/components/layout/AspirantHeader'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {

  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark,
  Star, Bell, ChevronRight, ChevronLeft, Menu, ChevronDown,
  Eye, Search, Send, Award, Download, CalendarDays,
  TrendingUp, MapPin, Users, BarChart2, Activity,
  CheckCircle, Clock, XCircle, Minus, ArrowUpRight,
} from 'lucide-react';

/* ─── Design tokens — identical to all other aspirant pages ─── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";
const GREEN  = '#22C55E';

/* ─── Sidebar ─── */
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard' },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications' },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',         badge: 2 },
  { icon: Mic2,            label: 'Auditions',             href: '/auditions' },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended' },
  { icon: Bell,            label: 'Notifications',        href: '/notifications'},
];

const DROPDOWN_LINKS = [
  { label: 'My Profile',     href: '/profile' },
  { label: 'Subscription',   href: '/dashboard/subscription' },
  { label: 'Analytics',      href: '/analytics' },
  { label: 'Calendar',       href: '/calendar' },
  { label: 'Settings',       href: '/settings' },
  { label: 'Help & Support', href: '/contact' },
  { label: 'Logout',         href: '/login' },
];

/* ─── Data ─── */
const STAT_CARDS = [
  { icon: Eye,      label: 'Profile Views',      value: '2,543', change: '+18.6%', period: 'vs 24 Apr – 23 May', color: '#A78BFA' },
  { icon: Search,   label: 'Profile Searches',   value: '1,078', change: '+14.2%', period: 'vs 24 Apr – 23 May', color: '#60A5FA' },
  { icon: Send,     label: 'Applications Sent',  value: '18',    change: '+5.9%',  period: 'vs 24 Apr – 23 May', color: '#34D399' },
  { icon: Star,     label: 'Shortlisted',        value: '7',     change: '+75%',   period: 'vs 24 Apr – 23 May', color: GOLD },
  { icon: MessageSquare, label: 'Messages Received', value: '23', change: '+21.1%', period: 'vs 24 Apr – 23 May', color: '#F97316' },
];

// Chart data points
const CHART_DATA = [
  { x: '24 May', y: 82 }, { x: '25 May', y: 88 }, { x: '26 May', y: 85 },
  { x: '27 May', y: 90 }, { x: '28 May', y: 95 }, { x: '29 May', y: 100 },
  { x: '30 May', y: 92 }, { x: '31 May', y: 98 }, { x: '1 Jun',  y: 105 },
  { x: '2 Jun',  y: 110 }, { x: '3 Jun', y: 108 }, { x: '4 Jun', y: 115 },
  { x: '5 Jun',  y: 120 }, { x: '6 Jun', y: 125 }, { x: '7 Jun', y: 130 },
  { x: '8 Jun',  y: 128 }, { x: '9 Jun', y: 145 }, { x: '10 Jun', y: 160 },
  { x: '11 Jun', y: 168 }, { x: '12 Jun', y: 155 }, { x: '13 Jun', y: 140 },
  { x: '14 Jun', y: 132 }, { x: '15 Jun', y: 125 }, { x: '16 Jun', y: 118 },
  { x: '17 Jun', y: 122 }, { x: '18 Jun', y: 128 }, { x: '19 Jun', y: 120 },
  { x: '20 Jun', y: 130 }, { x: '21 Jun', y: 115 }, { x: '22 Jun', y: 108 },
  { x: '23 Jun', y: 112 }, { x: '24 Jun', y: 105 },
];

const SOURCE_DATA = [
  { label: 'Search Results',     pct: 45, color: '#A78BFA' },
  { label: 'Casting Call Page',  pct: 25, color: '#60A5FA' },
  { label: 'Direct Profile Link',pct: 15, color: '#34D399' },
  { label: 'Recommended',        pct: 10, color: GOLD },
  { label: 'Others',             pct: 5,  color: '#F97316' },
];

const LOCATION_DATA = [
  { city: 'Mumbai, India',    pct: 42 },
  { city: 'Delhi, India',     pct: 18 },
  { city: 'Bengaluru, India', pct: 12 },
  { city: 'Chennai, India',   pct: 8  },
  { city: 'Kolkata, India',   pct: 5  },
  { city: 'Other Locations',  pct: 15 },
];

const VISIBILITY_SCORES = [
  { label: 'Profile Completion', score: 95 },
  { label: 'Media Quality',      score: 82 },
  { label: 'Response Rate',      score: 78 },
  { label: 'Application Activity', score: 68 },
  { label: 'Profile Freshness',  score: 90 },
];

const APP_PERFORMANCE = [
  { icon: Send,         label: 'Total Applications Sent', value: 18, color: '' },
  { icon: Clock,        label: 'Under Review',            value: 11, color: '#60A5FA' },
  { icon: Star,         label: 'Shortlisted',             value: 7,  color: GREEN },
  { icon: XCircle,      label: 'Rejected',                value: 0,  color: RED },
  { icon: Minus,        label: 'Withdrawn',               value: 0,  color: 'rgba(255,255,255,0.4)' },
];

const ACTIVITY_LOG = [
  { date: '24 Jun 2026, 10:15 AM', activity: 'Profile Viewed',       details: 'Someone viewed your profile',                           status: 'New',          statusColor: '#60A5FA' },
  { date: '24 Jun 2026, 09:42 AM', activity: 'Application Submitted', details: 'Applied for "Lead Actor" – DreamWorks Casting',        status: 'Under Review', statusColor: '#F97316' },
  { date: '23 Jun 2026, 06:30 PM', activity: 'Profile Viewed',       details: 'Someone viewed your profile',                           status: 'New',          statusColor: '#60A5FA' },
  { date: '22 Jun 2026, 04:18 PM', activity: 'Shortlisted',          details: 'You have been shortlisted for "Music Video Shoot"',     status: 'Shortlisted',  statusColor: GREEN },
  { date: '21 Jun 2026, 11:07 AM', activity: 'Message Received',     details: 'Casting Director sent you a message',                   status: 'Unread',       statusColor: GOLD },
];

const QUICK_INSIGHTS = [
  { icon: TrendingUp, text: 'Your profile views increased by 18.6% compared to last month.',       color: GREEN },
  { icon: MapPin,     text: 'You are getting more visibility from Mumbai and Delhi.',               color: '#60A5FA' },
  { icon: Star,       text: 'Great work! Your shortlist rate is higher than 72% of other aspirants.', color: GOLD },
];

const DATE_RANGES = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'Custom Range'];

/* ─── SVG chart helpers ─── */
function buildChartPath(data: typeof CHART_DATA, w: number, h: number, pad: number) {
  const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (w - pad * 2));
  const min = Math.min(...data.map(d => d.y));
  const max = Math.max(...data.map(d => d.y));
  const ys = data.map(d => pad + ((max - d.y) / (max - min + 1)) * (h - pad * 2));
  const line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const fill = `${line} L${xs[xs.length - 1]},${h - pad} L${xs[0]},${h - pad} Z`;
  return { line, fill, xs, ys };
}

function DonutChart({ data, size = 130 }: { data: { pct: number; color: string }[]; size?: number }) {
  const r = size / 2 - 14;
  const cx = size / 2, cy = size / 2;
  let cumAngle = -90;
  const slices = data.map(d => {
    const startAngle = cumAngle;
    const sweep = (d.pct / 100) * 360;
    cumAngle += sweep;
    const gap = 2;
    const s = startAngle + gap / 2;
    const sw = sweep - gap;
    const rad = (a: number) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(s));
    const y1 = cy + r * Math.sin(rad(s));
    const x2 = cx + r * Math.cos(rad(s + sw));
    const y2 = cy + r * Math.sin(rad(s + sw));
    const large = sw > 180 ? 1 : 0;
    return { path: `M${cx},${cy} L${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} Z`, color: d.color };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r - 10} fill={BG3} />
      {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} opacity={0.85} />)}
      <circle cx={cx} cy={cy} r={r - 20} fill={BG3} />
    </svg>
  );
}

function GenderDonut({ size = 130 }: { size?: number }) {
  const r = size / 2 - 14, cx = size / 2, cy = size / 2;
  const malePct = 62;
  const sweep = (malePct / 100) * 360;
  const rad = (a: number) => (a * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(-90));
  const y1 = cy + r * Math.sin(rad(-90));
  const x2 = cx + r * Math.cos(rad(-90 + sweep));
  const y2 = cy + r * Math.sin(rad(-90 + sweep));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#60A5FA" strokeWidth="22" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F472B6" strokeWidth="22"
        strokeDasharray={`${(2 * Math.PI * r * malePct) / 100} ${2 * Math.PI * r}`}
        strokeDashoffset={2 * Math.PI * r * 0.25} strokeLinecap="butt"
      />
      <circle cx={cx} cy={cy} r={r - 14} fill={BG3} />
    </svg>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName,   setUserName]   = useState('My Account');
  const [avatarUrl,  setAvatarUrl]  = useState('');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name)         setUserName(u.name);
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
    } catch {}
  }, []);
  const [dateOpen,     setDateOpen]     = useState(false);
  const [dateRange,    setDateRange]    = useState('24 May 2026 – 24 Jun 2026');
  const [chartMetric,  setChartMetric]  = useState('Profile Views');

  const SB_W = sidebarOpen ? 210 : 56;

  const W = 640, H = 180, PAD = 12;
  const { line, fill, xs, ys } = buildChartPath(CHART_DATA, W, H, PAD);
  const xLabels = [0, 6, 12, 18, 24, 30].filter(i => i < CHART_DATA.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ HEADER ══ */}
      <AspirantHeader />

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(212,166,74,0.25)', flexShrink: 0 }}>
                <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap' }}>{userName}</div>
                <div style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>ASP03230158</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: '10px 0' }}>
            {SIDEBAR_ITEMS.map(({ icon: Icon, label, href, badge }: any) => (
              <div key={label} title={!sidebarOpen ? label : undefined} onClick={() => router.push(href)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '9px 16px' : '10px 0', cursor: 'pointer', background: 'transparent', borderLeft: '3px solid transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                  <Icon size={15} color="rgba(255,255,255,0.45)" strokeWidth={1.8} />
                  {sidebarOpen && <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
              </div>
            ))}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 600, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/dashboard/subscription')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SHARED SCROLL ── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex' }}>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0, padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Page header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1.5, fontWeight: 400, color: GOLD, marginBottom: 3 }}>Analytics</h1>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Track your profile performance, views, applications and engagement.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Date range picker */}
                <div style={{ position: 'relative' }}>
                  <div onClick={() => setDateOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG2, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>
                    <CalendarDays size={14} color={GOLD} />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{dateRange}</span>
                    <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ transform: dateOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                  </div>
                  {dateOpen && (
                    <>
                      <div onClick={() => setDateOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
                      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 180 }}>
                        {DATE_RANGES.map(r => (
                          <div key={r} onClick={() => { setDateRange(r === 'Custom Range' ? '24 May 2026 – 24 Jun 2026' : r); setDateOpen(false); }}
                            style={{ padding: '9px 14px', fontSize: 14, cursor: 'pointer', color: 'rgba(255,255,255,0.75)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >{r}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button onClick={() => alert('Report export would start here.')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <Download size={14} /> Export Report
                </button>
              </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: 10 }}>
              {STAT_CARDS.map(({ icon: Icon, label, value, change, period, color }) => (
                <div key={label} style={{ flex: 1, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={15} color={color} />
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                  </div>
                  <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#fff', letterSpacing: 0.5, lineHeight: 1, marginBottom: 6 }}>{value}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <ArrowUpRight size={12} color={GREEN} />
                    <span style={{ fontSize: 13, color: GREEN, fontWeight: 700 }}>{change}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{period}</div>
                </div>
              ))}
            </div>

            {/* Profile Views Overview chart */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 2 }}>Profile Views Overview</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Daily profile views for the selected period.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{chartMetric}</span>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
                </div>
              </div>
              {/* SVG chart */}
              <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
                <svg viewBox={`0 0 ${W} ${H + 24}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
                  {/* Y grid lines */}
                  {[0, 40, 80, 120, 160, 200].map((val, i) => {
                    const y = PAD + ((200 - val) / 200) * (H - PAD * 2);
                    return (
                      <g key={i}>
                        <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <text x={PAD} y={y - 3} fill="rgba(255,255,255,0.3)" fontSize="11">{val}</text>
                      </g>
                    );
                  })}
                  {/* Area fill */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GOLD} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={GOLD} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d={fill} fill="url(#chartGrad)" />
                  {/* Line */}
                  <path d={line} fill="none" stroke={GOLD} strokeWidth="2" strokeLinejoin="round" />
                  {/* Data points */}
                  {xs.map((x, i) => i % 4 === 0 && (
                    <circle key={i} cx={x} cy={ys[i]} r="4" fill={GOLD} stroke={BG2} strokeWidth="2" />
                  ))}
                  {/* X labels */}
                  {xLabels.map(i => (
                    <text key={i} x={xs[i]} y={H + 18} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="11">
                      {CHART_DATA[i].x}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Views by Source / Location / Gender */}
            <div style={{ display: 'flex', gap: 14 }}>

              {/* Views by Source */}
              <div style={{ flex: 1, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontFamily: BEBAS, fontSize: 19, letterSpacing: 0.5, color: GOLD, marginBottom: 4 }}>Views by Source</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Where your profile views come from.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <DonutChart data={SOURCE_DATA} size={110} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    {SOURCE_DATA.map(({ label, pct, color }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', flex: 1 }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => alert('Source details view coming soon.')} style={{ marginTop: 14, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '9px 0', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <BarChart2 size={13} /> View Source Details
                </button>
              </div>

              {/* Views by Location */}
              <div style={{ flex: 1, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontFamily: BEBAS, fontSize: 19, letterSpacing: 0.5, color: GOLD, marginBottom: 4 }}>Views by Location</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Top cities where your profile is viewed.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {LOCATION_DATA.map(({ city, pct }) => (
                    <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={12} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city}</span>
                      <div style={{ width: 80, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: GOLD }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', width: 32, textAlign: 'right', flexShrink: 0 }}>{pct}%</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => alert('All locations view coming soon.')} style={{ marginTop: 14, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '9px 0', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <MapPin size={13} /> View All Locations
                </button>
              </div>

              {/* Gender Breakdown */}
              <div style={{ flex: 1, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ fontFamily: BEBAS, fontSize: 19, letterSpacing: 0.5, color: GOLD, marginBottom: 4 }}>Gender Breakdown</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Gender distribution of profile viewers.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <GenderDonut size={120} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={16} color="#60A5FA" />
                      </div>
                      <div>
                        <div style={{ fontFamily: BEBAS, fontSize: 22, color: '#fff', lineHeight: 1 }}>62%</div>
                        <div style={{ fontSize: 13, color: '#60A5FA' }}>● Male</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(244,114,182,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={16} color="#F472B6" />
                      </div>
                      <div>
                        <div style={{ fontFamily: BEBAS, fontSize: 22, color: '#fff', lineHeight: 1 }}>38%</div>
                        <div style={{ fontSize: 13, color: '#F472B6' }}>● Female</div>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => alert('Demographics view coming soon.')} style={{ marginTop: 14, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '9px 0', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <Users size={13} /> View Demographics
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 2 }}>Recent Activity</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Your recent profile and application activity.</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 2.5fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 8, marginBottom: 4 }}>
                {['DATE', 'ACTIVITY', 'DETAILS', 'STATUS'].map(h => (
                  <div key={h} style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5, padding: '0 8px' }}>{h}</div>
                ))}
              </div>
              {ACTIVITY_LOG.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 2.5fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '10px 0', alignItems: 'center' }}>
                  <div style={{ fontSize: 14, padding: '0 8px', color: 'rgba(255,255,255,0.6)' }}>{row.date}</div>
                  <div style={{ fontSize: 15, padding: '0 8px', fontWeight: 600 }}>{row.activity}</div>
                  <div style={{ fontSize: 14, padding: '0 8px', color: 'rgba(255,255,255,0.6)' }}>{row.details}</div>
                  <div style={{ padding: '0 8px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: row.statusColor }}>{row.status}</span>
                  </div>
                </div>
              ))}
              <button onClick={() => alert('Full activity log coming soon.')} style={{ marginTop: 12, background: 'none', border: 'none', color: GOLD, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                View All Activity <ChevronRight size={14} />
              </button>
            </div>

          </div>

          {/* ── RIGHT RAIL ── */}
          <div style={{ width: 280, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Profile Visibility Score */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 14 }}>Profile Visibility Score</div>
              {/* Circular score */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <div style={{ position: 'relative', width: 110, height: 110 }}>
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                    <circle cx="55" cy="55" r="44" fill="none" stroke={GREEN} strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 44 * 0.86} ${2 * Math.PI * 44}`}
                      strokeLinecap="round" transform="rotate(-90 55 55)"
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: BEBAS, fontSize: 26, color: GREEN, lineHeight: 1 }}>86%</span>
                    <span style={{ fontSize: 13, color: GREEN }}>Excellent</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.5, marginBottom: 14 }}>
                Great job! Your profile is highly visible. Keep your profile updated to stay ahead.
              </p>
              {VISIBILITY_SCORES.map(({ label, score }) => {
                const color = score >= 90 ? GREEN : score >= 75 ? GOLD : '#F97316';
                return (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>{score}%</span>
                  </div>
                );
              })}
              <button onClick={() => router.push('/profile')} style={{ marginTop: 12, background: 'none', border: 'none', color: GOLD, fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                View Tips to Improve <ChevronRight size={13} />
              </button>
            </div>

            {/* Application Performance */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 12 }}>Application Performance</div>
              {APP_PERFORMANCE.map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={14} color={color || 'rgba(255,255,255,0.5)'} />
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: color || '#fff' }}>{value}</span>
                </div>
              ))}
              <button onClick={() => router.push('/my-applications')} style={{ marginTop: 10, background: 'none', border: 'none', color: GOLD, fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                View All Applications <ChevronRight size={13} />
              </button>
            </div>

            {/* Quick Insights */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 6 }}>Quick Insights</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Key insights about your performance.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {QUICK_INSIGHTS.map(({ icon: Icon, text, color }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={color} />
                    </div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => alert('Detailed insights view coming soon.')} style={{ marginTop: 12, background: 'none', border: 'none', color: GOLD, fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                View Detailed Insights <ChevronRight size={13} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}