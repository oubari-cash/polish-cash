import { NextRequest, NextResponse } from "next/server";

/**
 * Image proxy for private-repo raw.githubusercontent.com URLs.
 *
 * GET /api/images?src=<encoded url>
 *
 * Validates the host against an allow-list, fetches the image server-side
 * with a GITHUB_TOKEN Bearer header, and streams the bytes back. Responses
 * include a long-lived immutable cache header because the upstream URL
 * pins to a commit SHA.
 */

const ALLOWED_HOSTS = new Set([
  "raw.githubusercontent.com",
  "user-images.githubusercontent.com",
  "github.com",
  "objects.githubusercontent.com",
]);

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src");
  if (!src) {
    return NextResponse.json({ error: "Missing src parameter" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid src URL" }, { status: 400 });
  }

  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  const headers: Record<string, string> = {
    Accept: "image/*",
  };

  // Private-repo raw URLs need a token. Public user-content URLs don't.
  const token = process.env.GITHUB_TOKEN;
  if (token && target.hostname === "raw.githubusercontent.com") {
    headers.Authorization = `Bearer ${token}`;
  }

  const upstream = await fetch(target.toString(), { headers });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: `Upstream fetch failed: ${upstream.status}` },
      { status: upstream.status === 404 ? 404 : 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "image/png";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
