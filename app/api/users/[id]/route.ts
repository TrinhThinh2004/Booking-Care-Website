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
    
    const allowedFields = ['firstName', 'lastName', 'phone', 'role']
    const updateData = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = data[key]
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


    await user.update({ isActive: false })

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