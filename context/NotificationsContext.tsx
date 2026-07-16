'use client'

/* ════════════════════════════════════════════════════════════════
   NotificationsContext
   Shared, app-wide unread-count state for Messages, Notifications,
   and Saved Castings badges. Any page wrapped in <NotificationsProvider>
   reads and writes the same counts, so marking something read in one
   page (e.g. opening a conversation in Messages) instantly updates
   the badge everywhere else (topnav, sidebar, settings, etc).

   PERSISTENCE: counts are persisted to localStorage so they survive
   page reloads and navigation. Replace the localStorage read/write
   with real API calls once the backend is wired up — the rest of the
   app doesn't need to change, since everything reads from this hook.
════════════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const STORAGE_KEY = 'ss_unread_counts'

interface UnreadCounts {
  messages: number
  notifications: number
  saved: number
}

interface NotificationsContextValue {
  counts: UnreadCounts
  // Decrease a count by 1 (e.g. opening one message/notification)
  markOneRead: (key: keyof UnreadCounts) => void
  // Clear a count to 0 (e.g. opening the Messages page / "mark all read")
  markAllRead: (key: keyof UnreadCounts) => void
  // Increase a count by 1 (e.g. a new message arrives via websocket/poll)
  incrementUnread: (key: keyof UnreadCounts) => void
  // Manually set an exact count (e.g. initial load from API)
  setCount: (key: keyof UnreadCounts, value: number) => void
}

const DEFAULT_COUNTS: UnreadCounts = {
  messages: 2,
  notifications: 3,
  saved: 0, // "saved" badge is typically not an unread-style count, kept for symmetry
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<UnreadCounts>(DEFAULT_COUNTS)
  const [hydrated, setHydrated] = useState(false)

  // Load persisted counts on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setCounts(prev => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true)
    }
  }, [])

  // Persist whenever counts change (skip the very first render before hydration)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(counts))
    } catch {
      // storage full or unavailable — fail silently
    }
  }, [counts, hydrated])

  // Keep multiple tabs/windows in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setCounts(JSON.parse(e.newValue))
        } catch {
          // ignore
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const markOneRead = (key: keyof UnreadCounts) => {
    setCounts(prev => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }))
  }

  const markAllRead = (key: keyof UnreadCounts) => {
    setCounts(prev => ({ ...prev, [key]: 0 }))
  }

  const incrementUnread = (key: keyof UnreadCounts) => {
    setCounts(prev => ({ ...prev, [key]: prev[key] + 1 }))
  }

  const setCount = (key: keyof UnreadCounts, value: number) => {
    setCounts(prev => ({ ...prev, [key]: Math.max(0, value) }))
  }

  return (
    <NotificationsContext.Provider value={{ counts, markOneRead, markAllRead, incrementUnread, setCount }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return ctx
}