"use server";

import getTasks from "./getTasks";

export default async function pullJira() {
  const tasks = await getTasks();
}
