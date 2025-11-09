import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { Op } from 'sequelize'
import DB from '../../../lib/database/models'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
  const role = searchParams.get('role')
  const search = searchParams.get('search')

    const where: any = {
      // isActive: true 
    }
    

    if (role && role !== 'all') {
      where.role = role
    }
 
    
    if (search) {
      where[Op.or] = [
        {
          firstName: {
            [Op.like]: `%${search}%`
          }
        },
        {
          lastName: {
            [Op.like]: `%${search}%`
          }
        },
        {
          email: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    }

    const users = await DB.User.findAll({
      where,
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'role',
        'isActive',
        'createdAt'
      ],
      order: [['createdAt', 'ASC']]
    })

    return NextResponse.json({
      success: true,
      data: {
        users
      }
    })
  } catch (error: any) {
    console.error('User statistics error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi server',
        error: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    
    const requiredFields = ['email', 'password', 'firstName', 'lastName', 'role']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const existingUser = await DB.User.findOne({
      where: { email: data.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      )
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password.toString(), salt)

    const user = await DB.User.create({
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      role: data.role,
      isActive: true
    })

    // If role is doctor, create a doctor record
    if (data.role === 'DOCTOR') {
      await DB.Doctor.create({
        userId: user.id,
        specialtyId: data.specialtyId ? Number(data.specialtyId) : null,
        clinicId: data.clinicId ? Number(data.clinicId) : null,
        image: data.image || null,
        description: data.description || null,
        yearsOfExperience: 0,
        price: 0
      })
    }

    const { password, ...userWithoutPassword } = user.toJSON()

    return NextResponse.json({
      success: true,
      data: userWithoutPassword
    })
  } catch (error: any) {
    console.error('Create user error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
        error: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}