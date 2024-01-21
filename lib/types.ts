import TaskView from "@/app/TaskView";

export interface Task {
  key: string;
  title: string;
  webUrl: string;
  priority: {
    name: string;
    color: string;
    iconUrl: string;
  };
}

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

interface TaskEvent {
  isEvent: true;
  utcDate: string;
}

export interface TaskOpenedEvent extends TaskEvent {
  type: "opened";
}

export interface TaskClosedEvent extends TaskEvent {
  type: "closed";
}

export interface TaskNewBranchEvent extends TaskEvent {
  type: "newBranch";
}

export interface SubtaskCreatedEvent extends TaskEvent {
  type: "subtaskCreated";
  id: string;
  content: string;
}

export interface SubtaskCompletedEvent extends TaskEvent {
  type: "subtaskCompleted";
  id: string;
}

export interface SubtaskDeletedEvent extends TaskEvent {
  type: "subtaskDeleted";
  id: string;
}

export type TaskTimelineNode =
  | TaskOpenedEvent
  | TaskClosedEvent
  | TaskNewBranchEvent
  | SubtaskCreatedEvent
  | SubtaskCompletedEvent
  | SubtaskDeletedEvent;

export type TaskTimeline = TaskTimelineNode[];
