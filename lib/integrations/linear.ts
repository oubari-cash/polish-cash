/**
 * Linear integration — read-only access to ticket details.
 * Used by the GitHub webhook handler to enrich fix data with team labels and descriptions.
 */

export interface LinearTicket {
  title: string;
  team: string | null;
  description: string | null;
}

const LINEAR_API_URL = "https://api.linear.app/graphql";

/**
 * Fetch ticket details from Linear by ticket ID (e.g., "DQA-42").
 * Returns null if the ticket can't be found or the API key isn't configured.
 */
export async function getTicketDetails(ticketId: string): Promise<LinearTicket | null> {
  const apiKey = process.env.LINEAR_API_KEY;
  if (!apiKey) {
    console.warn("LINEAR_API_KEY not set — skipping Linear enrichment");
    return null;
  }

  const query = `
    query GetIssue($id: String!) {
      issue(id: $id) {
        title
        description
        team {
          name
        }
        labels {
          nodes {
            name
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(LINEAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({ query, variables: { id: ticketId } }),
    });

    if (!res.ok) {
      console.error(`Linear API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const json = await res.json();
    const issue = json.data?.issue;
    if (!issue) return null;

    // Try to extract team from labels first, fall back to Linear team name
    const labels: string[] = issue.labels?.nodes?.map((l: { name: string }) => l.name) ?? [];
    const knownTeams = ["Banking", "P2P", "Trust", "Moneybot"];
    const teamFromLabel = labels.find(l => knownTeams.includes(l));

    return {
      title: issue.title,
      team: teamFromLabel ?? issue.team?.name ?? null,
      description: issue.description ?? null,
    };
  } catch (err) {
    console.error("Failed to fetch from Linear:", err);
    return null;
  }
}
