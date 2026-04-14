/**
 * GitHub webhook signature verification.
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
 * Extract image URLs from markdown content (PR body or comments).
 * Returns [beforeImage, afterImage] or nulls if not found.
 */
export function extractImages(body: string): { before: string | null; after: string | null } {
  const imagePattern = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
  const images: string[] = [];

  let match;
  while ((match = imagePattern.exec(body)) !== null) {
    images.push(match[1]);
  }

  return {
    before: images[0] ?? null,
    after: images[1] ?? null,
  };
}
