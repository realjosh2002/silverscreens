'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard,
  Database, Settings, ScrollText, Bell, ChevronRight,
  TrendingUp, Download, UserCheck, MoreVertical,
  BellRing, Ticket, KeyRound, ChevronLeft, Menu,
  ChevronDown, Eye, Search, Filter, X, Info,
  Plus, Edit2, CheckSquare, Square, Upload,
  Monitor, MousePointer, Activity, Image, Play,
  Clock, Check, XCircle, Sliders,
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
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'                      },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                          },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'            },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'            },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'                   },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'                        },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                          },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'                  },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements', active: true   },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                            },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'                  },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'                      },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'                        },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                          },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                          },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'                       },
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
  { label: 'Total Advertisements', value: '42',     sub: 'Active & Inactive',   color: PURPLE, Icon: Megaphone     },
  { label: 'Active Ads',           value: '28',     sub: 'Currently Running',   color: GREEN,  Icon: Check         },
  { label: 'Total Impressions',    value: '1.24M',  sub: 'This Month',          color: BLUE,   Icon: Eye           },
  { label: 'Total Clicks',         value: '18,742', sub: 'This Month',          color: ORANGE, Icon: MousePointer  },
  { label: 'Click Through Rate',   value: '1.52%',  sub: 'This Month',          color: TEAL,   Icon: Activity      },
];

/* ─── Chart data ─────────────────────────────────────────────── */
const CHART_LABELS = ['01 Jun','08 Jun','15 Jun','22 Jun','30 Jun'];
const IMPRESSIONS  = [8200, 14500, 18000, 22000, 28000];
const CLICKS_DATA  = [420,  980,   1200,  1650,  2100];

/* ─── Placement donut ────────────────────────────────────────── */
const PLACEMENT_DATA = [
  { label: 'Homepage Top Banner', value: 12, pct: 28.6, color: BLUE   },
  { label: 'Sidebar',             value: 8,  pct: 19.0, color: PURPLE },
  { label: 'Dashboard',           value: 6,  pct: 14.3, color: ORANGE },
  { label: 'All Pages Bottom',    value: 10, pct: 23.8, color: GREEN  },
  { label: 'Others',              value: 6,  pct: 14.3, color: TEAL   },
];

/* ─── Top performing ads ─────────────────────────────────────── */
const TOP_ADS = [
  { rank: 1, name: 'Premium Agency Plan',  ctr: '1.68%', clicks: '4,125', type: 'PM' },
  { rank: 2, name: 'Upgrade to Premium',   ctr: '1.99%', clicks: '4,155', type: 'PM' },
  { rank: 3, name: 'Find Your Next Star',  ctr: '1.60%', clicks: '2,984', type: 'PM' },
];

/* ─── Advertisements table ───────────────────────────────────── */
const ADS = [
  { id:'AD-2026-042', name:'Premium Agency Plan',       placement:'Homepage Top Banner',    type:'Image Banner', status:'Active',           impressions:'245,680', clicks:'4,125', ctr:'1.68%', start:'01 Jun 2026', end:'30 Jun 2026', creator:'Admin'        },
  { id:'AD-2026-041', name:'Find Your Next Star',       placement:'Casting Calls Sidebar',  type:'Image Banner', status:'Active',           impressions:'186,542', clicks:'2,984', ctr:'1.60%', start:'01 Jun 2026', end:'30 Jun 2026', creator:'Admin'        },
  { id:'AD-2026-040', name:'Talent Showcase 2026',      placement:'Dashboard Below Stats',  type:'Video Ad',     status:'Active',           impressions:'128,943', clicks:'2,350', ctr:'1.82%', start:'25 May 2026', end:'25 Jun 2026', creator:'Priya Sharma' },
  { id:'AD-2026-039', name:'SilverScreens Mobile App',  placement:'Mobile App Splash',      type:'Image Banner', status:'Scheduled',        impressions:'0',       clicks:'0',     ctr:'0%',    start:'28 Jun 2026', end:'15 Jul 2026', creator:'Admin'        },
  { id:'AD-2026-038', name:'Post Unlimited Casting Calls',placement:'Agency Dashboard Top', type:'Image Banner', status:'Active',           impressions:'315,269', clicks:'5,632', ctr:'1.79%', start:'20 May 2026', end:'20 Jun 2026', creator:'Admin'        },
  { id:'AD-2026-037', name:'Webinar: Casting Secrets',  placement:'All Pages Bottom Banner',type:'Image Banner', status:'Expired',          impressions:'142,638', clicks:'1,896', ctr:'1.33%', start:'01 May 2026', end:'15 May 2026', creator:'Rahul Mehta'  },
  { id:'AD-2026-036', name:'Upgrade to Premium',        placement:'Subscription Page',      type:'Image Banner', status:'Active',           impressions:'209,354', clicks:'4,155', ctr:'1.99%', start:'10 May 2026', end:'10 Jun 2026', creator:'Admin'        },
  { id:'AD-2026-035', name:'Aspirant Profile Boost',    placement:'Explore Talents Page',   type:'Image Banner', status:'Draft',            impressions:'0',       clicks:'0',     ctr:'0%',    start:'—',           end:'—',           creator:'Admin'        },
  { id:'AD-2026-034', name:'Agency Starter Pack',       placement:'Homepage Sidebar',       type:'Video Ad',     status:'Pending Approval', impressions:'0',       clicks:'0',     ctr:'0%',    start:'01 Jul 2026', end:'31 Jul 2026', creator:'Admin'        },
  { id:'AD-2026-033', name:'Casting Calls Promo',       placement:'Casting Calls Top',      type:'Image Banner', status:'Rejected',         impressions:'0',       clicks:'0',     ctr:'0%',    start:'—',           end:'—',           creator:'Arjun M.'     },
  { id:'AD-2026-032', name:'Featured Talent Banner',    placement:'Landing Page Hero',      type:'Image Banner', status:'Active',           impressions:'398,210', clicks:'6,102', ctr:'1.53%', start:'01 Jun 2026', end:'30 Jun 2026', creator:'Admin'        },
  { id:'AD-2026-031', name:'Become a Pro Member',       placement:'All Pages Top',          type:'Image Banner', status:'Scheduled',        impressions:'0',       clicks:'0',     ctr:'0%',    start:'05 Jul 2026', end:'05 Aug 2026', creator:'Admin'        },
];

const TABS = ['All Advertisements','Active','Scheduled','Expired','Draft','Pending Approval','Rejected'];
const PLACEMENTS = ['All Placements','Homepage Top Banner','Casting Calls Sidebar','Dashboard Below Stats','Mobile App Splash','Agency Dashboard Top','All Pages Bottom Banner','Subscription Page','Explore Talents Page'];
const AD_TYPES   = ['All Types','Image Banner','Video Ad','Text Ad'];
const AD_STATUS  = ['All Status','Active','Scheduled','Expired','Draft','Pending Approval','Rejected'];

const STATUS_COLOR: Record<string,string> = { Active: GREEN, Scheduled: BLUE, Expired: RED, Draft: ORANGE, 'Pending Approval': GOLD, Rejected: PURPLE };
const STATUS_BG:    Record<string,string> = { Active: 'rgba(34,197,94,0.12)', Scheduled: 'rgba(59,130,246,0.12)', Expired: 'rgba(239,68,68,0.12)', Draft: 'rgba(249,115,22,0.12)', 'Pending Approval': 'rgba(212,166,74,0.12)', Rejected: 'rgba(139,92,246,0.12)' };
const TYPE_COLOR:   Record<string,string> = { 'Image Banner': BLUE, 'Video Ad': PURPLE, 'Text Ad': TEAL };
const TYPE_BG:      Record<string,string> = { 'Image Banner': 'rgba(59,130,246,0.15)', 'Video Ad': 'rgba(139,92,246,0.15)', 'Text Ad': 'rgba(20,184,166,0.15)' };

const PER_PAGE = 7;

/* ─── SVG Performance Chart ──────────────────────────────────── */
function PerfChart() {
  const W=300,H=160,pl=36,pb=130,pr=W-8,pt=14;
  const pw=pr-pl,ph=pb-pt;
  const maxI=30000, maxC=2500;
  const mx=(i:number)=>pl+(i/(CHART_LABELS.length-1))*pw;
  const myI=(v:number)=>pb-(v/maxI)*ph;
  const myC=(v:number)=>pb-(v/maxC)*ph;
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
  const ptsI:[number,number][]=IMPRESSIONS.map((v,i)=>[mx(i),myI(v)]);
  const ptsC:[number,number][]=CLICKS_DATA.map((v,i)=>[mx(i),myC(v)]);
  const gridY=[0,10000,20000,30000];
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'100%',overflow:'visible'}}>
      <defs>
        <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity={0.2}/>
          <stop offset="100%" stopColor={BLUE} stopOpacity={0.01}/>
        </linearGradient>
      </defs>
      {gridY.map(v=>(
        <g key={v}>
          <line x1={pl} y1={myI(v)} x2={pr} y2={myI(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} strokeDasharray="3 3"/>
          <text x={pl-4} y={myI(v)+4} fill="rgba(255,255,255,0.25)" fontSize={9} textAnchor="end" fontFamily={BARLOW}>{v===0?'0':`${v/1000}K`}</text>
        </g>
      ))}
      <line x1={pl} y1={pb} x2={pr} y2={pb} stroke="rgba(255,255,255,0.07)" strokeWidth={1}/>
      {CHART_LABELS.map((l,i)=><text key={i} x={mx(i)} y={pb+14} fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="middle" fontFamily={BARLOW}>{l}</text>)}
      <path d={`${smooth(ptsI)} L ${ptsI[ptsI.length-1][0]} ${pb} L ${ptsI[0][0]} ${pb} Z`} fill="url(#ig)"/>
      <path d={smooth(ptsI)} fill="none" stroke={BLUE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
      <path d={smooth(ptsC)} fill="none" stroke={GREEN} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 2"/>
      {ptsI.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={3} fill={BLUE} stroke={BG3} strokeWidth={1.5}/>)}
      {ptsC.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={3} fill={GREEN} stroke={BG3} strokeWidth={1.5}/>)}
    </svg>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────── */
function DonutChart({data,total,size=130}:{data:{label:string;pct:number;color:string}[];total:string;size?:number}){
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
      <text x={cx} y={cy+10} textAnchor="middle" fill="#F5F5F5" fontSize={size*0.14} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
    </svg>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function AdvertisementManagementPage(){
  const router=useRouter();
  const[sidebarOpen,setSidebarOpen]=useState(false);
  const[profileOpen,setProfileOpen]=useState(false);
  const[activeTab,setActiveTab]=useState('All Advertisements');
  const[search,setSearch]=useState('');
  const[placement,setPlacement]=useState('All Placements');
  const[adType,setAdType]=useState('All Types');
  const[adStatus,setAdStatus]=useState('All Status');
  const[selected,setSelected]=useState<string[]>([]);
  const[page,setPage]=useState(1);
  const[menuId,setMenuId]=useState('');
  const[menuPos,setMenuPos]=useState({top:0,right:0});
  const[viewAd,setViewAd]=useState<typeof ADS[0]|null>(null);
  const[showCreate,setShowCreate]=useState(false);
  const[showUpload,setShowUpload]=useState(false);
  const[showSettings,setShowSettings]=useState(false);
  const[showFilters,setShowFilters]=useState(false);
  const[chartPeriod,setChartPeriod]=useState('This Month');
  const[toast,setToast]=useState('');

  const SB_W=sidebarOpen?220:52;
  const showToast=(msg:string)=>{setToast(msg);setTimeout(()=>setToast(''),2800);};

  const filtered=ADS.filter(a=>{
    const q=search.toLowerCase();
    const ms=!q||a.name.toLowerCase().includes(q)||a.id.toLowerCase().includes(q)||a.placement.toLowerCase().includes(q)||a.creator.toLowerCase().includes(q);
    const tab=activeTab==='All Advertisements'||a.status===activeTab;
    const mp=placement==='All Placements'||a.placement===placement;
    const mt=adType==='All Types'||a.type===adType;
    const mst=adStatus==='All Status'||a.status===adStatus;
    return ms&&tab&&mp&&mt&&mst;
  });
  const totalPages=Math.max(1,Math.ceil(filtered.length/PER_PAGE));
  const paged=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const allSel=paged.length>0&&paged.every(a=>selected.includes(a.id));
  const toggleSel=(id:string)=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const toggleAll=()=>setSelected(allSel?selected.filter(id=>!paged.find(a=>a.id===id)):[...new Set([...selected,...paged.map(a=>a.id)])]);

  /* tab counts */
  const tabCount=(tab:string)=>tab==='All Advertisements'?ADS.length:ADS.filter(a=>a.status===tab).length;

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
          <input placeholder="Search ads by name, placement or creator…"
            style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,padding:'8px 40px 8px 34px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',boxSizing:'border-box' as const}}/>
          <span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',fontSize: 14,color:'rgba(255,255,255,0.25)',background:BG4,borderRadius:4,padding:'1px 6px',border:'1px solid rgba(255,255,255,0.1)'}}>⌘K</span>
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
          {profileOpen&&(
            <>
              <div onClick={()=>setProfileOpen(false)} style={{position:'fixed',inset:0,zIndex:150}}/>
              <div style={{position:'absolute',top:46,right:0,width:210,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,overflow:'hidden',zIndex:200,boxShadow:'0 8px 32px rgba(0,0,0,0.6)'}}>
                <div style={{padding:'10px 16px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',justifyContent:'space-between'}}>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.4)'}}>Admin ID</span>
                  <span style={{fontSize:15,fontWeight:700,color:RED}}>ADM000001</span>
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
        <aside style={{width:SB_W,flexShrink:0,background:BG2,borderRight:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',overflowY:'auto',overflowX:'hidden',transition:'width 0.2s ease',scrollbarWidth:'none' as const}}>
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
          <nav style={{flex:1,padding:sidebarOpen?'8px 6px':'8px 4px',overflowY:'auto',scrollbarWidth:'none' as const}}>
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
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:15,color:'rgba(255,255,255,0.4)',marginBottom:6}}>
                <span style={{cursor:'pointer'}} onClick={()=>router.push('/admin/dashboard')}>Home</span>
                <ChevronRight size={12}/>
                <span style={{color:'#F5F5F5'}}>Advertisement Management</span>
              </div>
              <h1 style={{fontFamily:BARLOW,fontSize:28,fontWeight:800,margin:0,display:'flex',alignItems:'center',gap:6}}>
                Advertisement Management
                <span style={{width:7,height:7,borderRadius:'50%',background:RED,display:'inline-block',marginBottom:2}}/>
              </h1>
              <p style={{fontSize:15,color:'rgba(255,255,255,0.45)',margin:'4px 0 0'}}>Create, manage and monitor advertisements displayed across the platform.</p>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center',marginTop:28,flexShrink:0}}>
              <button onClick={()=>setShowCreate(true)}
                style={{display:'flex',alignItems:'center',gap:7,padding:'9px 16px',background:RED,border:'none',borderRadius:8,color:'#fff',fontFamily:BEBAS,fontSize:18,letterSpacing:1,cursor:'pointer'}}>
                <Plus size={15}/> Create Advertisement
              </button>
              <button onClick={()=>setShowUpload(true)}
                style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>
                <Upload size={14}/> Upload Banner
              </button>
              <button onClick={()=>setShowSettings(true)}
                style={{display:'flex',alignItems:'center',gap:7,padding:'9px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>
                <Sliders size={14}/> Ad Settings
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
                  <div style={{fontSize:15,color:'rgba(255,255,255,0.5)',marginBottom:3}}>{s.label}</div>
                  <div style={{fontFamily:BEBAS,fontSize:28,letterSpacing:1,lineHeight:1}}>{s.value}</div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.4)',marginTop:3}}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── TABS ── */}
          <div style={{display:'flex',gap:0,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
            {TABS.map(tab=>(
              <button key={tab} onClick={()=>{setActiveTab(tab);setPage(1);}}
                style={{padding:'10px 16px',background:'none',border:'none',borderBottom:activeTab===tab?`2px solid ${RED}`:'2px solid transparent',color:activeTab===tab?'#F5F5F5':'rgba(255,255,255,0.45)',fontFamily:BARLOW,fontSize:15,fontWeight:activeTab===tab?700:400,cursor:'pointer',marginBottom:-1,transition:'color 0.15s',display:'flex',alignItems:'center',gap:6}}>
                {tab}
                {tabCount(tab)>0&&(
                  <span style={{fontSize: 14,background:activeTab===tab?'rgba(239,68,68,0.2)':'rgba(255,255,255,0.08)',color:activeTab===tab?RED:'rgba(255,255,255,0.4)',borderRadius:10,padding:'0 7px'}}>
                    {tabCount(tab)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── TABLE + RIGHT PANEL ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 270px',gap:14,minWidth:0}}>

            {/* Ads Table */}
            <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',overflow:'hidden',minWidth:0}}>

              {/* Search + filter bar */}
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.06)',flexWrap:'wrap' as const}}>
                <div style={{position:'relative',flex:1,minWidth:180}}>
                  <Search size={14} color="rgba(255,255,255,0.3)" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)'}}/>
                  <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search ads by name, placement or creator…"
                    style={{width:'100%',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:7,padding:'8px 10px 8px 30px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,outline:'none',boxSizing:'border-box' as const}}/>
                </div>
                {[
                  {val:placement,set:setPlacement,opts:PLACEMENTS},
                  {val:adType,   set:setAdType,   opts:AD_TYPES},
                  {val:adStatus, set:setAdStatus,  opts:AD_STATUS},
                ].map((f,i)=>(
                  <div key={i} style={{position:'relative'}}>
                    <select value={f.val} onChange={e=>{f.set(e.target.value);setPage(1);}}
                      style={{appearance:'none',padding:'8px 26px 8px 10px',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:7,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                      {f.opts.map(o=><option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={11} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:7,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                  </div>
                ))}
                <button onClick={()=>setShowFilters(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 13px',background:BG4,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'#F5F5F5',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
                  <Filter size={13}/> Filters
                </button>
              </div>

              {/* Column headers */}
              <div style={{display:'grid',gridTemplateColumns:'36px minmax(0,2fr) minmax(0,1.2fr) 110px 100px 95px 68px 60px 110px 84px',padding:'10px 12px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',gap:6}}>
                <div onClick={toggleAll} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                  {allSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.3)"/>}
                </div>
                {['Advertisement','Placement','Type','Status','Impressions','Clicks','CTR','Start / End Date','Actions'].map(h=>(
                  <div key={h} style={{fontSize: 14,fontWeight:700,color:'rgba(255,255,255,0.4)',letterSpacing:0.3}}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {paged.length===0?(
                <div style={{padding:'36px 18px',textAlign:'center',color:'rgba(255,255,255,0.35)',fontSize:15}}>No advertisements match your filters.</div>
              ):paged.map((ad,i)=>{
                const isSel=selected.includes(ad.id);
                return(
                  <div key={ad.id}
                    style={{display:'grid',gridTemplateColumns:'36px minmax(0,2fr) minmax(0,1.2fr) 110px 100px 95px 68px 60px 110px 84px',padding:'10px 12px',borderBottom:i<paged.length-1?'1px solid rgba(255,255,255,0.04)':'none',alignItems:'center',gap:6,background:isSel?'rgba(239,68,68,0.05)':'transparent',transition:'background 0.15s'}}
                    onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='rgba(255,255,255,0.02)';}}
                    onMouseLeave={e=>{e.currentTarget.style.background=isSel?'rgba(239,68,68,0.05)':'transparent';}}
                  >
                    <div onClick={()=>toggleSel(ad.id)} style={{cursor:'pointer',display:'flex',alignItems:'center'}}>
                      {isSel?<CheckSquare size={15} color={RED}/>:<Square size={15} color="rgba(255,255,255,0.25)"/>}
                    </div>
                    {/* Ad name */}
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:40,height:30,borderRadius:6,background:BG4,border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {ad.type==='Video Ad'?<Play size={14} color={PURPLE}/>:<Image size={14} color={BLUE}/>}
                      </div>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5'}}>{ad.name}</div>
                        <div style={{fontSize: 14,color:'rgba(255,255,255,0.4)'}}>Ad ID: {ad.id} · {ad.creator}</div>
                      </div>
                    </div>
                    {/* Placement */}
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <Monitor size={12} color="rgba(255,255,255,0.3)"/>
                      <span style={{fontSize:14,color:'rgba(255,255,255,0.65)',lineHeight:1.3}}>{ad.placement}</span>
                    </div>
                    {/* Type */}
                    <span style={{fontSize: 14,fontWeight:700,padding:'3px 9px',borderRadius:5,background:TYPE_BG[ad.type]||'rgba(255,255,255,0.08)',color:TYPE_COLOR[ad.type]||'#F5F5F5',border:`1px solid ${TYPE_COLOR[ad.type]||'rgba(255,255,255,0.2)'}33`,display:'inline-block'}}>{ad.type}</span>
                    {/* Status */}
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <div style={{width:7,height:7,borderRadius:'50%',background:STATUS_COLOR[ad.status]||'#F5F5F5',flexShrink:0}}/>
                      <span style={{fontSize:14,color:STATUS_COLOR[ad.status]||'#F5F5F5',fontWeight:600}}>{ad.status}</span>
                    </div>
                    {/* Impressions */}
                    <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5'}}>{ad.impressions}</div>
                    {/* Clicks */}
                    <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5'}}>{ad.clicks}</div>
                    {/* CTR */}
                    <div style={{fontSize:14,fontWeight:700,color:ad.ctr==='0%'?'rgba(255,255,255,0.4)':GREEN}}>{ad.ctr}</div>
                    {/* Dates */}
                    <div>
                      <div style={{fontSize: 14,color:'#F5F5F5'}}>{ad.start}</div>
                      <div style={{fontSize: 14,color:'rgba(255,255,255,0.4)'}}>{ad.end}</div>
                    </div>
                    {/* Actions */}
                    <div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0,flexWrap:'nowrap' as const}}>
                      <button onClick={()=>setViewAd(ad)} title="View"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Eye size={12} color={BLUE}/>
                      </button>
                      <button onClick={()=>showToast(`Editing ${ad.id}`)} title="Edit"
                        style={{width:26,height:26,borderRadius:6,background:'rgba(212,166,74,0.12)',border:'1px solid rgba(212,166,74,0.2)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
                        <Edit2 size={12} color={GOLD}/>
                      </button>
                      <button onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setMenuPos({top:r.bottom+4,right:window.innerWidth-r.right});setMenuId(menuId===ad.id?'':ad.id);}}
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
                  Showing {Math.min((page-1)*PER_PAGE+1,filtered.length)} to {Math.min(page*PER_PAGE,filtered.length)} of {filtered.length} advertisements
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

              {/* Ad Performance Overview */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                  <span style={{fontSize:15,fontWeight:700}}>Ad Performance Overview</span>
                  <div style={{position:'relative'}}>
                    <select value={chartPeriod} onChange={e=>setChartPeriod(e.target.value)}
                      style={{appearance:'none',padding:'4px 22px 4px 8px',background:BG4,border:'1px solid rgba(255,255,255,0.08)',borderRadius:6,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer',outline:'none'}}>
                      {['This Month','Last Month','Last 3 Months'].map(o=><option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={10} color="rgba(255,255,255,0.4)" style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}/>
                  </div>
                </div>
                <div style={{width:'100%',height:145}}><PerfChart/></div>
                <div style={{display:'flex',gap:14,marginTop:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:5}}>
                    <div style={{width:16,height:3,borderRadius:2,background:BLUE}}/>
                    <span style={{fontSize:14,color:'rgba(255,255,255,0.55)'}}>Impressions</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:5}}>
                    <div style={{width:16,height:3,borderRadius:2,background:GREEN,backgroundImage:`repeating-linear-gradient(90deg,${GREEN} 0,${GREEN} 4px,transparent 4px,transparent 6px)`}}/>
                    <span style={{fontSize:14,color:'rgba(255,255,255,0.55)'}}>Clicks</span>
                  </div>
                </div>
              </div>

              {/* Top Performing Ads */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                  <span style={{fontSize:15,fontWeight:700}}>Top Performing Ads</span>
                  <span onClick={()=>router.push('/admin/analytics')} style={{fontSize:14,color:RED,fontWeight:600,cursor:'pointer'}}>View All</span>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {TOP_ADS.map((ad,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px',background:BG4,borderRadius:8,border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div style={{width:24,height:24,borderRadius:'50%',background:'rgba(239,68,68,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize: 14,fontWeight:800,color:RED,flexShrink:0}}>{ad.rank}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:600,color:'#F5F5F5',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ad.name}</div>
                        <div style={{fontSize: 14,color:'rgba(255,255,255,0.45)'}}>CTR {ad.ctr} · {ad.clicks} clicks</div>
                      </div>
                      <span style={{fontSize: 14,color:GREEN,fontWeight:700,flexShrink:0}}>{ad.ctr}</span>
                    </div>
                  ))}
                </div>
                <div onClick={()=>router.push('/admin/analytics')}
                  style={{marginTop:12,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'10px',borderRadius:8,border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer',fontSize:14,color:'rgba(255,255,255,0.55)'}}
                  onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.04)')}
                  onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                ><BarChart2 size={14}/> View All Reports</div>
              </div>

              {/* Advertisement Placements */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>Advertisement Placements</div>
                <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
                  <DonutChart data={PLACEMENT_DATA} total="42" size={120}/>
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:7}}>
                    {PLACEMENT_DATA.map(d=>(
                      <div key={d.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <div style={{display:'flex',alignItems:'center',gap:5}}>
                          <div style={{width:7,height:7,borderRadius:'50%',background:d.color,flexShrink:0}}/>
                          <span style={{fontSize: 14,color:'rgba(255,255,255,0.65)',lineHeight:1.3}}>{d.label}</span>
                        </div>
                        <span style={{fontSize: 14,fontWeight:700,color:'#F5F5F5',flexShrink:0,marginLeft:4}}>{d.value} <span style={{color:'rgba(255,255,255,0.4)',fontWeight:400}}>({d.pct}%)</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{borderRadius:12,background:BG3,border:'1px solid rgba(255,255,255,0.06)',padding:'16px 18px'}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>Quick Actions</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {[
                    {icon:Plus,    label:'Create Advertisement',    color:RED,    action:()=>setShowCreate(true)},
                    {icon:Upload,  label:'Upload Banner / Video',   color:BLUE,   action:()=>setShowUpload(true)},
                    {icon:Monitor, label:'Manage Placements',       color:PURPLE, action:()=>showToast('Manage Placements opened')},
                    {icon:Clock,   label:'Ad Approval Queue',       color:ORANGE, action:()=>showToast('Ad Approval Queue opened'), badge:3},
                  ].map(({icon:Icon,label,color,action,badge})=>(
                    <div key={label} onClick={action}
                      style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:8,background:BG4,border:'1px solid rgba(255,255,255,0.05)',cursor:'pointer'}}
                      onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                      onMouseLeave={e=>(e.currentTarget.style.background=BG4)}
                    >
                      <div style={{width:30,height:30,borderRadius:7,background:`${color}20`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <Icon size={14} color={color}/>
                      </div>
                      <span style={{fontSize:15,flex:1,color:'#F5F5F5'}}>{label}</span>
                      {badge&&<div style={{background:RED,color:'#fff',borderRadius:10,fontSize: 14,fontWeight:700,padding:'0 7px'}}>{badge}</div>}
                      <ChevronRight size={13} color="rgba(255,255,255,0.25)"/>
                    </div>
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
          <div style={{position:'fixed',top:menuPos.top,right:menuPos.right,width:200,background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:9,overflow:'hidden',zIndex:400,boxShadow:'0 8px 24px rgba(0,0,0,0.6)'}}>
            {[
              {label:'View Details',    color:'#F5F5F5', action:()=>{const a=ADS.find(x=>x.id===menuId);if(a)setViewAd(a);setMenuId('');}},
              {label:'Edit Ad',         color:GOLD,      action:()=>{showToast('Edit opened');setMenuId('');}},
              {label:'Pause / Resume',  color:BLUE,      action:()=>{showToast('Ad status toggled');setMenuId('');}},
              {label:'Duplicate Ad',    color:PURPLE,    action:()=>{showToast('Ad duplicated');setMenuId('');}},
              {label:'View Analytics',  color:TEAL,      action:()=>{router.push('/admin/analytics');setMenuId('');}},
              {label:'Delete Ad',       color:RED,       action:()=>{showToast('Ad deleted');setMenuId('');}},
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

      {/* ── VIEW AD MODAL ── */}
      {viewAd&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,width:'100%',maxWidth:580,maxHeight:'90vh',overflowY:'auto'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <div>
                <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>ADVERTISEMENT DETAILS</div>
                <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{viewAd.id}</div>
              </div>
              <button onClick={()=>setViewAd(null)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            <div style={{padding:'20px 22px',display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:STATUS_BG[viewAd.status],color:STATUS_COLOR[viewAd.status],border:`1px solid ${STATUS_COLOR[viewAd.status]}33`}}>{viewAd.status}</span>
                <span style={{fontSize:14,fontWeight:700,padding:'3px 11px',borderRadius:5,background:TYPE_BG[viewAd.type],color:TYPE_COLOR[viewAd.type],border:`1px solid ${TYPE_COLOR[viewAd.type]}33`}}>{viewAd.type}</span>
              </div>
              <div style={{background:BG3,borderRadius:10,padding:'14px',display:'flex',gap:14,alignItems:'center'}}>
                <div style={{width:48,height:36,borderRadius:8,background:BG4,border:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {viewAd.type==='Video Ad'?<Play size={18} color={PURPLE}/>:<Image size={18} color={BLUE}/>}
                </div>
                <div>
                  <div style={{fontSize:17,fontWeight:700}}>{viewAd.name}</div>
                  <div style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>Created by {viewAd.creator}</div>
                </div>
              </div>
              {[
                {label:'Ad ID',         value:viewAd.id},
                {label:'Placement',     value:viewAd.placement},
                {label:'Impressions',   value:viewAd.impressions},
                {label:'Clicks',        value:viewAd.clicks},
                {label:'CTR',           value:viewAd.ctr},
                {label:'Start Date',    value:viewAd.start},
                {label:'End Date',      value:viewAd.end},
              ].map(({label,value})=>(
                <div key={label} style={{display:'grid',gridTemplateColumns:'150px 1fr',gap:8,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.45)'}}>{label}</span>
                  <span style={{fontSize:15,color:label==='CTR'?GREEN:'#F5F5F5',fontWeight:label==='CTR'?700:500}}>{value}</span>
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:4}}>
                <button onClick={()=>{showToast('Ad paused/resumed');setViewAd(null);}}
                  style={{padding:'10px',background:'rgba(59,130,246,0.12)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:8,color:BLUE,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Clock size={14}/> Pause
                </button>
                <button onClick={()=>{showToast('Editing ad');setViewAd(null);}}
                  style={{padding:'10px',background:'rgba(212,166,74,0.12)',border:'1px solid rgba(212,166,74,0.25)',borderRadius:8,color:GOLD,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Edit2 size={14}/> Edit
                </button>
                <button onClick={()=>{showToast('Ad deleted');setViewAd(null);}}
                  style={{padding:'10px',background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,color:RED,fontFamily:BARLOW,fontSize:15,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <XCircle size={14}/> Delete
                </button>
              </div>
              <button onClick={()=>setViewAd(null)} style={{padding:'10px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── GENERIC MODALS ── */}
      {[
        {show:showCreate,  onClose:()=>setShowCreate(false),  title:'CREATE ADVERTISEMENT', fields:[
          {l:'Ad Name',        opts:null,   placeholder:'Enter advertisement name'},
          {l:'Placement',      opts:PLACEMENTS.slice(1)},
          {l:'Ad Type',        opts:AD_TYPES.slice(1)},
          {l:'Start Date',     opts:null,   placeholder:'DD/MM/YYYY'},
          {l:'End Date',       opts:null,   placeholder:'DD/MM/YYYY'},
        ]},
        {show:showUpload,  onClose:()=>setShowUpload(false),  title:'UPLOAD BANNER / VIDEO', fields:[
          {l:'Ad Type',        opts:AD_TYPES.slice(1)},
          {l:'Placement',      opts:PLACEMENTS.slice(1)},
          {l:'File Format',    opts:['JPG / PNG (Banner)','MP4 (Video)','GIF (Animated)']},
        ]},
        {show:showSettings,onClose:()=>setShowSettings(false),title:'AD SETTINGS', fields:[
          {l:'Default Placement', opts:PLACEMENTS.slice(1)},
          {l:'Auto Approval',     opts:['Enabled','Disabled']},
          {l:'Max Ads Per Page',  opts:['1','2','3','5']},
          {l:'Ad Refresh Rate',   opts:['Every 24 hours','Every 12 hours','Every 6 hours']},
        ]},
        {show:showFilters, onClose:()=>setShowFilters(false), title:'ADVANCED FILTERS', fields:[
          {l:'Placement',    opts:PLACEMENTS},
          {l:'Ad Type',      opts:AD_TYPES},
          {l:'Status',       opts:AD_STATUS},
          {l:'Date Range',   opts:['All Time','This Month','Last Month','Custom Range']},
          {l:'Creator',      opts:['All Creators','Admin','Priya Sharma','Rahul Mehta','Arjun M.']},
        ]},
      ].map(({show,onClose,title,fields})=>show&&(
        <div key={title} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:BG2,border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:24,width:440}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <div style={{fontFamily:BEBAS,fontSize:22,letterSpacing:1}}>{title}</div>
              <button onClick={onClose} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer'}}><X size={18}/></button>
            </div>
            {fields.map(f=>(
              <div key={f.l} style={{marginBottom:14}}>
                <label style={{display:'block',fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:5}}>{f.l}</label>
                {f.opts?(
                  <select style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,outline:'none'}}>
                    {f.opts.map((o:string)=><option key={o}>{o}</option>)}
                  </select>
                ):(
                  <input placeholder={f.placeholder||''} style={{width:'100%',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'9px 12px',color:'#F5F5F5',fontFamily:BARLOW,fontSize:15,outline:'none',boxSizing:'border-box' as const}}/>
                )}
              </div>
            ))}
            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button onClick={onClose} style={{flex:1,padding:11,background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.6)',fontFamily:BARLOW,fontSize:15,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{showToast(`${title} saved`);onClose();}}
                style={{flex:2,padding:11,background:RED,border:'none',borderRadius:7,color:'#fff',fontFamily:BEBAS,fontSize:20,letterSpacing:1,cursor:'pointer'}}>Save</button>
            </div>
          </div>
        </div>
      ))}

      {/* ── TOAST ── */}
      {toast&&(
        <div style={{position:'fixed',bottom:28,left:'50%',transform:'translateX(-50%)',background:BG2,border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,padding:'12px 22px',fontSize:15,fontWeight:600,color:'#F5F5F5',zIndex:600,boxShadow:'0 4px 24px rgba(0,0,0,0.5)',display:'flex',alignItems:'center',gap:8,whiteSpace:'nowrap' as const}}>
          <CheckSquare size={15} color={GREEN}/> {toast}
        </div>
      )}

    </div>
  );
}