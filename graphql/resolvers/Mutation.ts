import db from '@/lib/db'
import Jira from '@/lib/jira-rest-api'

const Mutation = {
  configureAccount: async (
    _parent: any,
    args: any,
    context: any,
    _info: any,
  ) => {
    const { input } = args
    const { user } = context
    await db.user.update({
      where: { id: user.id },
      data: { config: { set: input } },
    })
    return 'ok'
  },

  startTask: async (_parent: any, { id }: any, { user }: any) => {
    const jira = new Jira(user.config.atlassian_app_token)
    await jira.transitionIssue(id, { transition: { id: '21' } })
    // console.log(await client.getTransitions(taskID))
    return 'ok'
  },

  endTask: async (_parent: any, args: any, ctx: any) => {
    // TODO: 创建PR，将issue移动到DEV-REVIEW
    return 'ok'
  },

  jira: () => ({}),
}

export default Mutation
