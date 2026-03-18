import type { Product, ProductsResponse } from "../../types/product.types";

export const productFixture: Product = {
  availabilityStatus: "In stock",
  brand: "Acme",
  category: "kitchen-accessories",
  description: "A dependable product for everyday cooking and storage.",
  discountPercentage: 18,
  id: 1,
  images: [
    "https://dummyjson.com/image/400x400/ededed/171717?text=Product+1",
    "https://dummyjson.com/image/400x400/d6f5f6/171717?text=Product+1+Alt",
  ],
  price: 1299,
  rating: 4.6,
  stock: 22,
  thumbnail: "https://dummyjson.com/image/400x400/ededed/171717?text=Product+1",
  title: "Steel Storage Jar",
};

export const secondaryProductFixture: Product = {
  availabilityStatus: "Limited stock",
  brand: "HomeLab",
  category: "cookware",
  description: "A second product used to exercise filters and list rendering.",
  discountPercentage: 6,
  id: 2,
  images: [
    "https://dummyjson.com/image/400x400/f3f3f3/171717?text=Product+2",
  ],
  price: 3499,
  rating: 4.1,
  stock: 8,
  thumbnail: "https://dummyjson.com/image/400x400/f3f3f3/171717?text=Product+2",
  title: "Ceramic Fry Pan",
};

export const productsPageFixture: ProductsResponse = {
  limit: 12,
  products: [productFixture, secondaryProductFixture],
  skip: 0,
  total: 2,
};
