'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/stores/auth/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Loader2, Eye, EyeOff } from "lucide-react"

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Đăng nhập thành công!')
      const currentUser = useAuthStore.getState().user
      if (currentUser && currentUser.role === 'ADMIN') {
        router.push('/admin')
      } 
      else if (currentUser && currentUser.role === 'DOCTOR') {
        router.push('/doctor')
      } else {
        router.push('/')
      }
    } catch (error) {
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#58C9D7]"
    >
      <div className="max-w-md w-full space-y-8">
        
      
        
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Đăng nhập
            </CardTitle>
            <CardDescription>
              Đăng nhập vào tài khoản của bạn để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                  className="mt-1"
                  placeholder="Nhập email của bạn"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register('password', {
                      required: 'Mật khẩu là bắt buộc',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự'
                      }
                    })}
                    className="mt-1"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                variant='ghost'
                className="w-full bg-[#92D7EE] hover:bg-[#70c7e0] flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link href="/register" className="font-medium text-[#92D7EE] hover:text-[#70c7e0]">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}