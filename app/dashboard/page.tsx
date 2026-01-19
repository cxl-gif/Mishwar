'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    projects: 0,
    portfolio: 0,
    reviews: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isCompany = session.user.userType === 'COMPANY'
  const isFreelance = session.user.userType === 'FREELANCE'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          مرحباً، {session.user.name}
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">المشاريع</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.projects}</p>
          </div>
          {isFreelance && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-600 mb-2">المعرض</h3>
                <p className="text-3xl font-bold text-secondary-500">{stats.portfolio}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-600 mb-2">التقييمات</h3>
                <p className="text-3xl font-bold text-green-600">{stats.reviews}</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">إجراءات سريعة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isCompany && (
              <>
                <Link
                  href="/search"
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition text-center"
                >
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="font-semibold">البحث عن مواهب</div>
                </Link>
                <Link
                  href="/projects/new"
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition text-center"
                >
                  <div className="text-3xl mb-2">➕</div>
                  <div className="font-semibold">مشروع جديد</div>
                </Link>
              </>
            )}
            {isFreelance && (
              <>
                <Link
                  href="/dashboard/portfolio"
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition text-center"
                >
                  <div className="text-3xl mb-2">🎨</div>
                  <div className="font-semibold">إدارة المعرض</div>
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition text-center"
                >
                  <div className="text-3xl mb-2">👤</div>
                  <div className="font-semibold">تعديل الملف الشخصي</div>
                </Link>
              </>
            )}
            <Link
              href="/projects"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition text-center"
            >
              <div className="text-3xl mb-2">📋</div>
              <div className="font-semibold">المشاريع</div>
            </Link>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">المشاريع الأخيرة</h2>
          <Link href="/projects" className="text-primary-600 hover:underline">
            عرض الكل →
          </Link>
        </div>
      </div>
    </div>
  )
}

