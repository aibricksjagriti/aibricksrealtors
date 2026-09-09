/**
 * The admin rich text editor (TipTap). Drives the real editor instance the way
 * the toolbar does, and checks the HTML that ends up being saved.
 */
import { useState } from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import RichTextEditor from "@/src/admin/components/RichTextEditor";

/** Controlled host, mirroring how the admin pages use the editor. */
function Host({ initial = "", onChange, onEditorReady }) {
  const [value, setValue] = useState(initial);
  return (
    <RichTextEditor
      value={value}
      onEditorReady={onEditorReady}
      onChange={(html) => {
        setValue(html);
        onChange?.(html);
      }}
    />
  );
}

/** Render and wait for TipTap to come up (it initialises on the client). */
async function setup({ initial = "", onChange } = {}) {
  let editor = null;
  const utils = render(
    <Host
      initial={initial}
      onChange={onChange}
      onEditorReady={(instance) => {
        editor = instance;
      }}
    />,
  );
  await waitFor(() => expect(editor).not.toBeNull());
  return { ...utils, editor: () => editor };
}

const button = (name) => screen.getByRole("button", { name });
const click = (name) => fireEvent.click(button(name));

/** Select document positions (TipTap counts node borders, so text starts at 1). */
const select = (editor, from, to) =>
  act(() => {
    editor.commands.setTextSelection(to === undefined ? from : { from, to });
  });

/** Put the caret inside the text of the nth top-level block. */
function caretInBlock(editor, index, offset = 1) {
  let pos = 1;
  editor.state.doc.forEach((node, nodeOffset, i) => {
    if (i === index) pos = nodeOffset + 1 + offset;
  });
  select(editor, pos);
}

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("value plumbing", () => {
  it("renders the incoming HTML", async () => {
    const { editor } = await setup({ initial: "<h2>Existing heading</h2>" });
    expect(editor().getHTML()).toBe("<h2>Existing heading</h2>");
    expect(screen.getByText("Existing heading").tagName).toBe("H2");
  });

  it("splits legacy <br> content into real paragraphs on load", async () => {
    const { editor } = await setup({ initial: "Line one<br>Line two" });
    expect(editor().getHTML()).toBe("<p>Line one</p><p>Line two</p>");
  });

  it("picks up a value that arrives after mount", async () => {
    let editor = null;
    const { rerender } = render(
      <RichTextEditor
        value=""
        onEditorReady={(instance) => {
          editor = instance;
        }}
      />,
    );
    await waitFor(() => expect(editor).not.toBeNull());

    rerender(
      <RichTextEditor value="<p>Loaded later</p>" onEditorReady={() => {}} />,
    );

    await waitFor(() => expect(editor.getHTML()).toBe("<p>Loaded later</p>"));
  });

  it("reports edits as HTML", async () => {
    const onChange = jest.fn();
    const { editor } = await setup({ initial: "<p>One</p>", onChange });

    act(() => {
      editor().commands.insertContentAt(4, " and two");
    });

    expect(onChange).toHaveBeenCalledWith("<p>One and two</p>");
  });

  it("reports an emptied editor as an empty string, not <p></p>", async () => {
    const onChange = jest.fn();
    const { editor } = await setup({ initial: "<p>Wipe me</p>", onChange });

    act(() => {
      editor().commands.clearContent(true);
    });

    expect(onChange).toHaveBeenLastCalledWith("");
  });
});

describe("headings", () => {
  it.each([
    ["Heading 1", "h1"],
    ["Heading 2", "h2"],
    ["Heading 3", "h3"],
  ])("%s converts the paragraph the caret is in", async (label, tag) => {
    const { editor } = await setup({ initial: "<p>Section title</p>" });

    caretInBlock(editor(), 0);
    click(label);

    expect(editor().getHTML()).toBe(`<${tag}>Section title</${tag}>`);
  });

  it("only touches the paragraph the caret is in", async () => {
    const { editor } = await setup({
      initial: "<p>Intro</p><p>Make me a heading</p><p>Outro</p>",
    });

    caretInBlock(editor(), 1);
    click("Heading 2");

    expect(editor().getHTML()).toBe(
      "<p>Intro</p><h2>Make me a heading</h2><p>Outro</p>",
    );
  });

  it("leaves the other lines alone when part of a line is selected", async () => {
    const { editor } = await setup({
      initial: "<p>First line</p><p>Some longer sentence</p>",
    });

    // "longer", inside the second paragraph.
    select(editor(), 19, 25);
    click("Heading 2");

    expect(editor().getHTML()).toBe(
      "<p>First line</p><h2>Some longer sentence</h2>",
    );
  });

  it("converts each line a multi-line selection covers", async () => {
    const { editor } = await setup({ initial: "<p>One</p><p>Two</p>" });

    act(() => {
      editor().commands.selectAll();
    });
    click("Heading 2");

    expect(editor().getHTML()).toBe("<h2>One</h2><h2>Two</h2>");
  });

  it("toggles a heading back to a paragraph", async () => {
    const { editor } = await setup({ initial: "<h2>Toggle</h2>" });

    caretInBlock(editor(), 0);
    click("Heading 2");

    expect(editor().getHTML()).toBe("<p>Toggle</p>");
  });

  it("switches straight between heading levels", async () => {
    const { editor } = await setup({ initial: "<h2>Level</h2>" });

    caretInBlock(editor(), 0);
    click("Heading 3");

    expect(editor().getHTML()).toBe("<h3>Level</h3>");
  });

  it("brings a heading back with the Paragraph button", async () => {
    const { editor } = await setup({ initial: "<h2>Body copy</h2>" });

    caretInBlock(editor(), 0);
    click("Paragraph");

    expect(editor().getHTML()).toBe("<p>Body copy</p>");
  });

  it("marks the active heading button as pressed", async () => {
    const { editor } = await setup({ initial: "<h2>Heading</h2>" });

    caretInBlock(editor(), 0);
    await waitFor(() =>
      expect(button("Heading 2")).toHaveAttribute("aria-pressed", "true"),
    );
    expect(button("Heading 3")).toHaveAttribute("aria-pressed", "false");
  });
});

describe("inline formatting", () => {
  it.each([
    ["Bold", "<p><strong>Format me</strong></p>"],
    ["Italic", "<p><em>Format me</em></p>"],
    ["Underline", "<p><u>Format me</u></p>"],
    ["Strikethrough", "<p><s>Format me</s></p>"],
  ])("%s wraps just the selected text", async (label, expected) => {
    const { editor } = await setup({ initial: "<p>Format me</p>" });

    act(() => {
      editor().commands.selectAll();
    });
    click(label);

    expect(editor().getHTML()).toBe(expected);
  });

  it("bolds only the selection, not the whole line", async () => {
    const { editor } = await setup({ initial: "<p>Some longer sentence</p>" });

    select(editor(), 6, 12);
    click("Bold");

    expect(editor().getHTML()).toBe(
      "<p>Some <strong>longer</strong> sentence</p>",
    );
  });

  it("clears formatting back to plain paragraphs", async () => {
    const { editor } = await setup({
      initial: "<h2>Styled <strong>heading</strong></h2>",
    });

    act(() => {
      editor().commands.selectAll();
    });
    click("Clear formatting");

    expect(editor().getHTML()).toBe("<p>Styled heading</p>");
  });
});

describe("lists and quotes", () => {
  it("turns the line into a bullet list", async () => {
    const { editor } = await setup({ initial: "<p>Point</p>" });

    caretInBlock(editor(), 0);
    click("Bullet list");

    expect(editor().getHTML()).toContain("<ul>");
    expect(editor().getHTML()).toContain("Point");
  });

  it("turns the line into a numbered list", async () => {
    const { editor } = await setup({ initial: "<p>Step</p>" });

    caretInBlock(editor(), 0);
    click("Numbered list");

    expect(editor().getHTML()).toContain("<ol>");
    expect(editor().getHTML()).toContain("Step");
  });

  it("turns the line into a quote and back", async () => {
    const { editor } = await setup({ initial: "<p>Quoted</p>" });

    caretInBlock(editor(), 0);
    click("Quote");
    expect(editor().getHTML()).toBe("<blockquote><p>Quoted</p></blockquote>");

    click("Quote");
    expect(editor().getHTML()).toBe("<p>Quoted</p>");
  });
});

describe("font size", () => {
  it("resizes only the selected text", async () => {
    const { editor } = await setup({ initial: "<p>Some longer sentence</p>" });

    select(editor(), 6, 12);
    fireEvent.change(screen.getByLabelText("Font size"), {
      target: { value: "24px" },
    });

    expect(editor().getHTML()).toBe(
      '<p>Some <span style="font-size: 24px;">longer</span> sentence</p>',
    );
  });

  it("clears the size again with the placeholder option", async () => {
    const { editor } = await setup({
      initial: '<p><span style="font-size: 24px">Big</span></p>',
    });

    act(() => {
      editor().commands.selectAll();
    });
    fireEvent.change(screen.getByLabelText("Font size"), {
      target: { value: "" },
    });

    expect(editor().getHTML()).toBe("<p>Big</p>");
  });

  it("shows the size of the text the caret is in", async () => {
    const { editor } = await setup({
      initial: '<p><span style="font-size: 32px">Big</span></p>',
    });

    select(editor(), 2, 4);

    await waitFor(() =>
      expect(screen.getByLabelText("Font size")).toHaveValue("32px"),
    );
  });
});

describe("links", () => {
  it("links the selected text", async () => {
    jest.spyOn(window, "prompt").mockReturnValue("https://example.com");
    const { editor } = await setup({ initial: "<p>Read more</p>" });

    act(() => {
      editor().commands.selectAll();
    });
    click("Add link");

    expect(editor().getHTML()).toContain('href="https://example.com"');
    expect(editor().getHTML()).toContain("Read more");
  });

  it("does nothing when the prompt is cancelled", async () => {
    jest.spyOn(window, "prompt").mockReturnValue(null);
    const { editor } = await setup({ initial: "<p>Read more</p>" });

    act(() => {
      editor().commands.selectAll();
    });
    click("Add link");

    expect(editor().getHTML()).toBe("<p>Read more</p>");
  });

  it("removes an existing link", async () => {
    const { editor } = await setup({
      initial: '<p><a href="https://example.com">Read more</a></p>',
    });

    act(() => {
      editor().commands.selectAll();
    });
    await waitFor(() => expect(button("Remove link")).toBeInTheDocument());
    click("Remove link");

    expect(editor().getHTML()).toBe("<p>Read more</p>");
  });
});

describe("image upload", () => {
  const pickFile = async (container) => {
    const file = new File(["x"], "pic.jpg", { type: "image/jpeg" });
    await act(async () => {
      fireEvent.change(container.querySelector('input[type="file"]'), {
        target: { files: [file] },
      });
    });
  };

  it("inserts the uploaded image", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: true, url: "https://cdn.test/pic.jpg" }),
    });
    const { container, editor } = await setup({ initial: "<p>Before</p>" });

    await pickFile(container);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/upload"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(editor().getHTML()).toContain('src="https://cdn.test/pic.jpg"');
  });

  it("reports a failed upload and inserts nothing", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: false, error: "Upload failed" }),
    });
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const { container, editor } = await setup({ initial: "<p>Before</p>" });

    await pickFile(container);

    expect(alertSpy).toHaveBeenCalledWith("Upload failed");
    expect(editor().getHTML()).toBe("<p>Before</p>");
  });
});

describe("undo / redo", () => {
  it("undoes and redoes the last change", async () => {
    const { editor } = await setup({ initial: "<p>Original</p>" });

    caretInBlock(editor(), 0);
    click("Heading 2");
    expect(editor().getHTML()).toBe("<h2>Original</h2>");

    await waitFor(() => expect(button("Undo")).toBeEnabled());
    click("Undo");
    expect(editor().getHTML()).toBe("<p>Original</p>");

    await waitFor(() => expect(button("Redo")).toBeEnabled());
    click("Redo");
    expect(editor().getHTML()).toBe("<h2>Original</h2>");
  });
});
