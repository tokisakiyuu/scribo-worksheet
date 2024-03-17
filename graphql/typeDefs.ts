import { gql } from 'graphql-tag'

const queryDefs = gql`
  type Query {
    hello: String!
    self: User!
  }
`

const mutationDefs = gql`
  type Mutation {
    """
    配置账户，使用其它功能前必须先配置
    """
    configureAccount(input: AccountConfigInput!): String!
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
`

const defs = gql`
  ${typeDefs}
  ${queryDefs}
  ${mutationDefs}
`

export default defs
