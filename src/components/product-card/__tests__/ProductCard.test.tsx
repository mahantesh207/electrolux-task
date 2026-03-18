import { screen } from "@testing-library/react";
import { toast } from "react-toastify";
import ProductCard from "../ProductCard";
import { productFixture } from "../../../test/fixtures/products";
import { renderWithProviders } from "../../../test/test-utils";

vi.mock("react-toastify", async () => {
  const actual = await vi.importActual<typeof import("react-toastify")>("react-toastify");

  return {
    ...actual,
    toast: {
      ...actual.toast,
      success: vi.fn(),
    },
  };
});

describe("ProductCard", () => {
  it("renders product information and adds the item to cart", async () => {
    const { store, user } = renderWithProviders(
      <ProductCard product={productFixture} />,
      { route: "/", withRouter: true },
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/products/${productFixture.id}`,
    );
    expect(screen.getByText(productFixture.title)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(store.getState().cart.items[0]?.quantity).toBe(1);
    expect(toast.success).toHaveBeenCalledWith(
      `${productFixture.title} added to cart`,
      expect.objectContaining({
        toastId: `cart-${productFixture.id}`,
      }),
    );
  });
});
