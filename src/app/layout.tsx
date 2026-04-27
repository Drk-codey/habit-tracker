import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-100 min-h-screen">
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
          }
        `
        }} />
      </body>
    </html>
  )
}