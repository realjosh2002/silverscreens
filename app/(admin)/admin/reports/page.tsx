'use client';

import { useState } from 'react';
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
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';

/* ─── Design tokens ──────────────────────────────────────────── */
const BG    = '#0D1117';
const BG2   = '#131720';
const BG3   = '#181E2A';
const BG4   = '#1C2338';
const GOLD  = '#D4A64A';
const BEBAS = "'Bebas Neue', sans-serif";
const BARLOW= "'Barlow Condensed', sans-serif";
const GREEN = '#22C55E';
const RED   = '#EF4444';
const BLUE  = '#3B82F6';
const PURPLE= '#8B5CF6';
const ORANGE= '#F97316';
const TEAL  = '#14B8A6';
const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';

/* ─── Sidebar nav ────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'            },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'  },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'  },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'         },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports', active: true},
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                },
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
  { label: 'Total Reports',        value: '2,184', delta: '+15.6%', sub: 'from last 7 days', color: PURPLE, positive: true  },
  { label: 'Open Reports',         value: '342',   delta: '+8.3%',  sub: 'from last 7 days', color: ORANGE, positive: true  },
  { label: 'In Progress',          value: '189',   delta: '+5.1%',  sub: 'from last 7 days', color: BLUE,   positive: true  },
  { label: 'Resolved',             value: '1,521', delta: '+20.7%', sub: 'from last 7 days', color: GREEN,  positive: true  },
  { label: 'Rejected / Dismissed', value: '132',   delta: '-3.8%',  sub: 'from last 7 days', color: RED,    positive: false },
];

const STAT_ICONS = [FileText, AlertTriangle, Clock, Check, XCircle];

/* ─── Chart data ─────────────────────────────────────────────── */
const CHART_LABELS = ['May 15','May 16','May 17','May 18','May 19','May 20','May 21'];
const CHART_DATA   = [340, 480, 410, 620, 390, 510, 430];

/* ─── Type donut ─────────────────────────────────────────────── */
const TYPE_DATA = [
  { label: 'Fake Profile / Impersonation', value: 686, pct: 31.4, color: BLUE   },
  { label: 'Inappropriate Content',        value: 477, pct: 21.8, color: TEAL   },
  { label: 'Scam / Fraud',                 value: 384, pct: 17.6, color: ORANGE },
  { label: 'Harassment / Abuse',           value: 332, pct: 15.2, color: RED    },
  { label: 'Others',                       value: 305, pct: 14.0, color: PURPLE },
];

/* ─── Status donut ───────────────────────────────────────────── */
const STATUS_DONUT = [
  { label: 'Open',               value: 342,   pct: 15.7, color: ORANGE },
  { label: 'In Progress',        value: 189,   pct: 8.6,  color: BLUE   },
  { label: 'Resolved',           value: 1521,  pct: 69.6, color: GREEN  },
  { label: 'Rejected/Dismissed', value: 132,   pct: 6.1,  color: RED    },
];

/* ─── Reports table ──────────────────────────────────────────── */
const REPORTS = [
  { id:'REP-2025-2184', reportedBy:'Neha Iyer',     reportedByUid:'ASP052500002', against:'Dream Casting Agency', againstUid:'AGY12567', againstType:'agency', type:'Fake Profile / Impersonation', category:'Fake Agency',        priority:'High',   status:'In Progress', date:'May 21, 2025', time:'11:32 AM', reporterImg:'photo-1494790108377-be9c29b29330' },
  { id:'REP-2025-2183', reportedBy:'Rohit Verma',   reportedByUid:'ASP052500001', against:'Actor Zone',           againstUid:'USR223344', againstType:'user',   type:'Harassment / Abuse',           category:'Abusive Behavior',   priority:'Medium', status:'Open',        date:'May 21, 2025', time:'10:48 AM', reporterImg:'photo-1472099645785-5658abf4ff4e' },
  { id:'REP-2025-2182', reportedBy:'Karan Mehta',   reportedByUid:'ASP052500004', against:'Lead Role in Web Series',againstUid:'CAST78945',againstType:'casting',type:'Scam / Fraud',                category:'Payment Scam',       priority:'High',   status:'Open',        date:'May 21, 2025', time:'09:15 AM', reporterImg:'photo-1500648767791-00dcc994a43e' },
  { id:'REP-2025-2181', reportedBy:'Pooja Sharma',  reportedByUid:'ASP052500005', against:'Silverline Talent Hub', againstUid:'AGY11234', againstType:'agency', type:'Inappropriate Content',        category:'Explicit Content',   priority:'Medium', status:'Resolved',    date:'May 20, 2025', time:'08:22 PM', reporterImg:'photo-1529626455594-4ff0802cfb7e' },
  { id:'REP-2025-2180', reportedBy:'Arjun Malhotra',reportedByUid:'ASP052500003', against:'Premium Auditions',     againstUid:'CAST56789',againstType:'casting',type:'Fake Profile / Impersonation', category:'Fake Profile',       priority:'Low',    status:'Resolved',    date:'May 20, 2025', time:'06:05 PM', reporterImg:'photo-1507003211169-0a1dd7228f2d' },
  { id:'REP-2025-2179', reportedBy:'Divya Menon',   reportedByUid:'ASP052500007', against:'StarCast Productions',  againstUid:'AGY33210', againstType:'agency', type:'Scam / Fraud',                category:'Payment Scam',       priority:'High',   status:'In Progress', date:'May 20, 2025', time:'03:40 PM', reporterImg:'photo-1438761681033-6461ffad8d80' },
  { id:'REP-2025-2178', reportedBy:'Vikram Nair',   reportedByUid:'ASP052500006', against:'Ananya Singh',          againstUid:'ASP052500009',againstType:'user',type:'Harassment / Abuse',          category:'Threatening Messages',priority:'Medium', status:'Open',        date:'May 19, 2025', time:'11:50 AM', reporterImg:'photo-1463453091185-61582044d556' },
  { id:'REP-2025-2177', reportedBy:'Raj Kapoor',    reportedByUid:'ASP052500010', against:'GlamShoot Agency',      againstUid:'AGY44567', againstType:'agency', type:'Inappropriate Content',        category:'Misleading Content', priority:'Low',    status:'Resolved',    date:'May 19, 2025', time:'09:20 AM', reporterImg:'photo-1472099645785-5658abf4ff4e' },
];

const PRIORITY_COLOR: Record<string,string> = { High: RED,   Medium: ORANGE, Low: GREEN  };
const PRIORITY_BG:    Record<string,string> = { High: 'rgba(239,68,68,0.12)', Medium: 'rgba(249,115,22,0.12)', Low: 'rgba(34,197,94,0.12)' };
const STATUS_COLOR:   Record<string,string> = { Open: ORANGE, 'In Progress': BLUE, Resolved: GREEN, 'Rejected/Dismissed': RED };
const STATUS_BG:      Record<string,string> = { Open: 'rgba(249,115,22,0.12)', 'In Progress': 'rgba(59,130,246,0.12)', Resolved: 'rgba(34,197,94,0.12)', 'Rejected/Dismissed': 'rgba(239,68,68,0.12)' };

const TABS        = ['Overview','Reports','Complaints','Appeals'];
const TIME_RANGES = ['Last 7 Days','Last 30 Days','Last 90 Days','Custom Range'];
const SORT_OPTS   = ['Newest First','Oldest First','Highest Priority','Status'];
const PER_PAGE    = 5;

/* ─── Insights ───────────────────────────────────────────────── */
const INSIGHTS = [
  { icon: TrendingUp, iconBg:'rgba(239,68,68,0.15)',   iconColor:RED,    title:'24% increase in reports',          sub:'Compared to May 8 – May 14, 2025'   },
  { icon: Clock,      iconBg:'rgba(249,115,22,0.15)',  iconColor:ORANGE, title:'Avg. resolution time 1.8 days',    sub:'↓ 0.6 days from last week'            },
  { icon: ShieldAlert,iconBg:'rgba(34,197,94,0.15)',   iconColor:GREEN,  title:'Top reported category',            sub:'Fake Profile / Impersonation (31.4%)' },
  { icon: Users,      iconBg:'rgba(59,130,246,0.15)',  iconColor:BLUE,   title:'Users protected: 1,346',           sub:'High risk users blocked'              },
];

/* ─── SVG Line Chart ─────────────────────────────────────────── */
function ReportsChart() {
  const W=580,H=240,pl=44,pb=205,pr=W-10,pt=14;
  const pw=pr-pl,ph=pb-pt,maxY=800;
  const gridY=[0,200,400,600,800];
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
  const pts:[number,number][]=CHART_DATA.map((v,i)=>[mx(i),my(v)]);
  const path=smooth(pts);
  const area=`${path} L ${pts[pts.length-1][0]} ${pb} L ${pts[0][0]} ${pb} Z`;
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
      {CHART_LABELS.map((l,i)=><text key={i} x={mx(i)} y={pb+18} fill="rgba(255,255,255,0.3)" fontSize={12} textAnchor="middle" fontFamily={BARLOW}>{l}</text>)}
      <path d={area} fill="url(#rg)"/>
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

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ReportsComplaintsPage(){
  const router=useRouter();
  const[sidebarOpen,setSidebarOpen]=useState(false);
  const[profileOpen,setProfileOpen]=useState(false);
  const[activeTab,setActiveTab]=useState('Overview');
  const[timeRange,setTimeRange]=useState('Last 7 Days');
  const[sortBy,setSortBy]=useState('Newest First');
  const[search,setSearch]=useState('');
  const[filterType,setFilterType]=useState('All Report Types');
  const[filterCat,setFilterCat]=useState('All Categories');
  const[filterStatus,setFilterStatus]=useState('All Status');
  const[filterPriority,setFilterPriority]=useState('All Priority');
  const[selected,setSelected]=useState<string[]>([]);
  const[page,setPage]=useState(1);
  const[menuId,setMenuId]=useState('');
  const[menuPos,setMenuPos]=useState({top:0,right:0});
  const[showExport,setShowExport]=useState(false);
  const[showFilters,setShowFilters]=useState(false);
  const[viewReport,setViewReport]=useState<typeof REPORTS[0]|null>(null);
  const[toast,setToast]=useState('');

  const SB_W=sidebarOpen?220:52;
  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(''),2800);};

  const filtered=REPORTS.filter(r=>{
    const q=search.toLowerCase();
    const ms=!q||r.id.toLowerCase().includes(q)||r.reportedBy.toLowerCase().includes(q)||r.against.toLowerCase().includes(q)||r.type.toLowerCase().includes(q);
    const mt=filterType==='All Report Types'||r.type===filterType;
    const mc=filterCat==='All Categories'||r.category===filterCat;
    const ms2=filterStatus==='All Status'||r.status===filterStatus;
    const mp=filterPriority==='All Priority'||r.priority===filterPriority;
    return ms&&mt&&mc&&ms2&&mp;
  });
  const totalPages=Math.max(1,Math.ceil(filtered.length/PER_PAGE));
  const paged=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const allSel=paged.length>0&&paged.every(r=>selected.includes(r.id));
  const toggleSel=(id:string)=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=()=>setSelected(allSel?selected.filter(id=>!paged.find(r=>r.id===id)):[...new Set([...selected,...paged.map(r=>r.id)])]);

  /* ── Action handlers ── */
  const resolveReport=(id:string)=>{showToast(`Report ${id} marked as resolved`);setMenuId('');setViewReport(null);};
  const dismissReport=(id:string)=>{showToast(`Report ${id} dismissed`);setMenuId('');setViewReport(null);};
  const suspendUser=(id:string)=>{showToast(`User from ${id} suspended`);setMenuId('');setViewReport(null);};
  const escalate=(id:string)=>{router.push('/admin/fraud');setMenuId('');};

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
          <input placeholder="Search users, agencies, castings, complaints…"
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

          {/* ── STAT CARDS ── */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12}}>
            {STATS.map((s,i)=>{
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

          {/* ── FILTER BAR ── */}
          <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap' as const}}>
            {/* Date range */}
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,fontSize:14,color:'rgba(255,255,255,0.6)',cursor:'pointer'}}>
              📅 May 15, 2025 – May 21, 2025
              <RefreshCw size={13} color="rgba(255,255,255,0.3)"/>
            </div>
            {/* Report type */}
            {[
              {val:filterType,set:setFilterType,opts:['All Report Types','Fake Profile / Impersonation','Inappropriate Content','Scam / Fraud','Harassment / Abuse','Others']},
              {val:filterCat, set:setFilterCat, opts:['All Categories','Fake Agency','Abusive Behavior','Payment Scam','Explicit Content','Fake Profile','Threatening Messages','Misleading Content']},
              {val:filterStatus,set:setFilterStatus,opts:['All Status','Open','In Progress','Resolved','Rejected/Dismissed']},
              {val:filterPriority,set:setFilterPriority,opts:['All Priority','High','Medium','Low']},
            ].map((f,i)=>(
              <div key={i} style={{position:'relative'}}>
                <select value={f.val} onChange={e=>{f.set(e.target.value);setPage(1);}}
                  style={{appearance:'none',padding:'8px 32px 8px 12px',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                  {f.opts.map(o=><option key={o}>{o}</option>)}
                </select>
                <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:9,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
              </div>
            ))}
            {/* Search */}
            <div style={{position:'relative',flex:1,minWidth:200}}>
              <Search size={14} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)'}}/>
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by ID, user, agency…"
                style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'8px 10px 8px 32px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',boxSizing:'border-box'}}/>
            </div>
            <button onClick={()=>setShowFilters(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
              <Filter size={13}/> Filters
            </button>
          </div>

          {/* ── CHARTS ROW ── */}
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
              <div style={{width:'100%',height:230}}><ReportsChart/></div>
            </div>

            {/* Reports by Type */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Reports by Type</div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                <DonutChart data={TYPE_DATA} total="2,184" label="Total" size={148}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7}}>
                  {TYPE_DATA.map(d=>(
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

            {/* Reports by Status */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Reports by Status</div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                <DonutChart data={STATUS_DONUT} total="2,184" label="Total" size={148}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7}}>
                  {STATUS_DONUT.map(d=>(
                    <div key={d.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:d.color,flexShrink:0}}/>
                        <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:14,fontWeight:700,color:d.color}}>{d.pct}% <span style={{color:'rgba(255,255,255,0.4)',fontWeight:400}}>({d.value})</span></span>
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
                  <span style={{marginLeft:8,background:'rgba(239,68,68,0.15)',color:RED,border:'1px solid rgba(239,68,68,0.25)',borderRadius:12,fontSize:14,fontWeight:700,padding:'2px 9px'}}>{filtered.length}</span>
                </span>
                <div style={{position:'relative'}}>
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
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
                  <div key={h} style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:0.4}}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {paged.length===0?(
                <div style={{padding:'36px 18px',textAlign:'center',color:'rgba(255,255,255,0.35)',fontSize:15}}>No reports match your filters.</div>
              ):paged.map((r,i)=>{
                const isSel=selected.includes(r.id);
                return(
                  <div key={r.id}
                    style={{display:'grid',gridTemplateColumns:'36px 1.2fr 1.5fr 1.4fr 1.1fr 0.9fr 0.8fr 0.8fr 1fr 60px',padding:'10px 14px',borderBottom:i<paged.length-1?'1px solid rgba(255,255,255,0.04)':'none',alignItems:'center',gap:6,background:isSel?'rgba(239,68,68,0.05)':'transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='rgba(255,255,255,0.02)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isSel?'rgba(239,68,68,0.05)':'transparent';}}
                  >
                    {/* Checkbox */}
                    <div onClick={()=>toggleSel(r.id)} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                      {isSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.25)"/>}
                    </div>
                    {/* Report ID */}
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5'}}>{r.id}</div>
                    </div>
                    {/* Reported By */}
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:28,height:28,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:'1px solid rgba(255,255,255,0.1)'}}>
                        <img src={`https://images.unsplash.com/${r.reporterImg}?w=60&h=60&fit=crop&crop=face`} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                      </div>
                      <div>
                        <div style={{fontSize:14,fontWeight:600}}>{r.reportedBy}</div>
                        <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{r.reportedByUid}</div>
                      </div>
                    </div>
                    {/* Against */}
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <div style={{width:28,height:28,borderRadius:6,background:r.againstType==='agency'?'rgba(59,130,246,0.15)':r.againstType==='casting'?'rgba(249,115,22,0.15)':'rgba(139,92,246,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {r.againstType==='agency'?<Building size={13} color={BLUE}/>:r.againstType==='casting'?<Megaphone size={13} color={ORANGE}/>:<User size={13} color={PURPLE}/>}
                      </div>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,lineHeight:1.3}}>{r.against}</div>
                        <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{r.againstUid}</div>
                      </div>
                    </div>
                    {/* Type */}
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.7)',lineHeight:1.4}}>{r.type}</div>
                    {/* Category */}
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.6)'}}>{r.category}</div>
                    {/* Priority */}
                    <div>
                      <span style={{fontSize:14,fontWeight:700,padding:'3px 10px',borderRadius:5,background:PRIORITY_BG[r.priority],color:PRIORITY_COLOR[r.priority],border:`1px solid ${PRIORITY_COLOR[r.priority]}33`}}>{r.priority}</span>
                    </div>
                    {/* Status */}
                    <div>
                      <span style={{fontSize:14,fontWeight:700,padding:'3px 10px',borderRadius:5,background:STATUS_BG[r.status]||'rgba(255,255,255,0.08)',color:STATUS_COLOR[r.status]||'#F5F5F5',border:`1px solid ${STATUS_COLOR[r.status]||'rgba(255,255,255,0.15)'}33`}}>{r.status}</span>
                    </div>
                    {/* Date */}
                    <div>
                      <div style={{fontSize: 14}}>{r.date}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{r.time}</div>
                    </div>
                    {/* Actions */}
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

            {/* Reports Insights */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px',display:'flex',flexDirection:'column'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Reports Insights</div>
              <div style={{display:'flex',flexDirection:'column',gap:12,flex:1}}>
                {INSIGHTS.map((ins,i)=>(
                  <div key={i} style={{display:'flex',gap:12,padding:'12px',borderRadius:10,background:BG4,border:'1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{width:38,height:38,borderRadius:9,background:ins.iconBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <ins.icon size={17} color={ins.iconColor}/>
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5',lineHeight:1.4,marginBottom:3}}>{ins.title}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{ins.sub}</div>
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
      </div>

      {/* ── ROW CONTEXT MENU ── */}
      {menuId&&(
        <>
          <div onClick={()=>setMenuId('')} style={{position:'fixed',inset:0,zIndex:300}}/>
          <div style={{position:'fixed',top:menuPos.top,right:menuPos.right,width:200,background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,overflow:'hidden',zIndex:400,boxShadow:'0 8px 24px rgba(0,0,0,0.6)'}}>
            {[
              {label:'View Details',    color:'#F5F5F5', action:()=>{const r=REPORTS.find(x=>x.id===menuId);if(r)setViewReport(r);setMenuId('');}},
              {label:'Resolve Report',  color:GREEN,     action:()=>resolveReport(menuId)},
              {label:'Dismiss Report',  color:ORANGE,    action:()=>dismissReport(menuId)},
              {label:'Suspend User',    color:RED,       action:()=>suspendUser(menuId)},
              {label:'Escalate to Fraud',color:PURPLE,  action:()=>escalate(menuId)},
              {label:'View User Profile',color:BLUE,    action:()=>{const r=REPORTS.find(x=>x.id===menuId);if(r)router.push(`/agency/applications/${r.reportedByUid}`);setMenuId('');}},
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

      {/* ── REPORT DETAIL MODAL ── */}
      {viewReport&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,width:'100%',maxWidth:600,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <div>
                <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>REPORT DETAILS</div>
                <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewReport.id}</div>
              </div>
              <button onClick={()=>setViewReport(null)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <div style={{padding:'20px 22px',display:'flex',flexDirection:'column',gap:16}}>
              {/* Badges */}
              <div style={{display:'flex',gap:8}}>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:PRIORITY_BG[viewReport.priority],color:PRIORITY_COLOR[viewReport.priority],border:`1px solid ${PRIORITY_COLOR[viewReport.priority]}33`}}>{viewReport.priority} Priority</span>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:STATUS_BG[viewReport.status]||'rgba(255,255,255,0.08)',color:STATUS_COLOR[viewReport.status]||'#F5F5F5',border:`1px solid ${STATUS_COLOR[viewReport.status]||'rgba(255,255,255,0.2)'}33`}}>{viewReport.status}</span>
              </div>
              {/* Reporter */}
              <div style={{background:BG3,borderRadius:10,padding:'14px',display:'flex',gap:14,alignItems:'center'}}>
                <div style={{width:46,height:46,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:'2px solid rgba(255,255,255,0.1)'}}>
                  <img src={`https://images.unsplash.com/${viewReport.reporterImg}?w=90&h=90&fit=crop&crop=face`} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
                <div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.4)',marginBottom:2}}>Reported by</div>
                  <div style={{fontSize:16,fontWeight:700}}>{viewReport.reportedBy}</div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewReport.reportedByUid}</div>
                </div>
              </div>
              {/* Details grid */}
              {[
                {label:'Report ID',         value:viewReport.id},
                {label:'Against',           value:`${viewReport.against} (${viewReport.againstUid})`},
                {label:'Report Type',       value:viewReport.type},
                {label:'Category',          value:viewReport.category},
                {label:'Date Reported',     value:`${viewReport.date} at ${viewReport.time}`},
              ].map(({label,value})=>(
                <div key={label} style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:8,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{label}</span>
                  <span style={{fontSize:15,color:'#F5F5F5',fontWeight:500}}>{value}</span>
                </div>
              ))}
              {/* Action buttons */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:4}}>
                <button onClick={()=>resolveReport(viewReport.id)}
                  style={{padding:'10px',background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:8,color:GREEN,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Check size={14}/> Resolve
                </button>
                <button onClick={()=>dismissReport(viewReport.id)}
                  style={{padding:'10px',background:'rgba(249,115,22,0.12)',border:'1px solid rgba(249,115,22,0.25)',borderRadius:8,color:ORANGE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <XCircle size={14}/> Dismiss
                </button>
                <button onClick={()=>suspendUser(viewReport.id)}
                  style={{padding:'10px',background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,color:RED,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Lock size={14}/> Suspend
                </button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <button onClick={()=>{router.push(`/agency/applications/${viewReport.reportedByUid}`);setViewReport(null);}}
                  style={{padding:'10px',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:8,color:BLUE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <User size={14}/> View Reporter Profile
                </button>
                <button onClick={()=>escalate(viewReport.id)}
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

      {/* ── FILTERS MODAL ── */}
      {showFilters&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:440}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>ADVANCED FILTERS</div>
              <button onClick={()=>setShowFilters(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            {[
              {label:'Report Type',   opts:['All','Fake Profile / Impersonation','Inappropriate Content','Scam / Fraud','Harassment / Abuse','Others']},
              {label:'Priority',      opts:['All','High','Medium','Low']},
              {label:'Status',        opts:['All','Open','In Progress','Resolved','Rejected/Dismissed']},
              {label:'Reported Against', opts:['All','User','Agency','Casting Call']},
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