"use client";
import useSWR from "swr";
import CommandExecutor from "./components/CommandExecutor";
import IconBranch from "./components/icons/Branch";
import IconLoading from "./components/icons/Loading";
import commandHandler from "@/lib/commandHandler";
import getTasks from "@/actions/getTasks";
import copy from "copy-to-clipboard";

const Home = () => {
  const { data: tasks = [], isLoading } = useSWR("tasks", () => getTasks());

  return (
    <main>
      <div className="max-w-[760px] min-h-[100vh] m-[0_auto]">
        <div id="tasks">
          {tasks.map((task) => (
            <div key={task.key} className="flex-1 [&+&]:mt-4">
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
                    onClick={() =>
                      copy(makeBranchName(task.key, task.title, 0))
                    }
                  >
                    <IconBranch />
                  </a>
                </span>
              </h3>

              {/* timeline */}
              <div className="mt-2 pl-6 border-l-[4px] border-gray-700 border-solid">
                {task.timeline.map((node, i) => (
                  <div key={i}>233</div>
                ))}
                <div>
                  <input
                    className="outline-none bg-transparent block w-full text-sm"
                    placeholder="Enter subtask..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div>
            <IconLoading />
          </div>
        )}

        {!tasks.length && !isLoading && (
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
