import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {}

    if (session.user.userType === 'COMPANY') {
      where.clientId = session.user.id
    } else {
      where.freelancerId = session.user.freelance?.id
    }

    if (status && status !== 'all') {
      where.status = status
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        client: {
          select: {
            name: true,
          },
        },
        freelancer: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المشاريع' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.userType !== 'COMPANY') {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, contentType, budget, deadline, freelancerId } = body

    if (!title || !description || !contentType) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        contentType: Array.isArray(contentType) ? contentType : [contentType],
        budget: budget ? parseFloat(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
        clientId: session.user.id,
        freelancerId: freelancerId || null,
        status: freelancerId ? 'IN_PROGRESS' : 'PENDING',
      },
      include: {
        client: true,
        freelancer: {
          include: {
            user: true,
          },
        },
      },
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المشروع' },
      { status: 500 }
    )
  }
}

