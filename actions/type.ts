export interface JiraFieldBase {
  name: string;
  fieldId: string;
  description: string;
  type: string;
  __typename: string;
}

export interface JiraSingleLineTextField extends JiraFieldBase {
  __typename: "JiraSingleLineTextField";
  text: string;
}

export interface JiraPriorityField extends JiraFieldBase {
  __typename: "JiraPriorityField";
  priority: {
    name: string;
    color: string;
    iconUrl: string;
  };
}

export interface TaskListQueryData {
  jira: {
    issueSearchStable: {
      edges: {
        node: {
          id: string;
          webUrl: string;
          key: string;
          fieldsById: {
            edges: {
              node: JiraSingleLineTextField | JiraPriorityField;
            }[];
          };
        };
      }[];
    };
  };
}