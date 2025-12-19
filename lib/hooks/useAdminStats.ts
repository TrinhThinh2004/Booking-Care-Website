"use client"
import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' })
  const json = await res.json()
  if (!json.success) throw new Error(json.message || 'Failed to load admin stats')
  return json.data
}

export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/stats', fetcher, {
    revalidateOnFocus: true,
  })

  return { data, error, isLoading, mutate }
}
