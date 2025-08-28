'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useLoadingCursor } from '../../../hooks/useLoadingCursor'
import { useApp } from '../../../contexts/AppContext'
import LanguageSelector from '../../../components/common/LanguageSelector'
import WelcomeModal from '../../../components/WelcomeModal'

const registerSchema = z.object({
  userId: z.string().min(3, 'El ID de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  country: z.string().min(1, 'Selecciona un país'),
  language: z.enum(['ES', 'EN']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

const COUNTRIES = [
  'Colombia', 'México', 'Argentina', 'Chile', 'Perú', 'Ecuador', 'Venezuela',
  'Bolivia', 'Paraguay', 'Uruguay', 'Brasil', 'Estados Unidos', 'España',
  'Otro'
]

export default function RegisterPage() {
  const router = useRouter()
  const { state } = useApp()
  const { withLoadingCursor } = useLoadingCursor()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [showInvitationModal, setShowInvitationModal] = useState(false)
  const t = state.translations

  useEffect(() => {
    setIsHydrated(true)
    
    // Verificar si es la primera vez que el usuario visita la página de registro
    const hasSeenInvitation = localStorage.getItem('hasSeenRegisterInvitation')
    if (!hasSeenInvitation) {
      // Mostrar modal de invitación después de un pequeño delay
      const timer = setTimeout(() => {
        setShowInvitationModal(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      language: 'ES',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

              if (response.ok) {
          Cookies.set('auth-token', result.token, { expires: 7 })
          // Mostrar modal de bienvenida en lugar de redirigir inmediatamente
          setShowWelcomeModal(true)
        } else {
          setError(result.message || 'Error al registrarse')
        }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWelcomeContinue = () => {
    navigateToDashboard()
  }

  const handleWelcomeClose = () => {
    navigateToDashboard()
  }

  const handleInvitationContinue = () => {
    setShowInvitationModal(false)
    localStorage.setItem('hasSeenRegisterInvitation', 'true')
  }

  const handleInvitationClose = () => {
    setShowInvitationModal(false)
    localStorage.setItem('hasSeenRegisterInvitation', 'true')
  }

  // Función para navegar al dashboard de manera robusta
  const navigateToDashboard = () => {
    // Cerrar el modal y navegar inmediatamente
    setShowWelcomeModal(false)
    window.location.href = '/dashboard'
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
            {t.auth?.register?.title || 'Registrarse'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t.auth?.register?.subtitle || 'Crea tu cuenta en Meditation Mood Tracker'}
          </Typography>
        </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('userId')}
              fullWidth
              label={t.auth?.register?.userId || 'ID de Usuario'}
              variant="outlined"
              margin="normal"
              error={!!errors.userId}
              helperText={errors.userId?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register('email')}
              fullWidth
              label={t.auth?.register?.email || 'Email'}
              type="email"
              variant="outlined"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register('password')}
              fullWidth
              label={t.auth?.register?.password || 'Contraseña'}
              type="password"
              variant="outlined"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register('confirmPassword')}
              fullWidth
              label={t.auth?.register?.confirmPassword || 'Confirmar Contraseña'}
              type="password"
              variant="outlined"
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>{t.auth?.register?.country || 'País'}</InputLabel>
              <Select
                {...register('country')}
                label={t.auth?.register?.country || 'País'}
                error={!!errors.country}
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
              <InputLabel>{t.auth?.register?.language || 'Idioma'}</InputLabel>
              <Select
                {...register('language')}
                label={t.auth?.register?.language || 'Idioma'}
                error={!!errors.language}
              >
                <MenuItem value="ES">Español</MenuItem>
                <MenuItem value="EN">English</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(45deg, #B8E6B8 30%, #9CD69C 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #9CD69C 30%, #B8E6B8 90%)',
                },
              }}
            >
              {isLoading ? 'Registrando...' : (t.auth?.register?.registerButton || 'Registrarse')}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {t.auth?.register?.hasAccount || '¿Ya tienes cuenta?'}{' '}
                <Link href="/auth/login" style={{ color: '#7BC4D8', textDecoration: 'none' }}>
                  {t.auth?.register?.loginLink || 'Inicia sesión aquí'}
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
      
      {/* Modal de invitación inicial */}
      <WelcomeModal
        open={showInvitationModal}
        onContinue={handleInvitationContinue}
        onClose={handleInvitationClose}
        mode="invitation"
      />
      
      {/* Modal de bienvenida post-registro */}
      <WelcomeModal
        open={showWelcomeModal}
        onContinue={handleWelcomeContinue}
        onClose={handleWelcomeClose}
        mode="welcome"
      />
    </Container>
  )
}
