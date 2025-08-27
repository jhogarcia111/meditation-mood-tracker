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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              marginRight: 16,
              background: 'url("/samadhi-welcome.png") no-repeat center center',
              backgroundSize: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
            }}
          />
          <Typography variant="h3" component="h1">
            ¡Bienvenido, {state.user?.userId}!
          </Typography>
        </Box>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Dashboard de Meditation Mood Tracker
        </Typography>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Columna Izquierda - Acciones del Usuario */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Registrar Sentimientos
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Registra cómo te sientes antes y después de meditar
                    </Typography>
                                         <Button 
                       variant="contained" 
                       color="primary"
                       onClick={() => withLoadingCursor(() => router.push('/feelings/new'))}
                     >
                       Nuevo Registro
                     </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Ver Progreso
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Revisa tu progreso y estadísticas de meditación
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
                  Ver Estadísticas
                </Button>
                  </CardContent>
                </Card>
              </Grid>

              {state.user?.role === 'ADMIN' && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Panel de Administración
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Gestiona sentimientos, usuarios y analíticas
                      </Typography>
                                             <Button 
                         variant="contained" 
                         color="secondary"
                         onClick={() => withLoadingCursor(() => router.push('/admin'))}
                       >
                         Ir al Panel Admin
                       </Button>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Columna Derecha - Impacto de la Meditación en la Comunidad */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)',
              border: '2px solid #e3f2fd'
            }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Impacto de la Meditación en la Comunidad
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Mira cómo la meditación está transformando vidas cada día
                </Typography>

                <Grid container spacing={3}>
                 

                  {/* Gráfica 1: Cambios en Sentimientos */}
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Impacto Promedio en Sentimientos
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Diferencia promedio entre antes y después de meditar
                      </Typography>
                      {loadingStats ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <ResponsiveContainer width="100%" height={250}>
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
                        Actividad Diaria en la Plataforma
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Más personas están usando la herramienta cada día
                      </Typography>
                      {loadingStats ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        <ResponsiveContainer width="100%" height={250}>
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
