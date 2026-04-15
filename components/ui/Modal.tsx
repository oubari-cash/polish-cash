"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import styles from "../styles/Modal.module.css";

/** Must match the longer of the exit animations in Modal.module.css (+ buffer). */
const EXIT_ANIMATION_MS = 320;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
  ariaLabel?: string;
}

export function Modal({ isOpen, onClose, children, wide = false, ariaLabel }: ModalProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [leaving, setLeaving] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trapActive = isOpen || leaving;
  const trapRef = useFocusTrap(trapActive);

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
      return;
    }
    if (mounted) {
      setLeaving(true);
      exitTimerRef.current = setTimeout(finishExit, EXIT_ANIMATION_MS);
    }
    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [isOpen, mounted, finishExit]);

  useEffect(() => {
    if (!trapActive) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [trapActive, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={`${styles.scrim} ${leaving ? styles.scrimLeaving : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`${styles.dialog} ${wide ? styles.dialogWide : styles.dialogDefault} ${leaving ? styles.dialogLeaving : ""}`}
      >
        <button onClick={onClose} aria-label="Close" className={styles.closeBtn}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
