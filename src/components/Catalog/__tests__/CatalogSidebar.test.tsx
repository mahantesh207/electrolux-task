import { fireEvent, render, screen } from "@testing-library/react";
import CatalogSidebar from "../CatalogSidebar";

const baseProps = {
  catalogMaxPrice: 4000,
  catalogMinPrice: 1000,
  discountOnly: false,
  isPriceRangeLocked: false,
  isSearchUpdating: false,
  onDiscountToggle: vi.fn(),
  onMaxPriceChange: vi.fn(),
  onMinPriceChange: vi.fn(),
  onSearchChange: vi.fn(),
  search: "",
  sliderMaxPercent: 100,
  sliderMaxPrice: 4000,
  sliderMinPercent: 0,
  sliderMinPrice: 1000,
};

describe("CatalogSidebar", () => {
  beforeEach(() => {
    baseProps.onDiscountToggle.mockReset();
    baseProps.onMaxPriceChange.mockReset();
    baseProps.onMinPriceChange.mockReset();
    baseProps.onSearchChange.mockReset();
  });

  it("renders the idle search helper and forwards filter interactions", () => {
    render(<CatalogSidebar {...baseProps} />);

    fireEvent.change(screen.getByPlaceholderText("Search the catalog..."), {
      target: { value: "kettle" },
    });
    fireEvent.change(screen.getByLabelText("Minimum price"), {
      target: { value: "1200" },
    });
    fireEvent.change(screen.getByLabelText("Maximum price"), {
      target: { value: "3200" },
    });
    fireEvent.click(screen.getByRole("button", { name: /10%\+ off only/i }));

    expect(screen.getByText("Results update while you type.")).toBeInTheDocument();
    expect(screen.queryByText("Live")).not.toBeInTheDocument();
    expect(baseProps.onSearchChange).toHaveBeenCalledWith("kettle");
    expect(baseProps.onMinPriceChange).toHaveBeenCalledTimes(1);
    expect(baseProps.onMaxPriceChange).toHaveBeenCalledTimes(1);
    expect(baseProps.onDiscountToggle).toHaveBeenCalledTimes(1);
  });

  it("shows live search state and active discount styling", () => {
    render(
      <CatalogSidebar
        {...baseProps}
        discountOnly
        isSearchUpdating
        search="jar"
      />,
    );

    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Looking for matches...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /10%\+ off only/i })).toHaveClass(
      "is-active",
    );
  });
});
