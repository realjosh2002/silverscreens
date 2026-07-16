'use client'

import { usePathname } from 'next/navigation'
import PublicNavbar from '@/components/layout/PublicNavbar'
import PublicFooter from '@/components/layout/PublicFooter'

const AUTH_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
]

const NO_NAVBAR_PATHS = [
  '/casting-calls',
  '/explore-talents',
  '/payment-success',
  '/payment-failure',
  '/payment',
  '/pricing-international',
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth      = AUTH_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  const isNoNavbar  = NO_NAVBAR_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))

  if (isAuth || isNoNavbar) {
    return <>{children}</>
  }

  return (
    <>
      <PublicNavbar />
      <main className="pt-[72px]">{children}</main>
      <PublicFooter />
    </>
  )
}