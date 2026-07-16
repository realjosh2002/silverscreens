'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Clock, Users, Calendar, Bookmark, ChevronLeft,
  CheckCircle, Lock, Phone, Mail, Globe, AlertCircle,
  Star, Briefcase, Mic2, LayoutDashboard, FileText,
  Bell, MessageSquare, ChevronDown, Menu, Video, Radio,
  UsersRound, Clapperboard, DollarSign, Info,
} from 'lucide-react'

/* ── TOKENS ── */
const BG       = '#0D1117'
const BG2      = '#131720'
const BG3      = '#181E2A'
const BG4      = '#1C2338'
const RED      = '#EF4444'
const GOLD     = '#D4A64A'
const GOLD_DIM = 'rgba(212,166,74,0.12)'
const GOLD_BDR = 'rgba(212,166,74,0.22)'
const GREEN    = '#22C55E'
const BEBAS    = "'Bebas Neue', sans-serif"
const BARLOW   = "'Barlow Condensed', sans-serif"

/* ── FULL DATA SHAPE matching CastingCallsContext + contact ── */
const CASTINGS = [
  {
    id: 1,
    // Basic & Role Info
    title: 'Lead Actor Required',
    projectTitle: 'Ek Baar Phir',
    projectType: 'Film',
    studio: 'Dharma Productions',
    verified: true,
    roleType: 'Lead',
    shortDescription: 'Seeking a charismatic lead for a romantic drama set in modern Mumbai.',
    gender: 'Male',
    ageFrom: '25', ageTo: '35',
    experience: '5 - 10 Years',
    roleDescription: 'Seeking a charismatic lead for a romantic drama set in modern Mumbai. Strong dialogue delivery and emotional range essential. Prior feature film experience preferred. The character is a complex urban professional navigating love and ambition.',
    skills: ['Acting', 'Dialogue Delivery'],
    // Project & Audition Info
    languages: ['Hindi'],
    projectStatus: 'Pre-production',
    shootStart: '2025-08-01', shootEnd: '2025-11-30',
    shootLocation: 'Mumbai',
    hasSponsor: 'Yes',
    auditionFormat: 'In-Person',
    auditionStart: '2025-07-05', auditionEnd: '2025-07-08',
    auditionTimeFrom: '10:00', auditionTimeTo: '17:00',
    auditionLocationType: 'Single Location',
    auditionAddress: 'Dharma Productions Office, Linking Road, Bandra West, Mumbai - 400050',
    auditionInstructions: 'Please prepare a 2-minute monologue. Bring 2 copies of your headshot and resume. Wear casual smart attire.',
    contactName: 'Priya Mehta',
    contactEmail: 'casting@dharmaproductions.com',
    contactMobile: '9821045678',
    // Compensation
    compensationType: 'Paid',
    compensationDetail: 'Negotiable',
    amount: '2,00,000 - 2,50,000',
    paymentTerms: '50% advance on signing, 50% on shoot completion.',
    additionalRequirements: 'Must be available for the entire shoot schedule. No other conflicting commitments during the shoot period.',
    // Meta
    deadline: 'Jul 10, 2025', daysLeft: 8, applicants: 142,
    featured: true, urgent: true,
    type: 'Feature Film',
    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=500&fit=crop',
  },
  {
    id: 2,
    title: 'Female Lead Required',
    projectTitle: 'Rising Tides (Season 1)',
    projectType: 'Web Series',
    studio: 'Oceanic Originals',
    verified: true,
    roleType: 'Lead',
    shortDescription: 'Premium OTT web series seeking a compelling female lead.',
    gender: 'Female',
    ageFrom: '20', ageTo: '30',
    experience: '2 - 5 Years',
    roleDescription: 'Premium OTT web series seeking a compelling female lead with strong screen presence. 8-episode season shooting in Goa. Must be comfortable with complex emotional arcs and water-based scenes. The character is a marine biologist uncovering secrets beneath the ocean.',
    skills: ['Acting', 'Dialogue Delivery', 'Modeling'],
    languages: ['English', 'Hindi'],
    projectStatus: 'Pre-production',
    shootStart: '2025-09-01', shootEnd: '2025-12-15',
    shootLocation: 'Goa',
    hasSponsor: 'No',
    auditionFormat: 'Self Tape',
    auditionStart: '2025-07-18', auditionEnd: '2025-07-22',
    auditionTimeFrom: '', auditionTimeTo: '',
    auditionLocationType: 'Single Location',
    auditionAddress: '',
    auditionInstructions: 'Submit a self-tape reading the provided sides. Include a brief introduction. Maximum 5 minutes total. Upload to the link provided after applying.',
    contactName: 'Rohan Sinha',
    contactEmail: 'casting@oceanicoriginals.com',
    contactMobile: '9022011234',
    compensationType: 'Paid',
    compensationDetail: 'Per Project Rate',
    amount: '80,000 - 1,20,000 per episode',
    paymentTerms: 'Monthly payouts during shoot. Travel and accommodation provided.',
    additionalRequirements: 'Must be comfortable in water. Swimming ability is mandatory. Prior OTT experience preferred.',
    deadline: 'Jul 18, 2025', daysLeft: 16, applicants: 87,
    featured: true, urgent: false,
    type: 'Web Series',
    img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=500&fit=crop',
  },
  {
    id: 3,
    title: 'Supporting Role - College Student',
    projectTitle: 'College Diaries',
    projectType: 'TV Series',
    studio: 'Campus Creations',
    verified: true,
    roleType: 'Supporting',
    shortDescription: 'Long-running TV series casting supporting roles for college-aged characters.',
    gender: 'Male',
    ageFrom: '18', ageTo: '25',
    experience: 'No Experience',
    roleDescription: 'Long-running TV series casting supporting roles for college-aged characters. 20-episode season. Fresh faces encouraged — natural energy matters more than training. The character is a fun-loving hostel roommate with comic timing.',
    skills: ['Acting', 'Comedy'],
    languages: ['Hindi'],
    projectStatus: 'In Production',
    shootStart: '2025-08-15', shootEnd: '2026-01-31',
    shootLocation: 'Delhi',
    hasSponsor: 'Yes',
    auditionFormat: 'In-Person',
    auditionStart: '2025-07-12', auditionEnd: '2025-07-15',
    auditionTimeFrom: '09:00', auditionTimeTo: '18:00',
    auditionLocationType: 'Single Location',
    auditionAddress: 'Campus Creations Studio, Okhla Phase II, New Delhi - 110020',
    auditionInstructions: 'Prepare a short comedic piece. Bring a recent photograph. Freshers are welcome — no prior training required.',
    contactName: 'Ananya Rao',
    contactEmail: 'casting@campuscreations.in',
    contactMobile: '8765432100',
    compensationType: 'Paid',
    compensationDetail: 'Per Day Rate',
    amount: '10,000 - 20,000 per episode',
    paymentTerms: 'Weekly payments. Food and transport on set.',
    additionalRequirements: 'Should look between 18-22 years. Delhi-based candidates preferred.',
    deadline: 'Jul 8, 2025', daysLeft: 6, applicants: 213,
    featured: false, urgent: true,
    type: 'TV Series',
    img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1200&h=500&fit=crop',
  },
  {
    id: 4,
    title: 'Female Actor Required',
    projectTitle: 'Sunkissed',
    projectType: 'Short Film',
    studio: 'Red Dot Studios',
    verified: false,
    roleType: 'Lead',
    shortDescription: 'Intimate short film exploring themes of self-discovery.',
    gender: 'Female',
    ageFrom: '20', ageTo: '30',
    experience: 'No Experience',
    roleDescription: 'Intimate short film exploring themes of self-discovery. Looking for a raw, honest performer with emotional availability. Freshers warmly welcome. The character is a young woman returning to her hometown after years away.',
    skills: ['Acting'],
    languages: ['Hindi'],
    projectStatus: 'Pre-production',
    shootStart: '2025-06-20', shootEnd: '2025-06-25',
    shootLocation: 'Bangalore',
    hasSponsor: 'No',
    auditionFormat: 'Online Live',
    auditionStart: '2025-07-10', auditionEnd: '2025-07-13',
    auditionTimeFrom: '11:00', auditionTimeTo: '15:00',
    auditionLocationType: 'Single Location',
    auditionAddress: '',
    auditionInstructions: 'Join via Google Meet link sent after application. Read a short scene provided on confirmation. No preparation needed — just be yourself.',
    contactName: 'Kiran Bhat',
    contactEmail: 'reddotstudios@gmail.com',
    contactMobile: '9988776655',
    compensationType: 'Paid',
    compensationDetail: 'Fixed',
    amount: '5,000 - 10,000',
    paymentTerms: 'Full payment on shoot completion.',
    additionalRequirements: 'Must be available for 5 continuous shoot days in Bangalore.',
    deadline: 'Jul 5, 2025', daysLeft: 3, applicants: 34,
    featured: false, urgent: true,
    type: 'Short Film',
    img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=500&fit=crop',
  },
  {
    id: 5,
    title: 'Background Dancers - Music Video',
    projectTitle: 'Rang De (Single)',
    projectType: 'Music Video',
    studio: 'T-Series',
    verified: true,
    roleType: 'Background / Extra',
    shortDescription: 'Major label music video requiring 10 background dancers.',
    gender: 'Any',
    ageFrom: '18', ageTo: '30',
    experience: 'Less than 1 Year',
    roleDescription: 'Major label music video requiring 10 background dancers. Bollywood and contemporary fusion style. 3-day shoot. Good stamina and ability to pick up choreography quickly. Rehearsals scheduled 2 days before shoot.',
    skills: ['Dance'],
    languages: ['Hindi'],
    projectStatus: 'Pre-production',
    shootStart: '2025-07-15', shootEnd: '2025-07-17',
    shootLocation: 'Mumbai',
    hasSponsor: 'Yes',
    auditionFormat: 'In-Person',
    auditionStart: '2025-07-08', auditionEnd: '2025-07-09',
    auditionTimeFrom: '10:00', auditionTimeTo: '16:00',
    auditionLocationType: 'Single Location',
    auditionAddress: 'T-Series Studios, Andheri West, Mumbai - 400053',
    auditionInstructions: 'Wear comfortable dance attire. Be prepared to learn a short choreography on the spot. Bring water and energy.',
    contactName: 'Deepa Nair',
    contactEmail: 'auditions@tseries.net',
    contactMobile: '8001234567',
    compensationType: 'Paid',
    compensationDetail: 'Per Day Rate',
    amount: '3,000 per day',
    paymentTerms: 'Daily cash payment. Meals provided on set.',
    additionalRequirements: 'Prior dance training preferred. Must be available all 3 shoot days.',
    deadline: 'Jul 8, 2025', daysLeft: 6, applicants: 211,
    featured: false, urgent: true,
    type: 'Music Video',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&h=500&fit=crop',
  },
  {
    id: 6,
    title: 'Voice Artist - Animation Series',
    projectTitle: 'Jungle Tales Season 2',
    projectType: 'Web Series',
    studio: 'Green Gold Animation',
    verified: true,
    roleType: 'Voice Over',
    shortDescription: "Children's animation series returning for a second season.",
    gender: 'Female',
    ageFrom: '22', ageTo: '40',
    experience: '2 - 5 Years',
    roleDescription: "Children's animation series returning for a second season. Warm, expressive female voice needed for the lead character 'Zara the Fox'. Must have home recording setup with clean audio quality. Character is playful, curious, and kind.",
    skills: ['Voice Over', 'Singing'],
    languages: ['Hindi', 'English'],
    projectStatus: 'Pre-production',
    shootStart: '2025-08-10', shootEnd: '2025-09-30',
    shootLocation: 'Remote',
    hasSponsor: 'Yes',
    auditionFormat: 'Self Tape',
    auditionStart: '2025-07-20', auditionEnd: '2025-07-22',
    auditionTimeFrom: '', auditionTimeTo: '',
    auditionLocationType: 'Single Location',
    auditionAddress: '',
    auditionInstructions: 'Record a 60-second voice reel using the provided script. Submit as MP3 or WAV. Include your name and contact in the file name.',
    contactName: 'Suresh Iyer',
    contactEmail: 'casting@greengold.tv',
    contactMobile: '9123456789',
    compensationType: 'Paid',
    compensationDetail: 'Fixed',
    amount: '50,000 - 80,000',
    paymentTerms: 'Per episode payment on delivery and approval.',
    additionalRequirements: 'Must have a quiet home recording setup. Professional mic required. Ability to voice in both Hindi and English.',
    deadline: 'Aug 1, 2025', daysLeft: 30, applicants: 28,
    featured: false, urgent: false,
    type: 'OTT',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=500&fit=crop',
  },
  {
    id: 7,
    title: 'Male Model - Grooming Brand TVC',
    projectTitle: 'GQ Man Campaign',
    projectType: 'Commercial',
    studio: 'McCann Worldgroup India',
    verified: true,
    roleType: 'Host / Anchor',
    shortDescription: "National TVC for a leading men's grooming brand.",
    gender: 'Male',
    ageFrom: '22', ageTo: '32',
    experience: '1 - 2 Years',
    roleDescription: "National TVC for a leading men's grooming brand. Looking for a sharp, well-groomed male with strong screen presence. Face will appear on national TV, print, and digital platforms. Campaign runs for 6 months.",
    skills: ['Modeling', 'Acting'],
    languages: ['Hindi', 'English'],
    projectStatus: 'Pre-production',
    shootStart: '2025-08-05', shootEnd: '2025-08-07',
    shootLocation: 'Mumbai',
    hasSponsor: 'Yes',
    auditionFormat: 'In-Person',
    auditionStart: '2025-07-25', auditionEnd: '2025-07-27',
    auditionTimeFrom: '11:00', auditionTimeTo: '17:00',
    auditionLocationType: 'Single Location',
    auditionAddress: 'McCann Worldgroup, Lower Parel, Mumbai - 400013',
    auditionInstructions: 'Bring a portfolio or lookbook. Arrive well-groomed. Walk and pose will be assessed. Bring both formal and casual outfits.',
    contactName: 'Kavya Pillai',
    contactEmail: 'talent@mccann.in',
    contactMobile: '9876501234',
    compensationType: 'Paid',
    compensationDetail: 'Negotiable',
    amount: '1,50,000 - 3,00,000',
    paymentTerms: 'Advance on contract signing. Remainder on shoot completion. Royalties if applicable.',
    additionalRequirements: "Height minimum 5'10\". Well-groomed appearance. Prior TVC or print experience preferred.",
    deadline: 'Jul 25, 2025', daysLeft: 23, applicants: 156,
    featured: true, urgent: false,
    type: 'Ad Film',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&h=500&fit=crop',
  },
  {
    id: 8,
    title: 'Ensemble Cast - Theatre Production',
    projectTitle: 'Andhera Ujala',
    projectType: 'Other',
    studio: 'Prithvi Theatre',
    verified: true,
    roleType: 'Supporting',
    shortDescription: 'Original Hindi play exploring urban loneliness.',
    gender: 'Any',
    ageFrom: '20', ageTo: '50',
    experience: 'No Experience',
    roleDescription: 'Original Hindi play exploring urban loneliness. Seeking 6 actors for ensemble cast. Strong stage presence and Hindi fluency mandatory. Physical theatre background a plus. 3-week rehearsal period before opening night.',
    skills: ['Acting', 'Dialogue Delivery'],
    languages: ['Hindi'],
    projectStatus: 'Pre-production',
    shootStart: '2025-09-10', shootEnd: '2025-10-05',
    shootLocation: 'Mumbai',
    hasSponsor: 'No',
    auditionFormat: 'In-Person',
    auditionStart: '2025-07-28', auditionEnd: '2025-07-30',
    auditionTimeFrom: '14:00', auditionTimeTo: '19:00',
    auditionLocationType: 'Single Location',
    auditionAddress: 'Prithvi Theatre, Juhu, Mumbai - 400049',
    auditionInstructions: 'Prepare a 3-minute monologue in Hindi. Be prepared for a cold read and physical warm-up exercises. No prior theatre experience required.',
    contactName: 'Meera Krishnan',
    contactEmail: 'auditions@prithvitheatre.org',
    contactMobile: '7700988776',
    compensationType: 'Reimbursement',
    compensationDetail: 'Fixed',
    amount: 'Stipend Provided',
    paymentTerms: 'Weekly stipend during rehearsals and run. Travel reimbursed.',
    additionalRequirements: 'Must commit to full rehearsal schedule. Mumbai-based or willing to relocate temporarily.',
    deadline: 'Jul 30, 2025', daysLeft: 28, applicants: 47,
    featured: false, urgent: false,
    type: 'Theatre',
    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=500&fit=crop',
  },
  {
    id: 9,
    title: 'Stunt Performer - Action Thriller',
    projectTitle: 'Operation Zero',
    projectType: 'Film',
    studio: 'Prime Lens Studios',
    verified: true,
    roleType: 'Supporting',
    shortDescription: 'High-octane action film requiring a trained stunt performer.',
    gender: 'Male',
    ageFrom: '25', ageTo: '40',
    experience: '5 - 10 Years',
    roleDescription: 'High-octane action film requiring a trained stunt performer for the male lead double. Martial arts background essential. Wire work and vehicle stunts experience preferred. Intensive 3-week stunt shoot.',
    skills: ['Stunts', 'Acting'],
    languages: ['Tamil', 'Hindi'],
    projectStatus: 'Pre-production',
    shootStart: '2025-08-01', shootEnd: '2025-08-21',
    shootLocation: 'Chennai',
    hasSponsor: 'Yes',
    auditionFormat: 'In-Person',
    auditionStart: '2025-07-14', auditionEnd: '2025-07-15',
    auditionTimeFrom: '09:00', auditionTimeTo: '13:00',
    auditionLocationType: 'Single Location',
    auditionAddress: 'Prime Lens Studios, Kodambakkam, Chennai - 600024',
    auditionInstructions: 'Demonstrate martial arts form. Bring safety certification if available. Medical fitness certificate required on day of audition.',
    contactName: 'Arjun Reddy',
    contactEmail: 'casting@primelensstudios.com',
    contactMobile: '9500012345',
    compensationType: 'Paid',
    compensationDetail: 'Negotiable',
    amount: '80,000 - 1,20,000',
    paymentTerms: 'Weekly payment. Accident insurance provided. Risk allowance included.',
    additionalRequirements: 'Physically fit. Martial arts certification required. Experience with wire rigs preferred.',
    deadline: 'Jul 12, 2025', daysLeft: 10, applicants: 19,
    featured: false, urgent: true,
    type: 'Feature Film',
    img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=500&fit=crop',
  },
  {
    id: 10,
    title: 'Indie Film - Lead Actress',
    projectTitle: 'Khaali Raaste',
    projectType: 'Short Film',
    studio: 'Independent / Student Film',
    verified: false,
    roleType: 'Lead',
    shortDescription: 'FTII student graduation film about a woman navigating grief.',
    gender: 'Female',
    ageFrom: '20', ageTo: '30',
    experience: 'No Experience',
    roleDescription: 'FTII student graduation film about a woman navigating grief in a new city. No prior experience needed — passion and emotional availability matter most. The character is quiet, observant, and on the verge of something life-changing.',
    skills: ['Acting'],
    languages: ['Kannada', 'Hindi'],
    projectStatus: 'Pre-production',
    shootStart: '2025-08-10', shootEnd: '2025-08-18',
    shootLocation: 'Bangalore',
    hasSponsor: 'No',
    auditionFormat: 'Online Live',
    auditionStart: '2025-08-01', auditionEnd: '2025-08-03',
    auditionTimeFrom: '10:00', auditionTimeTo: '14:00',
    auditionLocationType: 'Single Location',
    auditionAddress: '',
    auditionInstructions: 'Short conversation-based audition on Google Meet. No script preparation needed. Just bring your honest self.',
    contactName: 'Neel Joshi',
    contactEmail: 'khaalirastey@gmail.com',
    contactMobile: '8800123456',
    compensationType: 'Unpaid',
    compensationDetail: 'Revenue Share',
    amount: 'Credited / Unpaid',
    paymentTerms: 'Festival run credit. Certificate of participation provided.',
    additionalRequirements: 'Must speak basic Kannada. Bangalore-based preferred but not mandatory.',
    deadline: 'Aug 5, 2025', daysLeft: 34, applicants: 22,
    featured: false, urgent: false,
    type: 'Short Film',
    img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=500&fit=crop',
  },
]

/* ── Sidebar nav items ── */
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard'       },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications' },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',        badge: 2 },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions'        },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings'  },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended'     },
  { icon: Bell,            label: 'Notifications',        href: '/notifications',   badge: 3 },
]

const DROPDOWN_LINKS = [
  { label: 'My Profile',   href: '/my-profile'            },
  { label: 'Subscription', href: '/dashboard/subscription' },
  { label: 'Analytics',    href: '/analytics'             },
  { label: 'Calendar',     href: '/calendar'              },
  { label: 'Settings',     href: '/settings'              },
  { label: 'Support',      href: '/contact'               },
  { label: 'Logout',       href: ''                       },
]

/* ── Type badge colour map ── */
function typeBadgeStyle(type: string) {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    'Feature Film': { bg: 'rgba(200,32,42,0.15)',  border: 'rgba(200,32,42,0.35)',  text: '#e05560' },
    'Web Series':   { bg: 'rgba(212,166,74,0.15)', border: 'rgba(212,166,74,0.35)', text: GOLD      },
    'TV Series':    { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.35)', text: '#818cf8' },
    'OTT':          { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)',  text: '#818cf8' },
    'Ad Film':      { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',   text: '#4ade80' },
    'Short Film':   { bg: 'rgba(255,255,255,0.06)',border: 'rgba(255,255,255,0.12)',text: 'rgba(255,255,255,0.5)' },
    'Music Video':  { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)',  text: '#f472b6' },
    'Theatre':      { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)',  text: '#fbbf24' },
  }
  return map[type] ?? { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', text: 'rgba(255,255,255,0.5)' }
}

/* ── Audition format icon ── */
function AuditionFormatIcon({ format }: { format: string }) {
  const icons: Record<string, React.ReactNode> = {
    'In-Person':   <UsersRound size={15} color={GOLD} />,
    'Self Tape':   <Video size={15} color={GOLD} />,
    'Online Live': <Radio size={15} color={GOLD} />,
    'Hybrid':      <Users size={15} color={GOLD} />,
  }
  return <>{icons[format] ?? <Clapperboard size={15} color={GOLD} />}</>
}

/* ── Simple detail row ── */
function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: '#fff', textAlign: 'right' as const }}>{value}</span>
    </div>
  )
}

/* ── Section card ── */
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 22, height: '100%', boxSizing: 'border-box' as const }}>
      <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{title}</div>
      {children}
    </div>
  )
}

/* ── Contact section ── */
function ContactSection({ c, isLoggedIn, isSubscribed }: {
  c: typeof CASTINGS[0]; isLoggedIn: boolean; isSubscribed: boolean
}) {
  const contact = { name: c.contactName, phone: c.contactPhone || c.contactMobile ? `+91 ${(c.contactPhone || c.contactMobile || '').replace(/^\+91\s*/, '').replace(/^91/, '').trim()}` : '', email: c.contactEmail }

  if (!isLoggedIn) {
    return (
      <Card title="Agency Contact Details">
        <div style={{ position: 'relative' as const }}>
          {/* Blurred placeholder rows */}
          {['Contact Person', 'Phone', 'Email'].map(label => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{label}</div>
                <div style={{ height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.06)', width: '65%', filter: 'blur(5px)' }} />
              </div>
            </div>
          ))}
          {/* Lock overlay */}
          <div style={{ position: 'absolute' as const, inset: -22, background: 'rgba(5,5,5,0.75)', backdropFilter: 'blur(3px)', borderRadius: 12, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={19} color={RED} />
            </div>
            <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Sign in to view contact details</div>
            <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', textAlign: 'center' as const, maxWidth: 240, lineHeight: 1.5 }}>Create a free account to apply and contact agencies directly.</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <Link href="/login"  style={{ padding: '9px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#fff', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 600 }}>Log In</Link>
              <Link href="/signup" style={{ padding: '9px 20px', background: RED, borderRadius: 7, color: '#fff', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 700 }}>Sign Up Free</Link>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (!isSubscribed) {
    const maskPhone = contact.phone.slice(0, -5) + 'XXXXX'
    const maskEmail = contact.email.split('@')[0].slice(0, 3) + '***@' + contact.email.split('@')[1]
    return (
      <Card title="Agency Contact Details">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: -36, marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontFamily: BARLOW, color: GOLD, background: 'rgba(212,166,74,0.1)', border: '1px solid rgba(212,166,74,0.25)', borderRadius: 20, padding: '3px 10px' }}>👑 Premium</span>
        </div>
        <DetailRow label="Contact Person" value={contact.name} />
        <div style={{ padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Phone</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>{maskPhone}</span>
              <Lock size={12} color={GOLD} />
            </div>
          </div>
        </div>
        <div style={{ padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Email</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>{maskEmail}</span>
              <Lock size={12} color={GOLD} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, background: 'linear-gradient(135deg, rgba(212,166,74,0.08), rgba(212,166,74,0.03))', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const }}>
          <div>
            <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Unlock full contact details</div>
            <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)' }}>Subscribe to reveal phone & email of all agencies.</div>
          </div>
          <Link href="/dashboard/subscription" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: GOLD, color: '#000', textDecoration: 'none', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, padding: '9px 18px', borderRadius: 7, whiteSpace: 'nowrap' as const }}>
            👑 Subscribe Now
          </Link>
        </div>
      </Card>
    )
  }

  // Subscribed — full details
  return (
    <Card title="Agency Contact Details">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: -36, marginBottom: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontFamily: BARLOW, color: GREEN, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '3px 10px' }}>
          <CheckCircle size={11} fill={GREEN} color={GREEN} /> Verified Access
        </span>
      </div>
      <DetailRow label="Contact Person" value={contact.name} />
      <div style={{ padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Phone</span>
        <a href={`tel:${contact.phone}`} style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: GREEN, textDecoration: 'none' }}>{contact.phone}</a>
      </div>
      <div style={{ padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Email</span>
        <a href={`mailto:${contact.email}`} style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: GREEN, textDecoration: 'none' }}>{contact.email}</a>
      </div>
    </Card>
  )
}

/* ── Auth helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ? { Authorization: `Bearer ${u.token}` } : {}
  } catch { return {} }
}

/* ══ MAIN PAGE ══ */
export default function PublicCastingDetailPage() {
  const params   = useParams()
  const router   = useRouter()
  const [isLoggedIn,   setIsLoggedIn]   = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [userName,     setUserName]     = useState('My Account')
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [saving,       setSaving]       = useState(false)

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const token = u.token
      if (!token) { router.push('/login'); return }
      if (saved) {
        await fetch(`/api/saved-castings?casting_call_id=${rawId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        setSaved(false)
      } else {
        await fetch('/api/saved-castings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ casting_call_id: rawId }) })
        setSaved(true)
      }
    } catch {} finally { setSaving(false) }
  }
  const [applying,     setApplying]     = useState(false)
  const [applied,      setApplied]      = useState(false)
  const [applyError,   setApplyError]   = useState('')
  const [applySuccess, setApplySuccess] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverLetter,  setCoverLetter]  = useState('')
  const [casting,      setCasting]      = useState<typeof CASTINGS[0] | null>(null)
  const [loading,      setLoading]      = useState(true)
  const [notifCount,   setNotifCount]   = useState(0)
  const [msgCount,     setMsgCount]     = useState(0)
  const rawId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : ''

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u?.loggedIn) {
        setIsLoggedIn(true)
        if (u.name)       setUserName(u.name)
        if (u.subscribed || u.plan) setIsSubscribed(true)
      }
    } catch {}
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    window.location.replace('/login')
  }

  /* ── Fetch casting call by ID ── */
  useEffect(() => {
    if (!rawId) { setLoading(false); return }
    const h = getAuthHeaders()

    // Check if already saved
    fetch('/api/saved-castings', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.data?.saved ?? data.saved ?? []
        const isSaved = list.some((s: any) => s.casting_calls?.id === rawId || s.casting_call_id === rawId)
        if (isSaved) setSaved(true)
      })
      .catch(() => {})

    // Check if already applied
    fetch(`/api/applications?limit=100`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.data?.applications ?? data.applications ?? []
        const hasApplied = list.some((a: any) => a.casting_call_id === rawId)
        if (hasApplied) setApplied(true)
      })
      .catch(() => {})

    // Try API first, fall back to hardcoded CASTINGS
    fetch(`/api/casting-calls/${rawId}`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) {
          // Fallback: try hardcoded list
          const numId = parseInt(rawId)
          const found = CASTINGS.find(x => x.id === numId)
          setCasting(found ?? null)
          return
        }
        const c = data.data?.castingCall ?? data.data?.casting_call ?? data.castingCall ?? data
        // Normalise API fields → casting shape
        const deadlineDate = c.last_application_date ?? c.applicationDeadline
        const daysLeft = deadlineDate
          ? Math.max(0, Math.floor((new Date(deadlineDate).getTime() - Date.now()) / 86400000))
          : 30
        const budgetMin = c.budget_min ?? c.budgetMin
        const budgetMax = c.budget_max ?? c.budgetMax
        const fmt = (n: unknown) => String(Number(String(n)).toLocaleString('en-IN'))
        const budgetMinNum = budgetMin ? Number(String(budgetMin)) : 0
        const budgetMaxNum = budgetMax ? Number(String(budgetMax)) : 0
        const rupee = '\u20B9'
        setCasting({
          id:               c.id,
          title:            c.title ?? '',
          projectTitle:     c.project_type ?? c.title ?? '',
          project:          c.project_type ?? c.projectName ?? c.title ?? '',
          studio:           c.agency_profiles?.company_name ?? c.agency?.name ?? '',
          verified:         c.agency_profiles?.verification_status === 'approved',
          type:             c.project_type ?? c.projectType ?? 'Feature Film',
          role:             c.role_name ?? c.role ?? '',
          roleType:         c.role_name ?? c.role ?? '',
          gender:           c.gender_preference ?? c.gender ?? 'Any',
          ageFrom:          c.age_min ? String(c.age_min) : '',
          ageTo:            c.age_max ? String(c.age_max) : '',
          ageRange:         c.age_min && c.age_max ? `${c.age_min}-${c.age_max}` : c.ageRange ?? '',
          location:         c.location ?? '',
          shootLocation:    c.location ?? '',
          shootStart:       c.shoot_start ? new Date(c.shoot_start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          shootEnd:         c.shoot_end ? new Date(c.shoot_end).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          projectStatus:    c.project_status ?? '',
          hasSponsor:       c.has_sponsor ?? '',
          auditionFormat:   c.audition_mode === 'offline' ? 'In-Person' : c.audition_mode === 'online' ? 'Online' : c.audition_mode === 'both' ? 'In-Person & Online' : '',
          auditionStart:    c.audition_start ? new Date(c.audition_start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          auditionEnd:      c.audition_end   ? new Date(c.audition_end).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          auditionTimeFrom: c.audition_time_from ?? '',
          auditionTimeTo:   c.audition_time_to   ?? '',
          auditionLocationType: c.audition_location_type ?? '',
          auditionAddress:  c.audition_details ?? '',
          deadline:         deadlineDate ? new Date(deadlineDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
          daysLeft,
          auditDate:        c.audition_start ? new Date(c.audition_start).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : c.audition_details ?? '',
          compensation:     budgetMinNum > 0
            ? (budgetMinNum === budgetMaxNum ? rupee + fmt(budgetMinNum) : rupee + fmt(budgetMinNum) + ' - ' + rupee + fmt(budgetMaxNum))
            : c.compensation_details ?? '',
          compensationType:       c.compensation_type ?? (c.compensation_details ? 'Paid' : 'Paid'),
          compensationDetail:     c.compensation_detail ?? c.compensationDetail ?? '',
          paymentTerms:           c.payment_terms ?? '',
          auditionInstructions:   c.audition_instructions ?? c.auditionInstructions ?? '',
          additionalRequirements: c.additional_requirements ?? c.additionalRequirements ?? '',
          experience:       c.experience_level ?? c.experience ?? 'Any',
          category:         c.category ?? 'Actor',
          applicants:       c._count?.applications ?? c.applications_count ?? 0,
          languages:        Array.isArray(c.languages_required) ? c.languages_required : [],
          skills:           Array.isArray(c.skills_required) ? c.skills_required : [],
          shortDescription: c.eligibility_criteria ?? '',
          roleDescription:  c.role_description ?? '',
          contactEmail:     c.contact_email ?? c.agency_profiles?.contact_email ?? '',
          contactPhone:     c.contact_mobile ?? c.contact_phone ?? c.agency_profiles?.contact_phone ?? '',
          contactMobile:    c.contact_mobile ?? c.contact_phone ?? c.agency_profiles?.contact_phone ?? '',
          contactName:      c.contact_name ?? '',
          howToApply:       Array.isArray(c.how_to_apply) ? c.how_to_apply : [],
          tags:             [c.role_name ?? c.role, c.gender_preference ?? c.gender].filter(Boolean),
          img:              c.cover_image ?? c.coverImage ?? 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=160&h=120&fit=crop',
          urgent:           daysLeft <= 7,
          featured:         false,
        } as typeof CASTINGS[0])
      })
      .catch(() => {
        const numId = parseInt(rawId)
        const found = CASTINGS.find(x => x.id === numId)
        setCasting(found ?? null)
      })
      .finally(() => setLoading(false))

    // Live badge counts
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.data?.notifications ?? data.notifications ?? data
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.read && !n.isRead).length)
      }).catch(() => {})

    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.data?.conversations ?? data.conversations ?? data
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length)
      }).catch(() => {})
  }, [rawId])
  /* -- Apply to casting call -- */
  const handleApply = async () => {
    if (!isLoggedIn) { router.push('/login'); return; }
    if (applying || applied) return;
    setApplying(true);
    setApplyError('');
    try {
      const h = getAuthHeaders();
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...h },
        body: JSON.stringify({ casting_call_id: rawId, cover_note: coverLetter.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApplyError(data.error ?? data.message ?? 'Failed to apply. Please try again.');
        return;
      }
      setApplied(true);
      setApplySuccess(true);
      setShowApplyModal(false);
    } catch {
      setApplyError('Network error. Please check your connection.');
    } finally {
      setApplying(false);
    }
  };

  const c = casting
  const SB_W = sidebarOpen ? 220 : 52

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontSize: 18 }}>
        Loading...
      </div>
    )
  }

  if (!c) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, fontFamily: BARLOW, color: '#F5F5F5', gap: 16 }}>
        <AlertCircle size={40} color="rgba(255,255,255,0.25)" />
        <div style={{ fontSize: 22, fontFamily: BEBAS, letterSpacing: 1, color: 'rgba(255,255,255,0.6)' }}>Casting call not found</div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', textAlign: 'center' as const, maxWidth: 380, lineHeight: 1.6 }}>This casting call may have been removed or the link may be incorrect.</div>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: RED, border: 'none', borderRadius: 8, padding: '11px 22px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
          <ChevronLeft size={16} /> Back
        </button>
      </div>
    )
  }

  const badge  = typeBadgeStyle(c.type)
  const urgent = c.daysLeft <= 7
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ═══ TOPNAV ═══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', height: 60, flexShrink: 0, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative' as const, zIndex: 100 }}>
        <span style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 2, color: '#F5F5F5', cursor: 'pointer', flexShrink: 0 }} onClick={() => router.push('/')}>
          SILVER<span style={{ color: RED }}>SCREENS</span>
        </span>
        <div style={{ flex: 1 }} />
        {isLoggedIn ? (
          <>
            <button onClick={() => router.push('/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
              + Find Casting Calls
            </button>
            <div onClick={() => router.push('/notifications')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={16} /></div>
              {notifCount > 0 && <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{notifCount}</div>}
            </div>
            <div onClick={() => router.push('/messages')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={16} /></div>
              {msgCount > 0 && <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{msgCount}</div>}
            </div>
            <div style={{ position: 'relative' as const }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff', border: `2px solid ${GOLD}`, flexShrink: 0 }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{userName}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Aspirant</div>
                </div>
                <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
              </div>
              {dropdownOpen && (
                <>
                  <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed' as const, inset: 0, zIndex: 150 }} />
                  <div style={{ position: 'absolute' as const, top: 46, right: 0, width: 190, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                    {DROPDOWN_LINKS.map(({ label, href }) => (
                      <div key={label} onClick={() => { setDropdownOpen(false); label === 'Logout' ? handleLogout() : router.push(href) }}
                        style={{ padding: '11px 16px', fontSize: 16, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#fff', background: 'transparent', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >{label}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/login"  style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 600, borderRadius: 6 }}>Log In</Link>
            <Link href="/signup" style={{ padding: '8px 18px', background: RED, color: '#fff', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, borderRadius: 6 }}>Sign Up Free</Link>
          </div>
        )}
      </header>

      {/* ═══ BODY ═══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── COLLAPSIBLE NAV SIDEBAR (logged-in only) ── */}
        {isLoggedIn && (
          <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const, overflowX: 'hidden', scrollbarWidth: 'none' as const, transition: 'width 0.2s ease' }}>
            <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
            </div>
            <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto' as const, scrollbarWidth: 'none' as const }}>
              {SIDEBAR_ITEMS.map(({ icon: Icon, label, href, badge }) => {
                const active = href === '/casting-calls'
                return (
                  <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? GOLD_DIM : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none', position: 'relative' as const }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(200,32,42,0.12)' : 'transparent' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0, justifyContent: 'center' }}>
                      <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                      {sidebarOpen && <span style={{ fontSize: 15, fontWeight: active ? 600 : 400, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' as const }}>{label}</span>}
                    </div>
                    {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' as const }}>{badge}</div>}
                    {!sidebarOpen && badge && <div style={{ position: 'absolute' as const, top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{badge}</div>}
                  </div>
                )
              })}
            </nav>
            {sidebarOpen && (
              <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '14px 12px', textAlign: 'center' as const, flexShrink: 0 }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 3 }}>Upgrade to Premium</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock agency contact details and more.</div>
                <button onClick={() => router.push('/dashboard/subscription')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
              </div>
            )}
          </aside>
        )}

        {/* ── MAIN SCROLL AREA ── */}
        <div style={{ flex: 1, overflowY: 'auto' as const }}>

          {/* Back */}
          <div style={{ padding: '16px 28px 0' }}>
            <button onClick={() => router.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
            >
              <ChevronLeft size={16} /> Back
            </button>
          </div>

          {/* Hero */}
          <div style={{ position: 'relative' as const, margin: '16px 28px 0', borderRadius: 14, overflow: 'hidden', height: 220 }}>
            <img src={c.img} alt={c.projectTitle} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.65) 60%, rgba(5,5,5,0.2) 100%)' }} />
            <div style={{ position: 'absolute' as const, inset: 0, padding: '22px 26px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' as const }}>
                <span style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.text, fontSize: 13, fontFamily: BARLOW, fontWeight: 700, padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{c.type}</span>
                {c.featured && <span style={{ background: GOLD, color: '#050505', fontSize: 13, fontFamily: BARLOW, fontWeight: 700, padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase' as const }}>Featured</span>}
                {urgent && <span style={{ background: 'rgba(200,32,42,0.2)', border: '1px solid rgba(200,32,42,0.4)', color: RED, fontSize: 13, fontFamily: BARLOW, fontWeight: 700, padding: '3px 10px', borderRadius: 4 }}>⚡ Urgent</span>}
                {c.hasSponsor === 'Yes' && <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: 13, fontFamily: BARLOW, fontWeight: 700, padding: '3px 10px', borderRadius: 4 }}>Sponsored</span>}
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 36, letterSpacing: 2, color: '#F5F5F5', margin: '0 0 6px', lineHeight: 1 }}>{c.title}</h1>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', fontFamily: BARLOW }}>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{c.projectTitle}</span>
                <span style={{ margin: '0 8px', opacity: 0.4 }}>by</span>
                {c.studio}
                {c.verified && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 8, color: '#60a5fa', fontSize: 14 }}>✔ Verified</span>}
              </div>
            </div>
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 20, padding: '20px 28px 48px', alignItems: 'start' }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

              {/* Quick stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { icon: <MapPin size={14} color={GOLD} />,   label: 'Shoot Location', val: c.shootLocation },
                  { icon: <Calendar size={14} color={GOLD} />, label: 'Audition Dates', val: c.auditionStart ? `${formatDate(c.auditionStart)} - ${formatDate(c.auditionEnd)}` : 'To be announced' },
                  { icon: <Clock size={14} color={urgent ? RED : GOLD} />, label: 'Deadline', val: c.deadline },
                  { icon: <Users size={14} color={GOLD} />,    label: 'Applied',         val: `${c.applicants} applicants` },
                ].map(stat => (
                  <div key={stat.label} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>{stat.icon}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{stat.label}</span></div>
                    <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: stat.label === 'Deadline' && urgent ? RED : '#fff' }}>{stat.val}</div>
                  </div>
                ))}
              </div>

              {/* Role Description */}
              <Card title="About This Role">
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', fontFamily: BARLOW, lineHeight: 1.7, margin: 0 }}>{c.roleDescription}</p>
              </Card>

              {/* Role Requirements + Project Details — two cards side by side, equal height */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'stretch' }}>
                <Card title="Role Requirements">
                  <DetailRow label="Role Type"      value={c.roleType} />
                  <DetailRow label="Gender"         value={c.gender} />
                  <DetailRow label="Age Range"      value={c.ageFrom && c.ageTo ? `${c.ageFrom} - ${c.ageTo} Years` : ''} />
                  <DetailRow label="Experience"     value={c.experience} />
                  <DetailRow label="Languages"      value={c.languages.join(', ')} />
                  <DetailRow label="Project Status" value={c.projectStatus} />
                  {c.skills.length > 0 && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 7 }}>Required Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                        {c.skills.map(s => (
                          <span key={s} style={{ fontSize: 13, fontFamily: BARLOW, color: RED, border: `1px solid ${RED}`, borderRadius: 16, padding: '2px 10px' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>

                <Card title="Project Details">
                  <DetailRow label="Project Type"    value={c.projectType} />
                  <DetailRow label="Project Status"  value={c.projectStatus} />
                  <DetailRow label="Shoot Location"  value={c.shootLocation} />
                  <DetailRow label="Shoot Start"     value={formatDate(c.shootStart)} />
                  <DetailRow label="Shoot End"       value={formatDate(c.shootEnd)} />
                  <DetailRow label="Sponsored"       value={c.hasSponsor} />
                  <DetailRow label="Languages"       value={Array.isArray(c.languages) ? c.languages.join(', ') : ''} />
                  {((c as any).compensation || c.amount) && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 6 }}>Compensation</div>
                      <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: GOLD }}>{(c as any).compensation || `Rs.${c.amount}`}</div>
                      {c.compensationType && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginTop: 2 }}>{c.compensationType}{c.compensationDetail ? ` · ${c.compensationDetail}` : ''}</div>}
                    </div>
                  )}
                </Card>
              </div>

              {/* Additional Requirements — full width above the two-column row */}
              {c.additionalRequirements && (
                <Card title="Additional Requirements">
                  <p style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: 0 }}>{c.additionalRequirements}</p>
                </Card>
              )}

              {/* Audition Details + Agency Contact — two cards side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
                <Card title="Audition Details">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '9px 12px', background: BG3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <AuditionFormatIcon format={c.auditionFormat} />
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Format</div>
                      <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{c.auditionFormat}</div>
                    </div>
                  </div>
                  <DetailRow label="Start Date"    value={formatDate(c.auditionStart)} />
                  <DetailRow label="End Date"      value={formatDate(c.auditionEnd)} />
                  {c.auditionTimeFrom && <DetailRow label="Time" value={`${c.auditionTimeFrom} - ${c.auditionTimeTo}`} />}
                  <DetailRow label="Location Type" value={c.auditionLocationType} />

                  {/* Address — hidden for guests */}
                  {c.auditionAddress && (
                    isLoggedIn ? (
                      <div style={{ marginTop: 10, padding: '9px 12px', background: BG3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <MapPin size={13} color={GOLD} style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 2 }}>Audition Address</div>
                          <div style={{ fontSize: 14, fontFamily: BARLOW, color: '#fff', lineHeight: 1.5 }}>{c.auditionAddress}</div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 10, padding: '9px 12px', background: BG3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Lock size={13} color={RED} style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 2 }}>Audition Address</div>
                          <Link href="/login" style={{ fontSize: 14, fontFamily: BARLOW, color: RED, textDecoration: 'none', fontWeight: 600 }}>Sign in to view address</Link>
                        </div>
                      </div>
                    )
                  )}

                  {c.auditionInstructions && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 6 }}>
                        <Info size={12} color={GOLD} /> Instructions
                      </div>
                      <p style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>{c.auditionInstructions}</p>
                    </div>
                  )}
                </Card>

                {/* Agency Contact — same visual style, sits beside Audition Details */}
                <ContactSection c={c} isLoggedIn={isLoggedIn} isSubscribed={isSubscribed} />
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14, position: 'sticky' as const, top: 16 }}>

              {/* Apply card */}
              <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 3 }}>Compensation</div>
                <div style={{ fontSize: 22, fontFamily: BARLOW, fontWeight: 700, color: GOLD, marginBottom: 2 }}>{(c as any).compensation || (c.amount ? `Rs.${c.amount}` : '—')}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginBottom: 4 }}>{c.compensationType}{c.compensationDetail ? ` · ${c.compensationDetail}` : ''}</div>
                {c.paymentTerms && (
                  <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {c.paymentTerms}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: urgent ? RED : 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontWeight: urgent ? 700 : 400, marginBottom: 16 }}>
                  <Clock size={13} color={urgent ? RED : 'rgba(255,255,255,0.3)'} />
                  Deadline: {c.deadline}{urgent && <span>({c.daysLeft}d left)</span>}
                </div>
                {isLoggedIn ? (
                <>
                  {applySuccess ? (
                    <div style={{ width: '100%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 8, padding: '12px 0', fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#22C55E', textAlign: 'center', letterSpacing: 0.5 }}>
                      Applied Successfully!
                    </div>
                  ) : applied ? (
                    <button disabled style={{ width: '100%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 8, padding: '12px 0', fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#22c55e', cursor: 'not-allowed', letterSpacing: 0.5 }}>
                      ✓ Already Applied
                    </button>
                  ) : (
                    <button onClick={() => setShowApplyModal(true)} style={{ width: '100%', background: RED, border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer', letterSpacing: 0.5 }}>
                      Apply Now
                    </button>
                  )}
                  {!applied && applyError && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 8, fontSize: 14, fontFamily: BARLOW, color: '#fca5a5', textAlign: 'center' }}>
                      {applyError}
                    </div>
                  )}
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                    <Link href="/signup" style={{ display: 'block', textAlign: 'center' as const, background: RED, borderRadius: 8, padding: '12px 0', fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>Sign Up to Apply</Link>
                    <Link href="/login"  style={{ display: 'block', textAlign: 'center' as const, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '10px 0', fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Log In</Link>
                  </div>
                )}

                {/* Cover Letter / Apply Modal */}
                {showApplyModal && (
                  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '28px 24px', width: '100%', maxWidth: 480 }}>
                      <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1, color: '#fff', marginBottom: 4 }}>Apply for this Role</div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 20 }}>
                        {c?.title} · {c?.studio}
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                          Cover Letter / Note <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <textarea
                          value={coverLetter}
                          onChange={e => setCoverLetter(e.target.value)}
                          placeholder="Tell the casting team why you're a great fit for this role. Mention your relevant experience, why this role excites you, and anything that sets you apart..."
                          maxLength={1000}
                          rows={6}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
                          onFocus={e => e.currentTarget.style.borderColor = 'rgba(212,166,74,0.5)'}
                          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <div style={{ textAlign: 'right', fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW, marginTop: 4 }}>{coverLetter.length}/1000</div>
                      </div>

                      {applyError && (
                        <div style={{ marginBottom: 14, padding: '8px 12px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 8, fontSize: 14, fontFamily: BARLOW, color: '#fca5a5' }}>
                          {applyError}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => { setShowApplyModal(false); setApplyError(''); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 8, padding: '11px 0', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                          Cancel
                        </button>
                        <button onClick={handleApply} disabled={applying} style={{ flex: 2, background: applying ? 'rgba(200,32,42,0.5)' : RED, border: 'none', color: '#fff', borderRadius: 8, padding: '11px 0', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: applying ? 'not-allowed' : 'pointer', letterSpacing: 0.5 }}>
                          {applying ? 'Submitting...' : 'Submit Application'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={handleSave} disabled={saving} style={{ width: '100%', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'transparent', border: `1px solid ${saved ? GOLD : 'rgba(255,255,255,0.15)'}`, borderRadius: 8, padding: '10px 0', fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: saved ? GOLD : 'rgba(255,255,255,0.5)', cursor: saving ? 'default' : 'pointer' }}>
                  <Bookmark size={14} fill={saved ? GOLD : 'none'} color={saved ? GOLD : 'rgba(255,255,255,0.5)'} />
                  {saving ? '...' : saved ? 'Saved' : 'Save Casting'}
                </button>
              </div>

              {/* Studio card */}
              <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 10 }}>Posted By</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 8, background: BG3, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🎬</div>
                  <div>
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{c.studio}</div>
                    {c.verified
                      ? <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#60a5fa', fontFamily: BARLOW }}><CheckCircle size={11} fill="#60a5fa" color="#60a5fa" /> Verified Studio</div>
                      : <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Unverified</div>
                    }
                  </div>
                </div>
              </div>

              {/* Subscription upsell */}
              {isLoggedIn && !isSubscribed && (
                <div style={{ background: 'linear-gradient(135deg, rgba(212,166,74,0.08), rgba(212,166,74,0.03))', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 12, padding: 18, textAlign: 'center' as const }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
                  <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 5 }}>Go Premium</div>
                  <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, marginBottom: 14 }}>Unlock agency contacts, priority applications, and more.</div>
                  <Link href="/dashboard/subscription" style={{ display: 'block', background: GOLD, color: '#000', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, padding: '10px 0', borderRadius: 8 }}>View Plans</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}