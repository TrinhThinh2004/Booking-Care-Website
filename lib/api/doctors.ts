export async function getAllDoctors() {
  const res = await fetch('/api/doctors', { 
    cache: 'no-store'
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to load doctors')
  return data.data
}

export async function getDoctorsBySpecialtyId(specialtyId: number) {
  const res = await fetch('/api/doctors', { 
    cache: 'no-store'
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to load doctors')
  
  const doctors = data.data.filter((doctor: any) => doctor.specialtyId === specialtyId)
  return doctors
}

export async function getDoctorById(id: string) {
  const res = await fetch(`/api/doctors/${id}`, { 
    cache: 'no-store'
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to load doctor')
  return data.data
}