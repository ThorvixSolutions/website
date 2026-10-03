import type { Metadata } from "next";
import { Clients, Cta, Reviews } from "@/sections/home";
import { PageHero } from "@/sections/shared/PageHero";
import { WorkList } from "@/sections/work/WorkList";

export const metadata: Metadata = {
  title: "Our Work — Case Studies from Startups & Growing Companies | Thorvix",
  description:
    "Case studies of web apps, mobile apps and AI products Thorvix designed, built and shipped: travel, fintech, health, retail and more.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="Work"
        title="Products we|*shipped.*"
        intro="Real launches with real numbers. Every case below was designed, built and shipped by the same team you would work with."
        crumbs="Home:/, Work:/work"
        facts="140+|products shipped;4.9/5|client rating;12|industries"
      />
      <WorkList />
      <Clients />
      <Reviews />
      <Cta />
    </>
  );
}
