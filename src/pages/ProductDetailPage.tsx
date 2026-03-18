import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AppIcon from "../components/icon/AppIcon";
import { useProduct } from "../hooks";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cart/cartSlice";
import { formatPriceInr } from "../utils/currency";
import { buildCartItem } from "../utils/cart";
import { PRODUCT_DETAIL_STRINGS, PRODUCT_CARD_STRINGS } from "../constants/constants";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const { data: product, isLoading, error } = useProduct(productId ?? "");
  const [selectedImage, setSelectedImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({
    x: 50,
    y: 50,
  });

  const galleryImages = product?.images?.length
    ? product.images
    : product?.thumbnail
      ? [product.thumbnail]
      : [];
  const originalPrice = product
    ? product.price / (1 - product.discountPercentage / 100)
    : 0;

  useEffect(() => {
    if (galleryImages.length) {
      setSelectedImage(galleryImages[0]);
    }
  }, [galleryImages]);

  useEffect(() => {
    setIsZoomed(false);
    setZoomOrigin({
      x: 50,
      y: 50,
    });
  }, [selectedImage]);

  if (!productId) {
    return (
      <div className="product-detail-page container mt-4">
        <div className="detail-empty-state">
          <h2 className="h4 mb-2">{PRODUCT_DETAIL_STRINGS.PRODUCT_NOT_FOUND}</h2>
          <p className="text-muted mb-3">
            {PRODUCT_DETAIL_STRINGS.MISSING_ID}
          </p>
          <Link className="detail-secondary-link" to="/">
            <AppIcon name="arrow-left" />
            {PRODUCT_DETAIL_STRINGS.BACK_TO_CATALOG}
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="product-detail-page container mt-4">
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="detail-media-card">
              <div className="placeholder w-100 rounded-4" style={{ height: "420px" }}></div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="detail-summary-card">
              <div className="placeholder-glow">
                <span className="placeholder col-4 mb-3"></span>
                <span className="placeholder col-9 mb-3"></span>
                <span className="placeholder col-7 mb-3"></span>
                <span className="placeholder col-5 mb-4"></span>
                <span className="placeholder col-10 mb-2"></span>
                <span className="placeholder col-8 mb-4"></span>
                <span className="placeholder col-6"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page container mt-4">
        <div className="detail-empty-state">
          <h2 className="h4 mb-2">{PRODUCT_DETAIL_STRINGS.UNABLE_TO_LOAD}</h2>
          <p className="text-muted mb-3">
            {PRODUCT_DETAIL_STRINGS.LOAD_ERROR_DESC}
          </p>
          <Link className="detail-secondary-link" to="/">
            <AppIcon name="arrow-left" />
            {PRODUCT_DETAIL_STRINGS.BACK_TO_CATALOG}
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart(buildCartItem(product)));
    toast.success(PRODUCT_CARD_STRINGS.ADDED_TO_CART_TOAST(product.title), {
      toastId: `cart-${product.id}`,
    });
  };

  const handleHeroImageMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      setZoomOrigin({
        x: 50,
        y: 50,
      });
      return;
    }

    const nextX = ((event.clientX - rect.left) / rect.width) * 100;
    const nextY = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomOrigin({
      x: Math.min(Math.max(nextX, 0), 100),
      y: Math.min(Math.max(nextY, 0), 100),
    });
  };

  return (
    <div className="product-detail-page container mt-4">
      <Link className="detail-back-link" to="/">
        <AppIcon name="arrow-left" />
        Back to catalog
      </Link>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-6">
          <div className="detail-media-card">
            <div
              className="detail-hero-image"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleHeroImageMove}
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className={`detail-hero-media ${isZoomed ? "is-zoomed" : ""}`}
                    style={{
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }}
                  />
                  <span className="detail-zoom-hint">
                    <AppIcon name="magnifying-glass" />
                    {isZoomed ? PRODUCT_DETAIL_STRINGS.ZOOM_HINT : PRODUCT_DETAIL_STRINGS.HOVER_HINT}
                  </span>
                </>
              ) : (
                <div className="placeholder w-100 h-100 rounded-4"></div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="detail-gallery">
                {galleryImages.map((image) => (
                  <button
                    key={image}
                    type="button"
                    className={`detail-thumb ${
                      selectedImage === image ? "is-active" : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} alt={product.title} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="detail-summary-card">
            <div className="detail-badges">
              <span className="detail-pill">
                <AppIcon name="layer-group" />
                {product.category}
              </span>

              {product.rating !== undefined && (
                <span className="detail-pill">
                  <AppIcon name="star" />
                  {product.rating.toFixed(1)} {PRODUCT_DETAIL_STRINGS.RATING}
                </span>
              )}

              {(product.availabilityStatus || product.stock !== undefined) && (
                <span className="detail-pill">
                  <AppIcon name="box-open" />
                  {product.availabilityStatus ?? `${product.stock} ${PRODUCT_DETAIL_STRINGS.IN_STOCK}`}
                </span>
              )}
            </div>

            <p className="detail-category">
              {product.brand ?? PRODUCT_DETAIL_STRINGS.FEATURED_PRODUCT}
            </p>

            <h1 className="detail-title">{product.title}</h1>
            <p className="detail-copy">{product.description}</p>

            <div className="detail-price-row">
              <span className="detail-price-current">
                {formatPriceInr(product.price)}
              </span>
              <span className="detail-price-original">
                {formatPriceInr(originalPrice)}
              </span>
              <span className="detail-price-discount">
                {PRODUCT_DETAIL_STRINGS.SAVE} {Math.round(product.discountPercentage)}%
              </span>
            </div>

            <div className="detail-meta-grid">
              <div className="detail-meta-card">
                <span className="detail-meta-label">{PRODUCT_DETAIL_STRINGS.CATEGORY}</span>
                <span className="detail-meta-value">{product.category}</span>
              </div>

              <div className="detail-meta-card">
                <span className="detail-meta-label">{PRODUCT_DETAIL_STRINGS.AVAILABILITY}</span>
                <span className="detail-meta-value">
                  {product.availabilityStatus ?? `${product.stock ?? 0} ${PRODUCT_DETAIL_STRINGS.UNITS}`}
                </span>
              </div>
            </div>

            <div className="detail-action-row">
              <button
                type="button"
                className="btn btn-success detail-primary-button"
                onClick={handleAddToCart}
              >
                <AppIcon name="cart-plus" />
                {PRODUCT_DETAIL_STRINGS.ADD_TO_CART}
              </button>

              <Link className="detail-secondary-link" to="/">
                <AppIcon name="store" />
                {PRODUCT_DETAIL_STRINGS.CONTINUE_SHOPPING}
              </Link>
            </div>
          </div>

          <div className="detail-description-card">
            <h2 className="detail-section-title">{PRODUCT_DETAIL_STRINGS.ABOUT_PRODUCT}</h2>
            <p className="detail-copy mb-0">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
