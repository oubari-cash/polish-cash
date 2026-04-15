"use client";

import Image from "next/image";
import { teamDotColor } from "@/lib/teamColors";
import { color } from "@/lib/tokens";
import type { Fix } from "@/types";
import styles from "./styles/FixCard.module.css";

interface FixCardProps {
  fix: Fix;
  index?: number;
}

export function FixCard({ fix, index = 0 }: FixCardProps) {
  const hasImages = fix.before.image && fix.after.image;
  const titleId = `fix-title-${fix.id}`;

  return (
    <article
      id={`fix-${fix.id}`}
      className={styles.card}
      style={
        {
          "--index": index,
          "--team": teamDotColor(fix.team),
        } as React.CSSProperties
      }
      aria-labelledby={titleId}
    >
      {hasImages ? (
        <div className={styles.imageArea}>
          <Phone src={fix.before.image!} alt={fix.before.label} label="Before" />
          <Phone src={fix.after.image!} alt={fix.after.label} label="After" />
        </div>
      ) : (
        <div className={styles.textArea}>
          <TextDiff label="Before" text={fix.before.label} />
          <div className={styles.divider} />
          <TextDiff label="After" text={fix.after.label} />
        </div>
      )}

      <div className={styles.infoBar}>
        <h2 id={titleId} className={styles.title}>
          {fix.title}
        </h2>
        <div className={styles.meta}>
          <Pill bg={color.green} color={color.black}>{fix.author}</Pill>
          <Pill>
            <span className={styles.teamDot} aria-hidden />
            {fix.team}
          </Pill>
          <Pill>{fix.component}</Pill>
          <span style={{ flex: 1 }} />
          <Pill>{fix.pr}</Pill>
          <span className={styles.date}>{fix.date}</span>
        </div>
      </div>
    </article>
  );
}

function Phone({ src, alt, label }: { src: string; alt: string; label: string }) {
  return (
    <div className={styles.phone}>
      <span className={styles.phoneLabel}>{label}</span>
      <div className={styles.phoneFrame}>
        <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} sizes="200px" />
      </div>
    </div>
  );
}

function TextDiff({ label, text }: { label: string; text: string }) {
  return (
    <div className={styles.textDiff}>
      <span className={styles.textDiffLabel}>{label}</span>
      <span className={styles.textDiffValue}>{text}</span>
    </div>
  );
}

function Pill({
  children,
  bg = "var(--color-gray-200)",
  color: textColor = "rgba(0,0,0,0.5)",
}: {
  children: React.ReactNode;
  bg?: string;
  color?: string;
}) {
  return (
    <span className={styles.pill} style={{ background: bg, color: textColor }}>
      {children}
    </span>
  );
}
