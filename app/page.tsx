"use client";
import { useState } from "react";
import { useAsync } from "react-use";
import CommandExecutor from "./components/CommandExecutor";
import CopyToClipboard from "./components/CopyToClipboard";
import IconBranch from "./components/icons/Branch";
import IconDown from "./components/icons/Down";
import IconLoading from "./components/icons/Loading";
import IconUp from "./components/icons/Up";
import commandHandler from "@/lib/commandHandler";
import getTasks from "@/actions/getTasks";

const Home = () => {
  const { value: taskList = [], loading } = useAsync(() => getTasks());
  const [openedKey, setOpenedKey] = useState<string>();

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
                  <CopyToClipboard text={task.key}>
                    <IconBranch />
                  </CopyToClipboard>
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
        {loading && (
          <div>
            <IconLoading />
          </div>
        )}
        {!taskList.length && !loading && (
          <div className="flex items-center h-[40px]">
            <span className="text-gray-500">No thing</span>
          </div>
        )}
      </div>
      <CommandExecutor handler={commandHandler} />
    </main>
  );
};

export default Home;
