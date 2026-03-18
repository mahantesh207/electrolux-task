import type { ChangeEvent } from "react";
import AppIcon from "../icon/AppIcon";
import CatalogFilterSection from "./CatalogFilterSection";
import { formatPriceInr } from "../../utils/currency";

type CatalogSidebarProps = {
  catalogMaxPrice: number;
  catalogMinPrice: number;
  discountOnly: boolean;
  isPriceRangeLocked: boolean;
  isSearchUpdating: boolean;
  onDiscountToggle: () => void;
  onMaxPriceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onMinPriceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchChange: (value: string) => void;
  search: string;
  sliderMaxPercent: number;
  sliderMaxPrice: number;
  sliderMinPercent: number;
  sliderMinPrice: number;
};

export default function CatalogSidebar({
  catalogMaxPrice,
  catalogMinPrice,
  discountOnly,
  isPriceRangeLocked,
  isSearchUpdating,
  onDiscountToggle,
  onMaxPriceChange,
  onMinPriceChange,
  onSearchChange,
  search,
  sliderMaxPercent,
  sliderMaxPrice,
  sliderMinPercent,
  sliderMinPrice,
}: CatalogSidebarProps) {
  return (
    <aside className="catalog-sidebar">
      <div className="filter-panel">
        <div className="filter-panel-header">
          <div>
            <span className="filter-eyebrow">Refine catalog</span>
            <h3 className="filter-title">Filter</h3>
          </div>

          <span className="filter-advanced">Advanced</span>
        </div>

        <CatalogFilterSection
          title="Search"
          badge={
            isSearchUpdating ? (
              <span className="filter-badge">Live</span>
            ) : undefined
          }
        >
          <div className="filter-input-wrap">
            <AppIcon className="filter-input-icon" name="magnifying-glass" />

            <input
              type="search"
              className="filter-input"
              placeholder="Search the catalog..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <p className="filter-helper">
            {isSearchUpdating
              ? "Looking for matches..."
              : "Results update while you type."}
          </p>
        </CatalogFilterSection>

        <CatalogFilterSection
          title="Price"
          badge={
            <span className="filter-badge">
              {formatPriceInr(sliderMinPrice)} - {formatPriceInr(sliderMaxPrice)}
            </span>
          }
        >
          <div className="price-overview">
            <div className="price-stat">
              <span className="price-stat-label">From</span>
              <span className="price-stat-value">
                {formatPriceInr(sliderMinPrice)}
              </span>
            </div>

            <div className="price-stat">
              <span className="price-stat-label">To</span>
              <span className="price-stat-value">
                {formatPriceInr(sliderMaxPrice)}
              </span>
            </div>
          </div>

          <div className="price-slider-shell">
            <div className="price-slider" aria-hidden="true">
              <div className="price-slider-track"></div>
              <div
                className="price-slider-progress"
                style={{
                  left: `${sliderMinPercent}%`,
                  width: `${sliderMaxPercent - sliderMinPercent}%`,
                }}
              ></div>

              <input
                type="range"
                min={catalogMinPrice}
                max={catalogMaxPrice}
                step={1}
                value={sliderMinPrice}
                className="price-range-input"
                aria-label="Minimum price"
                onChange={onMinPriceChange}
                disabled={isPriceRangeLocked}
              />

              <input
                type="range"
                min={catalogMinPrice}
                max={catalogMaxPrice}
                step={1}
                value={sliderMaxPrice}
                className="price-range-input"
                aria-label="Maximum price"
                onChange={onMaxPriceChange}
                disabled={isPriceRangeLocked}
              />
            </div>

            <div className="price-slider-labels">
              <span>{formatPriceInr(catalogMinPrice)}</span>
              <span>{formatPriceInr(catalogMaxPrice)}</span>
            </div>
          </div>
        </CatalogFilterSection>

        <CatalogFilterSection
          title="Discount"
          badge={<span className="filter-badge">Popular</span>}
        >
          <button
            type="button"
            className={`discount-toggle ${discountOnly ? "is-active" : ""}`}
            onClick={onDiscountToggle}
          >
            <span className="discount-copy">
              <span className="discount-icon">
                <AppIcon name="tags" />
              </span>

              <span>
                <span className="discount-title">10%+ off only</span>
                <span className="discount-subtitle">
                  Only show items with 10% off or more.
                </span>
              </span>
            </span>

            <span className="discount-indicator"></span>
          </button>
        </CatalogFilterSection>
      </div>
    </aside>
  );
}
