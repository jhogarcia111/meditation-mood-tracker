import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { useLoadingCursor } from '../../hooks/useLoadingCursor'

interface LoadingButtonProps extends Omit<ButtonProps, 'onClick'> {
  onClick?: () => void | Promise<void>
  loadingDelay?: number
}

export default function LoadingButton({ 
  onClick, 
  loadingDelay = 500,
  children,
  ...props 
}: LoadingButtonProps) {
  const { withLoadingCursor } = useLoadingCursor()

  const handleClick = () => {
    if (onClick) {
      withLoadingCursor(async () => {
        await onClick()
      }, loadingDelay)
    }
  }

  return (
    <Button
      {...props}
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}
