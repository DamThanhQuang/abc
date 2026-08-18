"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef } from "react";

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
};

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`h-8 min-w-[32px] px-2 rounded-[4px] font-sans text-[12px] font-medium transition-colors ${
        active
          ? "bg-brand text-white"
          : "text-content-body hover:bg-surface-card"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ name, defaultValue = "", placeholder = "Noi dung bai viet..." }: RichTextEditorProps) {
  const hiddenRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none font-sans text-[14px] text-content-body",
      },
    },
    onUpdate: ({ editor }) => {
      if (hiddenRef.current) {
        hiddenRef.current.value = editor.getHTML();
      }
    },
  });

  if (!editor) return null;

  function addLink() {
    const url = prompt("Nhap URL:");
    if (url) {
      editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  function addImage() {
    const url = prompt("Nhap URL anh:");
    if (url) {
      editor!.chain().focus().setImage({ src: url }).run();
    }
  }

  return (
    <div className="rounded-btn border border-border-ui bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border-ui px-2 py-1.5 bg-surface-card/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="In dam"
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="In nghieng"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Gach ngang"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="w-px h-5 bg-border-ui mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <div className="w-px h-5 bg-border-ui mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Danh sach"
        >
          &bull; List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Danh sach so"
        >
          1. List
        </ToolbarButton>

        <div className="w-px h-5 bg-border-ui mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Trich dan"
        >
          &ldquo;&rdquo;
        </ToolbarButton>
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Them link">
          Link
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Them anh">
          Anh
        </ToolbarButton>

        <div className="w-px h-5 bg-border-ui mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Duong ke ngang"
        >
          &#8212;
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden input for form submission */}
      <input type="hidden" ref={hiddenRef} name={name} defaultValue={defaultValue} />
    </div>
  );
}
