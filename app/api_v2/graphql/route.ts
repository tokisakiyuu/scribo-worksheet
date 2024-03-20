import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { GraphQLError } from 'graphql'
import typeDefs from '@/graphql/typeDefs'
import resolvers from '@/graphql/resolvers'
import { User } from '@prisma/client'
import db from '@/lib/db'
import { NextRequest } from 'next/server'

interface AppContext {
  user: User
}

const server = new ApolloServer<AppContext>({
  resolvers,
  typeDefs,
})

function throwAuthError(msg: string): never {
  throw new GraphQLError(msg, {
    extensions: {
      code: 'AUTHENTICATION_ERROR',
    },
  })
}

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    const authValue = req.headers.get('authorization') ?? ''
    const matched = authValue.match(/^Bearer\s(.*)$/)
    if (!matched) {
      throwAuthError('Invalid token')
    }
    const token = matched.at(1)
    if (!token) {
      throwAuthError('token is required')
    }
    const user = await db.user.findFirst({ where: { token } })
    if (!user) {
      throwAuthError('Invalid token')
    }
    return {
      user,
    }
  },
})

export { handler as GET, handler as POST }

export const dynamic = 'force-dynamic'
