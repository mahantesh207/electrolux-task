import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { CartItem } from "../../types/cart.types";

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

type CartMetrics = {
  subtotal: number;
  totalQuantity: number;
};

const findCartItem = (items: CartItem[], productId: number) =>
  items.find((item) => item.id === productId);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = findCartItem(state.items, action.payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = findCartItem(state.items, action.payload);

      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = findCartItem(state.items, action.payload);

      if (!item) {
        return;
      }

      if (item.quantity === 1) {
        state.items = state.items.filter(
          (currentItem) => currentItem.id !== action.payload,
        );
        return;
      }

      item.quantity -= 1;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload,
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} = cartSlice.actions;

const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector([selectCartState], (cart) => cart.items);

const selectCartMetrics = createSelector([selectCartItems], (items): CartMetrics => {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const item of items) {
    subtotal += item.price * item.quantity;
    totalQuantity += item.quantity;
  }

  return {
    subtotal,
    totalQuantity,
  };
});

export const selectCartSubtotal = createSelector(
  [selectCartMetrics],
  ({ subtotal }) => subtotal,
);

export const selectCartTotalQuantity = createSelector(
  [selectCartMetrics],
  ({ totalQuantity }) => totalQuantity,
);

export default cartSlice.reducer;
