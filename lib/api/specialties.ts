// Centralized API client for specialties
export async function getAllSpecialties() {
  const res = await fetch('/api/specialties', { cache: 'no-store' })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to load specialties')
  return data.data
}
