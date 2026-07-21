'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
import AgencyTopnav from '@/components/layout/AgencyTopnav'

  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, ChevronRight, Menu,
  User, Lock, BellRing, Mail, Shield, Users, CreditCard,
  Sliders, Puzzle, Edit, X, Check, Plus, Trash2, Upload,
  ExternalLink, FileCheck,
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
  { icon: MessageSquare,   label: 'Messages',    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', href: '/agency/notifications' },
];

const PROFILE_MENU = [
  { label: 'Reports & Analytics',   href: '/agency/reports' },
  { label: 'Subscription & Billing',href: '/agency/subscription' },
  { label: 'Company Profile',        href: '/agency-profile' },
  { label: 'Documents',              href: '/agency/documents' },
  { label: 'Calendar',               href: '/agency/calendar' },
  { label: 'Settings',               href: '/agency/settings' },
  { label: 'Support',                href: '/contact' },
  { label: 'Logout',                 href: '/login' },
];

type Section = 'profile'|'security'|'notifications'|'email'|'privacy'|'team'|'billing'|'preferences'|'integrations'|'documents';

const SETTINGS_NAV: { key: Section; label: string; icon: any }[] = [
  { key:'profile',       label:'Profile & Company',      icon:User       },
  { key:'security',      label:'Account & Security',     icon:Lock       },
  { key:'notifications', label:'Notifications',          icon:BellRing   },
  { key:'email',         label:'Email Preferences',      icon:Mail       },
  { key:'privacy',       label:'Privacy',                icon:Shield     },
  { key:'team',          label:'Team & Permissions',     icon:Users      },
  { key:'billing',       label:'Billing & Subscription', icon:CreditCard },
  { key:'preferences',   label:'Other Preferences',      icon:Sliders    },
  { key:'integrations',  label:'Integrations',           icon:Puzzle     },
  { key:'documents',     label:'Documents & Verification',icon:FileCheck  },
];

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
        {sub && <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{sub}</div>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {badge && <span style={{ padding:'2px 10px', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:20, fontFamily:BARLOW, fontSize: 14, color:GREEN, fontWeight:600 }}>{badge}</span>}
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
          <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{desc}</div>
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

function InputRow({ label, defaultValue, type='text', placeholder='' }: { label:string; defaultValue?:string; type?:string; placeholder?:string }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder}
        style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', boxSizing:'border-box' as const }} />
    </div>
  );
}

function MFooter({ onClose, label='Save Changes' }: { onClose:()=>void; label?:string }) {
  return (
    <div style={{ display:'flex', gap:10, marginTop:8 }}>
      <button onClick={onClose} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
      <button onClick={onClose} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>{label}</button>
    </div>
  );
}

function ProfileSection({ setModal }: { setModal:(m:string)=>void }) {
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
          <div style={{ background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:6, cursor:'pointer' }} onClick={() => setModal('uploadLogo')}>
            <div style={{ fontFamily:BEBAS, fontSize:18, color:GOLD, letterSpacing:2, textAlign:'center', lineHeight:1.2 }}>DHARMA<br/>PRODUCTIONS</div>
            <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.3)' }}>Click to change logo</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 32px' }}>
            {[
              { label:'Company Name',   value:'Dharma Productions' },
              { label:'Company Email',  value:'casting@dharmaproductions.com' },
              { label:'Industry',       value:'Production House' },
              { label:'Phone Number',   value:'+91 98765 43210' },
              { label:'Company Address',value:'Dharma Productions, 5th Floor, Maker Chambers IV, 222, Nariman Point, Mumbai, Maharashtra 400021, India', full:true },
              { label:'About Company',  value:"Dharma Productions is one of India's leading production houses, creating engaging stories for over 50 years.", full:true },
            ].map(row => (
              <div key={row.label} style={{ gridColumn: row.full ? '1/-1' : 'auto' }}>
                <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>{row.label}</div>
                <div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', fontWeight:500, lineHeight:1.5 }}>{row.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        <Card icon={<Lock size={20} color={GREEN}/>} iconColor={GREEN} title="Account & Security" desc="Manage your password and security settings.">
          <SettingRow label="Change Password"           onClick={() => setModal('changePassword')} />
          <SettingRow label="Two-Factor Authentication" badge="Enabled" onClick={() => setModal('2fa')} />
          <SettingRow label="Login Sessions"            onClick={() => setModal('sessions')} />
          <SettingRow label="Security Logs" danger       onClick={() => setModal('securityLogs')} />
        </Card>
        <Card icon={<BellRing size={20} color={PURPLE}/>} iconColor={PURPLE} title="Notifications" desc="Choose what you want to be notified about.">
          <SettingRow label="Push Notifications"  onClick={() => setModal('push')} />
          <SettingRow label="Email Notifications" onClick={() => setModal('emailNotif')} />
          <SettingRow label="SMS Notifications"   onClick={() => setModal('sms')} />
        </Card>
        <Card icon={<Users size={20} color={BLUE}/>} iconColor={BLUE} title="Team & Permissions" desc="Manage your team members and their access.">
          <SettingRow label="Team Members" value="15" onClick={() => setModal('teamMembers')} />
          <SettingRow label="Roles & Permissions"      onClick={() => setModal('roles')} />
          <SettingRow label="Invite New Member"        onClick={() => setModal('inviteMember')} />
        </Card>
        <Card icon={<CreditCard size={20} color={GOLD}/>} iconColor={GOLD} title="Billing & Subscription" desc="View your plan details and billing history.">
          <SettingRow label="Current Plan" badge="Professional" onClick={() => setModal('billing')} />
          <SettingRow label="Billing History" onClick={() => setModal('billing')} />
          <SettingRow label="Invoices"        onClick={() => setModal('billing')} />
        </Card>
        <Card icon={<Sliders size={20} color={ORANGE}/>} iconColor={ORANGE} title="Other Preferences" desc="Customize your platform experience.">
          <SettingRow label="Default Application View" value="List View"                        onClick={() => setModal('prefs')} />
          <SettingRow label="Timezone"                  value="(GMT+05:30) India Standard Time" onClick={() => setModal('timezone')} />
          <SettingRow label="Language"                  value="English"                         onClick={() => setModal('language')} />
        </Card>
        <Card icon={<Shield size={20} color={RED}/>} iconColor={RED} title="Privacy" desc="Control your data and privacy settings.">
          <SettingRow label="Profile Visibility" value="Public" onClick={() => setModal('visibility')} />
          <SettingRow label="Data & Activity"                    onClick={() => setModal('dataActivity')} />
          <SettingRow label="Delete Account" danger              onClick={() => setModal('deleteAccount')} />
        </Card>
      </div>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'18px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Lock size={22} color="rgba(255,255,255,0.3)" />
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5' }}>Your data is safe with us</div>
            <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>We use industry-standard encryption and security practices to protect your information.</div>
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

function SecuritySection({ setModal }: { setModal:(m:string)=>void }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
        <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Account & Security</div>
        <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Manage your password and security settings.</div>
        <SettingRow label="Change Password"              sub="Last changed 3 months ago"          onClick={() => setModal('changePassword')} />
        <SettingRow label="Two-Factor Authentication"    sub="Using authenticator app" badge="Enabled" onClick={() => setModal('2fa')} />
        <SettingRow label="Login Sessions"               sub="3 active sessions"                   onClick={() => setModal('sessions')} />
        <SettingRow label="Security Logs"                sub="View recent account activity" danger onClick={() => setModal('securityLogs')} />
        <SettingRow label="Trusted Devices"              sub="2 trusted devices"                   onClick={() => setModal('devices')} />
      </div>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
        <div style={{ fontFamily:BARLOW, fontSize:17, fontWeight:700, color:'#F5F5F5', marginBottom:16 }}>Danger Zone</div>
        <div style={{ padding:16, background:'rgba(200,32,42,0.08)', border:'1px solid rgba(200,32,42,0.2)', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:RED }}>Delete Account</div>
            <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>Permanently delete your account and all data.</div>
          </div>
          <button onClick={() => setModal('deleteAccount')} style={{ padding:'8px 16px', background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({ newApp:true, auditionReminder:true, casting:true, messages:true, teamActivity:false, weeklyReport:true, marketing:false, systemUpdates:true });
  const toggle = (k:string) => setPrefs(p => ({ ...p, [k]:!p[k as keyof typeof p] }));
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
            <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{row.sub}</div>
          </div>
          <Toggle on={prefs[row.key as keyof typeof prefs]} onChange={() => toggle(row.key)} />
        </div>
      ))}
    </div>
  );
}

function EmailSection() {
  const [prefs, setPrefs] = useState({ daily:true, weekly:true, instant:false, digest:true });
  const toggle = (k:string) => setPrefs(p => ({ ...p, [k]:!p[k as keyof typeof p] }));
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Email Preferences</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Manage how and when we email you.</div>
      <InputRow label="Email Address" defaultValue="casting@dharmaproductions.com" />
      {[
        { key:'instant', label:'Instant Notifications', sub:'Receive emails immediately for important events' },
        { key:'daily',   label:'Daily Digest',          sub:'One summary email each day' },
        { key:'weekly',  label:'Weekly Summary',        sub:'One summary email each week' },
        { key:'digest',  label:'Application Digest',    sub:'Digest of new applications' },
      ].map(row => (
        <div key={row.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{row.label}</div>
            <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{row.sub}</div>
          </div>
          <Toggle on={prefs[row.key as keyof typeof prefs]} onChange={() => toggle(row.key)} />
        </div>
      ))}
      <div style={{ marginTop:16 }}>
        <button style={{ padding:'10px 24px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Preferences</button>
      </div>
    </div>
  );
}

function PrivacySection({ setModal }: { setModal:(m:string)=>void }) {
  const [vis, setVis] = useState('Public');
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Privacy Settings</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Control your data and privacy settings.</div>
      <div style={{ marginBottom:16 }}>
        <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Profile Visibility</label>
        <div style={{ display:'flex', gap:10 }}>
          {['Public','Agency Only','Private'].map(v => (
            <button key={v} onClick={() => setVis(v)} style={{ flex:1, padding:10, background:vis===v?GOLD:BG3, border:`1px solid ${vis===v?GOLD:'rgba(255,255,255,0.1)'}`, borderRadius:7, color:vis===v?BG:'#F5F5F5', fontFamily:BARLOW, fontSize:14, fontWeight:600, cursor:'pointer' }}>{v}</button>
          ))}
        </div>
      </div>
      <SettingRow label="Data & Activity"    sub="Manage your activity data"          onClick={() => setModal('dataActivity')} />
      <SettingRow label="Download My Data"   sub="Export all your account data"       onClick={() => setModal('downloadData')} />
      <SettingRow label="View Privacy Policy" sub="Read our full privacy policy"      onClick={() => setModal('privacy')} />
      <SettingRow label="Delete Account"      sub="Permanently delete everything" danger onClick={() => setModal('deleteAccount')} />
    </div>
  );
}

function TeamSection({ setModal }: { setModal:(m:string)=>void }) {
  const members = [
    { name:'Rohan Verma',    role:'Admin',           email:'rohan@dharma.com', img:'photo-1472099645785-5658abf4ff4e' },
    { name:'Meera Iyer',     role:'Agency Member',   email:'meera@dharma.com', img:'photo-1494790108377-be9c29b29330' },
    { name:'Karan Malhotra', role:'Casting Director',email:'karan@dharma.com', img:'photo-1507003211169-0a1dd7228f2d' },
    { name:'Pooja Sharma',   role:'Agency Member',   email:'pooja@dharma.com', img:'photo-1529626455594-4ff0802cfb7e' },
    { name:'Ankit Gupta',    role:'Viewer',          email:'ankit@dharma.com', img:'photo-1500648767791-00dcc994a43e' },
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
              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{m.email}</div>
            </div>
            <select defaultValue={m.role} style={{ background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'6px 10px', color:'#F5F5F5', fontFamily:BARLOW, fontSize: 14, outline:'none', cursor:'pointer' }}>
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

function BillingSection({ router }: { router:any }) {
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Billing & Subscription</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Manage your subscription plan and billing details.</div>
      <div style={{ background:BG3, border:`1px solid ${GOLD}30`, borderRadius:10, padding:16, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontFamily:BEBAS, fontSize:20, color:GOLD, letterSpacing:1, marginBottom:4 }}>Agency Professional</div>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)' }}>₹14,999/month · Renews 01 Jul 2026</div>
        </div>
        <span style={{ padding:'4px 14px', background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:20, fontFamily:BARLOW, fontSize: 14, color:GREEN, fontWeight:700 }}>Active</span>
      </div>
      <SettingRow label="Change Plan"          sub="Upgrade or downgrade your plan"   onClick={() => router.push('/agency/subscription?tab=plans')} />
      <SettingRow label="Payment Methods"      sub="Manage cards and payment options" onClick={() => router.push('/agency/subscription?tab=payment')} />
      <SettingRow label="Billing History"      sub="View past invoices and charges"   onClick={() => router.push('/agency/subscription?tab=billing')} />
      <SettingRow label="Invoices"             sub="Download your invoices"           onClick={() => router.push('/agency/subscription?tab=invoices')} />
      <SettingRow label="Cancel Subscription"  sub="Cancel your current plan" danger  onClick={() => router.push('/agency/subscription')} />
    </div>
  );
}

function PreferencesSection() {
  const [appView,setAppView]=useState('List View'); const [timezone,setTimezone]=useState('(GMT+05:30) India Standard Time'); const [language,setLanguage]=useState('English'); const [theme,setTheme]=useState('Dark'); const [dateFormat,setDateFormat]=useState('DD/MM/YYYY');
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Other Preferences</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Customize your platform experience.</div>
      {[
        { label:'Default Application View', value:appView,   options:['List View','Grid View','Kanban View'],   setter:setAppView   },
        { label:'Timezone',                 value:timezone,  options:['(GMT+05:30) India Standard Time','(GMT+00:00) UTC','(GMT+01:00) London'], setter:setTimezone },
        { label:'Language',                 value:language,  options:['English','Hindi','Marathi','Tamil','Telugu'], setter:setLanguage },
        { label:'Theme',                    value:theme,     options:['Dark','Light','System'],                 setter:setTheme     },
        { label:'Date Format',              value:dateFormat,options:['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'],  setter:setDateFormat},
      ].map(row => (
        <div key={row.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{row.label}</div>
          <select value={row.value} onChange={e => row.setter(e.target.value)} style={{ background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'7px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', cursor:'pointer', minWidth:220 }}>
            {row.options.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <div style={{ marginTop:16 }}>
        <button style={{ padding:'10px 24px', background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Save Preferences</button>
      </div>
    </div>
  );
}

function IntegrationsSection() {
  const [connected,setConnected]=useState({ google:true, slack:false, zapier:false, zoom:true, dropbox:false });
  const toggle=(k:string)=>setConnected(c=>({...c,[k]:!c[k as keyof typeof c]}));
  const integrations=[
    { key:'google', name:'Google Workspace', desc:'Sync calendar, drive and contacts',   icon:'G', color:'#EA4335' },
    { key:'slack',  name:'Slack',            desc:'Get notifications in Slack channels', icon:'S', color:'#4A154B' },
    { key:'zapier', name:'Zapier',           desc:'Automate workflows with 5000+ apps',  icon:'Z', color:ORANGE    },
    { key:'zoom',   name:'Zoom',             desc:'Schedule and host auditions on Zoom', icon:'Z', color:BLUE      },
    { key:'dropbox',name:'Dropbox',          desc:'Store and share production files',    icon:'D', color:BLUE      },
  ];
  return (
    <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
      <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Integrations</div>
      <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Connect SilverScreens with your favourite tools.</div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {integrations.map(int => (
          <div key={int.key} style={{ display:'flex', alignItems:'center', gap:16, padding:16, background:BG3, border:'1px solid rgba(255,255,255,0.06)', borderRadius:10 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:int.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:BEBAS, fontSize:20, color:'#fff', flexShrink:0 }}>{int.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5', marginBottom:2 }}>{int.name}</div>
              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{int.desc}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              {connected[int.key as keyof typeof connected] && <span style={{ fontFamily:BARLOW, fontSize: 14, color:GREEN, fontWeight:600 }}>Connected</span>}
              <button onClick={() => toggle(int.key)} style={{ padding:'7px 16px', background:connected[int.key as keyof typeof connected]?'transparent':GOLD, border:connected[int.key as keyof typeof connected]?'1px solid rgba(200,32,42,0.3)':'none', borderRadius:7, color:connected[int.key as keyof typeof connected]?RED:BG, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}>
                {connected[int.key as keyof typeof connected]?'Disconnect':'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function DocumentsSection({ setModal }: { setModal:(m:string)=>void }) {
  const DOCS = [
    { key:'incorporation', label:'Certificate of Incorporation', icon:'📜', required:true,  status:'Verified',   size:'2.4 MB', uploaded:'18 Jun 2025' },
    { key:'gst',           label:'GST Certificate',              icon:'📋', required:true,  status:'Verified',   size:'1.1 MB', uploaded:'18 Jun 2025' },
    { key:'address',       label:'Address Proof',                icon:'🏠', required:true,  status:'Pending',    size:null,     uploaded:null          },
    { key:'moa',           label:'MoA / AoA',                    icon:'📄', required:true,  status:'Not Uploaded',size:null,    uploaded:null          },
    { key:'pan',           label:'Company PAN',                  icon:'💳', required:true,  status:'Not Uploaded',size:null,    uploaded:null          },
    { key:'bank',          label:'Bank Account Proof',           icon:'🏦', required:false, status:'Not Uploaded',size:null,    uploaded:null          },
  ];

  const verified   = DOCS.filter(d => d.status==='Verified').length;
  const total      = DOCS.length;
  const pct        = Math.round((verified/total)*100);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Header card */}
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:BARLOW, fontSize:19, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Documents & Verification</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Upload required documents for agency verification. All documents are reviewed by our team within 2-3 business days.</div>
          </div>
          <div style={{ textAlign:'right' as const }}>
            <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Verification Progress</div>
            <div style={{ fontFamily:BEBAS, fontSize:28, color:pct===100?GREEN:GOLD, letterSpacing:1 }}>{pct}%</div>
            <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{verified} of {total} documents verified</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height:6, background:BG3, borderRadius:3, overflow:'hidden', marginBottom:8 }}>
          <div style={{ height:'100%', width:`${pct}%`, background:pct===100?GREEN:GOLD, borderRadius:3, transition:'width 0.4s ease' }}/>
        </div>
        <div style={{ display:'flex', gap:16 }}>
          {[{label:'Verified',color:GREEN},{label:'Pending',color:ORANGE},{label:'Not Uploaded',color:'rgba(255,255,255,0.3)'}].map(s => (
            <div key={s.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:s.color }}/>
              <span style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)' }}>{s.label}: {DOCS.filter(d=>d.status===s.label).length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status banner */}
      <div style={{ padding:'14px 18px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:10, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:8, background:'rgba(245,158,11,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span style={{ fontSize:18 }}>⏳</span>
        </div>
        <div>
          <div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:700, color:'#F59E0B', marginBottom:2 }}>Verification In Progress</div>
          <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)' }}>Your submitted documents are under review. Upload remaining documents to complete verification.</div>
        </div>
      </div>

      {/* Document list */}
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5' }}>Required Documents</div>
        {DOCS.map((doc, i) => (
          <div key={doc.key} style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', borderBottom:i<DOCS.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}
            onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
            onMouseLeave={e => (e.currentTarget.style.background='transparent')}
          >
            {/* Icon */}
            <div style={{ width:44, height:44, borderRadius:10, background:doc.status==='Verified'?'rgba(34,197,94,0.1)':doc.status==='Pending'?'rgba(245,158,11,0.1)':'rgba(255,255,255,0.05)', border:`1px solid ${doc.status==='Verified'?'rgba(34,197,94,0.25)':doc.status==='Pending'?'rgba(245,158,11,0.25)':'rgba(255,255,255,0.08)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{doc.icon}</div>

            {/* Info */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <span style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5' }}>{doc.label}</span>
                {doc.required && <span style={{ padding:'1px 7px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.2)', borderRadius:20, fontFamily:BARLOW, fontSize: 14, color:RED, fontWeight:600 }}>Required</span>}
              </div>
              {doc.uploaded
                ? <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>Uploaded on {doc.uploaded} · {doc.size}</div>
                : <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.35)' }}>Not yet uploaded · Accepted: PDF, JPG, PNG (max 5MB)</div>
              }
            </div>

            {/* Status */}
            <div style={{ flexShrink:0 }}>
              <span style={{ padding:'3px 12px', background:doc.status==='Verified'?'rgba(34,197,94,0.12)':doc.status==='Pending'?'rgba(245,158,11,0.12)':'rgba(255,255,255,0.05)', border:`1px solid ${doc.status==='Verified'?'rgba(34,197,94,0.3)':doc.status==='Pending'?'rgba(245,158,11,0.3)':'rgba(255,255,255,0.1)'}`, borderRadius:20, fontFamily:BARLOW, fontSize: 14, fontWeight:700, color:doc.status==='Verified'?GREEN:doc.status==='Pending'?ORANGE:'rgba(255,255,255,0.4)' }}>
                {doc.status==='Verified'?'✓ Verified':doc.status==='Pending'?'⏳ Under Review':'— Not Uploaded'}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              {doc.status !== 'Not Uploaded' && (
                <button onClick={() => setModal('viewDoc')} style={{ padding:'7px 14px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:7, color:BLUE, fontFamily:BARLOW, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                  <ExternalLink size={13}/> View
                </button>
              )}
              <button onClick={() => setModal('uploadDoc')} style={{ padding:'7px 14px', background:doc.status==='Not Uploaded'?GOLD:'rgba(255,255,255,0.06)', border:`1px solid ${doc.status==='Not Uploaded'?GOLD:'rgba(255,255,255,0.1)'}`, borderRadius:7, color:doc.status==='Not Uploaded'?BG:'rgba(255,255,255,0.7)', fontFamily:BARLOW, fontSize:14, fontWeight:doc.status==='Not Uploaded'?700:400, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                <Upload size={13}/> {doc.status==='Not Uploaded'?'Upload':'Replace'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Help card */}
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
        <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5', marginBottom:12 }}>Document Guidelines</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { icon:'📐', text:'File size must not exceed 5MB per document' },
            { icon:'🖼️', text:'Accepted formats: PDF, JPG, PNG, JPEG' },
            { icon:'✅', text:'Documents must be clear and fully legible' },
            { icon:'📅', text:'Documents must be valid and not expired' },
            { icon:'🔒', text:'All documents are encrypted and stored securely' },
            { icon:'⚡', text:'Verification takes 2-3 business days after submission' },
          ].map(g => (
            <div key={g.text} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 14px', background:BG3, borderRadius:8 }}>
              <span style={{ fontSize:16, flexShrink:0 }}>{g.icon}</span>
              <span style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.5 }}>{g.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [sidebarOpen,setOpen]=useState(false);
  const [profileOpen,setProfile]=useState(false);
  const [activeSection,setActive]=useState<Section>('profile');
  const [modal,setModal]=useState('');
  const SB_W=sidebarOpen?230:52;

  const renderSection=()=>{
    switch(activeSection){
      case 'profile':       return <ProfileSection setModal={setModal}/>;
      case 'security':      return <SecuritySection setModal={setModal}/>;
      case 'notifications': return <NotificationsSection/>;
      case 'email':         return <EmailSection/>;
      case 'privacy':       return <PrivacySection setModal={setModal}/>;
      case 'team':          return <TeamSection setModal={setModal}/>;
      case 'billing':       return <BillingSection router={router}/>;
      case 'preferences':   return <PreferencesSection/>;
      case 'integrations':  return <IntegrationsSection/>;
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:BG, fontFamily:BARLOW, color:'#F5F5F5' }}>
      {/* TOPNAV */}
      <AgencyTopnav />

      {/* BODY */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* SIDEBAR */}
        <aside style={{ width:SB_W, flexShrink:0, background:BG2, borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden', transition:'width 0.2s ease' }}>
          <div style={{ height:52, display:'flex', alignItems:'center', justifyContent:sidebarOpen?'flex-end':'center', padding:sidebarOpen?'0 12px':0, borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
            <button onClick={() => setOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', width:30, height:30, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' }}
              onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.07)')}
              onMouseLeave={e=>(e.currentTarget.style.background='none')}
            >{sidebarOpen?<ChevronLeft size={16}/>:<Menu size={16}/>}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:9, background:'linear-gradient(135deg,#1a1410,#2a1e0e)', border:'1px solid rgba(212,166,74,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:GOLD, fontFamily:BEBAS, flexShrink:0 }}>DP</div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Dharma Productions</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color:RED, fontWeight:600, cursor:'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex:1, padding:sidebarOpen?'8px 6px':'8px 4px', overflowY:'auto' }}>
            {NAV_ITEMS.map(({ icon:Icon, label, badge, href }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen?label:undefined}
                style={{ display:'flex', alignItems:'center', justifyContent:sidebarOpen?'space-between':'center', padding:sidebarOpen?'8px 10px':'10px 0', marginBottom:2, borderRadius:6, cursor:'pointer', position:'relative' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.04)')}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
              >
                <div style={{ display:'flex', alignItems:'center', gap:sidebarOpen?9:0, justifyContent:'center' }}>
                  <Icon size={15} color="rgba(255,255,255,0.42)" strokeWidth={1.8}/>
                  {sidebarOpen && <span style={{ fontSize:15, color:'rgba(255,255,255,0.6)', whiteSpace:'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background:RED, color:'#fff', borderRadius:10, fontSize: 14, fontWeight:700, padding:'1px 6px' }}>{badge}</div>}
                {!sidebarOpen && badge && <div style={{ position:'absolute', top:6, right:4, background:RED, borderRadius:'50%', width:14, height:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:700, color:'#fff' }}>{badge}</div>}
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
              <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginBottom:20, paddingLeft:8 }}>Manage your account</div>
              {SETTINGS_NAV.map(nav => {
                const Icon=nav.icon; const active=activeSection===nav.key;
                return (
                  <div key={nav.key} onClick={() => setActive(nav.key)}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', marginBottom:2, borderRadius:8, cursor:'pointer', background:active?`${RED}15`:'transparent', borderLeft:active?`3px solid ${RED}`:'3px solid transparent' }}
                    onMouseEnter={e=>{ if(!active)(e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e=>{ if(!active)(e.currentTarget as HTMLDivElement).style.background='transparent'; }}
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

      {/* MODALS */}
      {modal==='editProfile' && <Modal title="EDIT PROFILE" onClose={()=>setModal('')}><InputRow label="Company Name" defaultValue="Dharma Productions"/><InputRow label="Industry" defaultValue="Production House"/><InputRow label="Company Email" defaultValue="casting@dharmaproductions.com" type="email"/><InputRow label="Phone Number" defaultValue="+91 98765 43210"/><InputRow label="Company Address" defaultValue="Dharma Productions, 5th Floor, Maker Chambers IV, Mumbai"/><div style={{ marginBottom:16 }}><label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>About Company</label><textarea defaultValue="Dharma Productions is one of India's leading production houses, creating engaging stories for over 50 years." rows={3} style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const }}/></div><MFooter onClose={()=>setModal('')}/></Modal>}

      {modal==='uploadLogo' && <Modal title="UPLOAD COMPANY LOGO" onClose={()=>setModal('')}><div style={{ border:'2px dashed rgba(255,255,255,0.15)', borderRadius:10, padding:32, textAlign:'center' as const, marginBottom:16, cursor:'pointer' }}><Upload size={28} color="rgba(255,255,255,0.3)" style={{ marginBottom:10 }}/><div style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5', marginBottom:4 }}>Drag & drop your logo here</div><div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)', marginBottom:14 }}>PNG, JPG or SVG · Max 2MB · Recommended 400×400px</div><button style={{ padding:'8px 20px', background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BARLOW, fontSize:14, fontWeight:700, cursor:'pointer' }}>Browse File</button></div><MFooter onClose={()=>setModal('')} label="Upload Logo"/></Modal>}

      {modal==='changePassword' && <Modal title="CHANGE PASSWORD" onClose={()=>setModal('')}><InputRow label="Current Password" type="password" placeholder="Enter current password"/><InputRow label="New Password" type="password" placeholder="Enter new password"/><InputRow label="Confirm Password" type="password" placeholder="Confirm new password"/><MFooter onClose={()=>setModal('')} label="Update Password"/></Modal>}

      {modal==='2fa' && <Modal title="TWO-FACTOR AUTHENTICATION" onClose={()=>setModal('')}><div style={{ padding:'12px 16px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:8, marginBottom:16, display:'flex', gap:10 }}><Check size={18} color={GREEN}/><div style={{ fontFamily:BARLOW, fontSize:14, color:GREEN }}>Two-factor authentication is currently enabled on your account.</div></div><div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:20, lineHeight:1.6 }}>Using authenticator app. Your account is protected with an additional layer of security.</div><button onClick={()=>setModal('')} style={{ width:'100%', padding:10, background:'rgba(200,32,42,0.12)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:7, color:RED, fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:10 }}>Disable 2FA</button><MFooter onClose={()=>setModal('')} label="Done"/></Modal>}

      {modal==='sessions' && <Modal title="ACTIVE LOGIN SESSIONS" onClose={()=>setModal('')}>{[{device:'Chrome on Windows',location:'Mumbai, India',time:'Active now',current:true},{device:'Safari on iPhone',location:'Mumbai, India',time:'2 hours ago',current:false},{device:'Firefox on Mac',location:'Delhi, India',time:'Yesterday',current:false}].map((s,i)=>(
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div><div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{s.device}</div><div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{s.location} · {s.time}</div></div>
          {s.current?<span style={{ fontFamily:BARLOW, fontSize: 14, color:GREEN, fontWeight:600 }}>Current</span>:<button onClick={()=>setModal('')} style={{ padding:'5px 12px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.25)', borderRadius:5, color:RED, fontFamily:BARLOW, fontSize: 14, cursor:'pointer' }}>Revoke</button>}
        </div>
      ))}<div style={{ marginTop:16 }}><button onClick={()=>setModal('')} style={{ width:'100%', padding:10, background:'rgba(200,32,42,0.12)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:7, color:RED, fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:10 }}>Revoke All Other Sessions</button><button onClick={()=>setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button></div></Modal>}

      {modal==='securityLogs' && <Modal title="SECURITY LOGS" onClose={()=>setModal('')}>{[{action:'Login',detail:'Chrome on Windows · Mumbai',time:'Today, 10:42 AM',color:GREEN},{action:'Password Changed',detail:'Via settings',time:'3 months ago',color:GOLD},{action:'2FA Enabled',detail:'Authenticator app',time:'6 months ago',color:BLUE},{action:'Failed Login',detail:'Unknown device · Delhi',time:'1 week ago',color:RED},{action:'Profile Updated',detail:'Company info updated',time:'2 weeks ago',color:PURPLE}].map((log,i)=>(
        <div key={i} style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:log.color, marginTop:6, flexShrink:0 }}/>
          <div style={{ flex:1 }}><div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{log.action}</div><div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{log.detail}</div></div>
          <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.3)', whiteSpace:'nowrap' as const }}>{log.time}</div>
        </div>
      ))}<div style={{ marginTop:16 }}><button onClick={()=>setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button></div></Modal>}

      {modal==='devices' && <Modal title="TRUSTED DEVICES" onClose={()=>setModal('')}>{[{device:'Chrome on Windows 11',added:'Added 6 months ago'},{device:'Safari on iPhone 15',added:'Added 2 months ago'}].map((d,i)=>(
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div><div style={{ fontFamily:BARLOW, fontSize:15, fontWeight:600, color:'#F5F5F5' }}>{d.device}</div><div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>{d.added}</div></div>
          <button onClick={()=>setModal('')} style={{ padding:'5px 12px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.25)', borderRadius:5, color:RED, fontFamily:BARLOW, fontSize: 14, cursor:'pointer' }}>Remove</button>
        </div>
      ))}<div style={{ marginTop:16 }}><button onClick={()=>setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button></div></Modal>}

      {modal==='inviteMember' && <Modal title="INVITE TEAM MEMBER" onClose={()=>setModal('')}><InputRow label="Email Address" type="email" placeholder="colleague@example.com"/><div style={{ marginBottom:16 }}><label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Role</label><select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}><option>Agency Member</option><option>Casting Director</option><option>Viewer</option><option>Admin</option></select></div><MFooter onClose={()=>setModal('')} label="Send Invite"/></Modal>}

      {modal==='removeMember' && <Modal title="REMOVE TEAM MEMBER" onClose={()=>setModal('')}><div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:20, lineHeight:1.6 }}>Are you sure you want to remove this team member? They will lose access to your agency immediately.</div><div style={{ display:'flex', gap:10 }}><button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button><button onClick={()=>setModal('')} style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Remove Member</button></div></Modal>}

      {modal==='deleteAccount' && <Modal title="DELETE ACCOUNT" onClose={()=>setModal('')}><div style={{ padding:'14px 16px', background:'rgba(200,32,42,0.08)', border:'1px solid rgba(200,32,42,0.25)', borderRadius:8, marginBottom:16 }}><div style={{ fontFamily:BARLOW, fontSize:15, color:RED, fontWeight:700, marginBottom:4 }}>⚠️ This action cannot be undone</div><div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>All your data, casting calls, applications, and team access will be permanently deleted.</div></div><InputRow label="Type DELETE to confirm" placeholder="DELETE"/><div style={{ display:'flex', gap:10 }}><button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button><button onClick={()=>setModal('')} style={{ flex:2, padding:10, background:RED, border:'none', borderRadius:7, color:'#fff', fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Delete My Account</button></div></Modal>}

      {modal==='push' && <Modal title="PUSH NOTIFICATIONS" onClose={()=>setModal('')}>{['New Applications','Audition Reminders','Messages','Casting Call Updates'].map(item=>(<div key={item} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}><span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item}</span><Toggle on={true} onChange={()=>{}}/></div>))}<div style={{ marginTop:16 }}><MFooter onClose={()=>setModal('')}/></div></Modal>}

      {modal==='emailNotif' && <Modal title="EMAIL NOTIFICATIONS" onClose={()=>setModal('')}>{['New Applications','Shortlist Updates','Audition Reminders','Weekly Summary','Payment Receipts'].map(item=>(<div key={item} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}><span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item}</span><Toggle on={true} onChange={()=>{}}/></div>))}<div style={{ marginTop:16 }}><MFooter onClose={()=>setModal('')}/></div></Modal>}

      {modal==='sms' && <Modal title="SMS NOTIFICATIONS" onClose={()=>setModal('')}><InputRow label="Mobile Number" defaultValue="+91 98765 43210"/>{['Urgent Alerts Only','Audition Reminders','Payment Alerts'].map(item=>(<div key={item} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}><span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item}</span><Toggle on={item==='Urgent Alerts Only'} onChange={()=>{}}/></div>))}<div style={{ marginTop:16 }}><MFooter onClose={()=>setModal('')}/></div></Modal>}

      {modal==='visibility' && <Modal title="PROFILE VISIBILITY" onClose={()=>setModal('')}><div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:16 }}>Control who can see your agency profile on SilverScreens.</div>{['Public','Agency Members Only','Private'].map(v=>(<div key={v} onClick={()=>setModal('')} style={{ padding:'12px 16px', marginBottom:8, background:v==='Public'?`${GOLD}10`:BG3, border:`1px solid ${v==='Public'?GOLD:'rgba(255,255,255,0.08)'}`, borderRadius:8, cursor:'pointer', display:'flex', justifyContent:'space-between' }}><span style={{ fontFamily:BARLOW, fontSize:15, color:v==='Public'?GOLD:'#F5F5F5', fontWeight:v==='Public'?700:400 }}>{v}</span>{v==='Public'&&<Check size={16} color={GOLD}/>}</div>))}<div style={{ marginTop:8 }}><MFooter onClose={()=>setModal('')}/></div></Modal>}

      {modal==='dataActivity' && <Modal title="DATA & ACTIVITY" onClose={()=>setModal('')}>{['Allow analytics tracking','Personalized recommendations','Share usage statistics','Activity-based suggestions'].map(item=>(<div key={item} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}><span style={{ fontFamily:BARLOW, fontSize:15, color:'#F5F5F5' }}>{item}</span><Toggle on={item!=='Share usage statistics'} onChange={()=>{}}/></div>))}<div style={{ marginTop:16 }}><MFooter onClose={()=>setModal('')}/></div></Modal>}

      {modal==='downloadData' && <Modal title="DOWNLOAD YOUR DATA" onClose={()=>setModal('')}><div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:20, lineHeight:1.6 }}>Request a copy of all your data including profile, casting calls, applications, and messages. You will receive a download link via email within 24 hours.</div><MFooter onClose={()=>setModal('')} label="Request Data Export"/></Modal>}

      {modal==='privacy' && <Modal title="PRIVACY POLICY" onClose={()=>setModal('')}><div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.8 }}>SilverScreens collects and uses your data to provide and improve our services. We use industry-standard encryption to protect your information and never sell your personal data to third parties.<br/><br/>You have the right to access, correct, or delete your personal data at any time. For more details, please visit our full privacy policy at silverscreens.com/privacy.</div><div style={{ marginTop:20 }}><button onClick={()=>setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button></div></Modal>}

      {modal==='teamMembers' && <Modal title="TEAM MEMBERS" onClose={()=>setModal('')}><div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.5)', marginBottom:16 }}>You have 15 team members. Go to Team & Permissions to manage them.</div><MFooter onClose={()=>setModal('')} label="Go to Team Settings"/></Modal>}

      {modal==='roles' && <Modal title="ROLES & PERMISSIONS" onClose={()=>setModal('')}>{[{role:'Admin',perms:['Full Access','Billing','Team Management']},{role:'Casting Director',perms:['Casting Calls','Applications','Auditions']},{role:'Agency Member',perms:['View Castings','Messages']},{role:'Viewer',perms:['View Only']}].map(r=>(<div key={r.role} style={{ padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:16 }}><div style={{ width:130, fontFamily:BARLOW, fontSize:14, fontWeight:600, color:'#F5F5F5' }}>{r.role}</div><div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>{r.perms.map(p=>(<span key={p} style={{ padding:'2px 10px', background:BG3, border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.55)' }}>{p}</span>))}</div></div>))}<div style={{ marginTop:16 }}><button onClick={()=>setModal('')} style={{ width:'100%', padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button></div></Modal>}

      {modal==='uploadDoc' && <Modal title="UPLOAD DOCUMENT" onClose={()=>setModal('')}>
        <div style={{ padding:'20px', background:BG3, border:'2px dashed rgba(212,166,74,0.3)', borderRadius:10, textAlign:'center' as const, marginBottom:16, cursor:'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor=GOLD)}
          onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(212,166,74,0.3)')}
        >
          <div style={{ fontSize:32, marginBottom:8 }}>📁</div>
          <div style={{ fontFamily:BARLOW, fontSize:16, fontWeight:700, color:'#F5F5F5', marginBottom:4 }}>Click to browse or drag & drop</div>
          <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.4)' }}>PDF, JPG, PNG up to 5MB</div>
        </div>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Document Type</div>
          <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}>
            <option>Certificate of Incorporation</option>
            <option>GST Certificate</option>
            <option>Address Proof</option>
            <option>MoA / AoA</option>
            <option>Company PAN</option>
            <option>Bank Account Proof</option>
          </select>
        </div>
        <MFooter onClose={()=>setModal('')} label="Upload Document"/>
      </Modal>}
      {modal==='viewDoc' && <Modal title="DOCUMENT PREVIEW" onClose={()=>setModal('')}>
        <div style={{ background:BG3, borderRadius:10, padding:32, textAlign:'center' as const, marginBottom:16, minHeight:180, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div>
            <div style={{ fontFamily:BEBAS, fontSize:22, color:GOLD, letterSpacing:2, marginBottom:8 }}>DOCUMENT PREVIEW</div>
            <div style={{ fontFamily:BARLOW, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Document viewer loads here in production</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Close</button>
          <button style={{ flex:1, padding:10, background:BLUE, border:'none', borderRadius:7, color:'#fff', fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Upload size={14}/> Download</button>
        </div>
      </Modal>}
      {modal==='billing' && <Modal title="BILLING & SUBSCRIPTION" onClose={()=>setModal('')}><div style={{ fontFamily:BARLOW, fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>You will be redirected to the Billing & Subscription page for full management.</div><div style={{ display:'flex', gap:10 }}><button onClick={()=>setModal('')} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button><button onClick={()=>{setModal('');router.push('/agency/subscription');}} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:7, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Go to Billing</button></div></Modal>}

      {modal==='prefs' && <Modal title="DEFAULT VIEW" onClose={()=>setModal('')}><div style={{ marginBottom:16 }}><label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Default Application View</label><select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}><option>List View</option><option>Grid View</option><option>Kanban View</option></select></div><MFooter onClose={()=>setModal('')}/></Modal>}

      {modal==='timezone' && <Modal title="TIMEZONE SETTINGS" onClose={()=>setModal('')}><div style={{ marginBottom:16 }}><label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Select Timezone</label><select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:15, outline:'none' }}><option>(GMT+05:30) India Standard Time</option><option>(GMT+00:00) UTC</option><option>(GMT+01:00) London</option><option>(GMT-05:00) New York</option></select></div><MFooter onClose={()=>setModal('')}/></Modal>}

      {modal==='language' && <Modal title="LANGUAGE SETTINGS" onClose={()=>setModal('')}><div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>{['English','Hindi','Marathi','Tamil','Telugu','Kannada'].map(lang=>(<div key={lang} onClick={()=>setModal('')} style={{ padding:'12px 16px', background:lang==='English'?`${GOLD}10`:BG3, border:`1px solid ${lang==='English'?GOLD:'rgba(255,255,255,0.08)'}`, borderRadius:8, cursor:'pointer', display:'flex', justifyContent:'space-between' }}><span style={{ fontFamily:BARLOW, fontSize:15, color:lang==='English'?GOLD:'#F5F5F5', fontWeight:lang==='English'?700:400 }}>{lang}</span>{lang==='English'&&<Check size={16} color={GOLD}/>}</div>))}</div><MFooter onClose={()=>setModal('')}/></Modal>}

    </div>
  );
}