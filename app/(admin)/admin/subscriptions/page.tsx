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
  Filter, X, Info, RefreshCw, Plus, Edit2,
  CheckSquare, Square, Clock, Check, XCircle,
  Wallet, History, RotateCcw, Calendar,
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
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'                  },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                      },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'        },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'        },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'               },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'                    },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                      },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions', active: true},
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'             },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                        },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'              },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'                  },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'                    },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                      },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                      },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'                   },
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
  { label: 'Total Subscriptions',       value: '2,548',        delta: '+12.6%', sub: 'from last 7 days', color: PURPLE, positive: true,  Icon: CreditCard  },
  { label: 'Active Subscriptions',      value: '1,984',        delta: '+15.3%', sub: 'from last 7 days', color: GREEN,  positive: true,  Icon: Check       },
  { label: 'Expiring Soon',             value: '312',          delta: '+8.7%',  sub: 'from last 7 days', color: ORANGE, positive: false, Icon: Clock       },
  { label: 'Expired',                   value: '162',          delta: '-5.1%',  sub: 'from last 7 days', color: RED,    positive: false, Icon: XCircle     },
  { label: 'Monthly Recurring Revenue', value: '₹18,75,320',  delta: '+22.4%', sub: 'from last month',  color: TEAL,   positive: true,  Icon: Wallet      },
];

/* ─── Subscription summary ───────────────────────────────────── */
const SUMMARY = [
  { label: 'Active Subscriptions', value: '1,984', pct: '77.9%', color: GREEN  },
  { label: 'Expiring Soon',        value: '312',   pct: '12.2%', color: ORANGE },
  { label: 'Expired',              value: '162',   pct: '6.4%',  color: RED    },
  { label: 'Cancelled',            value: '90',    pct: '3.5%',  color: PURPLE },
];

/* ─── Plan donut ─────────────────────────────────────────────── */
const PLAN_DATA = [
  { label: 'Basic',      value: 464, pct: 18.2, color: BLUE   },
  { label: 'Premium',    value: 881, pct: 34.6, color: GOLD   },
  { label: 'Pro',        value: 632, pct: 24.8, color: GREEN  },
  { label: 'Agency Pro', value: 321, pct: 12.6, color: PURPLE },
  { label: 'Enterprise', value: 250, pct: 9.8,  color: RED    },
];

/* ─── Subscriptions table data ───────────────────────────────── */
const SUBSCRIPTIONS = [
  { id:'SUB-2025-2548', name:'Rohit Verma',          email:'rohit.verma@email.com',      avatar:'RV', avatarBg:'rgba(139,92,246,0.2)', avatarColor:PURPLE, userType:'Aspirant', department:'Acting', role:'Hero',           plan:'Premium',    cycle:'Monthly',   amount:'₹1,499',  status:'Active',        start:'May 21, 2025', startTime:'11:32 AM', renewal:'Jun 21, 2025', renewalTime:'11:32 AM', payment:'UPI',         img:'photo-1472099645785-5658abf4ff4e' },
  { id:'SUB-2025-2547', name:'Neha Iyer',            email:'neha.iyer@email.com',        avatar:'NI', avatarBg:'rgba(59,130,246,0.2)',  avatarColor:BLUE,   userType:'Aspirant', department:'Modelling', role:'Model',           plan:'Pro',        cycle:'Quarterly', amount:'₹3,999',  status:'Expiring Soon', start:'Mar 21, 2025', startTime:'10:48 AM', renewal:'Jun 21, 2025', renewalTime:'10:48 AM', payment:'Credit Card',  img:'photo-1494790108377-be9c29b29330' },
  { id:'SUB-2025-2546', name:'Dream Casting Agency', email:'contact@dreamcast.com',      avatar:'DC', avatarBg:'rgba(249,115,22,0.2)', avatarColor:ORANGE, userType:'Agency', department:'', role:'',  plan:'Agency Pro', cycle:'Monthly',   amount:'₹4,999',  status:'Active',        start:'May 20, 2025', startTime:'09:15 AM', renewal:'Jun 20, 2025', renewalTime:'09:15 AM', payment:'Net Banking',  img:'photo-1507003211169-0a1dd7228f2d' },
  { id:'SUB-2025-2545', name:'Silverline Productions',email:'info@silverline.com',       avatar:'SP', avatarBg:'rgba(20,184,166,0.2)', avatarColor:TEAL,   userType:'Agency', department:'', role:'', plan:'Enterprise', cycle:'Annual',    amount:'₹24,999', status:'Active',        start:'Apr 15, 2025', startTime:'02:22 PM', renewal:'Apr 15, 2026', renewalTime:'02:22 PM', payment:'Credit Card',  img:'photo-1500648767791-00dcc994a43e' },
  { id:'SUB-2025-2544', name:'Karan Mehta',          email:'karan.mehta@email.com',      avatar:'KM', avatarBg:'rgba(239,68,68,0.2)',  avatarColor:RED,    userType:'Aspirant', department:'Dancing', role:'Dancer',          plan:'Basic',      cycle:'Monthly',   amount:'₹699',    status:'Expired',       start:'Apr 21, 2025', startTime:'06:05 PM', renewal:'May 21, 2025', renewalTime:'06:05 PM', payment:'UPI',         img:'photo-1463453091185-61582044d556' },
  { id:'SUB-2025-2543', name:'NextGen Studios',      email:'hello@nextgen.com',          avatar:'NG', avatarBg:'rgba(139,92,246,0.2)', avatarColor:PURPLE, userType:'Agency', department:'', role:'',      plan:'Pro',        cycle:'Quarterly', amount:'₹9,999',  status:'Active',        start:'May 18, 2025', startTime:'01:20 PM', renewal:'Aug 18, 2025', renewalTime:'01:20 PM', payment:'Debit Card',   img:'photo-1529626455594-4ff0802cfb7e' },
  { id:'SUB-2025-2542', name:'Pooja Sharma',         email:'pooja.sharma@email.com',     avatar:'PS', avatarBg:'rgba(34,197,94,0.2)',  avatarColor:GREEN,  userType:'Aspirant', department:'Singing', role:'Singer',          plan:'Premium',    cycle:'Monthly',   amount:'₹1,499',  status:'Expiring Soon', start:'Apr 22, 2025', startTime:'11:10 AM', renewal:'May 22, 2025', renewalTime:'11:10 AM', payment:'UPI',         img:'photo-1573496359142-b8d87734a5a2' },
  { id:'SUB-2025-2541', name:'AdVibe Agency',        email:'hello@advibe.com',           avatar:'AV', avatarBg:'rgba(212,166,74,0.2)', avatarColor:GOLD,   userType:'Agency', department:'', role:'',       plan:'Agency Pro', cycle:'Monthly',   amount:'₹4,999',  status:'Active',        start:'May 17, 2025', startTime:'04:35 PM', renewal:'Jun 17, 2025', renewalTime:'04:35 PM', payment:'Net Banking',  img:'photo-1438761681033-6461ffad8d80' },
  { id:'SUB-2025-2540', name:'Arjun Malhotra',       email:'arjun.m@email.com',          avatar:'AM', avatarBg:'rgba(59,130,246,0.2)', avatarColor:BLUE,   userType:'Aspirant', department:'Acting', role:'Hero',           plan:'Pro',        cycle:'Monthly',   amount:'₹2,499',  status:'Active',        start:'May 16, 2025', startTime:'03:10 PM', renewal:'Jun 16, 2025', renewalTime:'03:10 PM', payment:'Credit Card',  img:'photo-1472099645785-5658abf4ff4e' },
  { id:'SUB-2025-2539', name:'StarCast Productions', email:'contact@starcast.com',       avatar:'SC', avatarBg:'rgba(249,115,22,0.2)', avatarColor:ORANGE, userType:'Agency', department:'', role:'',     plan:'Enterprise', cycle:'Annual',    amount:'₹24,999', status:'Active',        start:'May 10, 2025', startTime:'10:00 AM', renewal:'May 10, 2026', renewalTime:'10:00 AM', payment:'Net Banking',  img:'photo-1500648767791-00dcc994a43e' },
];

const STATUS_COLOR: Record<string,string> = { Active: GREEN, 'Expiring Soon': ORANGE, Expired: RED, Cancelled: PURPLE };
const STATUS_BG:    Record<string,string> = { Active: 'rgba(34,197,94,0.12)', 'Expiring Soon': 'rgba(249,115,22,0.12)', Expired: 'rgba(239,68,68,0.12)', Cancelled: 'rgba(139,92,246,0.12)' };
const USER_COLOR: Record<string,string> = { Aspirant: PURPLE, Agency: BLUE };
const USER_BG: Record<string,string> = { Aspirant: 'rgba(139,92,246,0.15)', Agency: 'rgba(59,130,246,0.15)' };

const PER_PAGE   = 8;
const SORT_OPTS  = ['Newest First','Oldest First','Amount High–Low','Amount Low–High','Renewal Date'];
const USER_TYPES = ['All User Types','Aspirant','Agency'];
const ALL_PLANS  = ['All Plans','Basic','Premium','Pro','Agency Pro','Enterprise'];
const ALL_STATUS = ['All Statuses','Active','Expiring Soon','Expired','Cancelled'];
const BILL_CYCLE = ['All Billing Cycles','Monthly','Quarterly','Annual'];
const PAY_METHODS= ['All Methods','UPI','Credit Card','Debit Card','Net Banking','Wallet'];

/* ─── Donut Chart ────────────────────────────────────────────── */
function DonutChart({data,total,size=160}:{data:{label:string;pct:number;color:string}[];total:string;size?:number}){
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
      <text x={cx} y={cy-8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={size*0.07} fontFamily={BARLOW}>Total</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="#F5F5F5" fontSize={size*0.13} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
    </svg>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function SubscriptionManagementPage(){
  const router=useRouter();
  const[sidebarOpen,setSidebarOpen]=useState(false);
  const[profileOpen,setProfileOpen]=useState(false);
  const[search,setSearch]=useState('');
  const[userType,setUserType]=useState('All User Types');
  const[plan,setPlan]=useState('All Plans');
  const[status,setStatus]=useState('All Statuses');
  const[cycle,setCycle]=useState('All Billing Cycles');
  const[payMethod,setPayMethod]=useState('All Methods');
  const[sortBy,setSortBy]=useState('Newest First');
  const[selected,setSelected]=useState<string[]>([]);
  const[page,setPage]=useState(1);
  const[menuId,setMenuId]=useState('');
  const[menuPos,setMenuPos]=useState({top:0,right:0});
  const[viewSub,setViewSub]=useState<typeof SUBSCRIPTIONS[0]|null>(null);
  const[showBulk,setShowBulk]=useState(false);
  const[showExport,setShowExport]=useState(false);
  const[showAddSub,setShowAddSub]=useState(false);
  const[showManagePlans,setShowManagePlans]=useState(false);
  const[showPayHistory,setShowPayHistory]=useState(false);
  const[showRenewal,setShowRenewal]=useState(false);
  const[toast,setToast]=useState('');

  const SB_W=sidebarOpen?220:52;
  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(''),2800);};

  const filtered=SUBSCRIPTIONS.filter(s=>{
    const q=search.toLowerCase();
    const ms=!q||s.name.toLowerCase().includes(q)||s.email.toLowerCase().includes(q)||s.id.toLowerCase().includes(q)||((s.department||'').toLowerCase().includes(q)||(s.role||'').toLowerCase().includes(q));
    const mu=userType==='All User Types'||s.userType===userType;
    const mp=plan==='All Plans'||s.plan===plan;
    const mst=status==='All Statuses'||s.status===status;
    const mc=cycle==='All Billing Cycles'||s.cycle===cycle;
    const mpm=payMethod==='All Methods'||s.payment===payMethod;
    return ms&&mu&&mp&&mst&&mc&&mpm;
  });
  const totalPages=Math.max(1,Math.ceil(filtered.length/PER_PAGE));
  const paged=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const allSel=paged.length>0&&paged.every(s=>selected.includes(s.id));
  const toggleSel=(id:string)=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=()=>setSelected(allSel?selected.filter(id=>!paged.find(s=>s.id===id)):[...new Set([...selected,...paged.map(s=>s.id)])]);
  const handleBulk=(action:string)=>{showToast(`${action} applied to ${selected.length} subscription(s)`);setSelected([]);setShowBulk(false);};
  const clearFilters=()=>{setSearch('');setUserType('All User Types');setPlan('All Plans');setStatus('All Statuses');setCycle('All Billing Cycles');setPayMethod('All Methods');setPage(1);};

  /* Dropdown helper */
  const Dropdown=({val,set,opts,width=160}:{val:string;set:(v:string)=>void;opts:string[];width?:number})=>(
    <div style={{position:'relative',width}}>
      <select value={val} onChange={e=>{set(e.target.value);setPage(1);}}
        style={{appearance:'none',width:'100%',padding:'8px 28px 8px 10px',background:BG3,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,color:'rgba(255,255,255,0.75)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
    </div>
  );

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
          <input placeholder="Search users, agencies, plans, transactions…"
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
                <span style={{color:'#F5F5F5'}}>Subscription Management</span>
              </div>
              <h1 style={{fontFamily:BARLOW,fontSize:28,fontWeight:800,margin:0,display:'flex',alignItems:'center',gap:6}}>
                Subscription Management
                <span style={{width:7,height:7,borderRadius:'50%',background:RED,display:'inline-block',marginBottom:2}}/>
              </h1>
              <p style={{fontSize:15,color:'rgba(255,255,255,0.45)',margin:'4px 0 0'}}>Manage subscriptions, renewals, payments and billing for all platform users and agencies.</p>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center',marginTop:28,flexShrink:0}}>
              <button onClick={()=>setShowExport(true)}
                style={{display:'flex',alignItems:'center',gap:7,padding:'9px 15px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>
                <Download size={14}/> Export
              </button>
              {/* Bulk actions */}
              <div style={{position:'relative'}}>
                <button onClick={()=>setShowBulk(v=>!v)}
                  style={{display:'flex',alignItems:'center',gap:7,padding:'9px 15px',background:selected.length>0?RED:BG3,border:`1px solid ${selected.length>0?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.1)'}`,borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>
                  Bulk Actions{selected.length>0?` (${selected.length})`:''}<ChevronDown size={12}/>
                </button>
                {showBulk&&(
                  <>
                    <div onClick={()=>setShowBulk(false)} style={{position:'fixed',inset:0,zIndex:150}}/>
                    <div style={{position:'absolute',top:42,right:0,width:210,background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,overflow:'hidden',zIndex:200,boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}}>
                      {['Send Renewal Reminder','Cancel Subscriptions','Extend by 30 Days','Export Selected','Mark as Expired'].map(a=>(
                        <div key={a} onClick={()=>{if(selected.length===0){showToast('Select at least one subscription');setShowBulk(false);}else handleBulk(a);}}
                          style={{padding:'10px 15px',fontSize:14,cursor:'pointer',color:a.includes('Cancel')||a.includes('Expired')?RED:'#F5F5F5'}}
                          onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                          onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                        >{a}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button onClick={()=>setShowAddSub(true)}
                style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',background:RED,border:'none',borderRadius:8,color:'#fff',fontFamily:BEBAS,fontSize:18,letterSpacing:1,cursor:'pointer'}}>
                <Plus size={15}/> Add Subscription
              </button>
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
                  <div style={{fontFamily:BEBAS,fontSize:s.value.startsWith('₹')?22:30,letterSpacing:1,lineHeight:1}}>{s.value}</div>
                  <div style={{display:'flex',alignItems:'center',gap:5,marginTop:3}}>
                    <TrendingUp size={11} color={s.positive?GREEN:RED}/>
                    <span style={{fontSize:14,fontWeight:700,color:s.positive?GREEN:RED}}>{s.delta}</span>
                    <span style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{s.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── FILTERS ── */}
          <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'18px 20px'}}>
            <div style={{fontSize:16,fontWeight:700,marginBottom:16}}>Filters</div>

            {/* Row 1 — 5 equal columns */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14,marginBottom:14}}>
              {/* Search */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Search</span>
                <div style={{position:'relative'}}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                  <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by name, email, ID…"
                    style={{width:'100%',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,padding:'8px 10px 8px 30px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',boxSizing:'border-box' as const,height:38}}/>
                </div>
              </div>
              {/* User Type */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>User Type</span>
                <div style={{position:'relative'}}>
                  <select value={userType} onChange={e=>{setUserType(e.target.value);setPage(1);}}
                    style={{appearance:'none',width:'100%',height:38,padding:'0 28px 0 10px',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,color:'rgba(255,255,255,0.75)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {USER_TYPES.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              {/* Subscription Plan */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Subscription Plan</span>
                <div style={{position:'relative'}}>
                  <select value={plan} onChange={e=>{setPlan(e.target.value);setPage(1);}}
                    style={{appearance:'none',width:'100%',height:38,padding:'0 28px 0 10px',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,color:'rgba(255,255,255,0.75)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {ALL_PLANS.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              {/* Subscription Status */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Subscription Status</span>
                <div style={{position:'relative'}}>
                  <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}
                    style={{appearance:'none',width:'100%',height:38,padding:'0 28px 0 10px',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,color:'rgba(255,255,255,0.75)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {ALL_STATUS.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              {/* Billing Cycle */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Billing Cycle</span>
                <div style={{position:'relative'}}>
                  <select value={cycle} onChange={e=>{setCycle(e.target.value);setPage(1);}}
                    style={{appearance:'none',width:'100%',height:38,padding:'0 28px 0 10px',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,color:'rgba(255,255,255,0.75)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {BILL_CYCLE.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
            </div>

            {/* Row 2 — 5 equal columns */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:14,marginBottom:16}}>
              {/* Department (Aspirant) */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Department (Aspirant)</span>
                <div style={{position:'relative'}}>
                  <select style={{appearance:'none',width:'100%',height:38,padding:'0 28px 0 10px',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,color:'rgba(255,255,255,0.75)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {['All Departments','Acting','Direction','Dancing','Singing','Modelling','Hair & Make Up','Costume','Stunt','Sound & Music','Camera & Lighting','Editorial','Visual Effects','Dubbing','Story','Television'].map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              {/* Agency Type */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Agency Type</span>
                <div style={{position:'relative'}}>
                  <select style={{appearance:'none',width:'100%',height:38,padding:'0 28px 0 10px',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,color:'rgba(255,255,255,0.75)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {['All Types','Casting Agency','Ad Agency','OTT Studio','Production House','Event Production'].map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              {/* Payment Method */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Payment Method</span>
                <div style={{position:'relative'}}>
                  <select value={payMethod} onChange={e=>{setPayMethod(e.target.value);setPage(1);}}
                    style={{appearance:'none',width:'100%',height:38,padding:'0 28px 0 10px',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,color:'rgba(255,255,255,0.75)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {PAY_METHODS.map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              {/* Subscription Source */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Subscription Source</span>
                <div style={{position:'relative'}}>
                  <select style={{appearance:'none',width:'100%',height:38,padding:'0 28px 0 10px',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,color:'rgba(255,255,255,0.75)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                    {['All Sources','Direct','Referral','Promo Code'].map(o=><option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                </div>
              </div>
              {/* Date Range */}
              <div style={{display:'flex',flexDirection:'column' as const,gap:6}}>
                <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Date Range</span>
                <div style={{display:'flex',alignItems:'center',gap:7,padding:'0 10px',background:BG4,border:'1px solid rgba(255,255,255,0.09)',borderRadius:7,fontSize:14,color:'rgba(255,255,255,0.6)',cursor:'pointer',height:38}}>
                  📅 May 15 – May 21, 2025
                </div>
              </div>
            </div>

            {/* Filter action buttons */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:4,borderTop:'1px solid rgba(255,255,255,0.06)'}}>
              <button onClick={clearFilters}
                style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',background:'transparent',border:'1px solid rgba(255,255,255,0.12)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
                <X size={13}/> Clear Filters
              </button>
              <button onClick={()=>showToast('Filters applied')}
                style={{display:'flex',alignItems:'center',gap:7,padding:'8px 22px',background:RED,border:'none',borderRadius:7,color:'#fff',fontFamily:BEBAS,fontSize:18,letterSpacing:1,cursor:'pointer'}}>
                <Filter size={13}/> Apply Filters
              </button>
            </div>
          </div>

          {/* ── TABLE + RIGHT PANEL ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:14,minWidth:0}}>

            {/* Subscriptions Table */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden',minWidth:0}}>
              {/* Toolbar */}
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                <span style={{fontSize:16,fontWeight:700,flex:1}}>
                  Subscriptions
                  <span style={{marginLeft:8,background:'rgba(239,68,68,0.15)',color:RED,border:'1px solid rgba(239,68,68,0.25)',borderRadius:12,fontSize:14,fontWeight:700,padding:'2px 9px'}}>{filtered.length.toLocaleString()}</span>
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
              <div style={{display:'grid',gridTemplateColumns:'36px 1.8fr 0.9fr 1.3fr 0.8fr 0.8fr 0.75fr 0.9fr 1fr 1fr 1.1fr 60px',padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',gap:6}}>
                <div onClick={toggleAll} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                  {allSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.3)"/>}
                </div>
                {['Subscription ID','User / Agency','User Type','Department / Role','Plan','Billing Cycle','Amount','Status','Start Date','Next Renewal','Payment Method','Actions'].map(h=>(
                  <div key={h} style={{fontSize:14,fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:0.3,lineHeight:1.3}}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {paged.length===0?(
                <div style={{padding:'36px 18px',textAlign:'center',color:'rgba(255,255,255,0.35)',fontSize:15}}>No subscriptions match your filters.</div>
              ):paged.map((s,i)=>{
                const isSel=selected.includes(s.id);
                return(
                  <div key={s.id}
                    style={{display:'grid',gridTemplateColumns:'36px 1.8fr 0.9fr 1.3fr 0.8fr 0.8fr 0.75fr 0.9fr 1fr 1fr 1.1fr 60px',padding:'10px 14px',borderBottom:i<paged.length-1?'1px solid rgba(255,255,255,0.04)':'none',alignItems:'center',gap:6,background:isSel?'rgba(239,68,68,0.05)':'transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='rgba(255,255,255,0.02)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isSel?'rgba(239,68,68,0.05)':'transparent';}}
                  >
                    <div onClick={()=>toggleSel(s.id)} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                      {isSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.25)"/>}
                    </div>
                    {/* User */}
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:RED,marginBottom:1}}>{s.id}</div>
                      <div style={{display:'flex',alignItems:'center',gap:7,marginTop:3}}>
                        <div style={{width:26,height:26,borderRadius:'50%',background:s.avatarBg,border:`1px solid ${s.avatarColor}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:s.avatarColor,flexShrink:0}}>{s.avatar}</div>
                        <div>
                          <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5'}}>{s.name}</div>
                          <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{s.email}</div>
                        </div>
                      </div>
                    </div>
                    {/* User type */}
                    <span style={{fontSize:14,fontWeight:700,padding:'3px 8px',borderRadius:5,background:USER_BG[s.userType]||'rgba(255,255,255,0.08)',color:USER_COLOR[s.userType]||'#F5F5F5',border:`1px solid ${USER_COLOR[s.userType]||'rgba(255,255,255,0.2)'}33`,whiteSpace:'nowrap' as const,display:'inline-block'}}>{s.userType}</span>
                    {/* Category */}
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.65)'}}>{s.userType==='Aspirant'&&s.department ? `${s.department} → ${s.role}` : s.userType}</div>
                    {/* Plan */}
                    <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5'}}>{s.plan}</div>
                    {/* Cycle */}
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.65)'}}>{s.cycle}</div>
                    {/* Amount */}
                    <div style={{fontSize:14,fontWeight:700,color:GREEN}}>{s.amount}</div>
                    {/* Status */}
                    <span style={{fontSize:14,fontWeight:700,padding:'3px 8px',borderRadius:5,background:STATUS_BG[s.status]||'rgba(255,255,255,0.08)',color:STATUS_COLOR[s.status]||'#F5F5F5',border:`1px solid ${STATUS_COLOR[s.status]||'rgba(255,255,255,0.2)'}33`,whiteSpace:'nowrap' as const,display:'inline-block'}}>{s.status}</span>
                    {/* Start */}
                    <div>
                      <div style={{fontSize: 14}}>{s.start}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{s.startTime}</div>
                    </div>
                    {/* Renewal */}
                    <div>
                      <div style={{fontSize: 14}}>{s.renewal}</div>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{s.renewalTime}</div>
                    </div>
                    {/* Payment */}
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.65)',display:'flex',alignItems:'center',gap:5}}>
                      {s.payment==='UPI'&&<span style={{fontSize:14,fontWeight:800,color:PURPLE,background:'rgba(139,92,246,0.15)',borderRadius:4,padding:'1px 5px',border:'1px solid rgba(139,92,246,0.25)'}}>UPI</span>}
                      {s.payment!=='UPI'&&<CreditCard size={12} color="rgba(255,255,255,0.35)"/>}
                      {s.payment!=='UPI'&&<span>{s.payment}</span>}
                    </div>
                    {/* Actions */}
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      <button onClick={()=>setViewSub(s)} title="View"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Eye size={12} color={BLUE}/>
                      </button>
                      <button onClick={()=>showToast(`${s.id} updated`)} title="Edit"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(212,166,74,0.12)',border:'1px solid rgba(212,166,74,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Edit2 size={12} color={GOLD}/>
                      </button>
                      <button onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setMenuPos({top:r.bottom+4,right:window.innerWidth-r.right});setMenuId(menuId===s.id?'':s.id);}}
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

              {/* Subscription Summary */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>Subscription Summary</div>
                <div style={{display:'flex',flexDirection:'column',gap:9}}>
                  {SUMMARY.map((s,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:8,height:8,borderRadius:'50%',background:s.color}}/>
                        <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{s.label}</span>
                      </div>
                      <div style={{textAlign:'right' as const}}>
                        <span style={{fontSize:14,fontWeight:700,color:'#F5F5F5'}}>{s.value}</span>
                        <span style={{fontSize:14,color:'rgba(255,255,255,0.4)',marginLeft:5}}>({s.pct})</span>
                      </div>
                    </div>
                  ))}
                  <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:9,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:14,fontWeight:700}}>Total</span>
                    <span style={{fontSize:15,fontWeight:800}}>2,548</span>
                  </div>
                </div>
              </div>

              {/* Subscriptions by Plan */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>Subscriptions by Plan</div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
                  <DonutChart data={PLAN_DATA} total="2,548" size={148}/>
                  <div style={{width:'100%',display:'flex',flexDirection:'column',gap:7}}>
                    {PLAN_DATA.map(d=>(
                      <div key={d.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <div style={{display:'flex',alignItems:'center',gap:6}}>
                          <div style={{width:8,height:8,borderRadius:'50%',background:d.color}}/>
                          <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
                        </div>
                        <span style={{fontSize:14,fontWeight:700}}>{d.pct}% <span style={{color:'rgba(255,255,255,0.4)',fontWeight:400}}>({d.value})</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revenue Overview MTD */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>Revenue Overview (MTD)</div>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {[
                    {label:'Total Revenue',           value:'₹18,75,320', delta:'+22.4% from last month', color:GREEN},
                    {label:'Successful Transactions',  value:'1,856',       delta:'+18.6%',               color:BLUE},
                    {label:'Avg. Transaction Value',   value:'₹1,011',      delta:'+3.8%',                color:GOLD},
                  ].map((r,i)=>(
                    <div key={i} style={{padding:'10px',background:BG4,borderRadius:8,border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div style={{fontSize:14,color:'rgba(255,255,255,0.45)',marginBottom:4}}>{r.label}</div>
                      <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1,color:'#F5F5F5',lineHeight:1}}>{r.value}</div>
                      <div style={{display:'flex',alignItems:'center',gap:4,marginTop:4}}>
                        <TrendingUp size={11} color={r.color}/>
                        <span style={{fontSize:14,color:r.color,fontWeight:700}}>{r.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>Quick Actions</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {[
                    {icon:Plus,     label:'Add Subscription',  color:ORANGE, action:()=>setShowAddSub(true)},
                    {icon:Edit2,    label:'Manage Plans',       color:BLUE,   action:()=>setShowManagePlans(true)},
                    {icon:History,  label:'Payment History',    color:PURPLE, action:()=>setShowPayHistory(true)},
                    {icon:RotateCcw,label:'Renewal Settings',   color:GREEN,  action:()=>setShowRenewal(true)},
                  ].map(({icon:Icon,label,color,action})=>(
                    <button key={label} onClick={action}
                      style={{display:'flex',flexDirection:'column' as const,alignItems:'center',gap:7,padding:'12px 8px',background:BG4,border:'1px solid rgba(255,255,255,0.06)',borderRadius:8,cursor:'pointer',color:'#F5F5F5',fontFamily:BARLOW,fontSize: 14}}
                      onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                      onMouseLeave={e=>(e.currentTarget.style.background=BG4)}
                    >
                      <div style={{width:34,height:34,borderRadius:8,background:`${color}20`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <Icon size={15} color={color}/>
                      </div>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW CONTEXT MENU ── */}
      {menuId&&(
        <>
          <div onClick={()=>setMenuId('')} style={{position:'fixed',inset:0,zIndex:300}}/>
          <div style={{position:'fixed',top:menuPos.top,right:menuPos.right,width:210,background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,overflow:'hidden',zIndex:400,boxShadow:'0 8px 24px rgba(0,0,0,0.6)'}}>
            {[
              {label:'View Details',          color:'#F5F5F5', action:()=>{const s=SUBSCRIPTIONS.find(x=>x.id===menuId);if(s)setViewSub(s);setMenuId('');}},
              {label:'Edit Subscription',     color:GOLD,      action:()=>{showToast('Edit opened');setMenuId('');}},
              {label:'Send Renewal Reminder', color:BLUE,      action:()=>{showToast('Reminder sent');setMenuId('');}},
              {label:'Extend by 30 Days',     color:GREEN,     action:()=>{showToast('Extended by 30 days');setMenuId('');}},
              {label:'Cancel Subscription',   color:RED,       action:()=>{showToast('Subscription cancelled');setMenuId('');}},
              {label:'View User Profile',     color:PURPLE,    action:()=>{const s=SUBSCRIPTIONS.find(x=>x.id===menuId);if(s)router.push(`/agency/applications/${s.id}`);setMenuId('');}},
            ].map(({label,color,action})=>(
              <div key={label} onClick={action}
                style={{display:'flex',alignItems:'center',gap:9,padding:'10px 15px',fontSize:14,cursor:'pointer',color}}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
              >{label}</div>
            ))}
          </div>
        </>
      )}

      {/* ── VIEW SUBSCRIPTION MODAL ── */}
      {viewSub&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,width:'100%',maxWidth:580,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <div>
                <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>SUBSCRIPTION DETAILS</div>
                <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewSub.id}</div>
              </div>
              <button onClick={()=>setViewSub(null)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <div style={{padding:'20px 22px',display:'flex',flexDirection:'column',gap:14}}>
              {/* Status + plan badges */}
              <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:STATUS_BG[viewSub.status],color:STATUS_COLOR[viewSub.status],border:`1px solid ${STATUS_COLOR[viewSub.status]}33`}}>{viewSub.status}</span>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:'rgba(212,166,74,0.12)',color:GOLD,border:'1px solid rgba(212,166,74,0.25)'}}>{viewSub.plan}</span>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:USER_BG[viewSub.userType]||'rgba(255,255,255,0.08)',color:USER_COLOR[viewSub.userType]||'#F5F5F5',border:`1px solid ${USER_COLOR[viewSub.userType]||'rgba(255,255,255,0.2)'}33`}}>{viewSub.userType}</span>
              </div>
              {/* User card */}
              <div style={{background:BG3,borderRadius:10,padding:'14px',display:'flex',gap:14,alignItems:'center'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:viewSub.avatarBg,border:`1px solid ${viewSub.avatarColor}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:800,color:viewSub.avatarColor,flexShrink:0}}>{viewSub.avatar}</div>
                <div>
                  <div style={{fontSize:16,fontWeight:700}}>{viewSub.name}</div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewSub.email}</div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewSub.userType==='Aspirant'&&viewSub.department ? `${viewSub.department} → ${viewSub.role}` : '—'}</div>
                </div>
              </div>
              {/* Details */}
              {[
                {label:'Subscription ID',  value:viewSub.id},
                {label:'Plan',             value:`${viewSub.plan} — ${viewSub.cycle}`},
                {label:'Amount',           value:viewSub.amount},
                {label:'Payment Method',   value:viewSub.payment},
                {label:'Start Date',       value:`${viewSub.start} at ${viewSub.startTime}`},
                {label:'Next Renewal',     value:`${viewSub.renewal} at ${viewSub.renewalTime}`},
              ].map(({label,value})=>(
                <div key={label} style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:8,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{label}</span>
                  <span style={{fontSize:15,color:label==='Amount'?GREEN:'#F5F5F5',fontWeight:label==='Amount'?700:500}}>{value}</span>
                </div>
              ))}
              {/* Actions */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:4}}>
                <button onClick={()=>{showToast('Renewal reminder sent');setViewSub(null);}}
                  style={{padding:'10px',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:8,color:BLUE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Bell size={14}/> Remind
                </button>
                <button onClick={()=>{showToast('Extended by 30 days');setViewSub(null);}}
                  style={{padding:'10px',background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.25)',borderRadius:8,color:GREEN,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Calendar size={14}/> Extend
                </button>
                <button onClick={()=>{showToast('Subscription cancelled');setViewSub(null);}}
                  style={{padding:'10px',background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,color:RED,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <XCircle size={14}/> Cancel
                </button>
              </div>
              <button onClick={()=>setViewSub(null)} style={{padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── GENERIC MODALS (Add Subscription / Manage Plans / Payment History / Renewal Settings) ── */}
      {[
        { show:showAddSub,     onClose:()=>setShowAddSub(false),     title:'ADD SUBSCRIPTION',    fields:[{l:'User / Agency',opts:['Select User']},{l:'Plan',opts:['Basic','Premium','Pro','Agency Pro','Enterprise']},{l:'Billing Cycle',opts:['Monthly','Quarterly','Annual']},{l:'Payment Method',opts:PAY_METHODS}] },
        { show:showManagePlans,onClose:()=>setShowManagePlans(false), title:'MANAGE PLANS',        fields:[{l:'Plan Name',opts:['Basic','Premium','Pro','Agency Pro','Enterprise']},{l:'Billing Cycle',opts:['Monthly','Quarterly','Annual']},{l:'Status',opts:['Active','Inactive']}] },
        { show:showRenewal,    onClose:()=>setShowRenewal(false),     title:'RENEWAL SETTINGS',   fields:[{l:'Auto Renewal',opts:['Enabled','Disabled']},{l:'Reminder Days Before',opts:['3 Days','7 Days','14 Days','30 Days']},{l:'Grace Period',opts:['No Grace Period','3 Days','7 Days']}] },
      ].map(({show,onClose,title,fields})=>show&&(
        <div key={title} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:420}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>{title}</div>
              <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            {fields.map(f=>(
              <div key={f.l} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>{f.l}</label>
                <select style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,outline:'none'}}>
                  {f.opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button onClick={onClose} style={{flex:1,padding:11,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{showToast(`${title.toLowerCase()} saved`);onClose();}}
                style={{flex:2,padding:11,background:RED,border:'none',borderRadius:7,color:'#fff',fontFamily:BEBAS,fontSize:20,letterSpacing:1,cursor:'pointer'}}>Save</button>
            </div>
          </div>
        </div>
      ))}

      {/* ── PAYMENT HISTORY MODAL ── */}
      {showPayHistory&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:560,maxHeight:'80vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>PAYMENT HISTORY</div>
              <button onClick={()=>setShowPayHistory(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            {SUBSCRIPTIONS.slice(0,6).map((s,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:34,height:34,borderRadius:8,background:s.avatarBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:s.avatarColor,flexShrink:0}}>{s.avatar}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600}}>{s.name}</div>
                    <div style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>{s.start} · {s.payment}</div>
                  </div>
                </div>
                <div style={{textAlign:'right' as const}}>
                  <div style={{fontSize:15,fontWeight:700,color:GREEN}}>{s.amount}</div>
                  <span style={{fontSize:14,fontWeight:700,padding:'2px 7px',borderRadius:4,background:STATUS_BG[s.status],color:STATUS_COLOR[s.status]}}>{s.status}</span>
                </div>
              </div>
            ))}
            <button onClick={()=>setShowPayHistory(false)} style={{width:'100%',marginTop:16,padding:11,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}

      {/* ── EXPORT MODAL ── */}
      {showExport&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:400}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>EXPORT SUBSCRIPTIONS</div>
              <button onClick={()=>setShowExport(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            {[
              {l:'Format',     opts:['Excel Spreadsheet','PDF Report','CSV File']},
              {l:'Include',    opts:['All Subscriptions','Active Only','Expiring Soon','Expired']},
              {l:'Date Range', opts:['Last 7 Days','Last 30 Days','All Time','Custom Range']},
            ].map(f=>(
              <div key={f.l} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>{f.l}</label>
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

      {/* ── TOAST ── */}
      {toast&&(
        <div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',background:BG2,border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,padding:'12px 22px',fontSize:15,fontWeight:600,color:'#F5F5F5',zIndex:600,boxShadow:'0 4px 24px rgba(0,0,0,0.5)',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>
          <CheckSquare size={15} color={GREEN}/> {toast}
        </div>
      )}

    </div>
  );
}