import { NextRequest, NextResponse } from 'next/server'
import { getAllBooks, createBook } from '@/lib/db-postgres'

// GET all books
export async function GET() {
  try {
    const books = await getAllBooks()
    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}

// POST create new book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newBook = await createBook({
      title: body.title,
      subtitle: body.subtitle,
      blurb: body.blurb,
      coverImage: body.coverImage,
      isStandalone: body.isStandalone ?? true,
      seriesId: body.seriesId,
    })

    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
  }
}
