'use client'

import { useEffect } from 'react'

export default function AspirantLayout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const checkAuth = () => {
      try {
        const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
        if (!u?.loggedIn) {
          window.location.replace('/login')
        }
      } catch {
        window.location.replace('/login')
      }
    }

    // Check on mount
    checkAuth()

    // pageshow fires even when page is restored from bfcache
    // This is the key event — popstate alone misses bfcache restores
    const onPageShow = (e: PageTransitionEvent) => {
      // e.persisted = true means page came from bfcache (Back button)
      checkAuth()
    }

    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('popstate', checkAuth)

    // Registering an unload listener disables bfcache in most browsers
    // (bfcache won't cache a page that has an unload listener)
    const disableBfcache = () => {}
    window.addEventListener('unload', disableBfcache)

    return () => {
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('popstate', checkAuth)
      window.removeEventListener('unload', disableBfcache)
    }
  }, [])

  return <>{children}</>
}