/**
 * The public end of the editor: HTML saved from the admin rich text editor has
 * to come out of `AboutDeveloper` as real headings/lists inside `.rich-text`.
 */
import { render, screen } from "@testing-library/react";
import AboutDeveloper from "@/src/Developers/AboutDeveloper";

// The exact HTML the admin editor (TipTap) saves.
const EDITOR_HTML =
  "<h2>Landmark projects</h2>" +
  "<p>Founded in <strong>1985</strong>.</p>" +
  "<ul><li><p>Residential</p></li></ul>" +
  '<p><span style="font-size: 24px">Big line</span></p>';

describe("AboutDeveloper — renders editor output", () => {
  it("renders headings from an about block", () => {
    render(
      <AboutDeveloper
        builderName="Godrej"
        developer={{ aboutBlocks: [{ text: EDITOR_HTML, image: "" }] }}
      />,
    );

    const heading = screen.getByText("Landmark projects");
    expect(heading.tagName).toBe("H2");
    expect(heading.closest(".rich-text")).not.toBeNull();
    expect(screen.getByText("Residential").closest("li")).not.toBeNull();
    expect(screen.getByText("Big line")).toHaveStyle({ fontSize: "24px" });
  });

  it("renders headings from the legacy single about field", () => {
    render(
      <AboutDeveloper builderName="Godrej" developer={{ about: EDITOR_HTML }} />,
    );

    expect(screen.getByText("Landmark projects").tagName).toBe("H2");
  });

  it("strips scripts out of the saved HTML", () => {
    const { container } = render(
      <AboutDeveloper
        builderName="Godrej"
        developer={{
          aboutBlocks: [{ text: '<h2>Safe</h2><script>alert(1)</script>' }],
        }}
      />,
    );

    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByText("Safe").tagName).toBe("H2");
  });

  it("still shows plain text pasted without any markup", () => {
    render(
      <AboutDeveloper
        builderName="Godrej"
        developer={{ aboutBlocks: [{ text: "Line one\nLine two" }] }}
      />,
    );

    expect(screen.getByText(/Line one/)).toBeInTheDocument();
  });
});
