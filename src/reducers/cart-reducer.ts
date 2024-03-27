import Swal from "sweetalert2";
import { db } from "../data/db";
import { CartItem, Product } from "../types";

const MIN_ITEM = 1;
const MAX_ITEM = 5;

export type CartActions =
  | { type: "add-to-cart"; payload: { item: Product } }
  | { type: "decrease-quantity"; payload: { id: Product["id"] } }
  | { type: "increase-quantity"; payload: { id: Product["id"] } }
  | { type: "remove-from-cart"; payload: { id: Product["id"] } }
  | { type: "clear-cart" };

export type CartState = {
  data: Product[];
  cart: CartItem[];
};

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  if (action.type === "add-to-cart") {
    const itemExistis = state.cart.find(
      (product) => product.id === action.payload.item.id
    );
    let updateCart: CartItem[] = [];

    if (itemExistis) {
      updateCart = state.cart.map((item) => {
        if (item.id === action.payload.item.id) {
          if (item.quantity < MAX_ITEM) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        } else {
          return item;
        }
      });
      Swal.fire("Cantidad Agregada al producto.");
    } else {
      const newItem: CartItem = { ...action.payload.item, quantity: 1 };
      updateCart = [...state.cart, newItem];
      Swal.fire({
        title: "¡Producto agregado al carrito!",
        icon: "success",
      });
    }
    return {
      ...state,
      cart: updateCart,
    };
  }
  if (action.type === "decrease-quantity") {
    const updateCart = state.cart.map((item) => {
      if (item.id === action.payload.id && item.quantity > MIN_ITEM) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    return { ...state, cart: updateCart };
  }
  if (action.type === "increase-quantity") {
    const updateCart = state.cart.map((item) => {
      if (item.id === action.payload.id && item.quantity < MAX_ITEM) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    return {
      ...state,
      cart: updateCart,
    };
  }
  if (action.type === "remove-from-cart") {
    const updateCart = state.cart.filter(
      (product) => product.id !== action.payload.id
    );

    return {
      ...state,
      cart: updateCart,
    };
  }
  if (action.type === "clear-cart") {
    return {
      ...state,
      cart: [],
    };
  }

  return state;
};
