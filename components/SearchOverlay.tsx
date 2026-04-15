"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { Fix } from "@/types";
import { teamDotColor } from "@/lib/teamColors";
import styles from "./styles/SearchOverlay.module.css";

const EXIT_MS = 300;

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  matches: Fix[];
  onSelectFix: (id: number) => void;
}

export function SearchOverlay({
  isOpen,
  onClose,
  value,
  onChange,
  matches,
  onSelectFix,
}: SearchOverlayProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [leaving, setLeaving] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const activeIdxRef = useRef(-1);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trapActive = isOpen || leaving;
  const trapRef = useFocusTrap(trapActive);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  const finishExit = useCallback(() => {
    setMounted(false);
    setLeaving(false);
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      setMounted(true);
      setLeaving(false);
      setActiveIdx(-1);
      activeIdxRef.current = -1;
      return;
    }
    if (mounted) {
      setLeaving(true);
      exitTimerRef.current = setTimeout(finishExit, EXIT_MS);
    }
    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [isOpen, mounted, finishExit]);

  useEffect(() => {
    setActiveIdx(-1);
    activeIdxRef.current = -1;
  }, [value, matches.length]);

  useEffect(() => {
    if (!trapActive) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [trapActive, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 50);
    return () => clearTimeout(t);
  }, [isOpen]);

  const hasQuery = value.trim().length > 0;
  const showEmpty = hasQuery && matches.length === 0;
  const showResults = hasQuery && matches.length > 0;

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => {
        const next = Math.min(i + 1, matches.length - 1);
        activeIdxRef.current = next;
        return next;
      });
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => {
        const next = Math.max(i - 1, -1);
        activeIdxRef.current = next;
        return next;
      });
      return;
    }
    if (e.key === "Enter") {
      const idx = activeIdxRef.current;
      if (idx >= 0 && matches[idx]) {
        e.preventDefault();
        onSelectFix(matches[idx].id);
      }
    }
  }

  if (typeof document === "undefined" || !mounted) return null;

  return createPortal(
    <div className={styles.root}>
      <button
        type="button"
        tabIndex={-1}
        className={`${styles.backdrop} ${leaving ? styles.backdropLeaving : ""}`}
        onClick={onClose}
        aria-label="Close search"
      />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search fixes"
        className={`${styles.searchBox} ${leaving ? styles.searchBoxLeaving : ""}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.searchBoxInner}>
          <input
            ref={inputRef}
            id="polish-search-input"
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search title, team, component, author…"
            className={styles.input}
            autoComplete="off"
            spellCheck={false}
            aria-autocomplete="list"
            aria-controls="polish-search-results"
            aria-expanded={showResults || showEmpty}
          />
          <div
            id="polish-search-results"
            className={styles.results}
            role="listbox"
            aria-label="Results"
            hidden={!showResults}
          >
            {matches.map((fix, i) => (
              <div
                key={fix.id}
                role="option"
                aria-selected={activeIdx === i}
                className={`${styles.result} ${activeIdx === i ? styles.resultActive : ""}`}
                onClick={() => onSelectFix(fix.id)}
              >
                <span
                  className={styles.resultDot}
                  style={{ background: teamDotColor(fix.team) }}
                  aria-hidden
                />
                <span className={styles.resultText}>
                  <span className={styles.resultTitle}>{fix.title}</span>
                  <span className={styles.resultSub}>
                    {fix.component} · {fix.team}
                  </span>
                </span>
                <span className={styles.resultMeta}>{fix.pr}</span>
              </div>
            ))}
          </div>
          <div
            id="polish-search-empty"
            className={styles.empty}
            hidden={!showEmpty}
            role="status"
          >
            No results
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
