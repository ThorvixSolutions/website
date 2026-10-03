import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { work } from "@/data/cms";
import { Case } from "@/sections/work/Case";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = work.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `${c.f1} — ${c.f3} | Thorvix`, description: c.f6 };
}

export default async function CasePage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (!work.some((c) => c.slug === slug)) notFound();
  return <Case slug={slug} />;
}
