/**
 * Convert JIRA markdown to Slack markdown
 *
 * @param jiraMD The JIRA markdown
 * @return The Slack markdown
 */
export function toSlack(jiraMD: string): string;

/**
 * Convert JIRA markdown to Slack markdown
 *
 * @param slackMD The Slack markdown
 * @return The JIRA markdown
 */
export function toJira(slackMD: string): string;