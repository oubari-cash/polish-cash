"use client";

import type { CSSProperties } from "react";
import { teamDotColor } from "@/lib/teamColors";
import styles from "./styles/TeamFilter.module.css";

interface TeamFilterProps {
  teams: string[];
  /** Selected team, or `null` when no filter (show all teams) */
  active: string | null;
  onChange: (team: string) => void;
  searchQuery: string;
  onSearchClick: () => void;
  onClearSearch: () => void;
}

function truncateQuery(q: string, max = 22) {
  const t = q.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TeamFilter({
  teams,
  active,
  onChange,
  searchQuery,
  onSearchClick,
  onClearSearch,
}: TeamFilterProps) {
  const hasQuery = searchQuery.trim().length > 0;
  const display = truncateQuery(searchQuery);

  return (
    <div className={styles.wrapper}>
      {teams.map(t => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          aria-pressed={active === t}
          className={`${styles.button} ${styles.buttonWithDot}`}
          style={{ "--team": teamDotColor(t) } as CSSProperties}
        >
          <span className={styles.teamDot} aria-hidden />
          {t}
        </button>
      ))}

      {hasQuery ? (
        <div className={styles.searchChip} role="group" aria-label="Active search">
          <button
            type="button"
            onClick={onSearchClick}
            className={styles.searchPillActive}
            title={searchQuery.trim()}
            aria-label={`Edit search: ${searchQuery.trim()}`}
          >
            <SearchIcon className={styles.searchIcon} />
            <span className={styles.queryText}>{display}</span>
          </button>
          <button
            type="button"
            onClick={onClearSearch}
            className={styles.clearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onSearchClick}
          className={styles.searchCircle}
          aria-label="Search fixes"
          title="Search"
        >
          <SearchIcon className={styles.searchCircleIcon} />
        </button>
      )}
    </div>
  );
}
