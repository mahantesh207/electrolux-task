import { renderHook } from "@testing-library/react";
import type { InfiniteData } from "@tanstack/react-query";
import type { ProductsResponse } from "../../types/product.types";
import {
  productFixture,
  productsPageFixture,
  secondaryProductFixture,
} from "../../test/fixtures/products";
import {
  HIGH_DISCOUNT_THRESHOLD,
  useCatalogProducts,
} from "../useCatalogProducts";

describe("useCatalogProducts", () => {
  it("returns empty catalog defaults when no data is available", () => {
    const { result } = renderHook(() =>
      useCatalogProducts({
        data: undefined,
        discountOnly: false,
        maxPrice: "",
        minPrice: "",
      }),
    );

    expect(result.current.catalogMaxPrice).toBe(0);
    expect(result.current.catalogMinPrice).toBe(0);
    expect(result.current.products).toEqual([]);
    expect(result.current.totalResults).toBe(0);
    expect(result.current.hasPriceFilter).toBe(false);
  });

  it("filters products by price and high discount", () => {
    const data: InfiniteData<ProductsResponse, number> = {
      pageParams: [0],
      pages: [productsPageFixture],
    };

    const { result } = renderHook(() =>
      useCatalogProducts({
        data,
        discountOnly: true,
        maxPrice: "2000",
        minPrice: "1200",
      }),
    );

    expect(result.current.catalogMinPrice).toBe(productFixture.price);
    expect(result.current.catalogMaxPrice).toBe(secondaryProductFixture.price);
    expect(result.current.hasPriceFilter).toBe(true);
    expect(result.current.totalResults).toBe(productsPageFixture.total);
    expect(result.current.products).toEqual([productFixture]);
    expect(productFixture.discountPercentage).toBeGreaterThan(
      HIGH_DISCOUNT_THRESHOLD,
    );
  });
});
