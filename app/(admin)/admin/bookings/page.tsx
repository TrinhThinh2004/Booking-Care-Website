'use client'

import { useState } from 'react'
import AdminLayout from '../AdminLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronDown, Search, Filter, Calendar } from 'lucide-react'

export default function BookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const statuses = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ]

  return (
    <AdminLayout 
      title="Quản lý lịch hẹn"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" className="text-gray-700">
            <Calendar className="w-4 h-4 mr-2" />
            Lọc theo ngày
          </Button>
          <Button className="bg-[#92D7EE] hover:bg-[#92D7EE]/90">
            Xuất báo cáo
          </Button>
        </div>
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
                  placeholder="Tìm kiếm theo tên bệnh nhân, bác sĩ..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#92D7EE]"
                />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none w-full min-w-[150px] pl-4 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#92D7EE] cursor-pointer"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
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
                <th className="py-4 px-6 text-left font-medium">Mã lịch hẹn</th>
                <th className="py-4 px-6 text-left font-medium">Bệnh nhân</th>
                <th className="py-4 px-6 text-left font-medium">Bác sĩ</th>
                <th className="py-4 px-6 text-left font-medium">Ngày giờ</th>
                <th className="py-4 px-6 text-left font-medium">Trạng thái</th>
                <th className="py-4 px-6 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-medium">#{1000 + i}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium">Nguyễn Văn A</p>
                      <p className="text-gray-500">0912345678</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium">BS. Trần Văn B</p>
                      <p className="text-gray-500">Khoa Tim mạch</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium">24/11/2025</p>
                      <p className="text-gray-500">09:00 - 10:00</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${i % 4 === 0 ? 'bg-yellow-50 text-yellow-700' :
                        i % 4 === 1 ? 'bg-green-50 text-green-700' :
                        i % 4 === 2 ? 'bg-blue-50 text-blue-700' :
                        'bg-red-50 text-red-700'}`}>
                      {i % 4 === 0 ? 'Chờ xác nhận' :
                        i % 4 === 1 ? 'Đã xác nhận' :
                        i % 4 === 2 ? 'Đã hoàn thành' :
                        'Đã hủy'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-gray-700">
                        Chi tiết
                      </Button>
                      {i % 4 === 0 && (
                        <>
                          <Button size="sm" className="bg-[#92D7EE] hover:bg-[#92D7EE]/90">
                            Xác nhận
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                            Từ chối
                          </Button>
                        </>
                      )}
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
              Hiển thị 1-5 trong số 50 lịch hẹn
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