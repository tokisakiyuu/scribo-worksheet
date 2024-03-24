import Github from '@/lib/github-rest-api'
import Jira from '@/lib/jira-rest-api'
import { getIssueWorkBranchNames } from '@/lib/workBranch'

function createJiraClient(ctx: any) {
  return new Jira(ctx.user.config.atlassian_app_token)
}

function makeGitBranchName(issue: any) {
  return (
    issue.key +
    '-' +
    issue.fields.summary
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .slice(0, 4)
      .join('-')
  )
}

const Query = {
  self: async (_parent: any, _args: any, context: any) => {
    return context.user
  },

  tasks: async (_parent: any, _args: any, ctx: any) => {
    const jira = createJiraClient(ctx)
    const res = await jira.search(
      'project = DEV and assignee = currentUser() and status in ("In Progress", "To Do")ORDER BY Rank ASC',
    )
    const { issues } = res
    return (issues as any[]).map(issue => ({
      key: issue.key,
      id: issue.id,
      title: issue.fields.summary,
      webURL: `https://${process.env.JIRA_ORGANISATION}.atlassian.net/browse/${issue.key}`,
      gitBranchName: makeGitBranchName(issue),
    }))
  },

  task: async (_parent: any, { id }: any, ctx: any) => {
    const jira = createJiraClient(ctx)
    const issue = await jira.getIssue(id)
    return {
      key: issue.key,
      id: issue.id,
      title: issue.fields.summary,
      webURL: `https://${process.env.JIRA_ORGANISATION}.atlassian.net/browse/${issue.key}`,
      gitBranchName: makeGitBranchName(issue),
    }
  },

  workBranchNames: async (_parent: any, args: any, ctx: any) => {
    const github = new Github(ctx.user.config.github_access_token)
    const branchNames = await getIssueWorkBranchNames(
      github,
      args.taskId,
      args.repo,
    )
    return branchNames
  },

  github: () => ({}),
  jira: () => ({}),
}

export default Query
