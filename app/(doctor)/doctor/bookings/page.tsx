'use client'

import DoctorLayout from '@/app/(doctor)/doctor/DoctorLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useAuthStore } from '@/stores/auth/authStore'
import { useDoctors } from '@/lib/hooks/useDoctors'
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
  patient?: { firstName: string; lastName: string; email: string }
}

export default function DoctorAppointments() {
  const { user } = useAuthStore()
  const { doctors, isLoading: isLoadingDoctor } = useDoctors()

  const doctorId = useMemo(() => {
    if (!user || !doctors) return null
    
    if (user.doctorId) return String(user.doctorId)

    const currentDoc = doctors.find((d: any) => Number(d.userId) === Number(user.id))
    return currentDoc ? String(currentDoc.id) : null
  }, [user, doctors])

  const [activeTab, setActiveTab] = useState<BookingStatus>('PENDING')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadingId, setUploadingId] = useState<number | null>(null)

  useEffect(() => {
    if (!doctorId) return
    
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/bookings?doctorId=${doctorId}`)
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
  }, [doctorId])

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

  const handleComplete = async (bookingId: number) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Lỗi khi hoàn thành')

      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'COMPLETED' } : b))
      toast.success('Đã đánh dấu hoàn thành')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Lỗi khi hoàn thành')
    }
  }

  const handleUploadClick = (bookingId: number) => {
    setUploadingId(bookingId)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file || !uploadingId) return
    const bookingId = uploadingId
    const fd = new FormData()
    fd.append('file', file)
    try {
      toast.loading('Đang tải đơn thuốc...')
      const res = await fetch(`/api/multer/bookings/${bookingId}`, {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Lỗi khi tải lên')
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'COMPLETED' } : b))
      toast.success('Đã gửi đơn thuốc cho bệnh nhân')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Lỗi khi tải đơn thuốc')
    } finally {
      setUploadingId(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const filteredBookings = bookings.filter(b => b.status === activeTab)

  const statusTabs: { value: BookingStatus; label: string }[] = [
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'CANCELLED', label: 'Đã hủy' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
  ]

  if (loading || (isLoadingDoctor && !doctorId)) {
    return (
      <DoctorLayout title="Quản lý lịch hẹn">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Đang tải lịch hẹn...</span>
        </div>
      </DoctorLayout>
    )
  }

  if (!doctorId && !isLoadingDoctor) {
    return (
      <DoctorLayout title="Quản lý lịch hẹn">
        <div className="p-6 text-center text-red-600">Tài khoản này chưa được liên kết hồ sơ bác sĩ.</div>
      </DoctorLayout>
    )
  }

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
        {filteredBookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Không có lịch hẹn nào {activeTab === 'PENDING' ? 'chờ xác nhận' : activeTab === 'CONFIRMED' ? 'đã xác nhận' : activeTab === 'CANCELLED' ? 'đã hủy' : 'đã hoàn thành'}.
          </div>
        ) : (
          <div className="divide-y">
            {filteredBookings.map(booking => (
              <div key={booking.id} className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {booking.patient?.firstName} {booking.patient?.lastName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })} - {booking.timeSlot}
                    </p>
                    <p className="mt-2 text-sm text-gray-700"><span className="font-semibold">Lý do:</span> {booking.reason}</p>
                    <p className="mt-1 text-sm text-gray-600"><span className="font-semibold">Email:</span> {booking.patient?.email}</p>
                  </div>
                  
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        onClick={() => handleConfirm(booking.id)}
                        className="bg-[#92D7EE] hover:bg-[#92D7EE]/90"
                      >
                        Xác nhận
                      </Button>
                      <Button
                        onClick={() => handleCancel(booking.id)}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Hủy
                      </Button>
                    </div>
                  )}

                  {booking.status === 'CONFIRMED' && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        onClick={() => handleComplete(booking.id)}
                        className="bg-[#92D7EE] hover:bg-[#92D7EE]/90"
                      >
                        Hoàn thành
                      </Button>
                      <Button
                        onClick={() => handleUploadClick(booking.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Gửi đơn thuốc
                      </Button>
                      <Button
                        onClick={() => handleCancel(booking.id)}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </DoctorLayout>
  )
}