"use client"

import { useState, useEffect } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ClinicFormProps {
  initialData?: {
    id?: number
    name?: string
    address?: string
    phone?: string
    image?: string
    operatingHours?: string
    description?: string
    isActive?: boolean
  }
  onSubmit: (payload: any) => Promise<void>
  onCancel: () => void
}

export default function ClinicForm({ initialData, onSubmit, onCancel }: ClinicFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(initialData?.name || '')
  const [address, setAddress] = useState(initialData?.address || '')
  const [phone, setPhone] = useState(initialData?.phone || '')
  const [image, setImage] = useState(initialData?.image || '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(initialData?.image || '')
  const [operatingHours, setOperatingHours] = useState(initialData?.operatingHours || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive ?? true)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setAddress(initialData.address || '')
      setPhone(initialData.phone || '')
      setImage(initialData.image || '')
      setPreview(initialData.image || '')
      setOperatingHours(initialData.operatingHours || '')
      setDescription(initialData.description || '')
      setIsActive(initialData.isActive ?? true)
    } else {
      setName('')
      setAddress('')
      setPhone('')
      setImage('')
      setPreview('')
      setOperatingHours('')
      setDescription('')
      setIsActive(true)
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (!name?.trim()) {
        alert('Vui lòng nhập tên phòng khám')
        setIsSubmitting(false)
        return
      }

      // build FormData to support file upload. If no file selected, still send fields.
      const formData = new FormData()
      formData.append('name', name.trim())
      if (address) formData.append('address', address)
      if (phone) formData.append('phone', phone)
      if (operatingHours) formData.append('operatingHours', operatingHours)
      if (description) formData.append('description', description)
      formData.append('isActive', String(isActive))
      if (imageFile) {
        formData.append('image', imageFile)
      } else if (image) {
        // allow setting image as string URL/path
        formData.append('image', image)
      }

      await onSubmit(formData)

      if (!initialData) {
        setName('')
        setAddress('')
        setPhone('')
        setImage('')
        setPreview('')
        setOperatingHours('')
        setDescription('')
        setIsActive(true)
      }
    } catch (error) {
      console.error('Clinic form submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng khám <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE]"
          placeholder="Nhập tên phòng khám"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
        <input
          type="text"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE]"
          placeholder="Địa chỉ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE]"
          placeholder="Số điện thoại"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#92D7EE] file:text-black hover:file:bg-[#F7D800]"
        />
        <div className="mt-2 flex gap-2 items-center">
          
        </div>
        {preview && (
          <div className="mt-2">
            <img src={preview.startsWith('http') || preview.startsWith('/') ? preview : preview} alt="Preview" className="h-28 w-48 object-cover rounded border border-gray-200" onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x120')} />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Giờ hoạt động</label>
        <input
          type="text"
          name="operatingHours"
          value={operatingHours}
          onChange={(e) => setOperatingHours(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE]"
          placeholder="Ví dụ: 08:00 - 17:00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE]"
          placeholder="Mô tả ngắn về phòng khám"
        />
      </div>

      <div className="flex items-center gap-2">
        <input id="isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4" />
        <label htmlFor="isActive" className="text-sm text-gray-700">Đang hoạt động</label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-black bg-[#92D7EE] rounded-md hover:bg-[#F7D800] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Đang xử lý...
            </span>
          ) : (
            initialData ? 'Cập nhật' : 'Thêm mới'
          )}
        </button>
      </div>
    </form>
  )
}
