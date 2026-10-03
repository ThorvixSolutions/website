import type { Metadata } from "next";
import { Cta, Stack } from "@/sections/home";
import { ServicesList } from "@/sections/services/ServicesList";
import { PageHero } from "@/sections/shared/PageHero";

export const metadata: Metadata = {
  title: "Software Development Services — Web Apps, Mobile Apps & AI | Thorvix",
  description:
    "Web apps, mobile apps, AI features, product design, cloud & DevOps and dedicated teams from Thorvix, a software development studio for startups.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Services"
        title="Everything a|product *needs.*"
        intro="Six teams under one roof: web, mobile, AI, design, cloud and dedicated squads. Pick one, or let us run the whole build."
        crumbs="Home:/, Services:/services"
        facts="6|services;2 wk|sprint cycle;140+|products shipped"
      />
      <ServicesList />
      <Stack />
      <Cta />
    </>
  );
}
