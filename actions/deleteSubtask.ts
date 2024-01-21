"use server";
import { SubtaskDeletedEvent } from "@/lib/types";
import { pushToTimeline } from "./timeline";

export default async function deleteSubtask(key: string, subtaskID: string) {
  const node: SubtaskDeletedEvent = {
    type: "subtaskDeleted",
    isEvent: true,
    utcDate: new Date().toUTCString(),
    id: subtaskID,
  };
  await pushToTimeline(key, node);

  return node;
}
