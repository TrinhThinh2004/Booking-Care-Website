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
    const { email, password, firstName, lastName, phone, address, gender } = body

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ success: false, message: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    // Check existing user
    const existing = await DB.User.findOne({ where: { email } })
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email đã được đăng ký' }, { status: 409 })
    }

    const salt = bcrypt.genSaltSync(10)
    const hashed = bcrypt.hashSync(password, salt)

    const user = await DB.User.create({
      email,
      password: hashed,
      firstName,
      lastName,
      phone: phone || null,
      address: address || null,
      gender: gender || null,
    })

    const payload = { id: user.id, email: user.email, role: user.role }
  const token = (jwt as any).sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    // Remove password before returning
    const safeUser = { ...user.toJSON() }
    delete safeUser.password

    return NextResponse.json({ success: true, message: 'Đăng ký thành công', data: { user: safeUser, token } })
  } catch (error: any) {
    console.error('Register error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}
