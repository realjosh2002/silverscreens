'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Wallet,
  Database, Settings, ScrollText,
  Tag, MapPin, Download, UserPlus, AlertTriangle,
  MoreVertical, ClipboardCheck, BadgeCheck, UserCheck,
  BellRing, Ticket, KeyRound, ChevronLeft, Menu, ChevronRight,
} from 'lucide-react';
import AdminTopnav from '@/components/layout/AdminTopnav';

const BG  = '#050505';
const BG2 = '#0B0F14';
const BG3 = '#121821';
const BG4 = 'rgba(255,255,255,0.03)'; // elevated surface — no new token, just subtle lift

const GOLD     = '#D4A64A';
const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';
const RED      = '#C8202A';

const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';
const ORANGE = '#F97316';
const TEAL   = '#14B8A6';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/admin/dashboard' },
  { icon: Users,           label: 'User Management',         href: '/admin/users' },
  { icon: UserCheck,       label: 'Talent Verification',     href: '/admin/talent-verification' },
  { icon: Building2,       label: 'Agency Verification',     href: '/admin/agency-verification' },
  { icon: FileText,        label: 'Applications Monitoring', href: '/admin/applications' },
  { icon: Flag,            label: 'Reports & Complaints',    href: '/admin/reports' },
  { icon: ShieldCheck,     label: 'Fraud Detection',         href: '/admin/fraud' },
  { icon: CreditCard,      label: 'Subscription Management', href: '/admin/subscriptions' },
  { icon: Tag,             label: 'Pricing Management',      href: '/admin/pricing' },
  { icon: MapPin,          label: 'Location Management',     href: '/admin/locations' },
  { icon: Megaphone,       label: 'Advertisement Management',href: '/admin/advertisements' },
  { icon: Database,        label: 'CMS Management',          href: '/admin/cms' },
  { icon: BellRing,        label: 'Notifications Management',href: '/admin/notifications' },
  { icon: BarChart2,       label: 'Analytics & Reports',     href: '/admin/analytics' },
  { icon: Ticket,          label: 'Support Tickets',         href: '/admin/support' },
  { icon: ScrollText,      label: 'Audit Logs',              href: '/admin/audit' },
  { icon: KeyRound,        label: 'Roles & Permissions',     href: '/admin/roles' },
  { icon: Settings,        label: 'Settings',                href: '/admin/settings' },
];

const QUICK_ACTIONS = [
  { icon: UserPlus,       label: 'Add New Admin',        href: '/admin/users',               badgeKey: null },
  { icon: Megaphone,      label: 'Create Announcement',  href: '/admin/cms',                  badgeKey: null },
  { icon: ClipboardCheck, label: 'Approve Pending Items',href: '/admin/talent-verification',  badgeKey: 'pending_verifications' },
  { icon: BarChart2,      label: 'View Reports',         href: '/admin/analytics',            badgeKey: null },
  { icon: Tag,            label: 'Manage Pricing',       href: '/admin/pricing',              badgeKey: null },
  { icon: MapPin,         label: 'Manage Locations',     href: '/admin/locations',            badgeKey: null },
  { icon: Settings,       label: 'System Settings',      href: '/admin/settings',             badgeKey: null },
];

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || sessionStorage.getItem('ss_user') || '{}');
    const t = u.token ?? u.access_token ?? u.accessToken ?? '';
    return t ? { Authorization: `Bearer ${t}` } : {};
  } catch { return {}; }
}

function fmtINR(a: number): string {
  if (a >= 10000000) return `₹${(a / 10000000).toFixed(2)} Cr`;
  if (a >= 100000)   return `₹${(a / 100000).toFixed(2)} L`;
  if (a >= 1000)     return `₹${(a / 1000).toFixed(1)}K`;
  return `₹${a.toLocaleString('en-IN')}`;
}
function fmtNum(n: number): string { return n.toLocaleString('en-IN'); }
function fmtDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}
function initials(name: string): string {
  return (name || 'U').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
}
function dateRangeLabel(): string {
  const now = new Date(), prior = new Date();
  prior.setDate(now.getDate() - 6);
  const f = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${f(prior)} – ${f(now)}`;
}

/* ── Platform line chart ── */
function PlatformChart({ series, labels, range }: { series: { name: string; color: string; data: number[] }[]; labels: string[]; range: string }) {
  const W = 560, H = 280, pl = 52, pb = 248, pr = W - 8, pt = 12, pw = pr - pl, ph = pb - pt;
  const allVals = series.flatMap(s => s.data);
  const dataMax = Math.max(...allVals, 1);
  const mag = Math.pow(10, Math.floor(Math.log10(dataMax)));
  const maxY = Math.ceil(dataMax / mag) * mag || 10;
  const gridY = Array.from({ length: 6 }, (_, i) => Math.round((maxY / 5) * i));
  const n = labels.length;
  const mx = (i: number) => n > 1 ? pl + (i / (n - 1)) * pw : pl + pw / 2;
  const my = (v: number) => pb - (v / maxY) * ph;
  const step = range === 'overall' ? 10 : range === 'month' ? 5 : 1;
  function smooth(data: number[]): string {
    const pts = data.map((v, i) => [mx(i), my(v)] as [number, number]);
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cp1x = pts[i][0] + (pts[i + 1][0] - (pts[i - 1]?.[0] ?? pts[i][0])) / 6;
      const cp1y = pts[i][1] + (pts[i + 1][1] - (pts[i - 1]?.[1] ?? pts[i][1])) / 6;
      const nx2  = pts[i + 2]?.[0] ?? pts[i + 1][0] + (pts[i + 1][0] - pts[i][0]);
      const ny2  = pts[i + 2]?.[1] ?? pts[i + 1][1] + (pts[i + 1][1] - pts[i][1]);
      const cp2x = pts[i + 1][0] - (nx2 - pts[i][0]) / 6;
      const cp2y = pts[i + 1][1] - (ny2 - pts[i][1]) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
    }
    return d;
  }
  function fmtG(v: number) { if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`; if (v >= 1000) return `${(v / 1000).toFixed(0)}K`; return `${v}`; }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {gridY.map(v => (
        <g key={v}>
          <line x1={pl} y1={my(v)} x2={pr} y2={my(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={pl - 6} y={my(v) + 4} fill="rgba(255,255,255,0.28)" fontSize={10} textAnchor="end" fontFamily={BARLOW}>{fmtG(v)}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      {labels.map((l, i) => i % step === 0 && (
        <text key={i} x={mx(i)} y={pb + 18} fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="middle" fontFamily={BARLOW}>
          {new Date(l).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </text>
      ))}
      {series.map(s => (
        <g key={s.name}>
          <path d={smooth(s.data)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {range === 'week' && s.data.map((v, i) => <circle key={i} cx={mx(i)} cy={my(v)} r={3} fill={s.color} stroke={BG3} strokeWidth={1.5} />)}
        </g>
      ))}
    </svg>
  );
}

/* ── Donut ── */
function RegDonut({ data }: { data: { label: string; value: number; pct: number; color: string }[] }) {
  const cx = 90, cy = 90, R = 72, r = 48;
  const total = data.reduce((s, d) => s + d.pct, 0) || 1;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const pt = (ang: number, rad: number) => [cx + rad * Math.cos(toRad(ang)), cy + rad * Math.sin(toRad(ang))];
  let start = -90;
  const arcs = data.map(seg => {
    const sweep = (seg.pct / total) * 360, end = start + sweep, large = sweep > 180 ? 1 : 0;
    const [x1, y1] = pt(start, R); const [x2, y2] = pt(end, R); const [x3, y3] = pt(end, r); const [x4, y4] = pt(start, r);
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    start = end + 1.5; return { ...seg, d };
  });
  const grand = data.reduce((s, d) => s + d.value, 0);
  return (
    <svg viewBox="0 0 180 180" style={{ width: 180, height: 180, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r - 2} fill={BG3} />
      {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} />)}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={11} fontFamily={BARLOW}>Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#F5F5F5" fontSize={22} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>
        {grand >= 1000 ? `${(grand / 1000).toFixed(1)}K` : grand}
      </text>
    </svg>
  );
}

/* ── Revenue bars ── */
function RevenueChart({ bars, labels }: { bars: number[]; labels: string[] }) {
  const W = 320, H = 160, pl = 40, pb = 135, pr = W - 8, pw = pr - pl, ph = pb - 10;
  const barsL = bars.map(b => b / 100000);
  const maxL = Math.max(...barsL, 1);
  const maxY = Math.ceil(maxL / 5) * 5 || 10;
  const gridY = Array.from({ length: 5 }, (_, i) => Math.round((maxY / 4) * i));
  const barW = (pw / (bars.length || 1)) * 0.55, gap = pw / (bars.length || 1);
  const bx = (i: number) => pl + i * gap + (gap - barW) / 2;
  const by = (v: number) => pb - (v / maxY) * ph;
  const bh = (v: number) => (v / maxY) * ph;
  const step = bars.length > 14 ? 7 : bars.length > 7 ? 3 : 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {gridY.map(v => (
        <g key={v}>
          <line x1={pl} y1={by(v)} x2={pr} y2={by(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={pl - 5} y={by(v) + 4} fill="rgba(255,255,255,0.28)" fontSize={9} textAnchor="end" fontFamily={BARLOW}>{v === 0 ? '0' : `${v}L`}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
      {barsL.map((v, i) => (
        <g key={i}>
          <rect x={bx(i)} y={by(v)} width={barW} height={bh(v)} rx={2} fill={GOLD} opacity={0.85} />
          {i % step === 0 && <text x={bx(i) + barW / 2} y={pb + 13} fill="rgba(255,255,255,0.3)" fontSize={8} textAnchor="middle" fontFamily={BARLOW}>{labels[i] ?? ''}</text>}
        </g>
      ))}
    </svg>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
      <div style={{ width: 20, height: 20, border: `2px solid ${GOLD_BDR}`, borderTop: `2px solid ${GOLD}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

interface KPIs { total_users: number; total_aspirants: number; total_agencies: number; total_casting_calls: number; total_applications: number; active_subscriptions: number; pending_verifications: number; open_reports: number; open_tickets: number; total_revenue: number; monthly_revenue: number }
interface RecentUser { id: string; name: string; email: string; role: string; created_at: string; is_active: boolean; aspirant_profiles?: { verification_status: string } | null; agency_profiles?: { verification_status: string } | null }
interface RecentPayment { id: string; plan_name: string; total_amount: number; currency: string; created_at: string; user_type: string }
interface TrendData { dates: string[]; series: { aspirants: number[]; agencies: number[]; casting_calls: number[]; applications: number[]; revenue: number[] } }
type Range = 'week' | 'month' | 'overall';

export default function AdminDashboardPage() {
  const router   = useRouter();
  const pathname = usePathname();

  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [adminName,      setAdminName]      = useState('Administrator');
  const [adminRoleLabel, setAdminRoleLabel] = useState('Admin');
  const [adminInitial,   setAdminInitial]   = useState('A');
  const [kpis,           setKpis]           = useState<KPIs | null>(null);
  const [recentUsers,    setRecentUsers]    = useState<RecentUser[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [pendingDocs,    setPendingDocs]    = useState(0);
  const [loading,        setLoading]        = useState(true);
  const [chartRange,     setChartRange]     = useState<Range>('week');
  const [trendData,      setTrendData]      = useState<TrendData | null>(null);
  const [trendLoading,   setTrendLoading]   = useState(true);

  // Read admin identity from session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ss_user') || sessionStorage.getItem('ss_user') || '{}';
      const u   = JSON.parse(raw);
      if (u?.name)      setAdminName(u.name);
      if (u?.adminRole) setAdminRoleLabel(u.adminRole === 'verifier' ? 'Verifier' : 'Admin');
      if (u?.name)      setAdminInitial((u.name as string).charAt(0).toUpperCase());
    } catch {}
  }, []);

  const SB_W = sidebarOpen ? 220 : 52;

  const fetchDashboard = useCallback(() => {
    const h = getAuthHeaders();
    fetch('/api/admin/dashboard?report=dashboard', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (!data?.data) return; setKpis(data.data.kpis); setRecentUsers(data.data.recent_users || []); setRecentPayments(data.data.recent_payments || []); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fetchTrends = useCallback((range: Range) => {
    setTrendLoading(true);
    const h = getAuthHeaders();
    fetch(`/api/admin/dashboard?report=trends&range=${range}`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setTrendData(data.data); })
      .catch(() => {}).finally(() => setTrendLoading(false));
  }, []);

  const fetchCounts = useCallback(() => {
    const h = getAuthHeaders();
    fetch('/api/admin/agency-verification?status=pending', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const agencies = data.data?.data ?? [];
        setPendingDocs(agencies.filter((a: any) => Array.isArray(a.documents) && a.documents.some((d: any) => d.status === 'pending_review')).length);
      }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchTrends('week');
    fetchCounts();
    const t = setInterval(fetchCounts, 30000);
    return () => clearInterval(t);
  }, [fetchDashboard, fetchTrends, fetchCounts]);

  const handleRange = (r: Range) => { setChartRange(r); fetchTrends(r); };

  const platformSeries = trendData ? [
    { name: 'Aspirants',     color: PURPLE, data: trendData.series.aspirants },
    { name: 'Companies',     color: BLUE,   data: trendData.series.agencies },
    { name: 'Casting Calls', color: ORANGE, data: trendData.series.casting_calls },
    { name: 'Applications',  color: TEAL,   data: trendData.series.applications },
  ] : [];

  const revBars   = trendData?.series.revenue ?? [];
  const revLabels = (trendData?.dates ?? []).map(d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).split(' ')[0]);

  const STATS = [
    { label: 'Total Aspirants',      value: fmtNum(kpis?.total_aspirants ?? 0),      iconBg: 'rgba(139,92,246,0.15)',  iconColor: PURPLE, Icon: Users },
    { label: 'Total Companies',      value: fmtNum(kpis?.total_agencies ?? 0),        iconBg: 'rgba(59,130,246,0.15)',  iconColor: BLUE,   Icon: Building2 },
    { label: 'Active Casting Calls', value: fmtNum(kpis?.total_casting_calls ?? 0),   iconBg: 'rgba(249,115,22,0.15)',  iconColor: ORANGE, Icon: Megaphone },
    { label: 'Total Applications',   value: fmtNum(kpis?.total_applications ?? 0),    iconBg: 'rgba(20,184,166,0.15)',  iconColor: TEAL,   Icon: FileText },
    { label: 'Total Revenue',        value: fmtINR(kpis?.total_revenue ?? 0),         iconBg: 'rgba(34,197,94,0.15)',   iconColor: GREEN,  Icon: Wallet },
  ];

  // Pending approvals — each routes to its correct page
  const PENDING = [
    { icon: BadgeCheck,    iconBg: 'rgba(249,115,22,0.15)',  iconColor: ORANGE, label: 'Aspirant Verifications', sub: 'New profiles awaiting verification',     count: kpis?.pending_verifications ?? 0, href: '/admin/talent-verification' },
    { icon: Building2,     iconBg: 'rgba(59,130,246,0.15)',  iconColor: BLUE,   label: 'Company Verifications',  sub: 'Company accounts awaiting verification',  count: pendingDocs,                      href: '/admin/agency-verification' },
    { icon: Flag,          iconBg: 'rgba(212,166,74,0.15)',  iconColor: GOLD,   label: 'Reports & Complaints',   sub: 'Content flagged by users',               count: kpis?.open_reports ?? 0,          href: '/admin/reports' },
    { icon: AlertTriangle, iconBg: 'rgba(239,68,68,0.15)',   iconColor: RED,    label: 'Support Tickets',        sub: 'Open support tickets',                   count: kpis?.open_tickets ?? 0,          href: '/admin/support' },
  ];

  const aspT = kpis?.total_aspirants ?? 0, agT = kpis?.total_agencies ?? 0, totR = aspT + agT || 1;
  const aspP = Math.round((aspT / totR) * 1000) / 10, agP = Math.round((agT / totR) * 1000) / 10, othP = Math.max(0, Math.round((100 - aspP - agP) * 10) / 10);
  const REG_DATA = [
    { label: 'Aspirants', value: aspT,                          pct: aspP, color: PURPLE },
    { label: 'Companies', value: agT,                           pct: agP,  color: BLUE },
    { label: 'Others',    value: Math.round(totR * othP / 100), pct: othP, color: TEAL },
  ];

  const ACTIVITY = [
    ...recentPayments.slice(0, 3).map(p => ({ iconBg: 'rgba(34,197,94,0.15)', iconColor: GREEN,  icon: Wallet,   text: `Payment of ${fmtINR(Number(p.total_amount))} received for ${p.plan_name} plan`, time: fmtDate(p.created_at).time })),
    ...recentUsers.slice(0, 2).map(u =>    ({ iconBg: u.role === 'agency' ? 'rgba(59,130,246,0.15)' : 'rgba(139,92,246,0.15)', iconColor: u.role === 'agency' ? BLUE : PURPLE, icon: u.role === 'agency' ? Building2 : Users, text: `New ${u.role} account created: ${u.name}`, time: fmtDate(u.created_at).time })),
  ].slice(0, 5);

  const RBtn = ({ r, lbl }: { r: Range; lbl: string }) => (
    <button onClick={() => handleRange(r)} style={{ background: chartRange === r ? GOLD : 'transparent', color: chartRange === r ? '#000' : 'rgba(255,255,255,0.55)', border: `1px solid ${chartRange === r ? GOLD : 'rgba(255,255,255,0.12)'}`, borderRadius: 6, padding: '4px 12px', fontSize: 13, fontWeight: chartRange === r ? 700 : 500, fontFamily: BARLOW, cursor: 'pointer', transition: 'all 0.15s' }}>{lbl}</button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AdminTopnav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* SIDEBAR */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease', scrollbarWidth: 'none' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(200,32,42,0.2)', border: '1px solid rgba(212,166,74,0.25)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: RED }}>{adminInitial}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminName}</div>
                <div style={{ fontSize: 14, color: RED, fontWeight: 600 }}>{adminRoleLabel}</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
              // Dynamic active state based on current route
              const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
              const navBadge = label === 'Agency Verification' && pendingDocs > 0 ? pendingDocs : null;
              return (
                <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? GOLD_DIM : 'transparent', border: active && sidebarOpen ? `1px solid ${GOLD_BDR}` : '1px solid transparent', borderLeft: sidebarOpen && active ? `3px solid ${GOLD}` : sidebarOpen ? '3px solid transparent' : 'none', gap: sidebarOpen ? 9 : 0 }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 14, color: active ? GOLD : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap', flex: 1 }}>{label}</span>}
                  {sidebarOpen && active && <ChevronRight size={12} color={GOLD} opacity={0.6} />}
                  {sidebarOpen && navBadge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 11, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' as const }}>{navBadge}</div>}
                  {!sidebarOpen && navBadge && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{navBadge}</div>}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* MAIN */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Welcome */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, marginBottom: 3, fontWeight: 400 }}>Welcome back, Admin 👋</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Here's what's happening on SilverScreens today.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 12px', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                <span>📅</span><span>{dateRangeLabel()}</span>
              </div>
              {/* Export Report — navigates to analytics where export is available */}
              <button onClick={() => router.push('/admin/analytics')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD_BDR}`, color: GOLD, borderRadius: 8, padding: '7px 14px', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Download size={13} color={GOLD} /> Analytics & Reports
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {loading
              ? Array(5).fill(0).map((_, i) => <div key={i} style={{ flex: 1, borderRadius: 12, padding: '14px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>)
              : STATS.map((s, i) => (
                <div key={i} style={{ flex: 1, borderRadius: 12, padding: '14px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.Icon size={17} color={s.iconColor} /></div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontSize: 24, fontWeight: 800, fontFamily: BEBAS, letterSpacing: 0.5 }}>{s.value}</span>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Live count</div>
                </div>
              ))
            }
          </div>

          {/* Middle row */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>

            {/* Platform Chart */}
            <div style={{ flex: 5, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Platform Overview</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <RBtn r="week"    lbl="This Week" />
                  <RBtn r="month"   lbl="This Month" />
                  <RBtn r="overall" lbl="Overall" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' as const }}>
                {[{ name: 'Aspirants', color: PURPLE }, { name: 'Companies', color: BLUE }, { name: 'Casting Calls', color: ORANGE }, { name: 'Applications', color: TEAL }].map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 20, height: 3, borderRadius: 2, background: s.color }} /><span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{s.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: '100%', height: 265, position: 'relative' }}>
                {trendLoading
                  ? <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>
                  : trendData && platformSeries.length > 0
                    ? <PlatformChart series={platformSeries} labels={trendData.dates} range={chartRange} />
                    : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No data available for this period</div>
                }
              </div>
            </div>

            {/* Donut */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Registrations</span>
                <span onClick={() => router.push('/admin/users')} style={{ fontSize: 14, color: GOLD, fontWeight: 600, cursor: 'pointer' }}>View Details</span>
              </div>
              {loading ? <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div> : <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><RegDonut data={REG_DATA} /></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {REG_DATA.map(r => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} /><span style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>{r.label}</span>
                      </div>
                      <div><span style={{ fontSize: 15, fontWeight: 700 }}>{r.value.toLocaleString('en-IN')}</span><span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginLeft: 4 }}>({r.pct}%)</span></div>
                    </div>
                  ))}
                </div>
              </>}
            </div>

            {/* Quick Actions */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {QUICK_ACTIONS.map(({ icon: Icon, label, href, badgeKey }) => {
                  const badge = badgeKey && kpis ? (kpis as any)[badgeKey] : null;
                  return (
                    <div key={label} onClick={() => router.push(href)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 8, cursor: 'pointer', background: BG4, border: '1px solid rgba(255,255,255,0.05)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={13} color="rgba(255,255,255,0.55)" /></div>
                      <span style={{ fontSize: 15, fontWeight: 500, flex: 1 }}>{label}</span>
                      {badge != null && badge > 0 && <div style={{ background: GOLD, color: '#000', borderRadius: 8, fontSize: 13, fontWeight: 700, padding: '1px 7px' }}>{badge}</div>}
                      <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
                    </div>
                  );
                })}
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
                {['USER', 'TYPE', 'DATE', 'STATUS', ''].map((h, i) => <span key={i} style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' as const }}>{h}</span>)}
              </div>
              {loading ? <div style={{ padding: '20px 18px' }}><Spinner /></div>
                : recentUsers.length === 0 ? <div style={{ padding: '24px 18px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>No recent registrations</div>
                  : recentUsers.map((r, i) => {
                    const { date, time } = fmtDate(r.created_at); const isAg = r.role === 'agency';
                    return (
                      <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.4fr 1fr 36px', padding: '10px 18px', gap: 8, alignItems: 'center', borderBottom: i < recentUsers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: isAg ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)', border: `1px solid ${isAg ? 'rgba(59,130,246,0.3)' : 'rgba(139,92,246,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: isAg ? BLUE : PURPLE }}>{initials(r.name)}</div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.email}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: isAg ? 'rgba(59,130,246,0.15)' : 'rgba(139,92,246,0.15)', color: isAg ? BLUE : PURPLE, border: `1px solid ${isAg ? 'rgba(59,130,246,0.25)' : 'rgba(139,92,246,0.25)'}`, display: 'inline-block' }}>{isAg ? 'Company' : 'Aspirant'}</span>
                        <div><div style={{ fontSize: 14, fontWeight: 500 }}>{date}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{time}</div></div>
                        {(() => {
                          const vs = r.role === 'aspirant' ? r.aspirant_profiles?.verification_status : r.agency_profiles?.verification_status;
                          const label = vs === 'approved' ? 'Approved' : vs === 'rejected' ? 'Rejected' : vs === 'under_review' ? 'Under Review' : 'Pending';
                          const bg  = vs === 'approved' ? 'rgba(34,197,94,0.15)'  : vs === 'rejected' ? 'rgba(239,68,68,0.15)'  : vs === 'under_review' ? 'rgba(59,130,246,0.15)'  : 'rgba(212,166,74,0.15)';
                          const clr = vs === 'approved' ? GREEN : vs === 'rejected' ? RED : vs === 'under_review' ? BLUE : GOLD;
                          const bdr = vs === 'approved' ? 'rgba(34,197,94,0.25)'  : vs === 'rejected' ? 'rgba(239,68,68,0.25)'  : vs === 'under_review' ? 'rgba(59,130,246,0.25)'  : 'rgba(212,166,74,0.25)';
                          return <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: bg, color: clr, border: `1px solid ${bdr}`, display: 'inline-block' }}>{label}</span>;
                        })()}
                        <div style={{ display: 'flex', justifyContent: 'center' }}><MoreVertical size={14} color="rgba(255,255,255,0.3)" style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/users`)} /></div>
                      </div>
                    );
                  })
              }
            </div>

            {/* Pending Approvals */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Pending Approvals</span>
                <span onClick={() => router.push('/admin/talent-verification')} style={{ fontSize: 14, color: GOLD, fontWeight: 600, cursor: 'pointer' }}>View All</span>
              </div>
              {loading ? <Spinner /> :
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PENDING.map(({ icon: Icon, iconBg, iconColor, label, sub, count, href }, i) => (
                    <div key={i} onClick={() => router.push(href)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: BG4, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={15} color={iconColor} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 1 }}>{label}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
                      </div>
                      <div style={{ background: count >= 10 ? 'rgba(239,68,68,0.15)' : GOLD_DIM, color: count >= 10 ? RED : GOLD, border: `1px solid ${count >= 10 ? 'rgba(239,68,68,0.3)' : GOLD_BDR}`, borderRadius: 8, padding: '2px 8px', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{count}</div>
                    </div>
                  ))}
                </div>
              }
            </div>

            {/* Revenue */}
            <div style={{ flex: 2, minWidth: 0, borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Revenue Overview</span>
                <span onClick={() => router.push('/admin/analytics')} style={{ fontSize: 14, color: GOLD, fontWeight: 600, cursor: 'pointer' }}>View Details</span>
              </div>
              {loading ? <Spinner /> : <>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, fontFamily: BEBAS, letterSpacing: 1 }}>{fmtINR(kpis?.total_revenue ?? 0)}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>This month: <span style={{ color: GREEN, fontWeight: 700 }}>{fmtINR(kpis?.monthly_revenue ?? 0)}</span></div>
                </div>
                <div style={{ flex: 1, minHeight: 0 }}>
                  {trendLoading ? <Spinner /> : <RevenueChart bars={revBars} labels={revLabels} />}
                </div>
              </>}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>Recent Activity</span>
              <span onClick={() => router.push('/admin/audit')} style={{ fontSize: 14, color: GOLD, fontWeight: 600, cursor: 'pointer' }}>View All Logs</span>
            </div>
            {loading ? <Spinner /> :
              ACTIVITY.length === 0
                ? <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 15, padding: '16px 0' }}>No recent activity</div>
                : <div style={{ display: 'flex', gap: 10 }}>
                  {ACTIVITY.map(({ iconBg, iconColor, icon: Icon, text, time }, i) => (
                    <div key={i} style={{ flex: 1, borderRadius: 10, padding: '12px 14px', background: BG4, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={14} color={iconColor} /></div>
                      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, flex: 1 }}>{text}</p>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{time}</span>
                    </div>
                  ))}
                </div>
            }
          </div>

        </div>
      </div>
    </div>
  );
}