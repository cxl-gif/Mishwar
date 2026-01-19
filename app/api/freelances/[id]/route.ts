import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const freelance = await prisma.freelance.findUnique({
      where: { id: params.id },
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
          orderBy: { createdAt: 'desc' },
        },
        skills: {
          orderBy: { level: 'desc' },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true,
              },
            },
          },
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

    if (!freelance) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الملف الشخصي' },
        { status: 404 }
      )
    }

    return NextResponse.json({ freelance })
  } catch (error) {
    console.error('Error fetching freelance:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب البيانات' },
      { status: 500 }
    )
  }
}

