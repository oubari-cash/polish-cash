import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { findSnapshotImage, __testables } from "@/lib/integrations/snapshots";

const { isSnapshotPath } = __testables;

describe("isSnapshotPath", () => {
  it("matches FBSnapshotTestCase reference images", () => {
    expect(
      isSnapshotPath("CashApp/BankingTests/ReferenceImages_64/test_balanceCard@3x.png")
    ).toBe(true);
    expect(isSnapshotPath("Tests/ReferenceImages/foo@2x.png")).toBe(true);
  });

  it("matches pointfreeco/swift-snapshot-testing paths", () => {
    expect(
      isSnapshotPath("Tests/FeatureTests/__Snapshots__/FeatureTests/testRender.1.png")
    ).toBe(true);
  });

  it("matches Paparazzi Android paths", () => {
    expect(
      isSnapshotPath("app/src/test/snapshots/images/com.cash.feature_RenderTest_render.png")
    ).toBe(true);
  });

  it("matches a generic path with 'snapshot' in a segment", () => {
    expect(isSnapshotPath("some/dir/Snapshots/foo.png")).toBe(true);
  });

  it("rejects non-PNG files", () => {
    expect(isSnapshotPath("Tests/__Snapshots__/foo.json")).toBe(false);
  });

  it("rejects PNGs outside snapshot conventions", () => {
    expect(isSnapshotPath("assets/icons/logo.png")).toBe(false);
    expect(isSnapshotPath("README.png")).toBe(false);
  });
});

describe("findSnapshotImage", () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.GITHUB_TOKEN;

  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test-token";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = originalToken;
  });

  it("returns null when GITHUB_TOKEN is not set", async () => {
    delete process.env.GITHUB_TOKEN;
    const result = await findSnapshotImage({
      owner: "o",
      repo: "r",
      prNumber: 1,
      headSha: "head",
      baseSha: "base",
    });
    expect(result).toBeNull();
  });

  it("returns the first matching snapshot sorted alphabetically", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { filename: "README.md", status: "modified" },
        {
          filename: "Tests/__Snapshots__/ZLast.1.png",
          status: "modified",
        },
        {
          filename: "Tests/__Snapshots__/AFirst.1.png",
          status: "added",
        },
        { filename: "src/foo.swift", status: "modified" },
      ],
    }) as unknown as typeof fetch;

    const result = await findSnapshotImage({
      owner: "cashapp",
      repo: "cash-ios",
      prNumber: 42,
      headSha: "abc123",
      baseSha: "def456",
    });

    expect(result).not.toBeNull();
    expect(result!.path).toBe("Tests/__Snapshots__/AFirst.1.png");
    expect(result!.headRawUrl).toBe(
      "https://raw.githubusercontent.com/cashapp/cash-ios/abc123/Tests/__Snapshots__/AFirst.1.png"
    );
    expect(result!.baseRawUrl).toBe(
      "https://raw.githubusercontent.com/cashapp/cash-ios/def456/Tests/__Snapshots__/AFirst.1.png"
    );
  });

  it("returns null when no snapshot images are changed", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { filename: "README.md", status: "modified" },
        { filename: "src/foo.swift", status: "modified" },
      ],
    }) as unknown as typeof fetch;

    const result = await findSnapshotImage({
      owner: "o",
      repo: "r",
      prNumber: 1,
      headSha: "h",
      baseSha: "b",
    });
    expect(result).toBeNull();
  });

  it("ignores removed snapshots", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          filename: "Tests/__Snapshots__/OldTest.1.png",
          status: "removed",
        },
      ],
    }) as unknown as typeof fetch;

    const result = await findSnapshotImage({
      owner: "o",
      repo: "r",
      prNumber: 1,
      headSha: "h",
      baseSha: "b",
    });
    expect(result).toBeNull();
  });

  it("url-encodes path segments in the raw URL", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          filename: "Tests/__Snapshots__/foo bar.1.png",
          status: "modified",
        },
      ],
    }) as unknown as typeof fetch;

    const result = await findSnapshotImage({
      owner: "o",
      repo: "r",
      prNumber: 1,
      headSha: "h",
      baseSha: "b",
    });
    expect(result!.headRawUrl).toBe(
      "https://raw.githubusercontent.com/o/r/h/Tests/__Snapshots__/foo%20bar.1.png"
    );
  });
});
