'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth/authStore'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, User, Stethoscope } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

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

  const quickActions = [
    {
      title: 'Đặt lịch khám',
      description: 'Đặt lịch khám với bác sĩ chuyên khoa',
      icon: Calendar,
      href: '/booking',
      color: 'bg-blue-500'
    },
    {
      title: 'Lịch hẹn của tôi',
      description: 'Xem và quản lý lịch hẹn đã đặt',
      icon: Clock,
      href: '/my-bookings',
      color: 'bg-green-500'
    },
    {
      title: 'Thông tin cá nhân',
      description: 'Cập nhật thông tin tài khoản',
      icon: User,
      href: '/profile',
      color: 'bg-purple-500'
    },
    {
      title: 'Tìm bác sĩ',
      description: 'Tìm kiếm bác sĩ theo chuyên khoa',
      icon: Stethoscope,
      href: '/doctors',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Chào mừng, {user.firstName} {user.lastName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý lịch hẹn và thông tin y tế của bạn
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => {
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

        {/* Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch hẹn gần đây</CardTitle>
              <CardDescription>
                Các lịch hẹn khám bệnh của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có lịch hẹn nào</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push('/booking')}
                  >
                    Đặt lịch ngay
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
              <CardDescription>
                Các thông báo quan trọng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <p>Không có thông báo mới</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
