/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import DB from '../../../../lib/database/models'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json({ success: false, message: 'Thiếu token hoặc mật khẩu' }, { status: 400 })
    }

    let payload: any
    try {
      payload = (jwt as any).verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' }, { status: 400 })
    }

    if (!payload || payload.action !== 'reset' || !payload.id) {
      return NextResponse.json({ success: false, message: 'Token không hợp lệ' }, { status: 400 })
    }

    const user = await DB.User.findByPk(payload.id)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Người dùng không tồn tại' }, { status: 404 })
    }

    const salt = bcrypt.genSaltSync(10)
    const hashed = bcrypt.hashSync(password, salt)
    await user.update({ password: hashed })

    return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công' })
  } catch (error: any) {
    console.error('Reset password error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 })
  }
}
