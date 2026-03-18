import { render, screen } from "@testing-library/react";
import {
  productFixture,
  secondaryProductFixture,
} from "../../../test/fixtures/products";
import CatalogProductGrid from "../CatalogProductGrid";

vi.mock("../../product-card/ProductCard", () => ({
  default: ({ product }: { product: { title: string } }) => (
    <div data-testid="product-card">{product.title}</div>
  ),
}));

vi.mock("../../loader/SkeletonProductCard", () => ({
  default: () => <div data-testid="skeleton-card">Loading card</div>,
}));

describe("CatalogProductGrid", () => {
  it("renders product cards and loading placeholders for the next page", () => {
    render(
      <CatalogProductGrid
        isFetchingNextPage
        products={[productFixture, secondaryProductFixture]}
      />,
    );

    expect(screen.getAllByTestId("product-card")).toHaveLength(2);
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(3);
  });
});
