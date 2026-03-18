import { fireEvent, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { toast } from "react-toastify";
import ProductDetailPage from "../ProductDetailPage";
import { useProduct } from "../../hooks";
import { productFixture } from "../../test/fixtures/products";
import { renderWithProviders } from "../../test/test-utils";

vi.mock("../../hooks", () => ({
  useProduct: vi.fn(),
}));

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

const mockedUseProduct = vi.mocked(useProduct);

const renderDetailRoute = ({
  initialEntries = ["/products/1"],
  path = "/products/:productId",
}: {
  initialEntries?: string[];
  path?: string;
} = {}) => {
  const router = createMemoryRouter(
    [
      {
        element: <ProductDetailPage />,
        path,
      },
    ],
    {
      initialEntries,
    },
  );

  return renderWithProviders(<RouterProvider router={router} />);
};

describe("ProductDetailPage", () => {
  beforeEach(() => {
    mockedUseProduct.mockReset();
  });

  it("renders the product detail content and adds the item to cart", async () => {
    mockedUseProduct.mockReturnValue({
      data: productFixture,
      error: null,
      isLoading: false,
    } as ReturnType<typeof useProduct>);

    const { store, user } = renderDetailRoute();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      productFixture.title,
    );
    expect(screen.getAllByText(productFixture.description)).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(store.getState().cart.items[0]?.id).toBe(productFixture.id);
    expect(toast.success).toHaveBeenCalledWith(
      `${productFixture.title} added to cart`,
      expect.objectContaining({
        toastId: `cart-${productFixture.id}`,
      }),
    );

    const heroImage = screen.getAllByAltText(productFixture.title)[0];
    fireEvent.mouseEnter(heroImage.closest(".detail-hero-image") as HTMLElement);

    expect(heroImage).toHaveClass("detail-hero-media", "is-zoomed");
    expect(screen.getByText(/move to inspect/i)).toBeInTheDocument();
  });

  it("renders loading and missing-route states", () => {
    mockedUseProduct.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: true,
    } as ReturnType<typeof useProduct>);

    const { container } = renderDetailRoute();

    expect(container.querySelectorAll(".placeholder")).not.toHaveLength(0);

    mockedUseProduct.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
    } as ReturnType<typeof useProduct>);

    renderDetailRoute({
      initialEntries: ["/products"],
      path: "/products",
    });

    expect(
      screen.getByRole("heading", { name: /product not found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the requested product id is missing\./i),
    ).toBeInTheDocument();
  });

  it("handles gallery interactions and resets the zoom state", async () => {
    mockedUseProduct.mockReturnValue({
      data: productFixture,
      error: null,
      isLoading: false,
    } as ReturnType<typeof useProduct>);

    const { container, user } = renderDetailRoute();
    const heroContainer = container.querySelector(".detail-hero-image") as HTMLDivElement;

    vi.spyOn(heroContainer, "getBoundingClientRect").mockReturnValue({
      bottom: 120,
      height: 100,
      left: 10,
      right: 110,
      top: 20,
      width: 100,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    });

    fireEvent.mouseEnter(heroContainer);
    fireEvent.mouseMove(heroContainer, {
      clientX: 999,
      clientY: -20,
    });

    const heroImage = container.querySelector(".detail-hero-media") as HTMLImageElement;
    expect(heroImage.style.transformOrigin).toBe("100% 0%");

    const thumbnails = container.querySelectorAll(".detail-thumb");
    await user.click(thumbnails[1] as HTMLButtonElement);

    expect(thumbnails[1]).toHaveClass("is-active");
    expect(heroImage).toHaveAttribute("src", productFixture.images?.[1]);
    expect(screen.getByText(/hover to zoom/i)).toBeInTheDocument();

    fireEvent.mouseEnter(heroContainer);
    fireEvent.mouseLeave(heroContainer);

    expect(heroImage).not.toHaveClass("is-zoomed");
    expect(screen.getByText(/hover to zoom/i)).toBeInTheDocument();
  });

  it("renders fallback product metadata when optional fields are missing", () => {
    const thumbnailOnlyProduct = {
      ...productFixture,
      availabilityStatus: undefined,
      brand: undefined,
      images: undefined,
      rating: undefined,
      stock: undefined,
    };

    mockedUseProduct.mockReturnValue({
      data: thumbnailOnlyProduct,
      error: null,
      isLoading: false,
    } as ReturnType<typeof useProduct>);

    const { container } = renderDetailRoute();

    expect(screen.getByText("Featured Product")).toBeInTheDocument();
    expect(screen.queryByText(/rating/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/in stock/i)).not.toBeInTheDocument();
    expect(screen.getByText("0 units")).toBeInTheDocument();
    expect(container.querySelectorAll(".detail-thumb")).toHaveLength(0);
  });

  it("renders an image placeholder when the product has no gallery media", () => {
    const noImageProduct = {
      ...productFixture,
      images: undefined,
      thumbnail: "",
    };

    mockedUseProduct.mockReturnValue({
      data: noImageProduct,
      error: null,
      isLoading: false,
    } as ReturnType<typeof useProduct>);

    const { container } = renderDetailRoute();

    expect(
      container.querySelector(".placeholder.w-100.h-100.rounded-4"),
    ).toBeInTheDocument();
  });

  it("renders an error state when the product query fails", () => {
    mockedUseProduct.mockReturnValue({
      data: undefined,
      error: new Error("Failed"),
      isLoading: false,
    } as ReturnType<typeof useProduct>);

    renderDetailRoute();

    expect(
      screen.getByRole("heading", { name: /unable to load product/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/back to catalog/i)).toBeInTheDocument();
  });
});
