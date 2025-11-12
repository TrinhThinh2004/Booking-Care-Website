"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Calendar, MapPin, Phone, Search } from 'lucide-react'
import { useDoctors } from '@/lib/hooks/useDoctors'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { doctors, isLoading, error } = useDoctors({
    search: searchQuery || undefined,
    page: currentPage,
    // limit: 12,
    clientSideFilter: true,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Bác sĩ</h1>

          {/* Search bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm bác sĩ theo tên, chuyên khoa..."
                className="w-full pl-10 pr-4 py-3 text-base"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12 text-red-500">
                Đã xảy ra lỗi khi tải danh sách bác sĩ
              </div>
            ) : !doctors?.length ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Không tìm thấy bác sĩ nào
              </div>
            ) : (
              doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col"
                >
                  <div className="flex items-center p-6 grow">

                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement
                          t.src = '/images/doctor/default.png'
                        }}
                      />
                    </div>

                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">BS.{doc.name}</h3>
                      <p className="text-sm text-gray-600">Chuyên khoa: {doc.specialtyName} </p>
                      <div className="mt-3 text-sm text-gray-700 space-y-1">
                        
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-gray-600">{doc.yearsOfExperience} năm kinh nghiệm</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-gray-600">{doc.clinicName}</span>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <button className="text-sm text-[#92D7EE] font-medium hover:underline">Xem hồ sơ</button>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-[#92D7EE]" />
                      <span>Liên hệ</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
