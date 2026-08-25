export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

const LOCATION_KEY = 'location_config'

// GET /api/locations/public — public endpoint, no auth required
// Returns only active countries, states and cities for aspirant dropdowns
export async function GET(req: NextRequest) {
  try {
    const setting = await prisma.system_settings.findUnique({
      where: { key: LOCATION_KEY },
    })

    if (!setting?.value) {
      return successResponse({ countries: [], stateMap: {}, cityMap: {} })
    }

    const config = JSON.parse(setting.value)

    const countries: string[] = []
    const stateMap: Record<string, string[]> = {}
    const cityMap: Record<string, string[]> = {}

    config.forEach((country: any) => {
      if (!country.active) return
      countries.push(country.name)
      const activeStates: string[] = []
      ;(country.states ?? []).forEach((state: any) => {
        if (!state.active) return
        activeStates.push(state.name)
        const activeCities = (state.cities ?? [])
          .filter((c: any) => c.active)
          .map((c: any) => c.name)
        if (activeCities.length > 0) cityMap[state.name] = activeCities
      })
      if (activeStates.length > 0) stateMap[country.name] = activeStates
    })

    return successResponse({ countries, stateMap, cityMap })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return errorResponse(message, 500)
  }
}
