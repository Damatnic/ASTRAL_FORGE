import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 AUTH ATTEMPT:', {
          email: credentials?.email,
          hasPassword: !!credentials?.password,
        })

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { profile: true },
        })

        console.log('👤 USER LOOKUP:', {
          email: credentials.email,
          userExists: !!user,
          hasPasswordHash: !!user?.passwordHash,
        })

        if (!user || !user.passwordHash) {
          console.log('❌ User not found or no password hash')
          throw new Error('Invalid credentials')
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

        console.log('🔑 PASSWORD CHECK:', {
          email: credentials.email,
          isValid,
          passwordLength: credentials.password.length,
        })

        if (!isValid) {
          console.log('❌ Invalid password - throwing error')
          throw new Error('Invalid credentials')
        }

        console.log('✅ AUTH SUCCESS:', { email: user.email })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}


