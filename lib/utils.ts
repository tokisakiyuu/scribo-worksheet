import {
  SubtaskCompletedEvent,
  SubtaskCreatedEvent,
  SubtaskDeletedEvent,
  TaskTimeline,
} from "./types";

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

export function organizeTimeline(timeline: TaskTimeline) {
  const completedSubtasks = timeline
    .filter((node) => node.type === "subtaskCompleted")
    .map((node) => (node as SubtaskCompletedEvent).id);
  const deletedSubtasks = timeline
    .filter((node) => node.type === "subtaskDeleted")
    .map((node) => (node as SubtaskDeletedEvent).id);
  let newBranchCount = 0;
  let isOpened = false;
  let isNotYetOpened = !timeline.length;

  timeline.forEach((node) => {
    const { type } = node;
    if (type === "opened") {
      isOpened = true;
    }
    if (type === "closed") {
      isOpened = false;
    }
    if (type === "newBranch") {
      newBranchCount += 1;
    }
  });

  const subtasks = timeline
    .filter((node) => node.type === "subtaskCreated")
    .map((node) => {
      const { utcDate, id, content } = node as SubtaskCreatedEvent;
      const date = new Date(utcDate).toLocaleString(undefined, {
        timeZone: "Asia/Chongqing",
      });
      return {
        date,
        id,
        content,
        isCompleted: completedSubtasks.includes(id),
      };
    })
    .filter((subtask) => !deletedSubtasks.includes(subtask.id));

  return {
    stage: newBranchCount,
    isOpened,
    isNotYetOpened,
    subtasks,
  };
}
