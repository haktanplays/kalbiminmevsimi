"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  ImagePlus,
  Link,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCallback } from "react";

interface ToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: ToolbarProps) {
  const addImage = useCallback(() => {
    const url = window.prompt("Görsel URL'si:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Link URL'si:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const ToolButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/50 px-2 py-1.5">
      <ToolButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Kalın"
      >
        <Bold size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="İtalik"
      >
        <Italic size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Altı Çizili"
      >
        <Underline size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Üstü Çizili"
      >
        <Strikethrough size={16} />
      </ToolButton>

      <div className="mx-1 h-6 w-px bg-border" />

      <ToolButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        isActive={editor.isActive("heading", { level: 2 })}
        title="Başlık 2"
      >
        <Heading2 size={16} />
      </ToolButton>
      <ToolButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        isActive={editor.isActive("heading", { level: 3 })}
        title="Başlık 3"
      >
        <Heading3 size={16} />
      </ToolButton>

      <div className="mx-1 h-6 w-px bg-border" />

      <ToolButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Madde İşareti"
      >
        <List size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numaralı Liste"
      >
        <ListOrdered size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Alıntı"
      >
        <Quote size={16} />
      </ToolButton>

      <div className="mx-1 h-6 w-px bg-border" />

      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Sola Hizala"
      >
        <AlignLeft size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Ortala"
      >
        <AlignCenter size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Sağa Hizala"
      >
        <AlignRight size={16} />
      </ToolButton>

      <div className="mx-1 h-6 w-px bg-border" />

      <ToolButton onClick={setLink} isActive={editor.isActive("link")} title="Link">
        <Link size={16} />
      </ToolButton>
      {editor.isActive("link") && (
        <ToolButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Linki Kaldır"
        >
          <Unlink size={16} />
        </ToolButton>
      )}
      <ToolButton onClick={addImage} title="Görsel Ekle">
        <ImagePlus size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive("highlight")}
        title="Vurgula"
      >
        <Highlighter size={16} />
      </ToolButton>

      <div className="mx-1 h-6 w-px bg-border" />

      <ToolButton
        onClick={() => editor.chain().focus().undo().run()}
        title="Geri Al"
      >
        <Undo size={16} />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().redo().run()}
        title="İleri Al"
      >
        <Redo size={16} />
      </ToolButton>
    </div>
  );
}
