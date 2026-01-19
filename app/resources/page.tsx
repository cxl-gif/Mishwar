'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Resource {
  id: string
  title: string
  description: string
  type: string
  category: string | null
  views: number
  createdAt: string
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchResources()
  }, [filter])

  const fetchResources = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? `?type=${filter}` : ''
      const response = await fetch(`/api/resources${params}`)
      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeText = (type: string) => {
    const texts: Record<string, string> = {
      Tutorial: 'درس',
      Insight: 'رؤية',
      Guide: 'دليل',
    }
    return texts[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">الموارد والتدريب</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'Tutorial', 'Insight', 'Guide'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg ${
                  filter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'الكل' : getTypeText(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Resources List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">لا توجد موارد متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Link
                key={resource.id}
                href={`/resources/${resource.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="mb-4">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {getTypeText(resource.type)}
                  </span>
                  {resource.category && (
                    <span className="mr-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {resource.category}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{resource.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{resource.views} مشاهدة</span>
                  <span>{new Date(resource.createdAt).toLocaleDateString('ar')}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

