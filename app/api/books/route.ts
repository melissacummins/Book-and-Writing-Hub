import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB, generateId, timestamp } from '@/lib/db'
import type { Book } from '@/lib/types'

// GET all books
export async function GET() {
  try {
    const db = await readDB()
    return NextResponse.json(db.books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}

// POST create new book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const db = await readDB()

    const newBook: Book = {
      id: generateId(),
      title: body.title,
      subtitle: body.subtitle || undefined,
      blurb: body.blurb || undefined,
      coverImage: body.coverImage || undefined,
      isStandalone: body.isStandalone ?? true,
      seriesId: body.seriesId || undefined,
      createdAt: timestamp(),
      updatedAt: timestamp(),
    }

    db.books.push(newBook)
    await writeDB(db)

    return NextResponse.json(newBook, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
  }
}
