import type { CartItem } from "../types/cart.types";
import type { Product } from "../types/product.types";

export const buildCartItem = (product: Product): CartItem => ({
  brand: product.brand,
  category: product.category,
  id: product.id,
  title: product.title,
  price: product.price,
  thumbnail: product.thumbnail,
  quantity: 1,
});
