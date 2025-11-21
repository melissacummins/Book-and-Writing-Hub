import { NextRequest, NextResponse } from 'next/server'
import {
  getBookById,
  updateBook,
  deleteBook,
  getManuscriptByBookId,
  getCharactersByBookId,
  getChaptersByBookId,
  getNotesByBookId
} from '@/lib/db-postgres'

// GET single book with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const book = await getBookById(id)

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Get related data
    const [manuscript, characters, chapters, notes] = await Promise.all([
      getManuscriptByBookId(id),
      getCharactersByBookId(id),
      getChaptersByBookId(id),
      getNotesByBookId(id),
    ])

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updatedBook = await updateBook(id, body)

    if (!updatedBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json(updatedBook)
  } catch (error) {
    console.error('Error updating book:', error)
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 })
  }
}

// DELETE book
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteBook(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting book:', error)
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 })
  }
}
