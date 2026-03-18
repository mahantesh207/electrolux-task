import type { Product } from "./product.types";

export type CartItem = Pick<
  Product,
  "brand" | "category" | "id" | "price" | "thumbnail" | "title"
> & {
  quantity: number;
};
