'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard,
  Database, Settings, ScrollText, Bell,
  BadgeCheck, UserCheck, BellRing, Ticket, KeyRound,
  ChevronLeft, ChevronRight, Menu, MessageSquare, ChevronDown,
  Mail, Phone, MapPin, Calendar, Filter, Check, X,
  Clock, FileCheck, Home, User, Shield, Eye, Download,
  ZoomIn, ArrowLeft, Search, CheckCircle, XCircle, AlertCircle,
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
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'                     },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                         },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification', active: true },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'           },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'                  },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'                       },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                         },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'                 },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'                },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                           },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'                 },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'                     },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'                       },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                         },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                         },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'                      },
];

const PROFILE_MENU = [
  { label: 'My Profile',    href: '/admin/profile'   },
  { label: 'Settings',      href: '/admin/settings'  },
  { label: 'Audit Logs',    href: '/admin/audit'     },
  { label: 'Help & Support',href: '/contact'         },
  { label: 'Logout',        href: '/login'           },
];

const ASPIRANTS = [
  { id:'ASP062500001', name:'Ananya Sharma',  email:'ananya.sharma@email.com',  phone:'+91 98765 43210', location:'Mumbai, Maharashtra',  joined:'20 Jun 2025', submitted:'20 Jun 2025, 10:29 AM', status:'Pending',  dob:'12 Mar 2000', gender:'Female', nationality:'Indian', department:'Acting',         role:'Heroine',           appliedCastings:7,  profileCompletion:85,  matchScore:98, avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face', docStatus:{idProof:'Pending',  addressProof:'Pending',  faceVerification:'Pending',  profileReview:'Pending' }, history:[{event:'Documents submitted by user',time:'20 Jun 2025, 10:29 AM',color:GREEN},{event:'Under review by admin',time:'20 Jun 2025, 11:05 AM',color:BLUE},{event:'Additional documents requested',time:'20 Jun 2025, 11:20 AM',color:ORANGE}] },
  { id:'ASP062500002', name:'Rohit Verma',    email:'rohit.verma@email.com',    phone:'+91 98765 43211', location:'Delhi',                 joined:'18 Jun 2025', submitted:'18 Jun 2025, 09:15 AM', status:'Pending',  dob:'5 Jul 1995',  gender:'Male',   nationality:'Indian', department:'Acting',         role:'Hero',              appliedCastings:3,  profileCompletion:72,  matchScore:91, avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',  docStatus:{idProof:'Approved', addressProof:'Pending',  faceVerification:'Pending',  profileReview:'Pending' }, history:[{event:'Documents submitted',time:'18 Jun 2025, 09:15 AM',color:GREEN},{event:'ID proof approved',time:'18 Jun 2025, 02:30 PM',color:GREEN}] },
  { id:'ASP062500003', name:'Neha Iyer',      email:'neha.iyer@email.com',      phone:'+91 98765 43213', location:'Kochi, Kerala',         joined:'17 Jun 2025', submitted:'17 Jun 2025, 10:00 AM', status:'Pending',  dob:'22 Nov 1998', gender:'Female', nationality:'Indian', department:'Hair & Make Up',  role:'Make Up Artist',    appliedCastings:12, profileCompletion:100, matchScore:99, avatar:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&h=120&fit=crop&crop=face', docStatus:{idProof:'Approved', addressProof:'Approved', faceVerification:'Pending',  profileReview:'Pending' }, history:[{event:'Documents submitted',time:'17 Jun 2025, 10:00 AM',color:GREEN},{event:'Partial approval',time:'17 Jun 2025, 03:00 PM',color:BLUE}] },
  { id:'ASP062500004', name:'Karan Mehta',    email:'karan.mehta@email.com',    phone:'+91 98765 43212', location:'Bengaluru, Karnataka',  joined:'16 Jun 2025', submitted:'16 Jun 2025, 11:00 AM', status:'Rejected', dob:'14 Apr 1993', gender:'Male',   nationality:'Indian', department:'Dancing',        role:'Dancer',            appliedCastings:0,  profileCompletion:45,  matchScore:62, avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',  docStatus:{idProof:'Rejected', addressProof:'Rejected', faceVerification:'Pending',  profileReview:'Pending' }, history:[{event:'Documents submitted',time:'16 Jun 2025, 11:00 AM',color:GREEN},{event:'Documents rejected',time:'16 Jun 2025, 04:00 PM',color:RED}] },
  { id:'ASP062500005', name:'Priya Nair',     email:'priya.nair@email.com',     phone:'+91 98765 43215', location:'Chennai, Tamil Nadu',   joined:'15 Jun 2025', submitted:'15 Jun 2025, 02:10 PM', status:'Approved', dob:'9 Sep 1999',  gender:'Female', nationality:'Indian', department:'Singing',        role:'Singer',            appliedCastings:18, profileCompletion:100, matchScore:97, avatar:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&crop=face', docStatus:{idProof:'Approved', addressProof:'Approved', faceVerification:'Approved', profileReview:'Approved'}, history:[{event:'Documents submitted',time:'15 Jun 2025, 02:10 PM',color:GREEN},{event:'All documents verified',time:'15 Jun 2025, 05:00 PM',color:GREEN}] },
  { id:'ASP062500006', name:'Arjun Kapoor',   email:'arjun.kapoor@email.com',   phone:'+91 98765 43216', location:'Hyderabad, Telangana',  joined:'14 Jun 2025', submitted:'14 Jun 2025, 09:45 AM', status:'Pending',  dob:'1 Jan 1997',  gender:'Male',   nationality:'Indian', department:'Stunt',          role:'Stunt Coordinator', appliedCastings:5,  profileCompletion:60,  matchScore:88, avatar:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face',  docStatus:{idProof:'Pending',  addressProof:'Pending',  faceVerification:'Pending',  profileReview:'Pending' }, history:[{event:'Documents submitted',time:'14 Jun 2025, 09:45 AM',color:GREEN}] },
  { id:'ASP062500007', name:'Meera Pillai',   email:'meera.pillai@email.com',   phone:'+91 98765 43217', location:'Pune, Maharashtra',     joined:'13 Jun 2025', submitted:'13 Jun 2025, 03:20 PM', status:'On Hold',  dob:'15 May 2001', gender:'Female', nationality:'Indian', department:'Modelling',      role:'Model',             appliedCastings:2,  profileCompletion:55,  matchScore:74, avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',  docStatus:{idProof:'Pending',  addressProof:'Pending',  faceVerification:'Pending',  profileReview:'Pending' }, history:[{event:'Documents submitted',time:'13 Jun 2025, 03:20 PM',color:GREEN},{event:'Put on hold',time:'13 Jun 2025, 05:00 PM',color:GOLD}] },
  { id:'ASP062500008', name:'Vikram Singh',   email:'vikram.singh@email.com',   phone:'+91 98765 43214', location:'Ahmedabad, Gujarat',    joined:'12 Jun 2025', submitted:'12 Jun 2025, 11:30 AM', status:'Approved', dob:'20 Aug 1994', gender:'Male',   nationality:'Indian', department:'Camera & Lighting', role:'Camera Operator', appliedCastings:9,  profileCompletion:100, matchScore:96, avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',  docStatus:{idProof:'Approved', addressProof:'Approved', faceVerification:'Approved', profileReview:'Approved'}, history:[{event:'Documents submitted',time:'12 Jun 2025, 11:30 AM',color:GREEN},{event:'Fully approved',time:'12 Jun 2025, 04:00 PM',color:GREEN}] },
];

const TABS = [
  { key:'Pending',  label:'Pending Verification', badge:4 },
  { key:'Approved', label:'Approved',              badge:2 },
  { key:'Rejected', label:'Rejected',              badge:1 },
  { key:'On Hold',  label:'On Hold',               badge:1 },
];

/* ── Document placeholder cards (SVG-based, no random photos) ── */
const DOC_CARDS = [
  { key:'idProof',         label:'Aadhaar Card',  icon:'🪪', color:'#3B82F6', submitted:'20 Jun 2025, 10:30 AM',
    bg:'linear-gradient(135deg,#1a2035,#0f1729)',
    lines:['GOVERNMENT OF INDIA','████████████████','Name: ████████████','DOB: ██/██/████','████ ████ ████'] },
  { key:'addressProof',    label:'Address Proof', icon:'🏠', color:'#8B5CF6', submitted:'20 Jun 2025, 10:31 AM',
    bg:'linear-gradient(135deg,#1a1535,#110f29)',
    lines:['ELECTRICITY BILL','Account No: ████████','Address: ██████████','████████████████','Amount Due: ₹████'] },
  { key:'panCard',         label:'PAN Card',      icon:'📄', color:'#F97316', submitted:'20 Jun 2025, 10:32 AM',
    bg:'linear-gradient(135deg,#201510,#150e08)',
    lines:['INCOME TAX DEPT','████████████████','Name: ████████████','Father: ████████','PAN: █████████'] },
  { key:'profilePhoto',    label:'Profile Photo', icon:'📸', color:'#22C55E', submitted:'20 Jun 2025, 10:29 AM',
    bg:'linear-gradient(135deg,#0f1f15,#08130d)',
    isPhoto: true },
];

function statusColor(s:string) { return s==='Approved'?GREEN:s==='Rejected'?RED:s==='On Hold'?GOLD:ORANGE; }
function statusBg(s:string)    { return s==='Approved'?'rgba(34,197,94,0.12)':s==='Rejected'?'rgba(200,32,42,0.12)':s==='On Hold'?'rgba(212,166,74,0.12)':'rgba(245,158,11,0.12)'; }
function docStatusIcon(s:string) {
  if(s==='Approved') return <CheckCircle size={14} color={GREEN}/>;
  if(s==='Rejected') return <XCircle size={14} color={RED}/>;
  return <AlertCircle size={14} color={ORANGE}/>;
}

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

export default function TalentVerificationPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab,   setActiveTab]   = useState('Pending');
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState<typeof ASPIRANTS[0]|null>(null);
  const [notes,       setNotes]       = useState('');
  const [modal,       setModal]       = useState('');
  const [docStatuses, setDocStatuses] = useState({ idProof:'Pending', addressProof:'Pending', faceVerification:'Pending', profileReview:'Pending' });

  const SB_W = sidebarOpen ? 220 : 52;

  const filtered = ASPIRANTS.filter(a => {
    const matchTab    = a.status === activeTab;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleReview = (a: typeof ASPIRANTS[0]) => {
    setSelected(a);
    setDocStatuses({ ...a.docStatus });
    setNotes('');
  };

  const navIdx  = selected ? filtered.indexOf(selected) : -1;
  const prevAsp = navIdx > 0 ? filtered[navIdx - 1] : null;
  const nextAsp = navIdx < filtered.length - 1 ? filtered[navIdx + 1] : null;

  /* ── TOPNAV ── */
  const Topnav = () => (
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
  );

  /* ── SIDEBAR ── */
  const Sidebar = () => (
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
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:BG, fontFamily:BARLOW, color:'#F5F5F5' }}>
      <Topnav/>
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <Sidebar/>
        <div style={{ flex:1, minWidth:0, overflowY:'auto', overflowX:'hidden' }}>
          <div style={{ padding:'20px 24px 40px' }}>

            {/* Breadcrumb */}
            <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:14 }}>
              <span onClick={() => router.push('/admin/dashboard')} style={{ cursor:'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.color='#F5F5F5')}
                onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.4)')}
              >Home</span>
              <ChevronRight size={12}/>
              {selected ? (
                <>
                  <span onClick={() => setSelected(null)} style={{ cursor:'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.color='#F5F5F5')}
                    onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.4)')}
                  >Talent Verification</span>
                  <ChevronRight size={12}/>
                  <span style={{ color:'#F5F5F5' }}>{selected.name}</span>
                </>
              ) : <span style={{ color:'#F5F5F5' }}>Talent Verification</span>}
            </div>

            {/* ══════════ VIEW A: QUEUE ══════════ */}
            {!selected && (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <div>
                    <h1 style={{ fontFamily:BARLOW, fontSize:28, fontWeight:700, color:'#F5F5F5', margin:0 }}>
                      Talent Verification <span style={{ color:RED }}>.</span>
                    </h1>
                    <p style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.4)', margin:'4px 0 0' }}>Review and verify aspirant identity and documents.</p>
                  </div>
                </div>

                {/* Stat cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
                  {[
                    { label:'Total Aspirants', value:ASPIRANTS.length, delta:'+8 this week', color:BLUE,   icon:'👥', tab:null       },
                    { label:'Pending Review',  value:4,                delta:'4 awaiting',  color:ORANGE, icon:'⏳', tab:'Pending'  },
                    { label:'Approved',        value:2,                delta:'2 verified',  color:GREEN,  icon:'✅', tab:'Approved' },
                    { label:'Rejected',        value:1,                delta:'1 declined',  color:RED,    icon:'❌', tab:'Rejected' },
                  ].map(s => (
                    <div key={s.label} onClick={() => s.tab && setActiveTab(s.tab)}
                      style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px 18px', cursor:s.tab?'pointer':'default', transition:'border-color 0.2s' }}
                      onMouseEnter={e => { if(s.tab) e.currentTarget.style.borderColor=s.color+'50'; }}
                      onMouseLeave={e => { if(s.tab) e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; }}
                    >
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{s.icon}</div>
                        <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)' }}>{s.label}</span>
                      </div>
                      <div style={{ fontFamily:BEBAS, fontSize:30, color:'#F5F5F5', letterSpacing:1, lineHeight:1, marginBottom:4 }}>{s.value}</div>
                      <div style={{ fontFamily:BARLOW, fontSize: 14, color:s.color, fontWeight:600 }}>{s.delta}</div>
                    </div>
                  ))}
                </div>

                {/* Filter + Table */}
                <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:16, alignItems:'flex-start' }}>

                  {/* Left Filter Panel */}
                  <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18, position:'sticky', top:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5' }}>Filters</div>
                      <button onClick={() => { setActiveTab('Pending'); setSearch(''); }} style={{ background:'none', border:'none', color:RED, fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer' }}>Clear All</button>
                    </div>
                    <div style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase' as const, marginBottom:10 }}>Verification Status</div>
                    {TABS.map(tab => (
                      <div key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 12px', marginBottom:4, borderRadius:8, cursor:'pointer', background:activeTab===tab.key?`${RED}15`:'transparent', border:activeTab===tab.key?`1px solid ${RED}30`:'1px solid transparent' }}
                        onMouseEnter={e => { if(activeTab!==tab.key) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { if(activeTab!==tab.key) e.currentTarget.style.background='transparent'; }}
                      >
                        <span style={{ fontFamily:BARLOW, fontSize:15, color:activeTab===tab.key?'#F5F5F5':'rgba(255,255,255,0.55)', fontWeight:activeTab===tab.key?700:400 }}>{tab.label}</span>
                        <span style={{ padding:'1px 8px', background:activeTab===tab.key?RED:'rgba(255,255,255,0.08)', borderRadius:20, fontSize: 14, fontWeight:700, color:activeTab===tab.key?'#fff':'rgba(255,255,255,0.45)' }}>{tab.badge}</span>
                      </div>
                    ))}
                    <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'16px 0' }}/>
                    <div style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase' as const, marginBottom:8 }}>Search</div>
                    <div style={{ position:'relative', marginBottom:14 }}>
                      <Search size={14} color="rgba(255,255,255,0.3)" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, ID or email..."
                        style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 10px 8px 30px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', boxSizing:'border-box' as const }}/>
                    </div>
                    <div style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase' as const, marginBottom:8 }}>Face Match</div>
                    <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 10px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', marginBottom:14 }}>
                      <option value=''>-- Select --</option><option>All Scores</option><option>High (90%+)</option><option>Moderate (70–90%)</option><option>Low (&lt;70%)</option>
                    </select>
                    <div style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase' as const, marginBottom:8 }}>Documents</div>
                    <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 10px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', marginBottom:20 }}>
                      <option value=''>-- Select --</option><option>All</option><option>All Verified</option><option>Partially Verified</option><option>None Verified</option>
                    </select>
                    <button style={{ width:'100%', padding:'10px', background:RED, border:'none', borderRadius:8, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Apply Filters</button>
                  </div>

                  {/* Right Table */}
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <span style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.5)' }}>
                        Viewing: <strong style={{ color:'#F5F5F5' }}>{TABS.find(t=>t.key===activeTab)?.label} ({filtered.length})</strong>
                      </span>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Sort by:</span>
                        <select style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'6px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', cursor:'pointer' }}>
                          <option value='newest'>Newest First</option><option>Oldest First</option><option>Name A–Z</option><option>Match Score</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
                      <div style={{ display:'grid', gridTemplateColumns:'36px 1.8fr 1.2fr 120px 110px 150px 120px 90px', padding:'11px 16px', background:'rgba(255,255,255,0.025)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                        <div/>
                        {['Applicant','Location','Submitted','Completion','Documents','Face Match','Action'].map(h => (
                          <div key={h} style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:'rgba(255,255,255,0.45)', letterSpacing:0.5, textTransform:'uppercase' as const }}>{h}</div>
                        ))}
                      </div>

                      {filtered.length === 0 ? (
                        <div style={{ textAlign:'center' as const, padding:60, color:'rgba(255,255,255,0.3)', fontFamily:BARLOW, fontSize:16 }}>No aspirants found in this queue</div>
                      ) : filtered.map((a, i) => {
                        const docsApproved = Object.values(a.docStatus).filter(s=>s==='Approved').length;
                        const docsTotal    = Object.values(a.docStatus).length;
                        return (
                          <div key={a.id}
                            style={{ display:'grid', gridTemplateColumns:'36px 1.8fr 1.2fr 120px 110px 150px 120px 90px', padding:'13px 16px', borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.05)':'none', alignItems:'center' }}
                            onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                            onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                          >
                            <div style={{ width:16, height:16, borderRadius:4, border:'1px solid rgba(255,255,255,0.15)', cursor:'pointer' }}/>
                            {/* Applicant */}
                            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                              <div style={{ position:'relative', flexShrink:0 }}>
                                <div style={{ width:44, height:44, borderRadius:'50%', overflow:'hidden', border:`2px solid ${statusColor(a.status)}40` }}>
                                  <img src={a.avatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/>
                                </div>
                                <div style={{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:'50%', background:statusColor(a.status), border:'2px solid '+BG2 }}/>
                              </div>
                              <div style={{ minWidth:0 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                                  <span style={{ fontFamily:BARLOW, fontSize:15, fontWeight:700, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.name}</span>
                                  {a.status==='Approved' && <BadgeCheck size={14} color={GREEN}/>}
                                </div>
                                <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.38)', marginBottom:1 }}>{a.id}</div>
                                <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.45)' }}>{a.dob} · {a.gender}</div>
                                {a.department && (
                                  <div style={{ display:'flex', gap:4, marginTop:4 }}>
                                    <span style={{ fontSize:12, fontFamily:BARLOW, color:RED, background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.2)', borderRadius:10, padding:'1px 7px' }}>{a.department}</span>
                                    <span style={{ fontSize:12, fontFamily:BARLOW, color:'rgba(255,255,255,0.45)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'1px 7px' }}>{a.role}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Location */}
                            <div>
                              <div style={{ display:'flex', alignItems:'center', gap:5, fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.7)', marginBottom:3 }}>
                                <MapPin size={12} color="rgba(255,255,255,0.3)" style={{ flexShrink:0 }}/>{a.location}
                              </div>
                              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{a.phone}</div>
                            </div>
                            {/* Submitted */}
                            <div>
                              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.7)' }}>{a.submitted.split(',')[0]}</div>
                              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.38)' }}>{a.submitted.split(',')[1]?.trim()}</div>
                            </div>
                            {/* Completion */}
                            <div>
                              <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:700, color:a.profileCompletion===100?GREEN:GOLD, marginBottom:5 }}>{a.profileCompletion}%</div>
                              <div style={{ height:4, background:BG4, borderRadius:2, overflow:'hidden' }}>
                                <div style={{ height:'100%', width:`${a.profileCompletion}%`, background:a.profileCompletion===100?GREEN:GOLD, borderRadius:2 }}/>
                              </div>
                            </div>
                            {/* Documents */}
                            <div>
                              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.55)', marginBottom:5 }}>{docsApproved}/{docsTotal} Verified</div>
                              <div style={{ display:'flex', gap:4 }}>
                                {[{k:'idProof',l:'ID'},{k:'addressProof',l:'Addr'},{k:'faceVerification',l:'Face'},{k:'profileReview',l:'Prof'}].map(d => {
                                  const s = a.docStatus[d.k as keyof typeof a.docStatus];
                                  const col = s==='Approved'?GREEN:s==='Rejected'?RED:ORANGE;
                                  return (
                                    <span key={d.k} style={{ padding:'2px 6px', background:`${col}12`, border:`1px solid ${col}35`, borderRadius:4, fontFamily:BARLOW, fontSize: 14, color:col, fontWeight:700 }}>{d.l}</span>
                                  );
                                })}
                              </div>
                            </div>
                            {/* Face Match */}
                            <div>
                              <div style={{ fontFamily:BEBAS, fontSize:22, color:a.matchScore>=90?GREEN:a.matchScore>=70?GOLD:RED, letterSpacing:1, lineHeight:1, marginBottom:3 }}>{a.matchScore}%</div>
                              <div style={{ fontFamily:BARLOW, fontSize: 14, color:a.matchScore>=90?GREEN:a.matchScore>=70?GOLD:RED, fontWeight:600 }}>
                                {a.matchScore>=90?'High Match':a.matchScore>=70?'Moderate':'Low Match'}
                              </div>
                            </div>
                            {/* Action */}
                            <button onClick={() => handleReview(a)}
                              style={{ padding:'8px 16px', background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}
                              onMouseEnter={e => (e.currentTarget.style.background='#a01822')}
                              onMouseLeave={e => (e.currentTarget.style.background=RED)}
                            >Review</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════ VIEW B: DETAIL REVIEW ══════════ */}
            {selected && (
              <div>
                {/* Header bar */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <button onClick={() => setSelected(null)} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'rgba(255,255,255,0.7)', fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.1)')}
                    ><ArrowLeft size={15}/> Back to Queue</button>
                    <div>
                      <div style={{ fontFamily:BARLOW, fontSize:22, fontWeight:700, color:'#F5F5F5' }}>Reviewing: {selected.name}</div>
                      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{selected.id} · Submitted {selected.submitted}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <button onClick={() => prevAsp && handleReview(prevAsp)} disabled={!prevAsp}
                      style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:prevAsp?BG2:'transparent', border:`1px solid ${prevAsp?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)'}`, borderRadius:7, color:prevAsp?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.2)', fontFamily:BARLOW, fontSize:14, cursor:prevAsp?'pointer':'not-allowed' }}>
                      <ChevronLeft size={14}/> Prev
                    </button>
                    <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{navIdx+1} / {filtered.length}</span>
                    <button onClick={() => nextAsp && handleReview(nextAsp)} disabled={!nextAsp}
                      style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', background:nextAsp?BG2:'transparent', border:`1px solid ${nextAsp?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)'}`, borderRadius:7, color:nextAsp?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.2)', fontFamily:BARLOW, fontSize:14, cursor:nextAsp?'pointer':'not-allowed' }}>
                      Next <ChevronRight size={14}/>
                    </button>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 272px', gap:16, alignItems:'flex-start' }}>

                  {/* LEFT */}
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

                    {/* Profile Card */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
                      <div style={{ height:3, background:`linear-gradient(90deg,${statusColor(selected.status)},transparent)` }}/>
                      <div style={{ padding:'20px 24px', display:'grid', gridTemplateColumns:'96px 1.1fr 1fr', gap:20, alignItems:'flex-start' }}>
                        {/* Avatar */}
                        <div style={{ position:'relative' }}>
                          <div style={{ width:90, height:90, borderRadius:'50%', overflow:'hidden', border:`3px solid ${statusColor(selected.status)}50` }}>
                            <img src={selected.avatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/>
                          </div>
                          <div style={{ position:'absolute', bottom:4, right:4, width:13, height:13, borderRadius:'50%', background:statusColor(selected.status), border:'2px solid '+BG2 }}/>
                        </div>
                        {/* Identity */}
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                            <span style={{ fontFamily:BARLOW, fontSize:24, fontWeight:700, color:'#F5F5F5' }}>{selected.name}</span>
                            <span style={{ padding:'3px 12px', background:statusBg(selected.status), border:`1px solid ${statusColor(selected.status)}40`, borderRadius:20, fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:statusColor(selected.status) }}>{selected.status}</span>
                          </div>
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.38)', marginBottom:12 }}>Aspirant ID: {selected.id}</div>
                          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                            {[{icon:<Mail size={14}/>,text:selected.email},{icon:<Phone size={14}/>,text:selected.phone},{icon:<MapPin size={14}/>,text:selected.location},{icon:<Calendar size={14}/>,text:`Joined ${selected.joined}`}].map((r,i) => (
                              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.65)' }}>
                                <span style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }}>{r.icon}</span>{r.text}
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Details grid */}
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 20px', paddingTop:4 }}>
                          {[{l:'Date of Birth',v:selected.dob},{l:'Gender',v:selected.gender},{l:'Nationality',v:selected.nationality},{l:'Department',v:selected.department},{l:'Role',v:selected.role},{l:'User Type',v:'Aspirant'},{l:'Applied Castings',v:String(selected.appliedCastings)+' projects'}].map(r => (
                            <div key={r.l}>
                              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.38)', marginBottom:3, textTransform:'uppercase' as const, letterSpacing:0.5 }}>{r.l}</div>
                              <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:600, color:'#F5F5F5' }}>{r.v}</div>
                            </div>
                          ))}
                          <div>
                            <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.38)', marginBottom:5, textTransform:'uppercase' as const, letterSpacing:0.5 }}>Profile Completion</div>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ flex:1, height:6, background:BG4, borderRadius:3, overflow:'hidden' }}>
                                <div style={{ height:'100%', width:`${selected.profileCompletion}%`, background:selected.profileCompletion===100?GREEN:GOLD, borderRadius:3 }}/>
                              </div>
                              <span style={{ fontFamily:BARLOW, fontSize:15, fontWeight:700, color:selected.profileCompletion===100?GREEN:GOLD }}>{selected.profileCompletion}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submitted Documents */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:'#F5F5F5', marginBottom:16 }}>Submitted Documents</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                        {DOC_CARDS.map(doc => (
                          <div key={doc.key} style={{ background:BG3, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, overflow:'hidden' }}>
                            <div style={{ padding:'10px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:8 }}>
                              <span style={{ fontSize:15 }}>{doc.icon}</span>
                              <span style={{ fontFamily:BARLOW, fontSize:14, fontWeight:700, color:'#F5F5F5' }}>{doc.label}</span>
                            </div>
                            {/* SVG Document Placeholder */}
                            <div style={{ height:120, background:doc.bg, display:'flex', flexDirection:'column', justifyContent:'center', padding:'12px 14px', cursor:'pointer', position:'relative' }}
                              onClick={() => setModal('viewDoc')}
                            >
                              {doc.isPhoto ? (
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%' }}>
                                  <div style={{ width:64, height:64, borderRadius:'50%', overflow:'hidden', border:`3px solid ${doc.color}40` }}>
                                    <img src={selected.avatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/>
                                  </div>
                                </div>
                              ) : (
                                doc.lines?.map((line, li) => (
                                  <div key={li} style={{ fontFamily:li===0?BEBAS:BARLOW, fontSize:li===0?11:10, color:li===0?doc.color:'rgba(255,255,255,0.3)', marginBottom:li===0?6:3, letterSpacing:li===0?1:0 }}>{line}</div>
                                ))
                              )}
                              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.background='rgba(0,0,0,0.4)')}
                                onMouseLeave={e => (e.currentTarget.style.background='rgba(0,0,0,0)')}
                              >
                                <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                  <ZoomIn size={16} color="#fff"/>
                                </div>
                              </div>
                            </div>
                            <div style={{ padding:'10px 12px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
                                <Check size={13} color={GREEN}/>
                                <span style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:GREEN }}>Clear</span>
                              </div>
                              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginBottom:1 }}>Submitted on</div>
                              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>{doc.submitted}</div>
                              <div style={{ display:'flex', gap:6 }}>
                                <button onClick={() => setModal('viewDoc')} style={{ flex:1, padding:'5px 0', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:5, color:BLUE, fontFamily:BARLOW, fontSize: 14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:3 }}><Eye size={11}/> View</button>
                                <button style={{ flex:1, padding:'5px 0', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:5, color:GREEN, fontFamily:BARLOW, fontSize: 14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:3 }}><Download size={11}/> Save</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Face Verification */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:'#F5F5F5', marginBottom:16 }}>Face Verification</div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20, alignItems:'center' }}>
                        <div>
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Live Captured Photo</div>
                          <div style={{ borderRadius:10, overflow:'hidden', border:`2px solid ${GREEN}40`, position:'relative' }}>
                            <img src={selected.avatar} style={{ width:'100%', height:160, objectFit:'cover', objectPosition:'top', display:'block' }} alt=""/>
                            {['topleft','topright','bottomleft','bottomright'].map(pos => (
                              <div key={pos} style={{ position:'absolute', width:20, height:20, borderColor:GREEN, borderStyle:'solid', borderWidth:0, ...(pos.includes('top')?{top:8}:{bottom:8}), ...(pos.includes('left')?{left:8}:{right:8}), ...(pos.includes('top')&&pos.includes('left')?{borderTopWidth:3,borderLeftWidth:3}:pos.includes('top')&&pos.includes('right')?{borderTopWidth:3,borderRightWidth:3}:pos.includes('bottom')&&pos.includes('left')?{borderBottomWidth:3,borderLeftWidth:3}:{borderBottomWidth:3,borderRightWidth:3}) }}/>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Profile Photo</div>
                          <div style={{ borderRadius:10, overflow:'hidden', border:'2px solid rgba(255,255,255,0.1)' }}>
                            <img src={selected.avatar} style={{ width:'100%', height:160, objectFit:'cover', objectPosition:'top', display:'block' }} alt=""/>
                          </div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, padding:20, background:BG3, borderRadius:12 }}>
                          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.5)' }}>Match Score</div>
                          <div style={{ fontFamily:BEBAS, fontSize:56, color:selected.matchScore>=90?GREEN:selected.matchScore>=70?GOLD:RED, letterSpacing:2, lineHeight:1 }}>{selected.matchScore}%</div>
                          <div style={{ padding:'6px 20px', background:selected.matchScore>=90?'rgba(34,197,94,0.12)':'rgba(212,166,74,0.12)', border:`1px solid ${selected.matchScore>=90?'rgba(34,197,94,0.3)':'rgba(212,166,74,0.3)'}`, borderRadius:20, fontFamily:BARLOW, fontSize:15, fontWeight:700, color:selected.matchScore>=90?GREEN:GOLD }}>
                            {selected.matchScore>=90?'High Match':'Moderate Match'}
                          </div>
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', textAlign:'center' as const }}>
                            {selected.matchScore>=90?'Face matches successfully':'Manual review recommended'}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT PANEL */}
                  <div style={{ display:'flex', flexDirection:'column', gap:12, position:'sticky', top:0 }}>

                    {/* Verification Status */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:14 }}>Verification Status</div>
                      {[
                        { key:'idProof',         label:'ID Proof',          icon:<FileCheck size={15}/> },
                        { key:'addressProof',     label:'Address Proof',     icon:<Home size={15}/>      },
                        { key:'faceVerification', label:'Face Verification', icon:<User size={15}/>      },
                        { key:'profileReview',    label:'Profile Review',    icon:<Shield size={15}/>    },
                      ].map(item => {
                        const s   = docStatuses[item.key as keyof typeof docStatuses];
                        const col = s==='Approved'?GREEN:s==='Rejected'?RED:ORANGE;
                        return (
                          <div key={item.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                              <span style={{ color:'rgba(255,255,255,0.35)' }}>{item.icon}</span>
                              <span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item.label}</span>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              {docStatusIcon(s)}
                              <select value={s} onChange={e => setDocStatuses(d => ({ ...d, [item.key]:e.target.value }))}
                                style={{ background:'transparent', border:'none', color:col, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer', outline:'none' }}>
                                <option value="Pending"  style={{ background:BG3 }}>Pending</option>
                                <option value="Approved" style={{ background:BG3 }}>Approved</option>
                                <option value="Rejected" style={{ background:BG3 }}>Rejected</option>
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:14 }}>Verification Actions</div>
                      <button onClick={() => setModal('approve')} style={{ width:'100%', padding:'12px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:8, color:GREEN, fontFamily:BARLOW, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(34,197,94,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.background='rgba(34,197,94,0.1)')}
                      ><Check size={16}/> Approve & Verify</button>
                      <button onClick={() => setModal('reject')} style={{ width:'100%', padding:'12px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.25)', borderRadius:8, color:RED, fontFamily:BARLOW, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:8 }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(200,32,42,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.background='rgba(200,32,42,0.1)')}
                      ><X size={16}/> Reject</button>
                      <button onClick={() => setModal('hold')} style={{ width:'100%', padding:'12px', background:BG3, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'rgba(255,255,255,0.65)', fontFamily:BARLOW, fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                        onMouseEnter={e => (e.currentTarget.style.background=BG4)}
                        onMouseLeave={e => (e.currentTarget.style.background=BG3)}
                      ><Clock size={16}/> Put On Hold</button>
                    </div>

                    {/* Notes */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:10 }}>Verification Notes</div>
                      <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0,500))} placeholder="Add notes about this verification..."
                        style={{ width:'100%', height:90, background:BG3, border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', resize:'none' as const, boxSizing:'border-box' as const }}/>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4, marginBottom:10 }}>
                        <span style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.25)' }}>{notes.length}/500</span>
                      </div>
                      <button onClick={() => setModal('saveNotes')} style={{ width:'100%', padding:'10px', background:GOLD, border:'none', borderRadius:8, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Notes</button>
                    </div>

                    {/* History */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:14 }}>Verification History</div>
                      {selected.history.map((h,i) => (
                        <div key={i} style={{ display:'flex', gap:12, marginBottom:i<selected.history.length-1?12:0 }}>
                          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
                            <div style={{ width:10, height:10, borderRadius:'50%', background:h.color, flexShrink:0 }}/>
                            {i < selected.history.length-1 && <div style={{ width:1, flex:1, background:'rgba(255,255,255,0.07)', marginTop:4 }}/>}
                          </div>
                          <div style={{ paddingBottom:i<selected.history.length-1?12:0 }}>
                            <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', marginBottom:2 }}>{h.event}</div>
                            <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.38)' }}>{h.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ══ MODALS ══ */}
      {modal==='approve' && selected && (
        <Modal title="APPROVE & VERIFY" onClose={() => setModal('')}>
          <div style={{ padding:'12px 16px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:8, marginBottom:16 }}>
            <div style={{ fontFamily:BARLOW, fontSize:15, color:GREEN, fontWeight:700, marginBottom:4 }}>✓ Approve Aspirant Profile</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>You are about to verify <strong style={{ color:'#F5F5F5' }}>{selected.name}</strong>. Their profile will be marked as verified and they will receive a confirmation email.</div>
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
      {modal==='reject' && selected && (
        <Modal title="REJECT VERIFICATION" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:14, lineHeight:1.6 }}>Rejecting verification for <strong style={{ color:'#F5F5F5' }}>{selected.name}</strong>. They will be notified via email.</div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Reason for Rejection</label>
            <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Documents unclear or invalid</option><option>Face verification failed</option><option>Incomplete profile</option><option>Fraudulent documents</option><option>Duplicate account</option><option>Other</option>
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
      {modal==='hold' && selected && (
        <Modal title="PUT ON HOLD" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:14, lineHeight:1.6 }}>Putting <strong style={{ color:'#F5F5F5' }}>{selected.name}</strong> on hold will pause the verification process.</div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Reason</label>
            <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Awaiting additional documents</option><option>Manual review required</option><option>Suspicious activity detected</option><option>Other</option>
            </select>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Put On Hold</button>
          </div>
        </Modal>
      )}
      {modal==='viewDoc' && (
        <Modal title="DOCUMENT PREVIEW" onClose={() => setModal('')} width={500}>
          <div style={{ background:BG3, borderRadius:10, padding:32, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, minHeight:200 }}>
            <div style={{ textAlign:'center' as const }}>
              <div style={{ fontFamily:BEBAS, fontSize:24, color:GOLD, letterSpacing:2, marginBottom:8 }}>DOCUMENT PREVIEW</div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Document viewer would load here in production</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
            <button style={{ flex:1, padding:10, background:BLUE, border:'none', borderRadius:7, color:'#fff', fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Download size={15}/> Download</button>
          </div>
        </Modal>
      )}
      {modal==='saveNotes' && (
        <Modal title="NOTES SAVED" onClose={() => setModal('')}>
          <div style={{ textAlign:'center' as const, padding:'16px 0' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}><Check size={22} color={GREEN}/></div>
            <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:'#F5F5F5', marginBottom:6 }}>Notes Saved Successfully</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Verification notes have been saved.</div>
          </div>
          <button onClick={() => setModal('')} style={{ width:'100%', padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', marginTop:8 }}>Done</button>
        </Modal>
      )}
    </div>
  );
}