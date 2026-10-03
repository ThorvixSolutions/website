import type { Metadata } from "next";
import { Legal } from "@/sections/legal/Legal";

export const metadata: Metadata = {
  title: "Terms of Service | Thorvix",
  description: "The terms for using the Thorvix website.",
};

export default function TermsPage() {
  return <Legal kind="terms" />;
}
