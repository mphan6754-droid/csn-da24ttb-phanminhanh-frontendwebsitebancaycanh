import { useState, type SubmitEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "./AuthContext";

type AuthMode = "login" | "register";

export function AccountMenu() {
  const { user, signOut } = useAuth();
  const [message, setMessage] = useState("");

  if (!user) {
    return (
      <a
        href="/dang-nhap"
        className="rounded-full border border-[#d7dbd0] px-4 py-2 text-sm font-medium text-[#314c39] transition hover:bg-[#edf0e8]"
      >
        Đăng nhập
      </a>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href="/tai-khoan"
        className="max-w-40 truncate rounded-full border border-[#d7dbd0] px-4 py-2 text-sm font-medium text-[#314c39] hover:bg-[#edf0e8]"
      >
        {user.name}
      </a>
      {user.role === "admin" && (
        <a
          href="/admin"
          className="rounded-full border border-[#d7dbd0] px-4 py-2 text-sm font-medium text-[#314c39] hover:bg-[#edf0e8]"
        >
          Quản trị
        </a>
      )}
      <button
        type="button"
        onClick={() => {
          signOut();
          setMessage("Bạn đã đăng xuất.");
        }}
        className="rounded-full border border-[#d7dbd0] px-4 py-2 text-sm font-medium text-[#314c39] hover:bg-[#edf0e8]"
      >
        Đăng xuất
      </button>
      <span className="sr-only" aria-live="polite">{message}</span>
    </div>
  );
}

export function AuthPage() {
  const { user, signIn, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f2] px-5 py-12 text-[#27352c]">
        <section className="w-full max-w-lg rounded-3xl border border-[#e2e0d7] bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">Green Garden</p>
          <h1 className="mt-3 font-serif text-3xl text-[#263b2d]">Bạn đã đăng nhập</h1>
          <p className="mt-3 text-sm text-[#687168]">{user.name} · {user.email}</p>
          <a href={user.role === "admin" ? "/admin" : "/tai-khoan"} className="mt-6 inline-flex rounded-full bg-[#314c39] px-6 py-3 text-sm font-semibold text-white">
            {user.role === "admin" ? "Mở quản trị" : "Mở tài khoản"}
          </a>
        </section>
      </main>
    );
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    try {
      if (mode === "login") {
        const signedInUser = signIn(email, password);
        const returnTo = new URLSearchParams(window.location.search).get("returnTo");
        const destination = returnTo?.startsWith("/") && !returnTo.startsWith("//")
          ? returnTo
          : signedInUser.role === "admin" ? "/admin" : "/tai-khoan";
        window.location.assign(destination);
        return;
      }

      const name = String(formData.get("name") ?? "").trim();
      const phone = String(formData.get("phone") ?? "").trim();
      const address = String(formData.get("address") ?? "").trim();
      const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
      if (name.length < 2) throw new Error("Họ và tên cần có ít nhất 2 ký tự.");
      if (!/^0(?:3[2-9]|5[25689]|7[06789]|8[1-9]|9[0-46-9])[0-9]{7}$/.test(phone)) {
        throw new Error("Số điện thoại cần là số di động Việt Nam gồm 10 chữ số.");
      }
      if (address.length < 10 || address.split(/\s+/).length < 2) {
        throw new Error("Địa chỉ cần cụ thể, ít nhất 10 ký tự.");
      }
      if (password.length < 9) throw new Error("Mật khẩu cần có ít nhất 9 ký tự.");
      if (password !== passwordConfirm) throw new Error("Mật khẩu xác nhận chưa khớp.");
      register({ name, email, phone, address, password });
      window.location.assign("/tai-khoan");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể xử lý tài khoản.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7f2] px-5 py-12 text-[#27352c]">
      <section className="w-full max-w-md rounded-3xl border border-[#e2e0d7] bg-white p-7 shadow-sm sm:p-8">
        <a href="/" className="text-sm font-semibold text-[#47764f]">← Về cửa hàng</a>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">Green Garden</p>
        <h1 className="mt-2 font-serif text-3xl text-[#263b2d]">{mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}</h1>
        <div className="mt-5 grid grid-cols-2 rounded-full bg-[#f0f1e9] p-1">
          {(["login", "register"] as const).map((nextMode) => (
            <button key={nextMode} type="button" onClick={() => { setMode(nextMode); setMessage(""); setShowPassword(false); }} aria-pressed={mode === nextMode} className={`rounded-full px-3 py-2 text-sm font-semibold ${mode === nextMode ? "bg-[#314c39] text-white" : "text-[#526254]"}`}>
              {nextMode === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === "register" && (
            <>
              <label className="block text-sm font-medium">Họ và tên
                <input name="name" autoComplete="name" required minLength={2} className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3 outline-none focus:border-[#6f866f]" />
              </label>
              <label className="block text-sm font-medium">Số điện thoại
                <input name="phone" type="tel" autoComplete="tel-national" inputMode="numeric" pattern="0(?:3[2-9]|5[25689]|7[06789]|8[1-9]|9[0-46-9])[0-9]{7}" maxLength={10} required className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3 outline-none focus:border-[#6f866f]" />
              </label>
              <label className="block text-sm font-medium">Địa chỉ
                <textarea name="address" autoComplete="street-address" rows={3} minLength={10} required placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3 outline-none focus:border-[#6f866f]" />
              </label>
            </>
          )}
          <label className="block text-sm font-medium">Email
            <input name="email" type="email" autoComplete="email" required className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3 outline-none focus:border-[#6f866f]" />
          </label>
          <label className="block text-sm font-medium">Mật khẩu
            <span className="relative mt-1 block">
              <input id="auth-password" name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "register" ? 9 : undefined} required className="w-full rounded-xl border border-[#deded4] px-3 py-3 pr-12 outline-none focus:border-[#6f866f]" />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                aria-pressed={showPassword}
                aria-controls="auth-password"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#687168] hover:text-[#314c39]"
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </span>
          </label>
          {mode === "register" && (
            <label className="block text-sm font-medium">Xác nhận mật khẩu
              <input name="passwordConfirm" type="password" autoComplete="new-password" minLength={9} required className="mt-1 w-full rounded-xl border border-[#deded4] px-3 py-3 outline-none focus:border-[#6f866f]" />
            </label>
          )}
          {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
          <button type="submit" className="w-full rounded-full bg-[#314c39] px-5 py-3 font-semibold text-white hover:bg-[#243c2c]">
            {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        </form>
        <p className="mt-3 text-xs leading-5 text-[#85887e]">Tài khoản và mật khẩu demo chỉ được lưu trên trình duyệt này; đây không phải xác thực bảo mật thực tế.</p>
      </section>
    </main>
  );
}
