import type { IncomingMessage, ServerResponse } from "node:http";
import {
  hasValidAdminSession,
  isSameOriginRequest,
} from "./admin.js";
import {
  isValidShippingAddress,
  isValidVietnameseMobilePhone,
  type Order,
  type OrderStatus,
} from "../src/DlieuDonhangStorage.js";

type OrdersRequest = IncomingMessage & {
  body?: unknown;
};

type OrdersResponse = ServerResponse & {
  status: (code: number) => OrdersResponse;
  json: (body: unknown) => void;
};

type StoredOrder = {
  code: string;
  created_at: string;
  status: OrderStatus;
  recipient: Order["recipient"];
  items: Order["items"];
  subtotal: number;
  shipping: number;
  total: number;
};

const validStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipping",
  "completed",
  "cancelled",
];
const orderColumns =
  "code,created_at,status,recipient,items,subtotal,shipping,total";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOrderItem(value: unknown): value is Order["items"][number] {
  return (
    isRecord(value) &&
    Number.isSafeInteger(value.id) &&
    typeof value.name === "string" &&
    Number.isSafeInteger(value.price) &&
    Number.isSafeInteger(value.quantity) &&
    Number(value.price) >= 0 &&
    Number(value.quantity) > 0
  );
}

function isRecipient(value: unknown): value is Order["recipient"] {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.phone === "string" &&
    isValidVietnameseMobilePhone(value.phone) &&
    typeof value.address === "string" &&
    isValidShippingAddress(value.address) &&
    (value.email === undefined || typeof value.email === "string")
  );
}

function isOrder(value: unknown): value is Order {
  if (!isRecord(value) || !isRecipient(value.recipient)) return false;
  if (
    typeof value.code !== "string" ||
    !/^GG\d{10}$/.test(value.code) ||
    typeof value.createdAt !== "string" ||
    !Number.isFinite(Date.parse(value.createdAt)) ||
    value.status !== "pending" ||
    !Array.isArray(value.items) ||
    value.items.length === 0 ||
    value.items.length > 100 ||
    !value.items.every(isOrderItem) ||
    !Number.isSafeInteger(value.subtotal) ||
    !Number.isSafeInteger(value.shipping) ||
    !Number.isSafeInteger(value.total)
  ) {
    return false;
  }

  const subtotal = value.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 500000 || subtotal === 0 ? 0 : 20000;
  return (
    value.subtotal === subtotal &&
    value.shipping === shipping &&
    value.total === subtotal + shipping
  );
}

function fromStoredOrder(value: unknown): Order {
  if (
    !isRecord(value) ||
    typeof value.code !== "string" ||
    typeof value.created_at !== "string" ||
    typeof value.status !== "string" ||
    !validStatuses.includes(value.status as OrderStatus) ||
    !isRecipient(value.recipient) ||
    !Array.isArray(value.items) ||
    !value.items.every(isOrderItem) ||
    typeof value.subtotal !== "number" ||
    typeof value.shipping !== "number" ||
    typeof value.total !== "number"
  ) {
    throw new Error("Dữ liệu đơn hàng từ cơ sở dữ liệu không đúng định dạng.");
  }
  return {
    code: value.code,
    createdAt: value.created_at,
    status: value.status as OrderStatus,
    recipient: value.recipient,
    items: value.items,
    subtotal: value.subtotal,
    shipping: value.shipping,
    total: value.total,
  };
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

async function supabaseRequest(
  path: string,
  method: "GET" | "POST" | "PATCH",
  serviceKey: string,
  body?: unknown
): Promise<unknown> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Cấu hình cơ sở dữ liệu Supabase chưa được thiết lập.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const responseText = await response.text();
  let result: unknown = null;
  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch (error) {
      console.error("Supabase trả về phản hồi không phải JSON:", error);
      throw new Error("Không đọc được phản hồi từ cơ sở dữ liệu.", {
        cause: error,
      });
    }
  }
  if (!response.ok) {
    console.error("Supabase từ chối yêu cầu đơn hàng:", response.status, result);
    throw new Error("Cơ sở dữ liệu không thể xử lý đơn hàng.");
  }
  return result;
}

function requireAdmin(request: OrdersRequest, response: OrdersResponse) {
  if (!hasValidAdminSession(request)) {
    response.status(401).json({ error: "Cần đăng nhập admin." });
    return false;
  }
  return true;
}

export default async function handler(
  request: OrdersRequest,
  response: OrdersResponse
) {
  response.setHeader("Cache-Control", "no-store");
  const config = getSupabaseConfig();
  if (!config) {
    return response.status(503).json({
      error: "Cần cấu hình SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trên Vercel.",
    });
  }

  if (request.method === "GET") {
    if (!requireAdmin(request, response)) return;
    try {
      const query = new URLSearchParams({
        select: orderColumns,
        order: "created_at.desc",
      });
      const rows = await supabaseRequest(
        `orders?${query.toString()}`,
        "GET",
        config.serviceKey
      );
      if (!Array.isArray(rows)) {
        throw new Error("Danh sách đơn hàng từ cơ sở dữ liệu không hợp lệ.");
      }
      return response
        .status(200)
        .json(rows.map((row) => fromStoredOrder(row)));
    } catch (error) {
      console.error("Không thể tải đơn hàng từ Supabase:", error);
      return response
        .status(502)
        .json({ error: "Không tải được đơn hàng từ cơ sở dữ liệu." });
    }
  }

  if (request.method !== "POST" && request.method !== "PATCH") {
    response.setHeader("Allow", "GET, POST, PATCH");
    return response.status(405).json({ error: "Phương thức không được hỗ trợ." });
  }
  if (!isSameOriginRequest(request)) {
    return response.status(403).json({ error: "Yêu cầu không hợp lệ." });
  }

  if (request.method === "POST") {
    if (!isOrder(request.body)) {
      return response.status(400).json({ error: "Thông tin đơn hàng không hợp lệ." });
    }
    const order = request.body;
    const row: StoredOrder = {
      code: order.code,
      created_at: order.createdAt,
      status: "pending",
      recipient: order.recipient,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
    };
    try {
      const inserted = await supabaseRequest(
        `orders?select=${orderColumns}`,
        "POST",
        config.serviceKey,
        row
      );
      if (!Array.isArray(inserted) || inserted.length !== 1) {
        throw new Error("Cơ sở dữ liệu không xác nhận đơn hàng vừa tạo.");
      }
      return response.status(201).json(fromStoredOrder(inserted[0]));
    } catch (error) {
      console.error("Không thể lưu đơn hàng mới:", error);
      return response
        .status(502)
        .json({ error: "Không thể lưu đơn hàng. Vui lòng thử lại." });
    }
  }

  if (!requireAdmin(request, response)) return;
  if (!isRecord(request.body)) {
    return response.status(400).json({ error: "Yêu cầu cập nhật không hợp lệ." });
  }
  const { code, status } = request.body;
  if (
    typeof code !== "string" ||
    !/^GG\d{10}$/.test(code) ||
    typeof status !== "string" ||
    !validStatuses.includes(status as OrderStatus)
  ) {
    return response.status(400).json({ error: "Mã đơn hoặc trạng thái không hợp lệ." });
  }

  try {
    const query = new URLSearchParams({
      code: `eq.${code}`,
      select: orderColumns,
    });
    const updated = await supabaseRequest(
      `orders?${query.toString()}`,
      "PATCH",
      config.serviceKey,
      { status }
    );
    if (!Array.isArray(updated) || updated.length === 0) {
      return response.status(404).json({ error: "Không tìm thấy đơn hàng." });
    }
    return response.status(200).json(fromStoredOrder(updated[0]));
  } catch (error) {
    console.error("Không thể cập nhật trạng thái đơn hàng:", error);
    return response
      .status(502)
      .json({ error: "Không thể cập nhật trạng thái đơn hàng." });
  }
}
