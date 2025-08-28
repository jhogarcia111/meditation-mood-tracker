import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '../contexts/AppContext'
import ThemeRegistry from '../components/ThemeRegistry'
import Navigation from '../components/Navigation'
import { Box } from '@mui/material'

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
            <Box sx={{ 
              // El margen se aplicará automáticamente cuando Navigation esté presente
              minHeight: 'calc(100vh - 64px)' // Altura mínima considerando la barra de navegación
            }}>
              {children}
            </Box>
          </AppProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
