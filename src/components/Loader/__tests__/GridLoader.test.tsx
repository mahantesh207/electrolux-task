import { render } from "@testing-library/react";
import GridLoader from "../GridLoader";
import SkeletonProductCard from "../SkeletonProductCard";

describe("Loader components", () => {
  it("renders a standalone skeleton card", () => {
    const { container } = render(<SkeletonProductCard />);

    expect(container.querySelector(".card.h-100")).toBeInTheDocument();
    expect(container.querySelector(".product-card-placeholder")).toBeNull();
    expect(container.querySelectorAll(".placeholder")).not.toHaveLength(0);
  });

  it("renders six skeleton cards by default in the grid", () => {
    const { container } = render(<GridLoader />);

    expect(container.querySelectorAll(".col-md-4.mb-4")).toHaveLength(6);
  });
});
