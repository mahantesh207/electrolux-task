import { useMemo } from "react";
import type { InfiniteData } from "@tanstack/react-query";
import type { Product, ProductsResponse } from "../types/product.types";

export const HIGH_DISCOUNT_THRESHOLD = 10;
export const PRICE_STEP = 1;

type UseCatalogProductsParams = {
  data: InfiniteData<ProductsResponse, number> | undefined;
  discountOnly: boolean;
  maxPrice: string;
  minPrice: string;
};

type CatalogSummary = {
  catalogMaxPrice: number;
  catalogMinPrice: number;
  fetchedProducts: Product[];
  totalResults: number;
};

export const useCatalogProducts = ({
  data,
  discountOnly,
  maxPrice,
  minPrice,
}: UseCatalogProductsParams) => {
  const {
    catalogMaxPrice,
    catalogMinPrice,
    fetchedProducts,
    totalResults,
  } = useMemo<CatalogSummary>(() => {
    const nextProducts: Product[] = [];
    let nextCatalogMinPrice = Number.POSITIVE_INFINITY;
    let nextCatalogMaxPrice = 0;

    for (const page of data?.pages ?? []) {
      for (const product of page.products) {
        nextProducts.push(product);
        nextCatalogMinPrice = Math.min(nextCatalogMinPrice, product.price);
        nextCatalogMaxPrice = Math.max(nextCatalogMaxPrice, product.price);
      }
    }

    return {
      catalogMaxPrice: nextProducts.length ? nextCatalogMaxPrice : 0,
      catalogMinPrice: nextProducts.length ? nextCatalogMinPrice : 0,
      fetchedProducts: nextProducts,
      totalResults: data?.pages[0]?.total ?? 0,
    };
  }, [data]);

  const parsedMinPrice =
    minPrice === "" ? catalogMinPrice : Number(minPrice);
  const parsedMaxPrice =
    maxPrice === "" ? catalogMaxPrice : Number(maxPrice);
  const priceSpan = Math.max(catalogMaxPrice - catalogMinPrice, PRICE_STEP);

  const sliderMinPrice = Math.min(
    Math.max(parsedMinPrice, catalogMinPrice),
    Math.max(catalogMinPrice, parsedMaxPrice - PRICE_STEP),
  );
  const sliderMaxPrice = Math.max(
    Math.min(parsedMaxPrice, catalogMaxPrice),
    Math.min(catalogMaxPrice, sliderMinPrice + PRICE_STEP),
  );

  const products = useMemo(() => {
    return fetchedProducts.filter((product) => {
      const matchesPriceRange =
        product.price >= sliderMinPrice &&
        product.price <= sliderMaxPrice;
      const matchesDiscount =
        !discountOnly ||
        product.discountPercentage > HIGH_DISCOUNT_THRESHOLD;

      return matchesPriceRange && matchesDiscount;
    });
  }, [discountOnly, fetchedProducts, sliderMaxPrice, sliderMinPrice]);

  const hasPriceFilter =
    sliderMinPrice > catalogMinPrice ||
    sliderMaxPrice < catalogMaxPrice;

  return {
    catalogMaxPrice,
    catalogMinPrice,
    hasPriceFilter,
    priceFromLabel: sliderMinPrice,
    priceToLabel: sliderMaxPrice,
    products,
    sliderMaxPercent:
      ((sliderMaxPrice - catalogMinPrice) / priceSpan) * 100,
    sliderMaxPrice,
    sliderMinPercent:
      ((sliderMinPrice - catalogMinPrice) / priceSpan) * 100,
    sliderMinPrice,
    totalResults,
  };
};
