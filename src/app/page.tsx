import { Clients, Cta, Faq, Hero, Process, Reviews, Services, Studio, Team, Work } from "@/sections/home";
// PENDING (PENDING_FEATURES.md): sections with no content on thorvix.com yet
// import { Impact, Insights, Pricing, Stack } from "@/sections/home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Clients />
      <Studio />
      <Services />
      <Work />
      <Process />
      {/* <Impact /> */}
      {/* <Stack /> */}
      <Team />
      <Reviews />
      {/* <Pricing /> */}
      {/* Faq currently renders the Solutions panels; the FAQ questions are pending */}
      <Faq />
      {/* <Insights /> */}
      <Cta />
    </>
  );
}
