'use client'
import useSWR from 'swr'
import { getAllDoctors} from '@/lib/api/doctors'
import { useMemo } from 'react'


interface UseDoctorsOptions {
  specialtyId?: number
  search?: string
  limit?: number
  page?: number
  // when true, fetch full list once and apply search/pagination client-side
  clientSideFilter?: boolean
}
export interface Doctor {
  id: number
  firstName?: string
  lastName?: string
  name: string
  email?: string
  specialtyName?: string
  clinicName?: string
  image?: string
  isActive?: boolean
  yearsOfExperience?: number
  // normalized alias for some older code that expects `yearOfExperience`
  yearOfExperience?: number
  createdAt?: string
}

export function useDoctors(options: UseDoctorsOptions = {}) {
  // stable key when using client-side filtering to avoid refetch on every keystroke
  const key = options.clientSideFilter ? '/api/doctors' : ['/api/doctors', options.specialtyId, options.search, options.page, options.limit]

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      const response = await getAllDoctors()
      if (Array.isArray(response)) {
        const normalized = response.map((d: any) => {
          const plain = d
          const user = plain.user || plain.User || {}
          const specialty = plain.specialty || plain.Specialty || null
          const clinic = plain.clinic || plain.Clinic || {}

          return {
            id: plain.id,
            firstName: user.firstName || plain.firstName || '',
            lastName: user.lastName || plain.lastName || '',
            name: `${(user.firstName || plain.firstName || '').trim()} ${(user.lastName || plain.lastName || '').trim()}`.trim(),
            email: user.email || plain.email || '',
            specialtyName: specialty?.name || plain.specialtyName || 'Chưa cập nhật',
            clinicName: clinic.name || plain.clinicName || '',
            image: plain.image || user.image || '',
            isActive: plain.isActive ?? true,
            yearsOfExperience: plain.yearsOfExperience ?? plain.yearOfExperience ?? 0,
            createdAt: plain.createdAt,
          }
        })
        return { doctors: normalized }
      }
      if (response?.doctors) return { doctors: response.doctors }
      if (response?.data && Array.isArray(response.data)) return { doctors: response.data }
      return { doctors: [] }
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  )

  const filtered = useMemo(() => {
    const all = (data?.doctors as Doctor[]) || []
    if (!options.clientSideFilter) return all

    let list = all

    if (options.specialtyId) {
      list = list.filter(d => (d as any).specialtyId === options.specialtyId)
    }

    if (options.search) {
      const s = options.search.toLowerCase()
      list = list.filter(d => (
        (d.firstName || '').toLowerCase().includes(s) ||
        (d.lastName || '').toLowerCase().includes(s) ||
        (d.name || '').toLowerCase().includes(s) ||
        (d.specialtyName || '').toLowerCase().includes(s) ||
        (d.clinicName || '').toLowerCase().includes(s)
      ))
    }

    if (options.page && options.limit) {
      const start = (options.page - 1) * options.limit
      const end = start + options.limit
      list = list.slice(start, end)
    }

    return list
  }, [data?.doctors, options.clientSideFilter, options.search, options.specialtyId, options.page, options.limit])

  return {
    doctors: options.clientSideFilter ? filtered : ((data?.doctors as Doctor[]) || []),
    isLoading,
    error,
    mutate,
  }
}