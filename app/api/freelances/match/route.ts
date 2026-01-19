import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const { contentType, budget, location, projectDescription } = body

    if (!contentType || !Array.isArray(contentType) || contentType.length === 0) {
      return NextResponse.json(
        { error: 'يجب تحديد نوع المحتوى المطلوب' },
        { status: 400 }
      )
    }

    // Find freelances matching criteria
    const freelances = await prisma.freelance.findMany({
      where: {
        specialties: {
          hasSome: contentType,
        },
        availability: {
          not: 'Unavailable',
        },
        ...(location && {
          user: {
            location: {
              contains: location,
              mode: 'insensitive',
            },
          },
        }),
        ...(budget && {
          OR: [
            { hourlyRate: { lte: budget } },
            { dailyRate: { lte: budget } },
          ],
        }),
      },
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
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        skills: true,
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true,
              },
            },
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            projects: true,
            portfolio: true,
          },
        },
      },
    })

    // Score and rank freelances
    const scoredFreelances = freelances.map((freelance) => {
      let score = 0

      // Rating score (0-50 points)
      score += freelance.rating * 10

      // Portfolio size score (0-20 points)
      score += Math.min(freelance._count.portfolio * 2, 20)

      // Projects completed score (0-20 points)
      score += Math.min(freelance._count.projects * 2, 20)

      // Review count score (0-10 points)
      score += Math.min(freelance.reviews.length * 2, 10)

      // Match specialties exactly
      const specialtyMatch = contentType.filter((type: string) =>
        freelance.specialties.includes(type)
      ).length
      score += specialtyMatch * 5

      return {
        ...freelance,
        matchScore: score,
      }
    })

    // Sort by match score
    scoredFreelances.sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({
      matches: scoredFreelances.slice(0, 10), // Top 10 matches
    })
  } catch (error) {
    console.error('Match error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء البحث عن المطابقات' },
      { status: 500 }
    )
  }
}

