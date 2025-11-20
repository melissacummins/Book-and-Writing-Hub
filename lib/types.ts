// Type definitions for the application

export interface Series {
  id: string
  name: string
  description?: string
  themes: string[]
  lore?: string
  tropes: string[]
  createdAt: string
  updatedAt: string
}

export interface Book {
  id: string
  title: string
  subtitle?: string
  blurb?: string
  coverImage?: string
  isStandalone: boolean
  seriesId?: string
  createdAt: string
  updatedAt: string
}

export interface Manuscript {
  id: string
  content: string
  bookId: string
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface Character {
  id: string
  name: string
  aliases: string[]
  image?: string
  description?: string
  profile?: string
  bookId: string
  createdAt: string
  updatedAt: string
}

export interface CharacterMention {
  id: string
  characterId: string
  chapterId?: string
  context?: string
  createdAt: string
}

export interface Chapter {
  id: string
  title: string
  content: string
  order: number
  wordCount: number
  bookId: string
  createdAt: string
  updatedAt: string
}

export interface Scene {
  id: string
  title: string
  content: string
  order: number
  wordCount: number
  chapterId: string
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  title: string
  content: string
  type: string
  bookId: string
  createdAt: string
  updatedAt: string
}

export interface WorldBuilding {
  id: string
  title: string
  category: string
  content: string
  seriesId: string
  createdAt: string
  updatedAt: string
}

export interface WordCountHistory {
  id: string
  date: string
  wordsAdded: number
  wordsRevised: number
  totalWords: number
  activityType: 'drafting' | 'revising' | 'mixed'
  bookId?: string
  notes?: string
  createdAt: string
}

export interface Database {
  series: Series[]
  books: Book[]
  manuscripts: Manuscript[]
  characters: Character[]
  characterMentions: CharacterMention[]
  chapters: Chapter[]
  scenes: Scene[]
  notes: Note[]
  worldBuilding: WorldBuilding[]
  wordCountHistory: WordCountHistory[]
}
