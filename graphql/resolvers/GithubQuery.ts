import Github from '@/lib/github-rest-api'

function makeGithubClient(ctx: any) {
  const { user } = ctx
  const { config } = user
  const { github_access_token } = config
  return new Github(github_access_token)
}

const GithubQuery = {
  listTeamRepos: async (_parent: any, args: any, ctx: any) => {
    const github = makeGithubClient(ctx)
    const data = await github.listTeamRepos(
      process.env.JIRA_ORGANISATION as string,
      args.team,
    )
    return data.map((item: any) => item.name)
  },

  searchPullRequest: async (_parent: any, args: any, ctx: any) => {
    const github = makeGithubClient(ctx)
    const { repoName, keywordInTitle } = args
    const data = await github.searchPullRequest(repoName, keywordInTitle)
    const { total_count, items } = data

    if (!total_count) return []
    return items.map(async (item: any) => {
      const pr = await github.getPullRequest(repoName, item.number)
      return {
        title: item.title,
        number: item.number,
        state: item.state,
        createdAt: item.created_at,
        head: pr.head.ref,
        base: pr.base.ref,
      }
    })
  },
}

export default GithubQuery
