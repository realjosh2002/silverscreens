'use client';
import React from 'react';

import AgencyTopnav from '@/components/layout/AgencyTopnav'
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronLeft, ChevronRight, Menu,
  User, Lock, BellRing, Mail, Shield, Users, CreditCard,
  Sliders, Puzzle, Edit, X, Check, Plus, Trash2, Upload,
  ExternalLink, FileCheck, AlertCircle,
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
  { icon: MessageSquare,   label: 'Messages',                href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications',           href: '/agency/notifications' },
];

const PROFILE_MENU = [
  { label: 'Reports & Analytics',    href: '/agency/reports'      },
  { label: 'Subscription & Billing', href: '/agency/subscription' },
  { label: 'Company Profile',        href: '/agency-profile'      },
  { label: 'Documents',              href: '/agency/documents'    },
  { label: 'Calendar',               href: '/agency/calendar'     },
  { label: 'Settings',               href: '/agency/settings'     },
  { label: 'Support',                href: '/agency/support'      },
  { label: 'Logout',                 href: '/login'               },
];

type Section = 'profile'|'security'|'notifications'|'email'|'privacy'|'team'|'billing'|'preferences'|'integrations'|'documents';

const SETTINGS_NAV: { key: Section; label: string; icon: any }[] = [
  { key:'profile',       label:'Profile & Company',       icon: User       },
  { key:'security',      label:'Account & Security',      icon: Lock       },
  { key:'notifications', label:'Notifications',           icon: BellRing   },
  { key:'email',         label:'Email Preferences',       icon: Mail       },
  { key:'privacy',       label:'Privacy',                 icon: Shield     },
  { key:'team',          label:'Team & Permissions',      icon: Users      },
  { key:'billing',       label:'Billing & Subscription',  icon: CreditCard },
  { key:'preferences',   label:'Other Preferences',       icon: Sliders    },
  { key:'integrations',  label:'Integrations',            icon: Puzzle     },
  { key:'documents',     label:'Documents & Verification',icon: FileCheck  },
];

/* ── Helpers ── */
function getAuth() {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return { token: u.token ?? '', email: u.email ?? '' };
  } catch { return { token: '', email: '' }; }
}
function authHeaders() {
  const { token } = getAuth();
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

/* ── Shared UI ── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{ width:44, height:24, borderRadius:12, background:on?GREEN:'rgba(255,255,255,0.1)', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <div style={{ position:'absolute', top:2, left:on?22:2, width:20, height:20, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }} />
    </div>
  );
}

function SettingRow({ label, value, sub, onClick, danger, badge }: { label:string; value?:string; sub?:string; onClick?:()=>void; danger?:boolean; badge?:string }) {
  return (
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', cursor:onClick?'pointer':'default' }}
      onMouseEnter={e => { if(onClick)(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.02)'; }}
      onMouseLeave={e => { if(onClick)(e.currentTarget as HTMLDivElement).style.background='transparent'; }}
    >
      <div>
        <div style={{ fontFamily:BARLOW, fontSize:15, color:danger?RED:'#F5F5F5', fontWeight:600 }}>{label}</div>
        {sub && <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{sub}</div>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {badge && <span style={{ padding:'2px 10px', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:20, fontFamily:BARLOW, fontSize:14, color:GREEN, fontWeight:600 }}>{badge}</span>}
        {value && <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.45)' }}>{value}</span>}
        {onClick && <ChevronRight size={16} color="rgba(255,255,255,0.3)" />}
      </div>
    </div>
  );
}

function Card({ icon, iconColor, title, desc, children }: { icon:React.ReactNode; iconColor:string; title:string; desc:string; children:React.ReactNode }) {
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ width:44, height:44, borderRadius:10, background:`${iconColor}15`, border:`1px solid ${iconColor}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
        <div>
          <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5' }}>{title}</div>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{desc}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, width:480, maxHeight:'85vh', overflowY:'auto', boxShadow:'0 16px 48px rgba(0,0,0,0.7)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, background:BG2, zIndex:1 }}>
          <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
        </div>
        <div style={{ padding:'20px 24px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

function ControlledInput({ label, value, onChange, type='text', placeholder='' }: { label:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' as const }} />
    </div>
  );
}

function ErrMsg({ msg }: { msg:string }) {
  if (!msg) return null;
  return <div style={{ padding:'10px 14px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.25)', borderRadius:7, fontFamily:BARLOW, fontSize:14, color:RED, marginBottom:12 }}>{msg}</div>;
}

function OkMsg({ msg }: { msg:string }) {
  if (!msg) return null;
  return <div style={{ padding:'10px 14px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:7, fontFamily:BARLOW, fontSize:14, color:GREEN, marginBottom:12 }}>{msg}</div>;
}

/* ── Change Password Modal (3-step OTP flow) ── */
function ChangePasswordModal({ onClose }: { onClose:()=>void }) {
  const [step,    setStep]    = useState<1|2|3>(1);
  const [email,   setEmail]   = useState(() => getAuth().email);
  const [otp,     setOtp]     = useState('');
  const [newPw,   setNewPw]   = useState('');
  const [confPw,  setConfPw]  = useState('');
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');
  const [ok,      setOk]      = useState('');

  async function sendOtp() {
    setErr(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, otp_type: 'forgot_password' }),
      });
      const d = await res.json();
      if (!res.ok) { setErr(d.message ?? 'Failed to send OTP'); return; }
      setOk('OTP sent to your email.'); setStep(2);
    } catch { setErr('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  async function resetPassword() {
    setErr('');
    if (newPw !== confPw) { setErr('Passwords do not match.'); return; }
    if (newPw.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp_code: otp, new_password: newPw, confirm_password: confPw }),
      });
      const d = await res.json();
      if (!res.ok) { setErr(d.message ?? 'Failed to reset password'); return; }
      setOk('Password changed successfully! Please login again.'); setStep(3);
    } catch { setErr('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <Modal title="CHANGE PASSWORD" onClose={onClose}>
      <ErrMsg msg={err} />
      <OkMsg msg={ok} />
      {step === 1 && <>
        <p style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:16, lineHeight:1.6 }}>
          We will send a verification code to your email address to confirm the password change.
        </p>
        <ControlledInput label="Email Address" value={email} onChange={setEmail} type="email" />
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
          <button onClick={sendOtp} disabled={loading} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:loading?0.7:1 }}>{loading ? 'Sending...' : 'Send OTP'}</button>
        </div>
      </>}
      {step === 2 && <>
        <ControlledInput label="Verification Code (OTP)" value={otp} onChange={setOtp} placeholder="Enter 6-digit OTP" />
        <ControlledInput label="New Password" value={newPw} onChange={setNewPw} type="password" placeholder="Min 8 chars, include number & symbol" />
        <ControlledInput label="Confirm New Password" value={confPw} onChange={setConfPw} type="password" placeholder="Repeat new password" />
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => { setStep(1); setErr(''); setOk(''); }} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Back</button>
          <button onClick={resetPassword} disabled={loading} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:loading?0.7:1 }}>{loading ? 'Saving...' : 'Change Password'}</button>
        </div>
      </>}
      {step === 3 && <>
        <div style={{ textAlign:'center', padding:'16px 0' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
          <div style={{ fontFamily:BEBAS, fontSize:22, color:GREEN, letterSpacing:1, marginBottom:8 }}>Password Changed!</div>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:20 }}>Your password has been updated. Please login again with your new password.</div>
          <button onClick={onClose} style={{ padding:'10px 32px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Done</button>
        </div>
      </>}
    </Modal>
  );
}

/* ── Edit Profile Modal ── */
function EditProfileModal({ profile, onClose, onSaved }: { profile: any; onClose:()=>void; onSaved:()=>void }) {
  const [form,    setForm]    = useState({
    company_name:        profile?.company_name        ?? '',
    company_description: profile?.company_description ?? '',
    contact_email:       profile?.contact_email       ?? '',
    contact_phone:       profile?.contact_phone       ?? '',
    website_url:         profile?.website_url         ?? '',
    city:                profile?.city                ?? '',
    state:               profile?.state               ?? '',
    country:             profile?.country             ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');
  const [ok,      setOk]      = useState('');

  async function save() {
    setErr(''); setLoading(true);
    try {
      const res = await fetch('/api/profile/agency', {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) { setErr(d.message ?? 'Failed to save changes'); return; }
      setOk('Profile updated successfully!');
      setTimeout(() => { onSaved(); onClose(); }, 1200);
    } catch { setErr('Network error. Please try again.'); }
    finally { setLoading(false); }
  }

  const F = (label: string, key: keyof typeof form, type = 'text') => (
    <ControlledInput key={key} label={label} value={form[key]} onChange={v => setForm(f => ({ ...f, [key]: v }))} type={type} />
  );

  return (
    <Modal title="EDIT PROFILE" onClose={onClose}>
      <ErrMsg msg={err} />
      <OkMsg msg={ok} />
      {F('Company Name',    'company_name')}
      {F('Contact Email',   'contact_email',  'email')}
      {F('Phone Number',    'contact_phone')}
      {F('Website',         'website_url')}
      {F('City',            'city')}
      {F('State',           'state')}
      {F('Country',         'country')}
      <div style={{ marginBottom:14 }}>
        <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>About Company</label>
        <textarea value={form.company_description} onChange={e => setForm(f => ({ ...f, company_description: e.target.value }))} rows={3}
          style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const }} />
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
        <button onClick={save} disabled={loading} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', opacity:loading?0.7:1 }}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </Modal>
  );
}

/* ── Push Notifications Modal ── */
function PushNotifModal({ prefs, setPrefs, onClose }: { prefs:any; setPrefs:(p:any)=>void; onClose:()=>void }) {
  const items = [
    { key:'a', label:'New Applications'      },
    { key:'b', label:'Audition Reminders'    },
    { key:'c', label:'Messages'              },
    { key:'d', label:'Casting Call Updates'  },
  ] as const;
  return (
    <Modal title="PUSH NOTIFICATIONS" onClose={onClose}>
      {items.map(item => (
        <div key={item.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item.label}</span>
          <Toggle on={prefs[item.key]} onChange={() => setPrefs((s:any) => ({ ...s, [item.key]: !s[item.key] }))} />
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginTop:16 }}>
        <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
        <button onClick={onClose} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Changes</button>
      </div>
    </Modal>
  );
}

/* ── Email Notifications Modal ── */
function EmailNotifModal({ prefs, setPrefs, onClose }: { prefs:any; setPrefs:(p:any)=>void; onClose:()=>void }) {
  const items = [
    { key:'a', label:'New Applications'    },
    { key:'b', label:'Shortlist Updates'   },
    { key:'c', label:'Audition Reminders'  },
    { key:'d', label:'Weekly Summary'      },
    { key:'e', label:'Payment Receipts'    },
  ] as const;
  return (
    <Modal title="EMAIL NOTIFICATIONS" onClose={onClose}>
      {items.map(item => (
        <div key={item.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item.label}</span>
          <Toggle on={prefs[item.key]} onChange={() => setPrefs((s:any) => ({ ...s, [item.key]: !s[item.key] }))} />
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginTop:16 }}>
        <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
        <button onClick={onClose} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Changes</button>
      </div>
    </Modal>
  );
}

/* ── SMS Notifications Modal ── */
function SmsNotifModal({ prefs, setPrefs, phone, setPhone, onClose }: { prefs:any; setPrefs:(p:any)=>void; phone:string; setPhone:(v:string)=>void; onClose:()=>void }) {
  const items = [
    { key:'a', label:'Urgent Alerts Only'  },
    { key:'b', label:'Audition Reminders'  },
    { key:'c', label:'Payment Alerts'      },
  ] as const;
  return (
    <Modal title="SMS NOTIFICATIONS" onClose={onClose}>
      <ControlledInput label="Mobile Number" value={phone} onChange={setPhone} />
      {items.map(item => (
        <div key={item.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item.label}</span>
          <Toggle on={prefs[item.key]} onChange={() => setPrefs((s:any) => ({ ...s, [item.key]: !s[item.key] }))} />
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginTop:16 }}>
        <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
        <button onClick={onClose} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Changes</button>
      </div>
    </Modal>
  );
}

/* ── Data & Activity Modal ── */
function DataActivityModal({ prefs, setPrefs, onClose }: { prefs:any; setPrefs:(p:any)=>void; onClose:()=>void }) {
  const items = [
    { key:'a', label:'Allow analytics tracking'       },
    { key:'b', label:'Personalized recommendations'   },
    { key:'c', label:'Share usage statistics'         },
    { key:'d', label:'Activity-based suggestions'     },
  ] as const;
  return (
    <Modal title="DATA & ACTIVITY" onClose={onClose}>
      {items.map(item => (
        <div key={item.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item.label}</span>
          <Toggle on={prefs[item.key]} onChange={() => setPrefs((s:any) => ({ ...s, [item.key]: !s[item.key] }))} />
        </div>
      ))}
      <div style={{ display:'flex', gap:10, marginTop:16 }}>
        <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
        <button onClick={onClose} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Changes</button>
      </div>
    </Modal>
  );
}

/* ── Profile Section ── */
function ProfileSection({ setModal, setActive, profile, onEditSaved, appView, timezone, language, visibility }: { setModal:(m:string)=>void; setActive:(s:Section)=>void; profile:any; onEditSaved:()=>void; appView:string; timezone:string; language:string; visibility:string }) {
  const name    = profile?.company_name        ?? '—';
  const email   = profile?.contact_email       ?? '—';
  const phone   = profile?.contact_phone       ?? '—';
  const website = profile?.website_url         ?? '—';
  const loc     = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || '—';
  const about   = profile?.company_description ?? '—';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Profile & Company Information</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Update your company details and profile information.</div>
          </div>
          <button onClick={() => setModal('editProfile')} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:7, color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
            onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.15)')}
          ><Edit size={14}/> Edit Profile</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:20, alignItems:'flex-start' }}>
          <div style={{ background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6, cursor:'pointer' }}
            onClick={() => setModal('uploadLogo')}>
            <div style={{ fontFamily:BEBAS, fontSize:18, color:GOLD, letterSpacing:2, textAlign:'center', lineHeight:1.2 }}>
              {name.split(' ').map((w: string) => w[0]).join('').slice(0,3).toUpperCase() || 'LOGO'}
            </div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.3)' }}>Click to change logo</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 32px' }}>
            {[
              { label:'Company Name',    value: name,    full: false },
              { label:'Contact Email',   value: email,   full: false },
              { label:'Industry',        value: profile?.company_type ?? 'Production House', full: false },
              { label:'Phone Number',    value: phone,   full: false },
              { label:'Website',         value: website, full: false },
              { label:'Location',        value: loc,     full: false },
              { label:'About Company',   value: about,   full: true  },
            ].map(row => (
              <div key={row.label} style={{ gridColumn: row.full ? '1/-1' : 'auto' }}>
                <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>{row.label}</div>
                <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', fontWeight:500, lineHeight:1.5 }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        <Card icon={<Lock size={20} color={GREEN}/>} iconColor={GREEN} title="Account & Security" desc="Manage your password and security settings.">
          <SettingRow label="Change Password"           onClick={() => setModal('changePassword')} />
          <SettingRow label="Two-Factor Authentication" sub="Not yet available" />
          <SettingRow label="Login Sessions"            onClick={() => setModal('sessions')} />
          <SettingRow label="Security Logs" danger       onClick={() => setModal('securityLogs')} />
        </Card>
        <Card icon={<BellRing size={20} color={PURPLE}/>} iconColor={PURPLE} title="Notifications" desc="Choose what you want to be notified about.">
          <SettingRow label="Push Notifications"  onClick={() => setModal('push')} />
          <SettingRow label="Email Notifications" onClick={() => setModal('emailNotif')} />
          <SettingRow label="SMS Notifications"   onClick={() => setModal('sms')} />
        </Card>
        <Card icon={<Users size={20} color={BLUE}/>} iconColor={BLUE} title="Team & Permissions" desc="Manage your team members and their access.">
          <SettingRow label="Team Members"       onClick={() => setModal('teamMembers')} />
          <SettingRow label="Roles & Permissions" onClick={() => setModal('roles')} />
          <SettingRow label="Invite New Member"  onClick={() => setModal('inviteMember')} />
        </Card>
        <Card icon={<CreditCard size={20} color={GOLD}/>} iconColor={GOLD} title="Billing & Subscription" desc="View your plan details and billing history.">
          <SettingRow label="Current Plan"    onClick={() => setModal('billing')} />
          <SettingRow label="Billing History" onClick={() => setModal('billing')} />
          <SettingRow label="Invoices"        onClick={() => setModal('billing')} />
        </Card>
        <Card icon={<Sliders size={20} color={ORANGE}/>} iconColor={ORANGE} title="Other Preferences" desc="Customize your platform experience.">
          <SettingRow label="Default Application View" value={appView}                          onClick={() => setModal('prefs')} />
          <SettingRow label="Timezone"                  value={timezone}                        onClick={() => setModal('timezone')} />
          <SettingRow label="Language"                  value={language}                        onClick={() => setModal('language')} />
        </Card>
        <Card icon={<Shield size={20} color={RED}/>} iconColor={RED} title="Privacy" desc="Control your data and privacy settings.">
          <SettingRow label="Profile Visibility" value={visibility} onClick={() => setModal('visibility')} />
          <SettingRow label="Data & Activity"                    onClick={() => setModal('dataActivity')} />
          <SettingRow label="Delete Account" danger              onClick={() => setModal('deleteAccount')} />
        </Card>
        <Card icon={<Mail size={20} color={BLUE}/>} iconColor={BLUE} title="Email Preferences" desc="Manage how and when we email you.">
          <SettingRow label="Email Notifications" onClick={() => setModal('emailNotif')} />
          <SettingRow label="Daily Digest"        onClick={() => setActive('email')} />
          <SettingRow label="Weekly Summary"      onClick={() => setActive('email')} />
        </Card>
        <Card icon={<Puzzle size={20} color={PURPLE}/>} iconColor={PURPLE} title="Integrations" desc="Connect SilverScreens with your tools.">
          <SettingRow label="Google Workspace"  onClick={() => setActive('integrations')} />
          <SettingRow label="Zoom"              onClick={() => setActive('integrations')} />
          <SettingRow label="Slack & Zapier"    onClick={() => setActive('integrations')} />
        </Card>
        <Card icon={<FileCheck size={20} color={GOLD}/>} iconColor={GOLD} title="Documents & Verification" desc="Upload and manage agency documents.">
          <SettingRow label="Upload Documents"  onClick={() => setActive('documents')} />
          <SettingRow label="Verification Status" onClick={() => setActive('documents')} />
          <SettingRow label="Document Guidelines" onClick={() => setActive('documents')} />
        </Card>
      </div>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'18px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Lock size={22} color="rgba(255,255,255,0.3)" />
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5' }}>Your data is safe with us</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>We use industry-standard encryption and security practices to protect your information.</div>
          </div>
        </div>
        <button onClick={() => setModal('privacy')} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', background:'transparent', border:'1px solid rgba(255,255,255,0.15)', borderRadius:7, color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' as const }}
          onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
          onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.15)')}
        ><ExternalLink size={14}/> View Privacy Policy</button>
      </div>
    </div>
  );
}

/* ── Security Section ── */
function SecuritySection({ setModal }: { setModal:(m:string)=>void }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
        <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Account & Security</div>
        <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Manage your password and security settings.</div>
        <SettingRow label="Change Password"           sub="Update your account password"            onClick={() => setModal('changePassword')} />
        <SettingRow label="Two-Factor Authentication" sub="Feature coming soon"                     />
        <SettingRow label="Login Sessions"            sub="Manage active login sessions"            onClick={() => setModal('sessions')} />
        <SettingRow label="Security Logs"             sub="View recent account activity" danger     onClick={() => setModal('securityLogs')} />
        <SettingRow label="Trusted Devices"           sub="Manage trusted devices"                  onClick={() => setModal('devices')} />
      </div>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
        <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:16 }}>Danger Zone</div>
        <div style={{ padding:16, background:'rgba(200,32,42,0.08)', border:'1px solid rgba(200,32,42,0.2)', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:RED }}>Delete Account</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Permanently delete your account and all data.</div>
          </div>
          <button onClick={() => setModal('deleteAccount')} style={{ padding:'8px 16px', background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}>Delete Account</button>
        </div>
      </div>
      {/* 2FA info banner */}
      <div style={{ padding:'14px 18px', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, display:'flex', alignItems:'center', gap:12 }}>
        <AlertCircle size={18} color={BLUE} style={{ flexShrink:0 }} />
        <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
          Two-Factor Authentication is not yet available. It will be enabled in a future release once the authenticator backend is set up.
        </div>
      </div>
    </div>
  );
}

/* ── Notifications Section ── */
function NotificationsSection() {
  const [prefs, setPrefs] = useState({ newApp:true, auditionReminder:true, casting:true, messages:true, teamActivity:false, weeklyReport:true, marketing:false, systemUpdates:true });
  const toggle = (k: string) => setPrefs(p => ({ ...p, [k]: !p[k as keyof typeof p] }));
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Notifications</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Choose what you want to be notified about.</div>
      {[
        { key:'newApp',           label:'New Applications',       sub:'When someone applies to your casting call' },
        { key:'auditionReminder', label:'Audition Reminders',     sub:'Reminders before scheduled auditions' },
        { key:'casting',          label:'Casting Call Updates',   sub:'Status changes to your casting calls' },
        { key:'messages',         label:'New Messages',           sub:'When you receive a new message' },
        { key:'teamActivity',     label:'Team Activity',          sub:'When team members take actions' },
        { key:'weeklyReport',     label:'Weekly Report',          sub:'Weekly summary of your activity' },
        { key:'marketing',        label:'Marketing & Promotions', sub:'News, tips and special offers' },
        { key:'systemUpdates',    label:'System Updates',         sub:'Platform updates and maintenance notices' },
      ].map(row => (
        <div key={row.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{row.label}</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{row.sub}</div>
          </div>
          <Toggle on={prefs[row.key as keyof typeof prefs]} onChange={() => toggle(row.key)} />
        </div>
      ))}
      {saved && <OkMsg msg="Notification preferences saved!" />}
      <div style={{ marginTop:16 }}>
        <button onClick={() => { try { localStorage.setItem('agency_notif_prefs', JSON.stringify(prefs)); } catch {} setSaved(true); setTimeout(() => setSaved(false), 3000); }} style={{ padding:'10px 24px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Preferences</button>
      </div>
    </div>
  );
}

/* ── Email Section ── */
function EmailSection() {
  const [prefs, setPrefs] = useState({ daily:true, weekly:true, instant:false, digest:true });
  const [email, setEmail] = useState(() => getAuth().email);
  const toggle = (k: string) => setPrefs(p => ({ ...p, [k]: !p[k as keyof typeof p] }));
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Email Preferences</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Manage how and when we email you.</div>
      <ControlledInput label="Email Address" value={email} onChange={setEmail} type="email" />
      {[
        { key:'instant', label:'Instant Notifications', sub:'Receive emails immediately for important events' },
        { key:'daily',   label:'Daily Digest',          sub:'One summary email each day' },
        { key:'weekly',  label:'Weekly Summary',        sub:'One summary email each week' },
        { key:'digest',  label:'Application Digest',    sub:'Digest of new applications' },
      ].map(row => (
        <div key={row.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{row.label}</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{row.sub}</div>
          </div>
          <Toggle on={prefs[row.key as keyof typeof prefs]} onChange={() => toggle(row.key)} />
        </div>
      ))}
      {saved && <OkMsg msg="Email preferences saved!" />}
      <div style={{ marginTop:16 }}>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} style={{ padding:'10px 24px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Preferences</button>
      </div>
    </div>
  );
}

/* ── Privacy Section ── */
function PrivacySection({ setModal, visibility, setVisibility }: { setModal:(m:string)=>void; visibility:string; setVisibility:(v:string)=>void }) {
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Privacy Settings</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Control your data and privacy settings.</div>
      <div style={{ marginBottom:16 }}>
        <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Profile Visibility</label>
        {/* Use a select instead of buttons to avoid overflow */}
        <select value={visibility} onChange={e => setVisibility(e.target.value)}
          style={{ width:'100%', background:BG3, border:`1px solid ${GOLD}40`, borderRadius:7, padding:'10px 14px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', cursor:'pointer' }}>
          {['Public','Agency Members Only','Private'].map(v => <option key={v}>{v}</option>)}
        </select>
        <div style={{ marginTop:8, fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.3)' }}>
          {visibility === 'Public' ? 'Your profile is visible to all aspirants and visitors.' :
           visibility === 'Agency Members Only' ? 'Only your team members can view the full profile.' :
           'Your profile is hidden from all aspirants and visitors.'}
        </div>
      </div>
      <SettingRow label="Data & Activity"     sub="Manage your activity data"       onClick={() => setModal('dataActivity')} />
      <SettingRow label="Download My Data"    sub="Export all your account data"    onClick={() => setModal('downloadData')} />
      <SettingRow label="View Privacy Policy" sub="Read our full privacy policy"    onClick={() => setModal('privacy')} />
      <SettingRow label="Delete Account"      sub="Permanently delete everything" danger onClick={() => setModal('deleteAccount')} />
    </div>
  );
}

/* ── Team Section ── */
function TeamSection({ setModal }: { setModal:(m:string)=>void }) {
  const members = [
    { name:'Rohan Verma',    role:'Admin',           email:'rohan@agency.com',  img:'photo-1472099645785-5658abf4ff4e' },
    { name:'Meera Iyer',     role:'Agency Member',   email:'meera@agency.com',  img:'photo-1494790108377-be9c29b29330' },
    { name:'Karan Malhotra', role:'Casting Director',email:'karan@agency.com',  img:'photo-1507003211169-0a1dd7228f2d' },
    { name:'Pooja Sharma',   role:'Agency Member',   email:'pooja@agency.com',  img:'photo-1529626455594-4ff0802cfb7e' },
    { name:'Ankit Gupta',    role:'Viewer',          email:'ankit@agency.com',  img:'photo-1500648767791-00dcc994a43e' },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Team & Permissions</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Manage your team members and their access levels.</div>
          </div>
          <button onClick={() => setModal('inviteMember')} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}>
            <Plus size={14}/> Invite Member
          </button>
        </div>
        {members.map((m,i) => (
          <div key={m.name} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:i<members.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', overflow:'hidden', flexShrink:0, background:BG3 }}>
              <img src={`https://images.unsplash.com/${m.img}?w=80&q=80`} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{m.name}</div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{m.email}</div>
            </div>
            <select defaultValue={m.role} style={{ background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'6px 10px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', cursor:'pointer' }}>
              <option>Admin</option><option>Casting Director</option><option>Agency Member</option><option>Viewer</option>
            </select>
            <button onClick={() => setModal('removeMember')} style={{ background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.2)', borderRadius:6, padding:'6px 8px', color:RED, cursor:'pointer', display:'flex', alignItems:'center' }}>
              <Trash2 size={14}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Billing Section ── */
function BillingSection({ router }: { router: any }) {
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Billing & Subscription</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Manage your subscription plan and billing details.</div>
      <SettingRow label="Change Plan"         sub="Upgrade or downgrade your plan"    onClick={() => router.push('/agency/subscription?tab=plans')} />
      <SettingRow label="Payment Methods"     sub="Manage cards and payment options"  onClick={() => router.push('/agency/subscription?tab=payment')} />
      <SettingRow label="Billing History"     sub="View past invoices and charges"    onClick={() => router.push('/agency/subscription?tab=billing')} />
      <SettingRow label="Invoices"            sub="Download your invoices"            onClick={() => router.push('/agency/subscription?tab=invoices')} />
      <SettingRow label="Cancel Subscription" sub="Cancel your current plan" danger   onClick={() => router.push('/agency/subscription')} />
    </div>
  );
}

/* ── Preferences Section ── */
function PreferencesSection({ appView, setAppView, timezone, setTimezone, language, setLanguage }: {
  appView:string; setAppView:(v:string)=>void;
  timezone:string; setTimezone:(v:string)=>void;
  language:string; setLanguage:(v:string)=>void;
}) {
  const [theme,      setTheme]      = useState('Dark');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [saved,      setSaved]      = useState(false);
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Other Preferences</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Customize your platform experience.</div>
      {[
        { label:'Default Application View', value:appView,    options:['List View','Grid View','Kanban View'],                                setter:setAppView    },
        { label:'Timezone', value:timezone, options:[
          '(GMT+05:30) India Standard Time – Mumbai, Delhi',
          '(GMT+05:30) Sri Lanka','(GMT+05:45) Nepal Standard Time',
          '(GMT+06:00) Bangladesh, Bhutan','(GMT+05:00) Pakistan Standard Time',
          '(GMT+04:00) Dubai, Abu Dhabi – UAE','(GMT+03:00) Saudi Arabia, Kuwait, Riyadh',
          '(GMT+02:00) Israel, Jordan','(GMT+07:00) Bangkok, Jakarta, Vietnam',
          '(GMT+08:00) Singapore, Kuala Lumpur','(GMT+08:00) China Standard Time – Beijing',
          '(GMT+08:00) Hong Kong, Manila','(GMT+09:00) Japan Standard Time – Tokyo',
          '(GMT+09:00) Korea Standard Time – Seoul','(GMT+09:30) Australia – Adelaide, Darwin',
          '(GMT+10:00) Australia – Sydney, Melbourne','(GMT+12:00) New Zealand – Auckland',
          '(GMT+00:00) London, Dublin, Lisbon','(GMT+01:00) Paris, Berlin, Amsterdam, Rome',
          '(GMT+02:00) Athens, Helsinki, Cairo','(GMT+03:00) Moscow, Istanbul',
          '(GMT-05:00) New York, Toronto – Eastern Time','(GMT-06:00) Chicago – Central Time',
          '(GMT-07:00) Denver – Mountain Time','(GMT-08:00) Los Angeles – Pacific Time',
          '(GMT-09:00) Alaska','(GMT-10:00) Hawaii',
          '(GMT-03:00) Brazil – São Paulo','(GMT-05:00) Colombia, Peru, Ecuador',
          '(GMT-06:00) Mexico City','(GMT+01:00) Nigeria, Morocco',
          '(GMT+02:00) South Africa, Egypt','(GMT+03:00) Kenya, Ethiopia',
          '(GMT+00:00) UTC – Coordinated Universal Time',
        ], setter:setTimezone },
        { label:'Language', value:language, options:['English','Hindi','Marathi','Tamil','Telugu','Kannada','Bengali','Gujarati','Punjabi','Malayalam','Odia','Urdu'], setter:setLanguage },
        { label:'Theme',                    value:theme,      options:['Dark','Light','System'],                                              setter:setTheme      },
        { label:'Date Format',              value:dateFormat, options:['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'],                               setter:setDateFormat },
      ].map(row => (
        <div key={row.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{row.label}</div>
          <select value={row.value} onChange={e => row.setter(e.target.value)} style={{ background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'7px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', cursor:'pointer', minWidth:220 }}>
            {row.options.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}
      {saved && <OkMsg msg="Preferences saved!" />}
      <div style={{ marginTop:16 }}>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} style={{ padding:'10px 24px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Preferences</button>
      </div>
    </div>
  );
}

/* ── Integrations Section ── */
const INTEGRATIONS = [
  {
    key: 'google',   name: 'Google Workspace', icon: 'G', color: '#EA4335',
    desc: 'Sync calendar, drive and contacts with SilverScreens.',
    how:  'Google OAuth 2.0 — you will be redirected to Google to authorise access.',
    docs: 'https://workspace.google.com',
  },
  {
    key: 'slack',    name: 'Slack',            icon: 'S', color: '#4A154B',
    desc: 'Get casting call and application alerts in Slack channels.',
    how:  'Slack OAuth 2.0 — you will be redirected to Slack to authorise the SilverScreens app.',
    docs: 'https://slack.com',
  },
  {
    key: 'zapier',   name: 'Zapier',           icon: 'Z', color: '#FF4A00',
    desc: 'Automate workflows by connecting SilverScreens with 5000+ apps.',
    how:  'Zapier API Key — you will need your Zapier account API key to connect.',
    docs: 'https://zapier.com',
  },
  {
    key: 'zoom',     name: 'Zoom',             icon: 'Z', color: '#2D8CFF',
    desc: 'Schedule and host online auditions directly via Zoom.',
    how:  'Zoom OAuth 2.0 — you will be redirected to Zoom to authorise access.',
    docs: 'https://zoom.us',
  },
  {
    key: 'dropbox',  name: 'Dropbox',          icon: 'D', color: '#0061FF',
    desc: 'Store and share production files, scripts and media assets.',
    how:  'Dropbox OAuth 2.0 — you will be redirected to Dropbox to authorise access.',
    docs: 'https://dropbox.com',
  },
];

function IntegrationsSection() {
  const [selectedInt, setSelectedInt] = useState<typeof INTEGRATIONS[0] | null>(null);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Info banner */}
      <div style={{ padding:'14px 18px', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, display:'flex', alignItems:'flex-start', gap:12 }}>
        <AlertCircle size={18} color={BLUE} style={{ flexShrink:0, marginTop:1 }} />
        <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>
          <strong style={{ color:'#F5F5F5' }}>About Integrations:</strong> All integrations use secure OAuth 2.0 — we never ask for your password on other platforms.
          Clicking Connect will explain how the integration works and redirect you to that platform to authorise access.
          Integration setup requires admin configuration of API credentials. Contact your SilverScreens administrator to enable specific integrations.
        </div>
      </div>

      {/* Integration cards */}
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
        <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Integrations</div>
        <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Connect SilverScreens with your favourite tools via secure OAuth.</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {INTEGRATIONS.map(int => (
            <div key={int.key} style={{ display:'flex', alignItems:'center', gap:16, padding:16, background:BG3, border:'1px solid rgba(255,255,255,0.06)', borderRadius:10 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,166,74,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              {/* Icon */}
              <div style={{ width:48, height:48, borderRadius:12, background:int.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:BEBAS, fontSize:22, color:'#fff', flexShrink:0, letterSpacing:1 }}>{int.icon}</div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5', marginBottom:3 }}>{int.name}</div>
                <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:1.4 }}>{int.desc}</div>
              </div>

              {/* Status + button */}
              <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                <span style={{ padding:'3px 10px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.35)', fontWeight:600 }}>
                  Not Connected
                </span>
                <button
                  onClick={() => setSelectedInt(int)}
                  style={{ padding:'8px 18px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OAuth info modal */}
      {selectedInt && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, width:480, boxShadow:'0 16px 48px rgba(0,0,0,0.7)' }}>
            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:8, background:selectedInt.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:BEBAS, fontSize:18, color:'#fff' }}>{selectedInt.icon}</div>
                <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>CONNECT {selectedInt.name.toUpperCase()}</div>
              </div>
              <button onClick={() => setSelectedInt(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
            </div>

            {/* Body */}
            <div style={{ padding:'20px 24px 24px' }}>
              <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', fontWeight:600, marginBottom:8 }}>What this integration does:</div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.55)', marginBottom:16, lineHeight:1.7 }}>{selectedInt.desc}</div>

              <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', fontWeight:600, marginBottom:8 }}>How the connection works:</div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.55)', marginBottom:20, lineHeight:1.7 }}>{selectedInt.how}</div>

              {/* Security note */}
              <div style={{ padding:'12px 14px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:8, marginBottom:20, display:'flex', gap:10 }}>
                <span style={{ fontSize:16, flexShrink:0 }}>🔒</span>
                <div style={{ fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
                  <strong style={{ color:GREEN }}>Secure OAuth 2.0</strong> — We never store or see your {selectedInt.name} password.
                  You authorise SilverScreens directly on {selectedInt.name}'s own login page.
                </div>
              </div>

              {/* Admin note */}
              <div style={{ padding:'12px 14px', background:'rgba(249,115,22,0.08)', border:'1px solid rgba(249,115,22,0.2)', borderRadius:8, marginBottom:20, display:'flex', gap:10 }}>
                <AlertCircle size={15} color={ORANGE} style={{ flexShrink:0, marginTop:2 }} />
                <div style={{ fontFamily:BARLOW, fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
                  This integration requires <strong style={{ color:ORANGE }}>API credentials</strong> to be configured by your SilverScreens administrator before it can be activated.
                  Please contact your admin or{' '}
                  <span onClick={() => window.open('mailto:support@silverscreens.com')} style={{ color:GOLD, cursor:'pointer', textDecoration:'underline' }}>support@silverscreens.com</span>.
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setSelectedInt(null)} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={() => { window.open(selectedInt.docs, '_blank'); setSelectedInt(null); }}
                  style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                >
                  <ExternalLink size={14}/> Learn More on {selectedInt.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ── Upload Document Modal ── */
function UploadDocModal({ docLabel, onClose, onUploaded }: {
  docLabel: string;
  onClose: () => void;
  onUploaded: (label: string, fileName: string, size: string, url?: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType,      setDocType]      = useState(docLabel);
  const [uploading,    setUploading]    = useState(false);
  const [err,          setErr]          = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate type
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      setErr('Only PDF, JPG, or PNG files are allowed.'); return;
    }
    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErr('File size must be under 5MB.'); return;
    }
    setErr('');
    setSelectedFile(file);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/(1024*1024)).toFixed(1)} MB`;
  }

  async function handleUpload() {
    if (!selectedFile) { setErr('Please select a file first.'); return; }
    setErr('');
    setUploading(true);
    try {
      // Get auth token
      const u    = JSON.parse(localStorage.getItem('ss_user') || '{}');
      const token = u.token ?? '';

      // Build form data
      const fd = new FormData();
      fd.append('file',      selectedFile);
      fd.append('doc_type',  docType.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      fd.append('doc_label', docType);

      const res = await fetch('/api/agency/documents', {
        method:  'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body:    fd,
      });
      const data = await res.json();

      if (!res.ok) {
        setErr(data.message ?? 'Upload failed. Please try again.');
        setUploading(false);
        return;
      }

      // Store URL in localStorage so View button can open it
      try {
        const stored = JSON.parse(localStorage.getItem('agency_docs') || '{}');
        stored[docType] = { url: data.url, fileName: selectedFile.name, size: formatSize(selectedFile.size) };
        localStorage.setItem('agency_docs', JSON.stringify(stored));
      } catch {}

      onUploaded(docType, selectedFile.name, formatSize(selectedFile.size), data.url ?? '');
      onClose();
    } catch {
      setErr('Network error. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <Modal title="UPLOAD DOCUMENT" onClose={onClose}>
      <ErrMsg msg={err} />

      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = GOLD; }}
        onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,166,74,0.3)'; }}
        onDrop={e => {
          e.preventDefault();
          e.currentTarget.style.borderColor = 'rgba(212,166,74,0.3)';
          const file = e.dataTransfer.files?.[0];
          if (file) {
            const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowed.includes(file.type)) { setErr('Only PDF, JPG, or PNG files are allowed.'); return; }
            if (file.size > 5 * 1024 * 1024) { setErr('File size must be under 5MB.'); return; }
            setErr(''); setSelectedFile(file);
          }
        }}
        style={{
          padding: '28px 20px', background: BG3,
          border: `2px dashed ${selectedFile ? GOLD : 'rgba(212,166,74,0.3)'}`,
          borderRadius: 10, textAlign: 'center' as const,
          marginBottom: 14, cursor: 'pointer', transition: 'border-color 0.15s',
        }}
      >
        {selectedFile ? (
          <>
            <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
            <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: GREEN, marginBottom: 4 }}>
              {selectedFile.name}
            </div>
            <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
              {formatSize(selectedFile.size)} · Click to change file
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📁</div>
            <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>
              Click to browse or drag & drop
            </div>
            <div style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
              PDF, JPG, PNG · Max 5MB
            </div>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Document type selector */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>Document Type</label>
        <select value={docType} onChange={e => setDocType(e.target.value)}
          style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '10px 12px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none' }}>
          <option>Certificate of Incorporation</option>
          <option>GST Certificate</option>
          <option>Address Proof</option>
          <option>MoA / AoA</option>
          <option>Company PAN</option>
          <option>Bank Account Proof</option>
        </select>
      </div>

      {/* Note */}
      <div style={{ padding: '10px 12px', background: 'rgba(212,166,74,0.07)', border: '1px solid rgba(212,166,74,0.15)', borderRadius: 7, marginBottom: 16, fontFamily: BARLOW, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
        📋 After upload your document will be submitted for admin review. You will be notified once it is verified.
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
          Cancel
        </button>
        <button onClick={handleUpload} disabled={!selectedFile || uploading}
          style={{ flex: 2, padding: 10, background: selectedFile ? GOLD : 'rgba(212,166,74,0.3)', border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 17, letterSpacing: 1, cursor: selectedFile ? 'pointer' : 'not-allowed', opacity: uploading ? 0.7 : 1 }}>
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </Modal>
  );
}

/* ── Documents Section ── */
type DocEntry = { key:string; label:string; icon:string; required:boolean; status:string; size:string|null; uploaded:string|null; fileName:string|null; url:string|null; rejection_reason?:string|null; };

const INITIAL_DOCS: DocEntry[] = [
  { key:'incorporation', label:'Certificate of Incorporation', icon:'📜', required:true,  status:'Verified',    size:'2.4 MB', uploaded:'18 Jun 2025', fileName:'certificate_of_incorporation.pdf', url:null },
  { key:'gst',           label:'GST Certificate',              icon:'📋', required:true,  status:'Verified',    size:'1.1 MB', uploaded:'18 Jun 2025', fileName:'gst_certificate.pdf',              url:null },
  { key:'address',       label:'Address Proof',                icon:'🏠', required:true,  status:'Pending',     size:null,     uploaded:null,           fileName:null,                              url:null },
  { key:'moa',           label:'MoA / AoA',                    icon:'📄', required:true,  status:'Not Uploaded',size:null,     uploaded:null,           fileName:null,                              url:null },
  { key:'pan',           label:'Company PAN',                  icon:'💳', required:true,  status:'Not Uploaded',size:null,     uploaded:null,           fileName:null,                              url:null },
  { key:'bank',          label:'Bank Account Proof',           icon:'🏦', required:false, status:'Not Uploaded',size:null,     uploaded:null,           fileName:null,                              url:null },
];

function DocumentsSection({ setModal }: { setModal:(m:string)=>void }) {
  const [docs, setDocs] = useState<DocEntry[]>(INITIAL_DOCS);
  const [uploadDoc, setUploadDoc] = useState<DocEntry | null>(null);
  const [loading, setLoading] = useState(true);

  // Map doc_type from API to local key
  const DOC_TYPE_MAP: Record<string, string> = {
    certificate_of_incorporation: 'incorporation',
    gst_certificate:              'gst',
    address_proof:                'address',
    moa___aoa:                    'moa',
    company_pan:                  'pan',
    bank_account_proof:           'bank',
  };

  useEffect(() => {
    async function fetchDocs() {
      try {
        const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
        const headers = u.token ? { Authorization: `Bearer ${u.token}` } : {};
        const res = await fetch('/api/agency/documents', { headers });
        if (!res.ok) return;
        const data = await res.json();
        // Handle both { success, data: { data: [...] } } and { success, data: [...] }
        const inner = data.data;
        const apiDocs: any[] = Array.isArray(inner) ? inner : (inner?.data ?? []);
        if (!Array.isArray(apiDocs) || apiDocs.length === 0) return;

        setDocs(prev => prev.map(d => {
          const apiDoc = apiDocs.find((a: any) => DOC_TYPE_MAP[a.doc_type] === d.key);
          if (!apiDoc) return d;
          const status =
            apiDoc.status === 'approved' ? 'Verified' :
            apiDoc.status === 'rejected' ? 'Rejected' : 'Pending';
          return {
            ...d,
            status,
            fileName:         apiDoc.file_name,
            size:             `${(Number(apiDoc.file_size) / 1024).toFixed(0)} KB`,
            uploaded:         new Date(apiDoc.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
            url:              apiDoc.public_url,
            rejection_reason: apiDoc.rejection_reason ?? null,
          };
        }));
      } catch(e) {
        console.error('Failed to fetch docs', e);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  const verified = docs.filter(d => d.status === 'Verified').length;
  const total    = docs.length;
  const pct      = Math.round((verified / total) * 100);

  function handleUploaded(label: string, fileName: string, size: string, url?: string) {
    const today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    setDocs(prev => prev.map(d =>
      d.label === label
        ? { ...d, status: 'Pending', size, uploaded: today, fileName, url: url ?? null, rejection_reason: null }
        : d
    ));
  }

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding: 60, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, fontSize:15 }}>
        Loading documents...
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Progress card */}
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Documents & Verification</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Upload required documents for agency verification.</div>
          </div>
          <div style={{ textAlign:'right' as const }}>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Verification Progress</div>
            <div style={{ fontFamily:BEBAS, fontSize:28, color:pct===100?GREEN:GOLD, letterSpacing:1 }}>{pct}%</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{verified} of {total} verified</div>
          </div>
        </div>
        <div style={{ height:6, background:BG3, borderRadius:3, overflow:'hidden', marginBottom:8 }}>
          <div style={{ height:'100%', width:`${pct}%`, background:pct===100?GREEN:GOLD, borderRadius:3, transition:'width 0.4s ease' }}/>
        </div>
        {docs.some(d => d.status === 'Rejected') && (
          <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(200,32,42,0.08)', border:'1px solid rgba(200,32,42,0.2)', borderRadius:8, fontFamily:BARLOW, fontSize:14, color:'rgba(255,180,180,0.9)', lineHeight:1.5 }}>
            ⚠️ Some documents were rejected. Please review the reasons below and re-upload the correct files.
          </div>
        )}
      </div>

      {/* Document list */}
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5' }}>Required Documents</div>
        {docs.map((doc, i) => {
          const isRejected = doc.status === 'Rejected';
          const statusColor = doc.status==='Verified'?GREEN:doc.status==='Rejected'?RED:doc.status==='Pending'?ORANGE:'rgba(255,255,255,0.4)';
          const statusBg    = doc.status==='Verified'?'rgba(34,197,94,0.12)':doc.status==='Rejected'?'rgba(200,32,42,0.12)':doc.status==='Pending'?'rgba(245,158,11,0.12)':'rgba(255,255,255,0.05)';
          const statusBdr   = doc.status==='Verified'?'rgba(34,197,94,0.3)':doc.status==='Rejected'?'rgba(200,32,42,0.3)':doc.status==='Pending'?'rgba(245,158,11,0.3)':'rgba(255,255,255,0.1)';
          const statusLabel = doc.status==='Verified'?'✓ Verified':doc.status==='Rejected'?'✗ Rejected':doc.status==='Pending'?'⏳ Under Review':'— Not Uploaded';
          return (
            <div key={doc.key} style={{ borderBottom:i<docs.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px' }}>
                <div style={{ width:44, height:44, borderRadius:10, background:isRejected?'rgba(200,32,42,0.1)':doc.status==='Verified'?'rgba(34,197,94,0.1)':doc.status==='Pending'?'rgba(245,158,11,0.1)':'rgba(255,255,255,0.05)', border:`1px solid ${isRejected?'rgba(200,32,42,0.25)':doc.status==='Verified'?'rgba(34,197,94,0.25)':doc.status==='Pending'?'rgba(245,158,11,0.25)':'rgba(255,255,255,0.08)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{doc.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                    <span style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5' }}>{doc.label}</span>
                    {doc.required && <span style={{ padding:'1px 7px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.2)', borderRadius:20, fontFamily:BARLOW, fontSize:13, color:RED, fontWeight:600 }}>Required</span>}
                  </div>
                  <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.35)' }}>
                    {doc.fileName
                      ? `${doc.fileName} · ${doc.size} · Uploaded ${doc.uploaded}`
                      : 'Not yet uploaded · PDF, JPG, PNG (max 5MB)'}
                  </div>
                </div>
                <span style={{ padding:'3px 12px', background:statusBg, border:`1px solid ${statusBdr}`, borderRadius:20, fontFamily:BARLOW, fontSize:14, fontWeight:700, color:statusColor, flexShrink:0 }}>
                  {statusLabel}
                </span>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  {doc.status !== 'Not Uploaded' && (
                    <button
                      onClick={() => { if (doc.url) window.open(doc.url, '_blank'); }}
                      style={{ padding:'7px 14px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:6, color:BLUE, fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                      <ExternalLink size={13} /> View
                    </button>
                  )}
                  {/* Upload / Replace / Re-upload based on status */}
                  {doc.status === 'Verified' ? (
                    <button
                      onClick={() => setUploadDoc(doc)}
                      style={{ padding:'7px 14px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:6, color:'rgba(255,255,255,0.5)', fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                      <Upload size={13} /> Replace
                    </button>
                  ) : doc.status === 'Pending' ? (
                    <button
                      onClick={() => setUploadDoc(doc)}
                      style={{ padding:'7px 14px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:6, color:ORANGE, fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                      <Upload size={13} /> Replace
                    </button>
                  ) : (
                    <button
                      onClick={() => setUploadDoc(doc)}
                      style={{ padding:'7px 14px', background:isRejected?RED:'rgba(212,166,74,0.1)', border:`1px solid ${isRejected?'rgba(200,32,42,0.4)':'rgba(212,166,74,0.25)'}`, borderRadius:6, color:isRejected?'#fff':GOLD, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                      <Upload size={13} /> {isRejected ? 'Re-upload' : 'Upload'}
                    </button>
                  )}
                </div>
              </div>
              {/* Rejection reason banner */}
              {isRejected && doc.rejection_reason && (
                <div style={{ margin:'0 20px 14px', padding:'10px 14px', background:'rgba(200,32,42,0.08)', border:'1px solid rgba(200,32,42,0.2)', borderRadius:8, fontFamily:BARLOW, fontSize:13, color:'rgba(255,180,180,0.9)', lineHeight:1.5, display:'flex', alignItems:'flex-start', gap:8 }}>
                  <AlertCircle size={15} color={RED} style={{ flexShrink:0, marginTop:1 }} />
                  <span><strong style={{ color:RED }}>Rejection Reason: </strong>{doc.rejection_reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload modal */}
      {uploadDoc && (
        <UploadDocModal
          docLabel={uploadDoc.label}
          onClose={() => setUploadDoc(null)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  );
}



/* ── Invite Member Modal ── */
function InviteMemberModal({ onClose }: { onClose:()=>void }) {
  const [invEmail, setInvEmail] = useState('');
  const [invRole,  setInvRole]  = useState('Agency Member');
  const [sent,     setSent]     = useState(false);
  const [err,      setErr]      = useState('');
  function send() {
    if (!invEmail.trim() || !invEmail.includes('@')) { setErr('Please enter a valid email address.'); return; }
    setErr(''); setSent(true);
  }
  return (
    <Modal title="INVITE TEAM MEMBER" onClose={onClose}>
      {sent ? (
        <div style={{ textAlign:'center' as const, padding:'16px 0' }}>
          <div style={{ fontSize:36, marginBottom:10 }}>✉️</div>
          <div style={{ fontFamily:BEBAS, fontSize:20, color:GREEN, letterSpacing:1, marginBottom:6 }}>Invite Sent!</div>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:20 }}>An invitation has been sent to {invEmail}</div>
          <button onClick={onClose} style={{ padding:'9px 28px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Done</button>
        </div>
      ) : (<>
        <ErrMsg msg={err} />
        <ControlledInput label="Email Address" value={invEmail} onChange={setInvEmail} type="email" placeholder="colleague@example.com" />
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Role</label>
          <select value={invRole} onChange={e => setInvRole(e.target.value)} style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
            <option>Agency Member</option><option>Casting Director</option><option>Viewer</option><option>Admin</option>
          </select>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
          <button onClick={send} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Send Invite</button>
        </div>
      </>)}
    </Modal>
  );
}

/* ── Roles & Permissions Modal ── */
const ALL_PERMS = ['Full Access','Billing','Team Management','Casting Calls','Applications','Auditions','View Castings','Messages','View Only'];
const DEFAULT_ROLES: Record<string,string[]> = {
  'Admin':           ['Full Access','Billing','Team Management','Casting Calls','Applications','Auditions','View Castings','Messages'],
  'Casting Director':['Casting Calls','Applications','Auditions','View Castings','Messages'],
  'Agency Member':   ['View Castings','Messages'],
  'Viewer':          ['View Only'],
};
function RolesModal({ onClose }: { onClose:()=>void }) {
  const [roles, setRoles] = useState<Record<string,string[]>>(DEFAULT_ROLES);
  function togglePerm(role: string, perm: string) {
    setRoles(prev => {
      const cur = prev[role] ?? [];
      return { ...prev, [role]: cur.includes(perm) ? cur.filter(p => p !== perm) : [...cur, perm] };
    });
  }
  return (
    <Modal title="ROLES & PERMISSIONS" onClose={onClose}>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:16 }}>Click a permission to toggle it on/off for each role.</div>
      {Object.entries(roles).map(([role, perms]) => (
        <div key={role} style={{ marginBottom:16, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:700, color:'#F5F5F5', marginBottom:8 }}>{role}</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
            {ALL_PERMS.map(p => {
              const on = perms.includes(p);
              return <span key={p} onClick={() => togglePerm(role, p)}
                style={{ padding:'4px 12px', background:on ? `${GOLD}18` : BG3, border:`1px solid ${on ? GOLD : 'rgba(255,255,255,0.08)'}`, borderRadius:20, fontFamily:BARLOW, fontSize:13, color:on ? GOLD : 'rgba(255,255,255,0.4)', cursor:'pointer', userSelect:'none' as const }}>
                {on ? '✓ ' : ''}{p}
              </span>;
            })}
          </div>
        </div>
      ))}
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
        <button onClick={onClose} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Roles</button>
      </div>
    </Modal>
  );
}

/* ── Main Page ── */
export default function SettingsPage() {
  const router = useRouter();
  const [sidebarOpen,    setOpen]    = useState(false);
  const [activeSection,  setActive]  = useState<Section>('profile');
  const [modal,          setModal]   = useState('');
  const [agencyName,     setAgencyName]  = useState('My Agency');
  const [agencyInits,    setAgencyInits] = useState('AG');
  const [profile,        setProfile]    = useState<any>(null);
  // Lifted state — persists across modal opens
  const [pushPrefs,  setPushPrefs]  = useState({ a:true, b:true, c:true, d:true });
  const [emailPrefs, setEmailPrefs] = useState({ a:true, b:true, c:true, d:true, e:true });
  const [smsPrefs,   setSmsPrefs]   = useState({ a:true, b:false, c:false });
  const [smsPhone,   setSmsPhone]   = useState('+91 ');
  const [dataPrefs,  setDataPrefs]  = useState({ a:true, b:true, c:false, d:true });
  const [appView,    setAppView]    = useState('List View');
  const [timezone,   setTimezone]   = useState('(GMT+05:30) India Standard Time');
  const [language,   setLanguage]   = useState('English');
  const [visibility, setVisibility] = useState('Public');
  const SB_W = sidebarOpen ? 230 : 52;

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/profile/agency', { headers: authHeaders() });
      if (!res.ok) return;
      const d = await res.json();
      const p = d.data?.profile ?? d.profile ?? null;
      if (p) {
        setProfile(p);
        const name = p.company_name;
        if (name) {
          setAgencyName(name);
          setAgencyInits(name.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase());
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Instant from localStorage
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) {
        setAgencyName(u.name);
        setAgencyInits(u.name.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase());
      }
    } catch {}
    fetchProfile();
  }, [fetchProfile]);

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':       return <ProfileSection setModal={setModal} setActive={setActive} profile={profile} onEditSaved={fetchProfile} appView={appView} timezone={timezone} language={language} visibility={visibility} />;
      case 'security':      return <SecuritySection setModal={setModal} />;
      case 'notifications': return <NotificationsSection />;
      case 'email':         return <EmailSection />;
      case 'privacy':       return <PrivacySection setModal={setModal} visibility={visibility} setVisibility={setVisibility} />;
      case 'team':          return <TeamSection setModal={setModal} />;
      case 'billing':       return <BillingSection router={router} />;
      case 'preferences':   return <PreferencesSection appView={appView} setAppView={setAppView} timezone={timezone} setTimezone={setTimezone} language={language} setLanguage={setLanguage} />;
      case 'integrations':  return <IntegrationsSection />;
      case 'documents':     return <DocumentsSection setModal={setModal} />;
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:BG, fontFamily:BARLOW, color:'#F5F5F5' }}>
      <AgencyTopnav />
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* SIDEBAR */}
        <aside style={{ width:SB_W, flexShrink:0, background:BG2, borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden', transition:'width 0.2s ease' }}>
          <div style={{ height:52, display:'flex', alignItems:'center', justifyContent:sidebarOpen?'flex-end':'center', padding:sidebarOpen?'0 12px':0, borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
            <button onClick={() => setOpen(v => !v)} style={{ background:'none', border:'none', cursor:'pointer', width:30, height:30, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background='none')}
            >{sidebarOpen ? <ChevronLeft size={16}/> : <Menu size={16}/>}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:9, background:'linear-gradient(135deg,#1a1410,#2a1e0e)', border:'1px solid rgba(212,166,74,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:GOLD, fontFamily:BEBAS, flexShrink:0 }}>{agencyInits}</div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{agencyName}</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize:14, color:RED, fontWeight:600, cursor:'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex:1, padding:sidebarOpen?'8px 6px':'8px 4px', overflowY:'auto' }}>
            {NAV_ITEMS.map(({ icon:Icon, label, href }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen?label:undefined}
                style={{ display:'flex', alignItems:'center', justifyContent:sidebarOpen?'space-between':'center', padding:sidebarOpen?'8px 10px':'10px 0', marginBottom:2, borderRadius:6, cursor:'pointer', position:'relative' }}
                onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent')}
              >
                <div style={{ display:'flex', alignItems:'center', gap:sidebarOpen?9:0, justifyContent:'center' }}>
                  <Icon size={15} color="rgba(255,255,255,0.42)" strokeWidth={1.8}/>
                  {sidebarOpen && <span style={{ fontSize:15, color:'rgba(255,255,255,0.6)', whiteSpace:'nowrap' }}>{label}</span>}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <div style={{ flex:1, minWidth:0, overflowY:'auto', overflowX:'hidden' }}>
          <div style={{ display:'flex', alignItems:'flex-start', minHeight:'100%' }}>
            {/* Settings Nav */}
            <div style={{ width:220, flexShrink:0, borderRight:'1px solid rgba(255,255,255,0.06)', padding:'24px 12px', position:'sticky', top:0, height:'100vh', overflowY:'auto' }}>
              <div style={{ fontFamily:BEBAS, fontSize:22, color:GOLD, letterSpacing:1, marginBottom:4, paddingLeft:8 }}>SETTINGS</div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20, paddingLeft:8 }}>Manage your account</div>
              {SETTINGS_NAV.map(nav => {
                const Icon = nav.icon; const active = activeSection === nav.key;
                return (
                  <div key={nav.key} onClick={() => setActive(nav.key)}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', marginBottom:2, borderRadius:8, cursor:'pointer', background:active?`${RED}15`:'transparent', borderLeft:active?`3px solid ${RED}`:'3px solid transparent' }}
                    onMouseEnter={e => { if(!active)(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if(!active)(e.currentTarget as HTMLDivElement).style.background='transparent'; }}
                  >
                    <Icon size={16} color={active?RED:'rgba(255,255,255,0.4)'} strokeWidth={active?2.5:1.8}/>
                    <span style={{ fontFamily:BARLOW, fontSize:15, color:active?'#F5F5F5':'rgba(255,255,255,0.55)', fontWeight:active?600:400 }}>{nav.label}</span>
                  </div>
                );
              })}
            </div>
            {/* Section Content */}
            <div style={{ flex:1, minWidth:0, padding:'24px 24px 40px' }}>
              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal === 'changePassword' && <ChangePasswordModal onClose={() => setModal('')} />}
      {modal === 'editProfile'    && <EditProfileModal profile={profile} onClose={() => setModal('')} onSaved={fetchProfile} />}
      {modal === 'push'           && <PushNotifModal prefs={pushPrefs} setPrefs={setPushPrefs} onClose={() => setModal('')} />}
      {modal === 'emailNotif'     && <EmailNotifModal prefs={emailPrefs} setPrefs={setEmailPrefs} onClose={() => setModal('')} />}
      {modal === 'sms'            && <SmsNotifModal prefs={smsPrefs} setPrefs={setSmsPrefs} phone={smsPhone} setPhone={setSmsPhone} onClose={() => setModal('')} />}
      {modal === 'dataActivity'   && <DataActivityModal prefs={dataPrefs} setPrefs={setDataPrefs} onClose={() => setModal('')} />}

      {modal === 'uploadLogo' && (
        <Modal title="UPLOAD COMPANY LOGO" onClose={() => setModal('')}>
          <div style={{ border:'2px dashed rgba(255,255,255,0.15)', borderRadius:10, padding:32, textAlign:'center' as const, marginBottom:16, cursor:'pointer' }}
            onClick={() => document.getElementById('logo-file-input')?.click()}>
            <Upload size={28} color="rgba(255,255,255,0.3)" style={{ marginBottom:10 }}/>
            <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', marginBottom:4 }}>Drag & drop your logo here</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:14 }}>PNG, JPG or SVG · Max 2MB · Recommended 400×400px</div>
            <button onClick={e => { e.stopPropagation(); document.getElementById('logo-file-input')?.click(); }} style={{ padding:'8px 20px', background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}>Browse File</button>
            <input id="logo-file-input" type="file" accept="image/png,image/jpeg,image/svg+xml" style={{ display:'none' }} />
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={async () => {
              const input = document.getElementById('logo-file-input') as HTMLInputElement;
              const file = input?.files?.[0];
              if (!file) { alert('Please select a logo file first.'); return; }
              const fd = new FormData();
              fd.append('file', file);
              fd.append('doc_type', 'logo');
              fd.append('doc_label', 'Company Logo');
              try {
                const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
                await fetch('/api/agency/documents', { method:'POST', headers: u.token ? { Authorization: `Bearer ${u.token}` } : {}, body: fd });
                alert('Logo uploaded successfully!');
              } catch { alert('Upload failed. Please try again.'); }
              setModal('');
            }} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Upload Logo</button>
          </div>
        </Modal>
      )}

      {/* uploadDoc modal handled inside DocumentsSection */}

      {modal === 'viewDoc' && (
        <Modal title="DOCUMENT PREVIEW" onClose={() => setModal('')}>
          <div style={{ background:BG3, borderRadius:10, padding:32, textAlign:'center' as const, marginBottom:16, minHeight:180, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div>
              <div style={{ fontFamily:BEBAS, fontSize:22, color:GOLD, letterSpacing:2, marginBottom:8 }}>DOCUMENT PREVIEW</div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Document viewer loads here in production</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
            <button style={{ flex:1, padding:10, background:BLUE, border:'none', borderRadius:7, color:'#fff', fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Upload size={14}/> Download</button>
          </div>
        </Modal>
      )}

      {modal === 'sessions' && (
        <Modal title="ACTIVE LOGIN SESSIONS" onClose={() => setModal('')}>
          {[
            { device:'Chrome on Windows', location:'Mumbai, India', time:'Active now',  current:true  },
            { device:'Safari on iPhone',  location:'Mumbai, India', time:'2 hours ago', current:false },
            { device:'Firefox on Mac',    location:'Delhi, India',  time:'Yesterday',   current:false },
          ].map((s, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{s.device}</div>
                <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{s.location} · {s.time}</div>
              </div>
              {s.current
                ? <span style={{ fontFamily:BARLOW, fontSize:14, color:GREEN, fontWeight:600 }}>Current</span>
                : <button onClick={() => setModal('')} style={{ padding:'5px 12px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.25)', borderRadius:5, color:RED, fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}>Revoke</button>
              }
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <button onClick={() => setModal('')} style={{ width:'100%', padding:10, background:'rgba(200,32,42,0.12)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:7, color:RED, fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:10 }}>Revoke All Other Sessions</button>
            <button onClick={() => setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
          </div>
        </Modal>
      )}

      {modal === 'securityLogs' && (
        <Modal title="SECURITY LOGS" onClose={() => setModal('')}>
          {[
            { action:'Login',           detail:'Chrome on Windows · Mumbai', time:'Today, 10:42 AM',  color:GREEN  },
            { action:'Password Changed',detail:'Via settings',               time:'3 months ago',     color:GOLD   },
            { action:'Failed Login',    detail:'Unknown device · Delhi',     time:'1 week ago',       color:RED    },
            { action:'Profile Updated', detail:'Company info updated',       time:'2 weeks ago',      color:PURPLE },
          ].map((log, i) => (
            <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:log.color, marginTop:6, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{log.action}</div>
                <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{log.detail}</div>
              </div>
              <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.3)', whiteSpace:'nowrap' as const }}>{log.time}</div>
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <button onClick={() => setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
          </div>
        </Modal>
      )}

      {modal === 'devices' && (
        <Modal title="TRUSTED DEVICES" onClose={() => setModal('')}>
          {[
            { device:'Chrome on Windows 11', added:'Added 6 months ago' },
            { device:'Safari on iPhone 15',  added:'Added 2 months ago' },
          ].map((d, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{d.device}</div>
                <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>{d.added}</div>
              </div>
              <button onClick={() => setModal('')} style={{ padding:'5px 12px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.25)', borderRadius:5, color:RED, fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}>Remove</button>
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <button onClick={() => setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
          </div>
        </Modal>
      )}

      {modal === 'inviteMember' && <InviteMemberModal onClose={() => setModal('')} />}

      {modal === 'removeMember' && (
        <Modal title="REMOVE TEAM MEMBER" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:20, lineHeight:1.6 }}>Are you sure you want to remove this team member? They will lose access immediately.</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Remove Member</button>
          </div>
        </Modal>
      )}

      {modal === 'deleteAccount' && (
        <Modal title="DELETE ACCOUNT" onClose={() => setModal('')}>
          <div style={{ padding:'14px 16px', background:'rgba(200,32,42,0.08)', border:'1px solid rgba(200,32,42,0.25)', borderRadius:8, marginBottom:16 }}>
            <div style={{ fontFamily:BARLOW, fontSize:15, color:RED, fontWeight:700, marginBottom:4 }}>⚠️ This action cannot be undone</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>All your data, casting calls, applications, and team access will be permanently deleted.</div>
          </div>
          {(() => {
            const [confirmText, setConfirmText] = React.useState('');
            return <>
              <ControlledInput label="Type DELETE to confirm" value={confirmText} onChange={setConfirmText} placeholder="DELETE" />
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
                <button disabled={confirmText !== 'DELETE'} onClick={() => { localStorage.removeItem('ss_user'); window.location.replace('/login'); }} style={{ flex:2, padding:10, background: confirmText === 'DELETE' ? RED : 'rgba(200,32,42,0.3)', border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor: confirmText === 'DELETE' ? 'pointer' : 'not-allowed' }}>Delete My Account</button>
          </div>
            </>;
          })()}
        </Modal>
      )}

      {modal === 'billing' && (
        <Modal title="BILLING & SUBSCRIPTION" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>You will be redirected to the Billing & Subscription page for full management.</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => { setModal(''); router.push('/agency/subscription'); }} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Go to Billing</button>
          </div>
        </Modal>
      )}

      {modal === 'visibility' && (
        <Modal title="PROFILE VISIBILITY" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:16 }}>Control who can see your agency profile on SilverScreens.</div>
          {['Public','Agency Members Only','Private'].map(v => (
            <div key={v} onClick={() => setVisibility(v)}
              style={{ padding:'12px 16px', marginBottom:8, background:visibility===v?`${GOLD}10`:BG3, border:`1px solid ${visibility===v?GOLD:'rgba(255,255,255,0.08)'}`, borderRadius:8, cursor:'pointer', display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontFamily:BARLOW, fontSize:15, color:visibility===v?GOLD:'#F5F5F5', fontWeight:visibility===v?700:400 }}>{v}</span>
              {visibility===v && <Check size={16} color={GOLD}/>}
            </div>
          ))}
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Changes</button>
          </div>
        </Modal>
      )}

      {modal === 'downloadData' && (
        <Modal title="DOWNLOAD YOUR DATA" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:20, lineHeight:1.6 }}>Request a copy of all your data including profile, casting calls, applications, and messages. You will receive a download link via email within 24 hours.</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Request Data Export</button>
          </div>
        </Modal>
      )}

      {modal === 'privacy' && (
        <Modal title="PRIVACY POLICY" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.8, marginBottom:20 }}>
            SilverScreens collects and uses your data to provide and improve our services. We use industry-standard encryption to protect your information and never sell your personal data to third parties.<br/><br/>
            You have the right to access, correct, or delete your personal data at any time.
          </div>
          <button onClick={() => { setModal(''); window.open('/privacy-policy', '_blank'); }} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>View Full Privacy Policy</button>
        </Modal>
      )}

      {modal === 'teamMembers' && (
        <Modal title="TEAM MEMBERS" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.5)', marginBottom:16 }}>Go to Team & Permissions to manage your team members.</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => { setModal(''); setActive('team'); }} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Go to Team Settings</button>
          </div>
        </Modal>
      )}

      {modal === 'roles' && <RolesModal onClose={() => setModal('')} />}

      {modal === 'prefs' && (
        <Modal title="DEFAULT VIEW" onClose={() => setModal('')}>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Default Application View</label>
            <select value={appView} onChange={e => setAppView(e.target.value)} style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <option>List View</option><option>Grid View</option><option>Kanban View</option>
            </select>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => { try { localStorage.setItem('agency_default_view', appView); } catch {} setModal(''); }} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Changes</button>
          </div>
        </Modal>
      )}

      {modal === 'timezone' && (
        <Modal title="TIMEZONE SETTINGS" onClose={() => setModal('')}>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Select Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
              <optgroup label="India"><option>(GMT+05:30) India Standard Time – Mumbai, Delhi</option></optgroup>
              <optgroup label="Asia">
                <option>(GMT+05:30) Sri Lanka</option>
                <option>(GMT+05:45) Nepal Standard Time</option>
                <option>(GMT+06:00) Bangladesh, Bhutan</option>
                <option>(GMT+05:00) Pakistan Standard Time</option>
                <option>(GMT+04:00) Dubai, Abu Dhabi – UAE</option>
                <option>(GMT+03:00) Saudi Arabia, Kuwait, Riyadh</option>
                <option>(GMT+02:00) Israel, Jordan</option>
                <option>(GMT+07:00) Bangkok, Jakarta, Vietnam</option>
                <option>(GMT+08:00) Singapore, Kuala Lumpur</option>
                <option>(GMT+08:00) China Standard Time – Beijing</option>
                <option>(GMT+08:00) Hong Kong, Manila</option>
                <option>(GMT+09:00) Japan Standard Time – Tokyo</option>
                <option>(GMT+09:00) Korea Standard Time – Seoul</option>
                <option>(GMT+09:30) Australia – Adelaide, Darwin</option>
                <option>(GMT+10:00) Australia – Sydney, Melbourne</option>
                <option>(GMT+12:00) New Zealand – Auckland</option>
              </optgroup>
              <optgroup label="Europe">
                <option>(GMT+00:00) London, Dublin, Lisbon</option>
                <option>(GMT+01:00) Paris, Berlin, Amsterdam, Rome, Madrid</option>
                <option>(GMT+02:00) Athens, Helsinki, Cairo, Bucharest</option>
                <option>(GMT+03:00) Moscow, Istanbul, Nairobi</option>
              </optgroup>
              <optgroup label="Americas">
                <option>(GMT-05:00) New York, Toronto – Eastern Time</option>
                <option>(GMT-06:00) Chicago, Dallas – Central Time</option>
                <option>(GMT-07:00) Denver, Phoenix – Mountain Time</option>
                <option>(GMT-08:00) Los Angeles, Vancouver – Pacific Time</option>
                <option>(GMT-09:00) Alaska</option>
                <option>(GMT-10:00) Hawaii</option>
                <option>(GMT-03:00) Brazil – São Paulo</option>
                <option>(GMT-04:00) Venezuela, Bolivia</option>
                <option>(GMT-05:00) Colombia, Peru, Ecuador</option>
                <option>(GMT-06:00) Mexico City, Guatemala</option>
              </optgroup>
              <optgroup label="Africa">
                <option>(GMT+00:00) Ghana, Côte d'Ivoire</option>
                <option>(GMT+01:00) Nigeria, Cameroon, Morocco</option>
                <option>(GMT+02:00) South Africa, Egypt, Zimbabwe</option>
                <option>(GMT+03:00) Kenya, Ethiopia, Tanzania</option>
              </optgroup>
              <optgroup label="UTC"><option>(GMT+00:00) UTC – Coordinated Universal Time</option></optgroup>
            </select>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Changes</button>
          </div>
        </Modal>
      )}

      {modal === 'language' && (
        <Modal title="LANGUAGE SETTINGS" onClose={() => setModal('')}>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:12 }}>Select the language for your agency dashboard.</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
            {['English','Hindi','Marathi','Tamil','Telugu','Kannada','Bengali','Gujarati','Punjabi','Malayalam'].map(lang => (
              <div key={lang} onClick={() => setLanguage(lang)}
                style={{ padding:'12px 16px', background:language===lang?`${GOLD}10`:BG3, border:`1px solid ${language===lang?GOLD:'rgba(255,255,255,0.08)'}`, borderRadius:8, cursor:'pointer', display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontFamily:BARLOW, fontSize:15, color:language===lang?GOLD:'#F5F5F5', fontWeight:language===lang?700:400 }}>{lang}</span>
                {language===lang && <Check size={16} color={GOLD}/>}
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={() => setModal('')} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Changes</button>
          </div>
        </Modal>
      )}

    </div>
  );
}