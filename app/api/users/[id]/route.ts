import { NextResponse } from 'next/server'
import DB from '../../../../lib/database/models'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const user = await DB.User.findByPk(id, {
      attributes: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'role',
        'isActive',
        'createdAt'
      ]
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Force admin users to always show as active
    if (user.role === 'ADMIN') {
      user.isActive = true
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error: any) {
    console.error('Get user error:', error)
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const user = await DB.User.findByPk(id)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    

    if (user.role === 'ADMIN') {
      return NextResponse.json({
        success: true,
        data: { ...user.toJSON(), isActive: true }
      })
    }
    
    const allowedFields = ['firstName', 'lastName', 'phone', 'role', 'isActive']
    const updateData = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj: any, key) => {
        if (key === 'isActive') {
          const val = data[key]
          obj[key] = String(val) === 'true'
        } else {
          obj[key] = data[key]
        }
        return obj
      }, {})

    await user.update(updateData)

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error: any) {
    console.error('Update user error:', error)
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const user = await DB.User.findByPk(id)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    if (user.isActive) {
      await user.update({ isActive: false })
    }
    else if (!user.isActive) {
      await user.update({ isActive: true })
    }

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    })
  } catch (error: any) {
    console.error('Delete user error:', error)
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
