import { useState } from "react";
import { useCart } from "./CartContext";

export function CartMenu() {
  const { items, changeQuantity, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce(
    (amount, item) => amount + item.price * item.quantity,
    0
  );
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="cart-panel"
        className="relative rounded-lg border border-green-200 bg-white px-4 py-2 font-semibold text-green-800 hover:bg-green-50"
      >
        Giỏ hàng
        <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-green-700 px-1.5 py-0.5 text-xs text-white">
          {itemCount}
        </span>
      </button>

      {isOpen && (
        <section
          id="cart-panel"
          aria-label="Giỏ hàng"
          className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-green-100 bg-white p-5 text-gray-800 shadow-xl"
        >
          <h2 className="mb-4 text-xl font-bold text-green-900">
            Giỏ hàng của bạn
          </h2>

          {items.length === 0 ? (
            <div className="rounded-xl bg-green-50 px-4 py-8 text-center">
              <p className="text-3xl" aria-hidden="true">
                🪴
              </p>
              <p className="mt-2 font-medium text-gray-700">
                Giỏ hàng đang trống
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Hãy thêm sản phẩm bạn thích vào giỏ hàng nhé.
              </p>
            </div>
          ) : (
            <>
              <ul className="max-h-72 space-y-4 overflow-y-auto">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{item.name}</h3>
                      <p className="mt-1 text-sm text-green-800">
                        {formatPrice(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, -1)}
                          aria-label={`Giảm số lượng ${item.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span
                          aria-label={`Số lượng ${item.quantity}`}
                          className="min-w-5 text-center text-sm"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label={`Tăng số lượng ${item.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="whitespace-nowrap text-sm font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="font-semibold">Thanh toán</span>
                <span className="text-lg font-bold text-green-800">
                  {formatPrice(total)}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-gray-500">
                Giỏ hàng còn trong giai đoạn phát triển.
              </p>
            </>
          )}
        </section>
      )}
    </div>
  );
}
