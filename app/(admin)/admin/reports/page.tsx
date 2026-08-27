'use client';
import AdminSidebar from '@/components/layout/AdminSidebar';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard,
  Database, Settings, ScrollText, Bell, ChevronRight,
  TrendingUp, Download, AlertTriangle, UserCheck,
  MoreVertical, BadgeCheck, BellRing, Ticket,
  KeyRound, ChevronLeft, Menu, ChevronDown, Eye,
  Search, Filter, CheckSquare, Square, Lock,
  X, Info, ShieldAlert, RefreshCw, Clock, Check,
  XCircle, MessageSquare, User, Building,
} from 'lucide-react';
import AdminTopnav from '@/components/layout/AdminTopnav';

/* ─── Design tokens ──────────────────────────────────────────── */
const BG    = '#050505';
const BG2   = '#0B0F14';
const BG3   = '#121821';
const BG4   = 'rgba(255,255,255,0.03)';
const GOLD  = '#D4A64A';
const BEBAS = "'Bebas Neue', sans-serif";
const BARLOW= "'Barlow Condensed', sans-serif";
const GREEN = '#22C55E';
const RED   = '#C8202A';
const BLUE  = '#3B82F6';
const PURPLE= '#8B5CF6';
const ORANGE= '#F97316';
const TEAL  = '#14B8A6';

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

const STAT_ICONS = [FileText, AlertTriangle, Clock, Check, XCircle];
const TABS        = ['Overview','Reports','Complaints','Appeals'];
const TIME_RANGES = ['Last 7 Days','Last 30 Days','Last 90 Days','All Time'];
const SORT_OPTS   = ['Newest First','Oldest First','Highest Priority','Status'];
const PER_PAGE    = 5;

const PRIORITY_COLOR: Record<string,string> = { High: RED, Medium: ORANGE, Low: GREEN };
const PRIORITY_BG:    Record<string,string> = { High: 'rgba(239,68,68,0.12)', Medium: 'rgba(249,115,22,0.12)', Low: 'rgba(34,197,94,0.12)' };
const STATUS_COLOR:   Record<string,string> = { pending: ORANGE, escalated: BLUE, resolved: GREEN, dismissed: RED };
const STATUS_BG:      Record<string,string> = { pending: 'rgba(249,115,22,0.12)', escalated: 'rgba(59,130,246,0.12)', resolved: 'rgba(34,197,94,0.12)', dismissed: 'rgba(239,68,68,0.12)' };
const STATUS_LABEL:   Record<string,string> = { pending:'Open', escalated:'In Progress', resolved:'Resolved', dismissed:'Rejected/Dismissed' };

/* ─── Types ───────────────────────────────────────────────────── */
interface StatCard { label:string; value:string; delta:string; sub:string; color:string; positive:boolean; }
interface ChartPoint { label:string; count:number; }
interface DonutSlice { label:string; value:number; pct:number; color:string; }
interface InsightItem { icon: typeof ShieldAlert; iconBg:string; iconColor:string; title:string; sub:string; }
interface Report {
  id:string; report_number:string; date:string; time:string;
  reportedBy:string; reportedByUid:string; reporterImg:string|null;
  against:string; againstUid:string; againstUserId:string; againstType:string;
  type:string; category:string; priority:string; status:string;
  description:string; reportedByUserId:string;
}

/* ─── Auth helper ─────────────────────────────────────────────── */
function getToken():string {
  try{ const raw = localStorage.getItem('ss_user')||sessionStorage.getItem('ss_user')||'{}'; return JSON.parse(raw).token||''; }
  catch{ return ''; }
}

/* ─── SVG Line Chart ─────────────────────────────────────────── */
function ReportsChart({ labels, data }:{ labels:string[]; data:number[] }) {
  const W=580,H=240,pl=44,pb=205,pr=W-10,pt=14;
  const pw=pr-pl,ph=pb-pt;

  // No labels or all data is empty → friendly empty state
  if(!labels.length) return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%'}}>
      <text x={W/2} y={H/2} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={13} fontFamily={BARLOW}>No data</text>
    </svg>
  );
  const allZero = data.every(v=>v===0);
  if(allZero) return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%'}}>
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1}/>
      {labels.map((l,i)=>{
        const mx2=(i:number)=>pl+(i/(Math.max(labels.length-1,1)))*pw;
        return <text key={i} x={mx2(i)} y={pb+18} fill="rgba(255,255,255,0.3)" fontSize={12} textAnchor="middle" fontFamily={BARLOW}>{l}</text>;
      })}
      <text x={W/2} y={pb-60} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={13} fontFamily={BARLOW}>No reports in this period</text>
    </svg>
  );

  // Smart maxY: use actual max, but give a minimum headroom so small values render visibly
  const rawMax = Math.max(...data);
  // Round up to a "nice" ceiling with at least 20% headroom
  const niceMax = (n:number) => {
    if(n <= 5)   return 10;
    if(n <= 10)  return 15;
    if(n <= 20)  return 25;
    if(n <= 50)  return 60;
    if(n <= 100) return 120;
    const mag = Math.pow(10, Math.floor(Math.log10(n)));
    return Math.ceil(n * 1.2 / mag) * mag;
  };
  const roundMax = niceMax(rawMax);
  const gridY=[0,roundMax*0.25,roundMax*0.5,roundMax*0.75,roundMax].map(Math.round);
  const mx=(i:number)=>pl+(i/(Math.max(labels.length-1,1)))*pw;
  const my=(v:number)=>pb-(v/roundMax)*ph;
  function smooth(pts:[number,number][]):string{
    if(pts.length===1) return `M ${pts[0][0]} ${pts[0][1]}`;
    let d=`M ${pts[0][0]} ${pts[0][1]}`;
    for(let i=0;i<pts.length-1;i++){
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
  const pts:[number,number][]=data.map((v,i)=>[mx(i),my(v)]);
  const path=smooth(pts);
  const area=pts.length>1?`${path} L ${pts[pts.length-1][0]} ${pb} L ${pts[0][0]} ${pb} Z`:'';
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RED} stopOpacity={0.25}/>
          <stop offset="100%" stopColor={RED} stopOpacity={0.02}/>
        </linearGradient>
      </defs>
      {gridY.map(v=>(
        <g key={v}>
          <line x1={pl} y1={my(v)} x2={pr} y2={my(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3"/>
          <text x={pl-6} y={my(v)+4} fill="rgba(255,255,255,0.28)" fontSize={12} textAnchor="end" fontFamily={BARLOW}>{v===0?'0':v}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1}/>
      {labels.map((l,i)=><text key={i} x={mx(i)} y={pb+18} fill="rgba(255,255,255,0.3)" fontSize={12} textAnchor="middle" fontFamily={BARLOW}>{l}</text>)}
      {area&&<path d={area} fill="url(#rg)"/>}
      {pts.length>1&&<path d={path} fill="none" stroke={RED} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>}
      {pts.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={4} fill={RED} stroke={BG3} strokeWidth={2}/>)}
    </svg>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────── */
function DonutChart({data,total,label,size=160}:{data:DonutSlice[];total:string;label:string;size?:number}){
  const cx=size/2,cy=size/2,R=size*0.44,r=size*0.29;
  const toRad=(d:number)=>(d*Math.PI)/180;
  const pt=(a:number,rad:number)=>[cx+rad*Math.cos(toRad(a)),cy+rad*Math.sin(toRad(a))];
  const sum=data.reduce((s,d)=>s+d.pct,0);
  if(!sum) return(
    <svg viewBox={`0 0 ${size} ${size}`} style={{width:size,height:size,flexShrink:0}}>
      <circle cx={cx} cy={cy} r={(R+r)/2} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={R-r}/>
      <circle cx={cx} cy={cy} r={r-2} fill={BG3}/>
      <text x={cx} y={cy-10} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={size*0.07} fontFamily={BARLOW}>{label}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="#F5F5F5" fontSize={size*0.14} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
    </svg>
  );
  const nonZero=data.filter(d=>d.pct>0);
  if(nonZero.length===1) return(
    <svg viewBox={`0 0 ${size} ${size}`} style={{width:size,height:size,flexShrink:0}}>
      <circle cx={cx} cy={cy} r={(R+r)/2} fill="none" stroke={nonZero[0].color} strokeWidth={R-r}/>
      <circle cx={cx} cy={cy} r={r-2} fill={BG3}/>
      <text x={cx} y={cy-10} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={size*0.07} fontFamily={BARLOW}>{label}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="#F5F5F5" fontSize={size*0.14} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
    </svg>
  );
  let start=-90;
  const arcs=nonZero.map(seg=>{
    const sweep=(seg.pct/sum)*360,end=start+sweep-1,large=sweep>180?1:0;
    const[x1,y1]=pt(start,R);const[x2,y2]=pt(end,R);
    const[x3,y3]=pt(end,r);const[x4,y4]=pt(start,r);
    const d=`M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    start=end+1;
    return{...seg,d};
  });
  return(
    <svg viewBox={`0 0 ${size} ${size}`} style={{width:size,height:size,flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r-2} fill={BG3}/>
      {arcs.map(a=><path key={a.label} d={a.d} fill={a.color}/>)}
      <text x={cx} y={cy-10} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={size*0.07} fontFamily={BARLOW}>{label}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="#F5F5F5" fontSize={size*0.14} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
    </svg>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ReportsComplaintsPage(){
  const router=useRouter();

  /* ── Layout ── */
  const[sidebarOpen,setSidebarOpen]=useState(false);
  const[profileOpen,setProfileOpen]=useState(false);

  /* ── Filters ── */
  const[activeTab,setActiveTab]=useState('Overview');
  const[timeRange,setTimeRange]=useState('All Time');
  const[sortBy,setSortBy]=useState('Newest First');
  const[search,setSearch]=useState('');
  const[filterType,setFilterType]=useState('All Report Types');
  const[filterStatus,setFilterStatus]=useState('All Status');
  const[filterPriority,setFilterPriority]=useState('All Priority');
  const[filterAgainst,setFilterAgainst]=useState('All');

  /* ── Advanced filter modal state ── */
  const[showFilters,setShowFilters]=useState(false);
  const[advType,setAdvType]=useState('All');
  const[advPriority,setAdvPriority]=useState('All');
  const[advStatus,setAdvStatus]=useState('All');
  const[advAgainst,setAdvAgainst]=useState('All');
  const[advDate,setAdvDate]=useState('All Time');

  /* ── Pagination / selection ── */
  const[selected,setSelected]=useState<string[]>([]);
  const[page,setPage]=useState(1);
  const[menuId,setMenuId]=useState('');
  const[menuPos,setMenuPos]=useState({top:0,right:0});

  /* ── Modals ── */
  const[showExport,setShowExport]=useState(false);
  const[viewReport,setViewReport]=useState<Report|null>(null);
  const[toast,setToast]=useState('');

  /* ── Real data ── */
  const[adminName,setAdminName]=useState('Administrator');
  const[adminAvatar,setAdminAvatar]=useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face');
  const[adminId,setAdminId]=useState('Admin');
  const[notifCount,setNotifCount]=useState(0);
  const[stats,setStats]=useState<StatCard[]>([]);
  const[chartLabels,setChartLabels]=useState<string[]>([]);
  const[chartData,setChartData]=useState<number[]>([]);
  const[typeData,setTypeData]=useState<DonutSlice[]>([]);
  const[statusDonut,setStatusDonut]=useState<DonutSlice[]>([]);
  const[insights,setInsights]=useState<InsightItem[]>([]);
  const[reports,setReports]=useState<Report[]>([]);
  const[totalCount,setTotalCount]=useState(0);
  const[totalPages,setTotalPages]=useState(1);
  const[dateRangeLabel,setDateRangeLabel]=useState('');

  /* ── Tab-specific data ── */
  const[tabReports,setTabReports]=useState<Report[]>([]);
  const[tabTotal,setTabTotal]=useState(0);
  const[tabPages,setTabPages]=useState(1);
  const[tabPage,setTabPage]=useState(1);
  const[tabSearch,setTabSearch]=useState('');
  const[tabSort,setTabSort]=useState('Newest First');
  const[tabLoading,setTabLoading]=useState(false);

  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(''),2800);};

  /* ── Load admin profile ── */
  useEffect(()=>{
    const token=getToken(); if(!token) return;
    fetch('/api/admin/dashboard',{headers:{Authorization:`Bearer ${token}`}})
      .then(r=>r.json()).then(d=>{
        const a=d.data?.admin||d.admin;
        if(a){ setAdminName(a.full_name||'Administrator'); if(a.avatar_url) setAdminAvatar(a.avatar_url); if(a.admin_id) setAdminId(a.admin_id); }
      }).catch(()=>{});
  },[]);

  /* ── Load notification count ── */
  useEffect(()=>{
    const token=getToken(); if(!token) return;
    fetch('/api/notifications?unread=true&limit=1',{headers:{Authorization:`Bearer ${token}`}})
      .then(r=>r.json()).then(d=>{const t=d.data?.total??d.total; if(typeof t==='number') setNotifCount(t);}).catch(()=>{});
  },[]);

  /* ── Load stats + charts + donuts + insights ── */
  useEffect(()=>{
    const token=getToken(); if(!token) return;
    fetch(`/api/admin/reports?type=stats&period=${encodeURIComponent(timeRange)}`,{headers:{Authorization:`Bearer ${token}`}})
      .then(r=>r.json()).then(d=>{
        const r=d.data??d;
        if(r.stats)        setStats(r.stats);
        if(r.chartLabels)  setChartLabels(r.chartLabels);
        if(r.chartData)    setChartData(r.chartData);
        if(r.typeData)     setTypeData(r.typeData);
        if(r.statusDonut)  setStatusDonut(r.statusDonut);
        if(r.insights)     setInsights(r.insights.map((ins: any)=>({
          ...ins,
          icon: ins.icon==='TrendingUp'?TrendingUp:ins.icon==='Clock'?Clock:ins.icon==='ShieldAlert'?ShieldAlert:Users,
        })));
        if(r.dateRangeLabel) setDateRangeLabel(r.dateRangeLabel);
      }).catch(()=>{});
  },[timeRange]);

  /* ── Load reports table ── */
  const loadReports=useCallback(()=>{
    const token=getToken(); if(!token) return;
    const params=new URLSearchParams({
      page:String(page), per_page:String(PER_PAGE),
      period:timeRange, sort:sortBy,
      ...(filterType!=='All Report Types'&&{report_type:filterType}),
      ...(filterStatus!=='All Status'&&{status:filterStatus}),
      ...(filterPriority!=='All Priority'&&{priority:filterPriority}),
      // against_type filter removed — reported_entity_type column not in schema
      ...(search&&{q:search}),
    });
    fetch(`/api/admin/reports?${params}`,{headers:{Authorization:`Bearer ${token}`}})
      .then(r=>r.json()).then(d=>{
        const r=d.data??d;
        if(r.reports) setReports(r.reports);
        if(typeof r.total==='number'){ setTotalCount(r.total); setTotalPages(Math.max(1,Math.ceil(r.total/PER_PAGE))); }
      }).catch(()=>{});
  },[page,timeRange,sortBy,filterType,filterStatus,filterPriority,filterAgainst,search]);

  useEffect(()=>{loadReports();},[loadReports]);

  /* ── Load tab-specific reports (Reports / Complaints / Appeals) ── */
  const loadTabReports=useCallback(()=>{
    if(activeTab==='Overview') return;
    const token=getToken(); if(!token) return;
    setTabLoading(true);

    // Tab-specific server-side filters
    const tabParams: Record<string,string> = {
      page: String(tabPage),
      per_page: String(PER_PAGE),
      period: timeRange,
      sort: tabSort,
      ...(tabSearch && {q: tabSearch}),
    };
    if(activeTab==='Reports'){
      // Open + escalated (unresolved, action needed)
      // We fetch without status filter and filter client-side below
      // because the API doesn't support OR on status; fetch all then filter
    } else if(activeTab==='Complaints'){
      // Complaint-type reasons
      tabParams['report_type']='Harassment / Abuse';
    } else if(activeTab==='Appeals'){
      tabParams['status']='dismissed';
    }

    fetch(`/api/admin/reports?${new URLSearchParams(tabParams)}`,{headers:{Authorization:`Bearer ${token}`}})
      .then(r=>r.json()).then(d=>{
        const r=d.data??d;
        let rows: Report[] = r.reports || [];

        // Client-side post-filter for Reports tab (pending + escalated)
        if(activeTab==='Reports'){
          rows = rows.filter((r:Report)=>r.status==='pending'||r.status==='escalated');
        }
        // Complaints tab — all complaint-type reasons
        if(activeTab==='Complaints'){
          rows = rows.filter((r:Report)=>{
            const cat=(r.category||'').toLowerCase();
            return cat==='harassment'||cat==='inappropriate_content'||cat==='spam'||cat==='copyright_violation'||cat==='other';
          });
        }

        setTabReports(rows);
        const tot = activeTab==='Reports'||activeTab==='Complaints' ? rows.length : (typeof r.total==='number'?r.total:rows.length);
        setTabTotal(tot);
        setTabPages(Math.max(1,Math.ceil(tot/PER_PAGE)));
      }).catch(()=>{})
      .finally(()=>setTabLoading(false));
  },[activeTab,tabPage,tabSort,tabSearch,timeRange]);

  useEffect(()=>{ setTabPage(1); setTabSearch(''); setTabSort('Newest First'); },[activeTab]);
  useEffect(()=>{ loadTabReports(); },[loadTabReports]);

  /* ── Selection helpers ── */
  const allSel=reports.length>0&&reports.every(r=>selected.includes(r.id));
  const toggleSel=(id:string)=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=()=>setSelected(allSel?selected.filter(id=>!reports.find(r=>r.id===id)):[...new Set([...selected,...reports.map(r=>r.id)])]);

  /* ── Action handlers — real API calls ── */
  const updateReport=async(id:string,action:string,label:string)=>{
    const token=getToken();
    try{
      await fetch('/api/admin/reports',{
        method:'PATCH',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        body:JSON.stringify({id,action}),
      });
      showToast(label);
    }catch{ showToast(label); }
    setMenuId(''); setViewReport(null); loadReports();
  };

  const suspendReportedUser=async(report:Report)=>{
    const token=getToken();
    try{
      await fetch('/api/admin/users',{
        method:'PUT',
        headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},
        body:JSON.stringify({user_id:report.againstUserId,action:'suspend',reason:`Report ${report.report_number}`}),
      });
      showToast(`User suspended`);
    }catch{ showToast('User suspended'); }
    setMenuId(''); setViewReport(null);
  };

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:BG,fontFamily:BARLOW,color:'#F5F5F5'}}>

      <AdminTopnav />

      {/* ══ BODY ══ */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* ── SIDEBAR ── */}
        <AdminSidebar onCollapse={(c) => setSidebarOpen(!c)} />

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,overflowY:'auto',padding:'20px 24px 40px',display:'flex',flexDirection:'column',gap:16}}>

          {/* Page header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:6}}>
                <span style={{cursor:'pointer'}} onClick={()=>router.push('/admin/dashboard')}>Home</span>
                <ChevronRight size={12}/>
                <span style={{color:'#F5F5F5'}}>Reports & Complaints</span>
              </div>
              <h1 style={{fontFamily:BARLOW,fontSize:28,fontWeight:800,margin:0,display:'flex',alignItems:'center',gap:6}}>
                Reports & Complaints
                <span style={{width:7,height:7,borderRadius:'50%',background:RED,display:'inline-block',marginBottom:2}}/>
              </h1>
              <p style={{fontSize:15,color:'rgba(255,255,255,0.45)',margin:'4px 0 0'}}>Track, manage and resolve user reports and platform complaints.</p>
            </div>
            <button onClick={()=>setShowExport(true)}
              style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,cursor:'pointer',flexShrink:0,marginTop:28}}>
              <Download size={14}/> Export Report
            </button>
          </div>

          {/* ── TABS ── */}
          <div style={{display:'flex',gap:0,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            {TABS.map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)}
                style={{padding:'10px 20px',background:'none',border:'none',borderBottom:activeTab===tab?`2px solid ${RED}`:'2px solid transparent',color:activeTab===tab?'#F5F5F5':'rgba(255,255,255,0.45)',fontFamily:BARLOW,fontSize:16,fontWeight:activeTab===tab?700:400,cursor:'pointer',marginBottom:-1,transition:'color 0.15s'}}>
                {tab}
              </button>
            ))}
          </div>

          {/* ── STAT CARDS — always visible on all tabs ── */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
            {(stats.length?stats:[
              {label:'Total Reports',value:'—',delta:'—',sub:'from last 7 days',color:PURPLE,positive:true},
              {label:'Open Reports',value:'—',delta:'—',sub:'from last 7 days',color:ORANGE,positive:true},
              {label:'In Progress',value:'—',delta:'—',sub:'from last 7 days',color:BLUE,positive:true},
              {label:'Resolved',value:'—',delta:'—',sub:'from last 7 days',color:GREEN,positive:true},
              {label:'Rejected / Dismissed',value:'—',delta:'—',sub:'from last 7 days',color:RED,positive:false},
            ]).map((s,i)=>{
              const Icon=STAT_ICONS[i];
              return(
                <div key={i} style={{borderRadius:12,padding:'16px',background:BG3,border:'1px solid rgba(255,255,255,0.06)',display:'flex',gap:14,alignItems:'center'}}>
                  <div style={{width:44,height:44,borderRadius:'50%',background:`${s.color}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Icon size={20} color={s.color}/>
                  </div>
                  <div>
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:3}}>{s.label}</div>
                    <div style={{fontFamily:BEBAS,fontSize:30,letterSpacing:1,lineHeight:1}}>{s.value}</div>
                    <div style={{display:'flex',alignItems:'center',gap:5,marginTop:3}}>
                      <TrendingUp size={11} color={s.positive?GREEN:RED}/>
                      <span style={{fontSize:14,fontWeight:700,color:s.positive?GREEN:RED}}>{s.delta}</span>
                      <span style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{s.sub}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── TAB CONTENT: Reports / Complaints / Appeals ── */}
          {activeTab !== 'Overview' && (()=>{
            /* Config per tab */
            const cfg = {
              Reports:    { title:'Open Reports',       sub:'Pending and escalated reports requiring admin action.', emptyMsg:'No open reports — all clear!',        color:ORANGE, statusFilter:['pending','escalated'] },
              Complaints: { title:'Complaints',         sub:'Harassment, spam, inappropriate content and copyright violations.', emptyMsg:'No complaints found.',    color:RED,    statusFilter:[] },
              Appeals:    { title:'Appeals',            sub:'Dismissed reports appealed by users for review.',        emptyMsg:'No appeals pending.',                color:PURPLE, statusFilter:['dismissed'] },
            }[activeTab]!;

            const pagedRows = tabReports.slice((tabPage-1)*PER_PAGE, tabPage*PER_PAGE);

            return (
              <div style={{display:'flex',flexDirection:'column',gap:14}}>

                {/* Search + sort bar */}
                <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap' as const}}>
                  <div style={{position:'relative',flex:1,minWidth:220}}>
                    <Search size={14} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)'}}/>
                    <input value={tabSearch} onChange={e=>{setTabSearch(e.target.value);setTabPage(1);}}
                      placeholder={`Search ${activeTab.toLowerCase()}…`}
                      style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'8px 10px 8px 32px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',boxSizing:'border-box' as const}}/>
                  </div>
                  <div style={{position:'relative'}}>
                    <select value={tabSort} onChange={e=>{setTabSort(e.target.value);setTabPage(1);}}
                      style={{appearance:'none' as const,padding:'8px 30px 8px 12px',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                      {SORT_OPTS.map(o=><option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:9,top:'50%',transform:'translateY(-50%)',pointerEvents:'none' as const}}/>
                  </div>
                  <button onClick={()=>loadTabReports()} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
                    <RefreshCw size={13}/> Refresh
                  </button>
                </div>

                {/* Table */}
                <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden'}}>
                  {/* Toolbar */}
                  <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    <div style={{flex:1}}>
                      <span style={{fontSize:16,fontWeight:700}}>{cfg.title}</span>
                      <span style={{marginLeft:8,background:`${cfg.color}22`,color:cfg.color,border:`1px solid ${cfg.color}44`,borderRadius:12,fontSize:13,fontWeight:700,padding:'2px 9px'}}>
                        {tabLoading?'…':tabTotal}
                      </span>
                    </div>
                    <span style={{fontSize:13,color:'rgba(255,255,255,0.4)'}}>{cfg.sub}</span>
                  </div>

                  {/* Column headers */}
                  <div style={{display:'grid',gridTemplateColumns:'36px 1.1fr 1.4fr 1.3fr 1fr 0.8fr 0.8fr 1fr 80px',padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',gap:6}}>
                    <div/>
                    {['Report ID','Reported By','Against','Type','Priority','Status','Date','Actions'].map(h=>(
                      <div key={h} style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:0.4}}>{h}</div>
                    ))}
                  </div>

                  {/* Rows */}
                  {tabLoading?(
                    <div style={{padding:'36px',textAlign:'center',color:'rgba(255,255,255,0.35)',fontSize:15}}>Loading…</div>
                  ):pagedRows.length===0?(
                    <div style={{padding:'48px 18px',textAlign:'center'}}>
                      <div style={{fontSize:15,color:'rgba(255,255,255,0.3)'}}>{cfg.emptyMsg}</div>
                    </div>
                  ):pagedRows.map((r,i)=>{
                    const pColor=PRIORITY_COLOR[r.priority]||'#F5F5F5';
                    const pBg=PRIORITY_BG[r.priority]||'rgba(255,255,255,0.08)';
                    const sColor=STATUS_COLOR[r.status]||'#F5F5F5';
                    const sBg=STATUS_BG[r.status]||'rgba(255,255,255,0.08)';
                    return(
                      <div key={r.id}
                        style={{display:'grid',gridTemplateColumns:'36px 1.1fr 1.4fr 1.3fr 1fr 0.8fr 0.8fr 1fr 80px',padding:'10px 14px',borderBottom:i<pagedRows.length-1?'1px solid rgba(255,255,255,0.04)':'none',alignItems:'center',gap:6,transition:'background 0.12s'}}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      >
                        {/* Colour dot */}
                        <div style={{width:8,height:8,borderRadius:'50%',background:pColor,margin:'0 auto'}}/>
                        {/* Report ID */}
                        <div style={{fontSize:13,fontWeight:600,color:'#F5F5F5'}}>{r.report_number}</div>
                        {/* Reported By */}
                        <div style={{display:'flex',alignItems:'center',gap:7}}>
                          <div style={{width:26,height:26,borderRadius:'50%',background:'rgba(212,166,74,0.12)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            {r.reporterImg?<img src={r.reporterImg} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>:<span style={{fontSize:11,fontWeight:700,color:GOLD}}>{r.reportedBy.charAt(0)}</span>}
                          </div>
                          <div>
                            <div style={{fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:100}}>{r.reportedBy}</div>
                            <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>{r.reportedByUid}</div>
                          </div>
                        </div>
                        {/* Against */}
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <div style={{width:22,height:22,borderRadius:5,background:r.againstType==='agency'?'rgba(59,130,246,0.15)':'rgba(139,92,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                            {r.againstType==='agency'?<Building size={11} color={BLUE}/>:<User size={11} color={PURPLE}/>}
                          </div>
                          <div style={{fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:100}}>{r.against}</div>
                        </div>
                        {/* Type */}
                        <div style={{fontSize:13,color:'rgba(255,255,255,0.7)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={r.type}>{r.type}</div>
                        {/* Priority */}
                        <span style={{fontSize:12,fontWeight:700,padding:'3px 8px',borderRadius:5,background:pBg,color:pColor,border:`1px solid ${pColor}33`,display:'inline-block'}}>{r.priority}</span>
                        {/* Status */}
                        <span style={{fontSize:12,fontWeight:700,padding:'3px 8px',borderRadius:5,background:sBg,color:sColor,border:`1px solid ${sColor}33`,display:'inline-block'}}>{STATUS_LABEL[r.status]||r.status}</span>
                        {/* Date */}
                        <div>
                          <div style={{fontSize:13}}>{r.date}</div>
                          <div style={{fontSize:11,color:'rgba(255,255,255,0.4)'}}>{r.time}</div>
                        </div>
                        {/* Actions */}
                        <div style={{display:'flex',gap:5}}>
                          {activeTab==='Reports' && <>
                            <button title="Resolve" onClick={()=>updateReport(r.id,'resolve',`Report ${r.report_number} resolved`)}
                              style={{padding:'5px 8px',background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:6,color:GREEN,cursor:'pointer',display:'flex',alignItems:'center'}}>
                              <Check size={13}/>
                            </button>
                            <button title="Escalate" onClick={()=>updateReport(r.id,'escalate',`Report ${r.report_number} escalated`)}
                              style={{padding:'5px 8px',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:6,color:BLUE,cursor:'pointer',display:'flex',alignItems:'center'}}>
                              <ShieldAlert size={13}/>
                            </button>
                          </>}
                          {activeTab==='Complaints' && <>
                            <button title="Resolve" onClick={()=>updateReport(r.id,'resolve',`Complaint ${r.report_number} resolved`)}
                              style={{padding:'5px 8px',background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:6,color:GREEN,cursor:'pointer',display:'flex',alignItems:'center'}}>
                              <Check size={13}/>
                            </button>
                            <button title="Dismiss" onClick={()=>updateReport(r.id,'dismiss',`Complaint ${r.report_number} dismissed`)}
                              style={{padding:'5px 8px',background:'rgba(249,115,22,0.12)',border:'1px solid rgba(249,115,22,0.25)',borderRadius:6,color:ORANGE,cursor:'pointer',display:'flex',alignItems:'center'}}>
                              <XCircle size={13}/>
                            </button>
                          </>}
                          {activeTab==='Appeals' && <>
                            <button title="Reopen" onClick={()=>updateReport(r.id,'reopen',`Appeal ${r.report_number} reopened`)}
                              style={{padding:'5px 8px',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:6,color:BLUE,cursor:'pointer',display:'flex',alignItems:'center'}}>
                              <RefreshCw size={13}/>
                            </button>
                            <button title="Uphold dismissal" onClick={()=>updateReport(r.id,'dismiss',`Appeal ${r.report_number} upheld`)}
                              style={{padding:'5px 8px',background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:6,color:RED,cursor:'pointer',display:'flex',alignItems:'center'}}>
                              <Lock size={13}/>
                            </button>
                          </>}
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination */}
                  {tabPages>1&&(
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 18px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                      <span style={{fontSize:13,color:'rgba(255,255,255,0.4)'}}>Page {tabPage} of {tabPages} · {tabTotal} total</span>
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>setTabPage(p=>Math.max(1,p-1))} disabled={tabPage===1}
                          style={{padding:'6px 12px',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,color:tabPage===1?'rgba(255,255,255,0.25)':'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:tabPage===1?'default':'pointer'}}>
                          ← Prev
                        </button>
                        <button onClick={()=>setTabPage(p=>Math.min(tabPages,p+1))} disabled={tabPage===tabPages}
                          style={{padding:'6px 12px',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,color:tabPage===tabPages?'rgba(255,255,255,0.25)':'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:tabPage===tabPages?'default':'pointer'}}>
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ── FILTER BAR (Overview only) ── */}
          {activeTab === 'Overview' && (
          <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap' as const}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,fontSize:14,color:'rgba(255,255,255,0.6)'}}>
              📅 {dateRangeLabel||timeRange}
              <RefreshCw size={13} color="rgba(255,255,255,0.3)" style={{cursor:'pointer'}} onClick={()=>loadReports()}/>
            </div>
            {[
              {val:filterType,   set:(v:string)=>{setFilterType(v);setPage(1);},   opts:['All Report Types','Fake Profile / Impersonation','Inappropriate Content','Scam / Fraud','Harassment / Abuse','Others']},
              {val:filterStatus, set:(v:string)=>{setFilterStatus(v);setPage(1);}, opts:['All Status','pending','escalated','resolved','dismissed']},
              {val:filterPriority,set:(v:string)=>{setFilterPriority(v);setPage(1);},opts:['All Priority','High','Medium','Low']},
            ].map((f,i)=>(
              <div key={i} style={{position:'relative'}}>
                <select value={f.val} onChange={e=>f.set(e.target.value)}
                  style={{appearance:'none',padding:'8px 32px 8px 12px',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                  {f.opts.map(o=><option key={o} value={o}>{o==='pending'?'Open':o==='escalated'?'In Progress':o==='resolved'?'Resolved':o==='dismissed'?'Rejected/Dismissed':o}</option>)}
                </select>
                <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:9,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
              </div>
            ))}
            <div style={{position:'relative',flex:1,minWidth:200}}>
              <Search size={14} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)'}}/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by ID, user, agency…"
                style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'8px 10px 8px 32px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <button onClick={()=>setShowFilters(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
              <Filter size={13}/> Filters
            </button>
          </div>
          )}

          {/* ── CHARTS ROW (Overview only) ── */}
          {activeTab === 'Overview' && (
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'grid',gridTemplateColumns:'1.8fr 1.3fr 1.3fr',gap:14}}>

            {/* Reports Over Time */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:16,fontWeight:700}}>Reports Over Time</span>
                <div style={{position:'relative'}}>
                  <select value={timeRange} onChange={e=>setTimeRange(e.target.value)}
                    style={{appearance:'none',padding:'5px 26px 5px 10px',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {TIME_RANGES.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={11} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:7,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              <div style={{width:'100%',height:230}}><ReportsChart labels={chartLabels} data={chartData}/></div>
            </div>

            {/* Reports by Type */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Reports by Type</div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                <DonutChart data={typeData.length?typeData:[{label:'No data',value:0,pct:100,color:'rgba(255,255,255,0.08)'}]} total={String(totalCount||0)} label="Total" size={148}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7}}>
                  {typeData.map(d=>(
                    <div key={d.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:d.color,flexShrink:0}}/>
                        <span style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:13,fontWeight:700}}>{d.pct}% <span style={{color:'rgba(255,255,255,0.4)',fontWeight:400}}>({d.value})</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reports by Status */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Reports by Status</div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                <DonutChart data={statusDonut.length?statusDonut:[{label:'No data',value:0,pct:100,color:'rgba(255,255,255,0.08)'}]} total={String(totalCount||0)} label="Total" size={148}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7}}>
                  {statusDonut.map(d=>(
                    <div key={d.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:d.color,flexShrink:0}}/>
                        <span style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:13,fontWeight:700,color:d.color}}>{d.pct}% <span style={{color:'rgba(255,255,255,0.4)',fontWeight:400}}>({d.value})</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── TABLE + INSIGHTS ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 270px',gap:14,minWidth:0}}>

            {/* Reports Table */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden',minWidth:0}}>
              {/* Toolbar */}
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                <span style={{fontSize:16,fontWeight:700,flex:1}}>
                  Recent Reports
                  <span style={{marginLeft:8,background:'rgba(239,68,68,0.15)',color:RED,border:'1px solid rgba(239,68,68,0.25)',borderRadius:12,fontSize:14,fontWeight:700,padding:'2px 9px'}}>{totalCount}</span>
                </span>
                <div style={{position:'relative'}}>
                  <select value={sortBy} onChange={e=>{setSortBy(e.target.value);setPage(1);}}
                    style={{appearance:'none',padding:'7px 26px 7px 10px',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:7,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {SORT_OPTS.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={11} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:7,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>

              {/* Column headers */}
              <div style={{display:'grid',gridTemplateColumns:'36px 1.2fr 1.5fr 1.4fr 1.1fr 0.9fr 0.8fr 0.8fr 1fr 60px',padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',gap:6}}>
                <div onClick={toggleAll} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                  {allSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.3)"/>}
                </div>
                {['Report ID','Reported By','Against (User/Agency)','Type','Category','Priority','Status','Reported On','Actions'].map(h=>(
                  <div key={h} style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:0.4}}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {reports.length===0?(
                <div style={{padding:'36px 18px',textAlign:'center',color:'rgba(255,255,255,0.35)',fontSize:15}}>No reports found.</div>
              ):reports.map((r,i)=>{
                const isSel=selected.includes(r.id);
                const pColor=PRIORITY_COLOR[r.priority]||'#F5F5F5';
                const pBg=PRIORITY_BG[r.priority]||'rgba(255,255,255,0.08)';
                const sColor=STATUS_COLOR[r.status]||'#F5F5F5';
                const sBg=STATUS_BG[r.status]||'rgba(255,255,255,0.08)';
                return(
                  <div key={r.id}
                    style={{display:'grid',gridTemplateColumns:'36px 1.2fr 1.5fr 1.4fr 1.1fr 0.9fr 0.8fr 0.8fr 1fr 60px',padding:'10px 14px',borderBottom:i<reports.length-1?'1px solid rgba(255,255,255,0.04)':'none',alignItems:'center',gap:6,background:isSel?'rgba(239,68,68,0.05)':'transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='rgba(255,255,255,0.02)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isSel?'rgba(239,68,68,0.05)':'transparent';}}
                  >
                    <div onClick={()=>toggleSel(r.id)} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                      {isSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.25)"/>}
                    </div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:'#F5F5F5'}}>{r.report_number}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:28,height:28,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:'1px solid rgba(255,255,255,0.1)',background:BG4,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {r.reporterImg?<img src={r.reporterImg} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:12,fontWeight:700,color:GOLD}}>{r.reportedBy.charAt(0)}</span>}
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600}}>{r.reportedBy}</div>
                        <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{r.reportedByUid}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <div style={{width:28,height:28,borderRadius:6,background:r.againstType==='agency'?'rgba(59,130,246,0.15)':r.againstType==='casting'?'rgba(249,115,22,0.15)':'rgba(139,92,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {r.againstType==='agency'?<Building size={13} color={BLUE}/>:r.againstType==='casting'?<Megaphone size={13} color={ORANGE}/>:<User size={13} color={PURPLE}/>}
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:120}}>{r.against}</div>
                        <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{r.againstUid}</div>
                      </div>
                    </div>
                    <div style={{fontSize:13,color:'rgba(255,255,255,0.7)',lineHeight:1.4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={r.type}>{r.type}</div>
                    <div style={{fontSize:13,color:'rgba(255,255,255,0.6)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}} title={r.category}>
                      {({'fake_profile':'Fake Profile','scam_casting':'Scam Casting','harassment':'Harassment','inappropriate_content':'Inappropriate','spam':'Spam','fraud':'Fraud','impersonation':'Impersonation','copyright_violation':'Copyright','other':'Other'} as Record<string,string>)[r.category] || r.category}
                    </div>
                    <div style={{display:'flex',alignItems:'center'}}>
                      <span style={{fontSize:12,fontWeight:700,padding:'3px 8px',borderRadius:5,background:pBg,color:pColor,border:`1px solid ${pColor}33`}}>{r.priority}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center'}}>
                      <span style={{fontSize:12,fontWeight:700,padding:'3px 8px',borderRadius:5,background:sBg,color:sColor,border:`1px solid ${sColor}33`}}>{STATUS_LABEL[r.status]||r.status}</span>
                    </div>
                    <div>
                      <div style={{fontSize:13}}>{r.date}</div>
                      <div style={{fontSize:12,color:'rgba(255,255,255,0.4)'}}>{r.time}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <button onClick={()=>setViewReport(r)} title="View Details"
                        style={{width:28,height:28,borderRadius:6,background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Eye size={13} color={BLUE}/>
                      </button>
                      <button onClick={e=>{const rect=e.currentTarget.getBoundingClientRect();setMenuPos({top:rect.bottom+4,right:window.innerWidth-rect.right});setMenuId(menuId===r.id?'':r.id);}}
                        style={{width:28,height:28,borderRadius:6,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <MoreVertical size={13} color="rgba(255,255,255,0.5)"/>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 18px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>
                  Showing {totalCount===0?0:Math.min((page-1)*PER_PAGE+1,totalCount)} to {Math.min(page*PER_PAGE,totalCount)} of {totalCount} entries
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

            {/* Reports Insights */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px',display:'flex',flexDirection:'column'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Reports Insights</div>
              <div style={{display:'flex',flexDirection:'column',gap:12,flex:1}}>
                {(insights.length?insights:[
                  {icon:TrendingUp,iconBg:'rgba(239,68,68,0.15)',iconColor:RED,title:'Loading insights…',sub:''},
                  {icon:Clock,iconBg:'rgba(249,115,22,0.15)',iconColor:ORANGE,title:'Loading…',sub:''},
                  {icon:ShieldAlert,iconBg:'rgba(34,197,94,0.15)',iconColor:GREEN,title:'Loading…',sub:''},
                  {icon:Users,iconBg:'rgba(59,130,246,0.15)',iconColor:BLUE,title:'Loading…',sub:''},
                ]).map((ins,i)=>(
                  <div key={i} style={{display:'flex',gap:12,padding:'12px',borderRadius:10,background:BG4,border:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{width:38,height:38,borderRadius:9,background:ins.iconBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <ins.icon size={17} color={ins.iconColor}/>
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5',lineHeight:1.4,marginBottom:3}}>{ins.title}</div>
                      <div style={{fontSize:13,color:'rgba(255,255,255,0.45)'}}>{ins.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div onClick={()=>router.push('/admin/analytics')}
                style={{marginTop:14,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px',borderRadius:8,border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',fontSize:14,color:'rgba(255,255,255,0.55)'}}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.04)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
              ><BarChart2 size={14}/> View Full Report Analytics</div>
            </div>
          </div>
          </div>
          )}
        </div>
      </div>

      {/* ── ROW CONTEXT MENU ── */}
      {menuId&&(
        <>
          <div onClick={()=>setMenuId('')} style={{position:'fixed',inset:0,zIndex:300}}/>
          <div style={{position:'fixed',top:menuPos.top,right:menuPos.right,width:200,background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,overflow:'hidden',zIndex:400,boxShadow:'0 8px 24px rgba(0,0,0,0.6)'}}>
            {(()=>{
              const r=reports.find(x=>x.id===menuId);
              if(!r) return null;
              return [
                {label:'View Details',     color:'#F5F5F5', action:()=>{setViewReport(r);setMenuId('');}},
                {label:'Resolve Report',   color:GREEN,     action:()=>updateReport(r.id,'resolve',`Report ${r.report_number} resolved`)},
                {label:'Dismiss Report',   color:ORANGE,    action:()=>updateReport(r.id,'dismiss',`Report ${r.report_number} dismissed`)},
                {label:'Suspend User',     color:RED,       action:()=>suspendReportedUser(r)},
                {label:'Escalate to Fraud',color:PURPLE,    action:()=>{router.push('/admin/fraud');setMenuId('');}},
                {label:'View Reported Profile', color:BLUE, action:()=>{
                  if(r.againstType==='agency') router.push(`/agency-profile?id=${r.againstUid}`);
                  else router.push(`/admin/aspirant-profile?id=${r.againstUid}`);
                  setMenuId('');
                }},
              ].map(({label,color,action})=>(
                <div key={label} onClick={action}
                  style={{display:'flex',alignItems:'center',gap:9,padding:'10px 14px',fontSize:14,cursor:'pointer',color}}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                >{label}</div>
              ));
            })()}
          </div>
        </>
      )}

      {/* ── REPORT DETAIL MODAL ── */}
      {viewReport&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,width:'100%',maxWidth:600,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <div>
                <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>REPORT DETAILS</div>
                <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewReport.report_number}</div>
              </div>
              <button onClick={()=>setViewReport(null)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <div style={{padding:'20px 22px',display:'flex',flexDirection:'column',gap:16}}>
              <div style={{display:'flex',gap:8}}>
                <span style={{fontSize:13,fontWeight:700,padding:'3px 11px',borderRadius:5,background:PRIORITY_BG[viewReport.priority]||'rgba(255,255,255,0.08)',color:PRIORITY_COLOR[viewReport.priority]||'#F5F5F5',border:`1px solid ${PRIORITY_COLOR[viewReport.priority]||'rgba(255,255,255,0.2)'}33`}}>{viewReport.priority} Priority</span>
                <span style={{fontSize:13,fontWeight:700,padding:'3px 11px',borderRadius:5,background:STATUS_BG[viewReport.status]||'rgba(255,255,255,0.08)',color:STATUS_COLOR[viewReport.status]||'#F5F5F5',border:`1px solid ${STATUS_COLOR[viewReport.status]||'rgba(255,255,255,0.2)'}33`}}>{STATUS_LABEL[viewReport.status]||viewReport.status}</span>
              </div>
              <div style={{background:BG3,borderRadius:10,padding:'14px',display:'flex',gap:14,alignItems:'center'}}>
                <div style={{width:46,height:46,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:'2px solid rgba(255,255,255,0.1)',background:BG4,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {viewReport.reporterImg?<img src={viewReport.reporterImg} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontFamily:BEBAS,fontSize:22,color:GOLD}}>{viewReport.reportedBy.charAt(0)}</span>}
                </div>
                <div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:2}}>Reported by</div>
                  <div style={{fontSize:16,fontWeight:700}}>{viewReport.reportedBy}</div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewReport.reportedByUid}</div>
                </div>
              </div>
              {[
                {label:'Report ID',     value:viewReport.report_number},
                {label:'Against',       value:`${viewReport.against} (${viewReport.againstUid})`},
                {label:'Report Type',   value:viewReport.type},
                {label:'Category',      value:viewReport.category},
                {label:'Description',   value:viewReport.description||'—'},
                {label:'Date Reported', value:`${viewReport.date} at ${viewReport.time}`},
              ].map(({label,value})=>(
                <div key={label} style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:8,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{label}</span>
                  <span style={{fontSize:14,color:'#F5F5F5',fontWeight:500}}>{value}</span>
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:4}}>
                <button onClick={()=>updateReport(viewReport.id,'resolve',`Report ${viewReport.report_number} resolved`)}
                  style={{padding:'10px',background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:8,color:GREEN,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Check size={14}/> Resolve
                </button>
                <button onClick={()=>updateReport(viewReport.id,'dismiss',`Report ${viewReport.report_number} dismissed`)}
                  style={{padding:'10px',background:'rgba(249,115,22,0.12)',border:'1px solid rgba(249,115,22,0.25)',borderRadius:8,color:ORANGE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <XCircle size={14}/> Dismiss
                </button>
                <button onClick={()=>suspendReportedUser(viewReport)}
                  style={{padding:'10px',background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,color:RED,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Lock size={14}/> Suspend
                </button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <button onClick={()=>{
                  if(viewReport.againstType==='agency') router.push(`/agency-profile?id=${viewReport.againstUid}`);
                  else router.push(`/admin/aspirant-profile?id=${viewReport.againstUid}`);
                  setViewReport(null);
                }}
                  style={{padding:'10px',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:8,color:BLUE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  {viewReport.againstType==='agency'?<Building size={14}/>:<User size={14}/>} View Reported Profile
                </button>
                <button onClick={()=>{router.push('/admin/fraud');setViewReport(null);}}
                  style={{padding:'10px',background:'rgba(139,92,246,0.12)',border:'1px solid rgba(139,92,246,0.25)',borderRadius:8,color:PURPLE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <ShieldAlert size={14}/> Escalate to Fraud
                </button>
              </div>
              <button onClick={()=>setViewReport(null)} style={{padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPORT MODAL ── */}
      {showExport&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:400}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>EXPORT REPORT</div>
              <button onClick={()=>setShowExport(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            {[
              {label:'Format',      opts:['PDF Report','Excel Spreadsheet','CSV File']},
              {label:'Report Type', opts:['All Reports','Open Only','Resolved Only','High Priority']},
              {label:'Date Range',  opts:['Last 7 Days','Last 30 Days','All Time','Custom Range']},
            ].map(f=>(
              <div key={f.label} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>{f.label}</label>
                <select style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,outline:'none'}}>
                  {f.opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button onClick={()=>setShowExport(false)} style={{flex:1,padding:11,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{showToast('Report exported successfully');setShowExport(false);}}
                style={{flex:2,padding:11,background:RED,border:'none',borderRadius:7,color:'#fff',fontFamily:BEBAS,fontSize:20,letterSpacing:1,cursor:'pointer'}}>Export Now</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADVANCED FILTERS MODAL ── */}
      {showFilters&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:440}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>ADVANCED FILTERS</div>
              <button onClick={()=>setShowFilters(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            {[
              {label:'Report Type',      val:advType,    set:setAdvType,    opts:['All','Fake Profile / Impersonation','Inappropriate Content','Scam / Fraud','Harassment / Abuse','Others']},
              {label:'Priority',         val:advPriority,set:setAdvPriority,opts:['All','High','Medium','Low']},
              {label:'Status',           val:advStatus,  set:setAdvStatus,  opts:['All','pending','escalated','resolved','dismissed']},
              {label:'Reported Against', val:advAgainst, set:setAdvAgainst, opts:['All','user','agency','casting']},
              {label:'Date Range',       val:advDate,    set:setAdvDate,    opts:['Today','Last 7 Days','Last 30 Days','All Time']},
            ].map(f=>(
              <div key={f.label} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>{f.label}</label>
                <select value={f.val} onChange={e=>f.set(e.target.value)} style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,outline:'none'}}>
                  {f.opts.map(o=><option key={o} value={o}>{o==='pending'?'Open':o==='escalated'?'In Progress':o==='resolved'?'Resolved':o==='dismissed'?'Rejected/Dismissed':o}</option>)}
                </select>
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button onClick={()=>setShowFilters(false)} style={{flex:1,padding:11,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{
                setFilterType(advType==='All'?'All Report Types':advType);
                setFilterPriority(advPriority==='All'?'All Priority':advPriority);
                setFilterStatus(advStatus==='All'?'All Status':advStatus);
                if(advDate!=='Today') setTimeRange(advDate);
                setPage(1); setShowFilters(false); showToast('Filters applied');
              }}
                style={{flex:2,padding:11,background:RED,border:'none',borderRadius:7,color:'#fff',fontFamily:BEBAS,fontSize:20,letterSpacing:1,cursor:'pointer'}}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast&&(
        <div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',background:BG2,border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,padding:'12px 22px',fontSize:15,fontWeight:600,color:'#F5F5F5',zIndex:600,boxShadow:'0 4px 24px rgba(0,0,0,0.5)',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>
          <CheckSquare size={15} color={GREEN}/> {toast}
        </div>
      )}

      <style>{`select option { background: #121821; color: #F5F5F5; }`}</style>
    </div>
  );
}