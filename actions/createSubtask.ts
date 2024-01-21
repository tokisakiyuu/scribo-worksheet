"use server";
import { nanoid } from "nanoid";
import { SubtaskCreatedEvent } from "@/lib/types";
import { pushToTimeline } from "./timeline";

export default async function createSubtask(key: string, content: string) {
  const node: SubtaskCreatedEvent = {
    type: "subtaskCreated",
    isEvent: true,
    utcDate: new Date().toISOString(),
    id: nanoid(),
    content,
  };
  await pushToTimeline(key, node);

  return node;
}
