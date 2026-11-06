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
        className="relative rounded-full border border-[#d7dbd0] bg-transparent px-4 py-2 text-sm font-medium text-[#314c39] transition hover:border-[#9ca994] hover:bg-[#edf0e8]"
      >
        Giỏ hàng
        <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#314c39] px-1.5 py-0.5 text-[11px] text-white">
          {itemCount}
        </span>
      </button>

      {isOpen && (
        <section
          id="cart-panel"
          aria-label="Giỏ hàng"
          className="absolute right-0 top-full z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-[#e7e5dc] bg-[#fffefa] p-5 text-[#27352c] shadow-[0_16px_50px_rgba(39,53,44,0.14)]"
        >
          <h2 className="mb-4 font-serif text-2xl text-[#314c39]">
            Giỏ hàng của bạn
          </h2>

          {items.length === 0 ? (
            <div className="rounded-xl bg-[#f0f1e9] px-4 py-8 text-center">
              <p className="text-3xl" aria-hidden="true">
                🪴
              </p>
              <p className="mt-2 font-medium text-gray-700">
                Giỏ hàng đang trống
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Hãy thêm sản phẩm bạn yêu thích vào giỏ hàng nhé.
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
                      <p className="mt-1 text-sm text-[#526a51]">
                        {formatPrice(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, -1)}
                          aria-label={`Giảm số lượng ${item.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d7dbd0] hover:bg-[#edf0e8]"
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
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d7dbd0] hover:bg-[#edf0e8]"
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
                        className="mt-2 text-sm text-[#9a564b] hover:text-[#723b33]"
                      >
                        Xóa
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-[#e7e5dc] pt-4">
                <span className="font-semibold">Tổng tiền</span>
                <span className="text-lg font-semibold text-[#314c39]">
                  {formatPrice(total)}
                </span>
              </div>
              <a
                href="/thanh-toan"
                className="mt-4 block w-full rounded-full bg-[#314c39] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#243c2c]"
              >
                Thanh toán
              </a>
            </>
          )}
        </section>
      )}
    </div>
  );
}
