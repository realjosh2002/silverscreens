'use client';
import AdminSidebar from '@/components/layout/AdminSidebar';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard,
  Database, Settings, ScrollText, Bell, ChevronRight,
  TrendingUp, Download, AlertTriangle, UserCheck,
  MoreVertical, BellRing, Ticket, KeyRound,
  ChevronLeft, Menu, ChevronDown, Eye, Search,
  Filter, CheckSquare, Square, Lock, X, Info,
  ShieldAlert, Clock, Check, XCircle, User,
  Building, CreditCard as PayIcon, Zap, Shield,
  RefreshCw,
} from 'lucide-react';
import AdminTopnav from '@/components/layout/AdminTopnav';

/* ─── Design tokens ──────────────────────────────────────────── */
const BG    = '#050505';
const BG2   = '#0B0F14';
const BG3   = '#121821';
const BG4   = 'rgba(255,255,255,0.03)';
const BEBAS = "'Bebas Neue', sans-serif";
const BARLOW= "'Barlow Condensed', sans-serif";
const GREEN = '#22C55E';
const RED   = '#C8202A';
const BLUE  = '#3B82F6';
const PURPLE= '#8B5CF6';
const ORANGE= '#F97316';
const TEAL  = '#14B8A6';
const GOLD  = '#D4A64A';

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

/* ─── Chart labels ───────────────────────────────────────────── */
const CHART_LABELS_7  = ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7'];
const CHART_LABELS_30 = ['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6','Wk 7'];
const CHART_LABELS_90 = ['Jan','Feb','Mar','Apr','May','Jun','Jul'];

const RISK_COLOR:   Record<string,string> = { High: RED,    Medium: ORANGE, Low: GREEN  };
const RISK_BG:      Record<string,string> = { High: 'rgba(239,68,68,0.12)', Medium: 'rgba(249,115,22,0.12)', Low: 'rgba(34,197,94,0.12)' };
const STATUS_COLOR: Record<string,string> = { 'Under Review': GOLD, Investigating: BLUE, New: PURPLE, Blocked: RED, Resolved: GREEN, Dismissed: '#6B7280' };
const STATUS_BG:    Record<string,string> = { 'Under Review': 'rgba(212,166,74,0.12)', Investigating: 'rgba(59,130,246,0.12)', New: 'rgba(139,92,246,0.12)', Blocked: 'rgba(239,68,68,0.12)', Resolved: 'rgba(34,197,94,0.12)', Dismissed: 'rgba(107,114,128,0.12)' };

const RISK_TABS = ['All','High Risk','Medium Risk','Low Risk'];
const PER_PAGE  = 5;

/* ─── Types ──────────────────────────────────────────────────── */
interface FraudAlert {
  id: string;
  type: string;
  typeColor: string;
  typeIcon: string;
  entity: string;
  entityUid: string;
  details: string;
  risk: string;
  status: string;
  date: string;
  time: string;
  img?: string;
}

interface DashStats {
  totalFlags: number;
  highRisk: number;
  underReview: number;
  resolved: number;
  falsePositive: number;
  flagsDelta: string;
  highRiskDelta: string;
  reviewDelta: string;
  resolvedDelta: string;
  falseDelta: string;
}

interface CategoryDist {
  label: string;
  value: number;
  pct: number;
  color: string;
}

interface RiskDist {
  label: string;
  value: number;
  pct: number;
  color: string;
}

interface TopEntity {
  name: string;
  uid: string;
  risk: string;
  riskColor: string;
  type: string;
}

/* ─── Fallback data (shown if API has no data yet) ───────────── */
const FALLBACK_ALERTS: FraudAlert[] = [
  { id:'FRD-250521-1248', type:'Fake Agency',         typeColor:BLUE,   typeIcon:'building', entity:'Dream Casting Agency',    entityUid:'AGY12567',    details:'Multiple fake projects, invalid documents and negative user reports', risk:'High',   status:'Under Review',  date:'May 21, 2025', time:'11:32 AM' },
  { id:'FRD-250521-1247', type:'Scam Casting',        typeColor:PURPLE, typeIcon:'casting',  entity:'Lead Role in Web Series', entityUid:'CAST78945',   details:'Advance payment requested from applicants',                          risk:'High',   status:'Under Review',  date:'May 21, 2025', time:'10:48 AM' },
  { id:'FRD-250521-1246', type:'Suspicious Payment',  typeColor:GOLD,   typeIcon:'payment',  entity:'User: Rohit Verma',       entityUid:'ASP052500001', details:'Multiple failed payments and refund manipulation attempt',           risk:'Medium', status:'Investigating', date:'May 21, 2025', time:'09:15 AM' },
  { id:'FRD-250521-1245', type:'Fake Profile',        typeColor:ORANGE, typeIcon:'user',     entity:'Neha Iyer',               entityUid:'ASP052500002', details:'Stolen images detected, identity mismatch',                         risk:'Medium', status:'Under Review',  date:'May 20, 2025', time:'08:22 PM' },
  { id:'FRD-250521-1244', type:'Spam Activity',       typeColor:GREEN,  typeIcon:'spam',     entity:'User: Arjun Malhotra',    entityUid:'ASP052500003', details:'Bulk messaging and spamming multiple users',                        risk:'Low',    status:'New',           date:'May 20, 2025', time:'05:30 PM' },
  { id:'FRD-250521-1243', type:'Fake Agency',         typeColor:BLUE,   typeIcon:'building', entity:'StarCast Productions',    entityUid:'AGY33210',    details:'Registered with fake GST number and forged documents',              risk:'High',   status:'Blocked',       date:'May 20, 2025', time:'02:10 PM' },
  { id:'FRD-250521-1242', type:'Scam Casting',        typeColor:PURPLE, typeIcon:'casting',  entity:'Model Shoot Exclusive',   entityUid:'CAST99102',   details:'No payment after selection, ghost agency behavior',                 risk:'Medium', status:'Resolved',      date:'May 19, 2025', time:'11:45 AM' },
  { id:'FRD-250521-1241', type:'Suspicious Payment',  typeColor:GOLD,   typeIcon:'payment',  entity:'User: Karan Mehta',       entityUid:'ASP052500004', details:'Chargeback fraud on subscription payment',                         risk:'High',   status:'Under Review',  date:'May 19, 2025', time:'09:00 AM' },
  { id:'FRD-250521-1240', type:'Fake Profile',        typeColor:ORANGE, typeIcon:'user',     entity:'Pooja Sharma',            entityUid:'ASP052500005', details:'AI-generated profile images detected',                             risk:'Low',    status:'Resolved',      date:'May 19, 2025', time:'07:30 AM' },
  { id:'FRD-250521-1239', type:'Spam Activity',       typeColor:GREEN,  typeIcon:'spam',     entity:'User: Vikram Nair',       entityUid:'ASP052500006', details:'Mass casting application submission in 2 minutes',                  risk:'Medium', status:'New',           date:'May 18, 2025', time:'04:15 PM' },
];

const FALLBACK_STATS: DashStats = {
  totalFlags: 1248, highRisk: 230, underReview: 312, resolved: 706, falsePositive: 124,
  flagsDelta: '+18.6%', highRiskDelta: '+12.4%', reviewDelta: '+8.7%', resolvedDelta: '+22.3%', falseDelta: '+5.1%',
};

const FALLBACK_CAT: CategoryDist[] = [
  { label: 'Fake Agencies',       value: 446, pct: 35.7, color: BLUE   },
  { label: 'Scam Castings',       value: 302, pct: 24.2, color: PURPLE },
  { label: 'Suspicious Payments', value: 222, pct: 17.8, color: GOLD   },
  { label: 'Fake Profiles',       value: 164, pct: 13.1, color: ORANGE },
  { label: 'Spam Activity',       value: 114, pct: 9.2,  color: GREEN  },
];

const FALLBACK_RISK: RiskDist[] = [
  { label: 'High Risk',   value: 230, pct: 18.4, color: RED    },
  { label: 'Medium Risk', value: 312, pct: 25.0, color: ORANGE },
  { label: 'Low Risk',    value: 706, pct: 56.6, color: GREEN  },
];

const FALLBACK_ENTITIES: TopEntity[] = [
  { name: 'Dream Casting Agency',   uid: 'AGY12567',   risk: 'High Risk',   riskColor: RED,    type: 'agency'  },
  { name: 'Lead Role in Web Series',uid: 'CAST78945',  risk: 'High Risk',   riskColor: RED,    type: 'casting' },
  { name: 'Silverline Talent Hub',  uid: 'AGY11234',   risk: 'Medium Risk', riskColor: ORANGE, type: 'agency'  },
  { name: 'Actor Zone',             uid: 'ASP052500007', risk: 'Medium Risk', riskColor: ORANGE, type: 'user'  },
  { name: 'Premium Auditions',      uid: 'CAST56789',  risk: 'Low Risk',    riskColor: GREEN,  type: 'casting' },
];

/* ─── SVG Line Chart ─────────────────────────────────────────── */
function getToken(): string {
  try {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    return key ? JSON.parse(localStorage.getItem(key) || '{}')?.access_token || '' : '';
  } catch { return ''; }
}

function FraudTrendChart({ period, data, apiLabels }: { period: string; data: number[]; apiLabels?: string[] }) {
  /* Fixed pixel canvas — no CSS height:'100%' dependency */
  const W=560, H=200, padL=48, padR=16, padT=14, padB=36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const safeData = (data && data.length >= 2) ? data : [220,280,240,340,210,290,200];
  /* Use API-provided labels if available, else fall back to generic period labels */
  const labels = (apiLabels && apiLabels.length > 0)
    ? apiLabels
    : period==='Last 90 Days' ? CHART_LABELS_90 : period==='Last 30 Days' ? CHART_LABELS_30 : CHART_LABELS_7;
  const pts2use: number[] = labels.map((_,i) => safeData[i] ?? 0);
  const rawMax = Math.max(...pts2use, 1);
  const maxY = Math.ceil(rawMax * 1.15 / 50) * 50;
  const gridVals = [0, Math.round(maxY*0.25), Math.round(maxY*0.5), Math.round(maxY*0.75), maxY];
  const mx = (i:number) => padL + (i / (labels.length - 1)) * innerW;
  const my = (v:number) => padT + (1 - v/maxY) * innerH;

  /* Safe straight-line fallback if only 1 point */
  const pts: [number,number][] = pts2use.map((v,i) => [mx(i), my(v)]);

  /* Smooth bezier curve */
  function buildPath(points: [number,number][]): string {
    if(points.length < 2) return '';
    let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
    for(let i = 0; i < points.length - 1; i++){
      const p0 = points[Math.max(0,i-1)];
      const p1 = points[i];
      const p2 = points[i+1];
      const p3 = points[Math.min(points.length-1,i+2)];
      const cp1x = p1[0] + (p2[0]-p0[0])/6;
      const cp1y = p1[1] + (p2[1]-p0[1])/6;
      const cp2x = p2[0] - (p3[0]-p1[0])/6;
      const cp2y = p2[1] - (p3[1]-p1[1])/6;
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return d;
  }

  const linePath = buildPath(pts);
  const areaPath = linePath
    ? `${linePath} L ${pts[pts.length-1][0].toFixed(2)} ${(padT+innerH).toFixed(2)} L ${pts[0][0].toFixed(2)} ${(padT+innerH).toFixed(2)} Z`
    : '';

  return (
    /* Explicit width+height on svg — never rely on CSS percent in SSR */
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{display:'block', maxWidth:'100%', overflow:'visible'}}
    >
      <defs>
        <linearGradient id="fraud-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={RED} stopOpacity={0.25}/>
          <stop offset="100%" stopColor={RED} stopOpacity={0.01}/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {gridVals.map(v=>(
        <g key={v}>
          <line
            x1={padL} y1={my(v)} x2={W-padR} y2={my(v)}
            stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 4"
          />
          <text
            x={padL-8} y={my(v)+4}
            fill="rgba(255,255,255,0.3)" fontSize={11}
            textAnchor="end" fontFamily="sans-serif"
          >{v}</text>
        </g>
      ))}
      {/* X axis */}
      <line x1={padL} y1={padT+innerH} x2={W-padR} y2={padT+innerH} stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>
      {/* X labels */}
      {labels.map((l,i)=>(
        <text key={i}
          x={mx(i)} y={padT+innerH+18}
          fill="rgba(255,255,255,0.32)" fontSize={11}
          textAnchor="middle" fontFamily="sans-serif"
        >{l}</text>
      ))}
      {/* Area fill */}
      {areaPath && <path d={areaPath} fill="url(#fraud-area-grad)"/>}
      {/* Line */}
      {linePath && <path d={linePath} fill="none" stroke={RED} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>}
      {/* Dots */}
      {pts.map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r={4.5} fill={RED} stroke="#0D1117" strokeWidth={2}/>
      ))}
    </svg>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────── */
function DonutChart({data,total,label,size=160}:{data:{label:string;pct:number;color:string}[];total:string;label:string;size?:number}){
  const cx=size/2, cy=size/2, R=size*0.42, r=size*0.27;
  const toRad=(deg:number)=>(deg*Math.PI)/180;
  const ptOn=(angle:number,radius:number):[number,number]=>[
    cx + radius*Math.cos(toRad(angle)),
    cy + radius*Math.sin(toRad(angle)),
  ];
  /* Guard: if data is empty show a grey circle */
  const safeData = data && data.length > 0 ? data : [{label:'No data',pct:100,color:'rgba(255,255,255,0.1)'}];
  const sum = safeData.reduce((s,d)=>s+d.pct,0)||1;
  let angle = -90;
  const arcs = safeData.map(seg=>{
    const sweep = Math.min((seg.pct/sum)*360, 359.99); /* never full 360 — arc math breaks */
    const startA = angle;
    const endA   = angle + sweep;
    const large  = sweep > 180 ? 1 : 0;
    const [x1,y1] = ptOn(startA, R);
    const [x2,y2] = ptOn(endA,   R);
    const [x3,y3] = ptOn(endA,   r);
    const [x4,y4] = ptOn(startA, r);
    const d = `M ${x1.toFixed(3)} ${y1.toFixed(3)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} L ${x3.toFixed(3)} ${y3.toFixed(3)} A ${r} ${r} 0 ${large} 0 ${x4.toFixed(3)} ${y4.toFixed(3)} Z`;
    angle = endA + 1.5; /* 1.5° gap between segments */
    return {...seg, d};
  });
  return(
    /* Explicit width + height — never depends on CSS/flex sizing */
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      style={{display:'block', flexShrink:0}}
    >
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={R-r}/>
      {/* Inner fill */}
      <circle cx={cx} cy={cy} r={r-1} fill={BG3}/>
      {/* Segments */}
      {arcs.map(a=><path key={a.label} d={a.d} fill={a.color}/>)}
      {/* Centre text: label */}
      <text
        x={cx} y={cy-9}
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize={size*0.075}
        fontFamily="sans-serif"
      >{label}</text>
      {/* Centre text: total value */}
      <text
        x={cx} y={cy+13}
        textAnchor="middle"
        fill="#F5F5F5"
        fontSize={size*0.145}
        fontWeight="800"
        fontFamily="sans-serif"
        letterSpacing="1"
      >{total}</text>
    </svg>
  );
}

/* ─── Type icon ──────────────────────────────────────────────── */
function TypeIcon({type,color}:{type:string;color:string}){
  const Icon = type==='building'?Building:type==='casting'?Megaphone:type==='payment'?PayIcon:type==='spam'?Zap:User;
  return(
    <div style={{width:28,height:28,borderRadius:6,background:`${color}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <Icon size={13} color={color}/>
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────────── */
function fmtNum(n:number):string{
  if(n>=1000000) return (n/1000000).toFixed(1)+'M';
  if(n>=1000) return n.toLocaleString();
  return String(n);
}

function exportToCSV(alerts: FraudAlert[], filename: string) {
  const headers = ['Alert ID','Type','Entity','Entity UID','Details','Risk Level','Status','Detected On','Time'];
  const rows = alerts.map(a => [a.id, a.type, a.entity, a.entityUid, `"${a.details}"`, a.risk, a.status, a.date, a.time]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  URL.revokeObjectURL(url);
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function FraudDetectionPage(){
  const router=useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const[profileOpen,setProfileOpen]=useState(false);
  const[chartPeriod,setChartPeriod]=useState('Last 7 Days');
  const[riskTab,setRiskTab]=useState('All');
  const[search,setSearch]=useState('');
  const[selected,setSelected]=useState<string[]>([]);
  const[page,setPage]=useState(1);
  const[menuId,setMenuId]=useState('');
  const[menuPos,setMenuPos]=useState({top:0,right:0,openUp:false});
  const[viewAlert,setViewAlert]=useState<FraudAlert|null>(null);
  const[showBulk,setShowBulk]=useState(false);
  const[showFilters,setShowFilters]=useState(false);
  const[toast,setToast]=useState('');
  const[toastType,setToastType]=useState<'success'|'error'>('success');

  /* ── Admin info from localStorage ── */
  const[adminName,setAdminName]=useState('Administrator');
  const[adminId,setAdminId]=useState('Admin');
  const[notifCount,setNotifCount]=useState(0);

  /* ── API data ── */
  const[alerts,setAlerts]=useState<FraudAlert[]>(FALLBACK_ALERTS);
  const[stats,setStats]=useState<DashStats>(FALLBACK_STATS);
  const[catData,setCatData]=useState<CategoryDist[]>([]);
  const[riskData,setRiskData]=useState<RiskDist[]>([]);
  const[topEntities,setTopEntities]=useState<TopEntity[]>(FALLBACK_ENTITIES);
  const[chartData,setChartData]=useState<number[]>([220,280,240,340,210,290,200]);
  const[chartLabels,setChartLabels]=useState<string[]>([]);
  const[loading,setLoading]=useState(true);
  const[refreshing,setRefreshing]=useState(false);

  /* ── Advanced filter state ── */
  const[filterFraudType,setFilterFraudType]=useState('All');
  const[filterRisk,setFilterRisk]=useState('All');
  const[filterStatus,setFilterStatus]=useState('All');
  const[filterEntity,setFilterEntity]=useState('All');
  const[filterDate,setFilterDate]=useState('All Time');
  // pending (inside modal before Apply)
  const[pendingFraudType,setPendingFraudType]=useState('All');
  const[pendingRisk,setPendingRisk]=useState('All');
  const[pendingStatus,setPendingStatus]=useState('All');
  const[pendingEntity,setPendingEntity]=useState('All');
  const[pendingDate,setPendingDate]=useState('All Time');


  const showToast=(msg:string,type:'success'|'error'='success')=>{
    setToast(msg); setToastType(type); setTimeout(()=>setToast(''),2800);
  };

  /* ── Load admin info ── */
  useEffect(()=>{
    try{
      const raw=localStorage.getItem('ss_user')||sessionStorage.getItem('ss_user');
      if(raw){
        const u=JSON.parse(raw);
        if(u.name) setAdminName(u.name);
        if(u.adminId||u.id) setAdminId(u.adminId||u.id);
      }
    }catch{}
  },[]);

  /* ── Fetch fraud data ── */
  const fetchData = useCallback(async (isRefresh=false)=>{
    if(isRefresh) setRefreshing(true);
    try{
      const raw=localStorage.getItem('ss_user')||sessionStorage.getItem('ss_user');
      const token=raw?JSON.parse(raw)?.token:'';
      const headers:Record<string,string>={'Content-Type':'application/json'};
      if(token) headers['Authorization']=`Bearer ${token}`;

      /*
       * Call the three real endpoints that actually exist:
       *   1. /api/admin/reports?type=stats&period=X → stat cards, charts, donuts, insights
       *   2. /api/admin/reports?type=table           → the alerts table rows
       *   3. /api/admin/dashboard?report=dashboard   → KPIs (open_reports etc.)
       */
      const [statsRes, tableRes, dashRes, notifRes] = await Promise.allSettled([
        fetch(`/api/admin/reports?type=stats&period=${encodeURIComponent(chartPeriod)}`, {headers}),
        fetch('/api/admin/reports?type=table&per_page=50', {headers}),
        fetch('/api/admin/dashboard?report=dashboard', {headers}),
        fetch('/api/notifications?limit=1', {headers}),
      ]);

      /* ── 1. STATS — powers stat cards, line chart, donuts, insights ── */
      if(statsRes.status==='fulfilled' && statsRes.value.ok){
        const d = await statsRes.value.json();
        const dd = d.data ?? d;

        /* Stat cards — API returns dd.stats as an array */
        if(Array.isArray(dd.stats) && dd.stats.length > 0){
          const s = dd.stats; // [{label, value, delta, sub, color}, ...]
          // Map the 5 stat cards the API returns to our DashStats shape
          // API order: Total Reports, Open Reports, In Progress, Resolved, Rejected/Dismissed
          const getVal = (label:string) => {
            const found = s.find((x:any) => x.label?.toLowerCase().includes(label.toLowerCase()));
            return parseInt(String(found?.value || '0').replace(/,/g,'')) || 0;
          };
          const getDelta = (label:string) => {
            const found = s.find((x:any) => x.label?.toLowerCase().includes(label.toLowerCase()));
            return found?.delta || '+0.0%';
          };
          setStats({
            totalFlags:    getVal('total'),
            highRisk:      getVal('open'),
            underReview:   getVal('progress'),
            resolved:      getVal('resolved'),
            falsePositive: getVal('dismissed'),
            flagsDelta:    getDelta('total'),
            highRiskDelta: getDelta('open'),
            reviewDelta:   getDelta('progress'),
            resolvedDelta: getDelta('resolved'),
            falseDelta:    getDelta('dismissed'),
          });
        }

        /* Line chart — API returns dd.chartData as number[] and dd.chartLabels as string[] */
        if(Array.isArray(dd.chartData) && dd.chartData.length > 0){
          setChartData(dd.chartData);
        }
        if(Array.isArray(dd.chartLabels) && dd.chartLabels.length > 0){
          setChartLabels(dd.chartLabels);
        }

        /* Fraud Categories donut — API returns dd.typeData */
        if(Array.isArray(dd.typeData) && dd.typeData.length > 0){
          setCatData(dd.typeData.map((t:any) => ({
            label: t.label || 'Other',
            value: t.value || 0,
            pct:   t.pct   || 0,
            color: t.color || PURPLE,
          })));
        }

        /* Risk Level donut — API returns dd.statusDonut */
        if(Array.isArray(dd.statusDonut) && dd.statusDonut.length > 0){
          // statusDonut: Open → High Risk, In Progress → Medium Risk, Resolved → Low Risk
          const sd = dd.statusDonut;
          const colorMap:Record<string,string> = {
            'Open': RED, 'In Progress': ORANGE, 'Resolved': GREEN, 'Rejected/Dismissed': PURPLE,
          };
          setRiskData(sd.map((s:any) => ({
            label: s.label || 'Other',
            value: s.value || 0,
            pct:   s.pct   || 0,
            color: colorMap[s.label] || s.color || BLUE,
          })));
        }
      }

      /* ── 2. TABLE — the reports list */
      if(tableRes.status==='fulfilled' && tableRes.value.ok){
        const d = await tableRes.value.json();
        const dd = d.data ?? d;
        const rows: any[] = dd.reports ?? dd.items ?? [];

        if(rows.length > 0){
          /*
           * The reports API returns these fields (from route.ts shape() function):
           *   id, report_number, date, time, reportedBy, reportedByUid,
           *   against, againstUid, againstUserId, againstType,
           *   type, category, priority, status, description
           */
          const typeColor=(t:string)=>{
            const tl=t?.toLowerCase()||'';
            if(tl.includes('fake')||tl.includes('impersonation')) return ORANGE;
            if(tl.includes('scam')||tl.includes('fraud'))         return PURPLE;
            if(tl.includes('harassment'))                          return RED;
            if(tl.includes('spam'))                                return GREEN;
            if(tl.includes('copyright'))                           return BLUE;
            return GOLD;
          };
          const typeIcon=(t:string,at:string)=>{
            const tl=t?.toLowerCase()||'';
            if(at==='agency')                                       return 'building';
            if(tl.includes('scam')||tl.includes('casting'))        return 'casting';
            if(tl.includes('payment')||tl.includes('fraud'))       return 'payment';
            if(tl.includes('spam'))                                 return 'spam';
            return 'user';
          };
          /* Map priority to risk level used in existing UI */
          const riskMap:Record<string,string>={ High:'High', Medium:'Medium', Low:'Low' };
          /* Map status — API returns: pending, escalated, resolved, dismissed */
          const statusMap:Record<string,string>={
            pending:'New', escalated:'Under Review', resolved:'Resolved', dismissed:'Dismissed',
          };

          const mapped: FraudAlert[] = rows.map((r:any) => ({
            id:        r.report_number || String(r.id).slice(0,16),
            type:      r.type          || 'Suspicious Activity',
            typeColor: typeColor(r.type || ''),
            typeIcon:  typeIcon(r.type||'', r.againstType||''),
            entity:    r.against       || r.reportedBy || 'Unknown Entity',
            entityUid: r.againstUid    || r.againstUserId || '',
            details:   r.description   || 'No additional details',
            risk:      riskMap[r.priority] || 'Medium',
            status:    statusMap[r.status] || r.status || 'New',
            date:      r.date          || '',
            time:      r.time          || '',
          }));
          setAlerts(mapped);

          /* Build Top Risky Entities from the high-priority rows */
          const highRows = mapped.filter(a=>a.risk==='High').slice(0,5);
          const medRows  = mapped.filter(a=>a.risk==='Medium').slice(0, 5-highRows.length);
          const topRows  = [...highRows, ...medRows].slice(0,5);
          if(topRows.length > 0){
            setTopEntities(topRows.map(a=>({
              name:      a.entity,
              uid:       a.entityUid,
              risk:      a.risk==='High'?'High Risk':a.risk==='Low'?'Low Risk':'Medium Risk',
              riskColor: a.risk==='High'?RED:a.risk==='Low'?GREEN:ORANGE,
              type:      a.typeIcon==='building'?'agency':a.typeIcon==='casting'?'casting':'user',
            })));
          }
        }
      }

      /* ── 3. DASHBOARD KPIs — supplement stats if stats call returned nothing ── */
      if(dashRes.status==='fulfilled' && dashRes.value.ok){
        const d = await dashRes.value.json();
        const kpis = (d.data??d).kpis ?? {};
        /* Only update notif count from here; stats come from the reports endpoint */
        if(kpis.open_reports !== undefined){
          setStats(prev => ({
            ...prev,
            totalFlags: prev.totalFlags || (kpis.open_reports ?? 0),
          }));
        }
      }

      /* ── 4. Notification badge count ── */
      if(notifRes.status==='fulfilled' && notifRes.value.ok){
        const d = await notifRes.value.json();
        const cnt = (d.data??d).unread_count ?? (d.data??d).unreadCount ?? 0;
        setNotifCount(cnt);
      }

    }catch(err){
      console.error('Fraud page fetch error:', err);
      /* Fallback data already set as useState defaults — page stays usable */
    }finally{
      setLoading(false);
      setRefreshing(false);
    }
  },[chartPeriod]);

  useEffect(()=>{ fetchData(); },[fetchData]);

  /* Stats, charts, donuts and top entities all come directly from the API now.
     No derived recalculation needed — the stats endpoint returns them correctly. */

  /* ── Derived stats for stat cards ── */
  const STATS_CARDS = [
    { label: 'Total Reports',   value: fmtNum(stats.totalFlags),    delta: stats.flagsDelta,     sub: 'from previous period', color: RED,    Icon: Flag          },
    { label: 'Open / Pending',  value: fmtNum(stats.highRisk),      delta: stats.highRiskDelta,  sub: 'awaiting action',      color: ORANGE, Icon: AlertTriangle  },
    { label: 'Under Review',    value: fmtNum(stats.underReview),   delta: stats.reviewDelta,    sub: 'being investigated',   color: GOLD,   Icon: Clock         },
    { label: 'Resolved',        value: fmtNum(stats.resolved),      delta: stats.resolvedDelta,  sub: 'successfully closed',  color: GREEN,  Icon: ShieldCheck   },
    { label: 'Dismissed',       value: fmtNum(stats.falsePositive), delta: stats.falseDelta,     sub: 'rejected / dismissed', color: PURPLE, Icon: XCircle       },
  ];

  const INSIGHTS = [
    { icon: TrendingUp,  iconBg:'rgba(239,68,68,0.15)',  iconColor:RED,    title:`${stats.highRisk} open reports pending`,     sub:'Requires immediate action'      },
    { icon: Building2,   iconBg:'rgba(249,115,22,0.15)', iconColor:ORANGE, title:`${stats.underReview} reports under review`,  sub:'Currently being investigated'   },
    { icon: ShieldCheck, iconBg:'rgba(34,197,94,0.15)',  iconColor:GREEN,  title:`${stats.resolved} reports resolved`,         sub:'Successfully actioned'          },
  ];

  /* ── Filtering ── */
  const filtered=alerts.filter(a=>{
    const q=search.toLowerCase();
    const ms=!q||a.id.toLowerCase().includes(q)||a.entity.toLowerCase().includes(q)||a.type.toLowerCase().includes(q)||a.entityUid.toLowerCase().includes(q)||a.details.toLowerCase().includes(q);
    const mr=riskTab==='All'||(riskTab==='High Risk'&&a.risk==='High')||(riskTab==='Medium Risk'&&a.risk==='Medium')||(riskTab==='Low Risk'&&a.risk==='Low');
    const mft=filterFraudType==='All'||a.type.toLowerCase().includes(filterFraudType.toLowerCase());
    const mrk=filterRisk==='All'||a.risk===filterRisk;
    const mst=filterStatus==='All'||a.status===filterStatus;
    const met=filterEntity==='All'
      ||(filterEntity==='Agency'       && a.typeIcon==='building')
      ||(filterEntity==='Casting Call' && a.typeIcon==='casting')
      ||(filterEntity==='User'         && (a.typeIcon==='user'||a.typeIcon==='spam'||a.typeIcon==='payment'));
    let mdr=true;
    if(filterDate!=='All Time'&&a.date){
      try{
        const parts=a.date.replace(/ (d+),/,'-$1-').split('-');
        const reportDate=new Date(a.date);
        const now=new Date();
        const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
        if(filterDate==='Today') mdr=reportDate>=today;
        else if(filterDate==='Last 7 Days'){const d=new Date(today);d.setDate(d.getDate()-7);mdr=reportDate>=d;}
        else if(filterDate==='Last 30 Days'){const d=new Date(today);d.setDate(d.getDate()-30);mdr=reportDate>=d;}
      }catch{mdr=true;}
    }
    return ms&&mr&&mft&&mrk&&mst&&met&&mdr;
  });

  const totalPages=Math.max(1,Math.ceil(filtered.length/PER_PAGE));
  const paged=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const allSel=paged.length>0&&paged.every(a=>selected.includes(a.id));
  const toggleSel=(id:string)=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=()=>setSelected(allSel?selected.filter(id=>!paged.find(a=>a.id===id)):[...new Set([...selected,...paged.map(a=>a.id)])]);

  /* ── Bulk action (calls API) ── */
  const handleBulk=async(action:string)=>{
    if(selected.length===0){showToast('Select at least one item','error');setShowBulk(false);return;}
    const raw=localStorage.getItem('ss_user');
    const token=raw?JSON.parse(raw)?.token:'';
    const headers:Record<string,string>={'Content-Type':'application/json'};
    if(token) headers['Authorization']=`Bearer ${token}`;
    try{
      /* API expects {id, action} for single; we call it per item for bulk */
      await Promise.all(selected.map(id=>
        fetch('/api/admin/reports',{method:'PATCH',headers,body:JSON.stringify({id,action:'resolve'})})
      ));
    }catch{}
    showToast(`${action} applied to ${selected.length} item(s)`);
    setSelected([]);setShowBulk(false);
    fetchData(true);
  };

  /* ── Single action (calls API) ── */
  const doAction=async(alertId:string, action:'safe'|'block'|'escalate', onDone?:()=>void)=>{
    const raw=localStorage.getItem('ss_user');
    const token=raw?JSON.parse(raw)?.token:'';
    const headers:Record<string,string>={'Content-Type':'application/json'};
    if(token) headers['Authorization']=`Bearer ${token}`;
    /* API valid actions: resolve | dismiss | escalate | reopen */
    const actionMap={safe:'resolve',block:'dismiss',escalate:'escalate'};
    const statusMap={safe:'Resolved',block:'Blocked',escalate:'Under Review'};
    try{
      await fetch(`/api/admin/reports`,{method:'PATCH',headers,body:JSON.stringify({id:alertId,action:actionMap[action]})});
      /* Optimistic update */
      setAlerts(prev=>prev.map(a=>a.id===alertId?{...a,status:statusMap[action]}:a));
    }catch{}
    const msgMap={safe:'Marked as safe',block:'Entity blocked',escalate:'Escalated to reports'};
    showToast(msgMap[action]);
    onDone?.();
  };

  /* ── Navigation: profile from UID ── */
  const goProfile=async(uid:string)=>{
    if(uid.startsWith('AG')) {
      // Agency profile number — pass directly, agency-profile page resolves it
      router.push(`/agency-profile?id=${uid}`);
      return;
    }
    if(uid.startsWith('CAST')) {
      router.push(`/admin/applications?casting=${uid}`);
      return;
    }
    // Aspirant profile number (ASP...) or UUID — resolve to UUID via keyword search
    const looksLikeProfileNumber = /^[A-Za-z]{1,4}\d+$/.test(uid);
    if(looksLikeProfileNumber) {
      try {
        const token = getToken();
        const res = await fetch(`/api/admin/users?keyword=${encodeURIComponent(uid)}&limit=1`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.ok ? await res.json() : null;
        const matched = data?.data?.users?.[0];
        if(matched) {
          router.push(`/my-profile?user_id=${matched.id}`);
          return;
        }
      } catch {}
    }
    // Already a UUID
    router.push(`/my-profile?user_id=${uid}`);
  };

  /* ── Export ── */
  const handleExport=()=>{
    const toExport=selected.length>0?alerts.filter(a=>selected.includes(a.id)):filtered;
    exportToCSV(toExport, `fraud-alerts-${new Date().toISOString().slice(0,10)}.csv`);
    showToast(`Exported ${toExport.length} alert(s)`);
  };

  /* ── Apply filters ── */
  const applyFilters=()=>{
    setFilterFraudType(pendingFraudType);
    setFilterRisk(pendingRisk);
    setFilterStatus(pendingStatus);
    setFilterEntity(pendingEntity);
    setFilterDate(pendingDate);
    setPage(1);
    setShowFilters(false);
    showToast('Filters applied');
  };

  const openFilters=()=>{
    setPendingFraudType(filterFraudType);
    setPendingRisk(filterRisk);
    setPendingStatus(filterStatus);
    setPendingEntity(filterEntity);
    setPendingDate(filterDate);
    setShowFilters(true);
  };

  const clearFilters=()=>{
    setFilterFraudType('All');setFilterRisk('All');setFilterStatus('All');setFilterEntity('All');setFilterDate('All Time');
    setPendingFraudType('All');setPendingRisk('All');setPendingStatus('All');setPendingEntity('All');setPendingDate('All Time');
    setPage(1);setShowFilters(false);
    showToast('Filters cleared');
  };

  const hasActiveFilters=filterFraudType!=='All'||filterRisk!=='All'||filterStatus!=='All'||filterEntity!=='All'||filterDate!=='All Time';

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:BG,fontFamily:BARLOW,color:'#F5F5F5'}}>

      <AdminTopnav />

      {/* ══ BODY ══ */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* ── SIDEBAR ── */}
        <AdminSidebar />

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,overflowY:'auto',padding:'20px 24px 40px',display:'flex',flexDirection:'column',gap:16}}>

          {/* Page header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:6}}>
                <span style={{cursor:'pointer'}} onClick={()=>router.push('/admin/dashboard')}>Home</span>
                <ChevronRight size={12}/>
                <span style={{color:'#F5F5F5'}}>Fraud Detection</span>
              </div>
              <h1 style={{fontFamily:BARLOW,fontSize:28,fontWeight:800,margin:0,display:'flex',alignItems:'center',gap:6}}>
                Fraud Detection
                <span style={{width:7,height:7,borderRadius:'50%',background:RED,display:'inline-block',marginBottom:2}}/>
                {loading&&<span style={{fontSize:14,color:'rgba(255,255,255,0.35)',fontWeight:400,marginLeft:4}}>Loading…</span>}
              </h1>
              <p style={{fontSize:15,color:'rgba(255,255,255,0.45)',margin:'4px 0 0'}}>Identify, analyze and take action on suspicious activities across the platform.</p>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center',marginTop:28,flexShrink:0}}>
              <button onClick={()=>fetchData(true)} disabled={refreshing}
                style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:15,cursor:refreshing?'default':'pointer',opacity:refreshing?0.6:1}}>
                <RefreshCw size={13} style={{animation:refreshing?'spin 1s linear infinite':'none'}}/> Refresh
              </button>
              <button onClick={openFilters}
                style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:hasActiveFilters?`${RED}22`:BG3,border:`1px solid ${hasActiveFilters?`${RED}44`:'rgba(255,255,255,0.1)'}`,borderRadius:8,color:hasActiveFilters?RED:'#F5F5F5',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>
                <Filter size={13}/> Filters{hasActiveFilters?' ✓':''}
              </button>
              <button onClick={handleExport}
                style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>
                <Download size={13}/> Export
              </button>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
            {STATS_CARDS.map((s,i)=>(
              <div key={i} style={{borderRadius:12,padding:'16px',background:BG3,border:'1px solid rgba(255,255,255,0.06)',display:'flex',gap:14,alignItems:'center'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:`${s.color}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <s.Icon size={20} color={s.color}/>
                </div>
                <div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:3}}>{s.label}</div>
                  <div style={{fontFamily:BEBAS,fontSize:30,letterSpacing:1,lineHeight:1}}>{loading?'—':s.value}</div>
                  <div style={{display:'flex',alignItems:'center',gap:5,marginTop:3}}>
                    <TrendingUp size={11} color={GREEN}/>
                    <span style={{fontSize:14,fontWeight:700,color:GREEN}}>{s.delta}</span>
                    <span style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{s.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── CHARTS ROW ── */}
          <div style={{display:'grid',gridTemplateColumns:'1.6fr 1.3fr 1.1fr',gap:14}}>

            {/* Fraud Trend Over Time */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:16,fontWeight:700}}>Fraud Trend Over Time</span>
                <div style={{position:'relative'}}>
                  <select value={chartPeriod} onChange={e=>setChartPeriod(e.target.value)}
                    style={{appearance:'none',padding:'5px 26px 5px 10px',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {['Last 7 Days','Last 30 Days','Last 90 Days'].map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={11} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:7,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              <div style={{width:'100%',height:'210px',overflow:'hidden'}}><FraudTrendChart period={chartPeriod} data={chartData} apiLabels={chartLabels}/></div>
            </div>

            {/* Fraud Categories Distribution */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Fraud Categories Distribution</div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                <DonutChart data={catData} total={fmtNum(stats.totalFlags)} label="Total Flags" size={148}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7}}>
                  {catData.map(d=>(
                    <div key={d.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:d.color,flexShrink:0}}/>
                        <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:14,fontWeight:700}}>{d.pct}% <span style={{color:'rgba(255,255,255,0.4)',fontWeight:400}}>({d.value})</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Level Distribution */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:16,fontWeight:700}}>Risk Level Distribution</span>
                <span onClick={()=>router.push('/admin/analytics')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View All</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
                <DonutChart data={riskData} total={fmtNum(stats.totalFlags)} label="Total Flags" size={148}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:8}}>
                  {riskData.map(d=>(
                    <div key={d.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:d.color}}/>
                        <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:14,fontWeight:700,color:d.color}}>{d.pct}% <span style={{color:'rgba(255,255,255,0.45)',fontWeight:400}}>({d.value})</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── TABLE + RIGHT PANEL ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 270px',gap:14,minWidth:0}}>

            {/* Fraud Alerts Table */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden',minWidth:0}}>

              {/* Table toolbar */}
              <div style={{padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                  <span style={{fontSize:16,fontWeight:700,flex:1}}>Recent Fraud Alerts</span>
                  {/* Search */}
                  <div style={{position:'relative'}}>
                    <Search size={13} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)'}}/>
                    <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search…"
                      style={{background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:7,padding:'7px 10px 7px 28px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',width:160}}/>
                  </div>
                  {/* Bulk actions */}
                  <div style={{position:'relative'}}>
                    <button onClick={()=>setShowBulk(v=>!v)} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 13px',background:selected.length>0?RED:BG4,border:`1px solid ${selected.length>0?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.1)'}`,borderRadius:7,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
                      Bulk Actions{selected.length>0?` (${selected.length})`:''}<ChevronDown size={11}/>
                    </button>
                    {showBulk&&(
                      <>
                        <div onClick={()=>setShowBulk(false)} style={{position:'fixed',inset:0,zIndex:150}}/>
                        <div style={{position:'absolute',top:38,right:0,width:200,background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,overflow:'hidden',zIndex:200,boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}}>
                          {['Mark as Reviewed','Block Selected','Mark Safe','Escalate All','Export Selected'].map(a=>(
                            <div key={a} onClick={()=>{
                              if(a==='Export Selected'){
                                const toExp=alerts.filter(x=>selected.includes(x.id));
                                exportToCSV(toExp,`fraud-selected-${new Date().toISOString().slice(0,10)}.csv`);
                                showToast(`Exported ${toExp.length} item(s)`);setShowBulk(false);
                              } else handleBulk(a);
                            }}
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
                {/* Risk tabs */}
                <div style={{display:'flex',gap:6,flexWrap:'wrap' as const}}>
                  {RISK_TABS.map(tab=>{
                    const count=tab==='All'?alerts.length:tab==='High Risk'?alerts.filter(a=>a.risk==='High').length:tab==='Medium Risk'?alerts.filter(a=>a.risk==='Medium').length:alerts.filter(a=>a.risk==='Low').length;
                    const isActive=riskTab===tab;
                    const col=tab==='High Risk'?RED:tab==='Medium Risk'?ORANGE:tab==='Low Risk'?GREEN:RED;
                    return(
                      <button key={tab} onClick={()=>{setRiskTab(tab);setPage(1);}}
                        style={{padding:'5px 12px',borderRadius:20,background:isActive?`${col}22`:'transparent',border:isActive?`1px solid ${col}44`:'1px solid rgba(255,255,255,0.1)',color:isActive?col:'rgba(255,255,255,0.5)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
                        {tab}
                        <span style={{fontSize:14,background:isActive?`${col}33`:'rgba(255,255,255,0.08)',color:isActive?col:'rgba(255,255,255,0.45)',borderRadius:10,padding:'0 6px'}}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column headers */}
              <div style={{display:'grid',gridTemplateColumns:'36px 1.6fr 1.2fr 1.8fr 2.2fr 0.9fr 1.1fr 1fr 72px',padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',gap:6}}>
                <div onClick={toggleAll} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                  {allSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.3)"/>}
                </div>
                {['ID','Type','Entity','Details','Risk Level','Detected On','Status','Actions'].map(h=>(
                  <div key={h} style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:0.4}}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {loading?(
                <div style={{padding:'36px 18px',textAlign:'center',color:'rgba(255,255,255,0.35)',fontSize:15}}>Loading fraud alerts…</div>
              ):paged.length===0?(
                <div style={{padding:'36px 18px',textAlign:'center',color:'rgba(255,255,255,0.35)',fontSize:15}}>No fraud alerts match your filters.</div>
              ):paged.map((a,i)=>{
                const isSel=selected.includes(a.id);
                return(
                  <div key={a.id}
                    style={{display:'grid',gridTemplateColumns:'36px 1.6fr 1.2fr 1.8fr 2.2fr 0.9fr 1.1fr 1fr 72px',padding:'11px 14px',borderBottom:i<paged.length-1?'1px solid rgba(255,255,255,0.04)':'none',alignItems:'center',gap:6,background:isSel?'rgba(239,68,68,0.05)':'transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='rgba(255,255,255,0.02)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isSel?'rgba(239,68,68,0.05)':'transparent';}}
                  >
                    {/* Checkbox */}
                    <div onClick={()=>toggleSel(a.id)} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                      {isSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.25)"/>}
                    </div>
                    {/* ID */}
                    <div style={{fontSize:14,fontWeight:600,color:'rgba(255,255,255,0.8)'}}>{a.id}</div>
                    {/* Type */}
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <TypeIcon type={a.typeIcon} color={a.typeColor}/>
                      <span style={{fontSize:14,color:a.typeColor,fontWeight:600}}>{a.type}</span>
                    </div>
                    {/* Entity */}
                    <div>
                      <div onClick={()=>goProfile(a.entityUid)} style={{fontSize:14,fontWeight:600,color:BLUE,cursor:'pointer',lineHeight:1.3}}>{a.entity}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{a.entityUid}</div>
                    </div>
                    {/* Details */}
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.6)',lineHeight:1.4}}>{a.details}</div>
                    {/* Risk */}
                    <div>
                      <span style={{fontSize:14,fontWeight:700,padding:'3px 9px',borderRadius:5,background:RISK_BG[a.risk],color:RISK_COLOR[a.risk],border:`1px solid ${RISK_COLOR[a.risk]}33`}}>{a.risk}</span>
                    </div>
                    {/* Detected On */}
                    <div>
                      <div style={{fontSize:14}}>{a.date}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{a.time}</div>
                    </div>
                    {/* Status */}
                    <div>
                      <span style={{fontSize:14,fontWeight:700,padding:'3px 8px',borderRadius:5,background:STATUS_BG[a.status]||'rgba(255,255,255,0.08)',color:STATUS_COLOR[a.status]||'#F5F5F5',border:`1px solid ${STATUS_COLOR[a.status]||'rgba(255,255,255,0.2)'}33`,whiteSpace:'nowrap' as const}}>{a.status}</span>
                    </div>
                    {/* Actions */}
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      <button onClick={()=>setViewAlert(a)} title="View Details"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Eye size={12} color={BLUE}/>
                      </button>
                      <button onClick={()=>doAction(a.id,'block')} title="Block Entity"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(249,115,22,0.12)',border:'1px solid rgba(249,115,22,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Flag size={12} color={ORANGE}/>
                      </button>
                      <button onClick={e=>{const r=e.currentTarget.getBoundingClientRect();const dropH=210;const openUp=r.bottom+dropH+4>window.innerHeight;setMenuPos({top:openUp?r.top-dropH-4:r.bottom+4,right:window.innerWidth-r.right,openUp});setMenuId(menuId===a.id?'':a.id);}}
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
                  {filtered.length===0?'No entries':(`Showing ${Math.min((page-1)*PER_PAGE+1,filtered.length)} to ${Math.min(page*PER_PAGE,filtered.length)} of ${filtered.length} entries`)}
                </span>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                    style={{width:30,height:30,borderRadius:6,background:BG4,border:'1px solid rgba(255,255,255,0.08)',color:page===1?'rgba(255,255,255,0.2)':'#F5F5F5',cursor:page===1?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>‹</button>
                  {Array.from({length:Math.min(totalPages,5)},(_,i)=>{
                    const pg=i+1;
                    return<button key={pg} onClick={()=>setPage(pg)}
                      style={{width:30,height:30,borderRadius:6,background:page===pg?RED:BG4,border:`1px solid ${page===pg?RED:'rgba(255,255,255,0.08)'}`,color:'#F5F5F5',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:page===pg?700:400}}>{pg}</button>;
                  })}
                  {totalPages>5&&<span style={{color:'rgba(255,255,255,0.35)',fontSize:14}}>… {totalPages}</span>}
                  <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                    style={{width:30,height:30,borderRadius:6,background:BG4,border:'1px solid rgba(255,255,255,0.08)',color:page===totalPages?'rgba(255,255,255,0.2)':'#F5F5F5',cursor:page===totalPages?'default':'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15}}>›</button>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{display:'flex',flexDirection:'column',gap:14}}>

              {/* Top Risky Entities */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <span style={{fontSize:15,fontWeight:700}}>Top Risky Entities</span>
                  <span onClick={()=>router.push('/admin/users')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View All</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {topEntities.map((e,i)=>(
                    <div key={i} onClick={()=>goProfile(e.uid)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 10px',borderRadius:8,background:BG4,border:'1px solid rgba(255,255,255,0.05)',cursor:'pointer'}}
                      onMouseEnter={ev=>(ev.currentTarget.style.background='rgba(255,255,255,0.05)')}
                      onMouseLeave={ev=>(ev.currentTarget.style.background=BG4)}
                    >
                      <div style={{display:'flex',alignItems:'center',gap:9}}>
                        <div style={{width:30,height:30,borderRadius:6,background:`${e.riskColor}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          {e.type==='agency'?<Building size={13} color={e.riskColor}/>:e.type==='casting'?<Megaphone size={13} color={e.riskColor}/>:<User size={13} color={e.riskColor}/>}
                        </div>
                        <div>
                          <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5',lineHeight:1.3}}>{e.name}</div>
                          <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{e.uid}</div>
                        </div>
                      </div>
                      <span style={{fontSize:14,fontWeight:700,padding:'2px 8px',borderRadius:5,background:`${e.riskColor}18`,color:e.riskColor,border:`1px solid ${e.riskColor}33`,whiteSpace:'nowrap' as const,flexShrink:0}}>{e.risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fraud Detection Insights */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px',flex:1}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>Fraud Detection Insights</div>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {INSIGHTS.map((ins,i)=>(
                    <div key={i} style={{display:'flex',gap:10,padding:'10px',borderRadius:9,background:BG4,border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div style={{width:36,height:36,borderRadius:8,background:ins.iconBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <ins.icon size={16} color={ins.iconColor}/>
                      </div>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5',lineHeight:1.4,marginBottom:2}}>{ins.title}</div>
                        <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{ins.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div onClick={()=>router.push('/admin/analytics')}
                  style={{marginTop:12,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px',borderRadius:8,border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',fontSize:14,color:'rgba(255,255,255,0.55)'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.04)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                ><BarChart2 size={14}/> View Full Fraud Report</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW CONTEXT MENU ── */}
      {menuId&&(
        <>
          <div onClick={()=>setMenuId('')} style={{position:'fixed',inset:0,zIndex:300}}/>
          <div style={{position:'fixed',top:menuPos.top,right:menuPos.right,width:200,background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,overflow:'hidden',zIndex:400,boxShadow:'0 8px 24px rgba(0,0,0,0.6)'}}>
            {[
              {label:'View Details',         color:'#F5F5F5', action:()=>{const a=alerts.find(x=>x.id===menuId);if(a)setViewAlert(a);setMenuId('');}},
              {label:'Mark as Safe',         color:GREEN,     action:()=>doAction(menuId,'safe',()=>setMenuId(''))},
              {label:'Block Entity',         color:RED,       action:()=>doAction(menuId,'block',()=>setMenuId(''))},
              {label:'Escalate to Reports',  color:ORANGE,    action:()=>{doAction(menuId,'escalate',()=>{setMenuId('');router.push('/admin/reports');});}},
              {label:'View Entity Profile',  color:BLUE,      action:()=>{const a=alerts.find(x=>x.id===menuId);if(a)goProfile(a.entityUid);setMenuId('');}},
              {label:'Download Evidence',    color:PURPLE,    action:()=>{
                const a=alerts.find(x=>x.id===menuId);
                if(a) exportToCSV([a],`evidence-${a.id}.csv`);
                showToast('Evidence downloaded');setMenuId('');
              }},
            ].map(({label,color,action})=>(
              <div key={label} onClick={action}
                style={{display:'flex',alignItems:'center',gap:9,padding:'10px 14px',fontSize:14,cursor:'pointer',color}}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
              >{label}</div>
            ))}
          </div>
        </>
      )}

      {/* ── DETAIL MODAL ── */}
      {viewAlert&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,width:'100%',maxWidth:600,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <div>
                <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>FRAUD ALERT DETAILS</div>
                <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewAlert.id}</div>
              </div>
              <button onClick={()=>setViewAlert(null)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <div style={{padding:'20px 22px',display:'flex',flexDirection:'column',gap:16}}>
              {/* Badges */}
              <div style={{display:'flex',gap:8}}>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:RISK_BG[viewAlert.risk],color:RISK_COLOR[viewAlert.risk],border:`1px solid ${RISK_COLOR[viewAlert.risk]}33`}}>{viewAlert.risk} Risk</span>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:STATUS_BG[viewAlert.status]||'rgba(255,255,255,0.08)',color:STATUS_COLOR[viewAlert.status]||'#F5F5F5',border:`1px solid ${STATUS_COLOR[viewAlert.status]||'rgba(255,255,255,0.2)'}33`}}>{viewAlert.status}</span>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:`${viewAlert.typeColor}18`,color:viewAlert.typeColor,border:`1px solid ${viewAlert.typeColor}33`}}>{viewAlert.type}</span>
              </div>
              {/* Entity */}
              <div style={{background:BG3,borderRadius:10,padding:'14px',display:'flex',gap:14,alignItems:'center'}}>
                <div style={{width:44,height:44,borderRadius:9,background:`${viewAlert.typeColor}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <TypeIcon type={viewAlert.typeIcon} color={viewAlert.typeColor}/>
                </div>
                <div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:2}}>Flagged Entity</div>
                  <div style={{fontSize:16,fontWeight:700,color:BLUE,cursor:'pointer'}} onClick={()=>{goProfile(viewAlert.entityUid);setViewAlert(null);}}>{viewAlert.entity}</div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewAlert.entityUid}</div>
                </div>
              </div>
              {/* Details grid */}
              {[
                {label:'Alert ID',     value:viewAlert.id},
                {label:'Fraud Type',   value:viewAlert.type},
                {label:'Details',      value:viewAlert.details},
                {label:'Detected On',  value:`${viewAlert.date}${viewAlert.time?' at '+viewAlert.time:''}`},
              ].map(({label,value})=>(
                <div key={label} style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:8,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{label}</span>
                  <span style={{fontSize:15,color:'#F5F5F5',fontWeight:500}}>{value}</span>
                </div>
              ))}
              {/* Actions */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:4}}>
                <button onClick={()=>doAction(viewAlert.id,'safe',()=>setViewAlert(null))}
                  style={{padding:'10px',background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:8,color:GREEN,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Check size={14}/> Mark Safe
                </button>
                <button onClick={()=>doAction(viewAlert.id,'block',()=>setViewAlert(null))}
                  style={{padding:'10px',background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,color:RED,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Lock size={14}/> Block
                </button>
                <button onClick={()=>doAction(viewAlert.id,'escalate',()=>{setViewAlert(null);router.push('/admin/reports');})}
                  style={{padding:'10px',background:'rgba(249,115,22,0.12)',border:'1px solid rgba(249,115,22,0.25)',borderRadius:8,color:ORANGE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <AlertTriangle size={14}/> Escalate
                </button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <button onClick={()=>{goProfile(viewAlert.entityUid);setViewAlert(null);}}
                  style={{padding:'10px',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:8,color:BLUE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <User size={14}/> View Profile
                </button>
                <button onClick={()=>{exportToCSV([viewAlert],`evidence-${viewAlert.id}.csv`);showToast('Evidence downloaded');}}
                  style={{padding:'10px',background:'rgba(139,92,246,0.12)',border:'1px solid rgba(139,92,246,0.25)',borderRadius:8,color:PURPLE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Download size={14}/> Download Evidence
                </button>
              </div>
              <button onClick={()=>setViewAlert(null)} style={{padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FILTERS MODAL ── */}
      {showFilters&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:460,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>ADVANCED FILTERS</div>
              <button onClick={()=>setShowFilters(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>

            {/* Fraud Type */}
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>Fraud Type</label>
              <select value={pendingFraudType}
                onChange={e => setPendingFraudType(e.target.value)}
                style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontSize:15,outline:'none'}}>
                <option value="All">All Types</option>
                <option value="Scam / Fraud">Scam / Fraud</option>
                <option value="Fake Profile / Impersonation">Fake Profile / Impersonation</option>
                <option value="Harassment / Abuse">Harassment / Abuse</option>
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Spam">Spam</option>
                <option value="Copyright Violation">Copyright Violation</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Risk Level */}
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>Risk Level</label>
              <select value={pendingRisk}
                onChange={e => setPendingRisk(e.target.value)}
                style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontSize:15,outline:'none'}}>
                <option value="All">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
            </div>

            {/* Status */}
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>Status</label>
              <select value={pendingStatus}
                onChange={e => setPendingStatus(e.target.value)}
                style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontSize:15,outline:'none'}}>
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Dismissed">Dismissed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>

            {/* Entity Type */}
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>Entity Type</label>
              <select value={pendingEntity}
                onChange={e => setPendingEntity(e.target.value)}
                style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontSize:15,outline:'none'}}>
                <option value="All">All Entities</option>
                <option value="User">User / Aspirant</option>
                <option value="Agency">Agency</option>
                <option value="Casting Call">Casting Call</option>
              </select>
            </div>

            {/* Date Range */}
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>Date Range</label>
              <select value={pendingDate}
                onChange={e => setPendingDate(e.target.value)}
                style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontSize:15,outline:'none'}}>
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
            </div>

            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button onClick={clearFilters} style={{flex:1,padding:11,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontSize:15,cursor:'pointer'}}>Clear All</button>
              <button onClick={()=>setShowFilters(false)} style={{flex:1,padding:11,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontSize:15,cursor:'pointer'}}>Cancel</button>
              <button onClick={applyFilters} style={{flex:2,padding:11,background:RED,border:'none',borderRadius:7,color:'#fff',fontFamily:BEBAS,fontSize:20,letterSpacing:1,cursor:'pointer'}}>APPLY FILTERS</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast&&(
        <div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',background:BG2,border:`1px solid ${toastType==='error'?'rgba(239,68,68,0.3)':'rgba(255,255,255,0.12)'}`,borderRadius:10,padding:'12px 22px',fontSize:15,fontWeight:600,color:'#F5F5F5',zIndex:600,boxShadow:'0 4px 24px rgba(0,0,0,0.5)',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>
          {toastType==='error'?<XCircle size={15} color={RED}/>:<CheckSquare size={15} color={GREEN}/>} {toast}
        </div>
      )}

      {/* CSS for spinner */}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} select option{background:#121821;color:#F5F5F5;}`}</style>

    </div>
  );
}