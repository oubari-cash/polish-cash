import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { fixes } from "@/lib/schema";
import { verifyGitHubSignature, extractLinearTicketId, extractImages } from "@/lib/integrations/github";
import { getTicketDetails } from "@/lib/integrations/linear";

const BUILDERBOT_AUTHOR = "builderbot";

export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Read and verify payload
  const payload = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifyGitHubSignature(payload, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");
  if (event !== "pull_request") {
    return NextResponse.json({ ok: true, skipped: "not a pull_request event" });
  }

  const body = JSON.parse(payload);

  // Only process merged PRs
  if (body.action !== "closed" || !body.pull_request?.merged) {
    return NextResponse.json({ ok: true, skipped: "not a merged PR" });
  }

  const pr = body.pull_request;

  // Only process PRs opened by BuilderBot
  const prAuthor = pr.user?.login?.toLowerCase() ?? "";
  if (!prAuthor.includes(BUILDERBOT_AUTHOR)) {
    return NextResponse.json({ ok: true, skipped: "not a BuilderBot PR" });
  }

  // Extract data from the PR
  const prBody = pr.body ?? "";
  const ticketId = extractLinearTicketId(prBody);
  const images = extractImages(prBody);

  // Enrich with Linear data if we found a ticket reference
  let team = "Unknown";
  let title = pr.title;

  if (ticketId) {
    const ticket = await getTicketDetails(ticketId);
    if (ticket) {
      team = ticket.team ?? "Unknown";
      title = ticket.title || title;
    }
  }

  // Extract component name from branch or PR title
  // BuilderBot branches often follow patterns like "fix/ComponentName-issue"
  const branchName = pr.head?.ref ?? "";
  const componentMatch = branchName.match(/fix\/([A-Z][a-zA-Z]+)/);
  const component = componentMatch ? componentMatch[1] : "Unknown";

  // Format the date
  const mergedAt = pr.merged_at ?? new Date().toISOString();
  const date = new Date(mergedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  // Insert the fix into the database
  db.insert(fixes).values({
    title,
    team,
    component,
    author: `@${pr.user?.login ?? "builderbot"}`,
    pr: `#${pr.number}`,
    date,
    beforeLabel: "Before",
    beforeImage: images.before,
    afterLabel: "After",
    afterImage: images.after,
    prUrl: pr.html_url ?? null,
    linearTicketId: ticketId,
    slackThreadUrl: null,
    mergedAt,
    createdAt: new Date().toISOString(),
  }).run();

  return NextResponse.json({ ok: true, fix: title });
}
