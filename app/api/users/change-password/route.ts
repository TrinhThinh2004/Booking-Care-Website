import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/database/models'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, currentPassword, newPassword } = body || {}

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: 'Thiếu dữ liệu bắt buộc' }, { status: 400 })
    }

    const user = await (db as any).User.findByPk(Number(userId))
    if (!user) {
      return NextResponse.json({ success: false, message: 'Người dùng không tồn tại' }, { status: 404 })
    }

    const match = await bcrypt.compare(String(currentPassword), String(user.password || ''))
    if (!match) {
      return NextResponse.json({ success: false, message: 'Mật khẩu hiện tại không đúng' }, { status: 401 })
    }

    if (String(newPassword).length < 6) {
      return NextResponse.json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(String(newPassword), salt)
    user.password = hashed
    await user.save()

    return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công' })
  } catch (err: any) {
    console.error('Change password error:', err)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: err?.message || String(err) }, { status: 500 })
  }
}
