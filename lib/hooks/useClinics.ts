'use client'
import useSWR from 'swr'
import { getAllClinics } from '@/lib/api/clinics'
import { createClinic, updateClinic, deleteClinic } from '@/lib/api/clinics'

const fetcher = () => getAllClinics()

export function useClinics() {
  const { data, error, isLoading, mutate } = useSWR('/api/clinics', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  })


  const formattedData = data ? {
    clinics: data.clinics
  } : null

  const create = async (payload: any) => {
    const res = await createClinic(payload)
    await mutate()
    return res
  }

  const update = async (id: string | number, payload: any) => {
    const res = await updateClinic(id, payload)
    await mutate()
    return res
  }

  const remove = async (id: string | number) => {
    const res = await deleteClinic(id)
    await mutate()
    return res
  }

  return { data: formattedData, error, isLoading, mutate, create, update, remove }
}