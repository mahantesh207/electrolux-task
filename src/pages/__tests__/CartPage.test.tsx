import { screen } from "@testing-library/react";
import { toast } from "react-toastify";
import CartPage from "../CartPage";
import { renderWithProviders } from "../../test/test-utils";
import { buildCartItem } from "../../utils/cart";
import { formatPriceInr } from "../../utils/currency";
import {
  productFixture,
  secondaryProductFixture,
} from "../../test/fixtures/products";

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

describe("CartPage", () => {
  it("renders an empty state when the cart has no items", () => {
    renderWithProviders(<CartPage />, {
      route: "/cart",
      withRouter: true,
    });

    expect(
      screen.getByRole("heading", { name: /your cart is empty/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /browse products/i }),
    ).toHaveAttribute("href", "/");
  });

  it("updates quantities, removes items, and clears the cart", async () => {
    const { store, user } = renderWithProviders(<CartPage />, {
      preloadedState: {
        cart: {
          items: [
            { ...buildCartItem(productFixture), quantity: 1 },
            { ...buildCartItem(secondaryProductFixture), quantity: 2 },
          ],
        },
      },
      route: "/cart",
      withRouter: true,
    });

    expect(
      screen.getByRole("heading", { name: /your cart/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3 items in your bag/i)).toBeInTheDocument();
    expect(screen.getAllByText(formatPriceInr(8297))).toHaveLength(2);
    expect(screen.getByText(/free/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continue shopping/i }),
    ).toHaveAttribute("href", "/");

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`Increase quantity for ${productFixture.title}`, "i"),
      }),
    );

    expect(store.getState().cart.items[0]?.quantity).toBe(2);
    expect(
      screen.getAllByText(formatPriceInr(productFixture.price * 2)).length,
    ).toBeGreaterThan(0);

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`Decrease quantity for ${secondaryProductFixture.title}`, "i"),
      }),
    );

    expect(store.getState().cart.items[1]?.quantity).toBe(1);

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`Remove ${productFixture.title} from cart`, "i"),
      }),
    );

    expect(store.getState().cart.items).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: /clear cart/i }));

    expect(store.getState().cart.items).toHaveLength(0);
    expect(
      screen.getByRole("heading", { name: /your cart is empty/i }),
    ).toBeInTheDocument();
  });

  it("places an order and falls back to the catalog item label", async () => {
    const cartItemWithoutMetadata = {
      ...buildCartItem(productFixture),
      brand: undefined,
      category: undefined as unknown as string,
      quantity: 1,
    };

    const { store, user } = renderWithProviders(<CartPage />, {
      preloadedState: {
        cart: {
          items: [cartItemWithoutMetadata],
        },
      },
      route: "/cart",
      withRouter: true,
    });

    expect(screen.getByText(/1 item in your bag\./i)).toBeInTheDocument();
    expect(screen.getByText("Catalog item")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /place order/i }));

    expect(store.getState().cart.items).toHaveLength(0);
    expect(toast.success).toHaveBeenCalledWith(
      "Thanks. Your order is in.",
      expect.objectContaining({
        toastId: "order-placed",
      }),
    );
    expect(
      screen.getByRole("heading", { name: /your cart is empty/i }),
    ).toBeInTheDocument();
  });
});
