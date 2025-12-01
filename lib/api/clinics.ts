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

export async function createClinic(payload: any) {
  let res
  // if payload is FormData (file upload), send to multer endpoint
  if (payload instanceof FormData) {
    res = await fetch('/api/multer/clinics', {
      method: 'POST',
      body: payload
    })
  } else {
    res = await fetch('/api/clinics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to create clinic')
  return data.data
}

export async function updateClinic(id: string | number, payload: any) {
  let res
  if (payload instanceof FormData) {
    res = await fetch(`/api/multer/clinics/${id}`, {
      method: 'PUT',
      body: payload
    })
  } else {
    res = await fetch(`/api/clinics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  }
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to update clinic')
  return data.data
}

export async function deleteClinic(id: string | number) {
  const res = await fetch(`/api/clinics/${id}`, { method: 'DELETE' })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to delete clinic')
  return data
}