import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virgo Social",
  description: "Portfolio and services landing page with a simple CMS admin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={{ ["--font-sans" as string]: "system-ui" }}
    >
      <body className="min-h-full overflow-hidden">{children}</body>
    </html>
  );
}

