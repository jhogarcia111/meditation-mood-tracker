'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import { Add, Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material'
import { Feeling } from '../../types'

interface FeelingsManagementProps {
  token: string
}

export default function FeelingsManagement({ token }: FeelingsManagementProps) {
  const [feelings, setFeelings] = useState<Feeling[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingFeeling, setEditingFeeling] = useState<Feeling | null>(null)
  const [formData, setFormData] = useState({
    nameEs: '',
    nameEn: '',
    category: 'GOOD' as 'GOOD' | 'BAD',
    isActive: true,
  })

  useEffect(() => {
    fetchFeelings()
  }, [])

  const fetchFeelings = async () => {
    try {
      const response = await fetch('/api/admin/feelings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setFeelings(data)
      } else {
        setError('Error al cargar los sentimientos')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (feeling?: Feeling) => {
    if (feeling) {
      setEditingFeeling(feeling)
      setFormData({
        nameEs: feeling.nameEs,
        nameEn: feeling.nameEn,
        category: feeling.category,
        isActive: feeling.isActive,
      })
    } else {
      setEditingFeeling(null)
      setFormData({
        nameEs: '',
        nameEn: '',
        category: 'GOOD',
        isActive: true,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingFeeling(null)
    setFormData({
      nameEs: '',
      nameEn: '',
      category: 'GOOD',
      isActive: true,
    })
  }

  const handleSubmit = async () => {
    try {
      const url = editingFeeling 
        ? `/api/admin/feelings/${editingFeeling.id}`
        : '/api/admin/feelings'
      
      const method = editingFeeling ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        handleCloseDialog()
        fetchFeelings()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al guardar el sentimiento')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este sentimiento?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/feelings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchFeelings()
      } else {
        setError('Error al eliminar el sentimiento')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleToggleActive = async (feeling: Feeling) => {
    try {
      const response = await fetch(`/api/admin/feelings/${feeling.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !feeling.isActive,
        }),
      })

      if (response.ok) {
        fetchFeelings()
      } else {
        setError('Error al actualizar el estado del sentimiento')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Gestión de Sentimientos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Sentimiento
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre (Español)</TableCell>
              <TableCell>Nombre (Inglés)</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feelings.map((feeling) => (
              <TableRow key={feeling.id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {feeling.nameEs}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {feeling.nameEn}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={feeling.category === 'GOOD' ? 'Bueno' : 'Malo'} 
                    size="small" 
                    color={feeling.category === 'GOOD' ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={feeling.isActive ? 'Activo' : 'Inactivo'} 
                    size="small" 
                    color={feeling.isActive ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Cambiar Estado">
                      <IconButton
                        size="small"
                        onClick={() => handleToggleActive(feeling)}
                        color={feeling.isActive ? 'error' : 'success'}
                      >
                        {feeling.isActive ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(feeling)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(feeling.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingFeeling ? 'Editar Sentimiento' : 'Nuevo Sentimiento'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre (Español)"
              value={formData.nameEs}
              onChange={(e) => setFormData({ ...formData, nameEs: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Nombre (Inglés)"
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              fullWidth
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'GOOD' | 'BAD' })}
                label="Categoría"
              >
                <MenuItem value="GOOD">Bueno</MenuItem>
                <MenuItem value="BAD">Malo</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Activo"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFeeling ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
