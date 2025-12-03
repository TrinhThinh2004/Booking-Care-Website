'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth/authStore'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import DashboardLayout from './DashboardLayout'
import { Calendar, Clock, CheckCircle, MapPin, User as UserIcon } from 'lucide-react'
import toast from 'react-hot-toast'

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
  doctor?: { user?: { firstName: string; lastName: string }; clinic?: { name: string } }
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      fetchBookings()
      setIsLoading(false)
    }
  }, [isAuthenticated, router])

  const fetchBookings = async () => {
    if (!user?.id) return
    
    try {
      const res = await fetch(`/api/bookings?patientId=${user.id}`)
      const data = await res.json()
      if (data.success) {
        setBookings(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }

  const stats = {
    totalAppointments: bookings.length,
    pendingAppointments: bookings.filter(b => b.status === 'PENDING').length,
    completedAppointments: bookings.filter(b => b.status === 'COMPLETED').length,
  }

  // Get 2 most recent appointments sorted by date
  const recentAppointments = [...bookings]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)

  return (
    <DashboardLayout title="Trang chủ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Appointments */}
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

        {/* Pending Appointments */}
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

        {/* Completed Appointments */}
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

      {/* Recent Appointments */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Lịch hẹn gần đây</h2>
        {recentAppointments.length === 0 ? (
          <Card>
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center text-gray-500">
                Chưa có lịch hẹn nào.
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {recentAppointments.map(booking => (
              <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left side - Doctor & Clinic info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#92D7EE]/20 flex items-center justify-center shrink-0">
                        <UserIcon className="w-6 h-6 text-[#92D7EE]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.doctor?.user ? `${booking.doctor.user.firstName} ${booking.doctor.user.lastName}` : 'Bác sĩ'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {booking.doctor?.clinic?.name || 'Chưa xác định'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle - Date & Time */}
                  <div className="flex gap-6 md:flex-col md:gap-2">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Ngày khám</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(booking.date).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
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

                  {/* Right side - Status */}
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

                {/* Reason */}
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
    </DashboardLayout>
  )
}
