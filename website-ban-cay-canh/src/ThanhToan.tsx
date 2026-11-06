import { useState, type SubmitEvent } from "react";
import AccountMenu from "./Dangnhap/Dangky";
import { useCart } from "./CartContext";
import { CartMenu } from "./GioHang";
import { saveOrder, type Order } from "./DlieuDonhangStorage";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default function ThanhToan() {
  const { items, clearCart } = useCart();
  const [savedOrder, setSavedOrder] = useState<Order | null>(null);
  const [submitError, setSubmitError] = useState("");
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 20000;
  const total = subtotal + shipping;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) return;
    const formData = new FormData(event.currentTarget);
    const order: Order = {
      code: `GG${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
      recipient: {
        name: String(formData.get("name") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        address: String(formData.get("address") ?? "").trim(),
      },
      items: items.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity,
      })),
      subtotal,
      shipping,
      total,
    };

    try {
      saveOrder(order);
      setSavedOrder(order);
      clearCart();
    } catch (error) {
      console.error("Không thể lưu đơn hàng mô phỏng:", error);
      setSubmitError("Không thể lưu đơn hàng trên trình duyệt. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="font-serif text-lg font-semibold tracking-wide text-[#263b2d]">GREEN GARDEN</a>
          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
            <a href="/san-pham" className="text-[#59645b] hover:text-[#314c39]">Sản phẩm</a>
            <a href="/gioi-thieu" className="text-[#59645b] hover:text-[#314c39]">Về chúng tôi</a>
            <a href="/don-hang" className="text-[#59645b] hover:text-[#314c39]">Đơn hàng của tôi</a>
            <a href="/lien-he" className="text-[#59645b] hover:text-[#314c39]">Liên hệ</a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 md:py-16">
        {savedOrder ? (
          <section className="mx-auto max-w-2xl rounded-2xl border border-[#dce4d8] bg-white p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#70836a]">Đơn hàng đã được đặt</p>
            <h1 className="mt-3 font-serif text-4xl text-[#263b2d]">Cảm ơn bạn!</h1>
            <div className="mt-3 leading-7 text-[#687168]">
              Mã đơn hàng: <strong>{savedOrder.code}</strong>.
              <br />
              Website đang trong quá trình phát triển, nên đây chỉ là mô phỏng.
            </div>
            <div className="mt-6 grid gap-6 border-y border-[#e7e5dc] py-6 sm:grid-cols-2">
              <div>
                <h2 className="font-semibold text-[#314c39]">Người nhận</h2>
                <p className="mt-2 text-sm leading-6 text-[#59645b]">{savedOrder.recipient.name}</p>
                <p className="text-sm leading-6 text-[#59645b]">{savedOrder.recipient.phone}</p>
                <p className="text-sm leading-6 text-[#59645b]">{savedOrder.recipient.address}</p>
              </div>
              <div>
                <h2 className="font-semibold text-[#314c39]">Sản phẩm</h2>
                <ul className="mt-2 space-y-2">
                  {savedOrder.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 text-sm text-[#59645b]">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="flex justify-between pt-5 font-semibold">
              <span>Tổng cộng</span><span className="text-[#314c39]">{formatPrice(savedOrder.total)}</span>
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/don-hang" className="inline-flex rounded-full bg-[#314c39] px-6 py-3 text-sm font-semibold text-white hover:bg-[#243c2c]">Xem đơn hàng của tôi</a>
              <a href="/san-pham" className="inline-flex rounded-full border border-[#d7dbd0] px-6 py-3 text-sm font-semibold text-[#314c39] hover:bg-[#edf0e8]">Tiếp tục mua sắm</a>
            </div>
          </section>
        ) : items.length === 0 ? (
          <section className="rounded-2xl border border-[#e2e0d7] bg-white p-8 text-center">
            <h1 className="font-serif text-3xl text-[#263b2d]">Chưa có sản phẩm để thanh toán</h1>
            <a href="/san-pham" className="mt-6 inline-flex rounded-full bg-[#314c39] px-6 py-3 text-sm font-semibold text-white hover:bg-[#243c2c]">Xem sản phẩm</a>
          </section>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">GREEN GARDEN</p>
            <h1 className="mt-3 font-serif text-4xl text-[#263b2d]">Thông tin thanh toán</h1>
            <p className="mt-3 text-sm leading-6 text-[#747a70]">
              Đây là quy trình đặt hàng mô phỏng. Thông tin chỉ được lưu trên
              trình duyệt, không gửi đến cửa hàng và không phát sinh giao dịch thật.
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
              <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[#e2e0d7] bg-white p-6 sm:p-8">
                <h2 className="font-serif text-2xl text-[#314c39]">Thông tin nhận hàng</h2>
                <div>
                  <label htmlFor="checkout-name" className="mb-1 block text-sm font-medium">Họ và tên</label>
                  <input id="checkout-name" name="name" autoComplete="name" required className="w-full rounded-xl border border-[#deded4] px-3 py-3 outline-none focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]" />
                </div>
                <div>
                  <label htmlFor="checkout-phone" className="mb-1 block text-sm font-medium">Số điện thoại</label>
                  <input id="checkout-phone" name="phone" type="tel" autoComplete="tel" pattern="[0-9+().\\s-]{9,15}" required className="w-full rounded-xl border border-[#deded4] px-3 py-3 outline-none focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]" />
                </div>
                <div>
                  <label htmlFor="checkout-address" className="mb-1 block text-sm font-medium">Địa chỉ nhận hàng</label>
                  <textarea id="checkout-address" name="address" autoComplete="street-address" rows={3} required className="w-full rounded-xl border border-[#deded4] px-3 py-3 outline-none focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]" />
                </div>
                <fieldset>
                  <legend className="mb-2 text-sm font-medium">Phương thức thanh toán (mô phỏng)</legend>
                  <label className="flex items-center gap-3 rounded-xl border border-[#deded4] p-3 text-sm">
                    <input type="radio" name="payment" value="cod" defaultChecked />
                    Thanh toán khi nhận hàng
                  </label>
                  <label className="mt-2 flex items-center gap-3 rounded-xl border border-[#deded4] p-3 text-sm">
                    <input type="radio" name="payment" value="transfer" />
                    Chuyển khoản (mô phỏng)
                  </label>
                </fieldset>
                {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
                <button type="submit" className="w-full rounded-full bg-[#314c39] px-5 py-3 font-semibold text-white transition hover:bg-[#243c2c]">Xác nhận đặt hàng</button>
              </form>

              <aside className="h-fit rounded-2xl border border-[#e2e0d7] bg-white p-6">
                <h2 className="font-serif text-2xl text-[#314c39]">Đơn hàng</h2>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3 text-sm">
                      <span className="text-[#59645b]">{item.name} × {item.quantity}</span>
                      <span className="whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 space-y-3 border-t border-[#e7e5dc] pt-4 text-sm">
                  <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span>Giao hàng</span><span>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span></div>
                  <div className="flex justify-between border-t border-[#e7e5dc] pt-3 text-base font-semibold"><span>Tổng cộng</span><span className="text-[#314c39]">{formatPrice(total)}</span></div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
