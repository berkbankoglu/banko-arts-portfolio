import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Works",
  description: "Full portfolio of Banko Arts — photorealistic exterior and interior 3D renders and animations.",
  alternates: { canonical: "https://bankoarts.com/works" },
};

export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
