'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, Award, Shield, TrendingUp, Film, MapPin,
  ExternalLink, Share2,
} from 'lucide-react';

/* ─── Design tokens ──────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";

/* ─── Data ───────────────────────────────────────────────────── */
const STATS = [
  { value: '50,000+', label: 'Registered Talents'    },
  { value: '2,000+',  label: 'Verified Agencies'     },
  { value: '15,000+', label: 'Casting Calls Posted'  },
  { value: '8,000+',  label: 'Successful Placements' },
];

const VALUES = [
  { icon: Shield,     title: 'Trust & Transparency', desc: 'Every agency and casting call is verified. No scams, no hidden fees — just legitimate opportunities for real talent.' },
  { icon: Users,      title: 'Talent First',          desc: 'We built SilverScreens because talent deserves a fair shot. Our platform levels the playing field for aspirants across India.' },
  { icon: Award,      title: 'Industry Excellence',   desc: 'We uphold the highest standards of the entertainment industry, connecting only serious professionals.' },
  { icon: TrendingUp, title: 'Career Growth',         desc: 'From first audition to feature film — we support every stage of your journey with tools, guidance and visibility.' },
];

const TEAM = [
  { name: 'Arjun Mehta',  role: 'Co-Founder & CEO',       bio: '12 years in film production. Former casting director at Dharma Productions.',          location: 'Mumbai',    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face' },
  { name: 'Priya Sharma', role: 'Co-Founder & CPO',       bio: 'Ex-product lead at a top OTT platform. Passionate about building for creative talent.',  location: 'Bangalore', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face' },
  { name: 'Rohit Nair',   role: 'Head of Partnerships',   bio: '8 years in agency relations. Built our network of 2,000+ verified casting partners.',    location: 'Delhi',     img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face' },
  { name: 'Kavya Iyer',   role: 'Head of Talent Success', bio: 'Trained actor turned talent advocate. Ensures every aspirant gets the best experience.',  location: 'Chennai',   img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face' },
];

const MILESTONES = [
  { year: '2019', title: 'The Idea',            desc: 'Founded in Mumbai — make talent discovery transparent and accessible.'      },
  { year: '2020', title: 'First 1,000 Talents', desc: 'Launched beta with 1,000 aspirants and 50 verified agencies.'              },
  { year: '2021', title: 'Pan-India Growth',    desc: 'Expanded to Delhi, Hyderabad, Bangalore and Chennai.'                      },
  { year: '2022', title: '10,000 Castings',     desc: 'Crossed 10,000 casting calls and 5,000 successful placements.'             },
  { year: '2023', title: 'Premium Launch',      desc: 'Launched Premium with analytics, priority visibility and agent connect.'   },
  { year: '2024', title: 'Industry Leader',     desc: "India's most trusted marketplace with 50,000+ active aspirants."           },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div style={{ background: BG, color: '#F5F5F5', fontFamily: BARLOW }}>

      {/* ══ HERO ══ */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        padding: '100px 32px 80px',
        backgroundImage: 'url(https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&h=700&fit=crop)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 60%, rgba(5,5,5,0.85) 100%)' }} />
        {/* Red glow */}
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(200,32,42,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 20, padding: '6px 18px', marginBottom: 20 }}>
            <Film size={14} color={RED} />
            <span style={{ fontSize: 15, color: RED, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5 }}>India's Most Trusted Talent Marketplace</span>
          </div>

          <h1 style={{ fontFamily: BEBAS, fontSize: 72, fontWeight: 400, letterSpacing: 3, lineHeight: 0.95, marginBottom: 20, color: '#fff' }}>
            WHERE TALENT<br /><span style={{ color: RED }}>MEETS</span> OPPORTUNITY
          </h1>

          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 32px', fontFamily: BARLOW }}>
            SilverScreens is building India's most transparent, verified and talent-first platform — connecting aspirants with the casting calls, agencies and opportunities they deserve.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/signup" style={{ background: RED, color: '#fff', borderRadius: 8, padding: '12px 32px', fontSize: 17, fontWeight: 700, fontFamily: BARLOW, textDecoration: 'none', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Join as Talent</a>
            <a href="/agency/dashboard" style={{ background: 'transparent', color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 8, padding: '12px 32px', fontSize: 17, fontWeight: 700, fontFamily: BARLOW, textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,166,74,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >For Agencies</a>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '40px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {STATS.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 48, fontWeight: 400, color: RED, lineHeight: 1, letterSpacing: 1 }}>{value}</div>
              <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', marginTop: 6, fontFamily: BARLOW }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ OUR STORY ══ */}
      <section style={{ padding: '64px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, color: RED, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Our Story</div>
            <h2 style={{ fontFamily: BEBAS, fontSize: 44, fontWeight: 400, letterSpacing: 2, lineHeight: 1.05, marginBottom: 20, color: '#fff' }}>
              BUILT BY PEOPLE WHO<br />UNDERSTAND THE <span style={{ color: GOLD }}>INDUSTRY</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 14, fontFamily: BARLOW }}>
              SilverScreens was born out of frustration. Our founders — a former casting director and a technology entrepreneur — saw talented aspirants losing opportunities to fraud, opacity and inaccessibility.
            </p>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontFamily: BARLOW }}>
              In 2019, we set out to build a platform that puts talent first — where every casting call is verified, every agency is accountable, and every aspirant gets a fair shot regardless of who they know.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src="https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=700&h=520&fit=crop" alt="Filmmaking" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(200,32,42,0.12) 0%, transparent 60%)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -16, left: -16, background: BG2, border: `1px solid ${GOLD}`, borderRadius: 12, padding: '12px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 32, color: GOLD, lineHeight: 1 }}>5★</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW }}>Industry Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES ══ */}
      <section style={{ background: BG2, padding: '48px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 14, color: RED, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>What We Stand For</div>
            <h2 style={{ fontFamily: BEBAS, fontSize: 44, fontWeight: 400, letterSpacing: 2, color: '#fff' }}>OUR VALUES</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '24px 20px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,32,42,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={24} color={RED} />
                </div>
                <div style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 10 }}>{title}</div>
                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0, fontFamily: BARLOW }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ JOURNEY — HORIZONTAL ══ */}
      <section style={{ padding: '64px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 14, color: RED, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>How We Got Here</div>
            <h2 style={{ fontFamily: BEBAS, fontSize: 44, fontWeight: 400, letterSpacing: 2, color: '#fff' }}>OUR JOURNEY</h2>
          </div>

          {/* Horizontal timeline */}
          <div style={{ position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: 32, left: '8.33%', right: '8.33%', height: 2, background: 'rgba(255,255,255,0.08)' }} />
            {/* Red progress line (first 4 milestones done) */}
            <div style={{ position: 'absolute', top: 32, left: '8.33%', width: '55%', height: 2, background: `linear-gradient(to right, ${RED}, rgba(200,32,42,0.3))` }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0 }}>
              {MILESTONES.map((m, i) => (
                <div key={m.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '0 8px' }}>
                  {/* Year dot */}
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                    background: i < 4 ? RED : BG3,
                    border: i < 4 ? `3px solid ${RED}` : '2px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: i < 4 ? `0 0 16px rgba(200,32,42,0.4)` : 'none',
                    zIndex: 2, position: 'relative',
                  }}>
                    <span style={{ fontFamily: BEBAS, fontSize: 15, color: i < 4 ? '#fff' : 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }}>{m.year}</span>
                  </div>
                  {/* Card */}
                  <div style={{ background: BG2, border: `1px solid ${i < 4 ? 'rgba(200,32,42,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '14px 14px', width: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: i < 4 ? '#fff' : 'rgba(255,255,255,0.45)', marginBottom: 8 }}>{m.title}</div>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, margin: 0, fontFamily: BARLOW }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section style={{ background: BG2, padding: '44px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 14, color: RED, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>The People Behind It</div>
            <h2 style={{ fontFamily: BEBAS, fontSize: 44, fontWeight: 400, letterSpacing: 2, color: '#fff' }}>MEET THE TEAM</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {TEAM.map(({ name, role, bio, location, img }) => (
              <div key={name} style={{ textAlign: 'center', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 16px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,166,74,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ width: 76, height: 76, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '2px solid rgba(212,166,74,0.35)' }}>
                  <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{name}</div>
                <div style={{ fontSize: 15, color: RED, fontFamily: BARLOW, fontWeight: 600, marginBottom: 8 }}>{role}</div>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.55, margin: '0 0 8px' }}>{bio}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 14 }}>
                  <MapPin size={12} color="rgba(255,255,255,0.3)" />
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {[ExternalLink, Share2].map((Icon, i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    >
                      <Icon size={13} color="rgba(255,255,255,0.55)" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: '64px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 300, background: 'radial-gradient(ellipse, rgba(200,32,42,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 660, margin: '0 auto' }}>
          <h2 style={{ fontFamily: BEBAS, fontSize: 52, fontWeight: 400, letterSpacing: 2, color: '#fff', lineHeight: 1.05, marginBottom: 16 }}>
            READY TO START <span style={{ color: RED }}>YOUR JOURNEY?</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 32, fontFamily: BARLOW }}>
            Join 50,000+ talents and 2,000+ agencies already using SilverScreens.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/signup" style={{ background: RED, color: '#fff', borderRadius: 8, padding: '13px 36px', fontSize: 18, fontWeight: 700, fontFamily: BARLOW, textDecoration: 'none', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Create An Account</a>
            <a href="/casting-calls" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '13px 36px', fontSize: 18, fontWeight: 600, fontFamily: BARLOW, textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
            >Browse Casting Calls</a>
          </div>
        </div>
      </section>

    </div>
  );
}