/**
 * Normalises whatever HTML is already stored for a developer before it is
 * loaded into the editor.
 *
 * Content saved by the old editor (and anything pasted from Word/a website)
 * tends to be one giant block with <br>s for line breaks. That matters because
 * headings are block-level: with everything in a single block, making one line
 * a heading would make *all* of it a heading. Splitting the blob into real
 * paragraphs first means one line is one block, so a heading applies to the
 * line you are standing on and nothing else.
 *
 * Runs once when a value is loaded into the editor, and is idempotent — it
 * produces no <br>s, so re-running it changes nothing.
 */

const BLOCKS =
  "p, div, h1, h2, h3, h4, h5, h6, ul, ol, li, blockquote, pre, table, figure, hr";

const isElement = (node) => node?.nodeType === 1;

const hasContent = (node) =>
  Boolean(node.textContent.trim()) || Boolean(node.querySelector?.("img"));

const escapeText = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Plain text: every non-empty line becomes its own paragraph. */
function textToParagraphs(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeText(line)}</p>`)
    .join("");
}

/** Wrap top-level text/inline runs so nothing floats outside a block. */
function wrapLooseRuns(body) {
  const doc = body.ownerDocument;
  let run = [];

  const flush = () => {
    const nodes = run;
    run = [];
    if (!nodes.length) return;
    const p = doc.createElement("p");
    body.insertBefore(p, nodes[0]);
    nodes.forEach((node) => p.appendChild(node));
    if (!hasContent(p) && !p.querySelector("br")) p.remove();
  };

  Array.from(body.childNodes).forEach((node) => {
    if (isElement(node) && node.matches(BLOCKS)) {
      flush();
      return;
    }
    run.push(node);
  });

  flush();
}

/** Turn a block whose lines are separated by <br> into one block per line. */
function splitOnBreaks(block) {
  if (!block.parentNode) return;
  if (!block.querySelector(":scope > br")) return;

  const doc = block.ownerDocument;
  const tag = block.tagName === "DIV" ? "p" : block.tagName.toLowerCase();
  const lines = [[]];

  Array.from(block.childNodes).forEach((node) => {
    if (isElement(node) && node.tagName === "BR") lines.push([]);
    else lines[lines.length - 1].push(node);
  });

  const made = lines
    .map((nodes) => {
      const el = doc.createElement(tag);
      nodes.forEach((node) => el.appendChild(node));
      return el;
    })
    .filter(hasContent);

  made.forEach((el) => block.parentNode.insertBefore(el, block));
  block.remove();
}

/** The browser's line-wrapper <div>s have no spacing; paragraphs do. */
function divToParagraph(div) {
  if (!div.parentNode) return;

  // A div wrapping other blocks is just a container — unwrap it.
  if (div.querySelector(BLOCKS)) {
    while (div.firstChild) div.parentNode.insertBefore(div.firstChild, div);
    div.remove();
    return;
  }

  const p = div.ownerDocument.createElement("p");
  Array.from(div.attributes).forEach((attr) =>
    p.setAttribute(attr.name, attr.value),
  );
  while (div.firstChild) p.appendChild(div.firstChild);
  div.parentNode.replaceChild(p, div);
}

export function normalizeEditorHtml(html) {
  if (!html || typeof html !== "string") return "";

  const source = html.trim();
  if (!source) return "";

  // No markup at all: legacy plain-text `about` values.
  if (!/<[a-z!/][\s\S]*>/i.test(source)) return textToParagraphs(source);

  if (typeof DOMParser === "undefined") return source;

  const body = new DOMParser().parseFromString(source, "text/html").body;

  wrapLooseRuns(body);
  Array.from(body.querySelectorAll("p, div, h1, h2, h3, h4, h5, h6")).forEach(
    splitOnBreaks,
  );
  Array.from(body.querySelectorAll("div")).forEach(divToParagraph);

  // Blocks left with nothing in them would render as blank lines.
  Array.from(body.querySelectorAll("p")).forEach((p) => {
    if (!hasContent(p)) p.remove();
  });

  return body.innerHTML;
}

/**
 * Clean the editor's HTML before it is saved: a trailing empty paragraph (from
 * an Enter the author never filled in) would render as a blank gap on the
 * public page.
 */
export function toSavedHtml(html) {
  if (!html || typeof html !== "string") return "";
  const cleaned = html.replace(
    /(?:<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>)+$/gi,
    "",
  );
  return cleaned.trim() ? cleaned : "";
}
