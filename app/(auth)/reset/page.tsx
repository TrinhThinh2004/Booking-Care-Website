"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Header } from '@/components/layout/Header'

interface Form {
  password: string
  confirmPassword: string
}

export default function ResetPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const search = useSearchParams()
  const token = search?.get('token') || ''
  const router = useRouter()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>()
  const passwordValue = watch('password', '')

  useEffect(() => {
    if (!token) {
      toast.error('Token không hợp lệ')
    }
  }, [token])

  const onSubmit = async (data: Form) => {
    if (data.password !== data.confirmPassword) return toast.error('Mật khẩu xác nhận không khớp')
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password: data.password }) })
      const j = await res.json()
      if (j.success) {
        toast.success('Đặt lại mật khẩu thành công')
        router.push('/login')
      } else {
        toast.error(j.message || 'Đặt lại thất bại')
      }
    } catch (err) {
      toast.error('Lỗi server')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#58C9D7]">
        <div className="max-w-md w-full space-y-8">
          <Card className="bg-white shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</CardTitle>
              <CardDescription>Nhập mật khẩu mới</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                  <div className="relative mt-1">
                    <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Tối thiểu 6 ký tự' } })} className="mt-1" placeholder="Mật khẩu mới" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                  <div className="relative mt-1">
                    <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} {...register('confirmPassword', { required: 'Xác nhận là bắt buộc', validate: v => v === passwordValue || 'Mật khẩu xác nhận không khớp' })} className="mt-1" placeholder="Nhập lại mật khẩu" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">{showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" variant="ghost" className="w-full bg-[#92D7EE] hover:bg-[#70c7e0] flex items-center gap-2" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Quay lại{' '}
                  <Link href="/login" className="font-medium text-[#92D7EE] hover:text-[#70c7e0]">Đăng nhập</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
