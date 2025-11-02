'use client'

import DoctorLayout from '@/app/(doctor)/doctor/DoctorLayout'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/auth/authStore'
import { Calendar, Clock, User, } from 'lucide-react'

export default function DoctorDashboard() {
  const { user } = useAuthStore()

  return (
    <DoctorLayout title="Trang chủ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#92D7EE]/10 rounded-full">
              <Calendar className="w-6 h-6 text-[#92D7EE]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lịch hẹn hôm nay</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
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
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </Card>

        {/* Total Patients */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-full">
              <User className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tổng số bệnh nhân</h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
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
    </DoctorLayout>
  )
}