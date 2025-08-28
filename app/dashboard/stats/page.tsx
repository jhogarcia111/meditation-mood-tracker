'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../contexts/AppContext'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material'
import { TrendingUp, Psychology, SelfImprovement, Timeline, CalendarToday } from '@mui/icons-material'
import { LinearProgress, Chip, List, ListItem, ListItemText, ListItemIcon } from '@mui/material'

export default function StatsPage() {
  const { state } = useApp()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/auth/login')
      return
    }

    fetchStats()
  }, [state.isAuthenticated, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0] || ''}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('Error al cargar las estadísticas')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!state.isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Cargando estadísticas...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header de bienvenida */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Mis Estadísticas
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Progreso de tu práctica de meditación
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {stats ? (
          <Grid container spacing={4}>
            {/* Primera Columna - Mascota */}
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                border: '2px solid #e1f5fe',
                height: '100%'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      margin: '0 auto 16px',
                      background: 'url("/samadhi-hero.png") no-repeat center center',
                      backgroundSize: 'contain',
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  />
                  <Typography variant="h5" color="primary" gutterBottom>
                    ¡Excelente Progreso!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cada meditación te acerca más a tu bienestar emocional
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Segunda Columna - Estadísticas */}
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                {/* Tarjetas de estadísticas principales */}
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <SelfImprovement sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h4" gutterBottom>
                        {stats.totalRecords || 0}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Sesiones Registradas
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TrendingUp sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                      <Typography variant="h4" gutterBottom>
                        {stats.averageImprovement ? `${stats.averageImprovement.toFixed(1)}%` : '0%'}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Mejora Promedio
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Psychology sx={{ fontSize: 48, color: 'accent.500', mb: 2 }} />
                      <Typography variant="h4" gutterBottom>
                        {stats.averageBeforeRating ? stats.averageBeforeRating.toFixed(1) : '0'}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Estado Antes (Promedio)
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Progreso hacia meta de 15 meditaciones */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Timeline sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">
                          Progreso hacia Meta (15 meditaciones)
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" color="primary.main">
                          {stats.totalRecords || 0} / 15
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(((stats.totalRecords || 0) / 15) * 100)}% completado
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(((stats.totalRecords || 0) / 15) * 100, 100)}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Registros recientes */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarToday sx={{ mr: 1, color: 'secondary.main' }} />
                        <Typography variant="h6">
                          Registros Recientes
                        </Typography>
                      </Box>
                      {stats.records && stats.records.length > 0 ? (
                        <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                          {stats.records.slice(0, 5).map((record: any, index: number) => (
                            <ListItem 
                              key={record.id} 
                              sx={{ 
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                              }}
                              onClick={() => router.push(`/dashboard/record/${record.id}`)}
                            >
                              <ListItemIcon>
                                <CalendarToday fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={`Meditación #${stats.totalRecords - index}`}
                                secondary={new Date(record.date).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              />
                              <Chip 
                                label={record.meditationType || 'Sin tipo'} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No hay registros recientes
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                No hay datos disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comienza registrando tu primera sesión de meditación para ver tus estadísticas.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  )
}
