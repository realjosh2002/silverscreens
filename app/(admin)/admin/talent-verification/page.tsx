'use client';
import AdminSidebar from '@/components/layout/AdminSidebar';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminTopnav from '@/components/layout/AdminTopnav';
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

const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = 'rgba(255,255,255,0.03)';
const GOLD   = '#D4A64A';
const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';
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
  { label: 'My Profile',               href: '/admin/profile'          },
  { label: 'Account Settings',         href: '/admin/account-settings' },
  { label: 'Security & Login',         href: '/admin/security-login'   },
  { label: 'Notification Preferences', href: '/admin/notifications'    },
  { label: 'Activity Log',             href: '/admin/activity-log'     },
  { label: 'Help & Support',           href: '/admin/help-support'     },
  { label: 'Logout',                   href: '/admin/login'            },
];

// Real data loaded from API
type Aspirant = {
  id: string; profile_id: string; user_id: string;
  name: string; email: string; phone: string;
  location: string; joined: string; submitted: string; status: string;
  title: string; first_name: string; last_name: string;
  dob: string; gender: string; nationality: string;
  address_line1: string; address_line2: string;
  city: string; state: string; pincode: string; country: string;
  height_cm: number; weight_kg: number; hair_color: string; eye_color: string;
  body_tone: string; body_type: string; chest_size: number; hip_size: number;
  waist_size: number; shoe_size: number;
  department: string; role: string; experience_level: string;
  about_me: string; languages: string[]; skills: string[]; availability: string[];
  profile_image_url: string; intro_video_url: string; resume_url: string;
  social_links: Record<string, any>;
  profileCompletion: number; matchScore: number; profile_views: number;
  is_available: boolean; subscription: string; avatar: string;
  appliedCastings: number;
  docStatus: Record<string,string>; history: {event:string;time:string;color:string}[];
};

// TABS badges will be dynamic from API counts
const TABS_CONFIG = [
  { key:'Pending',  label:'Pending Verification' },
  { key:'Approved', label:'Approved'              },
  { key:'Rejected', label:'Rejected'              },
  { key:'On Hold',  label:'On Hold'               },
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

function getAuthHeaders() {
  try {
    const raw = localStorage.getItem('ss_user') || sessionStorage.getItem('ss_user') || '{}';
    const u = JSON.parse(raw);
    const t = u.token ?? u.access_token ?? '';
    return t ? { Authorization: `Bearer ${t}` } : {};
  } catch { return {}; }
}

function fmtDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function initials(name: string) {
  return (name || 'U').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function TalentVerificationPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [activeTab,     setActiveTab]     = useState('Pending');
  const [search,        setSearch]        = useState('');
  const [selected,      setSelected]      = useState<Aspirant|null>(null);
  const [notes,         setNotes]         = useState('');
  const [modal,         setModal]         = useState('');
  const [docStatuses,   setDocStatuses]   = useState({ idProof:'Pending', addressProof:'Pending', faceVerification:'Pending', profileReview:'Pending' });
  const [rejectReason,   setRejectReason]   = useState('Documents unclear or invalid');
  const [actionLoading,  setActionLoading]  = useState(false);
  const [toast,          setToast]          = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [innerTab,       setInnerTab]       = useState<'profile'|'media'>('profile');
  const [media,          setMedia]          = useState<{id:string;type:string;url:string;is_primary:boolean;moderation_status:string;rejection_reason:string}[]>([]);
  const [mediaLoading,   setMediaLoading]   = useState(false);
  const [mediaModal,     setMediaModal]     = useState<{id:string;type:string;url:string}|null>(null);
  const [rejectMediaId,  setRejectMediaId]  = useState<string|null>(null);
  const [mediaRejectReason, setMediaRejectReason] = useState('Content does not meet platform standards');

  // Real data
  const [ASPIRANTS, setASPIRANTS] = useState<Aspirant[]>([]);
  const [counts,    setCounts]    = useState({ Pending:0, Approved:0, Rejected:0, 'On Hold':0 });
  const [loading,   setLoading]   = useState(true);


  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAspirants = useCallback(() => {
    setLoading(true);
    const h = getAuthHeaders();
    const statusParam = activeTab === 'Pending' ? 'pending' : activeTab === 'Approved' ? 'approved' : activeTab === 'Rejected' ? 'rejected' : 'pending';
    fetch(`/api/admin/verification?type=aspirant&status=${statusParam}`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.data) return;
        const raw = data.data.aspirants ?? [];
        const mapped: Aspirant[] = raw.map((a: any) => ({
          id:                a.profiles?.profile_number || a.profile_number || a.id.slice(0,8),
          profile_id:        a.id,
          user_id:           a.user_id,
          name:              [a.title, a.first_name, a.last_name].filter(Boolean).join(' ') || a.profiles?.name || '—',
          email:             a.profiles?.email || '—',
          phone:             a.profiles?.phone || '—',
          location:          [a.city, a.state].filter(Boolean).join(', ') || '—',
          joined:            fmtDate(a.created_at),
          submitted:         fmtDate(a.updated_at || a.created_at),
          status:            a.verification_status === 'pending' ? 'Pending' : a.verification_status === 'approved' ? 'Approved' : a.verification_status === 'rejected' ? 'Rejected' : 'On Hold',
          title:             a.title || '',
          first_name:        a.first_name || '',
          last_name:         a.last_name || '',
          dob:               a.date_of_birth ? fmtDate(a.date_of_birth) : '—',
          gender:            a.gender || '—',
          nationality:       a.country || '—',
          address_line1:     a.address_line1 || '',
          address_line2:     a.address_line2 || '',
          city:              a.city || '—',
          state:             a.state || '—',
          pincode:           a.pincode || '',
          country:           a.country || '',
          height_cm:         a.height_cm ?? 0,
          weight_kg:         a.weight_kg ?? 0,
          hair_color:        a.hair_color || '—',
          eye_color:         a.eye_color || '—',
          body_tone:         a.body_tone || '—',
          body_type:         a.body_type || '—',
          chest_size:        a.chest_size ?? 0,
          hip_size:          a.hip_size ?? 0,
          waist_size:        a.waist_size ?? 0,
          shoe_size:         a.shoe_size ?? 0,
          department:        a.category || '—',
          role:              a.role || '—',
          experience_level:  a.experience_level || '—',
          about_me:          a.about_me || '',
          languages:         a.languages ?? [],
          skills:            a.skills ?? [],
          availability:      a.availability ?? [],
          profile_image_url: a.profile_image_url || '',
          intro_video_url:   a.intro_video_url || '',
          resume_url:        a.resume_url || '',
          social_links:      a.social_links ?? {},
          profileCompletion: a.profile_completion ?? 0,
          matchScore:        a.trust_score ?? 0,
          profile_views:     a.profile_views ?? 0,
          is_available:      a.is_available ?? false,
          subscription:      a.profiles?.subscriptions?.[0]?.plan_name || '—',
          avatar:            a.profile_image_url || '',
          appliedCastings:   0,
          docStatus:         { idProof:'Pending', addressProof:'Pending', faceVerification:'Pending', profileReview:'Pending' },
          history:           Array.isArray(a.history) ? a.history : [],
        }));
        setASPIRANTS(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  const fetchCounts = useCallback(() => {
    const h = getAuthHeaders();
    Promise.all([
      fetch('/api/admin/verification?type=aspirant&status=pending',  { headers: h }).then(r => r.ok ? r.json() : null),
      fetch('/api/admin/verification?type=aspirant&status=approved', { headers: h }).then(r => r.ok ? r.json() : null),
      fetch('/api/admin/verification?type=aspirant&status=rejected', { headers: h }).then(r => r.ok ? r.json() : null),
    ]).then(([p, a, r]) => {
      setCounts({
        'Pending':  p?.data?.aspirants?.length ?? 0,
        'Approved': a?.data?.aspirants?.length ?? 0,
        'Rejected': r?.data?.aspirants?.length ?? 0,
        'On Hold':  0,
      });
    }).catch(() => {});
  }, []);

  const fetchMedia = useCallback((aspirantProfileId: string) => {
    setMediaLoading(true);
    const h = getAuthHeaders();
    fetch(`/api/admin/media-moderation?aspirant_id=${aspirantProfileId}&status=all`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.data) setMedia(data.data.media || []); })
      .catch(() => {})
      .finally(() => setMediaLoading(false));
  }, []);

  useEffect(() => { fetchAspirants(); }, [fetchAspirants]);
  useEffect(() => { fetchCounts(); },    [fetchCounts]);

  const filtered = ASPIRANTS.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleReview = (a: Aspirant) => {
    setSelected(a);
    setDocStatuses({ ...a.docStatus });
    setNotes('');
    setInnerTab('profile');
    setMedia([]);
    fetchMedia(a.profile_id);
  };

  const navIdx  = selected ? filtered.findIndex(a => a.id === selected.id) : -1;
  const prevAsp = navIdx > 0 ? filtered[navIdx - 1] : null;
  const nextAsp = navIdx < filtered.length - 1 ? filtered[navIdx + 1] : null;

  async function doMediaAction(mediaId: string, action: 'approve' | 'reject') {
    setActionLoading(true);
    const h = getAuthHeaders();
    try {
      const res = await fetch('/api/admin/media-moderation', {
        method: 'PUT',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_id: mediaId, action, rejection_reason: mediaRejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(action === 'approve' ? 'Media approved' : 'Media rejected — aspirant notified', 'success');
        setRejectMediaId(null);
        if (selected) fetchMedia(selected.profile_id);
      } else {
        showToast(data.error || 'Action failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function doVerification(action: 'approve' | 'reject' | 'request_info') {
    if (!selected) return;
    setActionLoading(true);
    const h = getAuthHeaders();
    try {
      const res = await fetch('/api/admin/verification', {
        method: 'PUT',
        headers: { ...h, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id:       selected.profile_id,
          profile_type:     'aspirant',
          action,
          rejection_reason: rejectReason,
        }),
      });
      const data = await res.json();
      // Handle both { success: true } and { success: false, error/message }
      if (res.ok && (data.success !== false)) {
        showToast(action === 'approve' ? `${selected.name} approved!` : action === 'reject' ? `${selected.name} rejected` : 'Info requested', 'success');
        setModal('');
        setSelected(null);
        // Switch to the matching tab so admin can see the result
        if (action === 'approve') setActiveTab('Approved');
        else if (action === 'reject') setActiveTab('Rejected');
        // fetchAspirants fires via useEffect when activeTab changes
        fetchCounts();
      } else {
        const errMsg = data.error || data.message || `Action failed (HTTP ${res.status})`;
        console.error('[doVerification] error:', errMsg, data);
        showToast(errMsg, 'error');
      }
    } catch (e) {
      console.error('[doVerification] network error:', e);
      showToast('Network error', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // AdminTopnav used directly below

  /* ── SIDEBAR ── */
  const Sidebar = () => (
        <AdminSidebar onCollapse={(c) => setSidebarOpen(!c)} />
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:BG, fontFamily:BARLOW, color:'#F5F5F5' }}>
      <AdminTopnav/>
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
                    { label:'Total Aspirants', value:counts['Pending']+counts['Approved']+counts['Rejected'], delta:'Live count', color:BLUE,   icon:'👥', tab:null       },
                    { label:'Pending Review',  value:counts['Pending'],  delta:'Awaiting review', color:ORANGE, icon:'⏳', tab:'Pending'  },
                    { label:'Approved',        value:counts['Approved'], delta:'Verified',        color:GREEN,  icon:'✅', tab:'Approved' },
                    { label:'Rejected',        value:counts['Rejected'], delta:'Declined',        color:RED,    icon:'❌', tab:'Rejected' },
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
                    {TABS_CONFIG.map(tab => (
                      <div key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 12px', marginBottom:4, borderRadius:8, cursor:'pointer', background:activeTab===tab.key?`${RED}15`:'transparent', border:activeTab===tab.key?`1px solid ${RED}30`:'1px solid transparent' }}
                        onMouseEnter={e => { if(activeTab!==tab.key) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { if(activeTab!==tab.key) e.currentTarget.style.background='transparent'; }}
                      >
                        <span style={{ fontFamily:BARLOW, fontSize:15, color:activeTab===tab.key?'#F5F5F5':'rgba(255,255,255,0.55)', fontWeight:activeTab===tab.key?700:400 }}>{tab.label}</span>
                        <span style={{ padding:'1px 8px', background:activeTab===tab.key?RED:'rgba(255,255,255,0.08)', borderRadius:20, fontSize: 14, fontWeight:700, color:activeTab===tab.key?'#fff':'rgba(255,255,255,0.45)' }}>{counts[tab.key as keyof typeof counts] ?? 0}</span>
                      </div>
                    ))}
                    <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'16px 0' }}/>
                    <div style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase' as const, marginBottom:8 }}>Search</div>
                    <div style={{ position:'relative', marginBottom:14 }}>
                      <Search size={14} color="rgba(255,255,255,0.3)" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, ID or email..."
                        style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'8px 10px 8px 30px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', boxSizing:'border-box' as const }}/>
                    </div>
                    <button style={{ width:'100%', padding:'10px', background:RED, border:'none', borderRadius:8, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Apply Filters</button>
                  </div>

                  {/* Right Table */}
                  <div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <span style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.5)' }}>
                        Viewing: <strong style={{ color:'#F5F5F5' }}>{TABS_CONFIG.find(t=>t.key===activeTab)?.label} ({filtered.length})</strong>
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
                        {['Applicant','Location','Submitted','Completion','Subscription','Action'].map(h => (
                          <div key={h} style={{ fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:'rgba(255,255,255,0.45)', letterSpacing:0.5, textTransform:'uppercase' as const }}>{h}</div>
                        ))}
                      </div>

                      {loading ? (
                        <div style={{ textAlign:'center' as const, padding:60, color:'rgba(255,255,255,0.3)', fontFamily:BARLOW, fontSize:16 }}>Loading…</div>
                      ) : filtered.length === 0 ? (
                        <div style={{ textAlign:'center' as const, padding:60, color:'rgba(255,255,255,0.3)', fontFamily:BARLOW, fontSize:16 }}>No aspirants found in this queue</div>
                      ) : filtered.map((a, i) => {
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
                                <div style={{ width:44, height:44, borderRadius:'50%', overflow:'hidden', border:`2px solid ${statusColor(a.status)}40`, background:'rgba(200,32,42,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:RED }}>
                                  {a.avatar ? <img src={a.avatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/> : (a.name||'U').charAt(0)}
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
                             {/* Subscription */}
                             <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)' }}>
                               {a.subscription}
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
                      <div style={{ fontFamily:BARLOW, fontSize:24, fontWeight:700, color:'#F5F5F5' }}>Reviewing: {selected.name}</div>
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

                {/* Inner tabs */}
                <div style={{ display:'flex', gap:0, borderBottom:'2px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
                  {[{key:'profile',label:'Profile Details'},{key:'media',label:`Media (${media.length})`}].map(t => (
                    <button key={t.key} onClick={() => setInnerTab(t.key as any)}
                      style={{ padding:'9px 18px', background:'none', border:'none', cursor:'pointer', fontFamily:BARLOW, fontSize:15, fontWeight:innerTab===t.key?700:400, color:innerTab===t.key?'#F5F5F5':'rgba(255,255,255,0.45)', borderBottom:innerTab===t.key?`2px solid ${RED}`:'2px solid transparent', marginBottom:-2 }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Media Tab */}
                {innerTab === 'media' && (
                  <div>
                    {mediaLoading ? (
                      <div style={{ textAlign:'center' as const, padding:40, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, fontSize:15 }}>Loading media…</div>
                    ) : media.length === 0 ? (
                      <div style={{ textAlign:'center' as const, padding:40, background:BG2, borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, fontSize:15 }}>No media uploaded by this aspirant yet.</div>
                    ) : (
                      <div>
                        {/* Images */}
                        {media.filter(m => m.type === 'image').length > 0 && (
                          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20, marginBottom:14 }}>
                            <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:'#F5F5F5', marginBottom:16 }}>Images ({media.filter(m=>m.type==='image').length})</div>
                            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                              {media.filter(m => m.type === 'image').map(m => (
                                <div key={m.id} style={{ borderRadius:10, overflow:'hidden', border:`2px solid ${m.moderation_status==='approved'?GREEN:m.moderation_status==='rejected'?RED:'rgba(255,255,255,0.1)'}`, position:'relative' as const }}>
                                  <img src={m.url} alt="" style={{ width:'100%', aspectRatio:'3/4', objectFit:'cover', display:'block', cursor:'pointer' }} onClick={() => setMediaModal(m)} />
                                  {m.is_primary && <div style={{ position:'absolute' as const, top:6, left:6, background:GOLD, color:'#000', fontFamily:BARLOW, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:10 }}>PRIMARY</div>}
                                  <div style={{ position:'absolute' as const, top:6, right:6, padding:'2px 10px', borderRadius:10, fontSize:11, fontWeight:700, fontFamily:BARLOW, background:m.moderation_status==='approved'?'rgba(34,197,94,0.9)':m.moderation_status==='rejected'?'rgba(200,32,42,0.9)':'rgba(245,158,11,0.9)', color:'#fff' }}>
                                    {m.moderation_status==='approved'?'✓ Approved':m.moderation_status==='rejected'?'✗ Rejected':'⏳ Pending'}
                                  </div>
                                  {m.rejection_reason && (
                                    <div style={{ padding:'6px 10px', background:'rgba(200,32,42,0.15)', fontSize:11, fontFamily:BARLOW, color:'#EF4444', lineHeight:1.4 }}>{m.rejection_reason}</div>
                                  )}
                                  <div style={{ display:'flex', gap:6, padding:'8px 10px', background:BG3 }}>
                                    {m.moderation_status !== 'approved' && (
                                      <button disabled={actionLoading} onClick={() => doMediaAction(m.id,'approve')}
                                        style={{ flex:1, padding:'5px 0', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:5, color:GREEN, fontFamily:BARLOW, fontSize:13, fontWeight:700, cursor:'pointer' }}>✓ Approve</button>
                                    )}
                                    {m.moderation_status !== 'rejected' && (
                                      <button disabled={actionLoading} onClick={() => setRejectMediaId(m.id)}
                                        style={{ flex:1, padding:'5px 0', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:5, color:RED, fontFamily:BARLOW, fontSize:13, fontWeight:700, cursor:'pointer' }}>✗ Reject</button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Videos */}
                        {media.filter(m => m.type === 'video').length > 0 && (
                          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                            <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:'#F5F5F5', marginBottom:16 }}>Videos ({media.filter(m=>m.type==='video').length})</div>
                            <div style={{ display:'flex', flexDirection:'column' as const, gap:10 }}>
                              {media.filter(m => m.type === 'video').map(m => (
                                <div key={m.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:BG3, borderRadius:10, border:`1px solid ${m.moderation_status==='approved'?GREEN:m.moderation_status==='rejected'?RED:'rgba(255,255,255,0.08)'}` }}>
                                  <div style={{ width:80, height:52, borderRadius:6, overflow:'hidden', flexShrink:0, position:'relative' as const, cursor:'pointer', background:BG4 }} onClick={() => setMediaModal(m)}>
                                    <video src={m.url} style={{ width:'100%', height:'100%', objectFit:'cover' as const }} muted preload="metadata" />
                                    <div style={{ position:'absolute' as const, inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.45)' }}>
                                      <span style={{ fontSize:20, lineHeight:1 }}>▶</span>
                                    </div>
                                  </div>
                                  <div style={{ flex:1, minWidth:0 }}>
                                    <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.6)', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{m.url.split('/').pop()}</div>
                                    <span style={{ padding:'2px 10px', borderRadius:10, fontSize:12, fontWeight:700, fontFamily:BARLOW, background:m.moderation_status==='approved'?'rgba(34,197,94,0.15)':m.moderation_status==='rejected'?'rgba(200,32,42,0.15)':'rgba(245,158,11,0.15)', color:m.moderation_status==='approved'?GREEN:m.moderation_status==='rejected'?RED:ORANGE }}>
                                      {m.moderation_status==='approved'?'✓ Approved':m.moderation_status==='rejected'?'✗ Rejected':'⏳ Pending'}
                                    </span>
                                    {m.rejection_reason && <div style={{ fontFamily:BARLOW, fontSize:12, color:'#EF4444', marginTop:4 }}>{m.rejection_reason}</div>}
                                  </div>
                                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                                    {m.moderation_status !== 'approved' && (
                                      <button disabled={actionLoading} onClick={() => doMediaAction(m.id,'approve')}
                                        style={{ padding:'6px 14px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:6, color:GREEN, fontFamily:BARLOW, fontSize:13, fontWeight:700, cursor:'pointer' }}>✓ Approve</button>
                                    )}
                                    {m.moderation_status !== 'rejected' && (
                                      <button disabled={actionLoading} onClick={() => setRejectMediaId(m.id)}
                                        style={{ padding:'6px 14px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:6, color:RED, fontFamily:BARLOW, fontSize:13, fontWeight:700, cursor:'pointer' }}>✗ Reject</button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {innerTab === 'profile' && (
                <>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 272px', gap:16, alignItems:'flex-start' }}>

                  {/* LEFT */}
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

                    {/* Profile Header */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
                      <div style={{ height:3, background:`linear-gradient(90deg,${statusColor(selected.status)},transparent)` }}/>
                      <div style={{ padding:'20px 24px', display:'flex', gap:20, alignItems:'flex-start' }}>
                        <div style={{ flexShrink:0 }}>
                          <div style={{ width:90, height:90, borderRadius:'50%', overflow:'hidden', border:`3px solid ${statusColor(selected.status)}50` }}>
                            {selected.avatar ? <img src={selected.avatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/> : <div style={{ width:'100%', height:'100%', background:'rgba(200,32,42,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:700, color:RED }}>{(selected.name||'U').charAt(0)}</div>}
                          </div>
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' as const }}>
                            <span style={{ fontFamily:BARLOW, fontSize:24, fontWeight:700, color:'#F5F5F5' }}>{selected.name}</span>
                            <span style={{ padding:'3px 12px', background:statusBg(selected.status), border:`1px solid ${statusColor(selected.status)}40`, borderRadius:20, fontFamily:BARLOW, fontSize:13, fontWeight:700, color:statusColor(selected.status) }}>{selected.status}</span>
                            {selected.is_available && <span style={{ padding:'3px 10px', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:20, fontFamily:BARLOW, fontSize:12, fontWeight:700, color:GREEN }}>Available</span>}
                          </div>
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.38)', marginBottom:10 }}>ID: {selected.id} · {selected.department}</div>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 20px' }}>
                            {[
                              { icon:<Mail size={13}/>, text:selected.email },
                              { icon:<Phone size={13}/>, text:selected.phone },
                              { icon:<MapPin size={13}/>, text:selected.location },
                              { icon:<Calendar size={13}/>, text:`Joined ${selected.joined}` },
                            ].map((r,i) => (
                              <div key={i} style={{ display:'flex', alignItems:'center', gap:6, fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)' }}>
                                <span style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }}>{r.icon}</span>{r.text}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:14, letterSpacing:0.5 }}>PERSONAL INFORMATION</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                        {[
                          { l:'Date of Birth',  v:selected.dob },
                          { l:'Gender',         v:selected.gender },
                          { l:'Category',       v:selected.department },
                          { l:'Role',           v:selected.role },
                          { l:'Experience',     v:selected.experience_level },
                          { l:'Country',        v:selected.country },
                          { l:'City',           v:selected.city },
                          { l:'State',          v:selected.state },
                          { l:'Pincode',        v:selected.pincode },
                          { l:'Trust Score',    v:`${selected.matchScore}/100` },
                          { l:'Profile Views',  v:selected.profile_views != null ? String(selected.profile_views) : '—' },
                          { l:'Completion',     v:`${selected.profileCompletion}%` },
                        ].map(r => (
                          <div key={r.l} style={{ background:BG3, borderRadius:8, padding:'10px 12px' }}>
                            <div style={{ fontFamily:BARLOW, fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:4, textTransform:'uppercase' as const, letterSpacing:0.5 }}>{r.l}</div>
                            <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{r.v||'—'}</div>
                          </div>
                        ))}
                      </div>
                      {selected.address_line1 && (
                        <div style={{ marginTop:10, background:BG3, borderRadius:8, padding:'10px 12px' }}>
                          <div style={{ fontFamily:BARLOW, fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4, textTransform:'uppercase' as const, letterSpacing:0.5 }}>Address</div>
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'#F5F5F5' }}>{[selected.address_line1, selected.address_line2].filter(Boolean).join(', ')}</div>
                        </div>
                      )}
                    </div>

                    {/* Physical Attributes */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:14, letterSpacing:0.5 }}>PHYSICAL ATTRIBUTES</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 }}>
                        {[
                          { l:'Height',     v:selected.height_cm  > 0 ? `${selected.height_cm} cm` : '—' },
                          { l:'Weight',     v:selected.weight_kg  > 0 ? `${selected.weight_kg} kg` : '—' },
                          { l:'Hair Color', v:selected.hair_color },
                          { l:'Eye Color',  v:selected.eye_color },
                          { l:'Body Type',  v:selected.body_type },
                          { l:'Body Tone',  v:selected.body_tone },
                          { l:'Chest',      v:selected.chest_size > 0 ? `${selected.chest_size}"` : '—' },
                          { l:'Waist',      v:selected.waist_size > 0 ? `${selected.waist_size}"` : '—' },
                          { l:'Hip',        v:selected.hip_size   ? `${selected.hip_size}"`   : '—' },
                          { l:'Shoe Size',  v:selected.shoe_size  ? `UK ${selected.shoe_size}`: '—' },
                        ].map(r => (
                          <div key={r.l} style={{ background:BG3, borderRadius:8, padding:'10px 12px' }}>
                            <div style={{ fontFamily:BARLOW, fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:4, textTransform:'uppercase' as const, letterSpacing:0.5 }}>{r.l}</div>
                            <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{r.v||'—'}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* About - full width */}
                    {selected.about_me && (
                      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                        <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:10, letterSpacing:0.5 }}>ABOUT</div>
                        <p style={{ fontFamily:BARLOW, fontSize:16, color:'rgba(255,255,255,0.65)', lineHeight:1.7, margin:0 }}>{selected.about_me}</p>
                      </div>
                    )}

                    {/* Skills + Languages + Availability — 3 columns row 1 */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                      {selected.skills?.length > 0 && (
                        <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                          <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:12, letterSpacing:0.5 }}>SKILLS</div>
                          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:8 }}>
                            {selected.skills.map((s,i) => <span key={i} style={{ padding:'5px 14px', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.25)', borderRadius:20, fontSize:14, color:'#8B5CF6', fontWeight:600 }}>{s}</span>)}
                          </div>
                        </div>
                      )}
                      {selected.languages?.length > 0 && (
                        <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                          <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:12, letterSpacing:0.5 }}>LANGUAGES</div>
                          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:8 }}>
                            {selected.languages.map((l,i) => <span key={i} style={{ padding:'5px 14px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.25)', borderRadius:20, fontSize:14, color:BLUE, fontWeight:600 }}>{l}</span>)}
                          </div>
                        </div>
                      )}
                      {selected.availability?.length > 0 && (
                        <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                          <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:12, letterSpacing:0.5 }}>AVAILABLE FOR</div>
                          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:8 }}>
                            {selected.availability.map((a,i) => <span key={i} style={{ padding:'5px 14px', background:GOLD_DIM, border:`1px solid ${GOLD_BDR}`, borderRadius:20, fontSize:14, color:GOLD, fontWeight:600 }}>{a}</span>)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Awards, Credits, Education from social_links */}
                    {selected.social_links && (
                      <>
                        {/* Credits */}
                        {Array.isArray((selected.social_links as any).credits) && (selected.social_links as any).credits.length > 0 && (
                          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                            <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:12, letterSpacing:0.5 }}>WORK EXPERIENCE / CREDITS</div>
                            {(selected.social_links as any).credits.filter((c: any) => c.title).map((c: any, i: number) => (
                              <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{c.title}</div>
                                <div style={{ fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{[c.type, c.role, c.year].filter(Boolean).join(' · ')}</div>
                                {c.description && <div style={{ fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:4, lineHeight:1.5 }}>{c.description}</div>}
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Education */}
                        {Array.isArray((selected.social_links as any).education) && (selected.social_links as any).education.length > 0 && (
                          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                            <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:12, letterSpacing:0.5 }}>EDUCATION</div>
                            {(selected.social_links as any).education.map((e: any, i: number) => (
                              <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{e.degree}</div>
                                <div style={{ fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{e.institution} · {e.field} · {e.from}–{e.to}</div>
                                {e.grade && <div style={{ fontFamily:BARLOW, fontSize:13, color:GOLD, marginTop:2 }}>Grade: {e.grade}</div>}
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Awards */}
                        {Array.isArray((selected.social_links as any).awards) && (selected.social_links as any).awards.length > 0 && (
                          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                            <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:12, letterSpacing:0.5 }}>AWARDS</div>
                            {(selected.social_links as any).awards.map((a: any, i: number) => (
                              <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{a.name}</div>
                                <div style={{ fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{[a.category, a.issuedBy, a.year].filter(Boolean).join(' · ')}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Resume & Intro Video */}
                    {(selected.resume_url || selected.intro_video_url) && (
                      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                        <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:GOLD, marginBottom:12, letterSpacing:0.5 }}>DOCUMENTS & VIDEO</div>
                        <div style={{ display:'flex', gap:10, flexWrap:'wrap' as const }}>
                          {selected.resume_url && <a href={selected.resume_url} target="_blank" rel="noopener noreferrer" style={{ padding:'8px 18px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.3)', borderRadius:7, color:BLUE, fontFamily:BARLOW, fontSize:14, fontWeight:700, textDecoration:'none' }}>📄 View Resume</a>}
                          {selected.intro_video_url && <a href={selected.intro_video_url} target="_blank" rel="noopener noreferrer" style={{ padding:'8px 18px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:7, color:RED, fontFamily:BARLOW, fontSize:14, fontWeight:700, textDecoration:'none' }}>🎬 Intro Video</a>}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* RIGHT PANEL */}
                  <div style={{ display:'flex', flexDirection:'column', gap:12, position:'sticky', top:0 }}>


                    {/* Actions */}
                     <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                       <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:14 }}>Verification Actions</div>
                       {selected.status === 'Approved' ? (
                         <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:8 }}>
                           <Check size={16} color={GREEN}/>
                           <span style={{ fontFamily:BARLOW, fontSize:15, fontWeight:700, color:GREEN }}>Profile Verified</span>
                         </div>
                       ) : (
                         <>
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
                         </>
                       )}
                     </div>

                    {/* Notes */}
                    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:18 }}>
                      <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:10 }}>Verification Notes</div>
                      <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0,500))} placeholder="Add notes about this verification..."
                        style={{ width:'100%', height:90, background:BG3, border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', resize:'none' as const, boxSizing:'border-box' as const }}/>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4, marginBottom:10 }}>
                        <span style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.25)' }}>{notes.length}/500</span>
                      </div>
                      <button onClick={async () => {
        if (!notes.trim() || !selected) return;
        setActionLoading(true);
        const h = getAuthHeaders();
        try {
          const res = await fetch('/api/admin/verification', {
            method: 'PUT',
            headers: { ...h, 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile_id: selected.profile_id, profile_type: 'aspirant', action: 'add_note', notes }),
          });
          const data = await res.json();
          if (res.ok && data.success !== false) {
            showToast('Notes saved successfully', 'success');
            setNotes('');
            fetchAspirants();
          } else {
            showToast(data.error || 'Failed to save notes', 'error');
          }
        } catch {
          showToast('Network error — notes not saved', 'error');
        } finally {
          setActionLoading(false);
        }
      }} disabled={!notes.trim() || actionLoading}
      style={{ width:'100%', padding:'10px', background:notes.trim()?GOLD:'rgba(212,166,74,0.3)', border:'none', borderRadius:8, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:notes.trim()?'pointer':'not-allowed' }}>
        {actionLoading ? 'Saving…' : 'Save Notes'}
      </button>
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
                </>
              )}
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
            <button disabled={actionLoading} onClick={() => doVerification('approve')} style={{ flex:2, padding:10, background:GREEN, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:actionLoading?0.6:1 }}>{actionLoading?'Approving…':'Confirm Approval'}</button>
          </div>
        </Modal>
      )}
      {modal==='reject' && selected && (
        <Modal title="REJECT VERIFICATION" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:14, lineHeight:1.6 }}>Rejecting verification for <strong style={{ color:'#F5F5F5' }}>{selected.name}</strong>. They will be notified via email.</div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Reason for Rejection</label>
            <select value={rejectReason} onChange={e => setRejectReason(e.target.value)} style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Documents unclear or invalid</option><option>Face verification failed</option><option>Incomplete profile</option><option>Fraudulent documents</option><option>Duplicate account</option><option>Other</option>
            </select>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Additional Notes</label>
            <textarea placeholder="Explain the rejection reason..." style={{ width:'100%', height:70, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', resize:'none' as const, boxSizing:'border-box' as const }}/>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button disabled={actionLoading} onClick={() => doVerification('reject')} style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:actionLoading?0.6:1 }}>{actionLoading?'Rejecting…':'Confirm Rejection'}</button>
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
            <button disabled={actionLoading} onClick={() => doVerification('request_info')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:actionLoading?0.6:1 }}>{actionLoading?'Sending…':'Put On Hold'}</button>
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
      {modal==='saveNotes_unused' && (
        <Modal title="NOTES SAVED" onClose={() => setModal('')}>
          <div style={{ textAlign:'center' as const, padding:'16px 0' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}><Check size={22} color={GREEN}/></div>
            <div style={{ fontFamily:BARLOW, fontSize:18, fontWeight:700, color:'#F5F5F5', marginBottom:6 }}>Notes Saved Successfully</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Verification notes have been saved.</div>
          </div>
          <button onClick={() => setModal('')} style={{ width:'100%', padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', marginTop:8 }}>Done</button>
        </Modal>
      )}
      {/* ══ MEDIA LIGHTBOX — full viewer with nav + approve/reject ══ */}
      {mediaModal && (() => {
        const allMedia = media;
        const currentIdx = allMedia.findIndex(m => m.id === mediaModal.id);
        const prevMedia = currentIdx > 0 ? allMedia[currentIdx - 1] : null;
        const nextMedia = currentIdx < allMedia.length - 1 ? allMedia[currentIdx + 1] : null;
        const current = allMedia[currentIdx] || mediaModal;
        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:600, display:'flex', flexDirection:'column' as const }}>
            {/* Top bar */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', background:'rgba(0,0,0,0.6)', borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <button onClick={() => setMediaModal(null)} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', padding:'7px 14px', borderRadius:8, cursor:'pointer', fontFamily:BARLOW, fontSize:14 }}>
                  ✕ Close
                </button>
                <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)' }}>
                  <span style={{ color:'#fff', fontWeight:700 }}>{currentIdx + 1}</span> / {allMedia.length}
                  <span style={{ marginLeft:12, padding:'2px 10px', borderRadius:10, fontSize:12, fontWeight:700,
                    background: current.moderation_status==='approved'?'rgba(34,197,94,0.2)':current.moderation_status==='rejected'?'rgba(200,32,42,0.2)':'rgba(245,158,11,0.2)',
                    color: current.moderation_status==='approved'?GREEN:current.moderation_status==='rejected'?RED:ORANGE,
                    border: `1px solid ${current.moderation_status==='approved'?GREEN:current.moderation_status==='rejected'?RED:ORANGE}40`,
                  }}>
                    {current.moderation_status==='approved'?'✓ Approved':current.moderation_status==='rejected'?'✗ Rejected':'⏳ Pending'}
                  </span>
                  {current.is_primary && <span style={{ marginLeft:8, padding:'2px 10px', borderRadius:10, fontSize:12, fontWeight:700, background:'rgba(212,166,74,0.2)', color:GOLD, border:`1px solid ${GOLD}40` }}>PRIMARY</span>}
                </div>
              </div>
              {/* Approve / Reject in top bar */}
              <div style={{ display:'flex', gap:10 }}>
                {current.moderation_status !== 'approved' && (
                  <button disabled={actionLoading} onClick={async () => { await doMediaAction(current.id,'approve'); setMediaModal(m => m ? {...m} : null); }}
                    style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 18px', background:'rgba(34,197,94,0.15)', border:`1px solid ${GREEN}50`, borderRadius:8, color:GREEN, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                    ✓ Approve
                  </button>
                )}
                {current.moderation_status !== 'rejected' && (
                  <button disabled={actionLoading} onClick={() => { setRejectMediaId(current.id); setMediaModal(null); }}
                    style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 18px', background:'rgba(200,32,42,0.15)', border:`1px solid ${RED}50`, borderRadius:8, color:RED, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                    ✗ Reject
                  </button>
                )}
                <a href={current.url} download target="_blank" rel="noopener noreferrer"
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, color:'rgba(255,255,255,0.7)', fontFamily:BARLOW, fontSize:14, textDecoration:'none' }}>
                  ⬇ Download
                </a>
              </div>
            </div>

            {/* Media area with prev/next */}
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
              {/* Prev */}
              <button onClick={() => prevMedia && setMediaModal(prevMedia)} disabled={!prevMedia}
                style={{ position:'absolute', left:16, zIndex:10, width:44, height:44, borderRadius:'50%', background:prevMedia?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.04)', border:'none', color:prevMedia?'#fff':'rgba(255,255,255,0.2)', fontSize:22, cursor:prevMedia?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center' }}>
                ‹
              </button>

              {/* Media */}
              <div style={{ maxWidth:'75vw', maxHeight:'calc(100vh - 160px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {current.type === 'video' ? (
                  <video src={current.url} controls autoPlay
                    style={{ maxWidth:'75vw', maxHeight:'calc(100vh - 160px)', borderRadius:10, background:'#000' }}
                  />
                ) : (
                  <img src={current.url} alt=""
                    style={{ maxWidth:'75vw', maxHeight:'calc(100vh - 160px)', borderRadius:10, objectFit:'contain', display:'block' }}
                  />
                )}
              </div>

              {/* Next */}
              <button onClick={() => nextMedia && setMediaModal(nextMedia)} disabled={!nextMedia}
                style={{ position:'absolute', right:16, zIndex:10, width:44, height:44, borderRadius:'50%', background:nextMedia?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.04)', border:'none', color:nextMedia?'#fff':'rgba(255,255,255,0.2)', fontSize:22, cursor:nextMedia?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center' }}>
                ›
              </button>
            </div>

            {/* Bottom thumbnail strip */}
            <div style={{ flexShrink:0, padding:'10px 24px', background:'rgba(0,0,0,0.6)', borderTop:'1px solid rgba(255,255,255,0.08)', display:'flex', gap:8, overflowX:'auto' as const, alignItems:'center', justifyContent:'center' }}>
              {allMedia.map((m, i) => (
                <div key={m.id} onClick={() => setMediaModal(m)}
                  style={{ flexShrink:0, width:54, height:54, borderRadius:6, overflow:'hidden', cursor:'pointer',
                    border:`2px solid ${m.id===current.id?GOLD:m.moderation_status==='approved'?GREEN:m.moderation_status==='rejected'?RED:'rgba(255,255,255,0.15)'}`,
                    opacity: m.id===current.id ? 1 : 0.6,
                    transition:'all 0.15s',
                  }}>
                  {m.type === 'video'
                    ? <div style={{ width:'100%', height:'100%', background:BG4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>▶</div>
                    : <img src={m.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  }
                </div>
              ))}
            </div>

            {/* Rejection reason banner if rejected */}
            {current.rejection_reason && (
              <div style={{ flexShrink:0, padding:'8px 24px', background:'rgba(200,32,42,0.15)', borderTop:`1px solid ${RED}40`, fontFamily:BARLOW, fontSize:13, color:'#EF4444' }}>
                ✗ Rejection reason: {current.rejection_reason}
              </div>
            )}
          </div>
        );
      })()}

      {/* Reject media modal */}
      {rejectMediaId && (
        <Modal title="REJECT MEDIA" onClose={() => setRejectMediaId(null)}>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:14, lineHeight:1.6 }}>
            The aspirant will be notified and can upload a replacement.
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Rejection Reason</label>
            <select value={mediaRejectReason} onChange={e => setMediaRejectReason(e.target.value)}
              style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Content does not meet platform standards</option>
              <option>Explicit or inappropriate content</option>
              <option>Watermark or contact details visible</option>
              <option>AI-generated or manipulated image</option>
              <option>Copyright-infringing content</option>
              <option>Image quality too low</option>
              <option>Other</option>
            </select>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setRejectMediaId(null)} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button disabled={actionLoading} onClick={() => doMediaAction(rejectMediaId, 'reject')}
              style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:actionLoading?0.6:1 }}>
              {actionLoading?'Rejecting…':'Confirm Rejection'}
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:999, padding:'12px 20px', borderRadius:10, background:toast.type==='success'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', border:`1px solid ${toast.type==='success'?GREEN:'#EF4444'}`, color:toast.type==='success'?GREEN:'#EF4444', fontFamily:BARLOW, fontSize:15, fontWeight:600 }}>
          {toast.type==='success'?'✓':'✗'} {toast.msg}
        </div>
      )}
    </div>
  );
}