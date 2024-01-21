"use server";
import db, { KEY_PREFIX, client } from "@/lib/redis-client";
import { Task, TaskTimeline } from "@/lib/types";
import { organizeTimeline } from "@/lib/utils";
import dayjs from "dayjs";
import Big from "big.js";
import sync from "./sync";

export default async function sendToSlack() {
  const tasks = await getTaskSummary();

  const slackMessageBody = {
    blocks: [
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_section",
            elements: [
              {
                type: "text",
                text: "我昨天做了什麼？",
                style: {
                  bold: true,
                },
              },
              {
                type: "text",
                text: "\n",
              },
            ],
          },
          ...tasks.flatMap((task) => [
            {
              type: "rich_text_list",
              style: "bullet",
              indent: 0,
              border: 0,
              elements: [
                {
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "link",
                      url: task.webUrl,
                      text: task.title,
                    },
                    task.percent > 0 && {
                      type: "text",
                      text: ` (${Big(task.percent).times(100).round(0).toNumber()}%)`,
                    },
                  ].filter((e) => !!e),
                },
              ],
            },
            {
              type: "rich_text_list",
              style: "bullet",
              indent: 1,
              border: 0,
              elements: [
                ...task.yesterdayDone.map((subtask) => ({
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "text",
                      text: subtask.content,
                    },
                  ],
                })),
              ],
            },
          ]),
          {
            type: "rich_text_section",
            elements: [
              {
                type: "text",
                text: "我今天將會做什麼？",
                style: {
                  bold: true,
                },
              },
              {
                type: "text",
                text: "\n",
              },
            ],
          },
          ...tasks.flatMap((task) => [
            {
              type: "rich_text_list",
              style: "bullet",
              indent: 0,
              border: 0,
              elements: [
                {
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "link",
                      url: task.webUrl,
                      text: task.title,
                    },
                  ],
                },
              ],
            },
            {
              type: "rich_text_list",
              style: "bullet",
              indent: 1,
              border: 0,
              elements: [
                ...task.todayDoing.map((subtask) => ({
                  type: "rich_text_section",
                  elements: [
                    {
                      type: "text",
                      text: subtask.content,
                    },
                  ],
                })),
              ],
            },
          ]),
        ],
      },
    ],
  };

  await fetch(process.env.SLACK_WEBHOOK as string, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(slackMessageBody),
  });

  await sync();

  return tasks;
}

async function getTaskSummary() {
  const tasks = await db.get<Task[]>("tasks");
  if (!tasks || !tasks.length) throw new Error("Cached tasks is empty");

  const allTimeline = await client.mget<TaskTimeline[]>(
    ...tasks.map((task) => KEY_PREFIX + `timeline:${task.key}`),
  );
  const combinedTasks = tasks.map((task, i) => ({
    ...task,
    timeline: allTimeline.at(i) ?? [],
  }));

  return combinedTasks
    .map((task) => ({ ...task, detail: organizeTimeline(task.timeline) }))
    .filter((task) => task.detail.isOpened)
    .map((task) => {
      const { detail, key, webUrl } = task;
      const { subtasks } = detail;
      const completedSubtasks = subtasks.filter(
        (subtask) => subtask.isCompleted,
      );
      // find out what tasks was done yesterday
      const yesterdayDone = completedSubtasks.filter((subtask) => {
        const date = dayjs(subtask.date);
        const todayStart = dayjs().startOf("day");
        const yesterdayStart = dayjs().startOf("day").subtract(1, "day");
        return (
          date.isBefore(todayStart) &&
          (date.isAfter(yesterdayStart) || date.isSame(yesterdayStart))
        );
      });
      // find out what not yet completed tasks
      const todayDoing = subtasks.filter((subtask) => !subtask.isCompleted);
      // compute percent
      const percent = !subtasks.length
        ? 0
        : Big(completedSubtasks.length)
            .div(subtasks.length)
            .round(2)
            .toNumber();
      return {
        title: key + " " + task.title,
        webUrl,
        percent,
        yesterdayDone,
        todayDoing,
      };
    });
}
