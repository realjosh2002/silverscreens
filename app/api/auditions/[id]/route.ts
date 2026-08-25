import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const audition = await prisma.auditions.findUnique({
      where: { id },
      include: {
        casting_calls: {
          include: {
            agency_profiles: {
              select: {
                id: true, company_name: true, logo_url: true,
                contact_person_name: true, contact_email: true, contact_phone: true,
                city: true, state: true, verification_status: true,
              },
            },
          },
        },
        aspirant_profiles: {
          select: { id: true, first_name: true, last_name: true, profile_image_url: true },
        },
        applications: {
          select: { id: true, status: true, applied_at: true },
        },
      },
    })

    if (!audition) return errorResponse('Audition not found', 404)

    return successResponse({ audition })
  } catch (error: unknown) {
    console.error('[GET AUDITION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !user) return errorResponse('Invalid session', 401)

    const body = await req.json()
    const { status, scheduled_at, venue_details, notes, mode } = body

    // Fetch audition with all relations needed
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('auditions')
      .select(`
        id, agency_id, aspirant_id, casting_call_id, application_id,
        casting_calls ( agency_profiles ( user_id ) ),
        aspirant_profiles ( user_id, first_name, last_name )
      `)
      .eq('id', id)
      .single()

    if (fetchError || !existing) return errorResponse('Audition not found', 404)

    // Authorization check
    const agencyUserId = (existing as any).casting_calls?.agency_profiles?.user_id
    if (agencyUserId && agencyUserId !== user.id) return errorResponse('Unauthorized', 403)

    if (!agencyUserId) {
      const { data: agencyProfile } = await supabaseAdmin
        .from('agency_profiles').select('id').eq('user_id', user.id).single()
      if (!agencyProfile || (existing as any).agency_id !== agencyProfile.id) {
        return errorResponse('Unauthorized', 403)
      }
    }

    // Build audition update payload
    const updateData: Record<string, unknown> = {}
    if (status)                      updateData.status        = status
    if (scheduled_at)                updateData.scheduled_at  = new Date(scheduled_at).toISOString()
    if (venue_details !== undefined) updateData.venue_details = venue_details
    if (notes !== undefined)         updateData.notes         = notes
    if (mode)                        updateData.mode          = mode

    // Update audition
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('auditions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) return errorResponse(updateError.message, 500)

    // ── Map audition status → application status and update applications table ──
    // This is the critical step that was missing before.
    if (status) {
      const applicationStatusMap: Record<string, string> = {
        scheduled:  'audition_scheduled',
        completed:  'audition_scheduled',
        selected:   'selected',
        rejected:   'rejected',
        on_hold:    'shortlisted',
        cancelled:  'in_review',
      }
      const newApplicationStatus = applicationStatusMap[status]

      if (newApplicationStatus) {
        // Try application_id first (direct link), fall back to aspirant+casting lookup
        const applicationId = (existing as any).application_id

        if (applicationId) {
          await prisma.applications.update({
            where: { id: applicationId },
            data:  { status: newApplicationStatus as any },
          }).catch(e => console.error('[APPLICATION STATUS UPDATE ERROR]', e))
        } else {
          // Fallback: find by aspirant_id + casting_call_id
          const aspirantId    = (existing as any).aspirant_id
          const castingCallId = (existing as any).casting_call_id

          if (aspirantId && castingCallId) {
            await prisma.applications.updateMany({
              where: {
                aspirant_id:     aspirantId,
                casting_call_id: castingCallId,
              },
              data: { status: newApplicationStatus },
            }).catch(e => console.error('[APPLICATION STATUS UPDATE ERROR]', e))
          }
        }
      }
    }

    // ── Notify aspirant ───────────────────────────────────────────────────────
    const aspirantUserId = (existing as any).aspirant_profiles?.user_id
    if (aspirantUserId) {
      const aspirantName = [
        (existing as any).aspirant_profiles?.first_name,
        (existing as any).aspirant_profiles?.last_name,
      ].filter(Boolean).join(' ') || 'Aspirant'

      let notifTitle   = ''
      let notifMessage = ''

      if (status === 'selected') {
        notifTitle   = '🎉 Congratulations! You Have Been Selected!'
        notifMessage = `Great news, ${aspirantName}! You have been selected by the agency after your audition. They will reach out to you shortly with further details. Congratulations!`
      } else if (status === 'rejected') {
        notifTitle   = 'Audition Result Update'
        notifMessage = `Thank you for attending the audition, ${aspirantName}. After careful consideration, the agency has decided not to proceed at this time. Keep applying — the right opportunity is ahead!`
      } else if (status === 'on_hold') {
        notifTitle   = 'Your Audition is On Hold'
        notifMessage = `Your audition result is currently on hold, ${aspirantName}. The agency is reviewing candidates and will update you soon.`
      } else if (status === 'completed') {
        notifTitle   = 'Audition Completed'
        notifMessage = 'Your audition has been marked as completed by the agency. Results will be shared soon.'
      } else if (status === 'cancelled') {
        notifTitle   = 'Audition Cancelled'
        notifMessage = 'Your audition has been cancelled by the agency. Please check for rescheduling updates.'
      } else if (scheduled_at) {
        const newDate = new Date(scheduled_at).toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })
        notifTitle   = 'Audition Rescheduled'
        notifMessage = `Your audition has been rescheduled to ${newDate}. Please check the updated details.`
      }

      if (notifTitle) {
        await prisma.notifications.create({
          data: {
            user_id:    aspirantUserId,
            type:       'audition_scheduled' as any,
            title:      notifTitle,
            message:    notifMessage,
            is_read:    false,
            action_url: '/auditions',
          },
        }).catch(e => console.error('[NOTIFICATION CREATE ERROR]', e))
      }
    }

    return successResponse({ audition: updated })
  } catch (error: unknown) {
    console.error('[PATCH AUDITION ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}