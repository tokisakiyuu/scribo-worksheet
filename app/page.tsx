"use client";
import { useState } from "react";
import useSWR from "swr";
import CommandExecutor from "./components/CommandExecutor";
import IconBranch from "./components/icons/Branch";
import IconDown from "./components/icons/Down";
import IconLoading from "./components/icons/Loading";
import IconUp from "./components/icons/Up";
import commandHandler from "@/lib/commandHandler";
import getTasks from "@/actions/getTasks";
import copy from "copy-to-clipboard";

const Home = () => {
  const { data: taskList = [], isLoading } = useSWR("tasks", () => getTasks());
  const [openedKey, setOpenedKey] = useState<string>();
  console.log(taskList);

  return (
    <main>
      <div className="max-w-[640px] min-h-[100vh] m-[0_auto]">
        <div className="">
          {taskList.map((task) => (
            <div key={task.key} className="flex-1">
              <h3>
                <a
                  href={task.webUrl}
                  target="_blank"
                  className="hover:underline"
                  style={{ color: task.priority.color }}
                >
                  {task.key} {task.title}
                </a>
                <span className="inline-block w-2" />
                <span className="inline-flex gap-1">
                  <a
                    onClick={() =>
                      copy(makeBranchName(task.key, task.title, 0))
                    }
                  >
                    <IconBranch />
                  </a>
                  <a
                    onClick={() =>
                      openedKey === task.key
                        ? setOpenedKey(undefined)
                        : setOpenedKey(task.key)
                    }
                  >
                    {openedKey === task.key ? <IconUp /> : <IconDown />}
                  </a>
                </span>
              </h3>
            </div>
          ))}
        </div>
        {isLoading && (
          <div>
            <IconLoading />
          </div>
        )}
        {!taskList.length && !isLoading && (
          <div className="flex items-center h-[40px]">
            <span className="text-gray-500">No thing</span>
          </div>
        )}
      </div>
      <CommandExecutor handler={commandHandler} />
    </main>
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

export default Home;
