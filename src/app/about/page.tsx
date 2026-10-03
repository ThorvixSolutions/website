import type { Metadata } from "next";
import { About } from "@/sections/about/About";
import { Cta, Reviews, Team } from "@/sections/home";

export const metadata: Metadata = {
  title: "About Thorvix — AI-Powered Engineering, Deployed Fast",
  description:
    "Thorvix is a core team of AI and engineering specialists in Lahore, working globally: custom AI agents, dedicated engineering teams and intelligent automation.",
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
