/**
 * Snapshot-image discovery.
 *
 * Given a merged PR, call GitHub's files API and find a changed PNG that
 * looks like a snapshot-test reference image. Returns raw.githubusercontent.com
 * URLs for the head ("after") and base ("before") versions.
 *
 * Supported conventions:
 *   - FBSnapshotTestCase / iOSSnapshotTestCase: ReferenceImages/foo.png
 *   - pointfreeco/swift-snapshot-testing:       __Snapshots__/foo.png
 *   - Paparazzi (Android):                      src/test/snapshots/foo.png
 *   - Generic fallback:                         any .png under a path segment
 *                                               containing "snapshot"
 */

export interface SnapshotImage {
  path: string;
  headRawUrl: string;
  baseRawUrl: string;
}

interface PRFile {
  filename: string;
  status: "added" | "modified" | "removed" | "renamed" | "copied" | "changed" | "unchanged";
}

interface FindSnapshotArgs {
  owner: string;
  repo: string;
  prNumber: number;
  headSha: string;
  baseSha: string;
}

const SNAPSHOT_PATTERNS: RegExp[] = [
  /ReferenceImages[^/]*\/.+\.png$/i,
  /__Snapshots__\/.+\.png$/,
  /src\/test\/snapshots\/.+\.png$/,
  /\/[^/]*snapshot[^/]*\/.+\.png$/i,
];

function isSnapshotPath(filename: string): boolean {
  return SNAPSHOT_PATTERNS.some((re) => re.test(filename));
}

function rawUrl(owner: string, repo: string, sha: string, path: string): string {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `https://raw.githubusercontent.com/${owner}/${repo}/${sha}/${encodedPath}`;
}

/**
 * Fetch the list of files changed in a PR and return the first snapshot
 * image (sorted alphabetically for determinism). Returns null if none match
 * or the GitHub API call fails.
 */
export async function findSnapshotImage(args: FindSnapshotArgs): Promise<SnapshotImage | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("GITHUB_TOKEN not set — cannot fetch PR files for snapshot discovery");
    return null;
  }

  const { owner, repo, prNumber, headSha, baseSha } = args;
  const files: PRFile[] = [];

  // Paginate to handle PRs with > 100 changed files
  for (let page = 1; page <= 10; page++) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100&page=${page}`;
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      if (!res.ok) {
        console.error(`GitHub files API error: ${res.status} ${res.statusText}`);
        return null;
      }
      const batch = (await res.json()) as PRFile[];
      files.push(...batch);
      if (batch.length < 100) break;
    } catch (err) {
      console.error("Failed to fetch PR files from GitHub:", err);
      return null;
    }
  }

  const candidates = files
    .filter((f) => f.status === "added" || f.status === "modified" || f.status === "renamed" || f.status === "changed")
    .filter((f) => isSnapshotPath(f.filename))
    .map((f) => f.filename)
    .sort();

  if (candidates.length === 0) return null;

  const path = candidates[0];
  return {
    path,
    headRawUrl: rawUrl(owner, repo, headSha, path),
    baseRawUrl: rawUrl(owner, repo, baseSha, path),
  };
}

// Exported for unit tests
export const __testables = { isSnapshotPath, rawUrl, SNAPSHOT_PATTERNS };
