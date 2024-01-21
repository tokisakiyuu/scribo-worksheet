import {
  SubtaskCompletedEvent,
  SubtaskCreatedEvent,
  SubtaskDeletedEvent,
  TaskOpenedEvent,
  TaskTimeline,
  TaskTimelineNode,
} from "@/lib/types";
import copy from "copy-to-clipboard";
import { FC, useState } from "react";
import IconBranch from "./components/icons/Branch";
import openTask from "@/actions/openTask";
import closeTask from "@/actions/closeTask";
import newBranch from "@/actions/newBranch";
import createSubtask from "@/actions/createSubtask";
import { mutate } from "swr";
import completeSubtask from "@/actions/completeSubtask";
import cx from "clsx";
import deleteSubtask from "@/actions/deleteSubtask";
import { organizeTimeline } from "@/lib/utils";

interface Props {
  task: {
    key: string;
    title: string;
    webUrl: string;
    priority: {
      name: string;
      color: string;
      iconUrl: string;
    };
    timeline: TaskTimeline;
  };
}

const TaskView: FC<Props> = ({ task }) => {
  const [timelineInputValue, setTimelineInputValue] = useState("");
  const { subtasks, isOpened, isNotYetOpened, stage } = organizeTimeline(
    task.timeline,
  );

  const handleAddNode = async () => {
    const { key } = task;
    const value = timelineInputValue.trim();
    if (value.startsWith("/close")) {
      const [, index] = value.split(/\s+/);
      const node = subtasks[Number(index)];
      if (!node) {
        await submitNode(key, value);
      } else {
        await submitCompleteNode(key, node?.id as string);
      }
    } else if (value.startsWith("/delete")) {
      const [, index] = value.split(/\s+/);
      const node = subtasks[Number(index)];
      if (!node) {
        await submitNode(key, value);
      } else {
        await submitDeleteSubtask(key, node?.id as string);
      }
    } else {
      await submitNode(key, value);
    }
    setTimelineInputValue("");
    mutate("tasks");
  };

  return (
    <div className="flex-1 [&+&]:mt-4">
      {/* title */}
      <h3>
        <a
          href={task.webUrl}
          target="_blank"
          className="hover:underline text-xl"
          style={{ color: task.priority.color }}
        >
          {task.key} {task.title}
        </a>
        <span className="inline-block w-2" />
        <span className="inline-flex gap-1">
          <a
            className="cursor-pointer"
            onClick={() => copy(makeBranchName(task.key, task.title, stage))}
          >
            <IconBranch />
          </a>
        </span>
      </h3>

      <div>
        {isNotYetOpened ? (
          <Tag color="red">Note yet opened</Tag>
        ) : isOpened ? (
          <Tag color="green">Opened</Tag>
        ) : (
          <Tag color="red">Closed</Tag>
        )}
        {stage > 0 && <Tag color="blue">Stage {stage}</Tag>}
      </div>

      {/* timeline */}
      <div className="mt-2 pl-6 border-l-[4px] border-gray-700 border-solid">
        {subtasks.map((node, i) => (
          <div key={task.key + "_" + i} className="[&+&]:mt-2 flex">
            <span className="mr-2 text-[.6em] flex items-end text-gray-500">
              {i}
            </span>
            <SubtaskNode data={node as any} />
          </div>
        ))}
        <div className="mt-2">
          <input
            className="outline-none bg-transparent block w-full text-sm"
            placeholder="Enter event..."
            value={timelineInputValue}
            onChange={(e) => setTimelineInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNode()}
          />
        </div>
      </div>
    </div>
  );
};

function makeBranchName(key: string, title: string, stage: number) {
  let result = `${key.toUpperCase()}-${title
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z\-]/g, "")
    .toLowerCase()}`;
  if (stage > 0) {
    result += "-" + stage;
  }
  return result;
}

async function submitNode(key: string, input: string) {
  switch (input) {
    case "/newBranch":
      return newBranch(key);
    case "/open":
      return openTask(key);
    case "/close":
      return closeTask(key);
    default:
      return createSubtask(key, input);
  }
}

async function submitCompleteNode(key: string, subtaskID: string) {
  return completeSubtask(key, subtaskID);
}

async function submitDeleteSubtask(key: string, subtaskID: string) {
  return deleteSubtask(key, subtaskID);
}

const SubtaskNode = ({
  data,
}: {
  data: { isCompleted: boolean; content: string; id: string };
}) => {
  return (
    <div
      style={{
        textDecoration: data.isCompleted ? "line-through" : "none",
        color: data.isCompleted ? "gray" : "white",
      }}
    >
      {data.content}
    </div>
  );
};

const Tag = ({
  color,
  children,
}: {
  color: "red" | "green" | "blue";
  children: any;
}) => {
  const map = {
    red: "bg-red-900 border-red-600",
    green: "bg-green-900 border-green-600",
    blue: "bg-blue-900 bg-blue-600",
  };

  return (
    <span
      className={cx(
        "px-[4px] py-[2px] rounded border-[1px] text-[.6em] [&+&]:ml-2",
        map[color] ?? map.blue,
      )}
    >
      {children}
    </span>
  );
};

export default TaskView;
