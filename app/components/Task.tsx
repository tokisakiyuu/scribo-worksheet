"use client";
import { FC } from "react";
import copyToClipboard from "copy-to-clipboard";
import IconBranch from "./icons/Branch";
import Checkbox from "./Checkbox";
import { JiraPriorityField } from "../data/type";

type TaskData = {
  key: string;
  title: string;
  webUrl: string;
  priority: JiraPriorityField["priority"];
};

const Task: FC<{ data: TaskData }> = ({ data }) => {
  return (
    <div className="flex p-2">
      <div className="pr-2">
        <Checkbox />
      </div>
      <div className="flex-1">
        <h3>
          <a href={data.webUrl} target="_blank" className="hover:underline">
            {data.key} {data.title}
          </a>
          <span className="inline-block w-2" />
          <span className="inline-flex gap-1">
            <a
              onClick={() => copyToClipboard(data.key)}
              className="cursor-pointer"
            >
              <IconBranch />
            </a>
          </span>
        </h3>
      </div>
    </div>
  );
};

export default Task;
