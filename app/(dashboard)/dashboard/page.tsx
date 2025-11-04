'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth/authStore'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import DashboardLayout from './DashboardLayout'
import { Calendar, Clock, CheckCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return null
  }


  const stats = {
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  }

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
        <Card>
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center text-gray-500">
              Chưa có lịch hẹn nào.
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
