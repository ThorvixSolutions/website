import type { Metadata } from "next";
import { Cta, Faq, Impact, Process } from "@/sections/home";
import { PageHero } from "@/sections/shared/PageHero";

export const metadata: Metadata = {
  title: "Our Process — Two-Week Sprints from Idea to Launch | Forrentech",
  description: "How Forrentech builds software: discovery, design, build and ship in two-week sprints, with working software demoed every sprint.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        index="03"
        eyebrow="Process"
        title="From idea|to *launch.*"
        intro="One board you can see, a demo every two weeks and a fixed quote for the first release. No black box."
        crumbs="Home:/, Process:/process"
        facts="8 wk|to an MVP;2 wk|sprints;1 day|reply time"
      />
      <Process />
      <Impact />
      <Faq />
      <Cta />
    </>
  );
}
