"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'

interface Form {
  email: string
}

export default function ForgotPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Form>()

  const onSubmit = async (data: Form) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await res.json()
      if (j.success) {
        toast.success('Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.')
      } else {
        toast.error(j.message || 'Có lỗi xảy ra')
      }
    } catch (err) {
      toast.error('Lỗi gửi yêu cầu')
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
              <CardTitle className="text-2xl font-bold text-gray-900">Quên mật khẩu</CardTitle>
              <CardDescription>Nhập email để nhận hướng dẫn đặt lại mật khẩu</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <Input id="email" type="email" {...register('email', { required: 'Email là bắt buộc' })} className="mt-1" placeholder="Nhập email của bạn" />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <Button type="submit" variant="ghost" className="w-full bg-[#92D7EE] hover:bg-[#70c7e0] flex items-center gap-2" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? 'Đang gửi...' : 'Gửi hướng dẫn'}
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
