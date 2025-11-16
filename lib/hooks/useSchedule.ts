'use client'
import useSWR from 'swr'
import { getSchedule } from '@/lib/api/schedules'

export function useSchedule(doctorId: string | null | undefined, date: string | null | undefined) {
  const key = doctorId && date ? [`/api/doctors/${doctorId}/schedule`, doctorId, date] : null

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      if (!doctorId || !date) return { date, timeSlots: [] }
      const res = await getSchedule(doctorId, date)
      return res
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  )

  return {
    schedule: data || null,
    rawTimeSlots: data?.timeSlots || [],
    isLoading,
    error,
    mutate,
  }
}
