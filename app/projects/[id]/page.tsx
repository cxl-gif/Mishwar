'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Project {
  id: string
  title: string
  description: string
  status: string
  budget: number | null
  deadline: string | null
  createdAt: string
  freelancer: {
    id: string
    user: {
      name: string
      avatar: string | null
    }
  } | null
  milestones: Array<{
    id: string
    title: string
    description: string | null
    status: string
    dueDate: string | null
  }>
  messages: Array<{
    id: string
    content: string
    sender: {
      name: string
    }
    createdAt: string
  }>
}

export default function ProjectDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'milestones'>('overview')

  useEffect(() => {
    fetchProject()
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      const data = await response.json()
      setProject(data.project)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    try {
      const response = await fetch(`/api/projects/${params.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      })

      if (response.ok) {
        setMessage('')
        fetchProject()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">لم يتم العثور على المشروع</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">{project.title}</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                نظرة عامة
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'messages'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                الرسائل
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'milestones'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                المراحل
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">الوصف</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
                {project.budget && (
                  <div>
                    <h3 className="font-semibold mb-2">الميزانية</h3>
                    <p className="text-gray-600">{project.budget} MAD</p>
                  </div>
                )}
                {project.deadline && (
                  <div>
                    <h3 className="font-semibold mb-2">الموعد النهائي</h3>
                    <p className="text-gray-600">
                      {new Date(project.deadline).toLocaleDateString('ar')}
                    </p>
                  </div>
                )}
                {project.freelancer && (
                  <div>
                    <h3 className="font-semibold mb-2">الموهبة المكلفة</h3>
                    <p className="text-gray-600">{project.freelancer.user.name}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {project.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg ${
                        msg.sender.name === session?.user.name
                          ? 'bg-primary-100 mr-8'
                          : 'bg-gray-100 ml-8'
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{msg.sender.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(msg.createdAt).toLocaleString('ar')}
                        </span>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="mt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب رسالة..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                      إرسال
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="space-y-4">
                {project.milestones.length === 0 ? (
                  <p className="text-gray-600">لا توجد مراحل محددة</p>
                ) : (
                  project.milestones.map((milestone) => (
                    <div key={milestone.id} className="border-l-4 border-primary-600 pl-4">
                      <h4 className="font-semibold">{milestone.title}</h4>
                      {milestone.description && (
                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                      )}
                      {milestone.dueDate && (
                        <p className="text-gray-500 text-sm mt-1">
                          الموعد: {new Date(milestone.dueDate).toLocaleDateString('ar')}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

