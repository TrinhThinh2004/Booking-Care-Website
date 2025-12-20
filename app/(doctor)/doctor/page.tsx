'use client'

import { useEffect, useState, useMemo } from 'react'
import DoctorLayout from '@/app/(doctor)/doctor/DoctorLayout'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/auth/authStore'
import { Calendar, Clock, User as UserIcon, CheckCircle, MapPin } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useDoctors } from '@/lib/hooks/useDoctors'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

interface Booking {
  id: number
  patientId: number
  doctorId: number
  date: string
  timeSlot: string
  reason: string
  status: BookingStatus
  createdAt: string
  patient?: { firstName?: string; lastName?: string; email?: string }
  clinic?: { name?: string; address?: string }
  doctor?: { clinic?: { name?: string } }
}


export default function DoctorDashboard() {
  const { user, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])

  const { doctors, isLoading: isLoadingDoctor } = useDoctors()

  const currentDoctorId = useMemo(() => {
    if (!user) return null
    if (user.doctorId) return String(user.doctorId)
    if (!doctors) return null
    const currentDoc = doctors.find((d: any) => Number(d.userId) === Number(user.id))
    return currentDoc ? String(currentDoc.id) : null
  }, [user, doctors])

  useEffect(() => {
    if (!isAuthenticated) return
    if (isLoadingDoctor && !currentDoctorId) return
    if (!isLoadingDoctor && !currentDoctorId) {
      setIsLoading(false)
      return
    }
    if (currentDoctorId) {
      fetchBookings(currentDoctorId).finally(() => setIsLoading(false))
    }
  }, [isAuthenticated, currentDoctorId, isLoadingDoctor])

  const fetchBookings = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings?doctorId=${id}`)
      const json = await res.json()
      if (json.success) setBookings(json.data || [])
    } catch (err) {
      console.error('Error fetching doctor bookings', err)
    }
  }

  if (isLoading || (isLoadingDoctor && !currentDoctorId)) return <LoadingSpinner />
  if (!user) return null

  const stats = {
    totalAppointments: bookings.length,
    pendingAppointments: bookings.filter(b => b.status === 'PENDING').length,
    completedAppointments: bookings.filter(b => b.status === 'COMPLETED').length,
  }

  const recentAppointments = [...bookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)

  return (
    <DoctorLayout title="Trang chủ">
      {!currentDoctorId && !isLoadingDoctor && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          Tài khoản này chưa được liên kết hồ sơ bác sĩ. Vui lòng liên hệ quản trị viên.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#92D7EE]/10 rounded-full">
              <Calendar className="w-6 h-6 text-[#92D7EE]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tổng lịch hẹn</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-full">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Chờ xác nhận</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Đã hoàn thành</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.completedAppointments}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch hẹn gần đây</h2>
        {recentAppointments.length === 0 ? (
          <Card>
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center text-gray-500">Chưa có lịch hẹn nào.</div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recentAppointments.map(booking => (
              <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#92D7EE]/20 flex items-center justify-center shrink-0">
                        <UserIcon className="w-6 h-6 text-[#92D7EE]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.patient ? `${booking.patient.firstName || ''} ${booking.patient.lastName || ''}` : 'Bệnh nhân'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {booking.clinic?.name || booking.doctor?.clinic?.name || 'Chưa xác định'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6 md:flex-col md:gap-2">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Ngày khám</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(booking.date).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Giờ khám</p>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.timeSlot}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' :
                        booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' :
                        booking.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700' :
                        'bg-red-50 text-red-700'}`}>
                      {booking.status === 'PENDING' ? 'Chờ xác nhận' :
                        booking.status === 'CONFIRMED' ? 'Đã xác nhận' :
                        booking.status === 'COMPLETED' ? 'Đã hoàn thành' :
                        'Đã hủy'}
                    </span>
                    <p className="text-xs text-gray-500">ID: #{booking.id}</p>
                  </div>
                </div>

                {booking.reason && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">Lý do khám: </span>
                      {booking.reason}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DoctorLayout>
  )
}