"use client";
import getTasks from "@/actions/getTasks";
import commandHandler from "@/lib/commandHandler";
import useSWR from "swr";
import TaskView from "./TaskView";
import CommandExecutor from "./components/CommandExecutor";
import IconLoading from "./components/icons/Loading";

const Home = () => {
  const { data: tasks = [], isLoading } = useSWR("tasks", () => getTasks());

  return (
    <main>
      <div className="max-w-[760px] min-h-[100vh] m-[0_auto]">
        <div id="tasks">
          {tasks.map((task) => (
            <TaskView key={task.key} task={task} />
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

export default Home;

export const dynamic = "force-dynamic";
