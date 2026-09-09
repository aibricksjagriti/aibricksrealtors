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

/**
 * Turn the block(s) touched by the current selection into `tag`
 * ("h2", "<h2>", "p", …). Clicking the tag a block already has turns it back
 * into a paragraph. Returns true when the document changed.
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

  // Remember the caret by node + offset. Everything below *moves* nodes rather
  // than cloning them, so these anchors stay valid and the caret survives.
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

  // A plain caret formats exactly the line it sits on; a real selection formats
  // every block it touches.
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

  const replaced = new Map();

  blocks.forEach((block) => {
    // Toggle: clicking H2 on an existing H2 returns it to a paragraph.
    const finalTag =
      block.tagName === target && target !== "P" ? "P" : target;

    const el = doc.createElement(finalTag.toLowerCase());
    while (block.firstChild) el.appendChild(block.firstChild);
    if (HEADINGS.includes(finalTag)) stripFontSize(el);
    if (!el.firstChild) el.appendChild(doc.createElement("br"));

    block.parentNode.replaceChild(el, block);
    replaced.set(block, el);
  });

  restoreSelection(selection, doc, root, anchor, replaced);
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
