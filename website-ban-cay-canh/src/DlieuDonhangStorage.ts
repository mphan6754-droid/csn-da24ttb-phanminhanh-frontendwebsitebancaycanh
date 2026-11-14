export type Order = {
  // Mã đơn hàng
  code: string;
  createdAt: string;
  status: "pending" | "cancelled";
  recipient: {
    name: string;
    email?: string;
    phone: string;
    address: string;
  };
  // Danh sách sản phẩm trong đơn hàng
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
};
// Khóa lưu trữ đơn hàng trong localStorage
const STORAGE_KEY = "green-garden-orders";
const vietnameseMobilePhonePattern =
  /^0(?:3[2-9]|5[25689]|7[06789]|8[1-9]|9[0-46-9])[0-9]{7}$/;

export function isValidVietnameseMobilePhone(phone: string) {
  return vietnameseMobilePhonePattern.test(phone);
}

export function isValidShippingAddress(address: string) {
  const normalizedAddress = address.trim().replace(/\s+/g, " ");
  return (
    normalizedAddress.length >= 10 &&
    normalizedAddress.split(" ").length >= 2 &&
    /[A-Za-zÀ-ỹ]/.test(normalizedAddress)
  );
}

// Kiểm tra xem một giá trị có phải là đơn hàng hợp lệ hay không
function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  const order = value as Partial<Order>;
  return (
    typeof order.code === "string" &&
    typeof order.createdAt === "string" &&
    (order.status === undefined ||
      order.status === "pending" ||
      order.status === "cancelled") &&
    typeof order.recipient?.name === "string" &&
    (order.recipient.email === undefined ||
      typeof order.recipient.email === "string") &&
    typeof order.recipient.phone === "string" &&
    typeof order.recipient.address === "string" &&
    Array.isArray(order.items) &&
    typeof order.subtotal === "number" &&
    typeof order.shipping === "number" &&
    typeof order.total === "number"
  );
}
// Tải danh sách đơn hàng từ localStorage
export function loadOrders(): Order[] {
  const savedOrders = localStorage.getItem(STORAGE_KEY);
  if (!savedOrders) return [];
// Nếu không có dữ liệu đơn hàng trong localStorage, trả về mảng rỗng
  const parsed: unknown = JSON.parse(savedOrders);
  if (!Array.isArray(parsed) || !parsed.every(isOrder)) {
    throw new Error("Dữ liệu lịch sử đơn hàng không đúng định dạng.");
  }
  return parsed.map((order) => ({
    ...order,
    status: order.status ?? "pending",
  }));
}
// Count quantities from active simulated orders stored in this browser.
export function loadProductSales(): Record<number, number> {
  return loadOrders()
    .filter((order) => order.status !== "cancelled")
    .reduce<Record<number, number>>((sales, order) => {
      for (const item of order.items) {
        sales[item.id] = (sales[item.id] ?? 0) + item.quantity;
      }
      return sales;
    }, {});
}
// Lưu đơn hàng mới vào localStorage, thêm vào đầu danh sách đơn hàng
export function saveOrder(order: Order) {
  if (!isValidVietnameseMobilePhone(order.recipient.phone)) {
    throw new Error("Số điện thoại nhận hàng không hợp lệ.");
  }
  if (!isValidShippingAddress(order.recipient.address)) {
    throw new Error("Địa chỉ nhận hàng chưa đầy đủ.");
  }
  const orders = loadOrders();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...orders]));
}
// Xóa đơn hàng theo mã đơn hàng
export function deleteOrder(orderCode: string) {
  const orders = loadOrders();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(orders.filter((order) => order.code !== orderCode))
  );
}
// Hủy đơn hàng theo mã đơn hàng, thay đổi trạng thái thành "cancelled"
export function cancelOrder(orderCode: string) {
  const orders = loadOrders();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      orders.map((order) =>
        order.code === orderCode ? { ...order, status: "cancelled" } : order
      )
    )
  );
}
