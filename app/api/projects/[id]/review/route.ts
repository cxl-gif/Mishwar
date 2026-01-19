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
    const { rating, comment } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'التقييم يجب أن يكون بين 1 و 5' },
        { status: 400 }
      )
    }

    // Get project
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

    if (project.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'يمكن التقييم فقط للمشاريع المكتملة' },
        { status: 400 }
      )
    }

    // Determine who is reviewing whom
    const reviewerId = session.user.id
    let reviewedId: string

    if (session.user.userType === 'COMPANY') {
      // Company reviewing freelance
      if (!project.freelancer) {
        return NextResponse.json(
          { error: 'لا يوجد موهبة مكلفة لهذا المشروع' },
          { status: 400 }
        )
      }
      reviewedId = project.freelancer.userId
    } else {
      // Freelance reviewing company
      reviewedId = project.clientId
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { projectId: params.id },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'تم التقييم بالفعل لهذا المشروع' },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        projectId: params.id,
        reviewerId,
        reviewedId,
        rating,
        comment: comment || null,
      },
    })

    // Update freelance rating if reviewing a freelance
    if (session.user.userType === 'COMPANY' && project.freelancer) {
      const freelance = await prisma.freelance.findUnique({
        where: { id: project.freelancer.id },
        include: {
          reviews: true,
        },
      })

      if (freelance) {
        const totalRating = freelance.reviews.reduce((sum, r) => sum + r.rating, 0)
        const averageRating = totalRating / freelance.reviews.length

        await prisma.freelance.update({
          where: { id: project.freelancer.id },
          data: {
            rating: averageRating,
            totalReviews: freelance.reviews.length,
          },
        })
      }
    }

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء التقييم' },
      { status: 500 }
    )
  }
}

