'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Resource {
  id: string
  title: string
  description: string
  content: string
  type: string
  category: string | null
  views: number
  createdAt: string
}

export default function ResourceDetailPage() {
  const params = useParams()
  const [resource, setResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResource()
  }, [params.id])

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/resources/${params.id}`)
      const data = await response.json()
      setResource(data.resource)
    } catch (error) {
      console.error('Error fetching resource:', error)
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

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">لم يتم العثور على المورد</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/resources" className="text-primary-600 hover:underline mb-4 inline-block">
          ← العودة إلى الموارد
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {resource.type}
            </span>
            {resource.category && (
              <span className="mr-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {resource.category}
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{resource.title}</h1>
          <p className="text-gray-600 mb-6">{resource.description}</p>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: resource.content }} />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <span>{resource.views} مشاهدة</span>
            <span className="mr-4">
              {new Date(resource.createdAt).toLocaleDateString('ar')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

