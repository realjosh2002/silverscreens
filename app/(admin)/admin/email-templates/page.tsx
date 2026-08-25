'use client'

export const dynamic = 'force-dynamic';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopnav from '@/components/layout/AdminTopnav';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ChevronRight, Search, Plus, Edit, Eye, Send, CheckCircle,
  AlertCircle, X, RefreshCw, Mail, Code2, Smartphone, Save,
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

type Template = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  subject: string;
  body_html: string;
  variables: string[];
  is_active: boolean;
  category: string;
  updated_at: string;
};

const CATEGORY_COLOR: Record<string, string> = {
  transactional: BLUE,
  marketing:     PURPLE,
  notification:  ORANGE,
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* Toast */
function Toast({ msg, type, onDone }: { msg: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(function() { const t = setTimeout(onDone, 3000); return function() { clearTimeout(t); }; }, [onDone]);
  return (
    <div style={{ position: 'fixed' as const, bottom: 28, right: 28, zIndex: 300, background: type === 'success' ? GREEN : RED, color: '#000', padding: '12px 20px', borderRadius: 10, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

/* Preview Modal */
function PreviewModal({ template, onClose }: { template: Template; onClose: () => void }) {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');
  return (
    <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', flexDirection: 'column' as const }} onClick={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: BG2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        onClick={function(e) { e.stopPropagation(); }}>
        <div>
          <div style={{ fontFamily: BEBAS, fontSize: 18, color: GOLD, letterSpacing: 1 }}>{template.name}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Subject: {template.subject}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', background: BG3, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={function() { setView('desktop'); }}
              style={{ padding: '7px 14px', background: view === 'desktop' ? GOLD_DIM : 'transparent', border: 'none', color: view === 'desktop' ? GOLD : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Mail size={13} /> Desktop
            </button>
            <button onClick={function() { setView('mobile'); }}
              style={{ padding: '7px 14px', background: view === 'mobile' ? GOLD_DIM : 'transparent', border: 'none', color: view === 'mobile' ? GOLD : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Smartphone size={13} /> Mobile
            </button>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 24px' }}
        onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ width: view === 'mobile' ? 375 : 680, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
          <iframe
            srcDoc={template.body_html}
            style={{ width: '100%', border: 'none', minHeight: 600, display: 'block' }}
            title="Email Preview"
          />
        </div>
      </div>
      <div style={{ padding: '12px 24px', background: BG2, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8, justifyContent: 'center' }}>
        {template.variables.map(function(v) {
          return (
            <span key={v} style={{ padding: '3px 10px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 20, fontSize: 13, color: GOLD }}>
              {'{{' + v + '}}'}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* Editor Modal */
function EditorModal({ template, onClose, onSaved }: {
  template: Template; onClose: () => void;
  onSaved: (t: Template) => void;
}) {
  const [subject,  setSubject]  = useState(template.subject);
  const [bodyHtml, setBodyHtml] = useState(template.body_html);
  const [isActive, setIsActive] = useState(template.is_active);
  const [saving,   setSaving]   = useState(false);
  const [tab,      setTab]      = useState<'editor' | 'preview'>('editor');
  const [error,    setError]    = useState('');

  async function save() {
    if (!subject.trim()) { setError('Subject cannot be empty.'); return; }
    if (!bodyHtml.trim()) { setError('Email body cannot be empty.'); return; }
    setSaving(true);
    setError('');
    const { error: err } = await supabase
      .from('email_templates')
      .update({ subject: subject.trim(), body_html: bodyHtml, is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', template.id);
    if (err) { setError('Failed to save: ' + err.message); setSaving(false); return; }
    onSaved({ ...template, subject: subject.trim(), body_html: bodyHtml, is_active: isActive });
    setSaving(false);
  }

  return (
    <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', flexDirection: 'column' as const }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: BG2, borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: BEBAS, fontSize: 18, color: GOLD, letterSpacing: 1 }}>EDIT: {template.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            Variables: {template.variables.map(function(v) { return '{{' + v + '}}'; }).join(', ')}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Active toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Active</span>
            <div onClick={function() { setIsActive(function(v) { return !v; }); }}
              style={{ width: 40, height: 22, borderRadius: 11, background: isActive ? GREEN : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative' as const, transition: 'background 0.2s' }}>
              <div style={{ position: 'absolute' as const, top: 3, left: isActive ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </div>
          </div>
          <div style={{ display: 'flex', background: BG3, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={function() { setTab('editor'); }}
              style={{ padding: '7px 14px', background: tab === 'editor' ? GOLD_DIM : 'transparent', border: 'none', color: tab === 'editor' ? GOLD : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Code2 size={13} /> Editor
            </button>
            <button onClick={function() { setTab('preview'); }}
              style={{ padding: '7px 14px', background: tab === 'preview' ? GOLD_DIM : 'transparent', border: 'none', color: tab === 'preview' ? GOLD : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Eye size={13} /> Preview
            </button>
          </div>
          <button onClick={save} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', background: saving ? GOLD + '80' : GOLD, border: 'none', borderRadius: 7, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? <RefreshCw size={13} /> : <Save size={13} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const, padding: 24, gap: 14 }}>
        {/* Subject */}
        <div>
          <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>EMAIL SUBJECT *</label>
          <input value={subject} onChange={function(e) { setSubject(e.target.value); setError(''); }}
            placeholder="Email subject line..."
            style={{ width: '100%', padding: '10px 14px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const }} />
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 14, color: RED, fontFamily: BARLOW }}>
            {error}
          </div>
        )}

        {/* Editor / Preview */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', gap: 0 }}>
          {tab === 'editor' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
              <label style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>HTML BODY *</label>
              <textarea
                value={bodyHtml}
                onChange={function(e) { setBodyHtml(e.target.value); setError(''); }}
                spellCheck={false}
                style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', fontFamily: 'monospace', fontSize: 13, padding: '12px 14px', outline: 'none', resize: 'none' as const, lineHeight: 1.6 }}
              />
            </div>
          )}
          {tab === 'preview' && (
            <div style={{ flex: 1, background: '#f0f0f0', borderRadius: 10, overflow: 'hidden' }}>
              <iframe
                srcDoc={bodyHtml}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title="Email Preview"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Test Send Modal */
function TestSendModal({ template, onClose, showToast }: {
  template: Template; onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [email,   setEmail]   = useState('');
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState('');

  async function send() {
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/admin/email-templates/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template.id, toEmail: email.trim() }),
      });
      if (res.ok) {
        showToast('Test email sent to ' + email.trim());
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send test email.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setSending(false);
  }

  return (
    <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <div style={{ background: BG3, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: 420, padding: 28, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
        onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1, marginBottom: 6 }}>SEND TEST EMAIL</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
          Template: <strong style={{ color: '#F5F5F5' }}>{template.name}</strong>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>SEND TO *</label>
          <input value={email} onChange={function(e) { setEmail(e.target.value); setError(''); }}
            placeholder="your@email.com" type="email"
            style={{ width: '100%', padding: '10px 14px', background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const }} />
        </div>
        <div style={{ padding: '10px 14px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 14, lineHeight: 1.6 }}>
          Variables like {'{{name}}'} will be replaced with sample placeholder values in the test email.
        </div>
        {error && (
          <div style={{ padding: '9px 13px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 14, color: RED, marginBottom: 14 }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          <button onClick={send} disabled={sending}
            style={{ flex: 2, padding: '10px', background: sending ? GOLD + '80' : GOLD, border: 'none', borderRadius: 8, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            {sending ? <><RefreshCw size={13} /> Sending...</> : <><Send size={13} /> Send Test</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Main Page */
export default function EmailTemplatesPage() {
  const router = useRouter();
  const [_collapsed,  _setCollapsed]  = useState(false);
  const [templates,   setTemplates]   = useState<Template[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('all');
  const [preview,     setPreview]     = useState<Template | null>(null);
  const [editing,     setEditing]     = useState<Template | null>(null);
  const [testSend,    setTestSend]    = useState<Template | null>(null);
  const [toast,       setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = function(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
  };

  const fetchTemplates = useCallback(async function() {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('name', { ascending: true });
    if (error) { showToast('Failed to load templates.', 'error'); }
    else { setTemplates((data || []) as Template[]); }
    setLoading(false);
  }, []);

  useEffect(function() { fetchTemplates(); }, [fetchTemplates]);

  async function toggleActive(template: Template) {
    const { error } = await supabase
      .from('email_templates')
      .update({ is_active: !template.is_active, updated_at: new Date().toISOString() })
      .eq('id', template.id);
    if (error) { showToast('Failed to update template.', 'error'); return; }
    setTemplates(function(prev) {
      return prev.map(function(t) {
        return t.id === template.id ? { ...t, is_active: !t.is_active } : t;
      });
    });
    showToast(template.name + ' ' + (!template.is_active ? 'activated' : 'deactivated') + '.');
  }

  function handleSaved(updated: Template) {
    setTemplates(function(prev) {
      return prev.map(function(t) { return t.id === updated.id ? updated : t; });
    });
    setEditing(null);
    showToast('Template saved successfully.');
  }

  const filtered = templates.filter(function(t) {
    const q = search.toLowerCase();
    const matchSearch = !search || t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
    const matchCat = catFilter === 'all' || t.category === catFilter;
    return matchSearch && matchCat;
  });

  const activeCount   = templates.filter(function(t) { return t.is_active; }).length;
  const inactiveCount = templates.filter(function(t) { return !t.is_active; }).length;

  const statCards = [
    { label: 'Total Templates', value: templates.length, color: BLUE,   icon: '📧' },
    { label: 'Active',          value: activeCount,       color: GREEN,  icon: '✅' },
    { label: 'Inactive',        value: inactiveCount,     color: ORANGE, icon: '⏸️' },
    { label: 'Categories',      value: [...new Set(templates.map(function(t) { return t.category; }))].length, color: PURPLE, icon: '🗂️' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AdminTopnav />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar onCollapse={_setCollapsed} />

        <div style={{ flex: 1, overflowY: 'auto' as const, padding: '18px 24px 32px', display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={function() { router.push('/admin/dashboard'); }} style={{ cursor: 'pointer' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>Home</span>
                <ChevronRight size={12} />
                <span onClick={function() { router.push('/admin/settings'); }} style={{ cursor: 'pointer' }}
                  onMouseEnter={function(e) { e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={function(e) { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>Settings</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Email Templates</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: 0 }}>Email Templates</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>
                Manage and customize all transactional email templates sent by the platform.
              </p>
            </div>
            <button onClick={fetchTemplates}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}
              onMouseEnter={function(e) { e.currentTarget.style.borderColor = GOLD; }}
              onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {statCards.map(function(s) {
              return (
                <div key={s.label} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px', transition: 'border 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = s.color + '44'; }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: s.color + '22', border: '1px solid ' + s.color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
                  </div>
                  <div style={{ fontFamily: BEBAS, fontSize: 34, color: '#F5F5F5', lineHeight: 1, letterSpacing: 0.5 }}>{s.value}</div>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' as const, flex: 1, maxWidth: 360 }}>
              <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={function(e) { setSearch(e.target.value); }}
                placeholder="Search templates by name or subject..."
                style={{ width: '100%', padding: '8px 12px 8px 32px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            {['all', 'transactional', 'marketing', 'notification'].map(function(cat) {
              return (
                <button key={cat} onClick={function() { setCatFilter(cat); }}
                  style={{ padding: '7px 16px', background: catFilter === cat ? GOLD_DIM : 'transparent', border: '1px solid ' + (catFilter === cat ? GOLD_BDR : 'rgba(255,255,255,0.1)'), borderRadius: 20, color: catFilter === cat ? GOLD : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize' as const }}>
                  {cat === 'all' ? 'All' : cat}
                </button>
              );
            })}
          </div>

          {/* Templates grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {Array.from({ length: 9 }).map(function(_, i) {
                return <div key={i} style={{ height: 200, background: BG3, borderRadius: 12, opacity: 0.5 }} />;
              })}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
              No templates found.
              {search && <span onClick={function() { setSearch(''); }} style={{ color: GOLD, cursor: 'pointer', marginLeft: 8, textDecoration: 'underline' }}>Clear search</span>}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {filtered.map(function(t) {
                const catColor = CATEGORY_COLOR[t.category] || BLUE;
                return (
                  <div key={t.id} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const, transition: 'border 0.2s' }}
                    onMouseEnter={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>

                    {/* Card top color bar */}
                    <div style={{ height: 4, background: t.is_active ? catColor : '#6B7280' }} />

                    <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                      {/* Name + status */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 17, color: '#F5F5F5', letterSpacing: 0.5, lineHeight: 1.3 }}>{t.name}</div>
                        <div onClick={function() { toggleActive(t); }}
                          style={{ width: 36, height: 20, borderRadius: 10, background: t.is_active ? GREEN : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative' as const, flexShrink: 0, marginTop: 2, transition: 'background 0.2s' }}>
                          <div style={{ position: 'absolute' as const, top: 2, left: t.is_active ? 17 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                        </div>
                      </div>

                      {/* Category + slug */}
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ padding: '2px 8px', background: catColor + '20', border: '1px solid ' + catColor + '40', borderRadius: 10, fontSize: 12, color: catColor, fontWeight: 600, textTransform: 'capitalize' as const }}>
                          {t.category}
                        </span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{t.slug}</span>
                      </div>

                      {/* Subject */}
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }} title={t.subject}>
                        <span style={{ color: 'rgba(255,255,255,0.35)' }}>Subject: </span>{t.subject}
                      </div>

                      {/* Variables */}
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4 }}>
                        {t.variables.slice(0, 4).map(function(v) {
                          return (
                            <span key={v} style={{ padding: '2px 7px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 10, fontSize: 11, color: GOLD }}>
                              {'{{' + v + '}}'}
                            </span>
                          );
                        })}
                        {t.variables.length > 4 && (
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '2px 4px' }}>+{t.variables.length - 4} more</span>
                        )}
                      </div>

                      {/* Updated */}
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 'auto' }}>
                        Updated: {fmtDate(t.updated_at)}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
                      <button onClick={function() { setEditing(t); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                        onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(212,166,74,0.2)'; }}
                        onMouseLeave={function(e) { e.currentTarget.style.background = GOLD_DIM; }}>
                        <Edit size={13} /> Edit
                      </button>
                      <button onClick={function() { setPreview(t); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}
                        onMouseEnter={function(e) { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.color = BLUE; }}
                        onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                        <Eye size={13} /> Preview
                      </button>
                      <button onClick={function() { setTestSend(t); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}
                        onMouseEnter={function(e) { e.currentTarget.style.borderColor = GREEN; e.currentTarget.style.color = GREEN; }}
                        onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                        <Send size={13} /> Test
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {preview  && <PreviewModal template={preview} onClose={function() { setPreview(null); }} />}
      {editing  && <EditorModal template={editing} onClose={function() { setEditing(null); }} onSaved={handleSaved} />}
      {testSend && <TestSendModal template={testSend} onClose={function() { setTestSend(null); }} showToast={showToast} />}
      {toast    && <Toast msg={toast.msg} type={toast.type} onDone={function() { setToast(null); }} />}
    </div>
  );
}