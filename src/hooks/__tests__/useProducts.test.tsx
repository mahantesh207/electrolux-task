import { useInfiniteQuery } from "@tanstack/react-query";
import type { ProductsResponse } from "../../types/product.types";
import { fetchProducts } from "../../api/products.api";
import {
  productFixture,
  secondaryProductFixture,
} from "../../test/fixtures/products";
import { useProducts } from "../useProducts";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );

  return {
    ...actual,
    useInfiniteQuery: vi.fn(),
  };
});

vi.mock("../../api/products.api", () => ({
  fetchProducts: vi.fn(),
}));

const mockedUseInfiniteQuery = vi.mocked(useInfiniteQuery);
const mockedFetchProducts = vi.mocked(fetchProducts);

type UseProductsOptions = {
  getNextPageParam: (
    lastPage: ProductsResponse,
    pages: ProductsResponse[],
  ) => number | undefined;
  initialPageParam: number;
  queryFn: (context: { pageParam: number }) => Promise<ProductsResponse>;
  queryKey: [string, string];
  staleTime: number;
};

describe("useProducts", () => {
  beforeEach(() => {
    mockedFetchProducts.mockReset();
    mockedUseInfiniteQuery.mockReset();
  });

  it("configures the infinite query with normalized search and next-page logic", async () => {
    const queryResult = {
      data: undefined,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
    };

    mockedUseInfiniteQuery.mockReturnValue(queryResult as never);

    expect(useProducts("  kettle  ")).toBe(queryResult);

    const options = mockedUseInfiniteQuery.mock.calls[0]?.[0] as UseProductsOptions;

    expect(options.queryKey).toEqual(["products", "kettle"]);
    expect(options.initialPageParam).toBe(0);
    expect(options.staleTime).toBe(60 * 1000);

    const page = {
      limit: 12,
      products: [productFixture],
      skip: 1,
      total: 3,
    };

    mockedFetchProducts.mockResolvedValue(page);

    await expect(options.queryFn({ pageParam: 1 })).resolves.toEqual(page);
    expect(mockedFetchProducts).toHaveBeenCalledWith({
      pageParam: 1,
      search: "kettle",
    });

    const firstPage: ProductsResponse = {
      limit: 12,
      products: [productFixture],
      skip: 0,
      total: 3,
    };
    const secondPage: ProductsResponse = {
      limit: 12,
      products: [secondaryProductFixture],
      skip: 1,
      total: 3,
    };

    expect(options.getNextPageParam(secondPage, [firstPage, secondPage])).toBe(2);
    expect(
      options.getNextPageParam(
        { ...secondPage, total: 2 },
        [firstPage, secondPage],
      ),
    ).toBeUndefined();
  });

  it("defaults to an empty search string", () => {
    mockedUseInfiniteQuery.mockReturnValue({} as never);

    useProducts();

    const options = mockedUseInfiniteQuery.mock.calls[0]?.[0] as UseProductsOptions;

    expect(options.queryKey).toEqual(["products", ""]);
  });
});
