'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
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
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  Button,
} from '@mui/material'
import { Edit, Delete, Visibility, VisibilityOff, Block, CheckCircle } from '@mui/icons-material'
import { User } from '../../types'

interface UserManagementProps {
  token: string
}

interface UserWithStats extends User {
  totalRecords: number
  lastActivity?: Date
}

export default function UserManagement({ token }: UserManagementProps) {
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<UserWithStats | null>(null)
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    role: 'USER' as 'USER' | 'ADMIN',
    country: '',
    language: 'ES' as 'ES' | 'EN',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setError('Error al cargar los usuarios')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (user?: UserWithStats) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        userId: user.userId,
        email: user.email,
        role: user.role,
        country: user.country || '',
        language: user.language,
      })
    } else {
      setEditingUser(null)
      setFormData({
        userId: '',
        email: '',
        role: 'USER',
        country: '',
        language: 'ES',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUser(null)
    setFormData({
      userId: '',
      email: '',
      role: 'USER',
      country: '',
      language: 'ES',
    })
  }

  const handleSubmit = async () => {
    try {
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'
      
      const method = editingUser ? 'PUT' : 'POST'
      
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
        fetchUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al guardar el usuario')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchUsers()
      } else {
        setError('Error al eliminar el usuario')
      }
    } catch (error) {
      setError('Error de conexión')
    }
  }

  const handleToggleRole = async (user: UserWithStats) => {
    try {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: newRole,
        }),
      })

      if (response.ok) {
        fetchUsers()
      } else {
        setError('Error al actualizar el rol del usuario')
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
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          Nuevo Usuario
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
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>País</TableCell>
              <TableCell>Idioma</TableCell>
              <TableCell>Registros</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Fecha Registro</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {user.userId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.country || 'No especificado'} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.language === 'ES' ? 'Español' : 'English'} 
                    size="small" 
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${user.totalRecords} registros`} 
                    size="small" 
                    color="secondary"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.role === 'ADMIN' ? 'Administrador' : 'Usuario'} 
                    size="small" 
                    color={user.role === 'ADMIN' ? 'error' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Cambiar Rol">
                      <IconButton
                        size="small"
                        onClick={() => handleToggleRole(user)}
                        color={user.role === 'ADMIN' ? 'error' : 'success'}
                      >
                        {user.role === 'ADMIN' ? <Block /> : <CheckCircle />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(user)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(user.id)}
                        color="error"
                        disabled={user.role === 'ADMIN'}
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
          {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="ID de Usuario"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              fullWidth
              required
              disabled={!!editingUser}
            />
            
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            
            <TextField
              label="País (opcional)"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' })}
                label="Rol"
              >
                <MenuItem value="USER">Usuario</MenuItem>
                <MenuItem value="ADMIN">Administrador</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as 'ES' | 'EN' })}
                label="Idioma"
              >
                <MenuItem value="ES">Español</MenuItem>
                <MenuItem value="EN">English</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
