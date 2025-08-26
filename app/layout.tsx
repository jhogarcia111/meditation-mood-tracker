import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Meditation Mood Tracker',
  description: 'Track your mood before and after meditation',
}

// Crear tema personalizado con colores pasteles
const theme = createTheme({
  palette: {
    primary: {
      main: '#A8D5E2',
      light: '#D4E8F0',
      dark: '#7BC4D8',
      contrastText: '#2C3E50',
    },
    secondary: {
      main: '#B8E6B8',
      light: '#D4F0D4',
      dark: '#9CD69C',
      contrastText: '#2C5530',
    },
    background: {
      default: '#FDFDFD',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#374151',
      secondary: '#6B7280',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontWeight: 600,
      color: '#374151',
    },
    h2: {
      fontWeight: 600,
      color: '#374151',
    },
    h3: {
      fontWeight: 500,
      color: '#374151',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
          },
          '& .MuiSlider-track': {
            height: 6,
          },
          '& .MuiSlider-rail': {
            height: 6,
          },
        },
      },
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
