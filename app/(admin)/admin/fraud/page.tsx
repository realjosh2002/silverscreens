'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';

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

/* ─── Sidebar nav ────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'            },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'  },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'  },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'         },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'              },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud', active: true  },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'        },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'       },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                  },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'        },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'            },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'              },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'             },
];

const PROFILE_MENU = [
  { label: 'My Profile',               href: '/admin/profile'       },
  { label: 'Account Settings',         href: '/admin/settings'      },
  { label: 'Security Settings',        href: '/admin/settings'      },
  { label: 'Notification Preferences', href: '/admin/notifications' },
  { label: 'Activity Logs',            href: '/admin/audit'         },
  { label: 'Help & Support',           href: '/contact'             },
  { label: 'Logout',                   href: '/login'               },
];

/* ─── Stat cards ─────────────────────────────────────────────── */
const STATS = [
  { label: 'Total Flags',    value: '1,248', delta: '+18.6%', sub: 'from last 7 days', color: RED,    Icon: Flag         },
  { label: 'High Risk',      value: '230',   delta: '+12.4%', sub: 'from last 7 days', color: ORANGE, Icon: AlertTriangle },
  { label: 'Under Review',   value: '312',   delta: '+8.7%',  sub: 'from last 7 days', color: GOLD,   Icon: Clock        },
  { label: 'Resolved',       value: '706',   delta: '+22.3%', sub: 'from last 7 days', color: GREEN,  Icon: ShieldCheck  },
  { label: 'False Positive', value: '124',   delta: '+5.1%',  sub: 'from last 7 days', color: PURPLE, Icon: XCircle      },
];

/* ─── Chart ──────────────────────────────────────────────────── */
const CHART_LABELS = ['May 15','May 16','May 17','May 18','May 19','May 20','May 21'];
const CHART_DATA   = [220, 280, 240, 340, 210, 290, 200];

/* ─── Category donut ─────────────────────────────────────────── */
const CAT_DATA = [
  { label: 'Fake Agencies',       value: 446, pct: 35.7, color: BLUE   },
  { label: 'Scam Castings',       value: 302, pct: 24.2, color: PURPLE },
  { label: 'Suspicious Payments', value: 222, pct: 17.8, color: GOLD   },
  { label: 'Fake Profiles',       value: 164, pct: 13.1, color: ORANGE },
  { label: 'Spam Activity',       value: 114, pct: 9.2,  color: GREEN  },
];

/* ─── Risk donut ─────────────────────────────────────────────── */
const RISK_DATA = [
  { label: 'High Risk',   value: 230, pct: 18.4, color: RED    },
  { label: 'Medium Risk', value: 312, pct: 25.0, color: ORANGE },
  { label: 'Low Risk',    value: 706, pct: 56.6, color: GREEN  },
];

/* ─── Top risky entities ──────────────────────────────────────── */
const TOP_ENTITIES = [
  { name: 'Dream Casting Agency', uid: 'AGY12567',   risk: 'High Risk',   riskColor: RED,    type: 'agency'  },
  { name: 'Lead Role in Web Series', uid: 'CAST78945', risk: 'High Risk', riskColor: RED,    type: 'casting' },
  { name: 'Silverline Talent Hub', uid: 'AGY11234',  risk: 'Medium Risk', riskColor: ORANGE, type: 'agency'  },
  { name: 'Actor Zone',           uid: 'USR223344',  risk: 'Medium Risk', riskColor: ORANGE, type: 'user'    },
  { name: 'Premium Auditions',    uid: 'CAST56789',  risk: 'Low Risk',    riskColor: GREEN,  type: 'casting' },
];

/* ─── Insights ───────────────────────────────────────────────── */
const INSIGHTS = [
  { icon: TrendingUp, iconBg: 'rgba(239,68,68,0.15)',   iconColor: RED,    title: '32% increase in scam castings',   sub: 'Compared to last 7 days'  },
  { icon: Building2,  iconBg: 'rgba(249,115,22,0.15)', iconColor: ORANGE, title: '5 fake agencies blocked',          sub: 'In the last 24 hours'      },
  { icon: ShieldCheck,iconBg: 'rgba(34,197,94,0.15)',  iconColor: GREEN,  title: '92% fraud detection accuracy',     sub: 'Based on AI analysis'      },
];

/* ─── Fraud alerts table ──────────────────────────────────────── */
const FRAUD_ALERTS = [
  { id:'FRD-250521-1248', type:'Fake Agency',         typeColor:BLUE,   typeIcon:'building', entity:'Dream Casting Agency',    entityUid:'AGY12567',    details:'Multiple fake projects, invalid documents and negative user reports', risk:'High',   status:'Under Review',  date:'May 21, 2025', time:'11:32 AM', img:'photo-1494790108377-be9c29b29330' },
  { id:'FRD-250521-1247', type:'Scam Casting',        typeColor:PURPLE, typeIcon:'casting',  entity:'Lead Role in Web Series', entityUid:'CAST78945',   details:'Advance payment requested from applicants',                          risk:'High',   status:'Under Review',  date:'May 21, 2025', time:'10:48 AM', img:'photo-1472099645785-5658abf4ff4e' },
  { id:'FRD-250521-1246', type:'Suspicious Payment',  typeColor:GOLD,   typeIcon:'payment',  entity:'User: Rohit Verma',       entityUid:'ASP052500001', details:'Multiple failed payments and refund manipulation attempt',           risk:'Medium', status:'Investigating', date:'May 21, 2025', time:'09:15 AM', img:'photo-1507003211169-0a1dd7228f2d' },
  { id:'FRD-250521-1245', type:'Fake Profile',        typeColor:ORANGE, typeIcon:'user',     entity:'Neha Iyer',               entityUid:'ASP052500002', details:'Stolen images detected, identity mismatch',                         risk:'Medium', status:'Under Review',  date:'May 20, 2025', time:'08:22 PM', img:'photo-1529626455594-4ff0802cfb7e' },
  { id:'FRD-250521-1244', type:'Spam Activity',       typeColor:GREEN,  typeIcon:'spam',     entity:'User: Arjun Malhotra',    entityUid:'ASP052500003', details:'Bulk messaging and spamming multiple users',                        risk:'Low',    status:'New',           date:'May 20, 2025', time:'05:30 PM', img:'photo-1500648767791-00dcc994a43e' },
  { id:'FRD-250521-1243', type:'Fake Agency',         typeColor:BLUE,   typeIcon:'building', entity:'StarCast Productions',    entityUid:'AGY33210',    details:'Registered with fake GST number and forged documents',              risk:'High',   status:'Blocked',       date:'May 20, 2025', time:'02:10 PM', img:'photo-1463453091185-61582044d556' },
  { id:'FRD-250521-1242', type:'Scam Casting',        typeColor:PURPLE, typeIcon:'casting',  entity:'Model Shoot Exclusive',   entityUid:'CAST99102',   details:'No payment after selection, ghost agency behavior',                 risk:'Medium', status:'Resolved',      date:'May 19, 2025', time:'11:45 AM', img:'photo-1438761681033-6461ffad8d80' },
  { id:'FRD-250521-1241', type:'Suspicious Payment',  typeColor:GOLD,   typeIcon:'payment',  entity:'User: Karan Mehta',       entityUid:'ASP052500004', details:'Chargeback fraud on subscription payment',                         risk:'High',   status:'Under Review',  date:'May 19, 2025', time:'09:00 AM', img:'photo-1573496359142-b8d87734a5a2' },
  { id:'FRD-250521-1240', type:'Fake Profile',        typeColor:ORANGE, typeIcon:'user',     entity:'Pooja Sharma',            entityUid:'ASP052500005', details:'AI-generated profile images detected',                             risk:'Low',    status:'Resolved',      date:'May 19, 2025', time:'07:30 AM', img:'photo-1472099645785-5658abf4ff4e' },
  { id:'FRD-250521-1239', type:'Spam Activity',       typeColor:GREEN,  typeIcon:'spam',     entity:'User: Vikram Nair',       entityUid:'ASP052500006', details:'Mass casting application submission in 2 minutes',                  risk:'Medium', status:'New',           date:'May 18, 2025', time:'04:15 PM', img:'photo-1463453091185-61582044d556' },
];

const RISK_COLOR:   Record<string,string> = { High: RED,    Medium: ORANGE, Low: GREEN  };
const RISK_BG:      Record<string,string> = { High: 'rgba(239,68,68,0.12)', Medium: 'rgba(249,115,22,0.12)', Low: 'rgba(34,197,94,0.12)' };
const STATUS_COLOR: Record<string,string> = { 'Under Review': GOLD, Investigating: BLUE, New: PURPLE, Blocked: RED, Resolved: GREEN };
const STATUS_BG:    Record<string,string> = { 'Under Review': 'rgba(212,166,74,0.12)', Investigating: 'rgba(59,130,246,0.12)', New: 'rgba(139,92,246,0.12)', Blocked: 'rgba(239,68,68,0.12)', Resolved: 'rgba(34,197,94,0.12)' };

const RISK_TABS = ['All','High Risk','Medium Risk','Low Risk'];
const PER_PAGE  = 5;

/* ─── SVG Line Chart ─────────────────────────────────────────── */
function FraudTrendChart({ period }: { period: string }) {
  const W=420,H=220,pl=44,pb=188,pr=W-10,pt=14;
  const pw=pr-pl,ph=pb-pt,maxY=400;
  const gridY=[0,100,200,300,400];
  const mult = period==='Last 30 Days'?1.8:period==='Last 90 Days'?2.4:1;
  const data = CHART_DATA.map(v=>Math.round(v*mult));
  const mx=(i:number)=>pl+(i/(CHART_LABELS.length-1))*pw;
  const my=(v:number)=>pb-(v/maxY)*ph;
  function smooth(pts:[number,number][]):string{
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
  const area=`${path} L ${pts[pts.length-1][0]} ${pb} L ${pts[0][0]} ${pb} Z`;
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RED} stopOpacity={0.22}/>
          <stop offset="100%" stopColor={RED} stopOpacity={0.01}/>
        </linearGradient>
      </defs>
      {gridY.map(v=>(
        <g key={v}>
          <line x1={pl} y1={my(v)} x2={pr} y2={my(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3"/>
          <text x={pl-6} y={my(v)+4} fill="rgba(255,255,255,0.28)" fontSize={12} textAnchor="end" fontFamily={BARLOW}>{v===0?'0':v}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1}/>
      {CHART_LABELS.map((l,i)=><text key={i} x={mx(i)} y={pb+18} fill="rgba(255,255,255,0.3)" fontSize={12} textAnchor="middle" fontFamily={BARLOW}>{l}</text>)}
      <path d={area} fill="url(#fg)"/>
      <path d={path} fill="none" stroke={RED} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={4} fill={RED} stroke={BG3} strokeWidth={2}/>)}
    </svg>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────── */
function DonutChart({data,total,label,size=160}:{data:{label:string;pct:number;color:string}[];total:string;label:string;size?:number}){
  const cx=size/2,cy=size/2,R=size*0.44,r=size*0.29;
  const toRad=(d:number)=>(d*Math.PI)/180;
  const pt=(a:number,rad:number)=>[cx+rad*Math.cos(toRad(a)),cy+rad*Math.sin(toRad(a))];
  let start=-90;
  const sum=data.reduce((s,d)=>s+d.pct,0);
  const arcs=data.map(seg=>{
    const sweep=(seg.pct/sum)*360,end=start+sweep,large=sweep>180?1:0;
    const[x1,y1]=pt(start,R);const[x2,y2]=pt(end,R);
    const[x3,y3]=pt(end,r);const[x4,y4]=pt(start,r);
    const d=`M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    start=end+1.5;
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

/* ─── Type icon ──────────────────────────────────────────────── */
function TypeIcon({type,color}:{type:string;color:string}){
  const Icon = type==='building'?Building:type==='casting'?Megaphone:type==='payment'?PayIcon:type==='spam'?Zap:User;
  return(
    <div style={{width:28,height:28,borderRadius:6,background:`${color}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <Icon size={13} color={color}/>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function FraudDetectionPage(){
  const router=useRouter();
  const[sidebarOpen,setSidebarOpen]=useState(false);
  const[profileOpen,setProfileOpen]=useState(false);
  const[chartPeriod,setChartPeriod]=useState('Last 7 Days');
  const[riskTab,setRiskTab]=useState('All');
  const[search,setSearch]=useState('');
  const[selected,setSelected]=useState<string[]>([]);
  const[page,setPage]=useState(1);
  const[menuId,setMenuId]=useState('');
  const[menuPos,setMenuPos]=useState({top:0,right:0});
  const[viewAlert,setViewAlert]=useState<typeof FRAUD_ALERTS[0]|null>(null);
  const[showBulk,setShowBulk]=useState(false);
  const[showExport,setShowExport]=useState(false);
  const[showFilters,setShowFilters]=useState(false);
  const[toast,setToast]=useState('');

  const SB_W=sidebarOpen?220:52;
  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(''),2800);};

  /* filter */
  const filtered=FRAUD_ALERTS.filter(a=>{
    const q=search.toLowerCase();
    const ms=!q||a.id.toLowerCase().includes(q)||a.entity.toLowerCase().includes(q)||a.type.toLowerCase().includes(q)||a.entityUid.toLowerCase().includes(q);
    const mr=riskTab==='All'||(riskTab==='High Risk'&&a.risk==='High')||(riskTab==='Medium Risk'&&a.risk==='Medium')||(riskTab==='Low Risk'&&a.risk==='Low');
    return ms&&mr;
  });
  const totalPages=Math.max(1,Math.ceil(filtered.length/PER_PAGE));
  const paged=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const allSel=paged.length>0&&paged.every(a=>selected.includes(a.id));
  const toggleSel=(id:string)=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=()=>setSelected(allSel?selected.filter(id=>!paged.find(a=>a.id===id)):[...new Set([...selected,...paged.map(a=>a.id)])]);
  const handleBulk=(action:string)=>{showToast(`${action} applied to ${selected.length} item(s)`);setSelected([]);setShowBulk(false);};

  /* nav to profile */
  const goProfile=(uid:string)=>{
    if(uid.startsWith('ASP')||uid.startsWith('USR')||uid.startsWith('AGY')||uid.startsWith('CAST'))
      router.push(`/agency/applications/${uid}`);
  };

  return(
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:BG,fontFamily:BARLOW,color:'#F5F5F5'}}>

      {/* ══ TOPNAV ══ */}
      <header style={{display:'flex',alignItems:'center',gap:14,flexShrink:0,padding:'0 24px',height:60,background:BG2,borderBottom:'1px solid rgba(255,255,255,0.06)',zIndex:100}}>
        <SilverScreensLogo size="md" href="/" showTagline={false}/>
        <div style={{padding:'3px 10px',background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:5}}>
          <span style={{fontFamily:BARLOW,fontSize:14,fontWeight:700,color:RED,letterSpacing:1}}>ADMIN PANEL</span>
        </div>
        <div style={{flex:1,maxWidth:440,position:'relative'}}>
          <Search size={14} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}/>
          <input placeholder="Search users, agencies, castings, applications…"
            style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'8px 40px 8px 34px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',boxSizing:'border-box'}}/>
          <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',fontSize:14,color:'rgba(255,255,255,0.25)',background:BG4,borderRadius:4,padding:'1px 6px',border:'1px solid rgba(255,255,255,0.1)'}}>⌘K</span>
        </div>
        <div style={{flex:1}}/>
        <div onClick={()=>router.push('/admin/notifications')} style={{position:'relative',cursor:'pointer'}}>
          <div style={{width:36,height:36,borderRadius:8,background:'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Bell size={15} color="rgba(255,255,255,0.7)"/>
          </div>
          <div style={{position:'absolute',top:-5,right:-5,background:RED,borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff'}}>12</div>
        </div>
        <div onClick={()=>router.push('/admin/support')} style={{cursor:'pointer'}}>
          <div style={{width:36,height:36,borderRadius:8,background:'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Info size={15} color="rgba(255,255,255,0.7)"/>
          </div>
        </div>
        <div style={{position:'relative'}}>
          <div style={{display:'flex',alignItems:'center',gap:9,cursor:'pointer'}} onClick={()=>setProfileOpen(v=>!v)}>
            <div style={{width:36,height:36,borderRadius:'50%',overflow:'hidden',border:'2px solid rgba(212,166,74,0.38)',flexShrink:0}}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="Admin" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </div>
            <div><div style={{fontSize:15,fontWeight:700,lineHeight:1.2}}>Super Admin</div></div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)"/>
          </div>
          {profileOpen&&(
            <>
              <div onClick={()=>setProfileOpen(false)} style={{position:'fixed',inset:0,zIndex:150}}/>
              <div style={{position:'absolute',top:46,right:0,width:210,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,overflow:'hidden',zIndex:200,boxShadow:'0 8px 32px rgba(0,0,0,0.6)'}}>
                <div style={{padding:'10px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',justifyContent:'space-between'}}>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>Admin ID</span>
                  <span style={{fontSize:14,fontWeight:700,color:RED}}>ADM000001</span>
                </div>
                {PROFILE_MENU.map(({label,href})=>(
                  <div key={label} onClick={()=>{router.push(href);setProfileOpen(false);}}
                    style={{padding:'10px 16px',fontSize:15,cursor:'pointer',color:label==='Logout'?'#ff6b6b':'#F5F5F5',borderTop:label==='Logout'?'1px solid rgba(255,255,255,0.07)':'none'}}
                    onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                    onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                  >{label}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* ── SIDEBAR ── */}
        <aside style={{width:SB_W,flexShrink:0,background:BG2,borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',overflowY:'auto',overflowX:'hidden',transition:'width 0.2s ease',scrollbarWidth:'none'}}>
          <div style={{height:52,display:'flex',alignItems:'center',justifyContent:sidebarOpen?'flex-end':'center',padding:sidebarOpen?'0 12px':0,borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
            <button onClick={()=>setSidebarOpen(v=>!v)} style={{background:'none',border:'none',cursor:'pointer',width:30,height:30,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)'}}
              onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.07)')}
              onMouseLeave={e=>(e.currentTarget.style.background='none')}
            >{sidebarOpen?<ChevronLeft size={16}/>:<Menu size={16}/>}</button>
          </div>
          {sidebarOpen&&(
            <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:38,height:38,borderRadius:9,overflow:'hidden',border:'1px solid rgba(212,166,74,0.25)',flexShrink:0}}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
              </div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:15,fontWeight:700,color:'#F5F5F5',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Super Admin</div>
                <div style={{fontSize:14,color:RED,fontWeight:600}}>ADM000001</div>
              </div>
            </div>
          )}
          <nav style={{flex:1,padding:sidebarOpen?'8px 6px':'8px 4px',overflowY:'auto',scrollbarWidth:'none'}}>
            {NAV_ITEMS.map(({icon:Icon,label,href,active})=>(
              <div key={label} onClick={()=>router.push(href)} title={!sidebarOpen?label:undefined}
                style={{display:'flex',alignItems:'center',justifyContent:sidebarOpen?'flex-start':'center',padding:sidebarOpen?'8px 10px':'10px 0',marginBottom:2,borderRadius:6,cursor:'pointer',background:active?'rgba(239,68,68,0.12)':'transparent',border:active&&sidebarOpen?'1px solid rgba(239,68,68,0.25)':'1px solid transparent',borderLeft:sidebarOpen&&active?`3px solid ${RED}`:sidebarOpen?'3px solid transparent':'none',gap:sidebarOpen?9:0}}
                onMouseEnter={e=>{if(!active)e.currentTarget.style.background='rgba(255,255,255,0.04)';}}
                onMouseLeave={e=>{if(!active)e.currentTarget.style.background=active?'rgba(239,68,68,0.12)':'transparent';}}
              >
                <Icon size={15} color={active?RED:'rgba(255,255,255,0.42)'} strokeWidth={active?2.5:1.8}/>
                {sidebarOpen&&<span style={{fontSize:15,color:active?'#F5F5F5':'rgba(255,255,255,0.6)',fontWeight:active?700:400,whiteSpace:'nowrap',flex:1}}>{label}</span>}
                {sidebarOpen&&active&&<ChevronRight size={12} color={RED} opacity={0.7}/>}
              </div>
            ))}
          </nav>
          {sidebarOpen&&(
            <div onClick={()=>router.push('/login')} style={{padding:'14px 16px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:9,cursor:'pointer',color:'rgba(255,255,255,0.45)',fontSize:15}}
              onMouseEnter={e=>(e.currentTarget.style.color='#ff6b6b')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.45)')}
            ><ChevronRight size={14} style={{transform:'rotate(180deg)'}}/>Logout</div>
          )}
        </aside>

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
              </h1>
              <p style={{fontSize:15,color:'rgba(255,255,255,0.45)',margin:'4px 0 0'}}>Identify, analyze and take action on suspicious activities across the platform.</p>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center',marginTop:28,flexShrink:0}}>
              <button onClick={()=>setShowFilters(true)} style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>
                <Filter size={13}/> Filters
              </button>
              <div style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'rgba(255,255,255,0.6)',fontSize:15,cursor:'pointer'}}>
                📅 May 15 – May 21, 2025
              </div>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
            {STATS.map((s,i)=>(
              <div key={i} style={{borderRadius:12,padding:'16px',background:BG3,border:'1px solid rgba(255,255,255,0.06)',display:'flex',gap:14,alignItems:'center'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:`${s.color}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <s.Icon size={20} color={s.color}/>
                </div>
                <div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:3}}>{s.label}</div>
                  <div style={{fontFamily:BEBAS,fontSize:30,letterSpacing:1,lineHeight:1}}>{s.value}</div>
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
              <div style={{width:'100%',height:210}}><FraudTrendChart period={chartPeriod}/></div>
            </div>

            {/* Fraud Categories Distribution */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Fraud Categories Distribution</div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                <DonutChart data={CAT_DATA} total="1,248" label="Total Flags" size={148}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7}}>
                  {CAT_DATA.map(d=>(
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
                <DonutChart data={RISK_DATA} total="1,248" label="Total Flags" size={148}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:8}}>
                  {RISK_DATA.map(d=>(
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
                            <div key={a} onClick={()=>{if(selected.length===0){showToast('Select at least one item');setShowBulk(false);}else handleBulk(a);}}
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
                    const count=tab==='All'?FRAUD_ALERTS.length:tab==='High Risk'?FRAUD_ALERTS.filter(a=>a.risk==='High').length:tab==='Medium Risk'?FRAUD_ALERTS.filter(a=>a.risk==='Medium').length:FRAUD_ALERTS.filter(a=>a.risk==='Low').length;
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
              {paged.length===0?(
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
                      <div style={{fontSize: 14}}>{a.date}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{a.time}</div>
                    </div>
                    {/* Status */}
                    <div>
                      <span style={{fontSize:14,fontWeight:700,padding:'3px 8px',borderRadius:5,background:STATUS_BG[a.status]||'rgba(255,255,255,0.08)',color:STATUS_COLOR[a.status]||'#F5F5F5',border:`1px solid ${STATUS_COLOR[a.status]||'rgba(255,255,255,0.2)'}33`,whiteSpace:'nowrap' as const}}>{a.status}</span>
                    </div>
                    {/* Actions */}
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      <button onClick={()=>setViewAlert(a)} title="View"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Eye size={12} color={BLUE}/>
                      </button>
                      <button onClick={()=>showToast(`${a.id} flagged`)} title="Flag"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(249,115,22,0.12)',border:'1px solid rgba(249,115,22,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Flag size={12} color={ORANGE}/>
                      </button>
                      <button onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setMenuPos({top:r.bottom+4,right:window.innerWidth-r.right});setMenuId(menuId===a.id?'':a.id);}}
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
                  Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)} to {Math.min(page*PER_PAGE,filtered.length)} of {filtered.length} entries
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
                  {TOP_ENTITIES.map((e,i)=>(
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
              {label:'View Details',         color:'#F5F5F5', action:()=>{const a=FRAUD_ALERTS.find(x=>x.id===menuId);if(a)setViewAlert(a);setMenuId('');}},
              {label:'Mark as Safe',         color:GREEN,     action:()=>{showToast('Marked as safe');setMenuId('');}},
              {label:'Block Entity',         color:RED,       action:()=>{showToast('Entity blocked');setMenuId('');}},
              {label:'Escalate to Reports',  color:ORANGE,    action:()=>{router.push('/admin/reports');setMenuId('');}},
              {label:'View Entity Profile',  color:BLUE,      action:()=>{const a=FRAUD_ALERTS.find(x=>x.id===menuId);if(a)goProfile(a.entityUid);setMenuId('');}},
              {label:'Download Evidence',    color:PURPLE,    action:()=>{showToast('Evidence downloaded');setMenuId('');}},
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
                {label:'Detected On',  value:`${viewAlert.date} at ${viewAlert.time}`},
              ].map(({label,value})=>(
                <div key={label} style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:8,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{label}</span>
                  <span style={{fontSize:15,color:'#F5F5F5',fontWeight:500}}>{value}</span>
                </div>
              ))}
              {/* Actions */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:4}}>
                <button onClick={()=>{showToast('Marked as safe');setViewAlert(null);}}
                  style={{padding:'10px',background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:8,color:GREEN,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Check size={14}/> Mark Safe
                </button>
                <button onClick={()=>{showToast('Entity blocked');setViewAlert(null);}}
                  style={{padding:'10px',background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,color:RED,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Lock size={14}/> Block
                </button>
                <button onClick={()=>{router.push('/admin/reports');setViewAlert(null);}}
                  style={{padding:'10px',background:'rgba(249,115,22,0.12)',border:'1px solid rgba(249,115,22,0.25)',borderRadius:8,color:ORANGE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <AlertTriangle size={14}/> Escalate
                </button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <button onClick={()=>{goProfile(viewAlert.entityUid);setViewAlert(null);}}
                  style={{padding:'10px',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:8,color:BLUE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <User size={14}/> View Profile
                </button>
                <button onClick={()=>{showToast('Evidence downloaded');setViewAlert(null);}}
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
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:440}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>ADVANCED FILTERS</div>
              <button onClick={()=>setShowFilters(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            {[
              {label:'Fraud Type',    opts:['All','Fake Agency','Scam Casting','Suspicious Payment','Fake Profile','Spam Activity']},
              {label:'Risk Level',    opts:['All','High','Medium','Low']},
              {label:'Status',        opts:['All','New','Under Review','Investigating','Blocked','Resolved']},
              {label:'Entity Type',   opts:['All','User','Agency','Casting Call']},
              {label:'Date Range',    opts:['Today','Last 7 Days','Last 30 Days','Custom Range']},
            ].map(f=>(
              <div key={f.label} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>{f.label}</label>
                <select style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,outline:'none'}}>
                  {f.opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button onClick={()=>setShowFilters(false)} style={{flex:1,padding:11,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{showToast('Filters applied');setShowFilters(false);}}
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

    </div>
  );
}