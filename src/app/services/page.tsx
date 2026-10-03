import type { Metadata } from "next";
import { Cta } from "@/sections/home";
// PENDING (PENDING_FEATURES.md): tech stack is not on thorvix.com yet
// import { Stack } from "@/sections/home";
import { ServicesList } from "@/sections/services/ServicesList";
import { PageHero } from "@/sections/shared/PageHero";

export const metadata: Metadata = {
  title: "Services — AI Automation, AI Agents & Dedicated Dev Teams | Thorvix",
  description:
    "AI automation, AI agents and chatbots, dedicated dev teams, staff augmentation, custom software and process optimization from Thorvix.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Services"
        title="Capabilities|engineered for *scale.*"
        intro="Six high-impact verticals. One ruthlessly focused team. We don’t consult: we execute, embed, and deliver production-grade outcomes."
        crumbs="Home:/, Services:/services"
        facts="6|verticals;48h|team deploy;3×|faster shipping"
      />
      <ServicesList />
      {/* <Stack /> */}
      <Cta />
    </>
  );
}
