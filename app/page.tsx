import { Suspense } from "react";
import { PolishCash } from "@/components/PolishCash";

export default function Home() {
  return (
    <Suspense>
      <PolishCash />
    </Suspense>
  );
}
