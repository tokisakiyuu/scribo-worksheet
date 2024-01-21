import sendToSlack from "@/actions/sendToSlack";
import sync from "@/actions/sync";
import { clearTimeline } from "@/actions/timeline";
import { mutate } from "swr";

export default async function commandHandler(input: string) {
  if (input === "sync") {
    await sync();
    mutate("tasks");
    return;
  }

  if (input.startsWith("clear timeline")) {
    await clearTimeline(input.split(/\s+/).at(2) as string);
    mutate("tasks");
    return;
  }

  if (input === "slack") {
    await sendToSlack();
  }
}
