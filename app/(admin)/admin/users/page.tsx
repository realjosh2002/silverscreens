'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Wallet,
  Database, Settings, ScrollText, Bell, ChevronRight,
  TrendingUp, TrendingDown, Download, UserPlus,
  BadgeCheck, UserCheck, BellRing, Ticket, KeyRound,
  ChevronLeft, Menu, MessageSquare, ChevronDown,
  Search, Filter, Eye, Edit, Power, MoreVertical,
  X, Check, AlertTriangle, Calendar, Phone, Mail,
  Shield, Clock, RefreshCw,
} from 'lucide-react';

/* ── Design Tokens ── */
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

/* ── Admin Nav ── */
const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'              },
  { icon: Users,           label: 'User Management',          href: '/admin/users',     active: true },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'    },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'    },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'           },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'                },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                  },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'          },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'         },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                    },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'          },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'              },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'                },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                  },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                  },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'               },
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

/* ── Users Data ── */
const USERS = [
  { id:'USR123456', name:'Ananya Sharma',         type:'Aspirant', email:'ananya.sharma@email.com',     phone:'+91 98765 43210', verification:'Verified',  status:'Active',    joined:'May 20, 2025', lastActive:'2 hours ago',  avatar:'AS', avatarColor:'#8B5CF6', department:'Acting',         role:'Heroine'            },
  { id:'USR123457', name:'Rohit Verma',            type:'Aspirant', email:'rohit.verma@email.com',       phone:'+91 98765 43211', verification:'Pending',   status:'Active',    joined:'May 20, 2025', lastActive:'1 day ago',    avatar:'RV', avatarColor:'#3B82F6', department:'Acting',         role:'Hero'               },
  { id:'AGC98765',  name:'DreamWorks Films',        type:'Agency',   email:'contact@dreamworks.com',      phone:'+91 99887 66554', verification:'Verified',  status:'Active',    joined:'May 19, 2025', lastActive:'3 hours ago',  avatar:'DW', avatarColor:'#F97316', department:'',               role:''                   },
  { id:'USR123458', name:'Karan Mehta',             type:'Aspirant', email:'karan.mehta@email.com',       phone:'+91 98765 43212', verification:'Rejected',  status:'Suspended', joined:'May 18, 2025', lastActive:'5 days ago',   avatar:'KM', avatarColor:'#EF4444', department:'Dancing',        role:'Dancer'             },
  { id:'AGC98766',  name:'Future Frame Pvt. Ltd.',  type:'Agency',   email:'info@futureframe.com',        phone:'+91 99887 66555', verification:'Pending',   status:'Active',    joined:'May 18, 2025', lastActive:'1 day ago',    avatar:'FF', avatarColor:'#14B8A6', department:'',               role:''                   },
  { id:'USR123459', name:'Neha Iyer',               type:'Aspirant', email:'neha.iyer@email.com',         phone:'+91 98765 43213', verification:'Verified',  status:'Active',    joined:'May 17, 2025', lastActive:'Just now',     avatar:'NI', avatarColor:'#22C55E', department:'Hair & Make Up', role:'Make Up Artist'     },
  { id:'AGC98767',  name:'Silver Screen Casting',   type:'Agency',   email:'team@silverscreencasting.com',phone:'+91 99887 66556', verification:'Verified',  status:'Active',    joined:'May 16, 2025', lastActive:'4 hours ago',  avatar:'SC', avatarColor:'#D4A64A', department:'',               role:''                   },
  { id:'USR123460', name:'Vikram Singh',             type:'Aspirant', email:'vikram.singh@email.com',      phone:'+91 98765 43214', verification:'Verified',  status:'Blocked',   joined:'May 15, 2025', lastActive:'2 weeks ago',  avatar:'VS', avatarColor:'#8B5CF6', department:'Stunt',          role:'Stunt Coordinator'  },
  { id:'USR123461', name:'Priya Nair',               type:'Aspirant', email:'priya.nair@email.com',        phone:'+91 98765 43215', verification:'Verified',  status:'Active',    joined:'May 14, 2025', lastActive:'30 min ago',   avatar:'PN', avatarColor:'#EC4899', department:'Singing',        role:'Singer'             },
  { id:'AGC98768',  name:'Reel Vision Studios',      type:'Agency',   email:'hello@reelvision.com',        phone:'+91 99887 66557', verification:'Pending',   status:'Active',    joined:'May 13, 2025', lastActive:'2 days ago',   avatar:'RV', avatarColor:'#6366F1', department:'',               role:''                   },
  { id:'USR123462', name:'Arjun Kapoor',             type:'Aspirant', email:'arjun.kapoor@email.com',      phone:'+91 98765 43216', verification:'Verified',  status:'Active',    joined:'May 12, 2025', lastActive:'1 hour ago',   avatar:'AK', avatarColor:'#F59E0B', department:'Acting',         role:'Hero'               },
  { id:'USR123463', name:'Meera Pillai',             type:'Aspirant', email:'meera.pillai@email.com',      phone:'+91 98765 43217', verification:'Pending',   status:'Suspended', joined:'May 11, 2025', lastActive:'1 week ago',   avatar:'MP', avatarColor:'#10B981', department:'Modelling',      role:'Model'              },
];

const TABS = ['All Users','Aspirants','Agencies','Suspended Users','Blocked Users','Deleted Accounts'];

const STATS = [
  { label:'Total Users',      value:'24,568', change:'+12.5%', up:true,  color:RED,    icon:'👥' },
  { label:'Aspirants',        value:'21,348', change:'+10.3%', up:true,  color:PURPLE, icon:'🎭' },
  { label:'Agencies',         value:'2,845',  change:'+8.7%',  up:true,  color:ORANGE, icon:'🏢' },
  { label:'Suspended Users',  value:'187',    change:'-3.2%',  up:false, color:GOLD,   icon:'⏸️' },
  { label:'Blocked Users',    value:'95',     change:'-1.4%',  up:false, color:BLUE,   icon:'🚫' },
];

function verificationBadge(v: string) {
  const map: Record<string,{bg:string,color:string,icon:string}> = {
    'Verified': { bg:'rgba(34,197,94,0.12)',  color:'#22C55E', icon:'✓' },
    'Pending':  { bg:'rgba(245,158,11,0.12)', color:'#F59E0B', icon:'⏳' },
    'Rejected': { bg:'rgba(239,68,68,0.12)',  color:'#EF4444', icon:'✗' },
  };
  const s = map[v] || map['Pending'];
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', background:s.bg, border:`1px solid ${s.color}40`, borderRadius:20, fontFamily:BARLOW, fontSize:14, fontWeight:700, color:s.color }}>{s.icon} {v}</span>;
}

function statusBadge(s: string) {
  const map: Record<string,{bg:string,color:string}> = {
    'Active':    { bg:'rgba(34,197,94,0.12)',  color:'#22C55E' },
    'Suspended': { bg:'rgba(245,158,11,0.12)', color:'#F59E0B' },
    'Blocked':   { bg:'rgba(239,68,68,0.12)',  color:'#EF4444' },
    'Deleted':   { bg:'rgba(107,114,128,0.12)',color:'#6B7280' },
  };
  const st = map[s] || map['Active'];
  return <span style={{ display:'inline-block', padding:'3px 10px', background:st.bg, border:`1px solid ${st.color}40`, borderRadius:20, fontFamily:BARLOW, fontSize:14, fontWeight:700, color:st.color }}>{s}</span>;
}

function typeBadge(t: string) {
  const isAgency = t === 'Agency';
  return <span style={{ display:'inline-block', padding:'2px 8px', background: isAgency?'rgba(139,92,246,0.12)':'rgba(59,130,246,0.12)', border:`1px solid ${isAgency?'rgba(139,92,246,0.3)':'rgba(59,130,246,0.3)'}`, borderRadius:20, fontFamily:BARLOW, fontSize: 14, fontWeight:700, color: isAgency?PURPLE:BLUE }}>{t}</span>;
}

/* ── Modal ── */
function Modal({ title, onClose, children, width=480 }: { title:string; onClose:()=>void; children:React.ReactNode; width?:number }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, width, maxHeight:'85vh', overflowY:'auto', boxShadow:'0 16px 48px rgba(0,0,0,0.7)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, background:BG2, zIndex:1 }}>
          <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
        </div>
        <div style={{ padding:'20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

function InputRow({ label, defaultValue, type='text', placeholder='' }: { label:string; defaultValue?:string; type?:string; placeholder?:string }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder}
        style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' as const }} />
    </div>
  );
}

function MFooter({ onClose, label='Save Changes', danger=false }: { onClose:()=>void; label?:string; danger?:boolean }) {
  return (
    <div style={{ display:'flex', gap:10, marginTop:8 }}>
      <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
      <button onClick={onClose} style={{ flex:2, padding:10, background:danger?RED:GOLD, border:'none', borderRadius:7, color:danger?'#fff':BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>{label}</button>
    </div>
  );
}

/* ── Main Page ── */
export default function AdminUsersPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState('All Users');
  const [search,       setSearch]       = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('-- Select --');
  const [statusFilter, setStatusFilter] = useState('-- Select --');
  const [verifyFilter, setVerifyFilter] = useState('-- Select --');
  const [selected,     setSelected]     = useState<string[]>([]);
  const [modal,        setModal]        = useState('');
  const [activeUser,   setActiveUser]   = useState<typeof USERS[0]|null>(null);
  const [menuUser,     setMenuUser]     = useState<string|null>(null);
  const [menuPos,      setMenuPos]      = useState({ top:0, right:0 });
  const [page,         setPage]         = useState(1);
  const PER_PAGE = 8;

  const SB_W = sidebarOpen ? 220 : 52;

  const filtered = USERS.filter(u => {
    const matchTab = activeTab === 'All Users' ? true
      : activeTab === 'Aspirants'       ? u.type === 'Aspirant'
      : activeTab === 'Agencies'        ? u.type === 'Agency'
      : activeTab === 'Suspended Users' ? u.status === 'Suspended'
      : activeTab === 'Blocked Users'   ? u.status === 'Blocked'
      : activeTab === 'Deleted Accounts'? u.status === 'Deleted'
      : true;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase());
    const matchType   = userTypeFilter === '-- Select --' || u.type === userTypeFilter;
    const matchStatus = statusFilter === '-- Select --' || u.status === statusFilter;
    const matchVerify = verifyFilter === '-- Select --' || u.verification === verifyFilter;
    return matchTab && matchSearch && matchType && matchStatus && matchVerify;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
  const toggleAll    = () => setSelected(s => s.length === paginated.length ? [] : paginated.map(u=>u.id));

  const openUserModal = (user: typeof USERS[0], type: string) => { setActiveUser(user); setModal(type); };

  const selectStyle = { background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'8px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', cursor:'pointer' };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:BG, fontFamily:BARLOW, color:'#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ height:60, flexShrink:0, display:'flex', alignItems:'center', gap:14, padding:'0 24px', background:BG2, borderBottom:'1px solid rgba(255,255,255,0.06)', zIndex:100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ padding:'3px 10px', background:'rgba(200,32,42,0.15)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:5 }}>
          <span style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:RED, letterSpacing:1 }}>ADMIN</span>
        </div>
        <div style={{ flex:1 }} />
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
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
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
        <aside style={{ width:SB_W, flexShrink:0, background:BG2, borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden', transition:'width 0.2s ease', scrollbarWidth:'none' }}>
          <div style={{ height:52, display:'flex', alignItems:'center', justifyContent:sidebarOpen?'flex-end':'center', padding:sidebarOpen?'0 12px':0, borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
            <button onClick={() => setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', width:30, height:30, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background='none')}
            >{sidebarOpen ? <ChevronLeft size={16}/> : <Menu size={16}/>}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:9, overflow:'hidden', border:'1px solid rgba(212,166,74,0.25)', flexShrink:0 }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Super Admin</div>
                <div style={{ fontSize: 14, color:RED, fontWeight:600 }}>ADM000001</div>
              </div>
            </div>
          )}
          <nav style={{ flex:1, padding:sidebarOpen?'8px 6px':'8px 4px', overflowY:'auto', scrollbarWidth:'none' }}>
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
          <div style={{ display:'flex', alignItems:'flex-start', minHeight:'100%' }}>
            <div style={{ flex:1, minWidth:0, padding:'24px 16px 40px' }}>

              {/* Breadcrumb + Header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>
                    <span onClick={() => router.push('/admin/dashboard')} style={{ cursor:'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.color='#F5F5F5')}
                      onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.4)')}
                    >Home</span>
                    <ChevronRight size={12}/>
                    <span style={{ color:'#F5F5F5' }}>User Management</span>
                  </div>
                  <h1 style={{ fontFamily:BARLOW, fontSize:28, fontWeight:700, color:'#F5F5F5', margin:0, display:'flex', alignItems:'center', gap:8 }}>
                    User Management <span style={{ color:RED }}>.</span>
                  </h1>
                  <p style={{ fontFamily:BARLOW, fontSize:16, color:'rgba(255,255,255,0.45)', margin:'4px 0 0' }}>Manage all platform users, review status, and take actions.</p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => setModal('export')} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.15)')}
                  ><Download size={15}/> Export</button>
                  <button onClick={() => setModal('addUser')} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', background:RED, border:'none', borderRadius:8, color:'#fff', fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background='#a01822')}
                    onMouseLeave={e => (e.currentTarget.style.background=RED)}
                  ><UserPlus size={15}/> Add User</button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:20 }}>
                {STATS.map(s => (
                  <div key={s.label} style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{s.icon}</div>
                      <span style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.45)', lineHeight:1.3 }}>{s.label}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                      <div style={{ fontFamily:BEBAS, fontSize:28, color:'#F5F5F5', letterSpacing:1 }}>{s.value}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                        {s.up ? <TrendingUp size={12} color={GREEN}/> : <TrendingDown size={12} color={RED}/>}
                        <span style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:s.up?GREEN:RED }}>{s.change}</span>
                      </div>
                    </div>
                    <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.3)', marginTop:2 }}>from last month</div>
                  </div>
                ))}
              </div>

              {/* Tabs + Actions */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
                <div style={{ display:'flex', gap:0, borderBottom:'2px solid rgba(255,255,255,0.07)' }}>
                  {TABS.map(tab => (
                    <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                      style={{ padding:'10px 16px', background:'none', border:'none', cursor:'pointer', fontFamily:BARLOW, fontSize:16, fontWeight:activeTab===tab?700:400, color:activeTab===tab?'#F5F5F5':'rgba(255,255,255,0.45)', borderBottom:activeTab===tab?`2px solid ${RED}`:'2px solid transparent', marginBottom:-2, whiteSpace:'nowrap' as const }}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' as const, alignItems:'center' }}>
                <div style={{ position:'relative', flex:1, minWidth:200 }}>
                  <Search size={15} color="rgba(255,255,255,0.3)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..."
                    style={{ width:'100%', background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'9px 12px 9px 36px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' as const }}/>
                </div>
                <select value={userTypeFilter} onChange={e => { setUserTypeFilter(e.target.value); setPage(1); }} style={selectStyle}>
                  <option value='-- Select --'>-- Select --</option><option value='Aspirant'>Aspirant</option><option value='Agency'>Agency</option>
                </select>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={selectStyle}>
                  <option value="-- Select --">-- Select --</option><option>Active</option><option>Suspended</option><option>Blocked</option>
                </select>
                <select value={verifyFilter} onChange={e => { setVerifyFilter(e.target.value); setPage(1); }} style={selectStyle}>
                  <option value='-- Select --'>-- Select --</option><option>Verified</option><option>Pending</option><option>Rejected</option>
                </select>
                <button onClick={() => setModal('filters')} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'rgba(255,255,255,0.7)', fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}>
                  <Filter size={14}/> More Filters
                </button>
              </div>

              {/* Bulk actions */}
              {selected.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', background:'rgba(212,166,74,0.08)', border:'1px solid rgba(212,166,74,0.2)', borderRadius:8, marginBottom:12 }}>
                  <span style={{ fontFamily:BARLOW, fontSize:14, color:GOLD, fontWeight:600 }}>{selected.length} user{selected.length>1?'s':''} selected</span>
                  <div style={{ display:'flex', gap:8 }}>
                    {[
                      { label:'Verify All',  action:() => setModal('bulkVerify')  },
                      { label:'Suspend All', action:() => setModal('bulkSuspend') },
                      { label:'Export',      action:() => setModal('export')      },
                      { label:'Delete All',  action:() => setModal('bulkDelete')  },
                    ].map(btn => (
                      <button key={btn.label} onClick={btn.action} style={{ padding:'5px 12px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:btn.label.includes('Delete')?RED:'#F5F5F5', fontFamily:BARLOW, fontSize: 14, cursor:'pointer' }}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setSelected([])} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer' }}><X size={14}/></button>
                </div>
              )}

              {/* Table */}
              <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden', overflowX:'auto' as const }}>
                {/* Header */}
                <div style={{ display:'grid', gridTemplateColumns:'36px 1.4fr 90px 1.2fr 120px 100px 110px 110px 140px', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>
                  <div style={{ display:'flex', alignItems:'center' }}>
                    <div onClick={toggleAll} style={{ width:18, height:18, borderRadius:4, border:`1px solid ${selected.length===paginated.length&&paginated.length>0?GOLD:'rgba(255,255,255,0.2)'}`, background:selected.length===paginated.length&&paginated.length>0?GOLD:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {selected.length===paginated.length&&paginated.length>0 && <Check size={12} color={BG}/>}
                    </div>
                  </div>
                  {[{h:'User',pl:0},{h:'User Type',pl:0},{h:'Email / Phone',pl:20},{h:'Verification',pl:0},{h:'Status',pl:0},{h:'Joined On',pl:0},{h:'Last Active',pl:0},{h:'Actions',pl:0}].map(({h,pl}) => (
                    <div key={h} style={{ fontFamily:BARLOW, fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:0.5, textTransform:'uppercase' as const, paddingLeft:pl }}>{h}</div>
                  ))}
                </div>

                {/* Rows */}
                {paginated.length === 0 ? (
                  <div style={{ textAlign:'center' as const, padding:48, color:'rgba(255,255,255,0.3)', fontFamily:BARLOW, fontSize:16 }}>No users found</div>
                ) : paginated.map((user, i) => (
                  <div key={user.id}
                    style={{ display:'grid', gridTemplateColumns:'36px 1.4fr 90px 1.2fr 120px 100px 110px 110px 140px', padding:'14px 16px', borderBottom:i<paginated.length-1?'1px solid rgba(255,255,255,0.05)':'none', alignItems:'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                  >
                    {/* Checkbox */}
                    <div onClick={() => toggleSelect(user.id)} style={{ width:18, height:18, borderRadius:4, border:`1px solid ${selected.includes(user.id)?GOLD:'rgba(255,255,255,0.2)'}`, background:selected.includes(user.id)?GOLD:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {selected.includes(user.id) && <Check size={12} color={BG}/>}
                    </div>
                    {/* User */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:`${user.avatarColor}25`, border:`1px solid ${user.avatarColor}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14, fontWeight:700, color:user.avatarColor, flexShrink:0 }}>{user.avatar}</div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:600, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</div>
                        <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{user.id}</div>
                        {user.type === 'Aspirant' && user.department && (
                          <div style={{ display:'flex', gap:4, marginTop:3 }}>
                            <span style={{ fontSize:12, fontFamily:BARLOW, color:RED, background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.2)', borderRadius:10, padding:'1px 7px' }}>{user.department}</span>
                            <span style={{ fontSize:12, fontFamily:BARLOW, color:'rgba(255,255,255,0.45)', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'1px 7px' }}>{user.role}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Type */}
                    <div style={{ display:'flex', alignItems:'center' }}>{typeBadge(user.type)}</div>
                    {/* Email/Phone */}
                    <div style={{ paddingLeft:20 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.7)' }}>{user.email}</div>
                      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{user.phone}</div>
                    </div>
                    {/* Verification */}
                    <div style={{ display:'flex', alignItems:'center' }}>{verificationBadge(user.verification)}</div>
                    {/* Status */}
                    <div style={{ display:'flex', alignItems:'center' }}>{statusBadge(user.status)}</div>
                    {/* Joined */}
                    <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)' }}>{user.joined}</div>
                    {/* Last Active */}
                    <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)' }}>{user.lastActive}</div>
                    {/* Actions */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <button onClick={() => openUserModal(user,'view')} title="View" style={{ width:30, height:30, borderRadius:6, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:BLUE }}>
                        <Eye size={14}/>
                      </button>
                      <button onClick={() => openUserModal(user,'edit')} title="Edit" style={{ width:30, height:30, borderRadius:6, background:'rgba(212,166,74,0.1)', border:'1px solid rgba(212,166,74,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:GOLD }}>
                        <Edit size={14}/>
                      </button>
                      <button onClick={() => openUserModal(user,'suspend')} title="Suspend/Block" style={{ width:30, height:30, borderRadius:6, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#EF4444' }}>
                        <Power size={14}/>
                      </button>
                      <button onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setMenuPos({ top:r.bottom+8, right:window.innerWidth-r.right }); setMenuUser(menuUser===user.id?null:user.id); }} style={{ width:30, height:30, borderRadius:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(255,255,255,0.6)' }}>
                        <MoreVertical size={14}/>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>
                    Showing {Math.min((page-1)*PER_PAGE+1, filtered.length)} to {Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} users
                  </span>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ width:32, height:32, borderRadius:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:page===1?'not-allowed':'pointer', color:page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.7)', opacity:page===1?0.5:1 }}>
                      <ChevronLeft size={14}/>
                    </button>
                    {Array.from({ length:Math.min(totalPages,5) }, (_,i) => i+1).map(p => (
                      <button key={p} onClick={() => setPage(p)} style={{ width:32, height:32, borderRadius:6, background:page===p?RED:'rgba(255,255,255,0.05)', border:`1px solid ${page===p?RED:'rgba(255,255,255,0.08)'}`, fontFamily:BARLOW, fontSize:14, color:page===p?'#fff':'rgba(255,255,255,0.7)', cursor:'pointer', fontWeight:page===p?700:400 }}>{p}</button>
                    ))}
                    {totalPages > 5 && <span style={{ color:'rgba(255,255,255,0.3)' }}>...</span>}
                    {totalPages > 5 && <button onClick={() => setPage(totalPages)} style={{ width:32, height:32, borderRadius:6, background:page===totalPages?RED:'rgba(255,255,255,0.05)', border:`1px solid ${page===totalPages?RED:'rgba(255,255,255,0.08)'}`, fontFamily:BARLOW, fontSize:14, color:page===totalPages?'#fff':'rgba(255,255,255,0.7)', cursor:'pointer' }}>{totalPages}</button>}
                    <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ width:32, height:32, borderRadius:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:page===totalPages?'not-allowed':'pointer', color:page===totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.7)', opacity:page===totalPages?0.5:1 }}>
                      <ChevronRight size={14}/>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ══ THREE-DOT DROPDOWN MENU ══ */}
      {menuUser && (
        <>
          <div onClick={() => setMenuUser(null)} style={{ position:'fixed', inset:0, zIndex:300 }}/>
          <div style={{ position:'fixed', top:menuPos.top, right:menuPos.right, width:180, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, overflow:'hidden', zIndex:400, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
            {[
              { label:'View Profile',      icon:<Eye size={14}/>,          action:'view'    },
              { label:'Edit User',         icon:<Edit size={14}/>,         action:'edit'    },
              { label:'Verify User',       icon:<BadgeCheck size={14}/>,   action:'verify'  },
              { label:'Suspend User',      icon:<Power size={14}/>,        action:'suspend' },
              { label:'Reset Password',    icon:<RefreshCw size={14}/>,    action:'reset'   },
              { label:'View Activity',     icon:<Clock size={14}/>,        action:'activity'},
              { label:'Delete User',       icon:<X size={14}/>,            action:'delete'  },
            ].map(item => {
              const user = USERS.find(u=>u.id===menuUser)!;
              return (
                <div key={item.label} onClick={() => { openUserModal(user, item.action); setMenuUser(null); }}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', cursor:'pointer', color:item.action==='delete'?'#EF4444':'#F5F5F5', fontSize:14, fontFamily:BARLOW }}
                  onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                >
                  <span style={{ color:item.action==='delete'?'#EF4444':'rgba(255,255,255,0.5)' }}>{item.icon}</span>
                  {item.label}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ══ MODALS ══ */}

      {/* View User */}
      {modal==='view' && activeUser && (
        <Modal title="USER PROFILE" onClose={() => setModal('')} width={560}>
          <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:24, padding:'16px', background:BG3, borderRadius:10 }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:`${activeUser.avatarColor}25`, border:`2px solid ${activeUser.avatarColor}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:700, color:activeUser.avatarColor, flexShrink:0 }}>{activeUser.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:BARLOW, fontSize:20, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>{activeUser.name}</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
                {typeBadge(activeUser.type)}
                {verificationBadge(activeUser.verification)}
                {statusBadge(activeUser.status)}
              </div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[
              { icon:<Mail size={14}/>,     label:'Email',       value:activeUser.email      },
              { icon:<Phone size={14}/>,    label:'Phone',       value:activeUser.phone       },
              { icon:<Shield size={14}/>,   label:'User ID',     value:activeUser.id          },
              { icon:<Calendar size={14}/>, label:'Joined On',   value:activeUser.joined      },
              { icon:<Clock size={14}/>,    label:'Last Active', value:activeUser.lastActive  },
            ].map(row => (
              <div key={row.label} style={{ padding:'10px 14px', background:BG3, borderRadius:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{row.icon} {row.label}</div>
                <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', fontWeight:600 }}>{row.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <button onClick={() => { setModal('edit'); }} style={{ flex:1, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Edit User</button>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
          </div>
        </Modal>
      )}

      {/* Edit User */}
      {modal==='edit' && activeUser && (
        <Modal title="EDIT USER" onClose={() => setModal('')}>
          <InputRow label="Full Name"    defaultValue={activeUser.name}  />
          <InputRow label="Email"        defaultValue={activeUser.email} type="email"/>
          <InputRow label="Phone Number" defaultValue={activeUser.phone} />
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>User Type</label>
            <select defaultValue={activeUser.type} style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Aspirant</option><option>Agency</option>
            </select>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Status</label>
            <select defaultValue={activeUser.status} style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Active</option><option>Suspended</option><option>Blocked</option>
            </select>
          </div>
          <MFooter onClose={() => setModal('')} />
        </Modal>
      )}

      {/* Verify User */}
      {modal==='verify' && activeUser && (
        <Modal title="VERIFY USER" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:16, lineHeight:1.6 }}>
            Are you sure you want to verify <strong style={{ color:'#F5F5F5' }}>{activeUser.name}</strong>? Their profile will be marked as verified on the platform.
          </div>
          <MFooter onClose={() => setModal('')} label="Verify User" />
        </Modal>
      )}

      {/* Suspend User */}
      {modal==='suspend' && activeUser && (
        <Modal title="SUSPEND USER" onClose={() => setModal('')}>
          <div style={{ padding:'12px 16px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:8, marginBottom:16 }}>
            <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F59E0B', fontWeight:700, marginBottom:4 }}>⚠️ This will restrict the user's access</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)' }}>Suspending <strong style={{ color:'#F5F5F5' }}>{activeUser.name}</strong> will prevent them from logging in until reinstated.</div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Reason for Suspension</label>
            <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Policy Violation</option><option>Suspicious Activity</option><option>User Request</option><option>Fraud</option><option>Other</option>
            </select>
          </div>
          <InputRow label="Additional Notes (optional)" placeholder="Add notes..." />
          <MFooter onClose={() => setModal('')} label="Suspend User" danger />
        </Modal>
      )}

      {/* Delete User */}
      {modal==='delete' && activeUser && (
        <Modal title="DELETE USER" onClose={() => setModal('')}>
          <div style={{ padding:'14px 16px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, marginBottom:16 }}>
            <div style={{ fontFamily:BARLOW, fontSize:15, color:'#EF4444', fontWeight:700, marginBottom:4 }}>⚠️ This action cannot be undone</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>Deleting <strong style={{ color:'#F5F5F5' }}>{activeUser.name}</strong> will permanently remove their account, profile, and all associated data from the platform.</div>
          </div>
          <InputRow label="Type DELETE to confirm" placeholder="DELETE" />
          <MFooter onClose={() => setModal('')} label="Delete User" danger />
        </Modal>
      )}

      {/* Reset Password */}
      {modal==='reset' && activeUser && (
        <Modal title="RESET PASSWORD" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:20, lineHeight:1.6 }}>
            A password reset link will be sent to <strong style={{ color:'#F5F5F5' }}>{activeUser.email}</strong>. The user will receive an email with instructions to set a new password.
          </div>
          <MFooter onClose={() => setModal('')} label="Send Reset Link" />
        </Modal>
      )}

      {/* Activity Log */}
      {modal==='activity' && activeUser && (
        <Modal title="USER ACTIVITY" onClose={() => setModal('')} width={540}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', marginBottom:16 }}>Recent activity for <strong>{activeUser.name}</strong></div>
          {[
            { action:'Login',            detail:'Chrome on Windows · Mumbai',     time:'2 hours ago',  color:GREEN  },
            { action:'Profile Updated',  detail:'Updated bio and photos',          time:'1 day ago',    color:BLUE   },
            { action:'Application Sent', detail:'Applied to City of Dreams S2',   time:'3 days ago',   color:PURPLE },
            { action:'Password Changed', detail:'Via forgot password flow',        time:'1 week ago',   color:GOLD   },
            { action:'Profile Created',  detail:'Joined SilverScreens',           time:activeUser.joined, color:GREEN },
          ].map((log,i) => (
            <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:log.color, marginTop:6, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{log.action}</div>
                <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{log.detail}</div>
              </div>
              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.3)', whiteSpace:'nowrap' as const }}>{log.time}</div>
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <button onClick={() => setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
          </div>
        </Modal>
      )}

      {/* Add User */}
      {modal==='addUser' && (
        <Modal title="ADD NEW USER" onClose={() => setModal('')}>
          <InputRow label="Full Name"    placeholder="Enter full name"  />
          <InputRow label="Email"        placeholder="Enter email address" type="email"/>
          <InputRow label="Phone Number" placeholder="+91 XXXXX XXXXX"   />
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>User Type</label>
            <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Aspirant</option><option>Agency</option>
            </select>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Send Invitation Email</label>
            <div style={{ display:'flex', gap:10 }}>
              <button style={{ flex:1, padding:10, background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:7, color:GREEN, fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}>Yes, Send Email</button>
              <button style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}>No</button>
            </div>
          </div>
          <MFooter onClose={() => setModal('')} label="Create User" />
        </Modal>
      )}

      {/* Export */}
      {modal==='export' && (
        <Modal title="EXPORT USERS" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>Export user data in your preferred format.</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
            {['CSV','Excel (.xlsx)','PDF Report','JSON'].map(fmt => (
              <div key={fmt} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:BG3, border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, cursor:'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
                onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.07)')}
              >
                <span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{fmt}</span>
                <Download size={16} color="rgba(255,255,255,0.4)"/>
              </div>
            ))}
          </div>
          <button onClick={() => setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
        </Modal>
      )}

      {/* Bulk Actions */}
      {(modal==='bulkVerify'||modal==='bulkSuspend'||modal==='bulkDelete') && (
        <Modal title={modal==='bulkVerify'?'BULK VERIFY':modal==='bulkSuspend'?'BULK SUSPEND':'BULK DELETE'} onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:20, lineHeight:1.6 }}>
            This action will be applied to <strong style={{ color:'#F5F5F5' }}>{selected.length} selected users</strong>.{' '}
            {modal==='bulkDelete' && 'This cannot be undone.'}
          </div>
          <MFooter onClose={() => { setModal(''); setSelected([]); }} label={modal==='bulkVerify'?'Verify All':modal==='bulkSuspend'?'Suspend All':'Delete All'} danger={modal!=='bulkVerify'} />
        </Modal>
      )}

      {/* Filters Modal */}
      {modal==='filters' && (
        <Modal title="MORE FILTERS" onClose={() => setModal('')}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {[
              { label:'Country',        options:['All Countries','India','USA','UK','UAE'] },
              { label:'City',           options:['All Cities','Mumbai','Delhi','Chennai','Bangalore'] },
              { label:'Joined After',   options:['Any Time','Last 7 days','Last 30 days','Last 3 months','Last year'] },
              { label:'Last Active',    options:['Any Time','Today','This Week','This Month'] },
              { label:'Profile Complete', options:['Any','Complete','Incomplete'] },
              { label:'Has Showreel',   options:['Any','Yes','No'] },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>{f.label}</label>
                <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'9px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none' }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20 }}><MFooter onClose={() => setModal('')} label="Apply Filters" /></div>
        </Modal>
      )}

    </div>
  );
}