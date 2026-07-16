'use client'

import { Toaster } from 'react-hot-toast'
import { NotificationsProvider } from '@/context/NotificationsContext'
import { CastingCallsProvider } from '@/context/CastingCallsContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NotificationsProvider>
      <CastingCallsProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#121821',
              color: '#F5F5F5',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </CastingCallsProvider>
    </NotificationsProvider>
  )
}