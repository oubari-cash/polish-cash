"use client";

import Image from "next/image";
import { useCountUp } from "@/hooks/useCountUp";
import styles from "./styles/Hero.module.css";

interface HeroProps {
  count: number;
}

export function Hero({ count }: HeroProps) {
  const animatedCount = useCountUp(count);
  /** Reserve width for the final digit count so the flex sides don’t shift during the animation */
  const countMinWidthCh = Math.max(1, String(count).length);

  return (
    <section className={styles.hero}>
      <div className={styles.imagesLeft}>
        <Image
          src="/cash-stack.png"
          alt=""
          width={167}
          height={271}
          className={styles.cashImage}
          priority
        />
        <Image
          src="/cash-stack.png"
          alt=""
          width={167}
          height={271}
          className={styles.cashImage}
          priority
        />
      </div>
      <div
        className={styles.count}
        style={{ minWidth: `${countMinWidthCh}ch` }}
      >
        {animatedCount}
      </div>
      <div className={styles.imagesRight}>
        <Image
          src="/cash-stack.png"
          alt=""
          width={167}
          height={271}
          className={styles.cashImage}
          priority
        />
        <Image
          src="/cash-stack.png"
          alt=""
          width={167}
          height={271}
          className={styles.cashImage}
          priority
        />
      </div>
    </section>
  );
}
