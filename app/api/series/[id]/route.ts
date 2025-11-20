import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB, timestamp } from '@/lib/db'

// GET single series
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await readDB()
    const series = db.series.find(s => s.id === params.id)

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Get books in this series
    const books = db.books.filter(b => b.seriesId === params.id)

    return NextResponse.json({ ...series, books })
  } catch (error) {
    console.error('Error fetching series:', error)
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 })
  }
}

// PUT update series
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const db = await readDB()

    const index = db.series.findIndex(s => s.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    db.series[index] = {
      ...db.series[index],
      name: body.name ?? db.series[index].name,
      description: body.description ?? db.series[index].description,
      themes: body.themes ?? db.series[index].themes,
      lore: body.lore ?? db.series[index].lore,
      tropes: body.tropes ?? db.series[index].tropes,
      updatedAt: timestamp(),
    }

    await writeDB(db)

    return NextResponse.json(db.series[index])
  } catch (error) {
    console.error('Error updating series:', error)
    return NextResponse.json({ error: 'Failed to update series' }, { status: 500 })
  }
}

// DELETE series
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await readDB()

    const index = db.series.findIndex(s => s.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Also delete all books in the series
    db.books = db.books.filter(b => b.seriesId !== params.id)
    db.worldBuilding = db.worldBuilding.filter(w => w.seriesId !== params.id)
    db.series.splice(index, 1)

    await writeDB(db)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting series:', error)
    return NextResponse.json({ error: 'Failed to delete series' }, { status: 500 })
  }
}
