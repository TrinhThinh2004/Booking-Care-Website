'use client'

import DoctorLayout from '@/app/(doctor)/doctor/DoctorLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth/authStore'
import { useDoctors } from '../../../../../lib/hooks/useDoctors'

interface TimeSlot {
  id: string
  time: string
  isAvailable: boolean
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '08:00 - 09:00', isAvailable: false },
  { id: '2', time: '09:00 - 10:00', isAvailable: false },
  { id: '3', time: '10:00 - 11:00', isAvailable: false },
  { id: '4', time: '11:00 - 12:00', isAvailable: false },
  { id: '5', time: '13:00 - 14:00', isAvailable: false },
  { id: '6', time: '14:00 - 15:00', isAvailable: false },
  { id: '7', time: '15:00 - 16:00', isAvailable: false },
  { id: '8', time: '16:00 - 17:00', isAvailable: false },
]

export default function DoctorSchedule() {
  const {doctors} = useDoctors()
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)


  useEffect(() => {
    if (!doctors) return
    
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors?doctorId=${doctors[0].id}`)
        const data = await res.json()

        if (data.data && data.data.length > 0) {
          setDoctorId(String(data.data[0].id))
          setError(null)
        } else {
          setDoctorId(null)
          setError('Hồ sơ bác sĩ chưa được tạo. Vui lòng liên hệ admin.')
        }
      } catch (err) {
        console.error('Error fetching doctor:', err)
        setError('Lỗi khi tải thông tin bác sĩ')
      }
    }

    fetchDoctor()
  }, [doctors])

  // Lấy lịch làm việc theo doctorId và selectedDate
  useEffect(() => {
    if (!doctorId) return

    const fetchSchedule = async () => {
      setLoading(true)
      try {
        const dateStr = selectedDate.toISOString().split('T')[0]
        const res = await fetch(`/api/doctors/${doctorId}/schedule?date=${dateStr}`)
        const data = await res.json()
        setTimeSlots(data.timeSlots?.length ? data.timeSlots : DEFAULT_TIME_SLOTS)
        setError(null)
      } catch (err) {
        console.error('Error fetching schedule:', err)
        setError('Lỗi khi tải lịch làm việc')
        setTimeSlots(DEFAULT_TIME_SLOTS)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [doctorId, selectedDate])

  const handleToggleTimeSlot = (id: string) => {
    setTimeSlots(slots =>
      slots.map(slot =>
        slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    )
  }

  const handleSaveSchedule = async () => {
    if (!doctorId) {
      setError('Không thể xác định thông tin bác sĩ')
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const res = await fetch(`/api/doctors/${doctorId}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, timeSlots }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Lỗi khi lưu lịch')
      }

      setSuccessMessage(`Lịch làm việc ngày ${dateStr} đã được lưu thành công`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Error saving schedule:', err)
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu lịch')
    } finally {
      setSaving(false)
    }
  }

  if (!doctorId) {
    return (
      <DoctorLayout title="Quản lý lịch làm việc">
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800">{error || 'Đang xác thực thông tin...'}</p>
        </Card>
      </DoctorLayout>
    )
  }

  return (
    <DoctorLayout title="Quản lý lịch làm việc">
      <Card className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày</label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-full max-w-xs px-3 py-2 border rounded-md"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Chọn giờ khám</h3>
          {loading ? (
            <p className="text-gray-500">Đang tải lịch làm việc...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => handleToggleTimeSlot(slot.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    slot.isAvailable
                      ? 'bg-[#92D7EE] text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-[#F7D800]'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSaveSchedule}
          disabled={saving || loading}
          variant="ghost"
          className="bg-gray-200 disabled:opacity-50"
        >
          {saving ? 'Đang lưu...' : 'Lưu lịch làm việc'}
        </Button>
      </Card>
    </DoctorLayout>
  )
}
