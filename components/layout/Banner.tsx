'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Search, Calendar, MapPin, Clock } from 'lucide-react'

export const Banner = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const quickActions = [
    {
      icon: Calendar,
      title: 'Đặt lịch khám',
      description: 'Đặt lịch với bác sĩ chuyên khoa',
      href: '/booking',
      color: 'bg-[#92D7EE]'
    },
    {
      icon: MapPin,
      title: 'Tìm bác sĩ',
      description: 'Tìm bác sĩ theo chuyên khoa',
      href: '/specialties',
      color: 'bg-[#92D7EE]'
    },
    {
      icon: Clock,
      title: 'Lịch hẹn của tôi',
      description: 'Xem lịch hẹn đã đặt',
      href: '/my-bookings',
      color: 'bg-[#92D7EE]'
    }
  ]

  return (
    <section className="relative bg-[url('/images/background.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Chăm sóc sức khỏe
              <span className="text-amber-400 block">tại nhà</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Đặt lịch khám bệnh trực tuyến với bác sĩ chuyên khoa hàng đầu. 
              Nhanh chóng, tiện lợi và đáng tin cậy.
            </p>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-700" />
                </div>
                <Input
                  type="text"
                  placeholder="Tìm kiếm bác sĩ, chuyên khoa, phòng khám..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-[#F7D800] py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-700 border-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
  {quickActions.map((action, index) => {
    const Icon = action.icon
    return (
      <div
        key={index}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:bg-white/20 transition-all cursor-pointer border border-white/20"
        onClick={() => router.push(action.href)}
      >
        <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-lg font-semibold text-white mb-2">
          {action.title}
        </h3>
        <p className="text-gray-200">
          {action.description}
        </p>
      </div>
    )
  })}
</div>
          </div>
        </div>
      </div>
    </section>
  )
}