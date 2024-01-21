import { TaskTimeline } from "./types";

export function isOpenedTask(timeline: TaskTimeline) {
  return (
    timeline.reduce(
      (flag, node) =>
        node.type === "opened"
          ? flag + 1
          : node.type === "closed"
            ? flag - 1
            : flag,
      0,
    ) > 0
  );
}
