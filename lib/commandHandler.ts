import pullJira from "@/actions/pull-jira";
import { clearTimeline } from "@/actions/timeline";
import { mutate } from "swr";

export default async function commandHandler(input: string) {
  if (input === "pull jira") {
    await pullJira();
    mutate("tasks");
    return;
  }

  if (input.startsWith("clear timeline")) {
    await clearTimeline(input.split(/\s+/).at(2) as string);
    mutate("tasks");
    return;
  }
}
