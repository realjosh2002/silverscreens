'use client';
import AdminSidebar from '@/components/layout/AdminSidebar';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminTopnav from '@/components/layout/AdminTopnav';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard,
  Database, Settings, ScrollText, ChevronRight,
  BadgeCheck, UserCheck, BellRing, Ticket, KeyRound,
  ChevronLeft, Menu,
  Search, Eye, Power, MoreVertical, Edit2,
  X, Check, Calendar, Phone, Mail,
  Shield, Clock, RefreshCw,
} from 'lucide-react';

/* ── Design Tokens ── */
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
const TEAL   = '#14B8A6';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

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

const TABS = ['All Users','Aspirants','Agencies','Suspended Users','Blocked Users'];

/* ── Helpers ── */
function getAuthHeaders(): Record<string,string> {
  try {
    const raw = localStorage.getItem('ss_user');
    if (!raw) return { 'Content-Type': 'application/json' };
    const u = JSON.parse(raw);
    const token = u.token ?? u.access_token ?? u.accessToken ?? '';
    if (!token) return { 'Content-Type': 'application/json' };
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

function fmtDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function timeAgo(iso: string) {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days}d ago`;
  return fmtDate(iso);
}

function initials(name: string) {
  return (name || 'U').split(' ').map((w:string) => w[0]).join('').toUpperCase().slice(0,2);
}

const AVATAR_COLORS = [PURPLE, BLUE, ORANGE, TEAL, GREEN, '#EC4899', '#6366F1', '#F59E0B'];
function avatarColor(id: string) {
  let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

/* ── Badges ── */
function verificationBadge(v: string) {
  const map: Record<string,{bg:string;color:string;icon:string}> = {
    approved: { bg:'rgba(34,197,94,0.12)',  color:'#22C55E', icon:'✓' },
    pending:  { bg:'rgba(245,158,11,0.12)', color:'#F59E0B', icon:'⏳' },
    rejected: { bg:'rgba(239,68,68,0.12)',  color:'#EF4444', icon:'✗' },
  };
  const key = (v||'pending').toLowerCase();
  const s = map[key] || map['pending'];
  const label = key.charAt(0).toUpperCase() + key.slice(1);
  return <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', background:s.bg, border:`1px solid ${s.color}40`, borderRadius:20, fontFamily:BARLOW, fontSize:13, fontWeight:700, color:s.color }}>{s.icon} {label}</span>;
}

function statusBadge(active: boolean) {
  return active
    ? <span style={{ display:'inline-block', padding:'3px 10px', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:20, fontFamily:BARLOW, fontSize:13, fontWeight:700, color:GREEN }}>Active</span>
    : <span style={{ display:'inline-block', padding:'3px 10px', background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:20, fontFamily:BARLOW, fontSize:13, fontWeight:700, color:'#F59E0B' }}>Suspended</span>;
}

function typeBadge(role: string) {
  const isAgency = role === 'agency';
  return <span style={{ display:'inline-block', padding:'2px 8px', background:isAgency?'rgba(139,92,246,0.12)':'rgba(59,130,246,0.12)', border:`1px solid ${isAgency?'rgba(139,92,246,0.3)':'rgba(59,130,246,0.3)'}`, borderRadius:20, fontFamily:BARLOW, fontSize:13, fontWeight:700, color:isAgency?PURPLE:BLUE }}>{isAgency?'Agency':'Aspirant'}</span>;
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

function InputField({ label, value, onChange, type='text', placeholder='' }: { label:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' as const }} />
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
      <div style={{ width:24, height:24, border:`2px solid ${GOLD_BDR}`, borderTop:`2px solid ${GOLD}`, borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Toast({ msg, type }: { msg:string; type:'success'|'error' }) {
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:999, padding:'12px 20px', borderRadius:10, background:type==='success'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)', border:`1px solid ${type==='success'?GREEN:RED}`, color:type==='success'?GREEN:RED, fontFamily:BARLOW, fontSize:15, fontWeight:600 }}>
      {type==='success'?'✓':'✗'} {msg}
    </div>
  );
}

/* ── Types ── */
interface UserRow {
  id: string; name: string; email: string; phone: string; role: string;
  profile_number: string; email_verified: boolean; is_active: boolean;
  last_login_at: string; created_at: string;
  aspirant_profiles?: { verification_status:string; profile_completion:number; trust_score:number; category:string } | { verification_status:string; profile_completion:number; trust_score:number; category:string }[] | null;
  agency_profiles?: { company_name:string; verification_status:string; trust_score:number } | { company_name:string; verification_status:string; trust_score:number }[] | null;
  subscriptions?: { plan_name:string; ends_at:string }[];
}
interface Stats {
  total_aspirants:number; total_agencies:number;
  total_active:number; total_suspended:number; total_verified:number;
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
/* ── Edit User Modal ── */
function EditUserModal({ user, onClose, onSave }: {
  user: any;
  onClose: () => void;
  onSave: (patch: any) => Promise<void>;
}) {
  const [name,    setName]    = useState(user.name    || '');
  const [phone,   setPhone]   = useState(user.phone   || '');
  const [saving,  setSaving]  = useState(false);

  const BG2L = '#0B0F14', BG3L = '#121821', BG4L = '#1C2338';
  const GOLD = '#D4A64A', GREEN = '#22C55E', BARLOW = "'Barlow Condensed', sans-serif", BEBAS = "'Bebas Neue', sans-serif";
  const inp: React.CSSProperties = { width:'100%', background:BG4L, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'9px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' as const };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onSave({ name: name.trim(), phone: phone.trim() });
    setSaving(false);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:BG2L, border:`1px solid ${GOLD}33`, borderRadius:14, width:'100%', maxWidth:460 }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div style={{ fontFamily:BEBAS, fontSize:22, letterSpacing:1 }}>EDIT USER</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{user.email} · {user.role}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer' }}>
            <X size={18}/>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:14 }}>

          <div>
            <label style={{ display:'block', fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:6 }}>Full Name <span style={{ color:'#EF4444' }}>*</span></label>
            <input value={name} onChange={e=>setName(e.target.value)} style={inp} placeholder="Full name…"/>
          </div>

          <div>
            <label style={{ display:'block', fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:6 }}>Phone Number</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} style={inp} placeholder="+91 00000 00000"/>
          </div>

          <div style={{ padding:'10px 12px', background:'rgba(212,166,74,0.08)', border:'1px solid rgba(212,166,74,0.2)', borderRadius:7, fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.5 }}>
            To edit profile-specific details (category, skills, verification etc.) use <strong style={{ color:GOLD }}>View Full Profile</strong> instead.
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', gap:10, padding:'14px 22px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} style={{ flex:1, padding:10, background:BG3L, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !name.trim()}
            style={{ flex:2, padding:10, background:saving||!name.trim()?`${GOLD}55`:GOLD, border:'none', borderRadius:7, color:'#000', fontFamily:BEBAS, fontSize:20, letterSpacing:1, cursor:saving||!name.trim()?'not-allowed':'pointer', fontWeight:700 }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab,      setActiveTab]      = useState('All Users');
  const [search,         setSearch]         = useState('');
  const [statusFilter,   setStatusFilter]   = useState('');
  const [verifyFilter,   setVerifyFilter]   = useState('');
  const [selected,       setSelected]       = useState<string[]>([]);
  const [modal,          setModal]          = useState('');
  const [activeUser,     setActiveUser]     = useState<UserRow|null>(null);
  const [menuUser,       setMenuUser]       = useState<string|null>(null);
  const [menuPos,        setMenuPos]        = useState({ top:0, right:0 });
  const [page,           setPage]           = useState(1);
  const [toast,          setToast]          = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [actionLoading,  setActionLoading]  = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [suspendReason,  setSuspendReason]  = useState('Policy Violation');
  const [suspendNotes,   setSuspendNotes]   = useState('');
  const PER_PAGE = 8;

  // Real data
  const [users,       setUsers]       = useState<UserRow[]>([]);
  const [stats,       setStats]       = useState<Stats|null>(null);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(true);


  /* ── tab → API params ── */
  function tabToParams(tab: string) {
    if (tab === 'Aspirants')       return { role: 'aspirant', status: '' };
    if (tab === 'Agencies')        return { role: 'agency',   status: '' };
    if (tab === 'Suspended Users') return { role: '',         status: 'suspended' };
    if (tab === 'Blocked Users')   return { role: '',         status: 'suspended' };
    return { role: '', status: '' };
  }

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch users ── */
  const fetchUsers = useCallback(() => {
    setLoading(true);
    const h = getAuthHeaders();
    const { role, status: tabStatus } = tabToParams(activeTab);
    const params = new URLSearchParams({
      page:     String(page),
      limit:    String(PER_PAGE),
      keyword:  search,
      role,
      status:   statusFilter || tabStatus,
      verified: verifyFilter,
    });

    // Timeout after 15s to prevent infinite spinner
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    fetch(`/api/admin/users?${params}`, { headers: h, signal: controller.signal })
      .then(r => {
        clearTimeout(timeout);
        if (r.status === 401 || r.status === 403) {
          setSessionExpired(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then(data => {
        if (!data) return;
        // Handle both { data: { users, stats, pagination } } and { users, stats, pagination }
        const payload = data?.data ?? data;
        setUsers(payload?.users || []);
        setStats(payload?.stats || null);
        setTotal(payload?.pagination?.total || 0);
        setTotalPages(payload?.pagination?.total_pages || 1);
      })
      .catch(err => {
        clearTimeout(timeout);
        if (err?.name !== 'AbortError') {
          console.error('[USERS FETCH ERROR]', err);
        }
      })
      .finally(() => setLoading(false));
  }, [page, search, activeTab, statusFilter, verifyFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ── User action ── */
  async function doAction(userId: string, action: string, reason?: string) {
    setActionLoading(true);
    const h = getAuthHeaders();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: h,
        body: JSON.stringify({ user_id: userId, action, reason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User ${action} successful`, 'success');
        setModal('');
        setActiveUser(null);
        fetchUsers();
      } else {
        showToast(data.error || 'Action failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  const toggleSelect  = (id: string) => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);
  const toggleAll     = () => setSelected(s => s.length === users.length ? [] : users.map(u=>u.id));
  const openModal     = (user: UserRow, type: string) => { setActiveUser(user); setModal(type); setMenuUser(null); };

  const selectStyle = { background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'8px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', cursor:'pointer' };

  /* ── Stat cards ── */
  const STAT_CARDS = [
    { label:'Total Users',  value: (stats?.total_aspirants ?? 0) + (stats?.total_agencies ?? 0), color:RED, icon:'👥', onClick: () => { setActiveTab('All Users'); setStatusFilter(''); setVerifyFilter(''); setPage(1); } },
    { label:'Aspirants',    value: stats?.total_aspirants ?? 0,   color:PURPLE, icon:'🎭', onClick: () => { setActiveTab('Aspirants');       setStatusFilter('');          setVerifyFilter('');          setPage(1); } },
    { label:'Agencies',     value: stats?.total_agencies  ?? 0,   color:ORANGE, icon:'🏢', onClick: () => { setActiveTab('Agencies');        setStatusFilter('');          setVerifyFilter('');          setPage(1); } },
    { label:'Suspended',    value: stats?.total_suspended ?? 0,   color:GOLD,   icon:'⏸️', onClick: () => { setActiveTab('Suspended Users'); setStatusFilter('suspended'); setVerifyFilter('');          setPage(1); } },
    { label:'Verified',     value: stats?.total_verified  ?? 0,   color:GREEN,  icon:'✅', onClick: () => { setActiveTab('All Users');      setStatusFilter('');          setVerifyFilter('approved');  setPage(1); } },
  ];

  /* ── Page numbers ── */
  function pageNums() {
    const nums: (number|'…')[] = [];
    if (totalPages <= 5) { for (let i=1;i<=totalPages;i++) nums.push(i); }
    else {
      nums.push(1);
      if (page > 3) nums.push('…');
      for (let i=Math.max(2,page-1); i<=Math.min(totalPages-1,page+1); i++) nums.push(i);
      if (page < totalPages-2) nums.push('…');
      nums.push(totalPages);
    }
    return nums;
  }

  /* ── Verification status for a user ── */
  function verStatus(u: UserRow) {
    if (u.role === 'aspirant') {
      const ap = u.aspirant_profiles;
      const status = Array.isArray(ap) ? ap[0]?.verification_status : (ap as any)?.verification_status;
      return status || 'pending';
    }
    if (u.role === 'agency') {
      const ag = u.agency_profiles;
      const status = Array.isArray(ag) ? ag[0]?.verification_status : (ag as any)?.verification_status;
      return status || 'pending';
    }
    return 'approved';
  }

  function companyName(u: UserRow) {
    const ag = u.agency_profiles;
    const name = Array.isArray(ag) ? ag[0]?.company_name : (ag as any)?.company_name;
    return name || u.name;
  }

  function displayName(u: UserRow) {
    return u.role === 'agency' ? companyName(u) : (u.name || u.email);
  }

  function planName(u: UserRow) {
    return u.subscriptions?.[0]?.plan_name || '—';
  }

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:BG, fontFamily:BARLOW, color:'#F5F5F5' }}>
      <AdminTopnav />

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* SIDEBAR */}
        <AdminSidebar onCollapse={(c) => setSidebarOpen(!c)} />

        {/* MAIN */}
        <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' as const }}>
          <div style={{ flex:1, overflowY:'auto' as const, padding:'20px 24px 32px' }}>

            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
              <div>
                <h1 style={{ fontFamily:BEBAS, fontSize:30, letterSpacing:1, margin:'0 0 3px', color:'#F5F5F5' }}>USER MANAGEMENT</h1>
                <p style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.45)', margin:0 }}>Manage all platform users, review status, and take actions.</p>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={fetchUsers} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 14px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}>
                  <RefreshCw size={14}/> Refresh
                </button>

              </div>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:20 }}>
              {STAT_CARDS.map(s => (
                <div key={s.label} onClick={s.onClick} style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px', cursor:'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.color }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{s.icon}</div>
                    <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:1.3 }}>{s.label}</span>
                  </div>
                  <div style={{ fontFamily:BEBAS, fontSize:28, color:'#F5F5F5', letterSpacing:1 }}>
                    {loading ? '—' : s.value.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.3)', marginTop:2 }}>Live count</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', gap:0, borderBottom:'2px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); setSelected([]); }}
                  style={{ padding:'10px 16px', background:'none', border:'none', cursor:'pointer', fontFamily:BARLOW, fontSize:15, fontWeight:activeTab===tab?700:400, color:activeTab===tab?'#F5F5F5':'rgba(255,255,255,0.45)', borderBottom:activeTab===tab?`2px solid ${RED}`:'2px solid transparent', marginBottom:-2, whiteSpace:'nowrap' as const }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display:'flex', flexDirection:'column' as const, gap:10, marginBottom:16 }}>
              <div style={{ position:'relative' }}>
                <Search size={15} color="rgba(255,255,255,0.3)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email, profile number..."
                  style={{ width:'100%', background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'9px 12px 9px 36px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' as const }}/>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ ...selectStyle, width:160 }}>
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
                <select value={verifyFilter} onChange={e => { setVerifyFilter(e.target.value); setPage(1); }} style={{ ...selectStyle, width:180 }}>
                  <option value="">All Verification</option>
                  <option value="approved">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Bulk actions */}
            {selected.length > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', background:'rgba(212,166,74,0.08)', border:'1px solid rgba(212,166,74,0.2)', borderRadius:8, marginBottom:12 }}>
                <span style={{ fontFamily:BARLOW, fontSize:14, color:GOLD, fontWeight:600 }}>{selected.length} user{selected.length>1?'s':''} selected</span>
                <div style={{ display:'flex', gap:8 }}>
                  {[
                    { label:'Suspend All', action:() => setModal('bulkSuspend'), danger:true  },
                    { label:'Delete All',  action:() => setModal('bulkDelete'),  danger:true  },
                  ].map(btn => (
                    <button key={btn.label} onClick={btn.action} style={{ padding:'5px 12px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:btn.danger?RED:'#F5F5F5', fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}>
                      {btn.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => setSelected([])} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer' }}><X size={14}/></button>
              </div>
            )}

            {/* Table */}
            <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflowX:'auto' as const }}>
              <div style={{ display:'grid', gridTemplateColumns:'36px 1.6fr 90px 1.3fr 120px 100px 110px 120px 140px', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)', borderRadius:'12px 12px 0 0' }}>
                <div style={{ display:'flex', alignItems:'center' }}>
                  <div onClick={toggleAll} style={{ width:18, height:18, borderRadius:4, border:`1px solid ${selected.length===users.length&&users.length>0?GOLD:'rgba(255,255,255,0.2)'}`, background:selected.length===users.length&&users.length>0?GOLD:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {selected.length===users.length&&users.length>0 && <Check size={12} color={BG}/>}
                  </div>
                </div>
                {['USER','TYPE','EMAIL / PHONE','VERIFICATION','STATUS','PLAN','JOINED ON','ACTIONS'].map(h => (
                  <div key={h} style={{ fontFamily:BARLOW, fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.5)', letterSpacing:0.5, textTransform:'uppercase' as const }}>{h}</div>
                ))}
              </div>

              {loading ? <Spinner/> :
                sessionExpired
                  ? <div style={{ textAlign:'center' as const, padding:48, fontFamily:BARLOW, fontSize:16 }}>
                      <div style={{ color:'#EF4444', marginBottom:12 }}>⚠️ Session expired</div>
                      <button onClick={() => { localStorage.removeItem('ss_user'); sessionStorage.removeItem('ss_user'); router.replace('/admin/login'); }} style={{ padding:'8px 20px', background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer' }}>Login Again</button>
                    </div>
                : users.length === 0
                  ? <div style={{ textAlign:'center' as const, padding:48, color:'rgba(255,255,255,0.3)', fontFamily:BARLOW, fontSize:16 }}>No users found</div>
                  : users.map((user, i) => {
                      const col = avatarColor(user.id);
                      const vStatus = verStatus(user);
                      return (
                        <div key={user.id}
                          style={{ display:'grid', gridTemplateColumns:'36px 1.6fr 90px 1.3fr 120px 100px 110px 120px 140px', padding:'14px 16px', borderBottom:i<users.length-1?'1px solid rgba(255,255,255,0.05)':'none', alignItems:'center' }}
                          onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                          onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                        >
                          {/* Checkbox */}
                          <div onClick={()=>toggleSelect(user.id)} style={{ width:18, height:18, borderRadius:4, border:`1px solid ${selected.includes(user.id)?GOLD:'rgba(255,255,255,0.2)'}`, background:selected.includes(user.id)?GOLD:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            {selected.includes(user.id) && <Check size={12} color={BG}/>}
                          </div>
                          {/* User */}
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:36, height:36, borderRadius:'50%', background:`${col}25`, border:`1px solid ${col}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:col, flexShrink:0 }}>{initials(displayName(user))}</div>
                            <div style={{ minWidth:0 }}>
                              <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5', whiteSpace:'nowrap' as const, overflow:'hidden', textOverflow:'ellipsis' }}>{displayName(user)}</div>
                              <div style={{ fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.4)' }}>
                                {user.role === 'agency'
                                  ? (user.agency_profiles?.[0]?.profile_number || user.profile_number || user.id.slice(0,8))
                                  : (user.aspirant_profiles?.[0]?.profile_number || user.profile_number || user.id.slice(0,8))}
                              </div>
                            </div>
                          </div>
                          {/* Type */}
                          <div>{typeBadge(user.role)}</div>
                          {/* Email/Phone */}
                          <div>
                            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.7)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{user.email}</div>
                            <div style={{ fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.4)' }}>{user.phone || '—'}</div>
                          </div>
                          {/* Verification */}
                          <div>{verificationBadge(vStatus)}</div>
                          {/* Status */}
                          <div>{statusBadge(user.is_active)}</div>
                          {/* Plan */}
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.6)' }}>{planName(user)}</div>
                          {/* Joined */}
                          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.6)' }}>{fmtDate(user.created_at)}</div>
                          {/* Actions */}
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <button onClick={() => {
                              if (user.role === 'agency') {
                                const agencyProfileId = Array.isArray(user.agency_profiles) ? user.agency_profiles[0]?.id : (user.agency_profiles as any)?.id;
                                router.push(`/admin/agency-profile-view?id=${agencyProfileId || user.id}`);
                              } else {
                                router.push(`/admin/aspirant-profile?user_id=${user.id}`);
                              }
                            }} title="View Full Profile" style={{ width:30, height:30, borderRadius:6, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:BLUE }}>
                              <Eye size={14}/>
                            </button>
                            <button onClick={()=>openModal(user,'edit')} title="Edit User" style={{ width:30, height:30, borderRadius:6, background:'rgba(212,166,74,0.1)', border:'1px solid rgba(212,166,74,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:GOLD }}>
                              <Edit2 size={14}/>
                            </button>
                            <button onClick={()=>{ const isDeleted=user.email?.includes('@silverscreens.deleted'); openModal(user, isDeleted?'activate':user.is_active?'suspend':'activate'); }} title={user.email?.includes('@silverscreens.deleted')?'Restore Account':user.is_active?'Suspend':'Activate'} style={{ width:30, height:30, borderRadius:6, background:user.email?.includes('@silverscreens.deleted')?'rgba(245,158,11,0.1)':user.is_active?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)', border:`1px solid ${user.email?.includes('@silverscreens.deleted')?'rgba(245,158,11,0.3)':user.is_active?'rgba(239,68,68,0.2)':'rgba(34,197,94,0.2)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:user.email?.includes('@silverscreens.deleted')?'#F59E0B':user.is_active?'#EF4444':GREEN }}>
                              <Power size={14}/>
                            </button>
                            <button onClick={e => { const r=e.currentTarget.getBoundingClientRect(); const menuH=280; const spaceBelow=window.innerHeight-r.bottom; const top=spaceBelow<menuH?r.top-menuH-4:r.bottom+8; setMenuPos({top,right:window.innerWidth-r.right}); setMenuUser(menuUser===user.id?null:user.id); setActiveUser(user); }} style={{ width:30, height:30, borderRadius:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(255,255,255,0.6)' }}>
                              <MoreVertical size={14}/>
                            </button>
                          </div>
                        </div>
                      );
                    })
              }

              {/* Pagination */}
              {!loading && total > 0 && (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>
                    Showing {((page-1)*PER_PAGE)+1}–{Math.min(page*PER_PAGE,total)} of {total.toLocaleString('en-IN')} users
                  </span>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ width:32, height:32, borderRadius:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:page===1?'not-allowed':'pointer', color:page===1?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.7)', opacity:page===1?0.5:1 }}>
                      <ChevronLeft size={14}/>
                    </button>
                    {pageNums().map((p,i) =>
                      p==='…'
                        ? <span key={i} style={{ color:'rgba(255,255,255,0.3)', padding:'0 4px' }}>…</span>
                        : <button key={i} onClick={()=>setPage(p as number)} style={{ width:32, height:32, borderRadius:6, background:page===p?RED:'rgba(255,255,255,0.05)', border:`1px solid ${page===p?RED:'rgba(255,255,255,0.08)'}`, fontFamily:BARLOW, fontSize:14, color:page===p?'#fff':'rgba(255,255,255,0.7)', cursor:'pointer', fontWeight:page===p?700:400 }}>{p}</button>
                    )}
                    <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ width:32, height:32, borderRadius:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', cursor:page===totalPages?'not-allowed':'pointer', color:page===totalPages?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.7)', opacity:page===totalPages?0.5:1 }}>
                      <ChevronRight size={14}/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* THREE-DOT MENU */}
      {menuUser && (
        <>
          <div onClick={()=>setMenuUser(null)} style={{ position:'fixed', inset:0, zIndex:300 }}/>
          <div style={{ position:'fixed', top:menuPos.top, right:menuPos.right, width:190, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, overflow:'hidden', zIndex:400, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
            {[
              { label:'View Full Profile', icon:<Eye size={14}/>, action:'view_profile' },
              { label:'Quick Info',        icon:<Shield size={14}/>,     action:'view'                                                      },
              { label:'Edit User',         icon:<Edit2 size={14}/>,      action:'edit'                                                      },
              { label:'Reset Password',    icon:<Shield size={14}/>,     action:'reset'                                                     },
              { label:'View Audit Logs',   icon:<ScrollText size={14}/>, action:'audit'                                                     },
              { label:activeUser?.is_active?'Suspend User':'Activate User', icon:<Power size={14}/>, action:activeUser?.is_active?'suspend':'activate', danger:!activeUser?.is_active },
              { label:'Delete User',       icon:<X size={14}/>,          action:'delete', danger:true                                       },
            ].map(item => (
              <div key={item.label} onClick={()=>{ setMenuUser(null); if(item.action==='audit') { router.push('/admin/audit'); } else if(item.action==='view_profile') { if(activeUser?.role==='agency'){ const agId=Array.isArray(activeUser.agency_profiles)?activeUser.agency_profiles[0]?.id:(activeUser.agency_profiles as any)?.id; router.push(`/admin/agency-profile-view?id=${agId||activeUser.id}`); } else { router.push(`/admin/aspirant-profile?user_id=${activeUser?.id}`); } } else { openModal(activeUser!,item.action); } }}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 16px', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.05)', color:(item as any).danger?RED:'rgba(255,255,255,0.8)' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.05)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
              >
                {item.icon}<span style={{ fontFamily:BARLOW, fontSize:15 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VIEW USER MODAL */}
      {modal==='view' && activeUser && (
        <Modal title="USER DETAILS" onClose={()=>setModal('')} width={520}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, padding:'14px 16px', background:BG3, borderRadius:10 }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:`${avatarColor(activeUser.id)}25`, border:`2px solid ${avatarColor(activeUser.id)}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:avatarColor(activeUser.id) }}>{initials(displayName(activeUser))}</div>
            <div>
              <div style={{ fontFamily:BEBAS, fontSize:22, color:'#F5F5F5', letterSpacing:0.5 }}>{displayName(activeUser)}</div>
              <div style={{ display:'flex', gap:8, marginTop:4 }}>{typeBadge(activeUser.role)}{verificationBadge(verStatus(activeUser))}{statusBadge(activeUser.is_active)}</div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {[
              { icon:<Mail size={13}/>,     label:'Email',        value:activeUser.email },
              { icon:<Phone size={13}/>,    label:'Phone',        value:activeUser.phone||'—' },
              { icon:<Shield size={13}/>,   label:'Profile No.',  value:activeUser.profile_number||'—' },
              { icon:<Calendar size={13}/>, label:'Joined On',    value:fmtDate(activeUser.created_at) },
              { icon:<Clock size={13}/>,    label:'Last Login',   value:activeUser.last_login_at?timeAgo(activeUser.last_login_at):'Never' },
              { icon:<BadgeCheck size={13}/>,label:'Plan',        value:planName(activeUser) },
            ].map(row => (
              <div key={row.label} style={{ padding:'10px 14px', background:BG3, borderRadius:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{row.icon} {row.label}</div>
                <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>{row.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button onClick={()=>openModal(activeUser, activeUser.is_active?'suspend':'activate')} style={{ flex:1, padding:10, background:activeUser.is_active?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)', border:`1px solid ${activeUser.is_active?'rgba(239,68,68,0.3)':'rgba(34,197,94,0.3)'}`, borderRadius:7, color:activeUser.is_active?'#EF4444':GREEN, fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>
              {activeUser.is_active?'Suspend':'Activate'}
            </button>
            <button onClick={()=>openModal(activeUser,'reset')} style={{ flex:1, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Reset Password</button>
            <button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
          </div>
        </Modal>
      )}

      {/* SUSPEND MODAL */}
      {modal==='suspend' && activeUser && (
        <Modal title="SUSPEND USER" onClose={()=>setModal('')}>
          <div style={{ padding:'12px 16px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:8, marginBottom:16 }}>
            <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F59E0B', fontWeight:700, marginBottom:4 }}>⚠️ This will restrict the user's access</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)' }}>Suspending <strong style={{ color:'#F5F5F5' }}>{displayName(activeUser)}</strong> will prevent them from logging in.</div>
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Reason</label>
            <select value={suspendReason} onChange={e=>setSuspendReason(e.target.value)} style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>Policy Violation</option><option>Suspicious Activity</option><option>User Request</option><option>Fraud</option><option>Other</option>
            </select>
          </div>
          <InputField label="Additional Notes (optional)" value={suspendNotes} onChange={setSuspendNotes} placeholder="Add notes..."/>
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button disabled={actionLoading} onClick={()=>doAction(activeUser.id,'suspend',`${suspendReason}${suspendNotes?' - '+suspendNotes:''}`)} style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:actionLoading?0.6:1 }}>
              {actionLoading?'Suspending…':'Suspend User'}
            </button>
          </div>
        </Modal>
      )}

      {/* ACTIVATE MODAL */}
      {/* EDIT USER MODAL */}
      {modal==='edit' && activeUser && (
        <EditUserModal
          user={activeUser}
          onClose={()=>setModal('')}
          onSave={async (patch)=>{
            try {
              const token = localStorage.getItem('ss_user') || sessionStorage.getItem('ss_user') || '{}';
              const t = JSON.parse(token).token || '';
              const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type':'application/json', Authorization:`Bearer ${t}` },
                body: JSON.stringify({ user_id: activeUser.id, action: 'edit', ...patch }),
              });
              const d = await res.json();
              if (!res.ok) throw new Error((d.data??d)?.error || 'Failed to save');
              showToast('User updated successfully', 'success');
              setModal('');
              fetchUsers();
            } catch(e:any) {
              showToast(e.message||'Failed to save changes', 'error');
            }
          }}
        />
      )}

      {modal==='activate' && activeUser && (
        <Modal title="ACTIVATE USER" onClose={()=>setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:20, lineHeight:1.6 }}>
            Are you sure you want to reactivate <strong style={{ color:'#F5F5F5' }}>{displayName(activeUser)}</strong>? They will regain full platform access.
          </div>
          {activeUser.email?.includes('@silverscreens.deleted') && (
            <div style={{ padding:'10px 14px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:8, marginBottom:16, fontFamily:BARLOW, fontSize:14, color:'#F59E0B' }}>
              ⚠️ This account was deleted. Activating will restore platform access but the original email is no longer available. The user will need to contact support to recover their account.
            </div>
          )}
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button disabled={actionLoading} onClick={()=>doAction(activeUser.id,'activate')} style={{ flex:2, padding:10, background:GREEN, border:'none', borderRadius:7, color:'#000', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:actionLoading?0.6:1 }}>
              {actionLoading?'Activating…':'Activate User'}
            </button>
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {modal==='delete' && activeUser && (
        <Modal title="DELETE USER" onClose={()=>setModal('')}>
          <div style={{ padding:'14px 16px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, marginBottom:16 }}>
            <div style={{ fontFamily:BARLOW, fontSize:15, color:'#EF4444', fontWeight:700, marginBottom:4 }}>⚠️ This action cannot be undone</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>Deleting <strong style={{ color:'#F5F5F5' }}>{displayName(activeUser)}</strong> will permanently remove their account and all data.</div>
          </div>
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button disabled={actionLoading} onClick={()=>doAction(activeUser.id,'delete')} style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:actionLoading?0.6:1 }}>
              {actionLoading?'Deleting…':'Delete User'}
            </button>
          </div>
        </Modal>
      )}

      {/* RESET PASSWORD MODAL */}
      {modal==='reset' && activeUser && (
        <Modal title="RESET PASSWORD" onClose={()=>setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:20, lineHeight:1.6 }}>
            A password reset link will be sent to <strong style={{ color:'#F5F5F5' }}>{activeUser.email}</strong>.
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button disabled={actionLoading} onClick={()=>doAction(activeUser.id,'reset_password')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:actionLoading?0.6:1 }}>
              {actionLoading?'Sending…':'Send Reset Link'}
            </button>
          </div>
        </Modal>
      )}

      {/* BULK SUSPEND */}
      {modal==='bulkSuspend' && (
        <Modal title="BULK SUSPEND" onClose={()=>setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:20, lineHeight:1.6 }}>
            This will suspend <strong style={{ color:'#F5F5F5' }}>{selected.length} selected users</strong>.
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button disabled={actionLoading} onClick={async()=>{ for(const id of selected) await doAction(id,'suspend','Bulk action'); setSelected([]); }} style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>
              Suspend All
            </button>
          </div>
        </Modal>
      )}

      {/* BULK DELETE */}
      {modal==='bulkDelete' && (
        <Modal title="BULK DELETE" onClose={()=>setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:20, lineHeight:1.6 }}>
            This will permanently delete <strong style={{ color:'#F5F5F5' }}>{selected.length} selected users</strong>. This cannot be undone.
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button disabled={actionLoading} onClick={async()=>{ for(const id of selected) await doAction(id,'delete'); setSelected([]); }} style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>
              Delete All
            </button>
          </div>
        </Modal>
      )}



      {/* TOAST */}
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
}