import { useCallback } from 'react'

export const useLoadingCursor = () => {
  const setLoadingCursor = useCallback(() => {
    document.body.classList.add('loading-cursor')
  }, [])

  const removeLoadingCursor = useCallback(() => {
    document.body.classList.remove('loading-cursor')
  }, [])

  const withLoadingCursor = useCallback(async <T>(
    asyncFunction: () => Promise<T> | T,
    delay: number = 500 // Delay mínimo para mostrar el cursor
  ): Promise<T> => {
    setLoadingCursor()
    
    const startTime = Date.now()
    
    try {
      const result = await Promise.resolve(asyncFunction())
      
      // Asegurar que el cursor se muestre por al menos el delay especificado
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < delay) {
        await new Promise(resolve => setTimeout(resolve, delay - elapsedTime))
      }
      
      return result
    } finally {
      removeLoadingCursor()
    }
  }, [setLoadingCursor, removeLoadingCursor])

  return {
    setLoadingCursor,
    removeLoadingCursor,
    withLoadingCursor
  }
}
