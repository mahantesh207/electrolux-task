import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { fetchProducts } from "../api/products.api";
import type { ProductsResponse } from "../types/product.types";

export const useProducts = (search = "") => {
  const normalizedSearch = search.trim();

  return useInfiniteQuery<
    ProductsResponse,
    Error,
    InfiniteData<ProductsResponse, number>,
    [string, string],
    number
  >({
    queryKey: ["products", normalizedSearch],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchProducts({ pageParam, search: normalizedSearch }),
    staleTime: 60 * 1000,

    getNextPageParam: (lastPage: ProductsResponse, pages: ProductsResponse[]) => {
      const loadedProducts = pages.reduce(
        (count, page) => count + page.products.length,
        0,
      );

      if (loadedProducts >= lastPage.total) {
        return undefined;
      }

      return loadedProducts;
    },
  });
};
