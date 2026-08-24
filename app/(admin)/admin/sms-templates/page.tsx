'use client';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopnav from '@/components/layout/AdminTopnav';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, Search, Edit, Eye, CheckCircle,
  AlertCircle, X, RefreshCw, MessageSquare, MessageCircle,
  Save, Code2, Copy, Check,
} from 'lucide-react';

function getAuthHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem('ss_user');
    if (!raw) return { 'Content-Type': 'application/json' };
    const u = JSON.parse(raw);
    const token = u.token ?? u.access_token ?? '';
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

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
const TEAL     = '#14B8A6';

type SmsTemplate = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  sms_body: string;
  wa_body: string;
  variables: string[];
  is_active: boolean;
  updated_at: string;
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function smsLength(text: string): number {
  return text.replace(/\{\{[^}]+\}\}/g, 'XXXX').length;
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

/* SMS Phone Preview */
function SmsPhonePreview({ body, type }: { body: string; type: 'sms' | 'wa' }) {
  const sample: Record<string, string> = {
    name: 'Ravi Kumar', otp: '847291', profile_id: 'ASP0001',
    reset_url: 'silverscreens.com/reset', casting_title: 'Lead Actor - Mumbai',
    agency_name: 'Star Casting Co.', application_id: 'APP-456',
    status: 'Approved', message: 'Congratulations! Your profile has been approved.',
    application_url: 'silverscreens.com/app/456', plan_name: 'Professional',
    amount: '₹2,499', expiry_date: '25 Jun 2027', transaction_id: 'TXN-789',
    agency_name_2: 'Star Agency', dashboard_url: 'silverscreens.com/agency',
    profile_url: 'silverscreens.com/profile',
  };

  let preview = body;
  Object.entries(sample).forEach(function([k, v]) {
    preview = preview.split('{{' + k + '}}').join(v);
  });

  if (type === 'wa') {
    // Render WhatsApp formatting
    preview = preview
      .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
      <div style={{ width: 280, background: '#1a1a2e', borderRadius: 36, padding: '48px 12px 40px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', border: '8px solid #2a2a4a', position: 'relative' as const }}>
        <div style={{ position: 'absolute' as const, top: 18, left: '50%', transform: 'translateX(-50%)', width: 80, height: 6, background: '#2a2a4a', borderRadius: 3 }} />
        <div style={{ background: type === 'wa' ? '#0b7a4e' : '#1976d2', borderRadius: 12, padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: type === 'wa' ? '#a8d8c0' : '#90caf9', marginBottom: 4 }}>
            {type === 'wa' ? 'SilverScreens' : 'SilverScreens'}
          </div>
          {type === 'wa'
            ? <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: preview }} />
            : <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.5 }}>{preview}</div>
          }
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'right' as const, marginTop: 4 }}>
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} ✓✓
          </div>
        </div>
        <div style={{ position: 'absolute' as const, bottom: 14, left: '50%', transform: 'translateX(-50%)', width: 60, height: 4, background: '#2a2a4a', borderRadius: 2 }} />
      </div>
    </div>
  );
}

/* Editor Modal */
function EditorModal({ template, onClose, onSaved }: {
  template: SmsTemplate; onClose: () => void;
  onSaved: (t: SmsTemplate) => void;
}) {
  const [smsBody,  setSmsBody]  = useState(template.sms_body);
  const [waBody,   setWaBody]   = useState(template.wa_body);
  const [isActive, setIsActive] = useState(template.is_active);
  const [saving,   setSaving]   = useState(false);
  const [tab,      setTab]      = useState<'sms' | 'wa'>('sms');
  const [view,     setView]     = useState<'edit' | 'preview'>('edit');
  const [error,    setError]    = useState('');
  const [copied,   setCopied]   = useState('');

  const smsChars = smsLength(smsBody);
  const smsSegments = Math.ceil(smsChars / 160);

  async function save() {
    if (!smsBody.trim()) { setError('SMS body cannot be empty.'); return; }
    if (!waBody.trim())  { setError('WhatsApp body cannot be empty.'); return; }
    setSaving(true); setError('');
    const headers = getAuthHeaders();
    const res = await fetch('/api/admin/sms-templates', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id: template.id, sms_body: smsBody, wa_body: waBody, is_active: isActive }),
    });
    const data = await res.json();
    if (!res.ok) { setError('Failed to save: ' + (data?.error || 'Unknown error')); setSaving(false); return; }
    onSaved({ ...template, sms_body: smsBody, wa_body: waBody, is_active: isActive });
    setSaving(false);
  }

  function copyVar(v: string) {
    navigator.clipboard.writeText('{{' + v + '}}');
    setCopied(v);
    setTimeout(function() { setCopied(''); }, 1500);
  }

  return (
    <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 200, display: 'flex', flexDirection: 'column' as const }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: BG2, borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: BEBAS, fontSize: 18, color: GOLD, letterSpacing: 1 }}>EDIT: {template.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Click a variable to copy it</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Active</span>
          <div onClick={function() { setIsActive(function(v) { return !v; }); }}
            style={{ width: 40, height: 22, borderRadius: 11, background: isActive ? GREEN : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative' as const, transition: 'background 0.2s' }}>
            <div style={{ position: 'absolute' as const, top: 3, left: isActive ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
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
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 0 }}>

        {/* Left: editor */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column' as const, gap: 14, overflow: 'auto' }}>

          {/* Channel tabs */}
          <div style={{ display: 'flex', background: BG3, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content' }}>
            <button onClick={function() { setTab('sms'); }}
              style={{ padding: '8px 20px', background: tab === 'sms' ? BLUE + '25' : 'transparent', border: 'none', color: tab === 'sms' ? BLUE : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <MessageCircle size={14} /> SMS
            </button>
            <button onClick={function() { setTab('wa'); }}
              style={{ padding: '8px 20px', background: tab === 'wa' ? GREEN + '20' : 'transparent', border: 'none', color: tab === 'wa' ? GREEN : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageSquare size={14} /> WhatsApp
            </button>
          </div>

          {/* Edit / Preview toggle */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['edit', 'preview'].map(function(v) {
              return (
                <button key={v} onClick={function() { setView(v as any); }}
                  style={{ padding: '6px 14px', background: view === v ? GOLD_DIM : 'transparent', border: '1px solid ' + (view === v ? GOLD_BDR : 'rgba(255,255,255,0.1)'), borderRadius: 6, color: view === v ? GOLD : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {v === 'edit' ? <><Code2 size={12} /> Edit</> : <><Eye size={12} /> Preview</>}
                </button>
              );
            })}
          </div>

          {/* Variables */}
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>AVAILABLE VARIABLES — click to copy:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
              {template.variables.map(function(v) {
                return (
                  <button key={v} onClick={function() { copyVar(v); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: copied === v ? GREEN + '20' : GOLD_DIM, border: '1px solid ' + (copied === v ? GREEN + '50' : GOLD_BDR), borderRadius: 20, fontSize: 13, color: copied === v ? GREEN : GOLD, cursor: 'pointer', fontFamily: 'monospace', transition: 'all 0.2s' }}>
                    {copied === v ? <Check size={11} /> : <Copy size={11} />}
                    {'{{' + v + '}}'}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 14, color: RED, fontFamily: BARLOW }}>
              {error}
            </div>
          )}

          {/* SMS Editor */}
          {tab === 'sms' && view === 'edit' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>SMS BODY</label>
                <div style={{ fontSize: 13, color: smsChars > 160 ? GOLD : 'rgba(255,255,255,0.4)' }}>
                  {smsChars} chars · {smsSegments} segment{smsSegments > 1 ? 's' : ''}
                  {smsChars > 160 && <span style={{ color: GOLD, marginLeft: 6 }}>⚠ Multi-part SMS</span>}
                </div>
              </div>
              <textarea value={smsBody} onChange={function(e) { setSmsBody(e.target.value); setError(''); }}
                rows={6} maxLength={480}
                style={{ background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, padding: '12px 14px', outline: 'none', resize: 'none' as const, lineHeight: 1.6 }} />
              <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Keep SMS under 160 characters for single-segment delivery. Variables count as ~4 chars each.
              </div>
            </div>
          )}

          {/* SMS Preview */}
          {tab === 'sms' && view === 'preview' && (
            <SmsPhonePreview body={smsBody} type="sms" />
          )}

          {/* WhatsApp Editor */}
          {tab === 'wa' && view === 'edit' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, flex: 1 }}>
              <label style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>WHATSAPP BODY</label>
              <textarea value={waBody} onChange={function(e) { setWaBody(e.target.value); setError(''); }}
                rows={8}
                style={{ background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, padding: '12px 14px', outline: 'none', resize: 'none' as const, lineHeight: 1.6 }} />
              <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                WhatsApp formatting: <strong style={{ color: '#fff' }}>*bold*</strong>, <em style={{ color: '#fff' }}>_italic_</em>, use \n for new lines.
                WhatsApp templates must be pre-approved by Meta before sending to users.
              </div>
            </div>
          )}

          {/* WhatsApp Preview */}
          {tab === 'wa' && view === 'preview' && (
            <SmsPhonePreview body={waBody} type="wa" />
          )}
        </div>

        {/* Right: info panel */}
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', padding: 24, display: 'flex', flexDirection: 'column' as const, gap: 16, overflowY: 'auto' as const, background: BG2 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 16, color: GOLD, letterSpacing: 1 }}>TEMPLATE INFO</div>

          <div style={{ background: BG3, borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>SLUG</div>
              <div style={{ fontSize: 13, color: '#F5F5F5', fontFamily: 'monospace' }}>{template.slug}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>CATEGORY</div>
              <div style={{ fontSize: 13, color: BLUE, textTransform: 'capitalize' as const }}>{template.category}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>DESCRIPTION</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{template.description}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>LAST UPDATED</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{fmtDate(template.updated_at)}</div>
            </div>
          </div>

          <div style={{ background: BG3, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>SMS STATS</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Characters</span>
              <span style={{ fontSize: 14, color: smsChars > 160 ? GOLD : GREEN, fontWeight: 700 }}>{smsChars}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>SMS Segments</span>
              <span style={{ fontSize: 14, color: smsSegments > 1 ? GOLD : GREEN, fontWeight: 700 }}>{smsSegments}</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
              <div style={{ height: '100%', width: Math.min(100, (smsChars / 160) * 100) + '%', background: smsChars > 160 ? GOLD : GREEN, borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>0</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>160</span>
            </div>
          </div>

          <div style={{ background: BG3, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>WHATSAPP NOTE</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              WhatsApp Business API templates require Meta approval before they can be sent to users. Submit templates through your WhatsApp Business provider once a provider is selected.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Main Page */
export default function SmsTemplatesPage() {
  const router = useRouter();
  const [_collapsed,  _setCollapsed]  = useState(false);
  const [templates,   setTemplates]   = useState<SmsTemplate[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [channelTab,  setChannelTab]  = useState<'all' | 'sms' | 'wa'>('all');
  const [editing,     setEditing]     = useState<SmsTemplate | null>(null);
  const [preview,     setPreview]     = useState<{ template: SmsTemplate; type: 'sms' | 'wa' } | null>(null);
  const [toast,       setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [testPhone,   setTestPhone]   = useState('');
  const [testModal,   setTestModal]   = useState<SmsTemplate | null>(null);
  const [testSending, setTestSending] = useState(false);

  async function sendTestSms(template: SmsTemplate, phone: string) {
    if (!phone.trim()) return;
    setTestSending(true);
    try {
      const headers = getAuthHeaders();
      const res = await fetch('/api/admin/sms/test', {
        method: 'POST',
        headers,
        body: JSON.stringify({ template_id: template.id, phone: phone.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Test SMS sent to ' + phone.trim());
        setTestModal(null);
        setTestPhone('');
      } else {
        showToast(data?.error || 'Failed to send test SMS.', 'error');
      }
    } catch {
      showToast('Failed to send test SMS.', 'error');
    }
    setTestSending(false);
  }

  const showToast = function(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
  };

  const fetchTemplates = useCallback(async function() {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const res = await fetch('/api/admin/sms-templates', { headers });
      const data = await res.json();
      if (!res.ok) { showToast('Failed to load templates.', 'error'); }
      else {
        const templates = (data?.data?.templates || []).map(function(t: any) {
          return { ...t, variables: Array.isArray(t.variables) ? t.variables : [] };
        });
        setTemplates(templates);
      }
    } catch {
      showToast('Failed to load templates.', 'error');
    }
    setLoading(false);
  }, []);

  useEffect(function() { fetchTemplates(); }, [fetchTemplates]);

  async function toggleActive(template: SmsTemplate) {
    try {
      const headers = getAuthHeaders();
      const res = await fetch('/api/admin/sms-templates', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ id: template.id, is_active: !template.is_active }),
      });
      if (!res.ok) { showToast('Failed to update.', 'error'); return; }
      setTemplates(function(prev) {
        return prev.map(function(t) { return t.id === template.id ? { ...t, is_active: !t.is_active } : t; });
      });
      showToast(template.name + (template.is_active ? ' deactivated.' : ' activated.'));
    } catch {
      showToast('Failed to update.', 'error');
    }
  }

  function handleSaved(updated: SmsTemplate) {
    setTemplates(function(prev) { return prev.map(function(t) { return t.id === updated.id ? updated : t; }); });
    setEditing(null);
    showToast('Template saved successfully.');
  }

  const filtered = templates.filter(function(t) {
    const q = search.toLowerCase();
    const matchSearch = !search || t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
    // channelTab filter: 'sms' shows only templates with sms_body, 'wa' shows only wa templates
    // Since all templates have both, use category or show all for now
    // Filter by active status tab if needed in future
    return matchSearch;
  });

  const activeCount = templates.filter(function(t) { return t.is_active; }).length;

  const statCards = [
    { label: 'Total Templates', value: templates.length, color: BLUE,   icon: '💬' },
    { label: 'Active',          value: activeCount,       color: GREEN,  icon: '✅' },
    { label: 'Inactive',        value: templates.length - activeCount, color: '#F97316', icon: '⏸️' },
    { label: 'Variables Used',  value: templates.reduce(function(acc, t) { return acc + t.variables.length; }, 0), color: PURPLE, icon: '🔤' },
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
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>SMS / WhatsApp Templates</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: 0 }}>SMS / WhatsApp Templates</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>
                Manage SMS and WhatsApp message templates for all platform notifications.
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
                  <div style={{ fontFamily: BEBAS, fontSize: 34, color: '#F5F5F5', lineHeight: 1 }}>{s.value}</div>
                </div>
              );
            })}
          </div>

          {/* Provider notice */}
          <div style={{ padding: '14px 18px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <MessageCircle size={18} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              <strong style={{ color: GOLD }}>SMS/WhatsApp provider not yet configured.</strong> Templates are ready and saved. Once you select a provider (Twilio, MSG91, etc.) from Settings → SMS/WhatsApp, the sending API will be connected automatically.
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ position: 'relative' as const, flex: 1, maxWidth: 360 }}>
              <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={function(e) { setSearch(e.target.value); }}
                placeholder="Search templates..."
                style={{ width: '100%', padding: '8px 12px 8px 32px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ display: 'flex', background: BG3, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { key: 'all', label: 'All',        icon: null },
                { key: 'sms', label: 'SMS',        icon: <MessageCircle size={13} /> },
                { key: 'wa',  label: 'WhatsApp',   icon: <MessageSquare size={13} /> },
              ].map(function(t) {
                return (
                  <button key={t.key} onClick={function() { setChannelTab(t.key as any); }}
                    style={{ padding: '7px 16px', background: channelTab === t.key ? GOLD_DIM : 'transparent', border: 'none', borderRight: t.key !== 'wa' ? '1px solid rgba(255,255,255,0.08)' : 'none', color: channelTab === t.key ? GOLD : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {t.icon} {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {Array.from({ length: 8 }).map(function(_, i) {
                return <div key={i} style={{ height: 220, background: BG3, borderRadius: 12, opacity: 0.5 }} />;
              })}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
              No templates found.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {filtered.map(function(t) {
                const smsChars = smsLength(t.sms_body);
                return (
                  <div key={t.id} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const, transition: 'border 0.2s' }}
                    onMouseEnter={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                    onMouseLeave={function(e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>

                    {/* Top bar: SMS blue | WA green */}
                    <div style={{ height: 4, background: 'linear-gradient(to right, ' + BLUE + ', ' + GREEN + ')' }} />

                    <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                      {/* Name + toggle */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 17, color: '#F5F5F5', letterSpacing: 0.5, lineHeight: 1.3 }}>{t.name}</div>
                        <div onClick={function() { toggleActive(t); }}
                          style={{ width: 36, height: 20, borderRadius: 10, background: t.is_active ? GREEN : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative' as const, flexShrink: 0, marginTop: 2, transition: 'background 0.2s' }}>
                          <div style={{ position: 'absolute' as const, top: 2, left: t.is_active ? 17 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                        </div>
                      </div>

                      {/* Channel badges */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: BLUE + '20', border: '1px solid ' + BLUE + '40', borderRadius: 10, fontSize: 12, color: BLUE }}>
                          <MessageCircle size={10} /> SMS
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', background: GREEN + '20', border: '1px solid ' + GREEN + '40', borderRadius: 10, fontSize: 12, color: GREEN }}>
                          <MessageSquare size={10} /> WhatsApp
                        </span>
                        <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, fontSize: 12, color: smsChars > 160 ? GOLD : 'rgba(255,255,255,0.4)' }}>
                          {smsChars} chars
                        </span>
                      </div>

                      {/* SMS preview text */}
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, display: '-webkit-box', overflow: 'hidden' }}>
                        {t.sms_body.slice(0, 90)}{t.sms_body.length > 90 ? '...' : ''}
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
                        {t.variables.length > 4 && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', padding: '2px 4px' }}>+{t.variables.length - 4}</span>}
                      </div>

                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 'auto' }}>Updated: {fmtDate(t.updated_at)}</div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8 }}>
                      <button onClick={function() { setEditing(t); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                        onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(212,166,74,0.2)'; }}
                        onMouseLeave={function(e) { e.currentTarget.style.background = GOLD_DIM; }}>
                        <Edit size={13} /> Edit
                      </button>
                      <button onClick={function() { setTestModal(t); setTestPhone(''); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', background: PURPLE + '15', border: '1px solid ' + PURPLE + '40', borderRadius: 7, color: PURPLE, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}
                        onMouseEnter={function(e) { e.currentTarget.style.background = PURPLE + '25'; }}
                        onMouseLeave={function(e) { e.currentTarget.style.background = PURPLE + '15'; }}>
                        <CheckCircle size={13} /> Test
                      </button>
                      <button onClick={function() { setPreview({ template: t, type: 'sms' }); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', background: BLUE + '15', border: '1px solid ' + BLUE + '40', borderRadius: 7, color: BLUE, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}
                        onMouseEnter={function(e) { e.currentTarget.style.background = BLUE + '25'; }}
                        onMouseLeave={function(e) { e.currentTarget.style.background = BLUE + '15'; }}>
                        <MessageCircle size={13} /> SMS
                      </button>
                      <button onClick={function() { setPreview({ template: t, type: 'wa' }); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', background: GREEN + '15', border: '1px solid ' + GREEN + '40', borderRadius: 7, color: GREEN, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}
                        onMouseEnter={function(e) { e.currentTarget.style.background = GREEN + '25'; }}
                        onMouseLeave={function(e) { e.currentTarget.style.background = GREEN + '15'; }}>
                        <MessageSquare size={13} /> WA
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setPreview(null); }}>
          <div style={{ background: BG2, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: 420, padding: 24, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 18, color: GOLD, letterSpacing: 1 }}>
                {preview.type === 'sms' ? 'SMS' : 'WhatsApp'} Preview
              </div>
              <button onClick={function() { setPreview(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                <X size={18} />
              </button>
            </div>
            <SmsPhonePreview body={preview.type === 'sms' ? preview.template.sms_body : preview.template.wa_body} type={preview.type} />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={function() { setPreview({ ...preview, type: 'sms' }); }}
                style={{ flex: 1, padding: '8px', background: preview.type === 'sms' ? BLUE + '20' : 'transparent', border: '1px solid ' + (preview.type === 'sms' ? BLUE : 'rgba(255,255,255,0.1)'), borderRadius: 7, color: preview.type === 'sms' ? BLUE : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <MessageCircle size={13} /> SMS
              </button>
              <button onClick={function() { setPreview({ ...preview, type: 'wa' }); }}
                style={{ flex: 1, padding: '8px', background: preview.type === 'wa' ? GREEN + '20' : 'transparent', border: '1px solid ' + (preview.type === 'wa' ? GREEN : 'rgba(255,255,255,0.1)'), borderRadius: 7, color: preview.type === 'wa' ? GREEN : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <MessageSquare size={13} /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && <EditorModal template={editing} onClose={function() { setEditing(null); }} onSaved={handleSaved} />}

      {/* Send Test SMS Modal */}
      {testModal && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setTestModal(null); }}>
          <div style={{ background: BG2, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: 420, padding: 24, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1 }}>SEND TEST SMS</div>
              <button onClick={function() { setTestModal(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.6 }}>
              Send a test message for <strong style={{ color: '#F5F5F5' }}>{testModal.name}</strong> to a phone number.
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Phone Number (with country code)</label>
              <input
                value={testPhone}
                onChange={function(e) { setTestPhone(e.target.value); }}
                placeholder="+91 98765 43210"
                style={{ width: '100%', padding: '10px 12px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const }}
              />
            </div>
            <div style={{ padding: '10px 14px', background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20, lineHeight: 1.5 }}>
              Note: Twilio trial accounts can only send to verified numbers. Add your number at console.twilio.com first.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={function() { setTestModal(null); }}
                style={{ flex: 1, padding: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={function() { sendTestSms(testModal, testPhone); }} disabled={!testPhone.trim() || testSending}
                style={{ flex: 2, padding: 10, background: !testPhone.trim() || testSending ? PURPLE + '50' : PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: !testPhone.trim() || testSending ? 'not-allowed' : 'pointer' }}>
                {testSending ? 'Sending...' : 'Send Test SMS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast    && <Toast msg={toast.msg} type={toast.type} onDone={function() { setToast(null); }} />}
    </div>
  );
}