'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/database'
import { RegisterRequest, ApiResponse, LoginResponse } from '@/types/api'
import { apiLogin, apiRegister, apiVerify } from '@/utils/api/auth'

interface VerifyResponse { user: User }

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  verifyAuth: () => Promise<void> 
  updateProfile: (data: Partial<User>) => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const result: ApiResponse<LoginResponse> = await apiLogin(email, password)
          const { user, token } = result.data!
          set({ user, token, isAuthenticated: true, isLoading: false, error: null })
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: error instanceof Error ? error.message : 'Đăng nhập thất bại' })
          throw error
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null })
        try {
          const result: ApiResponse<LoginResponse> = await apiRegister(data)
          const { user, token } = result.data!
          set({ user, token, isAuthenticated: true, isLoading: false, error: null })
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: error instanceof Error ? error.message : 'Đăng ký thất bại' })
          throw error
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null })
      },


      verifyAuth: async () => {
        const { token } = get() 
        if (!token) {
          set({ isAuthenticated: false }) 
          return
        }
        set({ isLoading: true })
        try {
          const result: ApiResponse<VerifyResponse> = await apiVerify(token)
          const { user } = result.data!
          set({ user, isAuthenticated: true, isLoading: false, error: null })
        } catch (error) {
          get().logout() 
          set({ isLoading: false }) 
        }
      },
      
      updateProfile: (data: Partial<User>) => {
        const { user } = get()
        if (user) set({ user: { ...user, ...data } })
      },
      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage', 
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)