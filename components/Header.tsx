"use client";

import { color } from "@/lib/tokens";
import styles from "./styles/Header.module.css";

interface HeaderProps {
  onHowItWorks: () => void;
  onGetStarted: () => void;
}

export function Header({ onHowItWorks, onGetStarted }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>✦</div>
        <span className={styles.title}>Polish Cash</span>
      </div>
      <div className={styles.actions}>
        <button
          onClick={onHowItWorks}
          className={styles.navBtn}
          style={{ background: color.black, color: color.white }}
        >
          How it works
        </button>
        <button
          onClick={onGetStarted}
          className={styles.navBtn}
          style={{ background: color.green, color: color.black }}
        >
          Get started →
        </button>
      </div>
    </header>
  );
}
