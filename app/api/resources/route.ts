import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const where: any = {
      published: true,
    }

    if (type && type !== 'all') {
      where.type = type
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الموارد' },
      { status: 500 }
    )
  }
}

