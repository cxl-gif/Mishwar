import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      userType,
      companyName,
      phone,
      location,
    } = body

    // Validate required fields
    if (!name || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userType,
        phone: phone || null,
        location: location || null,
        ...(userType === 'COMPANY' && {
          company: {
            create: {
              companyName: companyName || name,
            },
          },
        }),
        ...(userType === 'FREELANCE' && {
          freelance: {
            create: {},
          },
        }),
      },
      include: {
        company: true,
        freelance: true,
      },
    })

    return NextResponse.json(
      {
        message: 'تم إنشاء الحساب بنجاح',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    )
  }
}

