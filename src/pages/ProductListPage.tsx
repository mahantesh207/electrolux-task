import { startTransition, useState } from "react";
import type { ChangeEvent } from "react";
import CatalogEmptyState from "../components/catalog/CatalogEmptyState";
import CatalogProductGrid from "../components/catalog/CatalogProductGrid";
import CatalogResultsHeader from "../components/catalog/CatalogResultsHeader";
import CatalogSidebar from "../components/catalog/CatalogSidebar";
import GridLoader from "../components/loader/GridLoader";
import {
  PRICE_STEP,
  useCatalogProducts,
  useDebouncedValue,
  useInfiniteScroll,
  useProducts,
} from "../hooks";
import "./ProductListPage.css";

const SEARCH_DEBOUNCE_MS = 400;
const FETCH_AHEAD_MARGIN = "320px 0px";

export default function ProductListPage() {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);

  const normalizedSearch = search.trim();
  const searchQuery = useDebouncedValue(normalizedSearch, SEARCH_DEBOUNCE_MS);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error
  } = useProducts(searchQuery);

  const {
    catalogMaxPrice,
    catalogMinPrice,
    hasPriceFilter,
    products,
    sliderMaxPercent,
    sliderMaxPrice,
    sliderMinPercent,
    sliderMinPrice,
    totalResults,
  } = useCatalogProducts({
    data,
    discountOnly,
    maxPrice,
    minPrice,
  });

  const hasActiveFilters =
    Boolean(normalizedSearch) ||
    hasPriceFilter ||
    discountOnly;
  const isSearchUpdating =
    normalizedSearch !== searchQuery ||
    (isFetching && !isFetchingNextPage);

  const clearFilters = () => {
    startTransition(() => {
      setSearch("");
      setMinPrice("");
      setMaxPrice("");
      setDiscountOnly(false);
    });
  };

  const resultsHeading = searchQuery
    ? `${products.length} ${products.length === 1 ? "result" : "results"} for "${searchQuery}"`
    : `${products.length} ${products.length === 1 ? "product" : "products"} ready to browse`;
  const resultsLabel = searchQuery
    ? `${totalResults} matches found for your search`
    : "Use the filters to filter products further.";
  const showEmptyState =
    !isLoading &&
    !isFetching &&
    products.length === 0;
  const emptyStateTitle = hasActiveFilters
    ? "No products found"
    : "No products available";
  const emptyStateDescription = hasActiveFilters
    ? "Try another search or clear your filters."
    : "Nothing to show right now. Check back soon.";
  const isPriceRangeLocked = catalogMinPrice === catalogMaxPrice;

  const handleMinPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    const nextMinPrice = Math.min(
      Math.max(nextValue, catalogMinPrice),
      sliderMaxPrice - PRICE_STEP,
    );

    setMinPrice(
      nextMinPrice <= catalogMinPrice ? "" : String(nextMinPrice),
    );
  };

  const handleMaxPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    const nextMaxPrice = Math.max(
      Math.min(nextValue, catalogMaxPrice),
      sliderMinPrice + PRICE_STEP,
    );

    setMaxPrice(
      nextMaxPrice >= catalogMaxPrice ? "" : String(nextMaxPrice),
    );
  };

  const observerRef = useInfiniteScroll<HTMLDivElement>({
    disabled: !hasNextPage || isFetchingNextPage,
    onIntersect: fetchNextPage,
    rootMargin: FETCH_AHEAD_MARGIN,
  });

  if (isLoading) {
    return (
      <div className="container-fluid mt-4">
        <GridLoader count={6} />
      </div>
    );
  }

  if (error) {
    return <p>Error loading products</p>;
  }

  return (
    <div className="product-list-page container-fluid mt-4">
      <div className="row g-4">
        <div className="col-12 col-lg-4 col-xl-3">
          <CatalogSidebar
            catalogMaxPrice={catalogMaxPrice}
            catalogMinPrice={catalogMinPrice}
            discountOnly={discountOnly}
            isPriceRangeLocked={isPriceRangeLocked}
            isSearchUpdating={isSearchUpdating}
            onDiscountToggle={() => setDiscountOnly((current) => !current)}
            onMaxPriceChange={handleMaxPriceChange}
            onMinPriceChange={handleMinPriceChange}
            onSearchChange={(nextValue) => {
              startTransition(() => {
                setSearch(nextValue);
              });
            }}
            search={search}
            sliderMaxPercent={sliderMaxPercent}
            sliderMaxPrice={sliderMaxPrice}
            sliderMinPercent={sliderMinPercent}
            sliderMinPrice={sliderMinPrice}
          />
        </div>

        <div className="col-12 col-lg-8 col-xl-9">
          <CatalogResultsHeader
            description={resultsLabel}
            heading={resultsHeading}
            onReset={clearFilters}
            showReset={hasActiveFilters}
          />

          {showEmptyState ? (
            <CatalogEmptyState
              description={emptyStateDescription}
              title={emptyStateTitle}
            />
          ) : (
            <CatalogProductGrid
              isFetchingNextPage={isFetchingNextPage}
              products={products}
            />
          )}

          <div ref={observerRef} className="catalog-sentinel" />
        </div>
      </div>
    </div>
  );
}
