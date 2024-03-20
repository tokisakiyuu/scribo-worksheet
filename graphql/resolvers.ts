import db from '@/lib/db'
import { createClient } from '@/lib/jira-rest-api'

const Query = {
  self: async (_parent: any, _args: any, context: any) => {
    return context.user
  },

  tasks: async (_parent: any, _args: any, context: any) => {
    const { user } = context
    const { config } = user
    const { atlassian_app_token } = config
    const client = createClient(atlassian_app_token)
    const res = await client.search(
      'project = DEV and assignee = currentUser() and status in ("In Progress", "To Do")ORDER BY Rank ASC',
    )
    const { issues } = res
    return (issues as any[]).map(issue => ({
      key: issue.key,
      id: issue.id,
      title: issue.fields.summary,
      webURL: `https://${process.env.JIRA_ORGANISATION}.atlassian.net/browse/${issue.key}`,
      gitBranchName:
        issue.key +
        '-' +
        issue.fields.summary
          .toLowerCase()
          .replace(/[^a-z\s]/g, '')
          .split(/\s+/)
          .slice(0, 4)
          .join('-'),
    }))
  },

  task: async (_parent: any, { id }: any, { user }: any) => {
    const issue = await createClient(user.config.atlassian_app_token).getIssue(
      id,
    )
    return {
      key: issue.key,
      id: issue.id,
      title: issue.fields.summary,
      webURL: `https://${process.env.JIRA_ORGANISATION}.atlassian.net/browse/${issue.key}`,
      gitBranchName:
        issue.key +
        '-' +
        issue.fields.summary
          .toLowerCase()
          .replace(/[^a-z\s]/g, '')
          .split(/\s+/)
          .slice(0, 4)
          .join('-'),
    }
  },
}

const Mutation = {
  configureAccount: async (parent: any, args: any, context: any, info: any) => {
    const { input } = args
    const { user } = context
    await db.user.update({ where: { id: user.id }, data: { config: input } })
    return 'ok'
  },

  startTask: async (_parent: any, { id }: any, { user }: any) => {
    const client = createClient(user.config.atlassian_app_token)
    await client.transitions(id, { transition: { id: '21' } })
    // console.log(await client.getTransitions(taskID))
    return 'ok'
  },
}

const resolvers = {
  Query,
  Mutation,
}

export default resolvers
