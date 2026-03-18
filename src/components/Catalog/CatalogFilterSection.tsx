import { memo } from "react";
import type { PropsWithChildren, ReactNode } from "react";

type CatalogFilterSectionProps = PropsWithChildren<{
  badge?: ReactNode;
  title: string;
}>;

function CatalogFilterSection({
  badge,
  children,
  title,
}: CatalogFilterSectionProps) {
  return (
    <section className="filter-section">
      <div className="filter-section-head">
        <h5>{title}</h5>
        {badge}
      </div>

      {children}
    </section>
  );
}

export default memo(CatalogFilterSection);
