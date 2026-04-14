"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { color } from "@/lib/tokens";
import type { Fix } from "@/types";
import styles from "../styles/FixDetailModal.module.css";

interface FixDetailModalProps {
  fix: Fix | null;
  onClose: () => void;
}

export function FixDetailModal({ fix, onClose }: FixDetailModalProps) {
  return (
    <Modal isOpen={!!fix} onClose={onClose} wide ariaLabel={fix?.title ?? "Fix detail"}>
      {fix && (
        <div className={styles.content}>
          <h2 className={styles.title}>{fix.title}</h2>

          <div className={styles.metaRow}>
            <MetaPill bg={color.green} color={color.black}>{fix.author}</MetaPill>
            <MetaPill>{fix.pr}</MetaPill>
            <MetaPill>{fix.team}</MetaPill>
            <MetaPill>{fix.date}</MetaPill>
            <MetaPill bg={color.greenLight} color={color.greenDone}>Merged</MetaPill>
          </div>

          <div className={styles.comparison}>
            {fix.before.image && fix.after.image ? (
              <>
                <DetailPhone label="Before" src={fix.before.image} caption={fix.before.label} />
                <DetailPhone label="After" src={fix.after.image} caption={fix.after.label} />
              </>
            ) : (
              <>
                <DetailText label="Before" text={fix.before.label} />
                <DetailText label="After" text={fix.after.label} />
              </>
            )}
          </div>

          <div className={styles.componentBox}>
            <span className={styles.componentLabel}>Component</span>
            <span className={styles.componentName}>{fix.component}</span>
          </div>
        </div>
      )}
    </Modal>
  );
}

function DetailPhone({ label, src, caption }: { label: string; src: string; caption: string }) {
  return (
    <div>
      <span className={styles.phoneLabel}>{label}</span>
      <div className={styles.phoneFrame}>
        <Image src={src} alt={label} fill style={{ objectFit: "cover" }} sizes="340px" />
      </div>
      <div className={styles.phoneCaption}>{caption}</div>
    </div>
  );
}

function DetailText({ label, text }: { label: string; text: string }) {
  return (
    <div className={styles.textBox}>
      <span className={styles.textLabel}>{label}</span>
      <span className={styles.textValue}>{text}</span>
    </div>
  );
}

function MetaPill({
  children,
  bg = "var(--color-gray-200)",
  color: textColor = "rgba(0,0,0,0.45)",
}: {
  children: React.ReactNode;
  bg?: string;
  color?: string;
}) {
  return (
    <span className={styles.metaPill} style={{ background: bg, color: textColor }}>
      {children}
    </span>
  );
}
