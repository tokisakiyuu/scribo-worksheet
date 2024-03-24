import axios, { AxiosInstance } from 'axios'

// see: https://developer.atlassian.com/cloud/jira/platform/rest/v2/

const BASE_URL = `https://${process.env.JIRA_ORGANISATION}.atlassian.net/rest/api`
const API_VERSION = 2

export default class Jira {
  ax: AxiosInstance

  constructor(token: string) {
    this.ax = axios.create({
      baseURL: `${BASE_URL}/${API_VERSION}`,
      headers: {
        Authorization: `Basic ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

  async search(jql: string) {
    const { data } = await this.ax.get(`/search?jql=${encodeURIComponent(jql)}`)
    return data
  }

  async getIssue(issueId: string) {
    const { data } = await this.ax.get(`/issue/${issueId}`)
    return data
  }

  async getTransitions(issueId: string) {
    const { data } = await this.ax.get(`/issue/${issueId}/transitions`)
    return data
  }

  /**
   * @see https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issues/#api-rest-api-2-issue-issueidorkey-transitions-post
   */
  async transitionIssue(issueId: string, input: any) {
    await this.ax.post(`/issue/${issueId}/transitions`, input)
  }
}
