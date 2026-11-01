import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/src/LeadCapture/LeadCaptureModal", () => function MockLeadCaptureModal(props) {
  if (!props.open) return null;

  return (
    <div data-testid="lead-modal">
      <span>{props.requireCompletion ? "required" : "optional"}</span>
      <button onClick={props.onClose}>close</button>
      <button
        onClick={() => {
          props.onSuccess?.();
          props.onClose();
        }}
      >
        submit
      </button>
    </div>
  );
});

import ContactModal from "@/src/Modal/ContactModal";

describe("mandatory enquiry popup", () => {
  beforeEach(() => localStorage.clear());

  test("opens for a new visitor and cannot close before submitting", async () => {
    render(<ContactModal />);

    expect(await screen.findByTestId("lead-modal")).toHaveTextContent("required");
    fireEvent.click(screen.getByText("close"));
    expect(screen.getByTestId("lead-modal")).toBeInTheDocument();
  });

  test("records a successful submission and allows the visitor to continue", async () => {
    render(<ContactModal />);

    fireEvent.click(await screen.findByText("submit"));
    await waitFor(() => expect(screen.queryByTestId("lead-modal")).not.toBeInTheDocument());

    expect(JSON.parse(localStorage.getItem("enquiryLeadSubmitted"))).toEqual(
      expect.objectContaining({ submitted: true }),
    );
  });

  test("does not force the popup again after a recorded submission", async () => {
    localStorage.setItem("enquiryLeadSubmitted", JSON.stringify({ submitted: true }));
    render(<ContactModal />);

    await waitFor(() => expect(screen.queryByTestId("lead-modal")).not.toBeInTheDocument());
  });
});
