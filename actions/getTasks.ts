"use server";
import { query } from "@/lib/graphql-client";
import {
  JiraPriorityField,
  JiraSingleLineTextField,
  TaskListQueryData,
} from "./type";

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

export default async function getTasks() {
  const { data } = await query<TaskListQueryData>("TasksQuery", {
    cloudId: process.env.JIRA_CLOUD_ID,
  });
  return buildTaskListFromResponse(data);
}
