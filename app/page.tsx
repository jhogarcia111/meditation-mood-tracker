'use client'

import { Container, Typography, Button, Box, Card, CardContent, Grid } from '@mui/material'
import { SelfImprovement, Analytics, Language } from '@mui/icons-material'
import { useLoadingCursor } from '../hooks/useLoadingCursor'
import { useApp } from '../contexts/AppContext'
import LanguageSelector from '../components/common/LanguageSelector'

export default function HomePage() {
  const { withLoadingCursor } = useLoadingCursor()
  const { state } = useApp()
  const t = state.translations
  
  return (
    <Box className="min-h-screen gradient-bg">
      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Language Selector */}
        <Box sx={{ 
          position: 'absolute', 
          top: { xs: 80, sm: 90 }, // Ajustar posición considerando la barra de navegación
          right: 20, 
          zIndex: 10 
        }}>
          <LanguageSelector />
        </Box>

        {/* Hero Section con 2 columnas */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: 8 }} className="animate-fadeIn">
          {/* Primera Columna - Mascota */}
          <Grid item xs={12} md={5}>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 300,
                  height: 300,
                  margin: '0 auto',
                  background: 'url("/samadhi-hero.png") no-repeat center center',
                  backgroundSize: 'contain',
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.3))',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Segunda Columna - Título y Botones */}
          <Grid item xs={12} md={7}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: 'white', 
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 3
                }}
              >
                {t.hero.title}
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  mb: 6,
                  fontWeight: 300
                }}
              >
                {t.hero.subtitle}
              </Typography>
              
              {/* Botones centrados */}
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => withLoadingCursor(() => window.location.href = '/auth/login')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    },
                    px: 5,
                    py: 2.5,
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  {t.hero.loginButton}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => withLoadingCursor(() => window.location.href = '/auth/register')}
                  sx={{
                    borderColor: 'white',
                    borderWidth: 2,
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    },
                    px: 5,
                    py: 2.5,
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  {t.hero.registerButton}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Grid container spacing={4} className="animate-slideIn">
          <Grid item xs={12} md={4}>
            <Card className="soft-shadow" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <SelfImprovement sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  {t.features.meditation.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t.features.meditation.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="soft-shadow" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Analytics sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  {t.features.analytics.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t.features.analytics.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card className="soft-shadow" sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Language sx={{ fontSize: 60, color: 'accent.500', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  {t.features.global.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t.features.global.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
