'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Book, Series } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [series, setSeries] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    blurb: '',
    coverImage: '',
    isStandalone: true,
    seriesId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [booksRes, seriesRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/series')
      ])
      const [booksData, seriesData] = await Promise.all([
        booksRes.json(),
        seriesRes.json()
      ])
      setBooks(booksData)
      setSeries(seriesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setFormData(prev => ({ ...prev, coverImage: data.url }))
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          title: '',
          subtitle: '',
          blurb: '',
          coverImage: '',
          isStandalone: true,
          seriesId: '',
        })
        setShowForm(false)
        fetchData()
      }
    } catch (error) {
      console.error('Error creating book:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-purple-600 hover:text-purple-700 mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold">Books</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your books and manuscripts
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Book'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Create New Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Subtitle (optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Blurb / Description</label>
                <textarea
                  value={formData.blurb}
                  onChange={e => setFormData({ ...formData, blurb: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  rows={4}
                  placeholder="Book description or back cover blurb"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                {formData.coverImage && (
                  <div className="mt-2">
                    <Image
                      src={formData.coverImage}
                      alt="Cover preview"
                      width={150}
                      height={225}
                      className="rounded shadow"
                    />
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.isStandalone ? 'standalone' : 'series'}
                    onChange={e => setFormData({
                      ...formData,
                      isStandalone: e.target.value === 'standalone',
                      seriesId: e.target.value === 'standalone' ? '' : formData.seriesId
                    })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="standalone">Standalone</option>
                    <option value="series">Part of Series</option>
                  </select>
                </div>

                {!formData.isStandalone && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Series</label>
                    <select
                      value={formData.seriesId}
                      onChange={e => setFormData({ ...formData, seriesId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      required={!formData.isStandalone}
                    >
                      <option value="">Select a series</option>
                      {series.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Book
              </button>
            </form>
          </div>
        )}

        {books.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold mb-2">No books yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first book to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Book
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
              <Link key={book.id} href={`/books/${book.id}`}>
                <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer">
                  {book.coverImage ? (
                    <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                      <span className="text-6xl">📖</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {book.title}
                    </h3>
                    {book.subtitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        {book.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {book.isStandalone ? 'Standalone' : 'Series'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
