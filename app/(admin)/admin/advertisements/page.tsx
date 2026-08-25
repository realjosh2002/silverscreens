'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard,
  Database, Settings, ScrollText, Bell, ChevronRight,
  Download, UserCheck, MoreVertical, Tag, MapPin,
  BellRing, Ticket, KeyRound, ChevronLeft, Menu,
  ChevronDown, Eye, Search, Filter, X, Info,
  Plus, Edit2, CheckSquare, Square, Upload,
  Monitor, MousePointer, Activity, Image, Play,
  Clock, Check, XCircle, Sliders, Loader2, AlertCircle,
  Copy, ThumbsUp, ThumbsDown,
} from 'lucide-react';

/* ─── Design tokens ──────────────────────────────────────────── */
const BG    = '#0D1117';
const BG2   = '#131720';
const BG3   = '#181E2A';
const BG4   = '#1C2338';
const BEBAS = "'Bebas Neue', sans-serif";
const BARLOW= "'Barlow Condensed', sans-serif";
const GREEN = '#22C55E';
const RED   = '#EF4444';
const BLUE  = '#3B82F6';
const PURPLE= '#8B5CF6';
const ORANGE= '#F97316';
const TEAL  = '#14B8A6';
const GOLD  = '#D4A64A';

/* ─── Status / type maps ─────────────────────────────────────── */
const STATUS_COLOR: Record<string,string> = {
  Active: GREEN, Scheduled: BLUE, Expired: RED,
  Draft: ORANGE, 'Pending Approval': GOLD, Rejected: PURPLE, Paused: TEAL,
};
const STATUS_BG: Record<string,string> = {
  Active: 'rgba(34,197,94,0.12)', Scheduled: 'rgba(59,130,246,0.12)',
  Expired: 'rgba(239,68,68,0.12)', Draft: 'rgba(249,115,22,0.12)',
  'Pending Approval': 'rgba(212,166,74,0.12)', Rejected: 'rgba(139,92,246,0.12)',
  Paused: 'rgba(20,184,166,0.12)',
};
const TYPE_COLOR: Record<string,string> = {
  'Image Banner': BLUE, 'Video Ad': PURPLE, 'Text Ad': TEAL,
};
const TYPE_BG: Record<string,string> = {
  'Image Banner': 'rgba(59,130,246,0.15)',
  'Video Ad': 'rgba(139,92,246,0.15)',
  'Text Ad': 'rgba(20,184,166,0.15)',
};

/* ─── DB value maps (what we send to API) ─────────────────────── */
const STATUS_TO_DB: Record<string,string> = {
  Active: 'active', Scheduled: 'scheduled', Expired: 'expired',
  Draft: 'draft', 'Pending Approval': 'pending_approval',
  Rejected: 'rejected', Paused: 'paused',
};
const TYPE_TO_DB: Record<string,string> = {
  'Image Banner': 'image_banner', 'Video Ad': 'video_ad', 'Text Ad': 'text_ad',
};

/* ─── Filter options ─────────────────────────────────────────── */
const TABS       = ['All Advertisements','Active','Scheduled','Pending Approval','Paused','Draft','Expired','Rejected'];
const PLACEMENTS = ['All Placements','Homepage Top Banner','Casting Calls Sidebar','Dashboard Below Stats','Mobile App Splash','Agency Dashboard Top','All Pages Bottom Banner','Subscription Page','Explore Talents Page','Casting Calls Top','Landing Page Hero','All Pages Top','Homepage Sidebar'];
const AD_TYPES   = ['All Types','Image Banner','Video Ad','Text Ad'];
const AD_STATUS  = ['All Status','Active','Scheduled','Expired','Draft','Pending Approval','Rejected','Paused'];
const SORT_OPTS  = ['Newest First','Oldest First','Most Impressions','Most Clicks'];
const SORT_MAP: Record<string,string> = {
  'Newest First':'newest','Oldest First':'oldest',
  'Most Impressions':'impressions','Most Clicks':'clicks',
};

const PER_PAGE = 8;

/* ─── Sidebar nav — matches admin dashboard exactly ─────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'                    },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                        },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'          },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'          },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'                 },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'                      },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                        },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'                },
  { icon: Tag,             label: 'Pricing Management',       href: '/admin/pricing'                      },
  { icon: MapPin,          label: 'Location Management',      href: '/admin/locations'                    },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements', active: true },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                          },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'                },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'                    },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'                      },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                        },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                        },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'                     },
];

const PROFILE_MENU = [
  { label: 'My Profile',               href: '/admin/profile'          },
  { label: 'Account Settings',         href: '/admin/account-settings' },
  { label: 'Security & Login',         href: '/admin/security-login'   },
  { label: 'Notification Preferences', href: '/admin/notifications'    },
  { label: 'Activity Log',             href: '/admin/activity-log'     },
  { label: 'Help & Support',           href: '/admin/help-support'     },
  { label: 'Logout',                   href: '/login'                  },
];

/* ─── Types ──────────────────────────────────────────────────── */
interface Ad {
  id: string; name: string; placement: string; type: string;
  status: string; impressions: string; clicks: string; ctr: string;
  start: string; end: string; creator: string;
  media_url: string | null; click_url: string | null;
  created_at: string; _status: string; _type: string;
  _raw_impressions: number; _raw_clicks: number;
  // Targeting fields
  target_user_type: string | null; target_category: string | null;
  target_role: string | null; target_age_min: number | null;
  target_age_max: number | null; target_gender: string | null;
  target_location: string | null; delivery_channel: string | null;
}
interface Stats {
  total: number; active: number; scheduled: number; expired: number;
  draft: number; pending: number; rejected: number; paused: number;
  totalImpressions: number; totalClicks: number; ctr: string;
}
interface TopAd { name: string; ctr: string; clicks: string; ctrRaw: number; }

/* ─── Donut Chart ────────────────────────────────────────────── */
function DonutChart({ data, total, size = 130 }: {
  data: { label: string; pct: number; color: string }[]; total: string; size?: number;
}) {
  const cx = size/2, cy = size/2, R = size*0.44, r = size*0.29;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const pt    = (a: number, rad: number) => [cx + rad * Math.cos(toRad(a)), cy + rad * Math.sin(toRad(a))];
  let start   = -90;
  const sum   = data.reduce((s, d) => s + d.pct, 0) || 1;
  const arcs  = data.map(seg => {
    const sweep = (seg.pct / sum) * 360, end = start + sweep, large = sweep > 180 ? 1 : 0;
    const [x1,y1] = pt(start, R); const [x2,y2] = pt(end, R);
    const [x3,y3] = pt(end, r);   const [x4,y4] = pt(start, r);
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    start = end + 1.5;
    return { ...seg, d };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r - 2} fill={BG3} />
      {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} />)}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={size * 0.07} fontFamily={BARLOW}>Total</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#F5F5F5" fontSize={size * 0.14} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
    </svg>
  );
}

/* ─── Mini bar chart for impressions/clicks ──────────────────── */
function MiniBarChart({ impressions, clicks }: { impressions: number; clicks: number }) {
  const maxVal = Math.max(impressions, 1);
  const iW = 100;
  const cW = Math.round((clicks / maxVal) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', width: 70 }}>Impressions</span>
        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${iW}%`, height: '100%', background: BLUE, borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 13, color: '#F5F5F5', width: 60, textAlign: 'right' as const }}>{impressions.toLocaleString('en-IN')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', width: 70 }}>Clicks</span>
        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${cW}%`, height: '100%', background: GREEN, borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 13, color: '#F5F5F5', width: 60, textAlign: 'right' as const }}>{clicks.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function AdvertisementManagementPage() {
  const router = useRouter();

  /* ── UI state ── */
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState('All Advertisements');
  const [search,       setSearch]       = useState('');
  const [placement,    setPlacement]    = useState('All Placements');
  const [adType,       setAdType]       = useState('All Types');
  const [adStatus,     setAdStatus]     = useState('All Status');
  const [sortBy,       setSortBy]       = useState('Newest First');
  const [selected,     setSelected]     = useState<string[]>([]);
  const [page,         setPage]         = useState(1);
  const [menuId,       setMenuId]       = useState('');
  const [menuPos,      setMenuPos]      = useState({ top: 0, left: 0 });
  const [viewAd,       setViewAd]       = useState<Ad | null>(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [showUpload,   setShowUpload]   = useState(false);
  const [showSendAd,   setShowSendAd]   = useState<Ad | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters,  setShowFilters]  = useState(false);
  const [toast,        setToast]        = useState('');
  const [actionLoading,setActionLoading]= useState(false);

  /* ── Data state ── */
  const [ads,          setAds]          = useState<Ad[]>([]);
  const [totalCount,   setTotalCount]   = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [stats,        setStats]        = useState<Stats | null>(null);
  const [placementBreakdown, setPlacementBreakdown] = useState<Record<string, number>>({});
  const [topAds,       setTopAds]       = useState<TopAd[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error,        setError]        = useState('');

  const SB_W = sidebarOpen ? 220 : 52;
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  function getToken() {
    try { return JSON.parse(localStorage.getItem('ss_user') || '{}')?.token || ''; }
    catch { return ''; }
  }

  /* ── Fetch stats ── */
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/admin/advertisements?type=stats', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      const p = json.data ?? json;
      setStats(p.stats ?? null);
      setPlacementBreakdown(p.placement_breakdown ?? {});
      setTopAds(p.top_ads ?? []);
    } catch (e) { console.error('[ads stats]', e); }
    finally { setStatsLoading(false); }
  }, []);

  /* ── Fetch table ── */
  const fetchAds = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const p = new URLSearchParams();
      p.set('type', 'table');
      p.set('page', String(page));
      p.set('per_page', String(PER_PAGE));
      p.set('sort', SORT_MAP[sortBy] || 'newest');
      // Tab filter maps to status
      if (activeTab !== 'All Advertisements') p.set('status', STATUS_TO_DB[activeTab] || activeTab.toLowerCase());
      if (adStatus !== 'All Status')          p.set('status', STATUS_TO_DB[adStatus]   || adStatus.toLowerCase());
      if (adType   !== 'All Types')           p.set('ad_type', TYPE_TO_DB[adType]       || adType.toLowerCase());
      if (placement !== 'All Placements')     p.set('placement', placement);
      if (search)                             p.set('search', search);

      const res = await fetch(`/api/admin/advertisements?${p.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      const payload = json.data ?? json;
      setAds((payload.ads ?? []).map((a: any) => ({
        ...a,
        // Ensure targeting fields are present even if API doesn't return them
        target_user_type: a.target_user_type ?? null,
        target_category:  a.target_category  ?? null,
        target_role:      a.target_role      ?? null,
        target_age_min:   a.target_age_min   ?? null,
        target_age_max:   a.target_age_max   ?? null,
        target_gender:    a.target_gender    ?? null,
        target_location:  a.target_location  ?? null,
        delivery_channel: a.delivery_channel ?? null,
      })));
      setTotalCount(payload.total ?? 0);
      setTotalPages(payload.total_pages ?? 1);
    } catch (e) {
      console.error('[ads table]', e);
      setError('Failed to load advertisements. Please try again.');
    } finally { setLoading(false); }
  }, [page, search, activeTab, adStatus, adType, placement, sortBy]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchAds(); },  [fetchAds]);

  /* ── API action ── */
  const doAction = useCallback(async (action: string, id: string, extra?: object) => {
    setActionLoading(true);
    setMenuId('');
    try {
      const res = await fetch('/api/admin/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ action, id, ...extra }),
      });
      const json = await res.json();
      const msg = (json.data ?? json)?.message || 'Action completed';
      showToast(msg);
      fetchAds(); fetchStats();
    } catch { showToast('Action failed. Please try again.'); }
    finally { setActionLoading(false); }
  }, [fetchAds, fetchStats]);

  const doBulk = useCallback(async (action: string, extra?: object) => {
    if (selected.length === 0) { showToast('Select at least one ad first'); return; }
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ action, ids: selected, ...extra }),
      });
      const json = await res.json();
      showToast((json.data ?? json)?.message || 'Action completed');
      setSelected([]); fetchAds(); fetchStats();
    } catch { showToast('Action failed. Please try again.'); }
    finally { setActionLoading(false); }
  }, [selected, fetchAds, fetchStats]);

  /* ── Selection ── */
  const allSel   = ads.length > 0 && ads.every(a => selected.includes(a.id));
  const toggleSel = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(allSel ? selected.filter(id => !ads.find(a => a.id === id)) : [...new Set([...selected, ...ads.map(a => a.id)])]);

  const clearFilters = () => {
    setSearch(''); setPlacement('All Placements'); setAdType('All Types');
    setAdStatus('All Status'); setSortBy('Newest First'); setPage(1);
  };

  /* ── Tab counts from stats ── */
  const tabCount = (tab: string): number => {
    if (!stats) return 0;
    if (tab === 'All Advertisements') return stats.total;
    const m: Record<string, number> = {
      Active: stats.active, Scheduled: stats.scheduled, Expired: stats.expired,
      Draft: stats.draft, 'Pending Approval': stats.pending,
      Rejected: stats.rejected, Paused: stats.paused,
    };
    return m[tab] || 0;
  };

  /* ── Stat cards ── */
  const statCards = stats ? [
    { label: 'Total Advertisements', value: stats.total.toLocaleString(),                                color: PURPLE, Icon: Megaphone,     sub: 'All statuses'      },
    { label: 'Active Ads',           value: stats.active.toLocaleString(),                               color: GREEN,  Icon: Check,          sub: 'Currently running' },
    { label: 'Total Impressions',    value: stats.totalImpressions >= 1000000 ? (stats.totalImpressions/1000000).toFixed(2)+'M' : stats.totalImpressions >= 1000 ? (stats.totalImpressions/1000).toFixed(1)+'K' : stats.totalImpressions.toLocaleString('en-IN'), color: BLUE, Icon: Eye, sub: 'All time' },
    { label: 'Total Clicks',         value: stats.totalClicks.toLocaleString('en-IN'),                   color: ORANGE, Icon: MousePointer,   sub: 'All time'          },
    { label: 'Click Through Rate',   value: stats.ctr,                                                   color: TEAL,   Icon: Activity,       sub: 'Overall'           },
  ] : [];

  /* ── Placement donut data ── */
  const COLORS = [BLUE, PURPLE, ORANGE, GREEN, TEAL, GOLD, RED];
  const placementData = Object.entries(placementBreakdown).map(([label, value], i) => ({
    label, value,
    pct: stats?.total ? parseFloat(((value / stats.total) * 100).toFixed(1)) : 0,
    color: COLORS[i % COLORS.length],
  }));

  /* ════════════════════════════════════════════ RENDER ═══════ */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <span style={{fontFamily:"'Bebas Neue', sans-serif",fontSize:20,letterSpacing:2,color:'#F5F5F5'}}>SILVER<span style={{color:'#C8202A'}}>SCREENS</span></span>
        <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN PANEL</span>
        </div>
        <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
          <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input placeholder="Search ads by name, placement or creator…"
            style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 40px 8px 34px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'rgba(255,255,255,0.25)', background: BG4, borderRadius: 4, padding: '1px 6px', border: '1px solid rgba(255,255,255,0.1)' }}>⌘K</span>
        </div>
        <div style={{ flex: 1 }} />
        <div onClick={() => router.push('/admin/notifications')} style={{ cursor: 'pointer', width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={15} color="rgba(255,255,255,0.7)" />
        </div>
        <div onClick={() => router.push('/admin/help-support')} style={{ cursor: 'pointer', width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Info size={15} color="rgba(255,255,255,0.7)" />
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: BG3, border: '2px solid rgba(212,166,74,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: BEBAS, fontSize: 16, color: GOLD }}>SA</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Super Admin</div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 210, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
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

        {/* ── SIDEBAR ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease', scrollbarWidth: 'none' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? 'rgba(239,68,68,0.12)' : 'transparent', border: active && sidebarOpen ? '1px solid rgba(239,68,68,0.25)' : '1px solid transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none', gap: sidebarOpen ? 9 : 0 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(239,68,68,0.12)' : 'transparent'; }}
              >
                <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                {sidebarOpen && <span style={{ fontSize: 15, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap', flex: 1 }}>{label}</span>}
                {sidebarOpen && active && <ChevronRight size={12} color={RED} opacity={0.7} />}
              </div>
            ))}
          </nav>
          {sidebarOpen && (
            <div onClick={() => router.push('/login')} style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 15 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ff6b6b')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            ><ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />Logout</div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                <span style={{ cursor: 'pointer' }} onClick={() => router.push('/admin/dashboard')}>Home</span>
                <ChevronRight size={12} />
                <span style={{ color: '#F5F5F5' }}>Advertisement Management</span>
              </div>
              <h1 style={{ fontFamily: BARLOW, fontSize: 28, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                Advertisement Management
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: RED, display: 'inline-block', marginBottom: 2 }} />
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Create, manage and monitor advertisements displayed across the platform.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 28, flexShrink: 0 }}>
              <button onClick={() => setShowCreate(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: RED, border: 'none', borderRadius: 8, color: '#fff', fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>
                <Plus size={15} /> Create Advertisement
              </button>
              <button onClick={() => setShowUpload(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <Upload size={14} /> Upload Banner
              </button>
              <button onClick={() => setShowSettings(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <Sliders size={14} /> Ad Settings
              </button>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
            {statsLoading
              ? Array.from({ length: 5 }, (_, i) => <div key={i} style={{ borderRadius: 12, padding: 16, background: BG3, border: '1px solid rgba(255,255,255,0.06)', height: 88 }} />)
              : statCards.map((s, i) => (
                <div key={i} style={{ borderRadius: 12, padding: '16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <s.Icon size={20} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{s.sub}</div>
                  </div>
                </div>
              ))
            }
          </div>

          {/* ── TABS ── */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                style={{ padding: '10px 16px', background: 'none', border: 'none', borderBottom: activeTab === tab ? `2px solid ${RED}` : '2px solid transparent', color: activeTab === tab ? '#F5F5F5' : 'rgba(255,255,255,0.45)', fontFamily: BARLOW, fontSize: 15, fontWeight: activeTab === tab ? 700 : 400, cursor: 'pointer', marginBottom: -1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                {tab}
                {tabCount(tab) > 0 && (
                  <span style={{ fontSize: 14, background: activeTab === tab ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)', color: activeTab === tab ? RED : 'rgba(255,255,255,0.4)', borderRadius: 10, padding: '0 7px' }}>
                    {tabCount(tab)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── TABLE + RIGHT PANEL ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 270px', gap: 14, minWidth: 0 }}>

            {/* Table */}
            <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', minWidth: 0, position: 'relative', overflowX: 'auto' }}>
            <div style={{ minWidth: 880 }}>

              {/* Search + filter bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' as const }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
                  <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, placement or creator…"
                    style={{ width: '100%', background: BG4, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, padding: '8px 10px 8px 30px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
                {[
                  { val: placement, set: setPlacement, opts: PLACEMENTS },
                  { val: adType,    set: setAdType,    opts: AD_TYPES   },
                  { val: adStatus,  set: setAdStatus,  opts: AD_STATUS  },
                  { val: sortBy,    set: setSortBy,    opts: SORT_OPTS  },
                ].map((f, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <select value={f.val} onChange={e => { f.set(e.target.value); setPage(1); }}
                      style={{ appearance: 'none', padding: '8px 26px 8px 10px', background: BG4, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={11} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', background: BG4, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                    <X size={12} /> Clear
                  </button>
                  {selected.length > 0 && (
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => doBulk('bulk_status', { new_status: 'active' })} style={{ padding: '8px 10px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 7, color: GREEN, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><ThumbsUp size={12} /> Approve ({selected.length})</button>
                      <button onClick={() => doBulk('delete')} style={{ padding: '8px 10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, color: RED, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><XCircle size={12} /> Delete ({selected.length})</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 15, fontWeight: 700, flex: 1 }}>
                  Advertisements
                  <span style={{ marginLeft: 8, background: 'rgba(239,68,68,0.15)', color: RED, border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '2px 9px' }}>
                    {loading ? '…' : totalCount.toLocaleString()}
                  </span>
                </span>
                {actionLoading && <Loader2 size={14} color="rgba(255,255,255,0.4)" style={{ animation: 'spin 1s linear infinite' }} />}
                {loading && !actionLoading && <Loader2 size={14} color="rgba(255,255,255,0.3)" style={{ animation: 'spin 1s linear infinite' }} />}
              </div>

              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '32px 200px 160px 95px 85px 60px 55px 110px 82px', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', gap: 4 }}>
                <div onClick={toggleAll} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {allSel ? <CheckSquare size={15} color={RED} /> : <Square size={15} color="rgba(255,255,255,0.3)" />}
                </div>
                {['Advertisement', 'Placement', 'Type', 'Status', 'Imp / Clicks', 'CTR', 'Start / End', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.3 }}>{h}</div>
                ))}
              </div>

              {/* Loading skeleton */}
              {loading && Array.from({ length: 5 }, (_, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 200px 160px 95px 85px 60px 55px 110px 82px', padding: '12px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 4, alignItems: 'center' }}>
                  {Array.from({ length: 9 }, (_, j) => <div key={j} style={{ height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.05)' }} />)}
                </div>
              ))}

              {/* Error */}
              {!loading && error && (
                <div style={{ padding: '36px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <AlertCircle size={28} color={RED} opacity={0.6} />
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>{error}</div>
                  <button onClick={() => fetchAds()} style={{ padding: '8px 18px', background: RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Retry</button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && ads.length === 0 && (
                <div style={{ padding: '36px 18px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>
                  No advertisements match your filters.{' '}
                  <span style={{ color: RED, cursor: 'pointer' }} onClick={clearFilters}>Clear filters</span>
                </div>
              )}

              {/* Data rows */}
              {!loading && !error && ads.map((ad, i) => {
                const isSel = selected.includes(ad.id);
                return (
                  <div key={ad.id}
                    style={{ display: 'grid', gridTemplateColumns: '32px 200px 160px 95px 85px 60px 55px 110px 82px', padding: '10px 12px', borderBottom: i < ads.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', gap: 4, background: isSel ? 'rgba(239,68,68,0.05)' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isSel ? 'rgba(239,68,68,0.05)' : 'transparent'; }}
                  >
                    {/* Checkbox */}
                    <div onClick={() => toggleSel(ad.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {isSel ? <CheckSquare size={15} color={RED} /> : <Square size={15} color="rgba(255,255,255,0.25)" />}
                    </div>
                    {/* Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <div style={{ width: 36, height: 28, borderRadius: 6, background: BG4, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {ad.type === 'Video Ad' ? <Play size={13} color={PURPLE} /> : <Image size={13} color={BLUE} />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>By {ad.creator}</div>
                      </div>
                    </div>
                    {/* Placement */}
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, alignSelf: 'center', paddingLeft: 0 }}>{ad.placement}</div>
                    {/* Type */}
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: TYPE_BG[ad.type] || 'rgba(255,255,255,0.08)', color: TYPE_COLOR[ad.type] || '#F5F5F5', display: 'inline-block', whiteSpace: 'nowrap' as const }}>{ad.type}</span>
                    {/* Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[ad.status] || '#F5F5F5', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: STATUS_COLOR[ad.status] || '#F5F5F5', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{ad.status}</span>
                    </div>
                    {/* Impressions + Clicks combined */}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{ad.impressions}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{ad.clicks} clicks</div>
                    </div>
                    {/* CTR */}
                    <div style={{ fontSize: 13, fontWeight: 700, color: ad.ctr === '0%' ? 'rgba(255,255,255,0.4)' : GREEN }}>{ad.ctr}</div>
                    {/* Dates */}
                    <div>
                      <div style={{ fontSize: 12 }}>{ad.start}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{ad.end}</div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                      <button onClick={() => setViewAd(ad)} title="View"
                        style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <Eye size={12} color={BLUE} />
                      </button>
                      <button onClick={() => showToast('Edit ad — feature coming soon')} title="Edit"
                        style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(212,166,74,0.12)', border: '1px solid rgba(212,166,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <Edit2 size={12} color={GOLD} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          const r = e.currentTarget.getBoundingClientRect();
                          setMenuPos({ top: r.bottom + 4, left: r.left - 170 });
                          setMenuId(menuId === ad.id ? '' : ad.id);
                        }}
                        title="More"
                        style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <MoreVertical size={12} color="rgba(255,255,255,0.5)" />
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>{/* end minWidth wrapper */}

              {/* Pagination */}
              {!loading && !error && ads.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                    Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, totalCount)} of {totalCount.toLocaleString()} entries
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ width: 30, height: 30, borderRadius: 6, background: BG4, border: '1px solid rgba(255,255,255,0.08)', color: page === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pg = i + 1;
                      return <button key={pg} onClick={() => setPage(pg)}
                        style={{ width: 30, height: 30, borderRadius: 6, background: page === pg ? RED : BG4, border: `1px solid ${page === pg ? RED : 'rgba(255,255,255,0.08)'}`, color: '#F5F5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: page === pg ? 700 : 400 }}>{pg}</button>;
                    })}
                    {totalPages > 5 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, lineHeight: '30px' }}>…{totalPages}</span>}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      style={{ width: 30, height: 30, borderRadius: 6, background: BG4, border: '1px solid rgba(255,255,255,0.08)', color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === totalPages ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Top Performing Ads */}
              <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Top Performing Ads</div>
                {statsLoading ? (
                  Array.from({ length: 3 }, (_, i) => <div key={i} style={{ height: 44, borderRadius: 7, background: 'rgba(255,255,255,0.04)', marginBottom: 8 }} />)
                ) : topAds.length === 0 ? (
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', padding: '12px 0' }}>No data yet — ads need 100+ impressions to rank.</div>
                ) : topAds.map((ad, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < topAds.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? 'rgba(212,166,74,0.2)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: i === 0 ? GOLD : 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.name}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{ad.clicks} clicks</div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: GREEN, flexShrink: 0 }}>{ad.ctr}</span>
                  </div>
                ))}
                <div onClick={() => router.push('/admin/analytics')}
                  style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                ><BarChart2 size={14} /> View All Reports</div>
              </div>

              {/* Advertisement Placements */}
              <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Advertisement Placements</div>
                {statsLoading ? (
                  <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 size={22} color="rgba(255,255,255,0.2)" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : placementData.length === 0 ? (
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', padding: '12px 0' }}>No placement data yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, color: '#F5F5F5' }}>{stats?.total ?? 0}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>total ads</span>
                    </div>
                    {placementData.map(d => (
                      <div key={d.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{d.label}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, flexShrink: 0, marginLeft: 8, color: '#F5F5F5' }}>{d.value} <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>({d.pct}%)</span></span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${d.pct}%`, height: '100%', background: d.color, borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Performance summary */}
              {!statsLoading && stats && (
                <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Performance Summary</div>
                  <MiniBarChart impressions={stats.totalImpressions} clicks={stats.totalClicks} />
                  <div style={{ marginTop: 12, padding: '10px', background: BG4, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Overall CTR</div>
                    <div style={{ fontFamily: BEBAS, fontSize: 26, letterSpacing: 1, color: GREEN, lineHeight: 1 }}>{stats.ctr}</div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { icon: Plus,    label: 'Create Advertisement',  color: RED,    action: () => setShowCreate(true)  },
                    { icon: Upload,  label: 'Upload Banner / Video',  color: BLUE,   action: () => setShowUpload(true)  },
                    { icon: Clock,   label: 'Approval Queue',         color: ORANGE, action: () => { setActiveTab('Pending Approval'); setPage(1); }, badge: stats?.pending || 0 },
                    { icon: Monitor, label: 'View Scheduled Ads',     color: PURPLE, action: () => { setActiveTab('Scheduled'); setPage(1); }, badge: stats?.scheduled || 0 },
                  ].map(({ icon: Icon, label, color, action, badge }) => (
                    <div key={label} onClick={action}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: BG4, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: 7, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={14} color={color} />
                      </div>
                      <span style={{ fontSize: 15, flex: 1 }}>{label}</span>
                      {!!badge && badge > 0 && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, padding: '0 7px' }}>{badge}</div>}
                      <ChevronRight size={13} color="rgba(255,255,255,0.25)" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTEXT MENU ── */}
      {menuId && (
        <>
          <div onClick={() => setMenuId('')} style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
          <div style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, width: 210, background: BG2, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, overflow: 'hidden', zIndex: 999, boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}>
            {[
              { label: 'Send to Users',   color: TEAL,      action: () => { const a = ads.find(x => x.id === menuId); if (a) { setShowSendAd(a); } setMenuId(''); } },
              { label: 'View Details',   color: '#F5F5F5', action: () => { const a = ads.find(x => x.id === menuId); if (a) setViewAd(a); setMenuId(''); } },
              { label: 'Edit Ad',        color: GOLD,      action: () => { showToast('Edit ad — feature coming soon'); setMenuId(''); } },
              { label: 'Pause / Resume', color: BLUE,      action: () => doAction('toggle_status', menuId) },
              { label: 'Approve',        color: GREEN,     action: () => doAction('approve', menuId) },
              { label: 'Reject',         color: ORANGE,    action: () => doAction('reject', menuId) },
              { label: 'Duplicate',      color: PURPLE,    action: () => doAction('duplicate', menuId) },
              { label: 'View Analytics', color: TEAL,      action: () => { router.push('/admin/analytics'); setMenuId(''); } },
              { label: 'Delete Ad',      color: RED,       action: () => doAction('delete', menuId) },
            ].map(({ label, color, action }) => (
              <div key={label} onClick={action}
                style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color, borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >{label}</div>
            ))}
          </div>
        </>
      )}

      {/* ── VIEW AD MODAL ── */}
      {viewAd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1 }}>ADVERTISEMENT DETAILS</div>
              <button onClick={() => setViewAd(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 11px', borderRadius: 5, background: STATUS_BG[viewAd.status] || 'rgba(255,255,255,0.08)', color: STATUS_COLOR[viewAd.status] || '#F5F5F5' }}>{viewAd.status}</span>
                <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 11px', borderRadius: 5, background: TYPE_BG[viewAd.type] || 'rgba(255,255,255,0.08)', color: TYPE_COLOR[viewAd.type] || '#F5F5F5' }}>{viewAd.type}</span>
              </div>
              <div style={{ background: BG3, borderRadius: 10, padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 48, height: 36, borderRadius: 8, background: BG4, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {viewAd.type === 'Video Ad' ? <Play size={18} color={PURPLE} /> : <Image size={18} color={BLUE} />}
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{viewAd.name}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Created by {viewAd.creator}</div>
                </div>
              </div>
              {/* Performance bars */}
              <div style={{ background: BG3, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>Performance</div>
                <MiniBarChart impressions={viewAd._raw_impressions} clicks={viewAd._raw_clicks} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                  <div><span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>CTR </span><span style={{ fontSize: 15, fontWeight: 700, color: GREEN }}>{viewAd.ctr}</span></div>
                </div>
              </div>
              {[
                { label: 'Placement',  value: viewAd.placement },
                { label: 'Start Date', value: viewAd.start     },
                { label: 'End Date',   value: viewAd.end       },
                { label: 'Click URL',  value: viewAd.click_url || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                  <span style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 500, wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 4 }}>
                <button onClick={() => doAction('toggle_status', viewAd.id).then(() => setViewAd(null))}
                  style={{ padding: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8, color: BLUE, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Clock size={14} /> {viewAd.status === 'Active' ? 'Pause' : 'Resume'}
                </button>
                <button onClick={() => doAction('duplicate', viewAd.id).then(() => setViewAd(null))}
                  style={{ padding: 10, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 8, color: PURPLE, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Copy size={14} /> Duplicate
                </button>
                <button onClick={() => doAction('delete', viewAd.id).then(() => setViewAd(null))}
                  style={{ padding: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: RED, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <XCircle size={14} /> Delete
                </button>
              </div>
              {(viewAd._status === 'pending_approval') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button onClick={() => doAction('approve', viewAd.id).then(() => setViewAd(null))}
                    style={{ padding: 10, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, color: GREEN, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ThumbsUp size={14} /> Approve
                  </button>
                  <button onClick={() => doAction('reject', viewAd.id).then(() => setViewAd(null))}
                    style={{ padding: 10, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 8, color: ORANGE, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ThumbsDown size={14} /> Reject
                  </button>
                </div>
              )}
              <button onClick={() => setViewAd(null)} style={{ padding: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE AD MODAL ── */}
      {showCreate && <CreateAdModal onClose={() => setShowCreate(false)} onSuccess={() => { fetchAds(); fetchStats(); }} getToken={getToken} showToast={showToast} />}

      {/* ── UPLOAD BANNER MODAL ── */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, width: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1 }}>UPLOAD BANNER / VIDEO</div>
              <button onClick={() => setShowUpload(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: 14, background: BG3, borderRadius: 8, marginBottom: 16, fontSize: 14, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Info size={14} color={BLUE} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>Upload banner images (JPG/PNG, max 2MB) or video ads (MP4, max 50MB). Files will be stored in your Supabase storage bucket.</span>
            </div>
            <div style={{ border: '2px dashed rgba(255,255,255,0.15)', borderRadius: 10, padding: '32px 20px', textAlign: 'center', marginBottom: 14, cursor: 'pointer', background: BG3 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
              onClick={() => showToast('File picker — wire to your Supabase storage bucket')}
            >
              <Upload size={28} color="rgba(255,255,255,0.3)" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>Click to select file or drag and drop</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>JPG, PNG, GIF, MP4 — Max 50MB</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowUpload(false)} style={{ flex: 1, padding: 11, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { showToast('Upload — connect to your Supabase storage bucket'); setShowUpload(false); }}
                style={{ flex: 2, padding: 11, background: RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, cursor: 'pointer' }}>Upload File</button>
            </div>
          </div>
        </div>
      )}

      {/* ── AD SETTINGS MODAL ── */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, width: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1 }}>AD SETTINGS</div>
              <button onClick={() => setShowSettings(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[
              { l: 'Auto Approval',     opts: ['Disabled', 'Enabled'],                                      def: 'Disabled'       },
              { l: 'Max Ads Per Page',  opts: ['1', '2', '3', '5'],                                         def: '2'              },
              { l: 'Ad Refresh Rate',   opts: ['Every 24 hours', 'Every 12 hours', 'Every 6 hours'],        def: 'Every 24 hours' },
              { l: 'Default Placement', opts: PLACEMENTS.slice(1),                                          def: PLACEMENTS[1]    },
            ].map(f => (
              <div key={f.l} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>{f.l}</label>
                <select defaultValue={f.def} style={{ appearance: 'none', width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '9px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none' }}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowSettings(false)} style={{ flex: 1, padding: 11, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { showToast('Ad settings saved'); setShowSettings(false); }}
                style={{ flex: 2, padding: 11, background: RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, cursor: 'pointer' }}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: BG2, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 22px', fontSize: 15, fontWeight: 600, color: '#F5F5F5', zIndex: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <CheckSquare size={15} color={GREEN} /> {toast}
        </div>
      )}

      {/* ── SEND AD MODAL ── */}
      {showSendAd && <SendAdModal ad={showSendAd} onClose={() => setShowSendAd(null)} getToken={getToken} showToast={showToast} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CREATE AD MODAL
══════════════════════════════════════════════════════════════ */
function CreateAdModal({ onClose, onSuccess, getToken, showToast }: {
  onClose: () => void; onSuccess: () => void;
  getToken: () => string; showToast: (m: string) => void;
}) {
  const [name,        setName]        = useState('');
  const [message,     setMessage]     = useState('');
  const [tgtUserType, setTgtUserType] = useState('aspirant');
  const [tgtCategory, setTgtCategory] = useState('');
  const [tgtRole,     setTgtRole]     = useState('');
  const [tgtAgeMin,   setTgtAgeMin]   = useState('');
  const [tgtAgeMax,   setTgtAgeMax]   = useState('');
  const [tgtGender,   setTgtGender]   = useState('any');
  const [tgtLocation, setTgtLocation] = useState('');
  const [delivery,    setDelivery]    = useState('both');
  const [docFile,     setDocFile]     = useState<File | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [err,         setErr]         = useState('');

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ['application/pdf','image/jpeg','image/png','image/gif','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) { setErr('Only PDF, Word or image files allowed'); return; }
    if (f.size > 5 * 1024 * 1024) { setErr('File must be under 5MB'); return; }
    setDocFile(f); setErr('');
  };

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSave = async () => {
    if (!name.trim())    { setErr('Ad name is required'); return; }
    if (!message.trim()) { setErr('Message content is required'); return; }
    setSaving(true); setErr('');
    try {
      let attachmentData = null;
      if (docFile) {
        const b64 = await fileToBase64(docFile);
        attachmentData = { filename: docFile.name, content: b64, type: docFile.type };
      }
      const res = await fetch('/api/admin/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          action: 'create', name: name.trim(),
          ad_message:        message.trim(),
          ad_type:           'notification',
          placement:         'direct_send',
          target_user_type:  tgtUserType || null,
          target_category:   tgtCategory || null,
          target_role:       tgtRole     || null,
          target_age_min:    tgtAgeMin   ? parseInt(tgtAgeMin)   : null,
          target_age_max:    tgtAgeMax   ? parseInt(tgtAgeMax)   : null,
          target_gender:     tgtGender !== 'any' ? tgtGender : null,
          target_location:   tgtLocation || null,
          delivery_channel:  delivery,
          attachment:        attachmentData,
        }),
      });
      const json = await res.json();
      if ((json.data ?? json)?.error) throw new Error((json.data ?? json).error);
      showToast('Advertisement created successfully');
      onSuccess(); onClose();
    } catch (e: any) { setErr(e.message || 'Failed to create ad'); }
    finally { setSaving(false); }
  };

  const inp = { width: '100%', background: BG4, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, padding: '9px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const };
  const sel = { ...inp, appearance: 'none' as const };
  const lbl = { display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 5 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: '100%', maxWidth: 560, maxHeight: '90vh', display: 'flex', flexDirection: 'column' as const }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1 }}>CREATE ADVERTISEMENT</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <div style={{ overflowY: 'auto', padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
          {err && <div style={{ padding: '9px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, fontSize: 14, color: RED }}>{err}</div>}

          <div><label style={lbl}>Ad Name / Title *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Hero Audition - Tamil Feature Film" style={inp} />
          </div>

          <div><label style={lbl}>Message to Users *</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} maxLength={500}
              placeholder="Describe the opportunity. This appears in the email and in-app notification."
              style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.6 }} />
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'right' as const, marginTop: 3 }}>{message.length}/500</div>
          </div>

          <div>
            <label style={lbl}>Attach Document / Image <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>(PDF, Word, Image — max 5MB)</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: BG4, border: '1px dashed ' + (docFile ? TEAL : 'rgba(255,255,255,0.15)'), borderRadius: 7, cursor: 'pointer' }}>
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" onChange={handleDocSelect} style={{ display: 'none' }} />
                <span style={{ fontSize: 18 }}>📎</span>
                <span style={{ fontSize: 14, color: docFile ? TEAL : 'rgba(255,255,255,0.4)' }}>
                  {docFile ? docFile.name : 'Click to attach casting brief, script or image…'}
                </span>
              </label>
              {docFile && <button onClick={() => setDocFile(null)} style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, color: RED, cursor: 'pointer', fontSize: 13 }}>Remove</button>}
            </div>
            {docFile && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{(docFile.size / 1024).toFixed(0)} KB</div>}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 1, color: TEAL, marginBottom: 12 }}>🎯 Who Should Receive This?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={lbl}>User Type</label>
                <select value={tgtUserType} onChange={e => setTgtUserType(e.target.value)} style={sel}>
                  <option value="aspirant" style={{ background: BG4 }}>Aspirants</option>
                  <option value="agency"   style={{ background: BG4 }}>Agencies</option>
                  <option value="all"      style={{ background: BG4 }}>All Users</option>
                </select>
              </div>
              <div><label style={lbl}>Gender</label>
                <select value={tgtGender} onChange={e => setTgtGender(e.target.value)} style={sel}>
                  <option value="any"    style={{ background: BG4 }}>Any Gender</option>
                  <option value="male"   style={{ background: BG4 }}>Male</option>
                  <option value="female" style={{ background: BG4 }}>Female</option>
                </select>
              </div>
              <div><label style={lbl}>Category <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>optional</span></label>
                <input value={tgtCategory} onChange={e => setTgtCategory(e.target.value)} placeholder="e.g. Acting, Modelling" style={inp} />
              </div>
              <div><label style={lbl}>Role <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>optional</span></label>
                <input value={tgtRole} onChange={e => setTgtRole(e.target.value)} placeholder="e.g. Hero, Heroine" style={inp} />
              </div>
              <div><label style={lbl}>Min Age <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>optional</span></label>
                <input type="number" value={tgtAgeMin} onChange={e => setTgtAgeMin(e.target.value)} placeholder="e.g. 18" style={inp} />
              </div>
              <div><label style={lbl}>Max Age <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>optional</span></label>
                <input type="number" value={tgtAgeMax} onChange={e => setTgtAgeMax(e.target.value)} placeholder="e.g. 35" style={inp} />
              </div>
              <div><label style={lbl}>Location <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>optional</span></label>
                <input value={tgtLocation} onChange={e => setTgtLocation(e.target.value)} placeholder="e.g. Chennai, Tamil Nadu" style={inp} />
              </div>
              <div><label style={lbl}>Delivery Channel</label>
                <select value={delivery} onChange={e => setDelivery(e.target.value)} style={sel}>
                  <option value="both"  style={{ background: BG4 }}>In-App + Email</option>
                  <option value="inapp" style={{ background: BG4 }}>In-App Only</option>
                  <option value="email" style={{ background: BG4 }}>Email Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 2, padding: 11, background: saving ? 'rgba(239,68,68,0.4)' : RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, cursor: saving ? 'wait' : 'pointer' }}>
            {saving ? 'Saving…' : 'Create Advertisement'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SEND AD TO USERS MODAL — summary + preview + send only
══════════════════════════════════════════════════════════════ */
function SendAdModal({ ad, onClose, getToken, showToast }: {
  ad: Ad; onClose: () => void;
  getToken: () => string; showToast: (m: string) => void;
}) {
  const [sending,     setSending]     = useState(false);
  const [preview,     setPreview]     = useState<{ matched: number; sample: string[] } | null>(null);
  const [previewing,  setPreviewing]  = useState(false);
  const [docFile,     setDocFile]     = useState<File | null>(null);
  const [confirmSend, setConfirmSend] = useState(false);

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { showToast('File must be under 5MB'); return; }
    setDocFile(f);
  };

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const targeting = {
    target_user_type: ad.target_user_type || 'aspirant',
    target_category:  ad.target_category  || null,
    target_role:      ad.target_role      || null,
    target_age_min:   ad.target_age_min   || null,
    target_age_max:   ad.target_age_max   || null,
    target_gender:    ad.target_gender    || null,
    target_location:  ad.target_location  || null,
    delivery_channel: ad.delivery_channel || 'both',
  };

  const handlePreview = async () => {
    setPreviewing(true);
    try {
      const res = await fetch('/api/admin/advertisements/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ad_id: ad.id, preview: true, ...targeting }),
      });
      const d = await res.json();
      const p = d.data ?? d;
      setPreview({ matched: p.matched ?? 0, sample: p.sample ?? [] });
    } catch { showToast('Failed to preview'); }
    finally { setPreviewing(false); }
  };

  const handleSend = async () => {
    if (!preview) { showToast('Click Preview first'); return; }
    if (preview.matched === 0) { showToast('No matching users found'); return; }
    setConfirmSend(true);
  };

  const handleConfirmedSend = async () => {
    setConfirmSend(false);
    if (!preview) return;
    setSending(true);
    try {
      let attachmentData = null;
      if (docFile) {
        const b64 = await fileToBase64(docFile);
        attachmentData = { filename: docFile.name, content: b64, type: docFile.type };
      }
      const res = await fetch('/api/admin/advertisements/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ad_id: ad.id, preview: false, ...targeting, attachment: attachmentData }),
      });
      const d = await res.json();
      const p = d.data ?? d;
      showToast(`✓ Sent to ${p.sent ?? preview.matched} user(s) successfully`);
      onClose();
    } catch { showToast('Failed to send'); }
    finally { setSending(false); }
  };

  const CHANNEL_LABEL: Record<string,string> = { both: 'In-App + Email', inapp: 'In-App Only', email: 'Email Only' };
  const row = (label: string, value: string | null | undefined) => value ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 14 }}>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span style={{ color: '#F5F5F5', fontWeight: 600 }}>{value}</span>
    </div>
  ) : null;

  const delivery = ad.delivery_channel || 'both';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: BG2, border: '1px solid rgba(20,184,166,0.25)', borderRadius: 12, width: '100%', maxWidth: 500, maxHeight: '90vh', display: 'flex', flexDirection: 'column' as const }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1 }}>SEND AD TO USERS</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{ad.name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <div style={{ overflowY: 'auto', padding: '18px 22px', flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

          {/* Targeting summary — read only */}
          <div style={{ background: BG3, borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontFamily: BEBAS, fontSize: 15, letterSpacing: 1, color: TEAL, marginBottom: 10 }}>🎯 SENDING TO</div>
            {row('User Type',    ad.target_user_type === 'aspirant' ? 'Aspirants' : ad.target_user_type === 'agency' ? 'Agencies' : 'All Users')}
            {row('Category',     ad.target_category)}
            {row('Role',         ad.target_role)}
            {row('Age Range',    ad.target_age_min && ad.target_age_max ? `${ad.target_age_min} – ${ad.target_age_max} yrs` : ad.target_age_min ? `${ad.target_age_min}+ yrs` : ad.target_age_max ? `Up to ${ad.target_age_max} yrs` : null)}
            {row('Gender',       ad.target_gender && ad.target_gender !== 'any' ? ad.target_gender.charAt(0).toUpperCase() + ad.target_gender.slice(1) : 'Any Gender')}
            {row('Location',     ad.target_location)}
            {row('Delivery',     CHANNEL_LABEL[delivery] || delivery)}
            <div style={{ marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              Targeting criteria saved at creation. Edit the ad to change them.
            </div>
          </div>

          {/* Optional doc attachment for this send */}
          {(delivery === 'email' || delivery === 'both') && (
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                Attach Document to Email <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>optional — PDF, Word, Image max 5MB</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: BG4, border: '1px dashed ' + (docFile ? TEAL : 'rgba(255,255,255,0.15)'), borderRadius: 7, cursor: 'pointer' }}>
                  <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" onChange={handleDocSelect} style={{ display: 'none' }} />
                  <span style={{ fontSize: 18 }}>📎</span>
                  <span style={{ fontSize: 14, color: docFile ? TEAL : 'rgba(255,255,255,0.4)' }}>
                    {docFile ? docFile.name : 'Attach casting brief, script or image…'}
                  </span>
                </label>
                {docFile && <button onClick={() => setDocFile(null)} style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, color: RED, cursor: 'pointer', fontSize: 13 }}>Remove</button>}
              </div>
            </div>
          )}

          {/* Preview result */}
          {preview && (
            <div style={{ padding: '12px 14px', background: preview.matched > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: '1px solid ' + (preview.matched > 0 ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'), borderRadius: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: preview.matched > 0 ? GREEN : RED, marginBottom: preview.sample.length > 0 ? 6 : 0 }}>
                {preview.matched > 0 ? `✓ ${preview.matched} matching user(s) found` : '✗ No users match these criteria'}
              </div>
              {preview.sample.length > 0 && (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  {preview.sample.join(', ')}{preview.matched > preview.sample.length ? ` +${preview.matched - preview.sample.length} more` : ''}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handlePreview} disabled={previewing}
            style={{ flex: 1, padding: 11, background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 7, color: TEAL, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: previewing ? 'wait' : 'pointer' }}>
            {previewing ? 'Checking…' : 'Preview'}
          </button>
          <button onClick={handleSend} disabled={sending || !preview || preview.matched === 0}
            style={{ flex: 2, padding: 11, background: sending || !preview || preview.matched === 0 ? 'rgba(34,197,94,0.2)' : GREEN, border: 'none', borderRadius: 7, color: '#000', fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, cursor: sending || !preview || preview.matched === 0 ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
            {sending ? 'Sending…' : `Send to ${preview?.matched ?? 0} Users`}
          </button>
        </div>
      </div>

      {/* Confirm Send Modal */}
      {confirmSend && preview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: BG2, border: '1px solid rgba(20,184,166,0.3)', borderRadius: 12, width: '100%', maxWidth: 400, padding: 28 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: TEAL, marginBottom: 10 }}>CONFIRM SEND</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 24 }}>
              You are about to send <strong style={{ color: '#F5F5F5' }}>{ad.name}</strong> to{' '}
              <strong style={{ color: TEAL }}>{preview.matched} user(s)</strong>. This action cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setConfirmSend(false)}
                style={{ flex: 1, padding: '10px 0', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleConfirmedSend}
                style={{ flex: 2, padding: '10px 0', background: GREEN, border: 'none', borderRadius: 8, color: '#000', fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer', fontWeight: 700 }}>
                Confirm Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}