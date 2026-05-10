import type { Metadata } from "next";
import "./globals.css";

import { SmoothScrollbarRoot } from "@/components/smooth-scrollbar-root";
import { DEFAULT_LANDING_PAGE_CONTENT } from "@/lib/landing-content/default-content";
import { Navbar } from "@/components/landing/Navbar";

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
    <html
      lang="en"
      className="h-full antialiased"
      style={{ ["--font-sans" as string]: "system-ui" }}
    >
      <body className="min-h-full overflow-hidden">
        <Navbar navbar={DEFAULT_LANDING_PAGE_CONTENT.navbar} />

        <SmoothScrollbarRoot>
          <main className="">
            {children}
          </main>
        </SmoothScrollbarRoot>
      </body>
    </html>
  );
}