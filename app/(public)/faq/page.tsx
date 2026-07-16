'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronUp, Plus, Minus, Mail } from 'lucide-react'

/* ── CONSTANTS ───────────────────────────────────────────────── */
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BG4    = '#1C2030'
const BARLOW = '"Barlow Condensed", sans-serif'
const BEBAS  = "'Bebas Neue', sans-serif"

/* ── CATEGORIES ──────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'getting-started',
    icon: '🚀',
    label: 'Getting Started',
    desc: 'Learn the basics of SilverScreens',
  },
  {
    id: 'for-talents',
    icon: '🎭',
    label: 'For Talents',
    desc: 'Profile, applications and opportunities',
  },
  {
    id: 'for-agencies',
    icon: '🏢',
    label: 'For Agencies',
    desc: 'Posting casts, managing applications',
  },
  {
    id: 'account',
    icon: '⚙️',
    label: 'Account & Settings',
    desc: 'Account settings and privacy',
  },
  {
    id: 'payments',
    icon: '💳',
    label: 'Payments & Billing',
    desc: 'Plans, subscriptions and billing info',
  },
  {
    id: 'safety',
    icon: '🛡️',
    label: 'Safety & Support',
    desc: 'Reporting, abuse and getting help',
  },
]

/* ── FAQ DATA ────────────────────────────────────────────────── */
const FAQS = [
  // ── GETTING STARTED
  {
    id: 'gs1', category: 'getting-started',
    q: 'What is SilverScreens?',
    a: "SilverScreens is India's trusted talent discovery and casting platform that connects aspiring talents with production houses and casting directors. We simplify the casting process and help the right talent get discovered.",
  },
  {
    id: 'gs2', category: 'getting-started',
    q: 'Can I register on SilverScreens using my social media account?',
    a: "We no longer offer social media login options, meaning you won't be able to sign in using your Facebook, Instagram or Google accounts. Instead, you can use your registered email address to reset your password via the 'Forgot Password?' feature.",
  },
  {
    id: 'gs3', category: 'getting-started',
    q: 'What is the minimum age to become a member?',
    a: 'There is no age restriction for setting up a SilverScreens account, but artists under the age of 18 must obtain parental consent.',
  },
  {
    id: 'gs4', category: 'getting-started',
    q: 'Can I register or apply for jobs even if I am not staying in India?',
    a: "Certainly — you can sign up and submit applications for job opportunities or auditions from anywhere. However, you'll need a valid mobile number for the verification process. To activate your account, you'll be required to confirm your email address or mobile number.",
  },
  {
    id: 'gs5', category: 'getting-started',
    q: 'Can I register in multiple categories?',
    a: "You have the option to sign up as either an Actor/Model, Singer/Musician, or Anchor/Voice-over Artist without needing separate accounts. However, for all other categories, you will be required to create multiple accounts using distinct email addresses.",
  },

  // ── FOR TALENTS
  {
    id: 'ft1', category: 'for-talents',
    q: 'How to apply for jobs on SilverScreens?',
    a: "To apply for jobs, first join as a member and create a comprehensive portfolio. Once done, you'll have access to relevant job listings on your dashboard and can apply with a single click.",
  },
  {
    id: 'ft2', category: 'for-talents',
    q: 'How can I check the status of my job applications?',
    a: "You can monitor the progress of your applications by visiting the 'Applied For' section in your dashboard. 'Application Sent' means your application has been transmitted to the recruiter. 'Application Viewed' means the recruiter has received it. 'Profile Viewed' means the recruiter has examined your profile. 'Contact Viewed' means the recruiter has checked your contact details and may reach out directly.",
  },
  {
    id: 'ft3', category: 'for-talents',
    q: 'How to find jobs on SilverScreens?',
    a: "You can find the most appropriate job listings in the 'Jobs for You' section of your dashboard. We'll also keep you informed through Job Alert Mailers and app notifications. You can also use our Search feature to discover opportunities by applying different filters.",
  },
  {
    id: 'ft4', category: 'for-talents',
    q: 'How will recruiters contact me?',
    a: 'Recruiters will contact you using the mobile number or email address you have provided. You can add additional phone numbers or update your contact information at any time.',
  },
  {
    id: 'ft5', category: 'for-talents',
    q: 'How to increase my portfolio views?',
    a: "To capture the attention of top recruiters, apply for a wide range of job openings. We also suggest finalising your portfolio before initiating any job applications — a complete profile significantly improves your chances of being shortlisted.",
  },
  {
    id: 'ft6', category: 'for-talents',
    q: 'How can I update my portfolio or personal information?',
    a: "You can enhance your portfolio at any time by adding photos, videos, experience, education, and additional details. Adjustments to contact information and privacy preferences can be made within the 'Settings' section.",
  },
  {
    id: 'ft7', category: 'for-talents',
    q: 'Will all my uploaded images be visible to recruiters?',
    a: "The team reviews every image you submit. If an uploaded image breaches our guidelines — for instance, if it's not your own, contains offensive content, or reveals personal information like your contact number or social media handles — it will be rejected and won't be publicly visible.",
  },
  {
    id: 'ft8', category: 'for-talents',
    q: 'Do I have to pay any commission if I am selected for a job or project?',
    a: 'You are not required to pay any commissions to us for any projects you obtain through the SilverScreens portal.',
  },
  {
    id: 'ft9', category: 'for-talents',
    q: 'What are my chances of getting placed?',
    a: 'Your chances improve significantly with a complete portfolio and consistent applications. Keep applying to opportunities that align with your profile, stay active on the platform, and update your portfolio regularly to stay visible to recruiters.',
  },

  // ── FOR AGENCIES
  {
    id: 'fa1', category: 'for-agencies',
    q: 'How do I register as a recruiter on SilverScreens?',
    a: 'You can create your profile by visiting www.silverscreens.in or by using the SilverScreens mobile app, which is available on Android and iOS devices.',
  },
  {
    id: 'fa2', category: 'for-agencies',
    q: 'Can I contact aspirants for free?',
    a: 'No — you need to be a registered paid member to view aspirants\' contact details.',
  },
  {
    id: 'fa3', category: 'for-agencies',
    q: 'Can I edit a posted job?',
    a: "Yes, you can edit jobs posted by you. We strongly recommend ensuring all details are correct before posting, as errors may mislead aspirants.",
  },
  {
    id: 'fa4', category: 'for-agencies',
    q: 'Can I see how many talents have applied to my job?',
    a: "Within the 'View Applications' segment, you can review job applications and select potential candidates for consideration.",
  },
  {
    id: 'fa5', category: 'for-agencies',
    q: 'How do I contact the artists?',
    a: "You can access all applicants through the 'View Application' page. Contact details are available on each artist's profile. You can also shortlist and save them to 'My Talent' for future reference.",
  },
  {
    id: 'fa6', category: 'for-agencies',
    q: 'How to find artists on SilverScreens?',
    a: "Use the 'Talent Directory' to discover talent that matches your needs. You can refine your search using filters like category, language, gender, and location.",
  },
  {
    id: 'fa7', category: 'for-agencies',
    q: 'How to contact artists for auditions?',
    a: "Use the 'Contact' feature to invite artists to apply for your job openings. Filter by your requirements, identify suitable artists, and send them direct invitations to apply.",
  },
  {
    id: 'fa8', category: 'for-agencies',
    q: 'How do I check my remaining package limits?',
    a: "You can check your remaining limits (applicant count, search portfolio, and contact) from the Transaction History available in the menu.",
  },

  // ── ACCOUNT & SETTINGS
  {
    id: 'ac1', category: 'account',
    q: 'Can I change my category later?',
    a: 'Yes — you can change your category yourself, but only while your subscription is active.',
  },
  {
    id: 'ac2', category: 'account',
    q: 'Can I change my location after registration?',
    a: 'Yes — you can update your location yourself, but only while your subscription is active.',
  },
  {
    id: 'ac3', category: 'account',
    q: 'Can I change my phone number?',
    a: 'Yes — you can update your contact number yourself while your subscription is active. We recommend doing this as soon as you change your number so recruiters can reach you.',
  },
  {
    id: 'ac4', category: 'account',
    q: 'How can I change my password?',
    a: "You can reset your password using the 'Forgot Password' option, or update it through the 'Settings' menu.",
  },
  {
    id: 'ac5', category: 'account',
    q: "I don't want my SilverScreens profile or images to appear in Google Search.",
    a: "You can use the 'Privacy' setting within 'Settings' to prevent your images from appearing in search engine results.",
  },
  {
    id: 'ac6', category: 'account',
    q: "I don't want to receive emails or SMS.",
    a: "You can opt in or opt out of all or specific emails and SMS messages through the 'Settings' menu. We strongly recommend keeping this option ON so you don't miss any opportunity.",
  },
  {
    id: 'ac7', category: 'account',
    q: 'How to delete my account?',
    a: "You can delete your account from the Settings section. Please note that once deleted, this action cannot be reversed — you will need to create a new account if required.",
  },

  // ── PAYMENTS & BILLING
  {
    id: 'pb1', category: 'payments',
    q: 'How do I make payments on SilverScreens?',
    a: 'You can make payments using debit/credit cards, net banking, Google Pay, Paytm, and various other mobile wallets.',
  },
  {
    id: 'pb2', category: 'payments',
    q: 'Does SilverScreens have a refund policy?',
    a: 'Yes — you are eligible for a refund of your subscription amount if you cancel within 3 days from the date of registration. We also process refunds in situations where accidental duplicate payments occur due to technical issues.',
  },

  // ── SAFETY & SUPPORT
  {
    id: 'ss1', category: 'safety',
    q: 'How to report abuse?',
    a: 'SilverScreens is dedicated to helping all users prevent misuse of the platform. If you encounter any abusive content or behaviour, please report it to us at admin@silverscreens.in with relevant screenshots and details.',
  },
]

/* ── FAQ ITEM ────────────────────────────────────────────────── */
function FaqItem({ faq, isFirst }: { faq: typeof FAQS[0]; isFirst: boolean }) {
  const [open, setOpen] = useState(isFirst)

  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: open ? 'rgba(255,255,255,0.02)' : 'transparent',
      transition: 'background 0.2s',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '18px 24px', textAlign: 'left' as const,
        }}
      >
        {/* +/- icon */}
        <div style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          background: open ? 'rgba(200,32,42,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? 'rgba(200,32,42,0.3)' : 'rgba(255,255,255,0.1)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {open
            ? <Minus size={13} color={RED} strokeWidth={2.5} />
            : <Plus  size={13} color="rgba(255,255,255,0.4)" strokeWidth={2.5} />}
        </div>
        <span style={{
          fontSize: 17, fontFamily: BARLOW, fontWeight: 600,
          color: open ? '#fff' : 'rgba(255,255,255,0.75)', flex: 1, lineHeight: 1.4,
        }}>{faq.q}</span>
        {open
          ? <ChevronUp   size={16} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
          : <ChevronDown size={16} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />}
      </button>

      {open && (
        <div style={{ padding: '0 24px 20px 66px' }}>
          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW,
            lineHeight: 1.75, margin: 0,
          }}>{faq.a}</p>
        </div>
      )}
    </div>
  )
}

/* ── CATEGORY CARD ───────────────────────────────────────────── */
function CategoryCard({ cat, active, onClick }: {
  cat: typeof CATEGORIES[0]; active: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick} style={{
      background: active ? 'rgba(200,32,42,0.1)' : BG2,
      border: `1px solid ${active ? 'rgba(200,32,42,0.35)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 10, padding: '18px 16px',
      cursor: 'pointer', textAlign: 'center' as const,
      transition: 'all 0.2s', display: 'flex', flexDirection: 'column' as const,
      alignItems: 'center', gap: 8,
    }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,32,42,0.2)' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
    >
      <div style={{ fontSize: 28 }}>{cat.icon}</div>
      <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0.75)', lineHeight: 1.2 }}>{cat.label}</div>
      <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{cat.desc}</div>
    </button>
  )
}

/* ── MAIN PAGE ───────────────────────────────────────────────── */
export default function FaqPage() {
  const [search,      setSearch]      = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = FAQS
    if (activeCategory) list = list.filter(f => f.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(f =>
        f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      )
    }
    return list
  }, [search, activeCategory])

  // Group by category for display
  const grouped = useMemo(() => {
    const map: Record<string, typeof FAQS> = {}
    filtered.forEach(f => {
      if (!map[f.category]) map[f.category] = []
      map[f.category].push(f)
    })
    return map
  }, [filtered])

  const handleCategoryClick = (id: string) => {
    setActiveCategory(prev => prev === id ? null : id)
    setSearch('')
  }

  const isSearching = search.trim().length > 0

  return (
    <div style={{ background: BG, color: '#F5F5F5', fontFamily: BARLOW, minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 320, display: 'flex', alignItems: 'center' }}>
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80"
          alt="" aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.95) 40%, rgba(5,5,5,0.6) 80%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,1) 0%, transparent 60%)' }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '100px 80px 60px', maxWidth: 640 }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: RED }} />
            <span style={{ fontSize: 14, color: RED, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const }}>FAQs</span>
          </div>

          <h1 style={{ fontFamily: BEBAS, fontSize: 'clamp(44px, 6vw, 68px)', fontWeight: 400, letterSpacing: 2, color: '#fff', lineHeight: 1, margin: '0 0 16px' }}>
            Find Answers to<br />Common Questions<span style={{ color: RED }}>.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW, lineHeight: 1.65, margin: '0 0 28px', maxWidth: 460 }}>
            Everything you need to know about SilverScreens — for talents and agencies.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(18,24,33,0.92)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8, padding: '0 16px', maxWidth: 480,
            backdropFilter: 'blur(12px)',
          }}>
            <Search size={17} color="rgba(255,255,255,0.3)" strokeWidth={1.8} />
            <input
              placeholder="Search for answers…"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory(null) }}
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: '#fff', fontSize: 16, fontFamily: BARLOW,
                width: '100%', padding: '14px 0',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 18, lineHeight: 1, padding: 0 }}>✕</button>
            )}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY TOPIC ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px 0' }}>
        <h2 style={{ fontFamily: BARLOW, fontSize: 19, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 20, letterSpacing: 1, textTransform: 'uppercase' as const }}>Browse by Topic</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.id} cat={cat}
              active={activeCategory === cat.id}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>
      </section>

      {/* ── FAQ LIST ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 80px', display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>

        {/* Toolbar row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 12 }}>
          <div style={{ fontSize: 17, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>
            {isSearching
              ? <><span style={{ color: '#fff', fontWeight: 700 }}>{filtered.length}</span> results for "<span style={{ color: GOLD }}>{search}</span>"</>
              : activeCategory
                ? <><span style={{ color: '#fff', fontWeight: 700 }}>{filtered.length}</span> questions in <span style={{ color: '#fff', fontWeight: 700 }}>{CATEGORIES.find(c => c.id === activeCategory)?.label}</span></>
                : <><span style={{ color: '#fff', fontWeight: 700 }}>{FAQS.length}</span> questions across all topics</>
            }
          </div>
          {(activeCategory || isSearching) && (
            <button
              onClick={() => { setActiveCategory(null); setSearch('') }}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 14px', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}
            >
              Show all questions ✕
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 24, fontFamily: BEBAS, color: '#fff', letterSpacing: 1, marginBottom: 10 }}>No results found</div>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Try different keywords or browse by topic above</p>
            <button onClick={() => { setSearch(''); setActiveCategory(null) }} style={{ background: RED, border: 'none', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, padding: '10px 24px', borderRadius: 6, cursor: 'pointer' }}>Clear Search</button>
          </div>
        ) : isSearching ? (
          /* Search results — flat list */
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
            {filtered.map((faq, i) => <FaqItem key={faq.id} faq={faq} isFirst={i === 0} />)}
          </div>
        ) : (
          /* Grouped by category */
          Object.entries(grouped).map(([catId, faqs]) => {
            const cat = CATEGORIES.find(c => c.id === catId)
            if (!cat) return null
            return (
              <div key={catId}>
                {/* Category heading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>
                    {cat.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{cat.label}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{faqs.length} question{faqs.length !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)', marginLeft: 8 }} />
                </div>
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
                  {faqs.map((faq, i) => <FaqItem key={faq.id} faq={faq} isFirst={false} />)}
                </div>
              </div>
            )
          })
        )}
      </section>

      {/* ── STILL HAVE QUESTIONS ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto 80px', padding: '0 40px' }}>
        <div style={{
          background: BG2, border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '32px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
          flexWrap: 'wrap' as const,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
              🎧
            </div>
            <div>
              <div style={{ fontSize: 24, fontFamily: BEBAS, letterSpacing: 1.5, color: '#fff', marginBottom: 4 }}>STILL HAVE QUESTIONS?</div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>Our support team is here to help you.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: RED, color: '#fff', textDecoration: 'none',
              fontSize: 16, fontFamily: BARLOW, fontWeight: 700,
              padding: '11px 24px', borderRadius: 7, letterSpacing: 0.5,
            }}>
              🎧 Contact Support
            </Link>
            <a href="mailto:admin@silverscreens.in" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'none', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', textDecoration: 'none',
              fontSize: 16, fontFamily: BARLOW, fontWeight: 600,
              padding: '11px 24px', borderRadius: 7,
            }}>
              <Mail size={15} /> Email Us
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}