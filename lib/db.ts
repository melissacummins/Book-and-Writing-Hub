import { promises as fs } from 'fs'
import path from 'path'
import type { Database } from './types'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

// Initialize empty database
const emptyDB: Database = {
  series: [],
  books: [],
  manuscripts: [],
  characters: [],
  characterMentions: [],
  chapters: [],
  scenes: [],
  notes: [],
  worldBuilding: [],
  wordCountHistory: [],
}

// Ensure data directory and db file exist
async function ensureDB() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    try {
      await fs.access(DB_PATH)
    } catch {
      await fs.writeFile(DB_PATH, JSON.stringify(emptyDB, null, 2))
    }
  } catch (error) {
    console.error('Error ensuring database:', error)
  }
}

// Read database
export async function readDB(): Promise<Database> {
  await ensureDB()
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading database:', error)
    return emptyDB
  }
}

// Write database
export async function writeDB(db: Database): Promise<void> {
  await ensureDB()
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
  } catch (error) {
    console.error('Error writing database:', error)
    throw error
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get current timestamp
export function timestamp(): string {
  return new Date().toISOString()
}
