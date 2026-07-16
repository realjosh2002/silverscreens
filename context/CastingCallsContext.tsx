'use client'

/* ═══════════════════════════════════════════════════════════════════
   CastingCallsContext
   Shared, app-wide store for casting calls created by an agency.
   The Create Casting Call wizard writes here on publish; the Casting
   Calls List page reads from here to render the table; the Casting
   Call Detail page reads/writes here for status changes (Open →
   Shortlisting → Auditioning → Closed) and edits.

   PERSISTENCE: data is persisted to localStorage so it survives page
   reloads and navigation. Replace the localStorage read/write with
   real API calls once the backend is wired up — the rest of the app
   doesn't need to change, since everything reads from this hook.
═══════════════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const STORAGE_KEY = 'ss_agency_casting_calls'

export type CastingCallStatus = 'Draft' | 'Open' | 'Shortlisting' | 'Auditioning' | 'Closed'

export interface CastingCall {
  id: string
  title: string
  projectTitle: string
  projectType: string
  roleType: string
  shortDescription: string
  gender: string
  ageFrom: string
  ageTo: string
  experience: string
  roleDescription: string
  skills: string[]
  languages: string[]
  projectStatus: string
  shootStart: string
  shootEnd: string
  shootLocation: string
  hasSponsor: 'Yes' | 'No'
  auditionFormat: string
  auditionTimeFrom: string
  auditionTimeTo: string
  auditionStart: string
  auditionEnd: string
  auditionLocationType: string
  auditionAddress: string
  auditionInstructions: string
  contactName: string
  contactEmail: string
  contactMobile: string
  compensationType: string
  compensationDetail: string
  amount: string
  paymentTerms: string
  additionalRequirements: string
  // Status & tracking — set/updated outside the wizard
  status: CastingCallStatus
  totalSubmissions: number
  shortlisted: number
  createdOn: string
  createdTime: string
}

interface CastingCallsContextValue {
  castingCalls: CastingCall[]
  addCastingCall: (call: Omit<CastingCall, 'id' | 'status' | 'totalSubmissions' | 'shortlisted' | 'createdOn' | 'createdTime'>) => string
  updateStatus: (id: string, status: CastingCallStatus) => void
  updateCastingCall: (id: string, fields: Omit<CastingCall, 'id' | 'status' | 'totalSubmissions' | 'shortlisted' | 'createdOn' | 'createdTime'>) => void
  getCastingCall: (id: string) => CastingCall | undefined
  deleteCastingCall: (id: string) => void
}

const CastingCallsContext = createContext<CastingCallsContextValue | undefined>(undefined)

export function CastingCallsProvider({ children }: { children: ReactNode }) {
  const [castingCalls, setCastingCalls] = useState<CastingCall[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load persisted casting calls on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setCastingCalls(JSON.parse(raw))
      }
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true)
    }
  }, [])

  // Persist whenever casting calls change (skip the very first render before hydration)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(castingCalls))
    } catch {
      // storage full or unavailable — fail silently
    }
  }, [castingCalls, hydrated])

  // Keep multiple tabs/windows in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setCastingCalls(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addCastingCall: CastingCallsContextValue['addCastingCall'] = (call) => {
    const id = `cc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const now = new Date()
    const newCall: CastingCall = {
      ...call,
      id,
      status: 'Open',
      totalSubmissions: 0,
      shortlisted: 0,
      createdOn: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    }
    setCastingCalls(prev => [newCall, ...prev])
    return id
  }

  const updateStatus = (id: string, status: CastingCallStatus) => {
    setCastingCalls(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  const updateCastingCall: CastingCallsContextValue['updateCastingCall'] = (id, fields) => {
    setCastingCalls(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c))
  }

  const getCastingCall = (id: string) => castingCalls.find(c => c.id === id)

  const deleteCastingCall = (id: string) => {
    setCastingCalls(prev => prev.filter(c => c.id !== id))
  }

  return (
    <CastingCallsContext.Provider value={{ castingCalls, addCastingCall, updateStatus, updateCastingCall, getCastingCall, deleteCastingCall }}>
      {children}
    </CastingCallsContext.Provider>
  )
}

export function useCastingCalls() {
  const ctx = useContext(CastingCallsContext)
  if (!ctx) {
    throw new Error('useCastingCalls must be used within a CastingCallsProvider')
  }
  return ctx
}