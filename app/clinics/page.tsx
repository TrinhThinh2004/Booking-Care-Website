"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useClinics } from '@/lib/hooks/useClinics'
import { Search, MapPin, Phone, Clock, Star } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export default function ClinicsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const { data, isLoading, error } = useClinics()

    const clinics = data?.clinics || []

    const filteredClinics = searchQuery
        ? clinics.filter((c: any) =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.address?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : clinics

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-8 sm:py-12 lg:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                        Phòng khám & Bệnh viện
                    </h1>
                    <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                        Hệ thống phòng khám và bệnh viện uy tín với trang thiết bị hiện đại
                    </p>

                    {/* Search bar */}
                    <div className="mb-8 max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm phòng khám theo tên, địa chỉ..."
                                className="w-full pl-10 pr-4 py-3 text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            Đã xảy ra lỗi khi tải danh sách phòng khám
                        </div>
                    ) : !filteredClinics.length ? (
                        <div className="text-center py-12 text-gray-500">
                            Không tìm thấy phòng khám nào
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {filteredClinics.map((clinic: any) => (
                                <div
                                    key={clinic.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer group flex flex-col"
                                    onClick={() => router.push(`/clinics/${clinic.id}`)}
                                >
                                    {/* Image */}
                                    <div className="h-36 sm:h-44 w-full bg-white p-4 border-b">
                                        {clinic.image ? (
                                            <img
                                                src={clinic.image}
                                                alt={clinic.name}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="h-full bg-linear-to-r from-[#92D7EE] to-[#4B6CB7] flex items-center justify-center rounded-lg">
                                                <span className="text-3xl font-bold text-white">
                                                    {clinic.name?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 sm:p-6 flex flex-col grow">
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#49bce2] transition-colors">
                                            {clinic.name}
                                        </h3>

                                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                                            <div className="flex items-start">
                                                <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-gray-400" />
                                                <span className="line-clamp-2">{clinic.address}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                                                <span>{clinic.phone}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                                                <span>{clinic.operatingHours || '24/7'}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 mr-2 shrink-0 text-yellow-400 fill-current" />
                                                <span>{clinic.rating} ({clinic.reviewCount} đánh giá)</span>
                                            </div>
                                        </div>

                                        {/* Specialties */}
                                        {clinic.specialties?.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Chuyên khoa:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {clinic.specialties.slice(0, 4).map((specialty: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-[#EFEFEF] text-xs text-gray-700 rounded-full font-medium"
                                                        >
                                                            {specialty}
                                                        </span>
                                                    ))}
                                                    {clinic.specialties.length > 4 && (
                                                        <span className="px-2 py-1 text-xs text-[#49bce2] font-medium">
                                                            +{clinic.specialties.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <button className="w-full mt-auto py-2.5 px-4 bg-[#92D7EE] hover:bg-[#7ac8e2] text-gray-900 font-medium rounded-lg transition-colors text-sm">
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
