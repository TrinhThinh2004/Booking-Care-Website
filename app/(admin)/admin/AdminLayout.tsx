'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/stores/auth/authStore'
import SideNav from './SideNav'

type Props = {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export default function AdminLayout({ title, actions, children }: Props) {
  const [isNavOpen, setNavOpen] = useState(true)
  const [isMenuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return
    }
    setMenuOpen(false)
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50">
      <header className="z-10 flex h-[60px] shrink-0 items-center justify-between gap-4 border-b bg-white px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2"
          >
            <img 
              src="/images/logo.png" 
              alt="BookingCare"
              className="h-8 w-auto" 
            />
          </Link>
          <button
            className="hidden h-9 w-9 place-content-center rounded-md border border-grey lg:grid"
            onClick={() => setNavOpen(!isNavOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="relative" ref={menuRef} onBlur={handleBlur}>
          <button
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-[#F7D800] focus:outline-none"
          >
            <User className="h-5 w-5 " />
            <span className="hidden sm:inline">
              Xin chào, {user?.firstName || 'Admin'}
            </span>
            <ChevronDown
              className={`h-4 w-4 ] transition-transform ${
                isMenuOpen ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <button
                onClick={handleLogout}
                className="group flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 " />
                <span className="text-red-600" >
                  Đăng xuất
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex grow overflow-hidden">
        <aside
          className={`shrink-0 border-r bg-white transition-[width] duration-300 ease-in-out ${
            isNavOpen ? 'w-[280px]' : 'w-0'
          } overflow-y-auto`}
        >
          <div className="p-4">
            <SideNav pathname={pathname} />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-bold tracking-wide text-gray-800">{title}</h1>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}