import { NextRequest, NextResponse } from 'next/server'
import { getAllSeries, createSeries } from '@/lib/db-postgres'

// GET all series
export async function GET() {
  try {
    const series = await getAllSeries()
    return NextResponse.json(series)
  } catch (error) {
    console.error('Error fetching series:', error)
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 })
  }
}

// POST create new series
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newSeries = await createSeries({
      name: body.name,
      description: body.description,
      themes: body.themes || [],
      lore: body.lore,
      tropes: body.tropes || [],
    })

    return NextResponse.json(newSeries, { status: 201 })
  } catch (error) {
    console.error('Error creating series:', error)
    return NextResponse.json({ error: 'Failed to create series' }, { status: 500 })
  }
}
