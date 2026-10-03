import type { Metadata } from "next";
import { Clients, Cta, Reviews } from "@/sections/home";
import { PageHero } from "@/sections/shared/PageHero";
import { WorkList } from "@/sections/work/WorkList";

export const metadata: Metadata = {
  title: "Case Studies — Proven Impact | Thorvix",
  description:
    "Results from Thorvix AI agents, automation and dedicated engineering teams in real estate, e-commerce and SaaS.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="Case studies"
        title="Numbers|don't *lie.*"
        intro="Proven impact in real estate, e-commerce and SaaS, in our clients' own words."
        crumbs="Home:/, Case Studies:/work"
        facts="+40%|lead conversion;−60%|ticket resolution time;3×|faster feature shipping"
      />
      <WorkList />
      <Clients />
      <Reviews />
      <Cta />
    </>
  );
}
