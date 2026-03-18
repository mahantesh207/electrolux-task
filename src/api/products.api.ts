import type { Product, ProductsResponse } from "../types/product.types";
import { fetchJson } from "../utils/fetcher";

export const PRODUCTS_PAGE_SIZE = 12;

type FetchProductsParams = {
  pageParam?: number;
  search?: string;
};

export const fetchProducts = async ({
  pageParam = 0,
  search = "",
}: FetchProductsParams): Promise<ProductsResponse> => {
  const params = new URLSearchParams({
    limit: String(PRODUCTS_PAGE_SIZE),
    skip: String(pageParam),
  });

  const trimmedSearch = search.trim();
  const endpoint = trimmedSearch
    ? `https://dummyjson.com/products/search?${params.toString()}&q=${encodeURIComponent(trimmedSearch)}`
    : `https://dummyjson.com/products?${params.toString()}`;

  return fetchJson<ProductsResponse>(endpoint);
};

export const fetchProduct = async (id: string) =>
  fetchJson<Product>(`https://dummyjson.com/products/${id}`);
