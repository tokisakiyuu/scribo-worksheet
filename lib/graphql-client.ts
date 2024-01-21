import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: process.env.ATLASSIAN_GRAPHQL_URI,
  headers: {
    Authorization: `Basic ${process.env.ATLASSIAN_APP_TOKEN}`,
    "X-ExperimentalApi": "softwareBoards,name,JiraIssueSearch",
  },
  fetch: (input: any, init: any) => {
    return fetch(input, {
      ...init,
      cache: "no-store",
    });
  },
});

const GQLClient = new ApolloClient({
  cache: cache,
  link,
});

export default GQLClient;
