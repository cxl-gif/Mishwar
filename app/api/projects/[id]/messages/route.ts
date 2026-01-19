import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
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

    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'محتوى الرسالة مطلوب' },
        { status: 400 }
      )
    }

    // Get project to find receiver
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        freelancer: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'لم يتم العثور على المشروع' },
        { status: 404 }
      )
    }

    // Determine receiver
    const receiverId =
      session.user.id === project.clientId
        ? project.freelancer?.userId
        : project.clientId

    if (!receiverId) {
      return NextResponse.json(
        { error: 'لا يمكن إرسال الرسالة' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        projectId: params.id,
        senderId: session.user.id,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    )
  }
}

