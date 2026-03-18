import { act, fireEvent, screen } from "@testing-library/react";
import ProductListPage from "../ProductListPage";
import { useProducts } from "../../hooks";
import {
  productFixture,
  productsPageFixture,
  secondaryProductFixture,
} from "../../test/fixtures/products";
import { renderWithProviders } from "../../test/test-utils";

vi.mock("../../hooks", async () => {
  const actual = await vi.importActual<typeof import("../../hooks")>(
    "../../hooks",
  );

  return {
    ...actual,
    useProducts: vi.fn(),
  };
});

const mockedUseProducts = vi.mocked(useProducts);

const createUseProductsResult = (
  overrides: Partial<ReturnType<typeof useProducts>> = {},
) =>
  ({
    data: {
      pageParams: [0],
      pages: [productsPageFixture],
    },
    error: null,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetching: false,
    isFetchingNextPage: false,
    isLoading: false,
    ...overrides,
  }) as unknown as ReturnType<typeof useProducts>;

describe("ProductListPage", () => {
  beforeEach(() => {
    mockedUseProducts.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders products, applies price filters, and resets filters", async () => {
    mockedUseProducts.mockReturnValue(createUseProductsResult());

    const { user } = renderWithProviders(<ProductListPage />, {
      route: "/",
      withRouter: true,
    });

    expect(screen.getByText(productFixture.title)).toBeInTheDocument();
    expect(screen.getByText(secondaryProductFixture.title)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/minimum price/i), {
      target: { value: String(secondaryProductFixture.price) },
    });

    expect(screen.queryByText(productFixture.title)).not.toBeInTheDocument();
    expect(screen.getByText(secondaryProductFixture.title)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reset filters/i }));

    expect(screen.getByText(productFixture.title)).toBeInTheDocument();
    expect(screen.getByText(secondaryProductFixture.title)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/maximum price/i), {
      target: { value: String(productFixture.price) },
    });

    expect(screen.getByText(productFixture.title)).toBeInTheDocument();
    expect(
      screen.queryByText(secondaryProductFixture.title),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/maximum price/i), {
      target: { value: "999999" },
    });

    expect(screen.getByText(productFixture.title)).toBeInTheDocument();
    expect(screen.getByText(secondaryProductFixture.title)).toBeInTheDocument();
  });

  it("requests the next page when the sentinel intersects", () => {
    const fetchNextPage = vi.fn();
    let observerCallback: IntersectionObserverCallback | undefined;

    class TestIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];

      disconnect = vi.fn();
      observe = vi.fn();
      takeRecords = vi.fn(() => []);
      unobserve = vi.fn();

      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
    }

    vi.stubGlobal(
      "IntersectionObserver",
      TestIntersectionObserver as unknown as typeof IntersectionObserver,
    );

    mockedUseProducts.mockReturnValue(
      createUseProductsResult({
        fetchNextPage,
        hasNextPage: true,
      }),
    );

    renderWithProviders(<ProductListPage />, {
      route: "/",
      withRouter: true,
    });

    act(() => {
      observerCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("renders the loading state", () => {
    mockedUseProducts.mockReturnValue(
      createUseProductsResult({
        data: undefined,
        isLoading: true,
      }),
    );

    const { container } = renderWithProviders(<ProductListPage />, {
      route: "/",
      withRouter: true,
    });

    expect(container.querySelectorAll(".col-md-4.mb-4")).toHaveLength(6);
  });

  it("renders the error state", () => {
    mockedUseProducts.mockReturnValue(
      createUseProductsResult({
        error: new Error("Failed to load"),
      }),
    );

    renderWithProviders(<ProductListPage />, {
      route: "/",
      withRouter: true,
    });

    expect(screen.getByText("Error loading products")).toBeInTheDocument();
  });

  it("renders empty-state branches for idle and active filters", () => {
    mockedUseProducts.mockReturnValue(
      createUseProductsResult({
        data: {
          pageParams: [0],
          pages: [{ ...productsPageFixture, products: [], total: 0 }],
        },
      }),
    );

    renderWithProviders(<ProductListPage />, {
      route: "/",
      withRouter: true,
    });

    expect(
      screen.getByRole("heading", { name: /no products available/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/nothing to show right now\. check back soon\./i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /10%\+ off only/i }));

    expect(
      screen.getByRole("heading", { name: /no products found/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/try another search or clear your filters\./i),
    ).toBeInTheDocument();
  });

  it("updates search copy after the debounce and shows live search feedback", () => {
    vi.useFakeTimers();

    mockedUseProducts.mockReturnValue(
      createUseProductsResult({
        data: {
          pageParams: [0],
          pages: [{ ...productsPageFixture, products: [productFixture], total: 1 }],
        },
      }),
    );

    renderWithProviders(<ProductListPage />, {
      route: "/",
      withRouter: true,
    });

    fireEvent.change(screen.getByPlaceholderText(/search the catalog/i), {
      target: { value: "  jar  " },
    });

    expect(screen.getByText(/looking for matches\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(
      screen.getByRole("heading", { name: '1 result for "jar"' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("1 matches found for your search"),
    ).toBeInTheDocument();
    expect(mockedUseProducts).toHaveBeenLastCalledWith("jar");
  });
});
