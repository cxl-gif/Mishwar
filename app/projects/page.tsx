'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  status: string
  budget: number | null
  deadline: string | null
  createdAt: string
  freelancer: {
    user: {
      name: string
      avatar: string | null
    }
  } | null
  client: {
    name: string
  }
}

export default function ProjectsPage() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchProjects()
  }, [filter])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? `?status=${filter}` : ''
      const response = await fetch(`/api/projects${params}`)
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      REVIEW: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      PENDING: 'قيد الانتظار',
      IN_PROGRESS: 'قيد التنفيذ',
      REVIEW: 'قيد المراجعة',
      COMPLETED: 'مكتمل',
      CANCELLED: 'ملغي',
    }
    return texts[status] || status
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">المشاريع</h1>
          {session?.user.userType === 'COMPANY' && (
            <Link
              href="/projects/new"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-semibold"
            >
              مشروع جديد
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'PENDING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'الكل' : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">لا توجد مشاريع</p>
            {session?.user.userType === 'COMPANY' && (
              <Link
                href="/projects/new"
                className="text-primary-600 hover:underline"
              >
                إنشاء مشروع جديد
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition block"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{project.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusText(project.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    {project.freelancer && (
                      <span>
                        مع: {project.freelancer.user.name}
                      </span>
                    )}
                    {project.budget && (
                      <span>{project.budget} MAD</span>
                    )}
                  </div>
                  {project.deadline && (
                    <span>
                      الموعد النهائي: {new Date(project.deadline).toLocaleDateString('ar')}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

