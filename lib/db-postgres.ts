import { sql } from '@vercel/postgres'
import type { Database } from './types'

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get current timestamp
export function timestamp(): string {
  return new Date().toISOString()
}

// Initialize database tables
export async function initDB() {
  try {
    // Create Series table
    await sql`
      CREATE TABLE IF NOT EXISTS series (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        themes TEXT DEFAULT '[]',
        lore TEXT,
        tropes TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create Books table
    await sql`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        blurb TEXT,
        cover_image TEXT,
        is_standalone BOOLEAN DEFAULT true,
        series_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
      )
    `

    // Create Manuscripts table
    await sql`
      CREATE TABLE IF NOT EXISTS manuscripts (
        id TEXT PRIMARY KEY,
        content TEXT,
        book_id TEXT UNIQUE NOT NULL,
        word_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `

    // Create Characters table
    await sql`
      CREATE TABLE IF NOT EXISTS characters (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        aliases TEXT DEFAULT '[]',
        image TEXT,
        description TEXT,
        profile TEXT,
        book_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `

    // Create Character Mentions table
    await sql`
      CREATE TABLE IF NOT EXISTS character_mentions (
        id TEXT PRIMARY KEY,
        character_id TEXT NOT NULL,
        chapter_id TEXT,
        context TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
      )
    `

    // Create Chapters table
    await sql`
      CREATE TABLE IF NOT EXISTS chapters (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        order_num INTEGER NOT NULL,
        word_count INTEGER DEFAULT 0,
        book_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
        UNIQUE (book_id, order_num)
      )
    `

    // Create Scenes table
    await sql`
      CREATE TABLE IF NOT EXISTS scenes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        order_num INTEGER NOT NULL,
        word_count INTEGER DEFAULT 0,
        chapter_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
        UNIQUE (chapter_id, order_num)
      )
    `

    // Create Notes table
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        type TEXT,
        book_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `

    // Create World Building table
    await sql`
      CREATE TABLE IF NOT EXISTS world_building (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        content TEXT,
        series_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
      )
    `

    // Create Word Count History table
    await sql`
      CREATE TABLE IF NOT EXISTS word_count_history (
        id TEXT PRIMARY KEY,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        words_added INTEGER DEFAULT 0,
        words_revised INTEGER DEFAULT 0,
        total_words INTEGER DEFAULT 0,
        activity_type TEXT,
        book_id TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log('Database tables initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

// Helper to convert database row to camelCase
function toCamelCase(obj: any) {
  const result: any = {}
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
    result[camelKey] = obj[key]
  }
  return result
}

// Series operations
export async function getAllSeries() {
  const { rows } = await sql`SELECT * FROM series ORDER BY updated_at DESC`
  return rows.map(toCamelCase)
}

export async function getSeriesById(id: string) {
  const { rows } = await sql`SELECT * FROM series WHERE id = ${id}`
  return rows[0] ? toCamelCase(rows[0]) : null
}

export async function createSeries(data: any) {
  const id = generateId()
  const now = timestamp()
  await sql`
    INSERT INTO series (id, name, description, themes, lore, tropes, created_at, updated_at)
    VALUES (${id}, ${data.name}, ${data.description || null}, ${JSON.stringify(data.themes || [])},
            ${data.lore || null}, ${JSON.stringify(data.tropes || [])}, ${now}, ${now})
  `
  return getSeriesById(id)
}

export async function updateSeries(id: string, data: any) {
  const now = timestamp()
  await sql`
    UPDATE series
    SET name = COALESCE(${data.name}, name),
        description = COALESCE(${data.description}, description),
        themes = COALESCE(${data.themes ? JSON.stringify(data.themes) : null}, themes),
        lore = COALESCE(${data.lore}, lore),
        tropes = COALESCE(${data.tropes ? JSON.stringify(data.tropes) : null}, tropes),
        updated_at = ${now}
    WHERE id = ${id}
  `
  return getSeriesById(id)
}

export async function deleteSeries(id: string) {
  await sql`DELETE FROM series WHERE id = ${id}`
  return { success: true }
}

// Book operations
export async function getAllBooks() {
  const { rows } = await sql`SELECT * FROM books ORDER BY updated_at DESC`
  return rows.map(toCamelCase)
}

export async function getBookById(id: string) {
  const { rows } = await sql`SELECT * FROM books WHERE id = ${id}`
  return rows[0] ? toCamelCase(rows[0]) : null
}

export async function createBook(data: any) {
  const id = generateId()
  const now = timestamp()
  await sql`
    INSERT INTO books (id, title, subtitle, blurb, cover_image, is_standalone, series_id, created_at, updated_at)
    VALUES (${id}, ${data.title}, ${data.subtitle || null}, ${data.blurb || null},
            ${data.coverImage || null}, ${data.isStandalone ?? true}, ${data.seriesId || null}, ${now}, ${now})
  `
  return getBookById(id)
}

export async function updateBook(id: string, data: any) {
  const now = timestamp()
  await sql`
    UPDATE books
    SET title = COALESCE(${data.title}, title),
        subtitle = COALESCE(${data.subtitle}, subtitle),
        blurb = COALESCE(${data.blurb}, blurb),
        cover_image = COALESCE(${data.coverImage}, cover_image),
        is_standalone = COALESCE(${data.isStandalone}, is_standalone),
        series_id = COALESCE(${data.seriesId}, series_id),
        updated_at = ${now}
    WHERE id = ${id}
  `
  return getBookById(id)
}

export async function deleteBook(id: string) {
  await sql`DELETE FROM books WHERE id = ${id}`
  return { success: true }
}

// Manuscript operations
export async function getManuscriptByBookId(bookId: string) {
  const { rows } = await sql`SELECT * FROM manuscripts WHERE book_id = ${bookId}`
  return rows[0] ? toCamelCase(rows[0]) : null
}

export async function createOrUpdateManuscript(bookId: string, content: string, wordCount: number) {
  const existing = await getManuscriptByBookId(bookId)
  const now = timestamp()

  if (existing) {
    await sql`
      UPDATE manuscripts
      SET content = ${content},
          word_count = ${wordCount},
          updated_at = ${now}
      WHERE book_id = ${bookId}
    `
  } else {
    const id = generateId()
    await sql`
      INSERT INTO manuscripts (id, content, book_id, word_count, created_at, updated_at)
      VALUES (${id}, ${content}, ${bookId}, ${wordCount}, ${now}, ${now})
    `
  }

  return getManuscriptByBookId(bookId)
}

// Character operations
export async function getCharactersByBookId(bookId: string) {
  const { rows } = await sql`SELECT * FROM characters WHERE book_id = ${bookId} ORDER BY created_at DESC`
  return rows.map(toCamelCase)
}

export async function createCharacter(data: any) {
  const id = generateId()
  const now = timestamp()
  await sql`
    INSERT INTO characters (id, name, aliases, image, description, profile, book_id, created_at, updated_at)
    VALUES (${id}, ${data.name}, ${JSON.stringify(data.aliases || [])}, ${data.image || null},
            ${data.description || null}, ${data.profile || null}, ${data.bookId}, ${now}, ${now})
  `
  const { rows } = await sql`SELECT * FROM characters WHERE id = ${id}`
  return rows[0] ? toCamelCase(rows[0]) : null
}

// Chapter operations
export async function getChaptersByBookId(bookId: string) {
  const { rows } = await sql`SELECT * FROM chapters WHERE book_id = ${bookId} ORDER BY order_num ASC`
  return rows.map(toCamelCase)
}

// Note operations
export async function getNotesByBookId(bookId: string) {
  const { rows } = await sql`SELECT * FROM notes WHERE book_id = ${bookId} ORDER BY updated_at DESC`
  return rows.map(toCamelCase)
}

// Word count history operations
export async function createWordCountHistory(data: any) {
  const id = generateId()
  const now = timestamp()
  await sql`
    INSERT INTO word_count_history (id, date, words_added, words_revised, total_words, activity_type, book_id, notes, created_at)
    VALUES (${id}, ${now}, ${data.wordsAdded || 0}, ${data.wordsRevised || 0}, ${data.totalWords || 0},
            ${data.activityType}, ${data.bookId || null}, ${data.notes || null}, ${now})
  `
}

export async function getAllWordCountHistory() {
  const { rows } = await sql`SELECT * FROM word_count_history ORDER BY date DESC LIMIT 100`
  return rows.map(toCamelCase)
}
