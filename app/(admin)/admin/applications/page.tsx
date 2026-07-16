'use client';

import { useState } from 'react';
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
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';

/* ─── Design tokens — identical to admin dashboard ──────────── */
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

/* ─── Sidebar nav ────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'           },
  { icon: Users,           label: 'User Management',          href: '/admin/users'               },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification' },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification' },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications', active: true },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'             },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'               },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'       },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'      },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                 },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'       },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'           },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'             },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'               },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'               },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'            },
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
  { label: 'Total Applications',  value: '18,742', delta: '+12.6%', sub: 'from last 7 days', iconColor: BLUE,   positive: true  },
  { label: 'Unique Applicants',   value: '9,856',  delta: '+8.3%',  sub: 'from last 7 days', iconColor: PURPLE, positive: true  },
  { label: 'Applications Today',  value: '2,847',  delta: '+15.4%', sub: 'from yesterday',   iconColor: TEAL,   positive: true  },
  { label: 'Flagged Applications',value: '346',    delta: '+23.7%', sub: 'from last 7 days', iconColor: ORANGE, positive: false },
  { label: 'Spam Detected',       value: '128',    delta: '+18.9%', sub: 'from last 7 days', iconColor: RED,    positive: false },
  { label: 'Auto Blocked',        value: '57',     delta: '+6.7%',  sub: 'from last 7 days', iconColor: PURPLE, positive: false },
];

/* ─── Chart data ─────────────────────────────────────────────── */
const CHART_LABELS = ['May 15','May 16','May 17','May 18','May 19','May 20','May 21'];
const CHART_DATA   = [1100, 1600, 2200, 2700, 2400, 3100, 2850];

/* ─── Donuts ─────────────────────────────────────────────────── */
const STATUS_DATA = [
  { label: 'Submitted',  value: 14256, pct: 76.0, color: BLUE   },
  { label: 'Reviewed',   value: 2842,  pct: 15.2, color: GREEN  },
  { label: 'Shortlisted',value: 1024,  pct: 5.5,  color: GOLD   },
  { label: 'Rejected',   value: 620,   pct: 3.3,  color: RED    },
];

const RISK_DATA = [
  { label: 'High Risk',   value: 89,  pct: 25.7, color: RED    },
  { label: 'Medium Risk', value: 147, pct: 42.5, color: ORANGE },
  { label: 'Low Risk',    value: 110, pct: 31.8, color: GREEN  },
];

/* ─── Insights ───────────────────────────────────────────────── */
const INSIGHTS = [
  { icon: ShieldAlert, iconBg: 'rgba(239,68,68,0.15)',   iconColor: RED,    title: 'Multiple applications from same device/IP', sub: '23 applications flagged',            href: '/admin/fraud'     },
  { icon: Zap,         iconBg: 'rgba(249,115,22,0.15)', iconColor: ORANGE, title: 'Bulk applications detected',               sub: '5 users submitted 50+ applications',  href: '/admin/fraud'     },
  { icon: Activity,    iconBg: 'rgba(139,92,246,0.15)', iconColor: PURPLE, title: 'Unusual activity spike',                   sub: '35% more applications from new users', href: '/admin/analytics' },
];

/* ─── Table data ─────────────────────────────────────────────── */
const FLAGGED_APPS = [
  { id:'APP-245689', date:'May 21, 2025', time:'10:32 AM', applicant:'Rohit Verma',    uid:'ASP052500001', casting:'Lead Role – Web Series',     project:'DreamWorks Films',       risk:'High',   reason:'Multiple submissions from same device',       img:'photo-1472099645785-5658abf4ff4e' },
  { id:'APP-245688', date:'May 21, 2025', time:'09:58 AM', applicant:'Neha Iyer',      uid:'ASP052500002', casting:'Supporting Role – Film',      project:'NextGen Studios',        risk:'Medium', reason:'Bulk applications (25+ in 10 mins)',          img:'photo-1494790108377-be9c29b29330' },
  { id:'APP-245687', date:'May 21, 2025', time:'09:41 AM', applicant:'Arjun Malhotra', uid:'ASP052500003', casting:'Dancer – Music Video',        project:'BeatBox Creations',      risk:'High',   reason:'IP address flagged for suspicious activity',  img:'photo-1507003211169-0a1dd7228f2d' },
  { id:'APP-245686', date:'May 20, 2025', time:'11:15 PM', applicant:'Karan Mehta',    uid:'ASP052500004', casting:'Child Artist – Short Film',   project:'Indie Frames',           risk:'Low',    reason:'New account with high frequency',             img:'photo-1500648767791-00dcc994a43e' },
  { id:'APP-245685', date:'May 20, 2025', time:'10:42 PM', applicant:'Pooja Sharma',   uid:'ASP052500005', casting:'Lead Role – Feature Film',    project:'Royal Reels Productions',risk:'Medium', reason:'Similar documents uploaded multiple times',    img:'photo-1529626455594-4ff0802cfb7e' },
  { id:'APP-245684', date:'May 20, 2025', time:'08:20 PM', applicant:'Vikram Nair',    uid:'ASP052500006', casting:'Villain – OTT Series',        project:'WebStream Originals',    risk:'High',   reason:'Account linked to 3 suspended profiles',      img:'photo-1463453091185-61582044d556' },
  { id:'APP-245683', date:'May 20, 2025', time:'06:55 PM', applicant:'Divya Menon',    uid:'ASP052500007', casting:'Model – Fashion Ad',          project:'GlamShoot Agency',       risk:'Low',    reason:'Duplicate portfolio images detected',         img:'photo-1438761681033-6461ffad8d80' },
  { id:'APP-245682', date:'May 19, 2025', time:'03:30 PM', applicant:'Siddharth Rao',  uid:'ASP052500008', casting:'Background Artist',           project:'Epic Frames Pvt Ltd',    risk:'Medium', reason:'VPN usage detected during application',       img:'photo-1507003211169-0a1dd7228f2d' },
  { id:'APP-245681', date:'May 19, 2025', time:'01:10 PM', applicant:'Ananya Singh',   uid:'ASP052500009', casting:'Singer – Reality Show',       project:'StarVoice Productions',  risk:'Low',    reason:'Inconsistent profile details',                img:'photo-1573496359142-b8d87734a5a2' },
  { id:'APP-245680', date:'May 19, 2025', time:'11:05 AM', applicant:'Raj Kapoor',     uid:'ASP052500010', casting:'Comedian – Web Series',       project:'LaughHub Studios',       risk:'High',   reason:'Reported by agency for abusive messages',     img:'photo-1472099645785-5658abf4ff4e' },
];

const RISK_COLOR: Record<string,string> = { High: RED, Medium: ORANGE, Low: GREEN };
const RISK_BG:    Record<string,string> = { High: 'rgba(239,68,68,0.12)', Medium: 'rgba(249,115,22,0.12)', Low: 'rgba(34,197,94,0.12)' };
const PER_PAGE = 5;
const TIME_FILTERS = ['Today','Last 7 Days','Last 30 Days','Custom Range'];
const RISK_FILTERS = ['All Risk Levels','High','Medium','Low'];

/* ─── SVG Line Chart ─────────────────────────────────────────── */
function AppOverTimeChart({ period }: { period: string }) {
  const W = 420, H = 180;
  const pl = 40, pb = 155, pr = W-10, pt = 14;
  const pw = pr-pl, ph = pb-pt;
  const maxY = 4000;
  const gridY = [0,1000,2000,3000,4000];
  const mult = period==='Today' ? 0.3 : period==='Last 30 Days' ? 2.1 : 1;
  const data = CHART_DATA.map(v => Math.round(v*mult));
  const mx = (i: number) => pl + (i/(CHART_LABELS.length-1))*pw;
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
  const path = smooth(pts);
  const area = `${path} L ${pts[pts.length-1][0]} ${pb} L ${pts[0][0]} ${pb} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity={0.18}/><stop offset="100%" stopColor={BLUE} stopOpacity={0.01}/></linearGradient></defs>
      {gridY.map(v=>(
        <g key={v}>
          <line x1={pl} y1={my(v)} x2={pr} y2={my(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3"/>
          <text x={pl-6} y={my(v)+4} fill="rgba(255,255,255,0.28)" fontSize={9} textAnchor="end" fontFamily={BARLOW}>{v===0?'0':`${v/1000}K`}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1}/>
      {CHART_LABELS.map((l,i)=><text key={i} x={mx(i)} y={pb+16} fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="middle" fontFamily={BARLOW}>{l}</text>)}
      <path d={area} fill="url(#ag)"/>
      <path d={path} fill="none" stroke={BLUE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={3} fill={BLUE} stroke={BG3} strokeWidth={1.5}/>)}
    </svg>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────── */
function DonutChart({data,total,label,size=160}:{data:{label:string;pct:number;color:string}[];total:string;label:string;size?:number}) {
  const cx=size/2,cy=size/2,R=size*0.44,r=size*0.28;
  const toRad=(deg:number)=>(deg*Math.PI)/180;
  const pt=(ang:number,rad:number)=>[cx+rad*Math.cos(toRad(ang)),cy+rad*Math.sin(toRad(ang))];
  let start=-90;
  const sum=data.reduce((s,d)=>s+d.pct,0);
  const arcs=data.map(seg=>{
    const sweep=(seg.pct/sum)*360;
    const end=start+sweep;
    const large=sweep>180?1:0;
    const [x1,y1]=pt(start,R);const [x2,y2]=pt(end,R);
    const [x3,y3]=pt(end,r);const [x4,y4]=pt(start,r);
    const d=`M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    start=end+1.5;
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

  const SB_W = sidebarOpen ? 220 : 52;

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),2800); };

  const filtered = FLAGGED_APPS.filter(a => {
    const q = search.toLowerCase();
    const ms = !q || a.applicant.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.casting.toLowerCase().includes(q) || a.project.toLowerCase().includes(q);
    const mr = riskFilter==='All Risk Levels' || a.risk===riskFilter;
    return ms && mr;
  });
  const totalPages = Math.max(1,Math.ceil(filtered.length/PER_PAGE));
  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const allSelected = paged.length>0 && paged.every(a=>selected.includes(a.id));

  const toggleSelect = (id:string) => setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const toggleAll = () => setSelected(allSelected?selected.filter(id=>!paged.find(a=>a.id===id)):[...new Set([...selected,...paged.map(a=>a.id)])]);
  const handleBulk = (action:string) => { showToast(`${action} applied to ${selected.length} application(s)`); setSelected([]); setShowBulk(false); };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:BG,fontFamily:BARLOW,color:'#F5F5F5'}}>

      {/* ══ TOPNAV ══ */}
      <header style={{display:'flex',alignItems:'center',gap:14,flexShrink:0,padding:'0 24px',height:60,background:BG2,borderBottom:'1px solid rgba(255,255,255,0.06)',zIndex:100}}>
        <SilverScreensLogo size="md" href="/" showTagline={false}/>
        <div style={{padding:'3px 10px',background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:5}}>
          <span style={{fontFamily:BARLOW,fontSize:14,fontWeight:700,color:RED,letterSpacing:1}}>ADMIN PANEL</span>
        </div>
        <div style={{flex:1,maxWidth:440,position:'relative'}}>
          <Search size={14} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}/>
          <input placeholder="Search applications, casting, users, agencies…"
            style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'8px 40px 8px 34px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',boxSizing:'border-box'}}/>
          <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',fontSize:14,color:'rgba(255,255,255,0.25)',background:BG4,borderRadius:4,padding:'1px 6px',border:'1px solid rgba(255,255,255,0.1)'}}>⌘K</span>
        </div>
        <div style={{flex:1}}/>
        <div onClick={()=>router.push('/admin/notifications')} style={{position:'relative',cursor:'pointer'}}>
          <div style={{width:36,height:36,borderRadius:8,background:'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Bell size={15} color="rgba(255,255,255,0.7)"/>
          </div>
          <div style={{position:'absolute',top:-5,right:-5,background:RED,borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize: 14,fontWeight:700,color:'#fff'}}>12</div>
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
          {profileOpen && (
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
          {sidebarOpen && (
            <div style={{padding:'14px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:38,height:38,borderRadius:9,overflow:'hidden',border:'1px solid rgba(212,166,74,0.25)',flexShrink:0}}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/>
              </div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:'#F5F5F5',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Super Admin</div>
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
                {sidebarOpen&&<span style={{fontSize:14,color:active?'#F5F5F5':'rgba(255,255,255,0.6)',fontWeight:active?700:400,whiteSpace:'nowrap',flex:1}}>{label}</span>}
                {sidebarOpen&&active&&<ChevronRight size={12} color={RED} opacity={0.7}/>}
              </div>
            ))}
          </nav>
          {sidebarOpen&&(
            <div onClick={()=>router.push('/login')} style={{padding:'14px 16px',borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',gap:9,cursor:'pointer',color:'rgba(255,255,255,0.45)',fontSize:14}}
              onMouseEnter={e=>(e.currentTarget.style.color='#ff6b6b')}
              onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.45)')}
            ><ChevronRight size={14} style={{transform:'rotate(180deg)'}}/>Logout</div>
          )}
        </aside>

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
                <select value={timePeriod} onChange={e=>setTimePeriod(e.target.value)}
                  style={{appearance:'none',padding:'8px 36px 8px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                  {TIME_FILTERS.map(t=><option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} color="rgba(255,255,255,0.5)" style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
              </div>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10}}>
            {STATS.map((s,i)=>(
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
              <div style={{width:'100%',height:170}}><AppOverTimeChart period={timePeriod}/></div>
            </div>

            {/* Applications by Status */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:14}}>Applications by Status</div>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <DonutChart data={STATUS_DATA} total="18,742" label="Total" size={145}/>
                <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
                  {STATUS_DATA.map(d=>(
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
                <DonutChart data={RISK_DATA} total="346" label="Flagged" size={145}/>
                <div style={{width:'100%',display:'flex',flexDirection:'column',gap:8}}>
                  {RISK_DATA.map(d=>(
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
                  Suspicious / Flagged Applications
                  <span style={{marginLeft:8,background:'rgba(239,68,68,0.15)',color:RED,border:'1px solid rgba(239,68,68,0.25)',borderRadius:12,fontSize:14,fontWeight:700,padding:'2px 8px'}}>346</span>
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
              <div style={{display:'grid',gridTemplateColumns:'36px 1.8fr 1.8fr 2fr 95px 2fr 1.3fr 88px',padding:'10px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',gap:8}}>
                <div onClick={toggleAll} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                  {allSelected?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.3)"/>}
                </div>
                {['Application','Applicant','Casting / Project','Risk Level','Reason','Detected On','Actions'].map(h=>(
                  <div key={h} style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:0.5}}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {paged.length===0?(
                <div style={{padding:'32px 18px',textAlign:'center',color:'rgba(255,255,255,0.35)',fontSize:14}}>No applications match your filters.</div>
              ):paged.map((app,i)=>{
                const isSel=selected.includes(app.id);
                return (
                  <div key={app.id}
                    style={{display:'grid',gridTemplateColumns:'36px 1.8fr 1.8fr 2fr 95px 2fr 1.3fr 88px',padding:'11px 18px',borderBottom:i<paged.length-1?'1px solid rgba(255,255,255,0.04)':'none',alignItems:'center',gap:8,background:isSel?'rgba(239,68,68,0.05)':'transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='rgba(255,255,255,0.02)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isSel?'rgba(239,68,68,0.05)':'transparent';}}
                  >
                    <div onClick={()=>toggleSelect(app.id)} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                      {isSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.25)"/>}
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:600}}>{app.id}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>Submitted on {app.date}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:28,height:28,borderRadius:'50%',overflow:'hidden',flexShrink:0,border:'1px solid rgba(255,255,255,0.1)'}}>
                        <img src={`https://images.unsplash.com/${app.img}?w=60&h=60&fit=crop&crop=face`} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
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
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.6)',lineHeight:1.4}}>{app.reason}</div>
                    <div>
                      <div style={{fontSize: 14}}>{app.date}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{app.time}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <button onClick={()=>router.push(`/agency/applications/${app.uid}`)} title="View Profile"
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
                  Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)} to {Math.min(page*PER_PAGE,filtered.length)} of {filtered.length} entries
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
                {INSIGHTS.map((ins,i)=>(
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
              {label:'View Details',      icon:Eye,          color:'#F5F5F5', action:()=>{const a=FLAGGED_APPS.find(x=>x.id===menuApp);if(a)router.push(`/agency/applications/${a.uid}`);setMenuApp('');}},
              {label:'Mark as Safe',      icon:ShieldCheck,  color:GREEN,     action:()=>{showToast('Marked as safe');setMenuApp('');}},
              {label:'Investigate',       icon:Search,       color:BLUE,      action:()=>{router.push('/admin/fraud');setMenuApp('');}},
              {label:'Block User',        icon:Lock,         color:ORANGE,    action:()=>{showToast('User blocked successfully');setMenuApp('');}},
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
            {[
              {label:'Risk Level',        options:['All','High','Medium','Low']},
              {label:'Application Status',options:['All','Submitted','Reviewed','Shortlisted','Rejected']},
              {label:'Detection Method',  options:['All','IP Tracking','Bulk Detection','Duplicate Media','Behavioural']},
              {label:'Date Range',        options:['Today','Last 7 Days','Last 30 Days','Custom Range']},
            ].map(f=>(
              <div key={f.label} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>{f.label}</label>
                <select style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none'}}>
                  {f.options.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:6}}>
              <button onClick={()=>setShowFilters(false)} style={{flex:1,padding:10,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{showToast('Filters applied');setShowFilters(false);}}
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

    </div>
  );
}