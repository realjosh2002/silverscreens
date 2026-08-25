'use client'

export const dynamic = 'force-dynamic';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopnav from '@/components/layout/AdminTopnav';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Database,
  Settings, ScrollText, Bell, ChevronRight, TrendingUp,
  Download, UserCheck, MoreVertical, BellRing, Ticket,
  KeyRound, ChevronLeft, Menu, ChevronDown, Eye, Search,
  Filter, X, Info, Plus, Edit2, CheckSquare, Square,
  Clock, Check, XCircle, Wallet, History, RotateCcw,
  Calendar, Loader2, AlertCircle,
} from 'lucide-react';

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

const STATUS_COLOR: Record<string, string> = {
  Active: GREEN, 'Expiring Soon': ORANGE, Expired: RED,
  Cancelled: PURPLE, 'Pending Payment': BLUE, Pending: BLUE,
};
const STATUS_BG: Record<string, string> = {
  Active: 'rgba(34,197,94,0.12)', 'Expiring Soon': 'rgba(249,115,22,0.12)',
  Expired: 'rgba(239,68,68,0.12)', Cancelled: 'rgba(139,92,246,0.12)',
  'Pending Payment': 'rgba(59,130,246,0.12)', Pending: 'rgba(59,130,246,0.12)',
};
const USER_COLOR: Record<string, string> = { Aspirant: PURPLE, Agency: BLUE };
const USER_BG: Record<string, string> = {
  Aspirant: 'rgba(139,92,246,0.15)', Agency: 'rgba(59,130,246,0.15)',
};
const PLAN_COLORS: Record<string, string> = {
  Basic: BLUE, Premium: GOLD, Pro: GREEN,
  'Agency Pro': PURPLE, Enterprise: RED,
};
const AVATAR_PALETTE = [PURPLE, BLUE, GREEN, ORANGE, TEAL, GOLD, RED];
function avatarColor(name: string) {
  return AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];
}

/* ─── Sidebar nav ────────────────────────────────────────────── */

const PROFILE_MENU = [
  { label: 'My Profile',               href: '/admin/profile'          },
  { label: 'Account Settings',         href: '/admin/account-settings' },
  { label: 'Security & Login',         href: '/admin/security-login'   },
  { label: 'Notification Preferences', href: '/admin/notifications'    },
  { label: 'Activity Log',             href: '/admin/activity-log'     },
  { label: 'Help & Support',           href: '/admin/help-support'     },
  { label: 'Logout',                   href: '/login'                  },
];

/* ─── Filter options — matched to real DB values ─────────────── */
const USER_TYPES  = ['All User Types', 'Aspirant', 'Agency'];
// Plans come from DB as uppercase e.g. GROWTH, STAR, ICON
// Keep as 'All Plans' default; actual plan names loaded dynamically from data
const ALL_PLANS   = ['All Plans', 'GROWTH', 'STAR', 'ICON'];
const ALL_STATUS  = ['All Statuses', 'Active', 'Pending Payment', 'Expiring Soon', 'Expired', 'Cancelled'];
// No billing_cycle column in DB — derived from date range
const BILL_CYCLE  = ['All Durations', '6 Months', '1 Year'];
// Real payment methods in DB: razorpay, null (show as N/A)
const PAY_METHODS = ['All Methods', 'Razorpay', 'N/A'];
const DEPARTMENTS = [
  'All Departments', 'Acting', 'Direction', 'Dancing', 'Singing', 'Modelling',
  'Hair & Make Up', 'Costume', 'Stunt', 'Sound & Music', 'Camera & Lighting',
  'Editorial', 'Visual Effects', 'Dubbing', 'Story', 'Television',
];
const AGENCY_TYPES = [
  'All Types', 'Casting Agency', 'Ad Agency', 'OTT Studio',
  'Production House', 'Event Production',
];
const SORT_OPTS = [
  'Newest First', 'Oldest First', 'Amount High–Low',
  'Amount Low–High', 'Renewal Date',
];
const SORT_MAP: Record<string, string> = {
  'Newest First': 'newest', 'Oldest First': 'oldest',
  'Amount High–Low': 'amount_high', 'Amount Low–High': 'amount_low',
  'Renewal Date': 'renewal',
};
const STATUS_TO_DB: Record<string, string> = {
  'Active': 'active', 'Pending Payment': 'pending_payment',
  'Expiring Soon': 'expiring_soon', 'Expired': 'expired', 'Cancelled': 'cancelled',
};

const PER_PAGE = 8;

/* ─── Types ──────────────────────────────────────────────────── */
interface Sub {
  id: string; plan: string; plan_key: string;
  status: string; cycle: string;
  amount: number; amountStr: string;
  payment: string;
  start: string; startTime: string;
  renewal: string; renewalTime: string;
  userId: string; name: string; email: string;
  profileNumber: string; userType: string;
  department: string; agencyType: string;
  city: string; initials: string;
}
interface Stats {
  total: number; active: number; expiring: number;
  expired: number; cancelled: number; pending_payment: number; mrr: number;
}
interface Revenue { total_revenue: number; successful_tx: number; avg_tx: number; }

/* ─── Donut chart ────────────────────────────────────────────── */
function DonutChart({ data, total, size = 148 }: {
  data: { label: string; pct: number; color: string }[];
  total: string; size?: number;
}) {
  const cx = size / 2, cy = size / 2, R = size * 0.44, r = size * 0.29;
  const rad = (d: number) => (d * Math.PI) / 180;
  const pt  = (a: number, rv: number) => [cx + rv * Math.cos(rad(a)), cy + rv * Math.sin(rad(a))];
  let start = -90;
  const sum = data.reduce((s, d) => s + d.pct, 0) || 1;
  const arcs = data.map(seg => {
    const sweep = (seg.pct / sum) * 360, end = start + sweep, large = sweep > 180 ? 1 : 0;
    const [x1, y1] = pt(start, R); const [x2, y2] = pt(end, R);
    const [x3, y3] = pt(end, r);   const [x4, y4] = pt(start, r);
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
    start = end + 1.5;
    return { ...seg, d };
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r - 2} fill={BG3} />
      {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} />)}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={size * 0.07} fontFamily={BARLOW}>Total</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#F5F5F5" fontSize={size * 0.13} fontWeight={800} fontFamily={BEBAS} letterSpacing={1}>{total}</text>
    </svg>
  );
}

/* ─── Skeleton row ───────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 0.9fr 1.3fr 0.9fr 0.9fr 0.8fr 0.9fr 1fr 1fr 1.1fr 60px', padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 6, alignItems: 'center' }}>
      <div style={{ width: 15, height: 15, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }} />
      {Array.from({ length: 11 }, (_, j) => (
        <div key={j} style={{ height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.05)', width: j === 0 ? '90%' : j === 1 ? '60%' : '70%' }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADD SUBSCRIPTION MODAL — searches real users, creates real record
══════════════════════════════════════════════════════════════ */
function AddSubscriptionModal({ onClose, onSuccess, getToken, showToast, planOptions }: {
  onClose: () => void; onSuccess: () => void;
  getToken: () => string; showToast: (m: string) => void;
  planOptions: string[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSearch, setUserSearch]   = useState('');
  const [userResults, setUserResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searching, setSearching]     = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [durationMonths, setDurationMonths] = useState('6');
  const [submitting, setSubmitting]   = useState(false);

  const searchUsers = async () => {
    if (!userSearch.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/users?keyword=${encodeURIComponent(userSearch)}&limit=5`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const d = await res.json();
      setUserResults((d.data ?? d)?.users ?? []);
    } catch { setUserResults([]); }
    finally { setSearching(false); }
  };

  const handleSubmit = async () => {
    if (!selectedUser || !selectedPlan) {
      showToast('Please select a user and a plan'); return;
    }
    setSubmitting(true);
    try {
      const months  = parseInt(durationMonths);
      const start   = new Date();
      const end     = new Date();
      end.setMonth(end.getMonth() + months);
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          action:        'create',
          user_id:       selectedUser.id,
          user_type:     selectedUser.role,
          plan_name:     selectedPlan,
          starts_at:     start.toISOString(),
          ends_at:       end.toISOString(),
          status:        'active',
        }),
      });
      const d = await res.json();
      if ((d.data ?? d)?.success === false) throw new Error((d.data ?? d)?.error || 'Failed');
      showToast(`Subscription created for ${selectedUser.name}`);
      onSuccess(); onClose();
    } catch (e: any) { showToast(e.message || 'Failed to create subscription'); }
    finally { setSubmitting(false); }
  };

  const BG2L = '#131720', BG3L = '#181E2A', BG4L = '#1C2338';
  const inp = { width: '100%', background: BG4L, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, padding: '9px 12px', color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: BG2L, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, width: 480 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1, color: '#F5F5F5' }}>GRANT FREE SUBSCRIPTION</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ padding: '10px 12px', background: 'rgba(212,166,74,0.08)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 7, marginBottom: 14, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
          ⚠️ This grants complimentary access to a user without charging them. No payment record will be created.
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Search User / Agency</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchUsers()}
              placeholder="Name or email…" style={{ ...inp, flex: 1 }} />
            <button onClick={searchUsers} disabled={searching}
              style={{ padding: '9px 16px', background: '#EF4444', border: 'none', borderRadius: 7, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
              {searching ? '…' : 'Search'}
            </button>
          </div>
          {userResults.length > 0 && !selectedUser && (
            <div style={{ marginTop: 6, background: BG4L, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, overflow: 'hidden' }}>
              {userResults.map((u: any) => (
                <div key={u.id} onClick={() => { setSelectedUser(u); setUserResults([]); }}
                  style={{ padding: '9px 12px', cursor: 'pointer', fontSize: 14, color: '#F5F5F5', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontWeight: 600 }}>{u.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 8 }}>{u.email}</span>
                  <span style={{ marginLeft: 8, fontSize: 13, color: u.role === 'aspirant' ? '#8B5CF6' : '#3B82F6' }}>{u.role}</span>
                </div>
              ))}
            </div>
          )}
          {selectedUser && (
            <div style={{ marginTop: 6, padding: '9px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: '#F5F5F5' }}><strong>{selectedUser.name}</strong> — {selectedUser.email}</span>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
          )}
        </div>

        {/* Step 2: Plan */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Subscription Plan</label>
          <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)} style={{ ...inp }}>
            <option value="">Select Plan</option>
            {planOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Step 3: Duration */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Duration</label>
          <select value={durationMonths} onChange={e => setDurationMonths(e.target.value)} style={{ ...inp }}>
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">1 Year</option>
            <option value="24">2 Years</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, background: BG3L, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting || !selectedUser || !selectedPlan}
            style={{ flex: 2, padding: 11, background: (!selectedUser || !selectedPlan) ? 'rgba(239,68,68,0.4)' : '#EF4444', border: 'none', borderRadius: 7, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1, cursor: (!selectedUser || !selectedPlan) ? 'not-allowed' : 'pointer' }}>
            {submitting ? 'Creating…' : 'Create Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   RENEWAL SETTINGS MODAL — reads & saves platform settings
══════════════════════════════════════════════════════════════ */
function RenewalSettingsModal({ onClose, getToken, showToast }: {
  onClose: () => void; getToken: () => string; showToast: (m: string) => void;
}) {
  // Load persisted settings from localStorage on mount
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('ss_renewal_settings') || '{}') } catch { return {} }
  })();
  const [autoRenewal,  setAutoRenewal]  = useState(saved.auto_renewal  || 'Enabled');
  const [reminderDays, setReminderDays] = useState(saved.reminder_days || '7 Days');
  const [gracePeriod,  setGracePeriod]  = useState(saved.grace_period  || '3 Days');
  const [saving,       setSaving]       = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const settings = { auto_renewal: autoRenewal, reminder_days: reminderDays, grace_period: gracePeriod };
    // Persist to localStorage immediately — survives page refresh
    localStorage.setItem('ss_renewal_settings', JSON.stringify(settings));
    try {
      await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ action: 'save_renewal_settings', settings }),
      });
    } catch { /* DB table may not exist yet — localStorage already saved */ }
    finally { setSaving(false); }
    showToast('Renewal settings saved successfully');
    onClose();
  };

  const BG2L = '#131720', BG3L = '#181E2A', BG4L = '#1C2338';
  const sel = { appearance: 'none' as const, width: '100%', background: BG4L, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, padding: '9px 12px', color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, outline: 'none' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: BG2L, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, width: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1, color: '#F5F5F5' }}>RENEWAL SETTINGS</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        {[
          { l: 'Auto Renewal',              val: autoRenewal,  set: setAutoRenewal,  opts: ['Enabled', 'Disabled'] },
          { l: 'Send Reminder Before',      val: reminderDays, set: setReminderDays, opts: ['3 Days', '7 Days', '14 Days', '30 Days'] },
          { l: 'Grace Period After Expiry', val: gracePeriod,  set: setGracePeriod,  opts: ['No Grace Period', '3 Days', '7 Days', '14 Days'] },
        ].map(f => (
          <div key={f.l} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{f.l}</label>
            <select value={f.val} onChange={e => f.set(e.target.value)} style={sel}>
              {f.opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 7, marginBottom: 16, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
          <strong style={{ color: '#F5F5F5' }}>Auto Renewal {autoRenewal}</strong> — reminders sent <strong style={{ color: '#F5F5F5' }}>{reminderDays}</strong> before expiry, with a grace period of <strong style={{ color: '#F5F5F5' }}>{gracePeriod}</strong>.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, background: BG3L, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 2, padding: 11, background: '#EF4444', border: 'none', borderRadius: 7, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1, cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAYMENT HISTORY MODAL — fetches real payment_transactions
══════════════════════════════════════════════════════════════ */
function PaymentHistoryModal({ onClose, getToken }: {
  onClose: () => void; getToken: () => string;
}) {
  const [txns,    setTxns]    = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    (async () => {
      try {
        // Try payment_transactions table first
        const { createClient } = await import('@supabase/supabase-js');
        // Fall back to fetching from subscriptions with active status
        const res = await fetch('/api/admin/subscriptions?type=table&per_page=50&status=active', {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const d = await res.json();
        setTxns((d.data ?? d)?.subscriptions ?? []);
      } catch { setError('Could not load payment history.'); }
      finally { setLoading(false); }
    })();
  }, []);

  const GREEN = '#22C55E', RED = '#EF4444', ORANGE = '#F97316', PURPLE = '#8B5CF6', BLUE = '#3B82F6';
  const STATUS_COLOR: Record<string, string> = { Active: GREEN, 'Pending Payment': ORANGE, Expired: RED, Cancelled: PURPLE };
  const STATUS_BG: Record<string, string>    = { Active: 'rgba(34,197,94,0.12)', 'Pending Payment': 'rgba(249,115,22,0.12)', Expired: 'rgba(239,68,68,0.12)', Cancelled: 'rgba(139,92,246,0.12)' };
  const avatarC = (name: string) => [PURPLE, BLUE, GREEN, ORANGE][((name || '').charCodeAt(0) || 0) % 4];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, width: 580, maxHeight: '82vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1, color: '#F5F5F5' }}>PAYMENT HISTORY</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        {loading && (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'rgba(255,255,255,0.35)' }}>
            <Loader2 size={22} color="rgba(255,255,255,0.3)" style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
            <div style={{ fontSize: 14 }}>Loading payment history…</div>
          </div>
        )}
        {!loading && error && <div style={{ padding: '24px 0', textAlign: 'center', color: RED, fontSize: 14 }}>{error}</div>}
        {!loading && !error && txns.length === 0 && (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>No payment records found.</div>
        )}
        {!loading && !error && txns.map((s: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${avatarC(s.name)}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: avatarC(s.name), flexShrink: 0 }}>{s.initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F5' }}>{s.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{s.plan} · {s.start} · {s.payment}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: GREEN }}>{s.amountStr}</div>
              <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: STATUS_BG[s.status] || 'rgba(255,255,255,0.08)', color: STATUS_COLOR[s.status] || '#F5F5F5' }}>{s.status}</span>
            </div>
          </div>
        ))}
        <button onClick={onClose} style={{ width: '100%', marginTop: 16, padding: 11, background: '#181E2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   EDIT SUBSCRIPTION MODAL
══════════════════════════════════════════════════════════════ */
function EditSubModal({ sub, onClose, onSave, getToken, showToast, planOptions }: {
  sub: Sub; onClose: () => void;
  onSave: (id: string, patch: any) => void;
  getToken: () => string; showToast: (m: string) => void;
  planOptions: string[];
}) {
  const [status,   setStatus]   = useState(sub.status);
  const [plan,     setPlan]     = useState(sub.plan);
  const [endDate,  setEndDate]  = useState(sub.renewal || '');
  const [notes,    setNotes]    = useState('');
  const [saving,   setSaving]   = useState(false);

  const STATUS_OPTS = ['Active', 'Pending Payment', 'Expiring Soon', 'Expired', 'Cancelled'];
  const BG2L = '#131720', BG3L = '#181E2A', BG4L = '#1C2338';
  const inp: React.CSSProperties = { width: '100%', background: BG4L, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, padding: '9px 12px', color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, outline: 'none', boxSizing: 'border-box' as const };
  const sel: React.CSSProperties = { ...inp, appearance: 'none' as const, cursor: 'pointer' };

  const STATUS_TO_DB: Record<string,string> = {
    'Active': 'active', 'Pending Payment': 'pending_payment',
    'Expiring Soon': 'expiring_soon', 'Expired': 'expired', 'Cancelled': 'cancelled',
  };
  const GREEN = '#22C55E', RED = '#EF4444', GOLD = '#D4A64A', BLUE = '#3B82F6';

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

      // 1. Update status if changed
      if (STATUS_TO_DB[status] !== STATUS_TO_DB[sub.status]) {
        await fetch('/api/admin/subscriptions', {
          method: 'POST', headers,
          body: JSON.stringify({ ids: [sub.id], action: 'update_status', status: STATUS_TO_DB[status] }),
        });
      }

      // 2. Update end date if changed (via extend action with exact date)
      if (endDate && endDate !== sub.renewal) {
        await fetch('/api/admin/subscriptions', {
          method: 'POST', headers,
          body: JSON.stringify({ ids: [sub.id], action: 'set_end_date', ends_at: new Date(endDate).toISOString() }),
        });
      }

      // 3. Update plan if changed
      if (plan !== sub.plan) {
        await fetch('/api/admin/subscriptions', {
          method: 'POST', headers,
          body: JSON.stringify({ ids: [sub.id], action: 'update_plan', plan_name: plan }),
        });
      }

      onSave(sub.id, { display: { status, plan, renewal: endDate } });
    } catch (e: any) {
      showToast(e.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: BG2L, border: `1px solid ${GOLD}33`, borderRadius: 14, width: '100%', maxWidth: 500 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1, color: '#F5F5F5' }}>EDIT SUBSCRIPTION</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{sub.name} · {sub.email}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Current info strip */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {[
              { label: sub.plan,     bg: 'rgba(212,166,74,0.12)', color: GOLD  },
              { label: sub.userType, bg: sub.userType==='Aspirant'?'rgba(139,92,246,0.12)':'rgba(59,130,246,0.12)', color: sub.userType==='Aspirant'?'#8B5CF6':'#3B82F6' },
              { label: sub.cycle,    bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' },
              { label: sub.amountStr,bg: 'rgba(34,197,94,0.12)',  color: GREEN },
            ].map(b => (
              <span key={b.label} style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 5, background: b.bg, color: b.color }}>{b.label}</span>
            ))}
          </div>

          {/* Status */}
          <div>
            <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={sel}>
              {STATUS_OPTS.map(o => <option key={o} style={{ background: BG4L }}>{o}</option>)}
            </select>
          </div>

          {/* Plan */}
          <div>
            <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Subscription Plan</label>
            <select value={plan} onChange={e => setPlan(e.target.value)} style={sel}>
              {planOptions.map(p => <option key={p} style={{ background: BG4L }}>{p}</option>)}
            </select>
          </div>

          {/* End / Renewal Date */}
          <div>
            <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
              Renewal / Expiry Date
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>Current: {sub.renewal}</span>
            </label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ ...inp, colorScheme: 'dark' }} />
          </div>

          {/* Admin Notes */}
          <div>
            <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Admin Notes (internal only)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} maxLength={300}
              placeholder="Optional — reason for change, reference, etc."
              style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.6 }} />
          </div>

          {/* Warning if cancelling */}
          {status === 'Cancelled' && (
            <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
              ⚠️ Cancelling will send a notification to the user and hide their profile from search.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, background: BG3L, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ flex: 2, padding: 11, background: saving ? 'rgba(212,166,74,0.4)' : GOLD, border: 'none', borderRadius: 7, color: '#000', fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 1, cursor: saving ? 'wait' : 'pointer', fontWeight: 700 }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionManagementPage() {
  const router = useRouter();

  /* ── UI ── */
  const [profileOpen, setProfileOpen]     = useState(false);
  const [showBulk, setShowBulk]           = useState(false);
  const [showExport, setShowExport]       = useState(false);
  const [showAddSub, setShowAddSub]       = useState(false);
  const [showManagePlans, setShowManagePlans] = useState(false);
  const [showPayHistory, setShowPayHistory]   = useState(false);
  const [showRenewal, setShowRenewal]     = useState(false);
  const [viewSub, setViewSub]             = useState<Sub | null>(null);
  const [editSub, setEditSub]             = useState<Sub | null>(null);
  const [menuId, setMenuId]               = useState('');
  const [menuPos, setMenuPos]             = useState({ top: 0, right: 0 });
  const [toast, setToast]                 = useState('');
  const [selected, setSelected]           = useState<string[]>([]);
  const [exportFormat, setExportFormat]   = useState('Excel Spreadsheet');
  const [exportInclude, setExportInclude] = useState('All Subscriptions');
  const [exportDate, setExportDate]       = useState('Last 30 Days');

  /* ── Filters ── */
  const [search, setSearch]       = useState('');
  const [userType, setUserType]   = useState('All User Types');
  const [plan, setPlan]           = useState('All Plans');
  const [status, setStatus]       = useState('All Statuses');
  const [cycle, setCycle]         = useState('All Durations');
  const [payMethod, setPayMethod] = useState('All Methods');
  const [department, setDepartment] = useState('All Departments');
  const [agencyType, setAgencyType] = useState('All Types');
  const [sortBy, setSortBy]       = useState('Newest First');
  const [page, setPage]           = useState(1);

  /* ── Data ── */
  const [subs, setSubs]                   = useState<Sub[]>([]);
  const [totalCount, setTotalCount]       = useState(0);
  const [totalPages, setTotalPages]       = useState(1);
  const [stats, setStats]                 = useState<Stats | null>(null);
  const [planBreakdown, setPlanBreakdown] = useState<Record<string, number>>({});
  const [revenue, setRevenue]             = useState<Revenue | null>(null);
  const [loading, setLoading]             = useState(true);
  const [statsLoading, setStatsLoading]   = useState(true);
  const [error, setError]                 = useState('');
  const [actionLoading, setActionLoading] = useState(false);


  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  function getToken() {
    try { return JSON.parse(localStorage.getItem('ss_user') || '{}')?.token || ''; }
    catch { return ''; }
  }

  /* ── Fetch stats (right panel + stat cards) ── */
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/admin/subscriptions?type=stats', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      const payload = json.data ?? json;
      setStats(payload.stats ?? null);
      setPlanBreakdown(payload.plan_breakdown ?? {});
      setRevenue(payload.revenue ?? null);
    } catch (e) { console.error('[stats]', e); }
    finally { setStatsLoading(false); }
  }, []);

  /* ── Fetch table rows ── */
  const fetchSubs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const p = new URLSearchParams();
      p.set('type', 'table');
      p.set('page', String(page));
      p.set('per_page', String(PER_PAGE));
      p.set('sort', SORT_MAP[sortBy] || 'newest');
      if (search)                          p.set('search', search);
      if (userType !== 'All User Types')   p.set('user_type', userType);
      if (plan !== 'All Plans')            p.set('plan', plan);
      if (status !== 'All Statuses')       p.set('status', STATUS_TO_DB[status] || status);
      if (cycle !== 'All Durations')       p.set('cycle', cycle);
      if (payMethod !== 'All Methods')     p.set('payment_method', payMethod);
      if (department !== 'All Departments') p.set('department', department);
      if (agencyType !== 'All Types')      p.set('agency_type', agencyType);

      const res = await fetch(`/api/admin/subscriptions?${p.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      const payload = json.data ?? json;
      setSubs(payload.subscriptions ?? []);
      setTotalCount(payload.total ?? 0);
      setTotalPages(payload.total_pages ?? 1);
    } catch (e) {
      console.error('[subs]', e);
      setError('Failed to load subscriptions. Please try again.');
    } finally { setLoading(false); }
  }, [page, search, userType, plan, status, cycle, payMethod, department, agencyType, sortBy]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchSubs(); },  [fetchSubs]);

  /* ── API action (cancel / extend_30 / send_reminder) ── */
  const doAction = useCallback(async (ids: string[], action: string) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ ids, action }),
      });
      const json = await res.json();
      showToast((json.data ?? json)?.message || 'Action completed');
      setSelected([]);
      fetchSubs();
      fetchStats();
    } catch { showToast('Action failed. Please try again.'); }
    finally { setActionLoading(false); }
  }, [fetchSubs, fetchStats]);

  const handleBulkAction = (label: string) => {
    if (selected.length === 0) { showToast('Select at least one subscription first'); setShowBulk(false); return; }
    const map: Record<string, string> = {
      'Send Renewal Reminder': 'send_reminder',
      'Cancel Subscriptions':  'cancel',
      'Extend by 30 Days':     'extend_30',
    };
    if (map[label]) doAction(selected, map[label]);
    else showToast(`${label} applied to ${selected.length} subscription(s)`);
    setShowBulk(false);
  };

  /* ── Selection ── */
  const allSel   = subs.length > 0 && subs.every(s => selected.includes(s.id));
  const toggleSel = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(
    allSel ? selected.filter(id => !subs.find(s => s.id === id))
           : [...new Set([...selected, ...subs.map(s => s.id)])]
  );

  const clearFilters = () => {
    setSearch(''); setUserType('All User Types'); setPlan('All Plans');
    setStatus('All Statuses'); setCycle('All Durations');
    setPayMethod('All Methods'); setDepartment('All Departments');
    setAgencyType('All Types'); setPage(1);
  };

  /* ── Derived display data (all from API, nothing hardcoded) ── */
  const planData = Object.entries(planBreakdown).map(([label, value]) => ({
    label, value,
    pct:   stats?.total ? parseFloat(((value / stats.total) * 100).toFixed(1)) : 0,
    color: PLAN_COLORS[label] || TEAL,
  }));

  const summary = stats ? [
    { label: 'Active',          value: stats.active,                  pct: stats.total ? ((stats.active                  / stats.total) * 100).toFixed(1) + '%' : '0%', color: GREEN  },
    { label: 'Pending Payment', value: stats.pending_payment ?? 0,    pct: stats.total ? (((stats.pending_payment ?? 0)  / stats.total) * 100).toFixed(1) + '%' : '0%', color: ORANGE },
    { label: 'Expiring Soon',   value: stats.expiring,                pct: stats.total ? ((stats.expiring                / stats.total) * 100).toFixed(1) + '%' : '0%', color: GOLD   },
    { label: 'Expired',         value: stats.expired,                 pct: stats.total ? ((stats.expired                 / stats.total) * 100).toFixed(1) + '%' : '0%', color: RED    },
    { label: 'Cancelled',       value: stats.cancelled,               pct: stats.total ? ((stats.cancelled               / stats.total) * 100).toFixed(1) + '%' : '0%', color: PURPLE },
  ] : [];

  const statCards = stats ? [
    { label: 'Total Subscriptions',       value: stats.total.toLocaleString(),                color: PURPLE, Icon: CreditCard },
    { label: 'Active',                    value: stats.active.toLocaleString(),               color: GREEN,  Icon: Check      },
    { label: 'Pending Payment',           value: (stats.pending_payment ?? 0).toLocaleString(), color: ORANGE, Icon: Clock    },
    { label: 'Expired / Cancelled',       value: (stats.expired + stats.cancelled).toLocaleString(), color: RED, Icon: XCircle },
    { label: 'Monthly Recurring Revenue', value: '₹' + stats.mrr.toLocaleString('en-IN'),    color: TEAL,   Icon: Wallet     },
  ] : [];

  /* ────────────────────────────────────── RENDER ─────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOP NAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <span style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 2, color: '#F5F5F5' }}>SILVER<span style={{ color: RED }}>SCREENS</span></span>
        <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN PANEL</span>
        </div>
        <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
          <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input placeholder="Search users, agencies, plans, transactions…"
            style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 40px 8px 34px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'rgba(255,255,255,0.25)', background: BG4, borderRadius: 4, padding: '1px 6px', border: '1px solid rgba(255,255,255,0.1)' }}>⌘K</span>
        </div>
        <div style={{ flex: 1 }} />
        <div onClick={() => router.push('/admin/notifications')} style={{ cursor: 'pointer', width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={15} color="rgba(255,255,255,0.7)" />
        </div>
        <div onClick={() => router.push('/admin/help-support')} style={{ cursor: 'pointer', width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Info size={15} color="rgba(255,255,255,0.7)" />
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: BG3, border: '2px solid rgba(212,166,74,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: BEBAS, fontSize: 16, color: GOLD }}>SA</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Super Admin</div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 210, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{label}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <AdminSidebar />

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                <span style={{ cursor: 'pointer' }} onClick={() => router.push('/admin/dashboard')}>Home</span>
                <ChevronRight size={12} />
                <span style={{ color: '#F5F5F5' }}>Subscription Management</span>
              </div>
              <h1 style={{ fontFamily: BARLOW, fontSize: 28, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                Subscription Management
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: RED, display: 'inline-block', marginBottom: 2 }} />
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>Manage subscriptions, renewals, payments and billing for all platform users and agencies.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 28, flexShrink: 0 }}>
              <button onClick={() => setShowExport(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <Download size={14} /> Export
              </button>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setShowBulk(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', background: selected.length > 0 ? RED : BG3, border: `1px solid ${selected.length > 0 ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                  {actionLoading && <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />}
                  Bulk Actions{selected.length > 0 ? ` (${selected.length})` : ''}<ChevronDown size={12} />
                </button>
                {showBulk && (
                  <>
                    <div onClick={() => setShowBulk(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
                    <div style={{ position: 'absolute', top: 42, right: 0, width: 220, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                      {['Send Renewal Reminder', 'Cancel Subscriptions', 'Extend by 30 Days'].map(a => (
                        <div key={a} onClick={() => handleBulkAction(a)}
                          style={{ padding: '10px 15px', fontSize: 14, cursor: 'pointer', color: a.includes('Cancel') ? RED : '#F5F5F5' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >{a}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button onClick={() => setShowAddSub(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: RED, border: 'none', borderRadius: 8, color: '#fff', fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>
                <Plus size={15} /> Add Subscription
              </button>
            </div>
          </div>

          {/* ── STAT CARDS (from API) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
            {statsLoading
              ? Array.from({ length: 5 }, (_, i) => (
                  <div key={i} style={{ borderRadius: 12, padding: 16, background: BG3, border: '1px solid rgba(255,255,255,0.06)', height: 88 }} />
                ))
              : statCards.map((s, i) => (
                  <div key={i} style={{ borderRadius: 12, padding: 16, background: BG3, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <s.Icon size={20} color={s.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontFamily: BEBAS, fontSize: s.value.startsWith('₹') ? 22 : 30, letterSpacing: 1, lineHeight: 1 }}>{s.value}</div>
                    </div>
                  </div>
                ))
            }
          </div>

          {/* ── FILTERS ── */}
          <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '18px 20px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Filters</div>

            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 14 }}>
              {/* Search */}
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Search</span>
                <div style={{ position: 'relative' }}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Name, email, ID…"
                    style={{ width: '100%', background: BG4, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, padding: '8px 10px 8px 30px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, height: 38 }} />
                </div>
              </div>
              {/* User Type */}
              {[
                { label: 'User Type',          val: userType,   set: setUserType,   opts: USER_TYPES  },
                { label: 'Subscription Plan',  val: plan,       set: setPlan,       opts: ALL_PLANS   },
                { label: 'Status',             val: status,     set: setStatus,     opts: ALL_STATUS  },
                { label: 'Duration',           val: cycle,      set: setCycle,      opts: BILL_CYCLE  },
              ].map(({ label, val, set, opts }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                  <div style={{ position: 'relative' }}>
                    <select value={val} onChange={e => { set(e.target.value); setPage(1); }}
                      style={{ appearance: 'none', width: '100%', height: 38, padding: '0 28px 0 10px', background: BG4, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, color: 'rgba(255,255,255,0.75)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 16 }}>
              {[
                { label: 'Department (Aspirant)', val: department, set: setDepartment, opts: DEPARTMENTS  },
                { label: 'Agency Type',           val: agencyType, set: setAgencyType, opts: AGENCY_TYPES },
                { label: 'Payment Method',        val: payMethod,  set: setPayMethod,  opts: PAY_METHODS  },
                { label: 'Sort By',               val: sortBy,     set: setSortBy,     opts: SORT_OPTS    },
              ].map(({ label, val, set, opts }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                  <div style={{ position: 'relative' }}>
                    <select value={val} onChange={e => { set(e.target.value); setPage(1); }}
                      style={{ appearance: 'none', width: '100%', height: 38, padding: '0 28px 0 10px', background: BG4, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, color: 'rgba(255,255,255,0.75)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={clearFilters}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                <X size={13} /> Clear Filters
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                  {loading ? 'Loading…' : `${totalCount.toLocaleString()} subscription${totalCount !== 1 ? 's' : ''} found`}
                </span>
                <button onClick={() => fetchSubs()}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 22px', background: RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>
                  <Filter size={13} /> Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* ── TABLE + RIGHT PANEL ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14, minWidth: 0 }}>

            {/* Table */}
            <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', minWidth: 0 }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>
                  Subscriptions
                  <span style={{ marginLeft: 8, background: 'rgba(239,68,68,0.15)', color: RED, border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '2px 9px' }}>
                    {loading ? '…' : totalCount.toLocaleString()}
                  </span>
                </span>
                {loading && <Loader2 size={15} color="rgba(255,255,255,0.4)" style={{ animation: 'spin 1s linear infinite' }} />}
              </div>

              {/* Column headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '36px 2fr 0.9fr 1.3fr 0.9fr 0.9fr 0.8fr 0.9fr 1fr 1fr 1.1fr 60px', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', gap: 6 }}>
                <div onClick={toggleAll} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {allSel ? <CheckSquare size={15} color={RED} /> : <Square size={15} color="rgba(255,255,255,0.3)" />}
                </div>
                {['User / Agency', 'User Type', 'Department / Role', 'Plan', 'Duration', 'Amount', 'Status', 'Start Date', 'Next Renewal', 'Payment Method', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.3, lineHeight: 1.3 }}>{h}</div>
                ))}
              </div>

              {/* Skeleton */}
              {loading && Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)}

              {/* Error */}
              {!loading && error && (
                <div style={{ padding: '36px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <AlertCircle size={28} color={RED} opacity={0.6} />
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>{error}</div>
                  <button onClick={() => fetchSubs()} style={{ padding: '8px 18px', background: RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Retry</button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && subs.length === 0 && (
                <div style={{ padding: '36px 18px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>
                  No subscriptions match your filters.{' '}
                  <span style={{ color: RED, cursor: 'pointer' }} onClick={clearFilters}>Clear filters</span>
                </div>
              )}

              {/* Data rows */}
              {!loading && !error && subs.map((s, i) => {
                const isSel = selected.includes(s.id);
                const ac    = avatarColor(s.name);
                return (
                  <div key={s.id}
                    style={{ display: 'grid', gridTemplateColumns: '36px 2fr 0.9fr 1.3fr 0.9fr 0.9fr 0.8fr 0.9fr 1fr 1fr 1.1fr 60px', padding: '10px 14px', borderBottom: i < subs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', gap: 6, background: isSel ? 'rgba(239,68,68,0.05)' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isSel ? 'rgba(239,68,68,0.05)' : 'transparent'; }}
                  >
                    {/* Checkbox */}
                    <div onClick={() => toggleSel(s.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {isSel ? <CheckSquare size={15} color={RED} /> : <Square size={15} color="rgba(255,255,255,0.25)" />}
                    </div>

                    {/* ID + user */}
                    <div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${ac}22`, border: `1px solid ${ac}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: ac, flexShrink: 0 }}>{s.initials}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email}</div>
                        </div>
                      </div>
                    </div>

                    {/* User type */}
                    <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: USER_BG[s.userType] || 'rgba(255,255,255,0.08)', color: USER_COLOR[s.userType] || '#F5F5F5', whiteSpace: 'nowrap' as const, display: 'inline-block' }}>{s.userType}</span>

                    {/* Dept / role */}
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                      {s.userType === 'Aspirant' && s.department ? s.department : s.agencyType || s.userType}
                    </div>

                    {/* Plan */}
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.plan}</div>

                    {/* Cycle */}
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{s.cycle}</div>

                    {/* Amount */}
                    <div style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>{s.amountStr}</div>

                    {/* Status */}
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: STATUS_BG[s.status] || 'rgba(255,255,255,0.08)', color: STATUS_COLOR[s.status] || '#F5F5F5', whiteSpace: 'nowrap' as const, display: 'inline-block' }}>{s.status}</span>

                    {/* Start */}
                    <div>
                      <div style={{ fontSize: 13 }}>{s.start}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.startTime}</div>
                    </div>

                    {/* Renewal */}
                    <div>
                      <div style={{ fontSize: 13 }}>{s.renewal}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.renewalTime}</div>
                    </div>

                    {/* Payment */}
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                      {s.payment === 'UPI'
                        ? <span style={{ fontSize: 12, fontWeight: 800, color: PURPLE, background: 'rgba(139,92,246,0.15)', borderRadius: 4, padding: '1px 5px', border: '1px solid rgba(139,92,246,0.25)' }}>UPI</span>
                        : <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, display: 'block' }}>{s.payment}</span>
                      }
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button onClick={() => setViewSub(s)} title="View Details"
                        style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Eye size={12} color={BLUE} />
                      </button>
                      <button onClick={() => setEditSub(s)} title="Edit Subscription"
                        style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(212,166,74,0.12)', border: '1px solid rgba(212,166,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Edit2 size={12} color={GOLD} />
                      </button>
                      <button title="More options"
                        onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right }); setMenuId(menuId === s.id ? '' : s.id); }}
                        style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <MoreVertical size={12} color="rgba(255,255,255,0.5)" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {!loading && !error && subs.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                    Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, totalCount)} of {totalCount.toLocaleString()} entries
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      style={{ width: 30, height: 30, borderRadius: 6, background: BG4, border: '1px solid rgba(255,255,255,0.08)', color: page === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>‹</button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pg = i + 1;
                      return (
                        <button key={pg} onClick={() => setPage(pg)}
                          style={{ width: 30, height: 30, borderRadius: 6, background: page === pg ? RED : BG4, border: `1px solid ${page === pg ? RED : 'rgba(255,255,255,0.08)'}`, color: '#F5F5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: page === pg ? 700 : 400 }}>{pg}</button>
                      );
                    })}
                    {totalPages > 5 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>…{totalPages}</span>}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      style={{ width: 30, height: 30, borderRadius: 6, background: BG4, border: '1px solid rgba(255,255,255,0.08)', color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === totalPages ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>›</button>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT PANEL (all from API) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Subscription Summary */}
              <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Subscription Summary</div>
                {statsLoading
                  ? Array.from({ length: 4 }, (_, i) => <div key={i} style={{ height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.05)', marginBottom: 9 }} />)
                  : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {summary.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{s.label}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{s.value.toLocaleString()}</span>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 5 }}>({s.pct})</span>
                          </div>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 9, display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
                        <span style={{ fontSize: 15, fontWeight: 800 }}>{stats?.total.toLocaleString() ?? '—'}</span>
                      </div>
                    </div>
                  )
                }
              </div>

              {/* Subscriptions by Plan */}
              <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Subscriptions by Plan</div>
                {statsLoading
                  ? <div style={{ height: 148, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={24} color="rgba(255,255,255,0.2)" style={{ animation: 'spin 1s linear infinite' }} /></div>
                  : planData.length > 0
                    ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                        <DonutChart data={planData} total={(stats?.total ?? 0).toLocaleString()} />
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>
                          {planData.map(d => (
                            <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{d.label}</span>
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 700 }}>{d.pct}% <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>({d.value})</span></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                    : <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', padding: '20px 0', textAlign: 'center' }}>No subscription data yet</div>
                }
              </div>

              {/* Revenue Overview */}
              <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Revenue Overview (MTD)</div>
                {statsLoading
                  ? Array.from({ length: 3 }, (_, i) => <div key={i} style={{ height: 64, borderRadius: 8, background: 'rgba(255,255,255,0.04)', marginBottom: 10 }} />)
                  : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Total Revenue',           value: '₹' + (revenue?.total_revenue ?? 0).toLocaleString('en-IN'), color: GREEN  },
                        { label: 'Successful Transactions', value: (revenue?.successful_tx ?? 0).toLocaleString(),               color: BLUE   },
                        { label: 'Avg. Transaction Value',  value: '₹' + (revenue?.avg_tx ?? 0).toLocaleString('en-IN'),         color: GOLD   },
                      ].map((r, i) => (
                        <div key={i} style={{ padding: 10, background: BG4, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{r.label}</div>
                          <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, lineHeight: 1 }}>{r.value}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                            <TrendingUp size={11} color={r.color} />
                            <span style={{ fontSize: 13, color: r.color, fontWeight: 700 }}>Live from database</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>

              {/* Quick Actions */}
              <div style={{ borderRadius: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Quick Actions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { icon: Plus,      label: 'Grant Free Sub',    color: ORANGE, action: () => setShowAddSub(true)                                  },
                    { icon: Edit2,     label: 'Manage Plans',      color: BLUE,   action: () => setShowManagePlans(true)                             },
                    { icon: Download,  label: 'Export Report',     color: PURPLE, action: () => router.push('/admin/analytics/subscription-report')  },
                    { icon: RotateCcw, label: 'Renewal Settings',  color: GREEN,  action: () => setShowRenewal(true)                                 },
                  ].map(({ icon: Icon, label, color, action }) => (
                    <button key={label} onClick={action}
                      style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 7, padding: '12px 8px', background: BG4, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, cursor: 'pointer', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14 }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = BG4)}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={15} color={color} />
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

      {/* ── CONTEXT MENU ── */}
      {menuId && (
        <>
          <div onClick={() => setMenuId('')} style={{ position: 'fixed', inset: 0, zIndex: 300 }} />
          <div style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, width: 220, background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, overflow: 'hidden', zIndex: 400, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
            {[
              { label: 'View Details',          color: '#F5F5F5', action: () => { const s = subs.find(x => x.id === menuId); if (s) setViewSub(s); setMenuId(''); } },
              { label: 'Send Renewal Reminder', color: BLUE,      action: () => doAction([menuId], 'send_reminder') },
              { label: 'Extend by 30 Days',     color: GREEN,     action: () => doAction([menuId], 'extend_30')     },
              { label: 'Cancel Subscription',   color: RED,       action: () => doAction([menuId], 'cancel')        },
              { label: 'View User Profile',     color: PURPLE,    action: () => { const s = subs.find(x => x.id === menuId); if (s?.userId) router.push(`/admin/users?highlight=${s.userId}`); setMenuId(''); } },
            ].map(({ label, color, action }) => (
              <div key={label} onClick={action}
                style={{ padding: '10px 15px', fontSize: 14, cursor: 'pointer', color }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >{label}</div>
            ))}
          </div>
        </>
      )}

      {/* ── VIEW SUBSCRIPTION MODAL ── */}
      {viewSub && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1 }}>SUBSCRIPTION DETAILS</div>

              </div>
              <button onClick={() => setViewSub(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 11px', borderRadius: 5, background: STATUS_BG[viewSub.status] || 'rgba(255,255,255,0.08)', color: STATUS_COLOR[viewSub.status] || '#F5F5F5' }}>{viewSub.status}</span>
                <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 11px', borderRadius: 5, background: 'rgba(212,166,74,0.12)', color: GOLD, border: '1px solid rgba(212,166,74,0.25)' }}>{viewSub.plan}</span>
                <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 11px', borderRadius: 5, background: USER_BG[viewSub.userType] || 'rgba(255,255,255,0.08)', color: USER_COLOR[viewSub.userType] || '#F5F5F5' }}>{viewSub.userType}</span>
              </div>
              <div style={{ background: BG3, borderRadius: 10, padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${avatarColor(viewSub.name)}22`, border: `1px solid ${avatarColor(viewSub.name)}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: avatarColor(viewSub.name), flexShrink: 0 }}>{viewSub.initials}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{viewSub.name}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{viewSub.email}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{viewSub.profileNumber}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{viewSub.userType === 'Aspirant' && viewSub.department ? viewSub.department : viewSub.agencyType || '—'}</div>
                </div>
              </div>
              {[

                { label: 'Plan',            value: `${viewSub.plan} — ${viewSub.cycle}` },
                { label: 'Amount',          value: viewSub.amountStr   },
                { label: 'Payment Method',  value: viewSub.payment     },
                { label: 'Start Date',      value: `${viewSub.start} ${viewSub.startTime}` },
                { label: 'Next Renewal',    value: `${viewSub.renewal} ${viewSub.renewalTime}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                  <span style={{ fontSize: 15, color: label === 'Amount' ? GREEN : '#F5F5F5', fontWeight: label === 'Amount' ? 700 : 500, wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 4 }}>
                <button onClick={() => { doAction([viewSub.id], 'send_reminder'); setViewSub(null); }}
                  style={{ padding: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8, color: BLUE, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Bell size={14} /> Remind
                </button>
                <button onClick={() => { doAction([viewSub.id], 'extend_30'); setViewSub(null); }}
                  style={{ padding: 10, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, color: GREEN, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Calendar size={14} /> Extend
                </button>
                <button onClick={() => { doAction([viewSub.id], 'cancel'); setViewSub(null); }}
                  style={{ padding: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: RED, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <XCircle size={14} /> Cancel
                </button>
              </div>
              <button onClick={() => { router.push(`/admin/users?highlight=${viewSub.userId}`); setViewSub(null); }}
                style={{ padding: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: PURPLE, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Users size={14} /> View Full User Profile
              </button>
              <button onClick={() => setViewSub(null)} style={{ padding: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT SUBSCRIPTION MODAL ── */}
      {editSub && <EditSubModal sub={editSub} onClose={() => setEditSub(null)} onSave={(id, patch) => {
        setSubs(prev => prev.map(s => s.id === id ? { ...s, ...patch.display } : s));
        setEditSub(null);
        showToast('Subscription updated successfully');
      }} getToken={getToken} showToast={showToast} planOptions={Object.keys(planBreakdown).length > 0 ? Object.keys(planBreakdown) : ['GROWTH', 'STAR', 'ICON']} />}
      {showAddSub && (
        <AddSubscriptionModal
          onClose={() => setShowAddSub(false)}
          onSuccess={() => { fetchSubs(); fetchStats(); }}
          getToken={getToken}
          showToast={showToast}
          planOptions={Object.keys(planBreakdown).length > 0 ? Object.keys(planBreakdown) : ['GROWTH', 'STAR', 'ICON']}
        />
      )}

      {showManagePlans && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, width: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1 }}>MANAGE PLANS</div>
              <button onClick={() => setShowManagePlans(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: 14, background: BG3, borderRadius: 8, marginBottom: 16, fontSize: 14, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5 }}>
              <Info size={15} color={BLUE} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>To change plan pricing, features or duration, update the <strong style={{ color: '#F5F5F5' }}>subscription_plans</strong> table in Supabase or use the Pricing settings page. The counts below reflect live subscriber data.</span>
            </div>
            {/* Plan breakdown with aspirant/agency split */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', gap: 6, padding: '6px 14px', marginBottom: 4 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>PLAN</div>
                <div style={{ fontSize: 13, color: PURPLE, fontWeight: 700, textAlign: 'center' }}>ASPIRANTS</div>
                <div style={{ fontSize: 13, color: BLUE,   fontWeight: 700, textAlign: 'center' }}>AGENCIES</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 700, textAlign: 'center' }}>TOTAL</div>
              </div>
              {Object.entries(planBreakdown).length === 0 ? (
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '12px 0' }}>No plan data loaded yet</div>
              ) : Object.entries(planBreakdown).map(([pName, count]) => {
                // Split current subs by plan and user type
                const planSubs   = subs.filter(s => s.plan === pName);
                const aspCount   = planSubs.filter(s => s.userType === 'Aspirant').length;
                const agcCount   = planSubs.filter(s => s.userType === 'Agency').length;
                // Use the total from planBreakdown (all pages), local split is approximate
                const totalCount2 = count as number;
                return (
                  <div key={pName} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', alignItems: 'center', padding: '12px 14px', background: BG3, borderRadius: 8, marginBottom: 8, border: '1px solid rgba(255,255,255,0.06)', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: PLAN_COLORS[pName] || TEAL }} />
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{pName}</span>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: PURPLE }}>{aspCount}</div>
                    <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: BLUE }}>{agcCount}</div>
                    <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{totalCount2}</div>
                  </div>
                );
              })}
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 6 }}>
                Aspirant/Agency split shown for current page — total is platform-wide.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => router.push('/admin/pricing')}
                style={{ flex: 1, padding: 11, background: BG3, border: `1px solid ${GOLD}44`, borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 15, cursor: 'pointer', fontWeight: 700 }}>
                Edit Plans in Pricing
              </button>
              <button onClick={() => setShowManagePlans(false)}
                style={{ flex: 1, padding: 11, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RENEWAL SETTINGS MODAL ── */}
      {showRenewal && (
        <RenewalSettingsModal
          onClose={() => setShowRenewal(false)}
          getToken={getToken}
          showToast={showToast}
        />
      )}

      {/* ── PAYMENT HISTORY MODAL ── */}
      {showPayHistory && (
        <PaymentHistoryModal
          onClose={() => setShowPayHistory(false)}
          getToken={getToken}
        />
      )}

      {/* ── EXPORT MODAL ── */}
      {showExport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 24, width: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1 }}>EXPORT SUBSCRIPTIONS</div>
              <button onClick={() => setShowExport(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[
              { l: 'Format',     opts: ['Excel Spreadsheet', 'PDF Report', 'CSV File'],                    v: exportFormat,  s: setExportFormat  },
              { l: 'Include',    opts: ['All Subscriptions', 'Active Only', 'Expiring Soon', 'Expired'],   v: exportInclude, s: setExportInclude },
              { l: 'Date Range', opts: ['Last 7 Days', 'Last 30 Days', 'All Time'],                        v: exportDate,    s: setExportDate    },
            ].map(f => (
              <div key={f.l} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>{f.l}</label>
                <select value={f.v} onChange={e => f.s(e.target.value)}
                  style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '9px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none' }}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setShowExport(false)} style={{ flex: 1, padding: 11, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowExport(false); router.push('/admin/analytics/subscription-report'); }}
                style={{ flex: 2, padding: 11, background: RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, cursor: 'pointer' }}>Export Now</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: BG2, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 22px', fontSize: 15, fontWeight: 600, color: '#F5F5F5', zIndex: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <CheckSquare size={15} color={GREEN} /> {toast}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}