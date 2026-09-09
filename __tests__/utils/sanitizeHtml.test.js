/**
 * The admin editor's HTML has to survive the trip to the public developer page
 * unchanged apart from the unsafe bits.
 */
const { sanitizeHtml } = require("@/lib/utils/sanitizeHtml");

describe("sanitizeHtml — keeps the editor's formatting", () => {
  it.each(["h1", "h2", "h3"])("keeps <%s> headings", (tag) => {
    const html = `<${tag}>Section title</${tag}>`;
    expect(sanitizeHtml(html)).toBe(html);
  });

  it("keeps a full page of editor output intact", () => {
    const html =
      "<h2>About the builder</h2>" +
      "<p>Founded in <b>1985</b>, with <i>landmark</i> projects.</p>" +
      "<ul><li>Residential</li><li>Commercial</li></ul>" +
      '<p><a href="https://example.com">Read more</a></p>';

    expect(sanitizeHtml(html)).toBe(html);
  });

  it("keeps inline font sizes set from the toolbar", () => {
    const html = '<p><span style="font-size: 24px;">Big line</span></p>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it("keeps uploaded images", () => {
    const html =
      '<p style="margin:16px 0"><img src="https://cdn.test/pic.jpg" alt="" style="max-width:100%;height:auto;border-radius:8px;" /></p>';
    expect(sanitizeHtml(html)).toBe(html);
  });
});

describe("sanitizeHtml — strips the unsafe bits", () => {
  it("drops script tags and their contents", () => {
    expect(sanitizeHtml('<h2>Hi</h2><script>alert("x")</script>')).toBe(
      "<h2>Hi</h2>",
    );
  });

  it("drops inline event handlers but keeps the element", () => {
    expect(sanitizeHtml('<h2 onclick="steal()">Hi</h2>')).toBe("<h2>Hi</h2>");
  });

  it("neutralises javascript: links", () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).toBe(
      '<a href="#">x</a>',
    );
  });

  it("returns an empty string for missing content", () => {
    expect(sanitizeHtml(undefined)).toBe("");
    expect(sanitizeHtml("")).toBe("");
  });
});
