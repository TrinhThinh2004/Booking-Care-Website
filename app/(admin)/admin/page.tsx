'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth/authStore'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Users, Calendar, Stethoscope, Building2, BarChart3 } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user, router])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  const adminActions = [
    {
      title: 'Quản lý người dùng',
      description: 'Quản lý tài khoản bệnh nhân và bác sĩ',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Quản lý lịch hẹn',
      description: 'Xem và quản lý tất cả lịch hẹn',
      icon: Calendar,
      href: '/admin/bookings',
      color: 'bg-green-500'
    },
    {
      title: 'Quản lý bác sĩ',
      description: 'Thêm, sửa, xóa thông tin bác sĩ',
      icon: Stethoscope,
      href: '/admin/doctors',
      color: 'bg-purple-500'
    },
    {
      title: 'Quản lý phòng khám',
      description: 'Quản lý thông tin phòng khám',
      icon: Building2,
      href: '/admin/clinics',
      color: 'bg-orange-500'
    },
    {
      title: 'Báo cáo thống kê',
      description: 'Xem báo cáo và thống kê hệ thống',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bảng điều khiển quản trị
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý hệ thống đặt lịch khám bệnh
          </p>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(action.href)}
                  >
                    Truy cập
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lịch hẹn hôm nay</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                +12% so với hôm qua
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bác sĩ hoạt động</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +2 bác sĩ mới
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Phòng khám</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Tất cả đang hoạt động
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
