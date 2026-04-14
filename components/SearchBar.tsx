"use client";

import styles from "./styles/SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

export function SearchBar({ value, onChange, resultCount, totalCount }: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <span className={styles.icon}>⌕</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search fixes..."
          className={styles.input}
          aria-label="Search fixes"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className={styles.clear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {value && (
        <span className={styles.count}>
          {resultCount} of {totalCount} fixes
        </span>
      )}
    </div>
  );
}
