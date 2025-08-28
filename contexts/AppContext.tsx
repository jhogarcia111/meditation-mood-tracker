'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import Cookies from 'js-cookie'
import { getTranslation } from '@/lib/i18n'

interface User {
  id: string
  userId: string
  email: string
  role: 'USER' | 'ADMIN'
  country: string
  language: 'ES' | 'EN'
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  language: 'ES' | 'EN'
  translations: any
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LANGUAGE'; payload: 'ES' | 'EN' }

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  language: 'ES',
  translations: getTranslation('ES'),
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
        translations: getTranslation(action.payload),
      }
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    // Cargar idioma guardado
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as 'ES' | 'EN'
      if (savedLanguage && (savedLanguage === 'ES' || savedLanguage === 'EN')) {
        dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage })
      }
    }

    const checkAuth = async () => {
      const token = Cookies.get('auth-token')
      
      if (token) {
        try {
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
          
          if (response.ok) {
            const user = await response.json()
            dispatch({ type: 'SET_USER', payload: user })
          } else {
            Cookies.remove('auth-token')
            dispatch({ type: 'SET_LOADING', payload: false })
          }
        } catch (error) {
          console.error('Error verifying token:', error)
          Cookies.remove('auth-token')
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
