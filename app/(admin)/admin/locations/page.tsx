'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import AdminTopnav from '@/components/layout/AdminTopnav'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { Plus, Trash2, Pencil, Search, Globe, MapPin, Building, Check } from 'lucide-react'

const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const GREEN  = '#22C55E'
const BG     = '#0D1117'
const BG2    = '#131720'
const BG3    = '#181E2A'
const BG4    = '#1C2338'
const BARLOW = "'Barlow Condensed', sans-serif"
const BEBAS  = "'Bebas Neue', sans-serif"
const LS_KEY = 'ss_location_config'
const LS_VER = 'ss_location_config_version'
const VERSION = 'v11'

const uid = () => Math.random().toString(36).slice(2, 9)

interface City    { id: string; name: string; active: boolean }
interface State   { id: string; name: string; active: boolean; cities: City[] }
interface Country { id: string; name: string; active: boolean; states: State[] }

const inp: React.CSSProperties = {
  background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
  padding: '8px 12px', color: '#fff', fontSize: 15, fontFamily: BARLOW,
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

function Toggle({ on, onClick }: { on: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <div onClick={onClick} style={{ width: 38, height: 22, borderRadius: 11, background: on ? GREEN : 'rgba(255,255,255,0.15)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
    </div>
  )
}

function AddForm({ placeholder, onAdd, onCancel }: { placeholder: string; onAdd: (name: string) => void; onCancel: () => void }) {
  const [val, setVal] = useState('')
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <input value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder} style={{ ...inp, flex: 1 }}
        onKeyDown={e => { if (e.key === 'Enter' && val.trim()) { onAdd(val.trim()); setVal('') } if (e.key === 'Escape') onCancel() }}
        autoFocus />
      <button onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal('') } }} disabled={!val.trim()}
        style={{ background: val.trim() ? RED : 'rgba(200,32,42,0.3)', border: 'none', borderRadius: 7, padding: '8px 14px', color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: val.trim() ? 'pointer' : 'not-allowed' }}>
        Add
      </button>
      <button onClick={onCancel} style={{ background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '8px 12px', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>✕</button>
    </div>
  )
}

export default function AdminLocationPage() {
  const [countries,     setCountries]     = useState<Country[]>([])
  const [loading,       setLoading]       = useState(true)
  const [flashSaved,    setFlashSaved]    = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [stateSearch,   setStateSearch]   = useState('')
  const [citySearch,    setCitySearch]    = useState('')
  const [selCountry,    setSelCountry]    = useState<string | null>(null)
  const [selState,      setSelState]      = useState<string | null>(null)
  const [addingCountry, setAddingCountry] = useState(false)
  const [addingState,   setAddingState]   = useState(false)
  const [addingCity,    setAddingCity]    = useState(false)
  const [renamingId,    setRenamingId]    = useState<string | null>(null)
  const [renameVal,     setRenameVal]     = useState('')

  // Load from locationData.json — always fresh, merge active flags from localStorage
  useEffect(() => {
    fetch('/locationData.json')
      .then(r => r.json())
      .then((defaults: any[]) => {
        const raw      = localStorage.getItem(LS_KEY)
        const savedVer = localStorage.getItem(LS_VER)
        let base: Country[]

        if (raw && savedVer === VERSION) {
          // Merge: use JSON for structure, localStorage for active flags
          const saved: Country[] = JSON.parse(raw)
          base = defaults.map(jc => {
            const sc = saved.find(s => s.name === jc.name)
            const states = (jc.states ?? []).map((js: any) => {
              const ss = sc?.states?.find((s: any) => s.name === js.name)
              const cities = (js.cities ?? []).map((jci: any) => {
                const sci = ss?.cities?.find((c: any) => c.name === jci.name)
                return { id: uid(), name: jci.name, active: sci ? sci.active : (sc?.active ?? false) }
              })
              return { id: uid(), name: js.name, active: ss ? ss.active : (sc?.active ?? false), cities }
            })
            return { id: uid(), name: jc.name, active: sc ? sc.active : false, states }
          })
        } else {
          // First load — all inactive by default
          base = defaults.map(jc => ({
            id: uid(), name: jc.name, active: false,
            states: (jc.states ?? []).map((js: any) => ({
              id: uid(), name: js.name, active: false,
              cities: (js.cities ?? []).map((jci: any) => ({ id: uid(), name: jci.name, active: false }))
            }))
          }))
        }

        const sorted = [...base].sort((a, b) => a.name.localeCompare(b.name))
        setCountries(sorted)
        localStorage.setItem(LS_KEY, JSON.stringify(sorted))
        localStorage.setItem(LS_VER, VERSION)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Save to localStorage + sync active status to locations table
  const syncToDb = (sorted: Country[]) => {
    try {
      const stored   = localStorage.getItem('ss_user')
      const token    = stored ? JSON.parse(stored).token : null
      if (!token) return
      fetch('/api/locations/sync', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body:    JSON.stringify({ config: sorted }),
      }).catch(() => {})
    } catch {}
  }

  const persist = (updater: Country[] | ((prev: Country[]) => Country[])) => {
    setCountries(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : updater
      const sorted  = [...updated].sort((a, b) => a.name.localeCompare(b.name))
      localStorage.setItem(LS_KEY, JSON.stringify(sorted))
      localStorage.setItem(LS_VER, VERSION)
      syncToDb(sorted)
      return sorted
    })
    setFlashSaved(true)
    setTimeout(() => setFlashSaved(false), 1500)
  }

  // Toggle country — activating sets ALL its states and cities active too
  const toggleCountry = (cid: string) => {
    persist(prev => prev.map(c => {
      if (c.id !== cid) return c
      const newActive = !c.active
      return {
        ...c, active: newActive,
        states: c.states.map(s => ({
          ...s, active: newActive,
          cities: s.cities.map(ci => ({ ...ci, active: newActive }))
        }))
      }
    }))
    // When activating a country, auto-select it to show its states
    if (!countries.find(c => c.id === cid)?.active) {
      setSelCountry(cid)
      setSelState(null)
    }
  }

  // Toggle state — activating sets ALL its cities active too
  const toggleState = (cid: string, sid: string) => {
    persist(prev => prev.map(c => {
      if (c.id !== cid) return c
      return {
        ...c,
        states: c.states.map(s => {
          if (s.id !== sid) return s
          const newActive = !s.active
          return { ...s, active: newActive, cities: s.cities.map(ci => ({ ...ci, active: newActive })) }
        })
      }
    }))
    // Auto-select state to show cities
    if (!countries.find(c => c.id === cid)?.states.find(s => s.id === sid)?.active) {
      setSelState(sid)
    }
  }

  // Toggle city
  const toggleCity = (cid: string, sid: string, cityId: string) => {
    persist(prev => prev.map(c => c.id !== cid ? c : {
      ...c, states: c.states.map(s => s.id !== sid ? s : {
        ...s, cities: s.cities.map(ci => ci.id !== cityId ? ci : { ...ci, active: !ci.active })
      })
    }))
  }

  // Add ops
  const addCountry = (name: string) => { persist(prev => [...prev, { id: uid(), name, active: true, states: [] }]); setAddingCountry(false) }
  const addState   = (cid: string, name: string) => { persist(prev => prev.map(c => c.id !== cid ? c : { ...c, states: [...c.states, { id: uid(), name, active: true, cities: [] }] })); setAddingState(false) }
  const addCity    = (cid: string, sid: string, name: string) => { persist(prev => prev.map(c => c.id !== cid ? c : { ...c, states: c.states.map(s => s.id !== sid ? s : { ...s, cities: [...s.cities, { id: uid(), name, active: true }] }) })); setAddingCity(false) }

  // Delete ops
  const deleteCountry = (cid: string) => { if (selCountry === cid) { setSelCountry(null); setSelState(null) } persist(prev => prev.filter(c => c.id !== cid)) }
  const deleteState   = (cid: string, sid: string) => { if (selState === sid) setSelState(null); persist(prev => prev.map(c => c.id !== cid ? c : { ...c, states: c.states.filter(s => s.id !== sid) })) }
  const deleteCity    = (cid: string, sid: string, cityId: string) => persist(prev => prev.map(c => c.id !== cid ? c : { ...c, states: c.states.map(s => s.id !== sid ? s : { ...s, cities: s.cities.filter(ci => ci.id !== cityId) }) }))

  // Rename ops
  const renameCountry = (cid: string, name: string) => persist(prev => prev.map(c => c.id !== cid ? c : { ...c, name }))
  const renameState   = (cid: string, sid: string, name: string) => persist(prev => prev.map(c => c.id !== cid ? c : { ...c, states: c.states.map(s => s.id !== sid ? s : { ...s, name }) }))
  const renameCity    = (cid: string, sid: string, cityId: string, name: string) => persist(prev => prev.map(c => c.id !== cid ? c : { ...c, states: c.states.map(s => s.id !== sid ? s : { ...s, cities: s.cities.map(ci => ci.id !== cityId ? ci : { ...ci, name }) }) }))

  // Derived
  const selectedCountry = countries.find(c => c.id === selCountry) ?? null
  const selectedState   = selectedCountry?.states.find(s => s.id === selState) ?? null

  // States column: all states from ALL active countries
  const activeCountries  = countries.filter(c => c.active)
  const allActiveStates  = activeCountries.flatMap(c => c.states.map(s => ({ ...s, countryId: c.id, countryName: c.name })))
  const displayedStates  = selCountry
    ? (selectedCountry?.states ?? []).map(s => ({ ...s, countryId: selCountry, countryName: selectedCountry?.name ?? '' }))
    : allActiveStates

  // Cities column: all cities from ALL active states of selected country (or selected state)
  const allActiveCities = selectedCountry
    ? selectedCountry.states.filter(s => s.active).flatMap(s => s.cities.map(ci => ({ ...ci, stateId: s.id, stateName: s.name })))
    : []
  const displayedCities = selState
    ? (selectedState?.cities ?? []).map(ci => ({ ...ci, stateId: selState, stateName: selectedState?.name ?? '' }))
    : allActiveCities

  const filteredCountries = countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
  const filteredStates    = displayedStates.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()))
  const filteredCities    = displayedCities.filter(ci => ci.name.toLowerCase().includes(citySearch.toLowerCase()))

  // Stats
  const totalActive   = countries.filter(c => c.active).length
  const totalStates   = countries.reduce((a, c) => a + c.states.length, 0)
  const activeStates  = countries.reduce((a, c) => a + c.states.filter(s => s.active).length, 0)
  const totalCities   = countries.reduce((a, c) => a + c.states.reduce((b, s) => b + s.cities.length, 0), 0)
  const activeCities  = countries.reduce((a, c) => a + c.states.reduce((b, s) => b + s.cities.filter(ci => ci.active).length, 0), 0)

  const colStyle: React.CSSProperties = {
    background: BG2, border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1,
  }
  const colHeaderStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: BG3, flexShrink: 0,
  }
  const listStyle: React.CSSProperties = {
    padding: '10px 12px', display: 'flex', flexDirection: 'column',
    gap: 5, overflowY: 'auto', flex: 1, scrollbarWidth: 'none',
  }

  const RowItem = ({ id, label, active, onToggle, onRename, onDelete, onSelect, selected, badge }: {
    id: string; label: string; active: boolean
    onToggle: (e: React.MouseEvent) => void
    onRename: (v: string) => void
    onDelete: (e: React.MouseEvent) => void
    onSelect?: () => void; selected?: boolean; badge?: string
  }) => {
    const isRenaming = renamingId === id
    return (
      <div onClick={onSelect}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, cursor: onSelect ? 'pointer' : 'default', background: selected ? 'rgba(212,166,74,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selected ? 'rgba(212,166,74,0.3)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.15s' }}
        onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
      >
        <Toggle on={active} onClick={e => { e.stopPropagation(); onToggle(e) }} />
        {isRenaming ? (
          <input value={renameVal} onChange={e => setRenameVal(e.target.value)} autoFocus
            style={{ ...inp, flex: 1, padding: '3px 8px', fontSize: 13 }}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => { if (e.key === 'Enter') { onRename(renameVal); setRenamingId(null) } if (e.key === 'Escape') setRenamingId(null) }} />
        ) : (
          <span style={{ flex: 1, fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,0.3)' }}>{label}</span>
        )}
        {badge !== undefined && (
          <span style={{ fontSize: 12, fontFamily: BARLOW, color: 'rgba(255,255,255,0.3)', background: BG4, borderRadius: 10, padding: '1px 7px', flexShrink: 0 }}>{badge}</span>
        )}
        <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
          <button onClick={() => { setRenamingId(id); setRenameVal(label) }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4, borderRadius: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}><Pencil size={12} /></button>
          <button onClick={onDelete}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4, borderRadius: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = RED}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}><Trash2 size={12} /></button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AdminTopnav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar onCollapse={() => {}} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 2 }}>LOCATION MANAGEMENT</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                Toggle countries on to activate all their states and cities automatically
              </div>
            </div>
            {flashSaved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, color: GREEN, fontSize: 14, fontFamily: BARLOW }}>
                <Check size={14} /> Saved
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { label: 'Countries', value: countries.length, sub: `${totalActive} active`,     icon: <Globe size={18} />,    color: GOLD  },
              { label: 'States',    value: totalStates,      sub: `${activeStates} active`,    icon: <MapPin size={18} />,   color: '#3B82F6' },
              { label: 'Cities',    value: totalCities,      sub: `${activeCities} active`,    icon: <Building size={18} />, color: '#8B5CF6' },
              { label: 'Active',    value: totalActive + activeStates + activeCities, sub: 'total active items', icon: <Check size={18} />, color: GREEN },
            ].map(s => (
              <div key={s.label} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1, lineHeight: 1, color: '#F5F5F5' }}>{s.value.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label} · {s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Info banner */}
          <div style={{ background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 8, padding: '10px 16px', fontSize: 14, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: GOLD, fontSize: 16 }}>ℹ</span>
            <span>
              <strong style={{ color: GOLD }}>Toggle a country ON</strong> to automatically activate all its states and cities.
              Click a country to view its states. Click a state to view its cities.
              You can then toggle individual states or cities off if needed.
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
              <div style={{ width: 28, height: 28, border: `2px solid ${GOLD}20`, borderTop: `2px solid ${GOLD}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>

              {/* ── COUNTRIES ── */}
              <div style={colStyle}>
                <div style={colHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe size={16} color={GOLD} />
                    <span style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1 }}>COUNTRIES</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{totalActive} active</span>
                  </div>
                  <button onClick={() => setAddingCountry(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 6, padding: '4px 10px', color: RED, fontSize: 13, fontFamily: BARLOW, cursor: 'pointer' }}>
                    <Plus size={12} /> Add
                  </button>
                </div>
                <div style={{ padding: '8px 12px', flexShrink: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input value={countrySearch} onChange={e => setCountrySearch(e.target.value)} placeholder="Search countries..." style={{ ...inp, paddingLeft: 30, fontSize: 13 }} />
                  </div>
                </div>
                <div style={listStyle}>
                  {addingCountry && <AddForm placeholder="Country name..." onAdd={addCountry} onCancel={() => setAddingCountry(false)} />}
                  {filteredCountries.map(c => (
                    <RowItem key={c.id} id={c.id} label={c.name} active={c.active}
                      onToggle={e => { e.stopPropagation(); toggleCountry(c.id) }}
                      onRename={v => renameCountry(c.id, v)}
                      onDelete={e => { e.stopPropagation(); if (confirm(`Delete ${c.name}?`)) deleteCountry(c.id) }}
                      onSelect={() => { setSelCountry(selCountry === c.id ? null : c.id); setSelState(null) }}
                      selected={selCountry === c.id}
                      badge={c.states.filter(s => s.active).length + '/' + c.states.length}
                    />
                  ))}
                  {filteredCountries.length === 0 && !addingCountry && (
                    <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>No countries found</div>
                  )}
                </div>
              </div>

              {/* ── STATES ── */}
              <div style={colStyle}>
                <div style={colHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={16} color={GOLD} />
                    <span style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1 }}>
                      {selCountry ? `${selectedCountry?.name} — STATES` : 'ALL ACTIVE STATES'}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{filteredStates.filter(s => s.active).length} active</span>
                  </div>
                  {selCountry && (
                    <button onClick={() => setAddingState(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 6, padding: '4px 10px', color: RED, fontSize: 13, fontFamily: BARLOW, cursor: 'pointer' }}>
                      <Plus size={12} /> Add
                    </button>
                  )}
                </div>
                <div style={{ padding: '8px 12px', flexShrink: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input value={stateSearch} onChange={e => setStateSearch(e.target.value)} placeholder="Search states..." style={{ ...inp, paddingLeft: 30, fontSize: 13 }} />
                  </div>
                </div>
                <div style={listStyle}>
                  {!selCountry && activeCountries.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>← Toggle a country on to see states</div>
                  )}
                  {addingState && selCountry && <AddForm placeholder="State / Province name..." onAdd={name => addState(selCountry, name)} onCancel={() => setAddingState(false)} />}
                  {filteredStates.map(s => (
                    <RowItem key={s.id} id={s.id} label={s.name} active={s.active}
                      onToggle={e => { e.stopPropagation(); toggleState(s.countryId, s.id) }}
                      onRename={v => renameState(s.countryId, s.id, v)}
                      onDelete={e => { e.stopPropagation(); if (confirm(`Delete ${s.name}?`)) deleteState(s.countryId, s.id) }}
                      onSelect={() => { setSelCountry(s.countryId); setSelState(selState === s.id ? null : s.id) }}
                      selected={selState === s.id}
                      badge={s.cities.filter(ci => ci.active).length + '/' + s.cities.length}
                    />
                  ))}
                  {filteredStates.length === 0 && !addingState && activeCountries.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>No states found</div>
                  )}
                </div>
              </div>

              {/* ── CITIES ── */}
              <div style={colStyle}>
                <div style={colHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building size={16} color={GOLD} />
                    <span style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1 }}>
                      {selState ? `${selectedState?.name} — CITIES` : selCountry ? `${selectedCountry?.name} — ALL CITIES` : 'ALL ACTIVE CITIES'}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{filteredCities.filter(ci => ci.active).length} active</span>
                  </div>
                  {selState && (
                    <button onClick={() => setAddingCity(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 6, padding: '4px 10px', color: RED, fontSize: 13, fontFamily: BARLOW, cursor: 'pointer' }}>
                      <Plus size={12} /> Add
                    </button>
                  )}
                </div>
                <div style={{ padding: '8px 12px', flexShrink: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input value={citySearch} onChange={e => setCitySearch(e.target.value)} placeholder="Search cities..." style={{ ...inp, paddingLeft: 30, fontSize: 13 }} />
                  </div>
                </div>
                <div style={listStyle}>
                  {!selCountry && activeCountries.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 0', fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>← Toggle a country on to see cities</div>
                  )}
                  {selCountry && filteredCities.length === 0 && !addingCity && (
                    <div style={{ textAlign: 'center', padding: '32px 0', fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>No cities found</div>
                  )}
                  {addingCity && selState && selCountry && <AddForm placeholder="City name..." onAdd={name => addCity(selCountry, selState, name)} onCancel={() => setAddingCity(false)} />}
                  {filteredCities.map(ci => (
                    <RowItem key={ci.id} id={ci.id} label={ci.name} active={ci.active}
                      onToggle={e => { e.stopPropagation(); toggleCity(ci.stateId ? (countries.find(c => c.states.some(s => s.id === ci.stateId))?.id ?? '') : '', ci.stateId ?? '', ci.id) }}
                      onRename={v => renameCity(ci.stateId ? (countries.find(c => c.states.some(s => s.id === ci.stateId))?.id ?? '') : '', ci.stateId ?? '', ci.id, v)}
                      onDelete={e => { e.stopPropagation(); if (confirm(`Delete ${ci.name}?`)) deleteCity(ci.stateId ? (countries.find(c => c.states.some(s => s.id === ci.stateId))?.id ?? '') : '', ci.stateId ?? '', ci.id) }}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}