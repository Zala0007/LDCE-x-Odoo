import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GlobeTrotter — Travel, thoughtfully", template: "%s · GlobeTrotter" },
  description: "Design thoughtful multi-city journeys, keep an eye on cost, and share the adventure.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
