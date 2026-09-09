/**
 * Block-level formatting behind the admin rich text editor toolbar.
 */
import {
  applyBlockFormat,
  applyFontSize,
  normalizeBlocks,
} from "@/src/admin/components/richTextCommands";

function makeEditor(html = "") {
  const el = document.createElement("div");
  el.contentEditable = "true";
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
}

/** Put a collapsed caret inside the first text node of `node`. */
function caretIn(node, offset = 0) {
  const text = firstText(node);
  const range = document.createRange();
  range.setStart(text, offset);
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  return range;
}

/** Select from inside `from` to inside `to` (defaults to a whole node). */
function selectAcross(from, to = from) {
  const start = firstText(from);
  const end = lastText(to);
  const range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, end.textContent.length);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  return range;
}

/** Select characters [from, to) of the first text node inside `node`. */
function selectChars(node, from, to) {
  const text = firstText(node);
  const range = document.createRange();
  range.setStart(text, from);
  range.setEnd(text, to);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  return range;
}

const firstText = (node) => {
  if (node.nodeType === 3) return node;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  return walker.nextNode() || node;
};

const lastText = (node) => {
  if (node.nodeType === 3) return node;
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  let last = null;
  let current;
  while ((current = walker.nextNode())) last = current;
  return last || node;
};

afterEach(() => {
  document.body.innerHTML = "";
  window.getSelection().removeAllRanges();
});

describe("normalizeBlocks", () => {
  it("wraps loose text typed straight into the editor", () => {
    const el = makeEditor("Hello world");
    normalizeBlocks(el);
    expect(el.innerHTML).toBe("<p>Hello world</p>");
  });

  it("splits <br>-separated lines into separate paragraphs", () => {
    const el = makeEditor("First line<br>Second line");
    normalizeBlocks(el);
    expect(el.innerHTML).toBe("<p>First line</p><p>Second line</p>");
  });

  it("keeps inline markup with its line", () => {
    const el = makeEditor("Plain <b>bold</b> tail");
    normalizeBlocks(el);
    expect(el.innerHTML).toBe("<p>Plain <b>bold</b> tail</p>");
  });

  it("leaves existing blocks and lists untouched", () => {
    const html = "<p>One</p><ul><li>Two</li></ul><h2>Three</h2>";
    const el = makeEditor(html);
    normalizeBlocks(el);
    expect(el.innerHTML).toBe(html);
  });

  it("does not invent paragraphs out of whitespace between blocks", () => {
    const el = makeEditor("<p>One</p>\n  <p>Two</p>");
    normalizeBlocks(el);
    expect(el.querySelectorAll("p")).toHaveLength(2);
  });
});

describe("applyBlockFormat — headings", () => {
  it.each(["h1", "h2", "h3"])(
    "turns the paragraph holding the caret into %s",
    (tag) => {
      const el = makeEditor("<p>Project highlights</p>");
      caretIn(el.querySelector("p"), 3);

      expect(applyBlockFormat(el, tag, window)).toBe(true);
      expect(el.innerHTML).toBe(`<${tag}>Project highlights</${tag}>`);
    },
  );

  it("works from a bare caret with no selection at all (the reported bug)", () => {
    const el = makeEditor("<p>Heading text</p>");
    caretIn(el.querySelector("p"), 4);

    applyBlockFormat(el, "h2", window);

    expect(el.querySelectorAll("h2")).toHaveLength(1);
    expect(el.querySelector("h2").textContent).toBe("Heading text");
    // No leftover empty block from the old extractContents() approach.
    expect(el.innerHTML).not.toContain("<h2></h2>");
  });

  it("accepts the legacy <h2> argument form", () => {
    const el = makeEditor("<p>Legacy</p>");
    caretIn(el.querySelector("p"));

    applyBlockFormat(el, "<h2>", window);

    expect(el.innerHTML).toBe("<h2>Legacy</h2>");
  });

  it("converts text that was never wrapped in a block", () => {
    const el = makeEditor("Just typed this");
    caretIn(el, 5);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>Just typed this</h2>");
  });

  it("never nests a heading inside a paragraph", () => {
    const el = makeEditor("<p>Some longer sentence</p>");
    selectChars(el.querySelector("p"), 5, 11);

    applyBlockFormat(el, "h2", window);

    expect(el.querySelector("p h2")).toBeNull();
    expect(el.querySelector("h2").parentNode).toBe(el);
  });

  it("converts every block the selection touches", () => {
    const el = makeEditor("<p>One</p><p>Two</p><p>Three</p>");
    const [first, , third] = el.querySelectorAll("p");
    selectAcross(first, third);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>One</h2><h2>Two</h2><h2>Three</h2>");
  });

  it("leaves blocks outside the selection alone", () => {
    const el = makeEditor("<p>One</p><p>Two</p><p>Three</p>");
    const paragraphs = el.querySelectorAll("p");
    selectAcross(paragraphs[1]);

    applyBlockFormat(el, "h3", window);

    expect(el.innerHTML).toBe("<p>One</p><h3>Two</h3><p>Three</p>");
  });

  it("keeps inline formatting inside the converted block", () => {
    const el = makeEditor("<p>Bold <b>bit</b> and <i>italic</i></p>");
    caretIn(el.querySelector("p"));

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>Bold <b>bit</b> and <i>italic</i></h2>");
  });

  it("converts a Chrome-style <div> line", () => {
    const el = makeEditor("<div>A line</div>");
    caretIn(el.querySelector("div"));

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>A line</h2>");
  });

  it("starts a heading in an empty editor", () => {
    const el = makeEditor("");
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    expect(applyBlockFormat(el, "h2", window)).toBe(true);
    expect(el.innerHTML).toBe("<h2><br></h2>");
  });

  it("ignores an unknown tag", () => {
    const el = makeEditor("<p>Nope</p>");
    caretIn(el.querySelector("p"));

    expect(applyBlockFormat(el, "script", window)).toBe(false);
    expect(el.innerHTML).toBe("<p>Nope</p>");
  });

  it("ignores a selection outside the editor", () => {
    const el = makeEditor("<p>Inside</p>");
    const outside = document.createElement("p");
    outside.textContent = "Outside";
    document.body.appendChild(outside);
    caretIn(outside, 2);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<p>Inside</p>");
  });
});

describe("applyBlockFormat — toggling and paragraphs", () => {
  it("toggles an h2 back to a paragraph when h2 is clicked again", () => {
    const el = makeEditor("<p>Toggle me</p>");
    caretIn(el.querySelector("p"));

    applyBlockFormat(el, "h2", window);
    expect(el.innerHTML).toBe("<h2>Toggle me</h2>");

    caretIn(el.querySelector("h2"));
    applyBlockFormat(el, "h2", window);
    expect(el.innerHTML).toBe("<p>Toggle me</p>");
  });

  it("switches straight between heading levels", () => {
    const el = makeEditor("<h2>Level</h2>");
    caretIn(el.querySelector("h2"));

    applyBlockFormat(el, "h3", window);

    expect(el.innerHTML).toBe("<h3>Level</h3>");
  });

  it("brings a heading back to a paragraph with the P button", () => {
    const el = makeEditor("<h2>Back to body copy</h2>");
    caretIn(el.querySelector("h2"));

    applyBlockFormat(el, "p", window);

    expect(el.innerHTML).toBe("<p>Back to body copy</p>");
  });

  it("leaves a paragraph as a paragraph (P does not toggle)", () => {
    const el = makeEditor("<p>Body</p>");
    caretIn(el.querySelector("p"));

    applyBlockFormat(el, "p", window);

    expect(el.innerHTML).toBe("<p>Body</p>");
  });
});

describe("applyBlockFormat — heading size wins", () => {
  it("drops an inline font-size that would override the heading size", () => {
    const el = makeEditor('<p><span style="font-size: 12px;">Small text</span></p>');
    caretIn(el.querySelector("span"));

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>Small text</h2>");
    expect(el.innerHTML).not.toContain("font-size");
  });

  it("keeps other inline styles while dropping the font size", () => {
    const el = makeEditor(
      '<p><span style="font-size: 12px; color: red;">Red</span></p>',
    );
    caretIn(el.querySelector("span"));

    applyBlockFormat(el, "h2", window);

    expect(el.querySelector("h2 span").style.color).toBe("red");
    expect(el.querySelector("h2 span").style.fontSize).toBe("");
  });

  it("keeps the font size when converting back to a paragraph", () => {
    const el = makeEditor('<p><span style="font-size: 24px;">Big</span></p>');
    caretIn(el.querySelector("span"));

    applyBlockFormat(el, "p", window);

    expect(el.querySelector("span").style.fontSize).toBe("24px");
  });
});

describe("applyBlockFormat — caret survives", () => {
  it("keeps the caret in the converted block", () => {
    const el = makeEditor("<p>Keep my caret</p>");
    caretIn(el.querySelector("p"), 4);

    applyBlockFormat(el, "h2", window);

    const range = window.getSelection().getRangeAt(0);
    expect(el.querySelector("h2").contains(range.startContainer)).toBe(true);
    expect(range.startOffset).toBe(4);
    expect(range.collapsed).toBe(true);
  });

  it("keeps a multi-block selection selected after converting", () => {
    const el = makeEditor("<p>One</p><p>Two</p>");
    const paragraphs = el.querySelectorAll("p");
    selectAcross(paragraphs[0], paragraphs[1]);

    applyBlockFormat(el, "h2", window);

    const range = window.getSelection().getRangeAt(0);
    expect(range.toString()).toBe("OneTwo");
  });
});

describe("applyBlockFormat — only the selected text changes", () => {
  it("lifts a phrase out of the middle of a paragraph", () => {
    const el = makeEditor("<p>Some longer sentence</p>");
    selectChars(el.querySelector("p"), 5, 11);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe(
      "<p>Some </p><h2>longer</h2><p> sentence</p>",
    );
  });

  it("keeps the rest of the line when the selection starts the line", () => {
    const el = makeEditor("<p>Heading then body</p>");
    selectChars(el.querySelector("p"), 0, 7);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>Heading</h2><p> then body</p>");
  });

  it("keeps the rest of the line when the selection ends the line", () => {
    const el = makeEditor("<p>Body then heading</p>");
    selectChars(el.querySelector("p"), 10, 17);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<p>Body then </p><h2>heading</h2>");
  });

  it("leaves untouched paragraphs completely alone", () => {
    const el = makeEditor("<p>Before</p><p>Some longer sentence</p><p>After</p>");
    selectChars(el.querySelectorAll("p")[1], 5, 11);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe(
      "<p>Before</p><p>Some </p><h2>longer</h2><p> sentence</p><p>After</p>",
    );
  });

  it("splits both ends when the selection runs across two paragraphs", () => {
    const el = makeEditor("<p>One two</p><p>three four</p>");
    const paragraphs = el.querySelectorAll("p");
    const range = document.createRange();
    range.setStart(firstText(paragraphs[0]), 4);
    range.setEnd(firstText(paragraphs[1]), 5);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe(
      "<p>One </p><h2>two</h2><h2>three</h2><p> four</p>",
    );
  });

  it("carries inline formatting into the heading it splits out", () => {
    const el = makeEditor("<p>plain <b>bold tail</b></p>");
    const bold = el.querySelector("b");
    const range = document.createRange();
    range.setStart(firstText(bold), 0);
    range.setEnd(firstText(bold), 4);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe(
      "<p>plain </p><h2><b>bold</b></h2><p><b> tail</b></p>",
    );
  });

  it("does not split when the whole line is selected", () => {
    const el = makeEditor("<p>Whole line</p>");
    selectAcross(el.querySelector("p"));

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>Whole line</h2>");
  });

  it("drops a whitespace-only leftover instead of leaving a blank line", () => {
    const el = makeEditor("<p>  Heading</p>");
    selectChars(el.querySelector("p"), 2, 9);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>Heading</h2>");
  });

  it("keeps the split-out heading selected", () => {
    const el = makeEditor("<p>Some longer sentence</p>");
    selectChars(el.querySelector("p"), 5, 11);

    applyBlockFormat(el, "h2", window);

    expect(window.getSelection().toString()).toBe("longer");
  });

  it("toggles a split-out heading back without touching its neighbours", () => {
    const el = makeEditor("<p>Some </p><h2>longer</h2><p> sentence</p>");
    selectAcross(el.querySelector("h2"));

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<p>Some </p><p>longer</p><p> sentence</p>");
  });

  it("promotes a mixed selection to the heading rather than toggling", () => {
    const el = makeEditor("<h2>Already</h2><p>Not yet</p>");
    const range = document.createRange();
    range.setStart(firstText(el.querySelector("h2")), 0);
    range.setEnd(lastText(el.querySelector("p")), 7);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>Already</h2><h2>Not yet</h2>");
  });

  it("splits a browser <div> line into real paragraphs", () => {
    const el = makeEditor("First line<div>Second line here</div>");
    selectChars(el.querySelector("div"), 7, 11);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe(
      "<p>First line</p><p>Second </p><h2>line</h2><p> here</p>",
    );
  });

  it("does not re-split a line that already has the tag", () => {
    const el = makeEditor("<h2>Title</h2><p>Some longer sentence</p>");
    const range = document.createRange();
    range.setStart(firstText(el.querySelector("h2")), 0);
    range.setEnd(firstText(el.querySelector("p")), 4);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe(
      "<h2>Title</h2><h2>Some</h2><p> longer sentence</p>",
    );
  });

  it("does nothing when the selected line is already a paragraph", () => {
    const el = makeEditor("<p>Some longer sentence</p>");
    selectChars(el.querySelector("p"), 5, 11);

    expect(applyBlockFormat(el, "p", window)).toBe(false);
    expect(el.innerHTML).toBe("<p>Some longer sentence</p>");
  });

  it("a caret still formats the whole line it sits on", () => {
    const el = makeEditor("<p>Some longer sentence</p>");
    caretIn(el.querySelector("p"), 8);

    applyBlockFormat(el, "h2", window);

    expect(el.innerHTML).toBe("<h2>Some longer sentence</h2>");
  });
});

describe("applyFontSize", () => {
  it("wraps the selected text in a sized span", () => {
    const el = makeEditor("<p>Resize me</p>");
    selectAcross(el.querySelector("p"));

    expect(applyFontSize(el, "24", window)).toBe(true);
    expect(el.querySelector("span").style.fontSize).toBe("24px");
    expect(el.textContent).toBe("Resize me");
  });

  it("does nothing without a selection", () => {
    const el = makeEditor("<p>Nothing selected</p>");
    caretIn(el.querySelector("p"), 2);

    expect(applyFontSize(el, "24", window)).toBe(false);
    expect(el.innerHTML).toBe("<p>Nothing selected</p>");
  });

  it("ignores the empty 'Font Size' placeholder option", () => {
    const el = makeEditor("<p>Untouched</p>");
    selectAcross(el.querySelector("p"));

    expect(applyFontSize(el, "", window)).toBe(false);
    expect(el.innerHTML).toBe("<p>Untouched</p>");
  });

  it("ignores a selection outside the editor", () => {
    const el = makeEditor("<p>Inside</p>");
    const outside = document.createElement("p");
    outside.textContent = "Outside";
    document.body.appendChild(outside);
    selectAcross(outside);

    expect(applyFontSize(el, "24", window)).toBe(false);
    expect(el.innerHTML).toBe("<p>Inside</p>");
  });
});
