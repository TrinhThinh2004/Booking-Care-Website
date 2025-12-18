"use client"

import { useState } from 'react'
import AdminLayout from '../AdminLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ChevronDown, Search, Filter, Plus, MapPin, Edit, Trash2 } from 'lucide-react'
import { useClinics } from '@/lib/hooks/useClinics'
import { useRouter } from 'next/navigation'
import { Modal } from '@/components/ui/Modal'
import ClinicForm from './ClinicForm'
import { toast } from 'react-hot-toast'

export default function ClinicsPage() {
  const [selectedArea, setSelectedArea] = useState('all')
  const { data, isLoading, error, mutate, create, update, remove } = useClinics()
  const clinics = data?.clinics || []
  const router = useRouter()

  const areas = [
    { value: 'all', label: 'Tất cả khu vực' },
    { value: 'north', label: 'Miền Bắc' },
    { value: 'central', label: 'Miền Trung' },
    { value: 'south', label: 'Miền Nam' },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClinic, setEditingClinic] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const handleCreate = () => {
    setEditingClinic(null)
    setIsModalOpen(true)
  }

  const handleEdit = (clinic: any) => {
    setEditingClinic(clinic)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng khám này?')) return
    setIsDeleting(id)
    try {
      await remove(id)
      toast.success('Xóa phòng khám thành công')
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || 'Xóa thất bại')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSubmit = async (payload: any) => {
    try {
      if (editingClinic) {
        await update(editingClinic.id, payload)
        toast.success('Cập nhật phòng khám thành công')
      } else {
        await create(payload)
        toast.success('Tạo phòng khám thành công')
      }
      setIsModalOpen(false)
      setEditingClinic(null)
    } catch (error: any) {
      console.error('Save clinic error:', error)
      toast.error(error?.message || 'Lỗi khi lưu phòng khám')
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditingClinic(null)
  }

  return (
    <AdminLayout 
      title="Quản lý phòng khám"
      actions={
        <Button onClick={handleCreate} className="bg-[#92D7EE] hover:bg-[#92D7EE]/90">
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

        {/* Clinics table */}
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số bác sĩ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <LoadingSpinner size="lg" />
                    </td>
                  </tr>
                ) : clinics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Chưa có phòng khám</td>
                  </tr>
                ) : (
                  clinics.map((clinic: any) => (
                    <tr key={clinic.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{clinic.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-20 rounded overflow-hidden bg-gray-100">
                          <img
                            src={clinic.image ? (clinic.image.startsWith('http') ? clinic.image : clinic.image.startsWith('/') ? clinic.image : `/images/Clinic/${clinic.image}`) : 'https://placehold.co/80x50'}
                            alt={clinic.name}
                            className="h-full w-full object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x50')}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{clinic.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{clinic.address || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{clinic.doctorsCount ?? 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">

                          <Button variant="outline" size="sm" onClick={() => handleEdit(clinic)} className="text-[#92D7EE] border-[#92D7EE] hover:bg-[#92D7EE]/10"><Edit className="w-4 h-4 mr-1" />Sửa</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(clinic.id)} disabled={isDeleting === clinic.id}>{isDeleting === clinic.id ? <LoadingSpinner size="sm" /> : (<><Trash2 className="w-4 h-4 mr-1" />Xóa</>)}</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị {clinics.length > 0 ? `1-${clinics.length}` : '0'} trong số {clinics.length} phòng khám
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
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingClinic ? 'Sửa phòng khám' : 'Thêm phòng khám mới'}
      >
        <ClinicForm initialData={editingClinic} onSubmit={handleSubmit} onCancel={handleCancel} />
      </Modal>
    </AdminLayout>
  )
}