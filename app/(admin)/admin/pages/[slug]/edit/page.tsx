import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { CmsInlineEditor } from "@/components/cms/CmsInlineEditor";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth/admin";
import { getCmsPageBySlug } from "@/lib/cms/cms-service";

export const dynamic = "force-dynamic";

export default async function AdminCmsEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!isAdminSession(session)) {
    redirect("/admin/login?reason=unauthorized");
  }

  const { slug } = await params;
  const page = await getCmsPageBySlug(slug);

  return (
    <div className="min-h-screen bg-[color:var(--background)] pb-24">
      <CmsInlineEditor slug={page.slug} title={page.title} initialContent={page.contentJson} />
      <Toaster richColors position="top-right" />
    </div>
  );
}