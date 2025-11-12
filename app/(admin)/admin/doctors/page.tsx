'use client'

import { useState, useMemo } from 'react'
import AdminLayout from '../AdminLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronDown, Search, Filter, Plus } from 'lucide-react'
import { useDoctors } from '@/lib/hooks/useDoctors'
import { useSpecialties } from '@/lib/hooks/useSpecialties'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EditDoctorModal } from './UpdateDoctorsModal'
import { updateDoctor } from '@/lib/api/doctors'
import { updateUser } from '@/lib/api/users'
import { toast } from 'react-hot-toast'

interface Doctor {
  id: number
  name: string
  email: string
  image: string
  specialtyName: string
  isActive: boolean
  createdAt: string
}

export default function DoctorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  
  const { data: specialties, isLoading: loadingSpecialties } = useSpecialties()
  
  const { doctors: rawDoctors, isLoading: loadingDoctors, mutate } = useDoctors({
    search: searchQuery,
     specialtyId: selectedSpecialty === 'all' ? undefined : Number(selectedSpecialty),
    clientSideFilter: true
  })

  const specialtyOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'Tất cả chuyên khoa' }]
    if (specialties) {
      options.push(...specialties.map((s: any) => ({
        value: String(s.id),
        label: s.name
      })))
    }
    return options
  }, [specialties])

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty)
    setCurrentPage(1)
  }

  const handleOpenEditModal = (doctor: any) => {
    setEditingDoctor(doctor)
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditingDoctor(null)
    setEditModalOpen(false)
  }

  const handleUpdateDoctor = async (formData: FormData) => {
    try {
      await updateDoctor(Number(formData.get('id')), formData)
      handleCloseEditModal()
      await mutate()
      toast.success('Cập nhật bác sĩ thành công')
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra')
    }
  }

  // const handleToggleStatus = async (doctor: any) => {
  //   try {
  //     const action = doctor.isActive ? 'vô hiệu hóa' : 'kích hoạt'
  //     if (confirm(`Bạn có chắc chắn muốn ${action} bác sĩ này?`)) {
  //       await updateUser(doctor.userId || doctor.id, { isActive: !doctor.isActive } as any)
  //       await mutate()
  //       toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} bác sĩ thành công`)
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.message || 'Có lỗi xảy ra')
  //   }
  // }

  return (
    <AdminLayout 
      title="Quản lý bác sĩ"
    >
      <Card>
        {/* Filters */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#92D7EE]"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>
            
            {/* Specialty filter */}
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
                className="appearance-none w-full min-w-[150px] pl-4 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#92D7EE] cursor-pointer"
              >
                {specialtyOptions.map((specialty: {value: string, label: string}) => (
                  <option key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* More filters button */}
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
                <th className="py-4 px-6 text-left font-medium">Trạng thái</th>
                <th className="py-4 px-6 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loadingDoctors ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <LoadingSpinner size="lg" />
                  </td>
                </tr>
              ) : !rawDoctors?.length ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Không tìm thấy bác sĩ nào
                  </td>
                </tr>
              ) : (
                (() => {
                  const total = rawDoctors?.length || 0
                  const totalPages = Math.max(1, Math.ceil(total / limit))
                  const start = (currentPage - 1) * limit
                  const end = start + limit
                  const paginatedDoctors = rawDoctors?.slice(start, end) || []

                  return paginatedDoctors.map((doctor: any) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#92D7EE]/20 flex items-center justify-center">
                            <img
                              src={doctor.image || '/images/doctor/default.png'}
                              alt={doctor.name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://placehold.co/40x40';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-gray-500 text-xs">ID: #{doctor.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{doctor.email}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {doctor.specialtyName || 'Chưa cập nhật'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {doctor.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">Kích hoạt</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">Vô hiệu hóa</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-gray-700"
                            onClick={() => handleOpenEditModal(doctor)}
                          >
                            Chi tiết
                          </Button>

                          {/* <Button 
                            variant="outline" 
                            size="sm"
                            className={
                              doctor.isActive
                                ? 'text-red-600 border-red-600 hover:bg-red-50'
                                : 'text-green-600 border-green-600 hover:bg-green-50'
                            }
                            onClick={() => handleToggleStatus(doctor)}
                          >
                            {doctor.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          </Button> */}
                          
                        </div>
                      </td>
                    </tr>
                  ))
                })()
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {rawDoctors ? (
                (() => {
                  const total = rawDoctors?.length || 0
                  const start = total === 0 ? 0 : Math.min((currentPage - 1) * limit + 1, total)
                  const end = Math.min(currentPage * limit, total)
                  return `Hiển thị ${start}-${end} trong số ${total} bác sĩ`
                })()
              ) : (
                'Không có bác sĩ nào'
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trước
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700"
                disabled={currentPage >= Math.ceil((rawDoctors?.length || 0) / limit)}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Tiếp
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {editingDoctor && (
        <EditDoctorModal
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          doctor={editingDoctor}
          onSubmit={handleUpdateDoctor}
        />
      )}
    </AdminLayout>
  )
}