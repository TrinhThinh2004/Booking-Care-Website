// Centralized API client for specialties
export async function getAllSpecialties() {
  const res = await fetch('/api/specialties', { cache: 'no-store' })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to load specialties')
  return data.data
}

export async function createSpecialty(formData: FormData) {
  const res = await fetch('/api/multer/specialties', {
    method: 'POST',
    body: formData,
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to create specialty')
  return data.data
}

export async function updateSpecialty(id: number, formData: FormData) {
  const res = await fetch(`/api/multer/specialties/${id}`, {
    method: 'PUT',
    body: formData,
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to update specialty')
  return data.data
}

export async function deleteSpecialty(id: number) {
  const res = await fetch(`/api/specialties/${id}`, {
    method: 'DELETE',
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to delete specialty')
  return data
}

export async function getSpecialtyById(id: string) {
  const res = await fetch(`/api/specialties/${id}`, {
    cache: 'no-store'
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to load specialty')
  return data.data
}