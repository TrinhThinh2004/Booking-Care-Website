'use client'

import Link from 'next/link'
import { useAuthStore } from '@/stores/auth/authStore'
import { 
  LayoutGrid,
  Calendar,
  Clock,
  User,
  Settings
} from 'lucide-react'

type Props = {
  pathname: string
}

export default function SideNav({ pathname }: Props) {
  const { user } = useAuthStore()
  const doctorId = user?.id

  const items = [
    { to: '/doctor', label: 'Tổng quan', icon: <LayoutGrid /> },
    { to: '/doctors/booking', label: 'Lịch hẹn', icon: <Calendar /> },
    { to: doctorId ? `/doctor/${doctorId}/schedule` : '#', label: 'Lịch làm việc', icon: <Clock /> },
  ]

  return (
    <nav className="grid gap-1">
      {items.map((it) => {
        const active =
          pathname === it.to ||
          (it.to !== '/doctor' && pathname.startsWith(it.to))
        return (
          <Link
            key={it.to}
            href={it.to}
            className={[
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
              active
                ? 'bg-[#92D7EE] text-gray-900'
                : 'text-gray-900 hover:bg-[#F7D800]',
            ].join(' ')}
          >
            <span className={active ? 'text-white' : 'text-gray-600'}>
              {it.icon}
            </span>
            <span>{it.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}