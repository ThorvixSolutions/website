import type { Metadata } from "next";
import { BlogList } from "@/sections/blog/BlogList";
import { Cta } from "@/sections/home";
import { PageHero } from "@/sections/shared/PageHero";

export const metadata: Metadata = {
  title: "Blog — Notes on Building Software for Startups | Forrentech",
  description: "Guides on MVP costs, AI features in production and shipping every two weeks, from the Forrentech team.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        index="06"
        eyebrow="Blog"
        title="Notes from|the *build.*"
        intro="What we learn shipping products every two weeks: costs, stacks and the habits that keep projects on time."
        crumbs="Home:/, Blog:/blog"
        facts="3|articles;6 min|average read;Monthly|new notes"
      />
      <BlogList />
      <Cta />
    </>
  );
}
