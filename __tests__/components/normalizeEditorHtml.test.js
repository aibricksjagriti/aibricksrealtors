/**
 * Content already stored for a developer has to become real paragraphs before
 * it reaches the editor — otherwise a heading applied to one line would swallow
 * the whole blob, because it is all one block.
 */
import {
  normalizeEditorHtml,
  toSavedHtml,
} from "@/src/admin/components/normalizeEditorHtml";

describe("normalizeEditorHtml", () => {
  it("splits a <br> blob into one paragraph per line", () => {
    expect(normalizeEditorHtml("Line one<br>Line two<br>Line three")).toBe(
      "<p>Line one</p><p>Line two</p><p>Line three</p>",
    );
  });

  it("splits <br>s inside a paragraph too", () => {
    expect(normalizeEditorHtml("<p>Line one<br />Line two</p>")).toBe(
      "<p>Line one</p><p>Line two</p>",
    );
  });

  it("turns plain text lines into paragraphs", () => {
    expect(normalizeEditorHtml("First line\nSecond line")).toBe(
      "<p>First line</p><p>Second line</p>",
    );
  });

  it("escapes plain text rather than trusting it as markup", () => {
    expect(normalizeEditorHtml("5 > 3 & rising")).toBe(
      "<p>5 &gt; 3 &amp; rising</p>",
    );
  });

  it("wraps loose text sitting next to real blocks", () => {
    expect(normalizeEditorHtml("Intro text<h2>Heading</h2>")).toBe(
      "<p>Intro text</p><h2>Heading</h2>",
    );
  });

  it("keeps inline formatting with its line", () => {
    expect(normalizeEditorHtml("Plain <b>bold</b><br>Next")).toBe(
      "<p>Plain <b>bold</b></p><p>Next</p>",
    );
  });

  it("converts browser line-wrapper <div>s to paragraphs", () => {
    expect(normalizeEditorHtml("<div>One</div><div>Two</div>")).toBe(
      "<p>One</p><p>Two</p>",
    );
  });

  it("unwraps a <div> that only wraps other blocks", () => {
    expect(normalizeEditorHtml("<div><h2>Title</h2><p>Body</p></div>")).toBe(
      "<h2>Title</h2><p>Body</p>",
    );
  });

  it("leaves already-structured content untouched", () => {
    const html = "<h2>Title</h2><p>Body</p><ul><li>Point</li></ul>";
    expect(normalizeEditorHtml(html)).toBe(html);
  });

  it("is idempotent", () => {
    const once = normalizeEditorHtml("A<br>B<br>C");
    expect(normalizeEditorHtml(once)).toBe(once);
  });

  it("drops blank lines instead of keeping empty paragraphs", () => {
    expect(normalizeEditorHtml("One<br><br>Two")).toBe("<p>One</p><p>Two</p>");
  });

  it("keeps images", () => {
    expect(normalizeEditorHtml('<p><img src="https://cdn.test/a.jpg"></p>')).toBe(
      '<p><img src="https://cdn.test/a.jpg"></p>',
    );
  });

  it("handles empty input", () => {
    expect(normalizeEditorHtml("")).toBe("");
    expect(normalizeEditorHtml(null)).toBe("");
    expect(normalizeEditorHtml(undefined)).toBe("");
  });
});

describe("toSavedHtml", () => {
  it("drops a trailing empty paragraph", () => {
    expect(toSavedHtml("<h2>Title</h2><p></p>")).toBe("<h2>Title</h2>");
  });

  it("drops several of them", () => {
    expect(toSavedHtml("<p>Body</p><p></p><p><br></p>")).toBe("<p>Body</p>");
  });

  it("keeps empty paragraphs that sit between content", () => {
    expect(toSavedHtml("<p>One</p><p></p><p>Two</p>")).toBe(
      "<p>One</p><p></p><p>Two</p>",
    );
  });

  it("returns an empty string when nothing is left", () => {
    expect(toSavedHtml("<p></p>")).toBe("");
    expect(toSavedHtml("")).toBe("");
  });

  it("leaves real content alone", () => {
    const html = "<h2>Title</h2><p>Body</p>";
    expect(toSavedHtml(html)).toBe(html);
  });
});
