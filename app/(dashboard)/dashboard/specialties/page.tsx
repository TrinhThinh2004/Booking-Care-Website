'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { useSpecialties } from '@/lib/hooks/useSpecialties'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import DashboardLayout from '../DashboardLayout'

export default function FindDoctor() {
  const { data: specialties, isLoading } = useSpecialties()
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null)

  if (isLoading) {
    return (
      <DashboardLayout title="Tìm bác sĩ">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Tìm bác sĩ">
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Chọn chuyên khoa
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(specialties || []).map((specialty: any) => (
              <button
                key={specialty.id}
                onClick={() => setSelectedSpecialty(specialty.id)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  selectedSpecialty === specialty.id
                    ? 'border-[#92D7EE] bg-[#92D7EE]/10'
                    : 'border-gray-200 hover:border-[#92D7EE] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={specialty.image || '/images/specialty/default.png'}
                      alt={specialty.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {specialty.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {specialty.doctorCount || 0} bác sĩ
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {selectedSpecialty && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Danh sách bác sĩ
            </h2>
            {/* TODO: Add doctors list by specialty */}
            <p className="text-gray-500 text-center py-8">
              Chức năng đang được phát triển...
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}