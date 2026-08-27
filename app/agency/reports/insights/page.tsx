'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, Menu, BarChart2, CreditCard, Settings,
} from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const RED = '#C8202A';
const GOLD = '#D4A64A';
const GREEN = '#22C55E';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';
const ORANGE = '#F97316';
const BG = '#050505';
const BG2 = '#0B0F14';
const BG3 = '#121821';
const BG4 = '#1C2030';
const BEBAS = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";
const GRAY = '#6B7280';
const LIGHT = '#9CA3AF';
const WHITE = '#F9FAFB';

interface CastingRow {
  id: string;
  title: string;
  role: string;
  image: string;
  applicants: number;
  shortlisted: number;
  shortlistedPct: number;
  auditionsScheduled: number;
  auditionsScheduledPct: number;
  auditionsCompleted: number;
  auditionsCompletedPct: number;
  offersSent: number;
  offersSentPct: number;
  hires: number;
  hiresPct: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'flat';
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Casting Calls', value: '24', change: '+14%', icon: '🎬' },
  { label: 'Total Applicants', value: '1,284', change: '+18%', icon: '👤' },
  { label: 'Auditions Scheduled', value: '156', change: '+11%', icon: '📅' },
  { label: 'Auditions Completed', value: '98', change: '+12%', icon: '✅' },
  { label: 'Offers Sent', value: '—', change: '', icon: '📨' },
  { label: 'Hires Confirmed', value: '—', change: '', icon: '⭐' },
];

// CASTING_TABLE — computed from apiStats.top_casting_calls inside component

// DONUT_STATUS computed from apiStats inside component

// DONUT_SOURCE — source breakdown not tracked per-channel yet, shown as N/A

// FUNNEL_DATA computed from apiStats inside component

// TOP_CASTING and INSIGHTS computed from apiStats inside component

// ─── Line Graph Data — populated from API ──────────────────────────────────────
const EMPTY_DAYS = ['', '', '', '', '', '', ''];
const EMPTY_DATA = [0, 0, 0, 0, 0, 0, 0];

// ─── SVG Line Chart ────────────────────────────────────────────────────────────
function LineChart({ data1, data2, color1, color2, label1, label2, height = 120, days }: {
  data1: number[]; data2: number[]; color1: string; color2: string;
  label1: string; label2: string; height?: number; days?: string[];
}) {
  const W = 420; const H = height; const PAD = 20;
  const allVals = [...data1, ...data2];
  const min = 0; const max = Math.max(...allVals) * 1.1 || 1;
  const xStep = (W - PAD * 2) / (data1.length - 1);
  const toY = (v: number) => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
  const toX = (i: number) => PAD + i * xStep;
  const makePath = (d: number[]) => d.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={PAD} x2={W - PAD} y1={toY(max * t)} y2={toY(max * t)}
          stroke={BG4} strokeWidth="1" />
      ))}
      {/* Y-axis labels */}
      {[0, 250, 500, 750, 1000].map(v => (
        v <= max && <text key={v} x={PAD - 4} y={toY(v) + 4} fill={GRAY} fontSize="9" textAnchor="end">{v}</text>
      ))}
      {/* Lines */}
      <path d={makePath(data1)} fill="none" stroke={color1} strokeWidth="2" strokeLinejoin="round" />
      <path d={makePath(data2)} fill="none" stroke={color2} strokeWidth="2" strokeLinejoin="round" strokeDasharray="4,3" />
      {/* Dots */}
      {data1.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={color1} />)}
      {data2.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={color2} />)}
      {/* X labels */}
      {(days ?? EMPTY_DAYS).map((d, i) => (
        <text key={i} x={toX(i)} y={H - 4} fill={GRAY} fontSize="8" textAnchor="middle">{d}</text>
      ))}
    </svg>
  );
}

// ─── Bar Chart ─────────────────────────────────────────────────────────────────
function BarChart({ sched, compl, days }: { sched: number[]; compl: number[]; days?: string[] }) {
  const W = 360; const H = 120; const PAD = 20;
  const maxVal = Math.max(...sched, ...compl) * 1.2 || 1;
  const barW = 18; const gap = 8;
  const groupW = barW * 2 + gap;
  const totalW = W - PAD * 2;
  const spacing = totalW / sched.length;
  const toH = (v: number) => ((v / maxVal) * (H - PAD * 2));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
      {[40, 80, 120, 160].map(v => (
        v <= maxVal && <g key={v}>
          <line x1={PAD} x2={W - PAD} y1={H - PAD - (v / maxVal) * (H - PAD * 2)} y2={H - PAD - (v / maxVal) * (H - PAD * 2)} stroke={BG4} strokeWidth="1" />
          <text x={PAD - 4} y={H - PAD - (v / maxVal) * (H - PAD * 2) + 4} fill={GRAY} fontSize="8" textAnchor="end">{v}</text>
        </g>
      ))}
      {sched.map((s, i) => {
        const x = PAD + i * spacing + (spacing - groupW) / 2;
        const c = compl[i];
        return (
          <g key={i}>
            <rect x={x} y={H - PAD - toH(s)} width={barW} height={toH(s)} fill={GOLD} rx="2" />
            <rect x={x + barW + gap} y={H - PAD - toH(c)} width={barW} height={toH(c)} fill={GRAY} rx="2" />
            <text x={x + barW + gap / 2} y={H - 4} fill={GRAY} fontSize="7.5" textAnchor="middle">{(days ?? EMPTY_DAYS)[i]?.split(' ')[0] ?? ''}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ segments, centerLabel, centerValue }: {
  segments: { label: string; pct: number; count: number; color: string }[];
  centerLabel: string; centerValue: string;
}) {
  const r = 45; const cx = 60; const cy = 60; const strokeW = 18;
  let cumulative = 0;
  const paths = segments.map(s => {
    const start = cumulative;
    cumulative += s.pct;
    const startRad = (start / 100) * 2 * Math.PI - Math.PI / 2;
    const endRad = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = s.pct > 50 ? 1 : 0;
    return { d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, color: s.color };
  });

  return (
    <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
      {/* Background circle */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={BG4} strokeWidth={strokeW} />
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth={strokeW} strokeLinecap="butt" />
      ))}
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill={WHITE} fontSize="14" fontFamily={BEBAS}>{centerValue}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={GRAY} fontSize="7" fontFamily={BARLOW}>{centerLabel}</text>
    </svg>
  );
}

// ─── Mini Sparkline ────────────────────────────────────────────────────────────
function Sparkline({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  const color = trend === 'up' ? GREEN : trend === 'down' ? RED : GRAY;
  const points = trend === 'up' ? [[0,8],[3,6],[6,4],[9,2],[12,1]] :
    trend === 'down' ? [[0,1],[3,3],[6,5],[9,7],[12,8]] :
    [[0,5],[3,4],[6,5],[9,4],[12,5]];
  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  return (
    <svg viewBox="0 0 12 10" style={{ width: 40, height: 20 }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Circular Progress ─────────────────────────────────────────────────────────
function CircularPct({ pct, color }: { pct: number; color: string }) {
  const r = 16; const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 40 40" style={{ width: 40, height: 40 }}>
      <circle cx="20" cy="20" r={r} fill="none" stroke={BG4} strokeWidth="3" />
      <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round"
        transform="rotate(-90 20 20)" />
      <text x="20" y="23" textAnchor="middle" fill={WHITE} fontSize="9" fontFamily={BARLOW}>{pct}%</text>
    </svg>
  );
}

// ─── Funnel ────────────────────────────────────────────────────────────────────
function ConversionFunnel({ funnel }: { funnel: { label: string; value: number; pct: number }[] }) {
  const funnelColors = [GOLD, '#C89A3A', '#B8902E', '#A88422', '#888', '#555'];
  const maxW = 160;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {funnel.map((item, i) => {
        const barW = Math.max((item.pct / 100) * maxW, 24);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: barW, height: 18, background: funnelColors[i],
              borderRadius: 2, flexShrink: 0,
            }} />
            <span style={{ color: LIGHT, fontSize: 14, fontFamily: BARLOW, whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
            <span style={{ color: WHITE, fontSize: 14, fontFamily: BARLOW, marginLeft: 'auto' }}>
              {item.value.toLocaleString()}
            </span>
            <span style={{ color: GRAY, fontSize: 14, fontFamily: BARLOW, width: 40, textAlign: 'right' }}>
              ({item.pct}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Date Range Picker ─────────────────────────────────────────────────────────
function DateRangePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'];
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: BG3, border: `1px solid ${BG4}`, borderRadius: 6, padding: '7px 14px',
        color: WHITE, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span>📅</span>
        <span>{value}</span>
        <span style={{ color: GRAY }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '110%', right: 0, background: BG3,
          border: `1px solid ${BG4}`, borderRadius: 8, zIndex: 100, minWidth: 160,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {options.map(o => (
            <div key={o} onClick={() => { onChange(o); setOpen(false); }} style={{
              padding: '9px 16px', color: o === value ? GOLD : LIGHT,
              fontFamily: BARLOW, fontSize: 14, cursor: 'pointer',
              background: o === value ? BG4 : 'transparent',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = BG4)}
              onMouseLeave={e => (e.currentTarget.style.background = o === value ? BG4 : 'transparent')}
            >{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}



function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ? { Authorization: `Bearer ${u.token}` } : {}
  } catch { return {} }
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',             href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications',        href: '/agency/notifications' },
];

const PROFILE_MENU = [
  { label: 'Reports & Analytics',   href: '/agency/reports' },
  { label: 'Subscription & Billing', href: '/agency/subscription' },
  { label: 'Company Profile',        href: '/agency-profile' },
  { label: 'Documents',              href: '/agency/documents' },
  { label: 'Calendar',               href: '/agency/calendar' },
  { label: 'Settings',               href: '/agency/settings' },
  { label: 'Support',                href: '/agency/support' },
  { label: 'Logout',                 href: '/login' },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [dateRange,    setDateRange]    = useState('01 Jun 2026 – 07 Jun 2026');
  const [tableFilter,  setTableFilter]  = useState('This Week');
  const [agencyName,   setAgencyName]   = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,     setAgencyId]     = useState('AGE·········');
  const [agencyType,   setAgencyType]   = useState('Production House');
  const [msgCount,     setMsgCount]     = useState(0);
  const [notifCount,   setNotifCount]   = useState(0);
  const [apiStats,     setApiStats]     = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u.name) {
        setAgencyName(u.name)
        setAgencyInitials(u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase())
      }
      if (u.profileNumber) setAgencyId(u.profileNumber)
    } catch {}

    const fetchCounts = () => {
      const h = getAuthHeaders()
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
    }
    fetchCounts()
    const interval = setInterval(fetchCounts, 10000)

    // Fetch real stats
    const h = getAuthHeaders()
    fetch('/api/agency/reports/stats', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setApiStats(data.data) })
      .catch(() => {})
      .finally(() => setStatsLoading(false))

    // Fetch agency profile
    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const p = data.data?.profile ?? data.profile ?? data
        if (p.company_name || p.name) {
          const name = p.company_name ?? p.name
          setAgencyName(name)
          setAgencyInitials(name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase())
        }
        if (p.profiles?.profile_number) setAgencyId(p.profiles.profile_number)
        if (p.company_type) setAgencyType(p.company_type)
      }).catch(() => {})

    return () => clearInterval(interval)
  }, [])

  const liveNavItems = NAV_ITEMS.map((item: any) => {
    if (item.label === 'Messages')      return { ...item, badge: msgCount   || undefined }
    if (item.label === 'Notifications') return { ...item, badge: notifCount || undefined }
    return item
  })

  // ── Computed chart data from API ──────────────────────────────────
  const ts = apiStats?.time_series
  const chartDays        = ts?.days        ?? EMPTY_DAYS
  const chartApplicants  = ts?.applicants  ?? EMPTY_DATA
  const chartShortlisted = ts?.shortlisted ?? EMPTY_DATA
  const chartScheduled   = ts?.scheduled   ?? EMPTY_DATA
  const chartCompleted   = ts?.completed   ?? EMPTY_DATA

  const total = apiStats?.applicants?.total ?? 0
  const liveDonutStatus = [
    { label: 'Shortlisted',        pct: total > 0 ? Math.round((apiStats?.applicants?.shortlisted ?? 0) / total * 100) : 0, count: apiStats?.applicants?.shortlisted ?? 0, color: GOLD },
    { label: 'Audition Scheduled', pct: total > 0 ? Math.round((apiStats?.auditions?.scheduled ?? 0) / total * 100) : 0,   count: apiStats?.auditions?.scheduled ?? 0,   color: GRAY },
    { label: 'Audition Completed', pct: total > 0 ? Math.round((apiStats?.auditions?.completed ?? 0) / total * 100) : 0,   count: apiStats?.auditions?.completed ?? 0,   color: GREEN },
    { label: 'Rejected',           pct: total > 0 ? Math.round((apiStats?.applicants?.rejected ?? 0) / total * 100) : 0,   count: apiStats?.applicants?.rejected ?? 0,   color: RED },
  ]

  const liveFunnel = [
    { label: 'Applicants',         value: total,                                    pct: 100 },
    { label: 'Shortlisted',        value: apiStats?.applicants?.shortlisted ?? 0,   pct: total > 0 ? Math.round((apiStats?.applicants?.shortlisted ?? 0) / total * 100) : 0 },
    { label: 'Audition Scheduled', value: apiStats?.auditions?.scheduled ?? 0,      pct: total > 0 ? Math.round((apiStats?.auditions?.scheduled ?? 0) / total * 100) : 0 },
    { label: 'Audition Completed', value: apiStats?.auditions?.completed ?? 0,      pct: total > 0 ? Math.round((apiStats?.auditions?.completed ?? 0) / total * 100) : 0 },
    { label: 'Selected',           value: apiStats?.applicants?.selected ?? 0,      pct: total > 0 ? Math.round((apiStats?.applicants?.selected ?? 0) / total * 100) : 0 },
  ]

  // Live casting table from top_casting_calls
  const liveCastingTable: CastingRow[] = (apiStats?.top_casting_calls ?? []).slice(0, 10).map((cc: any, i: number) => {
    const apps = cc.applications_count ?? 0
    return {
      id: cc.id ?? String(i),
      title: cc.title ?? '—',
      role: cc.status ?? '—',
      image: '🎬',
      applicants: apps,
      shortlisted: 0,
      shortlistedPct: 0,
      auditionsScheduled: 0,
      auditionsScheduledPct: 0,
      auditionsCompleted: 0,
      auditionsCompletedPct: 0,
      offersSent: 0,
      offersSentPct: 0,
      hires: 0,
      hiresPct: 0,
      conversionRate: 0,
      trend: 'flat' as const,
    }
  })

  const liveTopCasting = (apiStats?.top_casting_calls ?? []).slice(0, 5).map((cc: any) => ({
    title: cc.title,
    applicants: cc.applications_count ?? 0,
    views: cc.views_count ?? 0,
    img: '🎬',
  }))

  const recentApplications = apiStats?.applicants?.recent_30d ?? 0
  const liveInsights: { icon: string; text: string }[] = []
  if (apiStats) {
    const shortlistRate = total > 0 ? Math.round((apiStats.applicants?.shortlisted ?? 0) / total * 100) : 0
    if (recentApplications > 0) liveInsights.push({ icon: '📈', text: `${recentApplications} new applications received in the last 30 days` })
    if (shortlistRate > 0) liveInsights.push({ icon: '⭐', text: `${shortlistRate}% shortlist rate across all your casting calls` })
    if (apiStats.auditions?.completed > 0) liveInsights.push({ icon: '👥', text: `${apiStats.auditions.completed} auditions completed so far` })
    if (liveInsights.length === 0) liveInsights.push({ icon: '🎬', text: 'Post casting calls to start seeing performance insights here' })
  }

  const SB_W = sidebarOpen ? 230 : 52;


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
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
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : label === 'Reports & Analytics' ? GOLD : '#F5F5F5', fontWeight: label === 'Reports & Analytics' ? 700 : 400, background: label === 'Reports & Analytics' ? 'rgba(212,166,74,0.08)' : 'transparent', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = label === 'Reports & Analytics' ? 'rgba(212,166,74,0.08)' : 'transparent')}
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
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>{agencyInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {liveNavItems.map(({ icon: Icon, label, active, badge, href }) => (
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
            ))}
          </nav>
        </aside>

        {/* ── SCROLLABLE CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {/* ── Page Content ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 40px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <button onClick={() => router.back()} style={{ background: BG4, border: 'none', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeft size={16} color={LIGHT} />
            </button>
            <div>
              <div style={{ fontSize: 12, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>Reports & Analytics</div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 28, color: GOLD, margin: 0, letterSpacing: 1 }}>PERFORMANCE INSIGHTS</h1>
            </div>
          </div>

          {statsLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: GRAY, fontSize: 16 }}>Loading insights…</div>
          ) : (() => {
            const total         = apiStats?.applicants?.total ?? 0;
            const shortlisted   = apiStats?.applicants?.shortlisted ?? 0;
            const selected      = apiStats?.applicants?.selected ?? 0;
            const rejected      = apiStats?.applicants?.rejected ?? 0;
            const audCompleted  = apiStats?.auditions?.completed ?? 0;
            const audScheduled  = apiStats?.auditions?.scheduled ?? 0;
            const castingTotal  = apiStats?.casting_calls?.total ?? 0;
            const castingActive = apiStats?.casting_calls?.active ?? 0;
            const recent30d     = apiStats?.applicants?.recent_30d ?? 0;
            const views         = apiStats?.casting_views ?? 0;
            const shortlistRate  = total > 0 ? Math.round((shortlisted / total) * 100) : 0;
            const selectionRate  = total > 0 ? Math.round((selected / total) * 100) : 0;
            const completionRate = audScheduled > 0 ? Math.round((audCompleted / audScheduled) * 100) : 0;
            const viewToApply    = views > 0 ? Math.round((total / views) * 100) : 0;

            const insights: { icon: string; color: string; title: string; detail: string; badge?: string }[] = [];
            if (castingActive === 0 && castingTotal > 0)
              insights.push({ icon: '⚠️', color: RED,    title: 'No active casting calls',         detail: 'All your casting calls are closed. Post a new one to start receiving applications.', badge: 'Action Needed' });
            if (recent30d > 0)
              insights.push({ icon: '📈', color: GREEN,  title: `${recent30d} applications in the last 30 days`, detail: 'Your casting calls are attracting talent. Keep listings active and up to date.', badge: 'Positive' });
            if (shortlistRate > 0)
              insights.push({ icon: '⭐', color: GOLD,   title: `${shortlistRate}% shortlist rate`, detail: `Out of ${total} applicants, ${shortlisted} have been shortlisted. ${shortlistRate > 20 ? 'This is a healthy rate.' : 'Consider widening your criteria.'}` });
            if (selectionRate > 0)
              insights.push({ icon: '🎯', color: GREEN,  title: `${selectionRate}% selection rate`, detail: `${selected} applicants selected out of ${total} total.` });
            if (completionRate > 0)
              insights.push({ icon: '📅', color: GOLD,   title: `${completionRate}% audition completion`, detail: `${audCompleted} of ${audScheduled} scheduled auditions completed.` });
            if (viewToApply > 0)
              insights.push({ icon: '👥', color: '#60A5FA', title: `${viewToApply}% view-to-apply conversion`, detail: `${views} views led to ${total} applications. ${viewToApply > 10 ? 'Strong conversion.' : 'Improve casting descriptions to boost conversions.'}` });
            if (rejected > 0)
              insights.push({ icon: 'ℹ️', color: GRAY,  title: `${rejected} applications rejected`, detail: 'Rejected applications are cleared from your active pipeline.' });
            if (insights.length === 0)
              insights.push({ icon: '🎬', color: GOLD,   title: 'Post your first casting call', detail: 'Once you start posting casting calls, your performance insights will appear here.' });

            return (
              <>
                {/* Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12, marginBottom: 24 }}>
                  {[
                    { label: 'Shortlist Rate',      value: `${shortlistRate}%`,    sub: `${shortlisted} of ${total}`,   color: GOLD      },
                    { label: 'Selection Rate',       value: `${selectionRate}%`,    sub: `${selected} selected`,         color: GREEN     },
                    { label: 'Audition Completion',  value: `${completionRate}%`,   sub: `${audCompleted} completed`,    color: GREEN     },
                    { label: 'View-to-Apply Rate',   value: `${viewToApply}%`,      sub: `${views} total views`,         color: '#60A5FA' },
                    { label: 'Active Castings',      value: String(castingActive),  sub: `of ${castingTotal} total`,     color: GOLD      },
                    { label: 'Saved Talents',        value: String(apiStats?.shortlisted_talents ?? 0), sub: 'In talent pool', color: '#A78BFA' },
                  ].map(m => (
                    <div key={m.label} style={{ background: BG3, border: `1px solid ${BG4}`, borderRadius: 10, padding: '16px 18px' }}>
                      <div style={{ fontSize: 13, color: GRAY, marginBottom: 6 }}>{m.label}</div>
                      <div style={{ fontFamily: BEBAS, fontSize: 28, color: m.color, lineHeight: 1, marginBottom: 3 }}>{m.value}</div>
                      <div style={{ fontSize: 13, color: LIGHT }}>{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Insights List */}
                <div style={{ background: BG3, border: `1px solid ${BG4}`, borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                  <div style={{ padding: '16px 24px', borderBottom: `1px solid ${BG4}` }}>
                    <div style={{ fontFamily: BEBAS, fontSize: 18, color: WHITE, letterSpacing: 1 }}>ALL INSIGHTS</div>
                  </div>
                  {insights.map((ins, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, padding: '16px 24px', borderTop: i === 0 ? 'none' : `1px solid ${BG4}`, alignItems: 'flex-start' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: `${ins.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{ins.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: WHITE }}>{ins.title}</span>
                          {ins.badge && <span style={{ fontSize: 12, fontWeight: 700, color: ins.color, background: `${ins.color}18`, borderRadius: 5, padding: '2px 8px', fontFamily: BARLOW }}>{ins.badge}</span>}
                        </div>
                        <div style={{ fontSize: 14, color: LIGHT, lineHeight: 1.5 }}>{ins.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30`, borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: WHITE, marginBottom: 3 }}>Want to improve your metrics?</div>
                    <div style={{ fontSize: 14, color: LIGHT }}>Post more casting calls and keep listings detailed to attract the right talent.</div>
                  </div>
                  <button onClick={() => router.push('/agency/create-casting')} style={{ background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 20px', height: 38, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Post a Casting +
                  </button>
                </div>
              </>
            );
          })()}

        </main>
        </div>
      </div>
    </div>
  );
}