import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "../api/products.api";
import type { Product } from "../types/product.types";

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};
