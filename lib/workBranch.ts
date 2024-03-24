import Github from './github-rest-api'

/**
 * 获取指定Jira卡片相关分支名称
 * @param {string} jiraIssueKey DEV-1000
 */
export async function getIssueWorkBranchNames(
  github: Github,
  jiraIssueKey: string,
  githubTeamRepo: string,
) {
  const keyNumber = jiraIssueKey.split('-').at(1)
  const { items } = await github.searchPullRequest(
    githubTeamRepo,
    `dev ${keyNumber}`,
  )
  const issues = (items as any[]).filter(({ title }) => {
    const base = (title as string).toLowerCase()
    return (
      base.startsWith(`dev ${keyNumber}`) || base.startsWith(`dev-${keyNumber}`)
    )
  })
  const prs = await Promise.all(
    issues.map(issue => github.getPullRequest(githubTeamRepo, issue.number)),
  )
  return prs.map(pr => pr.head.ref)
}

/**
 * 给指定的Jira卡片创建新的工作分支
 */
export async function createIssueNewWorkBranch(
  github: Github,
  jiraIssueKey: string,
  githubTeamRepo: string,
) {}
