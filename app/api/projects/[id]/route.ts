import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
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
        milestones: {
          orderBy: { createdAt: 'asc' },
        },
        messages: {
          include: {
            sender: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'لم يتم العثور على المشروع' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المشروع' },
      { status: 500 }
    )
  }
}

