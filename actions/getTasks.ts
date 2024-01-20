"use server";
import db from "@/lib/redis-client";
import pullJira from "./pull-jira";
import { Task } from "@/lib/types";

export default async function getTasks() {
  const tasks = await db.get<Task[]>("tasks");
  if (!tasks || !tasks.length) {
    return await pullJira();
  } else {
    return tasks;
  }
}
