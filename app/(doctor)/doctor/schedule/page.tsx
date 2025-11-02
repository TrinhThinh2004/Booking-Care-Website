'use client'

import DoctorLayout from '@/app/(doctor)/doctor/DoctorLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS)

  const handleToggleTimeSlot = (id: string) => {
    setTimeSlots(slots =>
      slots.map(slot =>
        slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
      )
    )
  }

  const handleSaveSchedule = () => {
    console.log('Saving schedule:', {
      date: selectedDate,
      timeSlots: timeSlots.filter(slot => slot.isAvailable)
    })
  }

  return (
    <DoctorLayout title="Quản lý lịch làm việc">
      <Card className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ngày
          </label>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => handleToggleTimeSlot(slot.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${slot.isAvailable 
                    ? 'bg-[#92D7EE] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSaveSchedule}
          variant='ghost'
          className="bg-[#92D7EE] hover:bg-[#92D7EE]/90"
        >
          Lưu lịch làm việc
        </Button>
      </Card>
    </DoctorLayout>
  )
}