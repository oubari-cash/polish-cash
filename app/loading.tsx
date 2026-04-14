import { SkeletonFeed } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingTop: 200 }}>
      <SkeletonFeed count={4} />
    </div>
  );
}
