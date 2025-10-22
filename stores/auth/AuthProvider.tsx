'use client'

import { useEffect } from 'react'
import { useAuthStore } from './authStore'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { token, isAuthenticated, setLoading } = useAuthStore()

  useEffect(() => {
    // Verify token on app load
    const verifyToken = async () => {
      if (token && isAuthenticated) {
        setLoading(true)
        try {
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            // Token is invalid, logout user
            useAuthStore.getState().logout()
          }
        } catch (error) {
          console.error('Token verification failed:', error)
          useAuthStore.getState().logout()
        } finally {
          setLoading(false)
        }
      }
    }

    verifyToken()
  }, [token, isAuthenticated, setLoading])

  return <>{children}</>
}
