'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, Menu,
  Upload, FolderPlus, Download, Search, Filter,
  Eye, MoreVertical, Send, CheckCircle, AlertTriangle,
  ChevronRight, X,
} from 'lucide-react';

const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';
const ORANGE = '#F97316';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  badge: 12,    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', badge: 3, href: '/agency/notifications' },
];

const PROFILE_MENU = [
  { label: 'Reports & Analytics',    href: '/agency/reports' },
  { label: 'Subscription & Billing', href: '/agency/subscription' },
  { label: 'Company Profile',        href: '/agency-profile' },
  { label: 'Documents',              href: '/agency/documents' },
  { label: 'Calendar',               href: '/agency/calendar' },
  { label: 'Settings',               href: '/agency/settings' },
  { label: 'Support',                href: '/contact' },
  { label: 'Logout',                 href: '/login' },
];

const DOC_TABS = ['All Documents','Verification','Contracts','Casting Files','Financial','Compliance','E-Signatures'];

const FOLDERS = [
  { name: 'Agency Verification',    count: 12,  color: GOLD,   verified: true,  includes: ['Certificate of Incorporation','PAN Card','GST Registration'] },
  { name: 'Contracts',              count: 78,  color: BLUE,   verified: false, includes: ['Talent Agreements','Production Contracts','Vendor Contracts'] },
  { name: 'Casting Call Documents', count: 142, color: PURPLE, verified: false, includes: ['Role Briefs','Character References','Audition Instructions'] },
  { name: 'Financial Documents',    count: 85,  color: ORANGE, verified: false, includes: ['Invoices','Receipts','Subscription Bills'] },
  { name: 'Legal & Compliance',     count: 34,  color: RED,    verified: false, includes: ['NDA Documents','Legal Notices','Compliance Certificates'] },
];

const DOCS = [
  { id:'d1', name:'GST Certificate.pdf',               ext:'PDF',  size:'2.4 MB', category:'Verification',  uploader:'Rohan Verma',    role:'Admin',            img:'photo-1472099645785-5658abf4ff4e', date:'10 Jun 2026', time:'10:42 AM', status:'Verified',          statusColor: GREEN,  statusBg:'rgba(34,197,94,0.12)'  },
  { id:'d2', name:'Production Contract.pdf',           ext:'PDF',  size:'5.6 MB', category:'Contracts',     uploader:'Meera Iyer',     role:'Agency Member',    img:'photo-1494790108377-be9c29b29330', date:'09 Jun 2026', time:'11:15 AM', status:'Signed',            statusColor: GREEN,  statusBg:'rgba(34,197,94,0.12)'  },
  { id:'d3', name:'Talent Agreement.pdf',              ext:'PDF',  size:'3.1 MB', category:'Contracts',     uploader:'Karan Malhotra', role:'Agency Member',    img:'photo-1507003211169-0a1dd7228f2d', date:'08 Jun 2026', time:'04:30 PM', status:'Pending Signature', statusColor: GOLD,   statusBg:'rgba(212,166,74,0.12)' },
  { id:'d4', name:'Casting Brief – Lead Actress.docx', ext:'DOCX', size:'1.2 MB', category:'Casting Files', uploader:'Pooja Sharma',   role:'Casting Director', img:'photo-1529626455594-4ff0802cfb7e', date:'07 Jun 2026', time:'03:18 PM', status:'Active',            statusColor: BLUE,   statusBg:'rgba(59,130,246,0.12)' },
  { id:'d5', name:'Invoice INV-2026-1023.xlsx',        ext:'XLSX', size:'720 KB', category:'Financial',     uploader:'Rohan Verma',    role:'Admin',            img:'photo-1472099645785-5658abf4ff4e', date:'07 Jun 2026', time:'12:05 PM', status:'Paid',              statusColor: GREEN,  statusBg:'rgba(34,197,94,0.12)'  },
  { id:'d6', name:'NDA – Vendor Agreement.pdf',        ext:'PDF',  size:'1.8 MB', category:'Compliance',    uploader:'Meera Iyer',     role:'Agency Member',    img:'photo-1494790108377-be9c29b29330', date:'06 Jun 2026', time:'09:20 AM', status:'Signed',            statusColor: GREEN,  statusBg:'rgba(34,197,94,0.12)'  },
  { id:'d7', name:'PAN Card Copy.pdf',                 ext:'PDF',  size:'0.9 MB', category:'Verification',  uploader:'Rohan Verma',    role:'Admin',            img:'photo-1472099645785-5658abf4ff4e', date:'05 Jun 2026', time:'02:10 PM', status:'Verified',          statusColor: GREEN,  statusBg:'rgba(34,197,94,0.12)'  },
  { id:'d8', name:'Audition Instructions – S3.docx',  ext:'DOCX', size:'0.8 MB', category:'Casting Files', uploader:'Pooja Sharma',   role:'Casting Director', img:'photo-1529626455594-4ff0802cfb7e', date:'04 Jun 2026', time:'11:00 AM', status:'Active',            statusColor: BLUE,   statusBg:'rgba(59,130,246,0.12)' },
  { id:'d9', name:'Compliance Certificate 2026.pdf',  ext:'PDF',  size:'2.2 MB', category:'Compliance',    uploader:'Karan Malhotra', role:'Agency Member',    img:'photo-1507003211169-0a1dd7228f2d', date:'03 Jun 2026', time:'05:45 PM', status:'Verified',          statusColor: GREEN,  statusBg:'rgba(34,197,94,0.12)'  },
  { id:'d10',name:'Vendor Contract – Lights.pdf',     ext:'PDF',  size:'3.4 MB', category:'Contracts',     uploader:'Meera Iyer',     role:'Agency Member',    img:'photo-1494790108377-be9c29b29330', date:'02 Jun 2026', time:'03:30 PM', status:'Pending Signature', statusColor: GOLD,   statusBg:'rgba(212,166,74,0.12)' },
];

const EXT_COLOR: Record<string,string> = { PDF: RED, DOCX: BLUE, XLSX: GREEN, JPG: PURPLE };
const EXT_BG:    Record<string,string> = { PDF: 'rgba(200,32,42,0.15)', DOCX: 'rgba(59,130,246,0.15)', XLSX: 'rgba(34,197,94,0.15)', JPG: 'rgba(139,92,246,0.15)' };

const ESIGS = [
  { title:'Talent Agreement #2384',   signer:'Priya Sharma',            date:'10 Jun 2026 · 10:30 AM', color: GREEN  },
  { title:'Production Contract #771', signer:'Meera Iyer',              date:'09 Jun 2026 · 05:20 PM', color: BLUE   },
  { title:'Vendor NDA #882',          signer:'Aarav Studios Pvt. Ltd.', date:'08 Jun 2026 · 02:45 PM', color: PURPLE },
];

const ACTIVITY = [
  { time:'10:42 AM', title:'GST Certificate.pdf',        sub:'Uploaded by Rohan Verma'  },
  { time:'11:15 AM', title:'Talent Agreement.pdf',       sub:'Signed by Priya Sharma'   },
  { time:'12:06 PM', title:'Invoice INV-2026-1023.xlsx', sub:'Generated by System'       },
  { time:'01:10 PM', title:'Contract Reminder Sent',     sub:'To 3 Talent(s)'           },
  { time:'02:30 PM', title:'NDA Document.pdf',           sub:'Uploaded by Meera Iyer'   },
];

const CAT_COLOR: Record<string,string> = {
  'Verification':  GOLD, 'Contracts': BLUE, 'Casting Files': PURPLE,
  'Financial': GREEN, 'Compliance': ORANGE,
};
const CAT_BG: Record<string,string> = {
  'Verification':  'rgba(212,166,74,0.15)', 'Contracts': 'rgba(59,130,246,0.15)',
  'Casting Files': 'rgba(139,92,246,0.15)', 'Financial': 'rgba(34,197,94,0.15)',
  'Compliance':    'rgba(249,115,22,0.15)',
};

const PER_PAGE = 5;

export default function DocumentsPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState('All Documents');
  const [search,       setSearch]       = useState('');
  const [catFilter,    setCatFilter]    = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page,         setPage]         = useState(1);
  const [showUpload,   setShowUpload]   = useState(false);
  const [showFolder,   setShowFolder]   = useState(false);
  const [menuDocId,    setMenuDocId]    = useState('');
  const [menuPos,      setMenuPos]      = useState({ top: 0, right: 0 });
  const [viewDocId,    setViewDocId]    = useState('');
  const [moveDocId,    setMoveDocId]    = useState('');
  const [showStorage,  setShowStorage]  = useState(false);
  const [openFolder,   setOpenFolder]   = useState('');        // which folder is open
  const [folderMenuId, setFolderMenuId] = useState('');        // which folder 3-dot is open
  const [folderMenuPos,setFolderMenuPos]= useState({ top:0, right:0 });
  const [renameFolder, setRenameFolder] = useState('');        // folder being renamed
  const [showEsig,     setShowEsig]     = useState(false);     // E-Signatures panel
  const [showExport,   setShowExport]   = useState(false);     // Export report modal
  const [renameDocId,  setRenameDocId]  = useState('');        // rename doc modal
  const [shareDocId,   setShareDocId]   = useState('');        // share doc modal

  const SB_W = sidebarOpen ? 230 : 52;

  const filtered = DOCS.filter(d => {
    if (activeTab !== 'All Documents' && activeTab !== 'E-Signatures' && d.category !== activeTab) return false;
    if (activeTab === 'E-Signatures' && d.status !== 'Signed' && d.status !== 'Pending Signature') return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && d.category !== catFilter) return false;
    if (statusFilter && d.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const viewDoc = DOCS.find(d => d.id === viewDocId) || null;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:BG, fontFamily:BARLOW, color:'#F5F5F5' }}>

      {/* TOPNAV */}
      <header style={{ height:60, flexShrink:0, display:'flex', alignItems:'center', gap:14, padding:'0 24px', background:BG2, borderBottom:'1px solid rgba(255,255,255,0.06)', zIndex:100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex:1 }} />
        <button onClick={() => router.push('/agency/create-casting')} style={{ display:'flex', alignItems:'center', gap:7, background:RED, color:'#fff', border:'none', borderRadius:8, padding:'0 18px', height:36, fontSize:15, fontWeight:700, fontFamily:BARLOW, cursor:'pointer' }}>
          Post a Casting <span>+</span>
        </button>
        <div onClick={() => router.push('/agency/messages')} style={{ position:'relative', cursor:'pointer' }}>
          <div style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position:'absolute', top:-5, right:-5, background:RED, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14, fontWeight:700, color:'#fff' }}>12</div>
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position:'relative', cursor:'pointer' }}>
          <div style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position:'absolute', top:-5, right:-5, background:RED, borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14, fontWeight:700, color:'#fff' }}>3</div>
        </div>
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#1a1410,#2a1e0e)', border:'2px solid rgba(212,166,74,0.38)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:GOLD, fontFamily:BEBAS }}>DP</div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, lineHeight:1.2 }}>Dharma Productions</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)' }}>Production House</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position:'fixed', inset:0, zIndex:150 }} />
              <div style={{ position:'absolute', top:46, right:0, width:220, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, overflow:'hidden', zIndex:200, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize: 14, color:'rgba(255,255,255,0.4)' }}>Agency ID</span>
                  <span style={{ fontSize:14, fontWeight:700, color:GOLD }}>AGE062600001</span>
                </div>
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
                    style={{ padding:'10px 16px', fontSize:15, cursor:'pointer', color: label==='Logout' ? '#ff6b6b' : label==='Documents' ? GOLD : '#F5F5F5', fontWeight: label==='Documents' ? 700 : 400, background: label==='Documents' ? 'rgba(212,166,74,0.08)' : 'transparent', borderTop: label==='Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = label==='Documents' ? 'rgba(212,166,74,0.08)' : 'transparent')}
                  >{label}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* BODY */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* SIDEBAR */}
        <aside style={{ width:SB_W, flexShrink:0, background:BG2, borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden', transition:'width 0.2s ease' }}>
          <div style={{ height:52, display:'flex', alignItems:'center', justifyContent:sidebarOpen?'flex-end':'center', padding:sidebarOpen?'0 12px':0, borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background:'none', border:'none', cursor:'pointer', width:30, height:30, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background='none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:9, background:'linear-gradient(135deg,#1a1410,#2a1e0e)', border:'1px solid rgba(212,166,74,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:GOLD, fontFamily:BEBAS, flexShrink:0 }}>DP</div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:15, fontWeight:700, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Dharma Productions</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color:RED, fontWeight:600, cursor:'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex:1, padding:sidebarOpen?'8px 6px':'8px 4px', overflowY:'auto' }}>
            {NAV_ITEMS.map(({ icon:Icon, label, badge, href }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display:'flex', alignItems:'center', justifyContent:sidebarOpen?'space-between':'center', padding:sidebarOpen?'8px 10px':'10px 0', marginBottom:2, borderRadius:6, cursor:'pointer', position:'relative' }}
                onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent')}
              >
                <div style={{ display:'flex', alignItems:'center', gap:sidebarOpen?9:0, justifyContent:'center' }}>
                  <Icon size={15} color="rgba(255,255,255,0.42)" strokeWidth={1.8} />
                  {sidebarOpen && <span style={{ fontSize:15, color:'rgba(255,255,255,0.6)', whiteSpace:'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background:RED, color:'#fff', borderRadius:10, fontSize: 14, fontWeight:700, padding:'1px 6px' }}>{badge}</div>}
                {!sidebarOpen && badge && <div style={{ position:'absolute', top:6, right:4, background:RED, borderRadius:'50%', width:14, height:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14, fontWeight:700, color:'#fff' }}>{badge}</div>}
              </div>
            ))}

          </nav>
          {sidebarOpen && (
            <div style={{ margin:'8px 10px 14px', borderRadius:12, background:'linear-gradient(135deg,#1a1205,#2a1e0a)', border:'1px solid rgba(212,166,74,0.25)', padding:'14px 12px', textAlign:'center', flexShrink:0 }}>
              <div style={{ fontSize:20, marginBottom:4 }}>👑</div>
              <div style={{ fontSize:15, fontWeight:700, color:GOLD, marginBottom:3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color:'rgba(255,255,255,0.45)', marginBottom:10, lineHeight:1.5 }}>Unlock advanced filters and AI matching.</div>
              <button onClick={() => router.push('/pricing')} style={{ width:'100%', background:GOLD, color:'#000', border:'none', borderRadius:8, padding:'7px 0', fontSize:14, fontWeight:700, fontFamily:BARLOW, cursor:'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* MAIN SCROLL AREA */}
        <div style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'22px 20px 40px' }}>
          <div style={{ display:'flex', gap:18, minWidth:0 }}>

            {/* LEFT COLUMN */}
            <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:16 }}>

              {/* Page header */}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div>
                  <h1 style={{ fontFamily:BEBAS, fontSize:32, color:GOLD, margin:0, letterSpacing:1 }}>DOCUMENTS</h1>
                  <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', margin:'3px 0 0' }}>Securely manage agency documents, contracts, compliance records and production files.</p>
                </div>
                <div style={{ display:'flex', gap:10, flexShrink:0 }}>
                  {[
                    { label:'Upload Document', icon:<Upload size={14}/>,    action:() => setShowUpload(true) },
                    { label:'Create Folder',   icon:<FolderPlus size={14}/>, action:() => setShowFolder(true) },
                    { label:'Export Report',   icon:<Download size={14}/>,   action:() => setShowExport(true) },
                  ].map(btn => (
                    <button key={btn.label} onClick={btn.action}
                      style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 14px', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:7, color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, fontWeight:600, cursor:'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.15)')}
                    >{btn.icon}{btn.label}</button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
                {[
                  { label:'Total Documents',     value:'487', sub:'Across all categories',  icon:'📄', alert:false },
                  { label:'Storage Used',        value:'8.2 GB', sub:'/ 50 GB · 16% Used',  icon:'☁️', alert:false, bar:true },
                  { label:'Expiring Documents',  value:'5',   sub:'In next 30 days',         icon:'⏰', alert:true,  alertColor:ORANGE },
                  { label:'Pending Verification',value:'2',   sub:'Require attention',       icon:'🛡️', alert:true,  alertColor:RED    },
                  { label:'Signed Contracts',    value:'78',  sub:'Active & completed',      icon:'✍️', alert:false },
                ].map(s => (
                  <div key={s.label} style={{ background:BG2, border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                      <span style={{ fontSize:22 }}>{s.icon}</span>
                      <span style={{ fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:1.2 }}>{s.label}</span>
                    </div>
                    <div style={{ fontFamily:BEBAS, fontSize:28, color:'#F5F5F5', letterSpacing:1, lineHeight:1 }}>{s.value}</div>
                    {s.bar && <div style={{ height:4, background:BG4, borderRadius:2, margin:'6px 0 4px', overflow:'hidden' }}><div style={{ height:'100%', width:'16%', background:GOLD, borderRadius:2 }} /></div>}
                    <div style={{ fontSize: 14, color: s.alert ? s.alertColor : 'rgba(255,255,255,0.35)', marginTop: s.bar ? 0 : 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                {DOC_TABS.map(tab => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                    style={{ padding:'9px 16px', background:'none', border:'none', borderBottom:`2px solid ${activeTab===tab?GOLD:'transparent'}`, marginBottom:-1, cursor:'pointer', fontFamily:BARLOW, fontSize:15, fontWeight:activeTab===tab?700:400, color:activeTab===tab?GOLD:'rgba(255,255,255,0.45)', whiteSpace:'nowrap' }}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search & filters */}
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ flex:1, position:'relative' }}>
                  <Search size={14} color="rgba(255,255,255,0.3)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search documents by name, type or keyword…"
                    style={{ width:'100%', background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:7, padding:'9px 12px 9px 34px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' }} />
                </div>
                <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
                  style={{ background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:7, padding:'9px 12px', color:catFilter?'#F5F5F5':'rgba(255,255,255,0.4)', fontFamily:BARLOW, fontSize:15, outline:'none', cursor:'pointer' }}>
                  <option value="">Category</option>
                  {['Verification','Contracts','Casting Files','Financial','Compliance'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                  style={{ background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:7, padding:'9px 12px', color:statusFilter?'#F5F5F5':'rgba(255,255,255,0.4)', fontFamily:BARLOW, fontSize:15, outline:'none', cursor:'pointer' }}>
                  <option value="">Status</option>
                  {['Verified','Signed','Pending Signature','Active','Paid'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <button style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 14px', background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>
                  <Filter size={14} /> Filters
                </button>
              </div>

              {/* Folder cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
                {FOLDERS.map(f => (
                  <div key={f.name}
                    onClick={() => setOpenFolder(f.name)}
                    style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:14, cursor:'pointer', position:'relative' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor=f.color)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.07)')}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                      <div style={{ width:36, height:36, borderRadius:8, background:'rgba(212,166,74,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>📁</div>
                      <button onClick={e => {
                        e.stopPropagation();
                        const r = e.currentTarget.getBoundingClientRect();
                        setFolderMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
                        setFolderMenuId(folderMenuId === f.name ? '' : f.name);
                      }} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:5, color:'rgba(255,255,255,0.6)', cursor:'pointer', padding:'3px 5px', display:'flex', alignItems:'center' }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.15)')}
                        onMouseLeave={e => (e.currentTarget.style.background='rgba(255,255,255,0.07)')}
                      ><MoreVertical size={14}/></button>
                    </div>
                    <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:700, color:'#F5F5F5', marginBottom:2 }}>{f.name}</div>
                    <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>{f.count} Documents</div>
                    {f.verified && (
                      <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:4, padding:'2px 8px', marginBottom:8 }}>
                        <CheckCircle size={10} color={GREEN} />
                        <span style={{ fontFamily:BARLOW, fontSize: 14, color:GREEN, fontWeight:600 }}>Verified</span>
                      </div>
                    )}
                    <div style={{ fontSize: 14, color:'rgba(255,255,255,0.3)', marginBottom:4 }}>Includes:</div>
                    {f.includes.map(inc => (
                      <div key={inc} style={{ display:'flex', alignItems:'center', gap:5, marginBottom:2 }}>
                        <div style={{ width:3, height:3, borderRadius:'50%', background:f.color, flexShrink:0 }} />
                        <span style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)' }}>{inc}</span>
                      </div>
                    ))}
                    <div style={{ marginTop:10, padding:'6px 0 0', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                      <span style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.35)' }}>Click to open folder</span>
                      <ChevronRight size={12} color="rgba(255,255,255,0.35)" />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── RECENT DOCUMENTS TABLE ── */}
              <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, overflow:'visible' }}>
                <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontFamily:BEBAS, fontSize:17, color:'#F5F5F5', letterSpacing:1 }}>
                    {activeTab==='All Documents' ? 'RECENT DOCUMENTS' : activeTab.toUpperCase()}
                  </div>
                </div>

                {/* Table header */}
                <div style={{ display:'grid', gridTemplateColumns:'3fr 1.2fr 1.8fr 1.2fr 1.4fr 1fr', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  {['DOCUMENT NAME','CATEGORY','UPLOADED BY','DATE','STATUS','ACTIONS'].map(h => (
                    <div key={h} style={{ fontSize: 14, color:'rgba(255,255,255,0.35)', fontFamily:BARLOW, fontWeight:700, letterSpacing:0.5 }}>{h}</div>
                  ))}
                </div>

                {/* Table rows */}
                {paged.length === 0 ? (
                  <div style={{ padding:32, textAlign:'center', color:'rgba(255,255,255,0.3)', fontFamily:BARLOW, fontSize:15 }}>No documents found</div>
                ) : paged.map(doc => (
                  <div key={doc.id}
                    style={{ display:'grid', gridTemplateColumns:'3fr 1.2fr 1.8fr 1.2fr 1.4fr 1fr', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                  >
                    {/* Doc name */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:6, background: EXT_BG[doc.ext] || 'rgba(212,166,74,0.15)', border:`1px solid ${EXT_COLOR[doc.ext] || GOLD}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:BEBAS, fontSize: 14, color: EXT_COLOR[doc.ext] || GOLD, letterSpacing:0.5, flexShrink:0 }}>
                        {doc.ext}
                      </div>
                      <div>
                        <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{doc.name}</div>
                        <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.3)' }}>{doc.size}</div>
                      </div>
                    </div>
                    {/* Category */}
                    <div>
                      <span style={{ padding:'3px 10px', background: CAT_BG[doc.category] || 'rgba(212,166,74,0.15)', borderRadius:5, fontFamily:BARLOW, fontSize:14, color: CAT_COLOR[doc.category] || GOLD, fontWeight:600 }}>
                        {doc.category}
                      </span>
                    </div>
                    {/* Uploader */}
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', overflow:'hidden', flexShrink:0, background:BG4 }}>
                        <img src={`https://images.unsplash.com/${doc.img}?w=60&q=80`} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
                      </div>
                      <div>
                        <div style={{ fontFamily:BARLOW, fontSize:14, color:'#F5F5F5', fontWeight:600 }}>{doc.uploader}</div>
                        <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.35)' }}>{doc.role}</div>
                      </div>
                    </div>
                    {/* Date */}
                    <div>
                      <div style={{ fontFamily:BARLOW, fontSize:14, color:'#F5F5F5' }}>{doc.date}</div>
                      <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.35)' }}>{doc.time}</div>
                    </div>
                    {/* Status */}
                    <div>
                      <span style={{ padding:'3px 10px', background: doc.statusBg, borderRadius:5, fontFamily:BARLOW, fontSize:14, color: doc.statusColor, fontWeight:600, whiteSpace:'nowrap' }}>
                        {doc.status}
                      </span>
                    </div>
                    {/* Actions */}
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      {/* Eye — View */}
                      <button title="View" onClick={() => setViewDocId(doc.id)}
                        style={{ width:30, height:30, borderRadius:6, background:'rgba(59,130,246,0.18)', border:'1px solid rgba(59,130,246,0.4)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:BLUE, flexShrink:0 }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(59,130,246,0.35)')}
                        onMouseLeave={e => (e.currentTarget.style.background='rgba(59,130,246,0.18)')}
                      ><Eye size={14} /></button>
                      {/* Download / Send */}
                      {doc.status === 'Pending Signature'
                        ? <button title="Send for Signature"
                            style={{ width:30, height:30, borderRadius:6, background:'rgba(212,166,74,0.18)', border:'1px solid rgba(212,166,74,0.4)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:GOLD, flexShrink:0 }}
                            onMouseEnter={e => (e.currentTarget.style.background='rgba(212,166,74,0.35)')}
                            onMouseLeave={e => (e.currentTarget.style.background='rgba(212,166,74,0.18)')}
                          ><Send size={14} /></button>
                        : <button title="Download"
                            style={{ width:30, height:30, borderRadius:6, background:'rgba(34,197,94,0.18)', border:'1px solid rgba(34,197,94,0.4)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:GREEN, flexShrink:0 }}
                            onMouseEnter={e => (e.currentTarget.style.background='rgba(34,197,94,0.35)')}
                            onMouseLeave={e => (e.currentTarget.style.background='rgba(34,197,94,0.18)')}
                          ><Download size={14} /></button>
                      }
                      {/* Three-dot */}
                      <button title="More options"
                        onClick={e => {
                          e.stopPropagation();
                          const r = e.currentTarget.getBoundingClientRect();
                          setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
                          setMenuDocId(menuDocId === doc.id ? '' : doc.id);
                        }}
                        style={{ width:30, height:30, borderRadius:6, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#F5F5F5', flexShrink:0 }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.15)')}
                        onMouseLeave={e => (e.currentTarget.style.background='rgba(255,255,255,0.07)')}
                      ><MoreVertical size={14} /></button>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>
                    Showing {filtered.length===0?0:(page-1)*PER_PAGE+1} to {Math.min(page*PER_PAGE,filtered.length)} of {filtered.length} documents
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                      style={{ width:30, height:30, borderRadius:5, background:BG3, border:'1px solid rgba(255,255,255,0.1)', color:page===1?'rgba(255,255,255,0.2)':'#F5F5F5', cursor:page===1?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length:Math.min(totalPages,5) },(_,i)=>i+1).map(pg => (
                      <button key={pg} onClick={() => setPage(pg)}
                        style={{ width:30, height:30, borderRadius:5, background:page===pg?GOLD:BG3, border:`1px solid ${page===pg?GOLD:'rgba(255,255,255,0.1)'}`, color:page===pg?BG:'#F5F5F5', cursor:'pointer', fontFamily:BARLOW, fontSize:14, fontWeight:600 }}>
                        {pg}
                      </button>
                    ))}
                    {totalPages>5 && <span style={{ color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, fontSize:14, lineHeight:'30px' }}>…</span>}
                    <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                      style={{ width:30, height:30, borderRadius:5, background:BG3, border:'1px solid rgba(255,255,255,0.1)', color:page===totalPages?'rgba(255,255,255,0.2)':'#F5F5F5', cursor:page===totalPages?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* E-Signature Activity */}
              <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <div>
                    <div style={{ fontFamily:BEBAS, fontSize:17, color:'#F5F5F5', letterSpacing:1 }}>E-SIGNATURE ACTIVITY</div>
                    <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Recent signed documents and signature status</div>
                  </div>
                  <button onClick={() => setShowEsig(true)} style={{ background:'none', border:'none', color:GOLD, fontFamily:BARLOW, fontSize:15, fontWeight:600, cursor:'pointer' }}>View All Signatures</button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:14 }}>
                  {ESIGS.map(sig => (
                    <div key={sig.title} onClick={() => setShowEsig(true)} style={{ background:BG3, border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:14, display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor=sig.color)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.06)')}
                    >
                      <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(34,197,94,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <CheckCircle size={16} color={sig.color} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sig.title}</div>
                        <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>Signed by {sig.signer}</div>
                        <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.3)' }}>{sig.date}</div>
                      </div>
                      <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => setShowEsig(true)} style={{ flex:1, padding:9, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, fontWeight:600, cursor:'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.1)')}
                  >View Signatures</button>
                  <button onClick={() => setShowEsig(true)} style={{ flex:1, padding:9, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, fontWeight:600, cursor:'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.1)')}
                  >Manage E-Signatures</button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ width:250, flexShrink:0, display:'flex', flexDirection:'column', gap:14 }}>

              {/* Doc Health */}
              <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:16 }}>
                <div style={{ fontFamily:BEBAS, fontSize:15, color:GOLD, letterSpacing:1, marginBottom:12 }}>DOCUMENT HEALTH</div>
                <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
                  <svg viewBox="0 0 120 120" style={{ width:120, height:120 }}>
                    <circle cx="60" cy="60" r="44" fill="none" stroke={BG4} strokeWidth={14} />
                    <circle cx="60" cy="60" r="44" fill="none" stroke={GREEN} strokeWidth={14} strokeDasharray="253 276" strokeDashoffset="69" strokeLinecap="butt" transform="rotate(-90 60 60)" />
                    <circle cx="60" cy="60" r="44" fill="none" stroke={GOLD} strokeWidth={14} strokeDasharray="17 276" strokeDashoffset="-184" strokeLinecap="butt" transform="rotate(-90 60 60)" />
                    <circle cx="60" cy="60" r="44" fill="none" stroke={RED} strokeWidth={14} strokeDasharray="6 276" strokeDashoffset="-201" strokeLinecap="butt" transform="rotate(-90 60 60)" />
                    <text x="60" y="55" textAnchor="middle" fill="#F5F5F5" fontFamily={BEBAS} fontSize="20" letterSpacing="1">92%</text>
                    <text x="60" y="70" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontFamily={BARLOW} fontSize="10">Compliance Score</text>
                  </svg>
                </div>
                {[{label:'Compliant',pct:'92%',color:GREEN},{label:'Warning',pct:'6%',color:GOLD},{label:'Critical',pct:'2%',color:RED}].map(s=>(
                  <div key={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:s.color }} />
                      <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.6)' }}>{s.label}</span>
                    </div>
                    <span style={{ fontFamily:BARLOW, fontSize:14, fontWeight:700, color:s.color }}>{s.pct}</span>
                  </div>
                ))}
              </div>

              {/* Verification Status */}
              <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:16 }}>
                <div style={{ fontFamily:BEBAS, fontSize:15, color:GOLD, letterSpacing:1, marginBottom:12 }}>VERIFICATION STATUS</div>
                {[
                  { label:'Agency Verified', status:'Verified', ok:true },
                  { label:'GST Verified',    status:'Verified', ok:true },
                  { label:'PAN Verified',    status:'Verified', ok:true },
                  { label:'One Document Expiring', status:'Action Required', ok:false },
                ].map(v=>(
                  <div key={v.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                      {v.ok ? <CheckCircle size={14} color={GREEN} /> : <AlertTriangle size={14} color={ORANGE} />}
                      <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.7)' }}>{v.label}</span>
                    </div>
                    <span style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:600, color:v.ok?GREEN:ORANGE }}>{v.status}</span>
                  </div>
                ))}
              </div>

              {/* Storage */}
              <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:16 }}>
                <div style={{ fontFamily:BEBAS, fontSize:15, color:GOLD, letterSpacing:1, marginBottom:12 }}>STORAGE ANALYTICS</div>
                <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:0.5, marginBottom:4 }}>
                  8.2 GB <span style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, fontWeight:400 }}>/ 50 GB Used</span>
                  <span style={{ fontSize:14, color:GOLD, fontFamily:BARLOW, marginLeft:8 }}>16%</span>
                </div>
                <div style={{ height:6, background:BG4, borderRadius:3, overflow:'hidden', marginBottom:8 }}>
                  <div style={{ height:'100%', width:'16%', background:`linear-gradient(90deg,${GOLD},${ORANGE})`, borderRadius:3 }} />
                </div>
                <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:14 }}>41.8 GB Available</div>
                <button onClick={() => setShowStorage(true)} style={{ width:'100%', padding:8, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.1)')}
                >Manage Storage</button>
              </div>

              {/* Recent Activity */}
              <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <div style={{ fontFamily:BEBAS, fontSize:15, color:GOLD, letterSpacing:1 }}>RECENT ACTIVITY</div>
                  <button onClick={() => { setActiveTab('All Documents'); setPage(1); }} style={{ background:'none', border:'none', color:GOLD, fontFamily:BARLOW, fontSize:15, fontWeight:600, cursor:'pointer' }}>View All</button>
                </div>
                {ACTIVITY.map(a=>(
                  <div key={a.time} style={{ display:'flex', gap:10, marginBottom:10 }}>
                    <div style={{ flexShrink:0, width:46, fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.35)', paddingTop:2 }}>{a.time}</div>
                    <div>
                      <div style={{ fontFamily:BARLOW, fontSize:14, color:'#F5F5F5', fontWeight:600 }}>{a.title}</div>
                      <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{a.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOLDER 3-DOT DROPDOWN ── */}
      {folderMenuId && (
        <>
          <div onClick={() => setFolderMenuId('')} style={{ position:'fixed', inset:0, zIndex:490 }} />
          <div style={{ position:'fixed', top:folderMenuPos.top, right:folderMenuPos.right, background:BG3, border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, zIndex:495, minWidth:170, boxShadow:'0 8px 28px rgba(0,0,0,0.6)' }}>
            {[
              { label:'Open Folder',      icon:'📂', onClick:() => { setOpenFolder(folderMenuId); setFolderMenuId(''); } },
              { label:'Upload to Folder', icon:'⬆️', onClick:() => { setShowUpload(true); setFolderMenuId(''); } },
              { label:'Rename Folder',    icon:'✏️', onClick:() => { setRenameFolder(folderMenuId); setFolderMenuId(''); } },
              { label:'Download All',     icon:'⬇️', onClick:() => { setFolderMenuId(''); alert('Downloading all files in folder…'); } },
              { label:'Share Folder',     icon:'↗️', onClick:() => { setFolderMenuId(''); alert('Share link copied to clipboard!'); } },
              { label:'Delete Folder',    icon:'🗑️', onClick:() => setFolderMenuId(''), red:true },
            ].map(item => (
              <div key={item.label} onClick={item.onClick}
                style={{ padding:'9px 14px', fontFamily:BARLOW, fontSize:15, color:item.red?RED:'#F5F5F5', cursor:'pointer', display:'flex', alignItems:'center', gap:9, borderTop:item.red?'1px solid rgba(255,255,255,0.07)':'none' }}
                onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent')}
              ><span style={{ fontSize:15 }}>{item.icon}</span>{item.label}</div>
            ))}
          </div>
        </>
      )}

      {/* ── FOLDER VIEW MODAL ── */}
      {openFolder && (() => {
        const folder = FOLDERS.find(f => f.name === openFolder);
        if (!folder) return null;
        const folderCat = folder.name === 'Casting Call Documents' ? 'Casting Files'
          : folder.name === 'Financial Documents' ? 'Financial'
          : folder.name === 'Legal & Compliance' ? 'Compliance'
          : folder.name === 'Agency Verification' ? 'Verification'
          : 'Contracts';
        const folderDocs = DOCS.filter(d => d.category === folderCat);
        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, width:820, maxHeight:'85vh', display:'flex', flexDirection:'column', boxShadow:'0 16px 48px rgba(0,0,0,0.7)' }}>
              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:42, height:42, borderRadius:10, background:'rgba(212,166,74,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📁</div>
                  <div>
                    <div style={{ fontFamily:BEBAS, fontSize:22, color:'#F5F5F5', letterSpacing:1 }}>{folder.name}</div>
                    <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{folder.count} documents · {folderCat}</div>
                  </div>
                  {folder.verified && (
                    <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:20, padding:'3px 10px' }}>
                      <CheckCircle size={12} color={GREEN} />
                      <span style={{ fontFamily:BARLOW, fontSize: 14, color:GREEN, fontWeight:600 }}>Verified</span>
                    </div>
                  )}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button onClick={() => setShowUpload(true)}
                    style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer' }}>
                    <Upload size={14} /> Add Document
                  </button>
                  <button onClick={() => setOpenFolder('')}
                    style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:7, padding:'8px 10px', color:'#F5F5F5', cursor:'pointer', display:'flex', alignItems:'center' }}>
                    <X size={16} />
                  </button>
                </div>
              </div>
              {/* Document list */}
              <div style={{ overflowY:'auto', flex:1 }}>
                {/* Column headers */}
                <div style={{ display:'grid', gridTemplateColumns:'3fr 1.5fr 1.5fr 1.2fr 1fr', padding:'10px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', position:'sticky', top:0, background:BG2 }}>
                  {['DOCUMENT NAME','UPLOADED BY','DATE','STATUS','ACTIONS'].map(h => (
                    <div key={h} style={{ fontSize: 14, color:'rgba(255,255,255,0.35)', fontFamily:BARLOW, fontWeight:700, letterSpacing:0.5 }}>{h}</div>
                  ))}
                </div>
                {folderDocs.length === 0 ? (
                  <div style={{ padding:'40px 24px', textAlign:'center' }}>
                    <div style={{ fontSize:32, marginBottom:10 }}>📂</div>
                    <div style={{ fontFamily:BEBAS, fontSize:18, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>This folder is empty</div>
                    <button onClick={() => setShowUpload(true)}
                      style={{ padding:'9px 20px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer' }}>
                      Upload First Document
                    </button>
                  </div>
                ) : folderDocs.map(doc => (
                  <div key={doc.id}
                    style={{ display:'grid', gridTemplateColumns:'3fr 1.5fr 1.5fr 1.2fr 1fr', padding:'12px 24px', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                  >
                    {/* Name */}
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:6, background: EXT_BG[doc.ext]||'rgba(212,166,74,0.15)', border:`1px solid ${EXT_COLOR[doc.ext]||GOLD}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:BEBAS, fontSize: 14, color: EXT_COLOR[doc.ext]||GOLD, flexShrink:0 }}>{doc.ext}</div>
                      <div>
                        <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{doc.name}</div>
                        <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.3)' }}>{doc.size}</div>
                      </div>
                    </div>
                    {/* Uploader */}
                    <div>
                      <div style={{ fontFamily:BARLOW, fontSize:14, color:'#F5F5F5', fontWeight:600 }}>{doc.uploader}</div>
                      <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.35)' }}>{doc.role}</div>
                    </div>
                    {/* Date */}
                    <div>
                      <div style={{ fontFamily:BARLOW, fontSize:14, color:'#F5F5F5' }}>{doc.date}</div>
                      <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.35)' }}>{doc.time}</div>
                    </div>
                    {/* Status */}
                    <div>
                      <span style={{ padding:'3px 10px', background:doc.statusBg, borderRadius:5, fontFamily:BARLOW, fontSize:14, color:doc.statusColor, fontWeight:600, whiteSpace:'nowrap' }}>{doc.status}</span>
                    </div>
                    {/* Actions */}
                    <div style={{ display:'flex', gap:6 }}>
                      <button title="View" onClick={() => { setViewDocId(doc.id); }}
                        style={{ width:28, height:28, borderRadius:5, background:'rgba(59,130,246,0.18)', border:'1px solid rgba(59,130,246,0.4)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:BLUE }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(59,130,246,0.35)')}
                        onMouseLeave={e => (e.currentTarget.style.background='rgba(59,130,246,0.18)')}
                      ><Eye size={13} /></button>
                      <button title="Download"
                        style={{ width:28, height:28, borderRadius:5, background:'rgba(34,197,94,0.18)', border:'1px solid rgba(34,197,94,0.4)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:GREEN }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(34,197,94,0.35)')}
                        onMouseLeave={e => (e.currentTarget.style.background='rgba(34,197,94,0.18)')}
                      ><Download size={13} /></button>
                      <button title="Delete" style={{ width:28, height:28, borderRadius:5, background:'rgba(200,32,42,0.12)', border:'1px solid rgba(200,32,42,0.3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:RED }}
                        onMouseEnter={e => (e.currentTarget.style.background='rgba(200,32,42,0.28)')}
                        onMouseLeave={e => (e.currentTarget.style.background='rgba(200,32,42,0.12)')}
                      ><X size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div style={{ padding:'14px 24px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{folderDocs.length} document{folderDocs.length!==1?'s':''} in this folder</span>
                <button onClick={() => setOpenFolder('')} style={{ padding:'8px 20px', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── RENAME FOLDER MODAL ── */}
      {renameFolder && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:510, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:28, width:380 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>RENAME FOLDER</div>
              <button onClick={() => setRenameFolder('')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
            </div>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Folder Name</label>
            <input defaultValue={renameFolder}
              style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box', marginBottom:16 }} />
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setRenameFolder('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
              <button onClick={() => setRenameFolder('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Name</button>
            </div>
          </div>
        </div>
      )}

      {/* ── FIXED THREE-DOT DROPDOWN ── */}
      {menuDocId && (
        <>
          <div onClick={() => setMenuDocId('')} style={{ position:'fixed', inset:0, zIndex:490 }} />
          <div style={{ position:'fixed', top:menuPos.top, right:menuPos.right, background:BG3, border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, zIndex:495, minWidth:170, boxShadow:'0 8px 28px rgba(0,0,0,0.6)' }}>
            {[
              { label:'View Document',  icon:'👁️', onClick:() => { setViewDocId(menuDocId); setMenuDocId(''); } },
              { label:'Download',       icon:'⬇️', onClick:() => setMenuDocId('') },
              { label:'Share',          icon:'↗️', onClick:() => { setShareDocId(menuDocId); setMenuDocId(''); } },
              { label:'Rename',         icon:'✏️', onClick:() => { setRenameDocId(menuDocId); setMenuDocId(''); } },
              { label:'Move to Folder', icon:'📁', onClick:() => { setMoveDocId(menuDocId); setMenuDocId(''); } },
              { label:'Replace File',   icon:'🔄', onClick:() => { setShowUpload(true); setMenuDocId(''); } },
              { label:'Delete',         icon:'🗑️', onClick:() => setMenuDocId(''), red:true },
            ].map(item=>(
              <div key={item.label} onClick={item.onClick}
                style={{ padding:'9px 14px', fontFamily:BARLOW, fontSize:15, color:item.red?RED:'#F5F5F5', cursor:'pointer', display:'flex', alignItems:'center', gap:9, borderTop:item.red?'1px solid rgba(255,255,255,0.07)':'none' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
              ><span style={{ fontSize:15 }}>{item.icon}</span>{item.label}</div>
            ))}
          </div>
        </>
      )}

      {/* ── VIEW DOCUMENT MODAL ── */}
      {viewDoc && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:28, width:520 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>VIEW DOCUMENT</div>
              <button onClick={() => setViewDocId('')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:18 }}><X size={18}/></button>
            </div>
            <div style={{ background:BG3, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, height:180, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', marginBottom:18, gap:8 }}>
              <div style={{ fontFamily:BEBAS, fontSize:32, color:EXT_COLOR[viewDoc.ext]||GOLD, letterSpacing:2 }}>{viewDoc.ext}</div>
              <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.5)' }}>Click Open File to view</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 20px', marginBottom:20 }}>
              {[
                { label:'File Name',   value:viewDoc.name },
                { label:'Size',        value:viewDoc.size },
                { label:'Category',    value:viewDoc.category },
                { label:'Status',      value:viewDoc.status },
                { label:'Uploaded By', value:viewDoc.uploader },
                { label:'Date',        value:`${viewDoc.date} ${viewDoc.time}` },
              ].map(row=>(
                <div key={row.label}>
                  <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginBottom:2 }}>{row.label}</div>
                  <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', fontWeight:600 }}>{row.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setViewDocId('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
              <button style={{ flex:1, padding:10, background:'rgba(59,130,246,0.2)', border:'1px solid rgba(59,130,246,0.4)', borderRadius:6, color:BLUE, fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer' }}>⬇ Download</button>
              <button style={{ flex:1, padding:10, background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Open File</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MOVE TO FOLDER MODAL ── */}
      {moveDocId && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:28, width:400 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>MOVE TO FOLDER</div>
              <button onClick={() => setMoveDocId('')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
            </div>
            <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.5)', marginBottom:16 }}>Select a destination folder:</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
              {FOLDERS.map(f=>(
                <div key={f.name} onClick={() => setMoveDocId('')}
                  style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:BG3, border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, cursor:'pointer' }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor=GOLD)}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.07)')}
                >
                  <span style={{ fontSize:20 }}>📁</span>
                  <div>
                    <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{f.name}</div>
                    <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{f.count} documents</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setMoveDocId('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── UPLOAD MODAL ── */}
      {showUpload && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:28, width:480 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>UPLOAD DOCUMENT</div>
              <button onClick={() => setShowUpload(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
            </div>
            <div style={{ border:'2px dashed rgba(255,255,255,0.15)', borderRadius:10, padding:'32px 20px', textAlign:'center', marginBottom:18, cursor:'pointer' }}>
              <Upload size={28} color="rgba(255,255,255,0.3)" style={{ marginBottom:10 }} />
              <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', marginBottom:4 }}>Drag & drop files here</div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:14 }}>PDF, DOCX, XLSX, JPG up to 50MB</div>
              <button style={{ padding:'8px 20px', background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer' }}>Browse Files</button>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Category</label>
              <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'9px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
                {['Verification','Contracts','Casting Files','Financial','Compliance'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Document Name</label>
              <input placeholder="Enter document name…" style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'9px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowUpload(false)} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
              <button style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Upload Document</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE FOLDER MODAL ── */}
      {showFolder && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:28, width:400 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>CREATE FOLDER</div>
              <button onClick={() => setShowFolder(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
            </div>
            {[{label:'Folder Name',placeholder:'e.g. Season 3 Documents'},{label:'Description',placeholder:'Optional description…'}].map(f=>(
              <div key={f.label} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>{f.label}</label>
                <input placeholder={f.placeholder} style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'9px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowFolder(false)} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
              <button style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Create Folder</button>
            </div>
          </div>
        </div>
      )}

      {/* ── STORAGE MODAL ── */}
      {showStorage && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:28, width:440 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>MANAGE STORAGE</div>
              <button onClick={() => setShowStorage(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
            </div>
            <div style={{ fontFamily:BEBAS, fontSize:28, color:GOLD, marginBottom:4 }}>8.2 GB <span style={{ fontSize:15, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, fontWeight:400 }}>used of 50 GB</span></div>
            <div style={{ height:8, background:BG4, borderRadius:4, overflow:'hidden', marginBottom:16 }}>
              <div style={{ height:'100%', width:'16%', background:`linear-gradient(90deg,${GOLD},${ORANGE})`, borderRadius:4 }} />
            </div>
            {[
              {label:'Documents & PDFs', size:'4.2 GB', pct:51, color:BLUE},
              {label:'Contracts',        size:'2.1 GB', pct:26, color:GREEN},
              {label:'Media Files',      size:'1.1 GB', pct:13, color:PURPLE},
              {label:'Other',            size:'0.8 GB', pct:10, color:GOLD},
            ].map(item=>(
              <div key={item.label} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.6)' }}>{item.label}</span>
                  <span style={{ fontFamily:BARLOW, fontSize:14, color:'#F5F5F5', fontWeight:600 }}>{item.size}</span>
                </div>
                <div style={{ height:4, background:BG4, borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${item.pct}%`, background:item.color, borderRadius:2 }} />
                </div>
              </div>
            ))}
            <button onClick={() => setShowStorage(false)} style={{ width:'100%', marginTop:8, padding:10, background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Done</button>
          </div>
        </div>
      )}

      {/* ── E-SIGNATURES MANAGEMENT MODAL ── */}
      {showEsig && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, width:700, maxHeight:'80vh', display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily:BEBAS, fontSize:22, color:'#F5F5F5', letterSpacing:1 }}>E-SIGNATURES MANAGEMENT</div>
              <button onClick={() => setShowEsig(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
            </div>
            <div style={{ overflowY:'auto', flex:1, padding:'0 24px 24px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:18, marginBottom:20 }}>
                {[
                  { label:'Total Signatures', value:'78', color:GREEN  },
                  { label:'Pending',           value:'5',  color:GOLD   },
                  { label:'Signed',            value:'71', color:GREEN  },
                  { label:'Declined',          value:'2',  color:RED    },
                ].map(s => (
                  <div key={s.label} style={{ background:BG3, border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'14px 16px' }}>
                    <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.45)', marginBottom:4 }}>{s.label}</div>
                    <div style={{ fontFamily:BEBAS, fontSize:28, color:s.color, letterSpacing:1 }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily:BEBAS, fontSize:16, color:'#F5F5F5', letterSpacing:1, marginBottom:12 }}>RECENT SIGNATURE REQUESTS</div>
              {[...ESIGS, { title:'Production NDA #445', signer:'Studio XYZ', date:'05 Jun 2026 · 01:00 PM', color:ORANGE }, { title:'Casting Agreement #112', signer:'Priya K', date:'03 Jun 2026 · 03:30 PM', color:PURPLE }].map(sig => (
                <div key={sig.title} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:BG3, border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(34,197,94,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <CheckCircle size={16} color={sig.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily:BARLOW, fontSize:14, fontWeight:600, color:'#F5F5F5' }}>{sig.title}</div>
                      <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>Signed by {sig.signer} · {sig.date}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button style={{ padding:'5px 12px', background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.3)', borderRadius:5, color:BLUE, fontFamily:BARLOW, fontSize: 14, fontWeight:600, cursor:'pointer' }}>View</button>
                    <button style={{ padding:'5px 12px', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:5, color:GREEN, fontFamily:BARLOW, fontSize: 14, fontWeight:600, cursor:'pointer' }}>Download</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:'14px 24px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:10 }}>
              <button style={{ flex:1, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Send New Signature Request</button>
              <button onClick={() => setShowEsig(false)} style={{ padding:'10px 20px', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPORT REPORT MODAL ── */}
      {showExport && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:28, width:420 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>EXPORT REPORT</div>
              <button onClick={() => setShowExport(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
            </div>
            {[
              { label:'Format', options:['PDF Report','Excel Spreadsheet','CSV File'] },
              { label:'Include', options:['All Documents','Current Tab Only','Selected Category'] },
              { label:'Date Range', options:['Last 7 Days','Last 30 Days','Last 3 Months','All Time'] },
            ].map(f => (
              <div key={f.label} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>{f.label}</label>
                <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'9px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:8 }}>
              <button onClick={() => setShowExport(false)} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
              <button onClick={() => setShowExport(false)} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Export Now</button>
            </div>
          </div>
        </div>
      )}

      {/* ── RENAME DOCUMENT MODAL ── */}
      {renameDocId && (() => {
        const doc = DOCS.find(d => d.id === renameDocId);
        if (!doc) return null;
        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:510, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:28, width:400 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>RENAME DOCUMENT</div>
                <button onClick={() => setRenameDocId('')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
              </div>
              <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Document Name</label>
              <input defaultValue={doc.name}
                style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box', marginBottom:16 }} />
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setRenameDocId('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
                <button onClick={() => setRenameDocId('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Name</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── SHARE DOCUMENT MODAL ── */}
      {shareDocId && (() => {
        const doc = DOCS.find(d => d.id === shareDocId);
        if (!doc) return null;
        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:510, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:28, width:420 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>SHARE DOCUMENT</div>
                <button onClick={() => setShareDocId('')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
              </div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:16 }}>Sharing: <span style={{ color:'#F5F5F5', fontWeight:600 }}>{doc.name}</span></div>
              <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Share with (email)</label>
              <input placeholder="Enter email address…"
                style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box', marginBottom:14 }} />
              <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Permission</label>
              <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'9px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', marginBottom:16 }}>
                <option>View Only</option>
                <option>Can Download</option>
                <option>Can Edit</option>
              </select>
              <div style={{ padding:'10px 14px', background:BG3, borderRadius:6, marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>https://silverscreens.com/docs/share/{doc.id}</span>
                <button style={{ padding:'4px 10px', background:GOLD, border:'none', borderRadius:4, color:BG, fontFamily:BARLOW, fontSize: 14, fontWeight:700, cursor:'pointer', flexShrink:0 }}>Copy</button>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setShareDocId('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
                <button onClick={() => setShareDocId('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Send Invite</button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}