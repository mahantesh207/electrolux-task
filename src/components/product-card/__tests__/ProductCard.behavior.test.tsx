import { fireEvent, screen } from "@testing-library/react";
import ProductCard from "../ProductCard";
import { productFixture } from "../../../test/fixtures/products";
import { renderWithProviders } from "../../../test/test-utils";

describe("ProductCard behavior", () => {
  it("reveals the loaded image state and falls back when brand or rating is missing", () => {
    const productWithoutMetadata = {
      ...productFixture,
      brand: undefined,
      rating: undefined,
    };

    const { container } = renderWithProviders(
      <ProductCard product={productWithoutMetadata} />,
      { route: "/", withRouter: true },
    );

    const image = screen.getByAltText(productWithoutMetadata.title);

    expect(container.querySelector(".product-card-placeholder")).toBeInTheDocument();
    expect(container.querySelector(".product-card-rating")).toBeNull();
    expect(screen.getByText("Curated pick")).toBeInTheDocument();

    fireEvent.load(image);

    expect(container.querySelector(".product-card-placeholder")).toBeNull();
    expect(image).toHaveClass("is-loaded");
  });
});
