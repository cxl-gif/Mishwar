'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Freelance {
  id: string
  rating: number
  totalReviews: number
  hourlyRate: number | null
  dailyRate: number | null
  specialties: string[]
  experience: number | null
  availability: string | null
  languages: string[]
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
    bio: string | null
    location: string | null
  }
  portfolio: Array<{
    id: string
    title: string
    description: string | null
    type: string
    mediaUrl: string
    thumbnailUrl: string | null
    tags: string[]
  }>
  skills: Array<{
    id: string
    name: string
    level: number
  }>
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    reviewer: {
      name: string
    }
    createdAt: string
  }>
  _count: {
    projects: number
    portfolio: number
  }
}

export default function FreelanceProfilePage() {
  const params = useParams()
  const [freelance, setFreelance] = useState<Freelance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFreelance()
  }, [params.id])

  const fetchFreelance = async () => {
    try {
      const response = await fetch(`/api/freelances/${params.id}`)
      const data = await response.json()
      setFreelance(data.freelance)
    } catch (error) {
      console.error('Error fetching freelance:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!freelance) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">لم يتم العثور على الملف الشخصي</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600">
              {freelance.user.avatar ? (
                <img
                  src={freelance.user.avatar}
                  alt={freelance.user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                freelance.user.name.charAt(0)
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{freelance.user.name}</h1>
              {freelance.user.location && (
                <p className="text-gray-600 mb-4">📍 {freelance.user.location}</p>
              )}
              {freelance.user.bio && (
                <p className="text-gray-700 mb-4">{freelance.user.bio}</p>
              )}
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-2xl">⭐</span>
                  <span className="mr-2 text-xl font-semibold">
                    {freelance.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({freelance.totalReviews} تقييم)
                  </span>
                </div>
                {freelance.hourlyRate && (
                  <span className="text-primary-600 font-semibold text-lg">
                    {freelance.hourlyRate} MAD/ساعة
                  </span>
                )}
                {freelance.dailyRate && (
                  <span className="text-gray-600">
                    {freelance.dailyRate} MAD/يوم
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`/projects/new?freelanceId=${freelance.id}`}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-semibold"
            >
              توظيف
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Specialties */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">التخصصات</h2>
              <div className="flex flex-wrap gap-2">
                {freelance.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills */}
            {freelance.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">المهارات</h2>
                <div className="space-y-3">
                  {freelance.skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                المعرض ({freelance.portfolio.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {freelance.portfolio.map((item) => (
                  <div key={item.id} className="border rounded-lg overflow-hidden">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">لا توجد صورة</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {freelance.reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">التقييمات</h2>
                <div className="space-y-4">
                  {freelance.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{review.reviewer.name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600">{review.comment}</p>
                      )}
                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString('ar')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">معلومات إضافية</h3>
              <div className="space-y-3">
                {freelance.experience && (
                  <div>
                    <span className="text-gray-600">الخبرة: </span>
                    <span className="font-medium">{freelance.experience} سنوات</span>
                  </div>
                )}
                {freelance.availability && (
                  <div>
                    <span className="text-gray-600">الحالة: </span>
                    <span className="font-medium">{freelance.availability}</span>
                  </div>
                )}
                {freelance.languages.length > 0 && (
                  <div>
                    <span className="text-gray-600">اللغات: </span>
                    <span className="font-medium">{freelance.languages.join(', ')}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">المشاريع المكتملة: </span>
                  <span className="font-medium">{freelance._count.projects}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

