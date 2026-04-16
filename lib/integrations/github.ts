/**
 * GitHub webhook signature verification and PR body parsing.
 */
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify that a webhook payload came from GitHub using the shared secret.
 * Returns true if the signature is valid.
 */
export function verifyGitHubSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  const expected = "sha256=" + createHmac("sha256", secret).update(payload).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Extract a Linear ticket ID from a PR body.
 * Looks for patterns like "DQA-42", "DQA-123", etc.
 */
export function extractLinearTicketId(body: string): string | null {
  const match = body.match(/\b([A-Z]{2,5}-\d+)\b/);
  return match ? match[1] : null;
}

/**
 * Extract the first image URL from a PR body.
 * Supports both markdown image syntax ![alt](url) and HTML <img src="url">.
 * GitHub's drag-and-drop into PR descriptions produces <img> tags, so both
 * forms need to work.
 */
export function extractFirstImage(body: string): string | null {
  const markdown = body.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (markdown) return markdown[1];

  const html = body.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  return html ? html[1] : null;
}

/**
 * Case-insensitive label presence check against a GitHub PR labels array.
 */
export function hasLabel(
  labels: Array<{ name: string }> | undefined,
  labelName: string
): boolean {
  if (!labels?.length) return false;
  const target = labelName.toLowerCase();
  return labels.some((l) => l.name?.toLowerCase() === target);
}
