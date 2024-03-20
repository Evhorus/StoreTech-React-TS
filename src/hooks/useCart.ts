import { db } from "../data/db";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import type { Product, CartItem } from "../types";
import Swal from "sweetalert2";

export const useCart = () => {
  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);
  const MIN_ITEM = 1;
  const MAX_ITEM = 5;
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item: Product) {
    const itemExistis = cart.findIndex((guitar) => guitar.id === item.id);

    if (itemExistis >= 0) {
      if (cart[itemExistis].quantity >= MAX_ITEM) return;
      const updateCart = [...cart];
      updateCart[itemExistis].quantity++;
      setCart(updateCart);
      Swal.fire("Cantidad Agregada al producto.");
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
      Swal.fire({
        title: "¡Producto agregado al carrito!",
        icon: "success",
      });
    }
  }

  function decreaseQuantity(id: Product["id"]) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEM) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  }
  function increaseQuantity(id: Product["id"]) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEM) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  }

  function removeFromCart(id: Product["id"]) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    clearCart,
    isEmpty,
    cartTotal,
  };
};
