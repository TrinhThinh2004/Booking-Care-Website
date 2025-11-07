import { useState } from 'react'
import { updateUser } from '@/lib/api/users'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  role: string
  isActive: boolean
}

interface UpdateUserFormProps {
  user: User
  onSuccess?: () => void
  onCancel?: () => void
}

export function UpdateUserForm({ user, onSuccess, onCancel }: UpdateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const roles = [
    { value: 'PATIENT', label: 'Bệnh nhân' },
    { value: 'DOCTOR', label: 'Bác sĩ' },
    { value: 'ADMIN', label: 'Quản trị viên' },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const newRole = formData.get('role') as string

     

      await updateUser(user.id, {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        phone: formData.get('phone') as string,
        role: newRole,
      })
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Họ
          </label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            defaultValue={user.firstName}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Tên
          </label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            defaultValue={user.lastName}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="mt-1 bg-gray-50"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Số điện thoại
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={user.phone || ''}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Vai trò
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue={user.role}
          disabled={user.role === 'ADMIN'}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE] sm:text-sm rounded-md ${
            user.role === 'ADMIN' ? 'bg-gray-50 cursor-not-allowed' : ''
          }`}
        >
          {roles.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
       
      </div>

      {/* <div>
        <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
          Trạng thái
        </label>
        <select
          id="isActive"
          name="isActive"
          required
          defaultValue={user.isActive.toString()}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE] sm:text-sm rounded-md"
        >
          <option value="true">Đang hoạt động</option>
          <option value="false">Đã vô hiệu hóa</option>
        </select>
      </div> */}

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#92D7EE] hover:bg-[#92D7EE]/90"
        >
          {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </div>
    </form>
  )
}