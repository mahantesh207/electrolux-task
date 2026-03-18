import { memo } from "react";
import type { Product } from "../../types/product.types";
import ProductCard from "../product-card/ProductCard";
import SkeletonProductCard from "../loader/SkeletonProductCard";

type CatalogProductGridProps = {
  isFetchingNextPage: boolean;
  products: Product[];
};

function CatalogProductGrid({
  isFetchingNextPage,
  products,
}: CatalogProductGridProps) {
  return (
    <div className="row g-4">
      {products.map((product) => (
        <div className="col-sm-6 col-xl-4" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}

      {isFetchingNextPage
        ? Array.from({ length: 3 }, (_, index) => (
            <SkeletonProductCard key={index} />
          ))
        : null}
    </div>
  );
}

export default memo(CatalogProductGrid);
