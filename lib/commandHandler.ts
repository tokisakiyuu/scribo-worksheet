import pullJira from "@/actions/pull-jira";
import { mutate } from "swr";

export default async function commandHandler(input: string) {
  if (input === "pull jira") {
    await pullJira();
    mutate("tasks");
  }
}
