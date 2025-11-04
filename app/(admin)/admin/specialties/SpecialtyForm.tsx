'use client'

import { useState, useEffect } from 'react'
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner'

interface SpecialtyFormProps {
  initialData?: {
    id?: number
    name: string
    description: string
    image?: string
  }
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
}

export function SpecialtyForm({ initialData, onSubmit, onCancel }: SpecialtyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState(initialData?.image || '')
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setDescription(initialData.description || '')
      setPreview(initialData.image || '')
    } else {
      setName('')
      setDescription('')
      setPreview('')
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      
      if (!formData.get('name')) {
        formData.set('name', name)
      }
      if (!formData.get('description')) {
        formData.set('description', description)
      }
      
      await onSubmit(formData)

      if (!initialData) {
        setName('')
        setDescription('')
        setPreview('')
        form.reset()
      }
    } catch (error) {
      console.error('Form submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Tên chuyên khoa <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE]"
          placeholder="Nhập tên chuyên khoa"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#92D7EE] focus:border-[#92D7EE]"
          placeholder="Nhập mô tả chuyên khoa"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Hình ảnh
        </label>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#92D7EE] file:text-black hover:file:bg-[#F7D800]"
        />
        {preview && (
          <div className="mt-2">
            <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded border border-gray-200" />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-black bg-[#92D7EE] rounded-md hover:bg-[#F7D800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#92D7EE] disabled:opacity-50 disabled:cursor-not-allowed"
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