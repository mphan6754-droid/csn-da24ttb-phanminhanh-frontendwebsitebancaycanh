export type Order = {
  code: string;
  createdAt: string;
  status: "pending" | "cancelled";
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
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

const STORAGE_KEY = "green-garden-orders";

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
    typeof order.recipient.phone === "string" &&
    typeof order.recipient.address === "string" &&
    Array.isArray(order.items) &&
    typeof order.subtotal === "number" &&
    typeof order.shipping === "number" &&
    typeof order.total === "number"
  );
}

export function loadOrders(): Order[] {
  const savedOrders = localStorage.getItem(STORAGE_KEY);
  if (!savedOrders) return [];

  const parsed: unknown = JSON.parse(savedOrders);
  if (!Array.isArray(parsed) || !parsed.every(isOrder)) {
    throw new Error("Dữ liệu lịch sử đơn hàng không đúng định dạng.");
  }
  return parsed.map((order) => ({
    ...order,
    status: order.status ?? "pending",
  }));
}

export function saveOrder(order: Order) {
  const orders = loadOrders();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...orders]));
}

export function deleteOrder(orderCode: string) {
  const orders = loadOrders();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(orders.filter((order) => order.code !== orderCode))
  );
}

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
