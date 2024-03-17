import db from '@/lib/db'

const Query = {
  hello: () => 'world',
  self: async (parent: any, args: any, context: any) => {
    const { user } = context
    return await db.user.findFirst({ where: { id: user.id } })
  },
}

const Mutation = {
  configureAccount: async (parent: any, args: any, context: any, info: any) => {
    const { input } = args
    const { user } = context
    await db.user.update({ where: { id: user.id }, data: { config: input } })
    return 'ok'
  },
}

const resolvers = {
  Query,
  Mutation,
}

export default resolvers
