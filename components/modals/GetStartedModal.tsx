"use client";

import { Modal } from "@/components/ui/Modal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SETUP_STEPS } from "@/data/fixes";
import styles from "../styles/GetStartedModal.module.css";

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GetStartedModal({ isOpen, onClose }: GetStartedModalProps) {
  const [completedSteps, setCompletedSteps] = useLocalStorage<Record<number, boolean>>("polish-cash-setup", {});

  const toggleStep = (id: number) =>
    setCompletedSteps(p => ({ ...p, [id]: !p[id] }));
  const completedCount = Object.values(completedSteps).filter(Boolean).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Get started">
      <div className={styles.content}>
        <h2 className={styles.title}>Get started</h2>
        <p className={styles.subtitle}>
          Five steps to start reporting bugs. Everything flows through one channel and one board.
        </p>

        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressCount}>{completedCount} of {SETUP_STEPS.length}</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${(completedCount / SETUP_STEPS.length) * 100}%` }}
          />
        </div>

        <div className={styles.steps}>
          {SETUP_STEPS.map(step => {
            const done = completedSteps[step.id];
            return (
              <div
                key={step.id}
                className={`${styles.stepRow} ${done ? styles.stepRowDone : styles.stepRowPending}`}
              >
                <button
                  onClick={() => toggleStep(step.id)}
                  role="checkbox"
                  aria-checked={!!done}
                  aria-label={step.title}
                  className={`${styles.checkbox} ${done ? styles.checkboxDone : styles.checkboxPending}`}
                >
                  ✓
                </button>
                <div className={styles.stepInfo}>
                  <div className={`${styles.stepTitle} ${done ? styles.stepTitleDone : styles.stepTitlePending}`}>
                    {step.title}
                  </div>
                  <div className={styles.stepDesc}>{step.desc}</div>
                </div>
                <button
                  onClick={() => toggleStep(step.id)}
                  className={`${styles.actionBtn} ${done ? styles.actionBtnDone : styles.actionBtnPending}`}
                >
                  {done ? "Undo" : step.action}
                </button>
              </div>
            );
          })}
        </div>

        {completedCount === SETUP_STEPS.length && (
          <div className={styles.success}>
            <div className={styles.successTitle}>You&apos;re all set</div>
            <div className={styles.successDesc}>Go find some bugs.</div>
          </div>
        )}
      </div>
    </Modal>
  );
}
