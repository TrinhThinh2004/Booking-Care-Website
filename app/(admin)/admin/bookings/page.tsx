'use client'

import AdminLayout from '../AdminLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
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

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus>('PENDING')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/bookings')
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

    fetchBookings()
  }, [])

  const handleConfirm = async (bookingId: number) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CONFIRMED' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Lỗi khi xác nhận')

      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b))
      toast.success('Xác nhận lịch khám thành công')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Lỗi khi xác nhận')
    }
  }

  const handleCancel = async (bookingId: number) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Lỗi khi hủy')

      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      toast.success('Hủy lịch khám thành công')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Lỗi khi hủy')
    }
  }

  const statusTabs: { value: BookingStatus; label: string }[] = [
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
  ]

  let filteredBookings = bookings.filter(b => b.status === activeTab)
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filteredBookings = filteredBookings.filter(b =>
      (b.patient?.firstName + ' ' + b.patient?.lastName).toLowerCase().includes(q) ||
      b.patient?.email?.toLowerCase().includes(q) ||
      (b.doctor?.user?.firstName + ' ' + b.doctor?.user?.lastName).toLowerCase().includes(q)
    )
  }

  if (loading) {
    return (
      <AdminLayout title="Quản lý lịch hẹn">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Đang tải lịch hẹn...</span>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý lịch hẹn">
      {/* Status Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
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

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên bệnh nhân, email, bác sĩ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#92D7EE]"
        />
      </div>

      {/* Bookings Table */}
      <Card>
        {filteredBookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Không có lịch hẹn nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-700">Bệnh nhân</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Liên hệ</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Bác sĩ</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Ngày / Giờ</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Lý do</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">
                      {booking.patient?.firstName} {booking.patient?.lastName}
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="text-xs space-y-1">
                        <div>{booking.patient?.email}</div>
                        {booking.patient?.phone && <div>{booking.patient.phone}</div>}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="text-sm">
                        {booking.doctor?.user ? `${booking.doctor.user.firstName} ${booking.doctor.user.lastName}` : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">{booking.doctor?.clinic?.name || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="text-sm">
                        {new Date(booking.date).toLocaleDateString('vi-VN', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </div>
                      <div className="text-xs text-gray-500">{booking.timeSlot}</div>
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {booking.reason}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center flex-wrap">
                        {booking.status === 'PENDING' && (
                          <>
                            <Button
                              onClick={() => handleConfirm(booking.id)}
                              className="bg-[#92D7EE] hover:bg-[#7bcce8] text-sm px-3 py-1"
                            >
                              Xác nhận
                            </Button>
                            <Button
                              onClick={() => handleCancel(booking.id)}
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50 text-sm px-3 py-1"
                            >
                              Từ chối
                            </Button>
                          </>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <Button
                            onClick={() => handleCancel(booking.id)}
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 text-sm px-3 py-1"
                          >
                            Từ chối
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  )
}