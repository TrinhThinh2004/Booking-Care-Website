'use client'

import DoctorLayout from '@/app/(doctor)/doctor/DoctorLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { useSchedule } from '@/lib/hooks/useSchedule'
import { updateSchedule } from '@/lib/api/schedules'
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

export default function DoctorSchedule({ params }: { params: Promise<{ id: string }> | { id?: string } }) {
  const { user } = useAuthStore()
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Robust init: params -> user.doctorId -> lookup by userId
  useEffect(() => {
    let mounted = true
    const init = async () => {
      try {
        // 1) try params (supports either awaited promise or plain object)
        let idFromParams: string | undefined
        try {
          const p = await (params as any)
          idFromParams = p?.id
        } catch {
          // params wasn't a promise, try direct
          idFromParams = (params as any)?.id
        }
        if (idFromParams) {
          if (mounted) setDoctorId(String(idFromParams))
          return
        }

        // 2) try auth store doctorId
        if (user?.doctorId) {
          if (mounted) setDoctorId(String(user.doctorId))
          return
        }

        // 3) fallback: query API by userId
        if (user?.id) {
          const res = await fetch(`/api/doctors?userId=${user.id}`)
          const data = await res.json().catch(() => null)
          if (data?.data && data.data.length > 0) {
            if (mounted) setDoctorId(String(data.data[0].id))
            return
          } else {
            if (mounted) setError('Hồ sơ bác sĩ chưa được tạo. Vui lòng liên hệ admin.')
          }
        } else {
          if (mounted) setError('Không xác định user. Vui lòng đăng nhập lại.')
        }
      } catch (err) {
        console.error('Init doctorId error', err)
        if (mounted) setError('Lỗi khi xác định bác sĩ')
      }
    }
    init()
    return () => { mounted = false }
  }, [params, user])

  const dateStr = selectedDate.toISOString().split('T')[0]
  const { rawTimeSlots, isLoading, mutate } = useSchedule(doctorId, dateStr)

  useEffect(() => {
    if (!doctorId) return
    if (rawTimeSlots?.length > 0) {
      const merged = DEFAULT_TIME_SLOTS.map(def => {
        const match = rawTimeSlots.find((s: any) => String(s.id) === String(def.id))
        return match ? { ...def, isAvailable: Boolean(match.isAvailable) } : def
      })
      setTimeSlots(merged)
    } else {
      setTimeSlots(DEFAULT_TIME_SLOTS)
    }
  }, [rawTimeSlots, doctorId])

  const handleToggleTimeSlot = (id: string | number) => {
    setTimeSlots(slots =>
      slots.map(slot =>
        String(slot.id) === String(id) ? { ...slot, isAvailable: !slot.isAvailable } : slot
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
    try {
      const payload = {
        date: dateStr,
        timeSlots: timeSlots.map(s => ({ id: s.id, isAvailable: s.isAvailable })),
      }
      const updated = await updateSchedule(doctorId, payload)

      if (updated?.timeSlots) {
        setTimeSlots(updated.timeSlots)
      }

      // update SWR cache if available
      if (mutate) {
        await mutate(
          (current: any) => ({ ...(current || {}), timeSlots: timeSlots.map(t => ({ ...t })) }),
          false
        )
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

  return (
    <DoctorLayout title="Quản lý lịch làm việc">
      <Card className="p-6">
        {error && <div className="mb-4 text-red-700">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm">Chọn ngày</label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            min={new Date().toISOString().split('T')[0]}
            className="mt-2"
          />
        </div>

        <div>
          {isLoading ? <p>Đang tải...</p> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeSlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => handleToggleTimeSlot(slot.id)}
                  className={slot.isAvailable ? 'bg-blue-300' : 'bg-gray-100'}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button onClick={handleSaveSchedule} disabled={saving || isLoading}>
            {saving ? 'Đang lưu...' : 'Lưu lịch làm việc'}
          </Button>
        </div>
      </Card>
    </DoctorLayout>
  )
}