'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth/authStore'
import { useRouter } from 'next/navigation'
import { Users, Calendar, Stethoscope, Building2, BarChart3, ChevronRight, Settings ,Cross} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import AdminLayout from '@/components/admin/AdminLayout'

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

  // Mock data - trong thực tế sẽ lấy từ API
  const stats = {
    totalUsers: 1234,
    todayBookings: 45,
    activeDoctors: 89,
    totalClinics: 12,
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
          icon={<Users className="h-5 w-5" />}
        />
        <KpiCard
          title="Lịch hẹn hôm nay"
          value={statFmt(stats.todayBookings)}
          icon={<Calendar className="h-5 w-5" />}
        />
        <KpiCard
          title="Bác sĩ hoạt động"
          value={statFmt(stats.activeDoctors)}
          icon={<Cross className="h-5 w-5" />}
        />
        <KpiCard
          title="Phòng khám"
          value={statFmt(stats.totalClinics)}
          icon={<Building2 className="h-5 w-5" />}
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
}: {
  title: string
  value: string | number
  sub?: string
  icon: React.ReactNode
}) {
  return (
    <div className="group rounded-xl border border-[#92D7EE]/20 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-600 group-hover:text-[#92D7EE] transition-colors">
          {title}
        </p>
        <span className="rounded-lg bg-[#92D7EE]/10 p-2 text-[#92D7EE] group-hover:bg-[#92D7EE] group-hover:text-white transition-colors">
          {icon}
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-800">{value}</div>
      {sub && (
        <p className="mt-1 text-sm text-[#92D7EE] group-hover:text-[#92D7EE] transition-colors">
          {sub}
        </p>
      )}
    </div>
  );
}

function ManageTile({
  to,
  title,
  desc,
  children,
}: {
  to: string
  title: string
  desc: string
  children: React.ReactNode
}) {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(to)}
      className="group flex items-start gap-3 rounded-lg border border-[#92D7EE]/20 p-4 transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer bg-white"
    >
      <span className="rounded-lg bg-[#92D7EE]/10 p-3 text-[#92D7EE] group-hover:bg-[#92D7EE] group-hover:text-white transition-colors">
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
