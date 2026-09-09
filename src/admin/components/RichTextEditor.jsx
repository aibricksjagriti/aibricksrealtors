"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Quote,
  Link2,
  Link2Off,
  ImagePlus,
  Eraser,
  Undo2,
  Redo2,
} from "lucide-react";
import { normalizeEditorHtml, toSavedHtml } from "./normalizeEditorHtml";

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

/**
 * Rich text editor for the admin pages, built on TipTap/ProseMirror.
 *
 * Keeps the same contract as before — `value` in as HTML, `onChange` out as
 * HTML — so the public side keeps rendering it through `sanitizeHtml` and the
 * shared `.rich-text` styles.
 *
 * Headings, lists and quotes are block-level: they apply to the paragraph(s)
 * the selection touches, which is why stored content is split into real
 * paragraphs on load (see `normalizeEditorHtml`). Use Font Size to change part
 * of a line without turning it into its own block.
 *
 * `onEditorReady` hands the TipTap instance to the caller (used by the tests).
 */
export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write the full content here…",
  onEditorReady,
}) {
  const fileInputRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const lastSynced = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    // Next.js renders this on the server first; TipTap must wait for the client.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // What you see is what gets saved — no phantom paragraph at the end.
        trailingNode: false,
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      TextStyle,
      FontSize,
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: normalizeEditorHtml(value),
    editorProps: {
      attributes: {
        class:
          "rich-text rich-editor min-h-40 max-h-[28rem] overflow-y-auto px-4 py-3 text-gray-800 outline-none",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": placeholder,
      },
    },
    onUpdate: ({ editor: instance }) => {
      const html = instance.isEmpty ? "" : toSavedHtml(instance.getHTML());
      // Remember our own output so the sync effect doesn't feed it back in.
      lastSynced.current = html;
      onChangeRef.current?.(html);
    },
  });

  useEffect(() => {
    if (editor) onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  // Pull in a value that changed outside the editor (e.g. the developer
  // loading in). Our own edits come back through `value` unchanged, and those
  // are ignored so the caret is never reset mid-typing.
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    if (incoming === (lastSynced.current ?? "")) return;
    lastSynced.current = incoming;
    editor.commands.setContent(normalizeEditorHtml(incoming), {
      emitUpdate: false,
    });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      bold: instance?.isActive("bold") ?? false,
      italic: instance?.isActive("italic") ?? false,
      underline: instance?.isActive("underline") ?? false,
      strike: instance?.isActive("strike") ?? false,
      h1: instance?.isActive("heading", { level: 1 }) ?? false,
      h2: instance?.isActive("heading", { level: 2 }) ?? false,
      h3: instance?.isActive("heading", { level: 3 }) ?? false,
      paragraph: instance?.isActive("paragraph") ?? false,
      bulletList: instance?.isActive("bulletList") ?? false,
      orderedList: instance?.isActive("orderedList") ?? false,
      blockquote: instance?.isActive("blockquote") ?? false,
      link: instance?.isActive("link") ?? false,
      fontSize: instance?.getAttributes("textStyle")?.fontSize ?? "",
      canUndo: instance?.can().undo() ?? false,
      canRedo: instance?.can().redo() ?? false,
    }),
  });

  const run = useCallback(
    (fn) => {
      if (!editor) return;
      fn(editor.chain().focus()).run();
    },
    [editor],
  );

  const toggleLink = useCallback(() => {
    if (!editor) return;

    if (editor.isActive("link")) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const url = window.prompt("Enter the link URL (https://…)");
    if (!url) return;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const uploadImage = useCallback(
    async (file) => {
      if (!file || !editor) return;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("path", "developers/about");

      setUploading(true);
      try {
        const res = await fetch(`${window.location.origin}/api/upload`, {
          method: "POST",
          body: fd,
        });
        const data = await res.json();

        if (!data?.success) {
          alert(data?.error || "Upload failed");
          return;
        }

        editor.chain().focus().setImage({ src: data.url, alt: "" }).run();
      } catch (err) {
        alert(err.message);
      } finally {
        setUploading(false);
      }
    },
    [editor],
  );

  return (
    <div className="rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[var(--color-brickred)]/40">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-2 py-1.5">
        <Btn
          title="Bold"
          active={state?.bold}
          onClick={() => run((c) => c.toggleBold())}
        >
          <Bold size={16} />
        </Btn>
        <Btn
          title="Italic"
          active={state?.italic}
          onClick={() => run((c) => c.toggleItalic())}
        >
          <Italic size={16} />
        </Btn>
        <Btn
          title="Underline"
          active={state?.underline}
          onClick={() => run((c) => c.toggleUnderline())}
        >
          <Underline size={16} />
        </Btn>
        <Btn
          title="Strikethrough"
          active={state?.strike}
          onClick={() => run((c) => c.toggleStrike())}
        >
          <Strikethrough size={16} />
        </Btn>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <select
          aria-label="Font size"
          value={state?.fontSize || ""}
          onChange={(e) => {
            const size = e.target.value;
            run((c) => (size ? c.setFontSize(size) : c.unsetFontSize()));
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-700"
        >
          <option value="">Font size</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={`${size}px`}>
              {size}px
            </option>
          ))}
        </select>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <Btn
          title="Heading 1"
          active={state?.h1}
          onClick={() => run((c) => c.toggleHeading({ level: 1 }))}
        >
          <Heading1 size={16} />
        </Btn>
        <Btn
          title="Heading 2"
          active={state?.h2}
          onClick={() => run((c) => c.toggleHeading({ level: 2 }))}
        >
          <Heading2 size={16} />
        </Btn>
        <Btn
          title="Heading 3"
          active={state?.h3}
          onClick={() => run((c) => c.toggleHeading({ level: 3 }))}
        >
          <Heading3 size={16} />
        </Btn>
        <Btn
          title="Paragraph"
          active={state?.paragraph}
          onClick={() => run((c) => c.setParagraph())}
        >
          <Pilcrow size={16} />
        </Btn>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <Btn
          title="Bullet list"
          active={state?.bulletList}
          onClick={() => run((c) => c.toggleBulletList())}
        >
          <List size={16} />
        </Btn>
        <Btn
          title="Numbered list"
          active={state?.orderedList}
          onClick={() => run((c) => c.toggleOrderedList())}
        >
          <ListOrdered size={16} />
        </Btn>
        <Btn
          title="Quote"
          active={state?.blockquote}
          onClick={() => run((c) => c.toggleBlockquote())}
        >
          <Quote size={16} />
        </Btn>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <Btn title={state?.link ? "Remove link" : "Add link"} active={state?.link} onClick={toggleLink}>
          {state?.link ? <Link2Off size={16} /> : <Link2 size={16} />}
        </Btn>
        <Btn
          title="Insert image"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus size={16} />
        </Btn>
        <Btn
          title="Clear formatting"
          onClick={() => run((c) => c.unsetAllMarks().clearNodes())}
        >
          <Eraser size={16} />
        </Btn>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        <Btn
          title="Undo"
          disabled={!state?.canUndo}
          onClick={() => run((c) => c.undo())}
        >
          <Undo2 size={16} />
        </Btn>
        <Btn
          title="Redo"
          disabled={!state?.canRedo}
          onClick={() => run((c) => c.redo())}
        >
          <Redo2 size={16} />
        </Btn>

        {uploading && (
          <span className="ml-2 text-xs text-blue-600 animate-pulse">
            Uploading…
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file);
          e.target.value = "";
        }}
      />

      <EditorContent editor={editor} />
    </div>
  );
}

function Btn({ title, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active ? "true" : "false"}
      disabled={disabled}
      // Keep the editor's selection while the toolbar is clicked.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`p-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? "bg-[var(--color-brickred)]/10 text-[var(--color-brickred)]"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}
