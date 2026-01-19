import { UserType } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      userType: UserType
      company?: {
        id: string
        companyName: string
      }
      freelance?: {
        id: string
        rating: number
        totalReviews: number
      }
    }
  }

  interface User {
    userType: UserType
    company?: any
    freelance?: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType: UserType
    company?: any
    freelance?: any
  }
}

