import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
    })

    if (!resource || !resource.published) {
      return NextResponse.json(
        { error: 'لم يتم العثور على المورد' },
        { status: 404 }
      )
    }

    // Increment views
    await prisma.resource.update({
      where: { id: params.id },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ resource })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المورد' },
      { status: 500 }
    )
  }
}

