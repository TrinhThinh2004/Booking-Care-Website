'use client'

import Link from 'next/link'
import { Calendar, Clock, Search } from 'lucide-react'

type Props = {
  pathname: string
}

export default function SideNav({ pathname }: Props) {
  const items = [
    { to: '/dashboard', label: 'Tổng quan', icon: <Clock /> },
    { to: '/dashboard/booking', label: 'Đặt lịch khám', icon: <Calendar /> },
    { to: '/dashboard/my-bookings', label: 'Lịch hẹn của tôi', icon: <Clock /> },
  ]

  return (
    <nav className="grid gap-1">
      {items.map((it) => {
        const active =
          it.to === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === it.to || pathname.startsWith(it.to + '/')
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