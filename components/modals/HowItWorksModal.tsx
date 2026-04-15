"use client";

import { Modal } from "@/components/ui/Modal";
import { PROCESS_STEPS } from "@/data/fixes";
import styles from "../styles/HowItWorksModal.module.css";

const POLISH_CASH_SLACK = "#polish-cash";
const POLISH_CASH_SLACK_URL =
  "https://square.enterprise.slack.com/archives/C0ATAA59UE5";

function StepDescription({ desc }: { desc: string }) {
  const parts = desc.split(POLISH_CASH_SLACK);
  if (parts.length !== 2) {
    return <p className={styles.stepDesc}>{desc}</p>;
  }
  return (
    <p className={styles.stepDesc}>
      {parts[0]}
      <a
        href={POLISH_CASH_SLACK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.stepDescLink}
      >
        {POLISH_CASH_SLACK}
      </a>
      {parts[1]}
    </p>
  );
}

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="How it works" wide>
      <div className={styles.content}>
        <h2 className={styles.title}>How Polish Cash works</h2>
        <p className={styles.subtitle}>
          Designers file visual bugs in Slack. Everything after that—deduping, ticketing, investigation, and the fix—runs on automation until you sign off on the pixels and an engineer merges.
        </p>

        <ol className={styles.steps} aria-label="Polish Cash workflow steps">
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.num} className={styles.step}>
              <div className={styles.rail} aria-hidden>
                <span
                  className={i === 0 ? styles.dotFirst : styles.dotRest}
                />
                {i < PROCESS_STEPS.length - 1 ? <span className={styles.railLine} /> : null}
              </div>
              <div className={styles.stepBody}>
                <div className={styles.stepHeading}>
                  <span className={styles.stepTitle}>{step.title}</span>
                  {step.badge === "You" ? (
                    <span className={styles.badgeYou}>You</span>
                  ) : step.badge === "Automated" ? (
                    <span className={styles.badgeAuto}>
                      <span className={styles.badgeAutoIcon} aria-hidden>
                        <svg
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            fill="#fff"
                            fillRule="evenodd"
                            d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.482 1.323l-10.5 9a.75.75 0 01-1.27-.707l2.5-7.5H4.75a.75.75 0 01-.482-1.323l9.5-9a.75.75 0 011.035-.125z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      Automated
                    </span>
                  ) : null}
                </div>
                <StepDescription desc={step.desc} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}
