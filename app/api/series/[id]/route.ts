import { NextRequest, NextResponse } from 'next/server'
import { getSeriesById, updateSeries, deleteSeries } from '@/lib/db-postgres'
import { sql } from '@vercel/postgres'

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET single series
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const series = await getSeriesById(id)

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Get books in this series
    const { rows } = await sql`SELECT * FROM books WHERE series_id = ${id}`
    const books = rows.map(row => ({
      ...row,
      seriesId: row.series_id,
      isStandalone: row.is_standalone,
      coverImage: row.cover_image,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))

    return NextResponse.json({ ...series, books })
  } catch (error) {
    console.error('Error fetching series:', error)
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 })
  }
}

// PUT update series
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const updatedSeries = await updateSeries(id, body)

    if (!updatedSeries) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    return NextResponse.json(updatedSeries)
  } catch (error) {
    console.error('Error updating series:', error)
    return NextResponse.json({ error: 'Failed to update series' }, { status: 500 })
  }
}

// DELETE series
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    await deleteSeries(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting series:', error)
    return NextResponse.json({ error: 'Failed to delete series' }, { status: 500 })
  }
}
