import type { Metadata } from "next";
import { Contact } from "@/sections/contact/Contact";

export const metadata: Metadata = {
  title: "Contact — Start a Software Project | Forrentech",
  description: "Tell Forrentech what you are building. Reply within one business day, a free scoping call and a fixed quote for your first release.",
};

export default function ContactPage() {
  return <Contact />;
}
