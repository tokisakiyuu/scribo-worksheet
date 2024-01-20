"use server";
import db from "@/lib/redis-client";
import { TaskTimeline } from "@/lib/types";

export default async function openTask(key: string) {
  const timeline = await db.get<TaskTimeline>(`timeline:${key}`);

  if (timeline && timeline.length) throw new Error("Request denied");

  await db.set<TaskTimeline>(`timeline:${key}`, [
    {
      isEvent: true,
      type: "opened",
      utcDate: new Date().toUTCString(),
    },
  ]);
}
