'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../AdminLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import { ChevronDown, Search, Filter, Plus } from 'lucide-react'
import { useUsers } from '@/lib/hooks/useUsers'
import { CreateUserForm } from '@/app/(admin)/admin/users/CreateUserForm'
import { UpdateUserForm } from '@/app/(admin)/admin/users/UpdateUserForm'
import { updateUser, deleteUser } from '@/lib/api/users'
import { toast } from 'react-hot-toast'
interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  role: string
  isActive: boolean
  createdAt: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}



export default function UsersPage() {
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const roles = [
    { value: 'all', label: 'Tất cả' },
    { value: 'PATIENT', label: 'Bệnh nhân' },
    { value: 'DOCTOR', label: 'Bác sĩ' },
    { value: 'ADMIN', label: 'Quản trị viên' },
  ]

  const { data, isLoading, error, mutate } = useUsers({
    role: selectedRole !== 'all' ? selectedRole : undefined,
    search: searchQuery || undefined,
    clientSideFilter: true // Enable client-side filtering
  })

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    setCurrentPage(1)
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
    mutate()
    toast.success('Thêm người dùng  thành công')
  }

  const handleUpdateSuccess = () => {
    setSelectedUser(null)
    mutate()
    toast.success('Cập nhật thông tin thành công')
  }

  if (error) {
    return (
      <AdminLayout title="Quản lý người dùng">
        <div className="p-4 text-red-500">
          Đã xảy ra lỗi: {error.message}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Quản lý người dùng"
      actions={
        <Button 
          className="bg-[#92D7EE] hover:bg-[#92D7EE]/90"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      }
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
                    setCurrentPage(1) // Reset to first page when searching
                  }}
                />
              </div>
            </div>
            
            {/* Role filter */}
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value)
                  setCurrentPage(1) // Reset to first page when changing role
                }}
                className="appearance-none w-full min-w-[150px] pl-4 pr-10 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#92D7EE] cursor-pointer"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
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
                <th className="py-4 px-6 text-left font-medium">Tên</th>
                <th className="py-4 px-6 text-left font-medium">Email</th>
                <th className="py-4 px-6 text-left font-medium">Số điện thoại</th>
                <th className="py-4 px-6 text-left font-medium">Vai trò</th>
                <th className="py-4 px-6 text-left font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <LoadingSpinner size="lg" />
                  </td>
                </tr>
              ) : !data?.users?.length ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                // Client-side pagination: slice the full users array
                (() => {
                  const total = data?.users?.length || 0
                  const totalPages = Math.max(1, Math.ceil(total / limit))
                  const start = (currentPage - 1) * limit
                  const end = start + limit
                  const paginatedUsers = data?.users?.slice(start, end) || []

                  return paginatedUsers.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-gray-600">{user.phone || '-'}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role === 'DOCTOR' ? 'bg-green-50 text-green-700' : 
                          user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' :
                          'bg-blue-50 text-blue-700'}`}>
                        {user.role === 'DOCTOR' ? 'Bác sĩ' : 
                         user.role === 'ADMIN' ? 'Quản trị viên' : 'Bệnh nhân'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-gray-700"
                          onClick={() => setSelectedUser(user)}
                        >
                          Chi tiết
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={async () => {
                            if (confirm('Bạn có chắc chắn muốn vô hiệu hóa người dùng này?')) {
                              try {
                                await deleteUser(user.id)
                                await mutate()
                                toast.success('Xóa người dùng thành công')
                              } catch (error: any) {
                                toast.error(error?.message || 'Có lỗi xảy ra khi xóa người dùng')
                              }
                            }
                          }}
                        >
                          Xóa
                        </Button>
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
              {data?.users ? (
                (() => {
                  const total = data?.users?.length || 0
                  const start = total === 0 ? 0 : Math.min((currentPage - 1) * limit + 1, total)
                  const end = Math.min(currentPage * limit, total)
                  return `Hiển thị ${start}-${end} trong số ${total} người dùng`
                })()
              ) : (
                'Không có người dùng nào'
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700" 
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Trước
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700"
                disabled={data ? currentPage >= Math.ceil((data.users?.length || 0) / limit) : true}
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil((data?.users?.length || 0) / limit) || prev, prev + 1))}
              >
                Tiếp
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Create User Modal */}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Thêm người dùng mới"
      >
        <CreateUserForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Update User Modal */}
      <Modal
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        title="Cập nhật thông tin người dùng"
      >
        {selectedUser && (
          <UpdateUserForm
            user={selectedUser}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setSelectedUser(null)}
          />
        )}
      </Modal>
    </AdminLayout>
  )
}