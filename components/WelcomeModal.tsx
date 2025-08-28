'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material'
import { Celebration, Favorite, Psychology, VolunteerActivism } from '@mui/icons-material'

interface WelcomeModalProps {
  open: boolean
  onClose: () => void
  onContinue: () => void
  mode?: 'invitation' | 'welcome'
}

export default function WelcomeModal({ open, onClose, onContinue, mode = 'welcome' }: WelcomeModalProps) {
  const isInvitation = mode === 'invitation'
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%)',
          border: '3px solid #7BC4D8',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }
      }}
    >
      <DialogContent sx={{ p: 0, textAlign: 'center' }}>
        {/* Header con mascota animada */}
        <Box sx={{ 
          p: 4, 
          background: 'linear-gradient(135deg, #A8D5E2 0%, #7BC4D8 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Mascota Samadhi animada */}
          <Box
            sx={{
              width: 150,
              height: 150,
              margin: '0 auto 16px',
              background: `url("/${isInvitation ? 'samadhi-hero.png' : 'samadhi-celebration.png'}") no-repeat center center`,
              backgroundSize: 'contain',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
              animation: isInvitation 
                ? 'bounce 2s infinite, wave 3s infinite ease-in-out' 
                : 'bounce 2s infinite, rotate 4s infinite linear',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': {
                  transform: 'translateY(0)',
                },
                '40%': {
                  transform: 'translateY(-10px)',
                },
                '60%': {
                  transform: 'translateY(-5px)',
                },
              },
              '@keyframes rotate': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
              '@keyframes wave': {
                '0%, 100%': {
                  transform: 'rotate(-5deg)',
                },
                '50%': {
                  transform: 'rotate(5deg)',
                },
              },
            }}
          />
          
          {/* Efectos de celebración */}
          <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
            <Celebration sx={{ fontSize: 30, color: '#FFD700', animation: 'pulse 1.5s infinite' }} />
          </Box>
          <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
            <Favorite sx={{ fontSize: 30, color: '#FF6B6B', animation: 'pulse 1.5s infinite 0.5s' }} />
          </Box>
          <Box sx={{ position: 'absolute', bottom: 20, left: 20 }}>
            {isInvitation ? (
              <VolunteerActivism sx={{ fontSize: 30, color: '#4ECDC4', animation: 'pulse 1.5s infinite 1s' }} />
            ) : (
              <Psychology sx={{ fontSize: 30, color: '#4ECDC4', animation: 'pulse 1.5s infinite 1s' }} />
            )}
          </Box>
          <Box sx={{ position: 'absolute', bottom: 20, right: 20 }}>
            <Celebration sx={{ fontSize: 30, color: '#FFD700', animation: 'pulse 1.5s infinite 1.5s' }} />
          </Box>
        </Box>

        {/* Contenido del modal */}
        <Box sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: '#2C3E50',
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isInvitation ? '¡Únete a nuestra comunidad! 🌟' : '¡Bienvenido a nuestra comunidad! 🎉'}
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              color: '#34495E',
              mb: 3,
              fontWeight: 500,
              lineHeight: 1.6
            }}
          >
            {isInvitation 
              ? '¡Te invitamos a ser parte de nuestro voluntariado de meditación!'
              : '¡Gracias por querer ser parte de nuestra comunidad de meditación!'
            }
          </Typography>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3,
              background: 'rgba(255,255,255,0.8)',
              borderRadius: 3,
              border: '2px solid #E8F4FD'
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#2C3E50',
                mb: 2,
                lineHeight: 1.7
              }}
            >
              {isInvitation ? (
                <>
                  Estamos buscando <strong>voluntarios</strong> que quieran cambiar sus emociones 
                  y mejorar su bienestar emocional a través de la meditación. 
                  Tu participación nos ayuda a expandir los beneficios de esta práctica a más personas.
                </>
              ) : (
                <>
                  Estamos realizando un <strong>voluntariado</strong> para expandir los beneficios de la meditación 
                  a más personas. Tu participación nos ayuda a hacer que esta herramienta llegue a quienes más la necesitan.
                </>
              )}
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                color: '#2C3E50',
                lineHeight: 1.7
              }}
            >
              {isInvitation ? (
                <>
                  ¡Samadhi está emocionado de conocerte! Juntos podemos crear una comunidad 
                  de personas comprometidas con su crecimiento personal y bienestar emocional. 🌱
                </>
              ) : (
                <>
                  ¡Ya casi eres parte del programa! Samadhi y todo el equipo estamos emocionados de acompañarte 
                  en este viaje de autoconocimiento y bienestar emocional. 🌟
                </>
              )}
            </Typography>
          </Paper>

          {/* Botones */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={onContinue}
              sx={{
                background: 'linear-gradient(45deg, #7BC4D8 30%, #A8D5E2 90%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                '&:hover': {
                  background: 'linear-gradient(45deg, #A8D5E2 30%, #7BC4D8 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(123, 196, 216, 0.4)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {isInvitation ? '¡Quiero ser voluntario! 🚀' : '¡Comenzar mi viaje! 🚀'}
            </Button>
            
            {isInvitation && (
              <Button
                variant="outlined"
                size="large"
                onClick={onClose}
                sx={{
                  borderColor: '#7BC4D8',
                  color: '#7BC4D8',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: '#A8D5E2',
                    backgroundColor: 'rgba(123, 196, 216, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Tal vez después
              </Button>
            )}
          </Box>

          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              mt: 2, 
              color: '#7F8C8D',
              fontStyle: 'italic'
            }}
          >
            {isInvitation 
              ? 'Samadhi está listo para guiarte en tu práctica de meditación'
              : 'Samadhi está listo para guiarte en cada paso de tu práctica de meditación'
            }
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
