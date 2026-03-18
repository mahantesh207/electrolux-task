import type { ChangeEvent } from "react";
import AppIcon from "../icon/AppIcon";
import CatalogFilterSection from "./CatalogFilterSection";
import { formatPriceInr } from "../../utils/currency";
import { CATALOG_SIDEBAR_STRINGS, PRODUCT_LIST_STRINGS } from "../../constants/constants";

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
            <span className="filter-eyebrow">{CATALOG_SIDEBAR_STRINGS.REFINE_CATALOG}</span>
            <h3 className="filter-title">{CATALOG_SIDEBAR_STRINGS.FILTER}</h3>
          </div>

          <span className="filter-advanced">{CATALOG_SIDEBAR_STRINGS.ADVANCED}</span>
        </div>

        <CatalogFilterSection
          title={CATALOG_SIDEBAR_STRINGS.SEARCH_TITLE}
          badge={
            isSearchUpdating ? (
              <span className="filter-badge">{CATALOG_SIDEBAR_STRINGS.LIVE_BADGE}</span>
            ) : undefined
          }
        >
          <div className="filter-input-wrap">
            <AppIcon className="filter-input-icon" name="magnifying-glass" />

            <input
              type="search"
              className="filter-input"
              placeholder={PRODUCT_LIST_STRINGS.SEARCH_PLACEHOLDER}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <p className="filter-helper">
            {isSearchUpdating
              ? CATALOG_SIDEBAR_STRINGS.SEARCH_HELPER_UPDATING
              : CATALOG_SIDEBAR_STRINGS.SEARCH_HELPER_DEFAULT}
          </p>
        </CatalogFilterSection>

        <CatalogFilterSection
          title={CATALOG_SIDEBAR_STRINGS.PRICE_TITLE}
          badge={
            <span className="filter-badge">
              {formatPriceInr(sliderMinPrice)} - {formatPriceInr(sliderMaxPrice)}
            </span>
          }
        >
          <div className="price-overview">
            <div className="price-stat">
              <span className="price-stat-label">{CATALOG_SIDEBAR_STRINGS.PRICE_FROM}</span>
              <span className="price-stat-value">
                {formatPriceInr(sliderMinPrice)}
              </span>
            </div>

            <div className="price-stat">
              <span className="price-stat-label">{CATALOG_SIDEBAR_STRINGS.PRICE_TO}</span>
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
                aria-label={CATALOG_SIDEBAR_STRINGS.PRICE_ARIA_MIN}
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
                aria-label={CATALOG_SIDEBAR_STRINGS.PRICE_ARIA_MAX}
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
          title={CATALOG_SIDEBAR_STRINGS.DISCOUNT_TITLE}
          badge={<span className="filter-badge">{CATALOG_SIDEBAR_STRINGS.POPULAR_BADGE}</span>}
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
                <span className="discount-title">{CATALOG_SIDEBAR_STRINGS.DISCOUNT_OFF_TITLE}</span>
                <span className="discount-subtitle">
                  {CATALOG_SIDEBAR_STRINGS.DISCOUNT_OFF_SUBTITLE}
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
