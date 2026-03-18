import AppIcon from "../icon/AppIcon";
import { CATALOG_RESULTS_HEADER } from "../../constants/constants";

type CatalogResultsHeaderProps = {
  description: string;
  heading: string;
  onReset: () => void;
  showReset: boolean;
};

export default function CatalogResultsHeader({
  description,
  heading,
  onReset,
  showReset,
}: CatalogResultsHeaderProps) {
  return (
    <div className="catalog-results-header">
      <div>
        <h2 className="catalog-results-title">{heading}</h2>
        <p className="catalog-results-copy">{description}</p>
      </div>

      {showReset ? (
        <button
          type="button"
          className="filter-reset-btn"
          onClick={onReset}
        >
          <AppIcon name="rotate-left" />
          {CATALOG_RESULTS_HEADER.RESET_FILTERS}
        </button>
      ) : null}
    </div>
  );
}
