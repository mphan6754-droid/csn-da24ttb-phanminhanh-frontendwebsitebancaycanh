import { useEffect, useState, type ReactNode } from "react";
import { CartContext, type CartProduct } from "./CartContext";

type CartItem = CartProduct & {
  quantity: number;
};

const STORAGE_KEY = "green-garden-cart";

function loadCart(): CartItem[] {
  const savedCart = localStorage.getItem(STORAGE_KEY);
  if (!savedCart) return [];

  try {
    const parsed: unknown = JSON.parse(savedCart);
    if (!Array.isArray(parsed)) {
      throw new Error("Dữ liệu giỏ hàng không đúng định dạng.");
    }

    return parsed.filter(
      (item): item is CartItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );
  } catch (error) {
    console.error("Không thể đọc dữ liệu giỏ hàng đã lưu:", error);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Không thể lưu giỏ hàng trên trình duyệt:", error);
    }
  }, [items]);

  const addToCart = (product: CartProduct) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (productId: number, amount: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, changeQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
