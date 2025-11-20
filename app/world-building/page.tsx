'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function WorldBuildingPage() {
  const [series, setSeries] = useState([])

  useEffect(() => {
    fetch('/api/series')
      .then(res => res.json())
      .then(data => setSeries(data))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-4">World Building</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Track themes, lore, tropes, and world-building elements for your series.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            World-building features will allow you to:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
            <li>Create and organize world-building elements by category</li>
            <li>Link elements to specific series or books</li>
            <li>Track magic systems, locations, cultures, and more</li>
            <li>Build interconnected lore and mythology</li>
            <li>Reference world elements while writing</li>
          </ul>

          {series.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Your Series:</h3>
              <ul className="space-y-2">
                {series.map((s: any) => (
                  <li key={s.id}>
                    <Link href={`/series/${s.id}`} className="text-purple-600 hover:text-purple-700">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
