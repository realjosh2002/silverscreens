export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// GET /api/plans — returns all active plans
// Optional query param: ?type=aspirant or ?type=agency
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // 'aspirant' | 'agency' | null

    const plans = await prisma.subscription_plans.findMany({
      where: {
        is_active: true,
        ...(type ? { user_type: type } : {}),
      },
      orderBy: [
        { user_type:   'asc' },
        { sort_order:  'asc' },
      ],
      select: {
        id:               true,
        plan_key:         true,
        plan_name:        true,
        user_type:        true,
        duration_months:  true,
        price:            true,
        original_price:   true,
        features:         true,
        application_limit: true,
        is_featured:      true,
        sort_order:       true,
      },
    })

    // Group by user_type for convenience
    const aspirantPlans = plans.filter(p => p.user_type === 'aspirant')
    const agencyPlans   = plans.filter(p => p.user_type === 'agency')

    return successResponse({
      aspirant_plans: aspirantPlans,
      agency_plans:   agencyPlans,
      all_plans:      plans,
    })
  } catch (error: unknown) {
    console.error('[GET PLANS ERROR]', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
