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
  const { withLoadingCursor } = useLoadingCursor()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
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
        withLoadingCursor(() => router.push('/dashboard'))
      } else {
        setError(result.message || 'Error al registrarse')
      }
    } catch (error) {
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
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Registrarse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crea tu cuenta en Meditation Mood Tracker
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
              label="ID de Usuario"
              variant="outlined"
              margin="normal"
              error={!!errors.userId}
              helperText={errors.userId?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register('email')}
              fullWidth
              label="Email"
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
              label="Contraseña"
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
              label="Confirmar Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>País</InputLabel>
              <Select
                {...register('country')}
                label="País"
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
              <InputLabel>Idioma</InputLabel>
              <Select
                {...register('language')}
                label="Idioma"
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
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes cuenta?{' '}
                <Link href="/auth/login" style={{ color: '#7BC4D8', textDecoration: 'none' }}>
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}
