"use client";

import styles from "./styles/TeamFilter.module.css";

interface TeamFilterProps {
  teams: string[];
  active: string;
  onChange: (team: string) => void;
}

export function TeamFilter({ teams, active, onChange }: TeamFilterProps) {
  return (
    <div className={styles.wrapper}>
      {teams.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          aria-pressed={active === t}
          className={styles.button}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
