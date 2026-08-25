'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminTopnav from '@/components/layout/AdminTopnav'
import AdminSidebar from '@/components/layout/AdminSidebar'
import {
  Languages, ListChecks, Briefcase, Users,
  Plus, Search, ToggleLeft, ToggleRight,
  Save, X, Edit2, ChevronRight, RefreshCw,
  CheckCircle, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react'

const BG        = '#0D1117'
const BG2       = '#131720'
const BG3       = '#181E2A'
const BG4       = '#1C2338'
const GOLD      = '#D4A64A'
const GOLD_DIM  = 'rgba(212,166,74,0.12)'
const GOLD_BDR  = 'rgba(212,166,74,0.22)'
const GREEN     = '#22C55E'
const RED       = '#C8202A'
const BLUE      = '#3B82F6'
const PURPLE    = '#8B5CF6'
const BEBAS     = "'Bebas Neue', sans-serif"
const BARLOW    = "'Barlow Condensed', sans-serif"
const BORDER    = '#252C3A'
const TEXT_MUTED = '#8B93A3'

const TABS = [
  { key: 'languages',    label: 'Languages Known',   icon: Languages  },
  { key: 'available',    label: 'Available For',      icon: ListChecks },
  { key: 'departments',  label: 'Departments & Roles',icon: Briefcase  },
  { key: 'skills',       label: 'Skills',             icon: Users      },
]

type Language = {
  id: string; name: string; native_name: string | null
  code: string; is_active: boolean; is_default: boolean
}
type SimpleItem = { id: string; name: string; is_active: boolean }
type Role = { id: string; name: string; is_active: boolean }
type Department = { id: string; name: string; is_active: boolean; roles: Role[] }

function getHeaders(): Record<string, string> {
  try {
    // Try ss_user first (admin session)
    const raw = localStorage.getItem('ss_user')
    if (raw) {
      const u = JSON.parse(raw)
      const token = u.token ?? u.access_token ?? ''
      if (token) return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
    }
    // Fallback: find Supabase auth token (sb-*-auth-token)
    const sbKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    if (sbKey) {
      const sbRaw = localStorage.getItem(sbKey)
      const sbData = sbRaw ? JSON.parse(sbRaw) : null
      const token = sbData?.access_token ?? ''
      if (token) return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
    }
    return { 'Content-Type': 'application/json' }
  } catch { return { 'Content-Type': 'application/json' } }
}

function Toast({ msg, type, onDone }: { msg: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 400,
      background: type === 'success' ? GREEN : RED, color: '#000',
      padding: '12px 20px', borderRadius: 10, fontFamily: BARLOW,
      fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  )
}

function Badge({ active }: { active: boolean }) {
  return (
    <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
      background: active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      color: active ? GREEN : RED, border: '1px solid ' + (active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)') }}>
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

function SectionHeader({ title, count, onAdd }: { title: string; count: number; onAdd: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <div style={{ fontFamily: BEBAS, fontSize: 20, color: '#F5F5F5', letterSpacing: 0.5 }}>{title}</div>
        <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 2 }}>{count} items total</div>
      </div>
      <button onClick={onAdd}
        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
          background: GOLD, border: 'none', borderRadius: 7, color: BG,
          fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
        <Plus size={14} /> Add New
      </button>
    </div>
  )
}

// ─── LANGUAGES TAB ──────────────────────────────────────────────────────────
function LanguagesTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [items,   setItems]   = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [newName, setNewName] = useState('')
  const [newNative, setNewNative] = useState('')
  const [newCode, setNewCode] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/master-data?section=languages', { headers: getHeaders() })
      const d = await res.json()
      const langs = d?.data?.languages || []
      setItems(langs)
    } catch { showToast('Failed to load languages', 'error') }
    setLoading(false)
  }, [showToast])

  useEffect(() => { load() }, [load])

  async function toggleActive(lang: Language) {
    try {
      const res = await fetch('/api/admin/master-data', {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ section: 'languages', id: lang.id, is_active: !lang.is_active }),
      })
      if (res.ok) {
        setItems(prev => prev.map(l => l.id === lang.id ? { ...l, is_active: !l.is_active } : l))
        showToast(lang.name + (lang.is_active ? ' deactivated' : ' activated'))
      } else { showToast('Failed to update', 'error') }
    } catch { showToast('Network error', 'error') }
  }

  async function addLanguage() {
    if (!newName.trim() || !newCode.trim()) { showToast('Name and code are required', 'error'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/master-data', {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ section: 'language_add', name: newName.trim(), native_name: newNative.trim() || null, code: newCode.trim().toUpperCase() }),
      })
      const d = await res.json()
      if (res.ok) {
        setItems(prev => [...prev, d.data.language].sort((a, b) => a.name.localeCompare(b.name)))
        setModal(false); setNewName(''); setNewNative(''); setNewCode('')
        showToast('Language added successfully')
      } else { showToast(d?.error || 'Failed to add language', 'error') }
    } catch { showToast('Network error', 'error') }
    setSaving(false)
  }

  const filtered = items.filter(l => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.code.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <SectionHeader title="Languages Known" count={items.length} onAdd={() => setModal(true)} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={13} color={TEXT_MUTED} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search languages..."
            style={{ width: '100%', padding: '8px 10px 8px 30px', background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
        </div>
        <button onClick={load} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid ' + BORDER, borderRadius: 7, color: TEXT_MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: BARLOW, fontSize: 14 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: TEXT_MUTED }}>Loading...</div>
      ) : (
        <div style={{ background: BG3, border: '1px solid ' + BORDER, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '10px 16px', background: BG2, borderBottom: '1px solid ' + BORDER }}>
            {['Language', 'Native Name', 'Code', 'Default', 'Status'].map(h => (
              <div key={h} style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 700, letterSpacing: 0.5 }}>{h}</div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: TEXT_MUTED, fontSize: 15 }}>No languages found.</div>
          )}
          {filtered.map((lang, i) => (
            <div key={lang.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '12px 16px', borderBottom: i < filtered.length - 1 ? '1px solid ' + BORDER : 'none', alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 600 }}>{lang.name}</div>
              <div style={{ fontSize: 14, color: TEXT_MUTED }}>{lang.native_name || '—'}</div>
              <div style={{ fontSize: 13, color: BLUE, fontFamily: 'monospace' }}>{lang.code}</div>
              <div style={{ fontSize: 13, color: lang.is_default ? GOLD : TEXT_MUTED }}>{lang.is_default ? '★ Default' : '—'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Badge active={lang.is_active} />
                <div onClick={() => toggleActive(lang)} style={{ cursor: 'pointer', color: lang.is_active ? GREEN : TEXT_MUTED }}>
                  {lang.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: 440, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1 }}>ADD LANGUAGE</div>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {[
              { label: 'Language Name *', value: newName, set: setNewName, ph: 'e.g. Tamil' },
              { label: 'Native Name', value: newNative, set: setNewNative, ph: 'e.g. தமிழ்' },
              { label: 'Language Code *', value: newCode, set: setNewCode, ph: 'e.g. TA' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, color: TEXT_MUTED, marginBottom: 5 }}>{f.label}</label>
                <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                  style={{ width: '100%', padding: '9px 12px', background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: TEXT_MUTED, fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={addLanguage} disabled={saving} style={{ flex: 2, padding: 10, background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Adding...' : 'Add Language'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SIMPLE LIST TAB (Skills & Available For) ──────────────────────────────
function SimpleListTab({ section, title, showToast }: { section: string; title: string; showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [items,   setItems]   = useState<SimpleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [newName, setNewName] = useState('')
  const [editItem, setEditItem] = useState<SimpleItem | null>(null)
  const [editName, setEditName] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/master-data?section=' + section, { headers: getHeaders() })
      const d = await res.json()
      setItems(d?.data?.[section] || [])
    } catch { showToast('Failed to load', 'error') }
    setLoading(false)
  }, [section, showToast])

  useEffect(() => { load() }, [load])

  async function save(updated: SimpleItem[]) {
    const res = await fetch('/api/admin/master-data', {
      method: 'PUT', headers: getHeaders(),
      body: JSON.stringify({ section: section, data: updated }),
    })
    return res.ok
  }

  async function addItem() {
    if (!newName.trim()) { showToast('Name is required', 'error'); return }
    setSaving(true)
    const newItem: SimpleItem = { id: Date.now().toString(), name: newName.trim(), is_active: true }
    const updated = [...items, newItem]
    if (await save(updated)) {
      setItems(updated); setModal(false); setNewName('')
      showToast(newName.trim() + ' added successfully')
    } else { showToast('Failed to save', 'error') }
    setSaving(false)
  }

  async function toggleItem(item: SimpleItem) {
    const updated = items.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i)
    if (await save(updated)) {
      setItems(updated)
      showToast(item.name + (item.is_active ? ' deactivated' : ' activated'))
    } else { showToast('Failed to update', 'error') }
  }

  async function saveEdit() {
    if (!editName.trim() || !editItem) return
    setSaving(true)
    const updated = items.map(i => i.id === editItem.id ? { ...i, name: editName.trim() } : i)
    if (await save(updated)) {
      setItems(updated); setEditItem(null); setEditName('')
      showToast('Updated successfully')
    } else { showToast('Failed to save', 'error') }
    setSaving(false)
  }

  async function deleteItem(item: SimpleItem) {
    const updated = items.filter(i => i.id !== item.id)
    if (await save(updated)) {
      setItems(updated)
      showToast(item.name + ' deleted')
    } else { showToast('Failed to delete', 'error') }
  }

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))
  const active = items.filter(i => i.is_active).length

  return (
    <div>
      <SectionHeader title={title} count={items.length} onAdd={() => setModal(true)} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={13} color={TEXT_MUTED} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={'Search ' + title.toLowerCase() + '...'}
            style={{ width: '100%', padding: '8px 10px 8px 30px', background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
        </div>
        <span style={{ fontSize: 13, color: TEXT_MUTED }}>{active} active · {items.length - active} inactive</span>
        <button onClick={load} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid ' + BORDER, borderRadius: 7, color: TEXT_MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: BARLOW, fontSize: 14 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: TEXT_MUTED }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', padding: 40, textAlign: 'center', color: TEXT_MUTED, fontSize: 15 }}>
              No items found. Click "Add New" to get started.
            </div>
          )}
          {filtered.map(item => (
            <div key={item.id} style={{ background: BG3, border: '1px solid ' + (item.is_active ? BORDER : 'rgba(239,68,68,0.2)'), borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: item.is_active ? 1 : 0.6 }}>
              <div>
                <div style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 600 }}>{item.name}</div>
                <Badge active={item.is_active} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => { setEditItem(item); setEditName(item.name) }}
                  style={{ width: 28, height: 28, background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: GOLD }}>
                  <Edit2 size={12} />
                </button>
                <button onClick={() => deleteItem(item)}
                  style={{ width: 28, height: 28, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: RED }}>
                  <X size={12} />
                </button>
                <div onClick={() => toggleItem(item)} style={{ cursor: 'pointer', color: item.is_active ? GREEN : TEXT_MUTED }}>
                  {item.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: 420, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1 }}>ADD {title.toUpperCase()}</div>
              <button onClick={() => { setModal(false); setNewName('') }} style={{ background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <label style={{ display: 'block', fontSize: 13, color: TEXT_MUTED, marginBottom: 6 }}>Name *</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={'e.g. ' + (section === 'skills' ? 'Acting' : 'Print Ads')}
              onKeyDown={e => { if (e.key === 'Enter') addItem() }}
              style={{ width: '100%', padding: '9px 12px', background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setModal(false); setNewName('') }} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: TEXT_MUTED, fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={addItem} disabled={saving} style={{ flex: 2, padding: 10, background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: 420, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1 }}>EDIT {title.toUpperCase()}</div>
              <button onClick={() => setEditItem(null)} style={{ background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <label style={{ display: 'block', fontSize: 13, color: TEXT_MUTED, marginBottom: 6 }}>Name *</label>
            <input value={editName} onChange={e => setEditName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit() }}
              style={{ width: '100%', padding: '9px 12px', background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setEditItem(null)} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: TEXT_MUTED, fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveEdit} disabled={saving} style={{ flex: 2, padding: 10, background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── DEPARTMENTS & ROLES TAB ────────────────────────────────────────────────
function DepartmentsTab({ showToast }: { showToast: (m: string, t?: 'success' | 'error') => void }) {
  const [depts,    setDepts]    = useState<Department[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [deptModal, setDeptModal] = useState(false)
  const [roleModal, setRoleModal] = useState<string | null>(null)  // dept id
  const [newDeptName, setNewDeptName] = useState('')
  const [newRoleName, setNewRoleName] = useState('')
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [editingRole, setEditingRole] = useState<{ deptId: string; role: Role } | null>(null)
  const [editName, setEditName] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/master-data?section=departments', { headers: getHeaders() })
      const d = await res.json()
      setDepts(d?.data?.departments || [])
    } catch { showToast('Failed to load', 'error') }
    setLoading(false)
  }, [showToast])

  useEffect(() => { load() }, [load])

  async function persist(updated: Department[]) {
    const res = await fetch('/api/admin/master-data', {
      method: 'PUT', headers: getHeaders(),
      body: JSON.stringify({ section: 'departments', data: updated }),
    })
    return res.ok
  }

  async function addDept() {
    if (!newDeptName.trim()) { showToast('Department name required', 'error'); return }
    setSaving(true)
    const newDept: Department = { id: Date.now().toString(), name: newDeptName.trim(), is_active: true, roles: [] }
    const updated = [...depts, newDept]
    if (await persist(updated)) {
      setDepts(updated); setDeptModal(false); setNewDeptName('')
      showToast('Department added')
    } else { showToast('Failed to save', 'error') }
    setSaving(false)
  }

  async function toggleDept(dept: Department) {
    const updated = depts.map(d => d.id === dept.id ? { ...d, is_active: !d.is_active } : d)
    if (await persist(updated)) {
      setDepts(updated)
      showToast(dept.name + (dept.is_active ? ' deactivated' : ' activated'))
    } else { showToast('Failed to update', 'error') }
  }

  async function addRole(deptId: string) {
    if (!newRoleName.trim()) { showToast('Role name required', 'error'); return }
    setSaving(true)
    const newRole: Role = { id: Date.now().toString(), name: newRoleName.trim(), is_active: true }
    const updated = depts.map(d => d.id === deptId ? { ...d, roles: [...d.roles, newRole] } : d)
    if (await persist(updated)) {
      setDepts(updated); setRoleModal(null); setNewRoleName('')
      showToast('Role added')
    } else { showToast('Failed to save', 'error') }
    setSaving(false)
  }

  async function toggleRole(deptId: string, role: Role) {
    const updated = depts.map(d => d.id === deptId
      ? { ...d, roles: d.roles.map(r => r.id === role.id ? { ...r, is_active: !r.is_active } : r) }
      : d)
    if (await persist(updated)) {
      setDepts(updated)
      showToast(role.name + (role.is_active ? ' deactivated' : ' activated'))
    } else { showToast('Failed to update', 'error') }
  }

  async function saveEdit() {
    if (!editName.trim()) return
    setSaving(true)
    let updated: Department[]
    if (editingRole) {
      updated = depts.map(d => d.id === editingRole.deptId
        ? { ...d, roles: d.roles.map(r => r.id === editingRole.role.id ? { ...r, name: editName.trim() } : r) }
        : d)
    } else if (editingDept) {
      updated = depts.map(d => d.id === editingDept.id ? { ...d, name: editName.trim() } : d)
    } else { setSaving(false); return }
    if (await persist(updated)) {
      setDepts(updated); setEditingDept(null); setEditingRole(null); setEditName('')
      showToast('Updated successfully')
    } else { showToast('Failed to save', 'error') }
    setSaving(false)
  }

  const filtered = depts.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.roles.some(r => r.name.toLowerCase().includes(search.toLowerCase())))

  return (
    <div>
      <SectionHeader title="Departments & Roles" count={depts.length} onAdd={() => setDeptModal(true)} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={13} color={TEXT_MUTED} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search departments or roles..."
            style={{ width: '100%', padding: '8px 10px 8px 30px', background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
        </div>
        <button onClick={load} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid ' + BORDER, borderRadius: 7, color: TEXT_MUTED, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: BARLOW, fontSize: 14 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: TEXT_MUTED }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: TEXT_MUTED, fontSize: 15 }}>No departments found. Click "Add New" to get started.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(dept => (
            <div key={dept.id} style={{ background: BG3, border: '1px solid ' + (dept.is_active ? BORDER : 'rgba(239,68,68,0.2)'), borderRadius: 10, overflow: 'hidden' }}>
              {/* Dept header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === dept.id ? null : dept.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {expanded === dept.id ? <ChevronUp size={16} color={GOLD} /> : <ChevronDown size={16} color={TEXT_MUTED} />}
                  <div>
                    <div style={{ fontSize: 16, color: '#F5F5F5', fontWeight: 700, fontFamily: BARLOW }}>{dept.name}</div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{dept.roles.length} roles · {dept.roles.filter(r => r.is_active).length} active</div>
                  </div>
                  <Badge active={dept.is_active} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setEditingDept(dept); setEditName(dept.name) }}
                    style={{ width: 28, height: 28, background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: GOLD }}>
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => { setRoleModal(dept.id); setNewRoleName('') }}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 6, color: BLUE, fontFamily: BARLOW, fontSize: 13, cursor: 'pointer' }}>
                    <Plus size={12} /> Add Role
                  </button>
                  <div onClick={() => toggleDept(dept)} style={{ cursor: 'pointer', color: dept.is_active ? GREEN : TEXT_MUTED }}>
                    {dept.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </div>
                </div>
              </div>

              {/* Roles list */}
              {expanded === dept.id && (
                <div style={{ borderTop: '1px solid ' + BORDER, padding: '12px 16px 16px 44px' }}>
                  {dept.roles.length === 0 && (
                    <div style={{ fontSize: 13, color: TEXT_MUTED, padding: '8px 0' }}>No roles yet. Click "Add Role" to add one.</div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                    {dept.roles.map(role => (
                      <div key={role.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: BG2, border: '1px solid ' + (role.is_active ? BORDER : 'rgba(239,68,68,0.15)'), borderRadius: 8, opacity: role.is_active ? 1 : 0.6 }}>
                        <div>
                          <div style={{ fontSize: 14, color: '#F5F5F5' }}>{role.name}</div>
                          <Badge active={role.is_active} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button onClick={() => { setEditingRole({ deptId: dept.id, role }); setEditName(role.name) }}
                            style={{ width: 24, height: 24, background: GOLD_DIM, border: '1px solid ' + GOLD_BDR, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: GOLD }}>
                            <Edit2 size={10} />
                          </button>
                          <div onClick={() => toggleRole(dept.id, role)} style={{ cursor: 'pointer', color: role.is_active ? GREEN : TEXT_MUTED }}>
                            {role.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {deptModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: 420, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1 }}>ADD DEPARTMENT</div>
              <button onClick={() => setDeptModal(false)} style={{ background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <label style={{ display: 'block', fontSize: 13, color: TEXT_MUTED, marginBottom: 6 }}>Department Name *</label>
            <input value={newDeptName} onChange={e => setNewDeptName(e.target.value)} placeholder="e.g. Camera & Lighting"
              onKeyDown={e => { if (e.key === 'Enter') addDept() }}
              style={{ width: '100%', padding: '9px 12px', background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeptModal(false)} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: TEXT_MUTED, fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={addDept} disabled={saving} style={{ flex: 2, padding: 10, background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Adding...' : 'Add Department'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {roleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: 420, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1 }}>ADD ROLE</div>
              <button onClick={() => setRoleModal(null)} style={{ background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 16 }}>Adding role to: <strong style={{ color: '#F5F5F5' }}>{depts.find(d => d.id === roleModal)?.name}</strong></div>
            <label style={{ display: 'block', fontSize: 13, color: TEXT_MUTED, marginBottom: 6 }}>Role Name *</label>
            <input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="e.g. Director of Photography"
              onKeyDown={e => { if (e.key === 'Enter') addRole(roleModal) }}
              style={{ width: '100%', padding: '9px 12px', background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setRoleModal(null)} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: TEXT_MUTED, fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => addRole(roleModal)} disabled={saving} style={{ flex: 2, padding: 10, background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Adding...' : 'Add Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {(editingDept || editingRole) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: BG2, border: '1px solid ' + GOLD_BDR, borderRadius: 14, width: 420, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1 }}>EDIT {editingDept ? 'DEPARTMENT' : 'ROLE'}</div>
              <button onClick={() => { setEditingDept(null); setEditingRole(null) }} style={{ background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <label style={{ display: 'block', fontSize: 13, color: TEXT_MUTED, marginBottom: 6 }}>Name *</label>
            <input value={editName} onChange={e => setEditName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit() }}
              style={{ width: '100%', padding: '9px 12px', background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setEditingDept(null); setEditingRole(null) }} style={{ flex: 1, padding: 10, background: BG3, border: '1px solid ' + BORDER, borderRadius: 7, color: TEXT_MUTED, fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveEdit} disabled={saving} style={{ flex: 2, padding: 10, background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function MasterDataPage() {
  const router = useRouter()
  const [tab, setTab] = useState('languages')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AdminTopnav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar />
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 40px' }}>

          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}>Home</span>
              <ChevronRight size={12} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Master Data</span>
            </div>
            <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: '0 0 4px', color: '#F5F5F5' }}>MASTER DATA</h1>
            <p style={{ fontSize: 15, color: TEXT_MUTED, margin: 0 }}>Manage dropdown options used across the platform — languages, skills, departments and roles.</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: BG3, borderRadius: 10, padding: 4, marginBottom: 24, width: 'fit-content', border: '1px solid ' + BORDER }}>
            {TABS.map(t => {
              const active = tab === t.key
              const Icon = t.icon
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14, fontWeight: active ? 700 : 400, transition: 'all 0.15s',
                    background: active ? GOLD_DIM : 'transparent',
                    color: active ? GOLD : TEXT_MUTED,
                    outline: active ? '1px solid ' + GOLD_BDR : 'none' }}>
                  <Icon size={14} />
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          {tab === 'languages'   && <LanguagesTab   showToast={showToast} />}
          {tab === 'available'   && <SimpleListTab   section="available_for" title="Available For" showToast={showToast} />}
          {tab === 'departments' && <DepartmentsTab  showToast={showToast} />}
          {tab === 'skills'      && <SimpleListTab   section="skills"       title="Skills"        showToast={showToast} />}

        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  )
}