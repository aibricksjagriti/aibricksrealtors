"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link2,
  Eraser,
} from "lucide-react";

/**
 * Self-contained rich text editor (no external dependency).
 * Stores its value as HTML and emits it via onChange. Render that HTML on the
 * public side through `sanitizeHtml` + the shared `.rich-text` styles so the
 * formatting (headings, bold, lists, links) shows exactly as edited.
 */
export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write the full content here…",
}) {
  const ref = useRef(null);
  const lastHtml = useRef(value);

  // Sync external value into the editor without clobbering the caret while the
  // user is actively typing (only when the field isn't focused, e.g. async load).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if ((value || "") !== el.innerHTML) {
      el.innerHTML = value || "";
      lastHtml.current = value || "";
    }
  }, [value]);

  const emit = useCallback(() => {
    const html = ref.current?.innerHTML || "";
    if (html === lastHtml.current) return;
    lastHtml.current = html;
    onChange?.(html);
  }, [onChange]);

  // eslint-disable-next-line no-deprecated
  const exec = useCallback(
    (command, arg) => {
      ref.current?.focus();
      document.execCommand(command, false, arg);
      emit();
    },
    [emit]
  );

  const addLink = () => {
    const url = window.prompt("Enter the link URL (https://…)");
    if (url) exec("createLink", url);
  };

  const Btn = ({ title, onClick, children }) => (
    <button
      type="button"
      title={title}
      // Keep the editor's text selection while clicking the toolbar.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="p-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[var(--color-brickred)]/40">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-2 py-1.5">
        <Btn title="Bold" onClick={() => exec("bold")}><Bold size={16} /></Btn>
        <Btn title="Italic" onClick={() => exec("italic")}><Italic size={16} /></Btn>
        <Btn title="Underline" onClick={() => exec("underline")}><Underline size={16} /></Btn>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <Btn title="Heading" onClick={() => exec("formatBlock", "<h2>")}><Heading2 size={16} /></Btn>
        <Btn title="Subheading" onClick={() => exec("formatBlock", "<h3>")}><Heading3 size={16} /></Btn>
        <Btn title="Paragraph" onClick={() => exec("formatBlock", "<p>")}><span className="text-xs font-semibold px-1">P</span></Btn>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <Btn title="Bullet list" onClick={() => exec("insertUnorderedList")}><List size={16} /></Btn>
        <Btn title="Numbered list" onClick={() => exec("insertOrderedList")}><ListOrdered size={16} /></Btn>
        <Btn title="Add link" onClick={addLink}><Link2 size={16} /></Btn>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <Btn title="Clear formatting" onClick={() => exec("removeFormat")}><Eraser size={16} /></Btn>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className="rich-text rich-editor min-h-40 max-h-[28rem] overflow-y-auto px-4 py-3 text-gray-800 outline-none"
      />
    </div>
  );
}
