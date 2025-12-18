'use client'

import DoctorLayout from '@/app/(doctor)/doctor/DoctorLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useEffect, useState, useMemo } from 'react' 
import { useSchedule } from '@/lib/hooks/useSchedule'
import { updateSchedule } from '@/lib/api/schedules'
import { Loader2 } from 'lucide-react'
import { useDoctors } from '@/lib/hooks/useDoctors'

import { useAuthStore } from '@/stores/auth/authStore'

interface TimeSlot {
  id: string
  time: string
  isAvailable: boolean
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '06:00 - 09:00', isAvailable: false },
  { id: '2', time: '09:00 - 10:00', isAvailable: false },
  { id: '3', time: '10:00 - 11:00', isAvailable: false },
  { id: '4', time: '11:00 - 12:00', isAvailable: false },
  { id: '5', time: '13:00 - 14:00', isAvailable: false },
  { id: '6', time: '14:00 - 15:00', isAvailable: false },
  { id: '7', time: '15:00 - 16:00', isAvailable: false },
  { id: '8', time: '16:00 - 17:00', isAvailable: false },
]

export default function DoctorSchedule() {

  const { user } = useAuthStore()
  const { doctors, isLoading: isLoadingDoctor } = useDoctors()

  const doctorId = useMemo(() => {
    if (!user || !doctors) return null
    
    if (user.doctorId) return String(user.doctorId)

    const currentDoc = doctors.find((d: any) => Number(d.userId) === Number(user.id))
    return currentDoc ? String(currentDoc.id) : null
  }, [user, doctors])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const dateStr = selectedDate.toISOString().split('T')[0]


  const { rawTimeSlots, isLoading: isLoadingSchedule, mutate } = useSchedule(doctorId, dateStr)

  useEffect(() => {
    if (rawTimeSlots && rawTimeSlots.length > 0) {
      const merged = DEFAULT_TIME_SLOTS.map(def => {
        const match = rawTimeSlots.find((s: any) => String(s.id) === String(def.id))
        return match ? { ...def, isAvailable: Boolean(match.isAvailable) } : def
      })
      setTimeSlots(merged)
    } else {
      setTimeSlots(DEFAULT_TIME_SLOTS)
    }
  }, [rawTimeSlots])

  const handleToggleTimeSlot = (slotId: string | number) => {
    setTimeSlots(slots =>
      slots.map(slot =>
        String(slot.id) === String(slotId) ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    )
  }

  const handleSaveSchedule = async () => {
    if (!doctorId) {
      setError('Không tìm thấy thông tin bác sĩ')
      return
    }

    setSaving(true)
    setError(null)
    try {
      const payload = {
        date: dateStr,
        timeSlots: timeSlots.map(s => ({ id: s.id, time: s.time, isAvailable: s.isAvailable })),

      }
      const updated = await updateSchedule(doctorId, payload)

      if (updated?.timeSlots) {
        const merged = DEFAULT_TIME_SLOTS.map(def => {
          const match = updated.timeSlots.find((s: any) => String(s.id) === String(def.id))
          return match ? { ...def, isAvailable: Boolean(match.isAvailable) } : def
        })
        setTimeSlots(merged)

        if (mutate) await mutate(updated, false)
      }

      setSuccessMessage(`Lịch làm việc ngày ${dateStr} đã được lưu`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      console.error('Save schedule error', err)
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu lịch')
    } finally {
      setSaving(false)
    }
  }

  if (isLoadingDoctor && !doctorId) {
    return (
      <DoctorLayout title="Quản lý lịch làm việc">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Đang tải thông tin bác sĩ...</span>
        </div>
      </DoctorLayout>
    )
  }

  return (
    <DoctorLayout title="Quản lý lịch làm việc">
      <Card className="p-6">
        {!doctorId && !isLoadingDoctor && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
            Tài khoản này chưa được liên kết hồ sơ bác sĩ.
          </div>
        )}

        {error && <div className="mb-4 p-2 bg-red-50 text-red-700 rounded">{error}</div>}
        {successMessage && <div className="mb-4 p-2 bg-green-50 text-green-700 rounded">{successMessage}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Chọn ngày</label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#92D7EE]"
          />
        </div>

        <div>
          {isLoadingSchedule ? (
            <p className="text-gray-500 py-4 text-center">Đang tải dữ liệu lịch...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => doctorId && handleToggleTimeSlot(slot.id)}
                  disabled={!doctorId}
                  className={`
                    py-2 px-4 rounded transition-colors font-medium text-sm
                    ${slot.isAvailable 
                      ? 'bg-[#92D7EE] text-gray-900 hover:bg-[#7bcce8]' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                    ${!doctorId ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 border-t pt-4">
          <Button onClick={handleSaveSchedule} disabled={saving || isLoadingSchedule || !doctorId}>
            {saving ? 'Đang lưu...' : 'Lưu lịch làm việc'}
          </Button>
        </div>
      </Card>
    </DoctorLayout>
  )
}