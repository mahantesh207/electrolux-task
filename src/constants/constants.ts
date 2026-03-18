export const APP_STRINGS = {
  TITLE: "Product Catalog",
  NAVBAR: {
    CART_ARIA_LABEL: (quantity: number) => `View cart with ${quantity} items`,
  },
};

export const PRODUCT_LIST_STRINGS = {
  SEARCH_PLACEHOLDER: "Search the catalog...",
  RESULTS_FOR: (count: number, query: string) =>
    `${count} ${count === 1 ? "result" : "results"} for "${query}"`,
  READY_TO_BROWSE: (count: number) =>
    `${count} ${count === 1 ? "product" : "products"} ready to browse`,
  MATCHES_FOUND: (total: number) => `${total} matches found for your search`,
  USE_FILTERS: "Use the filters to filter products further.",
  EMPTY_SEARCH_TITLE: "No products found",
  EMPTY_SEARCH_DESC: "Try another search or clear your filters.",
  EMPTY_DEFAULT_TITLE: "No products available",
  EMPTY_DEFAULT_DESC: "Nothing to show right now. Check back soon.",
  LOADING_ERROR: "Error loading products",
};

export const CATALOG_SIDEBAR_STRINGS = {
  REFINE_CATALOG: "Refine catalog",
  FILTER: "Filter",
  ADVANCED: "Advanced",
  SEARCH_TITLE: "Search",
  LIVE_BADGE: "Live",
  SEARCH_HELPER_UPDATING: "Looking for matches...",
  SEARCH_HELPER_DEFAULT: "Results update while you type.",
  PRICE_TITLE: "Price",
  PRICE_FROM: "From",
  PRICE_TO: "To",
  PRICE_ARIA_MIN: "Minimum price",
  PRICE_ARIA_MAX: "Maximum price",
  DISCOUNT_TITLE: "Discount",
  POPULAR_BADGE: "Popular",
  DISCOUNT_OFF_TITLE: "10%+ off only",
  DISCOUNT_OFF_SUBTITLE: "Only show items with 10% off or more.",
};

export const CATALOG_RESULTS_HEADER = {
  RESET_FILTERS: "Reset filters",
};

export const PRODUCT_CARD_STRINGS = {
  OFF: "OFF",
  CURATED_PICK: "Curated pick",
  ADD_TO_CART: "Add to Cart",
  ADDED_TO_CART_TOAST: (title: string) => `${title} added to cart`,
};

export const PRODUCT_DETAIL_STRINGS = {
  PRODUCT_NOT_FOUND: "Product not found",
  MISSING_ID: "The requested product id is missing.",
  BACK_TO_CATALOG: "Back to catalog",
  UNABLE_TO_LOAD: "Unable to load product",
  LOAD_ERROR_DESC: "We couldn't load this product right now.",
  ZOOM_HINT: "Move to inspect",
  HOVER_HINT: "Hover to zoom",
  RATING: "rating",
  IN_STOCK: "in stock",
  FEATURED_PRODUCT: "Featured Product",
  SAVE: "Save",
  CATEGORY: "Category",
  AVAILABILITY: "Availability",
  UNITS: "units",
  ADD_TO_CART: "Add to cart",
  CONTINUE_SHOPPING: "Continue shopping",
  ABOUT_PRODUCT: "About this product",
};

export const CART_STRINGS = {
  ORDER_PLACED_TOAST: "Thanks. Your order is in.",
  EMPTY_EYEBROW: "Nothing here yet",
  EMPTY_TITLE: "Your cart is empty",
  EMPTY_COPY: "When you add something, it will show up here.",
  HIGHLIGHT_FILTERS: "Easy filters",
  HIGHLIGHT_BROWSE: "Quick browse",
  HIGHLIGHT_ADD: "Add in one click",
  BROWSE_PRODUCTS: "Browse products",
  ALMOST_THERE: "Almost there",
  YOUR_CART: "Your cart",
  ITEMS_IN_BAG: (count: number) => `${count} ${count === 1 ? "item" : "items"} in your bag.`,
  CLEAR_CART: "Clear cart",
  CATALOG_ITEM: "Catalog item",
  UNIT_PRICE: "Unit price",
  SUMMARY_EYEBROW: "Summary",
  ORDER_TOTALS: "Order totals",
  SUBTOTAL: "Subtotal",
  SHIPPING: "Shipping",
  FREE: "Free",
  TOTAL: "Total",
  NOTE: "Prices are in INR. Final charges will show at checkout.",
  PLACE_ORDER: "Place order",
  CONTINUE_SHOPPING: "Continue shopping",
  REMOVE_ARIA: (title: string) => `Remove ${title} from cart`,
  DEC_ARIA: (title: string) => `Decrease quantity for ${title}`,
  INC_ARIA: (title: string) => `Increase quantity for ${title}`,
  QUANTITY_CONTROLS_ARIA: (title: string) => `Quantity controls for ${title}`,
};
