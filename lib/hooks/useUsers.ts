'use client'
import useSWR from 'swr'
import { getUsers } from '@/lib/api/users'
import { useMemo } from 'react'

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
  clientSideFilter?: boolean
}

export function useUsers(options: UseUsersOptions = {}) {
  const { data: rawData, error, isLoading, mutate } = useSWR(
    options.clientSideFilter ? '/api/users' : ['/api/users', options.role, options.search],
    async (url : URL) => {
      const response = await getUsers(
        options.clientSideFilter ? undefined : {
          role: options.role !== 'all' ? options.role : undefined,
          search: options.search || undefined
        }
      )
      return response
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  )

  const data = useMemo(() => {
    if (!options.clientSideFilter || !rawData?.users) {
      return rawData
    }

    let filteredUsers = rawData.users

    if (options.role && options.role !== 'all') {
      filteredUsers = filteredUsers.filter((user: User) => user.role === options.role)
    }
    if (options.search) {
      const searchLower = options.search.toLowerCase()
      filteredUsers = filteredUsers.filter((user: User) => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.includes(searchLower))
      )
    }

    return {
      ...rawData,
      users: filteredUsers
    }
  }, [rawData, options.clientSideFilter, options.role, options.search])

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}