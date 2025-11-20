'use client'

import Link from 'next/link'
import type { Series } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface SeriesCardProps {
  series: Series & { bookCount?: number }
}

export default function SeriesCard({ series }: SeriesCardProps) {
  return (
    <Link href={`/series/${series.id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
          {series.name}
        </h3>

        {series.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {series.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {series.themes.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {series.themes.slice(0, 3).map((theme, i) => (
                <span
                  key={i}
                  className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded"
                >
                  {theme}
                </span>
              ))}
              {series.themes.length > 3 && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                  +{series.themes.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{series.bookCount || 0} books</span>
          <span>Updated {formatDate(series.updatedAt)}</span>
        </div>
      </div>
    </Link>
  )
}
