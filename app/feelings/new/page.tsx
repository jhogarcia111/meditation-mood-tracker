'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useLoadingCursor } from '../../../hooks/useLoadingCursor'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import CelebrationModal from '../../../components/CelebrationModal'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Alert,
  Container,
  Paper,
  Chip,
  Grid,
  Divider,
  Dialog,
  DialogContent,
} from '@mui/material'
// Removido framer-motion para usar animaciones CSS simples

// Esquemas de validación
const step1Schema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  beforeFeelings: z.record(z.string(), z.number().min(1).max(10)),
  moodDescription: z.string().optional(),
})

const step2Schema = z.object({
  selectedMeditation: z.string().optional(),
})

const step3Schema = z.object({
  afterFeelings: z.record(z.string(), z.number().min(1).max(10)),
  postMeditationNotes: z.string().optional(),
})

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema)

type FormData = z.infer<typeof fullSchema>

interface Feeling {
  id: string
  nameEs: string
  nameEn: string
  category: 'GOOD' | 'BAD'
}

interface MeditationRecommendation {
  id: string
  name: string
  description: string
  duration: string
  category: string
  youtubeUrl?: string
}

export default function NewRecordPage() {
  const router = useRouter()
  const { withLoadingCursor } = useLoadingCursor()
  const [activeStep, setActiveStep] = useState(0)
  const [feelings, setFeelings] = useState<Feeling[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [recommendations, setRecommendations] = useState<MeditationRecommendation[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [recordNumber, setRecordNumber] = useState(0)
  const [showYouTubeModal, setShowYouTubeModal] = useState(false)
  const [selectedMeditationForVideo, setSelectedMeditationForVideo] = useState<MeditationRecommendation | null>(null)
  const [meditationStarted, setMeditationStarted] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      beforeFeelings: {},
      afterFeelings: {},
    },
  })

  // Observar los sentimientos antes para generar recomendaciones
  const beforeFeelings = watch('beforeFeelings')
  const moodDescription = watch('moodDescription')

  useEffect(() => {
    fetchFeelings()
  }, [])

  useEffect(() => {
    if (activeStep === 1) {
      generateRecommendations()
    }
    if (activeStep === 2) {
      // Inicializar afterFeelings con valores por defecto cuando llegamos a la Fase 3
      const initialAfterFeelings: Record<string, number> = {}
      feelings.forEach((feeling: Feeling) => {
        initialAfterFeelings[feeling.id] = 5
      })
      setValue('afterFeelings', initialAfterFeelings)
    }
  }, [activeStep, beforeFeelings, moodDescription, feelings, setValue])

  const fetchFeelings = async () => {
    try {
      const response = await fetch('/api/feelings')
      if (response.ok) {
        const data = await response.json()
        
        // Función para mezclar array aleatoriamente
        const shuffleArray = (array: any[]) => {
          const shuffled = [...array]
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
          }
          return shuffled
        }
        
        // Mezclar sentimientos aleatoriamente
        const shuffledFeelings = shuffleArray(data)
        setFeelings(shuffledFeelings)
        
        // Inicializar ratings solo para beforeFeelings
        const initialFeelings: Record<string, number> = {}
        shuffledFeelings.forEach((feeling: Feeling) => {
          initialFeelings[feeling.id] = 5
        })
        setValue('beforeFeelings', initialFeelings)
        // No inicializar afterFeelings aquí, se hará en la Fase 3
      }
    } catch (error) {
      console.error('Error fetching feelings:', error)
      setError('Error al cargar los sentimientos')
    }
  }

  const handleStartMeditation = (meditation: MeditationRecommendation) => {
    setSelectedMeditationForVideo(meditation)
    setShowYouTubeModal(true)
    setMeditationStarted(true)
    // Si no hay meditación seleccionada en el picklist, establecer esta como seleccionada
    if (!watch('selectedMeditation')) {
      setValue('selectedMeditation', meditation.id)
    }
  }

  const handleCloseYouTubeModal = () => {
    setShowYouTubeModal(false)
    setSelectedMeditationForVideo(null)
  }

  const generateRecommendations = async () => {
    try {
      const response = await fetch('/api/meditations/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beforeFeelings,
          moodDescription,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const formattedRecommendations: MeditationRecommendation[] = data.map((meditation: any) => ({
          id: meditation.id,
          name: meditation.title,
          description: meditation.description,
          duration: `${meditation.duration} minutos`,
          category: meditation.tags?.[0]?.name || 'General',
          youtubeUrl: meditation.youtubeUrl,
        }))
        setRecommendations(formattedRecommendations)
      } else {
        // Fallback a recomendaciones estáticas si falla la API
        const fallbackRecommendations: MeditationRecommendation[] = [
          {
            id: '1',
            name: 'Meditación de Respiración Profunda',
            description: 'Ideal para reducir ansiedad y estrés',
            duration: '10 minutos',
            category: 'Respiración'
          },
          {
            id: '2',
            name: 'Meditación Mindfulness',
            description: 'Meditación general para cualquier estado de ánimo',
            duration: '10 minutos',
            category: 'General'
          }
        ]
        setRecommendations(fallbackRecommendations)
      }
    } catch (error) {
      console.error('Error obteniendo recomendaciones:', error)
      // Fallback a recomendaciones estáticas
      const fallbackRecommendations: MeditationRecommendation[] = [
        {
          id: '1',
          name: 'Meditación de Respiración Profunda',
          description: 'Ideal para reducir ansiedad y estrés',
          duration: '10 minutos',
          category: 'Respiración'
        },
        {
          id: '2',
          name: 'Meditación Mindfulness',
          description: 'Meditación general para cualquier estado de ánimo',
          duration: '10 minutos',
          category: 'General'
        }
      ]
      setRecommendations(fallbackRecommendations)
    }
  }

  const handleNext = () => {
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError('')

    try {
      // Obtener el token de las cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1]

      const response = await fetch('/api/feelings/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        // Obtener el número total de registros para mostrar la celebración
        try {
          const statsResponse = await fetch('/api/dashboard', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
          if (statsResponse.ok) {
            const stats = await statsResponse.json()
            setRecordNumber(stats.totalRecords)
            setShowCelebration(true)
            // Resetear el formulario después de guardar exitosamente
            setActiveStep(0)
            setMeditationStarted(false)
            setShowYouTubeModal(false)
            setSelectedMeditationForVideo(null)
          } else {
            withLoadingCursor(() => router.push('/dashboard'))
          }
        } catch (error) {
          withLoadingCursor(() => router.push('/dashboard'))
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al guardar el registro')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    'Información General',
    'Recomendación de Meditación',
    'Evaluación Post-Meditación'
  ]

  const renderStep1 = () => (
    <Box
      sx={{
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        📅 Información General
      </Typography>
      
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Fecha del registro"
            type="date"
            margin="normal"
            error={!!errors.date}
            helperText={errors.date?.message}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        💭 ¿Cómo te sientes ANTES de meditar?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Evalúa cada sentimiento en una escala del 1 al 10
      </Typography>

      {feelings.length > 0 && (
        <Box>
          {['GOOD', 'BAD'].map((category) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {category === 'GOOD' ? '😊 Sentimientos Positivos' : '😔 Sentimientos Negativos'}
              </Typography>
              <Grid container spacing={2}>
                {feelings
                  .filter((feeling) => feeling.category === category)
                  .map((feeling) => (
                    <Grid item xs={12} sm={6} key={feeling.id}>
                      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          {feeling.nameEs}
                        </Typography>
                                                 <Controller
                           name={`beforeFeelings.${feeling.id}`}
                           control={control}
                           render={({ field }) => (
                             <Slider
                               {...field}
                               min={1}
                               max={10}
                               marks
                               valueLabelDisplay="on"
                               sx={{ mt: 1 }}
                             />
                           )}
                         />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">1</Typography>
                          <Typography variant="caption" color="text.secondary">10</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      <Controller
        name="moodDescription"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Descripción opcional del estado de ánimo"
            multiline
            rows={3}
            margin="normal"
            placeholder="Describe cómo te sientes, qué te preocupa, o algo que quieras resaltar antes de meditar..."
          />
        )}
      />
    </Box>
  )

  const renderStep2 = () => (
    <Box
      sx={{
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        🎯 Recomendación de Meditación
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Basado en tu estado de ánimo actual, te recomendamos estas meditaciones:
      </Typography>

      {/* Picklist de meditación seleccionada */}
      <Controller
        name="selectedMeditation"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Seleccionar una meditación (opcional)</InputLabel>
            <Select 
              {...field} 
              label="Seleccionar una meditación (opcional)"
              disabled={meditationStarted}
            >
              <MenuItem value="">
                <em>No seleccionar</em>
              </MenuItem>
              {recommendations.map((meditation) => (
                <MenuItem key={meditation.id} value={meditation.id}>
                  {meditation.name} - {meditation.duration}
                </MenuItem>
              ))}
            </Select>
            {meditationStarted && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                La selección está bloqueada porque ya comenzaste una meditación
              </Typography>
            )}
          </FormControl>
        )}
      />

      {/* Recomendaciones de meditaciones */}
      {recommendations.length > 0 ? (
        <Box>
          {recommendations.map((meditation, index) => {
            const pastelColors = [
              '#E3F2FD', // Azul claro
              '#F3E5F5', // Púrpura claro
              '#E8F5E8', // Verde claro
              '#FFF3E0', // Naranja claro
              '#FCE4EC', // Rosa claro
              '#F1F8E9', // Verde lima
            ]
            
            return (
              <Card 
                key={meditation.id} 
                sx={{ 
                  mb: 2, 
                  p: 2,
                  backgroundColor: pastelColors[index % pastelColors.length],
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  {/* Columna 1: Información de la meditación */}
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {meditation.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {meditation.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip 
                        label={meditation.category} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                        {meditation.duration}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {/* Columna 2: Botón de comenzar meditación */}
                  <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                    {meditation.youtubeUrl ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => handleStartMeditation(meditation)}
                        disabled={meditationStarted && watch('selectedMeditation') !== meditation.id}
                        sx={{ 
                          minWidth: '140px',
                          fontWeight: 'bold'
                        }}
                      >
                        Comenzar Meditación
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Video no disponible
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Card>
            )
          })}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Cargando recomendaciones...
        </Typography>
      )}
    </Box>
  )

  const renderStep3 = () => (
    <Box
      sx={{
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        💭 Evaluación Post-Meditación
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Ahora evalúa cómo te sientes DESPUÉS de meditar:
      </Typography>

      {feelings.length > 0 && (
        <Box>
          {['GOOD', 'BAD'].map((category) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {category === 'GOOD' ? '😊 Sentimientos Positivos' : '😔 Sentimientos Negativos'}
              </Typography>
              <Grid container spacing={2}>
                {feelings
                  .filter((feeling) => feeling.category === category)
                  .map((feeling) => (
                    <Grid item xs={12} sm={6} key={feeling.id}>
                      <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          {feeling.nameEs}
                        </Typography>
                                                 <Controller
                           name={`afterFeelings.${feeling.id}`}
                           control={control}
                           render={({ field }) => (
                             <Slider
                               {...field}
                               min={1}
                               max={10}
                               marks
                               valueLabelDisplay="on"
                               sx={{ mt: 1 }}
                             />
                           )}
                         />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">1</Typography>
                          <Typography variant="caption" color="text.secondary">10</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      <Controller
        name="postMeditationNotes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Comentarios opcionales después de meditar"
            multiline
            rows={3}
            margin="normal"
            placeholder="¿Cómo te sientes ahora? ¿Notaste algún cambio? ¿Algo que quieras compartir?"
          />
        )}
      />
    </Box>
  )

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderStep1()
      case 1:
        return renderStep2()
      case 2:
        return renderStep3()
      default:
        return null
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto 16px',
              background: 'url("/samadhi-form.png") no-repeat center center',
              backgroundSize: 'contain',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Nuevo Registro de Sentimientos
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box>
            {renderStepContent()}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Atrás
              </Button>

              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      background: 'linear-gradient(45deg, #A8D5E2 30%, #7BC4D8 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #7BC4D8 30%, #A8D5E2 90%)',
                      },
                    }}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar Registro'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                      background: 'linear-gradient(45deg, #A8D5E2 30%, #7BC4D8 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #7BC4D8 30%, #A8D5E2 90%)',
                      },
                    }}
                  >
                    Siguiente
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Modal de YouTube */}
      <Dialog
        open={showYouTubeModal}
        onClose={handleCloseYouTubeModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            height: '80vh',
            maxHeight: '600px'
          }
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <Box sx={{ position: 'relative', height: '100%' }}>
            {/* Header del modal */}
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f5f5f5'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {selectedMeditationForVideo?.name}
              </Typography>
              <Button
                onClick={handleCloseYouTubeModal}
                variant="outlined"
                size="small"
              >
                Cerrar
              </Button>
            </Box>
            
            {/* Iframe de YouTube */}
            {selectedMeditationForVideo?.youtubeUrl && (
              <Box sx={{ height: 'calc(100% - 80px)', p: 2 }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedMeditationForVideo.youtubeUrl.replace('watch?v=', 'embed/')}
                  title={selectedMeditationForVideo.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '8px' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de celebración */}
      <CelebrationModal
        open={showCelebration}
        onClose={() => {
          setShowCelebration(false)
          withLoadingCursor(() => router.push('/dashboard'))
        }}
        recordNumber={recordNumber}
      />
    </Container>
  )
}
