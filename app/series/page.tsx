'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import SeriesCard from '@/components/SeriesCard'
import type { Series } from '@/lib/types'

export default function SeriesPage() {
  const [series, setSeries] = useState<(Series & { bookCount: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    themes: '',
    lore: '',
    tropes: '',
  })

  useEffect(() => {
    fetchSeries()
  }, [])

  async function fetchSeries() {
    try {
      const res = await fetch('/api/series')
      const data = await res.json()

      // Get book counts
      const booksRes = await fetch('/api/books')
      const books = await booksRes.json()

      const seriesWithCounts = data.map((s: Series) => ({
        ...s,
        bookCount: books.filter((b: any) => b.seriesId === s.id).length
      }))

      setSeries(seriesWithCounts)
    } catch (error) {
      console.error('Error fetching series:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const res = await fetch('/api/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          themes: formData.themes.split(',').map(t => t.trim()).filter(Boolean),
          tropes: formData.tropes.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })

      if (res.ok) {
        setFormData({ name: '', description: '', themes: '', lore: '', tropes: '' })
        setShowForm(false)
        fetchSeries()
      }
    } catch (error) {
      console.error('Error creating series:', error)
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
            <h1 className="text-4xl font-bold">Book Series</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your book series and standalones
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Series'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Create New Series</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Series Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter series name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of the series"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Themes (comma-separated)</label>
                <input
                  type="text"
                  value={formData.themes}
                  onChange={e => setFormData({ ...formData, themes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Adventure, Romance, Mystery"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tropes (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tropes}
                  onChange={e => setFormData({ ...formData, tropes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Enemies to Lovers, Chosen One, Found Family"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lore</label>
                <textarea
                  value={formData.lore}
                  onChange={e => setFormData({ ...formData, lore: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder="Background lore and world information"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Create Series
              </button>
            </form>
          </div>
        )}

        {series.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">No series yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first book series to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Series
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map(s => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
