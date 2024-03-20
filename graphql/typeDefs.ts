import { gql } from 'graphql-tag'

const queryDefs = gql`
  type Query {
    self: User!
    tasks: [Task!]
    taskGitBranchName(id: String!): String!
  }
`

const mutationDefs = gql`
  type Mutation {
    """
    配置账户，使用其它功能前必须先配置
    """
    configureAccount(input: AccountConfigInput!): String!

    """
    开始某个任务。会将对应任务状态改为“In Progress”
    """
    startTask(id: String!): String!
  }
`

const typeDefs = gql`
  """
  必要的配置项
  """
  input AccountConfigInput {
    atlassian_app_token: String
  }

  type AccountConfig {
    atlassian_app_token: String
  }

  type User {
    id: String!
    username: String!
    config: AccountConfig
    token: String!
  }

  """
  Jira任务
  """
  type Task {
    key: String!
    id: String!
    title: String!
    webURL: String!
  }
`

const defs = gql`
  ${typeDefs}
  ${queryDefs}
  ${mutationDefs}
`

export default defs
