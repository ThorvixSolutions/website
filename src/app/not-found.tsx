import type { Metadata } from "next";
import { NotFound } from "@/sections/shared/NotFound";

export const metadata: Metadata = {
  title: "Page not found | Forrentech",
  description: "This page didn't ship.",
};

export default function NotFoundPage() {
  return <NotFound />;
}
