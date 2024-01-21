"use server";
import { isOpenedTask } from "@/lib/utils";
import { getTimeline, pushToTimeline } from "./timeline";
import { TaskOpenedEvent } from "@/lib/types";

export default async function openTask(key: string) {
  const timeline = await getTimeline(key);

  if (isOpenedTask(timeline)) return;

  const node: TaskOpenedEvent = {
    isEvent: true,
    type: "opened",
    utcDate: new Date().toISOString(),
  };

  await pushToTimeline(key, node);

  return node;
}
