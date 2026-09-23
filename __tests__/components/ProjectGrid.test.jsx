import { fireEvent, render, screen } from "@testing-library/react";

const push = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

jest.mock("next/image", () => function MockImage({ fill, ...props }) {
  return <img {...props} />;
});

jest.mock("@/src/Modal/PropertyEnquiryModal", () => () => null);

import ProjectGrid from "@/src/Developers/ProjectGrid";

describe("Developer ProjectGrid property links", () => {
  beforeEach(() => push.mockClear());

  test("navigates with the persisted property slug", () => {
    render(
      <ProjectGrid
        builderName="Acme"
        projects={[{
          id: "firestore-id",
          slug: "skyline-towers-a1b2c3",
          propertyTitle: "Skyline Towers",
          projectName: "Skyline Towers",
          builderName: "Acme",
          propertyType: "Apartment",
          city: "Pune",
          state: "Maharashtra",
          activeStatus: "Yes",
        }]}
      />,
    );

    fireEvent.click(screen.getByText("Skyline Towers"));

    expect(push).toHaveBeenCalledWith("/properties/skyline-towers-a1b2c3");
  });

  test("builds the correct title slug for existing properties without a saved slug", () => {
    render(
      <ProjectGrid
        builderName="Godrej"
        projects={[{
          id: "ad1eNkMjwz4A3Vb2NsLS",
          propertyTitle: "Godrej Aqua Retreat Hinjewadi",
          projectName: "Godrej Aqua Retreat Hinjewadi",
          builderName: "Godrej",
          propertyType: "Apartment",
          city: "Pune",
          state: "Maharashtra",
          activeStatus: "Yes",
        }]}
      />,
    );

    fireEvent.click(screen.getByText("Godrej Aqua Retreat Hinjewadi"));

    expect(push).toHaveBeenCalledWith(
      "/properties/godrej-aqua-retreat-hinjewadi",
    );
    expect(push).not.toHaveBeenCalledWith(
      "/properties/ad1eNkMjwz4A3Vb2NsLS",
    );
  });
});
