"use server";

import { pushToTimeline } from "./timeline";

export default async function newBranch(key: string) {
  await pushToTimeline(key, {
    isEvent: true,
    type: "newBranch",
    utcDate: new Date().toUTCString(),
  });
}
