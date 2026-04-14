import { notFound } from "next/navigation";
import { getFixById, getFixes } from "@/lib/db.server";
import { FixDetailView } from "@/components/FixDetailView";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const fix = getFixById(Number(id));
  if (!fix) return { title: "Fix not found" };

  return {
    title: `${fix.title} — Polish Cash`,
    description: `${fix.before.label} → ${fix.after.label} | Fixed by ${fix.author} in ${fix.component}`,
    openGraph: {
      title: fix.title,
      description: `${fix.before.label} → ${fix.after.label}`,
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return getFixes().map(fix => ({ id: String(fix.id) }));
}

export default async function FixPage({ params }: Props) {
  const { id } = await params;
  const fix = getFixById(Number(id));
  if (!fix) notFound();

  return <FixDetailView fix={fix} />;
}
