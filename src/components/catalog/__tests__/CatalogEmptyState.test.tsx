import { render, screen } from "@testing-library/react";
import CatalogEmptyState from "../CatalogEmptyState";

describe("CatalogEmptyState", () => {
  it("renders the provided title and description", () => {
    render(
      <CatalogEmptyState
        description="No products matched your current filters."
        title="Nothing found"
      />,
    );

    expect(screen.getByRole("heading", { name: "Nothing found" })).toBeInTheDocument();
    expect(
      screen.getByText("No products matched your current filters."),
    ).toBeInTheDocument();
  });
});
