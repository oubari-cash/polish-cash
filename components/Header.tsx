"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./styles/Header.module.css";

interface HeaderProps {
  onHowItWorks: () => void;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TEXT = "DESIGN FIXES BY CASH APP DESIGNERS";
/** Slower tick + higher minimum flips so random runs don’t feel rushed */
const TICK_MS = 85;
const STAGGER = 3;
const FLIPS_MIN = 9;
const FLIPS_SPREAD = 5;
const REPLAY_DELAY = 10000;

function SplitFlapText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState(text.split(""));

  const animate = useCallback(() => {
    const target = text.split("");
    const current = [...target];
    const flips = target.map((ch) =>
      ch === " " ? 0 : FLIPS_MIN + Math.floor(Math.random() * FLIPS_SPREAD)
    );
    const wait = target.map((_, i) => i * STAGGER);
    let tick = 0;

    const id = setInterval(() => {
      let allDone = true;
      for (let i = 0; i < current.length; i++) {
        if (flips[i] === 0) continue;
        if (tick < wait[i]) {
          allDone = false;
          continue;
        }
        const elapsed = tick - wait[i];
        if (elapsed >= flips[i]) {
          current[i] = target[i];
        } else {
          current[i] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          allDone = false;
        }
      }
      setDisplayed([...current]);
      tick++;
      if (allDone) clearInterval(id);
    }, TICK_MS);

    return id;
  }, [text]);

  useEffect(() => {
    const id = animate();
    const replay = setInterval(animate, REPLAY_DELAY);
    return () => {
      clearInterval(id);
      clearInterval(replay);
    };
  }, [animate]);

  return (
    <span className={styles.subtitle} aria-label={text}>
      {displayed.map((ch, i) => (
        <span key={i} className={styles.flipChar}>{ch === " " ? "\u00A0" : ch}</span>
      ))}
    </span>
  );
}

export function Header({ onHowItWorks }: HeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.title}>Polish Cash</span>
      <SplitFlapText text={TEXT} />
      <div className={styles.actions}>
        <button type="button" onClick={onHowItWorks} className={styles.navBtn}>
          How it works
        </button>
      </div>
    </header>
  );
}
