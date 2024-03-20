import axios, { AxiosInstance } from 'axios'

const BASE_URL = `https://${process.env.JIRA_ORGANISATION}.atlassian.net/rest/api`

async function search(req: AxiosInstance, jql: string) {
  const { data } = await req.get(`/search?jql=${encodeURIComponent(jql)}`)
  return data
}

async function status(req: AxiosInstance) {
  const { data } = await req.get(`/status`)
  return data
}

async function getTransitions(req: AxiosInstance, issueId: string) {
  const { data } = await req.get(`/issue/${issueId}/transitions`)
  return data
}

async function editIssue(req: AxiosInstance, issueId: string, input: any) {
  try {
    const res = await req.put(`/issue/${issueId}`, input)
    console.log(res)
  } catch (error) {
    console.log(error)
  }
}

async function editmata(req: AxiosInstance, issueId: string) {
  const { data } = await req.get(`/issue/${issueId}/editmeta`)
  return data
}

async function transitions(req: AxiosInstance, issueId: string, input: any) {
  try {
    await req.post(`/issue/${issueId}/transitions`, input)
  } catch (error) {
    console.log(error)
  }
}

export function createClient(token: string, apiVersion: number = 2) {
  const req = axios.create({
    baseURL: `${BASE_URL}/${apiVersion}`,
    headers: {
      Authorization: `Basic ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

  return {
    search: (jql: string) => search(req, jql),
    status: () => status(req),
    transitions: (issueId: string, input: any) =>
      transitions(req, issueId, input),
    editIssue: (issueId: string, input: any) => editIssue(req, issueId, input),
    editmeta: (issueId: string) => editmata(req, issueId),
    getTransitions: (issueId: string) => getTransitions(req, issueId),
  }
}
