'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
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

interface AnalyticsPanelProps {
  token: string
}

interface ActivityData {
  date: string
  totalActivities: number
  userActivities: { [key: string]: number }
}

interface FeelingChangeData {
  feelingName: string
  averageBefore: number
  averageAfter: number
  averageChange: number
}

interface AnalyticsData {
  totalUsers: number
  totalRecords: number
  totalFeelings: number
  activeFeelings: number
  usersByCountry: { [key: string]: number }
  usersByLanguage: { [key: string]: number }
  recordsByMonth: { [key: string]: number }
  recentActivity: ActivityData[]
  feelingChanges: FeelingChangeData[]
  userRegistrations: { date: string; registrations: number }[]
}

export default function AnalyticsPanel({ token }: AnalyticsPanelProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        setError('Error al cargar las analíticas')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!analytics) {
    return (
      <Alert severity="info">
        No hay datos de analíticas disponibles
      </Alert>
    )
  }

  // Preparar datos para las gráficas
  const activityChartData = analytics.recentActivity.map(item => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    }),
    total: item.totalActivities,
    ...item.userActivities
  }))

  const feelingChartData = analytics.feelingChanges.map(item => ({
    feeling: item.feelingName,
    antes: item.averageBefore,
    después: item.averageAfter,
    cambio: item.averageChange,
  }))

  const userRegistrationsData = analytics.userRegistrations.map(item => ({
    date: new Date(item.date).toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    }),
    registrations: item.registrations,
  }))

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Analíticas Globales
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Período</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Período"
          >
            <MenuItem value="7d">Últimos 7 días</MenuItem>
            <MenuItem value="30d">Últimos 30 días</MenuItem>
            <MenuItem value="90d">Últimos 90 días</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Estadísticas Generales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {analytics.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Usuarios Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" gutterBottom>
                {analytics.totalRecords}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registros Totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                {analytics.activeFeelings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sentimientos Activos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                {Object.keys(analytics.usersByCountry).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Países
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficas en Grid de 2 columnas */}
      <Grid container spacing={3}>
        {/* Gráfica 1: Actividades por Día */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Actividades Realizadas por Día
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#2196F3" 
                  strokeWidth={2}
                  name="Total Actividades"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfica 2: Usuarios Registrados por Día */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Usuarios Registrados por Día
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userRegistrationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="registrations" 
                  stroke="#4CAF50" 
                  strokeWidth={2}
                  name="Nuevos Usuarios"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfica 3: Actividades por Usuario */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Actividades por Usuario
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(analytics.recentActivity[0]?.userActivities || {}).map((userId, index) => (
                  <Line
                    key={userId}
                    type="monotone"
                    dataKey={userId}
                    stroke={`hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth={2}
                    name={`Usuario ${userId}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfica 4: Cambio Promedio de Sentimientos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Promedio de Cambio en Sentimientos
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feelingChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feeling" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="antes" fill="#FF6B6B" name="Antes de Meditación" />
                <Bar dataKey="después" fill="#4ECDC4" name="Después de Meditación" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
