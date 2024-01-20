import { ApolloClient, InMemoryCache, QueryOptions, gql } from "@apollo/client";
import fs from "fs/promises";

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache: cache,
  uri: process.env.ATLASSIAN_GRAPHQL_URI,
  headers: {
    Authorization: `Basic ${process.env.ATLASSIAN_APP_TOKEN}`,
    "X-ExperimentalApi": "softwareBoards,name,JiraIssueSearch",
  },
});

export default client;
