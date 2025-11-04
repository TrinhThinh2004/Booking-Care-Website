'use client'
import useSWR from 'swr'
import { getAllSpecialties } from '@/lib/api/specialties'

const fetcher = () => getAllSpecialties()

export function useSpecialties(initialData?: any) {
  const { data, error, isLoading, mutate } = useSWR('/api/specialties', fetcher, {
    fallbackData: initialData,
  })
  return { data, error, isLoading, mutate }
}
