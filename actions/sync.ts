"use server";
import db, { KEY_PREFIX, client } from "@/lib/redis-client";
import getTasks from "./getTasks";
import { fetchJiraTask } from "./jira";

export default async function sync() {
  const currentTasks = await getTasks();
  const tasks = await fetchJiraTask();
  const deletedKey = currentTasks
    .filter((t) => !tasks.find((nt) => nt.key === t.key))
    .map((t) => t.key);

  // clean up invaild timeline caches
  if (deletedKey.length) {
    await client.del(
      ...deletedKey.map((key) => `${KEY_PREFIX}timeline:${key}`),
    );
  }

  // update tasks cache
  await db.set("tasks", tasks);
}
