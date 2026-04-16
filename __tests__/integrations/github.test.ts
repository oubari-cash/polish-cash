import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";
import {
  verifyGitHubSignature,
  extractLinearTicketId,
  extractFirstImage,
  hasLabel,
} from "@/lib/integrations/github";

describe("verifyGitHubSignature", () => {
  const secret = "shh";
  const payload = '{"hello":"world"}';
  const validSig = "sha256=" + createHmac("sha256", secret).update(payload).digest("hex");

  it("accepts a valid signature", () => {
    expect(verifyGitHubSignature(payload, validSig, secret)).toBe(true);
  });

  it("rejects a missing signature", () => {
    expect(verifyGitHubSignature(payload, null, secret)).toBe(false);
  });

  it("rejects a tampered payload", () => {
    expect(verifyGitHubSignature(payload + "x", validSig, secret)).toBe(false);
  });

  it("rejects a wrong secret", () => {
    expect(verifyGitHubSignature(payload, validSig, "nope")).toBe(false);
  });
});

describe("extractLinearTicketId", () => {
  it("finds DQA-42 style IDs", () => {
    expect(extractLinearTicketId("Fixes DQA-42 in the onboarding flow")).toBe("DQA-42");
  });

  it("returns null when no ID is present", () => {
    expect(extractLinearTicketId("just a regular description")).toBeNull();
  });

  it("returns the first match when multiple are present", () => {
    expect(extractLinearTicketId("DQA-1 and BANK-99")).toBe("DQA-1");
  });
});

describe("extractFirstImage", () => {
  it("extracts a markdown image URL", () => {
    const body = "Repro:\n\n![shot](https://example.com/a.png)\n\nThanks.";
    expect(extractFirstImage(body)).toBe("https://example.com/a.png");
  });

  it("extracts an <img> src (GitHub drag-drop style)", () => {
    const body =
      'Before:\n<img width="400" alt="bug" src="https://user-images.githubusercontent.com/1/abc.png">';
    expect(extractFirstImage(body)).toBe("https://user-images.githubusercontent.com/1/abc.png");
  });

  it("prefers the first markdown image when both forms are present", () => {
    const body =
      "![first](https://example.com/md.png)\n<img src=\"https://example.com/html.png\">";
    expect(extractFirstImage(body)).toBe("https://example.com/md.png");
  });

  it("returns null when the body has no image", () => {
    expect(extractFirstImage("nothing to see here")).toBeNull();
  });
});

describe("hasLabel", () => {
  it("matches case-insensitively", () => {
    expect(hasLabel([{ name: "Polish-Cash" }], "polish-cash")).toBe(true);
  });

  it("returns false when labels are empty or missing", () => {
    expect(hasLabel([], "polish-cash")).toBe(false);
    expect(hasLabel(undefined, "polish-cash")).toBe(false);
  });

  it("returns false when label is not in the list", () => {
    expect(hasLabel([{ name: "bug" }, { name: "ios" }], "polish-cash")).toBe(false);
  });
});
