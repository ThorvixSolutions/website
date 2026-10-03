import type { Metadata } from "next";
import { About } from "@/sections/about/About";
import { Cta, Reviews, Team } from "@/sections/home";

export const metadata: Metadata = {
  title: "About Thorvix — A Software Development Studio in Austin",
  description:
    "Thorvix is a studio of senior engineers and designers in Austin, Texas, building web apps, mobile apps and AI features for startups since 2016.",
};

export default function AboutPage() {
  return (
    <>
      <About />
      <Team />
      <Reviews />
      <Cta />
    </>
  );
}
