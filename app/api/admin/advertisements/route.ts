export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { successResponse, errorResponse } from '@/lib/api-helpers'

/* ─────────────────────────────────────────────────────────────
   Create a fresh admin client on every request.
   This guarantees the service role key is read at runtime,
   not at module-load time (which can be undefined in Next.js).
───────────────────────────────────────────────────────────── */
function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/* ── Admin auth ──────────────────────────────────────────────── */
async function verifyAdmin(token: string) {
  const client = db()
  const { data: { user }, error } = await client.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await client
    .from('profiles').select('role, name').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return { id: user.id, name: (profile as any).name as string }
}

/* ── Label maps ──────────────────────────────────────────────── */
const STATUS_LABEL: Record<string, string> = {
  active: 'Active', scheduled: 'Scheduled', expired: 'Expired',
  draft: 'Draft', pending_approval: 'Pending Approval',
  rejected: 'Rejected', paused: 'Paused',
}
const TYPE_LABEL: Record<string, string> = {
  image_banner: 'Image Banner', video_ad: 'Video Ad', text_ad: 'Text Ad',
}

/* ── Shape one DB row for the frontend ───────────────────────── */
function shapeAd(ad: any) {
  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
  const imp = Number(ad.impressions || 0)
  const clk = Number(ad.clicks || 0)
  return {
    id:               ad.id,
    name:             ad.name,
    placement:        ad.placement,
    type:             TYPE_LABEL[ad.ad_type]  || ad.ad_type,
    status:           STATUS_LABEL[ad.status] || ad.status,
    impressions:      imp.toLocaleString('en-IN'),
    clicks:           clk.toLocaleString('en-IN'),
    ctr:              imp > 0 ? ((clk / imp) * 100).toFixed(2) + '%' : '0%',
    start:            fmt(ad.starts_at),
    end:              fmt(ad.ends_at),
    creator:          ad.created_by_name || 'Admin',
    media_url:        ad.media_url  || null,
    click_url:        ad.click_url  || null,
    created_at:       ad.created_at,
    _status:          ad.status,
    _type:            ad.ad_type,
    _raw_impressions: imp,
    _raw_clicks:      clk,
    // Targeting fields — passed through as-is for pre-population in SendAdModal
    target_user_type: ad.target_user_type  || null,
    target_category:  ad.target_category   || null,
    target_role:      ad.target_role       || null,
    target_age_min:   ad.target_age_min    ?? null,
    target_age_max:   ad.target_age_max    ?? null,
    target_gender:    ad.target_gender     || null,
    target_location:  ad.target_location   || null,
    delivery_channel: ad.delivery_channel  || null,
  }
}

/* ══════════════════════════════════════════════════════════════
   GET /api/admin/advertisements
   ?type=stats  → totals, placement breakdown, top ads
   ?type=table  → paginated list
══════════════════════════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'table'

    /* ── STATS ── */
    if (type === 'stats') {
      const { data: all, error: e } = await db()
        .from('advertisements')
        .select('id, status, ad_type, placement, impressions, clicks, name')

      if (e) throw new Error(e.message)

      const ads   = all ?? []
      const count = (s: string) => ads.filter((a: any) => a.status === s).length

      const totalImp = ads.reduce((s: number, a: any) => s + Number(a.impressions || 0), 0)
      const totalClk = ads.reduce((s: number, a: any) => s + Number(a.clicks     || 0), 0)

      const planMap: Record<string, number> = {}
      for (const a of ads) {
        const p = (a as any).placement || 'Unknown'
        planMap[p] = (planMap[p] || 0) + 1
      }

      const topAds = ads
        .filter((a: any) => Number(a.impressions) >= 100)
        .map((a: any) => {
          const i = Number(a.impressions), c = Number(a.clicks)
          return { name: a.name, ctr: i > 0 ? (c / i * 100).toFixed(2) + '%' : '0%', clicks: c.toLocaleString('en-IN'), ctrRaw: i > 0 ? c / i : 0 }
        })
        .sort((a: any, b: any) => b.ctrRaw - a.ctrRaw)
        .slice(0, 5)

      return successResponse({
        stats: {
          total: ads.length,
          active:    count('active'),
          scheduled: count('scheduled'),
          expired:   count('expired'),
          draft:     count('draft'),
          pending:   count('pending_approval'),
          rejected:  count('rejected'),
          paused:    count('paused'),
          totalImpressions: totalImp,
          totalClicks:      totalClk,
          ctr: totalImp > 0 ? ((totalClk / totalImp) * 100).toFixed(2) + '%' : '0%',
        },
        placement_breakdown: planMap,
        top_ads: topAds,
      })
    }

    /* ── TABLE ── */
    const search     = searchParams.get('search')    || ''
    const statusF    = searchParams.get('status')    || ''
    const typeF      = searchParams.get('ad_type')   || ''
    const placementF = searchParams.get('placement') || ''
    const sortF      = searchParams.get('sort')      || 'newest'
    const page       = Math.max(1, parseInt(searchParams.get('page')     || '1'))
    const perPage    = Math.min(50, parseInt(searchParams.get('per_page') || '8'))
    const from       = (page - 1) * perPage

    let q = db().from('advertisements').select('*', { count: 'exact' })

    if (statusF)    q = q.eq('status',    statusF)
    if (typeF)      q = q.eq('ad_type',   typeF)
    if (placementF) q = q.eq('placement', placementF)
    if (search)     q = q.or(`name.ilike.%${search}%,placement.ilike.%${search}%,created_by_name.ilike.%${search}%`)

    if      (sortF === 'oldest')      q = q.order('created_at',  { ascending: true  })
    else if (sortF === 'impressions') q = q.order('impressions', { ascending: false })
    else if (sortF === 'clicks')      q = q.order('clicks',      { ascending: false })
    else                              q = q.order('created_at',  { ascending: false })

    q = q.range(from, from + perPage - 1)

    const { data: rows, count: total, error: qErr } = await q
    if (qErr) throw new Error(qErr.message)

    return successResponse({
      ads:         (rows ?? []).map(shapeAd),
      total:       total ?? 0,
      page,
      per_page:    perPage,
      total_pages: Math.ceil((total ?? 0) / perPage),
    })

  } catch (err: unknown) {
    console.error('[ADMIN ADS GET]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

/* ══════════════════════════════════════════════════════════════
   POST /api/admin/advertisements
══════════════════════════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return errorResponse('Authentication required', 401)
    const admin = await verifyAdmin(token)
    if (!admin) return errorResponse('Admin access required', 403)

    const body   = await req.json()
    const { action, id, ids } = body
    const client = db()

    /* ── CREATE ── */
    if (action === 'create') {
      const { name, placement, ad_type, starts_at, ends_at, click_url } = body
      if (!name || !placement) return errorResponse('name and placement are required', 400)

      const { data, error } = await client
        .from('advertisements')
        .insert({
          name:            name.trim(),
          placement,
          ad_type:         ad_type    || 'image_banner',
          status:          'draft',
          click_url:       click_url  || null,
          starts_at:       starts_at  || null,
          ends_at:         ends_at    || null,
          created_by:      admin.name || 'Admin',
          created_by_name: admin.name || 'Admin',
          impressions:     0,
          clicks:          0,
        })
        .select()
        .single()

      if (error) throw new Error(error.message)
      await _audit(client, admin.id, 'ADMIN_CREATE_AD', data.id, { name })
      return successResponse({ message: 'Advertisement created as Draft', ad: shapeAd(data) })
    }

    /* ── UPDATE ── */
    if (action === 'update') {
      if (!id) return errorResponse('id is required', 400)
      const updates: any = { updated_at: new Date().toISOString() }
      const fields = ['name', 'placement', 'ad_type', 'starts_at', 'ends_at', 'click_url', 'status']
      for (const f of fields) if (body[f] !== undefined) updates[f] = body[f]
      const { error } = await client.from('advertisements').update(updates).eq('id', id)
      if (error) throw new Error(error.message)
      await _audit(client, admin.id, 'ADMIN_UPDATE_AD', id, updates)
      return successResponse({ message: 'Advertisement updated' })
    }

    /* ── DELETE ── */
    if (action === 'delete') {
      const targets = ids || (id ? [id] : null)
      if (!targets?.length) return errorResponse('id or ids required', 400)
      const { error } = await client.from('advertisements').delete().in('id', targets)
      if (error) throw new Error(error.message)
      await _audit(client, admin.id, 'ADMIN_DELETE_AD', targets.join(','), {})
      return successResponse({ message: `${targets.length} advertisement(s) deleted` })
    }

    /* ── TOGGLE (Pause / Resume) ── */
    if (action === 'toggle_status') {
      if (!id) return errorResponse('id is required', 400)
      const { data: cur } = await client.from('advertisements').select('status').eq('id', id).single()
      const next = cur?.status === 'active' ? 'paused' : 'active'
      await client.from('advertisements').update({ status: next, updated_at: new Date().toISOString() }).eq('id', id)
      await _audit(client, admin.id, 'ADMIN_TOGGLE_AD', id, { next })
      return successResponse({ message: `Ad ${next === 'active' ? 'resumed' : 'paused'}`, new_status: next })
    }

    /* ── APPROVE ── */
    if (action === 'approve') {
      const targets = ids || (id ? [id] : null)
      if (!targets?.length) return errorResponse('id or ids required', 400)
      await client.from('advertisements').update({ status: 'active', updated_at: new Date().toISOString() }).in('id', targets)
      await _audit(client, admin.id, 'ADMIN_APPROVE_AD', targets.join(','), {})
      return successResponse({ message: `${targets.length} advertisement(s) approved` })
    }

    /* ── REJECT ── */
    if (action === 'reject') {
      const targets = ids || (id ? [id] : null)
      if (!targets?.length) return errorResponse('id or ids required', 400)
      await client.from('advertisements').update({ status: 'rejected', updated_at: new Date().toISOString() }).in('id', targets)
      await _audit(client, admin.id, 'ADMIN_REJECT_AD', targets.join(','), {})
      return successResponse({ message: `${targets.length} advertisement(s) rejected` })
    }

    /* ── DUPLICATE ── */
    if (action === 'duplicate') {
      if (!id) return errorResponse('id is required', 400)
      const { data: src } = await client.from('advertisements').select('*').eq('id', id).single()
      if (!src) return errorResponse('Advertisement not found', 404)
      const { data, error } = await client
        .from('advertisements')
        .insert({
          name:            src.name + ' (Copy)',
          placement:       src.placement,
          ad_type:         src.ad_type,
          status:          'draft',
          media_url:       src.media_url,
          click_url:       src.click_url,
          impressions:     0,
          clicks:          0,
          created_by:      admin.name || 'Admin',
          created_by_name: admin.name || 'Admin',
        })
        .select()
        .single()
      if (error) throw new Error(error.message)
      await _audit(client, admin.id, 'ADMIN_DUPLICATE_AD', id, { copy_id: data.id })
      return successResponse({ message: 'Advertisement duplicated as draft', ad: shapeAd(data) })
    }

    /* ── BULK STATUS ── */
    if (action === 'bulk_status') {
      const { new_status } = body
      if (!ids?.length || !new_status) return errorResponse('ids and new_status required', 400)
      await client.from('advertisements').update({ status: new_status, updated_at: new Date().toISOString() }).in('id', ids)
      await _audit(client, admin.id, 'ADMIN_BULK_STATUS_AD', ids.join(','), { new_status })
      return successResponse({ message: `${ids.length} advertisement(s) updated to ${new_status}` })
    }

    return errorResponse('Invalid action', 400)

  } catch (err: unknown) {
    console.error('[ADMIN ADS POST]', err)
    return errorResponse(err instanceof Error ? err.message : 'Internal server error', 500)
  }
}

/* ── Audit log (non-blocking) ─────────────────────────────────── */
async function _audit(client: any, userId: string, action: string, entityId: string, values: object) {
  try {
    await client.from('audit_logs').insert({
      user_id: userId, action, entity_type: 'advertisement',
      entity_id: entityId, new_values: values,
    })
  } catch { /* never block the main action */ }
}
