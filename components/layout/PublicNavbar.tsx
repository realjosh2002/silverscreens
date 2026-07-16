'use client'

import Link from 'next/link'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, Suspense } from 'react'

const navLinks = [
  { label: 'Home',            href: '/'               },
  { label: 'About Us',        href: '/about'          },
  { label: 'Explore Talents', href: '/explore-talents' },
  { label: 'Casting Calls',   href: '/casting-calls'  },
  { label: 'Pricing Plans',   href: '/pricing'        },
  { label: 'FAQs',            href: '/faq'            },
  { label: 'Contact Us',      href: '/contact'        },
]

function NavbarInner() {
  const pathname                        = usePathname()
  const searchParams                    = useSearchParams()
  const router                          = useRouter()
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownTimer                   = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Public pages always show Login / Signup — never read auth state from localStorage.
  // Authenticated state is only shown inside /dashboard, /agency, /admin routes.

  // Hide navbar on admin/verifier portal
  const role = searchParams.get('role')
  if (role === 'admin' || role === 'verifier') return null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleMouseEnter = (label: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    setOpenDropdown(label)
  }

  const handleMouseLeave = () => {
    dropdownTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: '0 32px',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      transition: 'background 0.4s, border-color 0.4s',
      background: scrolled ? 'rgba(8,8,8,0.97)' : 'rgba(8,8,8,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(212,166,74,0.15)' : '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div style={{ flexShrink: 0 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
      </div>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, justifyContent: 'center' }}>
        {navLinks.map((link) => (
          <div key={link.label} style={{ position: 'relative' }}
            onMouseEnter={() => link.dropdown && handleMouseEnter(link.label)}
            onMouseLeave={() => link.dropdown && handleMouseLeave()}
          >
            {link.dropdown ? (
              <button style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '8px 10px', background: 'none', border: 'none',
                cursor: 'pointer',
                color: pathname === link.href ? 'var(--cream)' : 'var(--silver)',
                fontSize: 15, fontWeight: 600, letterSpacing: '0.3px',
                fontFamily: '"Barlow Condensed", sans-serif',
                transition: 'color 0.2s', whiteSpace: 'nowrap',
              }}>
                {link.label}
                <span style={{ fontSize: 9, opacity: 0.6 }}>▾</span>
                {pathname === link.href && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: 10, right: 10,
                    height: 1, background: '#C8202A',
                  }} />
                )}
              </button>
            ) : (
              <Link href={link.href} style={{
                display: 'block', padding: '8px 10px', textDecoration: 'none',
                color: pathname === link.href ? 'var(--cream)' : 'var(--silver)',
                fontSize: 15, fontWeight: 500, letterSpacing: '0.3px',
                transition: 'color 0.2s', position: 'relative', whiteSpace: 'nowrap',
              }}>
                {link.label}
                {pathname === link.href && (
                  <span style={{
                    position: 'absolute', bottom: 0, left: 10, right: 10,
                    height: 1, background: '#C8202A',
                  }} />
                )}
              </Link>
            )}

            {/* Dropdown */}
            {link.dropdown && (
              <div style={{
                position: 'absolute', top: '100%', left: 0,
                marginTop: 4, width: 220,
                background: 'rgba(8,8,8,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(200,32,42,0.15)',
                borderRadius: 6, padding: '8px 0',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                opacity: openDropdown === link.label ? 1 : 0,
                transform: openDropdown === link.label ? 'translateY(0)' : 'translateY(-8px)',
                pointerEvents: openDropdown === link.label ? 'auto' : 'none',
                transition: 'opacity 0.2s, transform 0.2s',
              }}>
                {link.dropdown.map((item) => (
                  <Link key={item.label} href={item.href} style={{
                    display: 'block', padding: '9px 18px',
                    color: 'var(--silver)', textDecoration: 'none',
                    fontSize: 15, letterSpacing: '0.3px',
                    transition: 'color 0.2s, background 0.2s',
                  }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = '#C8202A'; (e.target as HTMLElement).style.background = 'rgba(200,32,42,0.06)'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--silver)'; (e.target as HTMLElement).style.background = 'transparent'; }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Auth Buttons — always guest on public pages */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
        <Link href="/login"  className="btn-nav-login">Log In</Link>
        <Link href="/signup" className="btn-nav-signup">Sign Up</Link>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
        style={{
          display: 'none',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--silver)', fontSize: 22,
        }}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: 72, left: 0, right: 0,
          background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px 24px',
        }}>
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block', padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                color: pathname === link.href ? '#C8202A' : 'var(--silver)',
                textDecoration: 'none', fontSize: 15,
                fontFamily: '"Barlow Condensed", sans-serif',
                fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const,
              }}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
              <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, textAlign: 'center' as const }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: '"Barlow Condensed", sans-serif', marginBottom: 2 }}>Signed in as</div>
                <div style={{ fontSize: 15, color: '#F5F5F5', fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700 }}>{user.name || 'My Account'}</div>
              </div>
              <Link href={dashboardHref} onClick={() => setMobileOpen(false)} style={{
                display: 'block', textAlign: 'center', padding: '12px', borderRadius: 6,
                background: '#C8202A', color: '#fff', textDecoration: 'none',
                fontSize: 15, fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700,
              }}>Go to Dashboard →</Link>
              <div onClick={handleLogout} style={{
                textAlign: 'center', padding: '12px', borderRadius: 6, cursor: 'pointer',
                background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
                color: '#ff6b6b', fontSize: 15, fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 600,
              }}>Logout</div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <Link href="/login"  className="btn-nav-login"  style={{ flex: 1, textAlign: 'center' }}>Log In</Link>
              <Link href="/signup" className="btn-nav-signup" style={{ flex: 1, textAlign: 'center' }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default function PublicNavbar() {
  return (
    <Suspense fallback={null}>
      <NavbarInner />
    </Suspense>
  )
}