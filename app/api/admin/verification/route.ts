export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { successResponse, errorResponse } from '@/lib/api-helpers'

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabaseAdmin
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const type   = searchParams.get('type')   || 'all'
    const status = searchParams.get('status') || 'pending'

    let aspirants: any[] = []
    let agencies:  any[] = []

    if (type === 'all' || type === 'aspirant') {
      // Step 1: fetch aspirant profiles
      const { data: aspData, error: aspError } = await supabaseAdmin
        .from('aspirant_profiles')
        .select(`
          id, user_id, profile_number, title, first_name, last_name,
          gender, date_of_birth, address_line1, address_line2, city, state,
          pincode, country, height_cm, weight_kg, hair_color, eye_color,
          body_tone, body_type, chest_size, hip_size, waist_size, shoe_size,
          languages, availability, about_me, profile_image_url, category,
          role, experience_level, social_links, resume_url, intro_video_url,
          verification_status, trust_score, is_available, profile_completion,
          profile_views, skills, created_at, updated_at
        `)
        .eq('verification_status', status)
        .order('updated_at', { ascending: false })

      if (aspError) throw new Error(aspError.message)

      // Step 2: fetch profiles for those user_ids
      const userIds = (aspData ?? []).map((a: any) => a.user_id).filter(Boolean)
      let profileMap: Record<string, any> = {}
      let subMap: Record<string, string> = {}

      if (userIds.length > 0) {
        const { data: profileData } = await supabaseAdmin
          .from('profiles')
          .select('id, name, email, phone, profile_number')
          .in('id', userIds)
        for (const p of profileData ?? []) profileMap[p.id] = p

        const { data: subData } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id, plan_name')
          .in('user_id', userIds)
          .eq('status', 'active')
        for (const s of subData ?? []) subMap[s.user_id] = s.plan_name
      }

      // Step 3: fetch media
      let mediaMap: Record<string, any[]> = {}
      if (userIds.length > 0) {
        const { data: mediaData } = await supabaseAdmin
          .from('aspirant_media')
          .select('user_id, url, type, is_primary')
          .in('user_id', userIds)
          .limit(50)
        for (const m of mediaData ?? []) {
          if (!mediaMap[m.user_id]) mediaMap[m.user_id] = []
          mediaMap[m.user_id].push(m)
        }
      }

      aspirants = (aspData ?? []).map((a: any) => ({
        ...a,
        profiles: {
          ...(profileMap[a.user_id] ?? {}),
          subscriptions: subMap[a.user_id] ? [{ plan_name: subMap[a.user_id] }] : [],
        },
        aspirant_media: mediaMap[a.user_id] ?? [],
      }))

      // Fetch audit log history for each aspirant (notes + actions)
      if (aspirants.length > 0) {
        const profileIds = aspirants.map((a: any) => a.id)
        const { data: auditData } = await supabaseAdmin
          .from('audit_logs')
          .select('entity_id, action, new_values, created_at')
          .in('entity_id', profileIds)
          .in('action', ['ADMIN_VERIFICATION_APPROVE', 'ADMIN_VERIFICATION_REJECT', 'ADMIN_VERIFICATION_REQUEST_INFO', 'ADMIN_VERIFICATION_NOTE'])
          .order('created_at', { ascending: false })
          .limit(100)

        const historyMap: Record<string, any[]> = {}
        for (const log of auditData ?? []) {
          if (!historyMap[log.entity_id]) historyMap[log.entity_id] = []
          historyMap[log.entity_id].push({
            event: log.action === 'ADMIN_VERIFICATION_NOTE'
              ? `Note: ${(log.new_values as any)?.notes || ''}`
              : log.action.replace('ADMIN_VERIFICATION_', '').replace(/_/g, ' '),
            time: new Date(log.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            color: log.action.includes('APPROVE') ? '#22C55E' : log.action.includes('REJECT') ? '#C8202A' : log.action.includes('NOTE') ? '#D4A64A' : '#F97316',
          })
        }
        aspirants = aspirants.map((a: any) => ({ ...a, history: historyMap[a.id] ?? [] }))
      }
    }

    if (type === 'all' || type === 'agency') {
      const { data } = await supabaseAdmin
        .from('agency_profiles')
        .select(`
          id, user_id, company_name, verification_status, city, state,
          logo_url, created_at, updated_at,
          profiles ( name, email, phone, profile_number ),
          documents ( id, doc_label, status, file_url, created_at )
        `)
        .eq('verification_status', status)
        .order('updated_at', { ascending: false })
      agencies = data ?? []
    }

    return successResponse({ aspirants, agencies })

  } catch (err: unknown) {
    console.error('[ADMIN VERIFICATION GET ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { profile_id, profile_type, action, rejection_reason, notes } = body

    if (!profile_id || !profile_type || !action) {
      return errorResponse('profile_id, profile_type and action are required', 400)
    }

    const validActions = ['approve', 'reject', 'request_info', 'add_note']
    if (!validActions.includes(action)) return errorResponse('Invalid action', 400)

    // Handle add_note separately — no status change, just save notes to audit log
    if (action === 'add_note') {
      if (!notes?.trim()) return errorResponse('Notes cannot be empty', 400)

      await supabaseAdmin.from('audit_logs').insert({
        user_id:     admin.id,
        action:      'ADMIN_VERIFICATION_NOTE',
        entity_type: profile_type === 'aspirant' ? 'aspirant_profiles' : 'agency_profiles',
        entity_id:   profile_id,
        new_values:  { notes, added_by: admin.id },
      })

      return successResponse({ message: 'Notes saved successfully' })
    }

    const newStatus = action === 'approve' ? 'approved'
      : action === 'reject' ? 'rejected'
      : 'pending'

    const table = profile_type === 'aspirant' ? 'aspirant_profiles' : 'agency_profiles'

    const { data: updated, error } = await supabaseAdmin
      .from(table)
      .update({ verification_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', profile_id)
      .select('user_id')
      .single()

    if (error) throw new Error(error.message)

    // Send notification to user
    if (updated?.user_id) {
      const notifMsg = action === 'approve'
        ? 'Your profile has been verified! You can now apply to casting calls.'
        : action === 'reject'
        ? `Your profile verification was rejected. Reason: ${rejection_reason || 'Please review your submitted documents.'}`
        : 'Additional information is required to complete your profile verification.'

      await supabaseAdmin.from('notifications').insert({
        user_id:    updated.user_id,
        type:       'profile_verified',
        title:      action === 'approve' ? 'Profile Verified ✓' : action === 'reject' ? 'Verification Rejected' : 'Action Required',
        message:    notifMsg,
        action_url: profile_type === 'aspirant' ? '/my-profile' : '/agency-profile',
      })
    }

    // Audit log
    await supabaseAdmin.from('audit_logs').insert({
      user_id:     admin.id,
      action:      `ADMIN_VERIFICATION_${action.toUpperCase()}`,
      entity_type: table,
      entity_id:   profile_id,
      new_values:  { action, newStatus, rejection_reason },
    })

    return successResponse({ message: `Profile ${action}d successfully`, new_status: newStatus })

  } catch (err: unknown) {
    console.error('[ADMIN VERIFICATION PUT ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}
