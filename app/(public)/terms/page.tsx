'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileText, ChevronRight, Calendar, ChevronUp, ChevronLeft,
  Shield, Users, Lock, Globe, AlertTriangle, Info,
  CreditCard, RefreshCw, Mail, Gavel, Star, Building,
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
  { id: 'acceptance',      num: 1,  title: 'Acceptance of Terms',               icon: FileText    },
  { id: 'definitions',     num: 2,  title: 'Definitions',                        icon: FileText    },
  { id: 'eligibility',     num: 3,  title: 'Eligibility',                        icon: Users       },
  { id: 'account',         num: 4,  title: 'Account Registration & Security',    icon: Lock        },
  { id: 'platform-use',    num: 5,  title: 'Use of the Platform',                icon: Globe       },
  { id: 'aspirant-terms',  num: 6,  title: 'Aspirant-Specific Terms',            icon: Star        },
  { id: 'agency-terms',    num: 7,  title: 'Agency-Specific Terms',              icon: Building    },
  { id: 'profiles',        num: 8,  title: 'Profiles & Content',                 icon: Users       },
  { id: 'casting',         num: 9,  title: 'Casting Calls & Applications',       icon: FileText    },
  { id: 'subscription',    num: 10, title: 'Subscription & Payments',            icon: CreditCard  },
  { id: 'refund',          num: 11, title: 'Refund Policy',                      icon: RefreshCw   },
  { id: 'ip',              num: 12, title: 'Intellectual Property',              icon: Shield      },
  { id: 'privacy',         num: 13, title: 'Privacy & Data Protection',          icon: Lock        },
  { id: 'prohibited',      num: 14, title: 'Prohibited Activities',              icon: AlertTriangle },
  { id: 'disclaimer',      num: 15, title: 'Disclaimer of Warranties',           icon: AlertTriangle },
  { id: 'liability',       num: 16, title: 'Limitation of Liability',            icon: Shield      },
  { id: 'indemnification', num: 17, title: 'Indemnification',                    icon: Shield      },
  { id: 'termination',     num: 18, title: 'Termination',                        icon: AlertTriangle },
  { id: 'governing',       num: 19, title: 'Governing Law & Disputes',           icon: Gavel       },
  { id: 'changes',         num: 20, title: 'Changes to Terms',                   icon: RefreshCw   },
  { id: 'contact',         num: 21, title: 'Contact Us',                         icon: Mail        },
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

export default function TermsPage() {
  const router = useRouter()
  const [active, setActive] = useState('acceptance')
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
          <span style={{ fontSize: 14, fontFamily: BARLOW, color: GOLD, fontWeight: 700 }}>Terms & Conditions</span>
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
                <FileText size={17} color={RED} />
              </div>
              <div>
                <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1.5, color: '#F5F5F5', lineHeight: 1 }}>TERMS & CONDITIONS</div>
                <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{SECTIONS.length} sections</div>
              </div>
            </div>
          </div>
          <nav style={{ flex: 1, overflowY: 'auto' as const, padding: '10px 10px', scrollbarWidth: 'none' as const }}>
            {SECTIONS.map(s => {
              const isActive = active === s.id
              return (
                <div key={s.id} onClick={() => scrollTo(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 9, cursor: 'pointer', marginBottom: 2, background: isActive ? GOLD_DIM : 'transparent', borderLeft: `3px solid ${isActive ? GOLD : 'transparent'}`, transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 13, fontFamily: BARLOW, fontWeight: 700, color: isActive ? GOLD : 'rgba(255,255,255,0.25)', flexShrink: 0, width: 24 }}>{s.num}.</span>
                  <span style={{ fontSize: 14, fontFamily: BARLOW, color: isActive ? GOLD : 'rgba(255,255,255,0.5)', fontWeight: isActive ? 700 : 400, lineHeight: 1.4 }}>{s.title}</span>
                </div>
              )
            })}
          </nav>
          <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
              Legal queries? Contact us at<br />
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
                  <FileText size={24} color={RED} />
                </div>
                <div>
                  <h1 style={{ fontFamily: BEBAS, fontSize: 42, letterSpacing: 3, color: '#F5F5F5', margin: 0, lineHeight: 1 }}>TERMS & CONDITIONS</h1>
                  <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Rodinia Technologies — SilverScreens Platform</div>
                </div>
              </div>
              <p style={{ ...P, margin: '0 0 14px', fontSize: 15 }}>
                Please read these Terms and Conditions carefully before using the SilverScreens platform. By accessing or using our services, you agree to be bound by these terms.
              </p>
              <InfoBox type="warning">
                <strong style={{ color: '#fff' }}>Important:</strong> By creating an account or using any part of the SilverScreens platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
              </InfoBox>
            </div>

            {/* 1. Acceptance */}
            <Card>
              <Heading num={1} title="Acceptance of Terms" id="acceptance" icon={FileText} />
              <p style={P}>These Terms and Conditions (<strong style={{ color: '#fff' }}>"Terms"</strong>) constitute a legally binding agreement between you and Rodinia Technologies (<strong style={{ color: '#fff' }}>"SilverScreens"</strong>, <strong style={{ color: '#fff' }}>"we"</strong>, <strong style={{ color: '#fff' }}>"us"</strong>, or <strong style={{ color: '#fff' }}>"our"</strong>) governing your access to and use of the SilverScreens platform, website, mobile applications, and all related services (collectively, the <strong style={{ color: '#fff' }}>"Platform"</strong>).</p>
              <p style={{ ...P, margin: 0 }}>By registering an account, accessing, or using the Platform in any manner, you agree to these Terms. These Terms apply to all users including Aspirants, Agencies, Administrators, and visitors. If you are using the Platform on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.</p>
            </Card>

            {/* 2. Definitions */}
            <Card>
              <Heading num={2} title="Definitions" id="definitions" icon={FileText} />
              <p style={P}>For the purposes of these Terms:</p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {[
                  { term: 'Platform', def: 'The SilverScreens website, mobile applications, and all related services operated by Rodinia Technologies.' },
                  { term: 'Aspirant', def: 'An individual who registers on the Platform as a talent — including actors, models, dancers, singers, directors, technicians, and other film/media professionals.' },
                  { term: 'Agency', def: 'A production house, casting agency, talent management company, advertising agency, OTT platform, broadcasting network, or any other organisation that registers to hire or discover talent.' },
                  { term: 'Profile', def: 'A user-created page on the Platform that showcases an Aspirant\'s or Agency\'s details, portfolio, and professional information.' },
                  { term: 'Casting Call', def: 'A job posting or opportunity created by an Agency on the Platform to find suitable Aspirants for a specific role or project.' },
                  { term: 'Subscription', def: 'A paid plan that grants access to premium features on the Platform for a specified duration.' },
                  { term: 'Content', def: 'Any text, images, videos, audio, documents, or other material uploaded, posted, or transmitted through the Platform.' },
                  { term: 'User', def: 'Any individual or entity that accesses or uses the Platform, including Aspirants, Agencies, and visitors.' },
                ].map(item => (
                  <div key={item.term} style={{ display: 'flex', gap: 0, background: BG3, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ width: 160, flexShrink: 0, background: GOLD_DIM, borderRight: `1px solid ${GOLD_BDR}`, padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: GOLD }}>{item.term}</span>
                    </div>
                    <div style={{ flex: 1, padding: '12px 16px' }}>
                      <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.62)', lineHeight: 1.6 }}>{item.def}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 3. Eligibility */}
            <Card>
              <Heading num={3} title="Eligibility" id="eligibility" icon={Users} />
              <p style={P}>To use the Platform, you must meet the following eligibility requirements:</p>
              <Bullet items={[
                'You must be at least 18 years of age. If you are under 18, you may only use the Platform under the supervision of a parent, legal guardian, or responsible adult.',
                'You must have the legal capacity to enter into a binding contract under the laws of your jurisdiction.',
                'You must not be barred from using the Platform under any applicable law.',
                'Agencies must be duly registered entities with valid business documentation.',
                'Aspirants must provide accurate and truthful information about their professional qualifications, experience, and skills.',
                'You must not have had a previous account suspended or terminated by SilverScreens for violation of these Terms.',
              ]} />
              <InfoBox>SilverScreens reserves the right to verify eligibility at any time and to refuse or revoke access if eligibility requirements are not met.</InfoBox>
            </Card>

            {/* 4. Account */}
            <Card>
              <Heading num={4} title="Account Registration & Security" id="account" icon={Lock} />
              <p style={P}>To access most features of the Platform, you must create an account. By registering, you agree to:</p>
              <Bullet items={[
                'Provide accurate, current, and complete information during the registration process.',
                'Maintain and promptly update your account information to keep it accurate and complete.',
                'Keep your password confidential and not share it with any third party.',
                'Be responsible for all activities that occur under your account.',
                'Immediately notify SilverScreens of any unauthorised use of your account or any other security breach.',
                'Not create more than one account per user type without prior written consent from SilverScreens.',
              ]} />
              <p style={{ ...P, margin: 0 }}>SilverScreens will not be liable for any loss or damage arising from your failure to comply with these security obligations. We reserve the right to disable any account if we believe it has been compromised or is being used in violation of these Terms.</p>
            </Card>

            {/* 5. Platform use */}
            <Card>
              <Heading num={5} title="Use of the Platform" id="platform-use" icon={Globe} />
              <p style={P}>The Platform is intended solely for legitimate professional use within the film, television, media, and entertainment industries. You agree to use the Platform only for lawful purposes and in a manner consistent with these Terms.</p>
              <Bullet items={[
                'Create and manage professional profiles showcasing your skills and experience.',
                'Search for and apply to casting calls and opportunities.',
                'Connect with industry professionals, agencies, and talent.',
                'Post casting calls and search for suitable talent (Agencies only).',
                'Access industry news, insights, and resources.',
              ]} />
              <p style={{ ...P, margin: 0 }}>You agree not to use the Platform for any purpose that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable. All interactions on the Platform must comply with applicable laws and professional standards of the entertainment industry.</p>
            </Card>

            {/* 6. Aspirant terms */}
            <Card>
              <Heading num={6} title="Aspirant-Specific Terms" id="aspirant-terms" icon={Star} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,166,74,0.06)', border: `1px solid ${GOLD_BDR}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                <Star size={15} color={GOLD} />
                <span style={{ fontSize: 14, fontFamily: BARLOW, color: GOLD, fontWeight: 700 }}>These terms apply specifically to Aspirants registered on the Platform</span>
              </div>
              <Bullet items={[
                'All information in your profile including name, age, photographs, showreel, experience, skills, and qualifications must be accurate and genuine. Misrepresentation may result in immediate account termination.',
                'By uploading photographs, videos, or other media to your profile, you grant SilverScreens a non-exclusive, royalty-free licence to display this content on the Platform for the purpose of talent discovery.',
                'You understand that SilverScreens does not guarantee employment, casting, or any specific outcome from using the Platform.',
                'You are solely responsible for the decisions you make regarding auditions, castings, and engagements. SilverScreens is not a party to any agreement between Aspirants and Agencies.',
                'You agree to conduct yourself professionally in all interactions with Agencies and other users on the Platform.',
                'The SilverScreens verified badge is issued at our discretion upon verification of identity and professional credentials. Obtaining the badge by providing false documents is a violation of these Terms.',
                'You must not apply to casting calls for which you do not meet the specified criteria.',
              ]} />
            </Card>

            {/* 7. Agency terms */}
            <Card>
              <Heading num={7} title="Agency-Specific Terms" id="agency-terms" icon={Building} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(200,32,42,0.06)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                <Building size={15} color={RED} />
                <span style={{ fontSize: 14, fontFamily: BARLOW, color: RED, fontWeight: 700 }}>These terms apply specifically to Agencies registered on the Platform</span>
              </div>
              <Bullet items={[
                'All information provided during Agency registration including company name, registration details, and contact information must be accurate and current.',
                'Casting calls posted on the Platform must be genuine, lawful opportunities with accurate details regarding compensation, project type, and requirements.',
                'You must not post misleading, fraudulent, or exploitative casting calls. Any opportunity that involves unpaid work must be clearly disclosed.',
                'You agree to treat all Aspirants with dignity and respect. Discrimination based on caste, religion, race, gender (beyond genuine role requirements), or any other protected characteristic is strictly prohibited.',
                'You must not use Aspirant contact details obtained through the Platform for purposes other than the specific casting call for which they applied.',
                'SilverScreens is not responsible for the outcome of any casting or hiring decision made through the Platform.',
                'Agencies are responsible for ensuring their casting processes comply with all applicable employment laws, labour regulations, and industry standards.',
                'Verified Agency status is subject to submission of valid business documents and is at the sole discretion of SilverScreens.',
              ]} />
            </Card>

            {/* 8. Profiles */}
            <Card>
              <Heading num={8} title="Profiles & Content" id="profiles" icon={Users} />
              <p style={P}>You are solely responsible for the content you post on the Platform. By submitting content, you represent and warrant that:</p>
              <Bullet items={[
                'You own or have the necessary rights to the content you post, including photographs, videos, and audio recordings.',
                'The content does not infringe any third party\'s intellectual property rights, privacy rights, or any other legal rights.',
                'The content is not defamatory, obscene, offensive, or otherwise in violation of any applicable law.',
                'Any photographs or videos featuring third parties have been obtained with their consent.',
                'The content accurately represents your professional capabilities and experience.',
              ]} />
              <InfoBox>Profile content is subject to review by our moderation team. Profiles found to contain false information, inappropriate content, or content belonging to another person will be removed and the account may be suspended or terminated without notice.</InfoBox>
            </Card>

            {/* 9. Casting */}
            <Card>
              <Heading num={9} title="Casting Calls & Applications" id="casting" icon={FileText} />
              <p style={P}>The Platform facilitates connections between Aspirants and Agencies. SilverScreens does not endorse or verify the legitimacy of any specific casting call beyond our stated verification processes.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: GOLD, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}><Star size={14} /> Aspirants acknowledge:</div>
                  <Bullet items={[
                    'Applying does not guarantee an audition, callback, or selection.',
                    'SilverScreens is not responsible for Agency conduct during the audition process.',
                    'Exercise caution and conduct your own due diligence before attending any audition.',
                    'SilverScreens takes no commission from fees paid to Aspirants by Agencies.',
                  ]} />
                </div>
                <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: RED, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}><Building size={14} /> Agencies acknowledge:</div>
                  <Bullet items={[
                    'Applications are subject to Aspirant consent and should be used solely for the advertised purpose.',
                    'Closed opportunities must be marked as such promptly.',
                    'Agencies must respond to shortlisted Aspirants in a timely and professional manner.',
                  ]} color={RED} />
                </div>
              </div>
            </Card>

            {/* 10. Subscription */}
            <Card>
              <Heading num={10} title="Subscription & Payments" id="subscription" icon={CreditCard} />
              <p style={P}>SilverScreens offers subscription plans for both Aspirants and Agencies. By subscribing, you agree to the following:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { title: 'Billing', icon: '💳', desc: 'Subscription fees are billed in advance for the selected plan duration (3, 6, or 12 months).' },
                  { title: 'Auto-Renewal', icon: '🔄', desc: 'Subscriptions do not auto-renew unless explicitly stated. You will be notified before your plan expires.' },
                  { title: 'Price Changes', icon: '📊', desc: 'SilverScreens reserves the right to modify pricing. Existing subscribers will be notified 30 days in advance.' },
                  { title: 'Taxes', icon: '🧾', desc: 'All prices are exclusive of applicable taxes (GST for India). International prices are in USD and tax-inclusive.' },
                ].map(item => (
                  <div key={item.title} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '16px 18px' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: GOLD, marginBottom: 5 }}>{item.title}</div>
                    <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 11. Refund */}
            <Card>
              <Heading num={11} title="Refund Policy" id="refund" icon={RefreshCw} />
              <InfoBox type="warning">All subscription payments are <strong style={{ color: '#fff' }}>non-refundable</strong> except as explicitly stated below or as required by applicable law.</InfoBox>
              <p style={P}>SilverScreens may consider refund requests only in the following limited circumstances:</p>
              <Bullet items={[
                'Duplicate payments made due to a technical error on our platform.',
                'Payment charged after cancellation confirmation was issued by SilverScreens.',
                'Platform downtime exceeding 72 consecutive hours during your active subscription period.',
              ]} />
              <p style={P}>Refund requests must be submitted within 7 days of the payment date by contacting <a href="mailto:admin@silverscreens.in" style={{ color: GOLD, textDecoration: 'none' }}>admin@silverscreens.in</a>. Approved refunds will be processed within 7–10 business days to the original payment method.</p>
              <p style={{ ...P, margin: 0 }}>Partial refunds for unused subscription periods are not available. Downgrading a subscription plan mid-cycle is not permitted.</p>
            </Card>

            {/* 12. IP */}
            <Card>
              <Heading num={12} title="Intellectual Property" id="ip" icon={Shield} />
              <p style={P}>The Platform and all its original content, features, and functionality — including but not limited to the SilverScreens name, logo, design, text, graphics, software, and code — are owned by Rodinia Technologies and protected by Indian and international intellectual property laws.</p>
              <p style={P}>You are granted a limited, non-exclusive, non-transferable, revocable licence to use the Platform in accordance with these Terms. You may not:</p>
              <Bullet items={[
                'Copy, reproduce, distribute, or create derivative works from any part of the Platform without prior written consent.',
                'Use our trademarks, logos, or brand elements without express written permission.',
                'Reverse engineer, decompile, or disassemble any software component of the Platform.',
                'Use automated tools, scrapers, bots, or similar technology to extract data from the Platform.',
                'Frame or mirror any portion of the Platform on another website without our consent.',
              ]} color={RED} />
              <p style={{ ...P, margin: 0 }}>Content you upload remains your intellectual property. By uploading content, you grant SilverScreens a non-exclusive, worldwide, royalty-free licence to use, display, and distribute that content solely for the purpose of operating and promoting the Platform.</p>
            </Card>

            {/* 13. Privacy */}
            <Card>
              <Heading num={13} title="Privacy & Data Protection" id="privacy" icon={Lock} />
              <p style={P}>Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our <Link href="/privacy-policy" style={{ color: GOLD, textDecoration: 'none' }}>Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>
              <p style={{ ...P, margin: 0 }}>By using the Platform, you consent to the collection and use of your data as described in our Privacy Policy. We comply with the Information Technology Act, 2000 and applicable data protection regulations. For users outside India, we take reasonable steps to ensure your data is handled in accordance with applicable international data protection standards.</p>
            </Card>

            {/* 14. Prohibited */}
            <Card>
              <Heading num={14} title="Prohibited Activities" id="prohibited" icon={AlertTriangle} />
              <p style={P}>You agree not to engage in any of the following prohibited activities:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  'Creating fake profiles or impersonating another person or entity',
                  'Uploading false, misleading, or fraudulent information or documents',
                  'Harassing, threatening, or intimidating other users',
                  'Posting casting calls for illegal, exploitative, or fraudulent purposes',
                  'Soliciting payments from Aspirants outside the Platform\'s subscription model',
                  'Sharing, selling, or misusing contact information obtained through the Platform',
                  'Using the Platform to distribute spam, malware, or unsolicited communications',
                  'Attempting to hack, disrupt, or gain unauthorised access to the Platform',
                  'Scraping or bulk-downloading user data from the Platform',
                  'Posting sexually explicit, violent, or otherwise inappropriate content',
                  'Discriminating against users based on protected characteristics',
                  'Using the Platform for any purpose that violates applicable laws',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, background: BG3, border: '1px solid rgba(200,32,42,0.12)', borderRadius: 8, padding: '11px 14px' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(200,32,42,0.15)', border: '1px solid rgba(200,32,42,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <span style={{ color: RED, fontSize: 10, fontWeight: 700 }}>✕</span>
                    </div>
                    <span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
              <InfoBox type="warning">Violation of any prohibited activity may result in immediate account suspension or termination without refund, and may be reported to appropriate legal authorities.</InfoBox>
            </Card>

            {/* 15. Disclaimer */}
            <Card>
              <Heading num={15} title="Disclaimer of Warranties" id="disclaimer" icon={AlertTriangle} />
              <p style={P}>The Platform is provided on an <strong style={{ color: '#fff' }}>"as is"</strong> and <strong style={{ color: '#fff' }}>"as available"</strong> basis without warranties of any kind, either express or implied.</p>
              <p style={P}>SilverScreens does not warrant that:</p>
              <Bullet items={[
                'The Platform will be uninterrupted, error-free, or free of viruses or other harmful components.',
                'The results or outcomes obtained from using the Platform will meet your expectations.',
                'The accuracy, completeness, or reliability of any content on the Platform.',
                'Any casting call or connection made through the Platform will result in employment or engagement.',
                'Aspirant profiles or Agency listings are free from errors or misrepresentations.',
              ]} />
              <p style={{ ...P, margin: 0 }}>To the maximum extent permitted by applicable law, SilverScreens disclaims all warranties, express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
            </Card>

            {/* 16. Liability */}
            <Card>
              <Heading num={16} title="Limitation of Liability" id="liability" icon={Shield} />
              <InfoBox type="warning">To the maximum extent permitted by applicable law, SilverScreens and its directors, employees, partners, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</InfoBox>
              <Bullet items={[
                'Loss of profits, revenue, data, or business opportunities.',
                'Any harm resulting from interactions between Aspirants and Agencies facilitated through the Platform.',
                'Any unauthorised access to or alteration of your transmissions or data.',
                'Any conduct or content of any third party on the Platform.',
                'Any failure of casting calls to result in employment or engagement.',
                'Technical failures, service interruptions, or data loss.',
              ]} color={RED} />
              <p style={{ ...P, margin: 0 }}>In no event shall SilverScreens's total liability to you for all claims exceed the amount you paid to SilverScreens in the twelve (12) months immediately preceding the claim, or ₹1,000 (whichever is greater).</p>
            </Card>

            {/* 17. Indemnification */}
            <Card>
              <Heading num={17} title="Indemnification" id="indemnification" icon={Shield} />
              <p style={{ ...P, margin: 0 }}>You agree to indemnify, defend, and hold harmless Rodinia Technologies and its officers, directors, employees, agents, licensors, and service providers from and against any claims, liabilities, damages, judgements, awards, losses, costs, expenses, or fees (including reasonable legal fees) arising out of or relating to your violation of these Terms, your use of the Platform, your content posted on the Platform, your violation of any applicable law, or your violation of any third party's rights.</p>
            </Card>

            {/* 18. Termination */}
            <Card>
              <Heading num={18} title="Termination" id="termination" icon={AlertTriangle} />
              <p style={P}>SilverScreens reserves the right to suspend, disable, or terminate your account and access to the Platform at any time, with or without notice, for any reason including but not limited to:</p>
              <Bullet items={[
                'Violation of these Terms or our Community Guidelines.',
                'Providing false or misleading information during registration or in your profile.',
                'Engaging in fraudulent, illegal, or harmful activities.',
                'Prolonged inactivity (accounts inactive for more than 24 months).',
                'At your request to delete your account.',
              ]} color={RED} />
              <p style={{ ...P, margin: 0 }}>Upon termination, your right to use the Platform ceases immediately. Termination does not entitle you to any refund of subscription fees. Sections relating to IP, liability, indemnification, and dispute resolution shall survive termination. You may delete your account at any time through the Settings page in your dashboard.</p>
            </Card>

            {/* 19. Governing */}
            <Card>
              <Heading num={19} title="Governing Law & Disputes" id="governing" icon={Gavel} />
              <p style={P}>These Terms shall be governed by and construed in accordance with the laws of India. The courts of <strong style={{ color: '#fff' }}>Chennai, Tamil Nadu</strong>, shall have exclusive jurisdiction over any disputes arising from or relating to these Terms or your use of the Platform.</p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 14 }}>
                {[
                  { step: '01', title: 'Good Faith Negotiation', desc: 'Before initiating any legal proceedings, both parties agree to attempt resolution through good faith negotiation for a period of 30 days.' },
                  { step: '02', title: 'Mediation', desc: 'If negotiation fails, either party may pursue mediation conducted by a mutually agreed mediator in Chennai, Tamil Nadu.' },
                  { step: '03', title: 'Arbitration', desc: 'Conducted in accordance with the Arbitration and Conciliation Act, 1996, with a single arbitrator appointed by mutual agreement.' },
                  { step: '04', title: 'Legal Proceedings', desc: 'As a last resort, either party may pursue the dispute through the courts of Chennai, Tamil Nadu.' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 16, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 18px', alignItems: 'flex-start' }}>
                    <div style={{ fontFamily: BEBAS, fontSize: 26, color: GOLD_BDR, letterSpacing: 1, flexShrink: 0, lineHeight: 1.1 }}>{item.step}</div>
                    <div>
                      <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: GOLD, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 20. Changes */}
            <Card>
              <Heading num={20} title="Changes to Terms" id="changes" icon={RefreshCw} />
              <p style={P}>SilverScreens reserves the right to modify these Terms at any time. When we make material changes, we will:</p>
              <Bullet items={[
                'Update the "Last Updated" date at the top of this page.',
                'Send a notification to your registered email address.',
                'Display a prominent notice on the Platform.',
              ]} />
              <p style={{ ...P, margin: 0 }}>Your continued use of the Platform after any modification constitutes your acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using the Platform and may request account deletion.</p>
            </Card>

            {/* 21. Contact */}
            <Card accent>
              <Heading num={21} title="Contact Us" id="contact" icon={Mail} />
              <p style={P}>If you have any questions, concerns, or complaints regarding these Terms and Conditions, please contact us:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: '📧', label: 'Email', value: 'admin@silverscreens.in', href: 'mailto:admin@silverscreens.in' },
                  { icon: '🌐', label: 'Website', value: 'www.silverscreens.in', href: 'https://www.silverscreens.in' },
                  { icon: '📍', label: 'Address', value: 'Rodinia Technologies, Chennai, Tamil Nadu, India', href: null },
                  { icon: '⚖️', label: 'Grievance Officer', value: 'admin@silverscreens.in', href: 'mailto:admin@silverscreens.in' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: 14, background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px' }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)', marginBottom: 3, letterSpacing: 0.5 }}>{item.label.toUpperCase()}</div>
                      {item.href
                        ? <a href={item.href} style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: GOLD, textDecoration: 'none' }}>{item.value}</a>
                        : <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: '#F5F5F5', lineHeight: 1.5 }}>{item.value}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <InfoBox>We endeavour to respond to all queries within <strong style={{ color: '#fff' }}>3 business days</strong>. For urgent matters, please mark your email subject as <strong style={{ color: '#fff' }}>"URGENT — Terms Query"</strong>.</InfoBox>
              </div>
            </Card>

            {/* Footer */}
            <div style={{ textAlign: 'center' as const, padding: '24px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
              <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>© 2026 Rodinia Technologies Pvt. Ltd. All rights reserved.</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                {[{ label: 'Privacy Policy', href: '/privacy-policy' }, { label: 'Cookie Policy', href: '/cookie-policy' }, { label: 'Contact Us', href: '/contact' }].map(l => (
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