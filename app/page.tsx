import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Book & Writing Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your comprehensive book and writing management system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Link href="/series" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                Series & Books
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your book series, standalones, covers, and metadata
              </p>
            </div>
          </Link>

          <Link href="/writing" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                Writing Hub
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Write, edit, and organize your manuscripts with AI assistance
              </p>
            </div>
          </Link>

          <Link href="/characters" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                Characters
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Create detailed character profiles with images and tracking
              </p>
            </div>
          </Link>

          <Link href="/world-building" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🌍</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                World Building
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Track themes, lore, tropes, and world-building elements
              </p>
            </div>
          </Link>

          <Link href="/analytics" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Track word counts, writing progress, and productivity
              </p>
            </div>
          </Link>

          <Link href="/export" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💾</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                Export & Backup
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Export your work to JSON, Word, or PDF formats
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
