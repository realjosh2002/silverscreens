export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

function verifyToken(token: string): string | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const padded = parts[1] + '='.repeat((4 - parts[1].length % 4) % 4)
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'))
    return payload.sub || null
  } catch { return null }
}

function humanizeAction(action: string): string {
  const map: Record<string, string> = {
    'USER_LOGIN':              'Logged In',
    'EMAIL_VERIFIED':          'Email Verified',
    'admin_activate_user':     'Activated User',
    'admin_suspend_user':      'Suspended User',
    'admin_delete_user':       'Deleted User',
    'admin_edit_user':         'Edited User',
    'admin_reset_password':    'Reset Password',
    'ADMIN_APPROVE_AD':        'Approved Advertisement',
    'ADMIN_CREATE_AD':         'Created Advertisement',
    'ADMIN_DELETE_AD':         'Deleted Advertisement',
    'ADMIN_VERIFICATION_NOTE': 'Added Verification Note',
    'admin_approve_aspirant':  'Approved Aspirant',
    'admin_reject_aspirant':   'Rejected Aspirant',
    'admin_approve_agency':    'Approved Agency',
    'admin_reject_agency':     'Rejected Agency',
  }
  return map[action] || action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function getModule(action: string, entityType: string | null): string {
  const a = action.toLowerCase()
  if (a.includes('login') || a.includes('email_verif')) return 'Authentication'
  if (a.includes('_ad'))      return 'Advertisements'
  if (a.includes('verif'))    return 'Talent Verification'
  if (a.includes('aspirant')) return 'Talent Verification'
  if (a.includes('agency'))   return 'Agency Verification'
  if (a.includes('user') || a.includes('activate') || a.includes('suspend') || a.includes('delete')) return 'User Management'
  if (a.includes('setting') || a.includes('config')) return 'System Settings'
  return entityType ? entityType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'System'
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || ''
    if (!token) return errorResponse('Authentication required', 401)

    const userId = verifyToken(token)
    if (!userId) return errorResponse('Invalid token', 401)

    const profile = await prisma.profiles.findUnique({
      where: { id: userId }, select: { role: true },
    })
    if (!profile || profile.role !== 'admin') return errorResponse('Admin access required', 403)

    const limit = Math.min(200, parseInt(new URL(req.url).searchParams.get('limit') || '100'))

    // Use minimal select to avoid schema mismatch errors
    const logs = await (prisma.audit_logs as any).findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
    })

    const profileIds = logs
      .filter((l: any) => l.entity_id && ['profiles','aspirant_profiles','agency_profiles'].includes(l.entity_type || ''))
      .map((l: any) => l.entity_id as string)

    const profileNames: Record<string, string> = {}
    if (profileIds.length > 0) {
      try {
        const profiles = await prisma.profiles.findMany({
          where: { id: { in: profileIds } },
          select: { id: true, name: true, profile_number: true },
        })
        profiles.forEach((p: any) => {
          profileNames[p.id] = p.name || p.profile_number || p.id.slice(0, 8)
        })
      } catch {}
    }

    const activities = logs.map((log: any) => {
      const label  = humanizeAction(log.action || '')
      const module = log.module || getModule(log.action || '', log.entity_type)
      const affectedName = log.entity_id ? profileNames[log.entity_id] : null

      let description = ''
      if (affectedName) {
        description = `${label}: ${affectedName}`
      } else {
        try {
          const vals = log.new_values as Record<string, any>
          if (vals?.description)    description = vals.description
          else if (vals?.action_detail) description = vals.action_detail
        } catch {}
      }

      return {
        id:          log.id,
        action:      label,
        raw_action:  log.action,
        entity_type: log.entity_type,
        module,
        status:      log.status || 'success',
        ip_address:  log.ip_address ? String(log.ip_address) : null,
        created_at:  log.created_at?.toISOString?.() || '',
        description,
      }
    })

    return successResponse({ activities })
  } catch (err: unknown) {
    console.error('[ACTIVITY LOG ERROR]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}