"use client"

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth/authStore'
import { useRouter } from 'next/navigation'
import { Users, Calendar, Stethoscope, Building2, BarChart3, ChevronRight, Settings ,Cross} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/app/(admin)/admin/AdminLayout'
import { useAdminStats } from '@/lib/hooks/useAdminStats'

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // call admin stats hook unconditionally (before any early returns)
  const { data: statsData, isLoading: statsLoading } = useAdminStats()

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

  const stats = statsData || {
    totalUsers: 0,
    todayBookings: 0,
    activeDoctors: 0,
    totalClinics: 0,
  }

  const quickLinks = [
    {
      to: '/admin/users',
      title: 'Quản lý Người dùng',
      desc: 'Xem, thêm, chỉnh sửa tài khoản',
      icon: <Users className="h-5 w-5" />,
    },
    {
      to: '/admin/bookings',
      title: 'Quản lý Lịch hẹn',
      desc: 'Xem, đổi trạng thái lịch hẹn',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      to: '/admin/doctors',
      title: 'Quản lý Bác sĩ',
      desc: 'Thêm, chỉnh sửa thông tin bác sĩ',
      icon: <Cross className="h-5 w-5" />,
    },
    {
      to: '/admin/clinics',
      title: 'Quản lý Phòng khám',
      desc: 'Quản lý thông tin phòng khám',
      icon: <Building2 className="h-5 w-5" />,
    },
 
  ]

  const statFmt = (n: number) => n.toLocaleString('vi-VN')

  return (
    <AdminLayout title="Tổng quan">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <KpiCard
          title="Tổng người dùng"
          value={statFmt(stats.totalUsers)}
          icon={<Users className="h-6 w-6" />}
        
          color="#F7D800"
        />
        <KpiCard
          title="Lịch hẹn hôm nay"
          value={statFmt(stats.todayBookings)}
          icon={<Calendar className="h-6 w-6" />}
            color="#92D7EE"
        />
        <KpiCard
          title="Bác sĩ hoạt động"
          value={statFmt(stats.activeDoctors)}
          icon={<Cross className="h-6 w-6" />}
          color="#4ade80"
        />
        <KpiCard
          title="Phòng khám"
          value={statFmt(stats.totalClinics)}
          icon={<Building2 className="h-6 w-6" />}
          color="#f43f5e"
        />
      </div>

      {/* Quick links */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 mb-6">
        <h2 className="mb-3 text-base font-extrabold">Quản lý nhanh</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, index) => (
            <ManageTile
              key={index}
              to={link.to}
              title={link.title}
              desc={link.desc}
              color={
                index === 0 ? '#F7D800' :
                index === 1 ? '#92D7EE' :
                index === 2 ? '#4ade80' :
                '#f43f5e'
              }
            >
              {link.icon}
            </ManageTile>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-base font-extrabold">Lịch hẹn gần đây</h2>
        <ul className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <li
              key={i}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-neutral-50 rounded-lg px-2"
              onClick={() => router.push('/admin/bookings')}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Lịch hẹn #{1000 + i} • Bác sĩ Nguyễn Văn A • Khám tổng quát
                </p>
                <p className="text-xs text-neutral-600">
                  Bệnh nhân: Nguyễn Văn B • 09xx xxx xxx
                </p>
              </div>
              <div className="ml-3 flex items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  Đã xác nhận
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  )
}

function KpiCard({
  title,
  value,
  sub,
  icon,
  color = '#92D7EE',
}: {
  title: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  color?: string
}) {
  return (
    <div className="rounded-xl bg-white p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}10` }}>
          <div style={{ color: color }}>{icon}</div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-1 text-sm text-gray-600">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

function ManageTile({
  to,
  title,
  desc,
  children,
  color = '#92D7EE'
}: {
  to: string
  title: string
  desc: string
  children: React.ReactNode
  color?: string
}) {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(to)}
      className="group flex items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer bg-white"
    >
      <span className="rounded-lg p-3" style={{ backgroundColor: `${color}10`, color: color }}>
        {children}
      </span>
      <div className="min-w-0">
       <p className="font-semibold text-gray-800 group-hover:text-[#92D7EE] transition-colors">
          {title}
        </p>
        <p className="truncate text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  )
}
