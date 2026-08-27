"use client"
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopnav from '@/components/layout/AdminTopnav';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ChevronRight, ChevronDown, Eye, MoreVertical, Search,
  Download, Calendar, RefreshCw, TrendingUp, X,
  CheckCircle, AlertCircle, Send, Loader2,
} from 'lucide-react';

const BG       = '#0D1117';
const BG2      = '#131720';
const BG3      = '#181E2A';
const BG4      = '#1C2338';
const GOLD     = '#D4A64A';
const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';
const BEBAS    = "'Bebas Neue', sans-serif";
const BARLOW   = "'Barlow Condensed', sans-serif";
const GREEN    = '#22C55E';
const RED      = '#EF4444';
const BLUE     = '#3B82F6';
const PURPLE   = '#8B5CF6';
const ORANGE   = '#F97316';

type TicketStatus   = 'open' | 'in_progress' | 'resolved' | 'escalated' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

type Profile = {
  id: string; name: string | null; email: string;
  role: string; profile_number: string | null;
};

type Ticket = {
  id: string; user_id: string; category: string; subject: string;
  description: string; status: TicketStatus; priority: TicketPriority;
  assigned_to: string | null; resolved_at: string | null;
  created_at: string; updated_at: string;
  user_profile?: Profile | null; assigned_profile?: Profile | null;
};

type TicketReply = {
  id: string; ticket_id: string; sender_id: string;
  message: string; is_admin: boolean; created_at: string;
};

const STATUSES: TicketStatus[]     = ['open', 'in_progress', 'resolved', 'escalated', 'closed'];
const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
const CATEGORIES: string[]         = [
  'All Categories', 'Account & Profile', 'Payments & Billing',
  'Verification', 'Casting & Auditions', 'Login & Security',
  'Technical Issue', 'Subscription', 'Other',
];

const SL: Record<TicketStatus,   string> = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', escalated: 'Escalated', closed: 'Closed' };
const PL: Record<TicketPriority, string> = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' };
const SC: Record<TicketStatus,   string> = { open: ORANGE, in_progress: BLUE, resolved: GREEN, escalated: RED, closed: '#6B7280' };
const SB: Record<TicketStatus,   string> = { open: 'rgba(249,115,22,0.15)', in_progress: 'rgba(59,130,246,0.15)', resolved: 'rgba(34,197,94,0.15)', escalated: 'rgba(239,68,68,0.15)', closed: 'rgba(107,114,128,0.15)' };
const PC: Record<TicketPriority, string> = { low: GREEN, medium: ORANGE, high: RED, urgent: PURPLE };

function getInitials(name: string | null | undefined, email: string): string {
  if (name && name.trim()) {
    return name.trim().split(' ').slice(0, 2).map(function(w) { return w[0] ? w[0].toUpperCase() : ''; }).join('');
  }
  return email.slice(0, 2).toUpperCase();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function doExportCSV(tickets: Ticket[]): void {
  const headers = ['Ticket ID', 'Subject', 'User', 'Email', 'Category', 'Priority', 'Status', 'Assigned To', 'Created On'];
  function esc(v: string): string { return '"' + v.split('"').join('""') + '"'; }
  const rows = tickets.map(function(t) {
    return [
      t.id, t.subject,
      t.user_profile ? (t.user_profile.name || '') : '',
      t.user_profile ? t.user_profile.email : '',
      t.category, PL[t.priority], SL[t.status],
      t.assigned_profile ? (t.assigned_profile.name || t.assigned_profile.email) : 'Unassigned',
      formatDate(t.created_at),
    ];
  });
  const csv = [headers].concat(rows).map(function(r) { return r.map(function(v) { return esc(String(v)); }).join(','); }).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'support-tickets-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* Donut chart component */
function StatusDonut(props: { counts: Record<string, number>; total: number }) {
  const { counts, total } = props;
  const segDefs = [
    { key: 'open',        color: ORANGE    },
    { key: 'in_progress', color: BLUE      },
    { key: 'resolved',    color: GREEN     },
    { key: 'escalated',   color: RED       },
    { key: 'closed',      color: '#6B7280' },
  ];
  const cx = 70; const cy = 70; const R = 58; const r = 36;
  function rad(d: number) { return (d * Math.PI) / 180; }
  function getPoint(a: number, ro: number): [number, number] {
    return [cx + ro * Math.cos(rad(a)), cy + ro * Math.sin(rad(a))];
  }
  let start = -90;
  const arcs = segDefs.map(function(s) {
    const cnt = counts[s.key] || 0;
    const pct = total > 0 ? cnt / total : 0;
    const sw  = pct * 356;
    const end = start + sw;
    const lg  = sw > 180 ? 1 : 0;
    const p1 = getPoint(start, R); const p2 = getPoint(end, R);
    const p3 = getPoint(end, r);   const p4 = getPoint(start, r);
    const pathD = sw < 0.5 ? '' :
      'M ' + p1[0] + ' ' + p1[1] +
      ' A ' + R + ' ' + R + ' 0 ' + lg + ' 1 ' + p2[0] + ' ' + p2[1] +
      ' L ' + p3[0] + ' ' + p3[1] +
      ' A ' + r + ' ' + r + ' 0 ' + lg + ' 0 ' + p4[0] + ' ' + p4[1] + ' Z';
    start = end + 1.5;
    return { color: s.color, pathD: pathD };
  });
  return (
    <div style={{ position: 'relative' as const, width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140">
        <circle cx={cx} cy={cy} r={r - 1} fill={BG3} />
        {arcs.map(function(a, i) { return a.pathD ? <path key={i} d={a.pathD} fill={a.color} /> : null; })}
      </svg>
      <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: BEBAS, fontSize: 26, color: '#F5F5F5', lineHeight: 1 }}>{total}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Total</div>
      </div>
    </div>
  );
}

/* Toast component */
function Toast(props: { message: string; type: 'success' | 'error'; onDone: () => void }) {
  const { message, type, onDone } = props;
  useEffect(function() {
    const t = setTimeout(onDone, 3000);
    return function() { clearTimeout(t); };
  }, [onDone]);
  return (
    <div style={{ position: 'fixed' as const, bottom: 28, right: 28, zIndex: 300, background: type === 'success' ? GREEN : RED, color: '#000', padding: '12px 20px', borderRadius: 10, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  );
}

/* Ticket detail modal */
function TicketModal(props: {
  ticket: Ticket; adminId: string | null; onClose: () => void;
  onUpdated: () => void; showToast: (m: string, t?: 'success' | 'error') => void;
}) {
  const { ticket, adminId, onClose, onUpdated, showToast } = props;
  const [replies,     setReplies]     = useState<TicketReply[]>([]);
  const [newMsg,      setNewMsg]      = useState('');
  const [sending,     setSending]     = useState(false);
  const [newStatus,   setNewStatus]   = useState<TicketStatus>(ticket.status);
  const [newPriority, setNewPriority] = useState<TicketPriority>(ticket.priority);
  const [saving,      setSaving]      = useState(false);
  const [agents,      setAgents]      = useState<Profile[]>([]);
  const [newAgent,    setNewAgent]    = useState<string>(ticket.assigned_to || '');

  useEffect(function() {
    async function load() {
      const r1 = await supabase.from('ticket_replies').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
      const r2 = await supabase.from('profiles').select('id,name,email,role,profile_number').eq('role', 'admin');
      if (r1.data) setReplies(r1.data as TicketReply[]);
      if (r2.data) setAgents(r2.data as Profile[]);
    }
    load();
  }, [ticket.id]);

  async function sendReply() {
    if (!newMsg.trim() || !adminId) return;
    setSending(true);
    const res = await supabase.from('ticket_replies').insert({ ticket_id: ticket.id, sender_id: adminId, message: newMsg.trim(), is_admin: true });
    if (res.error) {
      showToast('Failed to send reply.', 'error');
    } else {
      setNewMsg('');
      const r2 = await supabase.from('ticket_replies').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
      if (r2.data) setReplies(r2.data as TicketReply[]);
      showToast('Reply sent.');
    }
    setSending(false);
  }

  async function saveChanges() {
    setSaving(true);
    const updates: Record<string, unknown> = {
      status: newStatus, priority: newPriority,
      updated_at: new Date().toISOString(),
      assigned_to: newAgent || null,
    };
    if (newStatus === 'resolved' && ticket.status !== 'resolved') {
      updates.resolved_at = new Date().toISOString();
    }
    const res = await supabase.from('support_tickets').update(updates).eq('id', ticket.id);
    if (res.error) {
      showToast('Failed to save.', 'error');
    } else {
      showToast('Ticket updated.');
      onUpdated();
      onClose();
    }
    setSaving(false);
  }

  const dropStyle: React.CSSProperties = {
    background: BG2, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '8px 12px',
    outline: 'none', cursor: 'pointer', width: '100%',
  };

  return (
    <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ background: BG3, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' as const }}
        onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 2 }}>{ticket.id.slice(0, 8).toUpperCase()}</div>
            <div style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 600 }}>{ticket.subject}</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: BG4, borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Submitted By</div>
              <div style={{ fontSize: 14, color: '#F5F5F5' }}>{ticket.user_profile ? (ticket.user_profile.name || ticket.user_profile.email) : ticket.user_id}</div>
            </div>
            <div style={{ background: BG4, borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Email</div>
              <div style={{ fontSize: 14, color: '#F5F5F5' }}>{ticket.user_profile ? ticket.user_profile.email : '--'}</div>
            </div>
            <div style={{ background: BG4, borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Category</div>
              <div style={{ fontSize: 14, color: '#F5F5F5' }}>{ticket.category}</div>
            </div>
            <div style={{ background: BG4, borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Submitted On</div>
              <div style={{ fontSize: 14, color: '#F5F5F5' }}>{formatDate(ticket.created_at)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ padding: '4px 12px', background: PC[ticket.priority] + '22', border: '1px solid ' + PC[ticket.priority] + '55', borderRadius: 12, fontSize: 13, color: PC[ticket.priority], fontWeight: 700 }}>
              Priority: {PL[ticket.priority]}
            </span>
            <span style={{ padding: '4px 12px', background: SB[ticket.status], border: '1px solid ' + SC[ticket.status] + '44', borderRadius: 12, fontSize: 13, color: SC[ticket.status], fontWeight: 600 }}>
              {SL[ticket.status]}
            </span>
          </div>
          <div style={{ background: BG2, borderRadius: 8, padding: 14, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>DESCRIPTION</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{ticket.description}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>STATUS</div>
              <select value={newStatus} onChange={function(e) { setNewStatus(e.target.value as TicketStatus); }} style={dropStyle}>
                {STATUSES.map(function(s) { return <option key={s} value={s} style={{ background: BG3 }}>{SL[s]}</option>; })}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>PRIORITY</div>
              <select value={newPriority} onChange={function(e) { setNewPriority(e.target.value as TicketPriority); }} style={dropStyle}>
                {PRIORITIES.map(function(p) { return <option key={p} value={p} style={{ background: BG3 }}>{PL[p]}</option>; })}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>ASSIGN AGENT</div>
              <select value={newAgent} onChange={function(e) { setNewAgent(e.target.value); }} style={dropStyle}>
                <option value="" style={{ background: BG3 }}>Unassigned</option>
                {agents.map(function(a) { return <option key={a.id} value={a.id} style={{ background: BG3 }}>{a.name || a.email}</option>; })}
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>CONVERSATION</div>
            {replies.length === 0 && (
              <div style={{ padding: 20, textAlign: 'center' as const, color: 'rgba(255,255,255,0.25)', fontSize: 14, background: BG2, borderRadius: 8 }}>No replies yet.</div>
            )}
            {replies.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, maxHeight: 240, overflowY: 'auto' as const }}>
                {replies.map(function(rp) {
                  return (
                    <div key={rp.id} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: rp.is_admin ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '85%', background: rp.is_admin ? GOLD_DIM : BG4, border: '1px solid ' + (rp.is_admin ? GOLD_BDR : 'rgba(255,255,255,0.06)'), borderRadius: 10, padding: '10px 14px' }}>
                        <div style={{ fontSize: 13, color: rp.is_admin ? GOLD : 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{rp.message}</div>
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>
                        {rp.is_admin ? 'Admin' : 'User'} {formatDate(rp.created_at)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <textarea
              value={newMsg}
              onChange={function(e) { setNewMsg(e.target.value); }}
              placeholder="Type your reply..."
              rows={2}
              style={{ flex: 1, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '8px 12px', outline: 'none', resize: 'none' as const }}
            />
            <button
              onClick={sendReply}
              disabled={sending || !newMsg.trim()}
              style={{ padding: '8px 14px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 7, color: GOLD, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: BARLOW, fontSize: 14 }}>
              {sending ? <Loader2 size={14} /> : <Send size={13} />} Send
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={saveChanges}
              disabled={saving}
              style={{ flex: 1, padding: 10, background: GOLD, border: 'none', borderRadius: 8, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Main page */
export default function SupportTicketsPage() {
  const router = useRouter();
  const [_collapsed, setCollapsed] = useState(false);
  const [tickets,      setTickets]      = useState<Ticket[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [adminId,      setAdminId]      = useState<string | null>(null);
  const [search,       setSearch]       = useState('');
  const [catFilter,    setCatFilter]    = useState('All Categories');
  const [priFilter,    setPriFilter]    = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');
  const [showDate,     setShowDate]     = useState(false);
  const [page,         setPage]         = useState(1);
  const PER_PAGE = 8;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [actionMenu,   setActionMenu]   = useState<string | null>(null);
  const [menuPos,      setMenuPos]      = useState<{top:number;right:number}>({top:0,right:0});
  const [bulkMenu,     setBulkMenu]     = useState(false);
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);
  const [toast,        setToast]        = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback(function(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
  }, []);

  const fetchTickets = useCallback(async function() {
    setLoading(true);
    const res = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    if (res.error || !res.data) {
      console.error('Supabase tickets error:', JSON.stringify(res.error));
      showToast('Error: ' + (res.error ? res.error.message : 'No data returned'), 'error');
      setLoading(false);
      return;
    }
    const tData = res.data as any[];
    const allIds: string[] = [];
    tData.forEach(function(t) {
      if (t.user_id && !allIds.includes(t.user_id)) allIds.push(t.user_id);
      if (t.assigned_to && !allIds.includes(t.assigned_to)) allIds.push(t.assigned_to);
    });
    const pMap: Record<string, Profile> = {};
    if (allIds.length > 0) {
      const pr = await supabase.from('profiles').select('id,name,email,role,profile_number').in('id', allIds);
      if (pr.data) {
        (pr.data as Profile[]).forEach(function(p) { pMap[p.id] = p; });
      }
    }
    const enriched: Ticket[] = tData.map(function(t) {
      return Object.assign({}, t, {
        user_profile:     pMap[t.user_id] || null,
        assigned_profile: pMap[t.assigned_to] || null,
      });
    });
    setTickets(enriched);
    setLoading(false);
  }, [showToast]);

  useEffect(function() {
    supabase.auth.getSession().then(function(res) {
      setAdminId(res.data.session ? res.data.session.user.id : null);
    });
    fetchTickets();
  }, [fetchTickets]);

  const filtered = tickets.filter(function(t) {
    const uName  = t.user_profile ? (t.user_profile.name || '') : '';
    const uEmail = t.user_profile ? t.user_profile.email : '';
    const hay    = [t.id, t.subject, uName, uEmail, t.category];
    const s1 = search === '' || hay.some(function(v) { return v.toLowerCase().includes(search.toLowerCase()); });
    const s2 = catFilter    === 'All Categories' || t.category === catFilter;
    const s3 = priFilter    === 'all'            || t.priority === priFilter;
    const s4 = statusFilter === 'all'            || t.status   === statusFilter;
    const s5 = !dateFrom || new Date(t.created_at) >= new Date(dateFrom);
    const s6 = !dateTo   || new Date(t.created_at) <= new Date(dateTo + 'T23:59:59');
    return s1 && s2 && s3 && s4 && s5 && s6;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  function toggleRow(id: string) {
    setSelectedRows(function(prev) {
      return prev.includes(id) ? prev.filter(function(r) { return r !== id; }) : prev.concat([id]);
    });
  }
  function toggleAll() {
    if (selectedRows.length === paginated.length && paginated.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginated.map(function(t) { return t.id; }));
    }
  }
  function resetFilters() {
    setSearch(''); setCatFilter('All Categories'); setPriFilter('all');
    setStatusFilter('all'); setDateFrom(''); setDateTo(''); setPage(1);
  }

  const counts: Record<string, number> = {};
  tickets.forEach(function(t) { counts[t.status] = (counts[t.status] || 0) + 1; });
  const total = tickets.length;

  async function quickStatus(id: string, status: TicketStatus) {
    const res = await supabase.from('support_tickets').update({ status: status, updated_at: new Date().toISOString() }).eq('id', id);
    if (res.error) { showToast('Update failed.', 'error'); }
    else { showToast('Ticket updated.'); fetchTickets(); }
  }

  async function deleteTicket(id: string) {
    const res = await supabase.from('support_tickets').delete().eq('id', id);
    if (res.error) { showToast('Delete failed.', 'error'); }
    else { showToast('Ticket deleted.', 'error'); fetchTickets(); }
  }

  async function bulkUpdate(status: TicketStatus) {
    if (!selectedRows.length) { showToast('Select tickets first.', 'error'); return; }
    const res = await supabase.from('support_tickets').update({ status: status, updated_at: new Date().toISOString() }).in('id', selectedRows);
    if (res.error) { showToast('Bulk update failed.', 'error'); }
    else { showToast(selectedRows.length + ' ticket(s) updated.'); setSelectedRows([]); fetchTickets(); }
  }

  function closeAll() {
    if (actionMenu) setActionMenu(null);
    if (bulkMenu)   setBulkMenu(false);
    if (showDate)   setShowDate(false);
  }

  const statCards = [
    { icon: '💬', label: 'Total',       value: total,                      color: BLUE,   fk: 'all'         },
    { icon: '🕐', label: 'Open',        value: counts['open']        || 0, color: ORANGE, fk: 'open'        },
    { icon: '..', label: 'In Progress', value: counts['in_progress'] || 0, color: PURPLE, fk: 'in_progress' },
    { icon: 'OK', label: 'Resolved',    value: counts['resolved']    || 0, color: GREEN,  fk: 'resolved'    },
    { icon: '!!', label: 'Escalated',   value: counts['escalated']   || 0, color: RED,    fk: 'escalated'   },
  ];

  /* Pre-compute right panel data to avoid complex JSX */
  const statusRows = STATUSES.map(function(s) {
    const cnt = counts[s] || 0;
    const pct = total > 0 ? (cnt / total * 100).toFixed(1) : '0.0';
    return { s: s, cnt: cnt, pct: pct };
  });

  const priorityRows = PRIORITIES.map(function(p) {
    const cnt = tickets.filter(function(t) { return t.priority === p; }).length;
    const pct = total > 0 ? (cnt / total * 100) : 0;
    return { p: p, cnt: cnt, pct: pct };
  });

  /* Pre-compute table rows */
  const tableRows = paginated.map(function(t) {
    const uName  = t.user_profile ? (t.user_profile.name || t.user_profile.email || t.user_id.slice(0, 8)) : t.user_id.slice(0, 8);
    const uEmail = t.user_profile ? t.user_profile.email : '';
    const ini    = getInitials(t.user_profile ? t.user_profile.name : null, uEmail);
    const aName  = t.assigned_profile ? (t.assigned_profile.name || t.assigned_profile.email || null) : null;
    const aIni   = aName ? aName.split(' ').slice(0, 2).map(function(w: string) { return w[0] || ''; }).join('').toUpperCase() : '';
    const sel    = selectedRows.includes(t.id);
    return { t: t, uName: uName, uEmail: uEmail, ini: ini, aName: aName, aIni: aIni, sel: sel };
  });

  /* Pre-compute active filter pills */
  const activePills: Array<{ label: string; clear: () => void }> = [];
  if (search)                        activePills.push({ label: 'Search: ' + search, clear: function() { setSearch(''); } });
  if (catFilter !== 'All Categories') activePills.push({ label: catFilter, clear: function() { setCatFilter('All Categories'); } });
  if (priFilter !== 'all')            activePills.push({ label: PL[priFilter as TicketPriority], clear: function() { setPriFilter('all'); } });
  if (statusFilter !== 'all')         activePills.push({ label: SL[statusFilter as TicketStatus], clear: function() { setStatusFilter('all'); } });
  if (dateFrom || dateTo)             activePills.push({ label: (dateFrom || '?') + ' to ' + (dateTo || '?'), clear: function() { setDateFrom(''); setDateTo(''); } });

  const selStyle: React.CSSProperties = {
    background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14,
    padding: '7px 26px 7px 10px', outline: 'none', cursor: 'pointer',
  };

  const showingText = loading ? 'Loading...' :
    filtered.length === 0 ? 'No results' :
    'Showing ' + ((safePage - 1) * PER_PAGE + 1) + '-' + Math.min(safePage * PER_PAGE, filtered.length) + ' of ' + filtered.length;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}
      onClick={closeAll}
    >
      <AdminTopnav />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar onCollapse={setCollapsed} />

        <div style={{ flex: 1, overflowY: 'auto' as const, padding: '18px 20px 32px', display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                Support Tickets
                {(counts['open'] || 0) > 0 && (
                  <span style={{ background: RED, color: '#fff', fontSize: 12, fontFamily: BARLOW, borderRadius: 10, padding: '2px 8px', fontWeight: 700 }}>
                    {counts['open']} Open
                  </span>
                )}
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Manage and resolve user issues and platform inquiries.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              <span
                onClick={function() { router.push('/admin/dashboard'); }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={function(e) { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              >Home</span>
              <ChevronRight size={12} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Support Tickets</span>
            </div>
          </div>

          {/* Action buttons row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              onClick={fetchTickets}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = GOLD; }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <button
              onClick={function() { doExportCSV(filtered); showToast('Exported ' + filtered.length + ' ticket(s).'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = GOLD; }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            >
              <Download size={14} /> Export CSV
            </button>
            <div style={{ position: 'relative' as const }}>
              <button
                onClick={function(e) { e.stopPropagation(); setBulkMenu(function(v) { return !v; }); }}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}
                onMouseEnter={function(e) { e.currentTarget.style.borderColor = GOLD; }}
                onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                Bulk Actions
                {selectedRows.length > 0 && (
                  <span style={{ background: GOLD, color: '#000', borderRadius: 10, padding: '1px 7px', fontSize: 12, fontWeight: 700 }}>{selectedRows.length}</span>
                )}
                <ChevronDown size={13} />
              </button>
              {bulkMenu && (
                <div style={{ position: 'absolute' as const, right: 0, top: 40, width: 200, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  <div
                    onClick={function() { setBulkMenu(false); bulkUpdate('resolved'); }}
                    style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: '#F5F5F5' }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                  >Mark as Resolved</div>
                  <div
                    onClick={function() { setBulkMenu(false); bulkUpdate('closed'); }}
                    style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: '#F5F5F5' }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                  >Mark as Closed</div>
                  <div
                    onClick={function() { setBulkMenu(false); bulkUpdate('escalated'); }}
                    style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: '#F5F5F5' }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                  >Mark as Escalated</div>
                </div>
              )}
            </div>
          </div>

          {/* Main grid: left table + right panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

            {/* LEFT column */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>

              {/* Stat cards */}
              <div style={{ display: 'flex', gap: 10 }}>
                {statCards.map(function(s) {
                  return (
                    <div
                      key={s.label}
                      onClick={function() { setStatusFilter(s.fk); setPage(1); }}
                      style={{ flex: 1, background: BG3, border: '1px solid ' + (statusFilter === s.fk ? s.color + '55' : 'rgba(255,255,255,0.06)'), borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'border 0.2s' }}
                      onMouseEnter={function(e) { e.currentTarget.style.borderColor = s.color + '55'; }}
                      onMouseLeave={function(e) { e.currentTarget.style.borderColor = statusFilter === s.fk ? s.color + '55' : 'rgba(255,255,255,0.06)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '22', border: '1px solid ' + s.color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                      </div>
                      {loading
                        ? <div style={{ height: 28, width: 50, background: 'rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 4 }} />
                        : <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#F5F5F5', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                      }
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Click to filter</div>
                    </div>
                  );
                })}
              </div>

              {/* Filters bar */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
                <div style={{ position: 'relative' as const, flex: 1, minWidth: 180 }}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    value={search}
                    onChange={function(e) { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search tickets..."
                    style={{ width: '100%', padding: '7px 10px 7px 28px', background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }}
                  />
                </div>
                <select value={catFilter} onChange={function(e) { setCatFilter(e.target.value); setPage(1); }} style={selStyle}>
                  {CATEGORIES.map(function(o) { return <option key={o} style={{ background: BG3 }}>{o}</option>; })}
                </select>
                <select value={priFilter} onChange={function(e) { setPriFilter(e.target.value); setPage(1); }} style={selStyle}>
                  <option value="all" style={{ background: BG3 }}>All Priorities</option>
                  {PRIORITIES.map(function(p) { return <option key={p} value={p} style={{ background: BG3 }}>{PL[p]}</option>; })}
                </select>
                <select value={statusFilter} onChange={function(e) { setStatusFilter(e.target.value); setPage(1); }} style={selStyle}>
                  <option value="all" style={{ background: BG3 }}>All Status</option>
                  {STATUSES.map(function(s) { return <option key={s} value={s} style={{ background: BG3 }}>{SL[s]}</option>; })}
                </select>
                <div style={{ position: 'relative' as const }}>
                  <div
                    onClick={function(e) { e.stopPropagation(); setShowDate(function(v) { return !v; }); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: BG2, border: '1px solid ' + (showDate ? GOLD : 'rgba(255,255,255,0.1)'), borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' as const }}
                  >
                    <Calendar size={13} color={GOLD} />
                    <span style={{ fontSize: 14, color: (dateFrom || dateTo) ? '#F5F5F5' : 'rgba(255,255,255,0.45)' }}>
                      {(dateFrom || dateTo) ? (dateFrom || '?') + ' to ' + (dateTo || '?') : 'Date Range'}
                    </span>
                    <ChevronDown size={12} color="rgba(255,255,255,0.3)" />
                  </div>
                  {showDate && (
                    <div
                      onClick={function(e) { e.stopPropagation(); }}
                      style={{ position: 'absolute' as const, left: 0, top: 40, background: BG4, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: 14, zIndex: 60, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 220 }}
                    >
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>DATE RANGE</div>
                      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                        <input type="date" value={dateFrom} onChange={function(e) { setDateFrom(e.target.value); }}
                          style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '7px 10px', outline: 'none' }} />
                        <input type="date" value={dateTo} onChange={function(e) { setDateTo(e.target.value); }}
                          style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '7px 10px', outline: 'none' }} />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={function() { setShowDate(false); }} style={{ flex: 1, padding: '7px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 6, color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>Apply</button>
                          <button onClick={function() { setDateFrom(''); setDateTo(''); setShowDate(false); }} style={{ flex: 1, padding: '7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>Clear</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={resetFilters}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = RED; }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                >
                  <RefreshCw size={12} /> Reset
                </button>
              </div>

              {/* Active filter pills */}
              {activePills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                  {activePills.map(function(pill, i) {
                    return (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 20, fontSize: 13, color: GOLD }}>
                        {pill.label}
                        <X size={12} style={{ cursor: 'pointer' }} onClick={pill.clear} />
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Table */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>

                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1.4fr 1.6fr 1fr 0.8fr 0.8fr 1.2fr 1.2fr 70px', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2, alignItems: 'center' }}>
                  <input type="checkbox" checked={selectedRows.length === paginated.length && paginated.length > 0} onChange={toggleAll} style={{ width: 14, height: 14, cursor: 'pointer', accentColor: GOLD }} />
                  {['Ticket ID', 'Subject', 'User', 'Category', 'Priority', 'Status', 'Assigned To', 'Created On', 'Actions'].map(function(h) {
                    return <div key={h} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700, whiteSpace: 'nowrap' as const }}>{h}</div>;
                  })}
                </div>

                {/* Loading skeleton */}
                {loading && Array.from({ length: 5 }).map(function(_, i) {
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1.4fr 1.6fr 1fr 0.8fr 0.8fr 1.2fr 1.2fr 70px', padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center', gap: 8 }}>
                      {Array.from({ length: 10 }).map(function(_, j) {
                        return <div key={j} style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />;
                      })}
                    </div>
                  );
                })}

                {/* Empty state */}
                {!loading && paginated.length === 0 && (
                  <div style={{ padding: 40, textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
                    No tickets found.{' '}
                    <span onClick={resetFilters} style={{ color: GOLD, cursor: 'pointer', textDecoration: 'underline' }}>Clear filters</span>
                  </div>
                )}

                {/* Table rows */}
                {!loading && tableRows.map(function(row, i) {
                  return (
                    <div
                      key={row.t.id}
                      style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1.4fr 1.6fr 1fr 0.8fr 0.8fr 1.2fr 1.2fr 70px', padding: '11px 14px', borderBottom: i < tableRows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', background: row.sel ? 'rgba(212,166,74,0.04)' : 'transparent', transition: 'background 0.15s' }}
                      onMouseEnter={function(e) { if (!row.sel) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={function(e) { e.currentTarget.style.background = row.sel ? 'rgba(212,166,74,0.04)' : 'transparent'; }}
                    >
                      <input type="checkbox" checked={row.sel} onChange={function() { toggleRow(row.t.id); }} style={{ width: 14, height: 14, cursor: 'pointer', accentColor: GOLD }} />
                      <div
                        style={{ fontSize: 12, color: BLUE, fontWeight: 600, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}
                        onClick={function() { setDetailTicket(row.t); }}
                        onMouseEnter={function(e) { e.currentTarget.style.textDecoration = 'underline'; }}
                        onMouseLeave={function(e) { e.currentTarget.style.textDecoration = 'none'; }}
                      >
                        {row.t.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div
                        style={{ fontSize: 13, color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, cursor: 'pointer' }}
                        onClick={function() { setDetailTicket(row.t); }}
                        title={row.t.subject}
                      >
                        {row.t.subject}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: BLUE + '30', border: '1px solid ' + BLUE + '50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: BLUE, flexShrink: 0 }}>{row.ini}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: '#F5F5F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.uName}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.uEmail}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.t.category}</div>
                      <div>
                        <span style={{ padding: '3px 8px', background: PC[row.t.priority] + '22', border: '1px solid ' + PC[row.t.priority] + '55', borderRadius: 12, fontSize: 12, color: PC[row.t.priority], fontWeight: 700 }}>
                          {PL[row.t.priority]}
                        </span>
                      </div>
                      <div>
                        <span style={{ padding: '3px 8px', background: SB[row.t.status], border: '1px solid ' + SC[row.t.status] + '44', borderRadius: 12, fontSize: 12, color: SC[row.t.status], fontWeight: 600, whiteSpace: 'nowrap' as const }}>
                          {SL[row.t.status]}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {row.aName && (
                          <>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{row.aIni}</div>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.aName}</span>
                          </>
                        )}
                        {!row.aName && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Unassigned</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{formatDate(row.t.created_at)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' as const }}>
                        <button
                          onClick={function() { setDetailTicket(row.t); }}
                          title="View"
                          style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                          onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                          onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Eye size={14} />
                        </button>
                        <div style={{ position: 'relative' as const }}>
                          <button
                            onClick={function(ev) {
                              ev.stopPropagation();
                              if (actionMenu === row.t.id) { setActionMenu(null); return; }
                              const rect = ev.currentTarget.getBoundingClientRect();
                              setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                              setActionMenu(row.t.id);
                            }}
                            style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                            onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                            onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                <div style={{ padding: '11px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG2 }}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{showingText}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <button onClick={function() { setPage(1); }} disabled={safePage === 1} style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: safePage === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: safePage === 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>1st</button>
                    <button onClick={function() { setPage(function(p) { return Math.max(1, p - 1); }); }} disabled={safePage === 1} style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: safePage === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: safePage === 1 ? 'not-allowed' : 'pointer', fontSize: 16 }}>‹</button>
                    {Array.from({ length: totalPages }, function(_, ix) { return ix + 1; }).map(function(p) {
                      return (
                        <button key={p} onClick={function() { setPage(p); }} style={{ width: 30, height: 30, background: p === safePage ? GOLD : 'transparent', border: '1px solid ' + (p === safePage ? GOLD : 'rgba(255,255,255,0.12)'), borderRadius: 6, color: p === safePage ? '#000' : '#F5F5F5', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14, fontWeight: p === safePage ? 700 : 400 }}>{p}</button>
                      );
                    })}
                    <button onClick={function() { setPage(function(p) { return Math.min(totalPages, p + 1); }); }} disabled={safePage === totalPages} style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: safePage === totalPages ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', fontSize: 16 }}>›</button>
                    <button onClick={function() { setPage(totalPages); }} disabled={safePage === totalPages} style={{ width: 30, height: 30, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: safePage === totalPages ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', fontSize: 13 }}>Last</button>
                  </div>
                </div>
              </div>

            </div>
            {/* End LEFT column */}

            {/* RIGHT panel */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

              {/* Status donut */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 14 }}>Tickets by Status</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 14 }}>
                  <StatusDonut counts={counts} total={total} />
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, width: '100%' }}>
                    {statusRows.map(function(row) {
                      return (
                        <div key={row.s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={function() { setStatusFilter(row.s); setPage(1); }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: SC[row.s], flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', flex: 1 }}>{SL[row.s]}</span>
                          <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 700 }}>{row.pct}%</span>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>({row.cnt})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Priority bars */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 14 }}>Tickets by Priority</div>
                {priorityRows.map(function(row) {
                  return (
                    <div key={row.p} style={{ marginBottom: 12, cursor: 'pointer' }} onClick={function() { setPriFilter(row.p); setPage(1); }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{PL[row.p]}</span>
                        <span style={{ fontSize: 13, color: '#F5F5F5', fontWeight: 600 }}>{row.cnt} ({row.pct.toFixed(1)}%)</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: row.pct + '%', background: PC[row.p], borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Support insights */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 14 }}>Support Insights</div>
                <div style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: GREEN + '20', border: '1px solid ' + GREEN + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, color: GREEN, fontWeight: 700 }}>OK</div>
                  <div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{(counts['resolved'] || 0) + ' tickets resolved'}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{'Out of ' + total + ' total'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: RED + '20', border: '1px solid ' + RED + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, color: RED, fontWeight: 700 }}>!</div>
                  <div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{(counts['escalated'] || 0) + ' escalated tickets'}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Require urgent attention</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, padding: '10px 0' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: ORANGE + '20', border: '1px solid ' + ORANGE + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, color: ORANGE, fontWeight: 700 }}>*</div>
                  <div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{(counts['open'] || 0) + ' tickets awaiting action'}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Open tickets</div>
                  </div>
                </div>
              </div>

              {/* Analytics link */}
              <button
                onClick={function() { router.push('/admin/analytics'); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 11, background: 'transparent', border: '1px solid ' + GOLD, borderRadius: 10, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.3 }}
                onMouseEnter={function(e) { e.currentTarget.style.background = GOLD_DIM; }}
                onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}
              >
                <TrendingUp size={15} /> View Full Analytics
              </button>

            </div>
            {/* End RIGHT panel */}

          </div>
          {/* End main grid */}

        </div>
        {/* End main scroll */}

      </div>
      {/* End body flex */}

      {detailTicket && (
        <TicketModal
          ticket={detailTicket}
          adminId={adminId}
          onClose={function() { setDetailTicket(null); }}
          onUpdated={fetchTickets}
          showToast={showToast}
        />
      )}

      {toast && (
        <Toast message={toast.msg} type={toast.type} onDone={function() { setToast(null); }} />
      )}

      {/* Fixed action dropdown — never clipped by overflow */}
      {actionMenu && (
        <>
          <div onClick={function() { setActionMenu(null); }} style={{ position: 'fixed' as const, inset: 0, zIndex: 98 }} />
          <div style={{ position: 'fixed' as const, top: menuPos.top, right: menuPos.right, width: 190, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 99, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
            {(function() {
              const id = actionMenu as string;
              return (
                <>
                  <div onClick={function() { const t = tickets.find(function(x) { return x.id === id; }); if(t) setDetailTicket(t); setActionMenu(null); }}
                    style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: '#F5F5F5', fontFamily: BARLOW }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>View Details</div>
                  <div onClick={function() { quickStatus(id, 'resolved'); setActionMenu(null); }}
                    style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: '#F5F5F5', fontFamily: BARLOW }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>Mark Resolved</div>
                  <div onClick={function() { quickStatus(id, 'closed'); setActionMenu(null); }}
                    style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: '#F5F5F5', fontFamily: BARLOW }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>Mark Closed</div>
                  <div onClick={function() { quickStatus(id, 'escalated'); setActionMenu(null); }}
                    style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: '#F5F5F5', fontFamily: BARLOW }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>Escalate</div>
                  <div onClick={function() { router.push('/admin/users'); setActionMenu(null); }}
                    style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: '#F5F5F5', fontFamily: BARLOW }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>View User Profile</div>
                  <div onClick={function() { deleteTicket(id); setActionMenu(null); }}
                    style={{ padding: '10px 14px', fontSize: 14, cursor: 'pointer', color: RED, fontFamily: BARLOW, borderTop: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>Delete Ticket</div>
                </>
              );
            })()}
          </div>
        </>
      )}

    </div>
  );
}