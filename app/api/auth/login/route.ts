/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import DB from '../../../../lib/database/models'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Thiếu email hoặc mật khẩu' }, { status: 400 })
    }

    const user = await DB.User.findOne({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy người dùng' }, { status: 401 })
    }

    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
      return NextResponse.json({ success: false, message: 'Mật khẩu không đúng' }, { status: 401 })
    }

    const payload = { id: user.id, email: user.email, role: user.role }
    const token = (jwt as any).sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    const safeUser = { ...user.toJSON() }
    delete safeUser.password

    return NextResponse.json({ success: true, message: 'Đăng nhập thành công', data: { user: safeUser, token } })
  } catch (error: any) {
    console.error('Login error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}
