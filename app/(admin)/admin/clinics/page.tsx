'use client'

import { useState } from 'react'
import AdminLayout from '../AdminLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronDown, Search, Filter, Plus, MapPin } from 'lucide-react'

export default function ClinicsPage() {
  const [selectedArea, setSelectedArea] = useState('all')
  const areas = [
    { value: 'all', label: 'Tất cả khu vực' },
    { value: 'north', label: 'Miền Bắc' },
    { value: 'central', label: 'Miền Trung' },
    { value: 'south', label: 'Miền Nam' },
  ]

  return (
    <AdminLayout 
      title="Quản lý phòng khám"
      actions={
        <Button className="bg-[#92D7EE] hover:bg-[#92D7EE]/90">
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng khám
        </Button>
      }
    >
      <Card>
        {/* Filters */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, địa chỉ..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#92D7EE]"
                />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="appearance-none w-full min-w-[150px] pl-4 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#92D7EE] cursor-pointer"
              >
                {areas.map(area => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <Button variant="outline" className="text-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Lọc thêm
            </Button>
          </div>
        </div>

        {/* Grid of clinics */}
        <div className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40">
                  <img
                    src={`/images/clinic/clinic${i + 1}.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/400x200';
                    }}
                  />
                  <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium
                    ${i % 2 === 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {i % 2 === 0 ? 'Đang hoạt động' : 'Tạm đóng cửa'}
                  </span>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">Phòng khám {i + 1}</h3>
                  <p className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {i % 3 === 0 ? 'Hà Nội' : i % 3 === 1 ? 'Đà Nẵng' : 'TP.HCM'}
                  </p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Số bác sĩ</p>
                      <p className="font-medium">{10 + i}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Lịch hẹn/ngày</p>
                      <p className="font-medium">{20 + i * 5}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1 text-gray-700">
                      Chi tiết
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-[#92D7EE] border-[#92D7EE] hover:bg-[#92D7EE]/10">
                      Sửa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị 1-6 trong số 24 phòng khám
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-gray-700" disabled>
                Trước
              </Button>
              <Button variant="outline" size="sm" className="text-gray-700">
                Tiếp
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </AdminLayout>
  )
}