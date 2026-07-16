'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Trash2, Pencil, Check, X, Search,
  ChevronRight, Globe, MapPin, Building, Save,
  ToggleLeft, ToggleRight, AlertCircle, RotateCcw,
} from 'lucide-react'

/* ── Tokens ── */
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const GREEN  = '#22C55E'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BG4    = '#1C2030'
const BARLOW = "'Barlow Condensed', sans-serif"
const BEBAS  = "'Bebas Neue', sans-serif"

export const LS_KEY = 'ss_location_config'

/* ── Types ── */
export interface City    { id: string; name: string; active: boolean }
export interface State   { id: string; name: string; active: boolean; cities: City[] }
export interface Country { id: string; name: string; active: boolean; states: State[] }

/* ── Default data ── */
const DEFAULT_COUNTRIES: Country[] = [
  {
    id: 'in', name: 'India', active: true,
    states: [
      { id: 'mh', name: 'Maharashtra', active: true, cities: [
        { id: 'mh-mum', name: 'Mumbai',     active: true  },
        { id: 'mh-pun', name: 'Pune',       active: true  },
        { id: 'mh-nag', name: 'Nagpur',     active: true  },
        { id: 'mh-nas', name: 'Nashik',     active: true  },
        { id: 'mh-aur', name: 'Aurangabad', active: true  },
      ]},
      { id: 'dl', name: 'Delhi', active: true, cities: [
        { id: 'dl-ndl', name: 'New Delhi',  active: true  },
        { id: 'dl-noi', name: 'Noida',      active: true  },
        { id: 'dl-gur', name: 'Gurugram',   active: true  },
        { id: 'dl-fbd', name: 'Faridabad',  active: true  },
      ]},
      { id: 'ka', name: 'Karnataka', active: true, cities: [
        { id: 'ka-blr', name: 'Bengaluru',  active: true  },
        { id: 'ka-mys', name: 'Mysuru',     active: true  },
        { id: 'ka-hub', name: 'Hubballi',   active: true  },
      ]},
      { id: 'tn', name: 'Tamil Nadu', active: true, cities: [
        { id: 'tn-che', name: 'Chennai',    active: true  },
        { id: 'tn-cbe', name: 'Coimbatore', active: true  },
        { id: 'tn-mad', name: 'Madurai',    active: true  },
      ]},
      { id: 'ts', name: 'Telangana', active: true, cities: [
        { id: 'ts-hyd', name: 'Hyderabad',  active: true  },
        { id: 'ts-wgl', name: 'Warangal',   active: true  },
      ]},
      { id: 'gj', name: 'Gujarat', active: true, cities: [
        { id: 'gj-ahm', name: 'Ahmedabad',  active: true  },
        { id: 'gj-sur', name: 'Surat',      active: true  },
        { id: 'gj-vad', name: 'Vadodara',   active: true  },
      ]},
      { id: 'rj', name: 'Rajasthan', active: true, cities: [
        { id: 'rj-jai', name: 'Jaipur',     active: true  },
        { id: 'rj-jod', name: 'Jodhpur',    active: true  },
        { id: 'rj-uda', name: 'Udaipur',    active: true  },
      ]},
      { id: 'up', name: 'Uttar Pradesh', active: true, cities: [
        { id: 'up-lko', name: 'Lucknow',    active: true  },
        { id: 'up-kan', name: 'Kanpur',     active: true  },
        { id: 'up-agr', name: 'Agra',       active: true  },
        { id: 'up-var', name: 'Varanasi',   active: true  },
      ]},
      { id: 'wb', name: 'West Bengal', active: true, cities: [
        { id: 'wb-kol', name: 'Kolkata',    active: true  },
        { id: 'wb-hoo', name: 'Howrah',     active: true  },
      ]},
      { id: 'pb', name: 'Punjab', active: true, cities: [
        { id: 'pb-asr', name: 'Amritsar',   active: true  },
        { id: 'pb-ldh', name: 'Ludhiana',   active: true  },
        { id: 'pb-chd', name: 'Chandigarh', active: true  },
      ]},
      { id: 'kl', name: 'Kerala', active: true, cities: [
        { id: 'kl-tvm', name: 'Thiruvananthapuram', active: true },
        { id: 'kl-koc', name: 'Kochi',      active: true  },
        { id: 'kl-kzd', name: 'Kozhikode',  active: true  },
      ]},
      { id: 'br', name: 'Bihar', active: true, cities: [
        { id: 'br-pat', name: 'Patna',      active: true  },
        { id: 'br-gay', name: 'Gaya',       active: true  },
      ]},
      { id: 'mp', name: 'Madhya Pradesh', active: true, cities: [
        { id: 'mp-bho', name: 'Bhopal',     active: true  },
        { id: 'mp-ind', name: 'Indore',     active: true  },
        { id: 'mp-gwa', name: 'Gwalior',    active: true  },
      ]},
      { id: 'ga', name: 'Goa', active: true, cities: [
        { id: 'ga-pan', name: 'Panaji',     active: true  },
        { id: 'ga-mar', name: 'Margao',     active: true  },
      ]},
    ],
  },
  {
    id: 'us', name: 'USA', active: true,
    states: [
      { id: 'us-ca', name: 'California', active: true, cities: [
        { id: 'us-la',  name: 'Los Angeles',   active: true },
        { id: 'us-sf',  name: 'San Francisco', active: true },
      ]},
      { id: 'us-ny', name: 'New York', active: true, cities: [
        { id: 'us-nyc', name: 'New York City', active: true },
      ]},
    ],
  },
  {
    id: 'uk', name: 'UK', active: true,
    states: [
      { id: 'uk-eng', name: 'England', active: true, cities: [
        { id: 'uk-lon', name: 'London',     active: true },
        { id: 'uk-man', name: 'Manchester', active: true },
      ]},
    ],
  },
  {
    id: 'au', name: 'Australia', active: true,
    states: [
      { id: 'au-nsw', name: 'New South Wales', active: true, cities: [
        { id: 'au-syd', name: 'Sydney',    active: true },
      ]},
      { id: 'au-vic', name: 'Victoria', active: true, cities: [
        { id: 'au-mel', name: 'Melbourne', active: true },
      ]},
    ],
  },
  {
    id: 'ca', name: 'Canada', active: true,
    states: [
      { id: 'ca-on', name: 'Ontario', active: true, cities: [
        { id: 'ca-tor', name: 'Toronto', active: true },
      ]},
      { id: 'ca-bc', name: 'British Columbia', active: true, cities: [
        { id: 'ca-van', name: 'Vancouver', active: true },
      ]},
    ],
  },
  {
    id: 'ae', name: 'UAE', active: true,
    states: [
      { id: 'ae-dxb', name: 'Dubai', active: true, cities: [
        { id: 'ae-dxb-c', name: 'Dubai City', active: true },
      ]},
      { id: 'ae-auh', name: 'Abu Dhabi', active: true, cities: [
        { id: 'ae-auh-c', name: 'Abu Dhabi City', active: true },
      ]},
    ],
  },
]

/* ── Helpers ── */
const uid = () => Math.random().toString(36).slice(2, 9)

/* ── Shared styles ── */
const inp: React.CSSProperties = {
  background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
  padding: '8px 12px', color: '#fff', fontSize: 15, fontFamily: BARLOW,
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

/* ── Toggle pill ── */
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ width: 38, height: 22, borderRadius: 11, background: on ? GREEN : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
    </div>
  )
}

/* ── Inline add form ── */
function AddForm({ placeholder, onAdd, onCancel }: { placeholder: string; onAdd: (name: string) => void; onCancel: () => void }) {
  const [val, setVal] = useState('')
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <input value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder} style={{ ...inp, flex: 1 }}
        onKeyDown={e => { if (e.key === 'Enter' && val.trim()) { onAdd(val.trim()); setVal('') } if (e.key === 'Escape') onCancel() }}
        autoFocus
      />
      <button onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal('') } }} disabled={!val.trim()}
        style={{ background: val.trim() ? RED : 'rgba(200,32,42,0.3)', border: 'none', borderRadius: 7, padding: '8px 14px', color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: val.trim() ? 'pointer' : 'not-allowed' }}>
        Add
      </button>
      <button onClick={onCancel} style={{ background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '8px 12px', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>
        ✕
      </button>
    </div>
  )
}

/* ══ MAIN PAGE ══ */
export default function AdminLocationPage() {
  const router = useRouter()
  const [countries, setCountries] = useState<Country[]>(DEFAULT_COUNTRIES)
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')

  // Drill-down selection
  const [selCountry, setSelCountry] = useState<string | null>(null)
  const [selState,   setSelState]   = useState<string | null>(null)

  // Add forms
  const [addingCountry, setAddingCountry] = useState(false)
  const [addingState,   setAddingState]   = useState(false)
  const [addingCity,    setAddingCity]    = useState(false)

  // Rename editing
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameVal,  setRenameVal]  = useState('')

  // ── FIX: seed localStorage with defaults if nothing saved yet ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        setCountries(JSON.parse(raw))
      } else {
        localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_COUNTRIES))
      }
    } catch {}
  }, [])

  const persist = (updated: Country[]) => {
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
    setCountries(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // ── FIX: reset now saves defaults to localStorage instead of removing key ──
  const resetDefaults = () => {
    localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_COUNTRIES))
    setCountries(DEFAULT_COUNTRIES)
    setSelCountry(null); setSelState(null)
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  /* ── Country ops ── */
  const addCountry = (name: string) => {
    persist([...countries, { id: uid(), name, active: true, states: [] }])
    setAddingCountry(false)
  }
  const toggleCountry = (cid: string) =>
    persist(countries.map(c => c.id === cid ? { ...c, active: !c.active } : c))
  const renameCountry = (cid: string, name: string) =>
    persist(countries.map(c => c.id === cid ? { ...c, name } : c))
  const deleteCountry = (cid: string) => {
    if (selCountry === cid) { setSelCountry(null); setSelState(null) }
    persist(countries.filter(c => c.id !== cid))
  }

  /* ── State ops ── */
  const addState = (cid: string, name: string) => {
    persist(countries.map(c => c.id === cid ? { ...c, states: [...c.states, { id: uid(), name, active: true, cities: [] }] } : c))
    setAddingState(false)
  }
  const toggleState = (cid: string, sid: string) =>
    persist(countries.map(c => c.id === cid ? { ...c, states: c.states.map(s => s.id === sid ? { ...s, active: !s.active } : s) } : c))
  const renameState = (cid: string, sid: string, name: string) =>
    persist(countries.map(c => c.id === cid ? { ...c, states: c.states.map(s => s.id === sid ? { ...s, name } : s) } : c))
  const deleteState = (cid: string, sid: string) => {
    if (selState === sid) setSelState(null)
    persist(countries.map(c => c.id === cid ? { ...c, states: c.states.filter(s => s.id !== sid) } : c))
  }

  /* ── City ops ── */
  const addCity = (cid: string, sid: string, name: string) => {
    persist(countries.map(c => c.id === cid ? { ...c, states: c.states.map(s => s.id === sid ? { ...s, cities: [...s.cities, { id: uid(), name, active: true }] } : s) } : c))
    setAddingCity(false)
  }
  const toggleCity = (cid: string, sid: string, cityId: string) =>
    persist(countries.map(c => c.id === cid ? { ...c, states: c.states.map(s => s.id === sid ? { ...s, cities: s.cities.map(ci => ci.id === cityId ? { ...ci, active: !ci.active } : ci) } : s) } : c))
  const renameCity = (cid: string, sid: string, cityId: string, name: string) =>
    persist(countries.map(c => c.id === cid ? { ...c, states: c.states.map(s => s.id === sid ? { ...s, cities: s.cities.map(ci => ci.id === cityId ? { ...ci, name } : ci) } : s) } : c))
  const deleteCity = (cid: string, sid: string, cityId: string) =>
    persist(countries.map(c => c.id === cid ? { ...c, states: c.states.map(s => s.id === sid ? { ...s, cities: s.cities.filter(ci => ci.id !== cityId) } : s) } : c))

  const selectedCountry = countries.find(c => c.id === selCountry) ?? null
  const selectedState   = selectedCountry?.states.find(s => s.id === selState) ?? null

  const filteredCountries = countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  /* ── Row component ── */
  const Row = ({ label, active, onToggle, onRename, onDelete, onSelect, selected, count }: {
    label: string; active: boolean; onToggle: () => void; onRename: (v: string) => void
    onDelete: () => void; onSelect?: () => void; selected?: boolean; count?: number
  }) => {
    const isRenaming = renamingId === label + '_' + active
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: selected ? 'rgba(200,32,42,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selected ? 'rgba(200,32,42,0.25)' : 'rgba(255,255,255,0.06)'}`, cursor: onSelect ? 'pointer' : 'default' }}
        onClick={onSelect}
      >
        <Toggle on={active} onClick={e => { (e as any).stopPropagation?.(); onToggle() }} />
        {isRenaming ? (
          <input value={renameVal} onChange={e => setRenameVal(e.target.value)} autoFocus
            style={{ ...inp, flex: 1, padding: '4px 8px', fontSize: 14 }}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Enter') { onRename(renameVal); setRenamingId(null) }
              if (e.key === 'Escape') setRenamingId(null)
            }}
          />
        ) : (
          <span style={{ flex: 1, fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,0.35)', textDecoration: active ? 'none' : 'line-through' }}>{label}</span>
        )}
        {count !== undefined && (
          <span style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.3)', background: BG4, borderRadius: 10, padding: '1px 8px' }}>{count}</span>
        )}
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={() => { setRenamingId(label + '_' + active); setRenameVal(label) }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 4, borderRadius: 5 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
          ><Pencil size={13} /></button>
          <button onClick={onDelete}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 4, borderRadius: 5 }}
            onMouseEnter={e => (e.currentTarget.style.color = RED)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
          ><Trash2 size={13} /></button>
        </div>
        {onSelect && <ChevronRight size={14} color={selected ? RED : 'rgba(255,255,255,0.2)'} />}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* Topnav */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer', padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >← Back</button>
        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 2 }}>LOCATION <span style={{ color: RED }}>MANAGEMENT</span></div>
        <div style={{ flex: 1 }} />
        {saved && <span style={{ fontSize: 15, fontFamily: BARLOW, color: GREEN, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} /> Saved</span>}
        <button onClick={resetDefaults} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer' }}>
          <RotateCcw size={14} /> Reset Defaults
        </button>
      </header>

      <div style={{ padding: '24px 28px 48px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Info banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: 'rgba(212,166,74,0.07)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 10, marginBottom: 24 }}>
          <AlertCircle size={16} color={GOLD} />
          <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.6)' }}>
            Deactivated locations are hidden from all dropdowns in the app. Changes are saved immediately to your browser.
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { icon: <Globe size={18} color={GOLD} />, label: 'Countries', val: countries.length, active: countries.filter(c => c.active).length },
            { icon: <MapPin size={18} color={GOLD} />, label: 'States', val: countries.reduce((a, c) => a + c.states.length, 0), active: countries.reduce((a, c) => a + c.states.filter(s => s.active).length, 0) },
            { icon: <Building size={18} color={GOLD} />, label: 'Cities', val: countries.reduce((a, c) => a + c.states.reduce((b, s) => b + s.cities.length, 0), 0), active: countries.reduce((a, c) => a + c.states.reduce((b, s) => b + s.cities.filter(ci => ci.active).length, 0), 0) },
            { icon: <Check size={18} color={GREEN} />, label: 'Active Locations', val: countries.reduce((a, c) => a + c.states.reduce((b, s) => b + s.cities.filter(ci => ci.active).length, 0), 0) + countries.reduce((a, c) => a + c.states.filter(s => s.active).length, 0) + countries.filter(c => c.active).length, active: null },
          ].map(stat => (
            <div key={stat.label} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>{stat.icon}<span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)' }}>{stat.label}</span></div>
              <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#fff', lineHeight: 1 }}>{stat.val}</div>
              {stat.active !== null && <div style={{ fontSize: 13, fontFamily: BARLOW, color: GREEN, marginTop: 3 }}>{stat.active} active</div>}
            </div>
          ))}
        </div>

        {/* Three-column drill-down */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, alignItems: 'start' }}>

          {/* Countries column */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: BG3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={16} color={GOLD} />
                <span style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1 }}>Countries</span>
                <span style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>{countries.filter(c => c.active).length}/{countries.length}</span>
              </div>
              <button onClick={() => setAddingCountry(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 6, padding: '5px 10px', color: RED, fontSize: 13, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Plus size={12} /> Add
              </button>
            </div>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, borderRadius: 7, padding: '7px 10px' }}>
                <Search size={13} color="rgba(255,255,255,0.35)" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search countries..." style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: BARLOW, flex: 1 }} />
              </div>
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 480, overflowY: 'auto' }}>
              {filteredCountries.map(c => (
                <Row key={c.id} label={c.name} active={c.active}
                  onToggle={() => toggleCountry(c.id)}
                  onRename={v => renameCountry(c.id, v)}
                  onDelete={() => deleteCountry(c.id)}
                  onSelect={() => { setSelCountry(c.id); setSelState(null) }}
                  selected={selCountry === c.id}
                  count={c.states.length}
                />
              ))}
              {addingCountry && (
                <AddForm placeholder="Country name..." onAdd={addCountry} onCancel={() => setAddingCountry(false)} />
              )}
              {filteredCountries.length === 0 && !addingCountry && (
                <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)' }}>No countries found</div>
              )}
            </div>
          </div>

          {/* States column */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: BG3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} color={GOLD} />
                <span style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1 }}>
                  {selectedCountry ? `${selectedCountry.name} — States` : 'States'}
                </span>
                {selectedCountry && <span style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>{selectedCountry.states.filter(s => s.active).length}/{selectedCountry.states.length}</span>}
              </div>
              {selectedCountry && (
                <button onClick={() => setAddingState(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 6, padding: '5px 10px', color: RED, fontSize: 13, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <Plus size={12} /> Add
                </button>
              )}
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 530, overflowY: 'auto' }}>
              {!selectedCountry ? (
                <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)' }}>← Select a country</div>
              ) : (
                <>
                  {selectedCountry.states.map(s => (
                    <Row key={s.id} label={s.name} active={s.active}
                      onToggle={() => toggleState(selectedCountry.id, s.id)}
                      onRename={v => renameState(selectedCountry.id, s.id, v)}
                      onDelete={() => deleteState(selectedCountry.id, s.id)}
                      onSelect={() => setSelState(s.id)}
                      selected={selState === s.id}
                      count={s.cities.length}
                    />
                  ))}
                  {addingState && (
                    <AddForm placeholder="State / Province name..." onAdd={name => addState(selectedCountry.id, name)} onCancel={() => setAddingState(false)} />
                  )}
                  {selectedCountry.states.length === 0 && !addingState && (
                    <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)' }}>No states yet — click Add</div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Cities column */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: BG3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building size={16} color={GOLD} />
                <span style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1 }}>
                  {selectedState ? `${selectedState.name} — Cities` : 'Cities'}
                </span>
                {selectedState && <span style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>{selectedState.cities.filter(c => c.active).length}/{selectedState.cities.length}</span>}
              </div>
              {selectedState && (
                <button onClick={() => setAddingCity(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 6, padding: '5px 10px', color: RED, fontSize: 13, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <Plus size={12} /> Add
                </button>
              )}
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 530, overflowY: 'auto' }}>
              {!selectedState ? (
                <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)' }}>← Select a state</div>
              ) : (
                <>
                  {selectedState.cities.map(ci => (
                    <Row key={ci.id} label={ci.name} active={ci.active}
                      onToggle={() => toggleCity(selectedCountry!.id, selectedState.id, ci.id)}
                      onRename={v => renameCity(selectedCountry!.id, selectedState.id, ci.id, v)}
                      onDelete={() => deleteCity(selectedCountry!.id, selectedState.id, ci.id)}
                    />
                  ))}
                  {addingCity && (
                    <AddForm placeholder="City name..." onAdd={name => addCity(selectedCountry!.id, selectedState.id, name)} onCancel={() => setAddingCity(false)} />
                  )}
                  {selectedState.cities.length === 0 && !addingCity && (
                    <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)' }}>No cities yet — click Add</div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}