export const dynamic = 'force-dynamic'

// app/api/auth/verification-status/route.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return errorResponse('Unauthorized', 401)
    }

    const profile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { email_verified: true, phone_verified: true, email: true },
    })

    if (!profile) {
      return errorResponse('Profile not found', 404)
    }

    // Treat as verified if EITHER the database flag is true
    // OR Supabase auth confirms the email (email_confirmed_at is set)
    const supabaseVerified = !!user.email_confirmed_at
    const emailVerified    = profile.email_verified || supabaseVerified

    // If Supabase says verified but database is still false, sync it now
    if (supabaseVerified && !profile.email_verified) {
      await prisma.profiles.update({
        where: { id: user.id },
        data:  { email_verified: true },
      }).catch(() => {}) // non-blocking — don't fail the request if this errors
    }

    return successResponse({
      email_verified: emailVerified,
      phone_verified: profile.phone_verified ?? false,
      email:          profile.email,
    })
  } catch (error: unknown) {
    console.error('[VERIFICATION STATUS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
