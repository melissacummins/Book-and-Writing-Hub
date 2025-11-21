import { NextRequest, NextResponse } from 'next/server'
import { getManuscriptByBookId, createOrUpdateManuscript, createWordCountHistory } from '@/lib/db-postgres'
import { countWords } from '@/lib/utils'

// GET manuscript for a book
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params
    const manuscript = await getManuscriptByBookId(bookId)

    if (!manuscript) {
      return NextResponse.json({ error: 'Manuscript not found' }, { status: 404 })
    }

    return NextResponse.json(manuscript)
  } catch (error) {
    console.error('Error fetching manuscript:', error)
    return NextResponse.json({ error: 'Failed to fetch manuscript' }, { status: 500 })
  }
}

// PUT create or update manuscript
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params
    const body = await request.json()
    const wordCount = countWords(body.content || '')

    // Get existing manuscript to track changes
    const existing = await getManuscriptByBookId(bookId)

    // Save manuscript
    const manuscript = await createOrUpdateManuscript(bookId, body.content || '', wordCount)

    // Track word count changes
    if (existing) {
      const oldWordCount = existing.wordCount || 0
      if (wordCount !== oldWordCount) {
        const diff = wordCount - oldWordCount
        await createWordCountHistory({
          wordsAdded: diff > 0 ? diff : 0,
          wordsRevised: diff < 0 ? Math.abs(diff) : 0,
          totalWords: wordCount,
          activityType: diff > 0 ? 'drafting' : 'revising',
          bookId: bookId,
        })
      }
    } else if (wordCount > 0) {
      // Track initial word count
      await createWordCountHistory({
        wordsAdded: wordCount,
        wordsRevised: 0,
        totalWords: wordCount,
        activityType: 'drafting',
        bookId: bookId,
      })
    }

    return NextResponse.json(manuscript)
  } catch (error) {
    console.error('Error saving manuscript:', error)
    return NextResponse.json({ error: 'Failed to save manuscript' }, { status: 500 })
  }
}
