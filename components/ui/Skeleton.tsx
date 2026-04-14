import styles from "../styles/Skeleton.module.css";

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.imageArea} />
      <div className={styles.infoBar}>
        <div className={styles.titleLine} />
        <div className={styles.metaLine} />
      </div>
    </div>
  );
}

export function SkeletonFeed({ count = 3 }: { count?: number }) {
  return (
    <div className={styles.feed}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
