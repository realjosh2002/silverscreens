'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard,
  Database, Settings, ScrollText, Bell,
  UserCheck, BellRing, Ticket, KeyRound,
  ChevronLeft, ChevronRight, Menu, MessageSquare, ChevronDown,
  Mail, Phone, MapPin, Calendar, Filter, Check, X,
  Clock, Globe, Star, CheckCircle, XCircle, AlertCircle,
  Download, Eye, ZoomIn, ArrowLeft, ArrowRight,
  Briefcase, Users2, FileCheck, CreditCard as CardIcon,
  Building, Award, TrendingUp, MessageCircle,
} from 'lucide-react';

const BG     = '#0D1117';
const BG2    = '#131720';
const BG3    = '#181E2A';
const BG4    = '#1C2338';
const GOLD   = '#D4A64A';
const RED    = '#C8202A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';
const ORANGE = '#F97316';
const TEAL   = '#14B8A6';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'                      },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                          },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'            },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification', active: true },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'                   },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'                        },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                          },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'                  },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'                 },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                            },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'                  },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'                      },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'                        },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                          },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                          },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'                       },
];

const PROFILE_MENU = [
  { label: 'My Profile',    href: '/admin/profile'  },
  { label: 'Settings',      href: '/admin/settings' },
  { label: 'Audit Logs',    href: '/admin/audit'    },
  { label: 'Help & Support',href: '/contact'        },
  { label: 'Logout',        href: '/login'          },
];

const AGENCIES = [
  {
    id:'AG062500001', name:'DreamWorks Films Pvt. Ltd.', type:'Production House', status:'Pending',
    email:'contact@dreamworksfilms.com', phone:'+91 98765 43210', location:'Mumbai, Maharashtra, India',
    applied:'18 Jun 2025', daysAgo:'5 days ago',
    established:'2015', regNo:'U92120MH2015PTC266778', gst:'27AABCD1234E1Z5', teamSize:'25 - 50',
    website:'www.dreamworksfilms.com', progressPct:70, progressDone:5, progressTotal:7,
    about:'DreamWorks Films Pvt. Ltd. is a Mumbai-based production house specializing in feature films, web series, and commercials. Established in 2015, we have produced 12+ films and 25+ ad campaigns for leading brands and OTT platforms.',
    yearsInBusiness:'10 Years', projectsCompleted:'37', genres:'Drama, Action, Comedy, Thriller', languages:'Hindi, English, Marathi',
    checklist:[
      { item:'Company Registration',      status:'Verified' },
      { item:'GST / Tax Documents',       status:'Verified' },
      { item:'Address Proof',             status:'Verified' },
      { item:'Website & Social Presence', status:'Verified' },
      { item:'Industry Credibility',      status:'Pending'  },
      { item:'Bank Details Verification', status:'Verified' },
      { item:'Reference Check',           status:'Pending'  },
    ],
    history:[
      { event:'Application submitted by agency', time:'18 Jun 2025, 10:15 AM', color:ORANGE },
      { event:'Documents uploaded',              time:'18 Jun 2025, 10:18 AM', color:GREEN  },
      { event:'Under review by admin',           time:'20 Jun 2025, 02:30 PM', color:BLUE   },
      { event:'Additional information requested',time:'21 Jun 2025, 11:00 AM', color:GOLD   },
    ],
  },
  {
    id:'AG062500002', name:'Silverline Entertainment', type:'Talent Agency', status:'Pending',
    email:'info@silverlineent.com', phone:'+91 98765 43211', location:'Delhi, India',
    applied:'15 Jun 2025', daysAgo:'8 days ago',
    established:'2018', regNo:'U74999DL2018PTC334521', gst:'07AABCE5678F1Z2', teamSize:'10 - 25',
    website:'www.silverlineent.com', progressPct:45, progressDone:3, progressTotal:7,
    about:'Silverline Entertainment is a leading talent agency representing actors, models, and influencers across India. Based in Delhi, we have placed over 500 talents in major productions.',
    yearsInBusiness:'7 Years', projectsCompleted:'120+', genres:'Modeling, Acting, Brand Endorsements', languages:'Hindi, English, Punjabi',
    checklist:[
      { item:'Company Registration',      status:'Verified' },
      { item:'GST / Tax Documents',       status:'Pending'  },
      { item:'Address Proof',             status:'Verified' },
      { item:'Website & Social Presence', status:'Pending'  },
      { item:'Industry Credibility',      status:'Pending'  },
      { item:'Bank Details Verification', status:'Verified' },
      { item:'Reference Check',           status:'Pending'  },
    ],
    history:[
      { event:'Application submitted by agency', time:'15 Jun 2025, 09:00 AM', color:ORANGE },
      { event:'Documents partially uploaded',    time:'15 Jun 2025, 09:45 AM', color:GOLD   },
    ],
  },
  {
    id:'AG062500003', name:'NextGen Studios',          type:'Film Studio',    status:'Approved',
    email:'hello@nextgenstudios.in', phone:'+91 98765 43212', location:'Hyderabad, Telangana, India',
    applied:'10 Jun 2025', daysAgo:'13 days ago',
    established:'2012', regNo:'U92120TS2012PTC189234', gst:'36AABCF9012G1Z8', teamSize:'50 - 100',
    website:'www.nextgenstudios.in', progressPct:100, progressDone:7, progressTotal:7,
    about:'NextGen Studios is a premier film studio based in Hyderabad with state-of-the-art production facilities. Known for producing blockbuster Telugu and Hindi films since 2012.',
    yearsInBusiness:'13 Years', projectsCompleted:'85', genres:'Action, Drama, Thriller, Romance', languages:'Telugu, Hindi, English',
    checklist:[
      { item:'Company Registration',      status:'Verified' },
      { item:'GST / Tax Documents',       status:'Verified' },
      { item:'Address Proof',             status:'Verified' },
      { item:'Website & Social Presence', status:'Verified' },
      { item:'Industry Credibility',      status:'Verified' },
      { item:'Bank Details Verification', status:'Verified' },
      { item:'Reference Check',           status:'Verified' },
    ],
    history:[
      { event:'Application submitted',    time:'10 Jun 2025, 10:00 AM', color:ORANGE },
      { event:'All documents verified',   time:'12 Jun 2025, 03:00 PM', color:GREEN  },
      { event:'Agency approved',          time:'12 Jun 2025, 03:30 PM', color:GREEN  },
    ],
  },
];

const STATUS_TABS = [
  { key:'Pending',  label:'Pending Verification', badge:18 },
  { key:'Approved', label:'Approved',              badge:null },
  { key:'Rejected', label:'Rejected',              badge:null },
  { key:'On Hold',  label:'On Hold',               badge:null },
];

const INNER_TABS = ['Overview','Documents','Business Details','Team & Key Members','Work History','Social Presence','Reviews','Notes & History'];

const DOCS = [
  { label:'Certificate of Incorporation', icon:'📜', color:BLUE,   status:'Verified', date:'18 Jun 2025',
    lines:['MINISTRY OF CORPORATE AFFAIRS','Certificate of Incorporation','CIN: U92120MH2015PTC266778','DreamWorks Films Pvt. Ltd.','Date: 15 March 2015'] },
  { label:'GST Certificate',              icon:'📋', color:GREEN,  status:'Verified', date:'18 Jun 2025',
    lines:['GST REGISTRATION CERTIFICATE','GSTIN: 27AABCD1234E1Z5','DreamWorks Films Pvt. Ltd.','State: Maharashtra','Valid From: 01/07/2017'] },
  { label:'Address Proof',                icon:'🏠', color:PURPLE, status:'Verified', date:'18 Jun 2025',
    lines:['ELECTRICITY BILL','Account No: ████████████','Address: Andheri West, Mumbai','Period: May 2025','Amount: ₹12,450'] },
  { label:'MoA / AoA',                    icon:'📄', color:ORANGE, status:'Verified', date:'18 Jun 2025',
    lines:['MEMORANDUM OF ASSOCIATION','DreamWorks Films Pvt. Ltd.','Registered Office: Mumbai, MH','Share Capital: ₹10,00,000','Directors: 3 Members'] },
  { label:'Company PAN',                  icon:'💳', color:GOLD,   status:'Verified', date:'18 Jun 2025',
    lines:['INCOME TAX DEPARTMENT','PERMANENT ACCOUNT NUMBER','AABCD1234E','DreamWorks Films Pvt. Ltd.','Category: Company'] },
];

function statusColor(s:string) { return s==='Approved'?GREEN:s==='Rejected'?RED:s==='On Hold'?GOLD:ORANGE; }
function statusBg(s:string)    { return s==='Approved'?'rgba(34,197,94,0.12)':s==='Rejected'?'rgba(200,32,42,0.12)':s==='On Hold'?'rgba(212,166,74,0.12)':'rgba(245,158,11,0.12)'; }

function Modal({ title, onClose, children, width=480 }: { title:string; onClose:()=>void; children:React.ReactNode; width?:number }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, width, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.8)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 22px', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, background:BG2 }}>
          <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer' }}><X size={18}/></button>
        </div>
        <div style={{ padding:'20px 22px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

/* Circular progress SVG */
function CircularProgress({ pct, done, total }: { pct:number; done:number; total:number }) {
  const r = 44, cx = 56, cy = 56;
  const circ = 2 * Math.PI * r;
  const dash  = (pct / 100) * circ;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
      <svg width={112} height={112}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={BLUE} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}/>
        <text x={cx} y={cy-6} textAnchor="middle" fill="#F5F5F5" fontFamily={BEBAS} fontSize={22} letterSpacing={1}>{pct}%</text>
        <text x={cx} y={cy+14} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontFamily={BARLOW} fontSize={11}>Completed</text>
      </svg>
      <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', textAlign:'center' as const }}>{done} of {total} completed</div>
      <div style={{ width:80, height:4, background:BG4, borderRadius:2, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:BLUE, borderRadius:2 }}/>
      </div>
    </div>
  );
}

export default function AgencyVerificationPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [statusTab,   setStatusTab]   = useState('Pending');
  const [innerTab,    setInnerTab]    = useState('Overview');
  const [agencyIdx,   setAgencyIdx]   = useState(0);
  const [selected,    setSelected]    = useState(false);
  const [notes,       setNotes]       = useState('');
  const [modal,       setModal]       = useState('');
  const [checklist,   setChecklist]   = useState(AGENCIES[0].checklist.map(c => ({ ...c })));

  const SB_W = sidebarOpen ? 220 : 52;

  const filteredAgencies = AGENCIES.filter(a =>
    statusTab === 'Pending'  ? a.status === 'Pending'  :
    statusTab === 'Approved' ? a.status === 'Approved' :
    statusTab === 'Rejected' ? a.status === 'Rejected' :
    false
  );

  const agency  = filteredAgencies[agencyIdx] ?? AGENCIES[0];
  const prevAgency = filteredAgencies[agencyIdx - 1];
  const nextAgency = filteredAgencies[agencyIdx + 1];

  const handleTabChange = (tab: string) => {
    setStatusTab(tab);
    setAgencyIdx(0);
    setChecklist(AGENCIES[0].checklist.map(c => ({ ...c })));
    setSelected(false);
  };

  const handleAgencyChange = (idx: number) => {
    setAgencyIdx(idx);
    setChecklist(filteredAgencies[idx].checklist.map(c => ({ ...c })));
    setInnerTab('Overview');
    setSelected(true);
  };

  const handleReview = (idx: number) => {
    handleAgencyChange(idx);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:BG, fontFamily:BARLOW, color:'#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ height:60, flexShrink:0, display:'flex', alignItems:'center', gap:14, padding:'0 24px', background:BG2, borderBottom:'1px solid rgba(255,255,255,0.06)', zIndex:100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false}/>
        <div style={{ padding:'3px 10px', background:'rgba(200,32,42,0.15)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:5 }}>
          <span style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:RED, letterSpacing:1 }}>ADMIN</span>
        </div>
        <div style={{ flex:1 }}/>
        <div onClick={() => router.push('/admin/support')} style={{ position:'relative', cursor:'pointer' }}>
          <div style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}><MessageSquare size={15} color="rgba(255,255,255,0.7)"/></div>
          <div style={{ position:'absolute', top:-5, right:-5, background:RED, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14, fontWeight:700, color:'#fff' }}>8</div>
        </div>
        <div onClick={() => router.push('/admin/notifications')} style={{ position:'relative', cursor:'pointer' }}>
          <div style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}><Bell size={15} color="rgba(255,255,255,0.7)"/></div>
          <div style={{ position:'absolute', top:-5, right:-5, background:RED, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14, fontWeight:700, color:'#fff' }}>3</div>
        </div>
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer' }} onClick={() => setProfileOpen(v=>!v)}>
            <div style={{ width:36, height:36, borderRadius:'50%', overflow:'hidden', border:'2px solid rgba(212,166,74,0.38)', flexShrink:0 }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, lineHeight:1.2 }}>Super Admin</div>
              <div style={{ fontSize: 14, color:'rgba(255,255,255,0.4)' }}>Administrator</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)"/>
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position:'fixed', inset:0, zIndex:150 }}/>
              <div style={{ position:'absolute', top:46, right:0, width:210, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, overflow:'hidden', zIndex:200, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize: 14, color:'rgba(255,255,255,0.4)' }}>Admin ID</span>
                  <span style={{ fontSize: 14, fontWeight:700, color:RED }}>ADM000001</span>
                </div>
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
                    style={{ padding:'10px 16px', fontSize:15, cursor:'pointer', color:label==='Logout'?'#ff6b6b':'#F5F5F5', borderTop:label==='Logout'?'1px solid rgba(255,255,255,0.07)':'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                  >{label}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width:SB_W, flexShrink:0, background:BG2, borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden', transition:'width 0.2s ease', scrollbarWidth:'none' as const }}>
          <div style={{ height:52, display:'flex', alignItems:'center', justifyContent:sidebarOpen?'flex-end':'center', padding:sidebarOpen?'0 12px':0, borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
            <button onClick={() => setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', width:30, height:30, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background='none')}
            >{sidebarOpen?<ChevronLeft size={16}/>:<Menu size={16}/>}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:9, overflow:'hidden', border:'1px solid rgba(212,166,74,0.25)', flexShrink:0 }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/>
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Super Admin</div>
                <div style={{ fontSize: 14, color:RED, fontWeight:600 }}>ADM000001</div>
              </div>
            </div>
          )}
          <nav style={{ flex:1, padding:sidebarOpen?'8px 6px':'8px 4px', overflowY:'auto', scrollbarWidth:'none' as const }}>
            {ADMIN_NAV.map(({ icon:Icon, label, href, active }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen?label:undefined}
                style={{ display:'flex', alignItems:'center', justifyContent:sidebarOpen?'flex-start':'center', padding:sidebarOpen?'8px 10px':'10px 0', marginBottom:2, borderRadius:6, cursor:'pointer', background:active?'rgba(212,166,74,0.1)':'transparent', borderLeft:sidebarOpen&&active?`3px solid ${GOLD}`:sidebarOpen?'3px solid transparent':'none', gap:sidebarOpen?9:0 }}
                onMouseEnter={e => { if(!active) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if(!active) e.currentTarget.style.background=active?'rgba(212,166,74,0.1)':'transparent'; }}
              >
                <Icon size={15} color={active?GOLD:'rgba(255,255,255,0.42)'} strokeWidth={active?2.5:1.8}/>
                {sidebarOpen && <span style={{ fontSize:14, color:active?GOLD:'rgba(255,255,255,0.6)', fontWeight:active?700:400, whiteSpace:'nowrap', flex:1 }}>{label}</span>}
                {sidebarOpen && active && <ChevronRight size={12} color={GOLD} opacity={0.6}/>}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex:1, minWidth:0, overflowY:'auto', overflowX:'hidden' }}>
          <div style={{ padding:'20px 24px 40px' }}>

            {/* Breadcrumb */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>
                <span onClick={() => router.push('/admin/dashboard')} style={{ cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#F5F5F5')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.4)')}
                >Home</span>
                <ChevronRight size={12}/><span onClick={() => setSelected(false)} style={{ cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#F5F5F5')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.4)')}
                >Agency Verification</span>
                {selected && <><ChevronRight size={12}/><span style={{ color:'#F5F5F5' }}>{agency.name}</span></>}
              </div>
            </div>

            {/* ════ VIEW A: QUEUE LIST ════ */}
            {!selected && (
              <div>

            {/* Page Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
              <div>
                <h1 style={{ fontFamily:BARLOW, fontSize:28, fontWeight:700, color:'#F5F5F5', margin:0 }}>
                  Agency Verification <span style={{ color:RED }}>.</span>
                </h1>
                <p style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.4)', margin:'4px 0 0' }}>Review and verify agency documents and authenticity.</p>
              </div>
              <button onClick={() => setModal('filters')} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
                onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.15)')}
              ><Filter size={15}/> Filters</button>
            </div>

            {/* Status Tabs */}
            <div style={{ display:'flex', gap:0, borderBottom:'2px solid rgba(255,255,255,0.07)', marginBottom:18 }}>
              {STATUS_TABS.map(tab => (
                <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', background:'none', border:'none', cursor:'pointer', fontFamily:BARLOW, fontSize:15, fontWeight:statusTab===tab.key?700:400, color:statusTab===tab.key?'#F5F5F5':'rgba(255,255,255,0.45)', borderBottom:statusTab===tab.key?`2px solid ${RED}`:'2px solid transparent', marginBottom:-2, whiteSpace:'nowrap' as const }}>
                  {tab.label}
                  {tab.badge && <span style={{ padding:'1px 8px', background:statusTab===tab.key?RED:'rgba(255,255,255,0.08)', borderRadius:20, fontSize: 14, fontWeight:700, color:statusTab===tab.key?'#fff':'rgba(255,255,255,0.5)' }}>{tab.badge}</span>}
                </button>
              ))}
            </div>

                {/* Queue Table */}
                <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
                  {/* Header row */}
                  <div style={{ display:'grid', gridTemplateColumns:'240px 160px 170px 140px 110px 130px 130px 110px 90px', padding:'11px 16px', background:'rgba(255,255,255,0.025)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                    {['Agency','Location','Email','Phone','Applied','Progress','Documents','Status','Action'].map(h => (
                      <div key={h} style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:'rgba(255,255,255,0.45)', letterSpacing:0.5, textTransform:'uppercase' as const }}>{h}</div>
                    ))}
                  </div>
                  {filteredAgencies.length === 0 ? (
                    <div style={{ textAlign:'center' as const, padding:60, color:'rgba(255,255,255,0.3)', fontFamily:BARLOW, fontSize:16 }}>No agencies in this queue</div>
                  ) : filteredAgencies.map((a, i) => {
                    const docsVerified = a.checklist.filter(c => c.status==='Verified').length;
                    const docsTotal   = a.checklist.length;
                    return (
                      <div key={a.id} style={{ display:'grid', gridTemplateColumns:'240px 160px 170px 140px 110px 130px 130px 110px 90px', padding:'12px 16px', borderBottom:i<filteredAgencies.length-1?'1px solid rgba(255,255,255,0.05)':'none', alignItems:'center' }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                      >
                        {/* Agency */}
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:44, height:44, borderRadius:10, background:`${BLUE}15`, border:`1px solid ${BLUE}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <Building2 size={20} color={BLUE}/>
                          </div>
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</div>
                            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.38)', marginBottom:1 }}>{a.id}</div>
                            <div style={{ display:'inline-block', padding:'2px 10px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:20, fontFamily:BARLOW, fontSize:14, color:GREEN, fontWeight:600 }}>{a.type}</div>

                          </div>
                        </div>
                        {/* Location */}
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:5, fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.7)', marginBottom:2 }}>
                            <MapPin size={12} color="rgba(255,255,255,0.3)" style={{ flexShrink:0 }}/>{a.location.split(',')[0]}
                          </div>
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{a.location.split(',').slice(1).join(',').trim()}</div>
                        </div>
                        {/* Email */}
                        <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.65)', wordBreak:'break-all' as const }}>{a.email}</div>
                        {/* Phone */}
                        <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.65)' }}>{a.phone}</div>
                        {/* Applied */}
                        <div>
                          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.7)' }}>{a.applied}</div>
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{a.daysAgo}</div>
                        </div>
                        {/* Progress */}
                        <div style={{ paddingRight:20 }}>
                          <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:a.progressPct===100?GREEN:BLUE, marginBottom:4 }}>{a.progressPct}%</div>
                          <div style={{ height:4, background:BG4, borderRadius:2, overflow:'hidden', marginBottom:3, maxWidth:80 }}>
                            <div style={{ height:'100%', width:`${a.progressPct}%`, background:a.progressPct===100?GREEN:BLUE, borderRadius:2 }}/>
                          </div>
                          <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.35)' }}>{a.progressDone}/{a.progressTotal} checks</div>
                        </div>
                        {/* Documents */}
                        <div style={{ paddingRight:20 }}>
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.55)', marginBottom:4 }}>{docsVerified}/{docsTotal} Done</div>
                          <div style={{ height:4, background:BG4, borderRadius:2, overflow:'hidden', maxWidth:80 }}>
                            <div style={{ height:'100%', width:`${(docsVerified/docsTotal)*100}%`, background:docsVerified===docsTotal?GREEN:GOLD, borderRadius:2 }}/>
                          </div>
                        </div>
                        {/* Status */}
                        <div>
                          <span style={{ padding:'3px 10px', background:statusBg(a.status), border:`1px solid ${statusColor(a.status)}40`, borderRadius:6, fontFamily:BARLOW, fontSize:14, fontWeight:700, color:statusColor(a.status) }}>{a.status}</span>
                        </div>
                        {/* Action */}
                        <button onClick={() => handleReview(filteredAgencies.indexOf(a))}
                          style={{ padding:'7px 16px', background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background='#a01822')}
                          onMouseLeave={e => (e.currentTarget.style.background=RED)}
                        >Review</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════ VIEW B: DETAIL REVIEW ════ */}
            {selected && (
              <div>

            {/* Detail Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <button onClick={() => setSelected(false)} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'rgba(255,255,255,0.7)', fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.1)')}
                ><ArrowLeft size={15}/> Back to Queue</button>
                <div>
                  <h1 style={{ fontFamily:BARLOW, fontSize:24, fontWeight:700, color:'#F5F5F5', margin:0 }}>Reviewing: {agency.name}</h1>
                  <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{agency.id} · Applied {agency.applied}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <button onClick={() => prevAgency && handleAgencyChange(agencyIdx-1)} disabled={!prevAgency}
                  style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:prevAgency?BG2:'transparent', border:`1px solid ${prevAgency?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)'}`, borderRadius:7, color:prevAgency?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.2)', fontFamily:BARLOW, fontSize:14, cursor:prevAgency?'pointer':'not-allowed' }}>
                  <ChevronLeft size={14}/> Prev
                </button>
                <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{agencyIdx+1} / {filteredAgencies.length}</span>
                <button onClick={() => nextAgency && handleAgencyChange(agencyIdx+1)} disabled={!nextAgency}
                  style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:nextAgency?BG2:'transparent', border:`1px solid ${nextAgency?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)'}`, borderRadius:7, color:nextAgency?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.2)', fontFamily:BARLOW, fontSize:14, cursor:nextAgency?'pointer':'not-allowed' }}>
                  Next <ChevronRight size={14}/>
                </button>
              </div>
            </div>

            {/* Agency Profile Card */}
            <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
              <div style={{ height:3, background:`linear-gradient(90deg,${statusColor(agency.status)},transparent)` }}/>
              <div style={{ padding:'18px 24px', display:'grid', gridTemplateColumns:'160px 1fr 1fr auto', gap:24, alignItems:'center' }}>

                {/* Agency Logo */}
                <div style={{ width:140, height:100, background:BG3, borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <div style={{ width:48, height:48, borderRadius:10, background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Building2 size={24} color={BLUE}/>
                  </div>
                  <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', textAlign:'center' as const, lineHeight:1.3, padding:'0 8px' }}>{agency.name.split(' ').slice(0,2).join('\n')}</div>
                </div>

                {/* Name & Contact */}
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <span style={{ fontFamily:BARLOW, fontSize:20, fontWeight:700, color:'#F5F5F5' }}>{agency.name}</span>
                    <span style={{ padding:'3px 12px', background:statusBg(agency.status), border:`1px solid ${statusColor(agency.status)}40`, borderRadius:20, fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:statusColor(agency.status) }}>{agency.status}</span>
                  </div>
                  <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.38)', marginBottom:10 }}>Agency ID: {agency.id}</div>
                  <div style={{ display:'inline-block', padding:'2px 10px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:20, fontFamily:BARLOW, fontSize: 14, fontWeight:600, color:GREEN, marginBottom:10 }}>{agency.type}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    {[{icon:<Mail size={13}/>,text:agency.email},{icon:<Phone size={13}/>,text:agency.phone},{icon:<MapPin size={13}/>,text:agency.location},{icon:<Calendar size={13}/>,text:`Applied on ${agency.applied} (${agency.daysAgo})`}].map((r,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.6)' }}>
                        <span style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }}>{r.icon}</span>{r.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Details */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 20px' }}>
                  {[
                    { l:'Agency Type',          v:agency.type            },
                    { l:'Established On',        v:agency.established     },
                    { l:'Company Reg. No.',      v:agency.regNo           },
                    { l:'GST Number',            v:agency.gst             },
                    { l:'Team Size',             v:agency.teamSize        },
                    { l:'Website',               v:agency.website,isLink:true },
                  ].map(r => (
                    <div key={r.l}>
                      <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.38)', marginBottom:2, textTransform:'uppercase' as const, letterSpacing:0.5 }}>{r.l}</div>
                      {r.isLink ? (
                        <a href={`https://${r.v}`} target="_blank" rel="noreferrer" style={{ fontFamily:BARLOW, fontSize:14, fontWeight:600, color:BLUE, textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>
                          {r.v} <Globe size={11}/>
                        </a>
                      ) : (
                        <div style={{ fontFamily:BARLOW, fontSize:14, fontWeight:600, color:'#F5F5F5' }}>{r.v}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Circular Progress */}
                <CircularProgress pct={agency.progressPct} done={agency.progressDone} total={agency.progressTotal}/>
              </div>
            </div>

            {/* Inner Tabs */}
            <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:18, overflowX:'auto', scrollbarWidth:'none' as const }}>
              {INNER_TABS.map(tab => (
                <button key={tab} onClick={() => setInnerTab(tab)}
                  style={{ padding:'10px 18px', background:'none', border:'none', cursor:'pointer', fontFamily:BARLOW, fontSize:15, fontWeight:innerTab===tab?700:400, color:innerTab===tab?RED:'rgba(255,255,255,0.5)', borderBottom:innerTab===tab?`2px solid ${RED}`:'2px solid transparent', marginBottom:-1, whiteSpace:'nowrap' as const, flexShrink:0 }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* ── TAB CONTENT ── */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:16, alignItems:'flex-start' }}>

              {/* LEFT + CENTER CONTENT */}
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

                {/* OVERVIEW TAB */}
                {innerTab === 'Overview' && (
                  <>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

                      {/* About */}
                      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                        <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:12 }}>About the Agency</div>
                        <p style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:16 }}>{agency.about}</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                          {[
                            { icon:<Clock size={15}/>,   label:'Years in Business',  value:agency.yearsInBusiness  },
                            { icon:<Award size={15}/>,   label:'Projects Completed', value:agency.projectsCompleted },
                            { icon:<Star size={15}/>,    label:'Genres / Categories',value:agency.genres            },
                            { icon:<Globe size={15}/>,   label:'Primary Languages',  value:agency.languages         },
                          ].map(s => (
                            <div key={s.label} style={{ background:BG3, borderRadius:8, padding:'12px 14px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:7, fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>
                                <span style={{ color:'rgba(255,255,255,0.35)' }}>{s.icon}</span>{s.label}
                              </div>
                              <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:700, color:'#F5F5F5' }}>{s.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Verification Checklist */}
                      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                        <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:14 }}>Verification Checklist</div>
                        {checklist.map((item, i) => (
                          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:i<checklist.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ width:28, height:28, borderRadius:7, background:item.status==='Verified'?'rgba(34,197,94,0.1)':'rgba(245,158,11,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {item.status==='Verified'
                                  ? <CheckCircle size={14} color={GREEN}/>
                                  : <AlertCircle size={14} color={ORANGE}/>
                                }
                              </div>
                              <span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item.item}</span>
                            </div>
                            <select value={item.status} onChange={e => {
                              const updated = [...checklist];
                              updated[i] = { ...updated[i], status:e.target.value };
                              setChecklist(updated);
                            }} style={{ background:'transparent', border:'none', color:item.status==='Verified'?GREEN:ORANGE, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer', outline:'none' }}>
                              <option value="Verified" style={{ background:BG3, color:GREEN  }}>✓ Verified</option>
                              <option value="Pending"  style={{ background:BG3, color:ORANGE }}>⏳ Pending</option>
                              <option value="Rejected" style={{ background:BG3, color:RED    }}>✗ Rejected</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submitted Documents */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:14 }}>Submitted Documents</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
                        {DOCS.map(doc => (
                          <div key={doc.label} style={{ background:BG3, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, overflow:'hidden' }}>
                            <div style={{ padding:'8px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:7 }}>
                              <span style={{ fontSize:14 }}>{doc.icon}</span>
                              <span style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{doc.label}</span>
                            </div>
                            {/* SVG doc placeholder */}
                            <div style={{ height:100, background:`linear-gradient(135deg,${doc.color}10,${BG4})`, padding:'10px 12px', cursor:'pointer', position:'relative' }} onClick={() => setModal('viewDoc')}>
                              {doc.lines.map((line, li) => (
                                <div key={li} style={{ fontFamily:li===0?BEBAS:BARLOW, fontSize:li===0?10:9, color:li===0?doc.color:'rgba(255,255,255,0.3)', marginBottom:li===0?4:2, letterSpacing:li===0?1:0 }}>{line}</div>
                              ))}
                              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.background='rgba(0,0,0,0.4)')}
                                onMouseLeave={e => (e.currentTarget.style.background='rgba(0,0,0,0)')}
                              >
                                <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                  <ZoomIn size={14} color="#fff"/>
                                </div>
                              </div>
                            </div>
                            <div style={{ padding:'8px 12px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}>
                                <CheckCircle size={12} color={GREEN}/>
                                <span style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:GREEN }}>Verified</span>
                              </div>
                              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{doc.date}</div>
                              <div style={{ display:'flex', gap:5, marginTop:7 }}>
                                <button onClick={() => setModal('viewDoc')} style={{ flex:1, padding:'4px 0', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:5, color:BLUE, fontFamily:BARLOW, fontSize: 14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:2 }}><Eye size={10}/> View</button>
                                <button style={{ flex:1, padding:'4px 0', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:5, color:GREEN, fontFamily:BARLOW, fontSize: 14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:2 }}><Download size={10}/> Save</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* DOCUMENTS TAB */}
                {innerTab === 'Documents' && (
                  <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                    <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:14 }}>All Submitted Documents</div>
                    {DOCS.map((doc, i) => (
                      <div key={doc.label} style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 0', borderBottom:i<DOCS.length-1?'1px solid rgba(255,255,255,0.06)':'none' }}>
                        <div style={{ width:40, height:40, borderRadius:8, background:`${doc.color}15`, border:`1px solid ${doc.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{doc.icon}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:700, color:'#F5F5F5', marginBottom:2 }}>{doc.label}</div>
                          <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>Submitted on {doc.date}</div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <CheckCircle size={14} color={GREEN}/>
                          <span style={{ fontFamily:BARLOW, fontSize:14, fontWeight:700, color:GREEN }}>Verified</span>
                        </div>
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={() => setModal('viewDoc')} style={{ padding:'6px 14px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:6, color:BLUE, fontFamily:BARLOW, fontSize: 14, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}><Eye size={13}/> View</button>
                          <button style={{ padding:'6px 14px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:6, color:GREEN, fontFamily:BARLOW, fontSize: 14, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}><Download size={13}/> Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* BUSINESS DETAILS TAB */}
                {innerTab === 'Business Details' && (
                  <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                    <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:16 }}>Business Details</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      {[
                        { l:'Legal Name',               v:agency.name            },
                        { l:'Agency Type',               v:agency.type            },
                        { l:'Established Year',          v:agency.established     },
                        { l:'Company Registration No.',  v:agency.regNo           },
                        { l:'GST Number',                v:agency.gst             },
                        { l:'Team Size',                 v:agency.teamSize        },
                        { l:'Primary Location',          v:agency.location        },
                        { l:'Website',                   v:agency.website         },
                        { l:'Primary Languages',         v:agency.languages       },
                        { l:'Genres / Categories',       v:agency.genres          },
                        { l:'Projects Completed',        v:agency.projectsCompleted },
                        { l:'Years in Business',         v:agency.yearsInBusiness },
                      ].map(r => (
                        <div key={r.l} style={{ background:BG3, borderRadius:8, padding:'12px 14px' }}>
                          <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginBottom:4, textTransform:'uppercase' as const, letterSpacing:0.5 }}>{r.l}</div>
                          <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{r.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* OTHER TABS — placeholder */}
                {!['Overview','Documents','Business Details'].includes(innerTab) && (
                  <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:40, textAlign:'center' as const }}>
                    <div style={{ fontFamily:BEBAS, fontSize:24, color:GOLD, letterSpacing:2, marginBottom:8 }}>{innerTab.toUpperCase()}</div>
                    <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.4)' }}>This section will show {innerTab.toLowerCase()} information for {agency.name}.</div>
                  </div>
                )}

              </div>

              {/* RIGHT PANEL */}
              <div style={{ display:'flex', flexDirection:'column', gap:12, position:'sticky', top:0 }}>

                {/* Verification Actions */}
                <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                  <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:14 }}>Verification Actions</div>
                  <button onClick={() => setModal('approve')} style={{ width:'100%', padding:'12px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:8, color:GREEN, fontFamily:BARLOW, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(34,197,94,0.2)')}
                    onMouseLeave={e => (e.currentTarget.style.background='rgba(34,197,94,0.1)')}
                  ><CheckCircle size={16}/> Approve Agency</button>
                  <button onClick={() => setModal('reject')} style={{ width:'100%', padding:'12px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.25)', borderRadius:8, color:RED, fontFamily:BARLOW, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(200,32,42,0.2)')}
                    onMouseLeave={e => (e.currentTarget.style.background='rgba(200,32,42,0.1)')}
                  ><XCircle size={16}/> Reject Agency</button>
                  <button onClick={() => setModal('moreInfo')} style={{ width:'100%', padding:'12px', background:'rgba(212,166,74,0.1)', border:'1px solid rgba(212,166,74,0.25)', borderRadius:8, color:GOLD, fontFamily:BARLOW, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(212,166,74,0.2)')}
                    onMouseLeave={e => (e.currentTarget.style.background='rgba(212,166,74,0.1)')}
                  ><AlertCircle size={16}/> Request More Information</button>
                  <button onClick={() => setModal('hold')} style={{ width:'100%', padding:'12px', background:BG3, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'rgba(255,255,255,0.65)', fontFamily:BARLOW, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                    onMouseEnter={e => (e.currentTarget.style.background=BG4)}
                    onMouseLeave={e => (e.currentTarget.style.background=BG3)}
                  ><Clock size={16}/> Put On Hold</button>
                </div>

                {/* Admin Notes */}
                <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                  <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:10 }}>Admin Notes</div>
                  <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0,500))} placeholder="Add notes about this verification..."
                    style={{ width:'100%', height:90, background:BG3, border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', resize:'none' as const, boxSizing:'border-box' as const }}/>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4, marginBottom:10 }}>
                    <span style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.25)' }}>{notes.length}/500</span>
                  </div>
                  <button onClick={() => setModal('saveNotes')} style={{ width:'100%', padding:'10px', background:GOLD, border:'none', borderRadius:8, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Note</button>
                </div>

                {/* Verification History */}
                <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                  <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:14 }}>Verification History</div>
                  {agency.history.map((h, i) => (
                    <div key={i} style={{ display:'flex', gap:12, marginBottom:i<agency.history.length-1?12:0 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                        <div style={{ width:10, height:10, borderRadius:'50%', background:h.color, flexShrink:0 }}/>
                        {i < agency.history.length-1 && <div style={{ width:1, flex:1, background:'rgba(255,255,255,0.07)', marginTop:4 }}/>}
                      </div>
                      <div style={{ paddingBottom:i<agency.history.length-1?12:0 }}>
                        <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', marginBottom:2 }}>{h.event}</div>
                        <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.38)' }}>{h.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Bottom Prev/Next Navigation */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:20, padding:'14px 20px', background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12 }}>
              <button onClick={() => prevAgency && handleAgencyChange(agencyIdx - 1)} disabled={!prevAgency}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', background:prevAgency?BG3:'transparent', border:`1px solid ${prevAgency?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)'}`, borderRadius:8, color:prevAgency?'rgba(255,255,255,0.8)':'rgba(255,255,255,0.2)', fontFamily:BARLOW, fontSize:14, cursor:prevAgency?'pointer':'not-allowed' }}>
                <ArrowLeft size={15}/> Previous {prevAgency && <span style={{ color:'rgba(255,255,255,0.45)' }}>· {prevAgency.name}</span>}
              </button>
              <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{agencyIdx+1} of {filteredAgencies.length} agencies</span>
              <button onClick={() => nextAgency && handleAgencyChange(agencyIdx + 1)} disabled={!nextAgency}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', background:nextAgency?BG3:'transparent', border:`1px solid ${nextAgency?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)'}`, borderRadius:8, color:nextAgency?'rgba(255,255,255,0.8)':'rgba(255,255,255,0.2)', fontFamily:BARLOW, fontSize:14, cursor:nextAgency?'pointer':'not-allowed' }}>
                {nextAgency && <span style={{ color:'rgba(255,255,255,0.45)' }}>{nextAgency.name} ·</span>} Next <ArrowRight size={15}/>
              </button>
            </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* ══ MODALS ══ */}
      {modal==='approve' && (
        <Modal title="APPROVE AGENCY" onClose={() => setModal('')}>
          <div style={{ padding:'12px 16px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:8, marginBottom:16 }}>
            <div style={{ fontFamily:BARLOW, fontSize:15, color:GREEN, fontWeight:700, marginBottom:4 }}>✓ Approve Agency Profile</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>You are about to approve <strong style={{ color:'#F5F5F5' }}>{agency.name}</strong>. Their agency profile will be verified and they will receive a confirmation email.</div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Approval Notes (optional)</label>
            <textarea placeholder="Add any notes..." style={{ width:'100%', height:70, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', resize:'none' as const, boxSizing:'border-box' as const }}/>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:GREEN, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Confirm Approval</button>
          </div>
        </Modal>
      )}
      {modal==='reject' && (
        <Modal title="REJECT AGENCY" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:14, lineHeight:1.6 }}>Rejecting verification for <strong style={{ color:'#F5F5F5' }}>{agency.name}</strong>. They will be notified via email.</div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Reason for Rejection</label>
            <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Invalid or fraudulent documents</option><option>Incomplete registration details</option><option>Business not registered</option><option>Duplicate agency account</option><option>Failed reference check</option><option>Other</option>
            </select>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Additional Notes</label>
            <textarea placeholder="Explain the rejection reason..." style={{ width:'100%', height:70, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', resize:'none' as const, boxSizing:'border-box' as const }}/>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Confirm Rejection</button>
          </div>
        </Modal>
      )}
      {modal==='moreInfo' && (
        <Modal title="REQUEST MORE INFORMATION" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:14, lineHeight:1.6 }}>Request additional information from <strong style={{ color:'#F5F5F5' }}>{agency.name}</strong> before making a decision.</div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Information Required</label>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {['Updated GST Certificate','Bank Account Verification','Director Identity Proof','Additional References','Portfolio / Work Samples','Registered Office Proof'].map(opt => (
                <label key={opt} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                  <input type="checkbox" style={{ accentColor:GOLD }}/>
                  <span style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.7)' }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Additional Message</label>
            <textarea placeholder="Type a message to the agency..." style={{ width:'100%', height:70, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', resize:'none' as const, boxSizing:'border-box' as const }}/>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Send Request</button>
          </div>
        </Modal>
      )}
      {modal==='hold' && (
        <Modal title="PUT ON HOLD" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:14, lineHeight:1.6 }}>Putting <strong style={{ color:'#F5F5F5' }}>{agency.name}</strong> on hold will pause the verification process.</div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Reason</label>
            <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Awaiting additional documents</option><option>Manual review required</option><option>Suspicious activity detected</option><option>Legal verification pending</option><option>Other</option>
            </select>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Put On Hold</button>
          </div>
        </Modal>
      )}
      {modal==='viewDoc' && (
        <Modal title="DOCUMENT PREVIEW" onClose={() => setModal('')} width={520}>
          <div style={{ background:BG3, borderRadius:10, padding:32, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, minHeight:200 }}>
            <div style={{ textAlign:'center' as const }}>
              <div style={{ fontFamily:BEBAS, fontSize:24, color:GOLD, letterSpacing:2, marginBottom:8 }}>DOCUMENT PREVIEW</div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Document viewer loads here in production</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
            <button style={{ flex:1, padding:10, background:BLUE, border:'none', borderRadius:7, color:'#fff', fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Download size={15}/> Download</button>
          </div>
        </Modal>
      )}
      {modal==='saveNotes' && (
        <Modal title="NOTE SAVED" onClose={() => setModal('')}>
          <div style={{ textAlign:'center' as const, padding:'16px 0' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}><Check size={22} color={GREEN}/></div>
            <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:'#F5F5F5', marginBottom:6 }}>Note Saved Successfully</div>
          </div>
          <button onClick={() => setModal('')} style={{ width:'100%', padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Done</button>
        </Modal>
      )}
      {modal==='filters' && (
        <Modal title="FILTER AGENCIES" onClose={() => setModal('')}>
          {[{label:'Agency Type',options:['All Types','Production House','Talent Agency','Film Studio','Ad Agency']},{label:'Date Range',options:['All Time','Today','Last 7 days','Last 30 days']},{label:'Progress',options:['All','100% Complete','50%+ Complete','Below 50%']},{label:'Team Size',options:['All','1-10','10-25','25-50','50-100','100+']}].map(f => (
            <div key={f.label} style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>{f.label}</label>
              <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'9px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none' }}>
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Reset</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Apply Filters</button>
          </div>
        </Modal>
      )}

    </div>
  );
}