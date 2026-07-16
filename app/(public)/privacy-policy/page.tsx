'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  Shield, ChevronRight, Calendar, ChevronUp, ChevronLeft,
  Mail, AlertTriangle, Info, Lock, Eye, Globe, Users,
  Database, RefreshCw, Phone,
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
  { id: 'introduction',  num: 1,  title: 'Introduction',                        icon: Shield    },
  { id: 'types',         num: 2,  title: 'Personal Information We Collect',      icon: Database  },
  { id: 'how-we-use',   num: 3,  title: 'How We Use Your Information',           icon: Eye       },
  { id: 'cookies',       num: 4,  title: 'Cookies & Tracking Technologies',      icon: Globe     },
  { id: 'basis',         num: 5,  title: 'Basis for Collection & Processing',    icon: Lock      },
  { id: 'sharing',       num: 6,  title: 'Information Sharing & Disclosure',     icon: Users     },
  { id: 'third-party',   num: 7,  title: 'Third Party Content',                  icon: Globe     },
  { id: 'children',      num: 8,  title: 'Children',                             icon: Shield    },
  { id: 'retention',     num: 9,  title: 'Retention of Personal Information',    icon: Database  },
  { id: 'your-rights',   num: 10, title: 'Controlling Your Information',         icon: Lock      },
  { id: 'security',      num: 11, title: 'Confidentiality & Security',           icon: Lock      },
  { id: 'social-media',  num: 12, title: 'Social Media',                         icon: Globe     },
  { id: 'changes',       num: 13, title: 'Changes to this Policy',               icon: RefreshCw },
  { id: 'disclaimer',    num: 14, title: 'Disclaimer',                           icon: AlertTriangle },
  { id: 'grievance',     num: 15, title: 'Grievance Officer',                    icon: Mail      },
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
    <div style={{
      background: BG2, border: `1px solid ${accent ? GOLD_BDR : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 14, padding: '24px 28px', marginBottom: 16,
      boxShadow: accent ? `0 0 0 1px ${GOLD_BDR}, 0 8px 32px rgba(0,0,0,0.3)` : '0 4px 24px rgba(0,0,0,0.25)',
    }}>
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

function Bullet({ items, color = GOLD }: { items: string[]; color?: string }) {
  return (
    <ul style={{ margin: '0 0 14px', padding: 0, listStyle: 'none' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 9 }} />
          <span style={{ fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.62)', lineHeight: 1.8 }}>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PrivacyPolicyPage() {
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

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: 'calc(100vh - 72px)', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ── Slim header bar ── */}
      <div style={{ height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: BG2, borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
            <ChevronLeft size={15} /> Back
          </button>
          <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 6px' }}>|</span>
          <span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>Home</span>
          <ChevronRight size={13} color="rgba(255,255,255,0.2)" />
          <span style={{ fontSize: 14, fontFamily: BARLOW, color: GOLD, fontWeight: 700 }}>Privacy Policy</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '5px 14px' }}>
          <Calendar size={13} color={GOLD} />
          <span style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>Last Updated: <strong style={{ color: GOLD }}>24 May 2026</strong></span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left nav ── */}
        <aside style={{ width: 272, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={17} color={RED} />
              </div>
              <div>
                <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1.5, color: '#F5F5F5', lineHeight: 1 }}>PRIVACY POLICY</div>
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
              Questions? Email us at<br />
              <a href="mailto:admin@silverscreens.in" style={{ color: GOLD, textDecoration: 'none' }}>admin@silverscreens.in</a>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div ref={mainRef} style={{ flex: 1, overflowY: 'auto' as const, scrollbarWidth: 'thin' as const }}>
          <div style={{ padding: '32px 36px 80px' }}>

            {/* Hero */}
            <div style={{ marginBottom: 32, padding: '28px 32px', background: `linear-gradient(135deg, ${BG3} 0%, ${BG2} 100%)`, border: `1px solid ${GOLD_BDR}`, borderRadius: 16, position: 'relative' as const, overflow: 'hidden' }}>
              <div style={{ position: 'absolute' as const, top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: GOLD_DIM, filter: 'blur(40px)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={24} color={RED} />
                </div>
                <div>
                  <h1 style={{ fontFamily: BEBAS, fontSize: 42, letterSpacing: 3, color: '#F5F5F5', margin: 0, lineHeight: 1 }}>PRIVACY POLICY</h1>
                  <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Rodinia Technologies — SilverScreens Platform</div>
                </div>
              </div>
              <p style={{ ...P, margin: 0, fontSize: 15 }}>
                We at Rodinia Technologies are committed to protecting your privacy. This policy describes how we collect, use, and protect your personal information when you use the SilverScreens platform.
              </p>
            </div>

            {/* 1. Introduction */}
            <Card>
              <Heading num={1} title="Introduction" id="introduction" icon={Shield} />
              <p style={P}>We, at Rodinia Technologies and our affiliated companies worldwide (hereinafter collectively referred to as <strong style={{ color: '#fff' }}>"Rodinia Technologies"</strong>), are committed to respecting your online privacy and recognise the need for appropriate protection and management of any personally identifiable information you share with us.</p>
              <p style={P}>This Privacy Policy (<strong style={{ color: '#fff' }}>"Policy"</strong>) describes how Rodinia Technologies collects, uses, discloses and transfers personal information of users through its websites and applications, including through <a href="https://www.silverscreens.in" style={{ color: GOLD, textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">www.silverscreens.in</a>, mobile applications, social media and other online services (collectively, the <strong style={{ color: '#fff' }}>"Platform"</strong>).</p>
              <p style={{ ...P, margin: 0 }}>For the purposes of this Privacy Policy, <strong style={{ color: '#fff' }}>"You"</strong> or <strong style={{ color: '#fff' }}>"Your"</strong> shall mean the person accessing the Platform — whether a visitor, Aspirant, or Agency.</p>
            </Card>

            {/* 2. Types */}
            <Card>
              <Heading num={2} title="Personal Information We Collect" id="types" icon={Database} />
              <p style={P}><strong style={{ color: '#fff' }}>"Personal information" (PI)</strong> means any information relating to an identified or identifiable natural person, including common identifiers such as name, identification number, location data, or factors specific to the physical, physiological, genetic, mental, economic, cultural, or social identity of that person.</p>
              <p style={P}>We collect the following categories of Personal Information:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { icon: '👤', title: 'Registration Data', desc: 'Name, email address, password, country, city, contact number and company/organisation when you sign up.' },
                  { icon: '📋', title: 'Profile Data', desc: 'Contact details, vital statistics, work experience, qualifications, salary data (optional), and profile copy.' },
                  { icon: '📊', title: 'Usage Data', desc: 'Log information and location information about how you use the services through the Platform.' },
                  { icon: '📝', title: 'Survey Data', desc: 'Personal Information collected through surveys and forms when you choose to participate.' },
                  { icon: '💬', title: 'Communication Data', desc: 'Information about your communications when you interact with us or other users on the Platform.' },
                  { icon: '🍪', title: 'Technical Data', desc: 'Technical information about your system, browser, and device interactions collected through cookies.' },
                  { icon: '📱', title: 'Device Data', desc: 'Technical information from your device and device location when you access the Platform.' },
                  { icon: '🔗', title: 'Social Data', desc: 'Information made available through social media interfaces if you choose to sign in with a social account.' },
                ].map(item => (
                  <div key={item.title} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#F5F5F5', marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <InfoBox>We may also collect information relating to your caste or affirmative action eligibility only if you opt to provide such information, and only where permitted by applicable law.</InfoBox>
            </Card>

            {/* 3. How we use */}
            <Card>
              <Heading num={3} title="How We Use Your Information" id="how-we-use" icon={Eye} />
              <p style={P}>We will only use your personal data in a fair and reasonable manner, and where we have a lawful reason to do so. We may process your Personal Information for the following purposes:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                {[
                  { icon: '🎯', title: 'Provide Services', desc: 'Sending job alerts, search results, recommended castings, and communication facilities.' },
                  { icon: '🛡️', title: 'Protect & Support', desc: 'Protecting our users and providing you with customer support across all interactions.' },
                  { icon: '📊', title: 'Improve Platform', desc: 'Using cookies and analytics to improve your experience and the quality of our services.' },
                  { icon: '📣', title: 'Marketing', desc: 'Sending information about our products and services for marketing purposes and promotions.' },
                  { icon: '⚖️', title: 'Prevent Fraud', desc: 'Preventing, detecting, and investigating crimes, fraud, or violations of our Terms of Use.' },
                  { icon: '🔐', title: 'Identity Verification', desc: 'Identity verification, government sanctions screening, and due diligence checks.' },
                ].map(item => (
                  <div key={item.title} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '16px' }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#F5F5F5', marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 4. Cookies */}
            <Card>
              <Heading num={4} title="Cookies & Tracking Technologies" id="cookies" icon={Globe} />
              <p style={P}>Some of our web pages utilise <strong style={{ color: '#fff' }}>"cookies"</strong> and other tracking technologies. A "cookie" is a small text file that may be used to collect information about website activity.</p>
              <p style={P}>Most browsers allow you to control cookies, including whether or not to accept them and how to remove them. You may set most browsers to notify you if you receive a cookie, or block cookies entirely, but please note that if you choose to erase or block your cookies, you will need to re-enter your user ID and password to access certain parts of the Platform.</p>
              <p style={{ ...P, margin: 0 }}>Tracking technologies may record information such as Internet domain and host names, IP addresses, browser software, operating system types, clickstream patterns, and dates and times of site access. For more information, please refer to our <Link href="/cookie-policy" style={{ color: GOLD, textDecoration: 'none' }}>Cookie Policy</Link>.</p>
            </Card>

            {/* 5. Basis */}
            <Card>
              <Heading num={5} title="Basis for Collection & Processing" id="basis" icon={Lock} />
              <p style={P}>Your Personal Information is collected and processed by Rodinia Technologies based on the following legal grounds:</p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {[
                  { title: 'Consent', body: 'Rodinia Technologies relies on your consent to process certain Personal Information. Your consent is sought at the time of collection, and processing only occurs where consent is secured. You may withdraw consent at any time, subject to applicable legal restrictions.' },
                  { title: 'Compliance with Legal Obligations', body: 'Your Personal Information may be processed to the extent necessary for Rodinia Technologies to comply with a legal obligation — for example, retaining specific records for a fixed period or disclosing information in response to a court order.' },
                  { title: 'Legitimate Interests', body: 'We may process your information where it is necessary for our legitimate business interests, such as preventing fraud, improving platform security, or conducting analytics — provided these interests are not overridden by your rights.' },
                ].map(item => (
                  <div key={item.title} style={{ background: BG3, border: `1px solid ${GOLD_BDR}`, borderLeft: `3px solid ${GOLD}`, borderRadius: 10, padding: '16px 18px' }}>
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{item.title}</div>
                    <p style={{ ...P, margin: 0, fontSize: 15 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 6. Sharing */}
            <Card>
              <Heading num={6} title="Information Sharing & Disclosure" id="sharing" icon={Users} />
              <p style={P}>We restrict access to your Personal Information to employees who reasonably need to know that information to fulfil their jobs. Rodinia Technologies does not disclose, transfer or share your Personal Information with others except with:</p>
              <Bullet items={[
                'Our affiliates and group companies to the extent required for internal business purposes and provision of services aimed at helping you in your career.',
                'Potential recruiters if we determine that your profile matches a particular job description. By registering and consenting to this Policy, you agree that Rodinia Technologies may forward your profile to potential recruiters.',
                'Third parties including enforcement, regulatory and judicial authorities, if we determine that disclosure is required to respond to subpoenas, court orders, or legal processes.',
                'Third party service providers and marketing partners that Rodinia Technologies engages to provide services over the Platform, maintain the Platform, or communicate with you.',
                'Third parties in the event of a merger, acquisition, financing, or sale of assets involving transfer of some or all of Rodinia Technologies\' business assets.',
                'Third party advertisers to display relevant advertisements to you when you visit the Platform.',
              ]} />
              <InfoBox>Rodinia Technologies does not intend to transfer Personal Information without your consent to third parties who are not bound to act on our behalf unless such transfer is legally required.</InfoBox>
            </Card>

            {/* 7. Third party */}
            <Card>
              <Heading num={7} title="Third Party Content" id="third-party" icon={Globe} />
              <p style={{ ...P, margin: 0 }}>Please be aware that the Platform sometimes contains links to other sites not governed by this Privacy Policy — including advertisers, blogs, content sponsorships, vendor services, and social networks. Rodinia Technologies makes no representations regarding how your information is stored or used on third-party servers. We recommend that you review the applicable privacy statements of each third-party site linked from the Platform.</p>
            </Card>

            {/* 8. Children */}
            <Card>
              <Heading num={8} title="Children" id="children" icon={Shield} />
              <InfoBox type="warning">To use the Platform, you must be a minimum of <strong style={{ color: '#fff' }}>18 years of age</strong>. If local laws require you to be older, that older age shall apply as the applicable minimum age.</InfoBox>
              <p style={{ ...P, margin: 0 }}>If you are under the age of 18 or the age of majority in your jurisdiction, you must use the Platform under the supervision of your parent, legal guardian, or responsible adult.</p>
            </Card>

            {/* 9. Retention */}
            <Card>
              <Heading num={9} title="Retention of Personal Information" id="retention" icon={Database} />
              <p style={P}>Your Personal Information will not be retained by Rodinia Technologies any longer than it is necessary for the purposes for which the Personal Information is processed and/or in accordance with legal, regulatory, contractual, or statutory obligations as applicable.</p>
              <p style={{ ...P, margin: 0 }}>At the expiry of such periods, your Personal Information will be deleted or archived in compliance with applicable laws.</p>
            </Card>

            {/* 10. Your rights */}
            <Card>
              <Heading num={10} title="Controlling Your Information" id="your-rights" icon={Lock} />
              <p style={P}>You have the right to invoke your rights as a data principal in relation to your Personal Information processed by Rodinia Technologies. You may contact us to:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { icon: '✏️', right: 'Rectify, update, or correct your Personal Information' },
                  { icon: '👁️', right: 'Obtain confirmation on whether your Personal Information is processed' },
                  { icon: '📦', right: 'Access your data or exercise your right to data portability' },
                  { icon: '🛑', right: 'Restrict continuing disclosure of your Personal Information to third parties' },
                ].map(item => (
                  <div key={item.right} style={{ display: 'flex', gap: 12, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.62)', lineHeight: 1.6 }}>{item.right}</span>
                  </div>
                ))}
              </div>
              <p style={{ ...P, margin: 0 }}>You may delete your account at any time through the Settings page. Please note that the above-mentioned rights are not absolute and are subject to limitations under applicable data protection laws.</p>
            </Card>

            {/* 11. Security */}
            <Card>
              <Heading num={11} title="Confidentiality & Security" id="security" icon={Lock} />
              <p style={P}>The security and confidentiality of your Personal Information is important to us. Rodinia Technologies has invested significant resources to protect the safekeeping and confidentiality of your personal data. When using external service providers acting as processors, we require that they adhere to the same standards as Rodinia Technologies.</p>
              <p style={{ ...P, margin: 0 }}>We seek to ensure compliance with the requirements of the Information Technology Act, 2000 and Rules made thereunder. We have physical, electronic, and procedural safeguards that comply with laws prevalent in India. By accepting these terms, you agree that the standards and practices we have implemented are reasonable and sufficient for the protection of your Personal Information.</p>
            </Card>

            {/* 12. Social media */}
            <Card>
              <Heading num={12} title="Social Media" id="social-media" icon={Globe} />
              <p style={P}>Rodinia Technologies operates channels, pages, and accounts on some social media sites to inform, assist, and engage with customers. We monitor and record comments and posts made on these channels about ourselves in order to improve our products and services.</p>
              <InfoBox type="warning">
                <strong style={{ color: '#fff' }}>Please do not communicate the following through social media:</strong>
                <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none' }}>
                  <li style={{ marginBottom: 6 }}>• Sensitive personal data including racial or ethnic origin, political opinions, religious or philosophical beliefs, genetic or biometric data, health data, or sexual orientation.</li>
                  <li>• Excessive, inappropriate, offensive, or defamatory content about any person or entity.</li>
                </ul>
              </InfoBox>
            </Card>

            {/* 13. Changes */}
            <Card>
              <Heading num={13} title="Changes to this Policy" id="changes" icon={RefreshCw} />
              <p style={{ ...P, margin: 0 }}>Rodinia Technologies reserves the right to update, change, or modify this Privacy Policy at any time. The Privacy Policy shall come into effect from the date of publication of such update, change, or modification. We encourage you to periodically review this page for the latest information on our privacy practices.</p>
            </Card>

            {/* 14. Disclaimer */}
            <Card>
              <Heading num={14} title="Disclaimer" id="disclaimer" icon={AlertTriangle} />
              <p style={P}>Rodinia Technologies does not store any account-related information or any credit/debit card details. Rodinia Technologies shall not be liable for any loss or damage sustained by Users as a result of any disclosure (inadvertent or otherwise) of information concerning the User's account or payment cards in the course of any online transactions.</p>
              <p style={{ ...P, margin: 0 }}>In case any Personal Information is shared by you with Rodinia Technologies which was not requested during registration, Rodinia Technologies will not be liable for any information security breach or disclosure in relation to such information.</p>
            </Card>

            {/* 15. Grievance */}
            <Card accent>
              <Heading num={15} title="Grievance Officer" id="grievance" icon={Mail} />
              <p style={P}>In case you have any complaints and/or grievances in relation to the processing of your Personal Information, you can send your complaints via email to our Grievance Officer:</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: BG3, border: `1px solid ${GOLD_BDR}`, borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={22} color={RED} />
                </div>
                <div>
                  <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5', marginBottom: 4 }}>Grievance Officer — Rodinia Technologies</div>
                  <div style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Chennai, Tamil Nadu, India</div>
                  <a href="mailto:admin@silverscreens.in" style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: GOLD, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <Mail size={15} color={GOLD} /> admin@silverscreens.in
                  </a>
                </div>
              </div>
            </Card>

            {/* Footer */}
            <div style={{ textAlign: 'center' as const, padding: '24px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
              <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>© 2026 Rodinia Technologies Pvt. Ltd. All rights reserved.</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                {[{ label: 'Cookie Policy', href: '/cookie-policy' }, { label: 'Terms & Conditions', href: '/terms' }, { label: 'Contact Us', href: '/contact' }].map(l => (
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