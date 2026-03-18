import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AppIcon from "../components/icon/AppIcon";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  selectCartItems,
  selectCartSubtotal,
  selectCartTotalQuantity,
} from "../store/cart/cartSlice";
import { formatPriceInr } from "../utils/currency";
import { CART_STRINGS } from "../constants/constants";
import "./CartPage.css";

const SHIPPING_COST = 0;

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const total = subtotal + SHIPPING_COST;

  const handlePlaceOrder = () => {
    dispatch(clearCart());
    toast.success(CART_STRINGS.ORDER_PLACED_TOAST, {
      toastId: "order-placed",
    });
  };

  if (!items.length) {
    return (
      <section className="cart-page">
        <div className="cart-empty-state">
          <span className="cart-empty-icon">
            <AppIcon name="basket-shopping" />
          </span>
          <p className="cart-eyebrow">{CART_STRINGS.EMPTY_EYEBROW}</p>
          <h1 className="cart-empty-title">{CART_STRINGS.EMPTY_TITLE}</h1>
          <p className="cart-empty-copy">
            {CART_STRINGS.EMPTY_COPY}
          </p>

          <div className="cart-empty-highlights" aria-hidden="true">
            <span className="cart-empty-pill">
              <AppIcon className="cart-empty-pill-icon" name="sliders" />
              {CART_STRINGS.HIGHLIGHT_FILTERS}
            </span>

            <span className="cart-empty-pill">
              <AppIcon className="cart-empty-pill-icon" name="bolt" />
              {CART_STRINGS.HIGHLIGHT_BROWSE}
            </span>

            <span className="cart-empty-pill">
              <AppIcon className="cart-empty-pill-icon" name="bag-shopping" />
              {CART_STRINGS.HIGHLIGHT_ADD}
            </span>
          </div>

          <Link className="cart-primary-link" to="/">
            <AppIcon name="arrow-left" />
            {CART_STRINGS.BROWSE_PRODUCTS}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-page-header">
        <div>
          <p className="cart-eyebrow">{CART_STRINGS.ALMOST_THERE}</p>
          <h1 className="cart-page-title">{CART_STRINGS.YOUR_CART}</h1>
          <p className="cart-page-copy">
            {CART_STRINGS.ITEMS_IN_BAG(totalQuantity)}
          </p>
        </div>

        <button
          type="button"
          className="cart-secondary-button"
          onClick={() => dispatch(clearCart())}
        >
          <AppIcon name="trash-can" />
          {CART_STRINGS.CLEAR_CART}
        </button>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-xl-8">
          <div className="cart-items-panel">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;

              return (
                <article className="cart-item-card" key={item.id}>
                  <Link
                    className="cart-item-image-wrap"
                    to={`/products/${item.id}`}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="cart-item-image"
                      loading="lazy"
                    />
                  </Link>

                  <div className="cart-item-copy">
                    <div className="cart-item-meta">
                      <span className="cart-item-chip">
                        {item.brand ?? item.category ?? CART_STRINGS.CATALOG_ITEM}
                      </span>
                      <button
                        type="button"
                        className="cart-remove-button"
                        aria-label={CART_STRINGS.REMOVE_ARIA(item.title)}
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        <AppIcon name="xmark" />
                      </button>
                    </div>

                    <Link className="cart-item-title" to={`/products/${item.id}`}>
                      {item.title}
                    </Link>

                    <p className="cart-item-copytext">
                      {CART_STRINGS.UNIT_PRICE} {formatPriceInr(item.price)}
                    </p>

                    <div className="cart-item-footer">
                      <div
                        className="cart-quantity-control"
                        aria-label={CART_STRINGS.QUANTITY_CONTROLS_ARIA(item.title)}
                      >
                        <button
                          type="button"
                          className="cart-quantity-button"
                          aria-label={CART_STRINGS.DEC_ARIA(item.title)}
                          onClick={() => dispatch(decrementQuantity(item.id))}
                        >
                          <AppIcon name="minus" />
                        </button>

                        <span className="cart-quantity-value">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className="cart-quantity-button"
                          aria-label={CART_STRINGS.INC_ARIA(item.title)}
                          onClick={() => dispatch(incrementQuantity(item.id))}
                        >
                          <AppIcon name="plus" />
                        </button>
                      </div>

                      <strong className="cart-item-total">
                        {formatPriceInr(itemTotal)}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <aside className="cart-summary-card">
            <div className="cart-summary-head">
              <p className="cart-summary-eyebrow">{CART_STRINGS.SUMMARY_EYEBROW}</p>
              <h2 className="cart-summary-title">{CART_STRINGS.ORDER_TOTALS}</h2>
            </div>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>{CART_STRINGS.SUBTOTAL}</span>
                <strong>{formatPriceInr(subtotal)}</strong>
              </div>

              <div className="cart-summary-row">
                <span>{CART_STRINGS.SHIPPING}</span>
                <strong>{SHIPPING_COST === 0 ? CART_STRINGS.FREE : formatPriceInr(SHIPPING_COST)}</strong>
              </div>

              <div className="cart-summary-row is-total">
                <span>{CART_STRINGS.TOTAL}</span>
                <strong>{formatPriceInr(total)}</strong>
              </div>
            </div>

            <p className="cart-summary-note">
              {CART_STRINGS.NOTE}
            </p>

            <div className="cart-summary-actions">
              <button
                type="button"
                className="cart-primary-button"
                onClick={handlePlaceOrder}
              >
                <AppIcon name="bag-shopping" />
                {CART_STRINGS.PLACE_ORDER}
              </button>

              <Link className="cart-outline-link" to="/">
                <AppIcon name="arrow-left" />
                {CART_STRINGS.CONTINUE_SHOPPING}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
