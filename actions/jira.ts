"use server";
import TasksQuery from "@/graphql/TasksQuery";
import GQLClient from "@/lib/graphql-client";
import db from "@/lib/redis-client";
import {
  JiraPriorityField,
  JiraSingleLineTextField,
  TaskListQueryData,
} from "@/lib/types";

export default async function pullJiraTask() {
  const tasks = await fetchJiraTask();
  await db.set("tasks", tasks);
  return tasks;
}

function buildTaskListFromResponse(data: TaskListQueryData) {
  return data.jira.issueSearchStable.edges.map((issueNode) => {
    const { key, webUrl, fieldsById } = issueNode.node;
    const titleField = fieldsById.edges.find(
      (fieldNode) => fieldNode.node.fieldId === "summary",
    );
    const priorityField = fieldsById.edges.find(
      (fieldNode) => fieldNode.node.fieldId === "priority",
    );
    if (!titleField || !priorityField) {
      throw new Error("Field missing");
    }
    return {
      key,
      webUrl,
      title: (titleField.node as JiraSingleLineTextField).text,
      priority: (priorityField.node as JiraPriorityField).priority,
    };
  });
}

export async function fetchJiraTask() {
  const { data } = await GQLClient.query({
    query: TasksQuery,
    variables: {
      cloudId: process.env.JIRA_CLOUD_ID,
    },
  });
  return buildTaskListFromResponse(data);
}
