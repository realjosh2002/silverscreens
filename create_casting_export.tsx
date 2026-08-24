'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  ChevronLeft, ChevronRight, ChevronDown, Check, X,
  Bell, MessageSquare, FileText, Clapperboard, Building2,
  Camera, Tv, Mail, Music2, MoreHorizontal,
  Users, UserRound, UsersRound, Mic, Video, Radio,
  HelpCircle, ExternalLink, Save, Eye, Edit2, Info,
  Calendar as CalendarIcon, MapPin,
} from 'lucide-react';

/* ─── Design tokens ─────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const DRAFT_KEY = 'ss_agency_casting_draft';

/* ─── Static option data ────────────────────────────────────── */
const PROJECT_TYPES = [
  { key: 'Film',        icon: Clapperboard },
  { key: 'Web Series',  icon: Building2    },
  { key: 'Short Film',  icon: Camera       },
  { key: 'TV Series',   icon: Tv           },
  { key: 'Commercial',  icon: Mail         },
  { key: 'Music Video', icon: Music2       },
  { key: 'Other',       icon: MoreHorizontal },
];

const ROLE_TYPES = ['Lead', 'Supporting', 'Background / Extra', 'Cameo', 'Voice Over', 'Host / Anchor', 'Other'];
const EXPERIENCE_OPTIONS = ['No Experience', 'Less than 1 Year', '1 - 2 Years', '2 - 5 Years', '5 - 10 Years', '10+ Years'];
const SKILLS = ['Acting', 'Dance', 'Singing', 'Dialogue Delivery', 'Modeling', 'Stunts', 'Voice Over', 'Comedy', 'Other'];

const DEPT_SKILLS: Record<string, string[]> = {
  'Acting':           ['Dialogue Delivery', 'Improvisation', 'Method Acting', 'Stage Acting', 'Screen Acting', 'Action Sequences', 'Comedy Timing', 'Emotional Range', 'Accent / Dialect', 'Dancing', 'Singing', 'Stunts'],
  'Direction':        ['Script Analysis', 'Shot Composition', 'Blocking', 'Actor Direction', 'Storyboarding', 'On-Set Leadership', 'Post Supervision'],
  'Production Office':['Scheduling', 'Budgeting', 'Crew Management', 'Location Coordination', 'Production Planning', 'Call Sheet Preparation', 'Vendor Management'],
  'Accounting':       ['Film Budgeting', 'Cost Reporting', 'Petty Cash Management', 'Payroll', 'Tally / Accounting Software'],
  'Locations':        ['Location Scouting', 'Permits & Permissions', 'Negotiation', 'Site Management', 'Logistics'],
  'Continuity':       ['Script Supervision', 'Detail Orientation', 'Photography', 'Continuity Reports', 'Scene Logging'],
  'Casting':          ['Talent Sourcing', 'Audition Coordination', 'Character Analysis', 'Negotiation', 'Database Management'],
  'Camera & Lighting':['Camera Operation', 'Lighting Design', 'Lens Selection', 'Color Theory', 'DIT', 'Crane / Jib Operation', 'Steadicam', 'Drone Operation'],
  'Grip':             ['Rigging', 'Dolly Operation', 'Crane Operation', 'Safety Compliance', 'Equipment Maintenance'],
  'Sound':            ['Boom Operation', 'Location Sound Recording', 'Sound Mixing', 'Noise Isolation', 'Wireless Mic Setup'],
  'Art':              ['Set Design', 'Art Direction', 'Illustration', 'Graphic Design', 'Scale Modelling', 'AutoCAD / SketchUp'],
  'Sets':             ['Set Dressing', 'Prop Placement', 'Set Construction Coordination', 'Inventory Management'],
  'Construction':     ['Carpentry', 'Welding', 'Prop Making', 'Set Building', 'Safety Compliance'],
  'Scenic':           ['Scenic Painting', 'Texture Creation', 'Plastering', 'Mural Art'],
  'Property':         ['Prop Sourcing', 'Prop Management', 'Weapons Handling', 'Set Safety'],
  'Costume':          ['Costume Design', 'Tailoring / Stitching', 'Period Styling', 'Wardrobe Management', 'Fabric Knowledge', 'Costume Breakdown'],
  'Hair & Make Up':   ['Bridal Make Up', 'SFX Make Up', 'Prosthetics', 'Hair Styling', 'Colour & Highlights', 'Period Styling', 'Make Up for Camera', 'Airbrush'],
  'Special Effects':  ['Pyrotechnics', 'Mechanical Effects', 'Atmospheric Effects', 'Safety Compliance', 'Rig Design'],
  'Stunt':            ['Martial Arts', 'Wire Work', 'Vehicle Stunts', 'High Falls', 'Fight Choreography', 'Stunt Safety', 'Gymnastics'],
  'Post Production':  ['Production Supervision', 'Deliverables Management', 'Vendor Coordination', 'Quality Control'],
  'Editorial':        ['Video Editing', 'Avid', 'Premiere Pro', 'DaVinci Resolve', 'Color Grading', 'Offline / Online Editing', 'Negative Cutting'],
  'Visual Effects':   ['Compositing', 'Rotoscoping', 'Motion Graphics', 'Matte Painting', 'CGI', 'Nuke', 'After Effects', 'Houdini'],
  'Sound & Music':    ['Music Composition', 'Orchestration', 'Sound Design', 'Foley', 'ADR / Dubbing', 'DAW (Pro Tools / Logic)', 'Re-Recording Mixing', 'Sound Editing'],
  'Animation':        ['2D Animation', '3D Animation', 'Character Rigging', 'Maya / Blender', 'Storyboarding'],
  'Electrical':       ['Electrical Rigging', 'Generator Operation', 'DIT / Digital Intermediate', 'Safety Compliance'],
  'Singing':          ['Classical Singing', 'Playback Singing', 'Western Vocals', 'Folk Singing', 'Harmonium', 'Tabla', 'Sight Reading', 'Recording Studio Experience'],
  'Dancing':          ['Bollywood', 'Classical (Bharatanatyam / Kathak)', 'Contemporary', 'Hip Hop', 'Ballet', 'Folk', 'Choreography', 'Stamina'],
  'Dubbing':          ['Voice Modulation', 'Lip Sync', 'Language Fluency', 'Accent Adaptation', 'Recording Studio Experience'],
  'Story':            ['Screenplay Writing', 'Dialogue Writing', 'Story Development', 'Character Building', 'Research'],
  'Television':       ['Anchoring', 'Teleprompter Reading', 'Live Broadcasting', 'Stage Presence', 'Public Speaking', 'Interview Skills'],
  'Modelling':        ['Ramp Walk', 'Portfolio Shoots', 'Brand Endorsement', 'Posing Techniques', 'Fitness', 'Commercial Modelling'],
  'Advertisement':    ['Commercial Acting', 'Brand Awareness', 'Product Demonstration', 'Modelling'],
  'Food':             ['Catering', 'Menu Planning', 'On-Set Food Safety', 'Large Volume Cooking'],
  'Transport':        ['Vehicle Driving (Light / Heavy)', 'Route Planning', 'Caravan Management', 'Logistics'],
  'Travels':          ['Travel Booking', 'Visa Processing', 'Hotel Coordination', 'Group Travel Management'],
  'Distributor':      ['Film Distribution', 'Territory Management', 'Theatre Booking', 'Revenue Tracking'],
};
const LANGUAGE_OPTIONS = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Punjabi', 'Other'];
const PROJECT_STATUS_OPTIONS = ['Pre-production', 'In Production', 'Post-production', 'Announced'];
const AUDITION_FORMATS = [
  { key: 'In-Person',   icon: UsersRound },
  { key: 'Self Tape',   icon: Video      },
  { key: 'Online Live', icon: Radio      },
  { key: 'Hybrid',      icon: Users      },
];
const COMPENSATION_TYPES = ['Paid', 'Unpaid', 'Reimbursement', 'Others'];
const COMPENSATION_DETAIL_OPTIONS = ['Fixed', 'Negotiable', 'Per Day Rate', 'Per Project Rate', 'Revenue Share'];

// Countries that use INR — all others default to USD
const INR_COUNTRIES = ['india', 'in']
const getCurrency = (location: string) =>
  INR_COUNTRIES.some(c => location.toLowerCase().includes(c)) ? 'INR' : location ? 'USD' : 'INR'
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', GBP: '£', AED: 'د.إ', AUD: 'A$', CAD: 'C$',
}
const CURRENCIES = ['INR', 'USD', 'GBP', 'AED', 'AUD', 'CAD']
// Departments that require auditions (on-screen talent)
const AUDITION_DEPARTMENTS = new Set([
  'Acting', 'Dancing', 'Singing', 'Modelling', 'Television',
  'Dubbing', 'Advertisement', 'Stunt',
]);

/* ─── Auth helper ────────────────────────────────────────────── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

const HOW_TO_APPLY_OPTIONS = [
  'Submit CV / Resume', 'Submit Portfolio Link', 'Submit Showreel / Demo Reel',
  'Submit Work Samples', 'LinkedIn Profile', 'Direct Interview',
  'Online Video Call', 'Email Application',
];

const DEPARTMENTS_AND_ROLES = [
  { department: 'Acting',           roles: ['Hero', 'Heroine', 'Villain', 'Comedian', 'Character Artist', 'Supporting Roles', 'Child Artist'] },
  { department: 'Direction',        roles: ['Director', 'Assistant Director'] },
  { department: 'Production Office',roles: ['Line Producer', 'Production Assistant', 'Production Manager', 'Asst. Production Manager', 'Unit Manager', 'Production Coordinator', 'First Assistant Director', 'Second Assistant Director'] },
  { department: 'Accounting',       roles: ['Production Accountant'] },
  { department: 'Locations',        roles: ['Location Manager', 'Asst. Location Manager', 'Location Scout', 'Location Assistant', 'Location Production Assistant'] },
  { department: 'Continuity',       roles: ['Script Supervisor'] },
  { department: 'Casting',          roles: ['Casting Director', 'Casting PA'] },
  { department: 'Camera & Lighting',roles: ['Director of Photography', 'Camera Operator', 'First Assistant Camera', 'Second Assistant Camera', 'Film Loader', 'Digital Imaging Technician', 'Motion Control Technician', 'Gaffer', 'Best Boy', 'Lighting Technician'] },
  { department: 'Grip',             roles: ['Key Grip', 'Best Boy', 'Dolly Grip', 'Grips', 'Sound Grip'] },
  { department: 'Sound',            roles: ['Production Sound Mixer', 'Boom Operator', 'Second Assistant Sound'] },
  { department: 'Art',              roles: ['Production Designer', 'Art Director', 'Standby Art Director', 'Assistant Art Director', 'Set Designer', 'Illustrator', 'Graphic Artist'] },
  { department: 'Sets',             roles: ['Set Decorator', 'Buyer', 'Leadman', 'Set Dresser', 'Greensman'] },
  { department: 'Construction',     roles: ['Construction Coordinator', 'Head Carpenter', 'Propmaker'] },
  { department: 'Scenic',           roles: ['Key Scenic', 'Head of Plaster'] },
  { department: 'Property',         roles: ['Propmaster', 'Weapons Master'] },
  { department: 'Costume',          roles: ['Costume Designer', 'Costume Supervisor', 'Key Costumer', 'Costume Standby', 'Breakdown Artist', 'Costume Buyer', 'Cutter'] },
  { department: 'Hair & Make Up',   roles: ['Key Make Up Artist', 'Special Make Up Effects', 'Make Up Supervisor', 'Make Up Artist', 'Key Hair', 'Hair Stylist'] },
  { department: 'Special Effects',  roles: ['Special Effects Supervisor', 'Special Effects Assistant'] },
  { department: 'Stunt',            roles: ['Stunt Master', 'Stunt Coordinator'] },
  { department: 'Post Production',  roles: ['Post Production Supervisor'] },
  { department: 'Editorial',        roles: ['Film Editor', 'Negative Cutter', 'Colorist', 'Telecine Colorist'] },
  { department: 'Visual Effects',   roles: ['Visual Effects Producer', 'VFX Creative Director', 'VFX Supervisor', 'VFX Editor', 'Composer', 'Rotoscope Artist', 'Paint Artist', 'Matte Painter'] },
  { department: 'Sound & Music',    roles: ['Sound Designer', 'Dialogue Editor', 'Sound Editor', 'Re-Recording Mixer', 'Music Supervisor', 'Music Composer / Director', 'Foley Artist', 'Conductor / Orchestrator', 'Sound Recorder / Mixer', 'Music Preparation', 'Music Editor'] },
  { department: 'Animation',        roles: ['Animation Artist'] },
  { department: 'Electrical',       roles: ['Electrician', 'Digital Intermediate Technician'] },
  { department: 'Singing',          roles: ['Singer'] },
  { department: 'Dancing',          roles: ['Dancer'] },
  { department: 'Dubbing',          roles: ['Dubbing Artist'] },
  { department: 'Story',            roles: ['Story Writer'] },
  { department: 'Television',       roles: ['Anchoring', 'Newsreader', 'Talk Show', 'Stage Show', 'Drama', 'Production Crew'] },
  { department: 'Modelling',        roles: ['Model', 'Advertisement'] },
  { department: 'Advertisement',    roles: ['Advertisement'] },
  { department: 'Food',             roles: ['Food Supplier / Caterer'] },
  { department: 'Transport',        roles: ['Cab Service Provider', 'Caravan Service Provider'] },
  { department: 'Travels',          roles: ['Ticketing Agents', 'Hotels'] },
  { department: 'Distributor',      roles: ['Distributors'] },
];
const ALL_DEPARTMENTS = DEPARTMENTS_AND_ROLES.map(d => d.department);
const getRoles = (dept: string) => DEPARTMENTS_AND_ROLES.find(d => d.department === dept)?.roles ?? [];

interface CastingDraft {
  // Step 1 — Basic & Role Info
  title: string;
  projectTitle: string;
  projectType: string;
  department: string;
  role: string;
  roleType: string;
  shortDescription: string;
  gender: string;
  ageFrom: string;
  ageTo: string;
  experience: string;
  roleDescription: string;
  skills: string[];
  // Step 2 — Project & Audition Info
  languages: string[];
  projectStatus: string;
  shootStart: string;
  shootEnd: string;
  deadline: string;
  shootLocation: string;
  hasSponsor: 'Yes' | 'No';
  auditionFormat: string;
  auditionTimeFrom: string;
  auditionTimeTo: string;
  auditionStart: string;
  auditionEnd: string;
  auditionLocationType: 'Single Location' | 'Multiple Locations';
  auditionAddress: string;
  auditionInstructions: string;
  contactName: string;
  contactEmail: string;
  contactMobile: string;
  howToApply: string[];
  // Step 3 — Compensation & Review
  compensationType: string;
  compensationDetail: string;
  amount: string;
  currency: string;
  paymentTerms: string;
  additionalRequirements: string;
}

const EMPTY_DRAFT: CastingDraft = {
  title: '', projectTitle: '', projectType: 'Film', department: '', role: '', roleType: '', shortDescription: '',
  gender: 'Male', ageFrom: '', ageTo: '', experience: '', roleDescription: '', skills: [],
  languages: [], projectStatus: '', shootStart: '', shootEnd: '', deadline: '', shootLocation: '', hasSponsor: 'No',
  auditionFormat: 'In-Person', auditionTimeFrom: '', auditionTimeTo: '', auditionStart: '', auditionEnd: '',
  auditionLocationType: 'Single Location', auditionAddress: '', auditionInstructions: '',
  contactName: '', contactEmail: '', contactMobile: '', howToApply: [],
  compensationType: 'Paid', compensationDetail: '', amount: '', currency: 'INR', paymentTerms: '', additionalRequirements: '',
};

/* ─── Shared field components ──────────────────────────────────── */
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 7 }}>
      {children}{required && <span style={{ color: RED }}> *</span>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 15, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const }}
    />
  );
}

function TextArea({ value, onChange, placeholder, maxLen, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder: string; maxLen?: number; rows?: number }) {
  return (
    <div style={{ position: 'relative' }}>
      <textarea
        value={value}
        onChange={e => onChange(maxLen ? e.target.value.slice(0, maxLen) : e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 15, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const, resize: 'vertical' as const }}
      />
      {maxLen && <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>{value.length} / {maxLen}</div>}
    </div>
  );
}

function SelectDropdown({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => setOpen(v => !v)} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 14px', color: value ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' as const }}>
        <span>{value || placeholder}</span>
        <ChevronDown size={15} color="rgba(255,255,255,0.4)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, maxHeight: 240, overflowY: 'auto' as const, boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}>
            <div onClick={() => { onChange(''); setOpen(false); }} style={{ padding: '10px 14px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: !value ? GOLD : 'rgba(255,255,255,0.4)', background: !value ? 'rgba(212,166,74,0.08)' : 'transparent', fontStyle: 'italic' }}
              onMouseEnter={e => { if (value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (value) e.currentTarget.style.background = 'transparent' }}
            >-- Select --</div>
            {options.map(opt => (
              <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{ padding: '10px 14px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: opt === value ? GOLD : '#fff', background: opt === value ? 'rgba(212,166,74,0.08)' : 'transparent' }}
                onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent' }}
              >{opt}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DateInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <CalendarIcon size={15} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 14px 11px 36px', color: value ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 15, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const, colorScheme: 'dark' as const }}
      />
    </div>
  );
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="time"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 14px', color: value ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 15, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const, colorScheme: 'dark' as const }}
    />
  );
}

function MultiTagSelect({ value, onChange, options, placeholder }: { value: string[]; onChange: (v: string[]) => void; options: string[]; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const toggle = (opt: string) => onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => setOpen(v => !v)} style={{ width: '100%', minHeight: 44, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 14px', display: 'flex', alignItems: 'center', flexWrap: 'wrap' as const, gap: 6, cursor: 'pointer', boxSizing: 'border-box' as const }}>
        {value.length === 0 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15, fontFamily: BARLOW, padding: '4px 0' }}>{placeholder}</span>}
        {value.map(v => (
          <span key={v} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(212,166,74,0.12)', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 6, padding: '4px 8px', fontSize: 14, fontFamily: BARLOW, color: GOLD }}>
            {v}
            <X size={12} style={{ cursor: 'pointer' }} onClick={e => { e.stopPropagation(); toggle(v); }} />
          </span>
        ))}
        <ChevronDown size={15} color="rgba(255,255,255,0.4)" style={{ marginLeft: 'auto', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 100, maxHeight: 220, overflowY: 'auto' as const, boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}>
            {options.map(opt => {
              const selected = value.includes(opt);
              return (
                <div key={opt} onClick={() => toggle(opt)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', color: selected ? GOLD : '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >{opt}{selected && <Check size={14} color={GOLD} />}</div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function CheckboxRow({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <div onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: 9, background: checked ? 'rgba(200,32,42,0.1)' : BG3, border: `1px solid ${checked ? RED : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', transition: 'all 0.15s' }}>
      <div style={{ width: 17, height: 17, borderRadius: 4, background: checked ? RED : 'transparent', border: `1.5px solid ${checked ? RED : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {checked && <Check size={11} color="#fff" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: 15, fontFamily: BARLOW, color: '#fff' }}>{label}</span>
    </div>
  );
}

function RadioPill({ selected, onClick, label }: { selected: boolean; onClick: () => void; label: string }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${selected ? RED : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {selected && <div style={{ width: 9, height: 9, borderRadius: '50%', background: RED }} />}
      </div>
      <span style={{ fontSize: 15, fontFamily: BARLOW, color: '#fff' }}>{label}</span>
    </div>
  );
}

function SectionHeader({ num, icon: Icon, title }: { num?: number; icon?: React.ElementType; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(200,32,42,0.15)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {Icon ? <Icon size={15} color={RED} /> : <span style={{ fontSize: 14, fontWeight: 700, color: RED, fontFamily: BARLOW }}>{num}</span>}
      </div>
      <span style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{title}</span>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */
function CreateCastingCallInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [step,               setStep]               = useState(1);
  const [draft,              setDraft]              = useState<CastingDraft>(EMPTY_DRAFT);
  const [hydrated,           setHydrated]           = useState(false);
  const [savedJustNow,       setSavedJustNow]       = useState(false);
  const [profileOpen,        setProfileOpen]        = useState(false);
  const [editFromReview,     setEditFromReview]     = useState(false);
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const [editNotFound,       setEditNotFound]       = useState(false);
  const [publishing,         setPublishing]         = useState(false);
  const [publishError,       setPublishError]       = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ── Agency identity ── */
  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('AGE·········');
  const [agencyType,     setAgencyType]     = useState('Production House');
  const [msgCount,       setMsgCount]       = useState(0);
  const [notifCount,     setNotifCount]     = useState(0);

  const activeDraftKey = editId ? `${DRAFT_KEY}_edit_${editId}` : DRAFT_KEY;

  /* ── Load agency identity from ss_user instantly ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) {
        setAgencyName(u.name);
        setAgencyInitials(u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
      }
      if (u.profileNumber) setAgencyId(u.profileNumber);
    } catch {}
  }, []);

  /* ── Fetch live badge counts ── */
  useEffect(() => {
    const h = getAuthHeaders();
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.notifications ?? data;
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length);
      }).catch(() => {});
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.conversations ?? data;
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
      }).catch(() => {});
  }, []);

  /* ── Load draft / existing casting call on mount ── */
  useEffect(() => {
    if (editId) {
      // Edit mode — check localStorage draft first
      try {
        const raw = localStorage.getItem(activeDraftKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          setDraft(prev => ({ ...prev, ...parsed.draft }));
          if (parsed.step) setStep(parsed.step);
          setHydrated(true);
          return;
        }
      } catch {}

      // Fetch from API
      const h = getAuthHeaders();
      fetch(`/api/casting-calls/${editId}`, { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) { setEditNotFound(true); return; }
          const c = data.data?.casting_call ?? data.castingCall ?? data.data ?? data;
          // Map API fields → CastingDraft fields
          const modeReverseMap: Record<string, string> = {
            'offline': 'In-Person', 'online': 'Virtual', 'both': 'Self-Tape',
          };
          setDraft(prev => ({
            ...prev,
            title:              c.title              ?? '',
            projectTitle:       c.title              ?? '',
            projectType:        c.project_type       ?? 'Film',
            department:         c.category           ?? '',
            role:               c.role_name          ?? '',
            roleType:           c.roleType           ?? '',
            shortDescription:   c.eligibility_criteria ?? '',
            gender:             c.gender_preference  ?? 'Male',
            ageFrom:            c.age_min != null ? String(c.age_min) : '',
            ageTo:              c.age_max != null ? String(c.age_max) : '',
            experience:         c.experience_level   ?? '',
            roleDescription:    c.role_description   ?? '',
            skills:             Array.isArray(c.skills_required) ? c.skills_required : [],
            languages:          Array.isArray(c.languages_required) ? c.languages_required : [],
            projectStatus:      c.project_status     ?? '',
            shootStart:         c.shoot_start ? new Date(c.shoot_start).toISOString().split('T')[0] : '',
            shootEnd:           c.shoot_end   ? new Date(c.shoot_end).toISOString().split('T')[0]   : '',
            shootLocation:      c.location           ?? '',
            hasSponsor:         c.has_sponsor        ?? 'No',
            auditionFormat:     modeReverseMap[c.audition_mode] ?? 'In-Person',
            auditionTimeFrom:   c.audition_time_from ?? '',
            auditionTimeTo:     c.audition_time_to   ?? '',
            auditionStart:      c.audition_start ? new Date(c.audition_start).toISOString().split('T')[0] : '',
            auditionEnd:        c.audition_end   ? new Date(c.audition_end).toISOString().split('T')[0]   : '',
            auditionLocationType: c.audition_location_type ?? 'Single Location',
            auditionAddress:    c.audition_details   ?? '',
            auditionInstructions: c.auditionInstructions ?? '',
            contactName:        c.contact_name       ?? '',
            contactEmail:       c.contact_email      ?? '',
            contactMobile:      c.contact_mobile     ?? '',
            howToApply:         Array.isArray(c.how_to_apply) ? c.how_to_apply : [],
            compensationType:   c.compensationType   ?? 'Paid',
            compensationDetail: c.compensation_details ?? '',
            amount:             c.budget_min != null ? String(c.budget_min) : '',
            currency:           c.currency           ?? 'INR',
            paymentTerms:       c.payment_terms      ?? '',
            additionalRequirements: c.additionalRequirements ?? '',
          }));
        })
        .catch(() => setEditNotFound(true))
        .finally(() => setHydrated(true));
      return;
    }
    // Fresh create — always start clean
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setHydrated(true);
  }, [editId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist draft on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(activeDraftKey, JSON.stringify({ draft, step }));
    } catch {}
  }, [draft, step, hydrated, activeDraftKey]);

  const update = <K extends keyof CastingDraft>(key: K, value: CastingDraft[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill: string) => {
    setDraft(prev => ({ ...prev, skills: prev.skills.includes(skill) ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill] }));
  };

  const saveDraftManually = async () => {
    // Save to localStorage immediately for instant feedback
    try {
      localStorage.setItem(activeDraftKey, JSON.stringify({ draft, step }));
      setSavedJustNow(true);
      setTimeout(() => setSavedJustNow(false), 2000);
    } catch {}

    // Also persist to API as Draft status
    try {
      const h = getAuthHeaders();
      const payload = {
  ...draft,
  status:                'Draft',
  project_type:          draft.projectType,
  role_name:             draft.role,
  role_description:      draft.roleDescription,
  last_application_date: draft.deadline || draft.auditionEnd,
  skills_required:       draft.skills,
  languages_required:    draft.languages,
  gender_preference:     draft.gender,
  experience_level:      draft.experience,
  audition_mode:         draft.auditionFormat,
  audition_details:      draft.auditionAddress,
  compensation_details:  draft.compensationDetail,
  budget_min:            draft.amount ? Number(draft.amount) : null,
  budget_max:            draft.amount ? Number(draft.amount) : null,
  project_status:        draft.projectStatus,
  shoot_start:           draft.shootStart || null,
  shoot_end:             draft.shootEnd || null,
  location:              draft.shootLocation,
  has_sponsor:           draft.hasSponsor,
  age_min:               draft.ageFrom ? Number(draft.ageFrom) : null,
  age_max:               draft.ageTo   ? Number(draft.ageTo)   : null,
  audition_time_from:    draft.auditionTimeFrom || null,
  audition_time_to:      draft.auditionTimeTo || null,
  audition_start:        draft.auditionStart || null,
  audition_end:          draft.auditionEnd || null,
  audition_location_type: draft.auditionLocationType || null,
  contact_name:          draft.contactName || null,
  contact_email:         draft.contactEmail || null,
  contact_mobile:        draft.contactMobile || null,
  how_to_apply:          draft.howToApply,
  payment_terms:         draft.paymentTerms || null,
};
      if (editId) {
        await fetch(`/api/casting-calls/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...h },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/casting-calls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...h },
          body: JSON.stringify(payload),
        });
      }
    } catch {} // silent — localStorage already saved
  };

  const scrollToTop = () => { scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }) }
  // Auto-switch currency based on shoot location
  useEffect(() => {
    if (draft.shootLocation) {
      const detected = getCurrency(draft.shootLocation)
      if (detected !== draft.currency) update('currency', detected)
    }
  }, [draft.shootLocation])

  const goToStep = (n: number) => { setStep(n); setEditFromReview(false); scrollToTop(); };

  const requestPublish = () => { setPublishError(''); setConfirmPublishOpen(true); };

  const confirmPublish = async () => {
    setPublishing(true);
    setPublishError('');
    const h = getAuthHeaders();
    const payload = {
  ...draft,
  status:               'Open',
  project_type:         draft.projectType,
  role_name:            draft.role,
  role_description:     draft.roleDescription,
  last_application_date: draft.deadline || draft.auditionEnd,
  skills_required:      draft.skills,
  languages_required:   draft.languages,
  gender_preference:    draft.gender,
  experience_level:     draft.experience,
  audition_mode:        draft.auditionFormat,
  audition_details:     draft.auditionAddress,
  compensation_details: draft.compensationDetail,
  budget_min:           draft.amount ? Number(draft.amount) : null,
  budget_max:           draft.amount ? Number(draft.amount) : null,
  project_status:        draft.projectStatus,
  shoot_start:           draft.shootStart || null,
  shoot_end:             draft.shootEnd || null,
  location:              draft.shootLocation,
  has_sponsor:           draft.hasSponsor,
  age_min:               draft.ageFrom ? Number(draft.ageFrom) : null,
  age_max:               draft.ageTo   ? Number(draft.ageTo)   : null,
  audition_time_from:    draft.auditionTimeFrom || null,
  audition_time_to:      draft.auditionTimeTo || null,
  audition_start:        draft.auditionStart || null,
  audition_end:          draft.auditionEnd || null,
  audition_location_type: draft.auditionLocationType || null,
  contact_name:          draft.contactName || null,
  contact_email:         draft.contactEmail || null,
  contact_mobile:        draft.contactMobile || null,
  how_to_apply:          draft.howToApply,
  payment_terms:         draft.paymentTerms || null,
};

    try {
      let res: Response;
      if (editId) {
        res = await fetch(`/api/casting-calls/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...h },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/casting-calls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...h },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.error ?? data.message ?? 'Failed to publish. Please try again.');
        setPublishing(false);
        return;
      }

      // Clean up localStorage draft
      try { localStorage.removeItem(activeDraftKey); } catch {}
      setConfirmPublishOpen(false);

      const newId = data.castingCall?.id ?? data.id ?? editId;
      router.push(editId
        ? `/agency/casting-calls/${editId}?updated=1`
        : `/agency/casting-calls?published=1`
      );

    } catch {
      setPublishError('Network error. Please check your connection and try again.');
      setPublishing(false);
    }
  };

  const STEPS = [
    { n: 1, title: 'Basic & Role Info',       desc: 'Basic details and role requirements' },
    { n: 2, title: 'Project & Application',   desc: AUDITION_DEPARTMENTS.has(draft.department) ? 'Project details and audition info' : 'Project details and how to apply' },
    { n: 3, title: 'Compensation & Review',   desc: 'Compensation details and publish' },
  ];

  if (editNotFound) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, fontFamily: BARLOW, color: '#F5F5F5', gap: 16 }}>
        <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Casting call not found</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', textAlign: 'center' as const, maxWidth: 380 }}>
          This casting call may have been removed, or the link you followed points to a demo entry that doesn't exist in your local data yet.
        </div>
        <button onClick={() => router.push('/agency/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: RED, border: 'none', borderRadius: 8, padding: '11px 22px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
          <ChevronLeft size={16} /> Back to Casting Calls
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ── PUBLISH CONFIRMATION MODAL ── */}
      {confirmPublishOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 16, padding: '32px', maxWidth: 480, width: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, borderRadius: '16px 16px 0 0' }} />

            <div style={{ textAlign: 'center' as const, marginBottom: 20 }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(212,166,74,0.1)', border: '1px solid rgba(212,166,74,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Eye size={24} color={GOLD} />
              </div>
              <div style={{ fontFamily: BEBAS, fontSize: 23, letterSpacing: 1.5, color: '#fff', marginBottom: 8 }}>{editId ? 'Save these changes?' : 'Publish this casting call?'}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.6 }}>
                {editId ? 'Your changes will be saved and reflected immediately on the casting call.' : 'Once published, it will be visible to relevant talent on SilverScreens. You can edit or close it anytime from your Casting Calls list.'}
              </div>
            </div>

            <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px', marginBottom: 22 }}>
              <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{draft.title || 'Untitled Casting Call'}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.6 }}>
                {draft.projectType} • {draft.department ? `${draft.department} → ${draft.role || 'Role not set'}` : draft.roleType || 'Role type not set'}{draft.shootLocation ? ` • ${draft.shootLocation}` : ''}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setConfirmPublishOpen(false)} disabled={publishing} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: publishing ? 'not-allowed' : 'pointer', opacity: publishing ? 0.5 : 1 }}>Go Back & Review</button>
              <button onClick={confirmPublish} disabled={publishing} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: publishing ? 'rgba(200,32,42,0.5)' : RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: publishing ? 'not-allowed' : 'pointer' }}>
                <Clapperboard size={15} /> {publishing ? 'Publishing…' : editId ? 'Yes, Save Changes' : 'Yes, Publish'}
              </button>
            </div>
            {publishError && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 8, fontSize: 14, fontFamily: BARLOW, color: '#fca5a5', textAlign: 'center' as const }}>
                {publishError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TOPNAV ── */}
      <header style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/agency/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '0 16px', height: 36, fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
          ← Back to Casting Calls
        </button>
        <div onClick={() => router.push('/agency/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{msgCount > 0 ? msgCount : null}</div>
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{notifCount > 0 ? notifCount : null}</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: '2px solid rgba(212,166,74,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{agencyType}</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 220, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Agency ID</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{agencyId}</span>
                </div>
                {[
                  { label: 'Reports & Analytics',    href: '/agency/reports' },
                  { label: 'Subscription & Billing', href: '/agency/subscription' },
                  { label: 'Company Profile',         href: '/agency-profile' },
                  { label: 'Documents',               href: '/agency/documents' },
                  { label: 'Calendar',                href: '/agency/calendar' },
                  { label: 'Settings',                href: '/agency/settings' },
                  { label: 'Support',                 href: '/agency/support' },
                  { label: 'Logout',                  href: '/login' },
                ].map(({ label, href }) => (
                  <div key={label} onClick={() => { if (label === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); } else { router.push(href); setProfileOpen(false); } }}
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

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR: Steps ── */}
        <aside style={{ width: 270, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', padding: '24px 20px', overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const }}>
          <div onClick={() => router.push('/agency/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer', marginBottom: 28 }}>
            <ChevronLeft size={17} /> Back to Casting Calls
          </div>

          {STEPS.map((s, i) => (
            <div key={s.n} onClick={() => s.n < step && goToStep(s.n)} style={{ display: 'flex', gap: 14, cursor: s.n < step ? 'pointer' : 'default', position: 'relative', paddingBottom: i < STEPS.length - 1 ? 28 : 0 }}>
              {i < STEPS.length - 1 && (
                <div style={{ position: 'absolute', left: 14, top: 30, width: 1.5, height: 'calc(100% - 14px)', background: s.n < step ? RED : 'rgba(255,255,255,0.12)' }} />
              )}
              <div style={{
                width: 29, height: 29, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: s.n < step ? RED : s.n === step ? RED : 'transparent',
                border: s.n === step ? `2px solid ${RED}` : s.n < step ? 'none' : '2px solid rgba(255,255,255,0.2)',
                fontSize: 14, fontWeight: 700, fontFamily: BARLOW, color: s.n <= step ? '#fff' : 'rgba(255,255,255,0.4)',
              }}>
                {s.n < step ? <Check size={15} strokeWidth={3} /> : s.n}
              </div>
              <div>
                <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: s.n === step ? '#fff' : s.n < step ? '#fff' : 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: 28 }}>
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px', textAlign: 'center' as const }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <HelpCircle size={18} color={RED} />
              </div>
              <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Need Help?</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.5, marginBottom: 14 }}>Read our guidelines for creating a casting call that reaches the right talent.</div>
              <button onClick={() => router.push('/faq')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, padding: '9px 0', color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>
                View Guidelines <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto' as const, padding: '24px 32px' }}>

            <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1.5, color: '#fff', margin: '0 0 6px' }}>{editId ? 'Edit Casting Call' : 'Create Casting Call'}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: RED }}>Step {step} of 3</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>{STEPS[step - 1].title}</span>
            </div>

            {/* ══════════════ STEP 1: BASIC & ROLE INFO ══════════════ */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>

                {/* Basic Information */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                  <SectionHeader num={1} title="Basic Information" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                    <div>
                      <Label required>Casting Call Title</Label>
                      <TextInput value={draft.title} onChange={v => update('title', v)} placeholder="Enter casting call title..." />
                    </div>
                    <div>
                      <Label>Project / Production Title (Optional)</Label>
                      <TextInput value={draft.projectTitle} onChange={v => update('projectTitle', v)} placeholder="Enter project or production title..." />
                    </div>
                  </div>

                  <Label required>Project Type</Label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10, marginBottom: 18 }}>
                    {PROJECT_TYPES.map(({ key, icon: Icon }) => {
                      const selected = draft.projectType === key;
                      return (
                        <div key={key} onClick={() => update('projectType', key)} style={{
                          display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 8,
                          padding: '16px 8px', borderRadius: 10, cursor: 'pointer', textAlign: 'center' as const,
                          background: selected ? 'rgba(200,32,42,0.1)' : BG3,
                          border: `1.5px solid ${selected ? RED : 'rgba(255,255,255,0.08)'}`,
                          transition: 'all 0.15s',
                        }}>
                          <Icon size={22} color={selected ? RED : 'rgba(255,255,255,0.5)'} />
                          <span style={{ fontSize: 14, fontFamily: BARLOW, color: selected ? '#fff' : 'rgba(255,255,255,0.55)', fontWeight: selected ? 700 : 400 }}>{key}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                    <div>
                      <Label required>Role Type</Label>
                      <SelectDropdown value={draft.roleType} onChange={v => update('roleType', v)} options={ROLE_TYPES} placeholder="Select role type" />
                    </div>
                    <div>
                      <Label>Short Role Description (Optional)</Label>
                      <TextArea value={draft.shortDescription} onChange={v => update('shortDescription', v)} placeholder="Briefly describe the role and character..." maxLen={300} rows={2} />
                    </div>
                  </div>
                </div>

                {/* Department & Role */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                  <SectionHeader num={2} title="Department & Role" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                    <div>
                      <Label required>Department</Label>
                      <SelectDropdown
                        value={draft.department}
                        onChange={v => setDraft(prev => ({ ...prev, department: v, role: '', skills: [] }))}
                        options={ALL_DEPARTMENTS}
                        placeholder="Select department"
                      />
                      {draft.department && (
                        <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.3)', marginTop: 5 }}>
                          {getRoles(draft.department).length} roles available in this department
                        </div>
                      )}
                    </div>
                    <div>
                      <Label required>Role</Label>
                      <SelectDropdown
                        value={draft.role}
                        onChange={v => update('role', v)}
                        options={draft.department ? getRoles(draft.department) : []}
                        placeholder={draft.department ? 'Select role' : 'Select a department first'}
                      />
                    </div>
                  </div>
                </div>

                {/* Role Requirements */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                  <SectionHeader num={2} title="Role Requirements" />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 18, marginBottom: 18 }}>
                    <div>
                      <Label required>Gender</Label>
                      <div style={{ display: 'flex', gap: 18, paddingTop: 8 }}>
                        {['Male', 'Female', 'Other'].map(g => (
                          <RadioPill key={g} selected={draft.gender === g} onClick={() => update('gender', g)} label={g} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Age Range (Optional)</Label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <SelectDropdown value={draft.ageFrom} onChange={v => update('ageFrom', v)} options={Array.from({length: 73}, (_, i) => String(i + 3))} placeholder="From" />
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>–</span>
                        <SelectDropdown value={draft.ageTo} onChange={v => update('ageTo', v)} options={Array.from({length: 73}, (_, i) => String(i + 3))} placeholder="To" />
                      </div>
                    </div>
                    <div>
                      <Label>Years of Experience (Optional)</Label>
                      <SelectDropdown value={draft.experience} onChange={v => update('experience', v)} options={EXPERIENCE_OPTIONS} placeholder="Select experience" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                    <div>
                      <Label>Role Description (Optional)</Label>
                      <TextArea value={draft.roleDescription} onChange={v => update('roleDescription', v)} placeholder="Provide detailed role description..." maxLen={500} rows={5} />
                    </div>
                    <div>
                      <Label required>Must Have Skills (Select all that apply)</Label>
                      {!draft.department ? (
                        <div style={{ padding: '14px', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)', textAlign: 'center' as const }}>
                          Select a department above to see relevant skills
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                          {(DEPT_SKILLS[draft.department] || SKILLS).map(skill => (
                            <CheckboxRow key={skill} checked={draft.skills.includes(skill)} onChange={() => toggleSkill(skill)} label={skill} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ══════════════ STEP 2: PROJECT & AUDITION INFO ══════════════ */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>

                {/* Project Details */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                  <SectionHeader icon={CalendarIcon} title="Project Details" />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 18 }}>
                    <div>
                      <Label>Project Languages (Optional)</Label>
                      <MultiTagSelect value={draft.languages} onChange={v => update('languages', v)} options={LANGUAGE_OPTIONS} placeholder="Select languages" />
                    </div>
                    <div>
                      <Label>Project Status (Optional)</Label>
                      <SelectDropdown value={draft.projectStatus} onChange={v => update('projectStatus', v)} options={PROJECT_STATUS_OPTIONS} placeholder="Select status" />
                    </div>
                    <div>
                      <Label>Shooting Start Date (Optional)</Label>
                      <DateInput value={draft.shootStart} onChange={v => update('shootStart', v)} placeholder="Select start date" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                    <div>
                      <Label>Shooting End Date (Optional)</Label>
                      <DateInput value={draft.shootEnd} onChange={v => update('shootEnd', v)} placeholder="Select end date" />
                    </div>
                    <div>
                      <Label>Shooting Locations (Optional)</Label>
                      <TextInput value={draft.shootLocation} onChange={v => update('shootLocation', v)} placeholder="Enter city, state or country" />
                    </div>
                  </div>

                  <Label>Is the project associated with any brand / sponsor?</Label>
                  <div style={{ display: 'flex', gap: 24, paddingTop: 4 }}>
                    <RadioPill selected={draft.hasSponsor === 'Yes'} onClick={() => update('hasSponsor', 'Yes')} label="Yes" />
                    <RadioPill selected={draft.hasSponsor === 'No'} onClick={() => update('hasSponsor', 'No')} label="No" />
                  </div>
                </div>

                {/* Audition Details OR How to Apply — based on department */}
                {AUDITION_DEPARTMENTS.has(draft.department) || !draft.department ? (
                  /* ── AUDITION DETAILS — for on-screen talent ── */
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                    <SectionHeader icon={Edit2} title="Audition Details" />
                    {!draft.department && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 8, marginBottom: 18 }}>
                        <span style={{ fontSize: 16 }}>ℹ️</span>
                        <span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>Select a department in Step 1 — this section will update based on the type of talent required.</span>
                      </div>
                    )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 18 }}>
                    <div>
                      <Label required>Audition Format</Label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                        {AUDITION_FORMATS.map(({ key, icon: Icon }) => {
                          const selected = draft.auditionFormat === key;
                          return (
                            <div key={key} onClick={() => update('auditionFormat', key)} style={{
                              display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 8,
                              padding: '14px 6px', borderRadius: 10, cursor: 'pointer', textAlign: 'center' as const,
                              background: selected ? 'rgba(200,32,42,0.1)' : BG3,
                              border: `1.5px solid ${selected ? RED : 'rgba(255,255,255,0.08)'}`,
                            }}>
                              <Icon size={19} color={selected ? RED : 'rgba(255,255,255,0.5)'} />
                              <span style={{ fontSize: 14, fontFamily: BARLOW, color: selected ? '#fff' : 'rgba(255,255,255,0.55)', fontWeight: selected ? 700 : 400 }}>{key}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <Label required>Audition Time</Label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <TimeInput value={draft.auditionTimeFrom} onChange={v => update('auditionTimeFrom', v)} />
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>–</span>
                        <TimeInput value={draft.auditionTimeTo} onChange={v => update('auditionTimeTo', v)} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: 18, marginBottom: 18 }}>
                    <div>
                      <Label required>Audition Start Date</Label>
                      <DateInput value={draft.auditionStart} onChange={v => update('auditionStart', v)} placeholder="Select start date" />
                    </div>
                    <div>
                      <Label required>Audition End Date</Label>
                      <DateInput value={draft.auditionEnd} onChange={v => update('auditionEnd', v)} placeholder="Select end date" />
                    </div>
                    <div>
                      <Label>Audition Location Type</Label>
                      <div style={{ display: 'flex', gap: 20, paddingTop: 8 }}>
                        <RadioPill selected={draft.auditionLocationType === 'Single Location'} onClick={() => update('auditionLocationType', 'Single Location')} label="Single Location" />
                        <RadioPill selected={draft.auditionLocationType === 'Multiple Locations'} onClick={() => update('auditionLocationType', 'Multiple Locations')} label="Multiple Locations" />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                    <div>
                      <Label>Address of Audition Location (Optional)</Label>
                      <TextArea value={draft.auditionAddress} onChange={v => update('auditionAddress', v)} placeholder="Enter complete address" rows={2} />
                    </div>
                    <div>
                      <Label>Additional Instructions for Audition (Optional)</Label>
                      <TextArea value={draft.auditionInstructions} onChange={v => update('auditionInstructions', v)} placeholder="Provide any specific instructions for candidates" maxLen={500} rows={2} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 18, padding: '16px', background: 'rgba(200,32,42,0.06)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                      <div>
                        <Label required>Application Deadline</Label>
                        <DateInput value={draft.deadline} onChange={v => update('deadline', v)} placeholder="Select last date to apply" />
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginTop: 4 }}>Last date for talents to apply</div>
                      </div>
                    </div>
                  </div>

                  <Label required>Contact for Audition</Label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6 }}>Name</div>
                      <TextInput value={draft.contactName} onChange={v => update('contactName', v)} placeholder="Enter full name" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6 }}>Email</div>
                      <TextInput value={draft.contactEmail} onChange={v => update('contactEmail', v)} placeholder="Enter email address" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6 }}>Mobile Number</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 12px', fontSize: 15, fontFamily: BARLOW, color: '#fff', flexShrink: 0 }}>🇮🇳 +91</div>
                        <TextInput value={draft.contactMobile} onChange={v => update('contactMobile', v)} placeholder="Enter mobile number" />
                      </div>
                    </div>
                  </div>
                </div>
                ) : (
                  /* ── HOW TO APPLY — for crew / technical departments ── */
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                    <SectionHeader icon={Edit2} title="How to Apply" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, marginBottom: 20 }}>
                      <span style={{ fontSize: 16 }}>💼</span>
                      <span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.6)' }}>
                        Since you're hiring for <strong style={{ color: '#fff' }}>{draft.department}</strong>, candidates typically apply by submitting their work — not through a traditional audition.
                      </span>
                    </div>

                    <Label required>Application Method (Select all that apply)</Label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
                      {HOW_TO_APPLY_OPTIONS.map(opt => {
                        const selected = (draft.howToApply || []).includes(opt)
                        return (
                          <div key={opt} onClick={() => {
                            const current = draft.howToApply || []
                            update('howToApply', selected ? current.filter(x => x !== opt) : [...current, opt])
                          }} style={{
                            padding: '12px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'center' as const,
                            background: selected ? 'rgba(200,32,42,0.1)' : BG3,
                            border: `1.5px solid ${selected ? RED : 'rgba(255,255,255,0.08)'}`,
                            fontSize: 14, fontFamily: BARLOW, color: selected ? '#fff' : 'rgba(255,255,255,0.55)', fontWeight: selected ? 700 : 400,
                          }}>{opt}</div>
                        )
                      })}
                    </div>

                    <div style={{ marginBottom: 18, padding: '16px', background: 'rgba(200,32,42,0.06)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 10 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div>
                          <Label required>Application Deadline</Label>
                          <DateInput value={draft.deadline} onChange={v => update('deadline', v)} placeholder="Select last date to apply" />
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginTop: 4 }}>Last date for talents to apply</div>
                        </div>
                        <div>
                          <Label>Additional Instructions (Optional)</Label>
                          <TextArea value={draft.auditionInstructions} onChange={v => update('auditionInstructions', v)} placeholder="Any specific requirements for the application..." maxLen={500} rows={2} />
                        </div>
                      </div>
                    </div>

                    <Label required>Contact Person</Label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
                      <div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6 }}>Name</div>
                        <TextInput value={draft.contactName} onChange={v => update('contactName', v)} placeholder="Enter full name" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6 }}>Email</div>
                        <TextInput value={draft.contactEmail} onChange={v => update('contactEmail', v)} placeholder="Enter email address" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 6 }}>Mobile Number</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 12px', fontSize: 15, fontFamily: BARLOW, color: '#fff', flexShrink: 0 }}>🇮🇳 +91</div>
                          <TextInput value={draft.contactMobile} onChange={v => update('contactMobile', v)} placeholder="Enter mobile number" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ══════════════ STEP 3: COMPENSATION & REVIEW ══════════════ */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 24 }}>

                {/* Compensation form */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                  <SectionHeader icon={ExternalLink} title="Compensation Details" />

                  <Label>Compensation Type</Label>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 18, paddingTop: 4 }}>
                    {COMPENSATION_TYPES.map(t => (
                      <RadioPill key={t} selected={draft.compensationType === t} onClick={() => update('compensationType', t)} label={t} />
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                    <div>
                      <Label>Compensation Details (Optional)</Label>
                      <SelectDropdown value={draft.compensationDetail} onChange={v => update('compensationDetail', v)} options={COMPENSATION_DETAIL_OPTIONS} placeholder="Select compensation details" />
                    </div>
                    <div>
                      <Label>Amount (Optional)</Label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <select value={draft.currency} onChange={e => update('currency', e.target.value)}
                            style={{ appearance: 'none' as const, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 32px 11px 12px', color: GOLD, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', outline: 'none', minWidth: 80 }}>
                            {CURRENCIES.map(c => <option key={c} value={c} style={{ background: BG2 }}>{c}</option>)}
                          </select>
                          <ChevronDown size={13} color={GOLD} style={{ position: 'absolute' as const, right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' as const }}>
                          <span style={{ position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
                            {CURRENCY_SYMBOLS[draft.currency] || draft.currency}
                          </span>
                          <input value={draft.amount} onChange={e => update('amount', e.target.value)} placeholder="Enter amount"
                            style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px 14px 11px 30px', color: '#fff', fontSize: 15, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const }} />
                        </div>
                      </div>
                      {draft.shootLocation && draft.currency !== 'INR' && (
                        <div style={{ fontSize: 13, fontFamily: BARLOW, color: GOLD, marginTop: 4 }}>
                          💱 Currency auto-set to {draft.currency} based on shoot location. Change above if needed.
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                    <div>
                      <Label>Payment Terms (Optional)</Label>
                      <TextArea value={draft.paymentTerms} onChange={v => update('paymentTerms', v)} placeholder="Example: 50% advance, balance after shoot completion..." maxLen={500} rows={4} />
                    </div>
                    <div>
                      <Label>Additional Requirements (Optional)</Label>
                      <TextArea value={draft.additionalRequirements} onChange={v => update('additionalRequirements', v)} placeholder="Example: Valid ID proof, portfolio, specific look requirements..." maxLen={500} rows={4} />
                    </div>
                  </div>
                </div>

                {/* ══ REVIEW & SUBMIT — matches aspirant create-profile pattern ══ */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={17} color="#000" strokeWidth={3} />
                    </div>
                    <div>
                      <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>REVIEW & SUBMIT</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Review your casting call before publishing</div>
                    </div>
                  </div>

                  {/* BASIC INFORMATION */}
                  <ReviewSectionLabel>Basic Information</ReviewSectionLabel>
                  <ReviewGrid>
                    <ReviewField label="Casting Call Title" value={draft.title} required />
                    <ReviewField label="Project / Production Title" value={draft.projectTitle} optional />
                    <ReviewField label="Project Type" value={draft.projectType} />
                    <ReviewField label="Department" value={draft.department} required />
                    <ReviewField label="Role" value={draft.role} required />
                    <ReviewField label="Role Type" value={draft.roleType} required />
                  </ReviewGrid>

                  {/* ROLE REQUIREMENTS */}
                  <ReviewSectionLabel>Role Requirements</ReviewSectionLabel>
                  <ReviewGrid>
                    <ReviewField label="Gender" value={draft.gender} required />
                    <ReviewField label="Age Range" value={draft.ageFrom && draft.ageTo ? `${draft.ageFrom} - ${draft.ageTo}` : ''} optional />
                    <ReviewField label="Years of Experience" value={draft.experience} optional />
                    <ReviewField label="Must Have Skills" value={draft.skills.join(', ')} required tags={draft.skills} />
                  </ReviewGrid>

                  {/* PROJECT DETAILS */}
                  <ReviewSectionLabel>Project Details</ReviewSectionLabel>
                  <ReviewGrid cols={3}>
                    <ReviewField label="Languages" value={draft.languages.join(', ')} optional tags={draft.languages} />
                    <ReviewField label="Project Status" value={draft.projectStatus} optional />
                    <ReviewField label="Shooting Dates" value={draft.shootStart && draft.shootEnd ? `${draft.shootStart} to ${draft.shootEnd}` : ''} optional />
                    <ReviewField label="Shooting Location" value={draft.shootLocation} optional />
                    <ReviewField label="Brand / Sponsor" value={draft.hasSponsor} />
                  </ReviewGrid>

                  {/* AUDITION DETAILS */}
                  <ReviewSectionLabel>Audition Details</ReviewSectionLabel>
                  <ReviewGrid cols={3}>
                    <ReviewField label="Audition Format" value={draft.auditionFormat} required />
                    <ReviewField label="Audition Dates" value={draft.auditionStart && draft.auditionEnd ? `${draft.auditionStart} to ${draft.auditionEnd}` : ''} required />
                    <ReviewField label="Application Deadline" value={draft.deadline} required />
                    <ReviewField label="Audition Time" value={draft.auditionTimeFrom && draft.auditionTimeTo ? `${draft.auditionTimeFrom} - ${draft.auditionTimeTo}` : ''} required />
                    <ReviewField label="Location Type" value={draft.auditionLocationType} />
                    <ReviewField label="Contact Name" value={draft.contactName} required />
                    <ReviewField label="Contact Mobile" value={draft.contactMobile ? `+91 ${draft.contactMobile}` : ''} required />
                  </ReviewGrid>

                  {/* COMPENSATION DETAILS */}
                  <ReviewSectionLabel>Compensation Details</ReviewSectionLabel>
                  <ReviewGrid cols={3}>
                    <ReviewField label="Compensation Type" value={draft.compensationType} />
                    <ReviewField label="Compensation Details" value={draft.compensationDetail} optional />
                    <ReviewField label="Amount" value={draft.amount ? `${CURRENCY_SYMBOLS[draft.currency] || draft.currency}${draft.amount}` : ''} optional />
                  </ReviewGrid>
                  <div style={{ marginBottom: 4 }}>
                    <ReviewField label="Payment Terms" value={draft.paymentTerms} optional wide />
                  </div>

                </div>

              </div>
            )}

          </div>

          {/* ── BOTTOM NAV BAR ── */}
          <div style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.07)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG2 }}>
            <button onClick={() => { if (step > 1) { setStep(step - 1); scrollToTop(); } }} disabled={step === 1} style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
              padding: '11px 22px', color: step === 1 ? 'rgba(255,255,255,0.25)' : '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 600,
              cursor: step === 1 ? 'not-allowed' : 'pointer',
            }}>
              <ChevronLeft size={16} /> Previous
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {savedJustNow && <span style={{ fontSize: 14, color: GREEN, fontFamily: BARLOW, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Check size={14} /> Saved as draft</span>}
              <button onClick={saveDraftManually} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '11px 20px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>
                <Save size={15} /> Save as Draft
              </button>
              {step < 3 ? (
                <button onClick={() => {
                  if (step === 2 && AUDITION_DEPARTMENTS.has(draft.department)) {
                    if (!draft.auditionStart || !draft.auditionEnd) {
                      alert('Please fill in the Audition Start and End dates before proceeding.')
                      return
                    }
                    if (!draft.auditionTimeFrom || !draft.auditionTimeTo) {
                      alert('Please fill in the Audition Time (from and to) before proceeding.')
                      return
                    }
                  }
                  if (step === 2) {
                    if (!draft.shootStart || !draft.shootEnd) {
                      alert('Please fill in the Shoot Start and End dates before proceeding.')
                      return
                    }
                  }
                  setStep(step + 1); scrollToTop();
                }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: RED, border: 'none', borderRadius: 8, padding: '11px 24px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                  Save & Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button onClick={requestPublish} disabled={!draft.title || !draft.roleType} style={{
                  display: 'flex', alignItems: 'center', gap: 7, background: (!draft.title || !draft.roleType) ? 'rgba(200,32,42,0.4)' : RED, border: 'none', borderRadius: 8,
                  padding: '11px 26px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700,
                  cursor: (!draft.title || !draft.roleType) ? 'not-allowed' : 'pointer',
                }}>
                  {editId ? 'Save Changes' : 'Publish Casting Call'} <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─── Suspense wrapper (required for useSearchParams in Next.js App Router) ── */
export default function CreateCastingCallPage() {
  return (
    <Suspense fallback={<div style={{ background: '#050505', minHeight: '100vh' }} />}>
      <CreateCastingCallInner />
    </Suspense>
  );
}

/* ─── Review panel helper components ────────────────────────── */
function ReviewSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: RED, letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 12, marginTop: 24 }}>
      {children}
    </div>
  );
}

function ReviewGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14, marginBottom: 8 }}>
      {children}
    </div>
  );
}

function ReviewField({ label, value, required, optional, tags, wide }: { label: string; value: string; required?: boolean; optional?: boolean; tags?: string[]; wide?: boolean }) {
  const isEmpty = !value || value.trim() === '';
  return (
    <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px', gridColumn: wide ? '1 / -1' : undefined }}>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 6 }}>{label}</div>
      {tags && tags.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
          {tags.map(t => (
            <span key={t} style={{ fontSize: 14, fontFamily: BARLOW, color: RED, border: `1px solid ${RED}`, borderRadius: 16, padding: '3px 11px' }}>{t}</span>
          ))}
        </div>
      ) : isEmpty ? (
        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: required ? RED : 'rgba(255,255,255,0.55)' }}>
          {required ? '✗ Missing' : 'Optional'}
        </div>
      ) : (
        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{value}</div>
      )}
    </div>
  );
}