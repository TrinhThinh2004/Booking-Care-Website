'use client'
import useSWR from 'swr'
import { useMemo } from 'react'

interface UseDoctorsOptions {
  specialtyId?: number
  search?: string
  limit?: number
  page?: number
  clientSideFilter?: boolean
  userId?: number | null   
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
  createdAt?: string
  userId?: number
}

export function useDoctors(options: UseDoctorsOptions = {}) {

  const key = [
    '/api/doctors',
    options.userId ?? null,
    options.specialtyId ?? null,
    options.search ?? '',
    options.page ?? null,
    options.limit ?? null
  ]

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      const url = new URL(
        '/api/doctors',
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3000'
      )


      if (options.userId !== undefined && options.userId !== null) {
        url.searchParams.set('userId', String(options.userId))
      }

      const res = await fetch(url.toString(), { cache: 'no-store' })
      const json = await res.json()

      if (!json.success) throw new Error(json.message || 'Lỗi tải bác sĩ')

      const response = json.data

      if (Array.isArray(response)) {
        const normalized = response.map((plain: any) => {
          const userObj = plain.user || plain.User || {}
          const specialty = plain.specialty || plain.Specialty || null
          const clinic = plain.clinic || plain.Clinic || {}

          return {
            id: plain.id,
            firstName: userObj.firstName || plain.firstName || '',
            lastName: userObj.lastName || plain.lastName || '',
            name: `${(userObj.firstName || plain.firstName || '').trim()} ${(userObj.lastName || plain.lastName || '').trim()}`.trim(),
            email: userObj.email || plain.email || '',
            specialtyId: specialty?.id || plain.specialtyId || null,
            specialtyName: specialty?.name || plain.specialtyName || 'Chưa cập nhật',
            clinicId: clinic?.id || plain.clinicId || null,
            clinicName: clinic.name || plain.clinicName || '',
            userId: userObj.id || plain.userId || null,
            description: plain.description || '',
            image: plain.image || userObj.image || '',
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
    let list = all

    if (options.specialtyId) {
      list = list.filter(d => (d as any).specialtyId === options.specialtyId)
    }

    if (options.search) {
      const s = options.search.toLowerCase()
      list = list.filter(d => 
        (d.firstName || '').toLowerCase().includes(s) ||
        (d.lastName || '').toLowerCase().includes(s) ||
        (d.name || '').toLowerCase().includes(s) ||
        (d.specialtyName || '').toLowerCase().includes(s) ||
        (d.clinicName || '').toLowerCase().includes(s)
      )
    }

    if (options.page && options.limit) {
      const start = (options.page - 1) * options.limit
      const end = start + options.limit
      list = list.slice(start, end)
    }

    return list
  }, [data, options.search, options.specialtyId, options.page, options.limit])

  return {
    doctors: filtered,
    isLoading,
    error,
    mutate,
  }
}
