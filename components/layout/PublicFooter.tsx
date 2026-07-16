'use client'

import Link from 'next/link'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

const BARLOW = '"Barlow Condensed", sans-serif'

const footerLinks = {
  platform: {
    title: 'Platform',
    links: [
      { label: 'Explore Talents', href: '/explore-talents' },
      { label: 'Casting Calls',   href: '/casting-calls'   },
      { label: 'Pricing Plans',   href: '/pricing'         },
      { label: 'How It Works',    href: '/how-it-works'    },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us',   href: '/about'   },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs',       href: '/faq'     },
      { label: 'Support',    href: '/contact' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Terms & Conditions', href: '/terms'         },
      { label: 'Privacy Policy',     href: '/privacy-policy'},
      { label: 'Cookie Policy',      href: '/cookie-policy' },
    ],
  },
}

const socialLinks = [
  { label: 'f',  href: '#' },
  { label: 'in', href: '#' },
  { label: 'tw', href: '#' },
  { label: 'yt', href: '#' },
  { label: 'ig', href: '#' },
]

export default function PublicFooter() {
  return (
    <footer style={{
      background: 'var(--black)',
      borderTop: '1px solid var(--border)',
      padding: '52px 64px 28px',
    }}>

      {/* Top Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
        gap: 32,
        marginBottom: 40,
      }}>

        {/* Brand */}
        <div>
          <SilverScreensLogo size="md" href="/" showTagline={false} />
          <p style={{
            fontSize: 17, color: 'var(--mist)', lineHeight: 1.8,
            maxWidth: 320, marginTop: 14,
          }}>
            India&apos;s most trusted talent marketplace connecting filmmakers and media
            professionals with extraordinary talent.
          </p>

          {/* Newsletter */}
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 16, letterSpacing: '1.5px', color: 'var(--cream)',
              textTransform: 'uppercase', fontWeight: 700, marginBottom: 10,
            }}>
              Stay in the Spotlight
            </div>
            <p style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 17, color: 'var(--mist)', marginBottom: 12 }}>
              Get the latest casting calls delivered to your inbox.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  flex: 1, padding: '9px 14px',
                  background: 'var(--charcoal)',
                  border: '1px solid var(--border)',
                  borderRadius: 2, color: 'var(--cream)',
                  fontSize: 17, outline: 'none',
                  fontFamily: '"Barlow Condensed", sans-serif',
                }}
                onFocus={e => (e.target.style.borderColor = '#C8202A')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
              />
              <button style={{
                padding: '9px 18px',
                background: '#C8202A',
                border: 'none', borderRadius: 2,
                color: '#F5F5F5', fontSize: 16,
                fontWeight: 700, letterSpacing: '1px',
                textTransform: 'uppercase', cursor: 'pointer',
                fontFamily: '"Barlow Condensed", sans-serif',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}>
                Subscribe
              </button>
            </div>
          </div>

          {/* Social */}
          <div className="footer-social" style={{ marginTop: 20 }}>
            {socialLinks.map(s => (
              <a key={s.label} href={s.href} className="soc-btn">{s.label}</a>
            ))}
          </div>

          {/* Mobile App Download */}
          <div style={{ marginTop: 24 }}>
            <div style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontSize: 16, letterSpacing: '1.5px', color: 'var(--cream)',
              textTransform: 'uppercase' as const, fontWeight: 700, marginBottom: 12,
            }}>
              Get the App
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
              <a href="#" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#000', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8, padding: '8px 14px', textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
              >
                <span style={{ fontSize: 22 }}>🍎</span>
                <div>
                  <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>Download on the</div>
                  <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 17, fontWeight: 700, color: '#fff' }}>App Store</div>
                </div>
              </a>
              <a href="#" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#000', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 8, padding: '8px 14px', textDecoration: 'none',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
              >
                <span style={{ fontSize: 22 }}>▶️</span>
                <div>
                  <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>Get it on</div>
                  <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: 17, fontWeight: 700, color: '#fff' }}>Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Link columns */}
        {Object.values(footerLinks).map((section) => (
          <div key={section.title} className="footer-col">
            <h5 style={{ fontSize: 17, fontFamily: BARLOW, letterSpacing: '1.5px', marginBottom: 16 }}>{section.title}</h5>
            <ul>
              {section.links.map((link) => (
                <li key={link.href} style={{ marginBottom: 10 }}>
                  <Link href={link.href} style={{ fontSize: 17, fontFamily: BARLOW }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-copy" style={{ fontSize: 16, fontFamily: BARLOW }}>
          © {new Date().getFullYear()} SilverScreens. All rights reserved.
        </div>
        <div className="footer-legal">
          <Link href="/privacy-policy" style={{ fontSize: 16, fontFamily: BARLOW }}>Privacy Policy</Link>
          <Link href="/terms" style={{ fontSize: 16, fontFamily: BARLOW }}>Terms &amp; Conditions</Link>
          <Link href="/cookie-policy" style={{ fontSize: 16, fontFamily: BARLOW }}>Cookie Policy</Link>
        </div>
      </div>
    </footer>
  )
}