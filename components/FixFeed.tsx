"use client";

import { FixCard } from "./FixCard";
import type { Fix } from "@/types";
import styles from "./styles/FixFeed.module.css";

interface FixFeedProps {
  fixes: Fix[];
}

export function FixFeed({ fixes }: FixFeedProps) {
  return (
    <main id="main-content" className={styles.feed}>
      {fixes.map((fix, i) => (
        <FixCard key={fix.id} fix={fix} index={i} />
      ))}

      {fixes.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>Nothing here</div>
          <p className={styles.emptyBody}>
            Time to go find some bugs to fix — we&apos;ll be right here when you do.
          </p>
        </div>
      )}
    </main>
  );
}
