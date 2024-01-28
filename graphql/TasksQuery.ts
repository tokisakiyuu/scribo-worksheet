import { gql } from "@apollo/client";

export default gql`
  query TasksQuery($cloudId: ID!) {
    jira {
      issueSearchStable(
        cloudId: $cloudId
        issueSearchInput: {
          jql: "project = DEV and status in (\\"To Do\\", \\"In Progress\\", \\"In Review\\") ORDER BY priority DESC, createdDate ASC"
        }
      ) {
        edges {
          node {
            webUrl
            key
            fieldsById(ids: ["summary", "priority"]) {
              edges {
                node {
                  name
                  fieldId
                  description
                  type
                  __typename
                  ... on JiraSingleLineTextField {
                    text
                  }
                  ... on JiraPriorityField {
                    priority {
                      name
                      color
                      iconUrl
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
