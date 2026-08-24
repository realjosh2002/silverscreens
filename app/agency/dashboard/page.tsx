'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {

  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  BarChart2, Users, Bookmark, ChevronDown, ChevronLeft, Menu,
  TrendingUp, Calendar,
} from 'lucide-react';
import AgencyVerificationBanner from '@/components/layout/AgencyVerificationBanner';

const RED='#C8202A',GOLD='#D4A64A',BG='#050505',BG2='#0B0F14',BG3='#121821',BEBAS="'Bebas Neue', sans-serif",BARLOW="'Barlow Condensed', sans-serif";

function getIsApproved(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const ps = u?.profileStatus ?? 'pending';
    return ps === 'approved' || ps === 'active';
  } catch { return true; }
}

const NAV_PRIMARY = [
  { icon: LayoutDashboard, label: 'Dashboard',              active: true, href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',                  href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',                   href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',                        href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management',              href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',                  href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',                  href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',                        href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',               href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications',          href: '/agency/notifications' },
];

const FALLBACK_STATS = [
  { label: 'Active Castings',     value: 0, delta: '0 total',        iconBg: 'rgba(200,32,42,0.18)',  iconColor: RED       },
  { label: 'Total Applications',  value: 0, delta: '0 shortlisted',  iconBg: 'rgba(130,80,200,0.18)', iconColor: '#9B6BD4' },
  { label: 'Shortlisted',         value: 0, delta: '0 in review',    iconBg: 'rgba(212,166,74,0.18)', iconColor: GOLD      },
  { label: 'Auditions Scheduled', value: 0, delta: '0 upcoming',     iconBg: 'rgba(30,50,90,0.5)',    iconColor: '#4A90D4' },
  { label: 'Hired / Finalized',   value: 0, delta: '0 rejected',     iconBg: 'rgba(30,90,160,0.18)', iconColor: '#5BADEA' },
];

const CHART_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
// Chart series — populated dynamically from real application data
const CHART_SERIES_DEFAULT = [
  { name: 'Total Applications', color: RED,       data: [0,0,0,0,0,0,0] },
  { name: 'New Applications',   color: '#4A90D4', data: [0,0,0,0,0,0,0] },
  { name: 'Shortlisted',        color: GOLD,      data: [0,0,0,0,0,0,0] },
  { name: 'Selected',           color: '#4AD48A', data: [0,0,0,0,0,0,0] },
];

const FALLBACK_CASTINGS: any[] = [];
const FALLBACK_TOP_CASTINGS: any[] = [];

const FALLBACK_STATUS_DATA = [
  { label: 'In Review',          value: 0, pct: 0, color: '#4A90D4' },
  { label: 'Shortlisted',        value: 0, pct: 0, color: GOLD      },
  { label: 'Audition Scheduled', value: 0, pct: 0, color: '#9B59B6' },
  { label: 'Rejected',           value: 0, pct: 0, color: RED       },
  { label: 'Selected',           value: 0, pct: 0, color: '#4AD48A' },
];

const FALLBACK_ACTIVITY: any[] = [];

const DATE_RANGES   = ['Last 7 Days','Last 30 Days','Last 3 Months','This Year'];
const CHART_PERIODS = ['This Week','This Month','Last 30 Days','This Quarter'];

// ── Canonical status normaliser ──────────────────────────────────────────────
// The DB stores: 'applied', 'in_review', 'shortlisted', 'rejected',
//                'selected', 'audition_scheduled', 'on_hold'
// Always compare against the lowercase/underscore form.
function normaliseStatus(raw: string): string {
  return (raw ?? '').toLowerCase().trim().replace(/\s+/g, '_');
}
const IS_APPLIED    = (s:string) => ['applied','new'].includes(normaliseStatus(s));
const IS_IN_REVIEW  = (s:string) => ['in_review','applied','new'].includes(normaliseStatus(s));
const IS_SHORTLIST  = (s:string) => normaliseStatus(s) === 'shortlisted';
const IS_REJECTED   = (s:string) => normaliseStatus(s) === 'rejected';
const IS_SELECTED   = (s:string) => ['selected','hired','finalized','on_hold'].includes(normaliseStatus(s));
const IS_AUDITION   = (s:string) => normaliseStatus(s) === 'audition_scheduled';
// ─────────────────────────────────────────────────────────────────────────────

function getAuthHeaders(): Record<string,string> {
  try { const u = JSON.parse(localStorage.getItem('ss_user')||'{}'); return u.token ? { Authorization: `Bearer ${u.token}` } : {}; } catch { return {}; }
}

function BarChart({series}:{series:typeof CHART_SERIES_DEFAULT}) {
  const W=520,H=320,pl=44,pb=290,pr=W-10,pt=10,pw=pr-pl,ph=pb-pt;
  const maxVal=Math.max(...series.flatMap(s=>s.data),1);
  const maxY=Math.ceil(maxVal/10)*10||10;
  const yTicks=[Math.round(maxY*0.25),Math.round(maxY*0.5),Math.round(maxY*0.75),maxY];
  const groupWidth=pw/CHART_LABELS.length,barGap=2,barWidth=(groupWidth-barGap*(series.length+1))/series.length;
  const my=(v:number)=>pb-(v/maxY)*ph,groupX=(i:number)=>pl+i*groupWidth;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',overflow:'visible'}}>
      {yTicks.map(v=>(
        <g key={v}>
          <line x1={pl} y1={my(v)} x2={pr} y2={my(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="4 4"/>
          <text x={pl-6} y={my(v)+4} fill="rgba(255,255,255,0.28)" fontSize={10} textAnchor="end" fontFamily={BARLOW}>{v}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.08)" strokeWidth={1}/>
      {CHART_LABELS.map((l,i)=>(
        <text key={i} x={groupX(i)+groupWidth/2} y={pb+18} fill="rgba(255,255,255,0.32)" fontSize={10} textAnchor="middle" fontFamily={BARLOW}>{l}</text>
      ))}
      {CHART_LABELS.map((_,i)=>(
        <g key={i}>{series.map((s,si)=>{
          const v=s.data[i],x=groupX(i)+barGap+si*(barWidth+barGap),y=my(v),h=pb-y;
          return <rect key={s.name} x={x} y={y} width={barWidth} height={h} rx={2.5} fill={s.color} opacity={0.92}/>;
        })}</g>
      ))}
    </svg>
  );
}

function DonutChart({statusData}:{statusData:typeof FALLBACK_STATUS_DATA}) {
  const cx=80,cy=80,R=64,r=42,total=statusData.reduce((s,d)=>s+d.value,0);
  const toRad=(deg:number)=>(deg*Math.PI)/180;
  const pt=(ang:number,radius:number)=>[
    Math.round((cx+radius*Math.cos(toRad(ang)))*1e6)/1e6,
    Math.round((cy+radius*Math.sin(toRad(ang)))*1e6)/1e6,
  ];
  const nonZero=statusData.filter(s=>s.value>0);
  let startAngle=-90;
  const arcs=nonZero.map(seg=>{
    const sweep=Math.min((seg.value/total)*360,359.99),end=startAngle+sweep,large=sweep>180?1:0;
    const [x1,y1]=pt(startAngle,R),[x2,y2]=pt(end,R),[x3,y3]=pt(end,r),[x4,y4]=pt(startAngle,r);
    const d=`M ${x1.toFixed(4)} ${y1.toFixed(4)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(4)} ${y2.toFixed(4)} L ${x3.toFixed(4)} ${y3.toFixed(4)} A ${r} ${r} 0 ${large} 0 ${x4.toFixed(4)} ${y4.toFixed(4)} Z`;
    startAngle=end; return {...seg,d};
  });
  return (
    <svg viewBox="0 0 160 160" style={{width:160,height:160,flexShrink:0}}>
      {total===0
        ? <circle cx={cx} cy={cy} r={(R+r)/2} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={R-r}/>
        : arcs.map(a=><path key={a.label} d={a.d} fill={a.color}/>)
      }
      <text x={cx} y={cy-6}  textAnchor="middle" fill="#F5F5F5" fontSize={22} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total.toLocaleString('en-IN')}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize={11} fontFamily={BARLOW}>Total</text>
    </svg>
  );
}

export default function AgencyDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    try { const u=JSON.parse(localStorage.getItem('ss_user')||'{}'); if(!u?.loggedIn){window.location.replace('/login');return;} } catch { window.location.replace('/login');return; }
    const onPopState=()=>{ try{const u=JSON.parse(localStorage.getItem('ss_user')||'{}');if(!u?.loggedIn)window.location.replace('/login');}catch{window.location.replace('/login');} };
    window.addEventListener('popstate',onPopState); return ()=>window.removeEventListener('popstate',onPopState);
  }, []);

  const handleLogout=()=>{ localStorage.removeItem('ss_user'); window.location.replace('/login'); };

  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [isApproved, setIsApproved]=useState(true);
  const [profileOpen,setProfileOpen]=useState(false);
  const [dateRangeOpen,setDateRangeOpen]=useState(false);
  const [dateRange,setDateRange]=useState(DATE_RANGES[0]);
  const [chartPeriodOpen,setChartPeriodOpen]=useState(false);
  const [chartPeriod,setChartPeriod]=useState(CHART_PERIODS[0]);

  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('AGE·········');
  const [agencyType,     setAgencyType]     = useState('Production House');
  const [msgCount,       setMsgCount]       = useState(0);
  const [notifCount,     setNotifCount]     = useState(0);
  const [stats,          setStats]          = useState(FALLBACK_STATS);
  const [castings,       setCastings]       = useState(FALLBACK_CASTINGS);
  const [topCastings,    setTopCastings]    = useState(FALLBACK_TOP_CASTINGS);
  const [statusData,     setStatusData]     = useState(FALLBACK_STATUS_DATA);
  const [activity,       setActivity]       = useState(FALLBACK_ACTIVITY);
  const [chartSeries,    setChartSeries]    = useState(CHART_SERIES_DEFAULT);

  useEffect(() => {
    try {
      const u=JSON.parse(localStorage.getItem('ss_user')||'{}');
      if(u.name){setAgencyName(u.name);setAgencyInitials(u.name.split(' ').map((w:string)=>w[0]).slice(0,2).join('').toUpperCase());}
      if(u.profileNumber) setAgencyId(u.profileNumber);
    } catch {}
  }, []);

  useEffect(() => {
    const h=getAuthHeaders();

    // Agency profile — name, type, ID only
    fetch('/api/profile/agency',{headers:h}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return;
      const p=data.data?.profile??data.profile??data;
      if(p.company_name||p.companyName||p.name){
        const name=p.company_name??p.companyName??p.name;
        setAgencyName(name);
        setAgencyInitials(name.split(' ').map((w:string)=>w[0]).slice(0,2).join('').toUpperCase());
      }
      if(p.profile_number??p.profileNumber) setAgencyId(p.profile_number??p.profileNumber);
      if(p.company_type??p.companyType)     setAgencyType(p.company_type??p.companyType);
    }).catch(()=>{});

    // ── Applications — single source of truth for all counts ─────────────────
    fetch('/api/applications?limit=1000',{headers:h}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return;
      const list: any[] = data.applications ?? data.data?.applications ?? [];
      if(!Array.isArray(list)) return;

      const total            = list.length;
      const shortlisted      = list.filter((a:any) => IS_SHORTLIST(a.status)).length;
      const inReview         = list.filter((a:any) => IS_IN_REVIEW(a.status)).length;
      const rejected         = list.filter((a:any) => IS_REJECTED(a.status)).length;
      const selected         = list.filter((a:any) => IS_SELECTED(a.status)).length;
      const auditionScheduled= list.filter((a:any) => IS_AUDITION(a.status)).length;

      setStats(prev=>prev.map((s,i)=>{
        if(i===1) return {...s, value:total,             delta:`${shortlisted} shortlisted`};
        if(i===2) return {...s, value:shortlisted,       delta:`${inReview} in review`};
        if(i===3) return {...s, value:auditionScheduled, delta:`${auditionScheduled} upcoming`};
        if(i===4) return {...s, value:selected,          delta:`${rejected} rejected`};
        return s;
      }));

      // Donut — same source
      const statusGroups=[
        {label:'In Review',          value:inReview,           pct:0, color:'#4A90D4'},
        {label:'Shortlisted',        value:shortlisted,        pct:0, color:GOLD},
        {label:'Audition Scheduled', value:auditionScheduled,  pct:0, color:'#9B59B6'},
        {label:'Rejected',           value:rejected,           pct:0, color:RED},
        {label:'Selected',           value:selected,           pct:0, color:'#4AD48A'},
      ];
      const totalItems=statusGroups.reduce((s,d)=>s+d.value,0);
      setStatusData(
        totalItems>0
          ? statusGroups.map(d=>({...d,pct:Math.round((d.value/totalItems)*100)}))
          : FALLBACK_STATUS_DATA
      );

      // Recent activity — sort newest first
      const recentApps = [...list]
        .sort((a:any,b:any)=>new Date(b.applied_at??b.appliedAt??0).getTime()-new Date(a.applied_at??a.appliedAt??0).getTime())
        .slice(0,5);

      setActivity(recentApps.map((a:any)=>{
        const firstName  = a.aspirant_profiles?.first_name ?? '';
        const lastName   = a.aspirant_profiles?.last_name  ?? '';
        const name       = (firstName+' '+lastName).trim() || a.aspirantName || 'An applicant';
        const casting    = a.casting_calls?.title ?? a.castingCallTitle ?? 'a casting';
        const status     = normaliseStatus(a.status ?? 'applied');
        const time       = a.applied_at ? new Date(a.applied_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '';

        const isShortlisted = status === 'shortlisted';
        const isSelected    = IS_SELECTED(status);
        const isAudition    = IS_AUDITION(status);

        const Icon      = isSelected ? UserSearch : isAudition ? CalendarCheck : isShortlisted ? Star : ClipboardList;
        const iconBg    = isSelected ? 'rgba(74,212,138,0.15)' : isAudition ? 'rgba(155,91,182,0.15)' : isShortlisted ? 'rgba(212,166,74,0.15)' : 'rgba(74,144,212,0.15)';
        const iconColor = isSelected ? '#4AD48A'  : isAudition ? '#9B59B6' : isShortlisted ? GOLD : '#4A90D4';
        const text      = isSelected  ? `${name} was selected for`
                        : isAudition  ? `Audition scheduled for ${name} —`
                        : isShortlisted ? `${name} was shortlisted for`
                        : `New application received from ${name} for`;

        return { Icon, iconBg, iconColor, text, bold: casting, time };
      }));

      // Top castings — group by casting_call_id
      const byCall:Record<string,{title:string,count:number,shortlisted:number,selected:number,img:string}> = {};
      list.forEach((a:any)=>{
        const id    = a.casting_call_id ?? a.castingCallId;
        const title = a.casting_calls?.title ?? 'Unknown';
        const img   = a.casting_calls?.cover_image ?? '';
        if(!id) return;
        if(!byCall[id]) byCall[id]={title,count:0,shortlisted:0,selected:0,img};
        byCall[id].count++;
        if(IS_SHORTLIST(a.status))  byCall[id].shortlisted++;
        if(IS_SELECTED(a.status))   byCall[id].selected++;
      });
      const sortedCalls=Object.entries(byCall).sort((a,b)=>b[1].count-a[1].count).slice(0,3);
      if(sortedCalls.length>0){
        setTopCastings(sortedCalls.map(([,c],idx)=>({
          rank:  idx+1,
          title: c.title,
          meta:  `${c.count} Applications • ${c.shortlisted} Shortlisted • ${c.selected} Selected`,
          rate:  Math.round(((c.shortlisted+c.selected)/Math.max(c.count,1))*100),
          img:   c.img,
        })));
      }

      // ── Build bar chart series from daily data (last 7 days) ──
      const today = new Date();
      const days: string[] = [];
      for(let i=6;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);days.push(d.toISOString().slice(0,10));}
      const totals    = new Array(7).fill(0);
      const newApps   = new Array(7).fill(0);
      const slData    = new Array(7).fill(0);
      const selData   = new Array(7).fill(0);
      list.forEach((a:any)=>{
        const dateStr=(a.applied_at??a.appliedAt??'').slice(0,10);
        const idx=days.indexOf(dateStr);
        if(idx===-1) return;
        totals[idx]++;
        const st=normaliseStatus(a.status??'applied');
        if(['applied','new'].includes(st))              newApps[idx]++;
        if(st==='shortlisted')                          slData[idx]++;
        if(IS_SELECTED(a.status))                       selData[idx]++;
      });
      setChartSeries([
        {name:'Total Applications', color:RED,       data:totals},
        {name:'New Applications',   color:'#4A90D4', data:newApps},
        {name:'Shortlisted',        color:GOLD,      data:slData},
        {name:'Selected',           color:'#4AD48A', data:selData},
      ]);
    }).catch(()=>{});

    // Casting calls — active count + recent list
    fetch('/api/casting-calls?limit=100',{headers:h}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return;
      const list=data.data?.casting_calls??data.data?.castingCalls??data.castingCalls??data.casting_calls??(Array.isArray(data)?data:[]);
      if(!Array.isArray(list)) return;
      const active=list.filter((c:any)=>normaliseStatus(c.status)==='active');
      setStats(prev=>prev.map((s,i)=>i===0?{...s,value:active.length,delta:`${list.length} total`}:s));
      if(list.length>0){
        setCastings(list.slice(0,5).map((c:any)=>({
          title:      c.title??c.name??'',
          type:       c.project_type??c.projectType??c.type??'',
          location:   c.location??c.city??'',
          apps:       c.applications_count??c.applicationCount??0,
          department: c.department??'',
          role:       c.role_name??c.role??'',
          img:        c.cover_image??c.coverImage??c.img??'',
        })));
      }
    }).catch(()=>{});

    fetch('/api/notifications',{headers:h}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return; const list=data.data?.notifications??data.notifications??data;
      if(Array.isArray(list)) setNotifCount(list.filter((n:any)=>!n.is_read).length);
    }).catch(()=>{});

    fetch('/api/messages/conversations',{headers:h}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return; const list=data.conversations??data;
      if(Array.isArray(list)) setMsgCount(list.filter((c:any)=>c.unreadCount>0||c.unread_count>0).length);
    }).catch(()=>{});
  }, []);

  const navItems=NAV_PRIMARY.map(item=>{
    if(item.label==='Messages')      return {...item,badge:msgCount||undefined};
    if(item.label==='Notifications') return {...item,badge:notifCount||undefined};
    return item;
  });

  const SB_W=sidebarOpen?230:52;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:BG,fontFamily:BARLOW,color:'#F5F5F5'}}>
      <header style={{display:'flex',alignItems:'center',gap:14,flexShrink:0,padding:'0 24px',height:60,background:BG2,borderBottom:'1px solid rgba(255,255,255,0.06)',zIndex:100}}>
        <SilverScreensLogo size="md" href="/" showTagline={false}/>
        <div style={{flex:1}}/>
        <button onClick={() => { if (!getIsApproved()) return; router.push('/agency/create-casting'); }} title={!getIsApproved() ? 'Available after agency verification' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 7, background: getIsApproved() ? RED : 'rgba(200,32,42,0.3)', color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: getIsApproved() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap', opacity: getIsApproved() ? 1 : 0.5 }}>
        Post a Casting <span style={{ fontSize: 16, fontWeight: 400 }}>+</span>
      </button>
        <div onClick={()=>router.push('/agency/messages')} style={{position:'relative',cursor:'pointer'}}>
          <div style={{width:36,height:36,borderRadius:8,background:'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center'}}><MessageSquare size={15} color="rgba(255,255,255,0.7)"/></div>
          {msgCount>0&&<div style={{position:'absolute',top:-5,right:-5,background:RED,borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff',pointerEvents:'none'}}>{msgCount}</div>}
        </div>
        <div onClick={()=>router.push('/agency/notifications')} style={{position:'relative',cursor:'pointer'}}>
          <div style={{width:36,height:36,borderRadius:8,background:'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center'}}><Bell size={15} color="rgba(255,255,255,0.7)"/></div>
          {notifCount>0&&<div style={{position:'absolute',top:-5,right:-5,background:RED,borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff',pointerEvents:'none'}}>{notifCount}</div>}
        </div>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:9,cursor:'pointer'}} onClick={()=>setProfileOpen(v=>!v)}>
            <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#1a1410,#2a1e0e)',border:`2px solid ${GOLD}60`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,color:GOLD,fontFamily:BEBAS}}>{agencyInitials}</div>
            <div><div style={{fontSize:15,fontWeight:700,lineHeight:1.2}}>{agencyName}</div><div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{agencyType}</div></div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)"/>
          </div>
          {profileOpen&&(<>
            <div onClick={()=>setProfileOpen(false)} style={{position:'fixed',inset:0,zIndex:150}}/>
            <div style={{position:'absolute',top:46,right:0,width:220,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,overflow:'hidden',zIndex:200,boxShadow:'0 8px 32px rgba(0,0,0,0.6)'}}>
              <div style={{padding:'10px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>Agency ID</span>
                <span style={{fontSize:14,fontWeight:700,color:GOLD}}>{agencyId}</span>
              </div>
              {(()=>{
                const isApproved=(()=>{try{const u=JSON.parse(localStorage.getItem('ss_user')||'{}');const ps=u?.profileStatus??'pending';return ps==='approved'||ps==='active';}catch{return true;}})();
                const menuItems=isApproved
                  ?[{label:'Reports & Analytics',href:'/agency/reports'},{label:'Subscription & Billing',href:'/agency/subscription'},{label:'Company Profile',href:'/agency-profile'},{label:'Documents',href:'/agency/documents'},{label:'Calendar',href:'/agency/calendar'},{label:'Settings',href:'/agency/settings'},{label:'Support',href:'/agency/support'},{label:'Logout',href:'/login'}]
                  :[{label:'Company Profile',href:'/create-company-profile'},{label:'Logout',href:'/login'}];
                return menuItems.map(({label,href})=>(
                  <div key={label} onClick={()=>{if(label==='Logout'){handleLogout();}else{router.push(href);setProfileOpen(false);}}} style={{padding:'10px 16px',fontSize:15,cursor:'pointer',color:label==='Logout'?'#ff6b6b':'#F5F5F5',borderTop:label==='Logout'?'1px solid rgba(255,255,255,0.07)':'none'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>{label}</div>
                ));
              })()}
            </div>
          </>)}
        </div>
      </header>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        <aside style={{width:SB_W,flexShrink:0,background:BG2,borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',overflowY:'auto',overflowX:'hidden',scrollbarWidth:'none',transition:'width 0.2s ease'}}>
          <div style={{height:52,display:'flex',alignItems:'center',justifyContent:sidebarOpen?'flex-end':'center',padding:sidebarOpen?'0 12px':0,borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
            <button onClick={()=>setSidebarOpen(v=>!v)} style={{background:'none',border:'none',cursor:'pointer',width:30,height:30,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.07)')} onMouseLeave={e=>(e.currentTarget.style.background='none')}>{sidebarOpen?<ChevronLeft size={16}/>:<Menu size={16}/>}</button>
          </div>
          {sidebarOpen&&(
            <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:38,height:38,borderRadius:9,background:'linear-gradient(135deg,#1a1410,#2a1e0e)',border:`1px solid ${GOLD}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,color:GOLD,fontFamily:BEBAS,flexShrink:0}}>{agencyInitials}</div>
              <div style={{minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:'#F5F5F5',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{agencyName}</div><div onClick={()=>router.push('/agency-profile')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View Company Profile</div></div>
            </div>
          )}
          <nav style={{flex:1,padding:sidebarOpen?'8px 6px':'8px 4px',overflowY:'auto',scrollbarWidth:'none'}}>
            {navItems.map(({icon:Icon,label,active,badge,href})=>(
              <div key={label} onClick={()=>href&&router.push(href)} title={!sidebarOpen?label:undefined}
                style={{display:'flex',alignItems:'center',justifyContent:sidebarOpen?'space-between':'center',padding:sidebarOpen?'8px 10px':'10px 0',marginBottom:2,borderRadius:6,cursor:'pointer',background:active?'rgba(200,32,42,0.12)':'transparent',borderLeft:sidebarOpen&&active?`3px solid ${RED}`:sidebarOpen?'3px solid transparent':'none',position:'relative'}}
                onMouseEnter={e=>{if(!active)(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)';}}
                onMouseLeave={e=>{if(!active)(e.currentTarget as HTMLDivElement).style.background=active?'rgba(200,32,42,0.12)':'transparent';}}
              >
                <div style={{display:'flex',alignItems:'center',gap:sidebarOpen?9:0,justifyContent:'center'}}>
                  <Icon size={15} color={active?RED:'rgba(255,255,255,0.42)'} strokeWidth={active?2.5:1.8}/>
                  {sidebarOpen&&<span style={{fontSize:15,fontWeight:active?600:400,color:active?'#F5F5F5':'rgba(255,255,255,0.6)',whiteSpace:'nowrap'}}>{label}</span>}
                </div>
                {sidebarOpen&&badge!=null&&(badge as number)>0&&<div style={{background:RED,color:'#fff',borderRadius:10,fontSize:14,fontWeight:700,padding:'1px 6px',minWidth:18,textAlign:'center'}}>{badge}</div>}
                {!sidebarOpen&&badge!=null&&(badge as number)>0&&<div style={{position:'absolute',top:6,right:4,background:RED,borderRadius:'50%',width:14,height:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:'#fff'}}>{badge}</div>}
              </div>
            ))}
          </nav>
          {sidebarOpen&&(
            <div style={{margin:'8px 10px 14px',borderRadius:12,background:'linear-gradient(135deg,#1a1205,#2a1e0a)',border:'1px solid rgba(212,166,74,0.25)',padding:'14px 12px',textAlign:'center',flexShrink:0}}>
              <div style={{fontSize:20,marginBottom:4}}>👑</div>
              <div style={{fontSize:15,fontWeight:700,color:GOLD,marginBottom:3}}>Upgrade to Pro</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,0.45)',marginBottom:10,lineHeight:1.5}}>Unlock advanced filters and AI matching.</div>
              <button onClick={()=>router.push('/pricing')} style={{width:'100%',background:GOLD,color:'#000',border:'none',borderRadius:8,padding:'7px 0',fontSize:14,fontWeight:700,fontFamily:BARLOW,cursor:'pointer'}}>Upgrade Now</button>
            </div>
          )}
        </aside>

        <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'20px 20px 32px',display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <h1 style={{fontFamily:BEBAS,fontSize:32,letterSpacing:1,marginBottom:4,fontWeight:400}}>Welcome back, {agencyName}! 👋</h1>
              <p style={{fontSize:15,color:'rgba(255,255,255,0.45)'}}>Here's what's happening with your castings and applications.</p>
            </div>
            <div style={{position:'relative',flexShrink:0}}>
              <div onClick={()=>setDateRangeOpen(v=>!v)} style={{display:'flex',alignItems:'center',gap:8,background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'7px 12px',fontSize:14,color:'rgba(255,255,255,0.6)',cursor:'pointer'}}>
                <span>{dateRange}</span><Calendar size={13} color="rgba(255,255,255,0.4)"/>
              </div>
              {dateRangeOpen&&(<>
                <div onClick={()=>setDateRangeOpen(false)} style={{position:'fixed',inset:0,zIndex:50}}/>
                <div style={{position:'absolute',top:42,right:0,width:230,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,overflow:'hidden',zIndex:100,boxShadow:'0 8px 32px rgba(0,0,0,0.6)'}}>
                  {DATE_RANGES.map(range=>(<div key={range} onClick={()=>{setDateRange(range);setDateRangeOpen(false);}} style={{padding:'10px 14px',fontSize:14,cursor:'pointer',color:range===dateRange?GOLD:'#F5F5F5',fontWeight:range===dateRange?700:400}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>{range}</div>))}
                </div>
              </>)}
            </div>
          </div>


          {/* Verification banner */}
          <AgencyVerificationBanner />
          {/* ── Stats row ── */}
          <div style={{display:'flex',gap:10}}>
            {stats.map((s,i)=>(
              <div key={i} style={{flex:1,borderRadius:12,padding:'14px 16px',background:BG2,border:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:8}}>
                <div style={{width:36,height:36,borderRadius:8,background:s.iconBg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {i===0&&<Users size={16} color={s.iconColor}/>}
                  {i===1&&<ClipboardList size={16} color={s.iconColor}/>}
                  {i===2&&<Star size={16} color={s.iconColor}/>}
                  {i===3&&<CalendarCheck size={16} color={s.iconColor}/>}
                  {i===4&&<UserSearch size={16} color={s.iconColor}/>}
                </div>
                <div style={{fontSize:28,fontWeight:800,fontFamily:BEBAS,letterSpacing:1,lineHeight:1,color:'#F5F5F5'}}>{s.value}</div>
                <div style={{fontSize:16,fontWeight:600,color:'rgba(255,255,255,0.8)'}}>{s.label}</div>
                <div style={{display:'flex',alignItems:'center',gap:4}}><TrendingUp size={11} color="#4AD48A"/><span style={{fontSize:14,color:'#4AD48A',fontWeight:600}}>{s.delta}</span></div>
              </div>
            ))}
          </div>

          {/* ── Chart + Recent Castings ── */}
          <div style={{display:'flex',gap:14,alignItems:'stretch'}}>
            <div style={{flex:3,minWidth:0,borderRadius:14,background:BG2,border:'1px solid rgba(255,255,255,0.06)',padding:'18px 20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <span style={{fontSize:18,fontWeight:700}}>Applications Overview</span>
                <div style={{position:'relative'}}>
                  <div onClick={()=>setChartPeriodOpen(v=>!v)} style={{display:'flex',alignItems:'center',gap:5,background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,padding:'5px 10px',cursor:'pointer'}}>
                    <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{chartPeriod}</span><ChevronDown size={11} color="rgba(255,255,255,0.4)"/>
                  </div>
                  {chartPeriodOpen&&(<>
                    <div onClick={()=>setChartPeriodOpen(false)} style={{position:'fixed',inset:0,zIndex:50}}/>
                    <div style={{position:'absolute',top:34,right:0,width:170,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,overflow:'hidden',zIndex:100,boxShadow:'0 8px 32px rgba(0,0,0,0.6)'}}>
                      {CHART_PERIODS.map(period=>(<div key={period} onClick={()=>{setChartPeriod(period);setChartPeriodOpen(false);}} style={{padding:'9px 14px',fontSize:14,cursor:'pointer',color:period===chartPeriod?GOLD:'#F5F5F5',fontWeight:period===chartPeriod?700:400}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>{period}</div>))}
                    </div>
                  </>)}
                </div>
              </div>
              <div style={{width:'100%',height:320}}><BarChart series={chartSeries}/></div>
              <div style={{display:'flex',gap:18,marginTop:10,flexWrap:'wrap'}}>
                {chartSeries.map(s=>(<div key={s.name} style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:11,height:11,borderRadius:3,background:s.color}}/><span style={{fontSize:14,color:'rgba(255,255,255,0.5)'}}>{s.name}</span></div>))}
              </div>
            </div>

            <div style={{flex:2,minWidth:0,borderRadius:14,background:BG2,border:'1px solid rgba(255,255,255,0.06)',padding:'18px 20px',display:'flex',flexDirection:'column'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <span style={{fontSize:18,fontWeight:700}}>Recent Casting Calls</span>
                <span onClick={()=>router.push('/agency/casting-calls')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View All</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8,flex:1}}>
                {castings.length===0
                  ? <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.25)',fontSize:15}}>No casting calls yet</div>
                  : castings.map((c:any,i:number)=>(
                  <div key={i} onClick={()=>router.push('/agency/casting-calls')} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,background:BG3,border:'1px solid rgba(255,255,255,0.05)',cursor:'pointer'}} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)'} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=BG3}>
                    {c.img ? <img src={c.img} alt="" style={{width:44,height:44,borderRadius:6,objectFit:'cover',flexShrink:0}}/> : <div style={{width:44,height:44,borderRadius:6,background:'rgba(255,255,255,0.06)',flexShrink:0}}/>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:15,fontWeight:600,marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.title}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{c.type}{c.location?` • ${c.location}`:''}</div>
                      <div style={{display:'flex',gap:6,marginTop:4}}>
                        {c.department&&<span style={{fontSize:13,padding:'2px 8px',borderRadius:20,background:'rgba(200,32,42,0.1)',border:'1px solid rgba(200,32,42,0.25)',color:'#e05560'}}>{c.department}</span>}
                        {c.role&&<span style={{fontSize:13,padding:'2px 8px',borderRadius:20,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)'}}>{c.role}</span>}
                      </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0}}>
                      <div style={{fontSize:15,fontWeight:700}}>{typeof c.apps==='number'?c.apps.toLocaleString('en-IN'):c.apps}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.35)'}}>Applications</div>
                      <div style={{background:'rgba(74,212,138,0.15)',color:'#4AD48A',border:'1px solid rgba(74,212,138,0.25)',borderRadius:4,padding:'1px 7px',fontSize:14,fontWeight:600}}>Active</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:'center',marginTop:12,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                <span onClick={()=>router.push('/agency/casting-calls')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View All Casting Calls →</span>
              </div>
            </div>
          </div>

          {/* ── Bottom row ── */}
          <div style={{display:'flex',gap:14,alignItems:'stretch'}}>
            <div style={{flex:1,minWidth:0,borderRadius:14,background:BG2,border:'1px solid rgba(255,255,255,0.06)',padding:'18px 20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:18,fontWeight:700}}>Top Performing Castings</span>
                <span onClick={()=>router.push('/agency/reports')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View Report</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {topCastings.length===0
                  ? <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:80,color:'rgba(255,255,255,0.25)',fontSize:15}}>No data yet</div>
                  : topCastings.map((c:any,i:number)=>(
                  <div key={i} onClick={()=>router.push('/agency/casting-calls')} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,background:BG3,border:'1px solid rgba(255,255,255,0.05)',cursor:'pointer'}} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)'} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=BG3}>
                    <span style={{fontSize:15,fontWeight:700,color:'rgba(255,255,255,0.35)',width:16,flexShrink:0}}>{c.rank}</span>
                    {c.img ? <img src={c.img} alt="" style={{width:40,height:40,borderRadius:6,objectFit:'cover',flexShrink:0}}/> : <div style={{width:40,height:40,borderRadius:6,background:'rgba(255,255,255,0.06)',flexShrink:0}}/>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:15,fontWeight:600,marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.title}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:6}}>{c.meta}</div>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{flex:1,height:4,borderRadius:2,background:'rgba(255,255,255,0.08)',overflow:'hidden'}}>
                          <div style={{height:'100%',borderRadius:2,background:'linear-gradient(90deg,#4AD48A,#2fb870)',width:`${c.rate}%`}}/>
                        </div>
                        <span style={{fontSize:14,fontWeight:700,color:'#4AD48A',flexShrink:0}}>{c.rate}%</span>
                      </div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.3)',marginTop:2}}>Response Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{flex:1,minWidth:0,borderRadius:14,background:BG2,border:'1px solid rgba(255,255,255,0.06)',padding:'18px 20px',display:'flex',flexDirection:'column'}}>
              <div style={{fontSize:18,fontWeight:700,marginBottom:14}}>Applications by Status</div>
              <div style={{display:'flex',gap:14,alignItems:'center',flex:1}}>
                <DonutChart statusData={statusData}/>
                <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
                  {statusData.map(s=>(
                    <div key={s.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:6}}>
                      <div style={{display:'flex',alignItems:'center',gap:7}}><div style={{width:8,height:8,borderRadius:'50%',background:s.color,flexShrink:0}}/><span style={{fontSize:14,color:'rgba(255,255,255,0.65)'}}>{s.label}</span></div>
                      <div style={{display:'flex',alignItems:'center',gap:5}}><span style={{fontSize:14,fontWeight:700}}>{s.value}</span><span style={{fontSize:14,color:'rgba(255,255,255,0.35)'}}>({s.pct}%)</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{textAlign:'center',marginTop:12,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                <span onClick={()=>router.push('/agency/reports')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View Full Report →</span>
              </div>
            </div>

            <div style={{flex:1,minWidth:0,borderRadius:14,background:BG2,border:'1px solid rgba(255,255,255,0.06)',padding:'18px 20px',display:'flex',flexDirection:'column'}}>
              <div style={{fontSize:18,fontWeight:700,marginBottom:14}}>Recent Activity</div>
              <div style={{display:'flex',flexDirection:'column',gap:10,flex:1}}>
                {activity.length===0
                  ? <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.25)',fontSize:15}}>No recent activity</div>
                  : activity.map(({Icon,iconBg,iconColor,text,bold,time}:any,i:number)=>(
                  <div key={i} onClick={()=>router.push('/agency/notifications')} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 12px',borderRadius:10,background:BG3,border:'1px solid rgba(255,255,255,0.05)',cursor:'pointer'}} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)'} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=BG3}>
                    <div style={{width:32,height:32,borderRadius:8,flexShrink:0,background:iconBg,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={14} color={iconColor}/></div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.55)',lineHeight:1.5}}>{text} <span style={{color:'#F5F5F5',fontWeight:600}}>{bold}</span></div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.3)',marginTop:3}}>{time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:'center',marginTop:12,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                <span onClick={()=>router.push('/agency/notifications')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View All Activity →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}