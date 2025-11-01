'use client'

import Link from 'next/link'
import { 
  LayoutGrid,
  Users,
  Calendar,
  Stethoscope,
  Building2,
  MapPin,
  Cross,
} from 'lucide-react'

type Props = {
  pathname: string
}

export default function SideNav({ pathname }: Props) {
  const items = [
    { to: '/admin', label: 'Tổng quan', icon: <LayoutGrid /> },
    { to: '/admin/users', label: 'Người dùng', icon: <Users /> },
    { to: '/admin/bookings', label: 'Lịch hẹn', icon: <Calendar /> },
    { to: '/admin/doctors', label: 'Bác sĩ', icon: <Cross /> },
    { to: '/admin/clinics', label: 'Phòng khám', icon: <Building2 /> },
  ]

  return (
    <nav className="grid gap-1">
      {items.map((it) => {
        const active =
          pathname === it.to ||
          (it.to !== '/admin' && pathname.startsWith(it.to))
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