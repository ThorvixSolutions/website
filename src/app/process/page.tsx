import type { Metadata } from "next";
import { Cta, Process } from "@/sections/home";
// PENDING (PENDING_FEATURES.md): the commit heatmap and FAQ are not on thorvix.com yet
// import { Faq, Impact } from "@/sections/home";
import { PageHero } from "@/sections/shared/PageHero";

export const metadata: Metadata = {
  title: "Our Process — Bottleneck to Breakthrough | Thorvix",
  description: "How Thorvix works: discovery and strategy, deploying a team or solution, then scaling and optimizing.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        index="03"
        eyebrow="Process"
        title="Bottleneck to|*breakthrough.*"
        intro="We map every bottleneck, deploy the team or solution, then scale and optimize as your demands evolve."
        crumbs="Home:/, Process:/process"
        facts="3|steps;48h|team deploy;60%|cost reduction"
      />
      <Process />
      {/* <Impact /> */}
      {/* <Faq /> */}
      <Cta />
    </>
  );
}
