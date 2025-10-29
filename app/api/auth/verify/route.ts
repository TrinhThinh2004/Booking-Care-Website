/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import DB from '../../../../lib/database/models'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization') || ''
    if (!auth.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token không hợp lệ' }, { status: 401 })
    }

    const token = auth.replace('Bearer ', '')
    let payload: any
    try {
      payload = (jwt as any).verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' }, { status: 401 })
    }

    const user = await DB.User.findByPk(payload.id)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Người dùng không tồn tại' }, { status: 401 })
    }

    const safeUser = { ...user.toJSON() }
    delete safeUser.password

    return NextResponse.json({ success: true, message: 'Token hợp lệ', data: { user: safeUser } })
  } catch (error: any) {
    console.error('Verify error', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}
