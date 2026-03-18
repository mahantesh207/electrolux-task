import { Link } from "react-router-dom";
import AppIcon from "../icon/AppIcon";
import { useAppSelector } from "../../store/hooks";
import { selectCartTotalQuantity } from "../../store/cart/cartSlice";

export default function Navbar() {
  const totalQuantity = useAppSelector(selectCartTotalQuantity);

  return (
    <nav className="app-navbar navbar navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        Product Catalog
      </Link>

      <Link
        className="app-cart-link position-relative text-white"
        to="/cart"
        aria-label={`View cart with ${totalQuantity} items`}
      >
        <AppIcon name="cart-shopping" size="lg" />

        <span className="app-cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {totalQuantity}
        </span>
      </Link>
    </nav>
  );
}
