import Jira from '@/lib/jira-rest-api'

function createJiraClient(ctx: any) {
  const { atlassian_app_token } = ctx.user.config
  return new Jira(atlassian_app_token)
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

const JiraQuery = {
  search: async (_parent: any, args: any, ctx: any) => {
    const jira = createJiraClient(ctx)
    const data = await jira.search(args.jql)
    return data.issues.map((issue: any) => ({
      key: issue.key,
      id: issue.id,
      title: issue.fields.summary,
      webURL: `https://${process.env.JIRA_ORGANISATION}.atlassian.net/browse/${issue.key}`,
      gitBranchName: makeGitBranchName(issue),
    }))
  },

  getIssue: async (_parent: any, args: any, ctx: any) => {
    const jira = createJiraClient(ctx)
    const issue = await jira.getIssue(args.issueId)
    return {
      key: issue.key,
      id: issue.id,
      title: issue.fields.summary,
      webURL: `https://${process.env.JIRA_ORGANISATION}.atlassian.net/browse/${issue.key}`,
      gitBranchName: makeGitBranchName(issue),
    }
  },

  getTransitions: async (_parent: any, args: any, ctx: any) => {
    const jira = createJiraClient(ctx)
    const data = await jira.getTransitions(args.issueId)
    return data.transitions.map((item: any) => ({
      id: item.id,
      name: item.name,
      to: item.to.name,
    }))
  },
}

export default JiraQuery
