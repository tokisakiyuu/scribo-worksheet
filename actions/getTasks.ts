"use server";
import db, { KEY_PREFIX, client } from "@/lib/redis-client";
import { Task, TaskTimeline } from "@/lib/types";

export default async function getTasks() {
  const tasks = await db.get<Task[]>("tasks");
  if (!tasks || !tasks.length) {
    return [];
  }

  const timelines = await client.mget<TaskTimeline[]>(
    ...tasks.map((task) => `${KEY_PREFIX}timeline:${task.key}`),
  );

  return tasks.map((task, i) => ({
    ...task,
    timeline: timelines.at(i) ?? [],
  }));
}
