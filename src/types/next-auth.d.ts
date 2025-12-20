import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    role: string
    hasProfile: boolean
  }

  interface Session {
    user: {
      id: string
      email: string
      role: string
      hasProfile: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    hasProfile: boolean
  }
}

