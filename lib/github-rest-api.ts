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
      `/search/issues?q=${encodeURIComponent(`is:pr repo:${ORG}/${repoName} "${keywordInTitle}" in:title`)}&per_page=100`,
    )
    return data
  }

  async getPullRequest(repo: string, number: number) {
    const { data } = await this.ax.get(`/repos/${ORG}/${repo}/pulls/${number}`)
    return data
  }

  /**
   * @see https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#create-a-pull-request
   */
  async createPullRequest(repo: string, input: any) {
    const { status, data } = await this.ax.post(
      `/repos/${ORG}/${repo}/pulls`,
      input,
    )
    if (status !== 201) {
      throw new Error('Create Pull Request failed')
    }
    return data
  }
}
