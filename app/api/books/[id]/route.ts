import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB, timestamp } from '@/lib/db'

// GET single book with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await readDB()
    const book = db.books.find(b => b.id === params.id)

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Get related data
    const manuscript = db.manuscripts.find(m => m.bookId === params.id)
    const characters = db.characters.filter(c => c.bookId === params.id)
    const chapters = db.chapters.filter(c => c.bookId === params.id).sort((a, b) => a.order - b.order)
    const notes = db.notes.filter(n => n.bookId === params.id)

    return NextResponse.json({
      ...book,
      manuscript,
      characters,
      chapters,
      notes,
    })
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
  }
}

// PUT update book
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const db = await readDB()

    const index = db.books.findIndex(b => b.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    db.books[index] = {
      ...db.books[index],
      title: body.title ?? db.books[index].title,
      subtitle: body.subtitle ?? db.books[index].subtitle,
      blurb: body.blurb ?? db.books[index].blurb,
      coverImage: body.coverImage ?? db.books[index].coverImage,
      isStandalone: body.isStandalone ?? db.books[index].isStandalone,
      seriesId: body.seriesId ?? db.books[index].seriesId,
      updatedAt: timestamp(),
    }

    await writeDB(db)

    return NextResponse.json(db.books[index])
  } catch (error) {
    console.error('Error updating book:', error)
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 })
  }
}

// DELETE book
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await readDB()

    const index = db.books.findIndex(b => b.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Delete all related data
    db.manuscripts = db.manuscripts.filter(m => m.bookId !== params.id)
    db.characters = db.characters.filter(c => c.bookId !== params.id)
    db.chapters = db.chapters.filter(c => c.bookId !== params.id)
    db.notes = db.notes.filter(n => n.bookId !== params.id)
    db.books.splice(index, 1)

    await writeDB(db)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 })
  }
}
