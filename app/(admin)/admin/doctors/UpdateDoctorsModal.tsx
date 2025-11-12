'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useSpecialties } from '@/lib/hooks/useSpecialties'
import { useClinics } from '@/lib/hooks/useClinics'
import { Modal } from '@/components/ui/Modal'

interface EditDoctorModalProps {
  doctor: any
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
}

export function EditDoctorModal({ doctor, isOpen, onClose, onSubmit }: EditDoctorModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState(doctor?.image || '')
  const [name, setName] = useState(doctor?.name || '')
  const [specialtyId, setSpecialtyId] = useState(doctor?.specialtyId || '')
  const [clinicId, setClinicId] = useState(doctor?.clinicId || '')
  const [description, setDescription] = useState(doctor?.description || '')
  const [yearsOfExperience, setYearsOfExperience] = useState(doctor?.yearsOfExperience ?? 0)

  const { data: specialties } = useSpecialties()
  const { data: clinics } = useClinics()


  useEffect(() => {
    if (doctor) {
      setPreview(doctor.image || '')
      setName(doctor.name || '')
      setSpecialtyId(doctor.specialtyId || '')
      setClinicId(doctor.clinicId || '')
      setDescription(doctor.description || '')
      setYearsOfExperience(doctor.yearsOfExperience ?? 0)
    }
  }, [doctor])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('id', String(doctor.id))
      formData.append('name', name)
      formData.append('specialtyId', String(specialtyId))
      formData.append('clinicId', String(clinicId))
      formData.append('description', description)
      formData.append('yearsOfExperience', String(yearsOfExperience))
      if ((e.currentTarget.elements.namedItem('image') as HTMLInputElement)?.files?.[0]) {
        formData.append('image', (e.currentTarget.elements.namedItem('image') as HTMLInputElement).files![0])
      }

      await onSubmit(formData)
      onClose()
    } finally {
      setSubmitting(false)
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

  if (!doctor) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sửa thông tin bác sĩ">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên bác sĩ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-[#92D7EE] focus:outline-none text-sm"
              placeholder="Nhập tên bác sĩ"
            />
          </div>

          <div>
            <label htmlFor="specialtyId" className="block text-sm font-medium text-gray-700">
              Chuyên khoa <span className="text-red-500">*</span>
            </label>
            <select
              name="specialtyId"
              id="specialtyId"
              value={specialtyId}
              onChange={(e) => setSpecialtyId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-[#92D7EE] focus:outline-none text-sm"
              required
            >
              <option value="">-- Chọn chuyên khoa --</option>
              {Array.isArray(specialties) && specialties.map((specialty: any) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="clinicId" className="block text-sm font-medium text-gray-700">
              Phòng khám
            </label>
            <select
              name="clinicId"
              id="clinicId"
              value={clinicId}
              onChange={(e) => setClinicId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-[#92D7EE] focus:outline-none text-sm"
            >
              <option value="">-- Chọn phòng khám --</option>
             
              {clinics?.clinics?.map((clinic: any) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-[#92D7EE] focus:outline-none text-sm"
              placeholder="Nhập mô tả về bác sĩ..."
            />
          </div>

          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
              Số năm kinh nghiệm
            </label>
            <input
              type="number"
              name="yearsOfExperience"
              id="yearsOfExperience"
              min={0}
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-[#92D7EE] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
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
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Hủy bỏ
          </Button>
          <Button 
            type="submit"
            className="bg-[#92D7EE] hover:bg-[#92D7EE]/90 text-black"
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner size="sm" /> : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
