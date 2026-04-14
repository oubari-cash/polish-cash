"use client";

import { useCountUp } from "@/hooks/useCountUp";
import styles from "./styles/Hero.module.css";

interface HeroProps {
  count: number;
}

export function Hero({ count }: HeroProps) {
  const animatedCount = useCountUp(count);

  return (
    <section className={styles.hero}>
      <div className={styles.count}>{animatedCount}</div>
      <div className={styles.subtitle}>visual bugs found and&nbsp;fixed</div>
    </section>
  );
}
