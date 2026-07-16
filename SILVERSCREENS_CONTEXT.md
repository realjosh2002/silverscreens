# SilverScreens Project Context
*Paste this at the start of every new chat session*

## Project Overview
Building SilverScreens — an international talent marketplace platform connecting aspirants (actors, models) with agencies (production houses). Built with Next.js 16.2.6 (Turbopack), TypeScript, Tailwind v4.

## Tech Stack
- **Framework**: Next.js 16.2.6, App Router, TypeScript
- **Fonts**: Montserrat (body), Bebas Neue (headings)
- **Colors**: RED=#C8202A, GOLD=#D4A64A, BG=#050505/#0a0a0a, BG2=#0B0F14, BG3=#121821
- **Styling**: Inline styles (no Tailwind classes except ss-layout CSS classes)
- **Location**: D:\silverscreens (Windows)

## Completed Pages & File Paths

### Public Pages — app/(public)/
- `signup/page.tsx` — 4-step flow → company→/create-company-profile, talent→/create-profile
- `verify-otp/page.tsx`
- `login/page.tsx`
- `forgot-password/page.tsx`
- `reset-password/page.tsx`
- `pricing/page.tsx` — reads ?for=agency param; agency plans: starter/growth/enterprise
- `payment/page.tsx` — Card/UPI/NetBanking/Wallet; routes to payment-success/failure
- `payment-success/page.tsx` — detects isAgency via AGENCY_PLANS=['starter','growth','enterprise']
- `payment-failure/page.tsx`
- `about/page.tsx`

### Confirmation Pages — app/(confirmation)/
- `layout.tsx` — bare layout
- `profile-submitted/page.tsx` — "Roster File Saved"
- `agency-profile-submitted/page.tsx` — "Agency Request Received"

### Profile Creation
- `app/create-profile/page.tsx` — Aspirant profile creation → /pricing?for=aspirant
- `app/(agency)/create-company-profile/page.tsx` — Agency creation → /pricing?for=agency
- `app/(agency)/layout.tsx` — bare layout

### Dashboard Pages
- `app/profile/page.tsx` — Aspirant profile view (COMPLETED)
- `app/agency-profile/page.tsx` — Agency profile view (COMPLETED)

## CSS Classes (app/globals.css)
- `.ss-layout` — display:flex; flex-direction:row; min-height:100vh
- `.ss-sidebar` — 240px wide, sticky, overflow-y:auto
- `.ss-sidebar-logo` — flex-shrink:0, padding, border-bottom
- `.ss-sidebar-nav` — flex:1, overflow-y:auto, scrollbar hidden
- `.ss-sidebar-upgrade` — flex-shrink:0, red bg, bottom pinned
- `.ss-main` — flex:1, display:flex, flex-direction:column, overflow-y:auto
- `.ss-nav-item` — padding:5px 8px, hover effect
- `.ss-section-label` — 9px uppercase gray label
- **Cursor fix**: `* { cursor: default }` + `a,button { cursor: pointer !important }`

## Aspirant Profile View (app/profile/page.tsx) — COMPLETED
**Layout**: Full-page flex column (NOT ss-layout)
- Full-width top navbar: SilverScreensLogo + nav links + icons + avatar dropdown
- Body: sidebar (210px inline) + scrollable main

**Sidebar menu (PRD finalized)**:
Dashboard, My Profile (active/red), My Applications, Messages (badge:2), Auditions, Saved Castings, Recommended Castings, Notifications (badge:3)
Upgrade to Premium (red bg) at bottom

**Profile dropdown (PRD finalized)**:
Subscription, Analytics, Calendar, Settings, Support, Logout

**Navbar links**: Home, About Us, Explore Talents, Casting Calls, Pricing Plans, FAQs, Contact Us

**Top row**: Hero card (fit-content width, ends at "Hindi") | Profile Strength (280px) | Social Profiles (flex:1)
**Overview row**: About Me (320px) | Media (1fr) | Professional Details (260px)

**Key design details**:
- Hero: cinematic bg image, 155px photo, name 26px, Actor•Model, stats, badges, buttons
- Profile Strength: donut chart 92%, 5 checklist items, Improve Profile btn
- Social Profiles: Instagram/Facebook/YouTube/IMDb — gold colored links
- Tabs with icons: 🎭Overview 🖼️Media(12) 💼Experience(3) 🎯Skills 🎓Education 🏆Awards 📄Documents
- About Me: bio text + 8 detail rows (DOB, Gender, Body Type etc.)
- Media: 10 photos in 2-row grid + 2 videos
- Professional Details: 5 fields

## Agency Profile View (app/agency-profile/page.tsx) — COMPLETED
**Layout**: Full-page flex column (NOT ss-layout)
- Full-width top navbar: SilverScreensLogo + nav links + Create Casting Call btn + SP avatar
- Body: sidebar (210px inline) + scrollable main

**Sidebar menu (PRD finalized)**:
Dashboard, Create Casting Call, Casting Calls List, Talent Search, Applications Management, Shortlisted Talents, Audition Management, Saved Talents, Messages (badge:12), Notifications (badge:3)
Upgrade to Pro (gold bg) at bottom

**Profile dropdown (PRD finalized)**:
Reports & Analytics, Subscription & Billing, Company Profile, Documents, Calendar, Settings, Support, Logout

**Agency card in sidebar**: SP logo box + Silver Paradise Productions + Verified Agency badge

**Content structure**:
- Hero banner: cinematic bg, SP logo box, name + verified badge, Production House, location/date/website, bio + See More, 5 stats
- Tabs: Overview, Casting Calls, Projects, Hired Talents, Reviews, Team, About
- Grid 1 (stretch): About Agency (900px) | Agency Details (495px, 2-col grid, 12 items)
- Grid 2 (stretch): Top Projects 2×2 (left) | Active Casting Calls flex:1 (right)
- Grid 3 (stretch): Recently Hired 4 items single row (left) | Recent Reviews 2 reviews (right)

## User Flows
**Aspirant**: Signup→OTP→/create-profile→/pricing?for=aspirant→/payment→/payment-success→/profile-submitted→admin→email→login
**Agency**: Signup→OTP→/create-company-profile→/pricing?for=agency→/payment→/payment-success→/agency-profile-submitted→admin→email→login

## Middleware (middleware.ts)
publicPaths includes all pages above including /profile, /agency-profile, /create-profile, /create-company-profile

## Components
- `components/ui/SilverScreensLogo.tsx` — `<SilverScreensLogo size="md" href="/" showTagline={false} />`
- `components/layout/PublicNavbar.tsx` — used in (public)/layout.tsx
- `components/layout/PublicFooter.tsx`

## Pages Still TODO
- Aspirant Dashboard (app/dashboard/page.tsx)
- Agency Dashboard
- Individual tab content pages (Media, Experience, Skills etc.)

## Important Notes
- Profile/Agency pages use INLINE flex layout (NOT ss-layout CSS classes)
- No footer on dashboard pages (profile, agency-profile)
- Cursor fix applied globally via globals.css
- All pages use Montserrat font family throughout
- Font sizes: nav items 13px, body text 13-14px, headings 14px bold, section titles 14px bold
- Gold (#D4A64A) is agency accent; Red (#C8202A) is aspirant accent