import axios, { AxiosInstance } from 'axios'

// see: https://docs.github.com/en/rest

const ORG = process.env.JIRA_ORGANISATION

export default class Github {
  private ax: AxiosInstance

  constructor(token: string) {
    this.ax = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
  }

  async listTeamRepos(org: string, team_slug: string) {
    const { data } = await this.ax.get(`/orgs/${org}/teams/${team_slug}/repos`)
    return data
  }

  async searchPullRequest(repoName: string, keywordInTitle: string) {
    const { data } = await this.ax.get(
      `/search/issues?q=${encodeURIComponent(`is:pr repo:${ORG}/${repoName} "${keywordInTitle}" in:title`)}`,
    )
    return data
  }

  async getPullRequest(repo: string, number: number) {
    const { data } = await this.ax.get(`/repos/${ORG}/${repo}/pulls/${number}`)
    return data
  }
}
