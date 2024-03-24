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

  startTask: async (_parent: any, args: any, { user }: any) => {
    const { issueId, repo, base, head } = args
    // TODO: 根据repo base head三个参数创建指定新分支
    // TODO: 根据issueId移动Jira卡片到"In Progress"状态
    const jira = new Jira(user.config.atlassian_app_token)
    await jira.transitionIssue(issueId, { transition: { id: '21' } })
    // console.log(await client.getTransitions(taskID))
    return 'ok'
  },

  endTask: async (_parent: any, args: any, ctx: any) => {
    const { issueId, repo, base, head } = args
    // TODO: 根据issueId查询到Jira卡片详情
    // TODO: 根据repo base head三个参数再加上Jira卡片信息创建一个PR
    // TODO: 移动Jira卡片到"Dev Review"状态
    return 'ok'
  },

  jira: () => ({}),
  github: () => ({}),
}

export default Mutation
