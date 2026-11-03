import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

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

describe("enquiry popup", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => jest.useRealTimers());

  test("opens after six seconds for a new visitor and can be dismissed", () => {
    render(<ContactModal />);

    expect(screen.queryByTestId("lead-modal")).not.toBeInTheDocument();
    act(() => jest.advanceTimersByTime(5999));
    expect(screen.queryByTestId("lead-modal")).not.toBeInTheDocument();

    act(() => jest.advanceTimersByTime(1));
    expect(screen.getByTestId("lead-modal")).toHaveTextContent("optional");
    fireEvent.click(screen.getByText("close"));
    expect(screen.queryByTestId("lead-modal")).not.toBeInTheDocument();
  });

  test("records a successful submission and allows the visitor to continue", async () => {
    render(<ContactModal />);

    act(() => jest.advanceTimersByTime(6000));
    fireEvent.click(screen.getByText("submit"));
    await waitFor(() => expect(screen.queryByTestId("lead-modal")).not.toBeInTheDocument());

    expect(JSON.parse(localStorage.getItem("enquiryLeadSubmitted"))).toEqual(
      expect.objectContaining({ submitted: true }),
    );
  });

  test("does not force the popup again after a recorded submission", async () => {
    localStorage.setItem("enquiryLeadSubmitted", JSON.stringify({ submitted: true }));
    render(<ContactModal />);

    act(() => jest.advanceTimersByTime(6000));
    expect(screen.queryByTestId("lead-modal")).not.toBeInTheDocument();
  });
});
