export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { id: agencyId } = await params
    if (!agencyId) return errorResponse('Agency ID is required', 400)

    const agency = await prisma.agency_profiles.findUnique({
      where: { id: agencyId },
      select: {
        id:                  true,
        company_name:        true,
        company_type:        true,
        company_description: true,
        company_size:        true,
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
        banner_url:          true,
        gallery_urls:        true,
        social_links:        true,
        address_line1:       true,
        address_line2:       true,
        city:                true,
        state:               true,
        country:             true,
        pincode:             true,
        verification_status: true,
        profile_views:       true,
        created_at:          true,
        updated_at:          true,
        profiles: {
          select: {
            id:              true,
            email:           true,
            phone:           true,
            profile_number:  true,
            created_at:     true,
            last_login_at:  true,
          },
        },
      },
    })

    if (!agency) return errorResponse('Agency not found', 404)

    const userId = (agency.profiles as any)?.id ?? null
    const rawProfileNumber = (agency.profiles as any)?.profile_number ?? ''
    const profileNumber = rawProfileNumber.startsWith('AG')
      ? rawProfileNumber
      : 'AG' + rawProfileNumber.replace(/^[A-Z]+/, '')

    const documents = userId ? await prisma.agency_documents.findMany({
      where: { user_id: userId }, orderBy: { created_at: 'desc' },
    }) : []

    const subscription = userId ? await prisma.subscriptions.findFirst({
      where: { user_id: userId, status: 'active' },
      orderBy: { created_at: 'desc' },
      select: { plan_name: true, ends_at: true },
    }).catch(() => null) : null

    const castingCalls = await prisma.casting_calls.findMany({
      where: { agency_id: agencyId },
      orderBy: { created_at: 'desc' },
      take: 20,
      select: {
        id: true, title: true, status: true, created_at: true,
        _count: { select: { applications: true } },
      },
    }).catch(() => [])

    const [totalCastings, activeCastings, totalApplications, shortlistedCount, hiredCount] = await Promise.all([
      prisma.casting_calls.count({ where: { agency_id: agencyId } }).catch(() => 0),
      prisma.casting_calls.count({ where: { agency_id: agencyId, status: 'active' } }).catch(() => 0),
      prisma.applications.count({ where: { agency_id: agencyId } }).catch(() => 0),
      prisma.applications.count({ where: { agency_id: agencyId, status: "shortlisted" } }).catch(() => 0),
      prisma.applications.count({ where: { agency_id: agencyId, status: "selected" } }).catch(() => 0),
    ])

    let activityLogs: any[] = []
    try {
      const { data: logData } = await supabaseAdmin
        .from('audit_logs')
        .select('id, action, new_values, created_at')
        .eq('entity_id', agencyId)
        .order('created_at', { ascending: false })
        .limit(15)
      activityLogs = logData ?? []
    } catch {}

    const approvalLog = activityLogs.find((l: any) => l.action?.includes('APPROV'))
    const social = (agency.social_links as Record<string, string>) ?? {}

    const result = {
      id:                   agency.id,
      profile_number:       profileNumber,
      company_name:         agency.company_name,
      company_type:         agency.company_type ?? '',
      registration_number:  agency.registration_number,
      gst_number:           agency.gst_number,
      pan_number:           agency.pan_number,
      website_url:          agency.website_url,
      description:          agency.company_description,
      established_year:     null,
      employee_count:       (agency as any).company_size,
      logo_url:             agency.logo_url,
      banner_url:           agency.banner_url,
      email:                agency.contact_email ?? (agency.profiles as any)?.email ?? '',
      phone:                agency.contact_phone ?? (agency.profiles as any)?.phone ?? '',
      address_line1:        agency.address_line1,
      address_line2:        agency.address_line2,
      city:                 agency.city,
      state:                agency.state,
      country:              agency.country,
      pincode:              agency.pincode,
      verification_status:  agency.verification_status ?? 'pending',
      account_status:       agency.verification_status === 'suspended' ? 'suspended' : 'active',
      subscription_plan:    subscription?.plan_name ?? null,
      subscription_expires: subscription?.ends_at?.toISOString() ?? null,
      trust_score:          agency.trust_score ?? 100,
      total_castings:       totalCastings,
      active_castings:      activeCastings,
      total_applications:   totalApplications,
      shortlisted_count:    shortlistedCount,
      hired_count:          hiredCount,
      profile_views:        agency.profile_views ?? 0,
      followers_count:      0,
      reports_count:        0,
      created_at:           agency.created_at?.toISOString() ?? '',
      last_login:           (agency.profiles as any)?.last_login_at ?? null,
      verified_at:          approvalLog?.created_at ?? null,
      verified_by:          approvalLog ? 'Admin' : null,
      rejection_reason:     null,
      social_instagram:     social.instagram ?? social.Instagram ?? null,
      social_facebook:      social.facebook  ?? social.Facebook  ?? null,
      social_youtube:       social.youtube   ?? social.YouTube   ?? null,
      social_linkedin:      social.linkedin  ?? social.LinkedIn  ?? null,
      documents: documents.map(d => ({
        id:          d.id,
        name:        d.doc_label,
        type:        d.doc_type,
        url:         d.public_url,
        uploaded_at: d.created_at?.toISOString() ?? '',
        file_size:   d.file_size != null ? Number(d.file_size) : 0,
        status:      d.status,
      })),
      gallery: ((agency.gallery_urls as any[]) ?? []).map((item: any, i: number) => ({
        id:      i.toString(),
        url:     typeof item === 'string' ? item : item?.url ?? '',
        caption: typeof item === 'object' ? item?.caption ?? null : null,
      })),
      casting_calls: castingCalls.map((c: any) => ({
        id:           c.id,
        title:        c.title,
        status:       c.status,
        applications: c._count?.applications ?? 0,
        created_at:   c.created_at?.toISOString() ?? '',
      })),
      activity_log: activityLogs.map((l: any) => {
        const vals = l.new_values ?? {}
        let details = ''
        if (vals.agency)  details += vals.agency
        if (vals.status)  details += (details ? ' → ' : '') + vals.status.toUpperCase()
        if (vals.reason)  details += ' | Reason: ' + vals.reason
        if (vals.note)    details += ' | Note: ' + vals.note
        if (!details && typeof vals === 'object') {
          const safe = Object.entries(vals)
            .filter(([k]) => !['logo_url','banner_url','gallery_urls','social_links','company_description','contact_email','contact_phone'].includes(k))
            .map(([k, v]) => `${k}: ${v}`)
            .slice(0, 4)
            .join(' • ')
          details = safe || 'Profile updated'
        }
        return {
          id:         l.id,
          action:     (l.action ?? '').replace(/_/g, ' ').replace(/\bAGENCY\b/, 'Agency').replace(/\bAPPROVEED\b/, 'APPROVED'),
          details,
          created_at: l.created_at,
        }
      }),
    }

    return successResponse(result)
  } catch (error: unknown) {
    console.error('[GET AGENCY PROFILE ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}