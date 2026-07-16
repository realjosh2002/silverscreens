'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';

const categories = [
  { icon: '🎭', name: 'Actor',           count: '12,345 profiles' },
  { icon: '⭐', name: 'Actress',         count: '8,765 profiles'  },
  { icon: '💃', name: 'Dancer',          count: '4,321 profiles'  },
  { icon: '🎵', name: 'Singer',          count: '1,987 profiles'  },
  { icon: '🎥', name: 'Cinematographer', count: '1,234 profiles'  },
  { icon: '🎙️', name: 'Anchor',          count: '2,109 profiles'  },
  { icon: '😈', name: 'Villain',         count: '2,345 profiles'  },
  { icon: '🎬', name: 'Technician',      count: '6,432 profiles'  },
];

const talents = [
  { initials: 'MN', name: 'Meera Nair',    role: 'Actress', city: 'Mumbai',    badge: false, img: 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=400&h=500&fit=crop&crop=face' },
  { initials: 'KR', name: 'Karthik Raj',   role: 'Actor',   city: 'Chennai',   badge: true,  img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face' },
  { initials: 'SI', name: 'Sneha Iyer',    role: 'Dancer',  city: 'Hyderabad', badge: false, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face' },
  { initials: 'VA', name: 'Vikram Aditya', role: 'Actor',   city: 'Bengaluru', badge: false, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face' },
  { initials: 'AK', name: 'Aisha Khan',    role: 'Model',   city: 'Delhi',     badge: false, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=face' },
];

const castingCalls = [
  {
    genre: 'ACTION\nTHRILLER', bg: 'linear-gradient(160deg,#1a0d0a,#2d1510)',
    height: 240, featured: true,
    title: 'Action Thriller Web Series — Season 1',
    roles: ['Actor', 'Villain', 'Stunt Artist'],
    city: 'Mumbai', date: '30 May 2024',
    img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=340&fit=crop',
  },
  {
    genre: 'ROMANTIC\nDRAMA', bg: 'linear-gradient(160deg,#1a0a1a,#2d1030)',
    height: 180, featured: false,
    title: 'Romantic Drama Film',
    roles: ['Actress', 'Actor'],
    city: 'Chennai', date: '28 May 2024',
    img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=240&fit=crop',
  },
  {
    genre: 'REALITY\nSHOW', bg: 'linear-gradient(160deg,#0a0a1a,#101030)',
    height: 180, featured: false,
    title: 'Reality Show Season 2',
    roles: ['Anchor', 'Contestant'],
    city: 'Delhi', date: '25 May 2024',
    img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=240&fit=crop',
  },
];

const howSteps = [
  { num: '01', title: 'Create Your Profile',   desc: 'Build a stunning profile with your photos, showreel, skills, and experience. Get verified by our team.' },
  { num: '02', title: 'Get Discovered',         desc: 'Casting directors and agencies search our database daily. Your profile is always working for you.' },
  { num: '03', title: 'Apply to Casting Calls', desc: 'Browse thousands of active casting calls and apply with one click. Track all your applications.' },
  { num: '04', title: 'Land the Role',          desc: 'Get shortlisted, audition, and secure your next big opportunity. Your journey starts here.' },
];

const testimonials = [
  { initials: 'RK', name: 'Rajan Kumar', role: 'Actor · Mumbai',           text: 'SilverScreens completely transformed my career. I landed my first OTT role within two months of creating my profile. Absolutely extraordinary platform.' },
  { initials: 'PD', name: 'Priya Desai', role: 'Casting Director · Delhi', text: "As a casting director, finding verified talent used to take weeks. Now I discover and shortlist in hours. It's changed the way our entire team works." },
  { initials: 'AM', name: 'Aryan Mehta', role: 'Producer · Hyderabad',     text: "We've hired over 50 talents through SilverScreens across different projects. The quality of profiles and the ease of the platform is unmatched in India." },
];

const tickerItems = ['ACTORS','DANCERS','SINGERS','MODELS','DIRECTORS','CINEMATOGRAPHERS','ANCHORS','STUNT ARTISTS','VILLAINS','VOICE ARTISTS'];

const HERO_SLIDES = [
  {
    label: "INDIA'S MOST TRUSTED PLATFORM",
    headline: ['TALENT', 'MARKETPLACE'],
    highlight: 'FOR FILM & MEDIA',
    sub: 'Where extraordinary talent meets life-changing opportunity — in films, OTT, web series, television, and beyond.',
    featured: { initials: 'AV', name: 'Arjun Verma', role: 'Actor · Mumbai' },
    image: '/hero-1.jpg',
  },
  {
    label: 'DISCOVER YOUR NEXT STAR',
    headline: ['THE ULTIMATE', 'CASTING'],
    highlight: 'PLATFORM',
    sub: 'Post casting calls and discover verified talent from across India and the world.',
    featured: { initials: 'PS', name: 'Priya Sharma', role: 'Director · Delhi' },
    image: '/hero-2.jpg',
  },
  {
    label: 'BUILD YOUR LEGACY',
    headline: ['YOUR CAREER,', 'YOUR'],
    highlight: 'SPOTLIGHT',
    sub: 'Create your professional profile and get discovered by top production houses and agencies.',
    featured: { initials: 'RM', name: 'Rahul Mehra', role: 'Model · Mumbai' },
    image: '/hero-3.jpg',
  },
  {
    label: 'YOUR STORY STARTS HERE',
    headline: ['JOIN THE', 'SILVERSCREENS'],
    highlight: 'FAMILY',
    sub: 'Thousands of talents and agencies already building their careers on SilverScreens.',
    featured: { initials: 'AK', name: 'Aisha Khan', role: 'Model · Delhi' },
    image: '/hero-4.jpg',
  },
];

export default function HomePage() {
  const cursorRef     = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const navRef        = useRef<HTMLElement>(null);
  const activeStep    = useRef<number>(0);
  const [slide, setSlide] = useState(0);
  const currentSlide = HERO_SLIDES[slide];

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + 'px';
        cursorRef.current.style.top  = my + 'px';
      }
    };
    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = rx + 'px';
        cursorRingRef.current.style.top  = ry + 'px';
      }
      requestAnimationFrame(animRing);
    };
    document.addEventListener('mousemove', onMove);
    animRing();

    // Hero slider auto-advance
    const slideTimer = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 4000);

    const onScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const hoverEls = document.querySelectorAll('a,button,.cat-card,.talent-card,.casting-card,.testi-card,.how-step');
    const expand   = () => { if (cursorRingRef.current) { cursorRingRef.current.style.width = '56px'; cursorRingRef.current.style.height = '56px'; cursorRingRef.current.style.borderColor = 'rgba(201,168,76,0.8)'; } };
    const shrink   = () => { if (cursorRingRef.current) { cursorRingRef.current.style.width = '36px'; cursorRingRef.current.style.height = '36px'; cursorRingRef.current.style.borderColor = 'rgba(201,168,76,0.5)'; } };
    hoverEls.forEach(el => { el.addEventListener('mouseenter', expand); el.addEventListener('mouseleave', shrink); });

    return () => {
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      clearInterval(slideTimer);
      observer.disconnect();
    };
  }, []);

  const handleStepClick = (idx: number) => {
    document.querySelectorAll('.how-step').forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });
    activeStep.current = idx;
  };

  return (
    <>
      {/* Cursor */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={cursorRingRef} />

      {/* ═══ NAV ═══ */}
      <nav ref={navRef} className="public-nav">
        {/* Logo */}
        <SilverScreensLogo size="lg" href="/" showTagline={false} />

        <ul className="nav-links">
          <li><Link href="/" className="active">Home</Link></li>
          <li><Link href="/about">About Us</Link></li>
          <li><Link href="/explore-talents">Explore Talents</Link></li>
          <li><Link href="/casting-calls">Casting Calls</Link></li>
          <li><Link href="/pricing">Pricing Plans</Link></li>
          <li><Link href="/faq">FAQs</Link></li>
          <li><Link href="/contact">Contact Us</Link></li>
        </ul>

        <div className="nav-ctas">
          <Link href="/login"  className="btn-nav-login">Log In</Link>
          <Link href="/signup" className="btn-nav-signup">Sign Up</Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Slider background images */}
        {HERO_SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${s.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
            opacity: i === slide ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: 0,
          }} />
        ))}

        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 45%, rgba(5,5,5,0.2) 80%, rgba(5,5,5,0.05) 100%)',
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, zIndex: 1,
          background: 'linear-gradient(to top, #050505, transparent)',
        }} />

        {/* Content — above overlays */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div className="hero-content">
            <div className="hero-eyebrow">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">{currentSlide.label}</span>
            </div>
            <h1 className="hero-h1">
              {currentSlide.headline.map((line, i) => (
                <span key={i} className={i === 0 ? 'line1' : 'line2'} style={{ display: 'block' }}>{line}</span>
              ))}
              <span className="line3">{currentSlide.highlight}</span>
            </h1>
            <p className="hero-sub">{currentSlide.sub}</p>
            <div className="hero-ctas">
              <Link href="/signup" className="btn-hero-primary" style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}> Join as Talent <span className="arrow-icon">→</span></Link>
              <Link href="/signup" className="btn-hero-secondary" style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>Hire Talent <span className="arrow-icon">→</span></Link>
            </div>

            {/* Slide dots */}
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              {HERO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} style={{
                  width: i === slide ? 28 : 8, height: 8,
                  borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: i === slide ? '#C8202A' : 'rgba(255,255,255,0.25)',
                  transition: 'all 0.3s',
                  padding: 0,
                }} />
              ))}
            </div>
          </div>


          <div className="scroll-hint">
            <div className="scroll-line" />
            <span className="scroll-text">Scroll</span>
          </div>

          <div className="stats-bar">
            <div className="stat-item"><div className="stat-num">50K+</div><div className="stat-lbl" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15 }}>Verified Talents</div></div>
            <div className="stat-item"><div className="stat-num">5,000+</div><div className="stat-lbl" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15 }}>Active Agencies</div></div>
            <div className="stat-item"><div className="stat-num">15K+</div><div className="stat-lbl" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15 }}>Jobs Posted</div></div>
            <div className="stat-item"><div className="stat-num">98%</div><div className="stat-lbl" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15 }}>Success Rate</div></div>
          </div>
        </div>
      </section>

      {/* ═══ TICKER ═══ */}
      <div className="ticker">
        {[1, 2].map(t => (
          <div key={t} className={`ticker-track${t === 2 ? ' ticker-track2' : ''}`}>
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <div key={i} className="ticker-item">
                <div className="ticker-dot" />{item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ═══ CATEGORIES ═══ */}
      <section style={{ padding: '60px 80px', background: '#0B0F14', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: 3, color: '#F5F5F5', margin: 0 }}>EXPLORE CATEGORIES</h2>
          <Link href="/explore-talents" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2, color: '#C8202A', textDecoration: 'none', textTransform: 'uppercase' as const }}>VIEW ALL →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
          {categories.map((cat) => (
            <div key={cat.name}
              style={{ background: '#111318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '24px 12px 20px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 14, textAlign: 'center' as const, cursor: 'pointer', minHeight: 140, transition: 'all 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'rgba(200,32,42,0.08)'; el.style.borderColor = '#C8202A'; el.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.background = '#111318'; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateY(0)'; }}
            >
              <span style={{ fontSize: 40, lineHeight: 1 }}>{cat.icon}</span>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, color: '#6A7080' }}>{cat.count}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TRENDING TALENTS ═══ */}
      <section className="talents-sec">
        <div className="talents-header reveal">
          <div>
            <div className="sec-label">Discover</div>
            <div className="sec-title">TRENDING <span>TALENTS</span></div>
          </div>
          <Link href="/explore-talents" className="view-all-link" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>View All Talents →</Link>
        </div>
        <div className="talent-grid reveal">
          {talents.map((t) => (
            <div key={t.name} className="talent-card">
              <div className="talent-img" style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={t.img}
                  alt={t.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.display = 'none';
                    const placeholder = img.nextSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div className="talent-img-placeholder" style={{ display: 'none', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700, background: 'rgba(200,32,42,0.15)', color: '#C8202A' }}>{t.initials}</div>
                <div className="talent-overlay" />
              </div>
              {t.badge && <div className="talent-badge">Featured</div>}
              <div className="talent-save">♡</div>
              <div className="talent-info">
                <div className="talent-name" style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:20}}>{t.name}</div>
                <div className="talent-role" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, fontSize: 17 }}>{t.role}</div>
                <div className="talent-city" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: 16 }}>📍 {t.city}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="how-sec">
        <div className="reveal">
          <div className="sec-label" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Process</div>
          <div className="sec-title" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>HOW IT <span>WORKS</span></div>
          <div className="sec-sub" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>From signup to your first booking in minutes</div>
        </div>
        <div className="how-grid reveal">
          <div className="how-steps">
            {howSteps.map((step, i) => (
              <div
                key={step.num}
                className={`how-step${i === 0 ? ' active' : ''}`}
                onClick={() => handleStepClick(i)}
              >
                <div className="step-num">{step.num}</div>
                <div className="step-content">
                  <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22 }}>{step.title}</h4>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: 18 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="how-visual">
            <div className="how-visual-inner" style={{ padding: 0, overflow: 'hidden', borderRadius: 16, background: '#000', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=500&fit=crop"
                alt="How SilverScreens works"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 16, opacity: 0.7 }}
              />
              {/* Play button overlay */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
              >
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(200,32,42,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s, background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#C8202A'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(200,32,42,0.9)'; }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 4 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', borderRadius: '0 0 16px 16px' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3, color: '#D4A64A', marginBottom: 4 }}>YOUR STORY STARTS HERE</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.7)' }}>Watch how SilverScreens works</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CASTING CALLS ═══ */}
      <section className="casting-sec">
        <div className="casting-header reveal">
          <div>
            <div className="sec-label" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Opportunities</div>
            <div className="sec-title" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>LATEST CASTING <span>CALLS</span></div>
          </div>
          <Link href="/casting-calls" className="view-all-link" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>View All Calls →</Link>
        </div>
        <div className="casting-grid reveal">
          {castingCalls.map((c) => (
            <div key={c.title} className="casting-card">
              <div className="casting-thumb" style={{ height: c.height, background: c.bg, position: 'relative', overflow: 'hidden' }}>
                <img src={c.img} alt={c.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                {c.featured && <div className="casting-badge-label" style={{ position: 'relative', zIndex: 2 }}>Featured</div>}
                <div className="casting-genre-text" style={{ whiteSpace: 'pre-line', position: 'relative', zIndex: 2 }}>{c.genre}</div>
              </div>
              <div className="casting-body">
                <div className="casting-title" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18 }}>{c.title}</div>
                <div className="casting-roles">
                  {c.roles.map(r => <span key={r} className="role-tag" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 16 }}>{r}</span>)}
                </div>
                <div className="casting-meta">
                  <div className="casting-loc" style={{ fontSize: 16 }}>📍 {c.city}</div>
                  <div className="casting-date" style={{ fontSize: 16 }}>{c.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="testi-sec">
        <div className="testi-bg-num">STARS</div>
        <div className="reveal">
          <div className="sec-label">Stories</div>
          <div className="sec-title">WHAT THEY <span>SAY</span></div>
          <div className="sec-sub">Real voices from real careers built on SilverScreens</div>
        </div>
        <div className="testi-grid reveal">
          {testimonials.map((t) => (
            <div key={t.name} className="testi-card">
              <div className="testi-quote-icon">&ldquo;</div>
              <div className="testi-stars">★★★★★</div>
              <div className="testi-text" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{t.text}</div>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>{t.name}</div>
                  <div className="testi-role" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="pricing-sec">
        <div className="reveal">
          <div className="sec-label" style={{ justifyContent: 'center' }}>Plans</div>
          <div className="sec-title">SIMPLE <span>PRICING</span></div>
          <div className="sec-sub">Big opportunities. Honest pricing. No hidden fees.</div>
        </div>
        <div className="pricing-grid reveal">
          <div className="pricing-card featured">
            <div className="plan-tag" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>Aspirant — Star Plan</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>6 Months</div>
            <div className="plan-price"><sup>₹</sup>499</div>
            <div className="plan-period" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>≈ ₹83/mo · fixed duration</div>
            <div className="plan-desc" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>The most popular choice for working professionals ready to break into the industry.</div>
            <ul className="plan-features">
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Full profile with photos & showreel</li>
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Apply to casting calls</li>
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Priority listing in search</li>
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Featured profile placement</li>
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>SilverScreens verified badge</li>
            </ul>
            <Link href="/signup" className="btn-plan btn-plan-gold" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 2, textDecoration: 'none', display: 'block', textAlign: 'center' as const }}>Get Started →</Link>
          </div>
          <div className="pricing-card">
            <div className="plan-tag" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>Agency — Growth Plan</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>6 Months</div>
            <div className="plan-price"><sup>₹</sup>24,999</div>
            <div className="plan-period" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>≈ ₹4,167/mo · fixed duration</div>
            <div className="plan-desc" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>For growing production houses and casting agencies with ongoing hiring needs.</div>
            <ul className="plan-features">
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Post up to 20 casting calls</li>
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Advanced talent search & filters</li>
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Up to 10 team members</li>
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Analytics dashboard</li>
              <li style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Priority support & verification</li>
            </ul>
            <Link href="/signup" className="btn-plan btn-plan-outline" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 2, textDecoration: 'none', display: 'block', textAlign: 'center' as const }}>Get Started →</Link>
          </div>
        </div>
        <div style={{ textAlign: 'center' as const, marginTop: 24, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.45)' }}>
          View all plans on our <Link href="/pricing" style={{ color: '#C8202A', fontWeight: 700, textDecoration: 'none' }}>Pricing page →</Link>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="cta-banner">
        <div className="cta-h reveal">YOUR STORY<br />STARTS <span>HERE</span></div>
        <div className="cta-sub reveal" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Join 50,000+ talents already discovered on SilverScreens</div>
        <div className="cta-btns reveal">
          <Link href="/signup" className="btn-hero-primary" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>Join as Aspirant <span className="arrow-icon">→</span></Link>
          <Link href="/signup" className="btn-hero-secondary" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>Join as Agency <span className="arrow-icon">→</span></Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            {/* Footer Logo */}
            <SilverScreensLogo size="md" href="/" showTagline={false} />
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17 }}>India's most trusted talent marketplace connecting filmmakers and media professionals with extraordinary talent.</p>
            <div className="footer-social">
              {['f','in','tw','yt','ig'].map(s => <a key={s} href="#" className="soc-btn">{s}</a>)}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 14px', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 600, color: '#fff' }}>App Store</span>
              </a>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 14px', textDecoration: 'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3.18 23.76c.28.15.61.14.89-.01l11.31-6.33-2.4-2.41-9.8 8.75zm-1.1-20.1c-.05.17-.08.35-.08.55v15.58c0 .2.03.38.08.55l.08.08 8.72-8.72v-.2L2.08 3.58l-.01.08zm18.39 7.49l-2.4-1.35-2.69 2.69 2.69 2.69 2.42-1.36c.69-.39.69-1.28-.02-1.67zm-17.28 9.09l9.8-8.75-2.4-2.4L2.16 17.3l1.03 2.94z"/></svg>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 600, color: '#fff' }}>Google Play</span>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h5 style={{fontSize:17, letterSpacing:'2px', textTransform:'uppercase', color:'#F5F5F5', marginBottom:18, fontWeight:600}}>Navigate</h5>
            <ul>
              <li><Link href="/about" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>About Us</Link></li>
              <li><Link href="/explore-talents" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>Explore Talents</Link></li>
              <li><Link href="/casting-calls" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>Casting Calls</Link></li>
              <li><Link href="/pricing" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>Subscription Plans</Link></li>
              <li><Link href="/faq" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>FAQs</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 style={{fontSize:17, letterSpacing:'2px', textTransform:'uppercase', color:'#F5F5F5', marginBottom:18, fontWeight:600}}>Legal</h5>
            <ul>
              <li><Link href="/terms" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy-policy" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>Cookie Policy</Link></li>
              <li><Link href="/support" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>Support</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5 style={{fontSize:17, letterSpacing:'2px', textTransform:'uppercase', color:'#F5F5F5', marginBottom:18, fontWeight:600}}>Contact</h5>
            <ul>
              <li><a href="mailto:hello@silverscreens.in" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>hello@silverscreens.in</a></li>
              <li><a href="tel:+919876543210" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>+91 98765 43210</a></li>
              <li><a href="#" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>Mumbai, India</a></li>
              <li><Link href="/contact" style={{fontSize:17, color:'#6A7080', textDecoration:'none'}}>Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy" style={{fontSize:16}}>© 2024 SilverScreens. All rights reserved.</div>
          <div className="footer-legal">
            <Link href="/terms" style={{fontSize:16, color:'#6A7080', textDecoration:'none'}}>Terms</Link>
            <Link href="/privacy-policy" style={{fontSize:16, color:'#6A7080', textDecoration:'none'}}>Privacy</Link>
            <Link href="/cookie-policy" style={{fontSize:16, color:'#6A7080', textDecoration:'none'}}>Cookies</Link>
            <Link href="/support" style={{fontSize:16, color:'#6A7080', textDecoration:'none'}}>Support</Link>
          </div>
        </div>
      </footer>
    </>
  );
}