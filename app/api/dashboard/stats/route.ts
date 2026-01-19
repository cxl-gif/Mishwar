import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    if (session.user.userType === 'COMPANY') {
      const company = await prisma.company.findUnique({
        where: { userId },
        include: {
          _count: {
            select: {
              projects: true,
            },
          },
        },
      })

      return NextResponse.json({
        projects: company?._count.projects || 0,
        portfolio: 0,
        reviews: 0,
      })
    } else {
      const freelance = await prisma.freelance.findUnique({
        where: { userId },
        include: {
          _count: {
            select: {
              projects: true,
              portfolio: true,
            },
          },
          reviews: {
            select: {
              id: true,
            },
          },
        },
      })

      return NextResponse.json({
        projects: freelance?._count.projects || 0,
        portfolio: freelance?._count.portfolio || 0,
        reviews: freelance?.reviews.length || 0,
      })
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    )
  }
}

