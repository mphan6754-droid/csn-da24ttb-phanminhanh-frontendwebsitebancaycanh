import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  clearCurrentUser,
  getCurrentUser,
  getPublicUser,
  loadUsers,
  saveCurrentUser,
  saveUsers,
  type PublicUser,
  type StoreUser,
} from "./GreenGardenStore";

type AuthContextValue = {
  user: PublicUser | null;
  signIn: (email: string, password: string) => PublicUser;
  register: (details: { name: string; email: string; phone: string; address: string; password: string }) => PublicUser;
  signOut: () => void;
  updateProfile: (details: { name: string; email: string; phone: string; address: string }) => PublicUser;
  changePassword: (currentPassword: string, newPassword: string) => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validateAccountDetails(details: { name: string; email: string; phone: string; address: string }) {
  if (details.name.trim().length < 2) throw new Error("Họ và tên cần có ít nhất 2 ký tự.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) {
    throw new Error("Email chưa đúng định dạng.");
  }
  if (!/^0(?:3[2-9]|5[25689]|7[06789]|8[1-9]|9[0-46-9])[0-9]{7}$/.test(details.phone.trim())) {
    throw new Error("Số điện thoại cần là số di động Việt Nam gồm 10 chữ số.");
  }
  const address = details.address.trim().replace(/\s+/g, " ");
  if (address.length < 10 || address.split(" ").length < 2) {
    throw new Error("Địa chỉ cần cụ thể, ít nhất 10 ký tự.");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(getCurrentUser);
  const refresh = useCallback(() => setUser(getCurrentUser()), []);

  useEffect(() => {
    window.addEventListener("storage", refresh);
    window.addEventListener("green-garden-store-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("green-garden-store-change", refresh);
    };
  }, [refresh]);

  const signIn = (email: string, password: string) => {
    const normalizedEmail = normalizeEmail(email);
    const users = loadUsers();
    let account = users.find((item) => item.email.toLowerCase() === normalizedEmail);

    if (
      normalizedEmail === "admin@greengarden" &&
      password === "greengarden123!"
    ) {
      if (!account) {
        account = {
          id: "gg-demo-admin",
          name: "Quản trị viên Green Garden",
          email: "admin@greengarden",
          phone: "0900000000",
          address: "Green Garden, Việt Nam",
          password,
          role: "admin",
          blocked: false,
          createdAt: new Date().toISOString(),
        };
        saveUsers([...users, account]);
      } else if (
        account.password !== password ||
        account.role !== "admin" ||
        account.blocked
      ) {
        account = {
          ...account,
          password,
          role: "admin",
          blocked: false,
        };
        saveUsers(users.map((item) => item.id === account?.id ? account : item));
      }
    }

    if (!account || account.password !== password) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }
    if (account.blocked) throw new Error("Tài khoản đã bị khóa. Vui lòng liên hệ cửa hàng.");
    saveCurrentUser(account.id);
    const publicUser = getPublicUser(account);
    setUser(publicUser);
    return publicUser;
  };

  const register = (details: { name: string; email: string; phone: string; address: string; password: string }) => {
    validateAccountDetails(details);
    if (details.password.length < 9) throw new Error("Mật khẩu cần có ít nhất 9 ký tự.");
    const users = loadUsers();
    const email = normalizeEmail(details.email);
    if (users.some((account) => account.email.toLowerCase() === email)) {
      throw new Error("Email này đã được đăng ký.");
    }
    const account: StoreUser = {
      ...details,
      email,
      address: details.address.trim().replace(/\s+/g, " "),
      id: `gg-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role: "user",
      blocked: false,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, account]);
    saveCurrentUser(account.id);
    const publicUser = getPublicUser(account);
    setUser(publicUser);
    return publicUser;
  };

  const signOut = () => {
    clearCurrentUser();
    setUser(null);
  };

  const updateProfile = (details: { name: string; email: string; phone: string; address: string }) => {
    if (!user) throw new Error("Vui lòng đăng nhập để cập nhật tài khoản.");
    validateAccountDetails(details);
    const users = loadUsers();
    const email = normalizeEmail(details.email);
    if (users.some((account) => account.id !== user.id && account.email.toLowerCase() === email)) {
      throw new Error("Email này đã được sử dụng bởi tài khoản khác.");
    }
    const updatedUsers = users.map((account) =>
      account.id === user.id ? { ...account, ...details, email } : account
    );
    saveUsers(updatedUsers);
    const updatedUser = updatedUsers.find((account) => account.id === user.id);
    if (!updatedUser) throw new Error("Không tìm thấy tài khoản hiện tại.");
    const publicUser = getPublicUser(updatedUser);
    setUser(publicUser);
    return publicUser;
  };

  const changePassword = (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("Vui lòng đăng nhập để đổi mật khẩu.");
    const users = loadUsers();
    const account = users.find((item) => item.id === user.id);
    if (!account || account.password !== currentPassword) {
      throw new Error("Mật khẩu hiện tại không chính xác.");
    }
    if (newPassword.length < 9) throw new Error("Mật khẩu mới cần ít nhất 9 ký tự.");
    saveUsers(users.map((item) => item.id === user.id ? { ...item, password: newPassword } : item));
  };

  return (
    <AuthContext.Provider value={{ user, signIn, register, signOut, updateProfile, changePassword, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth phải được dùng bên trong AuthProvider.");
  return auth;
}
