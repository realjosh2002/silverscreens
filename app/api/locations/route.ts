import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(_req: NextRequest) {
  try {
    const rows = await prisma.locations.findMany({
      where: { is_active: true },
      select: { country: true, state: true, city: true },
      orderBy: [
        { country: 'asc' },
        { state: 'asc' },
        { city: 'asc' },
      ],
    })

    const countries: string[] = []
    const stateMap: Record<string, string[]> = {}
    const cityMap:  Record<string, string[]> = {}

    for (const row of rows) {
      if (!countries.includes(row.country)) {
        countries.push(row.country)
      }
      if (row.state) {
        if (!stateMap[row.country]) stateMap[row.country] = []
        if (!stateMap[row.country].includes(row.state)) {
          stateMap[row.country].push(row.state)
        }
      }
      if (row.city && row.state) {
        if (!cityMap[row.state]) cityMap[row.state] = []
        if (!cityMap[row.state].includes(row.city)) {
          cityMap[row.state].push(row.city)
        }
      }
    }

    return successResponse({ countries, stateMap, cityMap })
  } catch (error: unknown) {
    console.error('[LOCATIONS API ERROR]', error)
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}