import { screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import CartPage from "../pages/CartPage";
import { renderWithProviders } from "../test/test-utils";
import { buildCartItem } from "../utils/cart";
import { productFixture } from "../test/fixtures/products";

describe("App", () => {
  it("navigates to the cart page from the sticky navbar cart link", async () => {
    const router = createMemoryRouter(
      [
        {
          element: <App />,
          path: "/",
          children: [
            {
              index: true,
              element: <div>Catalog page</div>,
            },
            {
              path: "cart",
              element: <CartPage />,
            },
          ],
        },
      ],
      {
        initialEntries: ["/"],
      },
    );

    const { user } = renderWithProviders(<RouterProvider router={router} />, {
      preloadedState: {
        cart: {
          items: [{ ...buildCartItem(productFixture), quantity: 1 }],
        },
      },
    });

    await user.click(
      screen.getByRole("link", { name: /view cart with 1 items/i }),
    );

    expect(
      screen.getByRole("heading", { name: /your cart/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(productFixture.title)).toBeInTheDocument();
  });
});
