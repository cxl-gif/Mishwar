'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Freelance {
  id: string
  rating: number
  totalReviews: number
  hourlyRate: number | null
  dailyRate: number | null
  specialties: string[]
  user: {
    id: string
    name: string
    avatar: string | null
    bio: string | null
    location: string | null
  }
  portfolio: any[]
  skills: any[]
  _count: {
    projects: number
    portfolio: number
  }
}

export default function SearchPage() {
  const [freelances, setFreelances] = useState<Freelance[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    contentType: '',
    location: '',
    minRating: '',
    maxRate: '',
    search: '',
  })

  useEffect(() => {
    fetchFreelances()
  }, [])

  const fetchFreelances = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.contentType) params.append('contentType', filters.contentType)
      if (filters.location) params.append('location', filters.location)
      if (filters.minRating) params.append('minRating', filters.minRating)
      if (filters.maxRate) params.append('maxRate', filters.maxRate)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/freelances/search?${params}`)
      const data = await response.json()
      setFreelances(data.freelances || [])
    } catch (error) {
      console.error('Error fetching freelances:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleSearch = () => {
    fetchFreelances()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">البحث عن المواهب</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المحتوى
              </label>
              <select
                value={filters.contentType}
                onChange={(e) => handleFilterChange('contentType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">الكل</option>
                <option value="VIDEO">فيديو</option>
                <option value="DESIGN">تصميم</option>
                <option value="MOTION_DESIGN">موشن جرافيك</option>
                <option value="PHOTOGRAPHY">تصوير</option>
                <option value="WRITING">كتابة</option>
                <option value="SOCIAL_MEDIA">وسائل التواصل</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="المدينة أو البلد"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأدنى للتقييم
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأقصى للسعر (MAD)
              </label>
              <input
                type="number"
                value={filters.maxRate}
                onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="ابحث بالاسم أو الوصف..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={handleSearch}
            className="mt-4 w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            بحث
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">جاري البحث...</p>
          </div>
        ) : freelances.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">لم يتم العثور على نتائج</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelances.map((freelance) => (
              <Link
                key={freelance.id}
                href={`/freelances/${freelance.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
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
                    <div className="mr-4">
                      <h3 className="text-xl font-semibold">{freelance.user.name}</h3>
                      <p className="text-gray-500 text-sm">{freelance.user.location}</p>
                    </div>
                  </div>

                  {freelance.user.bio && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{freelance.user.bio}</p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500">⭐</span>
                      <span className="mr-1 font-semibold">{freelance.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">
                        ({freelance.totalReviews} تقييم)
                      </span>
                    </div>
                    {freelance.hourlyRate && (
                      <span className="text-primary-600 font-semibold">
                        {freelance.hourlyRate} MAD/ساعة
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelance.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-gray-500">
                    {freelance._count.portfolio} مشروع في المعرض • {freelance._count.projects} مشروع مكتمل
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

