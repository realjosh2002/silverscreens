'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark, Star, Bell,
  ChevronLeft, Menu,
} from 'lucide-react'

const M    = "'Barlow Condensed', sans-serif"
const B    = "'Bebas Neue', sans-serif"
const RED  = '#C8202A'
const GOLD = '#D4A64A'

// â”€â”€ PRD Field Options â”€â”€
const TITLES        = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']
const GENDERS       = ['Male', 'Female', 'Others']
const HEIGHTS       = ['4\'6"', '4\'7"', '4\'8"', '4\'9"', '4\'10"', '4\'11"', '5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"', '6\'4"+']
const WEIGHTS       = Array.from({length: 31}, (_, i) => `${40 + i * 2} kg`)
const HAIR_COLORS   = ['Black', 'Dark Brown', 'Brown', 'Light Brown', 'Blonde', 'Auburn', 'Red', 'Grey', 'White', 'Bald', 'Other']
const EYE_COLORS    = ['Black', 'Dark Brown', 'Brown', 'Hazel', 'Green', 'Blue', 'Grey', 'Other']
const BODY_TONES    = ['Fair', 'Wheatish', 'Medium Brown', 'Dark Brown', 'Dusky', 'Other']
const BODY_TYPES    = ['Slim', 'Athletic', 'Muscular', 'Average', 'Curvy', 'Plus Size', 'Petite', 'Other']
const CHEST_SIZES   = Array.from({length: 21}, (_, i) => `${30 + i}"`)
const WAIST_SIZES   = Array.from({length: 21}, (_, i) => `${24 + i}"`)
const HIP_SIZES     = Array.from({length: 21}, (_, i) => `${30 + i}"`)
const SHOE_SIZES    = ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12']
// Reads active locations from the database (primary) with localStorage as fallback.
function useLocationConfig() {
  const [countries, setCountries] = useState<string[]>([])
  const [stateMap,  setStateMap]  = useState<Record<string, string[]>>({})
  const [cityMap,   setCityMap]   = useState<Record<string, string[]>>({})

  useEffect(() => {
    const applyResult = (c: string[], sm: Record<string, string[]>, cm: Record<string, string[]>) => {
      setCountries(c); setStateMap(sm); setCityMap(cm)
    }

    const tryLocalStorage = () => {
      try {
        const raw = localStorage.getItem('ss_location_config')
        if (!raw) return false
        const config = JSON.parse(raw)
        const c: string[] = [], sm: Record<string, string[]> = {}, cm: Record<string, string[]> = {}
        config.forEach((country: any) => {
          if (!country.active) return
          c.push(country.name)
          const states: string[] = []
          ;(country.states ?? []).forEach((s: any) => {
            if (!s.active) return
            states.push(s.name)
            const cities = (s.cities ?? []).filter((ci: any) => ci.active).map((ci: any) => ci.name)
            if (cities.length) cm[s.name] = cities
          })
          if (states.length) sm[country.name] = states
        })
        if (c.length > 0) { applyResult(c, sm, cm); return true }
        return false
      } catch { return false }
    }

    // Try database first
    fetch('/api/locations/public')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.data?.countries?.length) {
          applyResult(data.data.countries, data.data.stateMap, data.data.cityMap)
        } else {
          tryLocalStorage()
        }
      })
      .catch(() => tryLocalStorage())
  }, [])

  const loadCities = (_c: string, _s: string) => {}
  return { countries, stateMap, cityMap, loadCities }
}
const LANGUAGES     = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Urdu', 'Odia', 'Other']
const EXPERIENCE_LEVELS = ['Fresher', '1 - 2 Years', '2 - 5 Years', '5 - 10 Years', '10+ Years']
const PROJECT_TYPES = ['Film', 'Web Series', 'TV Series', 'Ad Film', 'Short Film', 'Theatre', 'Music Video', 'Documentary', 'OTT', 'Other']
const AVAILABLE_FOR = ['Feature Films', 'Short Films', 'Web Series', 'TV Serials', 'TV Commercials', 'Music Videos', 'Modelling', 'Theatre', 'Documentaries', 'Reality Shows', 'Item Numbers', 'Voice Over', 'Print Media', 'Brand Endorsements']
const MAX_ROLES     = 5

// â”€â”€ Departments & Roles (from lib/roles.ts — inlined for self-containment) â”€â”€
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
]

// â”€â”€ RingsNRoses cross-platform mapping â”€â”€
// Only departments/roles relevant to weddings & events
const RNR_DEPARTMENTS = ['Hair & Make Up', 'Singing', 'Dancing', 'Costume']

// Specific roles within those departments that are RNR-eligible
const RNR_ELIGIBLE_ROLES = [
  // Hair & Make Up
  'Make Up Artist', 'Key Make Up Artist', 'Make Up Supervisor', 'Hair Stylist', 'Key Hair',
  // Singing
  'Singer', 'Vocalist',
  // Dancing
  'Choreographer', 'Dancer',
  // Costume
  'Costume Designer', 'Costume Supervisor',
  // Sound & Music (specific roles only)
  'Music Composer', 'Music Composer / Director',
]

const STEPS = [
  { num: 1, label: 'Basic Info' },
  { num: 2, label: 'Details'    },
  { num: 3, label: 'Departments'},
  { num: 4, label: 'Media'      },
  { num: 5, label: 'Review'     },
]

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard'      },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications'},
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',       },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions'      },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended'    },
  { icon: Bell,            label: 'Notifications',        href: '/notifications',  },
];

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6, color: '#F5F5F5',
  fontFamily: M, fontSize: 14, outline: 'none',
  boxSizing: 'border-box' as const, cursor: 'text',
  colorScheme: 'dark',
}

const sel: React.CSSProperties = {
  ...inp, cursor: 'pointer',
  appearance: 'none' as const,
  colorScheme: 'dark',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
  backgroundSize: '10px', paddingRight: 28,
}

const lbl: React.CSSProperties = {
  fontFamily: M, fontSize: 14, fontWeight: 700,
  color: '#A8B0BD', letterSpacing: 0.5,
  display: 'block', marginBottom: 5,
  textTransform: 'uppercase' as const,
}


// â”€â”€ Custom dark-themed dropdown — replaces native <select> â”€â”€
function Select({
  value, onChange, options, placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' as const }}>
      {/*Trigger*/}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '9px 28px 9px 12px',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${open ? '#C8202A' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 6, color: value ? '#F5F5F5' : '#6A7080',
          fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14,
          cursor: 'pointer', userSelect: 'none' as const,
          boxSizing: 'border-box' as const, position: 'relative' as const,
          transition: 'border-color 0.2s',
        }}
      >
        {value || placeholder || '-- Select --'}
        <span style={{
          position: 'absolute' as const, right: 10, top: '50%',
          transform: open ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
          transition: 'transform 0.2s',
          color: '#A8B0BD', fontSize: 10, pointerEvents: 'none' as const,
        }}>▼</span>
      </div>
      {/*Dropdown list*/}
      {open && (
        <div style={{
          position: 'absolute' as const, top: 'calc(100% + 2px)', left: 0, right: 0,
          background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 6, zIndex: 999, maxHeight: 220, overflowY: 'auto' as const,
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}>
          {options.map((opt, i) => (
            <div key={`${opt}-${i}`} onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                padding: '9px 12px', cursor: 'pointer',
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14,
                color: value === opt ? '#fff' : '#A8B0BD',
                background: value === opt ? 'rgba(200,32,42,0.2)' : 'transparent',
                borderLeft: value === opt ? '3px solid #C8202A' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (value !== opt) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                if (value !== opt) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#A8B0BD'
                }
              }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function F({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}>{label}{required && <span style={{ color: RED, marginLeft: 2 }}>*</span>}</label>
      {children}
    </div>
  )
}

function SecHead({ num, icon, title, sub }: { num: number; icon: string; title: string; sub: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: B, fontSize: 17, letterSpacing: 1, color: '#F5F5F5' }}>{num}. {title}</div>
        <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  )
}

function MultiSelect({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (o: string) => onChange(selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o])
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, padding: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, minHeight: 40 }}>
      {options.map(o => (
        <span key={o} onClick={() => toggle(o)} style={{
          padding: '3px 10px', borderRadius: 20, fontSize: 14, fontFamily: M, fontWeight: 600, cursor: 'pointer',
          background: selected.includes(o) ? 'rgba(200,32,42,0.15)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${selected.includes(o) ? RED : 'rgba(255,255,255,0.1)'}`,
          color: selected.includes(o) ? RED : '#A8B0BD',
          transition: 'all 0.2s', userSelect: 'none' as const,
        }}>{o}</span>
      ))}
    </div>
  )
}

// â”€â”€ Department + Role selector — Option D chip layout â”€â”€
interface SelectedRole { department: string; role: string }

function DepartmentRoleSelector({
  selectedRoles, onChange,
}: { selectedRoles: SelectedRole[]; onChange: (v: SelectedRole[]) => void }) {
  const [activeDept, setActiveDept] = useState<string | null>(null)
  const [search, setSearch]         = useState('')
  const totalRoles = selectedRoles.length

  const toggleRole = (dept: string, role: string) => {
    const exists = selectedRoles.find(r => r.department === dept && r.role === role)
    if (exists) {
      onChange(selectedRoles.filter(r => !(r.department === dept && r.role === role)))
    } else {
      if (totalRoles >= MAX_ROLES) return
      onChange([...selectedRoles, { department: dept, role }])
    }
  }

  const removeRole = (dept: string, role: string) =>
    onChange(selectedRoles.filter(r => !(r.department === dept && r.role === role)))

  const filteredDepts = search.trim()
    ? DEPARTMENTS_AND_ROLES.filter(d => d.department.toLowerCase().includes(search.toLowerCase()))
    : DEPARTMENTS_AND_ROLES

  const activeRoles = activeDept
    ? DEPARTMENTS_AND_ROLES.find(d => d.department === activeDept)?.roles ?? []
    : []

  const deptChip = (dept: string): React.CSSProperties => {
    const count    = selectedRoles.filter(r => r.department === dept).length
    const isActive = activeDept === dept
    return {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 14px', borderRadius: 20, cursor: 'pointer',
      fontFamily: M, fontSize: 15, letterSpacing: 0.3,
      userSelect: 'none' as const, transition: 'all 0.15s',
      background: isActive ? RED : count > 0 ? 'rgba(200,32,42,0.14)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${isActive ? RED : count > 0 ? RED : 'rgba(255,255,255,0.1)'}`,
      color: isActive ? '#fff' : count > 0 ? RED : '#A8B0BD',
    }
  }

  const roleChip = (role: string, dept: string): React.CSSProperties => {
    const isSelected = selectedRoles.some(r => r.department === dept && r.role === role)
    const isDisabled = !isSelected && totalRoles >= MAX_ROLES
    return {
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 13px', borderRadius: 20, cursor: isDisabled ? 'not-allowed' : 'pointer',
      fontFamily: M, fontSize: 15, letterSpacing: 0.2,
      userSelect: 'none' as const, transition: 'all 0.15s',
      opacity: isDisabled ? 0.35 : 1,
      background: isSelected ? 'rgba(200,32,42,0.15)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${isSelected ? RED : 'rgba(255,255,255,0.1)'}`,
      color: isSelected ? RED : '#A8B0BD',
    }
  }

  return (
    <div>
      {/*Header row*/}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontFamily: M, fontSize: 15, color: '#A8B0BD', letterSpacing: 0.2 }}>
          Tap a department, then pick your roles.{' '}
          <span style={{ color: RED, fontWeight: 700 }}>Max {MAX_ROLES} roles</span> total.
        </span>
        <span style={{
          fontFamily: M, fontSize: 16, letterSpacing: 0.3,
          color: totalRoles >= MAX_ROLES ? RED : totalRoles > 0 ? '#22c55e' : '#6A7080',
        }}>{totalRoles} / {MAX_ROLES} selected</span>
      </div>

      {/*Search bar*/}
      <div style={{ position: 'relative' as const, marginBottom: 12 }}>
        <span style={{ position: 'absolute' as const, left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#6A7080' }}>🔍</span>
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={e => { setSearch(e.target.value); setActiveDept(null) }}
          style={{
            width: '100%', padding: '8px 12px 8px 32px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, color: '#F5F5F5',
            fontFamily: M, fontSize: 14, outline: 'none',
            boxSizing: 'border-box' as const,
          }}
          onFocus={e => (e.target.style.borderColor = RED)}
          onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
        {search && (
          <span onClick={() => setSearch('')}
            style={{ position: 'absolute' as const, right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#6A7080', fontSize: 15 }}>
            ✕
          </span>
        )}
      </div>

      {/*Max warning*/}
      {totalRoles >= MAX_ROLES && (
        <div style={{ marginBottom: 10, padding: '7px 12px', background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 6, fontFamily: M, fontSize: 14, color: RED }}>
          ⚠️ Maximum {MAX_ROLES} roles reached. Remove a role below to add another.
        </div>
      )}

      {/*Department chips*/}
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 7, marginBottom: 14 }}>
        {filteredDepts.length === 0 && (
          <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>No departments match "{search}"</span>
        )}
        {filteredDepts.map(d => {
          const count = selectedRoles.filter(r => r.department === d.department).length
          return (
            <span key={d.department}
              onClick={() => setActiveDept(p => p === d.department ? null : d.department)}
              style={deptChip(d.department)}
            >
              {d.department}
              {count > 0 && (
                <span style={{
                  background: activeDept === d.department ? 'rgba(255,255,255,0.25)' : RED,
                  color: '#fff', borderRadius: 10, fontSize: 14, fontFamily: M,
                  fontWeight: 700, padding: '0px 5px', lineHeight: '16px',
                }}>{count}</span>
              )}
            </span>
          )
        })}
      </div>

      {/*Role chips panel*/}
      {activeDept && (
        <div style={{
          padding: '12px 14px', marginBottom: 14,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(200,32,42,0.2)',
          borderRadius: 8,
        }}>
          <div style={{ fontFamily: M, fontSize: 14, color: RED, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 10 }}>
            {activeDept} — select roles:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 7 }}>
            {activeRoles.map(role => {
              const isSelected = selectedRoles.some(r => r.department === activeDept && r.role === role)
              return (
                <span key={role} onClick={() => toggleRole(activeDept, role)} style={roleChip(role, activeDept)}>
                  {isSelected && <span style={{ fontSize: 14 }}>✓</span>}
                  {role}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/*Selected roles strip*/}
      {selectedRoles.length > 0 && (
        <div style={{
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
        }}>
          <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8 }}>
            Your selected roles:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
            {selectedRoles.map(r => (
              <span key={`${r.department}-${r.role}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 20,
                fontFamily: M, fontSize: 15,
                background: 'rgba(200,32,42,0.15)',
                border: `1px solid ${RED}`,
                color: RED, userSelect: 'none' as const,
              }}>
                {r.role}
                <span onClick={() => removeRole(r.department, r.role)}
                  style={{ cursor: 'pointer', fontSize: 15, lineHeight: 1, opacity: 0.6 }}>×</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// â”€â”€ RingsNRoses Cross-Platform Prompt â”€â”€
function RingsNRosesPrompt({ selectedRoles, onDismiss }: { selectedRoles: SelectedRole[]; onDismiss: () => void }) {
  const matched = selectedRoles.some(r => RNR_ELIGIBLE_ROLES.includes(r.role))
  if (!matched) return null

  return (
    <div style={{ marginTop: 16, padding: '16px', background: 'linear-gradient(135deg, rgba(212,166,74,0.08), rgba(200,32,42,0.06))', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>👍</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: B, fontSize: 15, letterSpacing: 1, color: '#D4A64A', marginBottom: 4 }}>YOUR PROFILE MATCHES RINGSNROSES!</div>
          <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.6, marginBottom: 12 }}>
            Your selected roles match categories available on <strong style={{ color: '#D4A64A' }}>RingsNRoses</strong>, our wedding vendor marketplace. Expand your visibility and get hired for weddings, events and celebrations too!
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            <button onClick={() => window.open('https://www.ringsnroses.com/vendor/signup', '_blank')}
              style={{ padding: '7px 16px', background: '#D4A64A', border: 'none', borderRadius: 6, color: '#0a0a0a', fontFamily: B, fontSize: 14, letterSpacing: 1, cursor: 'pointer' }}>
              👍 CREATE VENDOR PROFILE
            </button>
            <button onClick={() => window.open('https://www.ringsnroses.com', '_blank')}
              style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(212,166,74,0.4)', borderRadius: 6, color: '#D4A64A', fontFamily: M, fontSize: 14, cursor: 'pointer' }}>
              Learn More
            </button>
            <button onClick={onDismiss}
              style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#6A7080', fontFamily: M, fontSize: 14, cursor: 'pointer' }}>
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const profileMenuLinks = [
  { icon: '💤', label: 'My Profile', href: '/my-profile' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
  { icon: '🚪', label: 'Logout', href: '/login' },
]

export default function CreateProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState(1)

  // â”€â”€ Jump to section from ?section= query param â”€â”€
  useEffect(() => {
    const sectionMap: Record<string, number> = {
      'basic':    1,
      'physical': 2,
      'roles':    3,
      'media':    4,
      'review':   5,
    }
    const param = searchParams.get('section')
    if (param && sectionMap[param]) setActiveSection(sectionMap[param])
  }, [searchParams])
  const [showDropdown,  setShowDropdown]  = useState(false)
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [notifCount,    setNotifCount]    = useState(0)
  const [msgCount,      setMsgCount]      = useState(0)

  // Inject live badge counts into sidebar items
  const navItems = SIDEBAR_ITEMS.map(item => {
    if (item.label === 'Messages')      return { ...item, badge: msgCount     || undefined }
    if (item.label === 'Notifications') return { ...item, badge: notifCount   || undefined }
    return item
  })
  const [userName,      setUserName]      = useState('My Account')
  const [avatarUrl,     setAvatarUrl]     = useState('')

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u.name)         setUserName(u.name)
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto)
    } catch {}
  }, [])

  // Fetch live badge counts
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const token = u.token
      if (!token) return
      const h = { Authorization: `Bearer ${token}` }
      fetch('/api/notifications', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return
          const count = data.data?.unread_count ?? data.unread_count
          if (count != null) { setNotifCount(count); return }
          const list = data.data?.notifications ?? data.notifications ?? []
          if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length)
        }).catch(() => {})
      fetch('/api/messages/conversations', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return
          const list = data.data?.conversations ?? data.conversations ?? []
          if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length)
        }).catch(() => {})
    } catch {}
  }, [])

  const SB_W = sidebarOpen ? 220 : 56
  const [languages, setLanguages] = useState<string[]>([])
  const [availableFor, setAvailableFor] = useState<string[]>([])
  const [bio, setBio] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<SelectedRole[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [showRnRPrompt, setShowRnRPrompt] = useState(true)
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([])
  const [galleryMediaIds, setGalleryMediaIds] = useState<(string|null)[]>([]) // tracks DB IDs for deletion
  const [showreelUrl, setShowreelUrl] = useState('')
  const [otherVideos, setOtherVideos] = useState<string[]>([])
  const profilePhotoRef = useRef<HTMLInputElement>(null)
  const galleryRef      = useRef<HTMLInputElement>(null)
  const showreelRef     = useRef<HTMLInputElement>(null)
  const otherVideosRef  = useRef<HTMLInputElement>(null)
  const [savedDraft, setSavedDraft] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)
  const [showDraftPrompt, setShowDraftPrompt] = useState(false)
  const [pendingDraft, setPendingDraft] = useState<any>(null)
  const [validationError, setValidationError] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const { countries: locationCountries, stateMap, cityMap, loadCities } = useLocationConfig()

  // On load: detect saved draft and PROMPT user instead of auto-restoring
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ss_profile_draft')
      if (!raw) return
      const draft = JSON.parse(raw)
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      // Only restore draft if it belongs to the current user
      if (draft?.userEmail && draft.userEmail !== u.email) {
        localStorage.removeItem('ss_profile_draft')
        return
      }
      // Edit mode — auto-restore without prompt
      if (draft?.editMode) {
  	setIsEditMode(true)
  	applyDraft(draft)
	}
      // Normal draft restore prompt
      const hasContent = draft?.form?.firstName || draft?.form?.email || draft?.selectedRoles?.length > 0
      if (draft?.form && !draft.published && hasContent) {
        setPendingDraft(draft)
        setShowDraftPrompt(true)
      }
    } catch {}
  }, [])

  const applyDraft = (draft: any) => {
    if (draft?.form)           setForm(draft.form)
    if (draft?.languages)     setLanguages(draft.languages)
    if (draft?.availableFor)  setAvailableFor(draft.availableFor)
    if (draft?.selectedRoles) setSelectedRoles(draft.selectedRoles)
    if (draft?.bio)           setBio(draft.bio)
    if (draft?.activeSection) setActiveSection(draft.activeSection)
    if (draft?.credits)       setCredits(draft.credits)
    if (draft?.selectedSkills) setSelectedSkills(draft.selectedSkills)
    setDraftRestored(true)
    setTimeout(() => setDraftRestored(false), 4000)
  }

  // Load existing profile from API on mount
  useEffect(() => {
    async function loadProfile() {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      let token = u.token
      if (!token) return

      // Refresh token if expiring
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (Date.now() > (payload.exp * 1000) - 5 * 60 * 1000) {
          if (u.refreshToken) {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'apikey': supabaseKey ?? '' },
              body: JSON.stringify({ refresh_token: u.refreshToken }),
            })
            if (res.ok) {
              const data = await res.json()
              if (data.access_token) {
                token = data.access_token
                localStorage.setItem('ss_user', JSON.stringify({ ...u, token, refreshToken: data.refresh_token }))
              }
            }
          }
        }
      } catch {}

      const res = await fetch('/api/profile/aspirant', { headers: { Authorization: `Bearer ${token}` } })
	if (!res.ok) return
	const data = await res.json()
	const p = data.data?.profile ?? data.profile ?? data
	if (!p?.first_name) return
      setIsEditMode(true)

      setForm(prev => ({
        ...prev,
        title:         p.title        || prev.title,
        firstName:     p.first_name   || prev.firstName,
        lastName:      p.last_name    || prev.lastName,
        email:         p.profiles?.email || prev.email,
        mobile:        p.profiles?.phone || prev.mobile,
        gender:        p.gender       || prev.gender,
        dob:           p.date_of_birth ? p.date_of_birth.slice(0, 10) : prev.dob,
        addressLine1:  p.address_line1 || prev.addressLine1,
        addressLine2:  p.address_line2 || prev.addressLine2,
        city:          p.city         || prev.city,
        state:         p.state        || prev.state,
        pincode:       p.pincode      || prev.pincode,
        country:       p.country      || prev.country,
        height:        p.height_cm ? (() => { const t = Math.round(parseFloat(String(p.height_cm)) / 2.54); const ft = Math.floor(t/12); const inch = t%12; return ft > 0 ? `${ft}'${inch}"` : prev.height })() : prev.height,
        height_cm:     p.height_cm    ? String(p.height_cm) : prev.height_cm,
        weight:        p.weight_kg    ? `${Math.round(parseFloat(String(p.weight_kg)))} kg` : prev.weight,
        weight_kg:     p.weight_kg    ? String(p.weight_kg) : prev.weight_kg,
        hairColor:     p.hair_color   || prev.hairColor,
        eyeColor:      p.eye_color    || prev.eyeColor,
        bodyTone:      p.body_tone    || prev.bodyTone,
        bodyType:      p.body_type    || prev.bodyType,
        chest:         p.chest_size   ? String(p.chest_size) : prev.chest,
        waist:         p.waist_size   ? String(p.waist_size) : prev.waist,
        hip:           p.hip_size     ? String(p.hip_size)   : prev.hip,
        shoe:          p.shoe_size    ? String(p.shoe_size)  : prev.shoe,
        experienceLevel: p.experience_level || prev.experienceLevel,
        profilePhoto:  p.profile_image_url  || prev.profilePhoto,
      }))
      if (p.languages?.length)   setLanguages(p.languages)
      if (p.availability?.length) setAvailableFor(p.availability)
      if (p.about_me)             setBio(p.about_me)
      if (p.category && p.role)   setSelectedRoles([{ department: p.category, role: p.role }])
      if (p.social_links?.credits?.length) setCredits(p.social_links.credits)
      if (Array.isArray(p.skills) && p.skills.length) setSelectedSkills(p.skills)

      if (Array.isArray(p.aspirant_media)) {
        const photos = p.aspirant_media.filter((m: any) => m.type === 'image').map((m: any) => m.url)
        const photoIds = p.aspirant_media.filter((m: any) => m.type === 'image').map((m: any) => m.id)
        const primaryPhoto = p.aspirant_media.find((m: any) => m.is_primary && m.type === 'image')
        // Track media IDs by URL
        photos.forEach((url: string, i: number) => { if (photoIds[i]) mediaIdMap.current[url] = photoIds[i] })
        if (photos.length) setGalleryPhotos(photos)
        if (photoIds.length) setGalleryMediaIds(photoIds)
        if (primaryPhoto) setForm(prev => ({ ...prev, profilePhoto: primaryPhoto.url }))
        const videos = p.aspirant_media.filter((m: any) => m.type === 'video').map((m: any) => m.url)
        if (videos.length) setShowreelUrl(videos[0])
        if (videos.length > 1) setOtherVideos(videos.slice(1))
      }
    }
    loadProfile()
  }, [])

  const continueDraft = () => {
    applyDraft(pendingDraft)
    setShowDraftPrompt(false)
    setPendingDraft(null)
  }

  const startFresh = () => {
    localStorage.removeItem('ss_profile_draft')
    setShowDraftPrompt(false)
    setPendingDraft(null)
  }

  // â”€â”€ Auto-save category to ss_user the moment roles are selected â”€â”€
  // This ensures the pricing page can show RingsNRoses eligibility
  // even if the user navigates there before clicking PUBLISH PROFILE.
  useEffect(() => {
    if (selectedRoles.length === 0) return
    try {
      const ELIGIBLE = [
        'Makeup Artist', 'Hair Stylist', 'Costume Designer',
        'Choreographer', 'Photographer', 'Videographer',
        'Music Composer', 'Singer',
      ]
      // Prefer a role that matches RingsNRoses eligibility; fall back to first role
      const eligibleRole = selectedRoles.find(r => ELIGIBLE.includes(r.role))?.role
        || selectedRoles[0].role
      const existing = JSON.parse(localStorage.getItem('ss_user') || '{}')
      localStorage.setItem('ss_user', JSON.stringify({
        ...existing,
        category: selectedRoles[0]?.role || '',
        departments: [...new Set(selectedRoles.map(r => r.department))],
        roles: selectedRoles,
        name: `${form.firstName} ${form.lastName}`.trim() || existing.name || '',
        verifiedAt: existing.verifiedAt || new Date().toISOString(),
      }))
    } catch {}
  }, [selectedRoles])

  // â”€â”€ Validate required fields per section before advancing â”€â”€
  const validateSection = (section: number): boolean => {
    setValidationError('')
    if (section === 1) {
      if (!form.title)     { setValidationError('Please select a Title.');              return false }
      if (!form.firstName) { setValidationError('First Name is required.');             return false }
      if (!form.lastName)  { setValidationError('Last Name is required.');              return false }
      if (!form.email)     { setValidationError('Email Address is required.');          return false }
      if (!form.mobile)    { setValidationError('Mobile Number is required.');          return false }
      if (!form.gender)    { setValidationError('Please select a Gender.');             return false }
      if (!form.dob)       { setValidationError('Date of Birth is required.');          return false }
      if (!form.city)      { setValidationError('City is required.');                   return false }
      if (!form.state)     { setValidationError('State is required.');                  return false }
      if (!form.country)   { setValidationError('Please select a Country.');            return false }
      if (languages.length === 0) { setValidationError('Please select at least one Language.'); return false }
    }
    if (section === 2) {
      if (!form.height)   { setValidationError('Please select your Height.');           return false }
      if (!form.weight)   { setValidationError('Please select your Weight.');           return false }
      if (!form.bodyType) { setValidationError('Please select a Body Type.');           return false }
      if (!form.bodyTone) { setValidationError('Please select a Body Tone.');           return false }
      if (!form.eyeColor) { setValidationError('Please select Eye Colour.');            return false }
      if (!form.hairColor){ setValidationError('Please select Hair Colour.');           return false }
      if (availableFor.length === 0) { setValidationError('Please select at least one option for Available For.'); return false }
    }
    if (section === 3) {
      if (selectedRoles.length === 0) { setValidationError('Please select at least one Department & Role.'); return false }
      if (!bio.trim())                { setValidationError('About Me is required. Tell casting directors about yourself.'); return false }
    }
    if (section === 4) {
      if (!form.profilePhoto) { setValidationError('A Profile Photo is required before publishing.'); return false }
    }
    return true
  }

  const [form, setForm] = useState({
    title: '', firstName: '', lastName: '', email: '', mobile: '',
    gender: '', dob: '',
    addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: '',
    height: '', weight: '', height_cm: '', weight_kg: '',
    hairColor: '', eyeColor: '',
    bodyTone: '', bodyType: '', chest: '', waist: '', hip: '', shoe: '',
    profilePhoto: '' as string,
    experienceLevel: '',
  })

  const [credits, setCredits] = useState<{ type: string; year: string; role: string; characterName: string; title: string; director: string; productionHouse: string; platform: string; platformOther: string; language: string; languageOther: string; description: string; trailerLink: string; imdbLink: string }[]>([])
  const addCredit = () => setCredits(p => [...p, { type: 'Film', year: '', role: '', characterName: '', title: '', director: '', productionHouse: '', platform: '', platformOther: '', language: '', languageOther: '', description: '', trailerLink: '', imdbLink: '' }])
  const removeCredit = (i: number) => setCredits(p => p.filter((_, idx) => idx !== i))
  const updateCredit = (i: number, key: string, val: string) => setCredits(p => p.map((c, idx) => idx === i ? { ...c, [key]: val } : c))

  // Matches the API's calculateCompletion — same fields & weights
  const completion = (() => {
    const fields: { val: unknown; weight: number }[] = [
      { val: form.firstName,     weight: 5 },
      { val: form.lastName,      weight: 5 },
      { val: form.gender,        weight: 5 },
      { val: form.dob,           weight: 5 },
      { val: form.addressLine1,  weight: 5 },
      { val: form.city,          weight: 5 },
      { val: form.state,         weight: 5 },
      { val: form.country,       weight: 5 },
      { val: form.height,        weight: 5 },
      { val: form.weight,        weight: 5 },
      { val: form.hairColor,     weight: 3 },
      { val: form.eyeColor,      weight: 3 },
      { val: form.bodyType,      weight: 3 },
      { val: languages,          weight: 5 },
      { val: availableFor,       weight: 5 },
      { val: bio,                weight: 8 },
      { val: selectedRoles[0]?.department, weight: 8 },
      { val: form.profilePhoto,  weight: 8 },
      { val: showreelUrl,        weight: 5 },
      { val: form.experienceLevel, weight: 5 },
      { val: credits.length > 0 ? credits : null, weight: 2 },
      { val: selectedSkills,     weight: 5 },
    ]
    let total = 0, earned = 0
    for (const f of fields) {
      total += f.weight
      const v = f.val
      const has = v !== null && v !== undefined && v !== '' &&
        !(Array.isArray(v) && v.length === 0)
      if (has) earned += f.weight
    }
    return Math.round((earned / total) * 100)
  })()

  const g = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.value
    setForm(p => ({ ...p, [k]: val }))
    setValidationError('')
    // Keep ss_user name in sync as the user types
    if (k === 'firstName' || k === 'lastName') {
      try {
        const existing = JSON.parse(localStorage.getItem('ss_user') || '{}')
        const newName = k === 'firstName'
          ? `${val} ${form.lastName}`.trim()
          : `${form.firstName} ${val}`.trim()
        localStorage.setItem('ss_user', JSON.stringify({ ...existing, name: newName, verifiedAt: existing.verifiedAt || new Date().toISOString() }))
      } catch {}
    }
  }

  const deleteMedia = async (mediaId: string | null) => {
    if (!mediaId) return
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const token = u.token
      if (!token) return
      await fetch(`/api/profile/aspirant/media?media_id=${mediaId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {}
  }

  const uploadFileWithId = async (file: File, type: string, isPrimary = false): Promise<{ url: string; id?: string } | null> => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const token = u.token
      if (!token) return null
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', type)
      fd.append('is_primary', String(isPrimary))
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
      if (!res.ok) return null
      const data = await res.json()
      const url = data.data?.url ?? data.url ?? null
      const id  = data.data?.media_id ?? data.media_id ?? null
      return url ? { url, id } : null
    } catch { return null }
  }

  const uploadFile = async (file: File, type: string, isPrimary = false): Promise<string | null> => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const token = u.token
      if (!token) return null
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', type)
      fd.append('is_primary', String(isPrimary))
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
      if (!res.ok) return null
      const data = await res.json()
      return data.data?.url ?? data.url ?? null
    } catch { return null }
  }

  const handleProfilePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setForm(p => ({ ...p, profilePhoto: preview })) // show preview immediately
    const url = await uploadFile(file, 'photo', true)
    if (url) setForm(p => ({ ...p, profilePhoto: url }))
  }

  const mediaIdMap = useRef<Record<string, string>>({}) // url -> media_id

  const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const previews = files.map(f => URL.createObjectURL(f))
    setGalleryPhotos(p => [...p, ...previews].slice(0, 10))
    for (let i = 0; i < files.length; i++) {
      const result = await uploadFileWithId(files[i], 'photo', false)
      if (result?.url) {
        const preview = previews[i]
        if (result.id) mediaIdMap.current[result.url] = result.id
        setGalleryPhotos(p => p.map(u => u === preview ? result.url : u))
      }
    }
  }

  const handleShowreel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setShowreelUrl(URL.createObjectURL(file)) // preview
    const url = await uploadFile(file, 'video', false)
    if (url) setShowreelUrl(url)
  }

  const handleOtherVideos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const previews = files.map(f => URL.createObjectURL(f))
    setOtherVideos(p => [...p, ...previews].slice(0, 5))
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i], 'video', false)
      if (url) {
        setOtherVideos(p => {
          const updated = [...p]
          const idx = updated.indexOf(previews[i])
          if (idx !== -1) updated[idx] = url
          return updated
        })
      }
    }
  }

  const handleSaveDraft = () => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const draft = {
        form, languages, availableFor, selectedRoles, bio,
        activeSection, savedAt: new Date().toISOString(), userEmail: u.email,
      }
      localStorage.setItem('ss_profile_draft', JSON.stringify(draft))
    } catch {}
    setSavedDraft(true)
    setTimeout(() => setSavedDraft(false), 3000)
  }

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = RED)
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'rgba(255,255,255,0.1)')

  // Unique departments selected
  const selectedDepts = [...new Set(selectedRoles.map(r => r.department))]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: '#050505', fontFamily: M, color: '#F5F5F5' }}>

      {/*• • • FULL-WIDTH HEADER — logo far left, user right (matches dashboard) • • •*/}
      <div style={{ height: 60, flexShrink: 0, background: '#0B0F14', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, zIndex: 50 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        {/*User dropdown*/}
        <div style={{ position: 'relative' as const }}>
          <div onClick={() => setShowDropdown(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff`} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>{`${form.firstName} ${form.lastName}`.trim() || 'Your Name'}</div>
              <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>Aspirant</div>
            </div>
            <span style={{ color: '#6A7080', fontSize: 14 }}>▼</span>
          </div>
          {showDropdown && (
            <>
              <div onClick={() => setShowDropdown(false)} style={{ position: 'fixed' as const, inset: 0, zIndex: 10 }} />
              <div style={{ position: 'absolute' as const, top: 48, right: 0, width: 160, background: '#0B0F14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                {profileMenuLinks.map(l => (
                  <div key={l.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', cursor: 'pointer', fontSize: 14 }}
                    onClick={() => {
                      setShowDropdown(false)
                      if (l.label === 'Logout') {
                        localStorage.removeItem('ss_user')
                        window.location.replace('/login')
                      } else {
                        router.push(l.href)
                      }
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  ><span>{l.icon}</span><span style={{ fontFamily: M, fontSize: 14, color: l.label === 'Logout' ? '#ef4444' : '#A8B0BD' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/*• • • BODY — sidebar + content • • •*/}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/*• • • STANDARD SIDEBAR — matches all other aspirant pages • • •*/}
        <aside style={{ width: SB_W, flexShrink: 0, background: '#0B0F14', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const, overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff`} alt={userName}
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}`, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: B, fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
                <div style={{ fontFamily: M, fontSize: 13, color: '#6A7080' }}>Aspirant</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: '10px 0' }}>
            {SIDEBAR_ITEMS.map(({ icon: SIcon, label, badge, href }: any) => {
              const active = false; // edit-profile has no matching nav item
              return (
                <div key={label} title={!sidebarOpen ? label : undefined}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '9px 16px' : '10px 0', cursor: 'pointer', background: 'transparent', borderLeft: '3px solid transparent' }}
                  onClick={() => router.push(href)}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                    <SIcon size={15} color="rgba(255,255,255,0.45)" strokeWidth={1.8} />
                    {sidebarOpen && <span style={{ fontFamily: M, fontSize: 15, color: 'rgba(255,255,255,0.65)' }}>{label}</span>}
                  </div>
                  {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' as const }}>{badge}</div>}
                </div>
              );
            })}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '16px 14px', textAlign: 'center' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontFamily: B, fontSize: 19, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontFamily: M, fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 15, fontWeight: 700, fontFamily: B, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/*• • • MAIN • • •*/}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>

          {/*Content*/}
          <div style={{ display: 'flex', gap: 20, padding: '20px 24px', flex: 1, overflowY: 'auto' as const }}>

            {/*Form*/}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

              {/*Page heading*/}
              <div>
                <div style={{ fontFamily: B, fontSize: 26, letterSpacing: 1, color: '#F5F5F5' }}>{isEditMode ? 'EDIT YOUR PROFILE' : 'CREATE YOUR PROFILE'}</div>
                <div style={{ fontFamily: M, fontSize: 15, color: '#6A7080', marginTop: 3 }}>{isEditMode ? 'Update your details — changes will be sent for admin review' : 'Complete your profile to start applying for castings'}</div>
              </div>

              {/*Edit mode notice*/}
              {isEditMode && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(212,166,74,0.07)', border: '1px solid rgba(212,166,74,0.25)', borderRadius: 10 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>✏️</span>
                  <div>
                    <div style={{ fontFamily: B, fontSize: 15, color: GOLD }}>Editing your profile</div>
                    <div style={{ fontFamily: M, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Your changes will be submitted for admin review before going live. Your current profile remains visible until approved.</div>
                  </div>
                  <button onClick={() => router.push('/my-profile')} style={{ marginLeft: 'auto', flexShrink: 0, background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '6px 14px', color: 'rgba(255,255,255,0.5)', fontFamily: M, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                </div>
              )}

              {/*Draft prompt — shown when a previous draft is detected*/}
              {showDraftPrompt && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 18px', background: 'rgba(212,166,74,0.07)', border: '1px solid rgba(212,166,74,0.25)', borderRadius: 10, flexWrap: 'wrap' as const }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>📝</span>
                    <div>
                      <div style={{ fontFamily: B, fontSize: 15, color: GOLD }}>You have an unfinished profile draft</div>
                      <div style={{ fontFamily: M, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                        Saved on {pendingDraft?.savedAt ? new Date(pendingDraft.savedAt).toLocaleString() : 'earlier'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    <button onClick={startFresh} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', fontFamily: M, fontSize: 14, cursor: 'pointer' }}>Start Fresh</button>
                    <button onClick={continueDraft} style={{ padding: '8px 20px', background: GOLD, border: 'none', borderRadius: 6, color: '#000', fontFamily: B, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Continue Draft →</button>
                  </div>
                </div>
              )}

              {/*Draft restored confirmation*/}
              {draftRestored && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <span style={{ fontFamily: M, fontSize: 14, color: '#86efac' }}>Draft restored — pick up right where you left off.</span>
                </div>
              )}

              {/*Progress*/}
              <div style={{ background: '#0B0F14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>Profile Completion</div>
                    <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginTop: 2 }}>Complete all sections to increase your visibility</div>
                  </div>
                  <div style={{ position: 'relative' as const, width: 52, height: 52 }}>
                    <svg width="52" height="52" viewBox="0 0 52 52">
                      <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                      <circle cx="26" cy="26" r="20" fill="none" stroke={RED} strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - completion / 100)}`}
                        strokeLinecap="round" transform="rotate(-90 26 26)" />
                    </svg>
                    <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: B, fontSize: 14, color: '#F5F5F5' }}>{completion}%</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {STEPS.map((s, i) => (
                    <div key={s.num} style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', position: 'relative' as const }}>
                      {i < STEPS.length - 1 && <div style={{ position: 'absolute' as const, top: 13, left: '50%', right: '-50%', height: 2, background: activeSection > s.num ? RED : 'rgba(255,255,255,0.08)' }} />}
                      <div onClick={() => setActiveSection(s.num)} style={{ width: 26, height: 26, borderRadius: '50%', zIndex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: B, fontSize: 14, background: activeSection === s.num ? RED : activeSection > s.num ? 'rgba(200,32,42,0.3)' : 'rgba(255,255,255,0.06)', border: `2px solid ${activeSection >= s.num ? RED : 'rgba(255,255,255,0.1)'}`, color: activeSection >= s.num ? '#F5F5F5' : '#6A7080', transition: 'all 0.3s' }}>
                        {activeSection > s.num ? '✓' : s.num}
                      </div>
                      <div style={{ fontFamily: M, fontSize: 14, color: activeSection >= s.num ? RED : '#6A7080', marginTop: 5, fontWeight: activeSection === s.num ? 700 : 400, whiteSpace: 'nowrap' as const }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/*SECTION 1: Basic Info*/}
              {activeSection === 1 && (
                <div style={{ background: '#0B0F14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px' }}>
                  <SecHead num={1} icon="💤" title="Basic Information" sub="Personal details for your profile" />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <F label="Title" required><Select value={form.title} onChange={v => { setForm(p => ({...p, title: v})); setValidationError('') }} options={TITLES} placeholder='-- Select Title --' /></F>
                    <F label="First Name" required><input type="text" placeholder="First name" value={form.firstName} onChange={g('firstName')} style={inp} onFocus={focus} onBlur={blur} /></F>
                    <F label="Last Name" required><input type="text" placeholder="Last name" value={form.lastName} onChange={g('lastName')} style={inp} onFocus={focus} onBlur={blur} /></F>
                    <F label="Email Address" required><input type="email" placeholder="Enter email" value={form.email} onChange={g('email')} style={inp} onFocus={focus} onBlur={blur} /></F>
                    <F label="Mobile Number" required><input type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={g('mobile')} style={inp} onFocus={focus} onBlur={blur} /></F>
                    <F label="Gender" required><Select value={form.gender} onChange={v => { setForm(p => ({...p, gender: v})); setValidationError('') }} options={GENDERS} placeholder='-- Select Gender --' /></F>
                    <F label="Date of Birth" required><input type="date" value={form.dob} onChange={g('dob')} style={{ ...inp, colorScheme: 'dark', cursor: 'pointer' }} /></F>
                    <F label="Country" required><Select value={form.country} onChange={v => { setForm(p => ({...p, country: v, state: '', city: ''})); setValidationError('') }} options={locationCountries} placeholder='-- Select Country --' /></F>
                    <F label="State" required>
                      {stateMap[form.country]?.length > 0
                        ? <Select value={form.state} onChange={v => { setForm(p => ({...p, state: v, city: ''})); setValidationError(''); loadCities(form.country, v) }} options={stateMap[form.country]} placeholder='-- Select State --' />
                        : <input type="text" placeholder="e.g. Maharashtra" value={form.state} onChange={g('state')} style={inp} onFocus={focus} onBlur={blur} />
                      }
                    </F>
                    <F label="City" required>
                      {cityMap[form.state]?.length > 0
                        ? <Select value={form.city} onChange={v => { setForm(p => ({...p, city: v})); setValidationError('') }} options={cityMap[form.state]} placeholder='-- Select City --' />
                        : <input type="text" placeholder="e.g. Mumbai" value={form.city} onChange={g('city')} style={inp} onFocus={focus} onBlur={blur} />
                      }
                    </F>
                    <F label="Address Line 1"><input type="text" placeholder="House / Flat No, Street" value={form.addressLine1} onChange={g('addressLine1')} style={inp} onFocus={focus} onBlur={blur} /></F>
                    <F label="Address Line 2"><input type="text" placeholder="Area, Locality" value={form.addressLine2} onChange={g('addressLine2')} style={inp} onFocus={focus} onBlur={blur} /></F>
                    <F label="Pin Code"><input type="text" placeholder="Pin / Zip Code" value={form.pincode} onChange={g('pincode')} style={inp} onFocus={focus} onBlur={blur} /></F>
                    <div style={{ gridColumn: '1 / -1' }}><F label="Languages Known" required><MultiSelect options={LANGUAGES} selected={languages} onChange={setLanguages} /></F></div>
                    <F label="Experience Level" required><Select value={form.experienceLevel} onChange={v => { setForm(p => ({...p, experienceLevel: v})); setValidationError('') }} options={EXPERIENCE_LEVELS} placeholder='-- Select Experience --' /></F>
                  </div>
                </div>
              )}

              {/*SECTION 2: Physical Details*/}
              {activeSection === 2 && (
                <div style={{ background: '#0B0F14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px' }}>
                  <SecHead num={2} icon="📏" title="Physical Details" sub="Your physical measurements and appearance" />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <F label="Height" required><Select value={form.height} onChange={v => { setForm(p => ({...p, height: v})); setValidationError('') }} options={HEIGHTS} placeholder='-- Select Height --' /></F>
                    <F label="Weight" required><Select value={form.weight} onChange={v => { setForm(p => ({...p, weight: v})); setValidationError('') }} options={WEIGHTS} placeholder='-- Select Weight --' /></F>
                    <F label="Body Type" required><Select value={form.bodyType} onChange={v => { setForm(p => ({...p, bodyType: v})); setValidationError('') }} options={BODY_TYPES} placeholder='-- Select Body Type --' /></F>
                    <F label="Body Tone" required><Select value={form.bodyTone} onChange={v => { setForm(p => ({...p, bodyTone: v})); setValidationError('') }} options={BODY_TONES} placeholder='-- Select Body Tone --' /></F>
                    <F label="Eye Color" required><Select value={form.eyeColor} onChange={v => { setForm(p => ({...p, eyeColor: v})); setValidationError('') }} options={EYE_COLORS} placeholder='-- Select Eye Colour --' /></F>
                    <F label="Hair Color" required><Select value={form.hairColor} onChange={v => { setForm(p => ({...p, hairColor: v})); setValidationError('') }} options={HAIR_COLORS} placeholder='-- Select Hair Colour --' /></F>
                    <F label="Chest Size"><Select value={form.chest} onChange={v => { setForm(p => ({...p, chest: v})); setValidationError('') }} options={CHEST_SIZES} placeholder='-- Select --' /></F>
                    <F label="Waist Size"><Select value={form.waist} onChange={v => { setForm(p => ({...p, waist: v})); setValidationError('') }} options={WAIST_SIZES} placeholder='-- Select --' /></F>
                    <F label="Hip Size"><Select value={form.hip} onChange={v => { setForm(p => ({...p, hip: v})); setValidationError('') }} options={HIP_SIZES} placeholder='-- Select --' /></F>
                    <F label="Shoe Size"><Select value={form.shoe} onChange={v => { setForm(p => ({...p, shoe: v})); setValidationError('') }} options={SHOE_SIZES} placeholder='-- Select Shoe Size --' /></F>
                    <div style={{ gridColumn: '1 / -1' }}><F label="Available For" required><MultiSelect options={AVAILABLE_FOR} selected={availableFor} onChange={setAvailableFor} /></F></div>
                  </div>
                </div>
              )}

              {/*SECTION 3: Departments & Roles*/}
              {activeSection === 3 && (
                <div style={{ background: '#0B0F14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px' }}>
                  <SecHead num={3} icon="🎬" title="Departments & Roles" sub="Select the departments and roles that best represent your skills (max 5 roles)" />
                  <DepartmentRoleSelector selectedRoles={selectedRoles} onChange={setSelectedRoles} />

                  {/*About Me*/}
                  <div style={{ marginTop: 20 }}>
                    <F label="About Me" required>
                      <textarea
                        placeholder="Tell casting directors about yourself, your experience, training, achievements and what makes you unique..."
                        value={bio} onChange={e => setBio(e.target.value.slice(0, 500))} rows={5}
                        style={{ ...inp, resize: 'vertical' as const, cursor: 'text' }}
                        onFocus={focus} onBlur={blur}
                      />
                      <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginTop: 4, textAlign: 'right' as const }}>{bio.length} / 500</div>
                    </F>
                  </div>

                  {/*Skills*/}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontFamily: M, fontSize: 15, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>Skills</div>
                    <div style={{ fontFamily: M, fontSize: 13, color: '#6A7080', marginBottom: 10 }}>Select skills that best describe your abilities. These help agencies find you in searches.</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {['Acting', 'Dialogue Delivery', 'Dancing', 'Action', 'Singing', 'Modelling', 'Yoga', 'Fighting', 'Mimicry', 'Horse Riding', 'Direction', 'Photography', 'Videography', 'Editing', 'Choreography', 'Make Up', 'Hair Styling', 'Costume Design', 'Script Writing', 'Voice Over', 'Anchoring', 'News Reading', 'Animation', 'VFX', 'Sound Design', 'Music Composition', 'Stunt', 'Production Management', 'Casting', 'Art Direction', 'Set Design', 'Cinematography', 'Dubbing', 'Influencing', 'Fashion Modelling'].map(skill => {
                        const selected = selectedSkills.includes(skill)
                        return (
                          <div key={skill} onClick={() => setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])}
                            style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${selected ? '#C8202A' : 'rgba(255,255,255,0.12)'}`, background: selected ? 'rgba(200,32,42,0.15)' : 'transparent', color: selected ? '#F5F5F5' : '#6A7080', fontSize: 14, fontFamily: M, cursor: 'pointer', transition: 'all 0.15s', userSelect: 'none' as const }}
                            onMouseEnter={e => { if (!selected) { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(200,32,42,0.4)'; (e.currentTarget as HTMLDivElement).style.color = '#A8B0BD'; } }}
                            onMouseLeave={e => { if (!selected) { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLDivElement).style.color = '#6A7080'; } }}
                          >
                            {skill}
                          </div>
                        )
                      })}
                    </div>
                    {selectedSkills.length > 0 && (
                      <div style={{ marginTop: 8, fontSize: 13, color: '#C8202A', fontFamily: M }}>
                        {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                        <span onClick={() => setSelectedSkills([])} style={{ marginLeft: 8, cursor: 'pointer', color: '#6A7080', textDecoration: 'underline' }}>Clear all</span>
                      </div>
                    )}
                  </div>

                  {/*Experience & Credits*/}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ fontFamily: M, fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>Experience & Credits</div>
                      <button onClick={addCredit} style={{ background: RED, border: 'none', borderRadius: 6, padding: '6px 14px', color: '#fff', fontFamily: M, fontSize: 14, cursor: 'pointer' }}>+ Add Project</button>
                    </div>
                    {credits.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 8, color: '#6A7080', fontFamily: M, fontSize: 14 }}>
                        No credits added yet. Click "+ Add Project" to add your past work.
                      </div>
                    )}
                    {credits.map((c, i) => (
                      <div key={i} style={{ marginBottom: 10, padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Production Name</div><input type="text" placeholder="e.g. Leo 2" value={c.title} onChange={e => updateCredit(i, 'title', e.target.value)} style={{ ...inp, padding: '8px 10px' }} /></div>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Role</div><input type="text" placeholder="e.g. Lead Actor" value={c.role} onChange={e => updateCredit(i, 'role', e.target.value)} style={{ ...inp, padding: '8px 10px' }} /></div>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Character Name</div><input type="text" placeholder="e.g. Parthiban" value={c.characterName} onChange={e => updateCredit(i, 'characterName', e.target.value)} style={{ ...inp, padding: '8px 10px' }} /></div>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Project Type</div><Select value={c.type} onChange={v => updateCredit(i, 'type', v)} options={PROJECT_TYPES} placeholder='-- Select --' /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Director</div><input type="text" placeholder="e.g. Lokesh Kanagaraj" value={c.director} onChange={e => updateCredit(i, 'director', e.target.value)} style={{ ...inp, padding: '8px 10px' }} /></div>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Production House</div><input type="text" placeholder="e.g. Lyca Productions" value={c.productionHouse} onChange={e => updateCredit(i, 'productionHouse', e.target.value)} style={{ ...inp, padding: '8px 10px' }} /></div>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Release Year</div><Select value={c.year} onChange={v => updateCredit(i, 'year', v)} options={Array.from({length: new Date().getFullYear() - 1989}, (_, k) => String(new Date().getFullYear() - k))} placeholder='-- Year --' /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                          <div>
                            <div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Platform</div>
                            <Select value={c.platform} onChange={v => updateCredit(i, 'platform', v)} options={[...AVAILABLE_FOR, 'Other']} placeholder='-- Select Platform --' />
                            {c.platform === 'Other' && <input type="text" placeholder="Specify platform" value={c.platformOther} onChange={e => updateCredit(i, 'platformOther', e.target.value)} style={{ ...inp, padding: '8px 10px', marginTop: 6 }} />}
                          </div>
                          <div>
                            <div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Language</div>
                            <Select value={c.language} onChange={v => updateCredit(i, 'language', v)} options={[...LANGUAGES, 'Other']} placeholder='-- Select Language --' />
                            {c.language === 'Other' && <input type="text" placeholder="Specify language" value={c.languageOther} onChange={e => updateCredit(i, 'languageOther', e.target.value)} style={{ ...inp, padding: '8px 10px', marginTop: 6 }} />}
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Trailer Link</div><input type="text" placeholder="https://youtube.com/..." value={c.trailerLink} onChange={e => updateCredit(i, 'trailerLink', e.target.value)} style={{ ...inp, padding: '8px 10px' }} /></div>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>IMDb Link</div><input type="text" placeholder="https://imdb.com/title/..." value={c.imdbLink} onChange={e => updateCredit(i, 'imdbLink', e.target.value)} style={{ ...inp, padding: '8px 10px' }} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'flex-end' }}>
                          <div><div style={{ fontFamily: M, fontSize: 12, color: '#6A7080', marginBottom: 4 }}>Description (optional)</div><textarea placeholder="Brief description of your role and the project..." value={c.description} onChange={e => updateCredit(i, 'description', e.target.value)} rows={2} style={{ ...inp, resize: 'vertical' as const, cursor: 'text', padding: '8px 10px' }} /></div>
                          <button onClick={() => removeCredit(i)} style={{ background: 'rgba(200,32,42,0.15)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 6, padding: '8px 10px', color: RED, cursor: 'pointer', fontFamily: M, fontSize: 14, marginBottom: 2 }}>✕ Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/*RingsNRoses cross-platform prompt*/}
                  {showRnRPrompt && selectedRoles.length > 0 && (
                    <RingsNRosesPrompt selectedRoles={selectedRoles} onDismiss={() => setShowRnRPrompt(false)} />
                  )}
                </div>
              )}

              {/*SECTION 4: Media*/}
              {activeSection === 4 && (
                <div style={{ background: '#0B0F14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px' }}>
                  <SecHead num={4} icon="🖼️" title="Media & Portfolio" sub="Add photos, videos and showreels to highlight your talent" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/*Profile Photo*/}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>Profile Photo</div>
                          <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginTop: 2 }}>Add your best profile picture</div>
                        </div>
                        {form.profilePhoto && <span style={{ color: '#22c55e', fontSize: 16 }}>✓</span>}
                      </div>
                      <div onClick={() => profilePhotoRef.current?.click()} style={{ height: 130, borderRadius: 6, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: `2px dashed ${form.profilePhoto ? '#22c55e' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        {form.profilePhoto ? <img src={form.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} alt="" /> : <div style={{ textAlign: 'center' as const, color: '#6A7080' }}><div style={{ fontSize: 28, marginBottom: 6 }}>📷</div><div style={{ fontFamily: M, fontSize: 14 }}>Click to upload</div><div style={{ fontFamily: M, fontSize: 14, marginTop: 2 }}>JPG, PNG up to 5MB</div></div>}
                      </div>
                      {form.profilePhoto && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <button onClick={() => profilePhotoRef.current?.click()} style={{ flex: 1, padding: '6px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, color: '#A8B0BD', fontFamily: M, fontSize: 13, cursor: 'pointer' }}>📞 Replace</button>
                          <button onClick={(e) => { e.stopPropagation(); setForm(p => ({ ...p, profilePhoto: '' })) }} style={{ flex: 1, padding: '6px 0', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 5, color: RED, fontFamily: M, fontSize: 13, cursor: 'pointer' }}>✕ Remove</button>
                        </div>
                      )}
                      <input ref={profilePhotoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePhoto} />
                    </div>
                    {/*Gallery Photos*/}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 16 }}>
                      <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>Gallery Photos <span style={{ color: '#6A7080', fontWeight: 400 }}>{galleryPhotos.length}/10</span></div>
                      <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginBottom: 8 }}>Add at least 3 photos — no watermarks or contact numbers</div>
                      <div style={{ background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 6, padding: '8px 12px', marginBottom: 10 }}>
                        <div style={{ fontFamily: M, fontSize: 13, color: GOLD, fontWeight: 700, marginBottom: 6 }}>📡 Recommended photo types (up to 10)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 12px' }}>
                          {['Headshot', 'Mid Shot', 'Full Length', 'Traditional', 'Western', 'Ethnic', 'Casual', 'Formal', 'Smile', 'Serious'].map((cat, idx) => (
                            <div key={cat} style={{ fontFamily: M, fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6, padding: '1px 0' }}>
                              <span style={{ color: GOLD, fontSize: 11 }}>{idx + 1}.</span> {cat}
                              {galleryPhotos[idx] && <span style={{ color: '#22c55e', fontSize: 12, marginLeft: 'auto' }}>✓</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                      {galleryPhotos.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 8 }}>
                          {galleryPhotos.map((p, i) => (
                            <div key={i} style={{ position: 'relative' as const }}>
                              <img src={p} style={{ width: '100%', height: 52, objectFit: 'cover', borderRadius: 4 }} alt="" />
                              <div style={{ position: 'absolute' as const, bottom: 2, left: 2, right: 2, fontFamily: M, fontSize: 10, color: '#fff', background: 'rgba(0,0,0,0.6)', borderRadius: 2, padding: '1px 3px', textAlign: 'center' as const, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                                {['Headshot','Mid Shot','Full Length','Traditional','Western','Ethnic','Casual','Formal','Smile','Serious'][i] || `Photo ${i+1}`}
                              </div>
                              <button
                                onClick={() => {
                                  const url = galleryPhotos[i]
                                  const mediaId = mediaIdMap.current[url] ?? galleryMediaIds[i] ?? null
                                  deleteMedia(mediaId)
                                  setGalleryPhotos(prev => prev.filter((_, idx) => idx !== i))
                                  setGalleryMediaIds(prev => prev.filter((_, idx) => idx !== i))
                                  if (url) delete mediaIdMap.current[url]
                                }}
                                style={{ position: 'absolute' as const, top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(200,32,42,0.85)', border: 'none', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0 }}
                              >✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div onClick={() => galleryRef.current?.click()} style={{ height: 44, borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>+</span><span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>Add photos ({galleryPhotos.length}/10)</span>
                      </div>
                      <input ref={galleryRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGallery} />
                    </div>
                    {/*Showreel*/}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>Showreel Video</div>
                        {showreelUrl && <span style={{ color: '#22c55e', fontSize: 14 }}>✓</span>}
                      </div>
                      <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginBottom: 10 }}>Add your showreel (no watermarks)</div>
                      <input type="text" placeholder="Paste YouTube / Vimeo URL" value={showreelUrl} onChange={e => setShowreelUrl(e.target.value)} style={{ ...inp, marginBottom: 8 }} onFocus={focus} onBlur={blur} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                        <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>OR</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                      </div>
                      <div onClick={() => showreelRef.current?.click()} style={{ height: 60, borderRadius: 6, background: showreelUrl ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)', border: `2px dashed ${showreelUrl ? '#22c55e' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>▶️</span>
                        <span style={{ fontFamily: M, fontSize: 14, color: showreelUrl ? '#22c55e' : '#6A7080' }}>{showreelUrl ? '✓ Showreel added — click to replace' : 'Upload MP4 file'}</span>
                      </div>
                      {showreelUrl && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <button onClick={() => showreelRef.current?.click()} style={{ flex: 1, padding: '6px 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5, color: '#A8B0BD', fontFamily: M, fontSize: 13, cursor: 'pointer' }}>📞 Replace</button>
                          <button onClick={(e) => { e.stopPropagation(); setShowreelUrl('') }} style={{ flex: 1, padding: '6px 0', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 5, color: RED, fontFamily: M, fontSize: 13, cursor: 'pointer' }}>✕ Remove</button>
                        </div>
                      )}
                      <input ref={showreelRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleShowreel} />
                    </div>
                    {/*Other Videos*/}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 16 }}>
                      <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>Other Videos <span style={{ color: '#6A7080', fontWeight: 400 }}>{otherVideos.length}/5</span></div>
                      <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginBottom: 10 }}>Up to 5 videos, MP4 format, no watermarks</div>
                      {otherVideos.length > 0 && (
                        <div style={{ marginBottom: 8 }}>
                          {otherVideos.map((_, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 4, marginBottom: 4 }}>
                              <span style={{ fontSize: 14 }}>🎥</span>
                              <span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', flex: 1 }}>Video {i + 1}</span>
                              <button
                                onClick={() => { const inp = document.createElement('input'); inp.type='file'; inp.accept='video/*'; inp.onchange = async (ev: any) => { const file = ev.target.files?.[0]; if (!file) return; const preview = URL.createObjectURL(file); setOtherVideos(p => { const u=[...p]; u[i]=preview; return u; }); const url = await uploadFile(file,'video',false); if(url) setOtherVideos(p=>{const u=[...p];u[i]=url;return u;}); }; inp.click(); }}
                                style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, color: '#A8B0BD', fontFamily: M, fontSize: 12, cursor: 'pointer' }}>📞 Replace</button>
                              <button
                                onClick={() => setOtherVideos(p => p.filter((_, idx) => idx !== i))}
                                style={{ padding: '3px 10px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 4, color: RED, fontFamily: M, fontSize: 12, cursor: 'pointer' }}>✕ Remove</button>
                            </div>
                          ))}
                        </div>
                      )}
                      {otherVideos.length < 5 && (
                        <div onClick={() => otherVideosRef.current?.click()} style={{ height: otherVideos.length > 0 ? 50 : 100, borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>+</span>
                          <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>Add video ({otherVideos.length}/5)</span>
                        </div>
                      )}
                      <input ref={otherVideosRef} type="file" accept="video/*" multiple style={{ display: 'none' }} onChange={handleOtherVideos} />
                    </div>
                  </div>
                </div>
              )}

              {/*SECTION 5: Review*/}
              {activeSection === 5 && (
                <div style={{ background: '#0B0F14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px' }}>
                  <SecHead num={5} icon="✅" title="Review & Submit" sub="Review your profile before publishing" />

                  {form.profilePhoto && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                      <img src={form.profilePhoto} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${RED}` }} alt="" />
                      <div>
                        <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>{`${form.title} ${form.firstName} ${form.lastName}`.trim() || '—'}</div>
                        <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', marginTop: 2 }}>Aspirant ★ {form.gender}</div>
                      </div>
                      <span style={{ color: '#22c55e', fontSize: 18, marginLeft: 'auto' }}>✓ Photo Added</span>
                    </div>
                  )}

                  {/*Personal Details*/}
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 8 }}>Personal Details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      ['Full Name',     `${form.title} ${form.firstName} ${form.lastName}`.trim() || '—'],
                      ['Email',         form.email    || '—'],
                      ['Mobile',        form.mobile   || '—'],
                      ['Gender',        form.gender],
                      ['Date of Birth', form.dob      || '—'],
                      ['Country',       form.country],
                      ['City',          form.city     || '—'],
                      ['State',         form.state    || '—'],
                      ['Languages',     languages.join(', ') || '—'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                        <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 3 }}>{k}</div>
                        <div style={{ fontFamily: M, fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/*Physical Details*/}
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 8 }}>Physical Details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      ['Height', form.height], ['Weight', form.weight], ['Body Type', form.bodyType],
                      ['Body Tone', form.bodyTone], ['Eye Color', form.eyeColor], ['Hair Color', form.hairColor],
                      ['Chest', form.chest], ['Waist', form.waist], ['Hip', form.hip], ['Shoe Size', form.shoe],
                    ].map(([k, v]) => (
                      <div key={k} style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                        <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 3 }}>{k}</div>
                        <div style={{ fontFamily: M, fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/*Departments & Roles*/}
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 8 }}>Departments & Roles</div>
                  <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 16 }}>
                    {selectedRoles.length === 0 ? (
                      <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>— No roles selected</span>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                        {selectedDepts.map(dept => (
                          <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
                            <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080', minWidth: 120 }}>{dept}</span>
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
                              {selectedRoles.filter(r => r.department === dept).map(r => (
                                <span key={r.role} style={{ padding: '2px 9px', borderRadius: 12, fontSize: 14, fontFamily: M, fontWeight: 600, background: 'rgba(200,32,42,0.12)', border: `1px solid rgba(200,32,42,0.3)`, color: RED }}>{r.role}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/*Available For*/}
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 8 }}>Available For</div>
                  <div style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4 }}>
                      {availableFor.length > 0 ? availableFor.map(a => (
                        <span key={a} style={{ fontFamily: M, fontSize: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#A8B0BD', padding: '2px 8px', borderRadius: 10 }}>{a}</span>
                      )) : <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>—</span>}
                    </div>
                  </div>

                  {/*Skills*/}
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 8 }}>Skills</div>
                  <div style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4 }}>
                      {selectedSkills.length > 0 ? selectedSkills.map(s => (
                        <span key={s} style={{ fontFamily: M, fontSize: 14, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', color: RED, padding: '2px 9px', borderRadius: 10 }}>{s}</span>
                      )) : <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>— No skills selected</span>}
                    </div>
                  </div>

                  {/*Experience & Credits*/}
                  {credits.length > 0 && (<>
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 8 }}>Experience & Credits</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 16 }}>
                    {credits.map((c, i) => (
                      <div key={i} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                        <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 3 }}>{c.title || '—'}</div>
                        <div style={{ fontFamily: M, fontSize: 14, color: RED, marginBottom: 4 }}>{c.role}{c.characterName ? ` as ${c.characterName}` : ''}{c.productionHouse ? ` · ${c.productionHouse}` : ''}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 4 }}>
                          {c.type && <span style={{ fontFamily: M, fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#A8B0BD', padding: '1px 8px', borderRadius: 4 }}>{c.type}</span>}
                          {c.platform && c.platform !== 'Other' && <span style={{ fontFamily: M, fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#A8B0BD', padding: '1px 8px', borderRadius: 4 }}>{c.platform}</span>}
                          {c.platform === 'Other' && c.platformOther && <span style={{ fontFamily: M, fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#A8B0BD', padding: '1px 8px', borderRadius: 4 }}>{c.platformOther}</span>}
                          {c.language && c.language !== 'Other' && <span style={{ fontFamily: M, fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#A8B0BD', padding: '1px 8px', borderRadius: 4 }}>{c.language}</span>}
                          {c.language === 'Other' && c.languageOther && <span style={{ fontFamily: M, fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#A8B0BD', padding: '1px 8px', borderRadius: 4 }}>{c.languageOther}</span>}
                          {c.year && <span style={{ fontFamily: M, fontSize: 13, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#A8B0BD', padding: '1px 8px', borderRadius: 4 }}>{c.year}</span>}
                        </div>
                        {c.director && <div style={{ fontFamily: M, fontSize: 13, color: '#6A7080' }}>Dir. {c.director}</div>}
                        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                          {c.trailerLink && <a href={c.trailerLink} target="_blank" rel="noreferrer" style={{ fontFamily: M, fontSize: 13, color: RED, textDecoration: 'none' }}>▶ Trailer</a>}
                          {c.imdbLink && <a href={c.imdbLink} target="_blank" rel="noreferrer" style={{ fontFamily: M, fontSize: 13, color: GOLD, textDecoration: 'none' }}>IMDb →</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                  </>)}
                  {/*Media*/}
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 8 }}>Media</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      ['Profile Photo',  form.profilePhoto ? '✓ Added' : '✗ Missing'],
                      ['Gallery Photos', galleryPhotos.length > 0 ? `✓ ${galleryPhotos.length} photos` : '✗ Missing'],
                      ['Showreel',       showreelUrl ? '✓ Added' : '✗ Missing'],
                      ['Other Videos',   otherVideos.length > 0 ? `✓ ${otherVideos.length} videos` : 'Optional'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                        <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 3 }}>{k}</div>
                        <div style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: (v as string).startsWith('✓') ? '#22c55e' : (v as string).startsWith('✗') ? '#ef4444' : '#A8B0BD' }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {bio && (
                    <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                      <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>About Me</div>
                      <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.7 }}>{bio}</div>
                    </div>
                  )}
                </div>
              )}

              {/*Validation error banner*/}
              {validationError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.35)', borderRadius: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                  <span style={{ fontFamily: M, fontSize: 14, color: '#F5A0A5', fontWeight: 600 }}>{validationError}</span>
                </div>
              )}

              {/*Bottom Actions*/}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#0B0F14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  {activeSection > 1 && (
                    <button onClick={() => { setValidationError(''); setActiveSection(s => s - 1); }} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#A8B0BD', fontFamily: B, fontSize: 14, letterSpacing: 1, cursor: 'pointer' }}>← BACK</button>
                  )}
                  <button onClick={handleSaveDraft} style={{ padding: '9px 20px', background: 'transparent', border: `1px solid ${savedDraft ? '#22c55e' : 'rgba(255,255,255,0.15)'}`, borderRadius: 6, color: savedDraft ? '#22c55e' : '#A8B0BD', fontFamily: B, fontSize: 14, letterSpacing: 1, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {savedDraft ? '✓ SAVED' : 'SAVE DRAFT'}
                  </button>
                </div>
                {activeSection < 5
                  ? <button onClick={() => { if (validateSection(activeSection)) setActiveSection(s => s + 1); }} style={{ padding: '9px 32px', background: RED, border: 'none', borderRadius: 6, color: '#F5F5F5', fontFamily: B, fontSize: 17, letterSpacing: 1, cursor: 'pointer', boxShadow: '0 6px 20px rgba(200,32,42,0.3)' }}>NEXT STEP →</button>
                  : <button onClick={async () => {
                      if (!validateSection(activeSection)) return
                      try {
                        const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
                        const token = u.token
                        if (token) {
                          // Convert height from feet/inches select to cm
                          const heightStr = form.height || (form as any).height_cm || ''
                          let finalHeightCm: string | undefined
                          const feetInches = heightStr.match(/(\d+)'(\d+)"?/)
                          if (feetInches) {
                            finalHeightCm = String(Math.round(parseInt(feetInches[1]) * 30.48 + parseInt(feetInches[2]) * 2.54))
                          } else {
                            const numOnly = heightStr.match(/[\d.]+/)
                            finalHeightCm = numOnly ? numOnly[0] : undefined
                          }
                          // Weight: extract number from weight string
                          const weightMatch = (form.weight || (form as any).weight_kg || '').match(/[\d.]+/)
                          const finalWeightKg = weightMatch ? weightMatch[0] : undefined
                          await fetch('/api/profile/aspirant', {
                            method:  'PUT',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({
                              first_name:    form.firstName,
                              last_name:     form.lastName,
                              title:         form.title,
                              gender:        form.gender,
                              date_of_birth: form.dob,
                              address_line1: form.addressLine1,
                              address_line2: form.addressLine2,
                              city:          form.city,
                              state:         form.state,
                              pincode:       form.pincode,
                              country:       form.country || 'India',
                              height_cm:     finalHeightCm ? parseFloat(finalHeightCm) : undefined,
                              weight_kg:     finalWeightKg ? parseFloat(finalWeightKg) : undefined,
                              hair_color:    form.hairColor,
                              eye_color:     form.eyeColor,
                              body_tone:     form.bodyTone,
                              body_type:     form.bodyType,
                              chest_size:    form.chest ? parseFloat(form.chest.match(/[\d.]+/)?.[0] || '0') || undefined : undefined,
                              waist_size:    form.waist ? parseFloat(form.waist.match(/[\d.]+/)?.[0] || '0') || undefined : undefined,
                              hip_size:      form.hip   ? parseFloat(form.hip.match(/[\d.]+/)?.[0]   || '0') || undefined : undefined,
                              shoe_size:     form.shoe  ? parseFloat(form.shoe.match(/[\d.]+/)?.[0]  || '0') || undefined : undefined,
                              about_me:      bio,
                              category:      selectedRoles[0]?.department || '',
                              role:          selectedRoles[0]?.role || '',
                              languages,
                              availability:  availableFor,
                              is_available:  availableFor.length > 0,
                              experience_level: form.experienceLevel || undefined,
                              skills: selectedSkills,
                              social_links: credits.length > 0 ? { credits } : undefined,
                            }),
                          })
                        }
                        const draft = { form, languages, availableFor, selectedRoles, bio, selectedSkills, activeSection, savedAt: new Date().toISOString(), userEmail: u.email }
                        const existing = JSON.parse(localStorage.getItem('ss_user') || '{}')
                        localStorage.setItem('ss_user', JSON.stringify({
                          ...existing,
                          name: `${form.firstName} ${form.lastName}`.trim() || existing.name || '',
                          category: selectedRoles[0]?.role || '',
                          departments: [...new Set(selectedRoles.map(r => r.department))],
                          roles: selectedRoles,
                          profileStatus: isEditMode ? 'pending_review' : 'active',
                          verifiedAt: existing.verifiedAt || new Date().toISOString(),
                        }))
                        localStorage.setItem('ss_profile_draft', JSON.stringify({ ...draft, published: true, editMode: false }))
                      } catch {}
                      if (isEditMode) {
                        router.push('/my-profile')
                      } else {
                        const eligibleRole = selectedRoles.find(r => RNR_ELIGIBLE_ROLES.includes(r.role))?.role || ''
                        router.push(`/pricing?for=aspirant${eligibleRole ? `&category=${encodeURIComponent(eligibleRole)}` : ''}`)
                      }
                    }} style={{ padding: '9px 32px', background: isEditMode ? GOLD : RED, border: 'none', borderRadius: 6, color: isEditMode ? '#000' : '#F5F5F5', fontFamily: B, fontSize: 17, letterSpacing: 1, cursor: 'pointer', boxShadow: `0 6px 20px ${isEditMode ? 'rgba(212,166,74,0.3)' : 'rgba(200,32,42,0.3)'}` }}>
                    {isEditMode ? 'SAVE CHANGES →' : 'PUBLISH PROFILE →'}
                  </button>
                }
              </div>
            </div>

            {/*Right Panel*/}
            <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {/*Profile Preview*/}
              <div style={{ background: '#0B0F14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>👁️</span><span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>Profile Preview</span></div>
                  <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 10 }}>{completion}% Complete</span>
                </div>
                <div style={{ height: 180, background: form.profilePhoto ? 'transparent' : 'linear-gradient(160deg, #1a0a0a, #0B0F14)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {form.profilePhoto ? <img src={form.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <span style={{ fontSize: 48, opacity: 0.2 }}>💤</span>}
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 2 }}>{`${form.firstName} ${form.lastName}`.trim() || 'Your Name'} {(form.firstName || form.lastName) && <span style={{ color: '#22c55e', fontSize: 14 }}>✓</span>}</div>
                  <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', marginBottom: 6 }}>Aspirant</div>
                  {/*Departments preview*/}
                  {selectedDepts.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginBottom: 6 }}>
                      {selectedDepts.map(d => (
                        <span key={d} style={{ fontFamily: M, fontSize: 14, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.25)', color: RED, padding: '2px 7px', borderRadius: 10 }}>{d}</span>
                      ))}
                    </div>
                  )}
                  {form.height && <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginBottom: 3 }}>📏 {form.height} &nbsp; âš–️ {form.weight}</div>}
                  {form.city && <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginBottom: 3 }}>📍 {form.city}{form.state ? `, ${form.state}` : ''}</div>}
                  {languages.length > 0 && <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginBottom: 10 }}>🗣️ {languages.join(', ')}</div>}
                  <button style={{ width: '100%', padding: '7px', background: 'transparent', border: `1px solid ${RED}`, borderRadius: 5, color: RED, fontFamily: B, fontSize: 14, letterSpacing: 1, cursor: 'pointer' }}>VIEW FULL PREVIEW</button>
                </div>
              </div>
              {/*Tips*/}
              <div style={{ background: '#0B0F14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}><span>📡</span><span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>Profile Tips</span></div>
                {[
                  { icon: '📸', t: 'Add a clear profile photo',  d: 'Profiles with real photos get 70% more views.'           },
                  { icon: '🎬', t: 'Upload a showreel',          d: 'A showreel increases your chances of getting noticed.'   },
                  { icon: '✅', t: 'Complete all sections',      d: 'Complete profiles are 3x more likely to be shortlisted.' },
                  { icon: '🎭', t: 'Select correct departments', d: 'Agencies search by department and role. Be accurate.'    },
                ].map(tip => (
                  <div key={tip.t} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{tip.icon}</div>
                    <div>
                      <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 2 }}>{tip.t}</div>
                      <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', lineHeight: 1.5 }}>{tip.d}</div>
                    </div>
                  </div>
                ))}
                <Link href="#" style={{ fontFamily: M, fontSize: 14, color: RED, textDecoration: 'none', fontWeight: 600 }}>View Success Stories →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}