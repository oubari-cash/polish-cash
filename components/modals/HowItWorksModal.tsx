"use client";

import { Modal } from "@/components/ui/Modal";
import { PROCESS_STEPS } from "@/data/fixes";
import styles from "../styles/HowItWorksModal.module.css";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="How it works">
      <div className={styles.content}>
        <h2 className={styles.title}>How it works</h2>
        <p className={styles.subtitle}>
          Post a bug in #cash-design-bugs → it flows through Linear → BuilderBot opens a PR → merge and it lands here. Five steps, mostly on autopilot.
        </p>

        {PROCESS_STEPS.map((step, i) => (
          <div
            key={i}
            className={`${styles.step} ${i < PROCESS_STEPS.length - 1 ? styles.stepDivider : ""}`}
          >
            <div className={styles.stepNum}>{step.num}</div>
            <div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDesc}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
