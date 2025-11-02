'use client'

import DoctorLayout from '@/app/(doctor)/doctor/DoctorLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled'

interface Appointment {
  id: string
  patientName: string
  date: string
  time: string
  status: AppointmentStatus
  reason: string
}

export default function DoctorAppointments() {
  const [activeTab, setActiveTab] = useState<AppointmentStatus>('pending')
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const handleConfirm = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'confirmed' } : app
    ))
  }

  const handleCancel = (id: string) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'cancelled' } : app
    ))
  }

  const filteredAppointments = appointments.filter(app => app.status === activeTab)

  const statusTabs: { value: AppointmentStatus; label: string }[] = [
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'cancelled', label: 'Đã hủy' }
  ]

  return (
    <DoctorLayout title="Quản lý lịch hẹn">
      {/* Status Tabs */}
      <div className="flex gap-4 mb-6">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${activeTab === tab.value 
                ? 'bg-[#92D7EE] text-gray-900' 
                : 'bg-white text-gray-900 hover:bg-[#F7D800]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <Card>
        {filteredAppointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Không có lịch hẹn nào {activeTab === 'pending' ? 'chờ xác nhận' : activeTab === 'confirmed' ? 'đã xác nhận' : 'đã hủy'}.
          </div>
        ) : (
          <div className="divide-y">
            {filteredAppointments.map(appointment => (
              <div key={appointment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{appointment.patientName}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {appointment.date} - {appointment.time}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">{appointment.reason}</p>
                  </div>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleConfirm(appointment.id)}
                        className="bg-[#92D7EE] hover:bg-[#92D7EE]/90"
                      >
                        Xác nhận
                      </Button>
                      <Button
                        onClick={() => handleCancel(appointment.id)}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Từ chối
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DoctorLayout>
  )
}