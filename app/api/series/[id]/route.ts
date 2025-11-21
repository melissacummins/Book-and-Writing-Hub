import { NextRequest, NextResponse } from 'next/server'
import { getSeriesById, updateSeries, deleteSeries, getAllBooks } from '@/lib/db-postgres'
import { sql } from '@vercel/postgres'

// GET single series
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const series = await getSeriesById(params.id)

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 })
    }

    // Get books in this series
    const { rows } = await sql`SELECT * FROM books WHERE series_id = ${params.id}`
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updatedSeries = await updateSeries(params.id, body)

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
  { params }: { params: { id: string } }
) {
  try {
    await deleteSeries(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting series:', error)
    return NextResponse.json({ error: 'Failed to delete series' }, { status: 500 })
  }
}
