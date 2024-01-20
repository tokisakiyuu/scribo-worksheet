import pullJira from "@/actions/pull-jira";

export default async function commandHandler(input: string) {
  if (input === "pull jira") return pullJira();
}
