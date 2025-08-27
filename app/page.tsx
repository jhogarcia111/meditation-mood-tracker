'use client'

import { Container, Typography, Button, Box, Card, CardContent, Grid } from '@mui/material'
import { SelfImprovement, Analytics, Language } from '@mui/icons-material'
import { useLoadingCursor } from '../hooks/useLoadingCursor'

export default function HomePage() {
  const { withLoadingCursor } = useLoadingCursor()
  
  return (
    <Box className="min-h-screen gradient-bg">
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={8} className="animate-fadeIn">
          <Box
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto 24px',
              background: 'url("/samadhi-hero.png") no-repeat center center',
              backgroundSize: 'contain',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
            }}
          />
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              color: 'white', 
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Meditation Mood Tracker
          </Typography>
          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)', 
              mb: 4,
              fontWeight: 300
            }}
          >
            Rastrea tu estado de ánimo antes y después de meditar
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => withLoadingCursor(() => window.location.href = '/auth/login')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                },
                px: 4,
                py: 2,
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => withLoadingCursor(() => window.location.href = '/auth/register')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                px: 4,
                py: 2,
              }}
            >
              Registrarse
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4} className="animate-slideIn">
          <Grid item xs={12} md={4}>
            <Card className="soft-shadow" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <SelfImprovement sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Meditación Guiada
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Registra tu estado antes y después de cada sesión de meditación
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="soft-shadow" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Analytics sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Análisis Personal
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Visualiza tu progreso con gráficas detalladas de tu bienestar
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="soft-shadow" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Language sx={{ fontSize: 60, color: 'accent.500', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Estudio Global
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Participa en un estudio global sobre los beneficios de la meditación
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
