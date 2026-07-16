'use client'

import { useState, useEffect } from 'react'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import Link from 'next/link'
import {
  Mail, Phone, MapPin, Headphones, Send, User, FileText,
  MessageSquare, ShieldCheck, Clock, Users, Heart, ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
/* ── CONSTANTS ───────────────────────────────────────────────── */
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BG4    = '#1C2030'
const BARLOW = '"Barlow Condensed", sans-serif'
const BEBAS  = "'Bebas Neue', sans-serif"

/* ── QUICK ANSWERS ───────────────────────────────────────────── */
const QUICK_FAQS = [
  { q: 'How do I create an account?', href: '/faq#gs2' },
  { q: 'How do I apply for a casting call?', href: '/faq#ft1' },
  { q: 'How is my data protected?', href: '/faq#ac5' },
  { q: 'Can we contact you for collaborations?', href: '/contact' },
  { q: 'Where can I find platform guidelines?', href: '/faq' },
]

/* ── INPUT FIELD ─────────────────────────────────────────────── */
function InputField({
  placeholder, icon: Icon, type = 'text', multiline = false, value, onChange,
}: {
  placeholder: string
  icon: React.ElementType
  type?: string
  multiline?: boolean
  value: string
  onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const base = {
    width: '100%', background: BG3,
    border: `1px solid ${focused ? 'rgba(200,32,42,0.4)' : 'rgba(255,255,255,0.09)'}`,
    borderRadius: 7, color: '#fff',
    fontSize: 16, fontFamily: BARLOW,
    outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ position: 'relative' }}>
      {!multiline ? (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...base, padding: '13px 40px 13px 14px' }}
        />
      ) : (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={6}
          style={{ ...base, padding: '13px 40px 13px 14px', resize: 'vertical' as const, lineHeight: 1.6 }}
        />
      )}
      <Icon
        size={15}
        color={focused ? RED : 'rgba(255,255,255,0.25)'}
        style={{ position: 'absolute', right: 13, top: multiline ? 14 : '50%', transform: multiline ? 'none' : 'translateY(-50%)', transition: 'color 0.2s', pointerEvents: 'none' }}
        strokeWidth={1.8}
      />
    </div>
  )
}

/* ── CONTACT INFO ROW ────────────────────────────────────────── */
function ContactRow({ icon: Icon, label, desc, value, href, isLink = false }: {
  icon: React.ElementType
  label: string
  desc: string
  value: string
  href?: string
  isLink?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 16,
      padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={17} color={RED} strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
        {isLink ? (
          <Link href={href ?? '#'} style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: RED, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            {value} <ExternalLink size={13} />
          </Link>
        ) : (
          <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: RED, lineHeight: 1.55, whiteSpace: 'pre-line' as const }}>{value}</div>
        )}
      </div>
    </div>
  )
}

/* ── MAIN PAGE ───────────────────────────────────────────────── */
export default function ContactPage() {
  const router = useRouter()
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName,   setUserName]   = useState('')
  const [userType,   setUserType]   = useState('')

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u?.loggedIn) {
        setIsLoggedIn(true)
        setUserName(u.name ?? '')
        setUserType(u.userType ?? u.role ?? '')
      }
    } catch {}
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    window.location.replace('/login')
  }

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) return
    setSent(true)
  }

  return (
    <div style={{ background: BG, color: '#F5F5F5', fontFamily: BARLOW, minHeight: '100vh' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(5,5,5,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', height: 64, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 32 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 28, alignItems: 'center' }}>
          {[['/', 'Home'], ['/about', 'About Us'], ['/explore-talents', 'Explore Talents'], ['/casting-calls', 'Casting Calls'], ['/pricing', 'Pricing Plans'], ['/faqs', 'FAQs'], ['/contact', 'Contact Us']].map(([href, label]) => (
            <span key={href} onClick={() => router.push(href)} style={{ fontSize: 16, cursor: 'pointer', color: href === '/contact' ? RED : 'rgba(255,255,255,0.7)', fontWeight: href === '/contact' ? 700 : 400 }}>{label}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>Hi, {userName.split(' ')[0]}</span>
              <button onClick={() => router.push(userType === 'agency' ? '/agency/dashboard' : '/dashboard')} style={{ background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>Dashboard</button>
              <button onClick={handleLogout} style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '8px 18px', fontSize: 16, fontFamily: BARLOW, cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/login')} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '8px 18px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>LOG IN</button>
              <button onClick={() => router.push('/signup')} style={{ background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>SIGN UP</button>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 340, display: 'flex', alignItems: 'center', marginTop: 64 }}>
        <img
          src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600&q=80"
          alt="" aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.96) 45%, rgba(5,5,5,0.55) 80%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,1) 0%, transparent 60%)' }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '100px 80px 60px', maxWidth: 600 }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: RED }} />
            <span style={{ fontSize: 14, color: RED, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const }}>Contact Us</span>
          </div>

          <h1 style={{ fontFamily: BEBAS, fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 400, letterSpacing: 2, color: '#fff', lineHeight: 1, margin: '0 0 18px' }}>
            WE'D LOVE TO<br />HEAR FROM YOU<span style={{ color: RED }}>.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW, lineHeight: 1.65, margin: '0 0 32px', maxWidth: 420 }}>
            Have a question, suggestion, or need support?<br />Our team is here to help you every step of the way.
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
            <a href="#contact-form" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: RED, color: '#fff', textDecoration: 'none',
              fontSize: 16, fontFamily: BARLOW, fontWeight: 700,
              padding: '12px 24px', borderRadius: 7, letterSpacing: 0.5,
            }}>
              <Mail size={16} /> Send us a Message
            </a>
            <Link href="/faq" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', textDecoration: 'none',
              fontSize: 16, fontFamily: BARLOW, fontWeight: 600,
              padding: '12px 24px', borderRadius: 7,
            }}>
              <Headphones size={16} /> Visit Help Center
            </Link>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section id="contact-form" style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* ── LEFT: CONTACT FORM ── */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '32px' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: RED, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 8 }}>Get in Touch</div>
            <h2 style={{ fontFamily: BEBAS, fontSize: 36, letterSpacing: 1.5, color: '#fff', margin: '0 0 8px' }}>Send us a message</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.6, margin: 0 }}>Fill out the form and our team will get back to you as soon as possible.</p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 27, fontFamily: BEBAS, color: '#fff', letterSpacing: 1, marginBottom: 10 }}>Message Sent!</div>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, lineHeight: 1.65 }}>
                Thank you for reaching out. Our team will get back to you within 24 business hours.
              </p>
              <button onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage('') }} style={{ marginTop: 20, background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: BARLOW, padding: '9px 20px', borderRadius: 6, cursor: 'pointer' }}>
                Send another message
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {/* Name + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <InputField placeholder="Full Name"      icon={User}        value={name}    onChange={setName}    />
                <InputField placeholder="Email Address"  icon={Mail}        type="email"    value={email}   onChange={setEmail}   />
              </div>
              <InputField   placeholder="Subject"        icon={FileText}    value={subject} onChange={setSubject} />
              <InputField   placeholder="Your Message"   icon={MessageSquare} multiline     value={message} onChange={setMessage} />

              <button
                onClick={handleSubmit}
                disabled={!name || !email || !subject || !message}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: (!name || !email || !subject || !message) ? 'rgba(200,32,42,0.4)' : RED,
                  border: 'none', color: '#fff', borderRadius: 7, padding: '14px',
                  fontSize: 18, fontFamily: BARLOW, fontWeight: 700,
                  letterSpacing: 1, cursor: (!name || !email || !subject || !message) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <Send size={17} /> Send Message
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: -4 }}>
                <ShieldCheck size={13} color="rgba(255,255,255,0.25)" />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>We respect your privacy. Your information is safe with us.</span>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: CONTACT DETAILS ── */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '32px' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: RED, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 8 }}>Other Ways to Reach Us</div>
            <h2 style={{ fontFamily: BEBAS, fontSize: 36, letterSpacing: 1.5, color: '#fff', margin: 0 }}>Contact us directly</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' as const }}>
            <ContactRow
              icon={Mail}
              label="Email Us"
              desc="Drop us an email anytime. We aim to respond within 24 hours."
              value="admin@silverscreens.in"
              href="mailto:admin@silverscreens.in"
            />
            <ContactRow
              icon={Phone}
              label="Call Us"
              desc="Speak with our support team during business hours."
              value={"+91 98765 43210\nMon – Fri, 10:00 AM – 6:00 PM IST"}
            />
            <ContactRow
              icon={MapPin}
              label="Visit Us"
              desc="Come say hello at our office."
              value={"SilverScreens Technologies Pvt. Ltd.\nAndheri West, Mumbai – 400058\nMaharashtra, India"}
            />
            <ContactRow
              icon={Headphones}
              label="Help Center"
              desc="Find answers to common questions in our Help Center."
              value="Go to Help Center"
              href="/faq"
              isLink
            />
          </div>

          {/* Map placeholder */}
          <div style={{
            marginTop: 20, borderRadius: 10, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)', height: 160,
            background: BG3, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <MapPin size={28} color="rgba(200,32,42,0.4)" strokeWidth={1.5} />
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', fontFamily: BARLOW, marginTop: 6 }}>Andheri West, Mumbai</div>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: RED, fontFamily: BARLOW, textDecoration: 'none', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Open in Maps <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={{ maxWidth: 1200, margin: '24px auto 0', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { icon: Clock,    title: 'Quick Response',    desc: 'We strive to reply to all inquiries within 24 business hours.' },
            { icon: Users,    title: 'Human Support',     desc: 'Talk to real people who understand your needs.' },
            { icon: ShieldCheck, title: 'Trusted & Secure', desc: 'Your information is handled with the highest care.' },
            { icon: Heart,    title: 'Here to Help',      desc: "Whether you're a talent or an agency, we're here for you." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '24px 20px', textAlign: 'center' as const }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(200,32,42,0.09)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Icon size={20} color={RED} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 18, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM: QUICK ANSWERS + CTA ── */}
      <section style={{ maxWidth: 1200, margin: '24px auto 0', padding: '0 40px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Quick Answers */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '28px 32px' }}>
          <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: RED, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 10 }}>Common Questions</div>
          <h3 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1.5, color: '#fff', margin: '0 0 20px' }}>Quick Answers</h3>
          <div style={{ display: 'flex', flexDirection: 'column' as const }}>
            {QUICK_FAQS.map((faq, i) => (
              <Link key={faq.q} href={faq.href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                padding: '14px 0', textDecoration: 'none',
                borderBottom: i < QUICK_FAQS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
                onMouseEnter={e => (e.currentTarget.querySelector('span') as HTMLElement).style.color = RED}
                onMouseLeave={e => (e.currentTarget.querySelector('span') as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
              >
                <span style={{ fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s', lineHeight: 1.4 }}>{faq.q}</span>
                <ChevronRight size={16} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
              </Link>
            ))}
          </div>
          <Link href="/faq" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20,
            color: RED, textDecoration: 'none', fontSize: 16, fontFamily: BARLOW, fontWeight: 700,
          }}>
            View all FAQs <ExternalLink size={14} />
          </Link>
        </div>

        {/* CTA Card */}
        <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', minHeight: 320 }}>
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80"
            alt="" aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.7) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '40px 36px', height: '100%', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }}>
            <h3 style={{ fontFamily: BEBAS, fontSize: 38, letterSpacing: 2, color: '#fff', lineHeight: 1.05, margin: '0 0 14px' }}>
              LET'S BUILD THE FUTURE<br />OF STORYTELLING<span style={{ color: RED }}>.</span>
            </h3>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW, lineHeight: 1.65, margin: '0 0 28px', maxWidth: 340 }}>
              Join thousands of talents and production houses who trust SilverScreens.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
              <Link href="/signup?for=talent" style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: RED, color: '#fff', textDecoration: 'none',
                fontSize: 16, fontFamily: BARLOW, fontWeight: 700,
                padding: '11px 22px', borderRadius: 7,
              }}>
                <User size={15} /> Join as Talent
              </Link>
              <Link href="/signup?for=agency" style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', textDecoration: 'none',
                fontSize: 16, fontFamily: BARLOW, fontWeight: 600,
                padding: '11px 22px', borderRadius: 7,
              }}>
                <Users size={15} /> Join as Agency
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}