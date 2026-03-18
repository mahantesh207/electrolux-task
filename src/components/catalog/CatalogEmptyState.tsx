type CatalogEmptyStateProps = {
  description: string;
  title: string;
};

export default function CatalogEmptyState({
  description,
  title,
}: CatalogEmptyStateProps) {
  return (
    <div className="catalog-empty-state">
      <h5 className="mb-2">{title}</h5>
      <p className="text-muted mb-3">{description}</p>
    </div>
  );
}
