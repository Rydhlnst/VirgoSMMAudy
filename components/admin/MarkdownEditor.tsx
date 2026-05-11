"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  Link2,
  Quote,
  Redo2,
  SeparatorHorizontal,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeightClassName?: string;
};

type ToolbarButtonProps = {
  active?: boolean;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
};

function ToolbarButton({ active = false, label, onClick, icon }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon}
    </Button>
  );
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write markdown content...",
  className,
  minHeightClassName = "min-h-[180px]",
}: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Markdown.configure({
        markedOptions: {
          gfm: true,
          breaks: true,
        },
      }),
    ],
    content: value,
    contentType: "markdown",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "app-description rounded-b-xl border-x border-b border-[color:var(--border-subtle)] bg-[color:var(--card)] px-4 py-3 text-sm text-foreground outline-none",
          minHeightClassName,
        ),
      },
    },
    onUpdate({ editor: currentEditor }) {
      onChange(currentEditor.getMarkdown());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getMarkdown().trim();
    const next = value.trim();
    if (current !== next) {
      editor.commands.setContent(value, { contentType: "markdown" });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className={cn("grid gap-0", className)}>
        <div className="flex flex-wrap gap-2 rounded-t-xl border border-[color:var(--border-subtle)] bg-[color:var(--overlay-1)] p-2" />
        <div
          className={cn(
            "app-description rounded-b-xl border-x border-b border-[color:var(--border-subtle)] bg-[color:var(--card)] px-4 py-3 text-sm text-foreground",
            minHeightClassName,
          )}
        >
          {placeholder}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-0", className)}>
      <div className="flex flex-wrap gap-2 rounded-t-xl border border-[color:var(--border-subtle)] bg-[color:var(--overlay-1)] p-2">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={<Bold className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={<Italic className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          icon={<Underline className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Strike"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          icon={<Strikethrough className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Highlight"
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          icon={<Highlighter className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          icon={<Heading1 className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={<Heading2 className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          icon={<Heading3 className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={<List className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Ordered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Task list"
          active={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          icon={<ListTodo className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={<Quote className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          icon={<Code2 className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<SeparatorHorizontal className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("Set link URL", previousUrl ?? "https://");
            if (url === null) return;
            if (!url.trim()) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: url.trim() }).run();
          }}
          icon={<Link2 className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Align Left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={<AlignLeft className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Align Center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={<AlignCenter className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Align Right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          icon={<AlignRight className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          icon={<Undo2 className="h-4 w-4" />}
        />
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          icon={<Redo2 className="h-4 w-4" />}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
