interface DoctorData {
  name: string;
  specialtyId: number;
  clinicId?: number | null;
  description?: string;
  image?: File;
}

export async function getAllDoctors() {
  const res = await fetch('/api/doctors', { 
    cache: 'no-store'
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Lỗi khi tải danh sách bác sĩ')
  return data.data
}

export async function getDoctorsBySpecialtyId(specialtyId: number) {
  const res = await fetch('/api/doctors', { 
    cache: 'no-store'
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Lỗi khi tải danh sách bác sĩ')
  
  const doctors = data.data.filter((doctor: any) => doctor.specialtyId === specialtyId)
  return doctors
}

export async function getDoctorById(id: string | number) {
  const res = await fetch(`/api/doctors/${id}`, { 
    cache: 'no-store'
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Lỗi khi tải thông tin bác sĩ')
  return data.data
}

export async function createDoctor(formData: FormData) {
  const res = await fetch('/api/doctors', {
    method: 'POST',
    body: formData
  });

  const responseData = await res.json();
  if (!responseData.success) {
    throw new Error(responseData.message || 'Có lỗi xảy ra khi tạo bác sĩ');
  }

  return responseData.data;
}

export async function updateDoctor(id: number, formData: FormData) {
  const res = await fetch(`/api/doctors/${id}`, {
    method: 'PUT',
    body: formData
  });

  const responseData = await res.json();
  if (!responseData.success) {
    throw new Error(responseData.message || 'Có lỗi xảy ra khi cập nhật bác sĩ');
  }

  return responseData.data;
}