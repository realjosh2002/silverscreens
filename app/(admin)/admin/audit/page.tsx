'use client';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopnav from '@/components/layout/AdminTopnav';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, Download, Search, ChevronUp, ChevronDown, RefreshCw, Calendar, X,
} from 'lucide-react';

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

const MOD_COLOR: Record<string, string> = {
  profiles:          BLUE,
  aspirant_profiles: TEAL,
  agency_profiles:   PURPLE,
  agency_documents:  ORANGE,
  casting_calls:     GREEN,
  applications:      '#22C55E',
  subscriptions:     GOLD,
  notifications:     '#EC4899',
  system:            '#6B7280',
};
function modColor(et: string) { return MOD_COLOR[et] || BLUE; }

const ENTITY_LABELS: Record<string, string> = {
  profiles:          'User Profiles',
  aspirant_profiles: 'Aspirant Profiles',
  agency_profiles:   'Agency Profiles',
  agency_documents:  'Agency Documents',
  casting_calls:     'Casting Calls',
  applications:      'Applications',
  subscriptions:     'Subscriptions',
  notifications:     'Notifications',
  system:            'System',
};
function modLabel(et: string) {
  return ENTITY_LABELS[et] || (et || 'System').replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const t = u.token ?? u.access_token ?? u.accessToken ?? '';
    return t ? { Authorization: 'Bearer ' + t } : {};
  } catch { return {}; }
}

function fmtTs(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
  };
}

function getInitials(name: string) {
  return (name || 'SY').split(' ').map(function(w: string) { return w[0]; }).join('').toUpperCase().slice(0, 2);
}

function exportCSV(logs: any[]) {
  const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Entity ID', 'IP Address', 'Status'];
  function esc(v: string) { return '"' + String(v).split('"').join('""') + '"'; }
  const rows = logs.map(function(l) {
    const d = new Date(l.ts);
    return [
      d.toLocaleString('en-IN'),
      l.user, l.role, l.action,
      modLabel(l.entity_type),
      l.entity_id, l.ip, l.status,
    ];
  });
  const csv = [headers].concat(rows).map(function(r) { return r.map(function(v) { return esc(String(v)); }).join(','); }).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'audit-logs-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* Activity chart */
function ActivityChart(props: { labels: string[]; success: number[]; failed: number[] }) {
  const { labels, success, failed } = props;
  const w = 248, h = 120;
  const allVals = success.concat(failed);
  const max = Math.max.apply(null, allVals.concat([1]));
  const pad = { t: 10, b: 28, l: 32, r: 8 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const n = labels.length;
  function toX(i: number) { return pad.l + (i / Math.max(n - 1, 1)) * cw; }
  function toY(v: number) { return pad.t + ch - (v / max) * ch; }
  function pts(data: number[]) { return data.map(function(v, i) { return toX(i) + ',' + toY(v); }).join(' '); }
  const step = Math.ceil(max / 4);
  const yTicks = [0, step, step * 2, step * 3, step * 4].filter(function(v) { return v <= max + step; });
  return (
    <svg width="100%" height={h} viewBox={'0 0 ' + w + ' ' + h} preserveAspectRatio="none" style={{ display: 'block' }}>
      {yTicks.map(function(v) {
        return (
          <g key={v}>
            <line x1={pad.l} y1={toY(v)} x2={w - pad.r} y2={toY(v)} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
            <text x={pad.l - 4} y={toY(v) + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize={10} fontFamily={BARLOW}>{v}</text>
          </g>
        );
      })}
      {labels.map(function(l, i) {
        return (
          <text key={i} x={toX(i)} y={h - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={10} fontFamily={BARLOW}>
            {l.split(' ')[0]}
          </text>
        );
      })}
      {n > 0 && (
        <>
          <polygon points={toX(0) + ',' + toY(0) + ' ' + pts(success) + ' ' + toX(n - 1) + ',' + toY(0)} fill={GREEN + '18'} />
          <polyline points={pts(success)} fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {success.map(function(v, i) { return <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill={GREEN} />; })}
          <polygon points={toX(0) + ',' + toY(0) + ' ' + pts(failed) + ' ' + toX(n - 1) + ',' + toY(0)} fill={RED + '18'} />
          <polyline points={pts(failed)} fill="none" stroke={RED} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {failed.map(function(v, i) { return <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill={RED} />; })}
        </>
      )}
    </svg>
  );
}

/* Module donut */
function ModuleDonut(props: { stats: { label: string; pct: number; color: string }[]; total: number }) {
  const { stats, total } = props;
  const cx = 60, cy = 60, R = 48, r = 28;
  function toRad(d: number) { return (d * Math.PI) / 180; }
  function pt(a: number, rad: number): [number, number] { return [cx + rad * Math.cos(toRad(a)), cy + rad * Math.sin(toRad(a))]; }
  let start = -90;
  const arcs = stats.map(function(seg) {
    const sweep = (seg.pct / 100) * 356;
    const end = start + sweep;
    const large = sweep > 180 ? 1 : 0;
    const [x1, y1] = pt(start, R); const [x2, y2] = pt(end, R);
    const [x3, y3] = pt(end, r);   const [x4, y4] = pt(start, r);
    const d = 'M ' + x1 + ' ' + y1 + ' A ' + R + ' ' + R + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2 + ' L ' + x3 + ' ' + y3 + ' A ' + r + ' ' + r + ' 0 ' + large + ' 0 ' + x4 + ' ' + y4 + ' Z';
    start = end + 1.5;
    return { color: seg.color, d: d };
  });
  const display = total >= 1000 ? (total / 1000).toFixed(1) + 'K' : String(total);
  return (
    <div style={{ position: 'relative' as const, width: 120, height: 120, flexShrink: 0 }}>
      <svg width="120" height="120">
        <circle cx={cx} cy={cy} r={r - 1} fill={BG3} />
        {arcs.map(function(a, i) { return <path key={i} d={a.d} fill={a.color} />; })}
      </svg>
      <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', lineHeight: 1 }}>{display}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Total</div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 20, height: 20, border: '2px solid ' + GOLD_BDR, borderTop: '2px solid ' + GOLD, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

interface LogRow {
  id: string; ts: string; user: string; role: string;
  action: string; entity_type: string; entity_id: string;
  ip: string; status: string; user_agent: string;
}
interface Summary {
  total_logs: number;
  success_count: number;
  failed_count: number;
  module_stats: { label: string; count: number; pct: number }[];
  activity_chart: { dates: string[]; success: number[]; failed: number[] };
  top_users: { name: string; role: string; count: number; avatar: string }[];
}

const PERIOD_OPTIONS = [
  { label: 'Last 7 Days',  days: 7   },
  { label: 'Last 30 Days', days: 30  },
  { label: 'This Month',   days: 30  },
  { label: 'This Year',    days: 365 },
];
const COLORS = [TEAL, BLUE, PURPLE, GREEN, ORANGE, '#EC4899', '#6B7280', RED];

export default function AuditLogsPage() {
  const router = useRouter();
  const [_collapsed, setCollapsed] = useState(false);

  const [search,   setSearch]   = useState('');
  const [actionF,  setActionF]  = useState('');
  const [entityF,  setEntityF]  = useState('');
  const [statusF,  setStatusF]  = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo,   setDateTo]   = useState('');
  const [showDate, setShowDate] = useState(false);
  const [sortTs,   setSortTs]   = useState<'asc'|'desc'>('desc');
  const [sortUser, setSortUser] = useState<'asc'|'desc'|''>('');
  const [page,     setPage]     = useState(1);
  const PER_PG = 15;

  const [logs,         setLogs]         = useState<LogRow[]>([]);
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [logsLoading,  setLogsLoading]  = useState(true);
  const [allLogs,      setAllLogs]      = useState<LogRow[]>([]); // for export

  const [summary,        setSummary]        = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryPeriod,  setSummaryPeriod]  = useState('Last 30 Days');

  const fetchLogs = useCallback(async function() {
    setLogsLoading(true);
    const h = await getAuthHeaders();
    const params = new URLSearchParams({
      page:        String(page),
      limit:       String(PER_PG),
      search:      search,
      action:      actionF,
      entity_type: entityF,
      status:      statusF,
      sort_ts:     sortTs,
      sort_user:   sortUser,
    });
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo)   params.set('date_to',   dateTo);

    try {
      const res  = await fetch('/api/admin/audit?' + params.toString(), { headers: h });
      const data = await res.json().catch(function() { return null; });
      if (!res.ok) {
        console.error('[AUDIT] API error:', res.status, data?.message || data?.error);
      }
      if (data?.data) {
        setLogs(data.data.logs || []);
        setTotal(data.data.total || 0);
        setTotalPages(data.data.total_pages || 1);
      }
    } catch(err) { console.error('[AUDIT] Fetch error:', err); }
    setLogsLoading(false);
  }, [page, search, actionF, entityF, statusF, sortTs, sortUser, dateFrom, dateTo]);

  const fetchAllForExport = useCallback(async function() {
    const h = await getAuthHeaders();
    const params = new URLSearchParams({
      page: '1', limit: '500',
      search: search, action: actionF,
      entity_type: entityF, status: statusF,
      sort_ts: sortTs,
    });
    try {
      const res  = await fetch('/api/admin/audit?' + params.toString(), { headers: h });
      const data = res.ok ? await res.json() : null;
      if (data?.data?.logs) {
        exportCSV(data.data.logs);
      }
    } catch {}
  }, [search, actionF, entityF, statusF, sortTs]);

  const fetchSummary = useCallback(async function(periodLabel: string) {
    setSummaryLoading(true);
    const days = PERIOD_OPTIONS.find(function(o) { return o.label === periodLabel; })?.days ?? 30;
    const h    = await getAuthHeaders();
    try {
      const res  = await fetch('/api/admin/audit?report=summary&period_days=' + days, { headers: h });
      const data = res.ok ? await res.json() : null;
      if (data?.data) setSummary(data.data);
    } catch {}
    setSummaryLoading(false);
  }, []);

  useEffect(function() { fetchLogs(); },   [fetchLogs]);
  useEffect(function() { fetchSummary(summaryPeriod); }, [fetchSummary, summaryPeriod]);

  function resetFilters() {
    setSearch(''); setActionF(''); setEntityF(''); setStatusF('');
    setDateFrom(''); setDateTo(''); setPage(1);
  }

  const hasFilters = search || actionF || entityF || statusF || dateFrom || dateTo;

  const moduleStatsWithColor = (summary?.module_stats ?? []).map(function(m, i) {
    return Object.assign({}, m, { color: COLORS[i % COLORS.length] });
  });

  // Use exact counts from API — full period totals, not chart subset
  const successCount = summary?.success_count ?? logs.filter(function(l) { return l.status === 'Success'; }).length;
  const failedCount  = summary?.failed_count  ?? logs.filter(function(l) { return l.status === 'Failed'; }).length;
  const uniqueUsers  = summary?.top_users
    ? (summary.top_users.length >= 5 ? '5+' : String(summary.top_users.length))
    : String(new Set(logs.map(function(l) { return l.user; })).size);

  const selStyle: React.CSSProperties = {
    background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '7px 26px 7px 10px',
    outline: 'none', cursor: 'pointer', appearance: 'none',
  };
  const periodSel: React.CSSProperties = {
    ...selStyle, fontSize: 12, padding: '4px 20px 4px 8px', background: BG4,
  };

  function SortBtn(props: { active: boolean; dir: 'asc'|'desc'; onClick: () => void }) {
    return (
      <span onClick={function(e) { e.stopPropagation(); props.onClick(); }} style={{ cursor: 'pointer', opacity: props.active ? 1 : 0.4, marginLeft: 3, display: 'inline-flex', alignItems: 'center' }}>
        {props.dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </span>
    );
  }

  function pageNums() {
    const nums: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (page > 3) nums.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
      if (page < totalPages - 2) nums.push('...');
      nums.push(totalPages);
    }
    return nums;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AdminTopnav />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar onCollapse={setCollapsed} />

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const }}>

          {/* Header */}
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: '0 0 3px', color: GOLD }}>Audit Logs</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Track all system activities, changes and access across the platform.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              <span onClick={function() { router.push('/admin/dashboard'); }} style={{ cursor: 'pointer' }}
                onMouseEnter={function(e) { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>Home</span>
              <ChevronRight size={12} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Audit Logs</span>
            </div>
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', flex: 1, overflow: 'hidden' }}>

            {/* LEFT */}
            <div style={{ overflowY: 'auto' as const, padding: '14px 20px 28px', display: 'flex', flexDirection: 'column' as const, gap: 12 }}>

              {/* Filters */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
                <div style={{ position: 'relative' as const, flex: 1, minWidth: 220 }}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={function(e) { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search action, entity, IP..."
                    style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '8px 10px 8px 30px', outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
                <input value={actionF} onChange={function(e) { setActionF(e.target.value); setPage(1); }}
                  placeholder="Filter by action..."
                  style={{ background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '8px 10px', outline: 'none', width: 150 }} />
                <select value={entityF} onChange={function(e) { setEntityF(e.target.value); setPage(1); }} style={selStyle}>
                  <option value="">All Modules</option>
                  {[
                    { value: 'profiles',         label: 'User Profiles'      },
                    { value: 'aspirant_profiles', label: 'Aspirant Profiles'  },
                    { value: 'agency_profiles',   label: 'Agency Profiles'    },
                    { value: 'agency_documents',  label: 'Agency Documents'   },
                    { value: 'casting_calls',     label: 'Casting Calls'      },
                    { value: 'applications',      label: 'Applications'       },
                    { value: 'subscriptions',     label: 'Subscriptions'      },
                    { value: 'notifications',     label: 'Notifications'      },
                    { value: 'system',            label: 'System'             },
                  ].map(function(opt) { return <option key={opt.value} value={opt.value} style={{ background: BG3 }}>{opt.label}</option>; })}
                </select>
                <select value={statusF} onChange={function(e) { setStatusF(e.target.value); setPage(1); }} style={selStyle}>
                  <option value="">All Status</option>
                  <option value="Success" style={{ background: BG3 }}>Success</option>
                  <option value="Failed"  style={{ background: BG3 }}>Failed</option>
                </select>

                {/* Date range picker */}
                <div style={{ position: 'relative' as const }}>
                  <div onClick={function(e) { e.stopPropagation(); setShowDate(function(v) { return !v; }); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: BG3, border: '1px solid ' + (showDate ? GOLD : 'rgba(255,255,255,0.1)'), borderRadius: 7, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                    <Calendar size={13} color={GOLD} />
                    <span style={{ fontSize: 14, color: (dateFrom || dateTo) ? '#F5F5F5' : 'rgba(255,255,255,0.45)' }}>
                      {(dateFrom || dateTo) ? (dateFrom || '?') + ' to ' + (dateTo || '?') : 'Date Range'}
                    </span>
                  </div>
                  {showDate && (
                    <div onClick={function(e) { e.stopPropagation(); }}
                      style={{ position: 'absolute' as const, left: 0, top: 42, background: BG4, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: 14, zIndex: 60, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 220 }}>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>DATE RANGE</div>
                      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>FROM</div>
                          <input type="date" value={dateFrom} onChange={function(e) { setDateFrom(e.target.value); setPage(1); }}
                            style={{ width: '100%', background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '7px 10px', outline: 'none', colorScheme: 'dark' as any }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>TO</div>
                          <input type="date" value={dateTo} onChange={function(e) { setDateTo(e.target.value); setPage(1); }}
                            style={{ width: '100%', background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '7px 10px', outline: 'none', colorScheme: 'dark' as any }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={function() { setShowDate(false); }}
                            style={{ flex: 1, padding: '7px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 6, color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>Apply</button>
                          <button onClick={function() { setDateFrom(''); setDateTo(''); setShowDate(false); }}
                            style={{ flex: 1, padding: '7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>Clear</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={fetchAllForExport}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid ' + GOLD_BDR, color: GOLD, borderRadius: 7, padding: '8px 14px', fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                  onMouseEnter={function(e) { e.currentTarget.style.background = GOLD_DIM; }}
                  onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                  <Download size={13} color={GOLD} /> Export CSV
                </button>
                <button onClick={function() { fetchLogs(); fetchSummary(summaryPeriod); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', borderRadius: 7, padding: '8px 12px', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = GOLD; }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                  <RefreshCw size={13} /> Refresh
                </button>
                {hasFilters && (
                  <button onClick={resetFilters}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', borderRadius: 7, padding: '8px 12px', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}
                    onMouseEnter={function(e) { e.currentTarget.style.borderColor = RED; }}
                    onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                    <X size={12} /> Reset
                  </button>
                )}
              </div>

              {/* Active filter pills */}
              {hasFilters && (
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                  {[
                    search   && { label: 'Search: ' + search, clear: function() { setSearch(''); } },
                    actionF  && { label: 'Action: ' + actionF, clear: function() { setActionF(''); } },
                    entityF  && { label: 'Module: ' + modLabel(entityF), clear: function() { setEntityF(''); } },
                    statusF  && { label: 'Status: ' + statusF, clear: function() { setStatusF(''); } },
                    (dateFrom || dateTo) && { label: 'Date: ' + (dateFrom || '?') + ' to ' + (dateTo || '?'), clear: function() { setDateFrom(''); setDateTo(''); } },
                  ].filter(Boolean).map(function(pill: any, i: number) {
                    return (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 20, fontSize: 13, color: GOLD }}>
                        {pill.label}
                        <X size={11} style={{ cursor: 'pointer' }} onClick={pill.clear} />
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Table */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>

                {/* Header row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.2fr 1.8fr 1.2fr 1fr 1fr 1fr 0.8fr', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', gap: 8, borderRadius: '12px 12px 0 0' }}>
                  {[
                    { label: 'TIMESTAMP',   sort: 'ts'   },
                    { label: 'USER',        sort: 'user' },
                    { label: 'ACTION',      sort: null   },
                    { label: 'MODULE',      sort: null   },
                    { label: 'ENTITY TYPE', sort: null   },
                    { label: 'ENTITY ID',   sort: null   },
                    { label: 'IP ADDRESS',  sort: null   },
                    { label: 'STATUS',      sort: null   },
                  ].map(function(h) {
                    return (
                      <div key={h.label}
                        style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3, cursor: h.sort ? 'pointer' : 'default' }}
                        onClick={function() {
                          if (h.sort === 'ts')   { setSortTs(function(v) { return v === 'asc' ? 'desc' : 'asc'; }); setSortUser(''); }
                          if (h.sort === 'user') { setSortUser(function(v) { return v === 'asc' ? 'desc' : 'asc'; }); }
                        }}>
                        {h.label}
                        {h.sort === 'ts' && (
                          <>
                            <SortBtn active={sortTs === 'asc'  && sortUser === ''} dir="asc"  onClick={function() { setSortTs('asc');  setSortUser(''); }} />
                            <SortBtn active={sortTs === 'desc' && sortUser === ''} dir="desc" onClick={function() { setSortTs('desc'); setSortUser(''); }} />
                          </>
                        )}
                        {h.sort === 'user' && (
                          <>
                            <SortBtn active={sortUser === 'asc'}  dir="asc"  onClick={function() { setSortUser('asc');  }} />
                            <SortBtn active={sortUser === 'desc'} dir="desc" onClick={function() { setSortUser('desc'); }} />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Rows */}
                {logsLoading ? <Spinner /> :
                  logs.length === 0
                    ? <div style={{ padding: 40, textAlign: 'center' as const, fontSize: 15, color: 'rgba(255,255,255,0.3)' }}>
                        No logs match your filters.{' '}
                        {hasFilters && <span onClick={resetFilters} style={{ color: GOLD, cursor: 'pointer', textDecoration: 'underline' }}>Clear filters</span>}
                      </div>
                    : logs.map(function(log, i) {
                        const { date, time } = fmtTs(log.ts);
                        const col = modColor(log.entity_type);
                        return (
                          <div key={log.id}
                            style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.2fr 1.8fr 1.2fr 1fr 1fr 1fr 0.8fr', padding: '10px 14px', borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'background 0.15s' }}
                            onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                            onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                              <div>{date}</div>
                              <div>{time}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: BLUE + '25', border: '1px solid ' + BLUE + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
                                {log.user === 'System' ? '>' : getInitials(log.user)}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{log.user}</div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, textTransform: 'capitalize' as const }}>{log.role}</div>
                              </div>
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{log.action}</div>
                            </div>
                            <div>
                              <span style={{ padding: '3px 9px', background: col + '22', border: '1px solid ' + col + '44', borderRadius: 12, fontSize: 11, color: col, fontWeight: 600, whiteSpace: 'nowrap' as const }}>
                                {modLabel(log.entity_type)}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                              {modLabel(log.entity_type)}
                            </div>
                            <div style={{ fontSize: 12, color: GOLD, fontWeight: 600, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                              {String(log.entity_id).slice(0, 8)}...
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{log.ip}</div>
                            <div>
                              <span style={{ padding: '3px 9px', background: log.status === 'Success' ? GREEN + '20' : RED + '20', border: '1px solid ' + (log.status === 'Success' ? GREEN : RED) + '44', borderRadius: 12, fontSize: 12, color: log.status === 'Success' ? GREEN : RED, fontWeight: 600 }}>
                                {log.status}
                              </span>
                            </div>
                          </div>
                        );
                      })
                }

                {/* Pagination */}
                {!logsLoading && total > 0 && (
                  <div style={{ padding: '11px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: BG2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0 0 12px 12px' }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                      Showing {((page - 1) * PER_PG) + 1}-{Math.min(page * PER_PG, total)} of {total.toLocaleString('en-IN')} logs
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <button onClick={function() { setPage(1); }} disabled={page === 1}
                        style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>1st</button>
                      <button onClick={function() { setPage(function(p) { return Math.max(1, p - 1); }); }} disabled={page === 1}
                        style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 16 }}>{'<'}</button>
                      {pageNums().map(function(p, i) {
                        return p === '...'
                          ? <span key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', padding: '0 2px' }}>...</span>
                          : <button key={i} onClick={function() { setPage(p as number); }}
                              style={{ width: 30, height: 30, background: p === page ? GOLD : 'transparent', border: '1px solid ' + (p === page ? GOLD : 'rgba(255,255,255,0.12)'), borderRadius: 6, color: p === page ? '#000' : '#F5F5F5', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14, fontWeight: p === page ? 700 : 400 }}>{p}</button>;
                      })}
                      <button onClick={function() { setPage(function(p) { return Math.min(totalPages, p + 1); }); }} disabled={page === totalPages}
                        style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 16 }}>{'>'}</button>
                      <button onClick={function() { setPage(totalPages); }} disabled={page === totalPages}
                        style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 13 }}>Last</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ overflowY: 'auto' as const, padding: '14px 16px 28px', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

              {/* Log Summary */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>LOG SUMMARY</div>
                  <select value={summaryPeriod} onChange={function(e) { setSummaryPeriod(e.target.value); fetchSummary(e.target.value); }} style={periodSel}>
                    {PERIOD_OPTIONS.map(function(o) { return <option key={o.label} style={{ background: BG3 }}>{o.label}</option>; })}
                  </select>
                </div>
                {summaryLoading ? <Spinner /> : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { icon: 'L', label: 'Total Logs',   value: (summary?.total_logs ?? 0).toLocaleString('en-IN'), color: BLUE   },
                      { icon: 'S', label: 'Successful',   value: successCount.toLocaleString('en-IN'),               color: GREEN  },
                      { icon: 'F', label: 'Failed',       value: failedCount.toLocaleString('en-IN'),                color: RED    },
                      { icon: 'U', label: 'Unique Users', value: uniqueUsers,                                        color: PURPLE },
                    ].map(function(s) {
                      return (
                        <div key={s.label} style={{ background: BG4, borderRadius: 10, padding: '14px 12px', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: s.color + '22', border: '1px solid ' + s.color + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: s.color }}>{s.icon}</div>
                          <div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3, marginBottom: 3, whiteSpace: 'nowrap' as const }}>{s.label}</div>
                            <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#F5F5F5', lineHeight: 1, letterSpacing: 0.5 }}>{s.value}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Logs by Module */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 14 }}>LOGS BY MODULE</div>
                {summaryLoading ? <Spinner /> : (
                  <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 12 }}>
                    <ModuleDonut stats={moduleStatsWithColor} total={summary?.total_logs ?? 0} />
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' as const, gap: 7 }}>
                      {moduleStatsWithColor.map(function(m) {
                        return (
                          <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                            onClick={function() { setEntityF(m.label); setPage(1); }}>
                            <div style={{ width: 9, height: 9, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', flex: 1 }}>{modLabel(m.label)}</span>
                            <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 700 }}>{m.pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Overview */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 10 }}>ACTIVITY OVERVIEW</div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  {[{ label: 'Success', color: GREEN }, { label: 'Failed', color: RED }].map(function(l) {
                    return (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 16, height: 2, background: l.color, borderRadius: 1 }} />
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{l.label}</span>
                      </div>
                    );
                  })}
                </div>
                {summaryLoading ? <Spinner /> : (
                  <ActivityChart
                    labels={summary?.activity_chart?.dates   ?? []}
                    success={summary?.activity_chart?.success ?? []}
                    failed={summary?.activity_chart?.failed  ?? []}
                  />
                )}
              </div>

              {/* Top Active Users */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: GOLD }}>TOP ACTIVE USERS</div>
                  <select value={summaryPeriod} onChange={function(e) { setSummaryPeriod(e.target.value); fetchSummary(e.target.value); }} style={periodSel}>
                    {PERIOD_OPTIONS.map(function(o) { return <option key={o.label} style={{ background: BG3 }}>{o.label}</option>; })}
                  </select>
                </div>
                {summaryLoading ? <Spinner /> : (
                  (summary?.top_users ?? []).length === 0
                    ? <div style={{ padding: '20px 0', textAlign: 'center' as const, fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>No user activity yet.</div>
                    : (summary?.top_users ?? []).map(function(u, i) {
                        return (
                          <div key={i} onClick={function() { router.push('/admin/users'); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < (summary!.top_users.length - 1) ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}
                            onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                            onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{u.avatar}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{u.name}</div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' as const }}>{u.role}</div>
                            </div>
                            <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', letterSpacing: 0.5 }}>{u.count}</div>
                          </div>
                        );
                      })
                )}
                <button onClick={function() { router.push('/admin/users'); }}
                  style={{ width: '100%', marginTop: 12, padding: '10px', background: 'transparent', border: '1px solid ' + GOLD, borderRadius: 8, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.3 }}
                  onMouseEnter={function(e) { e.currentTarget.style.background = GOLD_DIM; }}
                  onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                  View All Users
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}