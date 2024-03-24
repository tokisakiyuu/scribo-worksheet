import Github from '@/lib/github-rest-api'

const GithubMutation = {
  createPullRequest: async (_parent: any, args: any, ctx: any) => {
    const github = new Github(ctx.user.config.github_access_token)
    const pr = await github.createPullRequest(args.repo, args.input)
    return {
      title: pr.title,
      number: pr.number,
      state: pr.state,
      createdAt: pr.created_at,
      head: pr.head.ref,
      base: pr.base.ref,
    }
  },
}

export default GithubMutation
