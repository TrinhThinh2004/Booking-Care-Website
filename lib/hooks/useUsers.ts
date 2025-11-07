'use client'
import useSWR from 'swr'
import { getUsers } from '@/lib/api/users'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  role: string
  isActive: boolean
  createdAt: string
}

interface UseUsersOptions {
  role?: string
  search?: string
}

export function useUsers(options: UseUsersOptions = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    // Include search/filter params in the cache key
    ['/api/users', options.role, options.search],
    async ([url]) => {
      // Pass options to getUsers for server-side filtering
      const response = await getUsers({
        role: options.role !== 'all' ? options.role : undefined,
        search: options.search || undefined
      })
      return response
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  )

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}