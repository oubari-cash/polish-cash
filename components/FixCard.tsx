"use client";

import { useState } from "react";
import Image from "next/image";
import type { Fix } from "@/types";

interface FixCardProps {
  fix: Fix;
  onClick: () => void;
}

/**
 * Full-width card. If the fix has screenshots, show two phone
 * mockups side-by-side at generous height. If no images, show
 * the text labels inside neutral gray pill placeholders.
 */
export function FixCard({ fix, onClick }: FixCardProps) {
  const [hovered, setHovered] = useState(false);
  const hasImages = fix.before.image && fix.after.image;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 28,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "scale(0.985)" : "scale(1)",
      }}
    >
      {/* ── Screenshot area ────────────────────────────────── */}
      {hasImages ? (
        <div style={{
          display: "flex",
          gap: 0,
          background: "#f2f2f2",
          padding: "40px 24px",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Phone src={fix.before.image!} alt={fix.before.label} label="Before" />
          <div style={{ width: 24, flexShrink: 0 }} />
          <Phone src={fix.after.image!} alt={fix.after.label} label="After" />
        </div>
      ) : (
        /* Text-only before/after */
        <div style={{
          display: "flex",
          gap: 12,
          padding: "40px 28px",
          background: "#f7f7f7",
          justifyContent: "center",
        }}>
          <TextDiff label="Before" text={fix.before.label} />
          <div style={{ width: 1, background: "rgba(0,0,0,0.06)", flexShrink: 0 }} />
          <TextDiff label="After" text={fix.after.label} />
        </div>
      )}

      {/* ── Info bar ──────────────────────────────────────── */}
      <div style={{ padding: "20px 24px 22px" }}>
        <div style={{
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: "#000",
          lineHeight: 1.3,
          marginBottom: 12,
        }}>
          {fix.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <Pill bg="#00E013" color="#000">{fix.author}</Pill>
          <Pill>{fix.team}</Pill>
          <Pill>{fix.component}</Pill>
          <span style={{ flex: 1 }} />
          <Pill>{fix.pr}</Pill>
          <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.3)" }}>{fix.date}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────── */

function Phone({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <div style={{ position: "relative", flex: "0 1 180px" }}>
      <span style={{
        position: "absolute",
        top: -28,
        left: 0,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "rgba(0,0,0,0.35)",
      }}>
        {label}
      </span>
      <div style={{
        borderRadius: 20,
        overflow: "hidden",
        background: "#e8e8e8",
        aspectRatio: "9 / 19.5",
        position: "relative",
      }}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "cover" }}
          sizes="200px"
        />
      </div>
    </div>
  );
}

function TextDiff({ label, text }: { label: string; text: string }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: "20px 0",
    }}>
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(0,0,0,0.3)",
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 14,
        fontWeight: 600,
        color: "rgba(0,0,0,0.55)",
        letterSpacing: "-0.02em",
        textAlign: "center",
        padding: "0 8px",
      }}>
        {text}
      </span>
    </div>
  );
}

function Pill({ children, bg = "#f0f0f0", color = "rgba(0,0,0,0.5)" }: { children: React.ReactNode; bg?: string; color?: string }) {
  return (
    <span style={{
      fontSize: 12,
      fontWeight: 600,
      padding: "4px 12px",
      borderRadius: 100,
      background: bg,
      color,
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}
