import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

// POST /api/locations/sync — called by admin locations page on every save
// Uses bulk country-level and state-level updates instead of row-by-row
export async function POST(req: NextRequest) {
  try {
    const { config } = await req.json()
    if (!Array.isArray(config)) return errorResponse('Invalid config', 400)

    // Separate countries into active/inactive at the country level first
    const activeCountries:   string[] = []
    const inactiveCountries: string[] = []

    // For active countries, track which states are active/inactive
    const activeStatesByCountry:   Record<string, string[]> = {}
    const inactiveStatesByCountry: Record<string, string[]> = {}

    for (const country of config) {
      if (!country.active) {
        inactiveCountries.push(country.name)
        continue
      }
      activeCountries.push(country.name)

      const activeStates:   string[] = []
      const inactiveStates: string[] = []

      for (const state of country.states ?? []) {
        if (country.active && state.active) {
          activeStates.push(state.name)
        } else {
          inactiveStates.push(state.name)
        }
      }

      if (activeStates.length)   activeStatesByCountry[country.name]   = activeStates
      if (inactiveStates.length) inactiveStatesByCountry[country.name] = inactiveStates
    }

    // 1. Deactivate all rows for inactive countries in one query
    if (inactiveCountries.length > 0) {
      await prisma.locations.updateMany({
        where:  { country: { in: inactiveCountries } },
        data:   { is_active: false },
      })
    }

    // 2. For each active country, activate all its rows first
    for (const country of activeCountries) {
      await prisma.locations.updateMany({
        where: { country },
        data:  { is_active: true },
      })

      // 3. Then deactivate rows for inactive states within that country
      const inactiveStates = inactiveStatesByCountry[country] ?? []
      if (inactiveStates.length > 0) {
        await prisma.locations.updateMany({
          where: { country, state: { in: inactiveStates } },
          data:  { is_active: false },
        })
      }
    }

    return successResponse({ message: 'Locations synced successfully' })
  } catch (error: unknown) {
    console.error('[LOCATIONS SYNC ERROR]', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
}