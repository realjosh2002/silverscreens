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

const RED='#C8202A',GOLD='#D4A64A',BG='#050505',BG2='#0B0F14',BG3='#121821',BEBAS="'Bebas Neue', sans-serif",BARLOW="'Barlow Condensed', sans-serif";

const NAV_PRIMARY = [
  { icon: LayoutDashboard, label: 'Dashboard',              active: true, href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',                  href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',                   href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',                        href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management',              href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',                  href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',                  href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',                        href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',               badge: 12,    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications',          badge: 3,     href: '/agency/notifications' },
];

const FALLBACK_STATS = [
  { label: 'Active Castings',     value: 18,      delta: '+2 vs last week',   iconBg: 'rgba(200,32,42,0.18)',  iconColor: RED       },
  { label: 'Total Applications',  value: '1,248', delta: '+18% vs last week', iconBg: 'rgba(130,80,200,0.18)', iconColor: '#9B6BD4' },
  { label: 'Shortlisted',         value: 96,      delta: '+12% vs last week', iconBg: 'rgba(212,166,74,0.18)', iconColor: GOLD      },
  { label: 'Auditions Scheduled', value: 32,      delta: '+6 vs last week',   iconBg: 'rgba(30,50,90,0.5)',    iconColor: '#4A90D4' },
  { label: 'Hired / Finalized',   value: 8,       delta: '+3 vs last week',   iconBg: 'rgba(30,90,160,0.18)', iconColor: '#5BADEA' },
];

const CHART_LABELS = ['20 May','21 May','22 May','23 May','24 May','25 May','26 May'];
const CHART_SERIES = [
  { name: 'Total Applications', color: RED,       data: [200,300,290,315,280,300,325] },
  { name: 'New Applications',   color: '#4A90D4', data: [120,205,215,205,220,225,252] },
  { name: 'Shortlisted',        color: GOLD,      data: [80,140,148,155,140,155,175] },
  { name: 'Selected',           color: '#4AD48A', data: [20,60,62,65,58,68,95] },
];

const FALLBACK_CASTINGS = [
  { title: 'City of Dreams – Lead Hero',            type: 'Feature Film', location: 'Mumbai',  apps: 128, department: 'Acting',  role: 'Hero',             img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=80&h=80&fit=crop' },
  { title: 'The Silent Witness – Supporting Actor', type: 'Web Series',   location: 'Delhi',   apps: 96,  department: 'Acting',  role: 'Supporting Roles', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=80&h=80&fit=crop' },
  { title: 'Love in Rewind – Female Lead',          type: 'Music Video',  location: 'Mumbai',  apps: 64,  department: 'Dancing', role: 'Dancer',           img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=80&h=80&fit=crop' },
  { title: 'Rangbaaz: Dobara – Antagonist',         type: 'Web Series',   location: 'Mumbai',  apps: 54,  department: 'Acting',  role: 'Villain',          img: 'https://images.unsplash.com/photo-1598387993441-a364f854cfbd?w=80&h=80&fit=crop' },
  { title: 'Untitled Horror – Supporting Role',     type: 'Feature Film', location: 'Kolkata', apps: 45,  department: 'Acting',  role: 'Character Artist', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=80&h=80&fit=crop' },
];

const FALLBACK_TOP_CASTINGS = [
  { rank: 1, title: 'City of Dreams – Lead Hero',            meta: '128 Applications • 24 Shortlisted', rate: 85, img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=80&h=80&fit=crop' },
  { rank: 2, title: 'The Silent Witness – Supporting Actor', meta: '96 Applications • 18 Shortlisted',  rate: 72, img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=80&h=80&fit=crop' },
  { rank: 3, title: 'Love in Rewind – Female Lead',          meta: '64 Applications • 12 Shortlisted',  rate: 68, img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=80&h=80&fit=crop' },
];

const FALLBACK_STATUS_DATA = [
  { label: 'In Review',          value: 652, pct: 52, color: '#4A90D4' },
  { label: 'Shortlisted',        value: 296, pct: 24, color: GOLD      },
  { label: 'Audition Scheduled', value: 162, pct: 13, color: '#9B59B6' },
  { label: 'Rejected',           value: 96,  pct: 8,  color: RED       },
  { label: 'Selected',           value: 42,  pct: 3,  color: '#4AD48A' },
];

const FALLBACK_ACTIVITY = [
  { iconBg: 'rgba(74,144,212,0.15)', iconColor: '#4A90D4', Icon: ClipboardList, text: 'New application received for',       bold: 'City of Dreams – Lead Hero',            time: '10 min ago' },
  { iconBg: 'rgba(212,166,74,0.15)', iconColor: GOLD,      Icon: Star,          text: 'Meera Iyer was shortlisted for',    bold: 'The Silent Witness – Supporting Actor', time: '1 hr ago'   },
  { iconBg: 'rgba(200,32,42,0.15)',  iconColor: RED,       Icon: CalendarCheck, text: 'Audition scheduled with 6 for',     bold: 'Rangbaaz: Dobara – Antagonist',        time: '3 hrs ago'  },
  { iconBg: 'rgba(74,212,138,0.15)', iconColor: '#4AD48A', Icon: UserSearch,    text: 'Karan Malhotra marked as Selected for', bold: 'Love in Rewind – Male Lead',       time: '5 hrs ago'  },
];

const DATE_RANGES   = ['20 May 2024 – 26 May 2024','13 May 2024 – 19 May 2024','06 May 2024 – 12 May 2024','Last 30 Days'];
const CHART_PERIODS = ['This Week','This Month','Last 30 Days','This Quarter'];

function getAuthHeaders(): Record<string,string> {
  try { const u = JSON.parse(localStorage.getItem('ss_user')||'{}'); return u.token ? { Authorization: `Bearer ${u.token}` } : {}; } catch { return {}; }
}

function BarChart() {
  const W=520,H=320,pl=44,pb=290,pr=W-10,pt=10,pw=pr-pl,ph=pb-pt,maxY=400;
  const groupWidth=pw/CHART_LABELS.length,barGap=2,barWidth=(groupWidth-barGap*(CHART_SERIES.length+1))/CHART_SERIES.length;
  const my=(v:number)=>pb-(v/maxY)*ph,groupX=(i:number)=>pl+i*groupWidth;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',overflow:'visible'}}>
      {[100,200,300,400].map(v=>(
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
        <g key={i}>{CHART_SERIES.map((s,si)=>{
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
  let startAngle=-90;
  const arcs=statusData.map(seg=>{
    const sweep=(seg.value/total)*360,end=startAngle+sweep,large=sweep>180?1:0;
    const [x1,y1]=pt(startAngle,R),[x2,y2]=pt(end,R),[x3,y3]=pt(end,r),[x4,y4]=pt(startAngle,r);
    const d=`M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    startAngle=end; return {...seg,d};
  });
  return (
    <svg viewBox="0 0 160 160" style={{width:160,height:160,flexShrink:0}}>
      {arcs.map(a=><path key={a.label} d={a.d} fill={a.color}/>)}
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
  const [profileOpen,setProfileOpen]=useState(false);
  const [dateRangeOpen,setDateRangeOpen]=useState(false);
  const [dateRange,setDateRange]=useState(DATE_RANGES[0]);
  const [chartPeriodOpen,setChartPeriodOpen]=useState(false);
  const [chartPeriod,setChartPeriod]=useState(CHART_PERIODS[0]);

  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('AGE·········');
  const [agencyType,     setAgencyType]     = useState('Production House');
  const [msgCount,       setMsgCount]       = useState(12);
  const [notifCount,     setNotifCount]     = useState(3);
  const [stats,          setStats]          = useState(FALLBACK_STATS);
  const [castings,       setCastings]       = useState(FALLBACK_CASTINGS);
  const [topCastings,    setTopCastings]    = useState(FALLBACK_TOP_CASTINGS);
  const [statusData,     setStatusData]     = useState(FALLBACK_STATUS_DATA);
  const [activity,       setActivity]       = useState(FALLBACK_ACTIVITY);

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

    // Active casting calls count
    fetch('/api/casting-calls?limit=100',{headers:h}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return;
      const list=data.data?.casting_calls??data.data?.castingCalls??data.castingCalls??data.casting_calls??(Array.isArray(data)?data:[]);
      if(!Array.isArray(list)) return;
      const active=list.filter((c:any)=>c.status==='active'||c.status==='Active');
      setStats(prev=>prev.map((s,i)=>i===0?{...s,value:active.length,delta:`${list.length} total`}:s));
      if(list.length>0){
        setCastings(list.slice(0,5).map((c:any,idx:number)=>({
          title:      c.title??c.name??'',
          type:       c.project_type??c.projectType??c.type??'',
          location:   c.location??c.city??'',
          apps:       c.applications_count??c.applicationCount??c.totalApplications??c.apps??0,
          department: c.department??'',
          role:       c.role_name??c.role??'',
          img:        c.cover_image??c.coverImage??c.img??FALLBACK_CASTINGS[idx%FALLBACK_CASTINGS.length].img,
        })));
        const sorted=[...list].sort((a:any,b:any)=>(b.applications_count??b.applicationCount??0)-(a.applications_count??a.applicationCount??0)).slice(0,3);
        setTopCastings(sorted.map((c:any,idx:number)=>({
          rank:idx+1,
          title:c.title??c.name??'',
          meta:`${c.applications_count??c.applicationCount??0} Applications • ${c.shortlisted_count??c.shortlistedCount??0} Shortlisted`,
          rate:c.response_rate??c.responseRate??Math.round(((c.shortlisted_count??c.shortlistedCount??0)/Math.max(c.applications_count??c.applicationCount??1,1))*100),
          img:c.cover_image??c.coverImage??c.img??FALLBACK_CASTINGS[idx%FALLBACK_CASTINGS.length].img,
        })));
      }
    }).catch(()=>{});

    // Applications stats — fetch all and compute counts
    fetch('/api/applications?limit=1000',{headers:h}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return;
      const total=data.data?.pagination?.total??data.pagination?.total??0;
      const list=data.data?.applications??data.applications??[];
      if(!Array.isArray(list)) return;

      const shortlisted=list.filter((a:any)=>a.status==='shortlisted'||a.status==='Shortlisted').length;
      const inReview=list.filter((a:any)=>a.status==='in_review'||a.status==='In Review').length;
      const rejected=list.filter((a:any)=>a.status==='rejected'||a.status==='Rejected').length;
      const selected=list.filter((a:any)=>a.status==='selected'||a.status==='Selected').length;

      const displayTotal=total>0?total:list.length;
      setStats(prev=>prev.map((s,i)=>{
        if(i===1) return {...s,value:displayTotal>0?Number(displayTotal).toLocaleString('en-IN'):s.value,delta:'+18% vs last week'};
        if(i===2) return {...s,value:shortlisted>0?shortlisted:s.value,delta:`${inReview} in review`};
        if(i===4) return {...s,value:selected>0?selected:s.value,delta:`${rejected} rejected`};
        return s;
      }));

      // Status donut data
      if(list.length>0){
        const statusGroups=[
          {label:'In Review',          value:inReview,    pct:0, color:'#4A90D4'},
          {label:'Shortlisted',        value:shortlisted, pct:0, color:GOLD},
          {label:'Audition Scheduled', value:0,           pct:0, color:'#9B59B6'},
          {label:'Rejected',           value:rejected,    pct:0, color:RED},
          {label:'Selected',           value:selected,    pct:0, color:'#4AD48A'},
        ];
        const totalItems=statusGroups.reduce((s,d)=>s+d.value,0);
        if(totalItems>0){
          setStatusData(statusGroups.map(d=>({...d,pct:Math.round((d.value/totalItems)*100)})));
        }
      }
    }).catch(()=>{});

    // Auditions count
    fetch('/api/auditions?limit=1000',{headers:h}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return;
      const total=data.data?.pagination?.total??data.pagination?.total??0;
      const list=data.data?.auditions??data.auditions??[];
      const count=total>0?total:(Array.isArray(list)?list.length:0);
      if(count>0) setStats(prev=>prev.map((s,i)=>i===3?{...s,value:count,delta:`${list.filter((a:any)=>a.status==='scheduled').length} upcoming`}:s));
    }).catch(()=>{});

    fetch('/api/notifications',{headers:h}).then(r=>r.ok?r.json():null).then(data=>{
      if(!data) return; const list=data.data?.notifications??data.notifications??data;
      if(Array.isArray(list)) setNotifCount(list.filter((n:any)=>!n.is_read&&!n.read&&!n.isRead).length);
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
        <button onClick={()=>router.push('/agency/create-casting')} style={{display:'flex',alignItems:'center',gap:7,background:RED,color:'#fff',border:'none',borderRadius:8,padding:'0 18px',height:36,fontSize:15,fontWeight:700,fontFamily:BARLOW,cursor:'pointer',whiteSpace:'nowrap'}}>Post a Casting <span style={{fontSize:16,fontWeight:400}}>+</span></button>
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
              {[{label:'Reports & Analytics',href:'/agency/reports'},{label:'Subscription & Billing',href:'/agency/subscription'},{label:'Company Profile',href:'/agency-profile'},{label:'Documents',href:'/agency/documents'},{label:'Calendar',href:'/agency/calendar'},{label:'Settings',href:'/agency/settings'},{label:'Support',href:'/contact'},{label:'Logout',href:'/login'}].map(({label,href})=>(
                <div key={label} onClick={()=>{if(label==='Logout'){handleLogout();}else{router.push(href);setProfileOpen(false);}}} style={{padding:'10px 16px',fontSize:15,cursor:'pointer',color:label==='Logout'?'#ff6b6b':'#F5F5F5',borderTop:label==='Logout'?'1px solid rgba(255,255,255,0.07)':'none'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>{label}</div>
              ))}
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
                onMouseEnter={e=>{if(!active)e.currentTarget.style.background='rgba(255,255,255,0.04)';}}
                onMouseLeave={e=>{if(!active)e.currentTarget.style.background=active?'rgba(200,32,42,0.12)':'transparent';}}
              >
                <div style={{display:'flex',alignItems:'center',gap:sidebarOpen?9:0,justifyContent:'center'}}>
                  <Icon size={15} color={active?RED:'rgba(255,255,255,0.42)'} strokeWidth={active?2.5:1.8}/>
                  {sidebarOpen&&<span style={{fontSize:15,fontWeight:active?600:400,color:active?'#F5F5F5':'rgba(255,255,255,0.6)',whiteSpace:'nowrap'}}>{label}</span>}
                </div>
                {sidebarOpen&&badge!=null&&badge>0&&<div style={{background:RED,color:'#fff',borderRadius:10,fontSize:14,fontWeight:700,padding:'1px 6px',minWidth:18,textAlign:'center'}}>{badge}</div>}
                {!sidebarOpen&&badge!=null&&badge>0&&<div style={{position:'absolute',top:6,right:4,background:RED,borderRadius:'50%',width:14,height:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:700,color:'#fff'}}>{badge}</div>}
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

          <div style={{display:'flex',gap:10}}>
            {stats.map((s,i)=>(
              <div key={i} style={{flex:1,borderRadius:12,padding:'14px 16px',background:BG2,border:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:8}}>
                <div style={{width:36,height:36,borderRadius:8,background:s.iconBg,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {i===0&&<Users size={16} color={s.iconColor}/>}{i===1&&<ClipboardList size={16} color={s.iconColor}/>}{i===2&&<Star size={16} color={s.iconColor}/>}{i===3&&<CalendarCheck size={16} color={s.iconColor}/>}{i===4&&<UserSearch size={16} color={s.iconColor}/>}
                </div>
                <div style={{fontSize:28,fontWeight:800,fontFamily:BEBAS,letterSpacing:1,lineHeight:1,color:'#F5F5F5'}}>{s.value}</div>
                <div style={{fontSize:16,fontWeight:600,color:'rgba(255,255,255,0.8)'}}>{s.label}</div>
                <div style={{display:'flex',alignItems:'center',gap:4}}><TrendingUp size={11} color="#4AD48A"/><span style={{fontSize:14,color:'#4AD48A',fontWeight:600}}>{s.delta}</span></div>
              </div>
            ))}
          </div>

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
              <div style={{width:'100%',height:320}}><BarChart/></div>
              <div style={{display:'flex',gap:18,marginTop:10,flexWrap:'wrap'}}>
                {CHART_SERIES.map(s=>(<div key={s.name} style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:11,height:11,borderRadius:3,background:s.color}}/><span style={{fontSize:14,color:'rgba(255,255,255,0.5)'}}>{s.name}</span></div>))}
              </div>
            </div>

            <div style={{flex:2,minWidth:0,borderRadius:14,background:BG2,border:'1px solid rgba(255,255,255,0.06)',padding:'18px 20px',display:'flex',flexDirection:'column'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <span style={{fontSize:18,fontWeight:700}}>Recent Casting Calls</span>
                <span onClick={()=>router.push('/agency/casting-calls')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View All</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8,flex:1}}>
                {castings.map((c,i)=>(
                  <div key={i} onClick={()=>router.push('/agency/casting-calls')} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,background:BG3,border:'1px solid rgba(255,255,255,0.05)',cursor:'pointer'}} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)'} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=BG3}>
                    <img src={c.img} alt="" style={{width:44,height:44,borderRadius:6,objectFit:'cover',flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:15,fontWeight:600,marginBottom:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.title}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{c.type} • {c.location}</div>
                      <div style={{display:'flex',gap:6,marginTop:4}}>
                        <span style={{fontSize:13,padding:'2px 8px',borderRadius:20,background:'rgba(200,32,42,0.1)',border:'1px solid rgba(200,32,42,0.25)',color:'#e05560'}}>{c.department}</span>
                        <span style={{fontSize:13,padding:'2px 8px',borderRadius:20,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)'}}>{c.role}</span>
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

          <div style={{display:'flex',gap:14,alignItems:'stretch'}}>
            <div style={{flex:1,minWidth:0,borderRadius:14,background:BG2,border:'1px solid rgba(255,255,255,0.06)',padding:'18px 20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <span style={{fontSize:18,fontWeight:700}}>Top Performing Castings</span>
                <span onClick={()=>router.push('/agency/reports')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View Report</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {topCastings.map((c,i)=>(
                  <div key={i} onClick={()=>router.push('/agency/casting-calls')} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,background:BG3,border:'1px solid rgba(255,255,255,0.05)',cursor:'pointer'}} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)'} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background=BG3}>
                    <span style={{fontSize:15,fontWeight:700,color:'rgba(255,255,255,0.35)',width:16,flexShrink:0}}>{c.rank}</span>
                    <img src={c.img} alt="" style={{width:40,height:40,borderRadius:6,objectFit:'cover',flexShrink:0}}/>
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
                {activity.map(({Icon,iconBg,iconColor,text,bold,time},i)=>(
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