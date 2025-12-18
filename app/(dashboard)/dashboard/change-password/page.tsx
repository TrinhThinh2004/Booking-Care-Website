"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react'
import DashboardLayout from '../DashboardLayout'
import { useAuthStore } from '@/stores/auth/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

export default function ChangePasswordPage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!user?.id) {
    return (
      <DashboardLayout title="Đổi mật khẩu">
        <div className="p-4 text-red-600">Vui lòng đăng nhập để thực hiện chức năng này.</div>
      </DashboardLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error('Vui lòng điền đầy đủ các trường')
    if (newPassword !== confirmPassword) return toast.error('Mật khẩu mới và xác nhận không khớp')
    if (newPassword.length < 6) return toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
    if (currentPassword === newPassword) return toast.error('Mật khẩu mới không được trùng với mật khẩu cũ')

    setSubmitting(true)
    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Đổi mật khẩu thất bại')

      toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
      if (typeof logout === 'function') await logout()
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout title="Đổi mật khẩu">
      <div className="w-full max-w-5xl py-4">
        
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
       
          <div className="md:col-span-2">
            <Card className="bg-white shadow-sm border border-gray-200 h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <KeyRound className="w-5 h-5 text-[#92D7EE]" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">Cập nhật mật khẩu</CardTitle>
                </div>
                <CardDescription>Nhập mật khẩu hiện tại và mật khẩu mới.</CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
               
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <Input
                        type={showCurrent ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Nhập mật khẩu đang sử dụng"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                      >
                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

              
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                      <div className="relative">
                        <Input
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Ít nhất 6 ký tự"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                      <div className="relative">
                        <Input
                          type={showConfirm ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu mới"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-start">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#92D7EE] hover:bg-[#7bcce8] text-gray-900 font-medium px-6"
                    >
                      {submitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xử lý...</>
                      ) : (
                        'Đổi mật khẩu'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>


          <div className="md:col-span-1">
          
            <Card className="bg-blue-50/30 border-blue-100 shadow-none h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                   
                   <div className="p-2 bg-blue-50 rounded-full">
                      <ShieldCheck className="w-5 h-5 text-[#92D7EE]" />
                   </div>
                  <CardTitle className="text-lg font-bold text-gray-900">Lưu ý bảo mật</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-[#92D7EE] shrink-0" />
                  <p>Mật khẩu mạnh nên có ít nhất 6 ký tự, bao gồm cả chữ và số.</p>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-[#92D7EE] shrink-0" />
                  <p>Không sử dụng mật khẩu dễ đoán như ngày sinh, số điện thoại.</p>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-[#92D7EE] shrink-0" />
                  <p>Để đảm bảo an toàn, hệ thống sẽ yêu cầu bạn đăng nhập lại sau khi đổi mật khẩu thành công.</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}