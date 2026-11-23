import { useEffect, useState, type SubmitEvent } from "react";
import { useAuth } from "./AuthContext";
import { loadOrders, type Order, type OrderStatus } from "./DlieuDonhangStorage";
import { AccountMenu } from "./AuthPages";

const statusNames: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao hàng",
  completed: "Đã giao hàng",
  cancelled: "Đã hủy",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export default function TaiKhoan() {
  const { user, updateProfile, changePassword } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const refreshOrders = () => {
      setOrders(loadOrders().filter((order) => order.userId === user?.id));
    };
    refreshOrders();
    window.addEventListener("storage", refreshOrders);
    window.addEventListener("green-garden-store-change", refreshOrders);
    return () => {
      window.removeEventListener("storage", refreshOrders);
      window.removeEventListener("green-garden-store-change", refreshOrders);
    };
  }, [user?.id]);

  if (!user) return null;

  const submitProfile = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      updateProfile({
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        address: String(data.get("address") ?? "").trim(),
      });
      setProfileMessage("Đã cập nhật thông tin tài khoản.");
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "Không thể cập nhật tài khoản.");
    }
  };

  const submitPassword = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextPassword = String(data.get("newPassword") ?? "");
    if (nextPassword !== String(data.get("confirmPassword") ?? "")) {
      setPasswordMessage("Mật khẩu mới nhập lại chưa khớp.");
      return;
    }
    try {
      changePassword(String(data.get("currentPassword") ?? ""), nextPassword);
      event.currentTarget.reset();
      setPasswordMessage("Đã đổi mật khẩu.");
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Không thể đổi mật khẩu.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="font-serif text-lg font-semibold text-[#263b2d]">GREEN GARDEN</a>
          <nav className="flex flex-wrap items-center gap-3"><a href="/san-pham" className="text-sm text-[#59645b]">Sản phẩm</a><AccountMenu /></nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">Tài khoản Green Garden</p>
        <h1 className="mt-2 font-serif text-4xl text-[#263b2d]">Xin chào, {user.name}</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <form onSubmit={submitProfile} className="space-y-4 rounded-2xl border border-[#e2e0d7] bg-white p-6">
            <h2 className="font-serif text-2xl text-[#314c39]">Thông tin cá nhân</h2>
            <label className="block text-sm font-medium">Họ và tên<input name="name" defaultValue={user.name} required minLength={2} className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3" /></label>
            <label className="block text-sm font-medium">Email<input name="email" type="email" defaultValue={user.email} required className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3" /></label>
            <label className="block text-sm font-medium">Số điện thoại<input name="phone" type="tel" defaultValue={user.phone} pattern="0(?:3[2-9]|5[25689]|7[06789]|8[1-9]|9[0-46-9])[0-9]{7}" maxLength={10} required className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3" /></label>
            <label className="block text-sm font-medium">Địa chỉ<textarea name="address" defaultValue={user.address} rows={3} minLength={10} required className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3" /></label>
            {profileMessage && <p role="status" className="text-sm text-[#47764f]">{profileMessage}</p>}
            <button className="rounded-full bg-[#314c39] px-5 py-3 text-sm font-semibold text-white">Lưu thông tin</button>
          </form>
          <form onSubmit={submitPassword} className="space-y-4 rounded-2xl border border-[#e2e0d7] bg-white p-6">
            <h2 className="font-serif text-2xl text-[#314c39]">Đổi mật khẩu</h2>
            <label className="block text-sm font-medium">Mật khẩu hiện tại<input name="currentPassword" type="password" required className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3" /></label>
            <label className="block text-sm font-medium">Mật khẩu mới<input name="newPassword" type="password" minLength={9} required className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3" /></label>
            <label className="block text-sm font-medium">Xác nhận mật khẩu mới<input name="confirmPassword" type="password" minLength={9} required className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3" /></label>
            {passwordMessage && <p role="status" className="text-sm text-[#47764f]">{passwordMessage}</p>}
            <button className="rounded-full border border-[#d7dbd0] px-5 py-3 text-sm font-semibold text-[#314c39]">Đổi mật khẩu</button>
          </form>
        </div>
        <section className="mt-8 rounded-2xl border border-[#e2e0d7] bg-white p-6">
          <h2 className="font-serif text-2xl text-[#314c39]">Lịch sử đơn hàng</h2>
          {orders.length === 0 ? <p className="mt-4 text-sm text-[#687168]">Bạn chưa có đơn hàng nào.</p> : (
            <div className="mt-4 space-y-4">
              {orders.map((order) => (
                <article key={order.code} className="rounded-xl border border-[#e7e5dc] p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3 className="font-semibold text-[#314c39]">Đơn {order.code}</h3>
                    <span className="text-sm text-[#526a51]">{statusNames[order.status]}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#747a70]">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                  <ul className="mt-3 space-y-1 text-sm text-[#59645b]">{order.items.map((item) => <li key={item.id}>{item.name} × {item.quantity}</li>)}</ul>
                  <p className="mt-3 text-sm font-semibold">Tổng: {formatPrice(order.total)}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
