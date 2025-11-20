'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import type { Book, Manuscript, Character } from '@/lib/types'
import { formatNumber } from '@/lib/utils'

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
})

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [manuscript, setManuscript] = useState<Manuscript | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [activeTab, setActiveTab] = useState<'manuscript' | 'characters' | 'chapters' | 'notes'>('manuscript')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    fetchBookData()
  }, [bookId])

  async function fetchBookData() {
    try {
      const res = await fetch(`/api/books/${bookId}`)
      if (!res.ok) {
        router.push('/books')
        return
      }

      const data = await res.json()
      setBook(data)
      setManuscript(data.manuscript || null)
      setCharacters(data.characters || [])
      setWordCount(data.manuscript?.wordCount || 0)
    } catch (error) {
      console.error('Error fetching book:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveManuscript(content: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/manuscripts/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (res.ok) {
        const data = await res.json()
        setManuscript(data)
        setLastSaved(new Date())
        setWordCount(data.wordCount)
      }
    } catch (error) {
      console.error('Error saving manuscript:', error)
    } finally {
      setSaving(false)
    }
  }

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!manuscript?.content) return

    const timer = setTimeout(() => {
      saveManuscript(manuscript.content)
    }, 30000)

    return () => clearTimeout(timer)
  }, [manuscript?.content])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  if (!book) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/books" className="text-purple-600 hover:text-purple-700 mb-2 inline-block">
            ← Back to Books
          </Link>
        </div>

        {/* Book Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-6">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                width={150}
                height={225}
                className="rounded shadow"
              />
            ) : (
              <div className="w-[150px] h-[225px] bg-gradient-to-br from-purple-400 to-blue-400 rounded flex items-center justify-center text-4xl">
                📖
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              {book.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">{book.subtitle}</p>
              )}
              {book.blurb && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{book.blurb}</p>
              )}
              <div className="flex gap-4 text-sm">
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded">
                  {book.isStandalone ? 'Standalone' : 'Series'}
                </span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded">
                  {formatNumber(wordCount)} words
                </span>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded">
                  {characters.length} characters
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('manuscript')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'manuscript'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                ✍️ Manuscript
              </button>
              <button
                onClick={() => setActiveTab('characters')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'characters'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                👥 Characters ({characters.length})
              </button>
              <button
                onClick={() => setActiveTab('chapters')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'chapters'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                📑 Chapters
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-6 py-3 font-semibold ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                📝 Notes
              </button>
              {saving && (
                <div className="ml-auto px-6 py-3 text-sm text-gray-500">Saving...</div>
              )}
              {lastSaved && !saving && (
                <div className="ml-auto px-6 py-3 text-sm text-gray-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'manuscript' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Write Your Manuscript</h2>
                  <button
                    onClick={() => saveManuscript(manuscript?.content || '')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Now'}
                  </button>
                </div>
                <RichTextEditor
                  content={manuscript?.content || ''}
                  onChange={(content) => setManuscript({ ...manuscript!, content })}
                  placeholder="Begin writing your story..."
                  onWordCountChange={setWordCount}
                />
              </div>
            )}

            {activeTab === 'characters' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Characters</h2>
                {characters.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-2">👥</div>
                    <p className="text-gray-600 dark:text-gray-400">No characters yet</p>
                    <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                      Add Character
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map(char => (
                      <div key={char.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        {char.image && (
                          <Image src={char.image} alt={char.name} width={100} height={100} className="rounded-full mb-2" />
                        )}
                        <h3 className="font-bold">{char.name}</h3>
                        {char.aliases.length > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            aka {char.aliases.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chapters' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Chapters</h2>
                <p className="text-gray-600 dark:text-gray-400">Chapter organization coming soon...</p>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Notes</h2>
                <p className="text-gray-600 dark:text-gray-400">Notes feature coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
