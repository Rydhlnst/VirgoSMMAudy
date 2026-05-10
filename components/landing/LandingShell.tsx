import type { LandingPageContent } from "@/lib/landing-content/types";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export function LandingShell({
  content,
  children,
}: {
  content: Pick<LandingPageContent, "navbar" | "footer">;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar navbar={content.navbar} />
      <main className="flex-1">{children}</main>
      <Footer footer={content.footer} />
    </div>
  );
}

