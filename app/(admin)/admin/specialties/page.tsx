'use client'

import { useState } from 'react'
import AdminLayout from '../AdminLayout'
import { useSpecialties } from '@/lib/hooks/useSpecialties'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SpecialtyForm } from '@/app/(admin)/admin/specialties/SpecialtyForm'
import { createSpecialty, updateSpecialty, deleteSpecialty } from '@/lib/api/specialties'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function AdminSpecialtiesPage() {
  const { data: specialties, isLoading, mutate } = useSpecialties()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSpecialty, setEditingSpecialty] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const handleCreate = () => {
    setEditingSpecialty(null)
    setIsModalOpen(true)
  }

  const handleEdit = (specialty: any) => {
    setEditingSpecialty(specialty)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chuyên khoa này?')) {
      return
    }

    setIsDeleting(id)
    try {
      await deleteSpecialty(id)
      await mutate()
      toast.success('Xóa chuyên khoa thành công')
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi xóa chuyên khoa')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      const name = (formData.get('name') as string)?.trim()
      if (!name) {
        toast.error('Vui lòng nhập tên chuyên khoa')
        return
      }

      // đảm bảo isActive mặc định true nếu không có
      if (!formData.get('isActive')) {
        formData.set('isActive', 'true')
      }

      if (editingSpecialty) {
        await updateSpecialty(editingSpecialty.id, formData)
        toast.success('Cập nhật chuyên khoa thành công')
      } else {
        await createSpecialty(formData)
        toast.success('Thêm chuyên khoa thành công')
      }

      setIsModalOpen(false)
      setEditingSpecialty(null)
      await mutate()
    } catch (error: any) {
      console.error('Submit error:', error)
      toast.error(error?.message || 'Có lỗi xảy ra khi lưu chuyên khoa')
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditingSpecialty(null)
  }

  if (isLoading) {
    return (
      <AdminLayout title="Quản lý chuyên khoa">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Quản lý chuyên khoa"
      actions={
        <Button
          onClick={handleCreate}
          className="bg-[#92D7EE] hover:bg-[#F7D800] text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm chuyên khoa
        </Button>
      }
    >
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Số bác sĩ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(specialties || []).map((specialty: any) => (
                <tr key={specialty.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {specialty.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                      <img
                        src={specialty.image || '/images/specialty/default.png'}
                        alt={specialty.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://placehold.co/40x40'
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {specialty.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {specialty.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {specialty.doctorCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(specialty)}
                        className="text-[#92D7EE] border-[#92D7EE] hover:bg-[#92D7EE]/10"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(specialty.id)}
                        disabled={isDeleting === specialty.id}
                        className="text-red-600 "
                      >
                        {isDeleting === specialty.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Xóa
                          </>
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!specialties || specialties.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Chưa có chuyên khoa nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingSpecialty ? 'Sửa chuyên khoa' : 'Thêm chuyên khoa mới'}
      >
        <SpecialtyForm
          initialData={editingSpecialty}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Modal>
    </AdminLayout>
  )
}
