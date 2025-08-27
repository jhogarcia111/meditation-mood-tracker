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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import { Add, Edit, Delete, YouTube, Visibility, VisibilityOff } from '@mui/icons-material'
import { Meditation, MeditationTag, CreateMeditationRequest, UpdateMeditationRequest } from '../../types'

interface MeditationManagementProps {
  token: string
}

export default function MeditationManagement({ token }: MeditationManagementProps) {
  const [meditations, setMeditations] = useState<Meditation[]>([])
  const [tags, setTags] = useState<MeditationTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingMeditation, setEditingMeditation] = useState<Meditation | null>(null)
  const [formData, setFormData] = useState<CreateMeditationRequest>({
    title: '',
    description: '',
    youtubeUrl: '',
    duration: 10,
    tagIds: [],
  })

  useEffect(() => {
    fetchMeditations()
    fetchTags()
  }, [])

  const fetchMeditations = async () => {
    try {
      const response = await fetch('/api/admin/meditations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setMeditations(data)
      } else {
        setError('Error al cargar las meditaciones')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

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
      }
    } catch (error) {
      console.error('Error al cargar etiquetas:', error)
    }
  }

  const handleOpenDialog = (meditation?: Meditation) => {
    if (meditation) {
      setEditingMeditation(meditation)
      setFormData({
        title: meditation.title,
        description: meditation.description,
        youtubeUrl: meditation.youtubeUrl,
        duration: meditation.duration,
        tagIds: meditation.tags.map(tag => tag.id),
      })
    } else {
      setEditingMeditation(null)
      setFormData({
        title: '',
        description: '',
        youtubeUrl: '',
        duration: 10,
        tagIds: [],
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingMeditation(null)
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      duration: 10,
      tagIds: [],
    })
  }

  const handleSubmit = async () => {
    try {
      const url = editingMeditation 
        ? `/api/admin/meditations/${editingMeditation.id}`
        : '/api/admin/meditations'
      
      const method = editingMeditation ? 'PUT' : 'POST'
      
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
        fetchMeditations()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al guardar la meditación')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta meditación?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/meditations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchMeditations()
      } else {
        setError('Error al eliminar la meditación')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleToggleActive = async (meditation: Meditation) => {
    try {
      const response = await fetch(`/api/admin/meditations/${meditation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !meditation.isActive,
        }),
      })

      if (response.ok) {
        fetchMeditations()
      } else {
        setError('Error al actualizar la meditación')
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
          Gestión de Meditaciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Meditación
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
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Etiquetas</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meditations.map((meditation) => (
              <TableRow key={meditation.id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {meditation.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {meditation.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={`${meditation.duration} min`} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {meditation.tags.map((tag) => (
                      <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={meditation.isActive}
                        onChange={() => handleToggleActive(meditation)}
                        color="primary"
                      />
                    }
                    label={meditation.isActive ? 'Activa' : 'Inactiva'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Ver en YouTube">
                      <IconButton
                        size="small"
                        onClick={() => window.open(meditation.youtubeUrl, '_blank')}
                        color="primary"
                      >
                        <YouTube />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(meditation)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(meditation.id)}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMeditation ? 'Editar Meditación' : 'Nueva Meditación'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Título"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              required
            />
            
            <TextField
              label="URL de YouTube"
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              fullWidth
              required
              helperText="Ejemplo: https://www.youtube.com/watch?v=VIDEO_ID"
            />
            
            <TextField
              label="Duración (minutos)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              fullWidth
              required
              inputProps={{ min: 1, max: 180 }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Etiquetas</InputLabel>
              <Select
                multiple
                value={formData.tagIds}
                onChange={(e) => setFormData({ ...formData, tagIds: e.target.value as string[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const tag = tags.find(t => t.id === value)
                      return tag ? (
                        <Chip key={value} label={tag.name} size="small" />
                      ) : null
                    })}
                  </Box>
                )}
              >
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMeditation ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
