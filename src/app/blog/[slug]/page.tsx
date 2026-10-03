import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/data/cms";
import { Post } from "@/sections/blog/Post";
import { Cta } from "@/sections/home";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.f1} | Thorvix Blog`, description: p.f4 };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  if (!posts.some((p) => p.slug === slug)) notFound();
  return (
    <>
      <Post slug={slug} />
      <Cta />
    </>
  );
}
