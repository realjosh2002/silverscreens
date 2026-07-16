'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Share2, MoreHorizontal, MapPin, Calendar, Ruler,
  Check, MessageSquare, BookmarkPlus, Eye, Star, Shield,
  Mail, Phone, User, Clock, Award, ChevronRight, Play,
  Weight, Palette, Activity, CheckCircle2, XCircle,
} from 'lucide-react';

const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BG     = '#0a0a0a';
const BG2    = '#111111';
const BG3    = '#1a1a1a';
const BG4    = '#222222';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";

const TABS = ['Overview', 'Media', 'Experience', 'Skills', 'Physical Stats', 'Awards', 'Availability'];

const T = {
  name: 'Arjun Malhotra', roles: ['Actor', 'Model'],
  location: 'Mumbai, Maharashtra, India', age: 28, height: "5'11\"",
  weight: '72 Kg', bodyType: 'Athletic', eyeColor: 'Dark Brown',
  chest: '40"', waist: '32"', hips: '38"', shoe: 'UK 9', hair: 'Black',
  skinTone: 'Wheatish', build: 'Mesomorphic',
  verified: true, available: true,
  memberSince: 'June 2023', profileType: 'Individual',
  idVerified: true, emailVerified: true, phoneVerified: true,
  lastActive: '2 hours ago',
  profileViews: 1248, shortlisted: 32, applications: 18, responseRate: '92%',
  languages: ['Hindi', 'English', 'Tamil', 'Marathi'],
  tagline: 'Passionate actor with 5+ years of experience in films, web series and commercials. Known for versatile performances and strong screen presence.',
  about: 'Energetic and dedicated performer with a flair for both intense dramatic roles and light-hearted characters. I believe in storytelling that connects and leaves a lasting impact. Trained at FTII Pune with extensive experience in method acting and physical theatre.',
  img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=650&fit=crop&crop=faces&facepad=4',
  skills: [
    { name: 'Acting',            pct: 92 }, { name: 'Dialogue Delivery', pct: 88 },
    { name: 'Voice Modulation',  pct: 85 }, { name: 'Dance',             pct: 70 },
    { name: 'Action Sequences',  pct: 78 }, { name: 'Improvisation',     pct: 82 },
    { name: 'Stage Performance', pct: 88 }, { name: 'Script Analysis',   pct: 75 },
  ],
  experience: [
    { title: 'City of Dreams', type: 'Feature Film', role: 'Lead Actor', year: '2023', studio: 'Dharma Productions', desc: 'Played the lead role of Vikram Malhotra in this critically acclaimed drama.', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=80&h=80&fit=crop' },
    { title: 'Rangbaaz: Dobara', type: 'TV Series', role: 'Supporting Lead', year: '2023', studio: 'Red Frame Studios', desc: 'Portrayed a complex antagonist in this acclaimed crime thriller.', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=80&h=80&fit=crop' },
    { title: 'Mitti Ka Rang', type: 'Feature Film', role: 'Lead', year: '2022', studio: 'FilmGround Studios', desc: 'A rural drama about family and legacy.', img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=80&h=80&fit=crop' },
    { title: 'Mumbai Mafia', type: 'Web Series', role: 'Detective Inspector', year: '2022', studio: 'Prime Lens Studios', desc: 'Lead role in a gritty crime web series.', img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=80&h=80&fit=crop' },
  ],
  awards: [
    { title: 'Best Actor – City Film Festival', desc: "For the film 'City of Dreams'", year: '2023' },
    { title: 'Outstanding Performance', desc: 'Nominated – Golden Screen Awards', year: '2022' },
    { title: 'Rising Star Award', desc: 'SilverScreens Annual Awards', year: '2022' },
  ],
  media: [
    { label: 'Action Showreel 2024', duration: '03:45', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&h=200&fit=crop', featured: true,  type: 'video' },
    { label: 'Monologue',           duration: '02:15', img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=320&h=200&fit=crop', featured: false, type: 'video' },
    { label: 'Emotional Scene',     duration: '01:08', img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=320&h=200&fit=crop', featured: false, type: 'video' },
    { label: 'Photoshoot BTS',      duration: null,    img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=320&h=200&fit=crop', featured: false, type: 'photo', count: 12 },
    { label: 'Theatre Reel',        duration: '04:20', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=200&fit=crop', featured: false, type: 'video' },
    { label: 'Commercial – Reebok', duration: '00:45', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=320&h=200&fit=crop', featured: false, type: 'video' },
  ],
  availability: {
    status: 'Available',
    from: 'Immediately',
    until: 'December 2024',
    preferredTypes: ['Feature Film', 'Web Series', 'OTT', 'Ad Film'],
    locations: ['Mumbai', 'Delhi', 'Hyderabad', 'Outstation (negotiable)'],
    travelWilling: true,
    note: 'Available for both short-term and long-term projects. Prefer morning shoots but flexible.',
    schedule: [
      { day: 'Mon', available: true  }, { day: 'Tue', available: true  },
      { day: 'Wed', available: true  }, { day: 'Thu', available: false },
      { day: 'Fri', available: true  }, { day: 'Sat', available: true  },
      { day: 'Sun', available: false },
    ],
  },
};

function SkillBar({ name, pct }: { name: string; pct: number }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', fontFamily: BARLOW }}>{name}</span>
        <span style={{ fontSize: 17, color: RED, fontFamily: BARLOW, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(to right, ${RED}, #e8464f)`, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function StatRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon size={15} color="rgba(255,255,255,0.35)" strokeWidth={1.8} />
        <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>{label}</span>
      </div>
      <span style={{ fontSize: 17, color: '#fff', fontFamily: BARLOW, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* ── TAB PANELS ──────────────────────────────────────────────── */

function OverviewTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr 1fr', gap: 20 }}>
      {/* Col 1 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 18 }}>
          <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 12 }}>About Me</h3>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 16px', fontFamily: BARLOW }}>{T.about}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
            {[
              { icon: Ruler,    label: 'Height',    value: T.height    },
              { icon: Weight,   label: 'Weight',    value: T.weight    },
              { icon: Activity, label: 'Body Type', value: T.bodyType  },
              { icon: Palette,  label: 'Eye Color', value: T.eyeColor  },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={13} color="rgba(255,255,255,0.3)" strokeWidth={1.8} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{label}:</span>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', fontFamily: BARLOW, fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 18 }}>
          <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 14 }}>Quick Info</h3>
          {[
            { icon: User,   label: 'Profile Type',   value: T.profileType },
            { icon: Clock,  label: 'Member Since',   value: T.memberSince },
            { icon: Shield, label: 'ID Verified',    value: T.idVerified    ? 'Yes' : 'No' },
            { icon: Mail,   label: 'Email Verified', value: T.emailVerified ? 'Yes' : 'No' },
            { icon: Phone,  label: 'Phone Verified', value: T.phoneVerified ? 'Yes' : 'No' },
          ].map(({ icon: Icon, label, value }) => (
            <StatRow key={label} icon={Icon} label={label} value={value} />
          ))}
        </div>
      </div>

      {/* Col 2 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Media preview */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, color: '#fff', margin: 0 }}>Media Showcase</h3>
            <button style={{ background: 'none', border: 'none', color: RED, fontSize: 16, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>View All Media</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {T.media.slice(0, 4).map((m, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '16/10', background: BG3, cursor: 'pointer' }}>
                <img src={m.img} alt={m.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
                {m.featured && <div style={{ position: 'absolute', top: 6, left: 6, background: RED, borderRadius: 4, padding: '2px 7px', fontSize: 14, color: '#fff', fontFamily: BARLOW, fontWeight: 700 }}>Featured</div>}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={14} color="#fff" fill="#fff" />
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '5px 7px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                  <div style={{ fontSize: 14, color: '#fff', fontFamily: BARLOW, fontWeight: 600 }}>{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Experience preview */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, color: '#fff', margin: 0 }}>Experience</h3>
            <button style={{ background: 'none', border: 'none', color: RED, fontSize: 16, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {T.experience.slice(0, 2).map((exp, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 14, borderBottom: i < 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', marginBottom: i < 1 ? 14 : 0 }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}><img src={exp.img} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{exp.title}</span>
                  <span style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '2px 9px', fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, whiteSpace: 'nowrap' }}>{exp.type}</span>
                </div>
                <div style={{ fontSize: 16, color: RED, fontFamily: BARLOW, fontWeight: 600, marginBottom: 2 }}>{exp.role}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{exp.year} • {exp.studio}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Skills preview */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, color: '#fff', margin: 0 }}>Skills</h3>
            <button style={{ background: 'none', border: 'none', color: RED, fontSize: 16, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {T.skills.slice(0, 4).map(s => <SkillBar key={s.name} name={s.name} pct={s.pct} />)}
        </div>
      </div>

      {/* Col 3 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 600, color: '#fff', margin: 0 }}>Awards</h3>
            <button style={{ background: 'none', border: 'none', color: RED, fontSize: 16, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {T.awards.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 14, borderBottom: i < T.awards.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', marginBottom: i < T.awards.length - 1 ? 14 : 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={18} color={RED} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{a.title}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 2 }}>{a.desc}</div>
                <div style={{ fontSize: 14, color: GOLD, fontFamily: BARLOW, fontWeight: 600 }}>{a.year}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={16} color={GREEN} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: GREEN }}>Verified Profile</span>
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.6, margin: 0 }}>Identity & credentials verified by SilverScreens</p>
        </div>
      </div>
    </div>
  );
}

function MediaTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 18 }}>All Media</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {T.media.map((m, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '16/10', background: BG3, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <img src={m.img} alt={m.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
              {m.featured && <div style={{ position: 'absolute', top: 10, left: 10, background: RED, borderRadius: 6, padding: '3px 10px', fontSize: 14, color: '#fff', fontFamily: BARLOW, fontWeight: 700 }}>Featured</div>}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={20} color="#fff" fill="#fff" />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
                <div style={{ fontSize: 16, color: '#fff', fontFamily: BARLOW, fontWeight: 600 }}>{m.label}</div>
                {m.duration && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW }}>{m.duration}</div>}
                {m.count && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW }}>{m.count} photos</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExperienceTab() {
  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Work Experience</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {T.experience.map((exp, i) => (
          <div key={i} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 18, display: 'flex', gap: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: BG3 }}>
              <img src={exp.img} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 18, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{exp.title}</span>
                <span style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2px 10px', fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, whiteSpace: 'nowrap' }}>{exp.type}</span>
              </div>
              <div style={{ fontSize: 17, color: RED, fontFamily: BARLOW, fontWeight: 600, marginBottom: 3 }}>{exp.role}</div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 8 }}>{exp.year} • {exp.studio}</div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW, lineHeight: 1.6, margin: 0 }}>{exp.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '80%', margin: '0 auto' }}>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 20 }}>Core Skills</h3>
        {T.skills.slice(0, 4).map(s => <SkillBar key={s.name} name={s.name} pct={s.pct} />)}
      </div>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 20 }}>Additional Skills</h3>
        {T.skills.slice(4).map(s => <SkillBar key={s.name} name={s.name} pct={s.pct} />)}
      </div>
    </div>
  );
}

function PhysicalStatsTab() {
  const stats = [
    { icon: Ruler,    label: 'Height',    value: T.height    },
    { icon: Weight,   label: 'Weight',    value: T.weight    },
    { icon: Activity, label: 'Body Type', value: T.bodyType  },
    { icon: Palette,  label: 'Eye Color', value: T.eyeColor  },
    { icon: Ruler,    label: 'Chest',     value: T.chest     },
    { icon: Ruler,    label: 'Waist',     value: T.waist     },
    { icon: Ruler,    label: 'Hips',      value: T.hips      },
    { icon: Ruler,    label: 'Shoe Size', value: T.shoe      },
    { icon: Palette,  label: 'Hair',      value: T.hair      },
    { icon: Palette,  label: 'Skin Tone', value: T.skinTone  },
    { icon: Activity, label: 'Build',     value: T.build     },
  ];
  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Physical Statistics</h3>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }}>
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={15} color="rgba(255,255,255,0.35)" strokeWidth={1.8} />
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>{label}</span>
              </div>
              <span style={{ fontSize: 17, color: '#fff', fontFamily: BARLOW, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AwardsTab() {
  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Awards & Achievements</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {T.awards.map((a, i) => (
          <div key={i} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, display: 'flex', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={22} color={RED} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, marginBottom: 4 }}>{a.desc}</div>
              <div style={{ fontSize: 15, color: GOLD, fontFamily: BARLOW, fontWeight: 600 }}>{a.year}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailabilityTab() {
  const av = T.availability;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '80%', margin: '0 auto' }}>
      {/* Status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Availability Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: GREEN }} />
            <span style={{ fontSize: 19, color: GREEN, fontFamily: BARLOW, fontWeight: 700 }}>{av.status}</span>
          </div>
          {[
            { label: 'Available From', value: av.from  },
            { label: 'Available Until', value: av.until },
            { label: 'Willing to Travel', value: av.travelWilling ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>{label}</span>
              <span style={{ fontSize: 17, color: '#fff', fontFamily: BARLOW, fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, lineHeight: 1.65, margin: '16px 0 0' }}>{av.note}</p>
        </div>

        {/* Weekly schedule */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Weekly Schedule</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {av.schedule.map(({ day, available }) => (
              <div key={day} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 8 }}>{day}</div>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 8,
                  background: available ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${available ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {available
                    ? <CheckCircle2 size={18} color={GREEN} />
                    : <XCircle size={18} color="rgba(255,255,255,0.2)" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preferred types + locations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 14 }}>Preferred Project Types</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {av.preferredTypes.map(type => (
              <span key={type} style={{ background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 20, padding: '7px 18px', fontSize: 17, color: '#fff', fontFamily: BARLOW, fontWeight: 500 }}>{type}</span>
            ))}
          </div>
        </div>
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 21, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 14 }}>Preferred Locations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {av.locations.map(loc => (
              <div key={loc} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={15} color={RED} />
                <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', fontFamily: BARLOW }}>{loc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ───────────────────────────────────────────────── */
export default function TalentProfilePage() {
  const router = useRouter();
  const [tab,          setTab]          = useState('Overview');
  const [isLoggedIn,   setIsLoggedIn]   = useState(false);
  const [isAgency,     setIsAgency]     = useState(false);
  const [showContact,  setShowContact]  = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u?.loggedIn) {
        setIsLoggedIn(true);
        // Only paid agency users can see contact details
        setIsAgency(u.userType === 'agency');
      }
    } catch {}
  }, []);

  const tabContent: Record<string, JSX.Element> = {
    Overview:         <OverviewTab />,
    Media:            <MediaTab />,
    Experience:       <ExperienceTab />,
    Skills:           <SkillsTab />,
    'Physical Stats': <PhysicalStatsTab />,
    Awards:           <AwardsTab />,
    Availability:     <AvailabilityTab />,
  };

  return (
    <div style={{ background: BG, color: '#F5F5F5', fontFamily: BARLOW, minHeight: '100vh' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: BG2 }}>
        <button onClick={() => router.push('/explore-talents')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 17, fontFamily: BARLOW, cursor: 'pointer' }}>
          <ArrowLeft size={18} /> Back to Talent
        </button>
        <div style={{ display: 'flex', gap: 16 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 16, fontFamily: BARLOW, cursor: 'pointer' }}>
            <Share2 size={16} /> Share Profile
          </button>
          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}><MoreHorizontal size={20} /></button>
        </div>
      </div>

      {/* Guest banner */}
      {!isLoggedIn && (
        <div style={{ background: 'rgba(200,32,42,0.1)', borderBottom: '1px solid rgba(200,32,42,0.25)', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', fontFamily: BARLOW }}>
              You are viewing a limited profile. <strong style={{ color: '#fff' }}>Login or sign up</strong> to see full details. Only verified agency accounts can view contact information.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button onClick={() => router.push('/login')} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, color: '#fff', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer' }}>Log In</button>
            <button onClick={() => router.push('/signup')} style={{ padding: '8px 20px', background: RED, border: 'none', borderRadius: 6, color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>Sign Up Free</button>
          </div>
        </div>
      )}

      {/* Agency-only banner for logged-in non-agency users */}
      {isLoggedIn && !isAgency && (
        <div style={{ background: 'rgba(212,166,74,0.08)', borderBottom: '1px solid rgba(212,166,74,0.2)', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>👑</span>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', fontFamily: BARLOW }}>
              Contact details are only visible to <strong style={{ color: GOLD }}>verified Agency accounts</strong>. Aspirants cannot view other members' contact information.
            </span>
          </div>
          <button onClick={() => router.push('/pricing')} style={{ padding: '8px 20px', background: GOLD, border: 'none', borderRadius: 6, color: '#000', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>Upgrade to Agency</button>
        </div>
      )}

      {/* Hero */}
      <div style={{ background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '28px 28px 0' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 24 }}>
          {/* Photo */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 220, height: 280, borderRadius: 12, overflow: 'hidden', background: BG3 }}>
              <img src={T.img} alt={T.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
            </div>
            {T.available && (
              <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.75)', borderRadius: 20, padding: '5px 12px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: GREEN }} />
                <span style={{ fontSize: 14, color: '#fff', fontFamily: BARLOW, fontWeight: 600 }}>Available for Work</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontFamily: BEBAS, fontSize: 48, fontWeight: 400, letterSpacing: 2, color: '#fff', lineHeight: 1, margin: 0 }}>{T.name}</h1>
              {T.verified && <div style={{ width: 28, height: 28, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={14} strokeWidth={3} color="#fff" /></div>}
            </div>
            <div style={{ fontSize: 21, color: RED, fontFamily: BARLOW, fontWeight: 600, marginBottom: 14 }}>{T.roles.join(' • ')}</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW }}><MapPin size={14} color="rgba(255,255,255,0.4)" />{T.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW }}><Calendar size={14} color="rgba(255,255,255,0.4)" />{T.age} Years</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW }}><Ruler size={14} color="rgba(255,255,255,0.4)" />{T.height}</span>
            </div>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, maxWidth: 580, margin: '0 0 14px', fontFamily: BARLOW }}>{T.tagline}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {T.languages.map(lang => <span key={lang} style={{ background: BG4, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '5px 16px', fontSize: 16, color: 'rgba(255,255,255,0.75)', fontFamily: BARLOW }}>{lang}</span>)}
            </div>

            {/* CTAs — gated by auth */}
            {isAgency ? (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: RED, border: 'none', color: '#fff', borderRadius: 8, padding: '12px 28px', fontSize: 18, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <BookmarkPlus size={18} /> Add to Shortlist
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: 8, padding: '12px 28px', fontSize: 18, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <MessageSquare size={18} /> Message
                </button>
                {/* Contact details — agency only */}
                <button onClick={() => setShowContact(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,166,74,0.12)', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '12px 28px', fontSize: 18, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                  <Mail size={18} /> {showContact ? 'Hide Contact' : 'View Contact'}
                </button>
              </div>
            ) : isLoggedIn ? (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)', borderRadius: 8, padding: '12px 28px', fontSize: 18, fontFamily: BARLOW }}>
                  🔒 Shortlisting requires Agency account
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => router.push('/login')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: RED, border: 'none', color: '#fff', borderRadius: 8, padding: '12px 28px', fontSize: 18, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>
                  🔒 Login to Contact
                </button>
              </div>
            )}

            {/* Contact details panel — agency only */}
            {isAgency && showContact && (
              <div style={{ marginTop: 16, background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 10, padding: '16px 20px', display: 'flex', gap: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Mail size={16} color={GOLD} />
                  <div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1 }}>EMAIL</div>
                    <div style={{ fontSize: 16, color: '#fff', fontFamily: BARLOW, fontWeight: 600 }}>arjun.malhotra@example.com</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Phone size={16} color={GOLD} />
                  <div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1 }}>MOBILE</div>
                    <div style={{ fontSize: 16, color: '#fff', fontFamily: BARLOW, fontWeight: 600 }}>+91 98XXX XXXXX</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ width: 240, flexShrink: 0 }}>
            {[
              { icon: Eye,          label: 'Profile Views', value: T.profileViews.toLocaleString() },
              { icon: Star,         label: 'Shortlisted',   value: T.shortlisted                   },
              { icon: BookmarkPlus, label: 'Applications',  value: T.applications                  },
              { icon: Shield,       label: 'Response Rate', value: T.responseRate                  },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={15} color="rgba(255,255,255,0.4)" strokeWidth={1.8} />
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW }}>{label}</span>
                </div>
                <span style={{ fontSize: 18, color: '#fff', fontFamily: BARLOW, fontWeight: 700 }}>{value}</span>
              </div>
            ))}
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, paddingTop: 10 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: GREEN, marginRight: 6 }} />Last Active: {T.lastActive}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {TABS.map(t => {
            const active = tab === t;
            return (
              <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 20px', marginBottom: -1, fontFamily: BARLOW, fontSize: 17, fontWeight: active ? 700 : 400, color: active ? RED : 'rgba(255,255,255,0.5)', borderBottom: active ? `2px solid ${RED}` : '2px solid transparent', whiteSpace: 'nowrap' }}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: '24px 28px 48px' }}>
        {tabContent[tab]}
      </div>
    </div>
  );
}