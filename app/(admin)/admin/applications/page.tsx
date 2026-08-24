'use client';
import AdminSidebar from '@/components/layout/AdminSidebar';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Wallet,
  Database, Settings, ScrollText, Bell, ChevronRight,
  TrendingUp, Download, AlertTriangle,
  MoreVertical, ClipboardCheck, BadgeCheck, UserCheck,
  BellRing, Ticket, KeyRound, ChevronLeft, Menu,
  ChevronDown, Eye, Search, Filter,
  CheckSquare, Square, Lock, Activity,
  BarChart, X, Info, ShieldAlert, Zap,
} from 'lucide-react';
import AdminTopnav from '@/components/layout/AdminTopnav';

/* ─── Design tokens — identical to admin dashboard ──────────── */
const BG       = '#050505';
const BG2      = '#0B0F14';
const BG3      = '#121821';
const BG4      = 'rgba(255,255,255,0.03)';
const GOLD     = '#D4A64A';
const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';
const BEBAS    = "'Bebas Neue', sans-serif";
const BARLOW   = "'Barlow Condensed', sans-serif";
const GREEN    = '#22C55E';
const RED      = '#C8202A';
const BLUE     = '#3B82F6';
const PURPLE   = '#8B5CF6';
const ORANGE   = '#F97316';
const TEAL     = '#14B8A6';

/* ─── Sidebar nav ────────────────────────────────────────────── */

const PROFILE_MENU = [
  { label: 'My Profile',               href: '/admin/profile'          },
  { label: 'Account Settings',         href: '/admin/account-settings' },
  { label: 'Security & Login',         href: '/admin/security-login'   },
  { label: 'Notification Preferences', href: '/admin/notifications'    },
  { label: 'Activity Log',             href: '/admin/activity-log'     },
  { label: 'Help & Support',           href: '/admin/help-support'     },
  { label: 'Logout',                   href: '/admin/login'            },
];

/* ─── Fallback stat cards (shown while loading) ──────────────── */
const STATS_FALLBACK = [
  { label: 'Total Applications',  value: '—',  delta: '—', sub: 'from last 7 days', iconColor: BLUE,   positive: true  },
  { label: 'Unique Applicants',   value: '—',  delta: '—', sub: 'from last 7 days', iconColor: PURPLE, positive: true  },
  { label: 'Applications Today',  value: '—',  delta: '—', sub: 'from yesterday',   iconColor: TEAL,   positive: true  },
  { label: 'Flagged Applications',value: '—',  delta: '—', sub: 'from last 7 days', iconColor: ORANGE, positive: false },
  { label: 'Spam Detected',       value: '—',  delta: '—', sub: 'from last 7 days', iconColor: RED,    positive: false },
  { label: 'Auto Blocked',        value: '—',  delta: '—', sub: 'from last 7 days', iconColor: PURPLE, positive: false },
];

/* ─── Fallback chart data ─────────────────────────────────────── */
const CHART_LABELS_FALLBACK = ['—','—','—','—','—','—','—'];
const CHART_DATA_FALLBACK   = [0, 0, 0, 0, 0, 0, 0];

/* ─── Fallback donuts ─────────────────────────────────────────── */
const STATUS_DATA_FALLBACK = [
  { label: 'Submitted',  value: 0, pct: 76.0, color: BLUE   },
  { label: 'Reviewed',   value: 0, pct: 15.2, color: GREEN  },
  { label: 'Shortlisted',value: 0, pct: 5.5,  color: GOLD   },
  { label: 'Rejected',   value: 0, pct: 3.3,  color: RED    },
];

const RISK_DATA_FALLBACK = [
  { label: 'High Risk',  value: 0, pct: 33.3, color: RED    },
  { label: 'Medium Risk',value: 0, pct: 33.3, color: ORANGE },
  { label: 'Low Risk',   value: 0, pct: 33.4, color: GREEN  },
];

/* ─── Fallback insights ───────────────────────────────────────── */
const INSIGHTS_FALLBACK = [
  { icon: ShieldAlert, iconBg: 'rgba(239,68,68,0.15)',   iconColor: RED,    title: 'Multiple applications from same device/IP', sub: 'Loading…', href: '/admin/fraud'     },
  { icon: Zap,         iconBg: 'rgba(249,115,22,0.15)', iconColor: ORANGE, title: 'Bulk applications detected',               sub: 'Loading…', href: '/admin/fraud'     },
  { icon: Activity,    iconBg: 'rgba(139,92,246,0.15)', iconColor: PURPLE, title: 'Unusual activity spike',                   sub: 'Loading…', href: '/admin/analytics' },
];

/* ─── Risk styling ────────────────────────────────────────────── */
const RISK_COLOR: Record<string,string> = { High: RED, Medium: ORANGE, Low: GREEN };
const RISK_BG:    Record<string,string> = { High: 'rgba(239,68,68,0.12)', Medium: 'rgba(249,115,22,0.12)', Low: 'rgba(34,197,94,0.12)' };
const PER_PAGE = 5;
const TIME_FILTERS = ['Today','Last 7 Days','Last 30 Days','Custom Range'];
const RISK_FILTERS = ['All Risk Levels','High','Medium','Low'];

/* ─── Types ───────────────────────────────────────────────────── */
type StatCard = { label: string; value: string; delta: string; sub: string; iconColor: string; positive: boolean };
type StatusRow = { label: string; value: number; pct: number; color: string };
type RiskRow   = { label: string; value: number; pct: number; color: string };
type InsightRow = { icon: typeof ShieldAlert; iconBg: string; iconColor: string; title: string; sub: string; href: string };
type FlaggedApp = {
  id: string; date: string; time: string; applicant: string;
  uid: string; casting: string; project: string;
  risk: string; reason: string; img: string; status: string;
};

/* ─── Auth helper ─────────────────────────────────────────────── */
function getToken(): string {
  try {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    return key ? JSON.parse(localStorage.getItem(key) || '{}')?.access_token || '' : '';
  } catch { return ''; }
}

/* ─── SVG Line Chart ─────────────────────────────────────────── */
function AppOverTimeChart({ labels, data, period }: { labels: string[]; data: number[]; period: string }) {
  const W = 420, H = 180;
  const pl = 40, pb = 155, pr = W-10, pt = 14;
  const pw = pr-pl, ph = pb-pt;

  const mx = (i: number) => pl + (i/(labels.length-1||1))*pw;

  // All zeros — show friendly empty state with X-axis labels
  const allZero = !data.length || data.every(v=>v===0);
  if(allZero) return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',overflow:'visible'}}>
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1}/>
      {labels.map((l,i)=><text key={i} x={mx(i)} y={pb+16} fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="middle" fontFamily={BARLOW}>{l}</text>)}
      <text x={W/2} y={pb-50} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={11} fontFamily={BARLOW}>No applications in this period</text>
    </svg>
  );

  // Smart maxY: scale to actual data so small values are visible
  const rawMax = Math.max(...data);
  const niceMax = (n:number): number => {
    if(n <= 5)   return 10;
    if(n <= 10)  return 15;
    if(n <= 20)  return 25;
    if(n <= 50)  return 60;
    if(n <= 100) return 120;
    if(n <= 500) return Math.ceil(n*1.2/100)*100;
    if(n <= 1000) return Math.ceil(n*1.2/200)*200;
    const mag = Math.pow(10, Math.floor(Math.log10(n)));
    return Math.ceil(n*1.2/mag)*mag;
  };
  const maxY = niceMax(rawMax);

  // Nice grid: 5 lines, formatted labels
  const gridStep = maxY/4;
  const gridY = [0,gridStep,gridStep*2,gridStep*3,maxY];
  const fmtY = (v:number) => v>=1000 ? `${(v/1000).toFixed(v%1000===0?0:1)}K` : String(Math.round(v));

  const my = (v: number) => pb - (v/maxY)*ph;

  function smooth(pts: [number,number][]): string {
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i=0;i<pts.length-1;i++) {
      const cp1x=pts[i][0]+(pts[i+1][0]-(pts[i-1]?.[0]??pts[i][0]))/6;
      const cp1y=pts[i][1]+(pts[i+1][1]-(pts[i-1]?.[1]??pts[i][1]))/6;
      const nx2=pts[i+2]?.[0]??pts[i+1][0]+(pts[i+1][0]-pts[i][0]);
      const ny2=pts[i+2]?.[1]??pts[i+1][1]+(pts[i+1][1]-pts[i][1]);
      const cp2x=pts[i+1][0]-(nx2-pts[i][0])/6;
      const cp2y=pts[i+1][1]-(ny2-pts[i][1])/6;
      d+=` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i+1][0]} ${pts[i+1][1]}`;
    }
    return d;
  }
  const pts: [number,number][] = data.map((v,i)=>[mx(i),my(v)]);
  const path = pts.length > 1 ? smooth(pts) : `M ${pts[0]?.[0]??pl} ${pts[0]?.[1]??pb}`;
  const area = pts.length > 1 ? `${path} L ${pts[pts.length-1][0]} ${pb} L ${pts[0][0]} ${pb} Z` : '';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity={0.18}/><stop offset="100%" stopColor={BLUE} stopOpacity={0.01}/></linearGradient></defs>
      {gridY.map(v=>(
        <g key={v}>
          <line x1={pl} y1={my(v)} x2={pr} y2={my(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3"/>
          <text x={pl-6} y={my(v)+4} fill="rgba(255,255,255,0.28)" fontSize={9} textAnchor="end" fontFamily={BARLOW}>{fmtY(v)}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1}/>
      {labels.map((l,i)=><text key={i} x={mx(i)} y={pb+16} fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="middle" fontFamily={BARLOW}>{l}</text>)}
      {area && <path d={area} fill="url(#ag)"/>}
      {pts.length > 1 && <path d={path} fill="none" stroke={BLUE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>}
      {pts.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={3} fill={BLUE} stroke={BG3} strokeWidth={1.5}/>)}
    </svg>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────── */
function DonutChart({data,total,label,size=160}:{data:{label:string;pct:number;color:string}[];total:string;label:string;size?:number}) {
  const cx=size/2,cy=size/2,R=size*0.44,r=size*0.28;
  const toRad=(deg:number)=>(deg*Math.PI)/180;
  const pt=(ang:number,rad:number)=>[cx+rad*Math.cos(toRad(ang)),cy+rad*Math.sin(toRad(ang))];
  const sum=data.reduce((s,d)=>s+d.pct,0);

  // All zero — show a single grey ring
  if (!sum) {
    return (
      <svg viewBox={`0 0 ${size} ${size}`} style={{width:size,height:size,flexShrink:0}}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={R-r}/>
        <circle cx={cx} cy={cy} r={r-2} fill={BG3}/>
        <text x={cx} y={cy-8} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={size*0.065} fontFamily={BARLOW}>{label}</text>
        <text x={cx} y={cy+10} textAnchor="middle" fill="#F5F5F5" fontSize={size*0.13} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
      </svg>
    );
  }

  // Single non-zero segment — draw a full circle instead of arc (arc math breaks at 360°)
  const nonZero = data.filter(d=>d.pct>0);
  if (nonZero.length===1) {
    return (
      <svg viewBox={`0 0 ${size} ${size}`} style={{width:size,height:size,flexShrink:0}}>
        <circle cx={cx} cy={cy} r={(R+r)/2} fill="none" stroke={nonZero[0].color} strokeWidth={R-r}/>
        <circle cx={cx} cy={cy} r={r-2} fill={BG3}/>
        <text x={cx} y={cy-8} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={size*0.065} fontFamily={BARLOW}>{label}</text>
        <text x={cx} y={cy+10} textAnchor="middle" fill="#F5F5F5" fontSize={size*0.13} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
      </svg>
    );
  }

  // Multiple segments — normal arc drawing
  let start=-90;
  const arcs=data.filter(d=>d.pct>0).map(seg=>{
    const sweep=(seg.pct/sum)*360;
    const end=start+sweep-1; // -1 gap between segments
    const large=sweep>180?1:0;
    const [x1,y1]=pt(start,R);const [x2,y2]=pt(end,R);
    const [x3,y3]=pt(end,r);const [x4,y4]=pt(start,r);
    const d=`M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    start=end+1;
    return {...seg,d};
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{width:size,height:size,flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r-2} fill={BG3}/>
      {arcs.map(a=><path key={a.label} d={a.d} fill={a.color}/>)}
      <text x={cx} y={cy-8} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={size*0.065} fontFamily={BARLOW}>{label}</text>
      <text x={cx} y={cy+10} textAnchor="middle" fill="#F5F5F5" fontSize={size*0.13} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
    </svg>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ApplicationMonitoringPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [timePeriod,  setTimePeriod]  = useState('Last 7 Days');
  const [chartPeriod, setChartPeriod] = useState('Daily');
  const [riskFilter,  setRiskFilter]  = useState('All Risk Levels');
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState<string[]>([]);
  const [page,        setPage]        = useState(1);
  const [menuApp,     setMenuApp]     = useState('');
  const [menuPos,     setMenuPos]     = useState({top:0,right:0});
  const [showBulk,    setShowBulk]    = useState(false);
  const [showExport,  setShowExport]  = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [toast,       setToast]       = useState('');

  /* ── Advanced filter state ── */
  const [advRisk,    setAdvRisk]    = useState('All');
  const [advStatus,  setAdvStatus]  = useState('All');
  const [advPeriod,  setAdvPeriod]  = useState('Last 7 Days');
  // Applied values (set when user clicks Apply Filters)
  const [appliedRisk,   setAppliedRisk]   = useState('All');
  const [appliedStatus, setAppliedStatus] = useState('All');

  /* ── Real data state ── */
  const [adminName,    setAdminName]    = useState('Administrator');
  const [adminAvatar,  setAdminAvatar]  = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face');
  const [adminId,      setAdminId]      = useState('Admin');
  const [notifCount,   setNotifCount]   = useState(12);
  const [stats,        setStats]        = useState<StatCard[]>(STATS_FALLBACK);
  const [chartLabels,  setChartLabels]  = useState<string[]>(CHART_LABELS_FALLBACK);
  const [chartData,    setChartData]    = useState<number[]>(CHART_DATA_FALLBACK);
  const [statusData,   setStatusData]   = useState<StatusRow[]>(STATUS_DATA_FALLBACK);
  const [riskData,     setRiskData]     = useState<RiskRow[]>(RISK_DATA_FALLBACK);
  const [insights,     setInsights]     = useState<InsightRow[]>(INSIGHTS_FALLBACK);
  const [flaggedApps,  setFlaggedApps]  = useState<FlaggedApp[]>([]);
  const [totalFlagged, setTotalFlagged] = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [statusTotal,  setStatusTotal]  = useState('0');

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),2800); };

  /* ── Load admin profile ── */
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.admin) {
          setAdminName(d.admin.full_name || 'Administrator');
          if (d.admin.avatar_url) setAdminAvatar(d.admin.avatar_url);
          if (d.admin.admin_id)   setAdminId(d.admin.admin_id);
        }
      }).catch(() => {});
  }, []);

  /* ── Load notification count ── */
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch('/api/notifications?unread=true&limit=1', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (typeof d.total === 'number') setNotifCount(d.total); })
      .catch(() => {});
  }, []);

  /* ── Load stats, charts, donuts, insights ── */
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`/api/admin/applications?type=stats&period=${encodeURIComponent(timePeriod)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        const r = d.data ?? d;
        if (r.stats)      setStats(r.stats);
        if (r.chartLabels) setChartLabels(r.chartLabels);
        if (r.chartData)   setChartData(r.chartData);
        if (r.statusData)  { setStatusData(r.statusData); setStatusTotal(r.statusTotal || '0'); }
        if (r.riskData)    setRiskData(r.riskData);
        if (r.insights)    setInsights(r.insights.map((ins: any) => ({
          ...ins,
          icon: ins.icon === 'ShieldAlert' ? ShieldAlert : ins.icon === 'Zap' ? Zap : Activity,
        })));
      }).catch(() => {});
  }, [timePeriod]);

  /* ── Load flagged applications table ── */
  const loadApps = useCallback(() => {
    const token = getToken();
    if (!token) return;
    // Merge inline risk filter with advanced filter (inline takes priority if set)
    const effectiveRisk   = riskFilter !== 'All Risk Levels' ? riskFilter : appliedRisk !== 'All' ? appliedRisk : '';
    const effectiveStatus = appliedStatus !== 'All' ? appliedStatus : '';
    const effectivePeriod = timePeriod;
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(PER_PAGE),
      period: effectivePeriod,
      ...(effectiveRisk   && { risk:   effectiveRisk   }),
      ...(effectiveStatus && { status: effectiveStatus }),
      ...(search          && { q:      search          }),
    });
    fetch(`/api/admin/applications?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        const r = d.data ?? d;
        if (r.applications) setFlaggedApps(r.applications);
        if (typeof r.total === 'number') {
          setTotalFlagged(r.total);
          setTotalPages(Math.max(1, Math.ceil(r.total / PER_PAGE)));
        }
      }).catch(() => {});
  }, [page, timePeriod, riskFilter, search, appliedRisk, appliedStatus]);

  useEffect(() => { loadApps(); }, [loadApps]);

  /* ── Table helpers (same logic as original) ── */
  const allSelected = flaggedApps.length>0 && flaggedApps.every(a=>selected.includes(a.id));
  const toggleSelect = (id:string) => setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const toggleAll = () => setSelected(allSelected?selected.filter(id=>!flaggedApps.find(a=>a.id===id)):[...new Set([...selected,...flaggedApps.map(a=>a.id)])]);
  const handleBulk = (action:string) => {
    if (selected.length === 0) { showToast('Select at least one application'); setShowBulk(false); return; }
    const token = getToken();
    fetch('/api/admin/applications/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ids: selected, action }),
    }).catch(() => {});
    showToast(`${action} applied to ${selected.length} application(s)`);
    setSelected([]);
    setShowBulk(false);
    loadApps();
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:BG,fontFamily:BARLOW,color:'#F5F5F5'}}>

      <AdminTopnav />

      {/* ══ BODY ══ */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* ── SIDEBAR ── */}
        <AdminSidebar onCollapse={(c) => setSidebarOpen(!c)} />

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,overflowY:'auto',padding:'20px 22px 40px',display:'flex',flexDirection:'column',gap:16}}>

          {/* Page header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:6}}>
                <span style={{cursor:'pointer'}} onClick={()=>router.push('/admin/dashboard')}>Home</span>
                <ChevronRight size={11}/>
                <span style={{color:'#F5F5F5'}}>Application Monitoring</span>
              </div>
              <h1 style={{fontFamily:BARLOW,fontSize:26,fontWeight:800,margin:0,display:'flex',alignItems:'center',gap:6}}>
                Application Monitoring
                <span style={{width:7,height:7,borderRadius:'50%',background:RED,display:'inline-block',marginBottom:2}}/>
              </h1>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.45)',margin:'4px 0 0'}}>Monitor application ecosystem, identify suspicious activities and ensure platform integrity.</p>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center',flexShrink:0}}>
              <button onClick={()=>setShowFilters(true)} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
                <Filter size={13}/> Filters
              </button>
              <div style={{position:'relative'}}>
                <select value={timePeriod} onChange={e=>{setTimePeriod(e.target.value);setPage(1);}}
                  style={{appearance:'none',padding:'8px 36px 8px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                  {TIME_FILTERS.map(t=><option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} color="rgba(255,255,255,0.5)" style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
              </div>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10}}>
            {stats.map((s,i)=>(
              <div key={i} style={{borderRadius:12,padding:'14px 16px',background:BG3,border:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',gap:8}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:`${s.iconColor}22`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Activity size={16} color={s.iconColor}/>
                </div>
                <div style={{fontSize:14,color:'rgba(255,255,255,0.5)'}}>{s.label}</div>
                <div style={{fontFamily:BEBAS,fontSize:28,letterSpacing:1,lineHeight:1}}>{s.value}</div>
                <div style={{display:'flex',alignItems:'center',gap:5}}>
                  <TrendingUp size={10} color={s.positive?GREEN:RED}/>
                  <span style={{fontSize:14,fontWeight:700,color:s.positive?GREEN:RED}}>{s.delta}</span>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── CHARTS ROW ── */}
          <div style={{display:'grid',gridTemplateColumns:'2fr 1.3fr 1.1fr',gap:14}}>

            {/* Applications Over Time */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:16,fontWeight:700}}>Applications Over Time</span>
                <div style={{position:'relative'}}>
                  <select value={chartPeriod} onChange={e=>setChartPeriod(e.target.value)}
                    style={{appearance:'none',padding:'5px 28px 5px 10px',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {['Daily','Weekly','Monthly'].map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={11} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:7,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              <div style={{width:'100%',height:170}}>
                <AppOverTimeChart labels={chartLabels} data={chartData} period={timePeriod}/>
              </div>
            </div>

            {/* Applications by Status */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Applications by Status</div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <DonutChart data={statusData} total={statusTotal} label="Total" size={145}/>
                <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
                  {statusData.map(d=>(
                    <div key={d.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:d.color,flexShrink:0}}/>
                        <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:14,fontWeight:700}}>{d.value.toLocaleString('en-IN')} <span style={{color:'rgba(255,255,255,0.4)',fontWeight:400}}>({d.pct}%)</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Level Distribution */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Risk Level Distribution</div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                <DonutChart data={riskData} total={String(totalFlagged||riskData.reduce((s,d)=>s+d.value,0))} label="Flagged" size={145}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:8}}>
                  {riskData.map(d=>(
                    <div key={d.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:d.color}}/>
                        <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:14,fontWeight:700,color:d.color}}>{d.value} <span style={{color:'rgba(255,255,255,0.45)',fontWeight:400}}>({d.pct}%)</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── TABLE + INSIGHTS ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:14}}>

            {/* Flagged Table */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden'}}>
              {/* Toolbar */}
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)',flexWrap:'wrap' as const}}>
                <span style={{fontSize:15,fontWeight:700,flex:1}}>
                  All Applications
                  <span style={{marginLeft:8,background:'rgba(239,68,68,0.15)',color:RED,border:'1px solid rgba(239,68,68,0.25)',borderRadius:12,fontSize:14,fontWeight:700,padding:'2px 8px'}}>
                    {totalFlagged}
                  </span>
                </span>
                <div style={{position:'relative'}}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)'}}/>
                  <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search…"
                    style={{background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:7,padding:'7px 10px 7px 28px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',width:150}}/>
                </div>
                <div style={{position:'relative'}}>
                  <select value={riskFilter} onChange={e=>{setRiskFilter(e.target.value);setPage(1);}}
                    style={{appearance:'none',padding:'7px 26px 7px 10px',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:7,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {RISK_FILTERS.map(r=><option key={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={11} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:7,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
                <button onClick={()=>setShowExport(true)}
                  style={{display:'flex',alignItems:'center',gap:6,padding:'7px 13px',background:BG4,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
                  <Download size={13}/> Export
                </button>
                <div style={{position:'relative'}}>
                  <button onClick={()=>setShowBulk(v=>!v)} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 13px',background:selected.length>0?RED:BG4,border:`1px solid ${selected.length>0?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.1)'}`,borderRadius:7,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
                    Bulk Actions{selected.length>0?` (${selected.length})`:''} <ChevronDown size={11}/>
                  </button>
                  {showBulk&&(
                    <>
                      <div onClick={()=>setShowBulk(false)} style={{position:'fixed',inset:0,zIndex:150}}/>
                      <div style={{position:'absolute',top:38,right:0,width:200,background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,overflow:'hidden',zIndex:200,boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}}>
                        {['Mark as Reviewed','Block Selected Users','Mark as Safe','Escalate to Fraud','Export Selected'].map(a=>(
                          <div key={a} onClick={()=>{if(selected.length===0){showToast('Select at least one application');setShowBulk(false);}else handleBulk(a);}}
                            style={{padding:'10px 14px',fontSize:14,cursor:'pointer',color:a.includes('Block')?RED:'#F5F5F5'}}
                            onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                            onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                          >{a}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Column headers */}
              <div style={{display:'grid',gridTemplateColumns:'36px 1.8fr 1.8fr 2fr 85px 110px 1.3fr 88px',padding:'10px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',gap:8}}>
                <div onClick={toggleAll} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                  {allSelected?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.3)"/>}
                </div>
                {['Project / Title','Applicant','Role / Agency','Risk Level','Status','Applied On','Actions'].map(h=>(
                  <div key={h} style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:0.5}}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {flaggedApps.length===0?(
                <div style={{padding:'32px 18px',textAlign:'center',color:'rgba(255,255,255,0.35)',fontSize:14}}>No applications match your filters.</div>
              ):flaggedApps.map((app,i)=>{
                const isSel=selected.includes(app.id);
                return (
                  <div key={app.id}
                    style={{display:'grid',gridTemplateColumns:'36px 1.8fr 1.8fr 2fr 85px 110px 1.3fr 88px',padding:'11px 18px',borderBottom:i<flaggedApps.length-1?'1px solid rgba(255,255,255,0.04)':'none',alignItems:'center',gap:8,background:isSel?'rgba(239,68,68,0.05)':'transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='rgba(255,255,255,0.02)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isSel?'rgba(239,68,68,0.05)':'transparent';}}
                  >
                    <div onClick={()=>toggleSelect(app.id)} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                      {isSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.25)"/>}
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:'#F5F5F5'}}>{app.id}</div>
                      <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginTop:2}}>Applied {app.date}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:28,height:28,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:'1px solid rgba(255,255,255,0.1)'}}>
                        <img src={app.img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      </div>
                      <div>
                        <div style={{fontSize:14,fontWeight:600}}>{app.applicant}</div>
                        <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{app.uid}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:500}}>{app.casting}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{app.project}</div>
                    </div>
                    <div>
                      <span style={{fontSize:14,fontWeight:700,padding:'3px 9px',borderRadius:5,background:RISK_BG[app.risk],color:RISK_COLOR[app.risk],border:`1px solid ${RISK_COLOR[app.risk]}33`}}>{app.risk}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center'}}>
                      {(()=>{
                        const statusStyles: Record<string,{bg:string;color:string;label:string}> = {
                          applied:     {bg:'rgba(59,130,246,0.12)',  color:'#3B82F6', label:'Submitted'  },
                          in_review:   {bg:'rgba(249,115,22,0.12)',  color:'#F97316', label:'In Review'  },
                          shortlisted: {bg:'rgba(212,166,74,0.12)',  color:'#D4A64A', label:'Shortlisted'},
                          rejected:    {bg:'rgba(239,68,68,0.12)',   color:'#EF4444', label:'Rejected'   },
                          on_hold:     {bg:'rgba(139,92,246,0.12)',  color:'#8B5CF6', label:'On Hold'    },
                          withdrawn:   {bg:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.4)', label:'Withdrawn'},
                          selected:    {bg:'rgba(34,197,94,0.12)',   color:'#22C55E', label:'Selected'   },
                        };
                        const s = statusStyles[app.status] ?? {bg:'rgba(255,255,255,0.07)',color:'rgba(255,255,255,0.4)',label:app.status};
                        return (
                          <span style={{fontSize:13,fontWeight:700,padding:'3px 10px',borderRadius:5,background:s.bg,color:s.color,border:`1px solid ${s.color}33`,whiteSpace:'nowrap'}}>
                            {s.label}
                          </span>
                        );
                      })()}
                    </div>
                    <div>
                      <div style={{fontSize: 14}}>{app.date}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{app.time}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <button onClick={()=>router.push(`/admin/aspirant-profile?uid=${app.uid}`)} title="View Profile"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Eye size={12} color={BLUE}/>
                      </button>
                      <button onClick={()=>showToast(`${app.id} flagged for review`)} title="Flag"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(249,115,22,0.12)',border:'1px solid rgba(249,115,22,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Flag size={12} color={ORANGE}/>
                      </button>
                      <button onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setMenuPos({top:r.bottom+4,right:window.innerWidth-r.right});setMenuApp(menuApp===app.id?'':app.id);}}
                        style={{width:26,height:26,borderRadius:6,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <MoreVertical size={12} color="rgba(255,255,255,0.5)"/>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 18px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>
                  Showing {totalFlagged===0?0:Math.min((page-1)*PER_PAGE+1,totalFlagged)} to {Math.min(page*PER_PAGE,totalFlagged)} of {totalFlagged} entries
                </span>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                    style={{width:30,height:30,borderRadius:6,background:BG4,border:'1px solid rgba(255,255,255,0.08)',color:page===1?'rgba(255,255,255,0.2)':'#F5F5F5',cursor:page===1?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>‹</button>
                  {Array.from({length:Math.min(totalPages,5)},(_,i)=>{
                    const pg=i+1;
                    return <button key={pg} onClick={()=>setPage(pg)}
                      style={{width:30,height:30,borderRadius:6,background:page===pg?RED:BG4,border:`1px solid ${page===pg?RED:'rgba(255,255,255,0.08)'}`,color:'#F5F5F5',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:page===pg?700:400}}>{pg}</button>;
                  })}
                  {totalPages>5&&<span style={{color:'rgba(255,255,255,0.35)',fontSize:14}}>…{totalPages}</span>}
                  <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                    style={{width:30,height:30,borderRadius:6,background:BG4,border:'1px solid rgba(255,255,255,0.08)',color:page===totalPages?'rgba(255,255,255,0.2)':'#F5F5F5',cursor:page===totalPages?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>›</button>
                </div>
              </div>
            </div>

            {/* Monitoring Insights */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px',display:'flex',flexDirection:'column'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Monitoring Insights</div>
              <div style={{display:'flex',flexDirection:'column',gap:12,flex:1}}>
                {insights.map((ins,i)=>(
                  <div key={i} style={{display:'flex',gap:12,padding:'12px',borderRadius:10,background:BG4,border:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{width:38,height:38,borderRadius:9,background:ins.iconBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <ins.icon size={17} color={ins.iconColor}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5',lineHeight:1.4,marginBottom:3}}>{ins.title}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.45)',marginBottom:8}}>{ins.sub}</div>
                      <span onClick={()=>router.push(ins.href)} style={{fontSize:14,color:ins.iconColor,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
                        View Details <ChevronRight size={11}/>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div onClick={()=>router.push('/admin/analytics')} style={{marginTop:14,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px',borderRadius:8,border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',fontSize:14,color:'rgba(255,255,255,0.55)'}}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.04)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
              ><BarChart size={14}/> View Full Analytics</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW CONTEXT MENU ── */}
      {menuApp&&(
        <>
          <div onClick={()=>setMenuApp('')} style={{position:'fixed',inset:0,zIndex:300}}/>
          <div style={{position:'fixed',top:menuPos.top,right:menuPos.right,width:190,background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,overflow:'hidden',zIndex:400,boxShadow:'0 8px 24px rgba(0,0,0,0.6)'}}>
            {[
              {label:'View Details',      icon:Eye,          color:'#F5F5F5', action:()=>{const a=flaggedApps.find(x=>x.id===menuApp);if(a)router.push(`/admin/aspirant-profile?uid=${a.uid}`);setMenuApp('');}},
              {label:'Mark as Safe',      icon:ShieldCheck,  color:GREEN,     action:()=>{
                const token=getToken();
                fetch('/api/admin/applications/bulk',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({ids:[menuApp],action:'Mark as Safe'})}).catch(()=>{});
                showToast('Marked as safe');setMenuApp('');loadApps();
              }},
              {label:'Investigate',       icon:Search,       color:BLUE,      action:()=>{router.push('/admin/fraud');setMenuApp('');}},
              {label:'Block User',        icon:Lock,         color:ORANGE,    action:()=>{
                const token=getToken();const a=flaggedApps.find(x=>x.id===menuApp);
                if(a){fetch('/api/admin/users',{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({userId:a.uid,action:'suspend'})}).catch(()=>{});}
                showToast('User blocked successfully');setMenuApp('');loadApps();
              }},
              {label:'Escalate to Fraud', icon:AlertTriangle,color:RED,       action:()=>{router.push('/admin/fraud');setMenuApp('');}},
            ].map(({label,icon:Icon,color,action})=>(
              <div key={label} onClick={action} style={{display:'flex',alignItems:'center',gap:9,padding:'10px 14px',fontSize:14,cursor:'pointer',color}}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
              ><Icon size={13} color={color}/> {label}</div>
            ))}
          </div>
        </>
      )}

      {/* ── EXPORT MODAL ── */}
      {showExport&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:380}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:20,letterSpacing:1}}>EXPORT REPORT</div>
              <button onClick={()=>setShowExport(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            {[
              {label:'Format',     options:['PDF Report','Excel Spreadsheet','CSV File']},
              {label:'Include',    options:['All Flagged Applications','High Risk Only','Current Page']},
              {label:'Date Range', options:['Last 7 Days','Last 30 Days','All Time','Custom']},
            ].map(f=>(
              <div key={f.label} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>{f.label}</label>
                <select style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none'}}>
                  {f.options.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:6}}>
              <button onClick={()=>setShowExport(false)} style={{flex:1,padding:10,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{showToast('Report exported successfully');setShowExport(false);}}
                style={{flex:2,padding:10,background:RED,border:'none',borderRadius:7,color:'#fff',fontFamily:BEBAS,fontSize:18,letterSpacing:1,cursor:'pointer'}}>Export Now</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FILTERS MODAL ── */}
      {showFilters&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:420}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:20,letterSpacing:1}}>ADVANCED FILTERS</div>
              <button onClick={()=>setShowFilters(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>Risk Level</label>
              <select value={advRisk} onChange={e=>setAdvRisk(e.target.value)} style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none'}}>
                {['All','High','Medium','Low'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>Application Status</label>
              <select value={advStatus} onChange={e=>setAdvStatus(e.target.value)} style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none'}}>
                {['All','applied','in_review','shortlisted','rejected','on_hold','withdrawn'].map(o=>(
                  <option key={o} value={o}>{o==='All'?'All':o==='applied'?'Submitted':o==='in_review'?'In Review':o==='shortlisted'?'Shortlisted':o==='rejected'?'Rejected':o==='on_hold'?'On Hold':'Withdrawn'}</option>
                ))}
              </select>
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>Date Range</label>
              <select value={advPeriod} onChange={e=>setAdvPeriod(e.target.value)} style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none'}}>
                {['Today','Last 7 Days','Last 30 Days','All Time'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            {(appliedRisk!=='All'||appliedStatus!=='All')&&(
              <div style={{marginBottom:12}}>
                <button onClick={()=>{setAdvRisk('All');setAdvStatus('All');setAdvPeriod('Last 7 Days');setAppliedRisk('All');setAppliedStatus('All');setPage(1);setShowFilters(false);showToast('Filters cleared');}}
                  style={{width:'100%',padding:'8px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:7,color:RED,fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
                  Clear Active Filters
                </button>
              </div>
            )}
            <div style={{display:'flex',gap:10,marginTop:6}}>
              <button onClick={()=>setShowFilters(false)} style={{flex:1,padding:10,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{setAppliedRisk(advRisk);setAppliedStatus(advStatus);setTimePeriod(advPeriod);setPage(1);setShowFilters(false);showToast('Filters applied');}}
                style={{flex:2,padding:10,background:RED,border:'none',borderRadius:7,color:'#fff',fontFamily:BEBAS,fontSize:18,letterSpacing:1,cursor:'pointer'}}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast&&(
        <div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',background:BG2,border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,padding:'12px 22px',fontSize:14,fontWeight:600,color:'#F5F5F5',zIndex:600,boxShadow:'0 4px 24px rgba(0,0,0,0.5)',display:'flex',alignItems:'center',gap:8}}>
          <CheckSquare size={15} color={GREEN}/> {toast}
        </div>
      )}

      <style>{`select option { background: #121821; color: #F5F5F5; }`}</style>
    </div>
  );
}