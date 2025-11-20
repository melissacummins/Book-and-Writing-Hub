import Link from 'next/link'

export default function CharactersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-4">Characters</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Character management is integrated into each book. Go to a specific book to add and manage characters.
        </p>
        <Link
          href="/books"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold inline-block"
        >
          Go to Books
        </Link>
      </div>
    </div>
  )
}
