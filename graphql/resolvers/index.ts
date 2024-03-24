import GraphQLJSON from 'graphql-type-json'
import Query from './Query'
import Mutation from './Mutation'
import GithubQuery from './GithubQuery'
import GithubMutation from './GithubMutation'
import JiraQuery from './JiraQuery'
import JiraMutation from './JiraMutation'

const resolvers = {
  JSON: GraphQLJSON,
  Query,
  Mutation,
  GithubQuery,
  GithubMutation,
  JiraQuery,
  JiraMutation,
}

export default resolvers
