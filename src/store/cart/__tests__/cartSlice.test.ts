import reducer, {
  addToCart,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  selectCartItems,
  removeFromCart,
  selectCartSubtotal,
  selectCartTotalQuantity,
} from "../cartSlice";
import { productFixture } from "../../../test/fixtures/products";
import { buildCartItem } from "../../../utils/cart";

describe("cartSlice", () => {
  it("adds a new product with quantity 1", () => {
    const nextState = reducer(undefined, addToCart(buildCartItem(productFixture)));

    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toMatchObject({
      id: productFixture.id,
      quantity: 1,
      title: productFixture.title,
    });
  });

  it("increments quantity when the same product is added again", () => {
    const initialState = reducer(undefined, addToCart(buildCartItem(productFixture)));
    const nextState = reducer(initialState, addToCart(buildCartItem(productFixture)));

    expect(nextState.items[0]?.quantity).toBe(2);
  });

  it("increments and decrements quantity for existing items", () => {
    const initialState = reducer(undefined, addToCart(buildCartItem(productFixture)));
    const incrementedState = reducer(
      initialState,
      incrementQuantity(productFixture.id),
    );
    const decrementedState = reducer(
      incrementedState,
      decrementQuantity(productFixture.id),
    );

    expect(incrementedState.items[0]?.quantity).toBe(2);
    expect(decrementedState.items[0]?.quantity).toBe(1);
  });

  it("removes items when quantity is decremented from one or removed directly", () => {
    const initialState = reducer(undefined, addToCart(buildCartItem(productFixture)));
    const decrementedState = reducer(
      initialState,
      decrementQuantity(productFixture.id),
    );
    const seededState = reducer(undefined, addToCart(buildCartItem(productFixture)));
    const removedState = reducer(seededState, removeFromCart(productFixture.id));

    expect(decrementedState.items).toHaveLength(0);
    expect(removedState.items).toHaveLength(0);
  });

  it("does not change state when incrementing or decrementing an unknown item", () => {
    const initialState = reducer(undefined, addToCart(buildCartItem(productFixture)));

    const incrementedState = reducer(initialState, incrementQuantity(9999));
    const decrementedState = reducer(initialState, decrementQuantity(9999));
    const removedState = reducer(initialState, removeFromCart(9999));

    expect(incrementedState).toEqual(initialState);
    expect(decrementedState).toEqual(initialState);
    expect(removedState).toEqual(initialState);
  });

  it("clears the cart and selects the subtotal", () => {
    const initialState = {
      cart: {
        items: [{ ...buildCartItem(productFixture), quantity: 2 }],
      },
    };
    const nextState = reducer(initialState.cart, clearCart());

    expect(selectCartSubtotal(initialState)).toBe(productFixture.price * 2);
    expect(nextState.items).toHaveLength(0);
  });

  it("selects the total quantity across cart items", () => {
    const state = {
      cart: {
        items: [
          { ...buildCartItem(productFixture), quantity: 2 },
          { ...buildCartItem(productFixture), id: 999, quantity: 3 },
        ],
      },
    };

    expect(selectCartTotalQuantity(state)).toBe(5);
  });

  it("selects the cart items with the existing item references", () => {
    const state = {
      cart: {
        items: [
          { ...buildCartItem(productFixture), quantity: 2 },
          { ...buildCartItem(productFixture), id: 999, quantity: 3 },
        ],
      },
    };

    expect(selectCartItems(state)).toBe(state.cart.items);
  });
});
