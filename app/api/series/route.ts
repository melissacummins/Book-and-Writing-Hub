import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB, generateId, timestamp } from '@/lib/db'
import type { Series } from '@/lib/types'

// GET all series
export async function GET() {
  try {
    const db = await readDB()
    return NextResponse.json(db.series)
  } catch (error) {
    console.error('Error fetching series:', error)
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 })
  }
}

// POST create new series
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await readDB()

    const newSeries: Series = {
      id: generateId(),
      name: body.name,
      description: body.description || undefined,
      themes: body.themes || [],
      lore: body.lore || undefined,
      tropes: body.tropes || [],
      createdAt: timestamp(),
      updatedAt: timestamp(),
    }

    db.series.push(newSeries)
    await writeDB(db)

    return NextResponse.json(newSeries, { status: 201 })
  } catch (error) {
    console.error('Error creating series:', error)
    return NextResponse.json({ error: 'Failed to create series' }, { status: 500 })
  }
}
