'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../contexts/AppContext'
import { useLoadingCursor } from '../hooks/useLoadingCursor'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import { Home, Dashboard, Assessment, Logout, Person } from '@mui/icons-material'
import Cookies from 'js-cookie'

export default function Navigation() {
  const router = useRouter()
  const { state, dispatch } = useApp()
  const { withLoadingCursor } = useLoadingCursor()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    Cookies.remove('auth-token')
    dispatch({ type: 'LOGOUT' })
    router.push('/')
    handleClose()
  }

  const handleNavigation = (path: string) => {
    withLoadingCursor(() => router.push(path))
    handleClose()
  }

  if (!state.isAuthenticated) {
    return null
  }

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(45deg, #A8D5E2 30%, #7BC4D8 90%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="home"
          onClick={() => withLoadingCursor(() => router.push('/'))}
          sx={{ mr: 2 }}
        >
          <Home />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              marginRight: 12,
              background: 'url("/samadhi-nav.png") no-repeat center center',
              backgroundSize: 'contain',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          />
          <Typography variant="h6" component="div">
            Meditation Mood Tracker
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            startIcon={<Dashboard />}
            onClick={() => withLoadingCursor(() => router.push('/dashboard'))}
          >
            Dashboard
          </Button>

          <Button 
            color="inherit" 
            startIcon={<Assessment />}
            onClick={() => withLoadingCursor(() => router.push('/dashboard/stats'))}
          >
            Estadísticas
          </Button>

          {state.user?.role === 'ADMIN' && (
            <Button 
              color="inherit" 
              onClick={() => withLoadingCursor(() => router.push('/admin'))}
            >
              Admin
            </Button>
          )}

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Person />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleNavigation('/dashboard')}>
              <Dashboard sx={{ mr: 1 }} />
              Dashboard
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/dashboard/stats')}>
              <Assessment sx={{ mr: 1 }} />
              Mis Estadísticas
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/feelings/new')}>
              Nuevo Registro
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
