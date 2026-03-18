import { memo, useState } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AppIcon from "../icon/AppIcon";
import type { Product } from "../../types/product.types";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/cart/cartSlice";
import { formatPriceInr } from "../../utils/currency";
import { buildCartItem } from "../../utils/cart";
import { PRODUCT_CARD_STRINGS } from "../../constants/constants";
import "./ProductCard.css";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);

  const originalPrice = product.price / (1 - product.discountPercentage / 100);

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(addToCart(buildCartItem(product)));
    toast.success(PRODUCT_CARD_STRINGS.ADDED_TO_CART_TOAST(product.title), {
      toastId: `cart-${product.id}`,
    });
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card-link">
      <article className="card h-100 product-card">
        <div className="product-image">
          <span className="badge bg-danger product-card-badge">
            {Math.round(product.discountPercentage)}% {PRODUCT_CARD_STRINGS.OFF}
          </span>

          {!imageLoaded && (
            <div className="placeholder w-100 h-100 product-card-placeholder"></div>
          )}

          <img
            src={product.thumbnail}
            alt={product.title}
            className={`product-card-image ${imageLoaded ? "is-loaded" : ""}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="card-body d-flex flex-column">
          <div className="product-card-meta">
            <p className="product-card-category">{product.category}</p>

            {product.rating ? (
              <span className="product-card-rating">
                <AppIcon className="product-card-rating-icon" name="star" />
                {product.rating.toFixed(1)}
              </span>
            ) : null}
          </div>

          <h5 className="card-title product-card-title">{product.title}</h5>

          <p className="product-card-brand">
            {product.brand ?? PRODUCT_CARD_STRINGS.CURATED_PICK}
          </p>

          <div className="product-card-price">
            <span className="product-card-price-original">
              {formatPriceInr(originalPrice)}
            </span>

            <span className="product-card-price-current">
              {formatPriceInr(product.price)}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-success btn-sm mt-auto product-card-button"
            onClick={handleAddToCart}
          >
            <AppIcon name="cart-plus" /> {PRODUCT_CARD_STRINGS.ADD_TO_CART}
          </button>
        </div>
      </article>
    </Link>
  );
}

export default memo(ProductCard);
