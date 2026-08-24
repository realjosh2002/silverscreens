'use client';
import AgencyTopnav from '@/components/layout/AgencyTopnav';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, PlusCircle, Megaphone, UserSearch,
  ClipboardList, Star, CalendarCheck, Bookmark,
  MessageSquare, Bell, ChevronRight, HelpCircle,
  Send, RefreshCw, Clock, CheckCircle, AlertCircle,
  XCircle, Plus, X,
} from 'lucide-react';

const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const ORANGE = '#F97316';
const PURPLE = '#8B5CF6';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'escalated' | 'closed';

type Ticket = {
  id: string;
  category: string;
  subject: string;
  status: TicketStatus;
  priority: string;
  created_at: string;
  resolved_at: string | null;
};

const CATEGORIES = [
  'Account & Profile',
  'Payments & Billing',
  'Verification',
  'Casting & Auditions',
  'Technical Issue',
  'Subscription',
  'Other',
];

const STATUS_LABEL: Record<string, string> = {
  open: 'Open', in_progress: 'In Progress',
  resolved: 'Resolved', escalated: 'Escalated', closed: 'Closed',
};
const STATUS_COLOR: Record<string, string> = {
  open: ORANGE, in_progress: BLUE,
  resolved: GREEN, escalated: RED, closed: '#6B7280',
};
const STATUS_BG: Record<string, string> = {
  open: 'rgba(249,115,22,0.15)', in_progress: 'rgba(59,130,246,0.15)',
  resolved: 'rgba(34,197,94,0.15)', escalated: 'rgba(239,68,68,0.15)',
  closed: 'rgba(107,114,128,0.15)',
};

function getAuth() {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return { token: u.token || '', email: u.email || '' };
  } catch { return { token: '', email: '' }; }
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/* Toast */
function Toast({ msg, type, onDone }: { msg: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(function() {
    const t = setTimeout(onDone, 3500);
    return function() { clearTimeout(t); };
  }, [onDone]);
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 300, background: type === 'success' ? GREEN : RED, color: '#000', padding: '12px 20px', borderRadius: 10, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

/* New Ticket Modal */
function NewTicketModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [category,    setCategory]    = useState('');
  const [subject,     setSubject]     = useState('');
  const [description, setDescription] = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');

  async function submit() {
    if (!category)               { setError('Please select a category.'); return; }
    if (!subject.trim())         { setError('Please enter a subject.'); return; }
    if (!description.trim())     { setError('Please describe your issue.'); return; }
    if (description.trim().length < 20) { setError('Please provide more detail (at least 20 characters).'); return; }

    setSubmitting(true);
    setError('');
    try {
      const { token } = getAuth();
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, subject: subject.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to submit ticket.'); }
      else { onSuccess(); }
    } catch {
      setError('Network error. Please try again.');
    }
    setSubmitting(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: BG3,
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ background: BG2, border: '1px solid ' + GOLD + '30', borderRadius: 14, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: '#F5F5F5' }}>RAISE A SUPPORT TICKET</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            Our support team typically responds within <strong style={{ color: '#F5F5F5' }}>24 hours</strong> on business days. Please provide as much detail as possible.
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>CATEGORY *</label>
            <select value={category} onChange={function(e) { setCategory(e.target.value); setError(''); }}
              style={{ ...inputStyle, appearance: 'none' }}>
              <option value="">Select a category</option>
              {CATEGORIES.map(function(c) { return <option key={c} value={c} style={{ background: BG3 }}>{c}</option>; })}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>SUBJECT *</label>
            <input
              value={subject}
              onChange={function(e) { setSubject(e.target.value); setError(''); }}
              placeholder="Brief description of your issue"
              maxLength={120}
              style={inputStyle}
            />
            <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4, textAlign: 'right' }}>{subject.length}/120</div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>DESCRIPTION *</label>
            <textarea
              value={description}
              onChange={function(e) { setDescription(e.target.value); setError(''); }}
              placeholder="Describe your issue in detail. Include any relevant information such as error messages, steps to reproduce, or transaction IDs."
              rows={5}
              maxLength={2000}
              style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 120 }}
            />
            <div style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4, textAlign: 'right' }}>{description.length}/2000</div>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontFamily: BARLOW, fontSize: 14, color: RED, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
            <button
              onClick={submit}
              disabled={submitting}
              style={{ flex: 2, padding: '10px', background: submitting ? GOLD + '80' : GOLD, border: 'none', borderRadius: 8, color: '#000', fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {submitting ? <><RefreshCw size={14} /> Submitting...</> : <><Send size={14} /> Submit Ticket</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Main Page */
export default function AgencySupportPage() {
  const router = useRouter();
  const [tickets,     setTickets]     = useState<Ticket[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [toast,       setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [activeTab,   setActiveTab]   = useState<'all' | 'open' | 'resolved'>('all');

  const showToast = useCallback(function(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
  }, []);

  const fetchTickets = useCallback(async function() {
    setLoading(true);
    try {
      const { token } = getAuth();
      const res = await fetch('/api/support', {
        headers: { 'Authorization': 'Bearer ' + token },
      });
      const data = await res.json();
      if (res.ok && data.data && data.data.tickets) {
        setTickets(data.data.tickets);
      }
    } catch {
      showToast('Failed to load tickets.', 'error');
    }
    setLoading(false);
  }, [showToast]);

  useEffect(function() { fetchTickets(); }, [fetchTickets]);

  function handleSuccess() {
    setShowModal(false);
    showToast('Ticket submitted! Our team will respond within 24 hours.');
    fetchTickets();
  }

  const filtered = tickets.filter(function(t) {
    if (activeTab === 'open')     return t.status === 'open' || t.status === 'in_progress' || t.status === 'escalated';
    if (activeTab === 'resolved') return t.status === 'resolved' || t.status === 'closed';
    return true;
  });

  const openCount     = tickets.filter(function(t) { return t.status === 'open' || t.status === 'in_progress'; }).length;
  const resolvedCount = tickets.filter(function(t) { return t.status === 'resolved' || t.status === 'closed'; }).length;

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AgencyTopnav />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px 60px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
          <span onClick={function() { router.push('/agency/dashboard'); }} style={{ cursor: 'pointer' }}
            onMouseEnter={function(e) { e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>Dashboard</span>
          <ChevronRight size={12} />
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Help & Support</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: BEBAS, fontSize: 34, letterSpacing: 1.5, margin: '0 0 6px', color: '#F5F5F5' }}>HELP & SUPPORT</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Submit a ticket or track your existing requests.</p>
          </div>
          <button
            onClick={function() { setShowModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: RED, border: 'none', borderRadius: 9, color: '#fff', fontFamily: BEBAS, fontSize: 17, letterSpacing: 1, cursor: 'pointer', flexShrink: 0 }}
            onMouseEnter={function(e) { e.currentTarget.style.background = '#d41e27'; }}
            onMouseLeave={function(e) { e.currentTarget.style.background = RED; }}>
            <Plus size={16} /> New Ticket
          </button>
        </div>

        {/* Quick help cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 28 }}>
          {[
            { icon: HelpCircle, color: BLUE,   title: 'FAQ',           desc: 'Find quick answers', href: '/faq' },
            { icon: MessageSquare, color: GOLD, title: 'Live Chat',     desc: 'Chat with support', href: 'mailto:support@silverscreens.in' },
            { icon: Bell,       color: GREEN,   title: 'Status Page',   desc: 'Check platform status', href: 'https://silverscreens.in/status' },
          ].map(function(card) {
            return (
              <div
                key={card.title}
                onClick={function() { if (card.href) { if (card.href.startsWith('mailto:') || card.href.startsWith('http')) { window.open(card.href, '_blank'); } else { router.push(card.href); } } }}
                style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                onMouseEnter={function(e) { if (card.href) e.currentTarget.style.borderColor = card.color + '50'; }}
                onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: card.color + '15', border: '1px solid ' + card.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <card.icon size={18} color={card.color} />
                </div>
                <div>
                  <div style={{ fontFamily: BEBAS, fontSize: 16, letterSpacing: 0.5, color: '#F5F5F5' }}>{card.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{card.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ticket list */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>

          {/* Tabs + refresh */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { key: 'all',      label: 'All Tickets (' + tickets.length + ')' },
                { key: 'open',     label: 'Open (' + openCount + ')' },
                { key: 'resolved', label: 'Resolved (' + resolvedCount + ')' },
              ].map(function(tab) {
                return (
                  <button
                    key={tab.key}
                    onClick={function() { setActiveTab(tab.key as any); }}
                    style={{ padding: '6px 14px', background: activeTab === tab.key ? RED : 'transparent', border: '1px solid ' + (activeTab === tab.key ? RED : 'rgba(255,255,255,0.1)'), borderRadius: 6, color: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <button onClick={fetchTickets} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Ticket rows */}
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>Loading tickets...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <HelpCircle size={40} color="rgba(255,255,255,0.1)" style={{ marginBottom: 14 }} />
              <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                {activeTab === 'all' ? 'No tickets yet' : 'No ' + activeTab + ' tickets'}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', marginBottom: 20 }}>
                {activeTab === 'all' ? 'Having an issue? Raise a support ticket and our team will help you.' : ''}
              </div>
              {activeTab === 'all' && (
                <button onClick={function() { setShowModal(true); }}
                  style={{ padding: '9px 22px', background: RED, border: 'none', borderRadius: 8, color: '#fff', fontFamily: BEBAS, fontSize: 16, letterSpacing: 1, cursor: 'pointer' }}>
                  Raise Your First Ticket
                </button>
              )}
            </div>
          ) : filtered.map(function(t, i) {
            return (
              <div
                key={t.id}
                style={{ padding: '16px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', alignItems: 'flex-start', gap: 14 }}
                onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: STATUS_COLOR[t.status] + '15', border: '1px solid ' + STATUS_COLOR[t.status] + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {t.status === 'resolved' || t.status === 'closed'
                    ? <CheckCircle size={16} color={GREEN} />
                    : t.status === 'escalated'
                    ? <AlertCircle size={16} color={RED} />
                    : <Clock size={16} color={STATUS_COLOR[t.status]} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#F5F5F5' }}>{t.subject}</div>
                    <span style={{ padding: '2px 9px', background: STATUS_BG[t.status], border: '1px solid ' + STATUS_COLOR[t.status] + '44', borderRadius: 20, fontSize: 12, color: STATUS_COLOR[t.status], fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {STATUS_LABEL[t.status]}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span>{t.category}</span>
                    <span>Submitted: {fmtDate(t.created_at)}</span>
                    {t.resolved_at && <span>Resolved: {fmtDate(t.resolved_at)}</span>}
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>#{t.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ padding: '3px 10px', background: t.priority === 'high' || t.priority === 'urgent' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)', border: '1px solid ' + (t.priority === 'high' || t.priority === 'urgent' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'), borderRadius: 20, fontSize: 12, color: t.priority === 'high' || t.priority === 'urgent' ? RED : 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                    {t.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom help note */}
        <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.15)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <HelpCircle size={18} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            For urgent issues related to payments or account access, please mention <strong style={{ color: GOLD }}>URGENT</strong> in your ticket subject. Our team prioritises these requests. You can also reach us at <strong style={{ color: '#F5F5F5' }}>support@silverscreens.in</strong>
          </div>
        </div>
      </div>

      {showModal && <NewTicketModal onClose={function() { setShowModal(false); }} onSuccess={handleSuccess} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={function() { setToast(null); }} />}
    </div>
  );
}