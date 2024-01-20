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

export async function query<T = any>(
  name: string,
  variables?: QueryOptions["variables"],
) {
  const source = await fs.readFile(process.cwd() + `/graphql/${name}.gql`);
  return await client.query<T>({
    query: gql`
      ${source.toString()}
    `,
    variables,
  });
}

export default client;
