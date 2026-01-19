'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              مشوار
            </Link>
            <span className="ml-2 text-sm text-gray-500">Mishwar</span>
          </div>

          <div className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              الرئيسية
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-primary-600">
              البحث
            </Link>
            <Link href="/resources" className="text-gray-700 hover:text-primary-600">
              الموارد
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary-600"
                >
                  لوحة التحكم
                </Link>
                <Link
                  href="/projects"
                  className="text-gray-700 hover:text-primary-600"
                >
                  المشاريع
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-primary-600"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block text-gray-700 hover:text-primary-600">
              الرئيسية
            </Link>
            <Link href="/search" className="block text-gray-700 hover:text-primary-600">
              البحث
            </Link>
            <Link href="/resources" className="block text-gray-700 hover:text-primary-600">
              الموارد
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block text-gray-700 hover:text-primary-600">
                  لوحة التحكم
                </Link>
                <Link href="/projects" className="block text-gray-700 hover:text-primary-600">
                  المشاريع
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-right text-red-500"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="block text-gray-700 hover:text-primary-600">
                  تسجيل الدخول
                </Link>
                <Link href="/auth/signup" className="block text-gray-700 hover:text-primary-600">
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

