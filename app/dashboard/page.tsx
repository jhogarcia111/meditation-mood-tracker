'use client'

import React from 'react'
import { useApp } from '../../contexts/AppContext'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import CelebrationModal from '../../components/CelebrationModal'
import { useLoadingCursor } from '../../hooks/useLoadingCursor'

export default function DashboardPage() {
  const { state } = useApp()
  const router = useRouter()
  const { withLoadingCursor } = useLoadingCursor()
  const [showCelebration, setShowCelebration] = useState(false)
  const [recordNumber, setRecordNumber] = useState(0)
  const [publicStats, setPublicStats] = useState({
    activityData: [],
    feelingChanges: []
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const t = state.translations

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/auth/login')
    } else if (state.isAuthenticated) {
      // Verificar si hay nuevos registros para celebrar
      checkForNewRecords()
      // Cargar estadísticas públicas
      fetchPublicStats()
    }
  }, [state.isAuthenticated, state.isLoading, router])

  const fetchPublicStats = async () => {
    try {
      const response = await fetch('/api/dashboard/public-stats')
      if (response.ok) {
        const data = await response.json()
        setPublicStats(data)
      }
    } catch (error) {
      console.error('Error cargando estadísticas públicas:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const checkForNewRecords = async () => {
    try {
      const token = document.cookie.split('auth-token=')[1]?.split(';')[0] || ''
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const stats = await response.json()
        // Si hay registros y es la primera vez que se carga el dashboard
        if (stats.totalRecords > 0) {
          setRecordNumber(stats.totalRecords)
          // Mostrar celebración solo si hay registros recientes (últimos 5 minutos)
          const recentRecords = stats.records?.filter((record: any) => {
            const recordDate = new Date(record.createdAt)
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
            return recordDate > fiveMinutesAgo
          })
          if (recentRecords && recentRecords.length > 0) {
            setShowCelebration(true)
          }
        }
      }
    } catch (error) {
      console.error('Error checking for new records:', error)
    }
  }

  if (state.isLoading) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography>Cargando...</Typography>
        </Box>
      </Container>
    )
  }

  if (!state.isAuthenticated) {
    return null
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header de bienvenida que abarca las 3 columnas */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {state.translations.dashboard?.welcome || '¡Bienvenido'}, {state.user?.userId}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {state.translations.dashboard?.subtitle || 'Dashboard de Mi Brújula Emocional'}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Primera Columna - Solo Mascota */}
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
                    background: 'url("/samadhi-welcome.png") no-repeat center center',
                    backgroundSize: 'contain',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                />
                <Typography variant="h5" color="primary" gutterBottom>
                  ¡Hola! Soy Samadhi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tu compañero en este viaje de autoconocimiento y meditación
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Segunda Columna - Registrar Sentimientos, Ver Progreso y Admin */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {t.dashboard?.actions?.registerFeelings?.title || 'Registrar Sentimientos'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t.dashboard?.actions?.registerFeelings?.description || 'Registra cómo te sientes antes y después de meditar'}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => withLoadingCursor(() => router.push('/feelings/new'))}
                    >
                      {t.dashboard?.actions?.registerFeelings?.button || 'Nuevo Registro'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {t.dashboard?.actions?.viewProgress?.title || 'Ver Progreso'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {t.dashboard?.actions?.viewProgress?.description || 'Revisa tu progreso y estadísticas de meditación'}
                    </Typography>
                    <Button 
                      variant="contained" 
                      sx={{
                        background: 'linear-gradient(45deg, #FF8A65 30%, #FF7043 90%)',
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FF7043 30%, #FF8A65 90%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(255, 138, 101, 0.4)',
                        },
                        transition: 'all 0.3s ease-in-out',
                      }}
                      onClick={() => withLoadingCursor(() => router.push('/dashboard/stats'))}
                    >
                      {t.dashboard?.actions?.viewProgress?.button || 'Ver Estadísticas'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {state.user?.role === 'ADMIN' && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {t.dashboard?.actions?.adminPanel?.title || 'Panel de Administración'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {t.dashboard?.actions?.adminPanel?.description || 'Gestiona sentimientos, usuarios y analíticas'}
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={() => withLoadingCursor(() => router.push('/admin'))}
                      >
                        {t.dashboard?.actions?.adminPanel?.button || 'Ir al Panel Admin'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Tercera Columna - Impacto de la Meditación en la Comunidad */}
          <Grid item xs={12} md={5}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)',
              border: '2px solid #e3f2fd',
              height: '100%'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {t.dashboard?.community?.title || 'Impacto de la Meditación en la Comunidad'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {t.dashboard?.community?.subtitle || 'Mira cómo la meditación está transformando vidas cada día'}
                </Typography>

                <Grid container spacing={3}>
                  {/* Gráfica 1: Cambios en Sentimientos */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {t.dashboard?.community?.impactChart?.title || 'Impacto Promedio en Sentimientos'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t.dashboard?.community?.impactChart?.description || 'Diferencia promedio entre antes y después de meditar'}
                      </Typography>
                      {loadingStats ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={publicStats.feelingChanges}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="feeling" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="diferencia" fill="#4CAF50" name="Mejora Promedio" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </Paper>
                  </Grid>
                  
                  {/* Gráfica 2: Actividad Diaria */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {t.dashboard?.community?.activityChart?.title || 'Actividad Diaria en la Plataforma'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t.dashboard?.community?.activityChart?.description || 'Más personas están usando la herramienta cada día'}
                      </Typography>
                      {loadingStats ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={publicStats.activityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="activities" 
                              stroke="#2196F3" 
                              strokeWidth={2}
                              name="Actividades"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Modal de celebración */}
      <CelebrationModal
        open={showCelebration}
        onClose={() => setShowCelebration(false)}
        recordNumber={recordNumber}
      />
    </Container>
  )
}
