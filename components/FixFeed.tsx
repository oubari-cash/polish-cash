"use client";

import { FixCard } from "./FixCard";
import type { Fix } from "@/types";
import styles from "./styles/FixFeed.module.css";

interface FixFeedProps {
  fixes: Fix[];
  onSelectFix: (fix: Fix) => void;
  onSetupClick: () => void;
}

export function FixFeed({ fixes, onSelectFix, onSetupClick }: FixFeedProps) {
  return (
    <main id="main-content" className={styles.feed}>
      {fixes.map((fix, i) => (
        <FixCard key={fix.id} fix={fix} index={i} onClick={() => onSelectFix(fix)} />
      ))}

      {fixes.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>Nothing here yet</div>
          <button onClick={onSetupClick} className={styles.emptyButton}>
            Set up this team →
          </button>
        </div>
      )}
    </main>
  );
}
