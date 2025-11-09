'use client'
import useSWR from 'swr'
import { getAllClinics } from '@/lib/api/clinics'

const fetcher = () => getAllClinics()

export function useClinics() {
  const { data, error, isLoading, mutate } = useSWR('/api/clinics', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  })

  // Transform the data to match the API response structure
  const formattedData = data ? {
    clinics: data.clinics
  } : null

  return { data: formattedData, error, isLoading, mutate }
}