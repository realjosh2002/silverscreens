'use client';
import AdminSidebar from '@/components/layout/AdminSidebar';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminTopnav from '@/components/layout/AdminTopnav';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard,
  Database, Settings, ScrollText,
  UserCheck, BellRing, Ticket, KeyRound,
  ChevronLeft, ChevronRight,
  Mail, Phone, MapPin, Calendar, Filter, Check, X,
  Clock, Globe, Star, CheckCircle, XCircle, AlertCircle,
  Download, Eye, ZoomIn, ArrowLeft, ArrowRight,
  Briefcase, FileCheck, Building, Award, TrendingUp,
  RefreshCw,
} from 'lucide-react';

const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = 'rgba(255,255,255,0.03)';
const GOLD   = '#D4A64A';
const RED    = '#C8202A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';
const ORANGE = '#F97316';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'           },
  { icon: Users,           label: 'User Management',          href: '/admin/users'               },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification' },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification', active: true },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'        },
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
  { label: 'My Profile',               href: '/admin/profile'          },
  { label: 'Account Settings',         href: '/admin/account-settings' },
  { label: 'Security & Login',         href: '/admin/security-login'   },
  { label: 'Notification Preferences', href: '/admin/notifications'    },
  { label: 'Activity Log',             href: '/admin/activity-log'     },
  { label: 'Help & Support',           href: '/admin/help-support'     },
  { label: 'Logout',                   href: '/admin/login'            },
];

const INNER_TABS = ['Overview', 'Documents', 'Business Details', 'Notes & History'];

/* ─── Types ─────────────────────────────────────────────────── */
interface AgencyDoc {
  id:               string;
  doc_label:        string;
  doc_type:         string;
  file_name:        string;
  file_size:        number;
  public_url:       string;
  status:           string;
  uploaded_at:      string;
  created_at:       string;
  rejection_reason: string | null;
}

interface Agency {
  id:                  string;
  company_name:        string;
  company_description: string | null;
  company_type:        string | null;
  registration_number: string | null;
  gst_number:          string | null;
  pan_number:          string | null;
  years_of_experience: number | null;
  website_url:         string | null;
  address_line1:       string | null;
  city:                string | null;
  state:               string | null;
  country:             string | null;
  contact_email:       string;
  contact_phone:       string;
  contact_person_name: string;
  verification_status: string;
  trust_score:         number | null;
  logo_url:            string | null;
  banner_url:          string | null;
  gallery_urls:        string[] | null;
  company_size:        string | null;
  languages:           string[] | null;
  genres:              string[] | null;
  expertise:           string[] | null;
  operating_cities:    string[] | null;
  social_links:        Record<string, string> | null;
  created_at:          string;
  documents:           AgencyDoc[];
  profiles: {
    id:             string;
    email:          string;
    profile_number: string | null;
  };
}

/* ─── Helpers ────────────────────────────────────────────────── */
function getAuthHeaders(): Record<string, string> {
  try {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    const token = key ? JSON.parse(localStorage.getItem(key) || '{}')?.access_token || '' : '';
    return token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
  } catch { return { 'Content-Type': 'application/json' }; }
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtSize(bytes: number) {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusColor(s: string) {
  return s === 'approved' ? GREEN : s === 'rejected' ? RED : s === 'on_hold' ? GOLD : ORANGE;
}
function statusBg(s: string) {
  return s === 'approved' ? 'rgba(34,197,94,0.12)' : s === 'rejected' ? 'rgba(200,32,42,0.12)' : s === 'on_hold' ? 'rgba(212,166,74,0.12)' : 'rgba(245,158,11,0.12)';
}
function statusLabel(s: string) {
  return s === 'approved' ? 'Approved' : s === 'rejected' ? 'Rejected' : s === 'on_hold' ? 'On Hold' : 'Pending';
}

function Sk({ w = '100%', h = 16 }: { w?: string | number; h?: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: 4, background: `linear-gradient(90deg,${BG3} 25%,${BG4} 50%,${BG3} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
  );
}

/* ─── Modal ──────────────────────────────────────────────────── */
function Modal({ title, onClose, children, width = 480 }: { title: string; onClose: () => void; children: React.ReactNode; width?: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, width, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, background: BG2 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', letterSpacing: 1 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ padding: '20px 22px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

/* ─── Circular Progress ──────────────────────────────────────── */
function CircularProgress({ pct, done, total }: { pct: number; done: number; total: number }) {
  const r = 44, cx = 56, cy = 56, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={112} height={112}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={BLUE} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#F5F5F5" fontFamily={BEBAS} fontSize={22} letterSpacing={1}>{pct}%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontFamily={BARLOW} fontSize={11}>Complete</text>
      </svg>
      <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{done} of {total} fields complete</div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function AgencyVerificationPage() {
  const router = useRouter();

  /* UI state */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [statusTab,   setStatusTab]   = useState('pending');
  const [innerTab,    setInnerTab]    = useState('Overview');
  const [selected,    setSelected]    = useState(false);
  const [agencyIdx,   setAgencyIdx]   = useState(0);
  const [notes,       setNotes]       = useState('');
  const [modal,       setModal]       = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [rejectReason,setRejectReason]= useState('Invalid or fraudulent documents');
  const [holdReason,  setHoldReason]  = useState('Awaiting additional documents');

  /* Data state */
  const [allAgencies, setAllAgencies] = useState<Agency[]>([]);
  const [counts,      setCounts]      = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading,     setLoading]     = useState(true);
  const [actioning,   setActioning]   = useState(false);
  const [actionMsg,   setActionMsg]   = useState('');
  const [docModal,    setDocModal]    = useState<{id:string;label:string;action:'approve_doc'|'reject_doc'} | null>(null);
  const [docReason,   setDocReason]   = useState('');
  const [docActioning,setDocActioning]= useState(false);


  /* ── Fetch agencies ── */
  const fetchAgencies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/agency-verification?status=all', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) return;
      const d = await res.json();
	const all: Agency[] = d.data?.data ?? [];
	setAllAgencies(all);
      const pendingItems  = all.filter((a: Agency) => !a.verification_status || a.verification_status === 'pending');
      const approvedItems = all.filter((a: Agency) => a.verification_status === 'approved');
      const rejectedItems = all.filter((a: Agency) => a.verification_status === 'rejected');
      setCounts({ pending: pendingItems.length, approved: approvedItems.length, rejected: rejectedItems.length });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);



  useEffect(() => {
    fetchAgencies();
  }, [fetchAgencies]);

  // Filter allAgencies based on active tab — purely by verification_status
  const agencies = statusTab === 'pending'
    ? allAgencies.filter((a: Agency) => !a.verification_status || a.verification_status === 'pending')
    : statusTab === 'approved'
    ? allAgencies.filter((a: Agency) => a.verification_status === 'approved')
    : statusTab === 'rejected'
    ? allAgencies.filter((a: Agency) => a.verification_status === 'rejected')
    : allAgencies;
  const agency = agencies[agencyIdx];

  /* ── Handle approve / reject / hold ── */
  async function handleAction(action: 'approve' | 'reject' | 'hold') {
    if (!agency) return;
    setActioning(true);
    setActionMsg('');
    try {
      const res = await fetch('/api/admin/agency-verification', {
        method:  'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          agency_profile_id: agency?.id,
          action,
          reason: action === 'reject' ? rejectReason : action === 'hold' ? holdReason : undefined,
          notes:  actionNotes || undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setActionMsg(d.message ?? 'Action failed.'); setActioning(false); return; }
      setModal('');
      setActionNotes('');
      // Refresh list
      await fetchAgencies();
      setAgencyIdx(0);
      setSelected(false);
    } catch { setActionMsg('Network error. Please try again.'); }
    finally { setActioning(false); }
  }

  /* ── Handle per-document action ── */
  async function handleDocAction() {
    if (!docModal) return;
    setDocActioning(true);
    try {
      const res = await fetch('/api/admin/agency-verification', {
        method:  'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action:  docModal.action,
          doc_id:  docModal.id,
          reason:  docModal.action === 'reject_doc' ? docReason : undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok) { alert(d.error ?? 'Action failed'); setDocActioning(false); return; }
      setDocModal(null);
      setDocReason('');
      await fetchAgencies();
    } catch { alert('Network error. Please try again.'); }
    finally { setDocActioning(false); }
  }

  const STATUS_TABS = [
    { key: 'pending',  label: 'Pending Verification', count: counts.pending  },
    { key: 'approved', label: 'Approved',              count: counts.approved },
    { key: 'rejected', label: 'Rejected',              count: counts.rejected },
    { key: 'all',      label: 'All Agencies',          count: allAgencies.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <style>{`@keyframes shimmer { 0% { background-position:200% 0; } 100% { background-position:-200% 0; } }`}</style>

      <AdminTopnav />

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <AdminSidebar onCollapse={(c) => setSidebarOpen(!c)} />

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: '20px 24px 40px' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5F5F5')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >Home</span>
                <ChevronRight size={12} />
                <span onClick={() => setSelected(false)} style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F5F5F5')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >Agency Verification</span>
                {selected && agency && <><ChevronRight size={12} /><span style={{ color: '#F5F5F5' }}>{agency.company_name}</span></>}
              </div>
            </div>

            {/* ════ VIEW A: QUEUE LIST ════ */}
            {!selected && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                  <div>
                    <h1 style={{ fontFamily: BARLOW, fontSize: 28, fontWeight: 700, color: '#F5F5F5', margin: 0 }}>Agency Verification <span style={{ color: RED }}>.</span></h1>
                    <p style={{ fontFamily: BARLOW, fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>Review and verify agency documents and authenticity.</p>
                  </div>
                  <button onClick={fetchAgencies} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>

                {/* Status Tabs */}
                <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid rgba(255,255,255,0.07)', marginBottom: 18 }}>
                  {STATUS_TABS.map(tab => (
                    <button key={tab.key} onClick={() => { setStatusTab(tab.key); setAgencyIdx(0); setSelected(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'none', border: 'none', outline: 'none', cursor: 'pointer', fontFamily: BARLOW, fontSize: 15, fontWeight: statusTab === tab.key ? 700 : 400, color: statusTab === tab.key ? '#F5F5F5' : 'rgba(255,255,255,0.45)', borderBottom: statusTab === tab.key ? `2px solid ${RED}` : '2px solid transparent', marginBottom: -2, whiteSpace: 'nowrap' as const }}>
                      {tab.label}
                      <span style={{ padding: '1px 8px', background: statusTab === tab.key ? RED : 'rgba(255,255,255,0.08)', borderRadius: 20, fontSize: 14, fontWeight: 700, color: statusTab === tab.key ? '#fff' : 'rgba(255,255,255,0.5)' }}>{tab.count}</span>
                    </button>
                  ))}
                </div>

                {/* Queue Table */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 180px 130px 110px 100px 120px', padding: '11px 16px', background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Agency', 'Location', 'Contact Email', 'Applied On', 'Documents', 'Status', ''].map(h => (
                      <div key={h} style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform: 'uppercase' as const }}>{h}</div>
                    ))}
                  </div>

                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 180px 130px 110px 100px 120px', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 12 }}>
                        {Array.from({ length: 7 }).map((_, j) => <Sk key={j} h={20} />)}
                      </div>
                    ))
                  ) : agencies.length === 0 ? (
                    <div style={{ textAlign: 'center' as const, padding: 60, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW, fontSize: 16 }}>
                      No agencies in this queue
                    </div>
                  ) : agencies.map((a, i) => (
                    <div key={a.id}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 160px 180px 130px 110px 100px 120px', padding: '12px 16px', borderBottom: i < agencies.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                        onClick={() => { setAgencyIdx(i); setSelected(true); setInnerTab('Overview'); setNotes(''); }}>
                        {a.logo_url
                          ? <img src={a.logo_url} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} alt="" />
                          : <div style={{ width: 44, height: 44, borderRadius: 10, background: `${BLUE}15`, border: `1px solid ${BLUE}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Building2 size={20} color={BLUE} />
                            </div>
                        }
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.company_name}</div>
                          <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.38)' }}>{a.profiles.profile_number ?? '—'}</div>
                          {a.company_type && <div style={{ display: 'inline-block', padding: '1px 8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, fontFamily: BARLOW, fontSize: 13, color: GREEN, fontWeight: 600 }}>{a.company_type}</div>}
                        </div>
                      </div>
                      <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
                        onClick={() => { setAgencyIdx(i); setSelected(true); setInnerTab('Overview'); setNotes(''); }}>
                        {[a.city, a.state].filter(Boolean).join(', ') || '—'}
                      </div>
                      <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                        onClick={() => { setAgencyIdx(i); setSelected(true); setInnerTab('Overview'); setNotes(''); }}>
                        {a.contact_email}
                      </div>
                      <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
                        onClick={() => { setAgencyIdx(i); setSelected(true); setInnerTab('Overview'); setNotes(''); }}>
                        {fmtDate(a.created_at)}
                      </div>
                      <div style={{ cursor: 'pointer' }}
                        onClick={() => { setAgencyIdx(i); setSelected(true); setInnerTab('Overview'); setNotes(''); }}>
                        <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: a.documents.length > 0 ? GREEN : ORANGE }}>{a.documents.length} uploaded</div>
                      </div>
                      <div style={{ cursor: 'pointer' }}
                        onClick={() => { setAgencyIdx(i); setSelected(true); setInnerTab('Overview'); setNotes(''); }}>
                        <span style={{ padding: '3px 10px', background: statusBg(a.verification_status), border: `1px solid ${statusColor(a.verification_status)}40`, borderRadius: 20, fontFamily: BARLOW, fontSize: 13, fontWeight: 700, color: statusColor(a.verification_status) }}>
                          {statusLabel(a.verification_status)}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={e => { e.stopPropagation(); router.push(`/admin/agency-profile-view?id=${a.id}`); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'rgba(212,166,74,0.1)', border: '1px solid rgba(212,166,74,0.25)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,166,74,0.2)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(212,166,74,0.1)')}
                        >
                          <Eye size={13} /> View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ VIEW B: AGENCY DETAIL ════ */}
            {selected && agency && (
              <div>
                {/* Agency header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20, background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                  {agency.logo_url
                    ? <img src={agency.logo_url} style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} alt="" />
                    : <div style={{ width: 72, height: 72, borderRadius: 12, background: `${BLUE}15`, border: `1px solid ${BLUE}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Building2 size={28} color={BLUE} /></div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' as const }}>
                      <div style={{ fontFamily: BARLOW, fontSize: 22, fontWeight: 700, color: '#F5F5F5' }}>{agency.company_name}</div>
                      <span style={{ padding: '3px 12px', background: statusBg(agency.verification_status), border: `1px solid ${statusColor(agency.verification_status)}40`, borderRadius: 20, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: statusColor(agency.verification_status) }}>
                        {statusLabel(agency.verification_status)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' as const }}>
                      {[
                        { icon: <Mail size={12} />,     val: agency.contact_email },
                        { icon: <Phone size={12} />,    val: agency.contact_phone },
                        { icon: <MapPin size={12} />,   val: [agency.city, agency.state, agency.country].filter(Boolean).join(', ') || '—' },
                        { icon: <Calendar size={12} />, val: `Applied ${fmtDate(agency.created_at)}` },
                      ].map((r, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                          <span style={{ color: 'rgba(255,255,255,0.3)' }}>{r.icon}</span>{r.val}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    {agency.verification_status === 'pending' && (
                      <>
                        <button onClick={() => setModal('approve')} style={{ padding: '8px 16px', background: GREEN, border: 'none', borderRadius: 8, color: '#fff', fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button onClick={() => setModal('reject')} style={{ padding: '8px 16px', background: RED, border: 'none', borderRadius: 8, color: '#fff', fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <XCircle size={14} /> Reject
                        </button>
                        <button onClick={() => setModal('hold')} style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${GOLD}`, borderRadius: 8, color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={14} /> Hold
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Inner tabs */}
                <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 18 }}>
                  {INNER_TABS.map(tab => (
                    <button key={tab} onClick={() => setInnerTab(tab)}
                      style={{ padding: '10px 18px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: BARLOW, fontSize: 15, fontWeight: innerTab === tab ? 700 : 400, color: innerTab === tab ? RED : 'rgba(255,255,255,0.5)', borderBottom: innerTab === tab ? `2px solid ${RED}` : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap' as const }}>
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab content + sidebar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* OVERVIEW TAB */}
                    {innerTab === 'Overview' && (
                      <>
                        {/* About */}
                        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                          <div style={{ fontFamily: BARLOW, fontSize: 17, fontWeight: 700, color: '#F5F5F5', marginBottom: 12 }}>About the Agency</div>
                          <p style={{ fontFamily: BARLOW, fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 16 }}>
                            {agency.company_description || 'No description provided.'}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {[
                              { icon: <Clock size={15} />,    label: 'Years of Experience', value: agency.years_of_experience ? `${new Date().getFullYear() - agency.years_of_experience}+ Years (Est. ${agency.years_of_experience})` : '—' },
                              { icon: <Building size={15} />, label: 'Agency Type',       value: agency.company_type ?? '—' },
                              { icon: <Globe size={15} />,    label: 'Website',           value: agency.website_url ?? '—', link: agency.website_url },
                              { icon: <Award size={15} />,    label: 'Trust Score',       value: agency.trust_score ? `${agency.trust_score}/100` : '—' },
                            ].map(s => (
                              <div key={s.label} style={{ background: BG3, borderRadius: 8, padding: '12px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>{s.icon}</span>{s.label}
                                </div>
                                {(s as any).link
                                  ? <a href={(s as any).link.startsWith('http') ? (s as any).link : `https://${(s as any).link}`} target="_blank" rel="noreferrer" style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: BLUE, textDecoration: 'none' }}>{s.value}</a>
                                  : <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>{s.value}</div>
                                }
                              </div>
                            ))}
                          </div>

                          {/* Expertise / Languages / Genres / Operating Cities / Social — 2-col grid */}
                          {((agency as any).expertise?.length > 0 || (agency as any).languages?.length > 0 || (agency as any).genres?.length > 0 || (agency as any).operating_cities?.length > 0 || (agency as any).company_size || ((agency as any).social_links && Object.values((agency as any).social_links).some(Boolean))) && (
                            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
                              {/* Row 1 col 1: Company Size */}
                              {(agency as any).company_size ? (
                                <div>
                                  <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 5 }}>Company Size</div>
                                  <span style={{ padding: '3px 10px', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, fontFamily: BARLOW, fontSize: 13, fontWeight: 600, color: PURPLE }}>{(agency as any).company_size}</span>
                                </div>
                              ) : <div />}
                              {/* Row 1 col 2: Areas of Expertise */}
                              {(agency as any).expertise?.length > 0 ? (
                                <div>
                                  <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 5 }}>Areas of Expertise</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                                    {(agency as any).expertise.map((e: string) => (
                                      <span key={e} style={{ padding: '2px 8px', background: `${GOLD}15`, border: `1px solid ${GOLD}35`, borderRadius: 20, fontFamily: BARLOW, fontSize: 12, color: GOLD }}>{e}</span>
                                    ))}
                                  </div>
                                </div>
                              ) : <div />}
                              {/* Row 2 col 1: Languages */}
                              {(agency as any).languages?.length > 0 ? (
                                <div>
                                  <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 5 }}>Languages</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                                    {(agency as any).languages.map((l: string) => (
                                      <span key={l} style={{ padding: '2px 8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, fontFamily: BARLOW, fontSize: 12, color: BLUE }}>{l}</span>
                                    ))}
                                  </div>
                                </div>
                              ) : <div />}
                              {/* Row 2 col 2: Genres */}
                              {(agency as any).genres?.length > 0 ? (
                                <div>
                                  <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 5 }}>Genres</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                                    {(agency as any).genres.map((g: string) => (
                                      <span key={g} style={{ padding: '2px 8px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 20, fontFamily: BARLOW, fontSize: 12, color: ORANGE }}>{g}</span>
                                    ))}
                                  </div>
                                </div>
                              ) : <div />}
                              {/* Row 3 col 1: Operating Cities */}
                              {(agency as any).operating_cities?.length > 0 ? (
                                <div>
                                  <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 5 }}>Operating Cities</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                                    {(agency as any).operating_cities.map((c: string) => (
                                      <span key={c} style={{ padding: '2px 8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, fontFamily: BARLOW, fontSize: 12, color: GREEN }}>{c}</span>
                                    ))}
                                  </div>
                                </div>
                              ) : <div />}
                              {/* Row 3 col 2: Social Links */}
                              {(agency as any).social_links && Object.values((agency as any).social_links).some(Boolean) ? (
                                <div>
                                  <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 5 }}>Social Links</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
                                    {Object.entries((agency as any).social_links).filter(([, v]) => v).map(([k, v]) => (
                                      <a key={k} href={String(v)} target="_blank" rel="noreferrer"
                                        style={{ padding: '2px 8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, fontFamily: BARLOW, fontSize: 12, color: BLUE, textDecoration: 'none', textTransform: 'capitalize' as const }}>
                                        {k} ↗
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              ) : <div />}
                            </div>
                          )}
                        </div>

                        {/* Uploaded Documents preview */}
                        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                          <div style={{ fontFamily: BARLOW, fontSize: 17, fontWeight: 700, color: '#F5F5F5', marginBottom: 14 }}>
                            Uploaded Documents ({agency.documents.length})
                          </div>
                          {agency.documents.length === 0 ? (
                            <div style={{ textAlign: 'center' as const, padding: '24px 0', color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW, fontSize: 15 }}>
                              No documents uploaded yet by this agency.
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
                              {agency.documents.map(doc => {
                                const st = doc.status ?? 'pending_review';
                                const stColor = st==='approved'?GREEN:st==='rejected'?RED:ORANGE;
                                const stBg    = st==='approved'?'rgba(34,197,94,0.1)':st==='rejected'?'rgba(200,32,42,0.1)':'rgba(245,158,11,0.1)';
                                const stBdr   = st==='approved'?'rgba(34,197,94,0.25)':st==='rejected'?'rgba(200,32,42,0.25)':'rgba(245,158,11,0.25)';
                                const stLabel = st==='approved'?'✓ Approved':st==='rejected'?'✗ Rejected':'⏳ Pending Review';
                                return (
                                  <div key={doc.id} style={{ background: BG3, border: `1px solid ${st==='rejected'?'rgba(200,32,42,0.3)':st==='approved'?'rgba(34,197,94,0.2)':'rgba(255,255,255,0.07)'}`, borderRadius: 10, overflow: 'hidden', display:'flex', flexDirection:'column' }}>
                                    <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                      <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.doc_label}</div>
                                      <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{doc.file_name}</div>
                                      <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{fmtSize(doc.file_size)}</div>
                                    </div>
                                    <div style={{ padding: '10px 12px', flex: 1, display:'flex', flexDirection:'column', gap: 7 }}>
                                      <div style={{ padding: '3px 8px', background: stBg, border: `1px solid ${stBdr}`, borderRadius: 20, fontFamily: BARLOW, fontSize: 12, fontWeight: 700, color: stColor, display:'inline-block', width:'fit-content' }}>{stLabel}</div>
                                      {st==='rejected' && doc.rejection_reason && (
                                        <div style={{ padding: '6px 8px', background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.15)', borderRadius: 6, fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,180,180,0.85)', lineHeight: 1.4 }}>
                                          <span style={{ fontWeight: 700, color: RED }}>Reason: </span>{doc.rejection_reason}
                                        </div>
                                      )}
                                      <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{fmtDate(doc.uploaded_at ?? doc.created_at)}</div>
                                      <button onClick={() => window.open(doc.public_url, '_blank')}
                                        style={{ width:'100%', padding: '5px 0', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 5, color: BLUE, fontFamily: BARLOW, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                        <Eye size={11} /> View Document
                                      </button>
                                      {st === 'pending_review' && (
                                        <button onClick={() => { setDocModal({ id: doc.id, label: doc.doc_label, action: 'approve_doc' }); setDocReason(''); }}
                                          style={{ width:'100%', padding: '5px 0', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 5, color: GREEN, fontFamily: BARLOW, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                          <CheckCircle size={11} /> Approve
                                        </button>
                                      )}
                                      {st === 'pending_review' && (
                                        <button onClick={() => { setDocModal({ id: doc.id, label: doc.doc_label, action: 'reject_doc' }); setDocReason(''); }}
                                          style={{ width:'100%', padding: '5px 0', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 5, color: RED, fontFamily: BARLOW, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                          <XCircle size={11} /> Reject
                                        </button>
                                      )}

                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* DOCUMENTS TAB */}
                    {innerTab === 'Documents' && (
                      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                        <div style={{ fontFamily: BARLOW, fontSize: 17, fontWeight: 700, color: '#F5F5F5', marginBottom: 14 }}>
                          All Uploaded Documents ({agency.documents.length})
                        </div>
                        {agency.documents.length === 0 ? (
                          <div style={{ textAlign: 'center' as const, padding: '32px 0', color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW, fontSize: 15 }}>
                            This agency has not uploaded any documents yet.
                          </div>
                        ) : agency.documents.map((doc, i) => {
                          const st = doc.status ?? 'pending_review';
                          const stColor = st==='approved'?GREEN:st==='rejected'?RED:ORANGE;
                          const stBg    = st==='approved'?'rgba(34,197,94,0.12)':st==='rejected'?'rgba(200,32,42,0.12)':'rgba(245,158,11,0.12)';
                          const stBdr   = st==='approved'?'rgba(34,197,94,0.3)':st==='rejected'?'rgba(200,32,42,0.3)':'rgba(245,158,11,0.3)';
                          const stLabel = st==='approved'?'✓ Approved':st==='rejected'?'✗ Rejected':'⏳ Pending Review';
                          return (
                            <div key={doc.id} style={{ padding: '14px 0', borderBottom: i < agency.documents.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📄</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3, flexWrap: 'wrap' as const }}>
                                    <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>{doc.doc_label}</div>
                                    <span style={{ padding: '2px 10px', background: stBg, border: `1px solid ${stBdr}`, borderRadius: 20, fontFamily: BARLOW, fontSize: 12, fontWeight: 700, color: stColor }}>{stLabel}</span>
                                  </div>
                                  <div style={{ fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
                                    {doc.file_name} · {fmtSize(doc.file_size)} · Uploaded {fmtDate(doc.uploaded_at ?? doc.created_at)}
                                  </div>
                                  {st==='rejected' && doc.rejection_reason && (
                                    <div style={{ marginTop: 6, padding: '6px 10px', background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 6, fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,180,180,0.85)', lineHeight: 1.5 }}>
                                      <span style={{ fontWeight: 700, color: RED }}>Rejection Reason: </span>{doc.rejection_reason}
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' as const }}>
                                  <button onClick={() => window.open(doc.public_url, '_blank')}
                                    style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, color: BLUE, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <Eye size={13} /> View
                                  </button>
                                  {st === 'pending_review' && (
                                    <button onClick={() => { setDocModal({ id: doc.id, label: doc.doc_label, action: 'approve_doc' }); setDocReason(''); }}
                                      style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 6, color: GREEN, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                      <CheckCircle size={13} /> Approve
                                    </button>
                                  )}
                                  {st === 'pending_review' && (
                                    <button onClick={() => { setDocModal({ id: doc.id, label: doc.doc_label, action: 'reject_doc' }); setDocReason(''); }}
                                      style={{ padding: '6px 12px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 6, color: RED, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                      <XCircle size={13} /> Reject
                                    </button>
                                  )}

                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* BUSINESS DETAILS TAB */}
                    {innerTab === 'Business Details' && (
                      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                        <div style={{ fontFamily: BARLOW, fontSize: 17, fontWeight: 700, color: '#F5F5F5', marginBottom: 16 }}>Business Details</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          {[
                            { l: 'Legal Name',         v: agency.company_name            },
                            { l: 'Agency Type',         v: agency.company_type ?? '—'     },
                            { l: 'Contact Person',      v: agency.contact_person_name     },
                            { l: 'Registration No.',    v: agency.registration_number ?? '—' },
                            { l: 'GST Number',          v: agency.gst_number ?? '—'       },
                            { l: 'PAN Number',          v: agency.pan_number ?? '—'       },
                            { l: 'Contact Email',       v: agency.contact_email           },
                            { l: 'Contact Phone',       v: agency.contact_phone           },
                            { l: 'City',                v: agency.city ?? '—'             },
                            { l: 'State',               v: agency.state ?? '—'            },
                            { l: 'Country',             v: agency.country ?? '—'          },
                            { l: 'Website',             v: agency.website_url ?? '—', link: agency.website_url },
                            { l: 'Company Size',        v: (agency as any).company_size ?? '—' },
                            { l: 'Address',             v: agency.address_line1 ?? '—'   },
                          ].map(r => (
                            <div key={r.l} style={{ paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <div style={{ fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 3, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{r.l}</div>
                              {(r as any).link
                                ? <a href={(r as any).link.startsWith('http') ? (r as any).link : `https://${(r as any).link}`} target="_blank" rel="noreferrer" style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 600, color: BLUE, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>{r.v} <Globe size={11} /></a>
                                : <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 600, color: '#F5F5F5' }}>{r.v}</div>
                              }
                            </div>
                          ))}
                        </div>

                        {/* Array fields & media */}
                        {((agency as any).expertise?.length > 0 || (agency as any).languages?.length > 0 || (agency as any).genres?.length > 0 || (agency as any).operating_cities?.length > 0) && (
                          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
                            {(agency as any).expertise?.length > 0 && (
                              <div>
                                <div style={{ fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 6 }}>Areas of Expertise</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                                  {(agency as any).expertise.map((e: string) => <span key={e} style={{ padding: '3px 10px', background: `${GOLD}15`, border: `1px solid ${GOLD}35`, borderRadius: 20, fontFamily: BARLOW, fontSize: 13, color: GOLD }}>{e}</span>)}
                                </div>
                              </div>
                            )}
                            {(agency as any).languages?.length > 0 && (
                              <div>
                                <div style={{ fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 6 }}>Languages</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                                  {(agency as any).languages.map((l: string) => <span key={l} style={{ padding: '3px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, fontFamily: BARLOW, fontSize: 13, color: BLUE }}>{l}</span>)}
                                </div>
                              </div>
                            )}
                            {(agency as any).genres?.length > 0 && (
                              <div>
                                <div style={{ fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 6 }}>Genres</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                                  {(agency as any).genres.map((g: string) => <span key={g} style={{ padding: '3px 10px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 20, fontFamily: BARLOW, fontSize: 13, color: ORANGE }}>{g}</span>)}
                                </div>
                              </div>
                            )}
                            {(agency as any).operating_cities?.length > 0 && (
                              <div>
                                <div style={{ fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 6 }}>Operating Cities</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                                  {(agency as any).operating_cities.map((c: string) => <span key={c} style={{ padding: '3px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, fontFamily: BARLOW, fontSize: 13, color: GREEN }}>{c}</span>)}
                                </div>
                              </div>
                            )}
                            {(agency as any).social_links && Object.values((agency as any).social_links).some(Boolean) && (
                              <div>
                                <div style={{ fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 6 }}>Social Links</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                                  {Object.entries((agency as any).social_links).filter(([, v]) => v).map(([k, v]) => (
                                    <a key={k} href={String(v)} target="_blank" rel="noreferrer"
                                      style={{ padding: '4px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, fontFamily: BARLOW, fontSize: 13, color: BLUE, textDecoration: 'none', textTransform: 'capitalize' as const }}>
                                      {k} ↗
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Logo / Banner / Gallery preview */}
                            {((agency as any).logo_url || (agency as any).banner_url || (agency as any).gallery_urls?.length > 0) && (
                              <div>
                                <div style={{ fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 8 }}>Media</div>
                                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const, marginBottom: 10 }}>
                                  {(agency as any).logo_url && (
                                    <div>
                                      <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Logo</div>
                                      <img src={(agency as any).logo_url} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} alt="logo" />
                                    </div>
                                  )}
                                  {(agency as any).banner_url && (
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Banner</div>
                                      <img src={(agency as any).banner_url} style={{ width: '100%', maxWidth: 320, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} alt="banner" />
                                    </div>
                                  )}
                                </div>
                                {(agency as any).gallery_urls?.length > 0 && (
                                  <div>
                                    <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Gallery ({(agency as any).gallery_urls.length} images)</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                                      {(agency as any).gallery_urls.map((url: string, i: number) => (
                                        <img key={i} src={url} style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                                          onClick={() => window.open(url, '_blank')} alt={`gallery-${i}`} />
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* NOTES & HISTORY TAB */}
                    {innerTab === 'Notes & History' && (
                      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                        <div style={{ fontFamily: BARLOW, fontSize: 17, fontWeight: 700, color: '#F5F5F5', marginBottom: 14 }}>Admin Notes</div>
                        <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0, 500))} placeholder="Add internal notes about this verification..."
                          style={{ width: '100%', height: 100, background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', resize: 'none' as const, boxSizing: 'border-box' as const }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, marginBottom: 12 }}>
                          <span style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>{notes.length}/500</span>
                        </div>
                        <button style={{ padding: '9px 20px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 16, letterSpacing: 1, cursor: 'pointer' }}>Save Note</button>
                      </div>
                    )}

                  </div>

                  {/* RIGHT SIDEBAR */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Progress */}
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      {(() => {
                        const fields = [
                          agency.company_name,
                          agency.contact_person_name,
                          agency.contact_email,
                          agency.contact_phone,
                          agency.address_line1,
                          agency.city,
                          agency.state,
                          agency.country,
                          agency.company_description,
                          agency.years_of_experience,
                        ];
                        const filled = fields.filter(f => f !== null && f !== undefined && f !== '').length;
                        const pct = Math.round((filled / fields.length) * 100);
                        return (
                          <CircularProgress pct={pct} done={filled} total={fields.length} />
                        );
                      })()}
                    </div>

                    {/* Action buttons */}
                    {agency.verification_status === 'pending' && (
                      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>Admin Actions</div>
                        <button onClick={() => setModal('approve')} style={{ width: '100%', padding: 12, background: GREEN, border: 'none', borderRadius: 8, color: '#fff', fontFamily: BARLOW, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <CheckCircle size={16} /> Approve Agency
                        </button>
                        <button onClick={() => setModal('reject')} style={{ width: '100%', padding: 12, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 8, color: RED, fontFamily: BARLOW, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <XCircle size={16} /> Reject
                        </button>
                        <button onClick={() => setModal('hold')} style={{ width: '100%', padding: 12, background: 'rgba(212,166,74,0.1)', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 8, color: GOLD, fontFamily: BARLOW, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <Clock size={16} /> Put On Hold
                        </button>
                      </div>
                    )}

                    {/* Agency info summary */}
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18 }}>
                      <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: '#F5F5F5', marginBottom: 12 }}>Quick Info</div>
                      {[
                        { label: 'Profile No.',   value: agency.profiles.profile_number ?? '—' },
                        { label: 'Email',         value: agency.contact_email },
                        { label: 'Phone',         value: agency.contact_phone },
                        { label: 'GST',           value: agency.gst_number ?? '—' },
                        { label: 'Reg. No.',      value: agency.registration_number ?? '—' },
                        { label: 'Applied On',    value: fmtDate(agency.created_at) },
                        { label: 'Trust Score',   value: agency.trust_score ? `${agency.trust_score}/100` : '—' },
                      ].map(r => (
                        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{r.label}</span>
                          <span style={{ fontFamily: BARLOW, fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Prev / Next nav */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: '14px 20px', background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                  <button onClick={() => agencyIdx > 0 && (setAgencyIdx(agencyIdx - 1), setInnerTab('Overview'))} disabled={agencyIdx === 0}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: agencyIdx > 0 ? BG3 : 'transparent', border: `1px solid ${agencyIdx > 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 8, color: agencyIdx > 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', fontFamily: BARLOW, fontSize: 14, cursor: agencyIdx > 0 ? 'pointer' : 'not-allowed' }}>
                    <ArrowLeft size={15} /> Previous
                  </button>
                  <span style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{agencyIdx + 1} of {agencies.length}</span>
                  <button onClick={() => agencyIdx < agencies.length - 1 && (setAgencyIdx(agencyIdx + 1), setInnerTab('Overview'))} disabled={agencyIdx === agencies.length - 1}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: agencyIdx < agencies.length - 1 ? BG3 : 'transparent', border: `1px solid ${agencyIdx < agencies.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`, borderRadius: 8, color: agencyIdx < agencies.length - 1 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)', fontFamily: BARLOW, fontSize: 14, cursor: agencyIdx < agencies.length - 1 ? 'pointer' : 'not-allowed' }}>
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ══ MODALS ══ */}
      {modal === 'approve' && agency && (
        <Modal title="APPROVE AGENCY" onClose={() => setModal('')}>
          <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontFamily: BARLOW, fontSize: 15, color: GREEN, fontWeight: 700, marginBottom: 4 }}>✓ Approve Agency Profile</div>
            <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Approving <strong style={{ color: '#F5F5F5' }}>{agency.company_name}</strong>. Their profile will be marked as verified and they will receive a notification.
            </div>
          </div>
          {actionMsg && <div style={{ padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 7, fontFamily: BARLOW, fontSize: 14, color: RED, marginBottom: 12 }}>{actionMsg}</div>}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Approval Notes (optional)</label>
            <textarea value={actionNotes} onChange={e => setActionNotes(e.target.value)} placeholder="Add any notes..." style={{ width: '100%', height: 70, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '10px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', resize: 'none' as const, boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setModal('')} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => handleAction('approve')} disabled={actioning} style={{ flex: 2, padding: 10, background: GREEN, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BEBAS, fontSize: 17, letterSpacing: 1, cursor: 'pointer', opacity: actioning ? 0.7 : 1 }}>
              {actioning ? 'Approving...' : 'Confirm Approval'}
            </button>
          </div>
        </Modal>
      )}

      {modal === 'reject' && agency && (
        <Modal title="REJECT AGENCY" onClose={() => setModal('')}>
          <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 14, lineHeight: 1.6 }}>
            Rejecting verification for <strong style={{ color: '#F5F5F5' }}>{agency.company_name}</strong>. They will receive a notification with the reason.
          </div>
          {actionMsg && <div style={{ padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 7, fontFamily: BARLOW, fontSize: 14, color: RED, marginBottom: 12 }}>{actionMsg}</div>}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Reason for Rejection</label>
            <select value={rejectReason} onChange={e => setRejectReason(e.target.value)} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '10px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none' }}>
              <option>Invalid or fraudulent documents</option>
              <option>Incomplete registration details</option>
              <option>Business not registered</option>
              <option>Duplicate agency account</option>
              <option>Failed reference check</option>
              <option>Documents not matching company details</option>
              <option>Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Additional Notes</label>
            <textarea value={actionNotes} onChange={e => setActionNotes(e.target.value)} placeholder="Explain the rejection reason..." style={{ width: '100%', height: 70, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '10px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', resize: 'none' as const, boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setModal('')} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => handleAction('reject')} disabled={actioning} style={{ flex: 2, padding: 10, background: RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BEBAS, fontSize: 17, letterSpacing: 1, cursor: 'pointer', opacity: actioning ? 0.7 : 1 }}>
              {actioning ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Per-Document Action Modal ── */}
      {docModal && (
        <Modal title={docModal.action === 'approve_doc' ? 'APPROVE DOCUMENT' : 'REJECT DOCUMENT'} onClose={() => setDocModal(null)}>
          <div style={{ padding: '12px 16px', background: docModal.action==='approve_doc'?'rgba(34,197,94,0.08)':'rgba(200,32,42,0.08)', border: `1px solid ${docModal.action==='approve_doc'?'rgba(34,197,94,0.2)':'rgba(200,32,42,0.2)'}`, borderRadius: 8, marginBottom: 16 }}>
            <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: docModal.action==='approve_doc'?GREEN:RED, marginBottom: 4 }}>
              {docModal.action==='approve_doc' ? '✓' : '✗'} {docModal.label}
            </div>
            <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              {docModal.action==='approve_doc'
                ? 'This document will be marked as approved. The agency will be notified.'
                : 'This document will be rejected. Please provide a reason so the agency can re-upload.'}
            </div>
          </div>
          {docModal.action === 'reject_doc' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Rejection Reason <span style={{ color: RED }}>*</span></label>
              <select
                value={['Document is blurry or unreadable','Wrong document uploaded','Document is expired','Details do not match company information','Document appears to be edited or tampered','Poor image quality'].includes(docReason) ? docReason : docReason ? 'Other' : ''}
                onChange={e => { if (e.target.value !== 'Other') setDocReason(e.target.value); else setDocReason(''); }}
                style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '10px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', marginBottom: 8 }}>
                <option value="">Select a reason...</option>
                <option value="Document is blurry or unreadable">Document is blurry or unreadable</option>
                <option value="Wrong document uploaded">Wrong document uploaded</option>
                <option value="Document is expired">Document is expired</option>
                <option value="Details do not match company information">Details do not match company information</option>
                <option value="Document appears to be edited or tampered">Document appears to be edited or tampered</option>
                <option value="Poor image quality">Poor image quality</option>
                <option value="Other">Other — type below</option>
              </select>
              <textarea value={docReason} onChange={e => setDocReason(e.target.value)}
                placeholder="Type rejection reason here..."
                style={{ width: '100%', height: 70, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '10px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', resize: 'none' as const, boxSizing: 'border-box' as const }} />
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setDocModal(null)} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleDocAction} disabled={docActioning || (docModal.action==='reject_doc' && !docReason.trim())}
              style={{ flex: 2, padding: 10, background: docModal.action==='approve_doc'?GREEN:RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BEBAS, fontSize: 17, letterSpacing: 1, cursor: 'pointer', opacity: (docActioning || (docModal.action==='reject_doc' && !docReason.trim())) ? 0.6 : 1 }}>
              {docActioning ? 'Processing...' : docModal.action==='approve_doc' ? 'Confirm Approval' : 'Confirm Rejection'}
            </button>
          </div>
        </Modal>
      )}

      {modal === 'hold' && agency && (
        <Modal title="PUT ON HOLD" onClose={() => setModal('')}>
          <div style={{ fontFamily: BARLOW, fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 14, lineHeight: 1.6 }}>
            Putting <strong style={{ color: '#F5F5F5' }}>{agency.company_name}</strong> on hold will pause the verification process.
          </div>
          {actionMsg && <div style={{ padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 7, fontFamily: BARLOW, fontSize: 14, color: RED, marginBottom: 12 }}>{actionMsg}</div>}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Reason</label>
            <select value={holdReason} onChange={e => setHoldReason(e.target.value)} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '10px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none' }}>
              <option>Awaiting additional documents</option>
              <option>Manual review required</option>
              <option>Suspicious activity detected</option>
              <option>Legal verification pending</option>
              <option>Other</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setModal('')} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => handleAction('hold')} disabled={actioning} style={{ flex: 2, padding: 10, background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 17, letterSpacing: 1, cursor: 'pointer', opacity: actioning ? 0.7 : 1 }}>
              {actioning ? 'Processing...' : 'Put On Hold'}
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}