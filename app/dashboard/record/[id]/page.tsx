'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useApp } from '../../../../contexts/AppContext'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper,
} from '@mui/material'
import { ArrowBack, CalendarToday, Psychology, SelfImprovement } from '@mui/icons-material'
import { Button } from '@mui/material'

interface FeelingRating {
  id: string
  feelingId: string
  beforeRating: number
  afterRating: number
  feeling: {
    id: string
    nameEs: string
    nameEn: string
    category: 'GOOD' | 'BAD'
  }
}

interface RecordDetail {
  id: string
  date: string
  meditationType: string | null
  meditationNotes: string | null
  feelingRatings: FeelingRating[]
}

export default function RecordDetailPage() {
  const { state } = useApp()
  const router = useRouter()
  const params = useParams()
  const [record, setRecord] = useState<RecordDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/auth/login')
      return
    }

    fetchRecordDetail()
  }, [state.isAuthenticated, router])

  const fetchRecordDetail = async () => {
    try {
      const token = document.cookie.split('auth-token=')[1]?.split(';')[0] || ''
      const response = await fetch(`/api/dashboard/record/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRecord(data)
      } else {
        setError('Error al cargar el registro')
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
          <Typography sx={{ mt: 2 }}>Cargando registro...</Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    )
  }

  if (!record) {
    return (
      <Container>
        <Box sx={{ py: 4 }}>
          <Alert severity="warning">Registro no encontrado</Alert>
        </Box>
      </Container>
    )
  }

  const goodFeelings = record.feelingRatings.filter(r => r.feeling.category === 'GOOD')
  const badFeelings = record.feelingRatings.filter(r => r.feeling.category === 'BAD')

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Volver
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Detalle de Meditación
        </Typography>

        <Grid container spacing={3}>
          {/* Información general */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    Información General
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha
                    </Typography>
                    <Typography variant="body1">
                      {new Date(record.date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Tipo de Meditación
                    </Typography>
                    <Typography variant="body1">
                      {record.meditationType || 'No especificado'}
                    </Typography>
                  </Grid>
                  {record.meditationNotes && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Notas
                      </Typography>
                      <Typography variant="body1">
                        {record.meditationNotes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Sentimientos positivos */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SelfImprovement sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6">
                    Sentimientos Positivos
                  </Typography>
                </Box>
                {goodFeelings.map((rating) => (
                  <Box key={rating.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      {rating.feeling.nameEs}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Antes: {rating.beforeRating}/10
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Después: {rating.afterRating}/10
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={`Cambio: ${rating.afterRating - rating.beforeRating > 0 ? '+' : ''}${rating.afterRating - rating.beforeRating}`}
                        size="small"
                        color={rating.afterRating > rating.beforeRating ? 'success' : rating.afterRating < rating.beforeRating ? 'error' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Sentimientos negativos */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Psychology sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6">
                    Sentimientos Negativos
                  </Typography>
                </Box>
                {badFeelings.map((rating) => (
                  <Box key={rating.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      {rating.feeling.nameEs}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Antes: {rating.beforeRating}/10
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Después: {rating.afterRating}/10
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={`Cambio: ${rating.afterRating - rating.beforeRating > 0 ? '+' : ''}${rating.afterRating - rating.beforeRating}`}
                        size="small"
                        color={rating.afterRating < rating.beforeRating ? 'success' : rating.afterRating > rating.beforeRating ? 'error' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
