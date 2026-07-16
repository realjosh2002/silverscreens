import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // ── Always-public paths — no auth or email check needed ──
  const alwaysPublic = [
    '/',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
    '/privacy-policy',
    '/cookie-policy',
    '/explore-talents',
    '/casting-calls',
    '/signup',
    '/login',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    '/pricing',
    '/verify-email',
    '/admin/login',
  ]

  if (alwaysPublic.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return supabaseResponse
  }

  // ── API routes — never redirect, let them handle auth themselves ──
  if (pathname.startsWith('/api/')) {
    return supabaseResponse
  }

  // ── Not logged in — redirect to login ──
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ── Logged in but email not verified — redirect to /verify-email ──
  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('email_verified')
      .eq('id', user.id)
      .single()

    if (profileData && !profileData.email_verified) {
      return NextResponse.redirect(new URL('/verify-email', request.url))
    }
  } catch (err) {
    console.error('[PROXY EMAIL CHECK ERROR]', err)
  }

  // ── Redirect already-logged-in verified users away from auth pages ──
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}