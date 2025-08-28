'use client'

import React from 'react'
import { Box, Select, MenuItem, FormControl } from '@mui/material'
import { useApp } from '@/contexts/AppContext'
import { Language } from '@/lib/i18n'

export default function LanguageSelector() {
  const { state, dispatch } = useApp()

  const handleLanguageChange = (event: any) => {
    const newLanguage = event.target.value as Language
    dispatch({ type: 'SET_LANGUAGE', payload: newLanguage })
    localStorage.setItem('language', newLanguage)
  }

  // No renderizar hasta que el estado esté listo
  if (!state.language) {
    return null
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        <Select
          value={state.language}
          onChange={handleLanguageChange}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            '& .MuiSelect-select': {
              py: 1,
              px: 2,
              fontSize: '0.875rem',
              color: '#333',
              fontWeight: 500,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.2)',
              borderWidth: 1,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.4)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#7BC4D8',
              borderWidth: 2,
            },
            '& .MuiSvgIcon-root': {
              color: '#333',
            },
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <MenuItem value="ES" sx={{ color: '#333', fontWeight: 500 }}>🇪🇸 Español</MenuItem>
          <MenuItem value="EN" sx={{ color: '#333', fontWeight: 500 }}>🇺🇸 English</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
