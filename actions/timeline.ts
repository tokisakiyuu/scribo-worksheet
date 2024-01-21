"use server";

import db, { KEY_PREFIX, client } from "@/lib/redis-client";
import { TaskTimeline, TaskTimelineNode } from "@/lib/types";

export async function getTimeline(key: string): Promise<TaskTimeline> {
  return (await db.get(`timeline:${key}`)) ?? [];
}

export async function updateTimeline(key: string, timeline: TaskTimeline) {
  return await db.set(`timeline:${key}`, timeline);
}

export async function pushToTimeline(key: string, node: TaskTimelineNode) {
  const timeline = await getTimeline(key);
  const newTimeline = [...timeline, node];
  return await db.set(`timeline:${key}`, newTimeline);
}

export async function updateAtTimeline(
  key: string,
  index: number,
  node: TaskTimelineNode,
) {
  const timeline = await getTimeline(key);
  timeline.splice(index, 0, node);
  return await db.set(`timeline:${key}`, timeline);
}

export async function deleteAtTimeline(key: string, index: number) {
  const timeline = await getTimeline(key);
  timeline.splice(index, 1);
  return await db.set(`timeline:${key}`, timeline);
}

export async function clearTimeline(key: string) {
  await client.del(`${KEY_PREFIX}timeline:${key}`);
}
