import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { fixes } from "@/lib/schema";
import {
  verifyGitHubSignature,
  extractLinearTicketId,
  extractFirstImage,
  hasLabel,
} from "@/lib/integrations/github";
import { getTicketDetails } from "@/lib/integrations/linear";
import { findSnapshotImage } from "@/lib/integrations/snapshots";

const DEFAULT_LABEL = "polish-cash";

/**
 * Wrap an external image URL so it renders via our same-origin proxy.
 * Lets `next/image` load private-repo raw URLs without extra config and
 * keeps the GitHub token server-side.
 */
function proxify(url: string | null | undefined): string | null {
  if (!url) return null;
  return `/api/images?src=${encodeURIComponent(url)}`;
}

export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

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

  if (body.action !== "closed" || !body.pull_request?.merged) {
    return NextResponse.json({ ok: true, skipped: "not a merged PR" });
  }

  const pr = body.pull_request;

  const labelName = process.env.POLISH_CASH_LABEL ?? DEFAULT_LABEL;
  if (!hasLabel(pr.labels, labelName)) {
    return NextResponse.json({ ok: true, skipped: `missing ${labelName} label` });
  }

  const prBody: string = pr.body ?? "";
  const ticketId = extractLinearTicketId(prBody);
  const beforeRaw = extractFirstImage(prBody);

  // Linear enrichment (team + canonical title)
  let team = "Unknown";
  let title = pr.title;
  if (ticketId) {
    const ticket = await getTicketDetails(ticketId);
    if (ticket) {
      team = ticket.team ?? "Unknown";
      title = ticket.title || title;
    }
  }

  // Snapshot-diff discovery for the "after" image
  const repoFullName: string = pr.base?.repo?.full_name ?? "";
  const [owner, repo] = repoFullName.split("/");
  let afterRaw: string | null = null;
  if (owner && repo && pr.head?.sha && pr.base?.sha) {
    const snap = await findSnapshotImage({
      owner,
      repo,
      prNumber: pr.number,
      headSha: pr.head.sha,
      baseSha: pr.base.sha,
    });
    afterRaw = snap?.headRawUrl ?? null;
  }

  // Component from branch name: "fix/ComponentName-..."
  const branchName: string = pr.head?.ref ?? "";
  const componentMatch = branchName.match(/fix\/([A-Z][a-zA-Z]+)/);
  const component = componentMatch ? componentMatch[1] : "Unknown";

  const mergedAt = pr.merged_at ?? new Date().toISOString();
  const date = new Date(mergedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  db.insert(fixes).values({
    title,
    team,
    component,
    author: `@${pr.user?.login ?? "builderbot"}`,
    pr: `#${pr.number}`,
    date,
    beforeLabel: "Before",
    beforeImage: proxify(beforeRaw),
    afterLabel: "After",
    afterImage: proxify(afterRaw),
    prUrl: pr.html_url ?? null,
    linearTicketId: ticketId,
    slackThreadUrl: null,
    mergedAt,
    createdAt: new Date().toISOString(),
  }).run();

  return NextResponse.json({ ok: true, fix: title });
}
