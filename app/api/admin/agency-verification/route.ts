export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// ─── Auth helper ─────────────────────────────────────────────────
async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const profile = await prisma.profiles.findUnique({
    where:  { id: user.id },
    select: { role: true },
  })
  if (profile?.role !== 'admin') return null
  return user
}

// ─── GET /api/admin/agency-verification ──────────────────────────
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? 'pending'

    // ── Build where clause ────────────────────────────────────────
    const where =
      status === 'all'
        ? {}
        : status === 'pending'
        ? { OR: [{ verification_status: 'pending' as const }, { verification_status: null }] }
        : { verification_status: status as any }

    // ── Fetch agency_profiles with nested profiles ────────────────
    const agencies = await prisma.agency_profiles.findMany({
      where,
      orderBy: { created_at: 'desc' },
      select: {
        id:                  true,
        company_name:        true,
        company_type:        true,
        company_size:        true,
        company_description: true,
        registration_number: true,
        gst_number:          true,
        pan_number:          true,
        years_of_experience: true,
        website_url:         true,
        contact_person_name: true,
        contact_email:       true,
        contact_phone:       true,
        trust_score:         true,
        logo_url:            true,
        verification_status: true,
        profile_views:       true,
        banner_url:          true,
        gallery_urls:        true,
        social_links:        true,
        languages:           true,
        genres:              true,
        expertise:           true,
        operating_cities:    true,
        show_phone:          true,
        show_email:          true,
        address_line1:       true,
        address_line2:       true,
        city:                true,
        state:               true,
        country:             true,
        pincode:             true,
        created_at:          true,
        updated_at:          true,
        // ← nested relation: only select if your schema has this relation
        profiles: {
          select: {
            id:             true,
            email:          true,
            phone:          true,
            profile_number: true,
          },
        },
      },
    })

    // ── Fetch documents for all user IDs ──────────────────────────
    // profiles may be null if relation isn't set up — guard everywhere
    const userIds = agencies
      .map(a => (a.profiles as any)?.id)
      .filter(Boolean) as string[]

    const allDocs = userIds.length > 0
      ? await prisma.agency_documents.findMany({
          where:   { user_id: { in: userIds } },
          orderBy: { created_at: 'desc' },
        })
      : []

    const docsByUser: Record<string, any[]> = {}
    for (const doc of allDocs) {
      if (!docsByUser[doc.user_id]) docsByUser[doc.user_id] = []
      docsByUser[doc.user_id].push(doc)
    }

    // ── Extra: agencies with docs but no agency_profiles entry ────
    const extraDocs =
      status === 'pending' || status === 'all'
        ? await prisma.agency_documents.findMany({
            where: {
              user_id: {
                notIn:
                  userIds.length > 0
                    ? userIds
                    : ['00000000-0000-0000-0000-000000000000'],
              },
            },
            orderBy: { created_at: 'desc' },
          })
        : []

    const extraUserIds = [
      ...new Set(extraDocs.map((d: any) => d.user_id as string)),
    ]

    let extraAgencies: any[] = []
    if (extraUserIds.length > 0) {
      const extraProfiles = await prisma.profiles.findMany({
        where:  { id: { in: extraUserIds } },
        select: { id: true, email: true, profile_number: true, created_at: true },
      })
      const extraDocsByUser: Record<string, any[]> = {}
      for (const doc of extraDocs) {
        if (!extraDocsByUser[doc.user_id]) extraDocsByUser[doc.user_id] = []
        extraDocsByUser[doc.user_id].push(doc)
      }
      extraAgencies = extraProfiles.map(p => ({
        id:                  `extra-${p.id}`,
        company_name:        p.email?.split('@')[0] ?? 'Unknown',
        company_description: null,
        verification_status: 'pending',
        created_at:          p.created_at,
        documents:           extraDocsByUser[p.id] ?? [],
        profiles:            { id: p.id, email: p.email, profile_number: p.profile_number },
      }))
    }

    // ── Serialize BigInt file_size ────────────────────────────────
    const serializeDocs = (docs: any[]) =>
      docs.map(d => ({ ...d, file_size: d.file_size != null ? Number(d.file_size) : 0 }))

    const result = [
      ...agencies.map(a => ({
        ...a,
        documents: serializeDocs(docsByUser[(a.profiles as any)?.id] ?? []),
      })),
      ...extraAgencies.map(a => ({
        ...a,
        documents: serializeDocs(a.documents),
      })),
    ]

    // ── Counts — purely by verification_status ──────────────────────
    const counts = {
      pending:  result.filter(a => !a.verification_status || a.verification_status === 'pending').length,
      approved: result.filter(a => a.verification_status === 'approved').length,
      rejected: result.filter(a => a.verification_status === 'rejected').length,
    }

    return successResponse({ data: result, counts })
  } catch (error: unknown) {
    console.error('[GET AGENCY VERIFICATION ERROR]', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500,
    )
  }
}

// ─── PUT /api/admin/agency-verification ──────────────────────────
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body = await req.json()
    const { action, agency_profile_id, doc_id, reason, notes } = body

    // ── Per-document action ───────────────────────────────────────
    if (doc_id) {
      if (!['approve_doc', 'reject_doc'].includes(action)) {
        return errorResponse('action must be approve_doc or reject_doc', 400)
      }

      const newStatus = action === 'approve_doc' ? 'approved' : 'rejected'

      const doc = await prisma.agency_documents.update({
        where: { id: doc_id },
        data: {
          status:           newStatus,
          rejection_reason: action === 'reject_doc' ? (reason ?? null) : null,
          reviewed_by:      admin.id,
          reviewed_at:      new Date(),
          updated_at:       new Date(),
        },
      })

      const notifTitle =
        action === 'approve_doc'
          ? `Document Approved: ${doc.doc_label}`
          : `Document Rejected: ${doc.doc_label}`
      const notifMessage =
        action === 'approve_doc'
          ? `Your ${doc.doc_label} has been approved by our verification team.`
          : `Your ${doc.doc_label} was rejected. Reason: ${reason ?? 'Please re-upload a valid document.'}`

      await (prisma as any).notifications.create({
        data: {
          user_id:    doc.user_id,
          title:      notifTitle,
          message:    notifMessage,
          type:       'system_announcement',
          action_url: '/agency/settings',
          is_read:    false,
          created_at: new Date(),
        },
      })

      await supabaseAdmin.from('audit_logs').insert({
        user_id:     admin.id,
        action:      `AGENCY_DOC_${action === 'approve_doc' ? 'APPROVED' : 'REJECTED'}`,
        entity_type: 'agency_documents',
        entity_id:   doc.id,
        new_values:  { status: newStatus, reason, doc_label: doc.doc_label },
      })

      return successResponse({
        message: `Document ${action === 'approve_doc' ? 'approved' : 'rejected'} successfully.`,
        data:    { id: doc.id, status: newStatus },
      })
    }

    // ── Overall agency action ─────────────────────────────────────
    if (!agency_profile_id) {
      return errorResponse('agency_profile_id or doc_id is required', 400)
    }
    if (!['approve', 'reject', 'hold'].includes(action)) {
      return errorResponse('action must be approve, reject, or hold', 400)
    }
    if (agency_profile_id.startsWith('extra-')) {
      return errorResponse(
        'Agency must complete their profile before overall verification.',
        400,
      )
    }

    // Map action → DB status
    // DB enum: pending | approved | rejected | suspended
    const newStatus =
      action === 'approve'
        ? 'approved'
        : action === 'reject'
        ? 'rejected'
        : 'suspended' // 'hold' action maps to suspended — on_hold not in enum

    // ── Update agency_profiles ────────────────────────────────────
    const updated = await prisma.agency_profiles.update({
      where:  { id: agency_profile_id },
      data:   { verification_status: newStatus as any, updated_at: new Date() },
      // Do NOT include profiles in select here — fetch separately below
      select: { id: true, company_name: true, verification_status: true, user_id: true },
    })

    // ── Fetch the linked user ID safely ──────────────────────────
    // user_id is a direct column on agency_profiles — use it directly
    // If your schema doesn't have user_id on agency_profiles, fall back
    // to querying profiles table by agency_profile_id
    const agencyUserId: string | null = (updated as any).user_id ?? null

    // If user_id column doesn't exist on agency_profiles, get it via profiles table
    let resolvedUserId = agencyUserId
    if (!resolvedUserId) {
      const profileRow = await prisma.profiles.findFirst({
        where:  { agency_profiles: { some: { id: agency_profile_id } } } as any,
        select: { id: true },
      }).catch(() => null)
      resolvedUserId = profileRow?.id ?? null
    }

    // ── Audit log ─────────────────────────────────────────────────
    await supabaseAdmin.from('audit_logs').insert({
      user_id:     admin.id,
      action:      `AGENCY_${action.toUpperCase()}ED`,
      entity_type: 'agency_profiles',
      entity_id:   agency_profile_id,
      new_values:  { status: newStatus, reason, notes, agency: updated.company_name },
    })

    // ── Notification ──────────────────────────────────────────────
    if (resolvedUserId) {
      const notifTitle =
        action === 'approve'
          ? 'Agency Profile Approved! 🎉'
          : action === 'hold'
          ? 'Agency Verification On Hold'
          : 'Agency Verification Update'

      const notifMessage =
        action === 'approve'
          ? 'Your agency has been fully verified. You can now post casting calls.'
          : action === 'hold'
          ? `Your verification is on hold. ${reason ?? 'Please upload any missing documents.'}`
          : `Verification not approved. Reason: ${reason ?? 'Contact support.'}`

      await (prisma as any).notifications.create({
        data: {
          user_id:    resolvedUserId,
          action_url: '/agency/settings',
          title:      notifTitle,
          message:    notifMessage,
          type:       'system_announcement',
          is_read:    false,
          created_at: new Date(),
        },
      })
    }

    return successResponse({
      message: `Agency ${action}d successfully.`,
      data:    { id: updated.id, name: updated.company_name, status: newStatus },
    })
  } catch (error: unknown) {
    console.error('[PUT AGENCY VERIFICATION ERROR]', error)

    // Surface the real Prisma error message to help debug
    const message =
      error instanceof Error ? error.message : 'Internal server error'

    // Specific hint for enum constraint errors
    if (message.includes('invalid input value for enum') || message.includes('Unknown arg')) {
      return errorResponse(
        `DB enum error — check verification_status values in your schema. Details: ${message}`,
        500,
      )
    }

    return errorResponse(message, 500)
  }
}
