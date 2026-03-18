import { screen } from "@testing-library/react";
import Navbar from "../Navbar";
import { renderWithProviders } from "../../../test/test-utils";
import { buildCartItem } from "../../../utils/cart";
import {
  productFixture,
  secondaryProductFixture,
} from "../../../test/fixtures/products";

describe("Navbar", () => {
  it("shows the aggregated cart quantity", () => {
    renderWithProviders(<Navbar />, {
      preloadedState: {
        cart: {
          items: [
            { ...buildCartItem(productFixture), quantity: 2 },
            { ...buildCartItem(secondaryProductFixture), quantity: 1 },
          ],
        },
      },
      withRouter: true,
    });

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view cart with 3 items/i }),
    ).toHaveAttribute("href", "/cart");
  });
});
