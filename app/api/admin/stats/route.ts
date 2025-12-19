import { NextResponse, NextRequest } from 'next/server'
import DB from '@/lib/database/models'

export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`

    // total users
    const totalUsers = await DB.User.count()

    // total clinics
    const totalClinics = await DB.Clinic.count()

    // total doctors
    const totalDoctors = await DB.Doctor.count()

    // active doctors (based on associated user.isActive if exists)
    let activeDoctors = 0
    try {
      const activeDocs = await DB.Doctor.findAll({ include: [{ model: DB.User, as: 'user', where: { isActive: true }, attributes: ['id'] }] })
      activeDoctors = (activeDocs || []).length
    } catch (e) {
      // fallback to counting doctors (if association query fails)
      activeDoctors = totalDoctors
    }

    // bookings today
    const todayBookings = await DB.Booking.count({ where: { date: dateStr } })

    // bookings by status
    const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    const bookingsByStatus: Record<string, number> = {}
    for (const s of statuses) {
      bookingsByStatus[s] = await DB.Booking.count({ where: { status: s } })
    }

    // recent bookings
    const recentBookings = await DB.Booking.findAll({
      order: [['createdAt', 'DESC']],
      limit: 6,
      include: [
        { model: DB.User, as: 'patient', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: DB.Doctor, as: 'doctor', include: [{ model: DB.User, as: 'user', attributes: ['firstName', 'lastName'] }] },
      ],
    })

    return NextResponse.json({
      success: true,
      message: 'Admin stats fetched',
      data: {
        totalUsers,
        totalClinics,
        totalDoctors,
        activeDoctors,
        todayBookings,
        bookingsByStatus,
        recentBookings,
      },
    })
  } catch (error: any) {
    console.error('Get admin stats error:', error)
    return NextResponse.json({ success: false, message: 'Lỗi server', error: error?.message || String(error) }, { status: 500 })
  }
}
