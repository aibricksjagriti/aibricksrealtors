/**
 * The admin rich text editor toolbar: what each button does to the content and
 * what it hands back through `onChange` (the value that gets saved and then
 * re-rendered on the public developer page).
 */
import { useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import RichTextEditor from "@/src/admin/components/RichTextEditor";

/** Controlled host, mirroring how the admin pages use the editor. */
function Host({ initial = "", onChange }) {
  const [value, setValue] = useState(initial);
  return (
    <RichTextEditor
      value={value}
      onChange={(html) => {
        setValue(html);
        onChange?.(html);
      }}
    />
  );
}

const editorEl = () => screen.getByRole("textbox");
const button = (name) => screen.getByRole("button", { name });

/** Collapsed caret inside the first text node of `node`. */
function caretIn(node, offset = 0) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const text = walker.nextNode() || node;
  const range = document.createRange();
  range.setStart(text, Math.min(offset, text.textContent?.length ?? 0));
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

/** Select characters [from, to) of the first text node inside `node`. */
function selectChars(node, from, to) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const text = walker.nextNode();
  const range = document.createRange();
  range.setStart(text, from);
  range.setEnd(text, to);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function selectAll(node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

let execCommand;

beforeEach(() => {
  execCommand = jest.fn(() => true);
  document.execCommand = execCommand;
});

afterEach(() => {
  jest.restoreAllMocks();
  window.getSelection().removeAllRanges();
});

describe("RichTextEditor — value plumbing", () => {
  it("renders the incoming HTML value", () => {
    render(<RichTextEditor value="<h2>Existing heading</h2>" />);
    expect(editorEl().innerHTML).toBe("<h2>Existing heading</h2>");
  });

  it("picks up a value that arrives later (async load of a developer)", () => {
    const { rerender } = render(<RichTextEditor value="" />);
    expect(editorEl().innerHTML).toBe("");

    rerender(<RichTextEditor value="<p>Loaded from Firestore</p>" />);
    expect(editorEl().innerHTML).toBe("<p>Loaded from Firestore</p>");
  });

  it("emits what the user types", () => {
    const onChange = jest.fn();
    render(<RichTextEditor value="" onChange={onChange} />);

    const editor = editorEl();
    editor.innerHTML = "<p>Typed</p>";
    fireEvent.input(editor);

    expect(onChange).toHaveBeenCalledWith("<p>Typed</p>");
  });

  it("does not fire onChange when nothing actually changed", () => {
    const onChange = jest.fn();
    render(<RichTextEditor value="<p>Same</p>" onChange={onChange} />);

    fireEvent.input(editorEl());
    fireEvent.blur(editorEl());

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("RichTextEditor — heading buttons", () => {
  it("turns the caret's paragraph into an h2 and saves it", () => {
    const onChange = jest.fn();
    render(<Host initial="<p>Landmark projects</p>" onChange={onChange} />);

    caretIn(editorEl().querySelector("p"), 4);
    fireEvent.click(button("Heading 2"));

    expect(editorEl().innerHTML).toBe("<h2>Landmark projects</h2>");
    expect(onChange).toHaveBeenCalledWith("<h2>Landmark projects</h2>");
  });

  it.each([
    ["Heading 1", "h1"],
    ["Heading 2", "h2"],
    ["Heading 3", "h3"],
  ])("%s produces a <%s>", (label, tag) => {
    render(<Host initial="<p>Section title</p>" />);

    caretIn(editorEl().querySelector("p"));
    fireEvent.click(button(label));

    expect(editorEl().innerHTML).toBe(`<${tag}>Section title</${tag}>`);
  });

  it("toggles the heading back off when clicked twice", () => {
    render(<Host initial="<p>Toggle</p>" />);

    caretIn(editorEl().querySelector("p"));
    fireEvent.click(button("Heading 2"));
    expect(editorEl().innerHTML).toBe("<h2>Toggle</h2>");

    caretIn(editorEl().querySelector("h2"));
    fireEvent.click(button("Heading 2"));
    expect(editorEl().innerHTML).toBe("<p>Toggle</p>");
  });

  it("switches an h2 to an h3 without nesting", () => {
    render(<Host initial="<h2>Level</h2>" />);

    caretIn(editorEl().querySelector("h2"));
    fireEvent.click(button("Heading 3"));

    expect(editorEl().innerHTML).toBe("<h3>Level</h3>");
    expect(editorEl().querySelector("h3 h2")).toBeNull();
  });

  it("returns a heading to body copy with the Paragraph button", () => {
    render(<Host initial="<h2>Body again</h2>" />);

    caretIn(editorEl().querySelector("h2"));
    fireEvent.click(button("Paragraph"));

    expect(editorEl().innerHTML).toBe("<p>Body again</p>");
  });

  it("headings do not go through the deprecated formatBlock command", () => {
    render(<Host initial="<p>No execCommand</p>" />);

    caretIn(editorEl().querySelector("p"));
    fireEvent.click(button("Heading 2"));

    expect(execCommand).not.toHaveBeenCalledWith(
      "formatBlock",
      expect.anything(),
      expect.anything(),
    );
  });

  it("only turns the selected words into a heading", () => {
    const onChange = jest.fn();
    render(<Host initial="<p>Some longer sentence</p>" onChange={onChange} />);

    selectChars(editorEl().querySelector("p"), 5, 11);
    fireEvent.click(button("Heading 2"));

    expect(editorEl().innerHTML).toBe(
      "<p>Some </p><h2>longer</h2><p> sentence</p>",
    );
    expect(onChange).toHaveBeenCalledWith(
      "<p>Some </p><h2>longer</h2><p> sentence</p>",
    );
  });

  it("leaves the other paragraphs untouched", () => {
    render(
      <Host initial="<p>Intro</p><p>Some longer sentence</p><p>Outro</p>" />,
    );

    selectChars(editorEl().querySelectorAll("p")[1], 5, 11);
    fireEvent.click(button("Heading 2"));

    expect(editorEl().innerHTML).toBe(
      "<p>Intro</p><p>Some </p><h2>longer</h2><p> sentence</p><p>Outro</p>",
    );
  });

  it("keeps the new heading selected so a second click undoes it", () => {
    render(<Host initial="<p>Some longer sentence</p>" />);

    selectChars(editorEl().querySelector("p"), 5, 11);
    fireEvent.click(button("Heading 2"));
    fireEvent.click(button("Heading 2"));

    expect(editorEl().innerHTML).toBe(
      "<p>Some </p><p>longer</p><p> sentence</p>",
    );
  });

  it("converts every paragraph the selection spans", () => {
    render(<Host initial="<p>One</p><p>Two</p>" />);

    selectAll(editorEl());
    fireEvent.click(button("Heading 2"));

    expect(editorEl().innerHTML).toBe("<h2>One</h2><h2>Two</h2>");
  });
});

describe("RichTextEditor — inline formatting", () => {
  it.each([
    ["Bold", "bold"],
    ["Italic", "italic"],
    ["Underline", "underline"],
    ["Bullet list", "insertUnorderedList"],
    ["Numbered list", "insertOrderedList"],
    ["Clear formatting", "removeFormat"],
  ])("%s runs the %s command", (label, command) => {
    render(<Host initial="<p>Styled text</p>" />);

    selectAll(editorEl().querySelector("p"));
    fireEvent.click(button(label));

    expect(execCommand).toHaveBeenCalledWith(command, false, undefined);
  });

  it("adds a link with the URL from the prompt", () => {
    jest.spyOn(window, "prompt").mockReturnValue("https://example.com");
    render(<Host initial="<p>Link me</p>" />);

    selectAll(editorEl().querySelector("p"));
    fireEvent.click(button("Add link"));

    expect(execCommand).toHaveBeenCalledWith(
      "createLink",
      false,
      "https://example.com",
    );
  });

  it("does nothing when the link prompt is cancelled", () => {
    jest.spyOn(window, "prompt").mockReturnValue(null);
    render(<Host initial="<p>Link me</p>" />);

    selectAll(editorEl().querySelector("p"));
    fireEvent.click(button("Add link"));

    expect(execCommand).not.toHaveBeenCalled();
  });
});

describe("RichTextEditor — font size", () => {
  it("wraps the selection and reports the new HTML", () => {
    const onChange = jest.fn();
    render(<Host initial="<p>Resize this</p>" onChange={onChange} />);

    const select = screen.getByLabelText("Font size");
    selectAll(editorEl().querySelector("p"));
    fireEvent.mouseDown(select);
    fireEvent.change(select, { target: { value: "24" } });

    expect(editorEl().querySelector("span").style.fontSize).toBe("24px");
    expect(onChange).toHaveBeenCalledWith(
      '<p><span style="font-size: 24px;">Resize this</span></p>',
    );
  });

  it("falls back to the placeholder so the same size can be picked twice", () => {
    render(<Host initial="<p>Resize this</p>" />);

    const select = screen.getByLabelText("Font size");
    selectAll(editorEl().querySelector("p"));
    fireEvent.change(select, { target: { value: "24" } });

    expect(select.value).toBe("");
  });

  it("a heading applied afterwards wins over the inline size", () => {
    render(<Host initial="<p>Sized then heading</p>" />);

    const select = screen.getByLabelText("Font size");
    selectAll(editorEl().querySelector("p"));
    fireEvent.change(select, { target: { value: "12" } });

    caretIn(editorEl().querySelector("span"));
    fireEvent.click(button("Heading 2"));

    expect(editorEl().innerHTML).toBe("<h2>Sized then heading</h2>");
  });
});

describe("RichTextEditor — image upload", () => {
  it("inserts the uploaded image at the caret", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: true, url: "https://cdn.test/pic.jpg" }),
    });

    const { container } = render(<Host initial="<p>Before image</p>" />);
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["x"], "pic.jpg", { type: "image/jpeg" });

    caretIn(editorEl().querySelector("p"), 6);
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/upload"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(execCommand).toHaveBeenCalledWith(
      "insertHTML",
      false,
      expect.stringContaining("https://cdn.test/pic.jpg"),
    );
  });

  it("surfaces a failed upload instead of inserting anything", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: false, error: "Upload failed" }),
    });
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    const { container } = render(<Host initial="<p>Before image</p>" />);
    const file = new File(["x"], "pic.jpg", { type: "image/jpeg" });

    await act(async () => {
      fireEvent.change(container.querySelector('input[type="file"]'), {
        target: { files: [file] },
      });
    });

    expect(alertSpy).toHaveBeenCalledWith("Upload failed");
    expect(execCommand).not.toHaveBeenCalled();
  });
});
