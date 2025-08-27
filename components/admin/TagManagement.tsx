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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
} from '@mui/material'
import { Add, Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material'
import { MeditationTag, CreateMeditationTagRequest } from '../../types'

interface TagManagementProps {
  token: string
}

export default function TagManagement({ token }: TagManagementProps) {
  const [tags, setTags] = useState<MeditationTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTag, setEditingTag] = useState<MeditationTag | null>(null)
  const [formData, setFormData] = useState<CreateMeditationTagRequest>({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/meditation-tags', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setTags(data)
      } else {
        setError('Error al cargar las etiquetas')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (tag?: MeditationTag) => {
    if (tag) {
      setEditingTag(tag)
      setFormData({
        name: tag.name,
        description: tag.description || '',
      })
    } else {
      setEditingTag(null)
      setFormData({
        name: '',
        description: '',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingTag(null)
    setFormData({
      name: '',
      description: '',
    })
  }

  const handleSubmit = async () => {
    try {
      const url = editingTag 
        ? `/api/admin/meditation-tags/${editingTag.id}`
        : '/api/admin/meditation-tags'
      
      const method = editingTag ? 'PUT' : 'POST'
      
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
        fetchTags()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al guardar la etiqueta')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta etiqueta?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/meditation-tags/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchTags()
      } else {
        setError('Error al eliminar la etiqueta')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleToggleActive = async (tag: MeditationTag) => {
    try {
      const response = await fetch(`/api/admin/meditation-tags/${tag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !tag.isActive,
        }),
      })

      if (response.ok) {
        fetchTags()
      } else {
        setError('Error al actualizar la etiqueta')
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
          Gestión de Etiquetas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Etiqueta
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
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Meditaciones</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {tag.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {tag.description || 'Sin descripción'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${tag.meditations?.length || 0} meditaciones`} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tag.isActive}
                        onChange={() => handleToggleActive(tag)}
                        color="primary"
                      />
                    }
                    label={tag.isActive ? 'Activa' : 'Inactiva'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(tag)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(tag.id)}
                        color="error"
                        disabled={(tag.meditations?.length || 0) > 0}
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
          {editingTag ? 'Editar Etiqueta' : 'Nueva Etiqueta'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Descripción (opcional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTag ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
