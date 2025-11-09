import { useState } from 'react'
import { createUser } from '@/lib/api/users'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSpecialties } from '@/lib/hooks/useSpecialties'
import { useClinics } from '@/lib/hooks/useClinics'

interface Specialty {
  id: string
  name: string
}

interface Clinic {
  id: string
  name: string
}

interface CreateUserFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState('PATIENT')
  const [image, setImage] = useState<File | null>(null)
  const { data: specialties } = useSpecialties() as { data: Specialty[] }
  const { data } = useClinics()
  const clinics = data?.clinics || []

  const roles = [
    { value: 'PATIENT', label: 'Bệnh nhân' },
    { value: 'DOCTOR', label: 'Bác sĩ' },
    // { value: 'ADMIN', label: 'Quản trị viên' },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      let imagePath: string | undefined

      // If doctor, upload image first to the dedicated multer endpoint
      if (selectedRole === 'DOCTOR' && image) {
        const imgForm = new FormData()
        imgForm.append('image', image)

        const uploadRes = await fetch('/api/multer/doctors', {
          method: 'POST',
          body: imgForm,
        })

        if (!uploadRes.ok) {
          const errText = await uploadRes.text()
          throw new Error(`Upload failed: ${errText}`)
        }

        const uploadData = await uploadRes.json()
        imagePath = uploadData.imagePath
      }

      const userData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        phone: formData.get('phone') as string,
        role: formData.get('role') as string,
        ...(selectedRole === 'DOCTOR' && {
          specialtyId: formData.get('specialtyId') as string,
          clinicId: formData.get('clinicId') as string,
          image: imagePath,
        })
      }

      await createUser(userData)
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
          name="email"
          type="email"
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mật khẩu
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1"
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
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="role" className=" block text-sm font-medium text-gray-700">
          Vai trò
        </label>
        <select
          id="role"
          name="role"
          required
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE] sm:text-sm rounded-md"
        >
          {roles.map(role => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      {selectedRole === 'DOCTOR' && (
        <>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
              Chuyên khoa
            </label>
            <select
              id="specialty"
              name="specialtyId"
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE] sm:text-sm rounded-md"
            >
              <option value="">Chọn chuyên khoa</option>
              {specialties?.map(specialty => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="clinic" className="block text-sm font-medium text-gray-700">
              Bệnh viện
            </label>
            <select
              id="clinic"
              name="clinicId"
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE] sm:text-sm rounded-md"
            >
              <option value="">Chọn bệnh viện</option>
              {clinics.map((clinic: Clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Ảnh đại diện
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-[#92D7EE] file:text-white
                hover:file:bg-[#92D7EE]/90"
            />
          </div>
        </>
      )}

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
          {isLoading ? 'Đang tạo...' : 'Tạo người dùng'}
        </Button>
      </div>
    </form>
  )
}