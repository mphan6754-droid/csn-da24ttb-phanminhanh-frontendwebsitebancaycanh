import { useEffect, useState } from "react";
import type { Product } from "./SanPham";

export const STORAGE_KEYS = {
  users: "gg_users",
  currentUser: "gg_current_user",
  products: "gg_products",
  categories: "gg_categories",
  orders: "gg_orders",
  cart: "gg_cart",
} as const;

export const DEMO_ADMIN = {
  name: "Quản trị viên Green Garden",
  email: "admin@greengarden",
  phone: "0900000000",
  address: "Green Garden, Việt Nam",
  password: "greengarden123!",
} as const;

export type UserRole = "admin" | "user";
export type StoreUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: UserRole;
  blocked: boolean;
  createdAt: string;
};
export type PublicUser = Omit<StoreUser, "password">;

const STORE_CHANGE_EVENT = "green-garden-store-change";

function notifyStoreChange(key: string) {
  window.dispatchEvent(new CustomEvent(STORE_CHANGE_EVENT, { detail: { key } }));
}

function readArray<T>(key: string, isItem: (value: unknown) => value is T): T[] {
  const saved = localStorage.getItem(key);
  if (saved === null) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(saved);
  } catch (error) {
    console.error(`Dữ liệu ${key} trong LocalStorage không đọc được:`, error);
    throw new Error(`Dữ liệu ${key} bị lỗi. Hãy kiểm tra hoặc khôi phục dữ liệu trình duyệt.`, { cause: error });
  }
  if (!Array.isArray(parsed) || !parsed.every(isItem)) {
    throw new Error(`Dữ liệu ${key} không đúng định dạng.`);
  }
  return parsed;
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const product = value as Partial<Product>;
  return (
    Number.isInteger(product.id) &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    typeof product.stock === "number" &&
    Number.isInteger(product.stock) &&
    typeof product.category === "string" &&
    typeof product.group === "string" &&
    typeof product.description === "string" &&
    typeof product.light === "string" &&
    typeof product.watering === "string" &&
    typeof product.care === "string" &&
    typeof product.size === "string" &&
    (product.image === undefined || typeof product.image === "string")
  );
}

function isUser(value: unknown): value is StoreUser {
  if (typeof value !== "object" || value === null) return false;
  const user = value as Partial<StoreUser>;
  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string" &&
    typeof user.phone === "string" &&
    (user.address === undefined || typeof user.address === "string") &&
    typeof user.password === "string" &&
    (user.role === "admin" || user.role === "user") &&
    typeof user.blocked === "boolean" &&
    typeof user.createdAt === "string"
  );
}

export function initializeLocalStore(seedProducts: Product[], seedCategories: string[]) {
  const legacyKeys: [string, string][] = [
    [STORAGE_KEYS.orders, "green-garden-orders"],
    [STORAGE_KEYS.cart, "green-garden-cart"],
  ];
  for (const [currentKey, legacyKey] of legacyKeys) {
    if (localStorage.getItem(currentKey) === null) {
      const legacyData = localStorage.getItem(legacyKey);
      if (legacyData !== null) localStorage.setItem(currentKey, legacyData);
    }
  }
  if (localStorage.getItem(STORAGE_KEYS.products) === null) {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(seedProducts));
  }
  if (localStorage.getItem(STORAGE_KEYS.categories) === null) {
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(seedCategories));
  }

  const savedUsers = localStorage.getItem(STORAGE_KEYS.users);
  const users = savedUsers === null ? [] : readArray(STORAGE_KEYS.users, isUser);
  const normalizedUsers = users.map((user) =>
    typeof user.address === "string" && user.address.trim().length >= 10
      ? user
      : { ...user, address: "Chưa cập nhật địa chỉ nhận hàng" }
  );
  users.splice(0, users.length, ...normalizedUsers);
  const adminIndex = users.findIndex(
    (user) =>
      user.id === "gg-demo-admin" ||
      user.email.toLowerCase() === "admin@greengarden.com" ||
      user.email.toLowerCase() === DEMO_ADMIN.email
  );
  if (adminIndex >= 0) {
    users[adminIndex] = {
      ...users[adminIndex],
      name: DEMO_ADMIN.name,
      email: DEMO_ADMIN.email,
      phone: DEMO_ADMIN.phone,
      address: DEMO_ADMIN.address,
      password: DEMO_ADMIN.password,
      role: "admin",
      blocked: false,
    };
  } else {
    users.push({
      id: "gg-demo-admin",
      ...DEMO_ADMIN,
      role: "admin",
      blocked: false,
      createdAt: new Date().toISOString(),
    });
  }
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

export function loadProducts(): Product[] {
  return readArray(STORAGE_KEYS.products, isProduct);
}

export function saveProducts(products: Product[]) {
  if (!products.every(isProduct)) throw new Error("Thông tin sản phẩm không hợp lệ.");
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  notifyStoreChange(STORAGE_KEYS.products);
}

export function loadCategories(): string[] {
  return readArray(STORAGE_KEYS.categories, (value): value is string =>
    typeof value === "string" && value.trim().length > 0
  );
}

export function saveCategories(categories: string[]) {
  const normalized = categories.map((category) => category.trim());
  if (normalized.some((category) => !category)) {
    throw new Error("Tên danh mục không được để trống.");
  }
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify([...new Set(normalized)]));
  notifyStoreChange(STORAGE_KEYS.categories);
}

export function loadUsers(): StoreUser[] {
  return readArray(STORAGE_KEYS.users, isUser);
}

export function saveUsers(users: StoreUser[]) {
  if (!users.every(isUser)) throw new Error("Thông tin tài khoản không hợp lệ.");
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  notifyStoreChange(STORAGE_KEYS.users);
}

export function getPublicUser(user: StoreUser): PublicUser {
  const publicUser = { ...user };
  delete (publicUser as Partial<StoreUser>).password;
  return publicUser;
}

export function getCurrentUser(): PublicUser | null {
  const currentId = localStorage.getItem(STORAGE_KEYS.currentUser);
  if (!currentId) return null;
  const user = loadUsers().find((item) => item.id === currentId);
  if (!user || user.blocked) {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    return null;
  }
  return getPublicUser(user);
}

export function saveCurrentUser(userId: string) {
  localStorage.setItem(STORAGE_KEYS.currentUser, userId);
  notifyStoreChange("currentUser");
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  notifyStoreChange("currentUser");
}

function subscribeToStore(key: string, callback: () => void) {
  const handleStoreChange = (event: Event) => {
    const changedKey = (event as CustomEvent<{ key?: string }>).detail?.key;
    if (!changedKey || changedKey === key || changedKey === "users") callback();
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === key || event.key === STORAGE_KEYS.users) callback();
  };
  window.addEventListener(STORE_CHANGE_EVENT, handleStoreChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(STORE_CHANGE_EVENT, handleStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useStoreProducts() {
  const [products, setProducts] = useState(loadProducts);
  useEffect(() => subscribeToStore(STORAGE_KEYS.products, () => setProducts(loadProducts())), []);
  return products;
}

export function useStoreCategories() {
  const [categories, setCategories] = useState(loadCategories);
  useEffect(() => subscribeToStore(STORAGE_KEYS.categories, () => setCategories(loadCategories())), []);
  return categories;
}

export function useStoreUsers() {
  const [users, setUsers] = useState(loadUsers);
  useEffect(() => subscribeToStore(STORAGE_KEYS.users, () => setUsers(loadUsers())), []);
  return users;
}
