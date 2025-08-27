'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material'
import { Celebration, Star, Favorite } from '@mui/icons-material'

interface CelebrationModalProps {
  open: boolean
  onClose: () => void
  recordNumber: number
}

const getCelebrationMessage = (recordNumber: number) => {
  const messages = [
    "¡Has logrado tu primera meditación! 🎉",
    "¡Segunda meditación completada! ¡Vas muy bien! 🌟",
    "¡Tercera meditación! ¡Eres un experto! ✨",
    "¡Cuarta meditación! ¡Tu progreso es increíble! 🎊",
    "¡Quinta meditación! ¡Estás construyendo un hábito! 💪",
    "¡Sexta meditación! ¡Tu mente se está fortaleciendo! 🧠",
    "¡Séptima meditación! ¡Eres consistente! 🔥",
    "¡Octava meditación! ¡Tu bienestar mejora cada día! 🌈",
    "¡Novena meditación! ¡Casi llegas a la meta! 🎯",
    "¡Décima meditación! ¡Estás en el camino correcto! 🚀",
    "¡Undécima meditación! ¡Tu transformación es visible! 🌟",
    "¡Duodécima meditación! ¡Eres un ejemplo! 👑",
    "¡Decimotercera meditación! ¡Casi lo logras! 💎",
    "¡Decimocuarta meditación! ¡Una más para la meta! 🏆",
    "¡Decimoquinta meditación! ¡¡LO LOGRASTE!! 🎊🏅"
  ]
  
  return messages[Math.min(recordNumber - 1, messages.length - 1)]
}

const getMotivationalMessage = (recordNumber: number) => {
  const messages = [
    "Cada meditación es un paso hacia la paz interior",
    "Tu dedicación está transformando tu vida",
    "La consistencia es la clave del éxito",
    "Cada sesión fortalece tu mente y espíritu",
    "Estás creando un hábito que cambiará tu vida",
    "Tu progreso es inspirador",
    "La meditación es tu superpoder",
    "Cada respiración te acerca a la calma",
    "Tu bienestar mental es tu prioridad",
    "Estás construyendo un futuro más sereno",
    "Tu transformación interior es hermosa",
    "Eres un guerrero de la paz mental",
    "Tu dedicación es admirable",
    "Casi llegas a tu meta, ¡sigue así!",
    "¡Felicidades! Has completado tu meta de 15 meditaciones"
  ]
  
  return messages[Math.min(recordNumber - 1, messages.length - 1)]
}

export default function CelebrationModal({ open, onClose, recordNumber }: CelebrationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (open) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          overflow: 'visible',
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Samadhi mascot */}
        <Box
          sx={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            width: 120,
            height: 120,
            background: 'url("/samadhi-celebration.png") no-repeat center center',
            backgroundSize: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          }}
          className="celebration-mascot"
        />

        {/* Confeti animado */}
        {showConfetti && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {[...Array(20)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: 8,
                  height: 8,
                  background: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFD93D'][i % 5],
                  borderRadius: '50%',
                  animation: `confetti ${2 + Math.random() * 2}s linear infinite`,
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </Box>
        )}

        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Mascota */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
              animation: 'bounce 2s ease-in-out infinite',
            }}
          >
            <img
              src="/mascot.svg"
              alt="Mascota feliz"
              style={{
                width: 120,
                height: 120,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              }}
            />
          </Box>

          {/* Mensaje principal */}
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#2c3e50',
              mb: 2,
              animation: 'fadeInUp 0.8s ease-out',
            }}
          >
            {getCelebrationMessage(recordNumber)}
          </Typography>

          {/* Mensaje motivacional */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 3,
              fontStyle: 'italic',
              animation: 'fadeInUp 0.8s ease-out 0.2s both',
            }}
          >
            {getMotivationalMessage(recordNumber)}
          </Typography>

          {/* Iconos de celebración */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mb: 3,
              animation: 'fadeInUp 0.8s ease-out 0.4s both',
            }}
          >
            <Celebration sx={{ fontSize: 40, color: '#FFD93D' }} />
            <Star sx={{ fontSize: 40, color: '#FF6B6B' }} />
            <Favorite sx={{ fontSize: 40, color: '#4ECDC4' }} />
          </Box>

          {/* Botón de continuar */}
          <Button
            variant="contained"
            size="large"
            onClick={onClose}
            sx={{
              background: 'linear-gradient(45deg, #A8D5E2 30%, #7BC4D8 90%)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7BC4D8 30%, #A8D5E2 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease',
              animation: 'fadeInUp 0.8s ease-out 0.6s both',
            }}
          >
            ¡Continuar!
          </Button>
        </Paper>
      </DialogContent>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Dialog>
  )
}
