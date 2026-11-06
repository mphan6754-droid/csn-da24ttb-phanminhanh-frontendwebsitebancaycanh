import AccountMenu from "./Dangnhap/Dangky";
import { useCart } from "./CartContext";
import { CartMenu } from "./GioHang";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default function GioHangPage() {
  const { items, changeQuantity, removeFromCart } = useCart();
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 20000;

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="font-serif text-lg font-semibold tracking-wide text-[#263b2d]">
            GREEN GARDEN
          </a>
          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
            <a href="/san-pham" className="text-[#59645b] hover:text-[#314c39]">Sản phẩm</a>
            <a href="/gioi-thieu" className="text-[#59645b] hover:text-[#314c39]">Về chúng tôi</a>
            <a href="/lien-he" className="text-[#59645b] hover:text-[#314c39]">Liên hệ</a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">GREEN GARDEN</p>
        <h1 className="mt-3 font-serif text-4xl text-[#263b2d]">Giỏ hàng của bạn</h1>

        {items.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-[#e2e0d7] bg-white p-8 text-center">
            <p className="font-serif text-2xl text-[#314c39]">Giỏ hàng đang trống</p>
            <p className="mt-2 text-sm text-[#747a70]">
              Chọn sản phẩm bạn yêu thích để bắt đầu đặt hàng.
            </p>
            <a href="/san-pham" className="mt-6 inline-flex rounded-full bg-[#314c39] px-6 py-3 text-sm font-semibold text-white hover:bg-[#243c2c]">
              Tiếp tục mua sắm
            </a>
          </section>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
            <section className="space-y-4" aria-label="Sản phẩm trong giỏ">
              {items.map((item) => (
                <article key={item.id} className="flex gap-4 rounded-2xl border border-[#e2e0d7] bg-white p-4 sm:p-5">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl bg-[#e7e9df] object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <a href={`/san-pham/${item.id}`} className="font-serif text-xl text-[#263b2d] hover:underline">{item.name}</a>
                    <p className="mt-1 text-sm text-[#526a51]">{formatPrice(item.price)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button type="button" onClick={() => changeQuantity(item.id, -1)} aria-label={`Giảm số lượng ${item.name}`} className="h-8 w-8 rounded-full border border-[#d7dbd0] hover:bg-[#edf0e8]">-</button>
                      <span className="min-w-5 text-center" aria-label={`Số lượng ${item.quantity}`}>{item.quantity}</span>
                      <button type="button" onClick={() => changeQuantity(item.id, 1)} aria-label={`Tăng số lượng ${item.name}`} className="h-8 w-8 rounded-full border border-[#d7dbd0] hover:bg-[#edf0e8]">+</button>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="ml-auto text-sm text-[#9a564b] hover:text-[#723b33]">Xóa</button>
                    </div>
                  </div>
                  <p className="hidden whitespace-nowrap font-semibold text-[#314c39] sm:block">{formatPrice(item.price * item.quantity)}</p>
                </article>
              ))}
              <a href="/san-pham" className="inline-block pt-2 text-sm font-medium text-[#526a51] underline underline-offset-4">← Tiếp tục mua sắm</a>
            </section>

            <aside className="h-fit rounded-2xl border border-[#e2e0d7] bg-white p-6">
              <h2 className="font-serif text-2xl text-[#314c39]">Tóm tắt đơn hàng</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4"><span className="text-[#747a70]">Tạm tính</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-[#747a70]">Phí giao hàng</span><span>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between gap-4 border-t border-[#e7e5dc] pt-4 text-base font-semibold"><span>Tổng cộng</span><span className="text-[#314c39]">{formatPrice(subtotal + shipping)}</span></div>
              </div>
              {subtotal < 500000 && (
                <p className="mt-3 text-xs leading-5 text-[#85887e]">
                  Miễn phí giao hàng cho đơn từ 500.000 ₫.
                </p>
              )}
              <a href="/thanh-toan" className="mt-6 block rounded-full bg-[#314c39] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#243c2c]">
                Tiến hành thanh toán
              </a>
              <p className="mt-3 text-center text-xs text-[#85887e]">Thanh toán mô phỏng, không phát sinh giao dịch thật.</p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
