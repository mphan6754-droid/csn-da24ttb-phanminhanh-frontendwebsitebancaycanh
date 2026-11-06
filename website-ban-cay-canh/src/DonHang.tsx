import { useState } from "react";
import { CartMenu } from "./GioHang";
import { cancelOrder, deleteOrder, loadOrders, type Order } from "./DlieuDonhangStorage";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default function DonHang() {
  const [orderState, setOrderState] = useState(() => {
    try {
      return { orders: loadOrders(), error: "" };
    } catch (loadError) {
      console.error("Không thể đọc lịch sử đơn hàng:", loadError);
      return {
        orders: [] as Order[],
        error: "Không thể tải lịch sử đơn hàng đã lưu trên trình duyệt.",
      };
    }
  });
  const { orders, error } = orderState;

  const handleDeleteOrder = (orderCode: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đơn ${orderCode} khỏi lịch sử mô phỏng?`)) {
      return;
    }

    try {
      deleteOrder(orderCode);
      setOrderState((current) => ({
        ...current,
        orders: current.orders.filter((order) => order.code !== orderCode),
      }));
    } catch (deleteError) {
      console.error("Không thể xóa đơn hàng mô phỏng:", deleteError);
      setOrderState((current) => ({
        ...current,
        error: "Không thể xóa đơn hàng khỏi bộ nhớ trình duyệt.",
      }));
    }
  };

  const handleCancelOrder = (orderCode: string) => {
    if (!window.confirm(`Bạn có chắc muốn hủy đơn ${orderCode} không?`)) {
      return;
    }

    try {
      cancelOrder(orderCode);
      setOrderState((current) => ({
        ...current,
        orders: current.orders.map((order) =>
          order.code === orderCode ? { ...order, status: "cancelled" } : order
        ),
      }));
    } catch (cancelError) {
      console.error("Không thể hủy đơn hàng mô phỏng:", cancelError);
      setOrderState((current) => ({
        ...current,
        error: "Không thể cập nhật trạng thái đơn hàng trong bộ nhớ trình duyệt.",
      }));
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
            <a href="/don-hang" aria-current="page" className="font-semibold text-[#314c39]">Đơn hàng của tôi</a>
            <CartMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8 md:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">GREEN GARDEN</p>
        <h1 className="mt-3 font-serif text-4xl text-[#263b2d]">Đơn hàng của tôi</h1>
        <p className="mt-3 text-sm leading-6 text-[#747a70]">
          Lịch sử này được lưu trên trình duyệt hiện tại. Đây là dữ liệu mô phỏng,
          không phải đơn hàng thật gửi đến cửa hàng.
        </p>

        {error ? (
          <p role="alert" className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>
        ) : orders.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-[#e2e0d7] bg-white p-8 text-center">
            <p className="font-serif text-2xl text-[#314c39]">Bạn chưa có đơn hàng nào</p>
            <a href="/san-pham" className="mt-6 inline-flex rounded-full bg-[#314c39] px-6 py-3 text-sm font-semibold text-white hover:bg-[#243c2c]">
              Khám phá sản phẩm
            </a>
          </section>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <article key={order.code} className="rounded-2xl border border-[#e2e0d7] bg-white p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e7e5dc] pb-4">
                  <div>
                    <h2 className="font-serif text-2xl text-[#314c39]">Đơn {order.code}</h2>
                    <p className="mt-1 text-sm text-[#747a70]">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${order.status === "cancelled" ? "bg-[#fbefed] text-[#9a564b]" : "bg-[#edf0e8] text-[#526a51]"}`}>
                      {order.status === "cancelled" ? "Đã hủy" : "Đang xử lý"}
                    </span>
                    {order.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.code)}
                        className="rounded-full border border-[#d7dbd0] px-3 py-1.5 text-xs font-medium text-[#526a51] transition hover:bg-[#edf0e8]"
                      >
                        Hủy đơn
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteOrder(order.code)}
                      className="rounded-full border border-[#ead4d0] px-3 py-1.5 text-xs font-medium text-[#9a564b] transition hover:bg-[#fbefed]"
                    >
                      Xóa đơn
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 py-5 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[#314c39]">Người nhận</h3>
                    <p className="mt-2 text-sm leading-6 text-[#59645b]">{order.recipient.name}</p>
                    <p className="text-sm leading-6 text-[#59645b]">{order.recipient.phone}</p>
                    <p className="text-sm leading-6 text-[#59645b]">{order.recipient.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#314c39]">Sản phẩm</h3>
                    <ul className="mt-2 space-y-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-3 text-sm text-[#59645b]">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#e7e5dc] pt-4 text-sm">
                  <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(order.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Giao hàng</span><span>{order.shipping === 0 ? "Miễn phí" : formatPrice(order.shipping)}</span></div>
                  <div className="flex justify-between border-t border-[#e7e5dc] pt-3 text-base font-semibold">
                    <span>Tổng cộng</span><span className="text-[#314c39]">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
