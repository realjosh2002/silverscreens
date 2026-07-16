'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight, ChevronRight, ChevronLeft, Bookmark,
  MapPin, Calendar, Star, Play, Shield, Zap, Search,
  Lock, Users, TrendingUp,
} from 'lucide-react'
import { TALENT_CATEGORIES, SUBSCRIPTION_PLANS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

// ─── Mock data for display ───────────────────────────────────────────────────

const FEATURED_CATEGORIES = [
  { name: 'Actor', icon: '🎭', count: '12,345' },
  { name: 'Actress', icon: '⭐', count: '8,765' },
  { name: 'Director', icon: '🎬', count: '3,210' },
  { name: 'Dancer', icon: '💃', count: '4,321' },
  { name: 'Singer', icon: '🎤', count: '1,987' },
  { name: 'Anchor', icon: '📺', count: '2,109' },
  { name: 'Photographer', icon: '📸', count: '1,654' },
  { name: 'Model', icon: '👗', count: '5,432' },
]

const TRENDING_TALENTS = [
  { name: 'Meera Nair', role: 'Actress', city: 'Mumbai', color: 'from-rose-900 to-rose-700' },
  { name: 'Karthik Raj', role: 'Actor', city: 'Chennai', color: 'from-blue-900 to-blue-700' },
  { name: 'Sneha Iyer', role: 'Dancer', city: 'Hyderabad', color: 'from-purple-900 to-purple-700' },
  { name: 'Vikram Aditya', role: 'Actor', city: 'Bengaluru', color: 'from-amber-900 to-amber-700' },
  { name: 'Aisha Khan', role: 'Model', city: 'Delhi', color: 'from-teal-900 to-teal-700' },
]

const LATEST_CASTING_CALLS = [
  {
    title: 'Action Thriller Web Series',
    type: 'ACTION THRILLER',
    role: 'Looking for: Actor, Villain',
    city: 'Mumbai',
    date: '30 May 2025',
    color: 'from-gray-900 via-[#1a1206] to-gray-900',
    featured: true,
  },
  {
    title: 'Romantic Drama Film',
    type: 'ROMANTIC DRAMA',
    role: 'Looking for: Actress, Actor',
    city: 'Chennai',
    date: '28 May 2025',
    color: 'from-rose-950 via-pink-900 to-rose-950',
    featured: false,
  },
  {
    title: 'Reality Show Season 2',
    type: 'REALITY SHOW',
    role: 'Looking for: Anchor, Contestants',
    city: 'Delhi',
    date: '25 May 2025',
    color: 'from-gray-900 via-gray-800 to-gray-900',
    featured: false,
  },
]

const STATS = [
  { value: '50,000+', label: 'Verified Talents' },
  { value: '5,000+', label: 'Active Companies' },
  { value: '15,000+', label: 'Casting Calls Posted' },
  { value: '98%', label: 'Success Rate' },
]

const HERO_SLIDES = [
  {
    label: 'INDIA\'S MOST TRUSTED',
    headline: ['TALENT MARKETPLACE', 'FOR FILM & MEDIA'],
    highlight: 'FILM & MEDIA',
    sub: 'Connecting talented individuals with amazing opportunities in films, TV, web series, and more.',
    featured: { name: 'Arjun Verma', role: 'Actor' },
    image: '/hero-1.jpg',
    glow: 'rgba(180,50,50,0.15)',
  },
  {
    label: 'DISCOVER YOUR NEXT STAR',
    headline: ['THE ULTIMATE', 'CASTING PLATFORM'],
    highlight: 'CASTING PLATFORM',
    sub: 'Post casting calls and discover verified talent from across India and the world.',
    featured: { name: 'Priya Sharma', role: 'Director' },
    image: '/hero-2.jpg',
    glow: 'rgba(50,80,180,0.15)',
  },
  {
    label: 'BUILD YOUR LEGACY',
    headline: ['YOUR CAREER,', 'YOUR SPOTLIGHT'],
    highlight: 'YOUR SPOTLIGHT',
    sub: 'Create your professional profile and get discovered by top production houses and agencies.',
    featured: { name: 'Rahul Mehra', role: 'Model' },
    image: '/hero-3.jpg',
    glow: 'rgba(80,150,50,0.15)',
  },
  {
    label: 'YOUR STORY STARTS HERE',
    headline: ['JOIN THE', 'SILVERSCREENS FAMILY'],
    highlight: 'SILVERSCREENS FAMILY',
    sub: 'Thousands of talents and agencies already building their careers on SilverScreens.',
    featured: { name: 'Aisha Khan', role: 'Model' },
    image: '/hero-4.jpg',
    glow: 'rgba(100,50,180,0.15)',
  },
]

const WHY_US = [
  { icon: Shield, title: 'Verified & Trusted', desc: 'Every profile is verified for authenticity and quality, ensuring a safe platform for everyone.' },
  { icon: Zap, title: 'Faster Opportunities', desc: 'Advanced search and smart shortlisting help you find the right opportunities faster.' },
  { icon: Star, title: 'Smart AI Matching', desc: 'AI-powered matching connects the right talent with the right projects instantly.' },
  { icon: Lock, title: 'Secure & Private', desc: 'Your data is protected with industry-standard security and privacy practices.' },
  { icon: Users, title: 'Built for Industry', desc: 'Designed to meet the real-world needs of casting and production professionals.' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [slide, setSlide] = useState(0)
  const [talentScroll, setTalentScroll] = useState(0)
  const talentRef = useRef<HTMLDivElement>(null)

  // Auto-advance hero slider
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 4000)
    return () => clearInterval(t)
  }, [])

  const current = HERO_SLIDES[slide]

  function scrollTalents(dir: 'left' | 'right') {
    const el = talentRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 240 : -240, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#050505]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden transition-all duration-700"
        style={{ background: '#050505' }}
      >
        {/* Hero background image */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: `url(${current.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark overlay — left heavier for text readability */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, rgba(5,5,5,0.93) 0%, rgba(5,5,5,0.78) 40%, rgba(5,5,5,0.35) 65%, rgba(5,5,5,0.08) 100%)',
        }} />
        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{
          background: 'linear-gradient(to top, #050505, transparent)',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-0">
          <div className="grid lg:grid-cols-5 gap-8 items-center">

            {/* Left content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Label */}
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#C8202A]" />
                <span className="text-[#C8202A] text-xs font-semibold tracking-[0.25em] uppercase">
                  {current.label}
                </span>
              </div>

              {/* Heading */}
              <h1 className="leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400 }}>
                {current.headline.map((line, i) => (
                  <div key={i} className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl ${i === 0 ? '' : 'mt-1'}`}>
                    {line.includes(current.highlight) ? (
                      <>
                        {line.replace(current.highlight, '').trim() && (
                          <span className="text-white">
                            {line.split(current.highlight)[0]}
                          </span>
                        )}
                        <span className="text-[#C8202A]">{current.highlight}</span>
                        </>
                    ) : (
                      <span className="text-white">{line}</span>
                    )}
                  </div>
                ))}
              </h1>

              {/* Sub */}
              <p className="text-[#A8B0BD] text-base sm:text-lg max-w-lg leading-relaxed">
                {current.sub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-[#C8202A] hover:bg-[#e02530] text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-900/40 text-sm">
                  Join as Talent
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/signup?type=agency"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-[#F5F5F5] font-semibold rounded-xl transition-all text-sm hover:bg-white/5"
                >
                  Hire Talent
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Slider dots */}
              <div className="flex items-center gap-2 pt-4">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`transition-all rounded-full ${i === slide ? 'w-8 h-2 bg-[#C8202A]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right — Featured Talent Card */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <div className="glass-card gold-glow rounded-2xl p-5 w-64 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#C8202A] uppercase tracking-widest">
                    Featured Talent
                  </span>
                  <Star size={14} className="text-[#C8202A] fill-[#C8202A]" />
                </div>

                {/* Talent photo placeholder */}
                <div className={`w-full h-52 rounded-xl bg-gradient-to-b ${TRENDING_TALENTS[0].color} flex items-end p-4 overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="relative z-10">
                    <p className="text-white font-semibold text-lg leading-tight">{current.featured.name}</p>
                    <p className="text-[#A8B0BD] text-sm">{current.featured.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#A8B0BD]">
                  <span className="flex items-center gap-1">
                    <Shield size={12} className="text-green-400" />
                    Verified Profile
                  </span>
                  <Link href="/explore-talents" className="text-[#C8202A] hover:text-[#e02530] font-medium">
                    View Profile →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide arrows */}
        <button
          onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </section>

      {/* ── EXPLORE CATEGORIES ───────────────────────────────────────────── */}
      <section style={{ background: '#0B0F14', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '56px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(24px, 3vw, 36px)',
              letterSpacing: 3, color: '#F5F5F5', margin: 0,
            }}>
              EXPLORE CATEGORIES
            </h2>
            <Link href="/explore-talents" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12, fontWeight: 700, letterSpacing: 2,
              color: '#C8202A', textDecoration: 'none',
              textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              VIEW ALL →
            </Link>
          </div>

          {/* Category grid — single row, 8 equal boxes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 8,
          }}>
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/explore-talents?category=${cat.name}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: '#111318',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    padding: '24px 12px 20px',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 14, textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
                    minHeight: 140,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(200,32,42,0.08)';
                    el.style.borderColor = '#C8202A';
                    el.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = '#111318';
                    el.style.borderColor = 'rgba(255,255,255,0.08)';
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: 40, lineHeight: 1, display: 'block' }}>{cat.icon}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 13, fontWeight: 700,
                      color: '#F5F5F5', marginBottom: 5,
                      letterSpacing: 0.3,
                    }}>{cat.name}</div>
                    <div style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 11, color: '#6A7080',
                      letterSpacing: 0.2,
                    }}>{cat.count} Talents</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING TALENTS + CASTING CALLS ─────────────────────────────── */}
      <section className="py-16" style={{ background: '#050505' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Trending Talents */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl text-white tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  TRENDING TALENTS
                </h2>
                <Link href="/explore-talents" className="flex items-center gap-1 text-[#C8202A] hover:text-[#e02530] text-sm font-semibold">
                  View All <ChevronRight size={16} />
                </Link>
              </div>

              <div className="relative">
                <div
                  ref={talentRef}
                  className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {TRENDING_TALENTS.map((t) => (
                    <div
                      key={t.name}
                      className="flex-shrink-0 w-44 glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-[#C8202A]/20 transition-all"
                    >
                      <div className={`relative h-52 bg-gradient-to-b ${t.color}`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center hover:bg-[#C8202A]/80 transition-colors">
                          <Bookmark size={13} className="text-white" />
                        </button>
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-semibold text-sm leading-tight">{t.name}</p>
                          <p className="text-[#A8B0BD] text-xs">{t.role}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={10} className="text-[#A8B0BD]" />
                            <span className="text-[#A8B0BD] text-xs">{t.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scroll arrows */}
                <button
                  onClick={() => scrollTalents('left')}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0B0F14] border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all shadow-lg"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollTalents('right')}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0B0F14] border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all shadow-lg"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Latest Casting Calls */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl text-white tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  LATEST CASTING CALLS
                </h2>
                <Link href="/casting-calls" className="flex items-center gap-1 text-[#C8202A] hover:text-[#e02530] text-sm font-semibold">
                  View All <ChevronRight size={16} />
                </Link>
              </div>

              <div className="space-y-4">
                {LATEST_CASTING_CALLS.map((cc) => (
                  <Link
                    key={cc.title}
                    href="/casting-calls"
                    className="flex gap-4 glass-card rounded-xl p-3 hover:border-[#C8202A]/20 transition-all group"
                  >
                    {/* Thumbnail */}
                    <div className={`flex-shrink-0 w-24 h-20 rounded-lg bg-gradient-to-br ${cc.color} flex items-center justify-center relative overflow-hidden`}>
                      {cc.featured && (
                        <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-[#C8202A] text-white px-1.5 py-0.5 rounded">
                          FEATURED
                        </span>
                      )}
                      <span className="text-[9px] font-bold text-white/70 text-center px-1 leading-tight mt-4">
                        {cc.type}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="text-white font-semibold text-sm group-hover:text-[#C8202A] transition-colors truncate">
                        {cc.title}
                      </h4>
                      <p className="text-[#A8B0BD] text-xs mt-0.5">{cc.role}</p>
                      <div className="flex items-center gap-3 mt-2 text-[#A8B0BD] text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin size={10} /> {cc.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {cc.date}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="py-14 border-y border-white/5" style={{ background: '#0B0F14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center space-y-2">
                <div className="text-3xl sm:text-4xl text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{s.value}</div>
                <div className="text-[#A8B0BD] text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SILVERSCREENS ────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#050505' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#C8202A]" />
              <span className="text-[#C8202A] text-xs font-semibold tracking-[0.25em] uppercase">Why SilverScreens?</span>
              <span className="h-px w-8 bg-[#C8202A]" />
            </div>
            <h2 className="text-3xl sm:text-5xl text-white tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              EVERYTHING YOU NEED TO<br className="hidden sm:block" /> GET DISCOVERED.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card rounded-xl p-5 space-y-4 text-center hover:border-[#C8202A]/20 transition-all group">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#C8202A]/15 border border-[#C8202A]/20 flex items-center justify-center group-hover:bg-[#C8202A]/25 transition-colors">
                  <Icon size={20} className="text-[#C8202A]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{title}</h3>
                  <p className="text-[#A8B0BD] text-xs mt-2 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ──────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5" style={{ background: '#0B0F14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#C8202A]" />
                  <span className="text-[#C8202A] text-xs font-semibold tracking-[0.25em] uppercase">Pricing</span>
                </div>
                <h2 className="text-3xl sm:text-5xl text-white tracking-wider leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  SIMPLE PRICING.<br />BIG OPPORTUNITIES.
                </h2>
                <p className="text-[#A8B0BD] text-base">Affordable plans for everyone.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Aspirant plan preview */}
                <div className="glass-card rounded-xl p-5 space-y-3 border-[#C8202A]/20">
                  <div>
                    <span className="text-xs font-semibold text-[#C8202A] uppercase tracking-wider">Aspirant Plan</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-heading text-4xl text-white">₹999</span>
                      <span className="text-[#A8B0BD] text-sm">/quarter</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#A8B0BD]">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C8202A] flex-shrink-0" /> 5 applications/month</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C8202A] flex-shrink-0" /> Portfolio showcase</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C8202A] flex-shrink-0" /> Email notifications</li>
                  </ul>
                  <Link
                    href="/signup"
                    className="block w-full text-center py-2.5 bg-[#C8202A] hover:bg-[#e02530] text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Get Started
                  </Link>
                </div>

                {/* Agency plan preview */}
                <div className="glass-card rounded-xl p-5 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-[#C8202A] uppercase tracking-wider">Company Plan</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-heading text-4xl text-white">₹2,999</span>
                      <span className="text-[#A8B0BD] text-sm">/quarter</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#A8B0BD]">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C8202A] flex-shrink-0" /> 5 active casting calls</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C8202A] flex-shrink-0" /> Talent pool access</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#C8202A] flex-shrink-0" /> Standard support</li>
                  </ul>
                  <Link
                    href="/signup?type=agency"
                    className="block w-full text-center py-2.5 border border-white/20 hover:border-white/40 text-white text-sm font-semibold rounded-lg transition-colors hover:bg-white/5"
                  >
                    Get Started
                  </Link>
                </div>
              </div>

              <Link href="/pricing" className="inline-flex items-center gap-2 text-[#C8202A] hover:text-[#e02530] text-sm font-semibold transition-colors">
                View all plans <ArrowRight size={16} />
              </Link>
            </div>

            {/* Cinematic visual */}
            <div className="relative h-72 lg:h-full min-h-72 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1206] via-gray-900 to-gray-950 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#C8202A]/40 flex items-center justify-center">
                    <Play size={24} className="text-[#C8202A] fill-[#C8202A] ml-1" />
                  </div>
                  <p className="text-3xl text-white tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>WE MAKE</p>
                  <p className="text-5xl text-[#C8202A] tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>CELEBRITIES</p>
                  <p className="text-[#A8B0BD] text-sm max-w-xs mx-auto">
                    Join thousands of talents and agencies already on SilverScreens
                  </p>
                </div>
              </div>
              {/* Gold border glow */}
              <div className="absolute inset-0 rounded-2xl border border-[#C8202A]/20 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#050505' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at center, rgba(220,38,38,0.4) 0%, transparent 60%)' }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl sm:text-6xl text-white tracking-wider leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            READY TO STEP INTO<br className="hidden sm:block" /> <span className="text-[#C8202A]">THE SPOTLIGHT?</span>
          </h2>
          <p className="text-[#A8B0BD] text-lg leading-relaxed">
            Join SilverScreens today and connect with India&apos;s top production houses,
            casting directors, and brands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#C8202A] hover:bg-[#e02530] text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-900/40"
            >
              Join as Aspirant
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/signup?type=agency"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-white/20 hover:border-white/40 text-[#F5F5F5] font-semibold rounded-xl transition-all hover:bg-white/5"
            >
              Join as Agency
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}