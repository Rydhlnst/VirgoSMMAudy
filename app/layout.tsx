import type { Metadata } from "next";
import "./globals.css";

import { SmoothScrollbarRoot } from "@/components/smooth-scrollbar-root";

export const metadata: Metadata = {
  title: "Virgo Social",
  description: "Portfolio and services landing page with a simple CMS admin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" style={{ ["--font-sans" as string]: "system-ui" }}>
      <body className="min-h-full overflow-hidden">
        <SmoothScrollbarRoot>{children}</SmoothScrollbarRoot>
      </body>
    </html>
  );
}
