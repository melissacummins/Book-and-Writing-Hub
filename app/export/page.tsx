import Link from 'next/link'

export default function ExportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-4">Export & Backup</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Export your work to various formats for backup or publishing
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Export features will allow you to:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>Export entire database as JSON (complete backup)</li>
            <li>Export manuscripts as Microsoft Word (.docx) files</li>
            <li>Export manuscripts as PDF with custom formatting</li>
            <li>Export character sheets and world-building documents</li>
            <li>Batch export multiple books at once</li>
            <li>Schedule automatic backups</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
