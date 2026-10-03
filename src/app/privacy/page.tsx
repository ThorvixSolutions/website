import type { Metadata } from "next";
import { Legal } from "@/sections/legal/Legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Thorvix",
  description: "How Thorvix collects and uses information on this website.",
};

export default function PrivacyPage() {
  return <Legal kind="privacy" />;
}
