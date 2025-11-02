'use client'

import { useState } from 'react'
import AdminLayout from '../AdminLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronDown, Search, Filter, Plus } from 'lucide-react'

export default function DoctorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const specialties = [
    { value: 'all', label: 'Tất cả chuyên khoa' },
    { value: 'cardiology', label: 'Tim mạch' },
    { value: 'neurology', label: 'Thần kinh' },
    { value: 'orthopedics', label: 'Cơ xương khớp' },
    { value: 'pediatrics', label: 'Nhi khoa' },
  ]

  return (
    <AdminLayout 
      title="Quản lý bác sĩ"
      actions={
        <Button className="bg-[#92D7EE] hover:bg-[#92D7EE]/90">
          <Plus className="w-4 h-4 mr-2" />
          Thêm bác sĩ
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
                  placeholder="Tìm kiếm theo tên, chuyên khoa..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#92D7EE]"
                />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="appearance-none w-full min-w-[180px] pl-4 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#92D7EE] cursor-pointer"
              >
                {specialties.map(specialty => (
                  <option key={specialty.value} value={specialty.value}>
                    {specialty.label}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="py-4 px-6 text-left font-medium">Bác sĩ</th>
                <th className="py-4 px-6 text-left font-medium">Email</th>
                <th className="py-4 px-6 text-left font-medium">Chuyên khoa</th>
                <th className="py-4 px-6 text-left font-medium">Lịch hẹn</th>
                <th className="py-4 px-6 text-left font-medium">Trạng thái</th>
                <th className="py-4 px-6 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#92D7EE]/20 flex items-center justify-center">
                        <img
                          src={`/images/doctor/doctor${i + 1}.jpg`}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/40x40';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">BS. Nguyễn Văn {String.fromCharCode(65 + i)}</p>
                        <p className="text-gray-500 text-xs">ID: #200{i}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">doctor{i + 1}@example.com</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${i % 4 === 0 ? 'bg-red-50 text-red-700' :
                        i % 4 === 1 ? 'bg-blue-50 text-blue-700' :
                        i % 4 === 2 ? 'bg-green-50 text-green-700' :
                        'bg-purple-50 text-purple-700'}`}>
                      {i % 4 === 0 ? 'Tim mạch' :
                        i % 4 === 1 ? 'Thần kinh' :
                        i % 4 === 2 ? 'Cơ xương khớp' :
                        'Nhi khoa'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium">{20 + i * 5}</p>
                      <p className="text-gray-500 text-xs">Lịch hẹn tháng này</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${i % 2 === 0 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {i % 2 === 0 ? 'Đang làm việc' : 'Tạm nghỉ'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-gray-700">
                        Chi tiết
                      </Button>
                      <Button variant="outline" size="sm" className="text-[#92D7EE] border-[#92D7EE] hover:bg-[#92D7EE]/10">
                        Sửa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị 1-5 trong số 20 bác sĩ
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