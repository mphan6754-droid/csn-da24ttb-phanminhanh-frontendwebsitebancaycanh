import { useEffect, useState, type ReactNode } from "react";
import { CartContext, type CartProduct } from "./CartContext";
// Định nghĩa kiểu dữ liệu cho một sản phẩm trong giỏ hàng, bao gồm thông tin cơ bản và số lượng
type CartItem = CartProduct & {
  quantity: number;
};
// Khởi tạo key để lưu trữ giỏ hàng trong localStorage
const STORAGE_KEY = "green-garden-cart";
// Hàm loadCart để tải giỏ hàng từ localStorage
function loadCart(): CartItem[] {
  const savedCart = localStorage.getItem(STORAGE_KEY);
  if (!savedCart) return [];
// Nếu không có dữ liệu giỏ hàng trong localStorage, trả về mảng rỗng
  try {
    const parsed: unknown = JSON.parse(savedCart);
    if (!Array.isArray(parsed)) {
      throw new Error("Dữ liệu giỏ hàng không đúng định dạng.");
    }
// Lọc các phần tử không hợp lệ và chỉ giữ lại các phần tử hợp lệ
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

export function QuanLyGioHang({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Không thể lưu giỏ hàng trên trình duyệt:", error);
    }
  }, [items]);

  const addToCart = (product: CartProduct) => {
    // Cập nhật giỏ hàng: nếu sản phẩm đã có trong giỏ, tăng số lượng; nếu chưa, thêm sản phẩm mới với số lượng 1
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (
        product.stock !== undefined &&
        (product.stock <= 0 || (existingItem?.quantity ?? 0) >= product.stock)
      ) {
        return currentItems;
      }

      // Nếu sản phẩm đã có trong giỏ, tăng số lượng
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                ...product,
                quantity: Math.min(
                  item.quantity + 1,
                  product.stock ?? item.stock ?? Number.MAX_SAFE_INTEGER
                ),
              }
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
            ? {
                ...item,
                quantity:
                  item.stock === undefined
                    ? item.quantity + amount
                    : Math.min(item.stock, item.quantity + amount),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
// Xóa sản phẩm khỏi giỏ hàng dựa trên productId
  const removeFromCart = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => setItems([]);
// Cung cấp dữ liệu giỏ hàng và các hàm quản lý giỏ hàng thông qua context
  return (
    //cung cấp dữ liệu các hàm giỏ hàng nhờ vậy có thể dùng useCart
    <CartContext.Provider
      value={{ items, addToCart, changeQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
