"use client"
import AdminSidebar from '@/components/layout/AdminSidebar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminTopnav from '@/components/layout/AdminTopnav'
import {
  Bell, Mail, Copy, Search, Filter, Plus, Send, Clock,
  Eye, Edit, MoreVertical, ChevronRight, Hash, Zap,
  X, Check, AlertCircle, CheckCheck,
} from 'lucide-react'

/* ─── Design tokens ── */
const BG       = '#0D1117'
const BG2      = '#131720'
const BG3      = '#181E2A'
const BG4      = '#1C2338'
const GOLD     = '#D4A64A'
const GOLD_DIM = 'rgba(212,166,74,0.12)'
const GOLD_BDR = 'rgba(212,166,74,0.22)'
const BEBAS    = "'Bebas Neue', sans-serif"
const BARLOW   = "'Barlow Condensed', sans-serif"
const GREEN    = '#22C55E'
const RED      = '#EF4444'
const BLUE     = '#3B82F6'
const PURPLE   = '#8B5CF6'
const ORANGE   = '#F97316'
const TEAL     = '#14B8A6'

/* ─── Types ── */
const TYPE_MAP: Record<string, string> = {
  'Casting Alert':  PURPLE,
  'Account Update': BLUE,
  'Verification':   GREEN,
  'Promotion':      ORANGE,
  'Application':    TEAL,
  'System':         '#6B7280',
  'Announcement':   GOLD,
  'Alert':          RED,
  'Reminder':       '#EC4899',
}
const STATUS_MAP: Record<string, string> = {
  Sent:      GREEN,
  Scheduled: BLUE,
  Draft:     ORANGE,
  Failed:    RED,
}
const CHANNEL_MAP: Record<string, string> = {
  bell: 'In-App',
  mail: 'Email',
  doc:  'Push',
  sms:  'SMS',
}

/* ─── Default notifications ── */
const DEFAULT_NOTIFICATIONS = [
  { id: 1,  active: true,  icon: '📢', title: 'New Casting for You',          sub: 'Check out latest casting matches',    message: 'Hi {{user_name}}, a new casting call matching your profile has just been posted. Check it out and apply before the deadline. Role: {{casting_title}} by {{agency_name}}. Don\'t miss this opportunity!',             type: 'Casting Alert',  audience: 'Aspirants', channels: ['bell','mail','doc'], status: 'Sent',      scheduled: 'May 21, 2025 11:30 AM', by: 'Super Admin',     avatar: 'SA' },
  { id: 2,  active: true,  icon: '👑', title: 'Profile Under Review',         sub: 'Your profile is under verification',  message: 'Hi {{user_name}}, your SilverScreens profile is currently under review by our verification team. You will be notified once the process is complete. This usually takes 1–3 business days.',                                    type: 'Account Update', audience: 'Aspirants', channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 21, 2025 10:45 AM', by: 'Super Admin',     avatar: 'SA' },
  { id: 3,  active: true,  icon: '✅', title: 'Verification Approved',        sub: 'Your profile has been verified',      message: 'Congratulations {{user_name}}! Your SilverScreens profile has been successfully verified. You now have full access to apply for casting calls and your profile is visible to agencies. Welcome aboard!',                   type: 'Verification',   audience: 'All Users', channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 20, 2025 04:15 PM', by: 'Super Admin',     avatar: 'SA' },
  { id: 4,  active: true,  icon: '⭐', title: 'Premium Plan Offer',           sub: 'Upgrade and unlock more features',    message: 'Hi {{user_name}}, unlock more opportunities with our Premium plan! Get unlimited applications, priority listing in search results, direct agency messaging, and exclusive casting call notifications. Upgrade today and take your career to the next level.',  type: 'Promotion',      audience: 'Aspirants', channels: ['bell','mail','doc'], status: 'Scheduled', scheduled: 'May 22, 2025 09:00 AM', by: 'Marketing Admin', avatar: 'MA' },
  { id: 5,  active: true,  icon: '📋', title: 'Application Status Update',    sub: 'Your application status has changed', message: 'Hi {{user_name}}, your application status for {{casting_title}} has been updated to {{app_status}}. Log in to your dashboard to view the full details and any next steps from the agency.',                                  type: 'Application',    audience: 'Aspirants', channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 20, 2025 01:20 PM', by: 'Super Admin',     avatar: 'SA' },
  { id: 6,  active: true,  icon: '🎁', title: 'Refer & Earn Bonus',           sub: 'You have earned a reward!',           message: 'Great news {{user_name}}! You have earned a referral bonus on SilverScreens. Share your referral link with friends and earn rewards for every successful signup. Check your wallet for the bonus amount.',                   type: 'Promotion',      audience: 'All Users', channels: ['bell','mail','doc'], status: 'Sent',      scheduled: 'May 19, 2025 06:10 PM', by: 'Marketing Admin', avatar: 'MA' },
  { id: 7,  active: true,  icon: '🔧', title: 'Maintenance Notice',           sub: 'Scheduled maintenance information',   message: 'Dear {{user_name}}, SilverScreens will be undergoing scheduled maintenance on Saturday, May 18 from 2:00 AM to 4:00 AM IST. During this time, the platform may be temporarily unavailable. We apologise for any inconvenience.', type: 'System',         audience: 'All Users', channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 18, 2025 11:00 AM', by: 'Super Admin',     avatar: 'SA' },
  { id: 8,  active: true,  icon: '🎉', title: 'New Feature Announcement',     sub: 'Introducing Portfolio Private Mode',  message: 'Hi {{user_name}}, we\'re excited to announce Portfolio Private Mode! You can now control who sees your portfolio — set it to public, agency-only, or completely private. Update your privacy settings from your profile page.',     type: 'Announcement',   audience: 'All Users', channels: ['bell','mail','doc'], status: 'Draft',     scheduled: '—',                     by: 'Content Manager', avatar: 'CM' },
  { id: 9,  active: true,  icon: '🚨', title: 'Security Alert',               sub: 'New login detected on your account',  message: 'Hi {{user_name}}, we detected a new login to your SilverScreens account from an unrecognised device. If this was you, no action is needed. If not, please change your password immediately and contact our support team.',       type: 'Alert',          audience: 'Aspirants', channels: ['mail'],              status: 'Failed',    scheduled: 'May 17, 2025 09:35 PM', by: 'System',          avatar: 'SY' },
  { id: 10, active: true,  icon: '📅', title: 'Webinar Reminder',             sub: "Don't miss our acting workshop",      message: 'Hi {{user_name}}, just a reminder that our free Acting Workshop webinar starts tomorrow at 5:00 PM IST. Learn from industry professionals, get tips on audition techniques, and connect with fellow artists. Register now to secure your spot!',  type: 'Reminder',       audience: 'Aspirants', channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 16, 2025 05:00 PM', by: 'Marketing Admin', avatar: 'MA' },
  { id: 11, active: true,  icon: '📢', title: 'Agency Casting Approved',      sub: 'Your casting call is now live',       message: 'Hi {{user_name}}, your casting call "{{casting_title}}" has been reviewed and approved by the SilverScreens team. It is now live on the platform and visible to all matching aspirants. You can manage applications from your dashboard.',  type: 'Casting Alert',  audience: 'Agencies',  channels: ['bell','mail'],       status: 'Sent',      scheduled: 'May 15, 2025 02:30 PM', by: 'Super Admin',     avatar: 'SA' },
  { id: 12, active: true,  icon: '💳', title: 'Subscription Expiry Reminder', sub: 'Your plan expires in 7 days',         message: 'Hi {{user_name}}, your {{plan_name}} subscription on SilverScreens will expire in 7 days on {{expiry_date}}. Renew now to avoid any interruption to your profile visibility and application access. Click below to renew.',              type: 'Account Update', audience: 'All Users', channels: ['bell','mail','doc'], status: 'Scheduled', scheduled: 'May 23, 2025 08:00 AM', by: 'System',          avatar: 'SY' },
]

type Notif = typeof DEFAULT_NOTIFICATIONS[0]

const TABS = ['All Notifications', 'Scheduled', 'Sent', 'Drafts', 'Failed']

/* ─── Donut ── */
function NotifDonut({ items }: { items: Notif[] }) {
  const types = Object.keys(TYPE_MAP)
  const counts = types.map(t => ({ label: t, value: items.filter(n => n.type === t).length, color: TYPE_MAP[t] })).filter(d => d.value > 0)
  const total = counts.reduce((a, d) => a + d.value, 0) || 1
  const data = counts.map(d => ({ ...d, pct: (d.value / total) * 100 }))
  const cx = 70, cy = 70, R = 58, r = 36
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const pt = (a: number, rad: number): [number, number] => [cx + rad * Math.cos(toRad(a)), cy + rad * Math.sin(toRad(a))]
  let start = -90
  const arcs = data.map(seg => {
    const sweep = (seg.pct / 100) * 360
    const end = start + sweep
    const large = sweep > 180 ? 1 : 0
    const [x1, y1] = pt(start, R); const [x2, y2] = pt(end, R)
    const [x3, y3] = pt(end, r);   const [x4, y4] = pt(start, r)
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`
    start = end + 1
    return { ...seg, d }
  })
  return (
    <svg viewBox="0 0 140 140" style={{ width: 130, height: 130, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r - 1} fill={BG3} />
      {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} />)}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={10} fontFamily={BARLOW}>Total</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#F5F5F5" fontSize={20} fontWeight={800} fontFamily={BEBAS}>{total}</text>
    </svg>
  )
}

/* ─── Channel icons ── */
function ChannelIcons({ channels }: { channels: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {channels.includes('bell') && <Bell size={13} color="rgba(255,255,255,0.5)" />}
      {channels.includes('mail') && <Mail size={13} color="rgba(255,255,255,0.5)" />}
      {channels.includes('doc')  && <Copy size={13} color="rgba(255,255,255,0.5)" />}
    </div>
  )
}

/* ─── Toast ── */
function Toast({ msg, color, onClose }: { msg: string; color: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: BG4, border: `1px solid ${color}44`, borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', fontFamily: BARLOW, fontSize: 15, color: '#F5F5F5', maxWidth: 360 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 2 }}><X size={14} /></button>
    </div>
  )
}

/* ─── View / Edit Modal ── */
function NotifModal({ notif, mode: initMode, onClose, onSave }: {
  notif: Notif; mode: 'view'|'edit'; onClose: () => void
  onSave: (updated: Notif) => void
}) {
  const [mode,     setMode]    = useState<'view'|'edit'>(initMode)
  const [draft,    setDraft]   = useState({ ...notif })
  const [charsLeft, setCharsLeft] = useState(500 - ((notif as any).message?.length || 0))
  const accentColor = TYPE_MAP[(notif as any).type] || PURPLE

  const inp: React.CSSProperties = {
    width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '8px 11px',
    outline: 'none', boxSizing: 'border-box' as const,
  }
  const CHANNEL_OPTIONS = [
    { key: 'bell', icon: <Bell size={13}/>,  label: 'In-App' },
    { key: 'mail', icon: <Mail size={13}/>,  label: 'Email'  },
    { key: 'doc',  icon: <Copy size={13}/>,  label: 'Push'   },
  ]
  const toggleCh = (k: string) => {
    const chs = draft.channels.includes(k)
      ? draft.channels.filter((c:string) => c !== k)
      : [...draft.channels, k]
    setDraft({ ...draft, channels: chs })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ background: BG2, border: `1px solid ${accentColor}33`, borderRadius: 16, width: 580, maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: `0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px ${accentColor}22` }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '18px 22px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 11, background: `${accentColor}20`, border: `1px solid ${accentColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{notif.icon}</div>
              <div>
                <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5 }}>{mode === 'view' ? notif.title : 'Edit Notification'}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{mode === 'view' ? notif.sub : 'Modify content, audience and channels'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {/* View / Edit tabs */}
              {['view','edit'].map(m => (
                <button key={m} onClick={() => { setMode(m as 'view'|'edit'); setDraft({ ...notif }) }}
                  style={{ padding: '5px 14px', background: mode === m ? accentColor : 'transparent', border: `1px solid ${mode === m ? accentColor : 'rgba(255,255,255,0.15)'}`, borderRadius: 6, color: mode === m ? '#000' : 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' as const }}>
                  {m === 'view' ? <><Eye size={12} style={{ verticalAlign: 'middle', marginRight: 4 }}/>View</> : <><Edit size={12} style={{ verticalAlign: 'middle', marginRight: 4 }}/>Edit</>}
                </button>
              ))}
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', marginLeft: 4 }}><X size={18} /></button>
            </div>
          </div>
          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, ${accentColor}44, transparent)`, marginBottom: 0 }}/>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', padding: '18px 22px', flex: 1 }}>

          {/* ── VIEW MODE ── */}
          {mode === 'view' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Message body */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Message Content</div>
                <div style={{ fontSize: 15, color: '#F5F5F5', lineHeight: 1.65 }}>{(notif as any).message || <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No message body set — click Edit to add one.</span>}</div>
              </div>
              {/* Meta fields */}
              {[
                ['Type',      notif.type],
                ['Audience',  notif.audience],
                ['Status',    notif.status],
                ['Active',    (notif as any).active !== false ? '✅ Active' : '⏸ Deactivated'],
                ['Channels',  notif.channels.map((c: string) => CHANNEL_MAP[c] || c).join(', ')],
                ['Scheduled', notif.scheduled],
                ['Sent By',   notif.by],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 14 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                  <span style={{ color: '#F5F5F5', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── EDIT MODE ── */}
          {mode === 'edit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Title */}
              <div>
                <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 5 }}>Title <span style={{ color: RED }}>*</span></label>
                <input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}
                  maxLength={80} style={inp} placeholder="Notification title…"/>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'right', marginTop: 3 }}>{draft.title.length}/80</div>
              </div>

              {/* Sub-title */}
              <div>
                <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 5 }}>Sub-title / Preview text</label>
                <input value={draft.sub} onChange={e => setDraft({ ...draft, sub: e.target.value })}
                  maxLength={120} style={inp} placeholder="Short preview shown in notification list…"/>
              </div>

              {/* Message body */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Message Body <span style={{ color: RED }}>*</span></label>
                  <span style={{ fontSize: 11, color: charsLeft < 50 ? RED : 'rgba(255,255,255,0.3)' }}>{charsLeft} chars left</span>
                </div>
                <textarea value={(draft as any).message || ''} rows={5}
                  onChange={e => { setDraft({ ...draft, message: e.target.value } as any); setCharsLeft(500 - e.target.value.length) }}
                  maxLength={500}
                  style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.6 }}
                  placeholder="Full notification message. Use {{user_name}}, {{casting_title}}, {{plan_name}}, {{expiry_date}} etc."/>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                  Tip: use variables like <span style={{ color: PURPLE }}>{'{{user_name}}'}</span>, <span style={{ color: PURPLE }}>{'{{casting_title}}'}</span>, <span style={{ color: PURPLE }}>{'{{plan_name}}'}</span>
                </div>
              </div>

              {/* Type + Audience row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 5 }}>Type</label>
                  <select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}
                    style={{ ...inp, appearance: 'none', cursor: 'pointer' }}>
                    {Object.keys(TYPE_MAP).map(t => <option key={t} style={{ background: BG3 }}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 5 }}>Audience</label>
                  <select value={draft.audience} onChange={e => setDraft({ ...draft, audience: e.target.value })}
                    style={{ ...inp, appearance: 'none', cursor: 'pointer' }}>
                    {['All Users','Aspirants','Agencies'].map(a => <option key={a} style={{ background: BG3 }}>{a}</option>)}
                  </select>
                </div>
              </div>

              {/* Channels */}
              <div>
                <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>Delivery Channels</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {CHANNEL_OPTIONS.map(ch => {
                    const on = draft.channels.includes(ch.key)
                    return (
                      <button key={ch.key} onClick={() => toggleCh(ch.key)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', background: on ? `${PURPLE}22` : BG3, border: `1px solid ${on ? PURPLE : 'rgba(255,255,255,0.1)'}`, borderRadius: 7, color: on ? PURPLE : 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 14, fontWeight: on ? 700 : 400, cursor: 'pointer' }}>
                        {ch.icon} {ch.label}
                        {on && <Check size={11} color={PURPLE}/>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 5 }}>Status</label>
                <select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })}
                  style={{ ...inp, appearance: 'none', cursor: 'pointer' }}>
                  {['Draft','Scheduled','Sent','Failed'].map(s => <option key={s} style={{ background: BG3 }}>{s}</option>)}
                </select>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0 }}>
          {mode === 'view' ? (
            <>
              <button onClick={() => setMode('edit')}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: accentColor, border: 'none', borderRadius: 8, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                <Edit size={14}/> Edit Notification
              </button>
              <button onClick={onClose}
                style={{ padding: '9px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                Close
              </button>
            </>
          ) : (
            <>
              <button onClick={() => {
                  if (!draft.title.trim()) return alert('Title is required.')
                  if (!(draft as any).message?.trim()) return alert('Message body is required.')
                  onSave(draft)
                  setMode('view')
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', background: GREEN, border: 'none', borderRadius: 8, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                <Check size={14}/> Save Changes
              </button>
              <button onClick={() => { setDraft({ ...notif }); setMode('view') }}
                style={{ padding: '9px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Variables Panel ── */
function VariablesPanel({ onClose }: { onClose: () => void }) {
  const vars = [
    { v: '{{user_name}}',      desc: 'Full name of the recipient' },
    { v: '{{casting_title}}',  desc: 'Title of the casting call' },
    { v: '{{agency_name}}',    desc: 'Name of the casting agency' },
    { v: '{{plan_name}}',      desc: 'Subscription plan name' },
    { v: '{{expiry_date}}',    desc: 'Subscription expiry date' },
    { v: '{{app_status}}',     desc: 'Application status (Shortlisted, Rejected)' },
    { v: '{{platform_name}}',  desc: 'SilverScreens' },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 28, width: 460, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }} onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 8 }}><Hash size={18} color={PURPLE} /> Message Variables</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>Use these variables in notification messages to personalise content for each recipient.</p>
        {vars.map(({ v, desc }) => (
          <div key={v} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <code style={{ fontSize: 13, color: PURPLE, fontWeight: 700, background: `${PURPLE}15`, padding: '2px 8px', borderRadius: 5 }}>{v}</code>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'right', maxWidth: 220 }}>{desc}</span>
          </div>
        ))}
        <button onClick={onClose} style={{ marginTop: 20, width: '100%', padding: '10px', background: PURPLE, border: 'none', borderRadius: 8, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Got it</button>
      </div>
    </div>
  )
}

/* ══ MAIN ══ */
export default function NotificationsManagementPage() {
  const router = useRouter()
  const [sidebarOpen,    setSidebarOpen]    = useState(false)
  const [activeTab,      setActiveTab]      = useState('All Notifications')
  const [search,         setSearch]         = useState('')
  const [typeFilter,     setTypeFilter]     = useState('All Types')
  const [segmentFilter,  setSegmentFilter]  = useState('All Segments')
  const [channelFilter,  setChannelFilter]  = useState('All Channels')
  const [statusFilter,   setStatusFilter]   = useState('All Status')
  const [page,           setPage]           = useState(1)
  const [perPage,        setPerPage]        = useState(10)
  const [actionMenu,     setActionMenu]     = useState<number | null>(null)
  const [items,          setItems]          = useState<Notif[]>(DEFAULT_NOTIFICATIONS)
  const [toast,          setToast]          = useState<{ msg: string; color: string } | null>(null)
  const [viewNotif,      setViewNotif]      = useState<Notif | null>(null)
  const [editNotif,      setEditNotif]      = useState<Notif | null>(null)
  const [showVars,       setShowVars]       = useState(false)
  const [flashId,        setFlashId]        = useState<number | null>(null)

  /* Load from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ss_notifications')
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  /* Persist + toast helper */
  const persist = (next: Notif[], msg: string, color = GREEN) => {
    setItems(next)
    localStorage.setItem('ss_notifications', JSON.stringify(next))
    setToast({ msg, color })
  }

  const flash = (id: number) => { setFlashId(id); setTimeout(() => setFlashId(null), 1500) }

  /* Actions */
  const sendNow = (n: Notif) => {
    if (!(n as any).active) {
      setToast({ msg: `"${n.title}" is deactivated — activate it first before sending.`, color: ORANGE })
      setActionMenu(null); return
    }
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    const next = items.map(i => i.id === n.id ? { ...i, status: 'Sent', scheduled: now } : i)
    persist(next, `"${n.title}" sent successfully.`, GREEN)
    flash(n.id); setActionMenu(null)
  }

  const toggleActive = (n: Notif) => {
    const isActive = (n as any).active !== false
    const next = items.map(i => i.id === n.id ? { ...i, active: !isActive } : i)
    persist(next,
      isActive
        ? `"${n.title}" deactivated — it will not be sent.`
        : `"${n.title}" activated — ready to send.`,
      isActive ? ORANGE : GREEN
    )
    setActionMenu(null)
  }

  const deleteItem = (n: Notif) => {
    if (!confirm(`Delete "${n.title}"? This cannot be undone.`)) return
    persist(items.filter(i => i.id !== n.id), `"${n.title}" deleted.`, RED)
    setActionMenu(null)
  }

  const duplicateItem = (n: Notif) => {
    const newId = Math.max(...items.map(i => i.id)) + 1
    const copy: Notif = { ...n, id: newId, title: `${n.title} (Copy)`, status: 'Draft', scheduled: '—', by: 'Super Admin', avatar: 'SA' }
    const next = [...items, copy]
    persist(next, `"${n.title}" duplicated as Draft.`, BLUE)
    flash(newId); setActionMenu(null)
  }

  const markFailed = (n: Notif) => {
    const next = items.map(i => i.id === n.id ? { ...i, status: 'Failed' } : i)
    persist(next, `"${n.title}" marked as Failed.`, RED)
    setActionMenu(null)
  }

  const saveEdit = (updated: Notif) => {
    const next = items.map(i => i.id === updated.id ? updated : i)
    persist(next, `"${updated.title}" updated successfully.`, GREEN)
    setViewNotif(updated)
    setEditNotif(null)
    flash(updated.id)
  }
  const filtered = items.filter(n => {
    const matchTab     = activeTab === 'All Notifications'
      || (activeTab === 'Sent'      && n.status === 'Sent')
      || (activeTab === 'Scheduled' && n.status === 'Scheduled')
      || (activeTab === 'Drafts'    && n.status === 'Draft')
      || (activeTab === 'Failed'    && n.status === 'Failed')
    const matchSearch  = n.title.toLowerCase().includes(search.toLowerCase()) || n.sub.toLowerCase().includes(search.toLowerCase())
    const matchType    = typeFilter    === 'All Types'    || n.type     === typeFilter
    const matchSegment = segmentFilter === 'All Segments' || n.audience === segmentFilter
    const matchChannel = channelFilter === 'All Channels'
      || (channelFilter === 'In-App' && n.channels.includes('bell'))
      || (channelFilter === 'Email'  && n.channels.includes('mail'))
      || (channelFilter === 'Push'   && n.channels.includes('doc'))
      || (channelFilter === 'SMS'    && n.channels.includes('sms'))
    const matchStatus  = statusFilter  === 'All Status'   || n.status   === statusFilter
    return matchTab && matchSearch && matchType && matchSegment && matchChannel && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)
  const clearFilters = () => { setSearch(''); setTypeFilter('All Types'); setSegmentFilter('All Segments'); setChannelFilter('All Channels'); setStatusFilter('All Status'); setPage(1) }

  /* Computed stats from real data */
  const totalCount     = items.length
  const sentCount      = items.filter(n => n.status === 'Sent').length
  const scheduledCount = items.filter(n => n.status === 'Scheduled').length
  const failedCount    = items.filter(n => n.status === 'Failed').length
  const deliveredPct   = sentCount > 0 ? Math.round((sentCount / totalCount) * 100) : 0

  /* Channel stats from real data */
  const channelStats = [
    { icon: '🔔', label: 'In-App',           count: items.filter(n => n.channels.includes('bell')).length, color: PURPLE },
    { icon: '📧', label: 'Email',            count: items.filter(n => n.channels.includes('mail')).length, color: BLUE   },
    { icon: '📱', label: 'Push Notification', count: items.filter(n => n.channels.includes('doc')).length,  color: RED    },
    { icon: '💬', label: 'SMS',              count: items.filter(n => n.channels.includes('sms')).length,  color: ORANGE },
  ]
  const maxCh = Math.max(...channelStats.map(c => c.count), 1)

  const selStyle: React.CSSProperties = {
    background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, padding: '7px 26px 7px 10px',
    outline: 'none', cursor: 'pointer', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '10px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }} onClick={function() { actionMenu !== null && setActionMenu(null); }}>

      <AdminTopnav />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar onCollapse={function(c) { setSidebarOpen(!c); }} />

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={function() { router.push('/admin/dashboard'); }} style={{ cursor: 'pointer' }}
                  onMouseEnter={function(e) { (e.currentTarget.style.color = '#fff'); }}
                  onMouseLeave={function(e) { (e.currentTarget.style.color = 'rgba(255,255,255,0.4)'); }}
                >Home</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Notifications Management</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                Notifications Management
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE, display: 'inline-block', marginBottom: 4 }} />
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>Create, manage and track notifications across the SilverScreens platform.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={function() { setToast({ msg: 'Test notification sent to ADM000001.', color: GREEN }) }}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <Send size={14} /> Test Notification
              </button>
              <button
                onClick={function() { setToast({ msg: 'Create New Notification — Rich text editor coming in next update.', color: PURPLE }); }}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
                <Plus size={15} /> Create New Notification
              </button>
            </div>
          </div>

          {/* Stat cards — computed from real data */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: '📬', label: 'Total Notifications', value: totalCount,     sub: 'All time',                    color: PURPLE },
              { icon: '📤', label: 'Sent',                value: sentCount,      sub: `${totalCount > 0 ? Math.round(sentCount/totalCount*100) : 0}% of total`, color: BLUE   },
              { icon: '📅', label: 'Scheduled',           value: scheduledCount, sub: 'Pending delivery',            color: ORANGE },
              { icon: '✅', label: 'Delivered',           value: sentCount,      sub: `${deliveredPct}% delivery rate`, color: GREEN  },
              { icon: '❌', label: 'Failed',              value: failedCount,    sub: `${totalCount > 0 ? Math.round(failedCount/totalCount*100) : 0}% of total`, color: RED    },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#F5F5F5', lineHeight: 1, letterSpacing: 0.5 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main area */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

            {/* LEFT — Table */}
            <div style={{ display: 'flex', flexDirection: 'column', background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>

              {/* Filters */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={function(e) { setSearch(e.target.value); setPage(1) }}
                    placeholder="Search by title or message..."
                    style={{ width: '100%', padding: '7px 10px 7px 28px', background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <select value={typeFilter} onChange={function(e) { setTypeFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Types','Casting Alert','Account Update','Verification','Promotion','Application','System','Announcement','Alert','Reminder'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={segmentFilter} onChange={function(e) { setSegmentFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Segments','Aspirants','Agencies','All Users'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={channelFilter} onChange={function(e) { setChannelFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Channels','In-App','Email','Push','SMS'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <select value={statusFilter} onChange={function(e) { setStatusFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Status','Sent','Scheduled','Draft','Failed'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>
                <button onClick={clearFilters} style={{ padding: '7px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>Clear Filters</button>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', background: BG2 }}>
                {TABS.map(t => {
                  const count = t === 'All Notifications' ? items.length
                    : t === 'Sent' ? sentCount : t === 'Scheduled' ? scheduledCount
                    : t === 'Drafts' ? items.filter(n => n.status === 'Draft').length
                    : failedCount
                  return (
                    <button key={t} onClick={function() { setActiveTab(t); setPage(1) }} style={{ padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: BARLOW, fontSize: 15, fontWeight: activeTab === t ? 700 : 400, color: activeTab === t ? PURPLE : 'rgba(255,255,255,0.5)', borderBottom: activeTab === t ? `2px solid ${PURPLE}` : '2px solid transparent', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {t}
                      <span style={{ fontSize: 12, background: activeTab === t ? `${PURPLE}30` : 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 10, color: activeTab === t ? PURPLE : 'rgba(255,255,255,0.4)' }}>{count}</span>
                    </button>
                  )
                })}
              </div>

              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 0.8fr 0.8fr 0.7fr 0.65fr 1.3fr 0.9fr 0.9fr', padding: '9px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2 }}>
                {['Title','Type','Audience','Channel','Status','Active','Scheduled / Sent','Sent By','Actions'].map(h => (
                  <div key={h} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {paginated.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No notifications match the current filters.</div>
              ) : paginated.map((n, i) => {
                const isActive = (n as any).active !== false
                return (
                <div key={n.id} style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 0.8fr 0.8fr 0.7fr 0.65fr 1.3fr 0.9fr 0.9fr', padding: '10px 16px', borderBottom: i < paginated.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.3s', background: flashId === n.id ? 'rgba(34,197,94,0.07)' : 'transparent', opacity: isActive ? 1 : 0.45 }}
                  onMouseEnter={function(e) { if (flashId !== n.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={function(e) { if (flashId !== n.id) e.currentTarget.style.background = 'transparent' }}
                >
                  {/* Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${TYPE_MAP[n.type]||PURPLE}20`, border: `1px solid ${TYPE_MAP[n.type]||PURPLE}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{n.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.sub}</div>
                    </div>
                  </div>
                  {/* Type */}
                  <div><span style={{ padding: '3px 9px', background: `${TYPE_MAP[n.type]}22`, border: `1px solid ${TYPE_MAP[n.type]}44`, borderRadius: 12, fontSize: 12, color: TYPE_MAP[n.type], fontWeight: 600, whiteSpace: 'nowrap' }}>{n.type}</span></div>
                  {/* Audience */}
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{n.audience}</div>
                  {/* Channels */}
                  <div><ChannelIcons channels={n.channels} /></div>
                  {/* Status */}
                  <div><span style={{ padding: '3px 9px', background: `${STATUS_MAP[n.status]}22`, border: `1px solid ${STATUS_MAP[n.status]}44`, borderRadius: 12, fontSize: 12, color: STATUS_MAP[n.status], fontWeight: 600 }}>{n.status}</span></div>
                  {/* Active toggle */}
                  <div>
                    <button
                      onClick={function(e) { e.stopPropagation(); toggleActive(n); }}
                      title={isActive ? 'Click to deactivate' : 'Click to activate'}
                      style={{ position: 'relative', width: 38, height: 21, borderRadius: 11, border: 'none', cursor: 'pointer', background: isActive ? GREEN : 'rgba(255,255,255,0.15)', transition: 'background 0.2s', flexShrink: 0, padding: 0 }}>
                      <span style={{ position: 'absolute', top: 2, left: isActive ? 19 : 2, width: 17, height: 17, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}/>
                    </button>
                  </div>
                  {/* Scheduled */}
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{n.scheduled}</div>
                  {/* Sent By */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{n.avatar}</div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.by}</span>
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
                    <button onClick={function() { setViewNotif(n); }} title="View" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={function(e) { (e.currentTarget.style.background = 'rgba(255,255,255,0.08)'); }}
                      onMouseLeave={function(e) { (e.currentTarget.style.background = 'transparent'); }}
                    ><Eye size={14} /></button>
                    <button onClick={function() { duplicateItem(n); }} title="Duplicate" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={function(e) { (e.currentTarget.style.background = 'rgba(255,255,255,0.08)'); }}
                      onMouseLeave={function(e) { (e.currentTarget.style.background = 'transparent'); }}
                    ><Copy size={14} /></button>
                    <div style={{ position: 'relative' }}>
                      <button onClick={function(e) { e.stopPropagation(); setActionMenu(actionMenu === n.id ? null : n.id) }} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                        onMouseEnter={function(e) { (e.currentTarget.style.background = 'rgba(255,255,255,0.08)'); }}
                        onMouseLeave={function(e) { (e.currentTarget.style.background = 'transparent'); }}
                      ><MoreVertical size={14} /></button>
                      {actionMenu === n.id && (
                        <div style={{ position: 'absolute', right: 0, top: 32, width: 180, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} onClick={function(e) { e.stopPropagation(); }}>
                          {[
                            { label: n.status === 'Draft' ? 'Send Now' : 'Resend', action: () => sendNow(n), disabled: !isActive },
                            { label: isActive ? '⏸ Deactivate' : '▶ Activate', action: () => toggleActive(n), accent: isActive ? ORANGE : GREEN },
                            { label: 'View Details',   action: () => { setViewNotif(n); setActionMenu(null) } },
                            { label: 'Edit',           action: () => { setEditNotif(n); setActionMenu(null) }, accent: BLUE },
                            { label: 'View Analytics', action: () => { router.push('/admin/analytics'); setActionMenu(null) } },
                            { label: 'View History',   action: () => { router.push('/admin/audit'); setActionMenu(null) } },
                            { label: 'Delete',         action: () => deleteItem(n), danger: true },
                          ].map(m => (
                            <div key={m.label} onClick={(m as any).disabled ? undefined : m.action}
                              style={{ padding: '9px 14px', fontSize: 14, cursor: (m as any).disabled ? 'not-allowed' : 'pointer', color: (m as any).danger ? RED : (m as any).accent || '#F5F5F5', opacity: (m as any).disabled ? 0.4 : 1 }}
                              onMouseEnter={function(e) { if (!(m as any).disabled) (e.currentTarget.style.background = 'rgba(255,255,255,0.06)'); }}
                              onMouseLeave={function(e) { (e.currentTarget.style.background = 'transparent'); }}
                            >{m.label}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}

              {/* Pagination */}
              <div style={{ padding: '11px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG2 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                  Showing {filtered.length === 0 ? 0 : Math.min((page-1)*perPage+1, filtered.length)} to {Math.min(page*perPage, filtered.length)} of {filtered.length} entries
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={function() { setPage(function(p) { return Math.max(1,p-1); }); }} disabled={page===1}
                    style={{ width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:6, color: page===1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page===1 ? 'not-allowed' : 'pointer', fontSize:16 }}>‹</button>
                  {Array.from({ length: Math.min(totalPages,9) }, (_,i) => i+1).map(p => (
                    <button key={p} onClick={function() { setPage(p); }}
                      style={{ width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', background: p===page ? PURPLE : 'transparent', border:`1px solid ${p===page ? PURPLE : 'rgba(255,255,255,0.12)'}`, borderRadius:6, color: p===page ? '#fff' : '#F5F5F5', cursor:'pointer', fontFamily:BARLOW, fontSize:14, fontWeight: p===page ? 700 : 400 }}>{p}</button>
                  ))}
                  <button onClick={function() { setPage(function(p) { return Math.min(totalPages,p+1); }); }} disabled={page===totalPages||totalPages===0}
                    style={{ width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:6, color: (page===totalPages||totalPages===0) ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor:(page===totalPages||totalPages===0) ? 'not-allowed':'pointer', fontSize:16 }}>›</button>
                  <select value={perPage} onChange={function(e) { setPerPage(Number(e.target.value)); setPage(1) }} style={{ ...selStyle, fontSize:13, padding:'5px 24px 5px 8px' }}>
                    {[10,25,50].map(n => <option key={n} style={{ background:BG3 }}>{n} / page</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Donut — computed from real data */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5', marginBottom: 14 }}>Notification Summary</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <NotifDonut items={items} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    {Object.entries(TYPE_MAP).filter(([t]) => items.some(n => n.type === t)).map(([t, color]) => {
                      const count = items.filter(n => n.type === t).length
                      const pct = ((count / totalCount) * 100).toFixed(1)
                      return (
                        <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                          </div>
                          <span style={{ fontSize: 12, color: '#F5F5F5', fontWeight: 600 }}>{count} ({pct}%)</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Total</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>{totalCount}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5', marginBottom: 12 }}>Quick Actions</div>
                {[
                  { label: 'Create New Notification',      icon: Plus,  action: () => setToast({ msg: 'Rich text editor coming in next update.', color: PURPLE }) },
                  { label: 'Send Test Notification',       icon: Send,  action: () => setToast({ msg: 'Test notification sent to ADM000001.', color: GREEN }) },
                  { label: 'View Scheduled Notifications', icon: Clock, action: () => { setActiveTab('Scheduled'); setPage(1) } },
                  { label: 'Notification Templates',       icon: Copy,  action: () => setToast({ msg: 'Templates manager coming in next update.', color: BLUE }) },
                  { label: 'Message Variables',            icon: Hash,  action: () => setShowVars(true) },
                ].map(qa => (
                  <div key={qa.label} onClick={qa.action}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                    onMouseEnter={function(e) { (e.currentTarget.style.background = 'rgba(255,255,255,0.03)'); }}
                    onMouseLeave={function(e) { (e.currentTarget.style.background = 'transparent'); }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: `${PURPLE}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <qa.icon size={13} color={PURPLE} />
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{qa.label}</span>
                  </div>
                ))}
              </div>

              {/* Channels — computed from real data */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5', marginBottom: 12 }}>Notification Channels</div>
                {channelStats.map(ch => (
                  <div key={ch.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 15 }}>{ch.icon}</span>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{ch.label}</span>
                      </div>
                      <span style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{ch.count} ({totalCount > 0 ? Math.round(ch.count/totalCount*100) : 0}%)</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${maxCh > 0 ? (ch.count/maxCh)*100 : 0}%`, background: ch.color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                  <Zap size={15} color={GOLD} />
                  <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5' }}>Tips</div>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: '0 0 10px' }}>
                  Use variables like <span style={{ color: PURPLE, fontWeight: 600 }}>{'{{user_name}}'}</span>, <span style={{ color: PURPLE, fontWeight: 600 }}>{'{{casting_title}}'}</span>, <span style={{ color: PURPLE, fontWeight: 600 }}>{'{{agency_name}}'}</span> to personalise your messages.
                </p>
                <span onClick={function() { setShowVars(true); }} style={{ fontSize: 14, color: PURPLE, cursor: 'pointer', fontWeight: 600 }}>View All Variables →</span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewNotif && (
        <NotifModal notif={viewNotif} mode="view" onClose={() => setViewNotif(null)}
          onSave={updated => { saveEdit(updated); setViewNotif(updated) }} />
      )}
      {editNotif && (
        <NotifModal notif={editNotif} mode="edit" onClose={() => setEditNotif(null)}
          onSave={updated => { saveEdit(updated); setEditNotif(null) }} />
      )}
      {showVars   && <VariablesPanel onClose={function() { setShowVars(false); }} />}
      {toast      && <Toast msg={toast.msg} color={toast.color} onClose={function() { setToast(null); }} />}

    </div>
  )
}