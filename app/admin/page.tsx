'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../contexts/AppContext'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material'
import { AdminPanelSettings, People, Analytics, Psychology, SelfImprovement, Label } from '@mui/icons-material'
import MeditationManagement from '../../components/admin/MeditationManagement'
import TagManagement from '../../components/admin/TagManagement'
import UserManagement from '../../components/admin/UserManagement'
import AnalyticsPanel from '../../components/admin/AnalyticsPanel'
import FeelingsManagement from '../../components/admin/FeelingsManagement'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminPage() {
  const { state } = useApp()
  const router = useRouter()
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [stats, setStats] = useState({
    activeFeelings: 0,
    meditations: 0,
    tags: 0,
    users: 0
  })

  useEffect(() => {
    // Obtener el token de las cookies
    const getToken = () => {
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
      if (authCookie) {
        const tokenValue = authCookie.split('=')[1]
        setToken(tokenValue)
        // Cargar estadísticas cuando tengamos el token
        if (tokenValue) {
          fetchStats(tokenValue)
        }
      }
    }
    getToken()
  }, [])

  const fetchStats = async (authToken: string) => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    }
  }

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (state.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [state.isAuthenticated, state.user?.role, router])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (!state.isAuthenticated) {
    return null
  }

  if (state.user?.role !== 'ADMIN') {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Acceso denegado. Solo los administradores pueden acceder a esta página.
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panel de Administración
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Gestiona sentimientos, usuarios y analíticas del sistema
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3 }}>
          <CardContent>
                         <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
               <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab 
                   icon={<Analytics />} 
                   label="Analíticas" 
                   iconPosition="start"
                 />
                 <Tab 
                   icon={<Psychology />} 
                   label="Sentimientos" 
                   iconPosition="start"
                 />
                 <Tab 
                   icon={<SelfImprovement />} 
                   label="Meditaciones" 
                   iconPosition="start"
                 />
                 <Tab 
                   icon={<Label />} 
                   label="Etiquetas" 
                   iconPosition="start"
                 />
                 <Tab 
                   icon={<People />} 
                   label="Usuarios" 
                   iconPosition="start"
                 />
               </Tabs>
             </Box>

                         <TabPanel value={tabValue} index={0}>
               {token && <AnalyticsPanel token={token} />}
             </TabPanel>
 
             <TabPanel value={tabValue} index={1}>
               {token && <FeelingsManagement token={token} />}
             </TabPanel>
 
             <TabPanel value={tabValue} index={2}>
               {token && <MeditationManagement token={token} />}
             </TabPanel>
 
             <TabPanel value={tabValue} index={3}>
               {token && <TagManagement token={token} />}
             </TabPanel>
 
             <TabPanel value={tabValue} index={4}>
               {token && <UserManagement token={token} />}
             </TabPanel>
          </CardContent>
        </Card>

                 <Grid container spacing={3}>
           <Grid item xs={12} md={3}>
             <Card>
               <CardContent sx={{ textAlign: 'center' }}>
                 <Psychology sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                 <Typography variant="h4" gutterBottom>
                   {stats.activeFeelings}
                 </Typography>
                 <Typography variant="h6" color="text.secondary">
                   Sentimientos Activos
                 </Typography>
               </CardContent>
             </Card>
           </Grid>

           <Grid item xs={12} md={3}>
             <Card>
               <CardContent sx={{ textAlign: 'center' }}>
                 <SelfImprovement sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                 <Typography variant="h4" gutterBottom>
                   {stats.meditations}
                 </Typography>
                 <Typography variant="h6" color="text.secondary">
                   Meditaciones
                 </Typography>
               </CardContent>
             </Card>
           </Grid>

           <Grid item xs={12} md={3}>
             <Card>
               <CardContent sx={{ textAlign: 'center' }}>
                 <Label sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                 <Typography variant="h4" gutterBottom>
                   {stats.tags}
                 </Typography>
                 <Typography variant="h6" color="text.secondary">
                   Etiquetas
                 </Typography>
               </CardContent>
             </Card>
           </Grid>

           <Grid item xs={12} md={3}>
             <Card>
               <CardContent sx={{ textAlign: 'center' }}>
                 <People sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                 <Typography variant="h4" gutterBottom>
                   {stats.users}
                 </Typography>
                 <Typography variant="h6" color="text.secondary">
                   Usuarios Registrados
                 </Typography>
               </CardContent>
             </Card>
           </Grid>
         </Grid>
      </Box>
    </Container>
  )
}
