export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const MAX_SIZE      = 5 * 1024 * 1024 // 5MB

// POST /api/agency/documents — upload a document
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return errorResponse('Invalid session', 401)

    const profile = await prisma.profiles.findUnique({
      where:  { id: user.id },
      select: { role: true },
    })
    if (!profile)                   return errorResponse('Profile not found', 404)
    if (profile.role !== 'agency')  return errorResponse('Agency account required', 403)

    const formData = await req.formData()
    const file     = formData.get('file')      as File   | null
    const docType  = formData.get('doc_type')  as string | null
    const docLabel = formData.get('doc_label') as string | null

    if (!file)    return errorResponse('No file provided', 400)
    if (!docType) return errorResponse('Document type is required', 400)

    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse('Only PDF, JPG, or PNG files are allowed.', 400)
    }
    if (file.size > MAX_SIZE) {
      return errorResponse('File size must be under 5MB.', 400)
    }

    const ext      = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const safeName = `${docType}_${Date.now()}.${ext}`
    const filePath = `agencies/${user.id}/documents/${safeName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer      = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabaseAdmin.storage
      .from('silverscreens-media')
      .upload(filePath, buffer, { contentType: file.type, upsert: true })

    if (uploadError) {
      console.error('[AGENCY DOC UPLOAD ERROR]', uploadError)
      return errorResponse(`Upload failed: ${uploadError.message}`, 500)
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('silverscreens-media')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // Upsert into agency_documents — replace existing record for this doc_type
    const existing = await prisma.agency_documents.findFirst({
      where: { user_id: user.id, doc_type: docType },
    })

    let doc
    if (existing) {
      doc = await prisma.agency_documents.update({
        where: { id: existing.id },
        data: {
          doc_label:        docLabel ?? docType,
          file_name:        file.name,
          file_size:        file.size,
          file_path:        filePath,
          public_url:       publicUrl,
          status:           'pending_review',
          rejection_reason: null,
          reviewed_by:      null,
          reviewed_at:      null,
          updated_at:       new Date(),
        },
      })
    } else {
      doc = await prisma.agency_documents.create({
        data: {
          user_id:    user.id,
          doc_type:   docType,
          doc_label:  docLabel ?? docType,
          file_name:  file.name,
          file_size:  BigInt(file.size),
          file_path:  filePath,
          public_url: publicUrl,
          status:     'pending_review',
        },
      })
    }

    // Also log in audit_logs for history
    await prisma.audit_logs.create({
      data: {
        user_id:     user.id,
        action:      'AGENCY_DOCUMENT_UPLOADED',
        entity_type: 'agency_documents',
        entity_id:   doc.id,
        new_values: {
          doc_type:   docType,
          doc_label:  docLabel ?? docType,
          file_name:  file.name,
          file_size:  file.size,
          file_path:  filePath,
          public_url: publicUrl,
        },
      },
    })

    // Get agency name for notification
    const agencyProfile = await prisma.agency_profiles.findUnique({
      where:  { id: user.id },
      select: { company_name: true },
    })
    const agencyName = agencyProfile?.company_name ?? 'An agency'

    // Notify all admin users
    const adminProfiles = await prisma.profiles.findMany({
      where:  { role: 'admin' },
      select: { id: true },
    })
    if (adminProfiles.length > 0) {
      await (prisma as any).notifications.createMany({
        data: adminProfiles.map(admin => ({
          user_id:    admin.id,
          title:      'New Document Awaiting Review',
          message:    `${agencyName} uploaded ${docLabel ?? docType} and it requires your review.`,
          type:       'system_announcement' as any,
          action_url: '/admin/agency-verification',
          is_read:    false,
          created_at: new Date(),
        })),
      })
    }

    return successResponse({
      message:    'Document uploaded successfully. It will be reviewed by our team.',
      id:         doc.id,
      url:        publicUrl,
      file_name:  file.name,
      file_size:  file.size,
      doc_type:   docType,
      doc_label:  docLabel ?? docType,
      status:     'pending_review',
    })

  } catch (error: unknown) {
    console.error('[AGENCY DOCUMENT UPLOAD ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}

// GET /api/agency/documents — list documents for this agency
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return errorResponse('Invalid session', 401)

    const docs = await prisma.agency_documents.findMany({
      where:   { user_id: user.id },
      orderBy: { created_at: 'desc' },
    })

    // BigInt serialization
    const serialized = docs.map(d => ({ ...d, file_size: Number(d.file_size) }))

    return successResponse({ data: serialized })
  } catch (error: unknown) {
    console.error('[GET AGENCY DOCUMENTS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
