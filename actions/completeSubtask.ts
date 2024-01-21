"use server";
import { SubtaskCompletedEvent } from "@/lib/types";
import { pushToTimeline } from "./timeline";

export default async function completeSubtask(key: string, subtaskID: string) {
  const node: SubtaskCompletedEvent = {
    type: "subtaskCompleted",
    isEvent: true,
    utcDate: new Date().toUTCString(),
    id: subtaskID,
  };
  await pushToTimeline(key, node);

  return node;
}
