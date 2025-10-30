'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from './authStore'
import { Loader2 } from 'lucide-react' 

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { verifyAuth } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      try {
        await verifyAuth()
      } catch (e) {
      } finally {
        setIsInitialized(true)
      }
    }
    initialize()
  }, [verifyAuth]) 

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}