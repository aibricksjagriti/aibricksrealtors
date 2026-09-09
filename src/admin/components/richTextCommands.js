/**
 * DOM helpers behind the rich text editor's block-level toolbar buttons.
 *
 * Kept out of the component so the behaviour is unit-testable and so the
 * heading buttons don't depend on `document.execCommand("formatBlock")`, which
 * is deprecated and silently no-ops or produces nested blocks in several
 * browsers.
 *
 * The rules the toolbar needs:
 *  - a plain caret (nothing selected) still converts the line it sits on;
 *  - a selection spanning several lines converts every one of them;
 *  - clicking the same heading again toggles the block back to a paragraph;
 *  - headings never end up nested inside a paragraph (invalid HTML that the
 *    parser rearranges the moment the value is re-rendered);
 *  - a heading is never left with an inline `font-size` that overrides the
 *    heading size coming from the shared `.rich-text` styles.
 */

const HEADINGS = ["H1", "H2", "H3", "H4", "H5", "H6"];

// Blocks the heading/paragraph buttons are allowed to convert.
const CONVERTIBLE = ["P", "DIV", "BLOCKQUOTE", "PRE", ...HEADINGS];

// Block-level elements we leave alone (lists, media, …) but that still act as
// boundaries when wrapping loose text into paragraphs.
const OTHER_BLOCKS = [
  "UL",
  "OL",
  "LI",
  "TABLE",
  "FIGURE",
  "HR",
  "SECTION",
  "ARTICLE",
  "HEADER",
  "FOOTER",
];

const isElement = (node) => node?.nodeType === 1;

const isBlockElement = (node) =>
  isElement(node) &&
  (CONVERTIBLE.includes(node.tagName) || OTHER_BLOCKS.includes(node.tagName));

const isConvertible = (node) =>
  isElement(node) && CONVERTIBLE.includes(node.tagName);

const isBlankText = (node) =>
  node?.nodeType === 3 && !node.textContent.replace(/\u200b/g, "").trim();

/**
 * Make sure every top-level run of text/inline markup lives inside a block, so
 * the heading buttons always have something to convert. `<br>` separated lines
 * become separate paragraphs.
 */
export function normalizeBlocks(root) {
  if (!root) return;
  const doc = root.ownerDocument;
  let run = [];

  const flush = () => {
    if (!run.length) return;
    const nodes = run;
    run = [];
    // Don't manufacture empty paragraphs out of formatting whitespace.
    if (nodes.every(isBlankText)) return;
    const p = doc.createElement("p");
    root.insertBefore(p, nodes[0]);
    nodes.forEach((node) => p.appendChild(node));
  };

  Array.from(root.childNodes).forEach((node) => {
    if (isElement(node) && node.tagName === "BR") {
      // A line break between two loose lines: end the current paragraph.
      flush();
      root.removeChild(node);
      return;
    }
    if (isBlockElement(node)) {
      flush();
      return;
    }
    run.push(node);
  });

  flush();
}

// Range comparison modes, spelled out: the `Range.START_TO_END` constants are
// not exposed on Range instances everywhere (jsdom included) and a missing one
// silently degrades to START_TO_START.
const START_TO_END = 1;
const END_TO_START = 3;

function rangeIntersects(range, node) {
  const probe = node.ownerDocument.createRange();
  probe.selectNode(node);
  // range.start <= node.end  &&  range.end >= node.start
  return (
    range.compareBoundaryPoints(END_TO_START, probe) <= 0 &&
    range.compareBoundaryPoints(START_TO_END, probe) >= 0
  );
}

/** The top-level block of `root` that `node` lives in, if any. */
function blockContaining(root, node, offset) {
  let current = node;
  if (current === root) {
    const children = root.childNodes;
    current = children[offset] || children[offset - 1] || null;
  }
  while (current && current.parentNode && current.parentNode !== root) {
    current = current.parentNode;
  }
  return current && current.parentNode === root && isConvertible(current)
    ? current
    : null;
}

/**
 * Remove inline font sizes inside a block that is becoming a heading — an
 * inline `font-size` beats the stylesheet's heading size, which makes the
 * heading button look like it did nothing.
 */
function stripFontSize(el) {
  [el, ...el.querySelectorAll("[style]")].forEach((node) => {
    if (!node.style) return;
    node.style.removeProperty("font-size");
    if (!node.getAttribute("style")) node.removeAttribute("style");
  });

  Array.from(el.querySelectorAll("span")).forEach((span) => {
    if (span.attributes.length) return;
    while (span.firstChild) span.parentNode.insertBefore(span.firstChild, span);
    span.parentNode.removeChild(span);
  });
}

// Range comparison modes used when clipping a selection to one block.
const START_TO_START = 0;
const END_TO_END = 2;

/** The part of `range` that falls inside `block` (collapsed if none does). */
function clipToBlock(range, block, doc) {
  const clip = doc.createRange();
  clip.selectNodeContents(block);

  const startsInside = range.compareBoundaryPoints(START_TO_START, clip) > 0;
  const endsInside = range.compareBoundaryPoints(END_TO_END, clip) < 0;

  if (endsInside) clip.setEnd(range.endContainer, range.endOffset);
  if (startsInside) clip.setStart(range.startContainer, range.startOffset);

  return clip;
}

const hasContent = (node) =>
  Boolean(node.textContent.trim()) || Boolean(node.querySelector?.("img"));

// Inline wrappers that a split can leave behind with nothing in them.
const PRUNABLE_INLINE =
  "b, i, u, em, strong, span, a, font, s, strike, sub, sup, code, small";

/** Drop inline wrappers a split emptied out (an <b></b> with no text left). */
function pruneEmptyInline(el) {
  Array.from(el.querySelectorAll(PRUNABLE_INLINE)).forEach((node) => {
    if (node.textContent !== "") return;
    if (node.querySelector("img, br")) return;
    node.parentNode?.removeChild(node);
  });
}

/**
 * Move everything in `block` outside [start, end] into sibling blocks of the
 * same tag, so only the selected run is left behind for the caller to convert.
 * Splitting the tail first keeps the head's boundary offsets valid.
 */
function isolate(block, clip, doc) {
  // The browser's own line wrapper (<div>) has no spacing of its own — the
  // leftovers read better as real paragraphs.
  const tag = block.tagName === "DIV" ? "p" : block.tagName.toLowerCase();

  const cut = (setup, insertBefore) => {
    const part = doc.createRange();
    try {
      setup(part);
    } catch {
      return;
    }
    if (part.collapsed) return;

    const el = doc.createElement(tag);
    el.appendChild(part.extractContents());
    pruneEmptyInline(el);
    // Whitespace-only leftovers would just show up as a blank line.
    if (!hasContent(el)) return;
    block.parentNode.insertBefore(el, insertBefore);
  };

  // Tail: everything after the selection.
  cut((part) => {
    part.setStart(clip.endContainer, clip.endOffset);
    part.setEnd(block, block.childNodes.length);
  }, block.nextSibling);

  // Head: everything before the selection.
  cut((part) => {
    part.setStart(block, 0);
    part.setEnd(clip.startContainer, clip.startOffset);
  }, block);
}

/** Swap `block` for a new `tag` element holding the same children. */
function convertBlock(block, tag, doc) {
  const el = doc.createElement(tag.toLowerCase());
  while (block.firstChild) el.appendChild(block.firstChild);
  if (HEADINGS.includes(tag)) stripFontSize(el);
  if (!el.firstChild) el.appendChild(doc.createElement("br"));
  block.parentNode.replaceChild(el, block);
  return el;
}

/**
 * Apply `tag` ("h2", "<h2>", "p", …) to the current selection.
 *
 * Headings are block-level, so the unit is a line, not a character run:
 *  - with text selected, only the selected run becomes a heading — the rest of
 *    the line stays as it was, split off into its own paragraph(s);
 *  - with a plain caret, the whole line the caret sits on is converted;
 *  - a selection covering several lines converts each of them;
 *  - when every affected line already has the tag, it toggles back to <p>.
 *
 * Returns true when the document changed.
 */
export function applyBlockFormat(root, tag, win) {
  const view = win || (typeof window !== "undefined" ? window : null);
  if (!root || !view) return false;

  const target = String(tag || "")
    .replace(/[<>]/g, "")
    .toUpperCase();
  if (!CONVERTIBLE.includes(target)) return false;

  const doc = root.ownerDocument;
  const selection = view.getSelection?.();
  if (!selection) return false;

  const live = selection.rangeCount ? selection.getRangeAt(0) : null;
  const anchor =
    live && root.contains(live.startContainer) && root.contains(live.endContainer)
      ? {
          sc: live.startContainer,
          so: live.startOffset,
          ec: live.endContainer,
          eo: live.endOffset,
          collapsed: live.collapsed,
        }
      : null;

  const isEmpty = !root.textContent.trim() && !root.querySelector("img");

  // Nothing to anchor to: only meaningful on a still-empty editor, where the
  // button starts the first block. A caret sitting elsewhere on the page must
  // not reformat this editor.
  if (!anchor && !isEmpty) return false;

  normalizeBlocks(root);

  const range = doc.createRange();
  if (anchor) {
    range.setStart(anchor.sc, anchor.so);
    range.setEnd(anchor.ec, anchor.eo);
  } else {
    range.selectNodeContents(root);
  }

  const caretBlock = range.collapsed
    ? blockContaining(root, range.startContainer, range.startOffset)
    : null;

  const blocks = caretBlock
    ? [caretBlock]
    : Array.from(root.childNodes).filter(
        (node) => isConvertible(node) && rangeIntersects(range, node),
      );

  // Empty editor: start the first block and drop the caret into it.
  if (!blocks.length) {
    if (!isEmpty) return false;
    root.innerHTML = "";
    const el = doc.createElement(target.toLowerCase());
    el.appendChild(doc.createElement("br"));
    root.appendChild(el);
    selectInside(selection, doc, el, true);
    return true;
  }

  // Toggling is all-or-nothing: only fall back to <p> when every affected line
  // already carries the tag being applied.
  const finalTag =
    target !== "P" && blocks.every((block) => block.tagName === target)
      ? "P"
      : target;

  if (caretBlock) {
    if (caretBlock.tagName === finalTag) return false;
    const replaced = new Map([
      [caretBlock, convertBlock(caretBlock, finalTag, doc)],
    ]);
    restoreSelection(selection, doc, root, anchor, replaced);
    return true;
  }

  // Ranges are live, so every clip is measured before anything moves.
  const clips = blocks.map((block) => clipToBlock(range, block, doc));
  const converted = [];

  let changed = false;

  blocks.forEach((block, i) => {
    const clip = clips[i];
    // The selection only grazed this block's boundary — leave it alone.
    if (clip.collapsed) return;
    // Already the right tag: no need to split it out of its own line.
    if (block.tagName === finalTag) {
      converted.push(block);
      return;
    }
    isolate(block, clip, doc);
    pruneEmptyInline(block);
    converted.push(convertBlock(block, finalTag, doc));
    changed = true;
  });

  if (!changed) return false;

  const out = doc.createRange();
  out.setStartBefore(converted[0].firstChild || converted[0]);
  const lastEl = converted[converted.length - 1];
  out.setEndAfter(lastEl.lastChild || lastEl);
  selection.removeAllRanges();
  selection.addRange(out);

  return true;
}

function selectInside(selection, doc, el, collapse) {
  const range = doc.createRange();
  range.selectNodeContents(el);
  if (collapse) range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function restoreSelection(selection, doc, root, anchor, replaced) {
  const last = Array.from(replaced.values()).pop();

  if (!anchor) {
    if (last) selectInside(selection, doc, last, false);
    return;
  }

  const resolve = (node) => replaced.get(node) || node;
  const sc = resolve(anchor.sc);
  const ec = resolve(anchor.ec);

  // A container that got unwrapped (e.g. a stripped <span>) is gone — fall
  // back to selecting the converted block instead of throwing.
  if (!root.contains(sc) || !root.contains(ec)) {
    if (last) selectInside(selection, doc, last, anchor.collapsed);
    return;
  }

  const range = doc.createRange();
  try {
    range.setStart(sc, Math.min(anchor.so, maxOffset(sc)));
    range.setEnd(ec, Math.min(anchor.eo, maxOffset(ec)));
  } catch {
    if (last) selectInside(selection, doc, last, anchor.collapsed);
    return;
  }
  selection.removeAllRanges();
  selection.addRange(range);
}

const maxOffset = (node) =>
  node.nodeType === 3 ? node.textContent.length : node.childNodes.length;

/**
 * Wrap the current selection in a span of `size` px. No-op for a caret with
 * nothing selected — there is no text to resize.
 */
export function applyFontSize(root, size, win) {
  const view = win || (typeof window !== "undefined" ? window : null);
  const px = Number(size);
  if (!root || !view || !px) return false;

  const selection = view.getSelection?.();
  if (!selection?.rangeCount) return false;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return false;
  if (!root.contains(range.commonAncestorContainer)) return false;

  const span = root.ownerDocument.createElement("span");
  span.style.fontSize = `${px}px`;
  span.appendChild(range.extractContents());
  range.insertNode(span);

  selectInside(selection, root.ownerDocument, span, false);
  return true;
}
