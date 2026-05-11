import { cookies, headers } from "next/headers";
import { Navbar } from "@/components/landing/Navbar";
import { SmoothScrollbarRoot } from "@/components/smooth-scrollbar-root";
import { DEFAULT_LANDING_PAGE_CONTENT } from "@/lib/landing-content/default-content";
import { readLandingPageContent } from "@/lib/landing-content/storage";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth/admin";
import { EditModeProvider } from "@/components/cms/EditModeProvider";
import { CmsSaveBar } from "@/components/cms/CmsSaveBar";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await readLandingPageContent().catch(() => DEFAULT_LANDING_PAGE_CONTENT);

  const cookieStore = await cookies();
  const editCookie = cookieStore.get("cms_edit")?.value === "1";

  if (editCookie) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (isAdminSession(session)) {
      return (
        <EditModeProvider slug="home" initialTitle="Home" initialContent={content} isEditMode>
          <Navbar navbar={content.navbar} />
          <CmsSaveBar />
          <SmoothScrollbarRoot>
            <main>{children}</main>
          </SmoothScrollbarRoot>
        </EditModeProvider>
      );
    }
  }

  return (
    <>
      <Navbar navbar={content.navbar} />
      <SmoothScrollbarRoot>
        <main>{children}</main>
      </SmoothScrollbarRoot>
    </>
  );
}

