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
    toast.success("Thanks. Your order is in.", {
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
          <p className="cart-eyebrow">Nothing here yet</p>
          <h1 className="cart-empty-title">Your cart is empty</h1>
          <p className="cart-empty-copy">
            When you add something, it will show up here.
          </p>

          <div className="cart-empty-highlights" aria-hidden="true">
            <span className="cart-empty-pill">
              <AppIcon className="cart-empty-pill-icon" name="sliders" />
              Easy filters
            </span>

            <span className="cart-empty-pill">
              <AppIcon className="cart-empty-pill-icon" name="bolt" />
              Quick browse
            </span>

            <span className="cart-empty-pill">
              <AppIcon className="cart-empty-pill-icon" name="bag-shopping" />
              Add in one click
            </span>
          </div>

          <Link className="cart-primary-link" to="/">
            <AppIcon name="arrow-left" />
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-page-header">
        <div>
          <p className="cart-eyebrow">Almost there</p>
          <h1 className="cart-page-title">Your cart</h1>
          <p className="cart-page-copy">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your bag.
          </p>
        </div>

        <button
          type="button"
          className="cart-secondary-button"
          onClick={() => dispatch(clearCart())}
        >
          <AppIcon name="trash-can" />
          Clear cart
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
                        {item.brand ?? item.category ?? "Catalog item"}
                      </span>
                      <button
                        type="button"
                        className="cart-remove-button"
                        aria-label={`Remove ${item.title} from cart`}
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        <AppIcon name="xmark" />
                      </button>
                    </div>

                    <Link className="cart-item-title" to={`/products/${item.id}`}>
                      {item.title}
                    </Link>

                    <p className="cart-item-copytext">
                      Unit price {formatPriceInr(item.price)}
                    </p>

                    <div className="cart-item-footer">
                      <div
                        className="cart-quantity-control"
                        aria-label={`Quantity controls for ${item.title}`}
                      >
                        <button
                          type="button"
                          className="cart-quantity-button"
                          aria-label={`Decrease quantity for ${item.title}`}
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
                          aria-label={`Increase quantity for ${item.title}`}
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
              <p className="cart-summary-eyebrow">Summary</p>
              <h2 className="cart-summary-title">Order totals</h2>
            </div>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <strong>{formatPriceInr(subtotal)}</strong>
              </div>

              <div className="cart-summary-row">
                <span>Shipping</span>
                <strong>{SHIPPING_COST === 0 ? "Free" : formatPriceInr(SHIPPING_COST)}</strong>
              </div>

              <div className="cart-summary-row is-total">
                <span>Total</span>
                <strong>{formatPriceInr(total)}</strong>
              </div>
            </div>

            <p className="cart-summary-note">
              Prices are in INR. Final charges will show at checkout.
            </p>

            <div className="cart-summary-actions">
              <button
                type="button"
                className="cart-primary-button"
                onClick={handlePlaceOrder}
              >
                <AppIcon name="bag-shopping" />
                Place order
              </button>

              <Link className="cart-outline-link" to="/">
                <AppIcon name="arrow-left" />
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
