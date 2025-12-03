'use client'

import DashboardLayout from '../DashboardLayout'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth/authStore'
import { Loader2, Calendar, Clock, MapPin, User } from 'lucide-react'
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
  patient?: { firstName: string; lastName: string; email: string; phone?: string }
  doctor?: { user?: { firstName: string; lastName: string }; clinic?: { name: string } }
}

export default function MyBookingsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<BookingStatus>('PENDING')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const res = await fetch(`/api/bookings?patientId=${user.id}`)
      const data = await res.json()
      if (data.success) {
        setBookings(data.data || [])
      } else {
        toast.error(data.message || 'Không thể tải lịch khám')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Lỗi khi tải lịch khám')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
    
    // Auto-refresh mỗi 15 giây
    const interval = setInterval(fetchBookings, 15000)
    return () => clearInterval(interval)
  }, [user?.id])

  if (!user?.id) {
    return (
      <DashboardLayout title="Lịch khám của tôi">
        <div className="p-6 text-center text-red-600">
          Vui lòng đăng nhập để xem lịch khám
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
    return (
      <DashboardLayout title="Lịch khám của tôi">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Đang tải lịch khám...</span>
        </div>
      </DashboardLayout>
    )
  }

  const statusTabs: { value: BookingStatus; label: string }[] = [
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ]

  const filteredBookings = bookings.filter(b => b.status === activeTab)

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700'
      case 'CONFIRMED':
        return 'bg-green-50 text-green-700'
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700'
      case 'CANCELLED':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'CONFIRMED':
        return 'Đã xác nhận'
      case 'COMPLETED':
        return 'Đã hoàn thành'
      case 'CANCELLED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return (
    <DashboardLayout title="Lịch khám của tôi">
      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${activeTab === tab.value 
                ? 'bg-[#92D7EE] text-gray-900' 
                : 'bg-white text-gray-900 hover:bg-[#F7D800] border border-gray-200'
              }`}
          >
            {tab.label} ({bookings.filter(b => b.status === tab.value).length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            Bạn chưa có lịch khám nào {activeTab === 'PENDING' ? 'chờ xác nhận' : activeTab === 'CONFIRMED' ? 'đã xác nhận' : activeTab === 'COMPLETED' ? 'đã hoàn thành' : 'đã hủy'}.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map(booking => (
            <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left side - Doctor & Clinic info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#92D7EE]/20 flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-[#92D7EE]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        BS.{booking.doctor?.user ? `${booking.doctor.user.firstName} ${booking.doctor.user.lastName}` : 'Bác sĩ'}
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
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                  <p className="text-xs text-gray-500">
                    ID: #{booking.id}
                  </p>
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

              {/* Created date */}
              <div className="mt-3 text-xs text-gray-400">
                Đặt lịch vào {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}