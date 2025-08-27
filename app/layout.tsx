import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '../contexts/AppContext'
import ThemeRegistry from '../components/ThemeRegistry'
import Navigation from '../components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meditation Mood Tracker',
  description: 'Track your mood before and after meditation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeRegistry>
          <AppProvider>
            <Navigation />
            {children}
          </AppProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
