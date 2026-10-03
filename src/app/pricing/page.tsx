// PENDING (PENDING_FEATURES.md): this page is not on thorvix.com yet. The route returns 404 until
// the original below is restored: delete this stub and uncomment the block.
import { notFound } from "next/navigation";

export default function PendingPage() {
  notFound();
}

/*
import type { Metadata } from "next";
import { Cta, Faq, Pricing } from "@/sections/home";
import { PageHero } from "@/sections/shared/PageHero";

export const metadata: Metadata = {
  title: "Pricing — MVP Sprints, Product Teams & Retainers | Thorvix",
  description: "Fixed-price MVP sprints, monthly product teams and scale retainers. Transparent pricing from Thorvix, a software development studio.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        index="04"
        eyebrow="Pricing"
        title="Clear prices,|no *surprises.*"
        intro="A fixed quote for your first release, a monthly squad for your roadmap, or a retainer to keep a live product fast."
        crumbs="Home:/, Pricing:/pricing"
        facts="$18k|MVP from;30 days|notice, no lock-in;0|hidden fees"
      />
      <Pricing />
      <Faq />
      <Cta />
    </>
  );
}
*/
