'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatNumber, formatDate } from '@/lib/utils'

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalWords: 0,
    totalCharacters: 0,
    recentActivity: [] as any[]
  })

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [booksRes, manuscriptsRes, charactersRes, historyRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/manuscripts'),
        fetch('/api/characters'),
        fetch('/api/word-count-history')
      ].map(p => p.catch(() => ({ json: async () => [] }))))

      const books = await booksRes.json().catch(() => [])
      const manuscripts = await manuscriptsRes.json ? await manuscriptsRes.json().catch(() => []) : []
      const characters = await charactersRes.json ? await charactersRes.json().catch(() => []) : []
      const history = await historyRes.json ? await historyRes.json().catch(() => []) : []

      const totalWords = Array.isArray(manuscripts)
        ? manuscripts.reduce((sum: number, m: any) => sum + (m.wordCount || 0), 0)
        : 0

      setStats({
        totalBooks: Array.isArray(books) ? books.length : 0,
        totalWords,
        totalCharacters: Array.isArray(characters) ? characters.length : 0,
        recentActivity: Array.isArray(history) ? history.slice(0, 10) : []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-4">Analytics</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Track your writing progress and productivity
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold mb-1">{stats.totalBooks}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Books</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">✍️</div>
            <div className="text-3xl font-bold mb-1">{formatNumber(stats.totalWords)}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Words</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold mb-1">{stats.totalCharacters}</div>
            <div className="text-gray-600 dark:text-gray-400">Total Characters</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Word Count History</h2>
          {stats.recentActivity.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No writing activity yet. Start writing to see your progress!
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity: any) => (
                <div key={activity.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">
                        {activity.activityType === 'drafting' ? '📝 Drafting' : '✏️ Revising'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(activity.date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {activity.activityType === 'drafting' ? '+' : ''}
                        {formatNumber(activity.wordsAdded || activity.wordsRevised)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total: {formatNumber(activity.totalWords)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
