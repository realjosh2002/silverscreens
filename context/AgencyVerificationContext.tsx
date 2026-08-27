'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

interface AgencyVerificationCtx {
  verificationStatus: string
  isApproved: boolean
  loading: boolean
  refresh: () => void
}

const Ctx = createContext<AgencyVerificationCtx>({
  verificationStatus: 'pending',
  isApproved: false,
  loading: true,
  refresh: () => {},
})

export function useAgencyVerification() {
  return useContext(Ctx)
}

function getToken(): string | null {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ?? null
  } catch { return null }
}

export function AgencyVerificationProvider({ children }: { children: React.ReactNode }) {
  const [verificationStatus, setVerificationStatus] = useState<string>('pending')
  const [loading, setLoading]                       = useState(true)
  const intervalRef                                 = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchStatus = useCallback(async () => {
    const token = getToken()
    if (!token) { setLoading(false); return }

    try {
      const res = await fetch('/api/profile/agency', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) { setLoading(false); return }

      const data = await res.json()
      const p    = data.data?.profile ?? data.profile ?? data
      const newStatus: string = p.verification_status ?? p.verificationStatus ?? 'pending'

      setVerificationStatus(newStatus)
      setLoading(false)

      // Keep localStorage in sync so other components can read it cheaply
      try {
        const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
        if (u.profileStatus !== newStatus) {
          u.profileStatus = newStatus
          localStorage.setItem('ss_user', JSON.stringify(u))
        }
      } catch {}
    } catch {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Seed from localStorage instantly so first render isn't blank
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u.profileStatus) setVerificationStatus(u.profileStatus)
    } catch {}

    // Immediately fetch real status from API (overrides localStorage)
    fetchStatus()

    // Poll every 30s — if admin approves while agency is logged in, reload
    intervalRef.current = setInterval(async () => {
      const token = getToken()
      if (!token) return

      try {
        const res = await fetch('/api/profile/agency', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        const p    = data.data?.profile ?? data.profile ?? data
        const newStatus: string = p.verification_status ?? p.verificationStatus ?? 'pending'

        setVerificationStatus(prev => {
          if (prev !== 'approved' && newStatus === 'approved') {
            // Approved while logged in — update localStorage and reload for full access
            try {
              const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
              u.profileStatus = newStatus
              localStorage.setItem('ss_user', JSON.stringify(u))
            } catch {}
            window.location.reload()
          }
          return newStatus
        })
      } catch {}
    }, 30000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchStatus])

  const isApproved = verificationStatus === 'approved' || verificationStatus === 'active'

  return (
    <Ctx.Provider value={{ verificationStatus, isApproved, loading, refresh: fetchStatus }}>
      {children}
    </Ctx.Provider>
  )
}