"use client";

import type { LandingPageContent } from "@/lib/landing-content/types";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableMarkdown } from "@/components/cms/EditableMarkdown";
import { EditableText } from "@/components/cms/EditableText";
import { CmsAddItemCard } from "@/components/cms/CmsAddItemCard";
import { Button } from "@/components/ui/button";

type TeamMember = LandingPageContent["pages"]["about"]["meetTeamMembers"][number];

export function MeetTheTeamGridClient({
  members,
}: {
  members: LandingPageContent["pages"]["about"]["meetTeamMembers"];
}) {
  const context = useEditModeContext();
  const membersFromContext = context?.getFieldValue("pages.about.meetTeamMembers");
  const items = Array.isArray(membersFromContext)
    ? (membersFromContext as LandingPageContent["pages"]["about"]["meetTeamMembers"])
    : members;

  function addMember() {
    if (!context?.isEditMode) return;
    const next: TeamMember = {
      name: "Team Member",
      role: "Support Specialist",
      bio: "",
      imageUrl: "",
    };
    context.updateField("pages.about.meetTeamMembers", [...items, next]);
  }

  function removeMember(index: number) {
    if (!context?.isEditMode) return;
    context.updateField(
      "pages.about.meetTeamMembers",
      items.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="mt-8 grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((member, idx) => {
        return (
          <div
            key={`${member.name}-${idx}`}
            className="w-full overflow-hidden rounded-[28px] border border-foreground/10 bg-card p-4"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-[22px] bg-[color:var(--overlay-1)]">
              <EditableImage
                path={`pages.about.meetTeamMembers.${idx}.imageUrl`}
                src={member.imageUrl}
                alt={member.name}
                cropAspect={1}
                className="absolute inset-0"
                imgClassName="absolute inset-0 h-full w-full rounded-[22px] object-cover"
              />
            </div>

            <div className="mt-4">
              <EditableText
                path={`pages.about.meetTeamMembers.${idx}.name`}
                value={member.name}
                as="div"
                className="hero-name text-xl"
              />
              <EditableText
                path={`pages.about.meetTeamMembers.${idx}.role`}
                value={member.role}
                as="div"
                className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-foreground/55"
              />

              {member.bio ? (
                <EditableMarkdown
                  path={`pages.about.meetTeamMembers.${idx}.bio`}
                  value={member.bio}
                  className="mt-3 text-sm text-foreground/72"
                />
              ) : null}

              {context?.isEditMode ? (
                <div className="mt-4">
                  <Button type="button" variant="outline" onClick={() => removeMember(idx)} className="w-full">
                    Remove
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      {context?.isEditMode ? (
        <div className="w-full overflow-hidden rounded-[28px] border border-foreground/10 bg-card p-4">
          <CmsAddItemCard
            label="Add member"
            onClick={addMember}
            className="h-full min-h-90 w-full rounded-[22px]"
          />
        </div>
      ) : null}
    </div>
  );
}
