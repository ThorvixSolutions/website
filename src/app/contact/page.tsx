import type { Metadata } from "next";
import { Contact } from "@/sections/contact/Contact";

export const metadata: Metadata = {
  title: "Contact — Book a Strategy Call | Thorvix",
  description: "Book a free 30-minute strategy call with Thorvix. No commitment, and we come prepared.",
};

export default function ContactPage() {
  return <Contact />;
}
