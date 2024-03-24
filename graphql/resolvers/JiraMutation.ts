import Jira from '@/lib/jira-rest-api'

const JiraMutation = {
  /**
   * @example
   * ## Transition the state of issue DEV-1000 to state 21
   * ```graphql
   * mutation Jira {
   *   jira {
   *     transition(issueId: "DEV-1000", input: { transition: { id: "21" })
   *   }
   * }
   * ```
   */
  transitions: async (_parent: any, args: any, ctx: any) => {
    const jira = new Jira(ctx.user.config.atlassian_app_token)
    await jira.transitionIssue(args.issueId, args.input)
    return 'ok'
  },
}

export default JiraMutation
