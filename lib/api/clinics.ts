export async function getAllClinics() {
  const res = await fetch('/api/clinics', { 
    cache: 'no-store' 
  })
  
  const data = await res.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to load clinics')
  }
  
  return data.data
}

export async function getClinicById(id: string | number) {
  const res = await fetch(`/api/clinics/${id}`, {
    cache: 'no-store'
  })
  
  const data = await res.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to load clinic')
  }
  
  return data.data
}