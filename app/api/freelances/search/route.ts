import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('contentType')
    const location = searchParams.get('location')
    const minRating = searchParams.get('minRating')
    const maxRate = searchParams.get('maxRate')
    const search = searchParams.get('search')

    const where: any = {}

    if (contentType) {
      where.specialties = {
        has: contentType,
      }
    }

    if (location) {
      where.user = {
        location: {
          contains: location,
          mode: 'insensitive',
        },
      }
    }

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating),
      }
    }

    if (maxRate) {
      where.OR = [
        { hourlyRate: { lte: parseFloat(maxRate) } },
        { dailyRate: { lte: parseFloat(maxRate) } },
      ]
    }

    if (search) {
      where.user = {
        ...where.user,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    const freelances = await prisma.freelance.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
            location: true,
          },
        },
        portfolio: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
        skills: true,
        _count: {
          select: {
            projects: true,
            portfolio: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
      take: 50,
    })

    return NextResponse.json({ freelances })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء البحث' },
      { status: 500 }
    )
  }
}

