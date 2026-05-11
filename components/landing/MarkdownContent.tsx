"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function MarkdownContent({
  content,
  className,
  tone = "light",
}: {
  content?: string | null;
  className?: string;
  tone?: "light" | "dark";
}) {
  if (!content?.trim()) return null;

  const mutedClass =
    tone === "dark"
      ? "text-[color:var(--inverse-muted-foreground)]"
      : "text-[color:var(--muted-foreground)]";

  return (
    <div
      className={cn(
        "app-description space-y-3 leading-7 [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_h1]:text-3xl [&_h1]:font-black [&_h2]:text-2xl [&_h2]:font-black [&_h3]:text-xl [&_h3]:font-black [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:leading-7",
        mutedClass,
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
