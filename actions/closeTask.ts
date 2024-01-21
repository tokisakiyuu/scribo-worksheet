"use server";

import { getTimeline, pushToTimeline } from "./timeline";
import { isOpenedTask } from "@/lib/utils";

export default async function closeTask(key: string) {
  const timeline = await getTimeline(key);

  if (!isOpenedTask(timeline)) return;

  await pushToTimeline(key, {
    isEvent: true,
    type: "closed",
    utcDate: new Date().toISOString(),
  });
}
