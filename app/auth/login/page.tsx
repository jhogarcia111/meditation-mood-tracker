'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  CircularProgress,
} from '@mui/material'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useApp } from '../../../contexts/AppContext'
import { useLoadingCursor } from '../../../hooks/useLoadingCursor'
import LanguageSelector from '../../../components/common/LanguageSelector'

const loginSchema = z.object({
  userId: z.string().min(1, 'El ID de usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { state, dispatch } = useApp()
  const { withLoadingCursor } = useLoadingCursor()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const t = state.translations

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    console.log('🚀 Iniciando proceso de login...', data)
    setIsLoading(true)
    setError('')

    try {
      console.log('📡 Enviando petición a /api/auth/login...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('📥 Respuesta recibida:', response.status, response.statusText)
      const result = await response.json()
      console.log('📄 Datos de respuesta:', result)

      if (response.ok) {
        console.log('✅ Login exitoso, guardando token...')
        Cookies.set('auth-token', result.token, { expires: 7 })
        console.log('📍 Token guardado:', result.token)
        console.log('👤 Usuario:', result.user)
        
        // Actualizar el contexto de la aplicación
        console.log('🔄 Actualizando contexto de la aplicación...')
        dispatch({ type: 'SET_USER', payload: result.user })
        
        console.log('🔄 Redirigiendo a dashboard...')
        // Intentar redirección con timeout
        setTimeout(() => {
          console.log('⏰ Intentando redirección...')
          withLoadingCursor(() => router.push('/dashboard'))
        }, 100)
      } else {
        console.log('❌ Error en login:', result.message)
        setError(result.message || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.log('💥 Error de conexión:', error)
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isHydrated) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
                  {/* Language Selector */}
        <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
          <LanguageSelector />
        </Box>

        <Box textAlign="center" mb={3}>
          {/* Mascota Samadhi */}
          <Box
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto 16px',
              background: 'url("/samadhi-form.png") no-repeat center center',
              backgroundSize: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            {t.auth?.login?.title || 'Iniciar Sesión'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t.auth?.login?.subtitle || 'Accede a tu cuenta de Meditation Mood Tracker'}
          </Typography>
        </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={(e) => {
            console.log('📝 Formulario enviado')
            handleSubmit(onSubmit)(e)
          }}>
            <TextField
              {...register('userId')}
              fullWidth
              label={t.auth?.login?.userId || 'ID de Usuario'}
              variant="outlined"
              margin="normal"
              error={!!errors.userId}
              helperText={errors.userId?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register('password')}
              fullWidth
              label={t.auth?.login?.password || 'Contraseña'}
              type="password"
              variant="outlined"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(45deg, #A8D5E2 30%, #7BC4D8 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7BC4D8 30%, #A8D5E2 90%)',
                },
              }}
            >
              {isLoading ? 'Iniciando sesión...' : (t.auth?.login?.loginButton || 'Iniciar Sesión')}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {t.auth?.login?.noAccount || '¿No tienes cuenta?'}{' '}
                <Link href="/auth/register" style={{ color: '#7BC4D8', textDecoration: 'none' }}>
                  {t.auth?.login?.registerLink || 'Regístrate aquí'}
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}
