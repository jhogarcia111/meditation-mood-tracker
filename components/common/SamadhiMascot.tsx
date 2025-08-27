import React from 'react'
import { Box, BoxProps } from '@mui/material'

export type SamadhiPose = 
  | 'celebration'    // Celebración con cymbals y confeti
  | 'meditation'     // Meditación serena con aura
  | 'welcome'        // Saludo amigable
  | 'hero'           // Pose principal para landing
  | 'form'           // Para formularios
  | 'nav'            // Para navegación

interface SamadhiMascotProps extends Omit<BoxProps, 'sx'> {
  pose: SamadhiPose
  size?: number
  animated?: boolean
  className?: string
}

const poseImages = {
  celebration: '/samadhi-celebration.png',
  meditation: '/samadhi-meditation.png',
  welcome: '/samadhi-welcome.png',
  hero: '/samadhi-hero.png',
  form: '/samadhi-form.png',
  nav: '/samadhi-nav.png'
}

const poseAnimations = {
  celebration: 'celebration-mascot',
  meditation: 'meditation-mascot',
  welcome: 'welcome-mascot',
  hero: 'hero-mascot',
  form: 'form-mascot',
  nav: 'nav-mascot'
}

export default function SamadhiMascot({ 
  pose, 
  size = 60, 
  animated = false,
  className,
  ...props 
}: SamadhiMascotProps) {
  const imageUrl = poseImages[pose]
  const animationClass = animated ? poseAnimations[pose] : ''

  return (
    <Box
      sx={{
        width: size,
        height: size,
        background: `url("${imageUrl}") no-repeat center center`,
        backgroundSize: 'contain',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
        transition: 'all 0.3s ease-in-out',
        '&:hover': animated ? {
          transform: 'scale(1.05)',
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
        } : {},
      }}
      className={`${animationClass} ${className || ''}`}
      {...props}
    />
  )
}
