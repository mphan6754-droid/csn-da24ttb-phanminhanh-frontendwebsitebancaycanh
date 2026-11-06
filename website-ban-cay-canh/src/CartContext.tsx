import { createContext, useContext } from "react";

export type CartProduct = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

type CartItem = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: CartProduct) => void;
  changeQuantity: (productId: number, amount: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart phải được dùng bên trong CartProvider.");
  }
  return cart;
}
