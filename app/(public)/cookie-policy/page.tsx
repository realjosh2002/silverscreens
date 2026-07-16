'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Cookie, ChevronRight, Calendar, ChevronUp, ChevronLeft,
  Shield, BarChart2, Settings, Target, Globe, Info,
  AlertTriangle, RefreshCw, Eye,
} from 'lucide-react'

const BG       = '#0D1117'
const BG2      = '#131720'
const BG3      = '#181E2A'
const BG4      = '#1C2338'
const GOLD     = '#D4A64A'
const GOLD_DIM = 'rgba(212,166,74,0.10)'
const GOLD_BDR = 'rgba(212,166,74,0.22)'
const RED      = '#C8202A'
const GREEN    = '#22C55E'
const BEBAS    = "'Bebas Neue', sans-serif"
const BARLOW   = "'Barlow Condensed', sans-serif"

const SECTIONS = [
  { id: 'introduction',  num: 1,  title: 'Introduction',                         icon: Cookie   },
  { id: 'uses-cookies',  num: 2,  title: 'Does SilverScreens Use Cookies?',      icon: Globe    },
  { id: 'what-is',       num: 3,  title: 'What is a Cookie?',                    icon: Info     },
  { id: 'used-for',      num: 4,  title: 'What Are Cookies Used For?',            icon: Eye      },
  { id: 'when-placed',   num: 5,  title: 'When Does SilverScreens Place Cookies?', icon: Settings },
  { id: 'analytics',     num: 6,  title: 'Cookies for Analytics',                icon: BarChart2 },
  { id: 'advertising',   num: 7,  title: 'Cookies for Advertising',              icon: Target   },
  { id: 'third-party',   num: 8,  title: 'Third-Party Cookies',                  icon: Globe    },
  { id: 'web-beacons',   num: 9,  title: 'What Are Web Beacons?',               icon: Eye      },
  { id: 'control',       num: 10, title: 'How to Control Cookies',               icon: Settings },
]

const COOKIE_TYPES = [
  { icon: Shield,   color: '#22C55E', name: 'Essential Cookies',                 badge: 'Required',    desc: 'Sometimes called "strictly necessary" — without them we cannot provide many services. Essential cookies help remember your preferences as you move around the Platform and keep you logged in. Disabling these cookies will affect core functionality.' },
  { icon: BarChart2, color: GOLD,    name: 'Analytics Cookies',                  badge: 'Performance', desc: 'Track information about visits to silverscreens.in to help us make improvements and report our performance. They collect information about how visitors use the Platform, which site the user came from, the number of visits, and how long a user stays.' },
  { icon: Settings,  color: '#60A5FA', name: 'Functionality or Preference Cookies', badge: 'Optional', desc: 'Remember information you have entered or choices you make (such as your username, language, or region). They store your preferences when personalising the Platform so you don\'t have to set them again on your next visit.' },
  { icon: Target,    color: RED,     name: 'Targeting or Advertising Cookies',   badge: 'Optional',    desc: 'Placed by third party advertising platforms to deliver ads and track ad performance. They enable advertising networks to deliver ads relevant to your activities. You may see these as "behavioural", "tracking", or "targeted" advertising.' },
]

const P: React.CSSProperties = {
  fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.62)',
  lineHeight: 1.85, margin: '0 0 14px',
}

function Heading({ num, title, id, icon: Icon }: { num: number; title: string; id: string; icon: any }) {
  return (
    <div id={id} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', scrollMarginTop: 90 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} color={GOLD} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontFamily: BARLOW, color: GOLD, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 2 }}>Section {num}</div>
        <h2 style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1.5, color: '#F5F5F5', margin: 0, textTransform: 'uppercase' as const }}>{title}</h2>
      </div>
    </div>
  )
}

function Card({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{ background: BG2, border: `1px solid ${accent ? GOLD_BDR : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: '24px 28px', marginBottom: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}>
      {children}
    </div>
  )
}

function InfoBox({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' }) {
  const isWarn = type === 'warning'
  return (
    <div style={{ display: 'flex', gap: 12, background: isWarn ? 'rgba(200,32,42,0.07)' : GOLD_DIM, border: `1px solid ${isWarn ? 'rgba(200,32,42,0.25)' : GOLD_BDR}`, borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
      {isWarn ? <AlertTriangle size={17} color={RED} style={{ flexShrink: 0, marginTop: 2 }} /> : <Info size={17} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />}
      <div style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>{children}</div>
    </div>
  )
}

export default function CookiePolicyPage() {
  const router = useRouter()
  const [active, setActive] = useState('introduction')
  const [showTop, setShowTop] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const onScroll = () => {
      setShowTop(el.scrollTop > 500)
      const hits = SECTIONS.map(s => {
        const node = document.getElementById(s.id)
        return { id: s.id, top: node ? node.getBoundingClientRect().top : 9999 }
      }).filter(o => o.top <= 130)
      if (hits.length) setActive(hits[hits.length - 1].id)
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: 'calc(100vh - 72px)', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* Header bar */}
      <div style={{ height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
            <ChevronLeft size={15} /> Back
          </button>
          <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 6px' }}>|</span>
          <span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>Home</span>
          <ChevronRight size={13} color="rgba(255,255,255,0.2)" />
          <span style={{ fontSize: 14, fontFamily: BARLOW, color: GOLD, fontWeight: 700 }}>Cookie Policy</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '5px 14px' }}>
          <Calendar size={13} color={GOLD} />
          <span style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>Last Updated: <strong style={{ color: GOLD }}>24 May 2026</strong></span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left nav */}
        <aside style={{ width: 272, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Cookie size={17} color={RED} />
              </div>
              <div>
                <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1.5, color: '#F5F5F5', lineHeight: 1 }}>COOKIE POLICY</div>
                <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{SECTIONS.length} sections</div>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, overflowY: 'auto' as const, padding: '10px 10px', scrollbarWidth: 'none' as const }}>
            {SECTIONS.map(s => {
              const isActive = active === s.id
              return (
                <div key={s.id} onClick={() => scrollTo(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, cursor: 'pointer', marginBottom: 2, background: isActive ? GOLD_DIM : 'transparent', borderLeft: `3px solid ${isActive ? GOLD : 'transparent'}`, transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: isActive ? GOLD : 'rgba(255,255,255,0.28)', flexShrink: 0, width: 22 }}>{s.num}.</span>
                  <span style={{ fontSize: 15, fontFamily: BARLOW, color: isActive ? GOLD : 'rgba(255,255,255,0.5)', fontWeight: isActive ? 700 : 400, lineHeight: 1.4 }}>{s.title}</span>
                </div>
              )
            })}
          </nav>
          <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
              Manage your cookie preferences or contact us at<br />
              <a href="mailto:admin@silverscreens.in" style={{ color: GOLD, textDecoration: 'none' }}>admin@silverscreens.in</a>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div ref={mainRef} style={{ flex: 1, overflowY: 'auto' as const, scrollbarWidth: 'thin' as const }}>
          <div style={{ padding: '32px 36px 80px' }}>

            {/* Hero */}
            <div style={{ marginBottom: 32, padding: '28px 32px', background: `linear-gradient(135deg, ${BG3} 0%, ${BG2} 100%)`, border: `1px solid ${GOLD_BDR}`, borderRadius: 16, position: 'relative' as const, overflow: 'hidden' }}>
              <div style={{ position: 'absolute' as const, top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: GOLD_DIM, filter: 'blur(40px)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Cookie size={24} color={RED} />
                </div>
                <div>
                  <h1 style={{ fontFamily: BEBAS, fontSize: 42, letterSpacing: 3, color: '#F5F5F5', margin: 0, lineHeight: 1 }}>COOKIE POLICY</h1>
                  <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Rodinia Technologies — SilverScreens Platform</div>
                </div>
              </div>
              <p style={{ ...P, margin: 0, fontSize: 15 }}>
                This Cookie Policy explains how SilverScreens uses cookies and similar technologies when you visit our platform, and how you can control your preferences.
              </p>
            </div>

            {/* 1. Intro */}
            <Card>
              <Heading num={1} title="Introduction" id="introduction" icon={Cookie} />
              <p style={P}>This Cookie Policy (<strong style={{ color: '#fff' }}>"Policy"</strong>) explains that we believe in being open and clear about how we use your information. In the spirit of transparency, this Policy provides detailed information about how and when we use cookies on our Websites.</p>
              <p style={{ ...P, margin: 0 }}>This cookie policy applies to any silverscreens.in product or service that links to this policy or incorporates it by reference.</p>
            </Card>

            {/* 2. Uses cookies */}
            <Card>
              <Heading num={2} title="Does SilverScreens Use Cookies?" id="uses-cookies" icon={Globe} />
              <p style={P}>silverscreens.in uses cookies, tags and other technologies when you use any of the silverscreens.in websites, mobile sites or mobile apps (collectively <strong style={{ color: '#fff' }}>"the services"</strong>). Cookies are used to ensure everyone has their best possible experience and to help keep your account safe.</p>
              <p style={{ ...P, margin: 0 }}>By continuing to visit or use our services, you are agreeing to the use of cookies and similar technologies for the purposes we describe in this policy. If you prefer not to receive cookies or web beacons, you should stop using our site, or consult your browsing and third party cookie settings as described below.</p>
            </Card>

            {/* 3. What is a cookie */}
            <Card>
              <Heading num={3} title="What is a Cookie?" id="what-is" icon={Info} />
              <p style={P}>Cookies are small pieces of text stored by a website you visit in your browser and subsequently sent by your web browser in every request to the website. A cookie file is stored in your web browser and allows the Site or a third-party to recognise you and make your next visit easier.</p>
              <p style={P}>Essentially, cookies are a user's identification card for the silverscreens.in servers. They allow silverscreens.in to serve you better and more efficiently, and to personalise your experience on our site.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                {[
                  { type: 'Persistent Cookies', icon: '🔒', color: GOLD, desc: 'Helps recognise you as an existing user, making it easier to return to silverscreens.in without signing in again. Stays in your browser after you sign in.' },
                  { type: 'Session Cookies', icon: '⏱️', color: '#60A5FA', desc: 'Only last for as long as the session — typically the current visit to the website or browser session. Automatically deleted when you close your browser.' },
                ].map(item => (
                  <div key={item.type} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px' }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: item.color, marginBottom: 8 }}>{item.type}</div>
                    <p style={{ ...P, margin: 0, fontSize: 14 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 4. Used for */}
            <Card>
              <Heading num={4} title="What Are Cookies Used For?" id="used-for" icon={Eye} />
              <p style={P}>When you visit our Websites, we may place a number of cookies in your browser. These are known as First Party Cookies and are required to hold session information as you navigate from page to page within the website. Each cookie falls within one of the four following categories:</p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                {COOKIE_TYPES.map(ct => {
                  const Icon = ct.icon
                  return (
                    <div key={ct.name} style={{ display: 'flex', gap: 18, background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px 20px', alignItems: 'flex-start' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ct.color}18`, border: `1px solid ${ct.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} color={ct.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#F5F5F5' }}>{ct.name}</div>
                          <div style={{ fontSize: 12, fontFamily: BARLOW, fontWeight: 700, color: ct.color, background: `${ct.color}18`, border: `1px solid ${ct.color}35`, borderRadius: 6, padding: '2px 8px', letterSpacing: 0.5 }}>{ct.badge}</div>
                        </div>
                        <p style={{ ...P, margin: 0, fontSize: 14 }}>{ct.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* 5. When placed */}
            <Card>
              <Heading num={5} title="When Does SilverScreens Place Cookies?" id="when-placed" icon={Settings} />
              <p style={P}>We use cookies on our websites, mobile sites, and mobile applications. Any browser visiting these sites will receive cookies from us which helps us identify you more quickly when you return. Cookies help us to determine which pages or information you find most useful or interesting on our own websites.</p>
              <p style={{ ...P, margin: 0 }}>silverscreens.in may also use its own analytics cookies — not part of Google Analytics — to generate statistics and reports about visitors and their activities on the website or app.</p>
            </Card>

            {/* 6. Analytics */}
            <Card>
              <Heading num={6} title="Cookies for Analytics" id="analytics" icon={BarChart2} />
              <p style={{ ...P, margin: 0 }}>We may use web analytics services on silverscreens.in, such as those of Google Analytics. These services help us analyse how users use the services, including by noting the third-party website from which you arrive. The information collected by the technology will be disclosed to or collected directly by such service providers, who use the information to evaluate your use of the services. We also use Google Analytics for certain purposes related to online marketing, and the data collected is anonymised.</p>
            </Card>

            {/* 7. Advertising */}
            <Card>
              <Heading num={7} title="Cookies for Advertising" id="advertising" icon={Target} />
              <p style={P}>Cookies and other ad technology such as beacons, pixels, and tags help us serve relevant ads to you more effectively. They also help us provide aggregated auditing, research, and reporting for advertisers, understand and improve our service, and know when content has been shown to you.</p>
              <p style={{ ...P, margin: 0 }}>We work with website analytics and advertising partners, including Google Display Network and Facebook, to deliver silverscreens.in advertisements on third party publisher websites. These partners may set cookies on your computer's web browser to allow our partners to recognise your computer so that the ad server can show you silverscreens.in advertisements elsewhere on the Internet.</p>
            </Card>

            {/* 8. Third party */}
            <Card>
              <Heading num={8} title="Third-Party Cookies" id="third-party" icon={Globe} />
              <p style={P}>Please note that third parties (advertising networks and providers of external services like web traffic analysis services) may also use cookies on our Services. Note that the names of cookies, pixels and other technologies may change over time.</p>
              <p style={P}>We also use Google Analytics on our Services to help us analyse how our Services are used. We suggest you check the respective privacy policies of these external services to understand how they process your data.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { name: 'Facebook', url: 'https://www.facebook.com/policy.php' },
                  { name: 'Google AdSense', url: 'https://policies.google.com/technologies/ads' },
                  { name: 'Google Analytics', url: 'https://www.google.com/analytics/learn/privacy.html' },
                  { name: 'Google Tag Manager', url: 'https://www.google.com/analytics/tag-manager/faq/' },
                  { name: 'Twitter / X', url: 'https://twitter.com/en/privacy' },
                  { name: 'Google DoubleClick', url: 'https://support.google.com/dfp_premium/answer/2839090' },
                ].map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, padding: '11px 14px', textDecoration: 'none', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD_BDR)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                  >🔗 {link.name}</a>
                ))}
              </div>
            </Card>

            {/* 9. Web beacons */}
            <Card>
              <Heading num={9} title="What Are Web Beacons?" id="web-beacons" icon={Eye} />
              <p style={P}>silverscreens.in occasionally advertises on third party websites. As part of our effort to track the success of our advertising campaigns, we may at times use a visitor identification technology such as <strong style={{ color: '#fff' }}>"web beacons"</strong> or <strong style={{ color: '#fff' }}>"action tags"</strong>, which count visitors who have come to our site after being exposed to a silverscreens.in banner ad on a third party site.</p>
              <p style={{ ...P, margin: 0 }}>By navigating on our site, you agree that we can place cookies and web beacons on your computer or device. If you prefer not to receive web beacons, you should stop using our site or consult your browsing settings.</p>
            </Card>

            {/* 10. Control */}
            <Card>
              <Heading num={10} title="How to Control Cookies" id="control" icon={Settings} />
              <p style={P}>Most browsers allow you to control cookies through their settings preferences. However, if you choose to turn off these cookies, you will still see advertising on the internet but it may not be tailored to your interests. Essential cookies cannot be disabled.</p>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#F5F5F5', marginBottom: 12 }}>Change Cookie Settings in Your Browser:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { name: 'Internet Explorer', url: 'https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies' },
                    { name: 'Firefox', url: 'https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences' },
                    { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                    { name: 'Safari', url: 'https://support.apple.com/en-in/guide/safari/sfri11471/mac' },
                  ].map(b => (
                    <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 10, background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, padding: '12px 16px', textDecoration: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 15, fontFamily: BARLOW, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                    >🌐 Cookie settings in {b.name}</a>
                  ))}
                </div>
              </div>
              <InfoBox>
                To find out more about cookies and how to manage them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>www.allaboutcookies.org</a>. You can also opt out of interest-based ads at <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>optout.aboutads.info</a> and <a href="https://www.networkadvertising.org/choices" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>networkadvertising.org/choices</a>.
              </InfoBox>
            </Card>

            {/* Footer */}
            <div style={{ textAlign: 'center' as const, padding: '24px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
              <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>© 2026 Rodinia Technologies Pvt. Ltd. All rights reserved.</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                {[{ label: 'Privacy Policy', href: '/privacy-policy' }, { label: 'Terms & Conditions', href: '/terms' }, { label: 'Contact Us', href: '/contact' }].map(l => (
                  <Link key={l.label} href={l.href} style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = GOLD)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>{l.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTop && (
        <button onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ position: 'fixed', bottom: 28, right: 28, width: 46, height: 46, borderRadius: '50%', background: RED, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 24px rgba(200,32,42,0.45)', zIndex: 300 }}>
          <ChevronUp size={20} color="#fff" />
        </button>
      )}
    </div>
  )
}