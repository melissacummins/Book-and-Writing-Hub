import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Book & Writing Hub',
  description: 'Your comprehensive book and writing management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
