"use client";

import Image from "next/image";
import Link from "next/link";
import { color } from "@/lib/tokens";
import type { Fix } from "@/types";
import styles from "./styles/FixDetailModal.module.css";

interface FixDetailViewProps {
  fix: Fix;
}

export function FixDetailView({ fix }: FixDetailViewProps) {
  return (
    <div style={{ background: "#fff", color: "#000", minHeight: "100vh" }}>
      <header style={{
        padding: "0 32px",
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        zIndex: 50,
      }}>
        <Link
          href="/"
          style={{
            padding: "8px 18px",
            borderRadius: 100,
            background: "#f0f0f0",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "rgba(0,0,0,0.5)",
            textDecoration: "none",
            transition: "background 0.15s",
          }}
        >
          ← Back
        </Link>
        <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.3)" }}>
          Fix #{fix.id}
        </span>
      </header>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div className={styles.content} style={{ padding: 0 }}>
          <h1 className={styles.title} style={{ fontSize: 36 }}>{fix.title}</h1>

          <div className={styles.metaRow}>
            <MetaPill bg={color.green} color={color.black}>{fix.author}</MetaPill>
            <MetaPill>{fix.pr}</MetaPill>
            <MetaPill>{fix.team}</MetaPill>
            <MetaPill>{fix.date}</MetaPill>
            <MetaPill bg={color.greenLight} color={color.greenDone}>Merged</MetaPill>
          </div>

          <div className={styles.comparison}>
            {fix.before.image && fix.after.image ? (
              <>
                <DetailPhone label="Before" src={fix.before.image} caption={fix.before.label} />
                <DetailPhone label="After" src={fix.after.image} caption={fix.after.label} />
              </>
            ) : (
              <>
                <DetailText label="Before" text={fix.before.label} />
                <DetailText label="After" text={fix.after.label} />
              </>
            )}
          </div>

          <div className={styles.componentBox}>
            <span className={styles.componentLabel}>Component</span>
            <span className={styles.componentName}>{fix.component}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPhone({ label, src, caption }: { label: string; src: string; caption: string }) {
  return (
    <div>
      <span className={styles.phoneLabel}>{label}</span>
      <div className={styles.phoneFrame}>
        <Image src={src} alt={label} fill style={{ objectFit: "cover" }} sizes="340px" />
      </div>
      <div className={styles.phoneCaption}>{caption}</div>
    </div>
  );
}

function DetailText({ label, text }: { label: string; text: string }) {
  return (
    <div className={styles.textBox}>
      <span className={styles.textLabel}>{label}</span>
      <span className={styles.textValue}>{text}</span>
    </div>
  );
}

function MetaPill({
  children,
  bg = "var(--color-gray-200)",
  color: textColor = "rgba(0,0,0,0.45)",
}: {
  children: React.ReactNode;
  bg?: string;
  color?: string;
}) {
  return (
    <span className={styles.metaPill} style={{ background: bg, color: textColor }}>
      {children}
    </span>
  );
}
