import { createContext, useContext } from "react";
//kiểu dữ liệu gồm tên,mã,giá,ảnh tùy chỉnh
export type CartProduct = {
  id: number;
  name: string;
  price: number;
  image?: string;
  stock?: number;
};
//một sản phẩm trong giỏ hàng gồm thông tin cơ bản và số lượng
type CartItem = CartProduct & {
  quantity: number;
};
//định nghĩa dữ liệu các thao tác thêm,xóa,đổi số lượng hoặc làm trống
type CartContextValue = {
  items: CartItem[];
  addToCart: (product: CartProduct) => void;
  changeQuantity: (productId: number, amount: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};
//tạo nơi chia sẽ các dư liệu giỏ hàng và các hàm quản lý giỏ hàng
export const CartContext = createContext<CartContextValue | null>(null);
//tạo hook useCart để sử dụng dữ liệu giỏ hàng và các hàm quản lý giỏ hàng
export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart phải được dùng bên trong CartProvider.");
  }
  return cart;
}
