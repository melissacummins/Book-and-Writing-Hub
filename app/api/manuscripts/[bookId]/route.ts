import { NextRequest, NextResponse } from 'next/server'
import { readDB, writeDB, generateId, timestamp } from '@/lib/db'
import { countWords } from '@/lib/utils'
import type { Manuscript } from '@/lib/types'

// GET manuscript for a book
export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const db = await readDB()
    const manuscript = db.manuscripts.find(m => m.bookId === params.bookId)

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
  { params }: { params: { bookId: string } }
) {
  try {
    const body = await request.json()
    const db = await readDB()

    const existingIndex = db.manuscripts.findIndex(m => m.bookId === params.bookId)
    const wordCount = countWords(body.content || '')

    if (existingIndex >= 0) {
      // Update existing
      const oldWordCount = db.manuscripts[existingIndex].wordCount

      db.manuscripts[existingIndex] = {
        ...db.manuscripts[existingIndex],
        content: body.content,
        wordCount,
        updatedAt: timestamp(),
      }

      // Track word count changes
      if (wordCount !== oldWordCount) {
        const diff = wordCount - oldWordCount
        db.wordCountHistory.push({
          id: generateId(),
          date: timestamp(),
          wordsAdded: diff > 0 ? diff : 0,
          wordsRevised: diff < 0 ? Math.abs(diff) : 0,
          totalWords: wordCount,
          activityType: diff > 0 ? 'drafting' : 'revising',
          bookId: params.bookId,
          createdAt: timestamp(),
        })
      }

      await writeDB(db)
      return NextResponse.json(db.manuscripts[existingIndex])
    } else {
      // Create new
      const newManuscript: Manuscript = {
        id: generateId(),
        content: body.content || '',
        bookId: params.bookId,
        wordCount,
        createdAt: timestamp(),
        updatedAt: timestamp(),
      }

      db.manuscripts.push(newManuscript)

      // Track initial word count
      if (wordCount > 0) {
        db.wordCountHistory.push({
          id: generateId(),
          date: timestamp(),
          wordsAdded: wordCount,
          wordsRevised: 0,
          totalWords: wordCount,
          activityType: 'drafting',
          bookId: params.bookId,
          createdAt: timestamp(),
        })
      }

      await writeDB(db)
      return NextResponse.json(newManuscript, { status: 201 })
    }
  } catch (error) {
    console.error('Error saving manuscript:', error)
    return NextResponse.json({ error: 'Failed to save manuscript' }, { status: 500 })
  }
}
