import { useState, type SubmitEvent } from "react";
import { AccountMenu } from "./AuthPages";
import { useCart } from "./CartContext";
import { CartMenu } from "./GioHang";
import {
  saveOrder,
  deleteOrder,
  type Order,
} from "./DlieuDonhangStorage";
import { useAuth } from "./AuthContext";
import { loadProducts, saveProducts } from "./GreenGardenStore";
import type { Product } from "./SanPham";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default function ThanhToan() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const [savedOrder, setSavedOrder] = useState<Order | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "transfer">("cod");
  // Tính toán tổng tiền, phí vận chuyển và tổng cộng
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Phí vận chuyển: miễn phí nếu tổng tiền >= 500.000 VND, ngược lại là 20.000 VND
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 20000;
  const total = subtotal + shipping;

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) return;
    if (!user) {
      setSubmitError("Vui lòng đăng nhập để đặt hàng.");
      return;
    }
    if (!user.address || user.address.trim().length < 10) {
      setSubmitError("Vui lòng cập nhật địa chỉ nhận hàng trong tài khoản.");
      return;
    }
    let order: Order;
    let latestProducts: Product[];
    try {
      latestProducts = loadProducts();
      const currentItems = items.map((item) => {
        const product = latestProducts.find((current) => current.id === item.id);
        if (!product) throw new Error(`Sản phẩm “${item.name}” không còn được bán.`);
        if (item.quantity > product.stock) {
          throw new Error(`Sản phẩm “${product.name}” hiện chỉ còn ${product.stock} sản phẩm.`);
        }
        return { id: product.id, name: product.name, price: product.price, quantity: item.quantity };
      });
      const currentSubtotal = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const currentShipping = currentSubtotal >= 500000 || currentSubtotal === 0 ? 0 : 20000;
      order = {
      code: `GG${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
      userId: user?.id,
      recipient: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address.trim().replace(/\s+/g, " "),
      },
      items: currentItems,
      subtotal: currentSubtotal,
      shipping: currentShipping,
      total: currentSubtotal + currentShipping,
      paymentMethod,
      };
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Không thể kiểm tra tồn kho.");
      return;
    }
    setSubmitError("");
    setIsSubmitting(true);
    try {
      saveOrder(order);
      try {
        const orderedQuantities = order.items.reduce<Record<number, number>>((totals, item) => {
          totals[item.id] = (totals[item.id] ?? 0) + item.quantity;
          return totals;
        }, {});
        saveProducts(latestProducts.map((product) => ({
          ...product,
          stock: Math.max(0, product.stock - (orderedQuantities[product.id] ?? 0)),
        })));
      } catch (error) {
        deleteOrder(order.code);
        throw error;
      }
      setSavedOrder(order);
      clearCart();
    } catch (error) {
      console.error("Không thể lưu đơn hàng vào LocalStorage:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Không thể lưu đơn hàng. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
// Trả về JSX để hiển thị trang thanh toán
  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3 font-serif text-lg font-semibold tracking-wide text-[#263b2d]" aria-label="Green Garden - Trang chủ">
            <img src="/images/logo%20website.jpg" alt="" className="h-12 w-12 shrink-0 rounded-full bg-white object-contain" />
            <span>GREEN GARDEN</span>
          </a>
          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
            <a href="/" className="text-[#59645b] hover:text-[#314c39]">Trang chủ</a>
            <a href="/san-pham" className="text-[#59645b] hover:text-[#314c39]">Sản phẩm</a>
            <a href="/gioi-thieu" className="text-[#59645b] hover:text-[#314c39]">Về chúng tôi</a>
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
              Đơn hàng đã được lưu trong trình duyệt. Cửa hàng sẽ sớm xác nhận với bạn.
            </div>
            <div className="mt-6 grid gap-6 border-y border-[#e7e5dc] py-6 sm:grid-cols-2">
              <div>
                <h2 className="font-semibold text-[#314c39]">Người nhận</h2>
                <p className="mt-2 text-sm leading-6 text-[#59645b]">{savedOrder.recipient.name}</p>
                {savedOrder.recipient.email && <p className="text-sm leading-6 text-[#59645b]">{savedOrder.recipient.email}</p>}
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
              Đơn hàng được lưu trên trình duyệt này. Thanh toán trực tuyến chưa được kết nối.
            </p>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
              <form noValidate onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[#e2e0d7] bg-white p-6 sm:p-8">
                <h2 className="font-serif text-2xl text-[#314c39]">Thông tin nhận hàng</h2>
                {user && (
                  <div className="rounded-xl bg-[#f7f8f3] p-4 text-sm leading-6 text-[#59645b]">
                    <p><strong className="text-[#314c39]">{user.name}</strong></p>
                    <p>{user.phone}</p>
                    <p>{user.email}</p>
                    <p>{user.address}</p>
                    <a href="/tai-khoan" className="mt-2 inline-block font-semibold text-[#47764f] hover:underline">Cập nhật thông tin nhận hàng</a>
                  </div>
                )}
                <fieldset>
                  <legend className="mb-2 text-sm font-medium">Phương thức thanh toán</legend>
                  <label className="flex items-center gap-3 rounded-xl border border-[#deded4] p-3 text-sm">
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                    Thanh toán khi nhận hàng
                  </label>
                  <label className="mt-2 flex items-center gap-3 rounded-xl border border-[#deded4] p-3 text-sm">
                    <input type="radio" name="payment" value="transfer" checked={paymentMethod === "transfer"} onChange={() => setPaymentMethod("transfer")} />
                    Chuyển khoản
                  </label>
                </fieldset>
                {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#314c39] px-5 py-3 font-semibold text-white transition hover:bg-[#243c2c] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Đang gửi đơn..." : "Xác nhận đặt hàng"}</button>
              </form>
              {/* Hiển thị tóm tắt đơn hàng, bao gồm danh sách sản phẩm, tạm tính, phí giao hàng và tổng cộng */}
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
