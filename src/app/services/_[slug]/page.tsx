// PENDING (PENDING_FEATURES.md): this page is not on thorvix.com yet. The route returns 404 until
// the original below is restored: delete this stub and uncomment the block.
import { notFound } from "next/navigation";

export default function PendingPage() {
  notFound();
}

/*
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/data/cms";
import { Cta } from "@/sections/home";
import { ServiceDetail } from "@/sections/services/ServiceDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: `${s.f1} — Software Development Service | Thorvix`, description: s.f2 };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (!services.some((s) => s.slug === slug)) notFound();
  return (
    <>
      <ServiceDetail slug={slug} />
      <Cta />
    </>
  );
}
*/
