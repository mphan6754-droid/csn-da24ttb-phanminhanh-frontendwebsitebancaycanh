import { useEffect, useState } from "react";
import {
  isOrder,
  type Order,
  type OrderStatus,
} from "./DlieuDonhangStorage";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Khách đã nhận",
  cancelled: "Đã hủy",
};
const statusFilters: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipping",
  "completed",
  "cancelled",
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

async function fetchOrdersFromServer(): Promise<Order[]> {
  const response = await fetch("/api/orders");
  const result: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : "Không thể tải đơn hàng từ máy chủ.";
    throw new Error(message);
  }
  if (!Array.isArray(result) || !result.every(isOrder)) {
    throw new Error("Máy chủ trả về danh sách đơn hàng không hợp lệ.");
  }
  return result;
}

export default function Admin() {
  const [authState, setAuthState] = useState<
    "checking" | "authenticated" | "unauthenticated" | "error"
  >("checking");
  const [authError, setAuthError] = useState("");
  const [orderState, setOrderState] = useState({
    orders: [] as Order[],
    error: "",
  });
  const [notice, setNotice] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        const response = await fetch("/api/admin");
        const result: { authenticated?: boolean; error?: string } =
          await response.json();
        if (!response.ok) {
          throw new Error(result.error ?? "Không thể kiểm tra phiên admin.");
        }
        if (!active) return;
        if (!result.authenticated) {
          setAuthState("unauthenticated");
          return;
        }
        setAuthState("authenticated");
        try {
          const orders = await fetchOrdersFromServer();
          if (active) setOrderState({ orders, error: "" });
        } catch (error) {
          if (!active) return;
          console.error("Không thể tải đơn hàng từ máy chủ:", error);
          setOrderState({
            orders: [],
            error:
              error instanceof Error
                ? error.message
                : "Không thể tải đơn hàng từ cơ sở dữ liệu.",
          });
        }
      } catch (error) {
        if (!active) return;
        console.error("Không thể kiểm tra phiên admin:", error);
        setAuthError(
          error instanceof Error
            ? error.message
            : "Không thể kiểm tra phiên đăng nhập admin."
        );
        setAuthState("error");
      }
    };
    void initialize();

    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (code: string, status: OrderStatus) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, status }),
      });
      const result: unknown = await response.json();
      if (!response.ok || !isOrder(result)) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Không thể cập nhật trạng thái đơn hàng.";
        throw new Error(message);
      }
      setOrderState((current) => ({
        ...current,
        orders: current.orders.map((order) =>
          order.code === code ? result : order
        ),
      }));
      setNotice(`Đã cập nhật trạng thái đơn ${code}.`);
    } catch (error) {
      console.error("Không thể cập nhật trạng thái đơn hàng trên máy chủ:", error);
      setNotice(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trạng thái. Vui lòng thử lại."
      );
    }
  };

  const refreshOrders = async () => {
    setIsRefreshing(true);
    try {
      const orders = await fetchOrdersFromServer();
      setOrderState({ orders, error: "" });
      setNotice("Đã tải lại đơn hàng từ cơ sở dữ liệu.");
    } catch (error) {
      console.error("Không thể tải lại đơn hàng:", error);
      setOrderState((current) => ({
        ...current,
        error:
          error instanceof Error
            ? error.message
            : "Không thể tải lại đơn hàng.",
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  if (authState !== "authenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f2] px-5 py-12 text-[#27352c]">
        <section className="w-full max-w-md rounded-3xl border border-[#e2e0d7] bg-white p-8 shadow-sm">
          <a href="/" className="text-sm font-semibold text-[#47764f]">
            ← Về cửa hàng
          </a>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">
            Green Garden
          </p>
          <h1 className="mt-2 font-serif text-3xl text-[#263b2d]">
            Quản trị cửa hàng
          </h1>
          {authState === "checking" ? (
            <p className="mt-3 text-sm leading-6 text-[#687168]">
              Đang kiểm tra phiên đăng nhập...
            </p>
          ) : authState === "error" ? (
            <p role="alert" className="mt-3 text-sm leading-6 text-red-700">
              {authError}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#687168]">
              Phiên admin chưa đăng nhập hoặc đã hết hạn. Hãy đăng nhập lại từ
              menu Tài khoản.
            </p>
          )}
          <a
            href="/"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-[#314c39] px-5 py-3 text-sm font-semibold text-white hover:bg-[#243c2c]"
          >
            Về trang chủ để đăng nhập
          </a>
        </section>
      </main>
    );
  }

  const activeOrders = orderState.orders.filter(
    (order) => order.status !== "cancelled"
  );
  const revenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const filteredOrders =
    selectedStatus === "all"
      ? orderState.orders
      : orderState.orders.filter((order) => order.status === selectedStatus);

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27352c]">
      <header className="border-b border-[#e7e5dc] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <a href="/" className="text-sm font-semibold text-[#47764f]">
              ← Về cửa hàng
            </a>
            <h1 className="mt-1 font-serif text-2xl text-[#263b2d]">
              Quản trị Green Garden
            </h1>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                const response = await fetch("/api/admin", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "logout" }),
                });
                if (!response.ok) {
                  throw new Error("Máy chủ không thể kết thúc phiên admin.");
                }
                sessionStorage.removeItem("green-garden-user-email");
                sessionStorage.removeItem("green-garden-user-name");
                window.location.assign("/");
              } catch (error) {
                console.error("Không thể đăng xuất khỏi trang quản trị:", error);
                setNotice("Không thể kết nối máy chủ để đăng xuất admin.");
              }
            }}
            className="rounded-full border border-[#d7dbd0] px-4 py-2 text-sm font-semibold text-[#314c39] hover:bg-[#edf0e8]"
          >
            Đăng xuất admin
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard label="Tổng số đơn" value={String(orderState.orders.length)} />
          <SummaryCard
            label="Chờ xác nhận"
            value={String(
              orderState.orders.filter((order) => order.status === "pending").length
            )}
          />
          <SummaryCard
            label="Đang giao"
            value={String(
              orderState.orders.filter((order) => order.status === "shipping").length
            )}
          />
          <SummaryCard
            label="Khách đã nhận"
            value={String(
              orderState.orders.filter((order) => order.status === "completed").length
            )}
          />
          <SummaryCard label="Doanh thu đơn chưa hủy" value={formatPrice(revenue)} />
        </div>

        <section className="mt-8 rounded-2xl border border-[#e2e0d7] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#78836f]">
                Bán hàng
              </p>
              <h2 className="mt-1 font-serif text-2xl text-[#263b2d]">
                Quản lý đơn hàng
              </h2>
            </div>
            <button
              type="button"
              onClick={refreshOrders}
              disabled={isRefreshing}
              className="rounded-full border border-[#d7dbd0] px-4 py-2 text-sm font-semibold text-[#314c39] hover:bg-[#edf0e8]"
            >
              {isRefreshing ? "Đang tải..." : "Tải lại đơn hàng"}
            </button>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#687168]">
            Danh sách đơn dùng chung được tải từ cơ sở dữ liệu.
          </p>
          {orderState.error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">
              {orderState.error}
            </p>
          )}
          {notice && (
            <p aria-live="polite" className="mt-4 text-sm text-[#47764f]">
              {notice}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Lọc đơn hàng">
            <button
              type="button"
              onClick={() => setSelectedStatus("all")}
              aria-pressed={selectedStatus === "all"}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                selectedStatus === "all"
                  ? "bg-[#314c39] text-white"
                  : "border border-[#d7dbd0] text-[#526254] hover:bg-[#edf0e8]"
              }`}
            >
              Tất cả ({orderState.orders.length})
            </button>
            {statusFilters.map((status) => {
              const count = orderState.orders.filter(
                (order) => order.status === status
              ).length;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  aria-pressed={selectedStatus === status}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    selectedStatus === status
                      ? "bg-[#314c39] text-white"
                      : "border border-[#d7dbd0] text-[#526254] hover:bg-[#edf0e8]"
                  }`}
                >
                  {statusLabels[status]} ({count})
                </button>
              );
            })}
          </div>

          {orderState.orders.length === 0 ? (
            <p className="mt-6 rounded-xl bg-[#f8f7f2] p-5 text-sm text-[#687168]">
              Chưa có đơn hàng trong hệ thống. Các đơn mới sẽ xuất hiện tại đây.
            </p>
          ) : filteredOrders.length === 0 ? (
            <p className="mt-6 rounded-xl bg-[#f8f7f2] p-5 text-sm text-[#687168]">
              Không có đơn hàng ở trạng thái này.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredOrders.map((order) => (
                <article
                  key={order.code}
                  className="rounded-xl border border-[#e7e5dc] p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-[#314c39]">
                        Đơn {order.code}
                      </h3>
                      <p className="mt-1 text-sm text-[#747a70]">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Trạng thái</span>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(
                            order.code,
                            event.target.value as OrderStatus
                          )
                        }
                        className="rounded-lg border border-[#deded4] bg-white px-3 py-2"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="mt-4 grid gap-4 border-t border-[#e7e5dc] pt-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="font-semibold">{order.recipient.name}</p>
                      <p className="mt-1 text-[#687168]">{order.recipient.phone}</p>
                      {order.recipient.email && (
                        <p className="mt-1 break-all text-[#687168]">
                          {order.recipient.email}
                        </p>
                      )}
                      <p className="mt-1 text-[#687168]">{order.recipient.address}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Sản phẩm</p>
                      <ul className="mt-1 space-y-1 text-[#687168]">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 font-semibold text-[#314c39]">
                        Tổng: {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-2xl border border-[#e2e0d7] bg-white p-5">
      <p className="text-sm text-[#687168]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#314c39]">{value}</p>
    </section>
  );
}
