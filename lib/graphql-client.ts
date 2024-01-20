import { ApolloClient, InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache();
const GQLClient = new ApolloClient({
  cache: cache,
  uri: process.env.ATLASSIAN_GRAPHQL_URI,
  headers: {
    Authorization: `Basic ${process.env.ATLASSIAN_APP_TOKEN}`,
    "X-ExperimentalApi": "softwareBoards,name,JiraIssueSearch",
  },
});

export default GQLClient;
