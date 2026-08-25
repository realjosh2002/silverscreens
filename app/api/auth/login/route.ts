export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// app/api/auth/login/route.ts
import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, isValidEmail } from '@/lib/api-helpers'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // ─── 1. Validate inputs ────────────────────────────────────
    if (!email || !password) {
      return errorResponse('Email and password are required', 400)
    }

    if (!isValidEmail(email)) {
      return errorResponse('Please enter a valid email address', 400)
    }

    // ─── 2. Sign in — use server client so session cookie is set ──
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

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (authError || !authData.user) {
      console.error('[LOGIN DEBUG]', authError)
      return errorResponse(authError?.message || 'Invalid email or password', 401)
    }

    const userId = authData.user.id

    // ─── 3. Fetch profile from database ────────────────────────
    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
      select: {
        id:             true,
        name:           true,
        email:          true,
        phone:          true,
        role:           true,
        profile_number: true,
        email_verified: true,
        phone_verified: true,
        is_active:      true,
        last_login_at:  true,
        aspirant_profiles: {
          select: {
            id:                  true,
            verification_status: true,
            profile_completion:  true,
            trust_score:         true,
          },
        },
        agency_profiles: {
          select: {
            id:                  true,
            company_name:        true,
            verification_status: true,
            trust_score:         true,
          },
        },
        subscriptions: {
          where:   { status: 'active' },
          orderBy: { created_at: 'desc' },
          take:    1,
          select: {
            plan_name: true,
            plan_id:   true,
            ends_at:   true,
            status:    true,
          },
        },
      },
    })

    if (!profile) {
      return errorResponse('Account not found', 404)
    }

    // ─── 4. Check if account is active ─────────────────────────
    if (!profile.is_active) {
      return errorResponse('Your account has been suspended. Please contact support.', 403)
    }

    // ─── 5. Update last login timestamp ────────────────────────
    await prisma.profiles.update({
      where: { id: userId },
      data:  { last_login_at: new Date() },
    })

    // ─── 6. Log the login ───────────────────────────────────────
    await prisma.audit_logs.create({
      data: {
        user_id:     userId,
        action:      'USER_LOGIN',
        entity_type: 'profiles',
        entity_id:   userId,
      },
    })

    // ─── 6b. Non-blocking cleanup of old records ───────────────
    const ninetyDaysAgo = new Date(Date.now() - 90  * 24 * 60 * 60 * 1000)
    const oneYearAgo    = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)

    prisma.$executeRaw`
      DELETE FROM notifications
      WHERE user_id = ${userId}::uuid
      AND is_read = true
      AND created_at < ${ninetyDaysAgo}
    `.catch((e) => console.error('[CLEANUP] notifications:', e.message))

    prisma.$executeRaw`
      DELETE FROM messages
      WHERE sender_id = ${userId}::uuid
      AND created_at < ${oneYearAgo}
    `.catch((e) => console.error('[CLEANUP] messages:', e.message))

    prisma.$executeRaw`
      DELETE FROM conversations
      WHERE (participant_1_id = ${userId}::uuid OR participant_2_id = ${userId}::uuid)
      AND last_message_at < ${oneYearAgo}
    `.catch((e) => console.error('[CLEANUP] conversations:', e.message)) // Silent — never block login

    // ─── 7. Build response ─────────────────────────────────────
    const activeSubscription = profile.subscriptions?.[0] || null

    return successResponse({
      session: {
        access_token:  authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
        expires_at:    authData.session?.expires_at,
      },
      user: {
        id:             profile.id,
        name:           profile.name,
        email:          profile.email,
        phone:          profile.phone,
        role:           profile.role,
        profile_number: profile.profile_number,
        email_verified: profile.email_verified,
        phone_verified: profile.phone_verified,
        subscribed:     !!activeSubscription,
        plan:           activeSubscription?.plan_id   || null,
        plan_name:      activeSubscription?.plan_name || null,
        plan_expires:   activeSubscription?.ends_at   || null,
        aspirant_profile: profile.aspirant_profiles ? {
          id:                  profile.aspirant_profiles.id,
          verification_status: profile.aspirant_profiles.verification_status,
          profile_completion:  profile.aspirant_profiles.profile_completion,
          trust_score:         profile.aspirant_profiles.trust_score,
        } : null,
        agency_profile: profile.agency_profiles ? {
          id:                  profile.agency_profiles.id,
          company_name:        profile.agency_profiles.company_name,
          verification_status: profile.agency_profiles.verification_status,
          trust_score:         profile.agency_profiles.trust_score,
        } : null,
      },
    })
  } catch (error: unknown) {
    console.error('[LOGIN ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}	
