interface ScheduleResponse {
  date: string
  timeSlots: any[]
}

export async function getSchedule(doctorId: string | number, date: string): Promise<ScheduleResponse> {
  const res = await fetch(`/api/doctors/${doctorId}/schedule?date=${date}`, { cache: 'no-store' })
  const data = await res.json()

  if (data && typeof data === 'object') {
    if ((data as any).success && (data as any).data) {
      return (data as any).data
    }

    if ('timeSlots' in data || 'date' in data) {
      return data as ScheduleResponse
    }
  }

  throw new Error('Invalid schedule response')
}

export async function updateSchedule(doctorId: string | number, payload: { date: string; timeSlots: any[] }) {
  const res = await fetch(`/api/doctors/${doctorId}/schedule`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })
  const data = await res.json()

  if (!res.ok) {
    // try to extract message
    const msg = (data && data.message) || (data && data.error) || 'Lỗi khi cập nhật lịch'
    throw new Error(msg)
  }

  if (data && data.success && data.data) return data.data
  if (data && (data.timeSlots || data.date)) return data

  throw new Error('Invalid schedule update response')
}
