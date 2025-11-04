'use client'

import DashboardLayout from '../DashboardLayout'
import { Card } from '@/components/ui/Card'

export default function BookAppointment() {
  return (
    <DashboardLayout title="Đặt lịch khám">
      <Card className="p-6">
        <div className="text-center py-8">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Đặt lịch khám
          </h2>
          <p className="text-gray-500">
            Chức năng đang được phát triển...
          </p>
        </div>
      </Card>
    </DashboardLayout>
  )
}